import { describe, it, expect } from 'vitest';
import { convert, type ConvertContext } from './convert.ts';
import type { SourceFile } from './discover.ts';

function makeFile(body: string, relPath = 'test.md'): SourceFile {
  return {
    absPath: `/docs/${relPath}`,
    relPath,
    frontmatter: { 'confluence-publish': true, 'confluence-page-id': '111' },
    rawFrontmatter: '',
    body,
    title: 'Test',
  };
}

function makeCtx(file: SourceFile, extraFiles: SourceFile[] = []): ConvertContext {
  const allFiles = [file, ...extraFiles];
  const basenameMap = new Map<string, SourceFile[]>();
  const relPathMap = new Map<string, SourceFile>();
  for (const f of allFiles) {
    const base = f.relPath.replace(/.*\//, '').replace(/\.md$/, '');
    const existing = basenameMap.get(base) ?? [];
    existing.push(f);
    basenameMap.set(base, existing);
    relPathMap.set(f.relPath, f);
  }
  return {
    basenameMap,
    relPathMap,
    currentFile: file,
    confluenceBaseUrl: 'https://example.atlassian.net',
    spaceKey: 'TEST',
    warnings: [],
  };
}

describe('convert', () => {
  it('converts a heading to ADF heading node', () => {
    const file = makeFile('# My Title\n\n## Section One\n\nParagraph text.');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    // First H1 is stripped (used as page title)
    expect(adf.content[0]).toMatchObject({
      type: 'heading',
      attrs: { level: 2 },
    });
    expect(adf.content[0].content![0]).toMatchObject({
      type: 'text',
      text: 'Section One',
    });
  });

  it('converts paragraphs', () => {
    const file = makeFile('# Title\n\nHello world.');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    expect(adf.content[0]).toMatchObject({
      type: 'paragraph',
      content: [{ type: 'text', text: 'Hello world.' }],
    });
  });

  it('converts bold text', () => {
    const file = makeFile('# T\n\n**bold text**');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    const para = adf.content[0];
    expect(para.content![0]).toMatchObject({
      type: 'text',
      text: 'bold text',
      marks: [{ type: 'strong' }],
    });
  });

  it('converts italic text', () => {
    const file = makeFile('# T\n\n*italic*');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    const para = adf.content[0];
    expect(para.content![0]).toMatchObject({
      type: 'text',
      text: 'italic',
      marks: [{ type: 'em' }],
    });
  });

  it('converts strikethrough', () => {
    const file = makeFile('# T\n\n~~struck~~');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    const para = adf.content[0];
    expect(para.content![0]).toMatchObject({
      type: 'text',
      text: 'struck',
      marks: [{ type: 'strike' }],
    });
  });

  it('converts inline code', () => {
    const file = makeFile('# T\n\nUse `code` here.');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    const para = adf.content[0];
    const codeNode = para.content!.find(n => n.marks?.some(m => m.type === 'code'));
    expect(codeNode).toMatchObject({
      type: 'text',
      text: 'code',
      marks: [{ type: 'code' }],
    });
  });

  it('converts fenced code blocks', () => {
    const file = makeFile('# T\n\n```javascript\nconst x = 1;\n```');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    expect(adf.content[0]).toMatchObject({
      type: 'codeBlock',
      attrs: { language: 'javascript' },
      content: [{ type: 'text', text: 'const x = 1;' }],
    });
  });

  it('converts blockquotes', () => {
    const file = makeFile('# T\n\n> A quote');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    expect(adf.content[0]).toMatchObject({
      type: 'blockquote',
    });
    expect(adf.content[0].content![0].type).toBe('paragraph');
  });

  it('converts unordered lists', () => {
    const file = makeFile('# T\n\n- Item one\n- Item two');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    expect(adf.content[0]).toMatchObject({ type: 'bulletList' });
    expect(adf.content[0].content).toHaveLength(2);
    expect(adf.content[0].content![0].type).toBe('listItem');
  });

  it('converts ordered lists', () => {
    const file = makeFile('# T\n\n1. First\n2. Second');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    expect(adf.content[0]).toMatchObject({ type: 'orderedList' });
    expect(adf.content[0].content).toHaveLength(2);
  });

  it('converts tables', () => {
    const file = makeFile('# T\n\n| H1 | H2 |\n|---|---|\n| A | B |');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    expect(adf.content[0]).toMatchObject({ type: 'table' });
    const rows = adf.content[0].content!;
    expect(rows).toHaveLength(2);
    expect(rows[0].content![0].type).toBe('tableHeader');
    expect(rows[1].content![0].type).toBe('tableCell');
  });

  it('converts horizontal rules', () => {
    const file = makeFile('# T\n\n---\n\nAfter rule.');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    expect(adf.content[0]).toMatchObject({ type: 'rule' });
  });

  it('converts external links', () => {
    const file = makeFile('# T\n\n[Google](https://google.com)');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    const para = adf.content[0];
    expect(para.content![0]).toMatchObject({
      type: 'text',
      text: 'Google',
      marks: [{ type: 'link', attrs: { href: 'https://google.com' } }],
    });
  });

  it('resolves internal links to Confluence URLs', () => {
    const target = makeFile('# Other Page\n\nContent.', 'other.md');
    target.frontmatter['confluence-page-id'] = '999';

    const file = makeFile('# T\n\n[link](other.md)', 'test.md');
    const ctx = makeCtx(file, [target]);
    const adf = convert(file, ctx);

    const para = adf.content[0];
    expect(para.content![0].marks![0].attrs!.href).toBe(
      'https://example.atlassian.net/wiki/spaces/TEST/pages/999/'
    );
  });

  it('throws on link to missing file', () => {
    const file = makeFile('# T\n\n[link](nonexistent.md)', 'test.md');
    const ctx = makeCtx(file);

    expect(() => convert(file, ctx)).toThrow(/links to missing file/);
  });

  it('throws on link to unpublished file', () => {
    const target = makeFile('# Other\n\nX', 'other.md');
    target.frontmatter['confluence-publish'] = false;

    const file = makeFile('# T\n\n[link](other.md)', 'test.md');
    const ctx = makeCtx(file, [target]);

    expect(() => convert(file, ctx)).toThrow(/which is not published/);
  });

  it('converts external URL image to mediaSingle with type external', () => {
    const file = makeFile('# T\n\n![alt](https://example.com/image.png)');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    expect(adf.content[0]).toMatchObject({
      type: 'mediaSingle',
      attrs: { layout: 'center' },
      content: [{
        type: 'media',
        attrs: { type: 'external', url: 'https://example.com/image.png' },
      }],
    });
    expect(ctx.warnings).toHaveLength(0);
  });

  it('converts local image with attachment map entry to mediaSingle with type file', () => {
    const file = makeFile('# T\n\n![diagram](./assets/diagram.png)');
    const ctx = makeCtx(file);
    ctx.attachmentMap = new Map([['./assets/diagram.png', 'att-123']]);
    const adf = convert(file, ctx);

    expect(adf.content[0]).toMatchObject({
      type: 'mediaSingle',
      attrs: { layout: 'center' },
      content: [{
        type: 'media',
        attrs: { type: 'file', id: 'att-123', collection: '' },
      }],
    });
    expect(ctx.warnings).toHaveLength(0);
  });

  it('skips local image without attachment map entry and warns', () => {
    const file = makeFile('# T\n\n![alt](./missing.png)');
    const ctx = makeCtx(file);
    ctx.attachmentMap = new Map();
    const adf = convert(file, ctx);

    // The mediaSingle should not appear
    const mediaNodes = adf.content.filter(n => n.type === 'mediaSingle');
    expect(mediaNodes).toHaveLength(0);
    expect(ctx.warnings).toContainEqual(expect.stringContaining('image not resolved'));
  });

  it('skips local image without attachment map (undefined) and warns', () => {
    const file = makeFile('# T\n\n![alt](image.png)');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    const mediaNodes = adf.content.filter(n => n.type === 'mediaSingle');
    expect(mediaNodes).toHaveLength(0);
    expect(ctx.warnings).toContainEqual(expect.stringContaining('image not resolved'));
  });

  it('handles multiple images in one document', () => {
    const file = makeFile('# T\n\n![ext](https://example.com/a.png)\n\n![local](./b.png)\n\n![missing](./c.png)');
    const ctx = makeCtx(file);
    ctx.attachmentMap = new Map([['./b.png', 'att-456']]);
    const adf = convert(file, ctx);

    expect(adf.content[0]).toMatchObject({
      type: 'mediaSingle',
      content: [{ type: 'media', attrs: { type: 'external', url: 'https://example.com/a.png' } }],
    });
    expect(adf.content[1]).toMatchObject({
      type: 'mediaSingle',
      content: [{ type: 'media', attrs: { type: 'file', id: 'att-456', collection: '' } }],
    });
    // Third image is skipped (not in map)
    expect(adf.content.filter(n => n.type === 'mediaSingle')).toHaveLength(2);
    expect(ctx.warnings).toContainEqual(expect.stringContaining('./c.png'));
  });

  it('strips raw HTML', () => {
    const file = makeFile('# T\n\n<div>html block</div>\n\nText after.');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    // HTML block should be gone, but text after should remain
    const types = adf.content.map(n => n.type);
    expect(types).not.toContain('html');
  });

  it('strips first H1 from body', () => {
    const file = makeFile('# Page Title\n\n## Sub\n\nPara');
    const ctx = makeCtx(file);
    const adf = convert(file, ctx);

    // Should NOT contain a heading with level 1
    const h1s = adf.content.filter(n => n.type === 'heading' && n.attrs?.level === 1);
    expect(h1s).toHaveLength(0);
  });
});
