import path from 'node:path';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { loadConfig } from './lib/config.ts';
import { publish, wipeAll } from './lib/orchestrator.ts';

const USAGE = `
Usage: node --experimental-strip-types src/publish.ts [flags]

Flags:
  --dry-run        Convert and resolve everything in memory. No API mutations.
  --wipe           Delete every page under CONFLUENCE_PARENT_ID. Requires --confirm.
  --confirm        Required with --wipe to actually delete pages.
  --reorder-only   Skip publish; just reorder existing pages by title.
  --verbose        Print full per-page conversion + API output.
  --help           Show this usage text.

Environment variables (from .env or GitHub Secrets):
  CONFLUENCE_BASE_URL          Bare domain (no /wiki suffix)
  CONFLUENCE_PARENT_ID         Numeric page ID
  CONFLUENCE_SPACE_KEY         e.g. "careerladder"
  CONFLUENCE_ARCHIVE_PARENT_ID Numeric page ID of Archive page
  ATLASSIAN_USER_NAME          Atlassian account email
  ATLASSIAN_API_TOKEN          API token

Exit codes: 0 success, 1 runtime error, 2 invalid arguments/config.
`.trim();

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(USAGE);
    process.exit(0);
  }

  const dryRun = args.includes('--dry-run');
  const wipe = args.includes('--wipe');
  const confirm = args.includes('--confirm');
  const reorderOnly = args.includes('--reorder-only');
  const verbose = args.includes('--verbose');

  // Validate unknown flags
  const knownFlags = new Set(['--dry-run', '--wipe', '--confirm', '--reorder-only', '--verbose', '--help', '-h']);
  const unknown = args.filter(a => a.startsWith('-') && !knownFlags.has(a));
  if (unknown.length > 0) {
    console.error(`error: unknown flag(s): ${unknown.join(', ')}`);
    console.error('Run with --help for usage.');
    process.exit(2);
  }

  // Load .env file if present (simple key=value parser, no library needed)
  const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const envFile = path.join(repoRoot, '.env');
  if (existsSync(envFile)) {
    const envContent = await readFile(envFile, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }

  let config;
  try {
    config = loadConfig();
  } catch (e) {
    console.error((e as Error).message);
    process.exit(2);
  }

  if (wipe) {
    await wipeAll(config, confirm);
    return;
  }

  const docsDir = path.join(repoRoot, 'docs');

  await publish({
    docsDir,
    config,
    dryRun,
    verbose,
    reorderOnly,
  });
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
