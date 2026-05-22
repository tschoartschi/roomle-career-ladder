---
title: Image Upload Support — Specification
aliases: [Image Upload Spec]
type: reference
tags: [internal, spec, tooling]
---

# Image Upload Support — Specification

Status: **Draft for implementation handoff**
Owner: TBD
Last revised: 2026-05-22

## 1. Background and goals

The Confluence publisher (see `internal/spec-confluence-publisher.md`) currently
skips images with a warning (`unsupported: image`). Editors want to include
diagrams and screenshots without having to manually upload files to Confluence
or manage access rights on external hosting.

### Goals

- Support **repo-local images** placed in `docs/assets/` (or any resolvable
  relative path under `docs/`).
- Support **external URL images** (`![alt](https://…)`) with zero upload.
- Upload images as **Confluence page attachments** and reference them via
  inline ADF media nodes.
- Avoid re-uploading unchanged images (content-hash deduplication).
- Enforce file-size limits (warn > 5 MB, fail > 20 MB).

### Non-goals

- Inline SVG rendering (would require conversion to PNG or attachment tricks;
  out of scope for initial release).
- Orphan attachment cleanup (images removed from the repo are left as
  Confluence attachments — no deletion).
- Image resizing / responsive layout.
- Confluence macros (image-effects, borders, captions).

## 2. Image source conventions

### 2.1 Centralised assets folder

Editors place images in `docs/assets/`. Example layout:

```
docs/
├── assets/
│   ├── career-ladder-overview.png
│   └── levels/
│       └── senior-progression.svg
├── levels/
│   └── 03 Senior-L1.md   → references ../assets/levels/senior-progression.svg
└── 00 Overview.md         → references ./assets/career-ladder-overview.png
```

### 2.2 Relative path resolution

Any relative path in an image token (`![alt](./path)` or `![alt](../path)`)
is resolved against the directory containing the markdown file. The resolved
path must remain under `docs/`. If it falls outside, emit a warning and skip.

### 2.3 External URLs

`![alt](https://example.com/img.png)` requires no upload. Emit an ADF
external media node directly.

## 3. Supported formats

**Any file extension** is accepted for upload. Confluence decides how to
display the attachment:

- Browser-renderable formats (PNG, JPEG, GIF, SVG, WEBP) render inline.
- Other files (PDF, ZIP, etc.) appear as download links.

## 4. File-size limits

| Size       | Behaviour                                    |
|------------|----------------------------------------------|
| ≤ 5 MB     | Upload silently                              |
| > 5 MB     | Log warning, continue upload                 |
| > 20 MB    | Log error, skip image, continue publish      |

The publisher must NOT abort the entire run for an oversized image.

## 5. Attachment scope

Each image is attached to **the page that references it**. If the same image
appears on multiple pages, it is uploaded to each page independently.

Rationale: avoids cross-page attachment dependencies and keeps the model
simple. Confluence deduplicates storage internally.

## 6. Deduplication strategy

On every upload, the publisher stores the **SHA-256 hex digest** of the file
content in the attachment's `comment` field (Confluence API supports this).

Before uploading:
1. List existing attachments on the page (`GET /rest/api/content/{id}/child/attachment`).
2. Find an attachment whose `title` matches the filename.
3. If found and its `comment` matches the current SHA-256 → skip.
4. If found but hash differs → update (upload new version via `POST …/attachment/{attachId}/data`).
5. If not found → create (upload via `PUT /rest/api/content/{id}/child/attachment`).

## 7. ADF output

### 7.1 External URL image

```json
{
  "type": "mediaSingle",
  "attrs": { "layout": "center" },
  "content": [{
    "type": "media",
    "attrs": {
      "type": "external",
      "url": "https://example.com/image.png"
    }
  }]
}
```

### 7.2 Repo-local image (uploaded attachment)

```json
{
  "type": "mediaSingle",
  "attrs": { "layout": "center" },
  "content": [{
    "type": "media",
    "attrs": {
      "type": "file",
      "id": "<attachment-id>",
      "collection": ""
    }
  }]
}
```

### 7.3 Alt text

If the markdown `![alt text](…)` has alt text, it should NOT be placed in
the media node (Confluence doesn't support alt on media). Log a note if
verbose mode is on; otherwise silently ignore.

## 8. API calls

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/rest/api/content/{id}/child/attachment` | GET | List existing attachments |
| `/rest/api/content/{id}/child/attachment` | PUT | Upload new attachment (multipart/form-data) |
| `/rest/api/content/{id}/child/attachment/{attId}/data` | POST | Update existing attachment |

All attachment endpoints require `X-Atlassian-Token: nocheck` header.

The multipart body must use the field name `file` with the binary content
and a `Content-Type` header matching the file MIME type (use file extension
mapping; default to `application/octet-stream` for unknown types).

## 9. Integration with the two-pass architecture

The existing publisher uses two passes:
- **Pass 1**: Create pages (placeholder body), get page IDs.
- **Pass 2**: Convert markdown (with link resolution), update bodies.

Image upload slots into **Pass 2**, before body conversion:

1. For each page, scan its markdown tokens for `image` nodes.
2. Resolve each image path (relative → absolute file path).
3. Upload / deduplicate each image, collecting `{ filename → attachmentId }`.
4. Pass the attachment map into the converter as additional context.
5. Converter emits the correct `mediaSingle` ADF node.

## 10. Changes to existing code

| File | Change |
|------|--------|
| `src/lib/api.ts` | Add `listAttachments(pageId)`, `uploadAttachment(pageId, filename, buffer, hash)`, `updateAttachmentData(pageId, attachmentId, filename, buffer, hash)` |
| `src/lib/convert.ts` | Handle `image` token: external URL → §7.1, local path → look up in attachment map → §7.2. If map entry missing, warn and skip. |
| `src/lib/orchestrator.ts` | In pass 2: before converting, discover images per page, upload, build attachment map, pass to `convert()` |
| `src/lib/discover.ts` | No change (images are not "pages") |
| `src/lib/folders.ts` | No change |

## 11. Error handling

- File not found at resolved path → warning, skip image, continue.
- Upload HTTP error (4xx/5xx) → retry once (existing retry logic), then warn and skip image.
- File > 20 MB → error-level log, skip image, continue publish.
- Path resolves outside `docs/` → warning, skip image.

The publisher must never abort the run due to an image issue. Images are
best-effort.

## 12. Testing strategy

### Unit tests (vitest)

- `convert.test.ts`: Add cases for external URL images, local images with
  attachment map provided, local images with missing map entry (should warn).
- New test file or section: attachment hash logic, path resolution, size checks.

### Integration test

- Create a test page under a dedicated Confluence test parent.
- Upload a small PNG, verify it renders.
- Upload again unchanged, verify no new version is created (hash match).
- Modify the file, upload again, verify version incremented.
- Test external URL image renders correctly.
- Clean up: delete test page after run.

## 13. Future work

- Orphan attachment cleanup (delete attachments whose source file was removed).
- Image captions via Confluence extension macros.
- Inline SVG → PNG conversion.
- Lazy upload (only upload if page body actually changed).
- `docs/assets/` gitignore patterns (e.g., `.DS_Store`, `Thumbs.db`).
