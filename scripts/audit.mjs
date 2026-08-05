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
  if (!/<link rel="canonical" href="https:\/\/602medicare\.com/.test(html)) note(`NO CANONICAL on ${r}`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) note(`${h1s} <h1> on ${r}`);
  if (!/application\/ld\+json/.test(html)) note(`NO JSON-LD on ${r}`);
}

// ── 6a. parse the sitemap (needed by the Learn checks below) ─────────────────
const smIndex = readFileSync(join(DIST, 'sitemap-index.xml'), 'utf8');
const smFiles = [...smIndex.matchAll(/<loc>[^<]*\/(sitemap-\d+\.xml)<\/loc>/g)].map((m) => m[1]);
const smUrls = new Set();
for (const sf of smFiles) {
  for (const m of readFileSync(join(DIST, sf), 'utf8')
    .matchAll(/<loc>https:\/\/602medicare\.com([^<]*)<\/loc>/g)) {
    smUrls.add(m[1] || '/');
  }
}

// ── 6b. the Learn hub and every article in it ────────────────────────────────
// The hub is data-driven, so these checks verify the *derived* output rather
// than a hand-maintained list: whatever is in src/content/learn/ must appear on
// the hub, have its own route, and carry the full structured-data stack.
{
  const learnDir = 'src/content/learn';
  let sources = [];
  try {
    sources = readdirSync(learnDir).filter((f) => f.endsWith('.md'));
  } catch {
    note('MISSING src/content/learn — the Learn collection has no source files');
  }

  const slugs = sources.map((f) => f.replace(/\.md$/, ''));
  console.log(`Learn articles in source: ${slugs.length}`);

  if (!routes.has('/learn/')) note('NO /learn/ HUB PAGE BUILT');

  const hubPath = join(DIST, 'learn', 'index.html');
  let hub = '';
  try { hub = readFileSync(hubPath, 'utf8'); } catch { /* reported above */ }

  for (const slug of slugs) {
    const route = `/learn/${slug}/`;

    // 1. the article built at all
    if (!routes.has(route)) { note(`LEARN ARTICLE NOT BUILT  ${route}`); continue; }

    // 2. it is linked from the hub — a post nobody can reach is not published
    if (hub && !hub.includes(`href="${route}"`)) {
      note(`NOT LINKED FROM THE HUB  ${route}`);
    }

    // 3. it is in the sitemap
    if (!smUrls.has(route)) note(`LEARN ARTICLE NOT IN SITEMAP  ${route}`);

    const html = readFileSync(join(DIST, 'learn', slug, 'index.html'), 'utf8');

    // 4. Article + FAQPage structured data
    if (!html.includes('"@type":"Article"')) note(`NO Article SCHEMA on ${route}`);
    if (!html.includes('"@type":"FAQPage"')) note(`NO FAQPage SCHEMA on ${route}`);
    if (!html.includes('"@type":"BreadcrumbList"')) note(`NO BreadcrumbList SCHEMA on ${route}`);

    // 5. SEO field limits — Google truncates beyond these
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    const bare = title.replace(/\s*\|\s*602Medicare\s*$/, '');
    if (bare.length > 60) note(`SEO TITLE ${bare.length} chars (>60) on ${route}`);
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
    if (desc.length > 155) note(`META DESCRIPTION ${desc.length} chars (>155) on ${route}`);

    // 6. internal links to product and tool pages — the whole point of the hub
    //    is to route readers toward the pages that answer their next question
    const productLinks = [...html.matchAll(/href="\/(medicare-advantage|medicare-supplement|part-d|long-term-care)\//g)];
    const toolLinks = [...html.matchAll(/href="\/tools\/[a-z-]+\//g)];
    if (productLinks.length === 0) note(`NO PRODUCT PAGE LINKS on ${route}`);
    if (toolLinks.length === 0) note(`NO TOOL LINKS on ${route}`);

    // 7. the booking CTA
    if (!html.includes('15-minute')) note(`NO 15-MINUTE CALL CTA on ${route}`);

    // 8. year-stamped figures, and no unresolved figure tokens
    if (/\{\{[a-zA-Z]/.test(html)) note(`UNRESOLVED FIGURE TOKEN on ${route}`);

    // 9. substance — the brief called for 1,500+ words
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ');
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < 1200) note(`THIN CONTENT ${words} words on ${route}`);
  }

  // Nothing should be published under /learn/ that has no source file — that is
  // the orphan-page class of bug, invisible to any crawl-based audit.
  for (const r of routes) {
    if (!r.startsWith('/learn/') || r === '/learn/') continue;
    const slug = r.slice('/learn/'.length).replace(/\/$/, '');
    if (!slugs.includes(slug)) note(`ORPHAN LEARN ROUTE with no source file  ${r}`);
  }

  // The hub must be reachable from the global nav, or it may as well not exist.
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  if (!home.includes('href="/learn/"')) note('LEARN NOT LINKED FROM THE HOME PAGE NAV/FOOTER');

  // The old hub must not still be live alongside the new one.
  if (routes.has('/articles/')) note('BOTH /articles/ AND /learn/ ARE LIVE — two competing hubs');
}

// ── 6c. the footer, on every single page ─────────────────────────────────────
// The footer is where the compliance obligations live, so "present on most
// pages" is not good enough — it has to be identical and complete everywhere.
{
  const TOOL_SLUGS = [
    'plan-type-finder', 'enrollment-timeline', 'medicare-cost-estimator', 'irmaa-estimator',
    'plan-g-vs-plan-n', 'part-b-giveback', 'part-a-premium', 'cost-of-care',
  ];
  const PRODUCT_SLUGS = ['medicare-advantage', 'medicare-supplement', 'part-d', 'long-term-care'];
  const COMPANY_LINKS = ['/about/', '/contact/', '/accessibility/', '/privacy/', '/terms/'];

  for (const f of htmls) {
    const html = readFileSync(f, 'utf8');
    const r = routeOf(f);

    const footer = html.slice(html.indexOf('<footer'));
    if (!footer.startsWith('<footer')) { note(`NO FOOTER on ${r}`); continue; }

    // Brand block
    if (!footer.includes('602Medicare')) note(`FOOTER: no wordmark on ${r}`);
    if (!footer.includes('Brian Penner')) note(`FOOTER: no agent name on ${r}`);
    if (!footer.includes('22+ Years')) note(`FOOTER: no experience line on ${r}`);
    if (!footer.includes('NPN 8206556')) note(`FOOTER: no NPN on ${r}`);

    // NAP block — one office
    if (!footer.includes('Anthem, AZ 85086')) note(`FOOTER: no address on ${r}`);
    if (!footer.includes('(602) 555-0100')) note(`FOOTER: no phone on ${r}`);
    if (!footer.includes('brian@602medicare.com')) note(`FOOTER: no email on ${r}`);

    // The other brand's offices must never appear here.
    for (const city of ['Moab', 'Monticello', 'Grand Junction']) {
      if (footer.includes(city)) note(`FOOTER: WRONG-BRAND OFFICE "${city}" on ${r}`);
    }

    // Sitemap columns
    for (const s of PRODUCT_SLUGS) {
      if (!footer.includes(`href="/${s}/"`)) note(`FOOTER: missing service link /${s}/ on ${r}`);
    }
    if (!footer.includes('href="/learn/"')) note(`FOOTER: missing Learn hub link on ${r}`);
    if (!footer.includes('href="/tools/"')) note(`FOOTER: missing Tools hub link on ${r}`);
    for (const s of TOOL_SLUGS) {
      if (!footer.includes(`href="/tools/${s}/"`)) note(`FOOTER: missing tool link ${s} on ${r}`);
    }
    for (const l of COMPANY_LINKS) {
      if (!footer.includes(`href="${l}"`)) note(`FOOTER: missing company link ${l} on ${r}`);
    }
    // At least one Learn article, so the column is not just the hub link.
    if (!/href="\/learn\/[a-z0-9-]+\//.test(footer)) {
      note(`FOOTER: no Learn articles listed on ${r}`);
    }

    // CTA row
    if (!footer.includes('15-minute')) note(`FOOTER: no 15-minute call CTA on ${r}`);

    // Compliance block
    if (!footer.includes('Licensed in 18 states')) note(`FOOTER: no licensing line on ${r}`);
    if (!/&copy; 2026|© 2026/.test(footer)) note(`FOOTER: no 2026 copyright on ${r}`);
  }

  // ── the TPMO disclaimer: exactly once per page, in the footer ──────────────
  const TPMO = 'We do not offer every plan available in your area';
  const NONAFF = 'not connected with or endorsed by the United States government';
  for (const f of htmls) {
    const html = readFileSync(f, 'utf8');
    const r = routeOf(f);

    const tpmoCount = html.split(TPMO).length - 1;
    if (tpmoCount === 0) note(`NO TPMO DISCLAIMER on ${r}`);
    else if (tpmoCount > 1) note(`TPMO DISCLAIMER x${tpmoCount} on ${r} — must appear exactly once`);

    const nonAffCount = html.split(NONAFF).length - 1;
    if (nonAffCount === 0) note(`NO NON-AFFILIATION STATEMENT on ${r}`);
    else if (nonAffCount > 1) note(`NON-AFFILIATION x${nonAffCount} on ${r} — must appear exactly once`);

    // And it must be inside the footer, not floating in page content.
    const footerStart = html.indexOf('<footer');
    if (tpmoCount === 1 && html.indexOf(TPMO) < footerStart) {
      note(`TPMO DISCLAIMER IS OUTSIDE THE FOOTER on ${r}`);
    }
  }
}

// ── 6d. every tool builds, is linked, and behaves like a tool ────────────────
{
  const TOOLS = [
    'plan-type-finder', 'enrollment-timeline', 'medicare-cost-estimator', 'irmaa-estimator',
    'plan-g-vs-plan-n', 'part-b-giveback', 'part-a-premium', 'cost-of-care',
  ];
  console.log(`Tools expected: ${TOOLS.length}`);

  const hub = readFileSync(join(DIST, 'tools', 'index.html'), 'utf8');

  for (const slug of TOOLS) {
    const route = `/tools/${slug}/`;
    if (!routes.has(route)) { note(`TOOL NOT BUILT  ${route}`); continue; }
    if (!hub.includes(`href="${route}"`)) note(`TOOL NOT ON THE HUB GRID  ${route}`);
    if (!smUrls.has(route)) note(`TOOL NOT IN SITEMAP  ${route}`);

    const html = readFileSync(join(DIST, 'tools', slug, 'index.html'), 'utf8');

    if (!html.includes('"@type":"WebApplication"')) note(`NO WebApplication SCHEMA on ${route}`);
    if (!html.includes('"@type":"BreadcrumbList"')) note(`NO BreadcrumbList SCHEMA on ${route}`);
    if (!/class="crumbs"/.test(html)) note(`NO RENDERED BREADCRUMBS on ${route}`);

    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    if (title.length < 15) note(`WEAK SEO TITLE on ${route}`);
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
    if (desc.length < 50) note(`WEAK META DESCRIPTION on ${route}`);

    // Bottom CTA to the booking link
    if (!html.includes('15-minute')) note(`NO 15-MINUTE CALL CTA on ${route}`);

    // Year-stamped and estimate-framed — these are the compliance guardrails
    if (!/\b2026\b/.test(html)) note(`NOT YEAR-STAMPED on ${route}`);
    if (!/estimate|Estimate/.test(html)) note(`NOT ESTIMATE-FRAMED on ${route}`);
    if (!/noscript/.test(html)) note(`NO NOSCRIPT FALLBACK on ${route}`);

    // A calculator must not name a carrier or product.
    const CARRIERS = /\b(Humana|Aetna|UnitedHealthcare|UnitedHealth|Cigna|Wellcare|Anthem Blue|Blue Cross|Devoted Health|Alignment Health)\b/;
    if (CARRIERS.test(html.replace(/602Medicare/g, ''))) {
      note(`CARRIER NAMED on ${route}`);
    }
  }

  // Nothing under /tools/ that is not a registered tool.
  for (const r of routes) {
    if (!r.startsWith('/tools/') || r === '/tools/') continue;
    const slug = r.slice('/tools/'.length).replace(/\/$/, '');
    if (!TOOLS.includes(slug)) note(`ORPHAN TOOL ROUTE  ${r}`);
  }
}

// ── 6e. every service-area city builds and is wired in ───────────────────────
// Same shape as the tools check above: the pages are generated from
// src/data/locations.ts, so this asserts the derived output rather than a
// hand-kept list. Glendale and Peoria are named explicitly because they carry
// the Phoenix-metro positioning — losing either would quietly shrink the brand
// back to a four-community north-valley agency.
{
  const CITIES = [
    ['anthem-az', 'Anthem'],
    ['glendale-az', 'Glendale'],
    ['peoria-az', 'Peoria'],
    ['phoenix-85086', 'North Phoenix'],
    ['carefree-az', 'Carefree'],
    ['new-river-az', 'New River'],
  ];
  console.log(`Service-area cities expected: ${CITIES.length}`);

  const hub = readFileSync(join(DIST, 'service-area', 'index.html'), 'utf8');

  for (const [slug, city] of CITIES) {
    const route = `/service-area/${slug}/`;
    if (!routes.has(route)) { note(`SERVICE AREA PAGE NOT BUILT  ${route}`); continue; }
    if (!hub.includes(`href="${route}"`)) note(`CITY NOT ON THE SERVICE-AREA HUB  ${route}`);
    if (!smUrls.has(route)) note(`CITY NOT IN SITEMAP  ${route}`);

    const html = readFileSync(join(DIST, 'service-area', slug, 'index.html'), 'utf8');

    if (!html.includes('"@type":"Service"')) note(`NO Service SCHEMA on ${route}`);
    if (!html.includes('"@type":"FAQPage"')) note(`NO FAQPage SCHEMA on ${route}`);
    if (!html.includes('"@type":"BreadcrumbList"')) note(`NO BreadcrumbList SCHEMA on ${route}`);
    if (!/class="crumbs"/.test(html)) note(`NO RENDERED BREADCRUMBS on ${route}`);
    // The h1 is rendered per-glyph by <Kinetic>, so match on the page text
    // rather than trying to read the heading's markup.
    if (!html.includes(city)) note(`CITY NAME MISSING on ${route}`);

    // areaServed must list every city on every page — it is the LocalBusiness
    // node, not a per-page one, so a city missing here is a data-file bug.
    for (const [, other] of CITIES) {
      if (!html.includes(`"name":"${other}"`)) note(`areaServed MISSING "${other}" on ${route}`);
    }

    // Cross-links to the other cities, so the cluster is navigable.
    const nearby = [...html.matchAll(/href="\/service-area\/[a-z0-9-]+\//g)].length;
    if (nearby < CITIES.length) note(`WEAK CITY CROSS-LINKING (${nearby}) on ${route}`);

    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ');
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < 500) note(`THIN CITY PAGE ${words} words on ${route}`);
  }

  // Nothing under /service-area/ that is not a registered city.
  for (const r of routes) {
    if (!r.startsWith('/service-area/') || r === '/service-area/') continue;
    const slug = r.slice('/service-area/'.length).replace(/\/$/, '');
    if (!CITIES.some(([s]) => s === slug)) note(`ORPHAN SERVICE-AREA ROUTE  ${r}`);
  }
}

// ── 6f. the rebrand left nothing behind ──────────────────────────────────────
// A rebrand is the one change that fails silently: a stale name in a single
// meta tag or JSON-LD node reads fine on screen and poisons every downstream
// consumer of it. Assert the absence directly.
{
  const DEAD = [/Daisy Mountain/i, /daisymountain/i, /Insurance Anthem/i, /insuranceanthem/i,
    /\(623\)/, /623-555/];
  for (const f of files.filter((x) => /\.(html|xml|txt|json|webmanifest)$/.test(x))) {
    const body = readFileSync(f, 'utf8');
    for (const re of DEAD) {
      if (re.test(body)) note(`RETIRED BRAND STRING ${re} in ${'/' + relative(DIST, f)}`);
    }
  }
}

// ── 7. phone number consistency (one source of truth) ────────────────────────
const phones = new Set();
for (const f of htmls) {
  for (const m of readFileSync(f,'utf8').matchAll(/\(\d{3}\)\s?\d{3}-\d{4}/g)) phones.add(m[0]);
}
console.log(`Phone strings found: ${[...phones].join(', ')}`);
if (phones.size > 1) note(`MULTIPLE PHONE NUMBERS: ${[...phones].join(', ')}`);

// ── 8. sitemap covers every route (the orphan-page trap) ─────────────────────
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
