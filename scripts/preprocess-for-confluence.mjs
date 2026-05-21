#!/usr/bin/env node
// Preprocess docs/ for the markdown-confluence CLI.
//
// The CLI only resolves links that are external URLs, Obsidian wikilinks
// (`[[name]]`), or Confluence mentions. Standard markdown links
// `[text](relative/path.md)` are silently replaced with `<a href="#">`.
//
// This script copies docs/ → build/docs/ and rewrites internal markdown
// links into wikilink syntax so the CLI can resolve them to Confluence
// page URLs. Source files in docs/ stay GitHub-friendly.
//
// Usage:   node scripts/preprocess-for-confluence.mjs
// Output:  build/docs/  (gitignored)

import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(REPO_ROOT, 'docs');
const DST = path.join(REPO_ROOT, 'build', 'docs');

// [text](href)  or  [text](<href with spaces>)
// Image syntax (![alt](src)) is detected via the leading "!" and left alone.
const LINK_RE = /(!?)\[([^\]]*)\]\((?:<([^>]+)>|([^)\s]+))\)/g;

const isExternal = (href) => /^(https?:|mailto:|#|\/)/.test(href);
const decode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };

function rewriteLinks(content) {
  return content.replace(LINK_RE, (full, bang, text, angleHref, plainHref) => {
    if (bang) return full;                       // image — leave alone
    const href = angleHref ?? plainHref;
    if (!href || isExternal(href)) return full;

    const hashIdx = href.indexOf('#');
    const pathPart = hashIdx === -1 ? href : href.slice(0, hashIdx);
    const fragPart = hashIdx === -1 ? '' : href.slice(hashIdx);

    if (!pathPart.endsWith('.md')) return full;  // not a markdown link target

    // The CLI's wikilink resolver looks up by basename (without .md).
    const basename = path.basename(decode(pathPart), '.md');
    const target = basename + fragPart;

    // [[basename]] if the display text is the basename, else [[basename|text]]
    return text === basename ? `[[${target}]]` : `[[${target}|${text}]]`;
  });
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function main() {
  if (existsSync(DST)) await rm(DST, { recursive: true });
  await mkdir(DST, { recursive: true });

  const files = await walk(SRC);
  let mdCount = 0, rewroteCount = 0, otherCount = 0;

  for (const srcPath of files) {
    const rel = path.relative(SRC, srcPath);
    const dstPath = path.join(DST, rel);
    await mkdir(path.dirname(dstPath), { recursive: true });

    if (srcPath.endsWith('.md')) {
      const original = await readFile(srcPath, 'utf8');
      const rewritten = rewriteLinks(original);
      await writeFile(dstPath, rewritten, 'utf8');
      mdCount++;
      if (rewritten !== original) rewroteCount++;
    } else {
      await writeFile(dstPath, await readFile(srcPath));
      otherCount++;
    }
  }

  console.log(`Preprocessor: ${mdCount} markdown files (${rewroteCount} had link rewrites), ${otherCount} other files copied → build/docs/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
