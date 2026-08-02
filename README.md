# insuranceanthem-site

Insurance Anthem — Medicare agency website for Brian Penner, Anthem AZ 85086.

Astro 7, static output, deploy-ready for Cloudflare Pages. No `wrangler.toml` — Pages
builds from the repo.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → /dist
npm run verify     # typecheck + unit tests + build + built-output audit
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Static build to `/dist` |
| `npm run preview` | Serve `/dist` locally |
| `npm run check` | `astro check` — 0 errors, 0 warnings, 0 hints expected |
| `npm test` | Unit tests for the enrollment, IRMAA, Part A and care-cost figures (`node:test`) |
| `npm run audit` | Audits `/dist`: broken links, compliance text, sitemap coverage, template residue |
| `npm run e2e` | Headless-Chrome checks of every tool, the Learn hub and every article. Needs `npm run preview` on **:4331** first |
| `npm run verify` | check → test → build → audit |

`npm run e2e` drives Chrome over the DevTools Protocol with zero dependencies.
Override the browser with `CHROME=/path/to/chrome npm run e2e`.

---

## Deploying to Cloudflare Pages

**Build configuration**

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20 or newer (`NODE_VERSION` env var) |

**Custom domain.** Add `insuranceanthem.com` and `www.insuranceanthem.com` in
Pages → Custom domains, then add a redirect rule so `www` and `http` both 301 to
the apex. `astro.config.mjs` sets `site: 'https://insuranceanthem.com'` and every
canonical URL, `og:url` and schema `@id` derives from it, so the apex must be the
one that serves.

**Headers.** `public/_headers` ships a CSP, HSTS, and immutable caching for
fingerprinted assets. Pages applies it automatically — no extra config.

---

## Change the phone number (and everything else)

Every agency fact lives in **`src/config/site.ts`**. Nothing is hard-coded anywhere else.

```ts
const PHONE_RAW = '6235550100';  // ← PLACEHOLDER (623) 555-0100
```

Change that one string and the display format, the `tel:` links, the schema
`telephone`, the footer, the header, every CTA and every page's meta description
all update together. Same for `email`, `agent.npn`, `agent.experience`,
`address` and `serviceArea`.

> The phone number currently in the repo is a **placeholder**. Swap it before launch.

### Wiring up lead capture

The contact form and hero funnel have no backend — this is a static site, so
rather than pretending to submit, the form composes a prefilled email to
`site.email`. To send leads somewhere real:

1. Set `leadEndpoint` in `src/config/site.ts` to your URL (a GHL inbound
   webhook, a Pages Function at `/api/lead`, Formspree, …).
2. If that endpoint is on **another origin**, widen `connect-src` in
   `public/_headers` — the current CSP is `connect-src 'self'` and will block it.

Both the form and the funnel then POST JSON automatically. The form falls back
to the email hand-off if the endpoint errors, so an enquiry is never silently lost.

---

## Adding a Learn article

Drop a `.md` file into `src/content/learn/`. That is the whole process — the hub
card, the route, the Article + FAQPage + BreadcrumbList JSON-LD, the breadcrumbs,
the category chip, the related-reading block and the sitemap entry all generate
from frontmatter. No code changes.

```yaml
---
title: "Full headline, written for humans"
seoTitle: "≤60 chars — the <title> tag"          # build fails over 60
description: "≤155 chars — the meta description"  # build fails over 155
summary: "Card excerpt on the hub and the lede under the H1."
category: "Part D"        # one of the six in src/content.config.ts
publishedAt: 2026-08-02
readMinutes: 9
featured: false           # pins to the top of the hub
relatedProducts: [part-d, medicare-supplement]   # slugs from products.ts
relatedTools: [medicare-cost-estimator]          # slugs from tools.ts
faqs:                     # 2+ entries → FAQPage schema; omit to skip
  - q: "A question people actually ask"
    a: "A complete answer, because this is what Google may quote."
---
```

**Never type a dollar figure.** Use a token and it stays correct forever:

| Token | Renders |
| --- | --- |
| `{{year}}` | the current plan year |
| `{{partB.premium}}` | the standard Part B premium |
| `{{partB.deductible}}` | the Part B deductible |
| `{{partA.deductible}}` | the Part A hospital deductible |
| `{{partD.cap}}` | the Part D out-of-pocket cap |
| `{{irmaa.singleStart}}` | the first IRMAA threshold, single |
| `{{irmaa.t1.partB}}` | tier-1 Part B total |

The full list is in `plugins/remark-medicare-figures.mjs`. An unknown token
**fails the build** rather than shipping `{{typo}}` to a live page.

`npm run audit` then checks every article for the schema stack, the SEO field
limits, links to at least one product page and one tool, the booking CTA, and
that nothing is published under `/learn/` without a source file.

> `/articles/` was the original hub. It was consolidated into `/learn/` so the
> site has one place to read rather than two; `public/_redirects` 301s the old
> URLs. To split them apart again, restore `src/pages/articles/` and drop those
> redirect lines.

## The annual update

**`src/data/medicare-figures.ts` is the only place dollar figures live.**

CMS publishes the following plan year's Part A and Part B premiums and
deductibles in **mid-November**. When they do, update that one file and every
tool, article and page picks up the new numbers.

Current data is **CY2026**, verified 2026-08-02 against the CMS 2026 Parts A & B
fact sheet (released 2025-11-14) and the published 2026 IRMAA tables. The unit
tests in `test/logic.test.mjs` assert those exact figures, so a stale or
mistyped edit fails `npm test` rather than shipping.

Two non-CMS datasets also live there and update on their own cadence:

- **Medigap Plan G/N cost sharing** — standardised by federal law, so it only
  changes when the benefit design does.
- **`careCosts`** — CareScout (Genworth) Cost of Care Survey, fielded 2025 and
  published March 2026. A new edition lands roughly annually.

`src/data/compliance.ts` holds the TPMO disclaimer. It follows the **CY2027**
final rule — the SHIP reference is deliberately removed. Do not re-add it; the
audit script fails if it reappears.

---

## Layout

```
src/
  config/site.ts          ← ALL agency facts. One phone number, one NPN, one address.
  data/
    medicare-figures.ts   ← ALL dollar figures + IRMAA brackets. Annual update.
    enrollment.ts         ← Enrollment-window date maths (unit tested)
    compliance.ts         ← TPMO disclaimer, non-affiliation, NPN line
    products.ts           ← The 4 product lines → 4 generated pages
    locations.ts          ← Service area → 4 generated pages
    tools.ts              ← Free-tools registry
    faqs.ts, testimonials.ts
  scripts/motion.ts       ← The whole motion engine. ONE rAF loop per page.
  styles/global.css       ← Porcelain design system + the motion/reduced-motion layer
  components/             ← Kinetic, HeroFunnel, LeadForm, Schema, Header, Footer, …
  layouts/                ← BaseLayout, ToolLayout, LegalLayout
  pages/                  ← 38 routes
  content/learn/          ← Markdown articles (drop-in; see below)
  pages/learn/            ← Hub + [...slug] route, both fully data-driven
plugins/                  ← remark plugin: {{figure}} tokens → real numbers
test/logic.test.mjs       ← 55 unit tests
scripts/audit.mjs         ← Built-output audit
scripts/e2e.mjs           ← 323 headless-browser checks
```

Adding a product, a service-area city or a tool means adding one entry to the
matching data file — the route, nav entry, footer link, schema and cross-links
all generate from it.

---

## Motion

Every page runs **one** `requestAnimationFrame` loop (`src/scripts/motion.ts`),
which drives the caustics canvas, the scroll-progress bar and the magnetic
buttons. Reveals are one-shot `IntersectionObserver` work — no scroll handlers.
The loop parks itself when the tab is hidden.

The animated background is a caustics field rendered into a deliberately tiny
(~220×140) buffer at 30fps and scaled up with a small blur. Its opacity is
retuned per section via `data-caustics="0.NN"` so text always clears WCAG AA —
article pages run it at roughly a fifth of the home page's intensity.

**`prefers-reduced-motion: reduce` is a complete fallback,** not a degradation:
one static caustics frame, every reveal already complete, count-ups showing
final values, scroll bar removed, no loop started. With JavaScript off entirely,
all content renders visible — `data-armed` only bites once a blocking head
script has confirmed motion is allowed, so there is never a flash of content
disappearing.

### Accessibility

All 36 text/background pairs in the palette clear WCAG AA (4.5:1), measured
against the porcelain ground *and* against the darkest state of the caustics
layer. `/accessibility/` documents the approach, including where it falls short.

---

## Before launch

- [ ] **Replace the placeholder phone number** in `src/config/site.ts`
- [ ] **Replace the placeholder testimonials** in `src/data/testimonials.ts` and set
      `placeholder = false` — they are sample text, not real reviews, and review
      schema stays suppressed until that flag flips
- [ ] Add real social profile URLs to `site.social` (empty entries are skipped in schema)
- [ ] Point `leadEndpoint` at a CRM and widen the CSP `connect-src` to match
- [ ] Confirm the CY2026 figures are still current if launching after November
- [ ] Point `consult.url` at a real 15-minute calendar (currently an on-site
      contact link); widen the CSP `form-action`/`connect-src` if it is off-site
