# Prompt: Implement Image Upload Support for Confluence Publisher

You are implementing image upload support for an existing in-house Confluence
publisher. Read the full specification at `internal/spec-image-uploads.md`
before starting.

## Context

The project is at the root of this workspace. Key files you'll modify:

- `src/lib/api.ts` — Confluence API client (add attachment methods)
- `src/lib/convert.ts` — Markdown→ADF converter (handle image tokens)
- `src/lib/orchestrator.ts` — publish orchestration (wire up image upload in pass 2)
- `src/lib/convert.test.ts` — converter unit tests
- Create new test file(s) as appropriate for attachment logic

## Technical constraints

1. **TypeScript with `--experimental-strip-types`** — NO parameter properties
   (`private foo: Bar` in constructor params). Use explicit field declarations
   and assignment in the constructor body.
2. **ES modules** — `"type": "module"` in package.json. Use `.ts` extensions
   in imports (e.g., `import { foo } from './bar.ts'`).
3. **No build step** — the code runs directly via
   `node --experimental-strip-types src/publish.ts`.
4. **Node.js 22+** — you can use modern APIs (fetch, crypto, fs/promises, etc.).
5. **vitest** for testing — run with `npm test`. Config is in `vitest.config.ts`.
6. **marked v16** — the markdown parser. Image tokens come through as
   `{ type: 'image', href: '...', text: '...' }` in the flat token stream.

## Implementation steps

### 1. API methods (`src/lib/api.ts`)

Add three methods to the `ConfluenceApi` class:

```typescript
async listAttachments(pageId: string): Promise<Array<{ id: string; title: string; comment: string }>>
async uploadAttachment(pageId: string, filename: string, buffer: Buffer, hash: string): Promise<string> // returns attachment ID
async updateAttachmentData(pageId: string, attachmentId: string, filename: string, buffer: Buffer, hash: string): Promise<void>
```

Key details:
- Use `/rest/api/content/{id}/child/attachment` (v1 API, same pattern as labels)
- Set `X-Atlassian-Token: nocheck` header
- Multipart body: field name `file`, include the binary content
- Store SHA-256 hash in the `comment` field
- For `listAttachments`, paginate if needed (though unlikely for our page sizes)

### 2. Converter changes (`src/lib/convert.ts`)

The converter's context type needs a new optional field:

```typescript
attachmentMap?: Map<string, string>  // relative image path → attachment ID
```

In the `image` token handler:
- If `href` starts with `http://` or `https://`: emit external media node
- Otherwise: look up `href` in `attachmentMap`
  - Found → emit file media node with the attachment ID
  - Not found → log warning, skip (do NOT emit a broken node)

ADF structure for both cases is documented in spec §7.

### 3. Orchestrator changes (`src/lib/orchestrator.ts`)

In pass 2, before calling `convert()` for each page:

1. Scan the page's markdown tokens for `image` nodes with local paths
2. Resolve each relative path against the markdown file's directory
3. Validate: exists? under `docs/`? size OK?
4. For each valid image:
   - Read file into Buffer
   - Compute SHA-256 (`crypto.createHash('sha256').update(buffer).digest('hex')`)
   - List page's existing attachments
   - Compare filename + hash → decide create/update/skip
   - Upload if needed, get attachment ID
5. Build `Map<string, string>` (relative path → attachment ID)
6. Pass map into `convert()` context

### 4. Size enforcement

- `> 5 MB` (5 * 1024 * 1024 bytes): `console.warn(...)` but proceed
- `> 20 MB` (20 * 1024 * 1024 bytes): `console.error(...)`, skip, do NOT
  throw — the publish run must continue for other pages/images

## Testing

### Unit tests (vitest)

Add tests in `src/lib/convert.test.ts`:

- External URL image → correct `mediaSingle` ADF with `type: "external"`
- Local image with attachment map entry → correct `mediaSingle` ADF with
  `type: "file"` and correct `id`
- Local image WITHOUT map entry → returns empty (skipped), warning emitted
- Multiple images in one document

Consider a new `src/lib/attachments.test.ts` for:

- SHA-256 computation (known input → known hash)
- Path resolution logic (relative paths, paths escaping `docs/`)
- Size limit detection

### Real-world integration test

After unit tests pass, test against a real Confluence instance:

1. Create a temporary test page under the configured parent:
   - Title: "Image Upload Test — <timestamp>" (easy to find/delete)
2. Upload a small test image (create a 1x1 PNG or use any small file in the repo)
3. Verify the attachment exists on the page (call `listAttachments`)
4. Verify the hash is stored in the comment field
5. Upload the same file again — verify NO new version was created
6. Modify the file content (append a byte), upload again — verify a new version exists
7. Run the full publisher with `--dry-run` first, then a real publish
8. Check the Confluence page renders the image inline
9. Clean up: delete the test page

Use the existing `.env` credentials for the real-world test. The test parent
page is configured via `CONFLUENCE_PARENT_ID`.

## Best practices

- **Read existing code first.** Study how `api.ts` handles other v1 endpoints
  (labels, children, move). Follow the same patterns for error handling,
  retry logic, and header management.
- **Keep changes minimal.** Don't refactor unrelated code. Don't add
  abstractions that aren't needed yet.
- **Fail gracefully on images.** The publisher must never crash because of an
  image issue. Warn and skip — always.
- **Run `npm test` after every change.** All 33 existing tests must continue
  to pass. Add new tests for every new code path.
- **Use `--verbose` for debugging.** The publisher's verbose flag should log
  image-related decisions (skip/upload/update) to help editors understand
  what happened.
- **Multipart uploads in Node.js 22:** Use the native `FormData` and `Blob`
  APIs (globally available). No need for external multipart libraries.
- **MIME types:** Use a simple extension→MIME lookup (a plain object/map).
  Don't install a dependency for this. Common types: `.png` → `image/png`,
  `.jpg`/`.jpeg` → `image/jpeg`, `.gif` → `image/gif`, `.svg` → `image/svg+xml`,
  `.webp` → `image/webp`. Default: `application/octet-stream`.

## Definition of done

- [ ] External URL images render on Confluence (verified manually)
- [ ] Local images from `docs/assets/` upload and render on Confluence
- [ ] Re-upload is skipped when file content hasn't changed
- [ ] Changed files trigger a new attachment version
- [ ] File > 20 MB is skipped with an error log (publisher continues)
- [ ] All existing tests pass (`npm test`)
- [ ] New unit tests cover the image code paths
- [ ] `--dry-run` mode does NOT upload anything
