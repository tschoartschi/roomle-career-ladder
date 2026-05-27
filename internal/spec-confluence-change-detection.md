---
title: Confluence Publisher — Change Detection (Follow-up)
aliases: [Change Detection Spec, Confluence Change Detection]
type: spec
tags: [internal, spec, tooling, confluence-publisher]
---

# Confluence Publisher — Change Detection

Status: **Draft — ready for implementation**
Owner: TBD
Last revised: 2026-05-27
Parent spec: [spec-confluence-publisher.md](./spec-confluence-publisher.md)

## 1. Problem

The publisher's `updatePage` step runs unconditionally for every
discovered file. Every `npm run publish` (and therefore every
`npm run deploy`) produces a new page version in Confluence even when
the source content is byte-identical to the previous publish.

For a 26-page tree, a single content edit becomes:

- 1 page with a real change → version N → N+1 (legitimate)
- 25 pages with no change → version N → N+1 each (noise)

This is safe (the publisher's own spec, §1, lists change detection as
future work), but it has three real costs:

1. **Version history noise.** Confluence's page history becomes
   useless as an audit trail of "what changed when". Every publish
   looks like a full rewrite.
2. **API volume.** Roughly 26× the necessary `updatePage` and label
   round-trips per publish.
3. **Notification noise.** If anyone has watch-subscribed to pages,
   each publish triggers an "updated" notification per page.

Cost (1) is the practical one for a 30-person company watching a
career ladder. Costs (2) and (3) are minor at current scale but
compound if the ladder grows or this tooling gets reused for a
larger doc surface.

## 2. Goals

- Skip the `updatePage` call when the rendered ADF for a page is
  identical to what's already published.
- Maintain identical behavior in every other dimension: folder
  creation, attachments, labels, reordering, archiving.
- The skip is observable: log "unchanged: <relpath>" for skipped
  pages and "updated: <relpath> (vN)" for updated ones.
- No new external storage. The signal lives in Confluence itself
  (or in the source file).

## 3. Non-goals

- Skipping the **discovery / convert** passes. The Markdown→ADF
  conversion is fast and must run anyway to compute the comparison
  signal. We only skip the API write.
- Skipping **attachment** uploads. Attachments already have their own
  hash-based skip via `existing.comment === hash` (in
  `uploadImagesForPage`). That logic stays.
- Skipping **labels** or **reorder** passes. Both are idempotent and
  cheap; leave them as-is to avoid drift if someone mutated labels in
  the UI.
- Detecting changes against git history (diffing markdown source).
  We want to compare against what's actually published in
  Confluence, not against an assumed prior state.

## 4. Where to store the signal

We need a stable hash of "what was last published for this page".
Three options:

### Option A — In the source file's frontmatter

Add `confluence-content-hash: '<hex>'` next to `confluence-page-id`.
The publisher computes the hash of the converted ADF (or the
canonical source markdown), compares to the stored value, and
updates only on mismatch. On a successful update, write the new hash
back.

- Pros: All publisher state lives in one place (the source file).
  Easy to inspect with `git diff`.
- Cons: Every content change produces a frontmatter churn alongside
  the body change. Slightly noisy in commits. **Couples the source
  tree to publish state in a way the per-page-id field doesn't —
  the page-id is identity, a content hash is *cache*.**

### Option B — In the Confluence page's `version.message` field

`updatePage` accepts a `message` parameter on the version object. Set
it to the source-content hash. On the next run, `getPage(pageId)`
returns the current `version.message`; compare and skip if equal.

- Pros: Source files unchanged. The signal lives next to the artifact
  it describes (the published version). Confluence handles the
  storage.
- Cons: Requires `getPage` per file (which we already call to read
  the current version number — no extra request). Susceptible to
  someone editing the page in the UI (which would reset `message` —
  in fact that's *desirable*: a UI edit shouldn't be overwritten by
  a no-op publish, but it also shouldn't be invisible to us; the
  hash mismatch would trigger an update, which is what we want).

### Option C — In the page's `properties` (key-value store)

`POST /api/v2/pages/{id}/properties` lets us attach arbitrary
key-value data. We could store `roomle-content-hash`.

- Pros: Most "correct" from a Confluence-modeling standpoint.
- Cons: Extra API surface area, extra round-trips, marginal gain
  over Option B.

**Recommendation:** Option B. Lowest surface area, no new storage,
no frontmatter churn, and `getPage` is already on the hot path.

## 5. What to hash

The hash must capture exactly what determines the published output.
Two reasonable choices:

### Choice 1 — Hash the converted ADF JSON

`hash(JSON.stringify(adf))` after `convert(file, ctx)`.

- Pros: Directly compares against the artifact we'd send to
  `updatePage`. If two source files produce identical ADF, we skip —
  which is the correct behavior.
- Cons: Sensitive to any change in the conversion pipeline. Bumping
  the converter (even a no-op refactor that changes output ordering)
  invalidates every hash and forces a full republish on next run.
  That's actually fine — it surfaces converter changes in the version
  history, which is honest.

### Choice 2 — Hash the source markdown + frontmatter (excluding the cache fields)

- Pros: Stable across converter refactors.
- Cons: Misses cases where converter behavior changes meaningfully
  but source hasn't. Risks publishing stale ADF.

**Recommendation:** Choice 1. Be honest about what determines the
published output.

Also include `file.title` in the hash input — title is passed to
`updatePage` separately from the body and a title-only change
should trigger a publish.

```ts
function computeContentHash(adf: AdfDoc, title: string): string {
  return createHash('sha256')
    .update(title)
    .update('\0')
    .update(JSON.stringify(adf))
    .digest('hex');
}
```

## 6. Design

### 6.1 Convert always; compare hash before update

In `orchestrator.publish`, Pass 2, for each file:

```ts
const attachmentMap = await uploadImagesForPage(api, file, docsDir, pageId, verbose);
const ctx: ConvertContext = { …, attachmentMap };
const adf = convert(file, ctx);
allWarnings.push(...ctx.warnings);

const adfJson = JSON.stringify(adf);
const contentHash = computeContentHash(adf, file.title);

const current = await api.getPage(pageId);
const previousHash = current.version?.message ?? '';

const fileDir = file.relPath.includes('/') ? file.relPath.slice(0, file.relPath.lastIndexOf('/')) : '';
const parentId = folderIdMap.get(fileDir) ?? config.confluenceParentId;

// Skip update if hash matches AND the parent is already correct.
const parentUnchanged = (current.parentId ?? config.confluenceParentId) === parentId;
if (previousHash === contentHash && parentUnchanged) {
  console.log(`  unchanged: ${file.relPath} (v${current.version?.number})`);
} else {
  const nextVersion = (current.version?.number ?? 0) + 1;
  const result = await api.updatePage(pageId, {
    title: file.title,
    adfBody: adfJson,
    version: nextVersion,
    parentId,
    message: contentHash,    // ← stash the hash for next run
  });
  console.log(`  updated:   ${file.relPath} (v${result.version?.number})`);
}
```

### 6.2 Parent change forces update

If a doc moves between directories (`docs/role-profiles/foo.md` →
`docs/levels/foo.md`), the rendered ADF may be identical but the
target parent in Confluence changes. The condition `parentUnchanged`
catches that case. (The current `updatePage` already passes
`parentId`, which moves the page.)

### 6.3 First run after rollout

On the first run after this change ships, no page has a stored hash
yet (`version.message` is empty for existing pages). Every page will
hash-mismatch and update once. From then on, only changed pages
update. This is the expected one-time cost.

### 6.4 `ConfluenceApi.updatePage` change

Add `message?: string` to the existing options object. Pass it
through to the underlying request body. Confluence's v2 API accepts
`version.message` on updates.

### 6.5 `ConfluenceApi.getPage` change

Confirm the response shape includes `version.message`. The v2 API
returns it; the existing type declaration may need a field added:

```ts
export interface ConfluencePage {
  id: string;
  title: string;
  parentId?: string;
  version?: { number: number; message?: string };
  _links?: { webui?: string };
  // …
}
```

## 7. Test plan

- Unit: mock `api.getPage` to return a page with `version.message`
  equal to the computed hash → assert orchestrator does NOT call
  `updatePage`.
- Unit: same but with mismatched hash → assert `updatePage` is called
  with `message` set to the new hash.
- Unit: hash matches but `parentId` differs → assert `updatePage` is
  called (covering moves).
- Manual against staging:
  1. Publish a clean tree.
  2. Publish again without changes → log shows all "unchanged".
  3. Edit one source file's body → next publish updates exactly that
     one page.
  4. Move a source file between directories → next publish updates
     exactly that page (re-parent).
  5. Verify Confluence page history: only one new version per real
     edit, not 26.

## 8. Migration / rollout

- No frontmatter migration.
- One-time "everything updates once" effect on first run. Communicate
  this in the commit message.
- Independent of the wipe-purge and create-fallback specs; can land in
  any order.

## 9. Open questions

- Does the v2 API actually return `version.message` on `getPage`? If
  it's elided from the read shape, fall back to Option A
  (frontmatter cache) or Option C (page properties). A 30-minute
  spike against staging would confirm.
- For pages that were created in a previous run but whose `message`
  was never set, the comparison correctly resolves to "mismatch →
  update" — but the first-run noise is unavoidable. Acceptable.
- Should the skip also gate label diffing? Currently labels are
  re-checked every run. Cost is one `getLabels` call per page; not
  worth complicating logic to skip.
