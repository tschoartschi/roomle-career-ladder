import { marked, type Token, type Tokens } from 'marked';
import path from 'node:path';
import type { SourceFile } from './discover.ts';

// ADF types (minimal, just what we need)
export interface AdfNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: AdfNode[];
  text?: string;
  marks?: AdfMark[];
}

export interface AdfMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface AdfDoc {
  type: 'doc';
  version: 1;
  content: AdfNode[];
}

export interface ConvertContext {
  /** Map from basename (no .md) → SourceFile[] */
  basenameMap: Map<string, SourceFile[]>;
  /** Map from relative path → SourceFile */
  relPathMap: Map<string, SourceFile>;
  /** The source file being converted (for resolving relative links) */
  currentFile: SourceFile;
  /** Confluence base URL */
  confluenceBaseUrl: string;
  /** Confluence space key */
  spaceKey: string;
  /** Warnings collected during conversion */
  warnings: string[];
  /** Map from relative image path → attachment ID */
  attachmentMap?: Map<string, string>;
}

function addMark(node: AdfNode, mark: AdfMark): AdfNode {
  if (node.type !== 'text') return node;
  return { ...node, marks: [...(node.marks ?? []), mark] };
}

/**
 * Resolve an internal link href to a Confluence page URL.
 * Throws on broken links per spec §6.2.
 */
function resolveInternalLink(href: string, ctx: ConvertContext): string {
  const [pathPart, fragment] = href.split('#');

  if (!pathPart) {
    // Fragment-only link
    if (fragment && ctx.warnings.length === 0 || !ctx.warnings.some(w => w.includes('fragment-only'))) {
      ctx.warnings.push(`warning: ${ctx.currentFile.relPath} contains a fragment-only link (#${fragment}). Verify rendering in Confluence.`);
    }
    return `#${fragment}`;
  }

  const decoded = decodeURIComponent(pathPart);

  // Resolve relative path from current file's directory
  const currentDir = path.dirname(ctx.currentFile.relPath);
  const resolved = path.normalize(path.join(currentDir, decoded));

  // Try by relative path first
  let target = ctx.relPathMap.get(resolved);

  // Try by basename if relative path didn't match
  if (!target) {
    const base = path.basename(decoded, '.md');
    const candidates = ctx.basenameMap.get(base);
    if (candidates && candidates.length === 1) {
      target = candidates[0];
    } else if (candidates && candidates.length > 1) {
      throw new Error(
        `error: ${ctx.currentFile.relPath} links to ambiguous basename "${base}". ` +
        `Candidates: ${candidates.map(c => c.relPath).join(', ')}`
      );
    }
  }

  if (!target) {
    throw new Error(
      `error: ${ctx.currentFile.relPath} links to missing file "${decoded}"`
    );
  }

  if (!target.frontmatter['confluence-publish']) {
    throw new Error(
      `error: ${ctx.currentFile.relPath} links to "${target.relPath}" which is not published`
    );
  }

  const pageId = target.frontmatter['confluence-page-id'];
  if (!pageId) {
    // Page hasn't been created yet — will be resolved after first publish
    // For now, use a placeholder that will be filled on subsequent runs
    return `#pending-${target.relPath}`;
  }

  const url = `${ctx.confluenceBaseUrl}/wiki/spaces/${ctx.spaceKey}/pages/${pageId}/`;
  return fragment ? `${url}#${fragment}` : url;
}

/**
 * Resolve a wikilink to href.
 * Formats: [[name]], [[name|display]], [[name#section]]
 */
function resolveWikilink(target: string, ctx: ConvertContext): { href: string; text: string } {
  // Parse [[target|display]] or [[target#fragment]]
  const pipeIdx = target.indexOf('|');
  let linkTarget: string;
  let displayText: string;

  if (pipeIdx !== -1) {
    linkTarget = target.slice(0, pipeIdx);
    displayText = target.slice(pipeIdx + 1);
  } else {
    linkTarget = target;
    displayText = target.replace(/#.*$/, ''); // Strip fragment from display
  }

  const [pathPart, fragment] = linkTarget.split('#');
  const base = pathPart || '';

  // Lookup by basename
  const candidates = ctx.basenameMap.get(base);
  if (!candidates || candidates.length === 0) {
    throw new Error(
      `error: ${ctx.currentFile.relPath} has wikilink to missing file "[[${target}]]"`
    );
  }
  if (candidates.length > 1) {
    throw new Error(
      `error: ${ctx.currentFile.relPath} has wikilink to ambiguous basename "${base}". ` +
      `Candidates: ${candidates.map(c => c.relPath).join(', ')}`
    );
  }

  const file = candidates[0];
  if (!file.frontmatter['confluence-publish']) {
    throw new Error(
      `error: ${ctx.currentFile.relPath} wikilink to "${file.relPath}" which is not published`
    );
  }

  const pageId = file.frontmatter['confluence-page-id'];
  let href: string;
  if (!pageId) {
    href = `#pending-${file.relPath}`;
  } else {
    href = `${ctx.confluenceBaseUrl}/wiki/spaces/${ctx.spaceKey}/pages/${pageId}/`;
    if (fragment) href += `#${fragment}`;
  }

  return { href, text: displayText };
}

function inlineTokens(tokens: Token[], ctx: ConvertContext): AdfNode[] {
  const results: AdfNode[] = [];
  for (const token of tokens) {
    results.push(...inlineToken(token, ctx));
  }
  return results;
}

function inlineToken(token: Token, ctx: ConvertContext): AdfNode[] {
  switch (token.type) {
    case 'text': {
      const t = token as Tokens.Text;
      if (t.tokens && t.tokens.length > 0) {
        return inlineTokens(t.tokens, ctx);
      }
      // Handle wikilinks in raw text
      return processTextWithWikilinks(t.text ?? t.raw, ctx);
    }

    case 'escape':
      return [{ type: 'text', text: (token as Tokens.Escape).text }];

    case 'strong': {
      const t = token as Tokens.Strong;
      return inlineTokens(t.tokens, ctx).map(n => addMark(n, { type: 'strong' }));
    }

    case 'em': {
      const t = token as Tokens.Em;
      return inlineTokens(t.tokens, ctx).map(n => addMark(n, { type: 'em' }));
    }

    case 'del': {
      const t = token as Tokens.Del;
      return inlineTokens(t.tokens, ctx).map(n => addMark(n, { type: 'strike' }));
    }

    case 'codespan': {
      const t = token as Tokens.Codespan;
      return [{ type: 'text', text: t.text, marks: [{ type: 'code' }] }];
    }

    case 'br':
      return [{ type: 'hardBreak' }];

    case 'link': {
      const t = token as Tokens.Link;
      let href: string;

      if (isInternalLink(t.href)) {
        href = resolveInternalLink(t.href, ctx);
      } else {
        href = t.href;
      }

      const inner = inlineTokens(t.tokens, ctx);
      return inner.map(n => addMark(n, { type: 'link', attrs: { href } }));
    }

    case 'image': {
      const t = token as Tokens.Image;
      const href = t.href;

      if (/^https?:\/\//.test(href)) {
        // External image → external media node
        return [{
          type: 'mediaSingle',
          attrs: { layout: 'center', width: 50 },
          content: [{
            type: 'media',
            attrs: { type: 'external', url: href },
          }],
        }];
      }

      // Local image → look up in attachment map
      if (ctx.attachmentMap) {
        const fileId = ctx.attachmentMap.get(href);
        if (fileId) {
          const pageId = ctx.currentFile.frontmatter['confluence-page-id'] ?? '';
          return [{
            type: 'mediaSingle',
            attrs: { layout: 'center', width: 50 },
            content: [{
              type: 'media',
              attrs: { type: 'file', id: fileId, collection: `contentId-${pageId}` },
            }],
          }];
        }
      }

      // Not found in map — warn and skip
      ctx.warnings.push(`warning: image not resolved "${href}" in ${ctx.currentFile.relPath}`);
      return [];
    }

    case 'html':
      // Strip raw inline HTML
      return [];

    default:
      return [{ type: 'text', text: (token as { raw?: string }).raw ?? '' }];
  }
}

/** Check if a link is internal (relative .md link) */
function isInternalLink(href: string): boolean {
  if (!href) return false;
  if (/^(https?:|mailto:|#)/.test(href)) return false;
  // Check if it points to a .md file (with possible fragment)
  const [pathPart] = href.split('#');
  return pathPart.endsWith('.md');
}

const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;

/** Process text that may contain wikilinks */
function processTextWithWikilinks(text: string, ctx: ConvertContext): AdfNode[] {
  const parts: AdfNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  WIKILINK_RE.lastIndex = 0;
  while ((match = WIKILINK_RE.exec(text)) !== null) {
    // Text before the wikilink
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: text.slice(lastIndex, match.index) });
    }

    const { href, text: displayText } = resolveWikilink(match[1], ctx);
    parts.push({
      type: 'text',
      text: displayText,
      marks: [{ type: 'link', attrs: { href } }],
    });

    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last wikilink
  if (lastIndex < text.length) {
    parts.push({ type: 'text', text: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
    parts.push({ type: 'text', text });
  }

  return parts;
}

function blockToken(token: Token, ctx: ConvertContext): AdfNode | null {
  switch (token.type) {
    case 'space':
      return null;

    case 'hr':
      return { type: 'rule' };

    case 'heading': {
      const t = token as Tokens.Heading;
      return {
        type: 'heading',
        attrs: { level: Math.min(t.depth, 6) },
        content: inlineTokens(t.tokens, ctx),
      };
    }

    case 'paragraph': {
      const t = token as Tokens.Paragraph;
      const content = inlineTokens(t.tokens, ctx);
      if (content.length === 0) return null;
      // If the paragraph contains only a mediaSingle node, hoist it to block level
      if (content.length === 1 && content[0].type === 'mediaSingle') {
        return content[0];
      }
      return { type: 'paragraph', content };
    }

    case 'blockquote': {
      const t = token as Tokens.Blockquote;
      const content = t.tokens.map(tok => blockToken(tok, ctx)).filter(Boolean) as AdfNode[];
      return { type: 'blockquote', content };
    }

    case 'list': {
      const t = token as Tokens.List;
      const type = t.ordered ? 'orderedList' : 'bulletList';
      const content = t.items.map(item => {
        const children: AdfNode[] = [];
        for (const tok of item.tokens) {
          if (tok.type === 'text' && (tok as Tokens.Text).tokens) {
            children.push({
              type: 'paragraph',
              content: inlineTokens((tok as Tokens.Text).tokens!, ctx),
            });
          } else if (tok.type === 'list') {
            const nested = blockToken(tok, ctx);
            if (nested) children.push(nested);
          } else {
            const b = blockToken(tok, ctx);
            if (b) children.push(b);
          }
        }
        // listItem must have at least one child
        if (children.length === 0) {
          children.push({ type: 'paragraph', content: [{ type: 'text', text: '' }] });
        }
        return { type: 'listItem', content: children };
      });
      return { type, content };
    }

    case 'code': {
      const t = token as Tokens.Code;
      return {
        type: 'codeBlock',
        attrs: t.lang ? { language: t.lang } : {},
        content: t.text ? [{ type: 'text', text: t.text }] : [],
      };
    }

    case 'table': {
      const t = token as Tokens.Table;
      const rows: AdfNode[] = [];

      // Header row
      rows.push({
        type: 'tableRow',
        content: t.header.map(cell => ({
          type: 'tableHeader',
          attrs: {},
          content: [{ type: 'paragraph', content: inlineTokens(cell.tokens, ctx) }],
        })),
      });

      // Body rows
      for (const row of t.rows) {
        rows.push({
          type: 'tableRow',
          content: row.map(cell => ({
            type: 'tableCell',
            attrs: {},
            content: [{ type: 'paragraph', content: inlineTokens(cell.tokens, ctx) }],
          })),
        });
      }

      return { type: 'table', attrs: {}, content: rows };
    }

    case 'html':
      return null;

    case 'text': {
      const t = token as Tokens.Text;
      if (t.tokens && t.tokens.length > 0) {
        return { type: 'paragraph', content: inlineTokens(t.tokens, ctx) };
      }
      const content = processTextWithWikilinks(t.text ?? t.raw, ctx);
      return { type: 'paragraph', content };
    }

    default:
      return null;
  }
}

/**
 * Convert a markdown source file to ADF.
 * The first H1 is stripped (it becomes the Confluence page title).
 */
export function convert(file: SourceFile, ctx: ConvertContext): AdfDoc {
  const tokens = marked.lexer(file.body);

  // Skip the first H1 (used as page title, rendered by Confluence separately)
  let skipFirst = true;
  const content: AdfNode[] = [];

  for (const token of tokens) {
    if (skipFirst && token.type === 'heading' && (token as Tokens.Heading).depth === 1) {
      skipFirst = false;
      continue;
    }
    const node = blockToken(token, ctx);
    if (node) content.push(node);
  }

  return { type: 'doc', version: 1, content };
}
