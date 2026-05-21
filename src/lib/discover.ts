import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface Frontmatter {
  [key: string]: unknown;
  'confluence-publish'?: boolean;
  'confluence-page-id'?: string;
  tags?: string[];
}

export interface SourceFile {
  /** Absolute path to the file */
  absPath: string;
  /** Path relative to docs/ */
  relPath: string;
  /** Parsed frontmatter */
  frontmatter: Frontmatter;
  /** Raw frontmatter text (for preserving verbatim on write-back) */
  rawFrontmatter: string;
  /** Markdown body (everything after frontmatter) */
  body: string;
  /** First H1 extracted from body (page title) */
  title: string;
}

/**
 * Parse YAML frontmatter minimally (no yaml library needed for our simple schema).
 * Returns the raw frontmatter string and a parsed key-value object.
 */
export function parseFrontmatter(content: string): { raw: string; data: Frontmatter; body: string } {
  if (!content.startsWith('---\n')) {
    return { raw: '', data: {}, body: content };
  }
  const end = content.indexOf('\n---\n', 4);
  if (end === -1) {
    // Check if file ends with --- (no trailing newline)
    const endAlt = content.indexOf('\n---', 4);
    if (endAlt === -1 || endAlt + 4 !== content.length) {
      return { raw: '', data: {}, body: content };
    }
    const raw = content.slice(4, endAlt);
    return { raw, data: parseYamlSimple(raw), body: '' };
  }
  const raw = content.slice(4, end);
  const body = content.slice(end + 5);
  return { raw, data: parseYamlSimple(raw), body };
}

/** Minimal YAML parser for flat key-value frontmatter. Handles strings, bools, arrays. */
function parseYamlSimple(text: string): Frontmatter {
  const result: Frontmatter = {};
  const lines = text.split('\n');
  let currentKey: string | null = null;
  let currentArray: string[] | null = null;

  for (const line of lines) {
    // Array continuation (indented "- item")
    const arrayItem = line.match(/^\s+-\s+(.+)/);
    if (arrayItem && currentKey && currentArray) {
      currentArray.push(unquote(arrayItem[1].trim()));
      continue;
    }

    // Flush previous array
    if (currentKey && currentArray) {
      result[currentKey] = currentArray;
      currentKey = null;
      currentArray = null;
    }

    // Key-value pair
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)/);
    if (!kv) continue;

    const key = kv[1];
    const val = kv[2].trim();

    if (val === '' || val === '[]') {
      // Might be a multi-line array
      currentKey = key;
      currentArray = [];
      continue;
    }

    // Inline array: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      const items = val.slice(1, -1).split(',').map((s) => unquote(s.trim())).filter(Boolean);
      result[key] = items;
      continue;
    }

    // Boolean
    if (val === 'true') { result[key] = true; continue; }
    if (val === 'false') { result[key] = false; continue; }
    if (val === 'null') { result[key] = null; continue; }

    // String (possibly quoted)
    result[key] = unquote(val);
  }

  // Flush trailing array
  if (currentKey && currentArray) {
    result[currentKey] = currentArray;
  }

  return result;
}

function unquote(s: string): string {
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1);
  }
  return s;
}

/** Extract the first H1 from markdown body */
function extractTitle(body: string): string {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

/** Recursively find all .md files */
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

/**
 * Discover all publishable markdown files under docsDir.
 * Returns files that have `confluence-publish: true` in frontmatter.
 */
export async function discover(docsDir: string): Promise<SourceFile[]> {
  const allPaths = await walkDir(docsDir);
  const files: SourceFile[] = [];

  for (const absPath of allPaths) {
    const content = await readFile(absPath, 'utf8');
    const { raw, data, body } = parseFrontmatter(content);

    if (!data['confluence-publish']) continue;

    const title = extractTitle(body);
    if (!title) {
      throw new Error(`error: ${absPath} has confluence-publish: true but no H1 title`);
    }

    files.push({
      absPath,
      relPath: path.relative(docsDir, absPath),
      frontmatter: data,
      rawFrontmatter: raw,
      body,
      title,
    });
  }

  return files;
}

/**
 * Write the confluence-page-id back into a source file's frontmatter.
 */
export async function persistPageId(absPath: string, pageId: string): Promise<void> {
  const content = await readFile(absPath, 'utf8');
  const { raw, data, body } = parseFrontmatter(content);

  if (!raw && !Object.keys(data).length) {
    throw new Error(`Cannot persist page-id to ${absPath}: no frontmatter found`);
  }

  const idLine = `confluence-page-id: '${pageId}'`;
  let newRaw: string;

  if (/^confluence-page-id:/m.test(raw)) {
    newRaw = raw.replace(/^confluence-page-id:.*$/m, idLine);
  } else {
    newRaw = raw + '\n' + idLine;
  }

  const newContent = `---\n${newRaw}\n---\n${body}`;
  await writeFile(absPath, newContent, 'utf8');
}

/**
 * Build a map of basename (without .md) → SourceFile for internal link resolution.
 */
export function buildBasenameMap(files: SourceFile[]): Map<string, SourceFile[]> {
  const map = new Map<string, SourceFile[]>();
  for (const f of files) {
    const base = path.basename(f.relPath, '.md');
    const existing = map.get(base) ?? [];
    existing.push(f);
    map.set(base, existing);
  }
  return map;
}

/**
 * Build a map of relative path → SourceFile for internal link resolution.
 */
export function buildRelPathMap(files: SourceFile[]): Map<string, SourceFile> {
  const map = new Map<string, SourceFile>();
  for (const f of files) {
    map.set(f.relPath, f);
  }
  return map;
}
