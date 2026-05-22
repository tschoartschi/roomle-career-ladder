# Confluence Publisher

Publishes `docs/` to Confluence Cloud as the source of truth. Replaces the old `@markdown-confluence/cli` + preprocessor setup with a single in-house tool.

## Prerequisites

- Node.js 22+
- A `.env` file (copy from `.env.example`) or environment variables set

## Install

```sh
npm install
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CONFLUENCE_BASE_URL` | Bare domain, e.g. `https://roomle.atlassian.net` (no `/wiki` suffix) |
| `CONFLUENCE_PARENT_ID` | Numeric page ID under which all content lives |
| `CONFLUENCE_SPACE_KEY` | e.g. `careerladder` |
| `CONFLUENCE_ARCHIVE_PARENT_ID` | Numeric page ID of the dedicated Archive page |
| `ATLASSIAN_USER_NAME` | Atlassian account email |
| `ATLASSIAN_API_TOKEN` | API token from [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens) |

Locally, place these in `.env` (gitignored). In CI, they come from GitHub Secrets / Repository Variables.

## Usage

### Publish all pages

```sh
node --experimental-strip-types src/publish.ts
```

This will:
1. Discover all `docs/**/*.md` files with `confluence-publish: true` in frontmatter
2. Create folder pages for each directory containing published files
3. Create or update each content page with converted Markdown→ADF
4. Resolve internal links between published pages to real Confluence page URLs
5. Apply labels (`auto-published` + any tags from frontmatter)
6. Reorder children alphabetically under each parent
7. Archive orphaned pages (pages whose source file no longer exists)
8. Write back `confluence-page-id` to source files for any newly created pages

### Dry run (no API mutations)

```sh
node --experimental-strip-types src/publish.ts --dry-run
```

### Wipe all pages (fresh start)

```sh
node --experimental-strip-types src/publish.ts --wipe --confirm
```

Deletes every page under `CONFLUENCE_PARENT_ID`. Use before a full republish.

### Reorder only

```sh
node --experimental-strip-types src/publish.ts --reorder-only
```

### Verbose output

```sh
node --experimental-strip-types src/publish.ts --verbose
```

## How page IDs stay in sync

- When the publisher **creates** a new page, it writes `confluence-page-id: '<id>'` into the source file's YAML frontmatter.
- Locally, the IDs are written immediately. Commit them with your content changes.
- In CI (GitHub Actions), the workflow commits and pushes any new IDs back to the repo with `[skip ci]` to avoid loops.
- On subsequent runs, the publisher uses the stored ID to **update** existing pages in place.

## Auto-archival

When a source file is removed from `docs/` (and its `confluence-page-id` disappears from the repo), the next publish run detects the orphaned Confluence page and moves it under the Archive page. This is reversible — manually move the page back in Confluence if needed.

## How to recover an archived page

1. Navigate to the Archive page in Confluence
2. Find the archived page
3. Move it back under the correct parent using Confluence's "Move" action
4. Re-add the file to `docs/` with `confluence-publish: true` and the page's `confluence-page-id` in frontmatter

## Frontmatter schema

```yaml
---
title: Human-readable title (informational, not used by publisher)
confluence-publish: true        # required to publish; default false
confluence-page-id: '12345'     # auto-managed by publisher; do not edit manually
tags: [tag1, tag2]              # mapped 1:1 to Confluence labels
---
```

## Running tests

```sh
npm test
```

## Migration from old tooling

If you still have `connie-publish` / `connie-page-id` in frontmatter:

```sh
node --experimental-strip-types src/migrate.ts
```

This renames the fields to `confluence-publish` / `confluence-page-id`. Run once, commit the diff.
