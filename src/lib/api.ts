import type { Config } from './config.ts';

export interface ConfluencePage {
  id: string;
  title: string;
  status: string;
  parentId?: string;
  version?: { number: number };
  _links?: { webui?: string };
}

export interface ConfluenceLabel {
  prefix: string;
  name: string;
  id?: string;
}

export class ConfluenceApi {
  private baseUrl: string;
  private auth: string;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this.baseUrl = `${config.confluenceBaseUrl}/wiki`;
    this.auth = 'Basic ' + Buffer.from(`${config.atlassianUserName}:${config.atlassianApiToken}`).toString('base64');
  }

  private async request<T>(method: string, path: string, body?: unknown, retry = true): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle rate limiting
    if (res.status === 429 && retry) {
      const retryAfter = parseInt(res.headers.get('Retry-After') ?? '2', 10);
      console.log(`  Rate limited. Waiting ${retryAfter}s...`);
      await sleep(retryAfter * 1000);
      return this.request<T>(method, path, body, false);
    }

    if (!res.ok) {
      const text = await res.text();
      // Network/server error — one retry with 2s backoff
      if (res.status >= 500 && retry) {
        await sleep(2000);
        return this.request<T>(method, path, body, false);
      }
      throw new Error(`${method} ${path} → ${res.status}\n${text.slice(0, 500)}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) as T : null as T;
  }

  async getPage(pageId: string): Promise<ConfluencePage> {
    return this.request<ConfluencePage>('GET', `/api/v2/pages/${pageId}`);
  }

  async getChildren(parentId: string): Promise<ConfluencePage[]> {
    const results: ConfluencePage[] = [];
    let start = 0;

    while (true) {
      const res = await this.request<{ results: ConfluencePage[]; size: number }>('GET', `/rest/api/content/${parentId}/child/page?limit=250&start=${start}`);
      for (const p of res.results) {
        results.push({ id: p.id, title: p.title, status: (p as any).status ?? 'current' });
      }
      if (res.results.length < 250) break;
      start += 250;
    }

    return results;
  }

  async getDescendants(parentId: string): Promise<ConfluencePage[]> {
    // v2 descendants endpoint; recurse manually for depth
    const allPages: ConfluencePage[] = [];
    const queue = [parentId];

    while (queue.length > 0) {
      const id = queue.shift()!;
      const children = await this.getChildren(id);
      for (const child of children) {
        allPages.push(child);
        queue.push(child.id);
      }
    }

    return allPages;
  }

  async createPage(opts: {
    title: string;
    parentId: string;
    adfBody: string;
    spaceId?: string;
  }): Promise<ConfluencePage> {
    // We need the space ID. Get it from the parent page if not provided.
    let spaceId = opts.spaceId;
    if (!spaceId) {
      const parent = await this.request<{ spaceId: string }>('GET', `/api/v2/pages/${opts.parentId}`);
      spaceId = parent.spaceId;
    }

    return this.request<ConfluencePage>('POST', '/api/v2/pages', {
      spaceId,
      status: 'current',
      title: opts.title,
      parentId: opts.parentId,
      body: {
        representation: 'atlas_doc_format',
        value: opts.adfBody,
      },
    });
  }

  async updatePage(pageId: string, opts: {
    title: string;
    adfBody: string;
    version: number;
    parentId?: string;
  }): Promise<ConfluencePage> {
    const body: Record<string, unknown> = {
      id: pageId,
      status: 'current',
      title: opts.title,
      body: {
        representation: 'atlas_doc_format',
        value: opts.adfBody,
      },
      version: { number: opts.version },
    };
    if (opts.parentId) {
      body.parentId = opts.parentId;
    }
    return this.request<ConfluencePage>('PUT', `/api/v2/pages/${pageId}`, body);
  }

  async movePage(pageId: string, targetId: string, position: string): Promise<void> {
    await this.request<unknown>('PUT', `/rest/api/content/${pageId}/move/${position}/${targetId}`, '');
  }

  async deletePage(pageId: string): Promise<void> {
    await this.request<void>('DELETE', `/api/v2/pages/${pageId}`);
  }

  async getLabels(pageId: string): Promise<ConfluenceLabel[]> {
    const res = await this.request<{ results: ConfluenceLabel[] }>('GET', `/rest/api/content/${pageId}/label`);
    return res.results;
  }

  async addLabels(pageId: string, labels: string[]): Promise<void> {
    if (labels.length === 0) return;
    const body = labels.map(name => ({ prefix: 'global', name }));
    await this.request<unknown>('POST', `/rest/api/content/${pageId}/label`, body);
  }

  /** Delete all descendants of a page (for --wipe) */
  async wipeDescendants(parentId: string): Promise<number> {
    const descendants = await this.getDescendants(parentId);
    // Delete leaf-first (reverse of BFS order = children before parents)
    descendants.reverse();
    for (const page of descendants) {
      await this.deletePage(page.id);
    }
    return descendants.length;
  }

  async listAttachments(pageId: string): Promise<Array<{ id: string; fileId: string; title: string; comment: string }>> {
    const results: Array<{ id: string; fileId: string; title: string; comment: string }> = [];
    let start = 0;

    while (true) {
      const res = await this.request<{ results: Array<{ id: string; title: string; extensions?: { comment?: string; fileId?: string } }>; size: number }>(
        'GET',
        `/rest/api/content/${pageId}/child/attachment?limit=250&start=${start}`,
      );
      for (const att of res.results) {
        results.push({
          id: att.id,
          fileId: att.extensions?.fileId ?? att.id,
          title: att.title,
          comment: att.extensions?.comment ?? '',
        });
      }
      if (res.results.length < 250) break;
      start += 250;
    }

    return results;
  }

  async uploadAttachment(pageId: string, filename: string, buffer: Buffer, hash: string): Promise<string> {
    const url = `${this.baseUrl}/rest/api/content/${pageId}/child/attachment`;
    const mimeType = getMimeType(filename);

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    formData.append('file', blob, filename);
    formData.append('comment', hash);

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: this.auth,
        'X-Atlassian-Token': 'nocheck',
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`PUT ${url} → ${res.status}\n${text.slice(0, 500)}`);
    }

    const data = await res.json() as { results: Array<{ id: string; extensions?: { fileId?: string } }> };
    return data.results[0].extensions?.fileId ?? data.results[0].id;
  }

  async updateAttachmentData(pageId: string, attachmentId: string, filename: string, buffer: Buffer, hash: string): Promise<void> {
    const url = `${this.baseUrl}/rest/api/content/${pageId}/child/attachment/${attachmentId}/data`;
    const mimeType = getMimeType(filename);

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    formData.append('file', blob, filename);
    formData.append('comment', hash);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.auth,
        'X-Atlassian-Token': 'nocheck',
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`POST ${url} → ${res.status}\n${text.slice(0, 500)}`);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function getMimeType(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  return MIME_TYPES[ext] ?? 'application/octet-stream';
}
