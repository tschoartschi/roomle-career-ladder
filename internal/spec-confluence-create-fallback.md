---
title: Confluence Publisher — Create-Page Title-Collision Fallback (Follow-up)
aliases: [Create Fallback Spec, Confluence Create Fallback]
type: spec
tags: [internal, spec, tooling, confluence-publisher]
---

# Confluence Publisher — Create-Page Title-Collision Fallback

Status: **Draft — ready for implementation**
Owner: TBD
Last revised: 2026-05-27
Parent spec: [spec-confluence-publisher.md](./spec-confluence-publisher.md)

## 1. Problem

When a source file has `confluence-page-id: ''`, the publisher calls
`api.createPage` to create a fresh Confluence page. If a page with the
same title already exists in the space — whether under
`CONFLUENCE_PARENT_ID` or anywhere else — Confluence returns:

```
400 BAD_REQUEST: A page already exists with the same TITLE in this space
```

The publisher currently lets this bubble up. The whole run aborts at
the offending file. Any pages created earlier in the run keep their
IDs locally (if it was a local run) or lose them (if it was CI without
a successful auto-commit-back). The result is partial state and a
human cleanup.

The pre-push hook and CI guard added alongside this spec make the
empty-ID case very rare in practice — they refuse pushes that contain
empty page IDs in `docs/**`. But "rare" is not "never":

- A previous failed partial publish in CI can leave Confluence pages
  whose IDs were never written back.
- A page can be manually created in the Confluence UI with a title
  matching a future doc.
- A future workflow change (e.g. adding `--no-verify` for an emergency
  push) could re-open this hole.

The publisher should self-heal when this happens, rather than failing
loudly and requiring manual cleanup.

## 2. Goals

- When `createPage` returns `400` with a title-collision message:
  1. Look for a page with that title **under our publish tree**
     (`CONFLUENCE_PARENT_ID`).
  2. If found, adopt its ID. Persist it into the source file's
     frontmatter exactly as a fresh create would.
  3. The current publish run continues with `updatePage` on the
     adopted ID.
- When the colliding title is found **outside** our publish tree
  (elsewhere in the space), hard-fail with a clear error message that
  names the conflicting page's URL and tells the user how to resolve.
- Logging makes the recovery visible: not silent, not noisy.

## 3. Non-goals

- Renaming a colliding page automatically. Silent renames are
  confusing and undermine git-as-source-of-truth.
- Cross-space lookup. We operate in one space (`CONFLUENCE_SPACE_KEY`).
- Adoption of pages that are **trashed**. If the colliding page is in
  trash, the right answer is to purge it (covered by
  [spec-confluence-wipe-purge.md](./spec-confluence-wipe-purge.md))
  and try again. We surface this case as a distinct error.

## 4. Atlassian API surface

We need a way to find a page by title within the publish subtree. Two
options:

### Option A — Walk descendants

We already have `api.getDescendants(parentId)` (used by `wipeAll`). It
performs a BFS via `getChildren` and returns a flat array of
`ConfluencePage` with `id`, `title`, and `parentId`. Match locally on
`title`. No new endpoint required.

For a tree of ~50 published pages this is one round-trip per parent
level (so 3–4 in our shape). Acceptable.

### Option B — CQL / search endpoint

`GET /rest/api/content/search?cql=space=KEY AND title="…" AND type=page`
returns matching pages with their `ancestors`. We can then check
whether `CONFLUENCE_PARENT_ID` is in the ancestor chain.

Faster on very large spaces, but introduces dependence on CQL (a
distinct API surface) and the parsing of ancestor lists.

**Recommendation:** Option A. Reuses existing code, predictable
behavior, scales fine for any realistic ladder size. If the tree
ever grows past ~500 pages, revisit.

## 5. Design

### 5.1 Detect a title-collision response

`api.request` already throws on non-2xx, including 400. We need to
preserve enough information for the caller to detect *which kind* of
400 this was.

Introduce a typed error:

```ts
export class TitleCollisionError extends Error {
  constructor(public title: string, public spaceKey: string) {
    super(`A page already exists with title "${title}" in space ${spaceKey}.`);
    this.name = 'TitleCollisionError';
  }
}
```

In `api.createPage`, detect the specific error message in the response
body and throw `TitleCollisionError` instead of the generic
`Error`. (Pattern-match on `"A page already exists with the same TITLE"`
in the response payload; if the message string changes, fall back to
the generic error and a clear "create failed" log.)

### 5.2 Adopt existing page in the orchestrator

In `orchestrator.publish`, around the existing `createPage` call (Pass 1):

```ts
let createdId: string | undefined;
try {
  const result = await api.createPage({ title, parentId, adfBody, spaceId });
  createdId = result.id;
} catch (err) {
  if (!(err instanceof TitleCollisionError)) throw err;

  // Search our publish subtree for the existing page.
  const descendants = await api.getDescendants(config.confluenceParentId);
  const adoptable = descendants.find(p => p.title === file.title);

  if (adoptable) {
    console.log(
      `  adopt: "${file.title}" already exists in publish tree (${adoptable.id}); ` +
      `reusing instead of creating`
    );
    createdId = adoptable.id;
  } else {
    // The page exists in the space but outside our parent tree.
    // Hard-fail with a clear remediation message.
    const url = `${config.confluenceBaseUrl}/wiki/spaces/${config.confluenceSpaceKey}`;
    throw new Error(
      `Cannot create "${file.title}": a page with that title already exists ` +
      `in space "${config.confluenceSpaceKey}" but outside the publish tree ` +
      `(${config.confluenceParentId}).\n\n` +
      `Resolve by either:\n` +
      `  - Renaming or deleting the conflicting page in Confluence (see ${url}), or\n` +
      `  - Changing the 'title' in ${file.relPath}'s frontmatter.\n\n` +
      `If the conflicting page is in Trash, purge it first ` +
      `(Space settings → Content tools → Trash).`
    );
  }
}

file.frontmatter['confluence-page-id'] = createdId!;
await persistPageId(file.absPath, createdId!);
```

### 5.3 Pass 2 continues normally

Once the ID is persisted, the existing Pass 2 (attachment upload +
`updatePage` with proper `parentId` + labels) runs unchanged. The
update will reparent the adopted page into the correct folder.

### 5.4 Idempotent on repeat

If the same situation recurs on the next run, the file now has a
populated `confluence-page-id`, so Pass 1 skips it entirely. The
adoption logic only ever runs once per page.

## 6. Test plan

- Unit: mock `api.createPage` to throw `TitleCollisionError`, mock
  `api.getDescendants` to return a page with the matching title;
  assert orchestrator adopts the ID and calls `persistPageId`.
- Unit: same setup but no matching descendant; assert orchestrator
  throws with the "outside the publish tree" remediation message.
- Manual against staging:
  1. Create a page manually in Confluence with title matching a
     test doc, **inside** the parent tree → expect adoption.
  2. Same but **outside** the parent tree → expect hard fail with
     the remediation message.
  3. Trashed page with matching title → expect the same hard-fail
     class with the trash-specific hint.

## 7. Migration / rollout

- No frontmatter changes.
- Safe to ship independently of the wipe-purge spec. The two together
  make the publisher robust against the most common Confluence
  weirdness.

## 8. Open questions

- The exact error string from the v2 API. The current observed message
  is `"A page already exists with the same TITLE in this space"`.
  Confirm this is stable across Confluence Cloud versions, or
  pattern-match on the HTTP 400 + a tolerant substring (e.g. the word
  `"TITLE"`).
- Should adoption emit a warning instead of an info log? Adoption is
  unexpected (the pre-push hook + CI guard should prevent it), so a
  louder log makes sense. Suggest `console.warn` with a "this is a
  self-heal; investigate why the page ID was missing" hint.
