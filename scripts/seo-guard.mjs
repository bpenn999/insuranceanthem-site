// seo-guard.mjs — runs after every `npm run build` (package.json "postbuild").
// Fails the build if a page would hurt rankings by looking like a duplicate:
//   1. an indexable page whose canonical is missing or points at a different URL
//      (11/2026: an NM post with no `path` prop declared itself a copy of the home page)
//   2. two indexable pages with the same <title>
//      (11/2026: two MOM posts titled "Will Selling My House Raise My Medicare Premiums in 2026?")
//   3. a blog/learn post sharing >= 35% of its text with another post
//      (10/2026: NM city clones knocked the Albuquerque winner out of Google)
// Fix the page; don't loosen the guard. Canonical source copy: ~/Claude/Projects/seo-guard.mjs
import fs from 'node:fs';
import path from 'node:path';

const DIST = process.argv[2] || 'dist';
const FAIL_OVERLAP = 0.35, WARN_OVERLAP = 0.30;
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!e.name.startsWith('_')) walk(p); }
    else if (e.name.endsWith('.html')) files.push(p);
  }
})(DIST);

const decode = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const pages = [];
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const robots = (html.match(/<meta[^>]+name=["']robots["'][^>]*>/i) || [''])[0];
  if (/noindex/i.test(robots)) continue;
  if (/http-equiv=["']refresh/i.test(html)) continue; // redirect stubs
  let rel = '/' + path.relative(DIST, f).split(path.sep).join('/');
  rel = rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
  if (rel === '/404/' || rel.startsWith('/404')) continue;
  const canon = (html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) || html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i) || [])[1];
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1]).trim();
  pages.push({ rel, html, canon, title });
}

const errors = [], warns = [];
const norm = (p) => (p.endsWith('/') ? p : p + '/');

// 1. canonical
for (const p of pages) {
  if (!p.canon) { errors.push(`NO CANONICAL: ${p.rel}`); continue; }
  let cp; try { cp = new URL(p.canon).pathname; } catch { errors.push(`BAD CANONICAL: ${p.rel} -> ${p.canon}`); continue; }
  if (norm(cp) !== norm(p.rel)) errors.push(`CANONICAL POINTS ELSEWHERE: ${p.rel} -> ${p.canon}  (blog/page missing its path prop?)`);
}

// 2. duplicate titles
const byTitle = new Map();
for (const p of pages) {
  const k = p.title.toLowerCase().replace(/\W+/g, ' ').trim();
  if (!k) { errors.push(`NO TITLE: ${p.rel}`); continue; }
  if (!byTitle.has(k)) byTitle.set(k, []);
  byTitle.get(k).push(p.rel);
}
for (const [t, rels] of byTitle) if (rels.length > 1) errors.push(`DUPLICATE TITLE "${t}": ${rels.join('  ')}`);

// 3. blog/learn text overlap (5-word shingles, site boilerplate removed)
const posts = pages.filter((p) => /^\/(blog|learn)\/[^/]+\/$/.test(p.rel));
const words = (html) => {
  let s = (html.match(/<article[\s\S]*?<\/article>/i) || html.match(/<main[\s\S]*?<\/main>/i) || [html])[0];
  s = s.replace(/<(script|style|form|nav)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ');
  return decode(s).toLowerCase().match(/[a-z0-9$']+/g) || [];
};
const S = new Map();
for (const p of posts) {
  const w = words(p.html);
  if (w.length < 200) continue;
  const set = new Set();
  for (let i = 0; i + 5 <= w.length; i++) set.add(w.slice(i, i + 5).join(' '));
  S.set(p.rel, set);
}
const df = new Map();
for (const s of S.values()) for (const x of s) df.set(x, (df.get(x) || 0) + 1);
const boilCut = Math.max(6, 0.12 * S.size);
for (const [k, s] of S) S.set(k, new Set([...s].filter((x) => df.get(x) <= boilCut)));
const keys = [...S.keys()];
for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
  const a = S.get(keys[i]), b = S.get(keys[j]);
  if (!a.size || !b.size) continue;
  const [sm, lg] = a.size < b.size ? [a, b] : [b, a];
  let n = 0; for (const x of sm) if (lg.has(x)) n++;
  const ov = n / sm.size;
  const line = `${Math.round(ov * 100)}% SAME TEXT: ${keys[i]}  <>  ${keys[j]}`;
  if (ov >= FAIL_OVERLAP) errors.push(line + '  (rewrite around what is different, or merge + 301)');
  else if (ov >= WARN_OVERLAP) warns.push(line);
}

for (const w of warns) console.warn('seo-guard WARN ' + w);
if (errors.length) {
  for (const e of errors) console.error('seo-guard FAIL ' + e);
  console.error(`seo-guard: ${errors.length} problem(s) in ${pages.length} indexable pages. Fix before deploying.`);
  process.exit(1);
}
console.log(`seo-guard: OK — ${pages.length} indexable pages, ${S.size} posts compared, canonicals + titles unique.`);
