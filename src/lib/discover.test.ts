import { describe, it, expect } from 'vitest';
import { parseFrontmatter, buildBasenameMap, buildRelPathMap } from './discover.ts';
import type { SourceFile } from './discover.ts';

describe('parseFrontmatter', () => {
  it('parses basic frontmatter with string values', () => {
    const content = `---
title: Hello World
confluence-publish: true
confluence-page-id: '12345'
---
# Hello

Body text.
`;
    const { raw, data, body } = parseFrontmatter(content);
    expect(data['title']).toBe('Hello World');
    expect(data['confluence-publish']).toBe(true);
    expect(data['confluence-page-id']).toBe('12345');
    expect(body).toContain('# Hello');
    expect(raw).toContain('title: Hello World');
  });

  it('parses inline array tags', () => {
    const content = `---
tags: [career-ladder, overview]
confluence-publish: true
---
# Test
`;
    const { data } = parseFrontmatter(content);
    expect(data['tags']).toEqual(['career-ladder', 'overview']);
  });

  it('parses multi-line array', () => {
    const content = `---
tags:
  - one
  - two
  - three
confluence-publish: false
---
# Test
`;
    const { data } = parseFrontmatter(content);
    expect(data['tags']).toEqual(['one', 'two', 'three']);
    expect(data['confluence-publish']).toBe(false);
  });

  it('returns empty data for files without frontmatter', () => {
    const content = `# Just a heading\n\nSome text.`;
    const { raw, data, body } = parseFrontmatter(content);
    expect(raw).toBe('');
    expect(data).toEqual({});
    expect(body).toBe(content);
  });

  it('handles quoted values', () => {
    const content = `---
confluence-page-id: "67890"
title: 'A Title'
---
# X
`;
    const { data } = parseFrontmatter(content);
    expect(data['confluence-page-id']).toBe('67890');
    expect(data['title']).toBe('A Title');
  });

  it('handles null values', () => {
    const content = `---
prev: null
next: '[02 Expert](02%20Expert.md)'
confluence-publish: true
---
# X
`;
    const { data } = parseFrontmatter(content);
    expect(data['prev']).toBe(null);
    expect(data['next']).toBe('[02 Expert](02%20Expert.md)');
  });
});

describe('buildBasenameMap', () => {
  it('maps basename to source files', () => {
    const files: SourceFile[] = [
      { absPath: '/docs/01 Junior.md', relPath: 'levels/01 Junior.md', frontmatter: {}, rawFrontmatter: '', body: '', title: '01 Junior' },
      { absPath: '/docs/axes.md', relPath: 'axes.md', frontmatter: {}, rawFrontmatter: '', body: '', title: 'Axes' },
    ];
    const map = buildBasenameMap(files);
    expect(map.get('01 Junior')).toHaveLength(1);
    expect(map.get('axes')).toHaveLength(1);
  });
});

describe('buildRelPathMap', () => {
  it('maps relative path to source file', () => {
    const files: SourceFile[] = [
      { absPath: '/docs/axes.md', relPath: 'axes.md', frontmatter: {}, rawFrontmatter: '', body: '', title: 'Axes' },
    ];
    const map = buildRelPathMap(files);
    expect(map.get('axes.md')?.title).toBe('Axes');
  });
});
