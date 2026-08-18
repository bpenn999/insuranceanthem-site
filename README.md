# 602Medicare

Medicare agency website for Brian Penner. Office in Anthem, AZ; the patch is the
Phoenix metro — Glendale, Peoria, North Phoenix, New River and Carefree each
have their own page. Named for the 602, the area code the whole Valley still
calls itself by.

> The GitHub repo is still `insuranceanthem-site`, two rebrands behind. Renaming
> it is safe whenever you want — nothing in the build reads it, and the
> Cloudflare Pages project is `insuranceanthem` for the same historical reason.

Astro 7, static output, published to Cloudflare Pages. No `wrangler.toml` — the build is
plain `npm run build`, and publishing is an explicit `wrangler pages deploy dist`.

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
| `python3 scripts/build-placeholder-icons.py` | Regenerates the **placeholder** icons in `public/brand/` + `public/favicon.ico`. Needs `pillow` |
| `node scripts/build-og.mjs` | Re-renders `public/og-602medicare.png` from `scripts/og-card.html` |

`npm run e2e` drives Chrome over the DevTools Protocol with zero dependencies.
Override the browser with `CHROME=/path/to/chrome npm run e2e`.

---

## Deploying to Cloudflare Pages

**Publishing is manual — a push to `main` does not deploy.** The Pages project is not
GitHub-connected (verified 2026-08-08: a push sat 25 minutes with no build, on the apex
and on `insuranceanthem.pages.dev` alike). Ship a change with:

```bash
npm run verify                                            # gates, and leaves dist built
npx wrangler pages deploy dist --project-name=insuranceanthem
```

Deploy `dist`, **never `.`** — the repo root has no `index.html`, so deploying it uploads
`node_modules` and 404s the site. Wrangler authenticates from
`~/.wrangler/config/default.toml`; no API token belongs in the repo or the environment.

The table below is the configuration to use **if** the project is ever connected to GitHub
for automatic builds. It does not describe how the site publishes today.

**Build configuration**

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20 or newer (`NODE_VERSION` env var) |

**Custom domain.** Add `602medicare.com` and `www.602medicare.com` in
Pages → Custom domains, then add a redirect rule so `www` and `http` both 301 to
the apex. `astro.config.mjs` sets `site: 'https://602medicare.com'` and every
canonical URL, `og:url` and schema `@id` derives from it, so the apex must be the
one that serves.

Deploys go to the **`insuranceanthem`** Pages project. That name predates two
rebrands and is deliberately left alone — renaming the project would orphan the
custom-domain bindings.

**Headers.** `public/_headers` ships a CSP, HSTS, and immutable caching for
fingerprinted assets. Pages applies it automatically — no extra config.

---

## Change the phone number (and everything else)

Every agency fact lives in **`src/config/site.ts`**. Nothing is hard-coded anywhere else.

```ts
const PHONE_RAW = '6028446002';  // (602) 844-6002 — the real line
```

Change that one string and the display format, the `tel:` links, the schema
`telephone`, the footer, the header, every CTA and every page's meta description
all update together. Same for `email`, `agent.npn`, `agent.experience`,
`address` and `serviceArea`.

> The number went live on 2026-08-05. `scripts/audit.mjs` asserts the footer
> carries it on every page and that the whole site renders exactly **one**
> distinct phone string — a second one showing up means something hard-coded a
> number instead of reading `site.phone`.

### Lead capture — the /api/lead relay

The contact form POSTs JSON to **`/api/lead`**, a Cloudflare Pages Function at
`functions/api/lead.ts`, which relays the submission to the **GoGuruX** inbound
webhook. `leadEndpoint` in `src/config/site.ts` is the single place the URL is
set; both the form and the hero funnel read it.

The relay exists so the webhook URL never reaches the browser. That URL *is* the
credential — anyone holding it can write into the CRM — so posting it from the
page would publish it in the built HTML of every page. It lives in an
environment variable only the Worker reads, and `connect-src 'self'` in
`public/_headers` stays shut because the browser only ever talks to this origin.

**Set the secret before this does anything.** Cloudflare dashboard → Pages →
`insuranceanthem` → Settings → Environment variables → **Production** → add:

```
GOGURUX_WEBHOOK_URL = <the GoGuruX inbound webhook URL>
```

then **redeploy** — Pages only picks a variable change up on the next
deployment:

```bash
npm run verify
npx wrangler pages deploy dist --project-name=insuranceanthem
```

Locally, `cp .dev.vars.example .dev.vars`, put the real value in it (it is
gitignored) and run `npx wrangler pages dev dist`.

### `/api/availability` — where the bookable times come from

The booking page does **not** ask GoGuruX what is free any more. On 2026-08-20 it
offered an unbroken run of half-hours from 7:00 while Brian's Google Calendar
carried a confirmed "Off" from 07:00 to 20:00, and let him book the 7:30.
Medicare On Main greyed that same Thursday out, because it reads a different
feed. This route now reads that feed too:

```
GET backend.leadconnectorhq.com/calendars/8CcYJMIVgaxb2XBKcKtk/free-slots
    ?startDate={ms}&endDate={ms}&timezone=America/Phoenix
```

Unauthenticated, CORS-open, and it lists **only what is free** — a day with
nothing on it is absent from the response entirely. Asked for 18–31 August it
answered 18, 25, 26, 27, 28 and 31 and no 20th, matching MOM's own date grid
(verified 2026-08-18).

**There is nothing to configure.** No key, no service account, no environment
variable. The booking is still written to GoGuruX, which is MOM's arrangement
exactly: read from the feed that honours the diary, write where the diary lives.
GoGuruX is still asked for the calendar object, because `create-booking` needs
the id on it — but never again for what is free.

The loop closes on its own: a booking goes to GoGuruX, GoGuruX puts it on
Brian's Google Calendar, and the feed reads Google. A slot taken through this
site disappears from the feed.

**It fails closed.** If the feed cannot be read the route answers `502` with no
slots rather than falling back to GoGuruX's list, and the page shows the widget
and the phone number.

Optionally, `GOOGLE_SERVICE_ACCOUNT_JSON` (Pages → Settings → Environment
variables → Production) adds a second, independent check against Google's own
busy list — share the calendar with the service account's address and paste the
key JSON in. It is off by default and does not need to be turned on; a
configured-but-failing credential is logged and skipped rather than closing the
calendar.

To see what a day looks like:

```bash
curl -s 'https://insuranceanthem.pages.dev/api/availability?date=2026-08-20' | jq '.filtered, (.slots|length)'
```

What it sends:

```jsonc
{
  "contact": { "first_name": "…", "last_name": "…", "email": "…", "phone": "…", "zip": "…" },
  "source": "contact-form",              // defaults to "602medicare.com"
  "notes": "Situation: …\nMessage: …\nTCPA consent given on the website form at …"
}
```

What it answers: `200 {ok:true}` on an upstream 2xx · `400` when the submission
carries neither email nor phone · `403` on a cross-origin POST · `405` on
anything but POST · `502` when the CRM refuses, times out, or the variable is
unset. Anything other than 200 drops the form back to the prefilled-email
hand-off, so an enquiry is never silently lost to a CRM outage.

The hero funnel is wired to the same endpoint but does not post on its own — its
three questions never ask for a name or a number, so there is nothing reachable
to file. Its answers ride to the CRM in the `notes` of the contact submission,
prefilled from the query string and `sessionStorage`.

`scripts/e2e.mjs` drives the function directly against a mocked upstream —
`node scripts/e2e.mjs` covers it without a deployment.

---

## The brand kit

**There isn't one yet.** The Daisy Mountain badge was retired with the rebrand —
`src/brand/`, the generated `public/brand/` kit and `scripts/build-brand-kit.py`
are all gone. Until a 602Medicare logo lands, the brand is set entirely in type:

| Where | What it is |
| --- | --- |
| Header | Text wordmark, no mark — `src/components/Header.astro` |
| Footer | Full-bleed type band + a NAP with no badge over it |
| OG card | Type-only, `scripts/og-card.html` → `public/og-602medicare.png` |
| Icons | Placeholder navy tiles, `scripts/build-placeholder-icons.py` |

The wordmark is **one word, two colours**: `602` in gold set flush against
`Medicare` in navy, no space and no margin between them. Both halves come from
`site.wordmark` in `src/config/site.ts` — never from splitting `site.name`,
which has no space in it to split on.

When the real mark arrives:

1. Drop it back into the header (`.brand__mark` styling was removed; re-add it),
   the footer advisor row and the OG card.
2. **Use new filenames.** `public/_headers` caches `/*.png` for seven days, so
   re-using `mark-512.png` means the edge serves the placeholder for up to a
   week after the real logo ships. Same reason `og.png` became
   `og-602medicare.png` at the rebrand.
3. A navy ground needs a variant that brings its own light field. Do not drop
   the light-ground version onto the footer and hope.

### The gold

The palette has **two** golds, and they are not interchangeable:

| Token | Value | For |
| --- | --- | --- |
| `--gold` | `#D5971F` | The brand gold. **Graphics only** on light — 2.4:1 on porcelain, 6.0:1 on navy |
| `--gold-ink` | `#96650F` | Gold **text** on a light ground — 4.8:1, clears AA |

The header's `602` and the OG card's are set in `--gold-ink`. The footer's giant
`602` sits on navy, so it uses `--gold` directly. Setting the header's in
`--gold` would drop it below the 4.5:1 floor that `/accessibility/` claims for
every text pair on the site.

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
    locations.ts          ← Service area → 6 generated pages
    tools.ts              ← Free-tools registry
    faqs.ts, testimonials.ts
  scripts/motion.ts       ← The whole motion engine. ONE rAF loop per page.
  styles/global.css       ← Porcelain design system + the motion/reduced-motion layer
  components/             ← Kinetic, HeroFunnel, LeadForm, Schema, Header, Footer, …
  layouts/                ← BaseLayout, ToolLayout, LegalLayout
  pages/                  ← 40 routes
  content/learn/          ← Markdown articles (drop-in; see below)
  pages/learn/            ← Hub + [...slug] route, both fully data-driven
plugins/                  ← remark plugin: {{figure}} tokens → real numbers
test/logic.test.mjs       ← 55 unit tests
scripts/audit.mjs         ← Built-output audit
scripts/e2e.mjs           ← 461 headless-browser checks
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

- [x] ~~Replace the placeholder phone number~~ — (602) 844-6002, live 2026-08-05
- [ ] **Replace the placeholder testimonials** in `src/data/testimonials.ts` and set
      `placeholder = false` — they are sample text, not real reviews, and review
      schema stays suppressed until that flag flips
- [ ] Add real social profile URLs to `site.social` (empty entries are skipped in schema)
- [ ] Point `leadEndpoint` at a CRM and widen the CSP `connect-src` to match
- [ ] Confirm the CY2026 figures are still current if launching after November
- [ ] Point `consult.url` at a real 15-minute calendar (currently an on-site
      contact link); widen the CSP `form-action`/`connect-src` if it is off-site
