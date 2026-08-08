---
name: location-page-factory
description: >-
  Self-contained skill to generate high-quality, COMPLIANT local-SEO location pages for an insurance agency site (one page per city/county/service-area) on Astro — each page genuinely localized with REAL local data (county health, plan counts, demographics) from THE BRAIN, the full SAA FOUR-PILLAR AI Citation Standard, and the right geo schema stack (LocalBusiness + GovernmentService + Place + FAQPage + BreadcrumbList + Dataset). Avoids thin/doorway/templated-near-duplicate pages. Trigger on: "location pages", "city pages", "service-area pages", "local SEO pages", "programmatic location pages for <brand>".
---

# Location Page Factory (USA · Astro · Four-Pillar) — self-contained

Generates location pages that actually rank and don't trip doorway/duplicate penalties. Each page = ONE real place, with REAL local data. Insurance is **YMYL**: cite real `.gov`/Brain figures, include disclaimers, never fabricate.

> A location page that says "we serve the Sioux Falls area" is invisible. One that says "Minnehaha County has 38 Medicare Advantage plans across 7 carriers (CMS, 2026); 9.5% of adults have diagnosed diabetes (CDC PLACES, 2023)" gets quoted by AI answer engines and ranks locally.

---

## Workflow (do in order)

### STEP 0 — Read brand + existing pages
- Read `BRAND.md` / `src/config/site.config.ts` (brand, advisor, domain, CTA, disclaimers, colors, imagery rule). If no brand kit, run `brand-design-kit` first.
- List existing location slugs so you do NOT duplicate a place.

### STEP 1 — Pick the place + intent
- One page per **real** city/county in the service area. One place = one page. Don't generate places the agency doesn't serve.

### STEP 2 — Pull REAL local data (THE BRAIN — never fabricate)
- Via `ambrose-insurance-data` (`brain_catalog → brain_tool_schema → brain_execute`): local plan landscape (`aca_marketplace_plans` / `medicare_enrollment`), county health (`cdc_county_health` — diabetes/BP/obesity), market snapshot (`census_market_snapshot` — population, median income, uninsured rate), providers (`provider_density`, `cms_hospitals`). Each figure: value + year + exact `.gov` endpoint.
- The local data is what makes the page non-thin and non-duplicate — it MUST be genuinely different per place.

### STEP 3 — Write the page (localized, not templated)
- Answer-first localized intro (name the city/county + who it's for). One H1.
- Real **stat row + bar chart + comparison table** from Brain data, each with a source line.
- Local context: who in this place needs this coverage and why (grounded in the data).
- Question-style H2s (AEO). FAQ (3–5 real local queries) → FAQPage.
- Compliant CTA (compare plans / talk to a licensed agent) + the advisor as the local face.
- **Avoid templated near-duplicates:** substantive copy genuinely rewritten per place (unique data, examples, framing) — not the same text with the city name swapped.

### STEP 4 — FOUR-PILLAR + geo schema (every page)
Inject in `<head>`:
1. **`LocalBusiness`** (NAP, hours, geo) **+ `GovernmentService`** (the program served) **+ `Place`** — and **`author` = Organization "<Site> Data Desk"** on any article/WebPage portion (single-Person YMYL authors BANNED; advisor = visible byline / `reviewedBy`). `datePublished` + `dateModified`.
2. **FAQPage** — local Q&As.
3. **Dataset** — wrap every Brain/`.gov` figure (`creator.url` = exact endpoint, e.g. `cdc.gov/places`, `census.gov`).
4. **`BreadcrumbList`** + site-level **Agentic Readiness**: `/llms.txt` lists the location pages; AI crawlers unblocked; data-driven sites expose **WebMCP** (`/.well-known/mcp.json` + `/mcp`) so an agent can run a local plan-finder/subsidy tool.

### STEP 5 — Images (NO Higgsfield required)
- Hero source order: (1) **real photo of the advisor** (optionally in/near the location); (2) **generation only if a generator is connected** (e.g. Higgsfield) — composite the advisor over a REAL local landmark photo (`media_import_url`), never a fully AI-faked landmark; (3) **brand graphic** with the place name. NEVER anonymous stock; NEVER block on a missing image.

### STEP 6 — Build, TEST, audit
1. `DEPLOY_TARGET=cloudflare npm run build` clean; canonical = production domain; leak-check `grep -rEl "pages\.dev|netlify\.app|vercel\.app|workers\.dev|localhost" dist | wc -l` = 0.
2. Desktop + mobile test: spacing, no overflow, alt text, contrast, brand colors.
3. Run **`seo-aeo-page-audit`** — resolve every 🔴, especially **Part D (duplicate/doorway)**, **Part H (Four-Pillar P0)**, **Part J (insurance compliance)**.

---

## Checklist
- [ ] 🔴 One page per REAL place in the service area; no duplicate slug; not a place we don't serve
- [ ] 🔴 REAL local data from the Brain (plan counts, county health, demographics) — figure + year + exact endpoint
- [ ] 🔴 Genuinely localized copy (NOT the same text with the city swapped); stat row + chart + table with source lines
- [ ] 🔴 Geo schema: LocalBusiness + GovernmentService + Place + BreadcrumbList + FAQPage + **Dataset** + **Org "Data Desk" author**
- [ ] 🔴 Site-level Pillar 4: /llms.txt lists location pages, AI crawlers unblocked, WebMCP on data-driven sites
- [ ] 🔴 Compliance: no banned superlatives / "all plans" / "free" misuse; niche disclaimers + TPMO (Medicare); informational-only; TCPA on CTAs
- [ ] 🔴 Hero = real advisor photo → optional generation → brand graphic; NEVER anonymous stock; no Higgsfield dependency
- [ ] 🔴 Build clean; canonical = production domain; leak-check 0; desktop + mobile tested; `seo-aeo-page-audit` Parts D/H/J pass

## Notes
- The #1 risk for location pages is thin/doorway/templated-near-duplicate — real per-place Brain data is the defense.
- No image-generation dependency. Pair with `brand-design-kit`, `insurance-website-builder`, `ambrose-insurance-data`.

---

## Implementation notes — data storage & schema wiring (reference build)
- **Save figures, don't inline-invent:** write each county's pulled figures to `src/data/<location>.ts` with a `SOURCES` map (figure → exact endpoint + year). If you can't source a number, cut it.
- **Name real local entities** — carriers, plans with their published CMS star ratings, hospitals, health systems — never "local providers". Name the place/county **8+ times** naturally.
- **Present, don't rank:** show published CMS star ratings + a neutral stability label; never a "best/top-rated" ranking claim.
- **Schema wiring:** inject the geo stack + Four Pillars via `src/lib/schema.ts`, passing `place`, `faqs`, `breadcrumbs`, `dataset`, `datePublished` — don't hand-roll JSON-LD in the page.
- **No cannibalization:** distinct keyword + intent per page; grep the location index before generating so two pages don't compete for the same query.
