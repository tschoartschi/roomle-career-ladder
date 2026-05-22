import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import path from 'node:path';

describe('SHA-256 computation', () => {
  it('produces expected hash for known input', () => {
    const buffer = Buffer.from('hello world');
    const hash = createHash('sha256').update(buffer).digest('hex');
    expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });

  it('produces different hash for different content', () => {
    const buf1 = Buffer.from('file content v1');
    const buf2 = Buffer.from('file content v2');
    const hash1 = createHash('sha256').update(buf1).digest('hex');
    const hash2 = createHash('sha256').update(buf2).digest('hex');
    expect(hash1).not.toBe(hash2);
  });
});

describe('path resolution', () => {
  it('resolves relative path from file directory', () => {
    const fileDir = '/project/docs/levels';
    const href = '../assets/image.png';
    const resolved = path.resolve(fileDir, href);
    expect(resolved).toBe('/project/docs/assets/image.png');
  });

  it('detects path escaping docs/', () => {
    const docsDir = '/project/docs';
    const resolved = path.resolve('/project/docs/levels', '../../secrets/key.png');
    const docsAbsPath = path.resolve(docsDir);
    const isUnderDocs = resolved.startsWith(docsAbsPath + path.sep) || resolved === docsAbsPath;
    expect(isUnderDocs).toBe(false);
  });

  it('allows path within docs/', () => {
    const docsDir = '/project/docs';
    const resolved = path.resolve('/project/docs/levels', '../assets/img.png');
    const docsAbsPath = path.resolve(docsDir);
    const isUnderDocs = resolved.startsWith(docsAbsPath + path.sep) || resolved === docsAbsPath;
    expect(isUnderDocs).toBe(true);
  });
});

describe('size limit detection', () => {
  const SIZE_WARN = 5 * 1024 * 1024;
  const SIZE_LIMIT = 20 * 1024 * 1024;

  it('detects files under warn threshold', () => {
    const size = 1024; // 1 KB
    expect(size > SIZE_WARN).toBe(false);
    expect(size > SIZE_LIMIT).toBe(false);
  });

  it('detects files above warn but below limit', () => {
    const size = 6 * 1024 * 1024; // 6 MB
    expect(size > SIZE_WARN).toBe(true);
    expect(size > SIZE_LIMIT).toBe(false);
  });

  it('detects files above limit', () => {
    const size = 21 * 1024 * 1024; // 21 MB
    expect(size > SIZE_WARN).toBe(true);
    expect(size > SIZE_LIMIT).toBe(true);
  });
});
