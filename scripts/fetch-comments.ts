import { loadConfig } from '../src/lib/config.ts';
import { ConfluenceApi } from '../src/lib/api.ts';

const TARGET_AUTHOR_SUBSTR = (process.argv[2] ?? 'markus').toLowerCase();

const config = loadConfig();
const api = new ConfluenceApi(config);

const baseUrl = `${config.confluenceBaseUrl}/wiki`;
const auth = 'Basic ' + Buffer.from(`${config.atlassianUserName}:${config.atlassianApiToken}`).toString('base64');

async function req<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: auth, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}\n${(await res.text()).slice(0, 300)}`);
  return res.json() as Promise<T>;
}

interface CommentV2 {
  id: string;
  status: string;
  title?: string;
  pageId?: string;
  version?: { number: number; authorId?: string; createdAt?: string };
  body?: { storage?: { value: string }; atlas_doc_format?: { value: string } };
  resolutionStatus?: string;
}

interface User { accountId: string; publicName?: string; displayName?: string; email?: string }

const userCache = new Map<string, User>();
async function getUser(accountId: string): Promise<User> {
  if (userCache.has(accountId)) return userCache.get(accountId)!;
  try {
    const u = await req<User>(`/rest/api/user?accountId=${encodeURIComponent(accountId)}`);
    userCache.set(accountId, u);
    return u;
  } catch {
    const u = { accountId, displayName: '(unknown)' };
    userCache.set(accountId, u);
    return u;
  }
}

async function getCommentsForPage(pageId: string, kind: 'footer' | 'inline'): Promise<CommentV2[]> {
  const all: CommentV2[] = [];
  let cursor = '';
  while (true) {
    const qs = `limit=250&body-format=storage${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
    const res = await req<{ results: CommentV2[]; _links?: { next?: string } }>(
      `/api/v2/pages/${pageId}/${kind}-comments?${qs}`,
    );
    all.push(...res.results);
    const next = res._links?.next;
    if (!next) break;
    const m = next.match(/cursor=([^&]+)/);
    if (!m) break;
    cursor = decodeURIComponent(m[1]);
  }
  return all;
}

function stripHtml(s: string): string {
  return s
    .replace(/<ac:[^>]+>/g, '')
    .replace(/<\/ac:[^>]+>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  console.log(`Discovering pages under parent ${config.confluenceParentId}...`);
  const root = await api.getPage(config.confluenceParentId);
  const descendants = await api.getDescendants(config.confluenceParentId);
  const pages = [{ id: root.id, title: root.title, status: 'current' }, ...descendants];
  console.log(`Found ${pages.length} pages. Scanning comments...`);

  const matches: Array<{ page: { id: string; title: string }; kind: string; comment: CommentV2; author: User }> = [];

  let scanned = 0;
  for (const p of pages) {
    scanned++;
    for (const kind of ['footer', 'inline'] as const) {
      let comments: CommentV2[] = [];
      try {
        comments = await getCommentsForPage(p.id, kind);
      } catch (e) {
        console.error(`  [${p.title}] ${kind}-comments error:`, (e as Error).message);
        continue;
      }
      for (const c of comments) {
        const authorId = c.version?.authorId;
        if (!authorId) continue;
        const u = await getUser(authorId);
        const name = (u.displayName ?? u.publicName ?? '').toLowerCase();
        if (name.includes(TARGET_AUTHOR_SUBSTR)) {
          matches.push({ page: { id: p.id, title: p.title }, kind, comment: c, author: u });
        }
      }
    }
    if (scanned % 10 === 0) console.log(`  scanned ${scanned}/${pages.length}`);
  }

  console.log(`\n=== ${matches.length} comments by "${TARGET_AUTHOR_SUBSTR}" ===\n`);
  for (const m of matches) {
    const text = stripHtml(m.comment.body?.storage?.value ?? '');
    console.log(`--- [${m.kind}] on "${m.page.title}" (page ${m.page.id}) by ${m.author.displayName} @ ${m.comment.version?.createdAt} ${m.comment.resolutionStatus ? `[${m.comment.resolutionStatus}]` : ''}`);
    console.log(text);
    console.log();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
