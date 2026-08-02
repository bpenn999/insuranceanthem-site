import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = process.env.DIST || 'dist';
const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};
const files = walk(DIST);
const htmls = files.filter(f => f.endsWith('.html'));
const routeOf = f => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g,'/');
const routes = new Set(htmls.map(routeOf));
const assets = new Set(files.map(f => '/' + relative(DIST, f).replace(/\\/g,'/')));

let problems = [];
const note = (m) => problems.push(m);

console.log(`Pages built: ${htmls.length}`);
console.log(`Routes: ${[...routes].sort().join('\n        ')}\n`);

// ── 1. internal links resolve ────────────────────────────────────────────────
const linkRe = /href="(\/[^"#?]*)"/g;
const seen = new Map();
for (const f of htmls) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(linkRe)) {
    const href = m[1];
    if (routes.has(href) || assets.has(href)) continue;
    if (href === '/sitemap-index.xml' && assets.has('/sitemap-index.xml')) continue;
    seen.set(href, (seen.get(href) || 0) + 1);
    note(`BROKEN LINK  ${href}  (in ${routeOf(f)})`);
  }
}

// ── 2. compliance on every page ──────────────────────────────────────────────
const MUST = [
  ['TPMO disclaimer', 'We do not offer every plan available in your area'],
  ['Medicare.gov / 1-800 referral', '1-800-MEDICARE'],
  ['non-affiliation', 'not connected with or endorsed by the United States government'],
  ['NPN', '8206556'],
];
for (const f of htmls) {
  const html = readFileSync(f, 'utf8');
  for (const [label, needle] of MUST) {
    if (!html.includes(needle)) note(`MISSING ${label.padEnd(28)} on ${routeOf(f)}`);
  }
}

// ── 3. SHIP must NOT appear in the disclaimer (CY2027 rule) ──────────────────
for (const f of htmls) {
  const html = readFileSync(f, 'utf8');
  if (/State Health Insurance (Assistance )?Program|\bSHIP\b/.test(html)) {
    note(`SHIP REFERENCE resurfaced on ${routeOf(f)}`);
  }
}

// ── 4. no ACA / marketplace anywhere ─────────────────────────────────────────
const BANNED = [/\bACA\b/, /Affordable Care Act/i, /health(care)?\.gov/i, /marketplace plan/i, /obamacare/i];
for (const f of htmls) {
  const html = readFileSync(f, 'utf8');
  for (const re of BANNED) if (re.test(html)) note(`ACA REFERENCE ${re} on ${routeOf(f)}`);
}

// ── 5. no template residue from other markets ────────────────────────────────
const RESIDUE = [/Western Slope/i, /Grand Junction/i, /\bMoab\b/i, /Palisade/i, /Montrose/i,
  /Albuquerque/i, /New Mexico/i, /Medicare On Main/i, /medicareonmain/i, /Bemis/i, /\bUtah\b/i,
  /Colorado/i, /lorem ipsum/i, /TODO|FIXME|XXX/];
for (const f of htmls) {
  const html = readFileSync(f, 'utf8');
  for (const re of RESIDUE) if (re.test(html)) note(`TEMPLATE RESIDUE ${re} on ${routeOf(f)}`);
}

// ── 6. every page has title, description, canonical, one h1 ──────────────────
for (const f of htmls) {
  const html = readFileSync(f, 'utf8');
  const r = routeOf(f);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) note(`NO TITLE on ${r}`);
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) note(`WEAK DESCRIPTION on ${r}`);
  if (!/<link rel="canonical" href="https:\/\/insuranceanthem\.com/.test(html)) note(`NO CANONICAL on ${r}`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) note(`${h1s} <h1> on ${r}`);
  if (!/application\/ld\+json/.test(html)) note(`NO JSON-LD on ${r}`);
}

// ── 7. phone number consistency (one source of truth) ────────────────────────
const phones = new Set();
for (const f of htmls) {
  for (const m of readFileSync(f,'utf8').matchAll(/\(\d{3}\)\s?\d{3}-\d{4}/g)) phones.add(m[0]);
}
console.log(`Phone strings found: ${[...phones].join(', ')}`);
if (phones.size > 1) note(`MULTIPLE PHONE NUMBERS: ${[...phones].join(', ')}`);

// ── 8. sitemap covers every route (the orphan-page trap) ─────────────────────
const smIndex = readFileSync(join(DIST,'sitemap-index.xml'),'utf8');
const smFiles = [...smIndex.matchAll(/<loc>[^<]*\/(sitemap-\d+\.xml)<\/loc>/g)].map(m=>m[1]);
const smUrls = new Set();
for (const sf of smFiles) {
  for (const m of readFileSync(join(DIST,sf),'utf8').matchAll(/<loc>https:\/\/insuranceanthem\.com([^<]*)<\/loc>/g)) {
    smUrls.add(m[1] || '/');
  }
}
console.log(`Sitemap URLs: ${smUrls.size}`);
const EXPECT_ABSENT = new Set(['/404.html','/404/']);
for (const r of routes) {
  if (EXPECT_ABSENT.has(r)) continue;
  if (!smUrls.has(r)) note(`NOT IN SITEMAP  ${r}`);
}
for (const u of smUrls) if (!routes.has(u)) note(`SITEMAP URL WITH NO PAGE  ${u}`);

// ── 9. orphan static HTML under public/ ──────────────────────────────────────
try {
  const pub = walk('public').filter(f => f.endsWith('.html'));
  if (pub.length) note(`ORPHAN public/ HTML (invisible to the sitemap): ${pub.join(', ')}`);
} catch {}

// ── 10. reduced-motion + noscript safety net present ─────────────────────────
const css = files.filter(f => f.endsWith('.css')).map(f => readFileSync(f,'utf8')).join('');
const inlineCss = htmls.map(f => readFileSync(f,'utf8')).join('');
const allCss = css + inlineCss;
if (!/prefers-reduced-motion/.test(allCss)) note('NO prefers-reduced-motion RULES SHIPPED');
if (!/html:not\(\.motion\)/.test(allCss)) note('NO no-JS FALLBACK RULES SHIPPED');

console.log('\n' + '─'.repeat(70));
if (problems.length === 0) console.log('✅ All checks passed.');
else { console.log(`❌ ${problems.length} problem(s):\n`); for (const p of problems) console.log('  ' + p); }
