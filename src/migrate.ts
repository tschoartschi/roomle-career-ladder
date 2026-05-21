/**
 * Migration script: renames frontmatter fields from old naming to new naming.
 *   connie-publish    → confluence-publish
 *   connie-page-id   → confluence-page-id
 *
 * Usage: node --experimental-strip-types src/migrate.ts
 *
 * Run once, commit the diff.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DOCS_DIR = path.join(REPO_ROOT, 'docs');

async function walkDir(dir: string): Promise<string[]> {
  const results: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkDir(full)));
    } else if (entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  const files = await walkDir(DOCS_DIR);
  let updated = 0;

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8');
    let modified = content;

    modified = modified.replace(/^connie-publish:/gm, 'confluence-publish:');
    modified = modified.replace(/^connie-page-id:/gm, 'confluence-page-id:');

    if (modified !== content) {
      await writeFile(filePath, modified, 'utf8');
      const rel = path.relative(REPO_ROOT, filePath);
      console.log(`  Updated: ${rel}`);
      updated++;
    }
  }

  console.log(`\nMigration complete: ${updated} file(s) updated.`);
  if (updated > 0) {
    console.log('Commit the changes with: git add docs/ && git commit -m "chore: rename connie → confluence frontmatter fields"');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
