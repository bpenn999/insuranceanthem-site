/**
 * Check that every `.gov` / `.mil` source cited on a city page still resolves.
 *
 * WHY THIS IS A SEPARATE SCRIPT AND NOT PART OF `npm run verify`:
 * it needs the network, and the build gate must not fail because medicare.gov
 * is having a bad afternoon. A citation rotting is a real problem, but it is a
 * next-morning problem, not a stop-the-deploy one.
 *
 * WHY IT EXISTS AT ALL: of the fifteen source URLs written on 2026-08-18, SIX
 * were 404 on first check — plausible-looking medicare.gov paths that simply
 * are not the ones medicare.gov uses. A citation that 404s is worse than no
 * citation: it is the page telling a reader "here is the proof" and handing
 * them an error, on exactly the claims (the Part B penalty, the custodial-care
 * gap, IRMAA) where being trusted is the whole point. CMS also reorganises that
 * site periodically, so today's working link is not permanently a working link.
 *
 * Run it after editing `sources` in locations.ts, and every few months:
 *
 *   node scripts/check-source-links.mjs
 *
 * Exit 1 on any hard failure (404/410/5xx or a dead host), 0 otherwise.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { locations } from '../src/data/locations.ts';
import { products } from '../src/data/products.ts';

/**
 * Learn-article sources, read straight out of the markdown frontmatter rather
 * than through astro:content — this script runs outside Astro, so the content
 * collection is not loadable here. The shape is fixed by the zod schema in
 * src/content.config.ts, so a crude parse is safe: anything malformed fails the
 * build long before it reaches this script.
 */
function learnSources() {
  const dir = 'src/content/learn';
  const out = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const fm = readFileSync(`${dir}/${file}`, 'utf8').split('\n---')[0];
    const urls = [...fm.matchAll(/^\s+url:\s*"([^"]+)"/gm)].map((m) => m[1]);
    if (urls.length) out.push({ slug: `learn/${file.replace(/\.md$/, '')}`, urls });
  }
  return out;
}

/**
 * Hosts whose WAF answers a script with 403 whether or not the page exists.
 * A 403 from one of these means "cannot be checked from here", NOT "broken" —
 * failing the run on it would train whoever reads this output to ignore the
 * output, which is how a genuine 404 gets through.
 *
 * ssa.gov is listed because it 403s `curl` on both cited URLs. It does NOT 403
 * Node's fetch, which gets 200 on both — so this entry currently never fires
 * and both SSA citations are machine-verified like the rest. It stays as a
 * guard: the difference is a header or TLS-fingerprint quirk on their side,
 * not a promise, and the failure mode it prevents is silent.
 */
const BOT_BLOCKED = new Set(['www.ssa.gov', 'ssa.gov']);

const seen = new Map(); // url -> [slug, …], so a shared URL is fetched once
const add = (url, slug) => {
  if (!seen.has(url)) seen.set(url, []);
  seen.get(url).push(slug);
};
for (const l of locations) for (const s of l.sources) add(s.url, l.slug);
for (const p of products) for (const s of p.sources) add(s.url, p.slug);
for (const a of learnSources()) for (const u of a.urls) add(u, a.slug);

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';

let broken = 0;
let unverifiable = 0;

const learnCount = learnSources().length;
console.log(
  `Checking ${seen.size} unique source URLs across ${locations.length} city pages, ` +
  `${products.length} product pages and ${learnCount} Learn articles…\n`,
);

for (const [url, slugs] of [...seen].sort()) {
  const host = new URL(url).hostname;
  let status;
  try {
    // GET, not HEAD: medicare.gov answers 403 to HEAD on pages that serve 200
    // to GET, which would have produced a page of false alarms.
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml,application/pdf' },
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
    });
    status = res.status;
  } catch (err) {
    status = `ERR ${err.name}`;
  }

  const where = slugs.join(', ');
  if (status === 200) {
    console.log(`  200  ${url}`);
  } else if (status === 403 && BOT_BLOCKED.has(host)) {
    unverifiable++;
    console.log(`  403  ${url}  — ${host} blocks scripts; VERIFY BY HAND  (${where})`);
  } else {
    broken++;
    console.log(`  ${status}  ${url}  ← BROKEN, cited on: ${where}`);
  }
}

console.log('');
if (unverifiable) console.log(`${unverifiable} URL(s) need a manual check (bot-blocked host).`);
if (broken) {
  console.log(`❌ ${broken} broken source link(s). Fix them in src/data/locations.ts.`);
  process.exit(1);
}
console.log('✅ Every checkable source link resolves.');
