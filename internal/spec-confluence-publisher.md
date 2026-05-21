---
title: Confluence Publisher — Specification
aliases: [Confluence Publisher Spec, Publisher Spec]
type: reference
tags: [internal, spec, tooling]
---

# Confluence Publisher — Specification

Status: **Draft for implementation handoff**
Owner: TBD
Last revised: 2026-05-21

## 1. Background and goals

The career-ladder repository (`docs/`) is the source of truth for content that
is mirrored to a Confluence Cloud space (`careerladder`) so non-engineers can
read and comment.

We currently use the third-party CLI
[`@markdown-confluence/cli`](https://www.npmjs.com/package/@markdown-confluence/cli)
plus a Markdown→wikilink preprocessor and a connie-page-id sync helper. The
combination works but the CLI has surprising behaviors (renders standard
markdown internal links as `<a href="#">`, no control over folder-page
naming, scrambles tree order on every publish, ~2 k weekly downloads = low
bus factor). A spike (see `spike/`) confirmed that a focused in-house
Markdown→ADF publisher targeting the small content surface we actually use
is viable and removes the workarounds in one move.

### Goals

- Replace the CLI + preprocessor + sync helper with a single in-house tool.
- Publish 100% of the content we use today, faithfully: headings, paragraphs,
  bulleted and numbered lists, tables, blockquotes, fenced and inline code,
  bold/italic/strikethrough, internal and external links, em-dashes / arrows.
- Resolve internal links between published pages to real Confluence page
  references (no `href="#"`).
- Own page ordering (alphabetical, with prefixes already in titles).
- Make folder pages predictable: auto-generated with a deterministic
  prettifier from the directory name.
- Auto-archive pages whose source file is removed from git.
- Run identically on a developer laptop and in GitHub Actions.

### Non-goals (initial release)

- Image upload / attachment handling — fail gracefully with `unsupported: image`.
- Confluence macros (info panels, expand blocks, ToC) — same: log and skip.
- Mermaid / diagram rendering — same.
- Mentions (`@user`) — same.
- Change detection (publish only modified files) — see §13 Future work.
- Multiple Spaces in one run.

## 2. High-level design

A single Node.js (JavaScript with JSDoc) program, invoked as one command
with flags. No build step. The flow:

1. **Discover** every `*.md` in `docs/` with frontmatter
   `confluence-publish: true` (plus auto-detected folder pages — see §6).
2. **Convert** each file's body to ADF JSON. Links to other published files
   are resolved to that file's Confluence page URL; Confluence's storage-format
   renderer then auto-converts the URL into a native page reference.
3. **Publish** in two stages:
   1. Create or update each page via the Confluence v2 REST API.
   2. After all pages are settled, reorder children of every parent.
4. **Persist** any newly assigned page IDs back into the source files'
   frontmatter so subsequent runs update in place.
5. **Archive** any Confluence pages whose corresponding source file no
   longer exists.

Hard-fail on the first error, exit non-zero.

## 3. Inputs

### 3.1 Source tree

Authoritative source: everything under `docs/`. Anything outside
`docs/` is ignored. Files with no frontmatter or with
`confluence-publish: false` (or missing) are ignored.

Folder layout convention (already established in this repo):

```
docs/
├── 00 Overview.md
├── axes.md
├── levels/
│   ├── 01 Junior.md … 99 Leitung.md
├── background/
│   ├── company-profile.md
│   ├── engineering-context.md
│   ├── wip.md
│   └── boundaries/
│       └── 01 … 05 boundary docs
└── role-profiles/
    ├── ai-tooling.md
    └── web-frontend.md
```

### 3.2 Frontmatter schema (per source file)

```yaml
---
title: <human-readable title — informational, not used by publisher>
confluence-publish: true | false       # required to publish; default false
confluence-page-id: '<numeric id>'     # auto-managed by publisher; do not edit
tags: [array, of, strings]             # mapped 1:1 to Confluence labels
# any other YAML fields are ignored
---
```

Fields the publisher reads:
- `confluence-publish` (bool) — gate
- `confluence-page-id` (string) — for update-in-place
- `tags` (string array) — each becomes a Confluence label

Fields the publisher writes back:
- `confluence-page-id` — after a successful create, the new page ID is
  added to the source file's frontmatter so the next run updates instead
  of creating a duplicate.

All other frontmatter fields (`title`, `aliases`, `type`, etc.) are
preserved verbatim.

### 3.3 Environment variables

| Name | Purpose |
|---|---|
| `CONFLUENCE_BASE_URL` | Bare domain, e.g. `https://roomle.atlassian.net`. No `/wiki` suffix. |
| `CONFLUENCE_PARENT_ID` | Numeric page ID under which all content lives. |
| `CONFLUENCE_SPACE_KEY` | e.g. `careerladder`. Used for URL composition and label namespace. |
| `CONFLUENCE_ARCHIVE_PARENT_ID` | Numeric page ID of the dedicated "Archive" page. See §6.4. |
| `ATLASSIAN_USER_NAME` | Atlassian account email. |
| `ATLASSIAN_API_TOKEN` | API token from id.atlassian.com. |

In local dev these come from `.env` (gitignored); in CI from GitHub
repository secrets.

## 4. Outputs

- Confluence pages under `CONFLUENCE_PARENT_ID`, one per published source
  file, plus auto-generated folder pages mirroring the directory hierarchy.
- A dedicated "Archive" page (sibling under the same parent) into which
  orphaned pages are moved.
- Every published page carries the Confluence label `auto-published` plus
  whatever was in the source file's `tags:`.
- Updated source files in `docs/` with `confluence-page-id` written back
  for any page that was created in this run. The publisher does NOT commit;
  the calling workflow / human is responsible for committing the diff.

## 5. Command-line interface

Single entry point. JavaScript .mjs, no build step. Invoked as
`node tools/publish.mjs [flags]`.

| Flag | Behavior |
|---|---|
| (no flags) | Discover, convert, publish, reorder, archive orphans, sync page-ids back. |
| `--dry-run` | Convert and resolve everything in memory. Print what would be created / updated / archived. No API mutations. |
| `--wipe` | Delete every page under `CONFLUENCE_PARENT_ID` (children + descendants). Requires `--confirm` flag to actually run. Used for fresh starts. |
| `--reorder-only` | Skip publish; just reorder existing pages by title. |
| `--verbose` | Print full per-page conversion + API output. Default output is one line per page (`SUCCESS: <file> → <url>`). |
| `--continue-on-error` | Reserved for future use; not implemented in v1. Default behavior is hard-fail. |
| `--help` | Usage. |

Exit codes: `0` success; `1` runtime error; `2` invalid arguments / config.

## 6. Mapping rules

### 6.1 Markdown → ADF node mapping

The converter walks the AST produced by a markdown parser (e.g. `marked`).
For each token type:

| Markdown construct | ADF node | Notes |
|---|---|---|
| `# heading` to `###### heading` | `heading` with `attrs.level` 1–6 | `level` clamped to ≤ 6 |
| Paragraph | `paragraph` |  |
| `**bold**` | text node with `marks: [{type: 'strong'}]` |  |
| `*italic*` / `_italic_` | text node with `marks: [{type: 'em'}]` |  |
| `~~strike~~` | text node with `marks: [{type: 'strike'}]` |  |
| `` `code` `` | text node with `marks: [{type: 'code'}]` |  |
| ` ```lang … ``` ` | `codeBlock` with `attrs.language` | Unknown languages still pass through; Confluence renders as plain |
| Blockquote | `blockquote` |  |
| `*` / `-` unordered list | `bulletList` containing `listItem`s | Items wrap inline content in a `paragraph` if needed |
| `1.` ordered list | `orderedList` |  |
| Tables (GFM) | `table` → `tableRow` → `tableHeader` / `tableCell` | Cell content wrapped in `paragraph`; inline marks preserved |
| `---` rule | `rule` |  |
| `<br>` / two-space line break | `hardBreak` |  |
| `[text](url)` external | text node with `marks: [{type: 'link', attrs: {href: url}}]` |  |
| `[text](other.md)` internal | text node with `marks: [{type: 'link', attrs: {href: <confluence-page-url>}}]` — see §6.2 |  |
| `[[name]]` / `[[name|text]]` wikilink | Resolved same as internal markdown link |  |
| Image (`![alt](src)`) | **Unsupported**: log `unsupported: image at <file>:<line>`, skip |  |
| Raw HTML | Stripped silently. Document this in the README so authors don't expect it to work. |  |

### 6.2 Internal link resolution

When converting a link whose href ends in `.md` or is a wikilink:

1. Resolve the target file path (relative paths supported; wikilinks
   resolved by basename match across all of `docs/`).
2. Look up the target's `confluence-page-id` from its frontmatter.
3. If found, emit the href as
   `${CONFLUENCE_BASE_URL}/wiki/spaces/${CONFLUENCE_SPACE_KEY}/pages/${ID}/`.
   Confluence's storage-format renderer automatically converts this URL
   into a native `<ac:link><ri:page>` reference.
4. If the target file exists but does NOT have `confluence-publish: true`
   in its frontmatter, **hard-fail** with:
   `error: <source>:<line> links to <target> which is not published`.
5. If the target file does not exist at all, **hard-fail** with:
   `error: <source>:<line> links to missing file <target>`.

Anchor / fragment links (`#section`) are passed through unchanged. Confluence
generates its own heading anchors (slug-based) which may not exactly match
ours; the converter logs a warning the first time it sees a fragment-only
link in a run so authors know to double-check rendering.

### 6.3 Wikilink syntax

The publisher accepts both standard markdown links and Obsidian wikilinks
in source. Both resolve via §6.2.

- `[[other]]` — link text == basename of target
- `[[other|display text]]` — explicit display text
- `[[other#section]]` — with fragment

### 6.4 Folder pages

For every directory under `docs/` that contains at least one published
file (directly or transitively), the publisher auto-creates a parent page.

The page title is derived from the directory name by a smart prettifier:

- Split on `-` (hyphen)
- Capitalise each word's first letter
- Join with single spaces
- Append a trailing `/`

Examples:
- `role-profiles` → `Role Profiles/`
- `boundaries`    → `Boundaries/`
- `levels`        → `Levels/`
- `background`    → `Background/`

Folder pages have empty body (one paragraph with no text) on first
creation. The publisher tracks them by parent-id-and-title; their IDs
are NOT persisted into git (there is no source file for them). On
subsequent runs, the publisher looks them up by title under the
expected parent.

### 6.5 Page ordering

After all pages exist, the publisher fetches each parent's children and
calls `PUT /wiki/api/v2/pages/{id}/move` for each child so the final order
under each parent is **alphabetical by Confluence page title**.

Because file H1s are prefixed (`01`, `02`, …, `99`), alphabetical order
produces the intended sequence in every folder. Folder-page titles
(`Background/`, `Levels/`, …) also sort correctly relative to siblings
(e.g. `Axes` < `Background/` < `Levels/`).

**Top-level note:** the Overview page's H1 should start with `00`
(`# 00 Career Ladder – Overview`) so it sorts first under the root parent.
This is a content convention, not a publisher rule.

### 6.6 Labels

Every published page gets the label `auto-published` applied automatically.
In addition, every entry in the source file's `tags:` frontmatter becomes
a Confluence label.

Labels are diffed on each run: missing labels are added; labels present on
the Confluence page but not in source are NOT removed (so manual labels
applied by humans survive).

### 6.7 Orphan archival

Before exiting, the publisher:

1. Fetches every descendant page under `CONFLUENCE_PARENT_ID`.
2. Collects the set of `confluence-page-id` values referenced in
   any source file's frontmatter.
3. For every Confluence page whose ID is NOT in that set AND is NOT
   the parent page itself AND is NOT the Archive page:
   - Move it under `CONFLUENCE_ARCHIVE_PARENT_ID` via the move endpoint.
   - Log `archived: <title> (was at <former-path>)`.

Folder pages that become empty (no published children) are also archived
in the same pass.

### 6.8 Title

Page title is the file's first H1, verbatim (the markdown stripped of
formatting but otherwise unchanged). The H1 itself is NOT rendered into
the page body — Confluence shows the page title separately from the body.

## 7. Confluence API endpoints

All v2 (`/wiki/api/v2`) unless noted. Basic auth with email + token.

| Operation | Endpoint |
|---|---|
| List children of a page | `GET /pages/{id}/children?limit=250` |
| List descendants of a page | `GET /pages/{id}/descendants?limit=250` (depth limited; recurse manually) |
| Get a page (with version + body) | `GET /pages/{id}?body-format=atlas_doc_format` |
| Create page | `POST /pages` with `{spaceId, status:"current", title, parentId, body: {representation:"atlas_doc_format", value: <JSON string>}}` |
| Update page | `PUT /pages/{id}` with current `version.number + 1` |
| Move page (reorder OR reparent) | `PUT /pages/{id}/move` with `{targetId, position}` — see Atlassian docs for exact body |
| Delete page | `DELETE /pages/{id}` |
| Get page labels | `GET /pages/{id}/labels` |
| Add label | `POST /pages/{id}/labels` with `[{prefix:"global", name:"…"}]` |

ADF bodies are sent as JSON-stringified `value` inside `body`.

## 8. State and persistence

- **`confluence-page-id`** lives in source frontmatter and is the single
  source of identity for an existing Confluence page.
- **Folder page IDs** are not persisted. Folder pages are looked up by
  parent + title on every run.
- **No other state files.** No `.publish-cache`, no JSON manifests on disk.

This is intentional: a fresh clone of the repo, plus env vars, plus one
publish run, should reproduce the Confluence state exactly.

## 9. Error handling

- Hard-fail on first error. Print a clear message including file path
  and (where applicable) line number. Exit non-zero.
- Errors during the *reorder* or *archive* phase exit non-zero too, but
  after the *publish* phase has already committed pages. Document this in
  the README.
- Network errors get one automatic retry with 2-second backoff; after that,
  hard-fail.
- Rate limits (HTTP 429): respect `Retry-After`, wait, retry once. Hard-fail
  after the second 429.

## 10. Workflow integration

The existing `.github/workflows/publish-confluence.yml` is replaced:

- Single step: `node tools/publish.mjs`
- Followed by a step that commits any `confluence-page-id` changes back
  to the repo and pushes (with `[skip ci]`).
- Permissions: `contents: write` on the job.
- Same secrets and variables as today, renamed if needed:
  `CONFLUENCE_BASE_URL`, `CONFLUENCE_PARENT_ID`, `CONFLUENCE_ARCHIVE_PARENT_ID`
  (new), `CONFLUENCE_SPACE_KEY` (new — needed for label scope and URL
  composition), `ATLASSIAN_USER_NAME`, `ATLASSIAN_API_TOKEN`.

Locally, `.env` provides the same vars; run `node tools/publish.mjs`
directly.

## 11. Migration plan

Hard cutover in a single PR:

1. **Author** the new publisher under `tools/publish.mjs` plus any helper
   files in `tools/`.
2. **Migration script** (one-shot, also under `tools/`): walks every
   `docs/**/*.md` and renames `connie-publish` → `confluence-publish`,
   `connie-page-id` → `confluence-page-id` in frontmatter. Run once,
   commit the diff.
3. **Wipe Confluence** under the current parent (use the spike's wipe
   pattern, also exposed via `--wipe --confirm` on the new tool).
4. **Manually create** the dedicated Archive page under the root parent.
   Note its ID. Add `CONFLUENCE_ARCHIVE_PARENT_ID` to GitHub Secrets and
   `.env`.
5. **Rename** the H1 of `docs/00 Overview.md` to start with `00` so it
   sorts first.
6. **Delete** the old scripts:
   `scripts/publish-confluence.sh`,
   `scripts/preprocess-for-confluence.mjs`,
   `scripts/sync-page-ids.mjs`.
7. **Delete** `.markdown-confluence.json` (no longer used).
8. **Update** `.github/workflows/publish-confluence.yml` to call the
   new tool.
9. **Update** `index.md` and `internal/README.md` to reference
   `tools/publish.mjs`.
10. **Push, watch the Action, verify** the rendered output.

The spike folder (`spike/`) can be deleted after the new tool ships.

## 12. Testing

Recommended, not required for v1:

- **Unit tests** for the MD→ADF converter: a handful of
  fixture markdown files paired with their expected ADF JSON. Run with
  `node --test` (built-in). Snapshot tests are fine here.
- **Integration smoke test** in CI: a dry-run pass on every PR that
  reports what would change, gates merge but doesn't push.
- **No live-Confluence tests** — keep the test loop local and offline.

## 13. Future work (explicit, not in v1)

- **Change detection.** Use `git diff` since the last published commit
  (stored in a tag like `confluence-last-published`?) to publish only
  modified files. Avoids ~20 API calls per run when nothing changed.
  Note: doesn't help the first run after a wipe.
- **Image and attachment upload.** Bind image rendering in markdown to
  Confluence attachment upload via `POST /pages/{id}/attachments`.
- **Confluence macros via fenced blocks.** e.g. ` ```confluence-info`
  fences could render as info panels.
- **Parallel uploads.** Currently serial for simplicity; could safely
  parallelise per-folder.
- **Continue-on-error mode** (`--continue-on-error`).
- **Optional banner on published pages** in addition to the label, if the
  label proves insufficient as a "don't edit here" signal.

## 14. Open questions for the implementer

The following are deliberately left to the implementer's judgment.
Document the chosen approach in the tool's README.

1. **Markdown parser choice:** `marked`, `remark`, `markdown-it`. The
   spike used `marked`. All three are viable. `remark` is more extensible
   if we ever want plugins; `marked` is smaller and faster.
2. **Token / AST structure:** flat token stream vs nested mdast tree.
   Affects how `inline` and `block` traversal is written. The spike used
   marked's flat token stream with one nested level for table cells and
   list items.
3. **File layout for the tool:** single `tools/publish.mjs`, or split into
   `tools/lib/convert.mjs`, `tools/lib/api.mjs`, `tools/publish.mjs`?
   Both fine; pick by personal preference and testability.
4. **Wikilink ambiguity:** if two files share a basename (`foo.md` in two
   directories), how to disambiguate `[[foo]]`? Suggested: hard-fail at
   conversion time with a clear message listing both candidates.
   (Currently no collisions in this repo — see audit in §3.1.)
5. **ADF library:** none used in the spike (hand-built JSON). Atlassian
   publishes `@atlaskit/adf-utils` and `@atlaskit/adf-schema` which can
   help validate. Optional dependency.

## 15. Acceptance criteria

The tool is considered done when:

- [ ] All 20 source files in `docs/` publish successfully on a fresh run.
- [ ] Cross-page links in the rendered Confluence output resolve to real
      pages (no `<a href="#">`).
- [ ] Page tree order matches alphabetical-by-title under every parent
      after a publish run.
- [ ] Removing a published file from `docs/` and re-running moves the
      Confluence page under the Archive parent (verified on at least one
      file).
- [ ] A `dry-run` produces zero API mutations.
- [ ] CI's publish step succeeds end-to-end on the existing
      `.github/workflows/publish-confluence.yml` (rewritten per §10).
- [ ] The README explains: install, env vars, common commands, what
      auto-archival does, how to recover an archived page.
- [ ] The old scripts and `.markdown-confluence.json` are gone from the
      repo.
