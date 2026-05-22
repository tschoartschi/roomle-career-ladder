import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { marked, type Token, type Tokens } from 'marked';
import type { Config } from './config.ts';
import type { SourceFile } from './discover.ts';
import { discover, buildBasenameMap, buildRelPathMap, persistPageId } from './discover.ts';
import { convert, type AdfDoc } from './convert.ts';
import type { ConvertContext } from './convert.ts';
import { ConfluenceApi, type ConfluencePage } from './api.ts';
import { prettifyDirName, getRequiredFolderPaths } from './folders.ts';

export interface PublishOptions {
  docsDir: string;
  config: Config;
  dryRun?: boolean;
  verbose?: boolean;
  reorderOnly?: boolean;
}

interface PageAction {
  file: SourceFile;
  title: string;
  adf: AdfDoc;
  action: 'create' | 'update';
  pageId?: string;
}

interface FolderPage {
  dirPath: string; // relative dir (e.g. "levels", "background/boundaries")
  title: string;
  parentDirPath: string; // parent dir (e.g. "" for root-level, "background" for boundaries)
  confluenceId?: string;
}

export async function publish(opts: PublishOptions): Promise<void> {
  const { docsDir, config, dryRun = false, verbose = false, reorderOnly = false } = opts;
  const api = new ConfluenceApi(config);

  // 1. Discover
  console.log('Discovering files...');
  const files = await discover(docsDir);
  console.log(`  Found ${files.length} publishable files.`);

  if (files.length === 0) {
    console.log('Nothing to publish.');
    return;
  }

  // 2. Build lookup maps
  const basenameMap = buildBasenameMap(files);
  const relPathMap = buildRelPathMap(files);

  // 3. Determine folder pages needed
  const folderDirPaths = getRequiredFolderPaths(files.map(f => f.relPath));
  const folderPages: FolderPage[] = folderDirPaths.map(dirPath => {
    const dirName = dirPath.includes('/') ? dirPath.slice(dirPath.lastIndexOf('/') + 1) : dirPath;
    const parentDir = dirPath.includes('/') ? dirPath.slice(0, dirPath.lastIndexOf('/')) : '';
    return {
      dirPath,
      title: prettifyDirName(dirName),
      parentDirPath: parentDir,
    };
  });

  // 4. If not reorder-only, convert and publish
  if (!reorderOnly) {
    // Look up or create folder pages first so we know parent IDs
    const folderIdMap = new Map<string, string>(); // dirPath → confluenceId
    folderIdMap.set('', config.confluenceParentId); // root = the configured parent

    if (!dryRun) {
      // Get spaceId from parent page (reused for all creates)
      const parentPage = await api.getPage(config.confluenceParentId) as unknown as { spaceId: string };
      const spaceId = parentPage.spaceId;

      // Create/find folder pages (shallowest first)
      for (const fp of folderPages) {
        const parentConfId = folderIdMap.get(fp.parentDirPath)!;
        const children = await api.getChildren(parentConfId);
        const existing = children.find(c => c.title === fp.title);

        if (existing) {
          folderIdMap.set(fp.dirPath, existing.id);
          if (verbose) console.log(`  Folder page exists: "${fp.title}" (${existing.id})`);
        } else {
          const emptyAdf = JSON.stringify({ type: 'doc', version: 1, content: [{ type: 'paragraph', content: [] }] });
          const page = await api.createPage({
            title: fp.title,
            parentId: parentConfId,
            adfBody: emptyAdf,
            spaceId,
          });
          folderIdMap.set(fp.dirPath, page.id);
          console.log(`  Created folder page: "${fp.title}" (${page.id})`);

          // Add auto-published label
          await api.addLabels(page.id, ['auto-published']);
        }
      }

      // Convert and publish content pages
      // Two-pass strategy for fresh publishes:
      //   Pass 1: Create pages that don't exist yet (with placeholder body) to get IDs
      //   Pass 2: Convert all pages (now with all IDs available) and update bodies
      const allWarnings: string[] = [];

      // Pass 1: ensure every file has a confluence-page-id
      const needsCreate: SourceFile[] = [];
      for (const file of files) {
        if (!file.frontmatter['confluence-page-id']) {
          needsCreate.push(file);
        }
      }

      if (needsCreate.length > 0) {
        console.log(`\n  Creating ${needsCreate.length} new page(s)...`);
        const placeholderAdf = JSON.stringify({ type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Publishing...' }] }] });

        for (const file of needsCreate) {
          const fileDir = file.relPath.includes('/') ? file.relPath.slice(0, file.relPath.lastIndexOf('/')) : '';
          const parentId = folderIdMap.get(fileDir) ?? config.confluenceParentId;

          const result = await api.createPage({
            title: file.title,
            parentId,
            adfBody: placeholderAdf,
            spaceId,
          });

          file.frontmatter['confluence-page-id'] = result.id;
          await persistPageId(file.absPath, result.id);
          console.log(`    Created: "${file.title}" (${result.id})`);
        }
      }

      // Pass 2: convert with all IDs resolved, then update all pages
      console.log(`\n  Updating ${files.length} page(s) with full content...`);
      for (const file of files) {
        const pageId = file.frontmatter['confluence-page-id']!;

        // Upload images before converting
        const attachmentMap = await uploadImagesForPage(api, file, docsDir, pageId, verbose);

        const ctx: ConvertContext = {
          basenameMap,
          relPathMap,
          currentFile: file,
          confluenceBaseUrl: config.confluenceBaseUrl,
          spaceKey: config.confluenceSpaceKey,
          warnings: [],
          attachmentMap,
        };

        const adf = convert(file, ctx);
        allWarnings.push(...ctx.warnings);

        const adfJson = JSON.stringify(adf);
        const fileDir = file.relPath.includes('/') ? file.relPath.slice(0, file.relPath.lastIndexOf('/')) : '';
        const parentId = folderIdMap.get(fileDir) ?? config.confluenceParentId;

        const current = await api.getPage(pageId);
        const nextVersion = (current.version?.number ?? 0) + 1;
        const result = await api.updatePage(pageId, {
          title: file.title,
          adfBody: adfJson,
          version: nextVersion,
          parentId,
        });
        console.log(`  SUCCESS: ${file.relPath} (v${result.version?.number})`);
        if (verbose) console.log(`    URL: ${config.confluenceBaseUrl}/wiki${result._links?.webui}`);

        // Apply labels
        const labels = ['auto-published', ...(file.frontmatter.tags ?? [])];
        const existingLabels = await api.getLabels(pageId);
        const existingNames = new Set(existingLabels.map(l => l.name));
        const toAdd = labels.filter(l => !existingNames.has(l));
        if (toAdd.length > 0) {
          await api.addLabels(pageId, toAdd);
        }
      }

      // Print warnings
      for (const w of allWarnings) {
        console.log(`  ${w}`);
      }
    } else {
      // Dry-run: just convert and report
      console.log('\n--- DRY RUN (no API mutations) ---\n');

      // Still resolve folder pages for display
      for (const fp of folderPages) {
        folderIdMap.set(fp.dirPath, `(folder:${fp.dirPath})`);
        console.log(`  Would create/find folder page: "${fp.title}"`);
      }

      const allWarnings: string[] = [];
      for (const file of files) {
        // In dry-run, scan for images but don't upload
        const imageTokens = marked.lexer(file.body);
        const imageHrefs = collectImageHrefs(imageTokens).filter(h => !/^https?:\/\//.test(h));
        if (imageHrefs.length > 0 && verbose) {
          console.log(`    Would upload ${imageHrefs.length} image(s): ${imageHrefs.join(', ')}`);
        }

        const ctx: ConvertContext = {
          basenameMap,
          relPathMap,
          currentFile: file,
          confluenceBaseUrl: config.confluenceBaseUrl,
          spaceKey: config.confluenceSpaceKey,
          warnings: [],
        };

        const adf = convert(file, ctx);
        allWarnings.push(...ctx.warnings);

        const existingId = file.frontmatter['confluence-page-id'];
        const action = existingId ? 'update' : 'create';
        const fileDir = file.relPath.includes('/') ? file.relPath.slice(0, file.relPath.lastIndexOf('/')) : '';
        console.log(`  Would ${action}: "${file.title}" (${file.relPath}) → parent: ${fileDir || '(root)'}`);
        if (verbose) {
          console.log(`    ADF blocks: ${adf.content.length}`);
        }
      }

      for (const w of allWarnings) {
        console.log(`  ${w}`);
      }
    }
  }

  // 5. Reorder pages (always, unless dry-run)
  if (!dryRun) {
    console.log('\nReordering pages...');
    await reorderChildren(api, config.confluenceParentId, verbose);

    // Also reorder children of each folder page
    const folderIdMap = new Map<string, string>();
    folderIdMap.set('', config.confluenceParentId);

    // Rebuild folder ID map by looking up existing pages
    for (const fp of folderPages) {
      const parentId = folderIdMap.get(fp.parentDirPath) ?? config.confluenceParentId;
      const children = await api.getChildren(parentId);
      const match = children.find(c => c.title === fp.title);
      if (match) {
        folderIdMap.set(fp.dirPath, match.id);
        await reorderChildren(api, match.id, verbose);
      }
    }
  } else if (reorderOnly) {
    console.log('\n--- DRY RUN: would reorder all children alphabetically ---');
  }

  // 6. Archive orphans (unless dry-run or reorder-only)
  if (!dryRun && !reorderOnly) {
    console.log('\nChecking for orphaned pages...');
    await archiveOrphans(api, config, files, folderPages, verbose);
  }

  console.log('\nDone.');
}

const SIZE_WARN = 5 * 1024 * 1024;
const SIZE_LIMIT = 20 * 1024 * 1024;

/**
 * Scan a file's markdown for local image references, upload them as attachments,
 * and return a map from relative href → attachment ID.
 */
async function uploadImagesForPage(
  api: ConfluenceApi,
  file: SourceFile,
  docsDir: string,
  pageId: string,
  verbose: boolean,
): Promise<Map<string, string>> {
  const attachmentMap = new Map<string, string>();

  // Tokenize to find image tokens
  const tokens = marked.lexer(file.body);
  const imageHrefs = collectImageHrefs(tokens);

  if (imageHrefs.length === 0) return attachmentMap;

  // Resolve and validate each image path
  const fileDir = path.dirname(file.absPath);
  const existingAttachments = await api.listAttachments(pageId);

  for (const href of imageHrefs) {
    // Skip external URLs
    if (/^https?:\/\//.test(href)) continue;

    const resolved = path.resolve(fileDir, href);

    // Validate: must be under docs/
    const docsAbsPath = path.resolve(docsDir);
    if (!resolved.startsWith(docsAbsPath + path.sep) && resolved !== docsAbsPath) {
      console.warn(`  warning: image path escapes docs/ in ${file.relPath}: ${href}`);
      continue;
    }

    // Validate: file exists
    if (!existsSync(resolved)) {
      console.warn(`  warning: image not found in ${file.relPath}: ${href}`);
      continue;
    }

    // Read file
    const buffer = await readFile(resolved);

    // Size checks
    if (buffer.length > SIZE_LIMIT) {
      console.error(`  error: image > 20 MB, skipping in ${file.relPath}: ${href} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
      continue;
    }
    if (buffer.length > SIZE_WARN) {
      console.warn(`  warning: image > 5 MB in ${file.relPath}: ${href} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
    }

    // Compute hash
    const hash = createHash('sha256').update(buffer).digest('hex');
    const filename = path.basename(resolved);

    // Check existing attachments
    const existing = existingAttachments.find(a => a.title === filename);

    if (existing && existing.comment === hash) {
      // Already up-to-date
      if (verbose) console.log(`    skip (unchanged): ${href}`);
      attachmentMap.set(href, existing.fileId);
    } else if (existing) {
      // Update existing attachment
      try {
        await api.updateAttachmentData(pageId, existing.id, filename, buffer, hash);
        if (verbose) console.log(`    updated: ${href}`);
        attachmentMap.set(href, existing.fileId);
      } catch (err) {
        console.warn(`  warning: failed to update attachment for ${href} in ${file.relPath}: ${(err as Error).message}`);
      }
    } else {
      // Upload new attachment
      try {
        const attId = await api.uploadAttachment(pageId, filename, buffer, hash);
        if (verbose) console.log(`    uploaded: ${href} (${attId})`);
        attachmentMap.set(href, attId);
      } catch (err) {
        console.warn(`  warning: failed to upload attachment for ${href} in ${file.relPath}: ${(err as Error).message}`);
      }
    }
  }

  return attachmentMap;
}

/** Recursively collect image hrefs from a token tree. */
function collectImageHrefs(tokens: Token[]): string[] {
  const hrefs: string[] = [];
  for (const token of tokens) {
    if (token.type === 'image') {
      hrefs.push((token as Tokens.Image).href);
    }
    if ('tokens' in token && Array.isArray((token as any).tokens)) {
      hrefs.push(...collectImageHrefs((token as any).tokens));
    }
    if ('items' in token && Array.isArray((token as any).items)) {
      for (const item of (token as any).items) {
        if (item.tokens) {
          hrefs.push(...collectImageHrefs(item.tokens));
        }
      }
    }
  }
  return hrefs;
}

async function reorderChildren(api: ConfluenceApi, parentId: string, verbose: boolean): Promise<void> {
  const children = await api.getChildren(parentId);
  if (children.length <= 1) return;

  // Sort alphabetically by title
  const sorted = [...children].sort((a, b) => a.title.localeCompare(b.title));

  // Move each child to its correct position
  for (let i = 0; i < sorted.length; i++) {
    const page = sorted[i];
    if (i === 0) {
      // Move to be first child of parent
      await api.movePage(page.id, parentId, 'append');
    } else {
      // Move after the previous sibling
      await api.movePage(page.id, sorted[i - 1].id, 'after');
    }
  }

  if (verbose) {
    console.log(`  Reordered ${children.length} children under ${parentId}: ${sorted.map(c => c.title).join(', ')}`);
  }
}

async function archiveOrphans(
  api: ConfluenceApi,
  config: Config,
  files: SourceFile[],
  folderPages: FolderPage[],
  verbose: boolean,
): Promise<void> {
  const allDescendants = await api.getDescendants(config.confluenceParentId);

  // Build set of known page IDs (from source files)
  const knownIds = new Set<string>();
  for (const f of files) {
    if (f.frontmatter['confluence-page-id']) {
      knownIds.add(f.frontmatter['confluence-page-id']);
    }
  }

  // Also include the parent ID, archive ID, and folder pages
  knownIds.add(config.confluenceParentId);
  knownIds.add(config.confluenceArchiveParentId);

  // Folder pages are looked up by title — mark them known
  const folderTitles = new Set(folderPages.map(fp => fp.title));
  for (const page of allDescendants) {
    if (folderTitles.has(page.title)) {
      knownIds.add(page.id);
    }
  }

  // Archive any page whose ID is not known
  let archived = 0;
  for (const page of allDescendants) {
    if (!knownIds.has(page.id)) {
      await api.movePage(page.id, config.confluenceArchiveParentId, 'append');
      console.log(`  archived: ${page.title}`);
      archived++;
    }
  }

  if (archived === 0) {
    console.log('  No orphaned pages found.');
  } else {
    console.log(`  Archived ${archived} page(s).`);
  }
}

export async function wipeAll(config: Config, confirm: boolean): Promise<void> {
  if (!confirm) {
    console.error('error: --wipe requires --confirm flag to actually delete pages.');
    process.exit(2);
  }

  const api = new ConfluenceApi(config);
  console.log(`Wiping all descendants of page ${config.confluenceParentId}...`);
  const count = await api.wipeDescendants(config.confluenceParentId);
  console.log(`Deleted ${count} page(s).`);
}
