---
title: Confluence Publisher — Wipe Purges Trash (Follow-up)
aliases: [Wipe Purge Spec, Confluence Wipe Purge]
type: spec
tags: [internal, spec, tooling, confluence-publisher]
---

# Confluence Publisher — Wipe Purges Trash

Status: **Draft — ready for implementation**
Owner: TBD
Last revised: 2026-05-27
Parent spec: [spec-confluence-publisher.md](./spec-confluence-publisher.md)

## 1. Problem

`npm run publish -- --wipe --confirm` is intended as a clean-slate reset
for the Confluence tree: every descendant of `CONFLUENCE_PARENT_ID` is
deleted so the next publish can recreate a fresh structure.

It does not do that. `api.deletePage` issues
`DELETE /api/v2/pages/{id}`, which Confluence treats as a **soft delete**:
the page is moved to the space's Trash. Pages in trash retain their title.
On the subsequent fresh publish:

1. `createPage` is called for each source file with an empty
   `confluence-page-id`.
2. Confluence's v2 endpoint, when handed a title that matches a trashed
   page, returns the trashed page's ID (or otherwise links the new
   request to it). The publisher persists that ID into the frontmatter.
3. Body updates (`PUT /api/v2/pages/{id}`) succeed against the
   trashed page (in some cases restoring it). But the legacy attachment
   endpoint (`PUT /rest/api/content/{id}/child/attachment`) correctly
   refuses with `404 trashed`. Images silently fail.
4. The `parentId` passed at create time is ignored — the resurrected
   pages keep whatever parent they had before they were trashed. The
   carefully built `Background/ / Levels/ / Role Profiles/` folder
   structure ends up flat under the root.

Net effect: `--wipe` is unsafe to use without manually purging the
Trash in the Confluence UI afterwards. Worth fixing because:

- We want git to be the unambiguous source of truth. Hidden state
  (the trash) defeats that premise.
- A future engineer running `--wipe --confirm` and trusting the flag
  will reproduce the exact mess we just spent a session unwinding.

## 2. Goals

- After `--wipe --confirm` completes, no descendant of
  `CONFLUENCE_PARENT_ID` exists in the space, **including in trash**.
- A subsequent `npm run publish` against the same parent recreates the
  tree from scratch without any title-collision, attachment-404, or
  reparenting anomaly.
- The behavior is observable from the CLI: the wipe step reports both
  the soft-delete count and the purge count.

## 3. Non-goals

- Purging trash that wasn't created by this tool (e.g. manually-deleted
  pages, pages from other workflows). The wipe operation is scoped to
  the descendants of `CONFLUENCE_PARENT_ID` it found at the time of
  the soft delete.
- Adding a separate `--purge-trash` subcommand. Trash purging is an
  internal step of `--wipe`, not a user-facing operation.

## 4. Atlassian API surface

Two paths exist; we should prefer the v2 one if it works.

### Option A — v2 purge flag

`DELETE /api/v2/pages/{id}?purge=true`

Per Atlassian's REST v2 documentation, calling `DELETE` with
`purge=true` on a page that is **already in trash** permanently
removes it. Calling `DELETE` with `purge=true` on a *current* page
fails. So the natural flow is two-step:

1. `DELETE /api/v2/pages/{id}` — move to trash (current behavior).
2. `DELETE /api/v2/pages/{id}?purge=true` — permanently remove from trash.

### Option B — Legacy REST trash endpoint

`DELETE /rest/api/content/{id}?status=trashed` is the older API used by
some clients. It works against pages whose status is `trashed`.

**Recommendation:** Option A. The publisher already uses `/api/v2/`
exclusively for content operations; sticking to v2 keeps the API
client cohesive.

## 5. Design

### 5.1 `ConfluenceApi.deletePage`

No change to the existing method. It remains a soft delete:

```ts
async deletePage(pageId: string): Promise<void> {
  await this.request<void>('DELETE', `/api/v2/pages/${pageId}`);
}
```

This is still useful on its own (e.g. for the archive flow, where we
*want* the page to stay in trash so it can be restored manually).

### 5.2 New `ConfluenceApi.purgePage`

```ts
/** Permanently delete a trashed page. Page must already be in trash. */
async purgePage(pageId: string): Promise<void> {
  await this.request<void>('DELETE', `/api/v2/pages/${pageId}?purge=true`);
}
```

### 5.3 Updated `ConfluenceApi.wipeDescendants`

Replace the existing implementation with a two-pass delete + purge:

```ts
/** Delete + purge all descendants of a page (for --wipe). */
async wipeDescendants(parentId: string): Promise<{ deleted: number; purged: number }> {
  const descendants = await this.getDescendants(parentId);
  // Leaf-first ordering: children before parents.
  descendants.reverse();

  let deleted = 0;
  let purged = 0;

  // Pass 1: soft-delete (moves to trash).
  for (const page of descendants) {
    await this.deletePage(page.id);
    deleted++;
  }

  // Pass 2: purge from trash.
  // Same ID list — we just trashed them, so they're all in trash now.
  for (const page of descendants) {
    try {
      await this.purgePage(page.id);
      purged++;
    } catch (err) {
      // Tolerate per-page purge failures: log and continue.
      // The page is at least in trash; manual purge is the fallback.
      console.warn(`  warning: failed to purge ${page.id} (${page.title}): ${(err as Error).message}`);
    }
  }

  return { deleted, purged };
}
```

### 5.4 Updated `orchestrator.wipeAll`

```ts
export async function wipeAll(config: Config, confirm: boolean): Promise<void> {
  if (!confirm) {
    console.error('error: --wipe requires --confirm flag to actually delete pages.');
    process.exit(2);
  }

  const api = new ConfluenceApi(config);
  console.log(`Wiping all descendants of page ${config.confluenceParentId}...`);
  const { deleted, purged } = await api.wipeDescendants(config.confluenceParentId);
  console.log(`Deleted ${deleted} page(s) (moved to trash).`);
  console.log(`Purged ${purged} page(s) (permanently removed).`);
  if (purged < deleted) {
    console.log(
      `\nWarning: ${deleted - purged} page(s) remained in trash after purge attempts. ` +
      `Manually purge them in Confluence (Space settings → Content tools → Trash) ` +
      `before running a fresh publish, otherwise title-collision may occur.`
    );
  }
}
```

## 6. Test plan

- Unit: mock `request` and assert that `wipeDescendants` issues two
  `DELETE` calls per page (one without `?purge=true`, one with), in
  the right order.
- Manual against staging:
  1. Populate a small tree of test pages under a sandbox parent.
  2. Run `--wipe --confirm`. Confirm space and trash are empty.
  3. Run a fresh publish. Confirm no `400 BAD_REQUEST` title-collision,
     no `404 trashed` attachment warnings, and folder/leaf structure
     correct.

## 7. Migration / rollout

- No frontmatter or repo migration required.
- Worth deploying together with the create-fallback spec
  ([spec-confluence-create-fallback.md](./spec-confluence-create-fallback.md))
  since both harden the create path against trash interference, but
  they're independent and can land separately.

## 8. Open questions

- Does Atlassian rate-limit deletes / purges? Two DELETE calls per page
  doubles request volume during a wipe; for a 30-page tree this is
  negligible, but worth noting if the tree grows.
- Is there a single-call "delete and purge" endpoint we missed? Worth
  ten minutes in the Atlassian docs before implementation.
