#!/usr/bin/env node
// After publish, copy any connie-page-id that the CLI wrote into build/docs/
// frontmatter back into the corresponding source file in docs/.
//
// The CLI writes page identity metadata to whatever directory it published
// from (build/docs/). Those IDs are what makes subsequent publishes update
// existing pages instead of creating duplicates, so they need to live in
// source control — but only the connie-page-id line is interesting, not the
// wikilink-transformed body. This script copies only that single frontmatter
// field back.
//
// Usage: node scripts/sync-page-ids.mjs

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(REPO_ROOT, 'docs');
const BUILD = path.join(REPO_ROOT, 'build', 'docs');

// Captures whatever follows "connie-page-id:" up to end-of-line (quoted or bare).
const ID_RE = /^connie-page-id:\s*(.+?)\s*$/m;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function extractFrontmatter(content) {
  if (!content.startsWith('---\n')) return { fmText: null, body: content };
  const end = content.indexOf('\n---\n', 4);
  if (end === -1) return { fmText: null, body: content };
  return { fmText: content.slice(4, end), body: content.slice(end + 5) };
}

function rebuild(fmText, body) {
  return `---\n${fmText}\n---\n${body}`;
}

async function main() {
  const buildFiles = await walk(BUILD);
  let updated = 0, alreadyOk = 0, noId = 0;

  for (const bPath of buildFiles) {
    const rel = path.relative(BUILD, bPath);
    const srcPath = path.join(SRC, rel);

    const bContent = await readFile(bPath, 'utf8');
    const bMatch = bContent.match(ID_RE);
    if (!bMatch) { noId++; continue; }
    const buildId = bMatch[1];

    let sContent;
    try {
      sContent = await readFile(srcPath, 'utf8');
    } catch {
      console.warn(`  ! build file ${rel} has no matching source — skipping`);
      continue;
    }

    const sMatch = sContent.match(ID_RE);
    if (sMatch && sMatch[1] === buildId) { alreadyOk++; continue; }

    const { fmText, body } = extractFrontmatter(sContent);
    if (fmText === null) {
      console.warn(`  ! source ${rel} has no frontmatter — skipping`);
      continue;
    }

    let newFm;
    if (sMatch) {
      newFm = fmText.replace(ID_RE, `connie-page-id: ${buildId}`);
    } else {
      newFm = `${fmText}\nconnie-page-id: ${buildId}`;
    }
    await writeFile(srcPath, rebuild(newFm, body), 'utf8');
    updated++;
  }

  console.log(`Sync: ${updated} source files updated with new connie-page-id, ${alreadyOk} already current, ${noId} build files had no id.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
