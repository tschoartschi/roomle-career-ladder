import { describe, it, expect } from 'vitest';
import { prettifyDirName, getRequiredFolderPaths } from './folders.ts';

describe('prettifyDirName', () => {
  it('capitalises and adds trailing slash', () => {
    expect(prettifyDirName('role-profiles')).toBe('Role Profiles/');
    expect(prettifyDirName('boundaries')).toBe('Boundaries/');
    expect(prettifyDirName('levels')).toBe('Levels/');
    expect(prettifyDirName('background')).toBe('Background/');
  });

  it('handles single-word names', () => {
    expect(prettifyDirName('levels')).toBe('Levels/');
  });

  it('handles multi-hyphen names', () => {
    expect(prettifyDirName('my-long-folder-name')).toBe('My Long Folder Name/');
  });
});

describe('getRequiredFolderPaths', () => {
  it('returns all parent directories', () => {
    const paths = ['levels/01 Junior.md', 'levels/02 Expert.md', 'axes.md'];
    const folders = getRequiredFolderPaths(paths);
    expect(folders).toEqual(['levels']);
  });

  it('returns nested directories shallowest first', () => {
    const paths = ['background/boundaries/01-doc.md', 'background/company-profile.md'];
    const folders = getRequiredFolderPaths(paths);
    expect(folders).toEqual(['background', 'background/boundaries']);
  });

  it('returns empty for root-only files', () => {
    const paths = ['overview.md', 'axes.md'];
    const folders = getRequiredFolderPaths(paths);
    expect(folders).toEqual([]);
  });
});
