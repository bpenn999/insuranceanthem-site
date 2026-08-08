---
name: insurance-website-builder
description: >-
  Self-contained skill to design and build a complete, premium, multi-page insurance agency website (Medicare, ACA/health, life, final expense, ICHRA, P&C) on Astro, deploy-ready for Cloudflare Pages. Produces a real production-grade site — home, about, service/plan pages, location pages, contact, blog index — with a generated design system (brand colors, fonts, components), conversion-optimized compliant copy, the full SAA FOUR-PILLAR AI Citation Standard baked into every page (Article/Org "Data Desk" author + FAQPage + Dataset + llms.txt + WebMCP), GHL lead capture, and accessibility. Matches the visual quality of top agencies (greenins / enrollmedicare class). Trigger on: "build an insurance website", "agency site", "new Medicare/ACA/life site", "website builder", "build the site for <brand>".
---

# Insurance Website Builder (USA · Astro · Four-Pillar) — self-contained

Builds ONE complete, premium, COMPLIANT insurance agency website and prepares it to deploy. Everything needed is in this file — pair with `brand-design-kit` for the visual system and `location-page-factory` for local pages, and call `seo-aeo-page-audit` before publish. Insurance is **YMYL**: never fabricate a number, never give individualized advice, always cite authoritative/`.gov` sources, always include the required disclaimers.

**Stack:** Astro 5 → Cloudflare Pages (git-connected auto-deploy). Output `dist`, build `npm run build`.

---

## Workflow (do in order)

### STEP 0 — Brand & niche intake (never hardcode)
- Establish the **brand source of truth** in `src/config/site.config.ts` + `BRAND.md`: brand name, production domain, niche, licensed advisor (name + NPN), phone, address, service area, CTA, **compliance disclaimers**, colors, fonts, voice. If a brand kit doesn't exist, run **`brand-design-kit`** first.
- Pick the **advisor** as the on-page human/face. Every hero features the advisor in-context (no anonymous stock).
- Choose the niche → loads the right compliance gate (Medicare TPMO / ACA HealthCare.gov / life no-guarantees) and the right Brain tools.

### STEP 1 — Information architecture
Standard agency IA (adapt to niche):
1. **Home** — hero (advisor), value props, plan/service overview, trust band, by-the-numbers (real Brain data), FAQ, CTA.
2. **About** — the agency + advisor E-E-A-T, credentials, "Data Desk" methodology.
3. **Service / plan pages** — one page per intent (e.g. Medicare Advantage, Medigap, Part D / ACA metal tiers / term / final expense). One page = one intent.
4. **Location pages** — via `location-page-factory` (LocalBusiness + GovernmentService + Place).
5. **Blog index** — feeds the niche blog writer.
6. **Contact** — GHL form + booking + phone, TCPA consent on call/text.

### STEP 2 — Design system (premium bar)
- Use the `brand-design-kit` tokens — colors, fonts (heading + body), spacing scale, components (buttons, cards, stat row, chart, FAQ accordion, CTA band). Never hardcode hex; use tokens.
- Visual quality target: greenins / enrollmedicare class — generous whitespace, real photography of the advisor, scroll animations, accessible contrast, mobile-first.
- Ship an accessibility widget + a consent/cookie gate (no pre-consent tracker firing).

**Images — bring-your-own first; image generation is OPTIONAL (no Higgsfield required).** Source the hero in this order: (1) a **real photo of the advisor** (client-provided — best for E-E-A-T/compliance); (2) **image generation only IF a generator is connected** (e.g. Higgsfield) — for composites or a unique per-page image; (3) a **brand-kit graphic/illustration** (colors + type, no faces). NEVER anonymous stock b-roll as the hero, and NEVER block the build on a missing image — use option 3 and flag it. This skill has **no hard dependency on Higgsfield or any image API.**

### STEP 3 — Real data (THE BRAIN, never fabricate)
- For any statistic/plan count/county health figure, pull from the **Ambrose Insurance Brain** (`brain_catalog → brain_tool_schema → brain_execute`) or an official `.gov` source — see the `ambrose-insurance-data` skill. Cite figure + year + exact `.gov` endpoint.
- Every page that cites data renders a stat row / chart / comparison table with a source line.

### STEP 4 — FOUR-PILLAR AI Citation Standard (bake into EVERY page template)
Inject in `<head>` on every page:
1. **Article / WebPage / Service / LocalBusiness** (per page type) with **`author` = Organization "<Site> Data Desk"** — single-Person authors BANNED for YMYL; advisor shown as visible byline / `reviewedBy`. `datePublished` + `dateModified` present.
2. **FAQPage** — 3–5 real-query Q&As per page.
3. **Dataset** — wrap every `.gov`/Brain figure cited: `{"@type":"Dataset","name":...,"creator":{"@type":"Organization","name":...,"url":"<EXACT endpoint, e.g. cdc.gov/places>"},"license":"https://creativecommons.org/publicdomain/zero/1.0/","isAccessibleForFree":true}`.
4. **Agentic Readiness (site-level):** emit a valid `/llms.txt` (incl. a "Tools (agent-callable)" section) + `/llms-full.txt` for content-rich sites; a `/robots.txt` that does NOT block AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended, ClaudeBot, Bingbot); and **WebMCP** — `/.well-known/mcp.json` + a `/mcp` proxy + in-page `navigator.modelContext` — so an agent can CALL a tool (subsidy/quote/plan-finder), not just read text.

### STEP 5 — Compliant, conversion-optimized copy
- Answer-first, plain language (Medicare audience is 60+). Name entities clearly.
- **Compliance (mandatory, niche-specific):** Medicare = TPMO disclaimer verbatim + non-affiliation + NO banned superlatives ("best", "#1", "cheapest") + no "we offer all/every plan" + no "free" for $0-premium. ACA = direct to HealthCare.gov + income/plan-year caveats. Life = no guaranteed returns/investment claims. All = informational-only + TCPA consent on CTAs.
- Every CTA names the visitor's next step (compare plans / talk to a licensed agent / estimate your need).

### STEP 6 — Lead capture (GHL)
- Contact + inline CTAs post to GHL (form/webhook); tag by source/niche; pin the right location/pipeline. Never inject data we don't have (no placeholder phone numbers).

### STEP 7 — Build, TEST, deploy
1. `DEPLOY_TARGET=cloudflare npm run build` passes clean; no console/runtime errors.
2. Canonical = the real production domain (NOT `*.pages.dev`). Leak-check: `grep -rEl "pages\.dev|netlify\.app|vercel\.app|workers\.dev|localhost" dist | wc -l` prints `0`.
3. **Test UI desktop + mobile** (preview/screenshot): spacing, no overflow, contrast, all images have alt, brand colors correct, layout intact. Fix + rebuild.
4. Ensure a git-connected Cloudflare Pages project (branch `main`, build `npm run build`, output `dist`); trigger deploy; confirm live.

### STEP 8 — Run the audit before publish
- Run **`seo-aeo-page-audit`** on every key page. Resolve every 🔴 (incl. Part H Four-Pillar P0, Part J insurance compliance) before going live.

---

## Required components checklist
- [ ] 🔴 Multi-page IA: home, about, service/plan pages (one page = one intent), contact, blog index (+ location pages)
- [ ] 🔴 Design system via `brand-design-kit` tokens; advisor-featured hero; premium visual bar; mobile-first; accessible contrast
- [ ] 🔴 Every data figure from the Brain / `.gov` (figure + year + exact endpoint); stat row/chart/table with source line
- [ ] 🔴 Four Pillars on EVERY page: Article/Service/LocalBusiness + **Org "Data Desk" author** + FAQPage + **Dataset**; site-level **llms.txt + WebMCP**, AI crawlers unblocked
- [ ] 🔴 Niche compliance: Medicare TPMO + non-affiliation, no banned superlatives, no "all/every plan", no "free" misuse / ACA HealthCare.gov + caveats / life no-guarantees; informational-only; TCPA on CTAs
- [ ] 🔴 GHL lead capture wired; no fabricated data in any field
- [ ] 🔴 Build clean; canonical = production domain; leak-check = 0; desktop + mobile tested
- [ ] 🔴 `seo-aeo-page-audit` run on key pages — all 🔴 resolved (Parts H + J included)

## Notes
- Quality bar: greenins / enrollmedicare. If it looks like a generic template, it's not done.
- Pair with `brand-design-kit` (visual system), `location-page-factory` (local pages), the niche blog writer (content), and `ambrose-insurance-data` (figures).

---

## Implementation notes — Big Sioux gold-standard template (reference build)
The fastest path is to reskin the gold-standard **Big Sioux Benefits** Astro template rather than build from blank:

- **The factory move:** copy the site folder, swap `src/config/site.config.ts` + the logo/advisor assets, edit `src/lib/content.ts` (service-area + `coverage` + `education` + `tools` + `services` arrays), redeploy. **Pages appear from the arrays — you edit data, not page files.**
- **Content architecture (data-driven):** `src/lib/content.ts` holds the arrays; `src/pages/[slug].astro` renders coverage + education + tools at flat URLs; `services/[slug].astro` renders services; hub pages = `medicare-101`, `free-tools`, `services`, `locations`, `faq`, `reviews`, `meet-the-team`.
- **Centralized schema:** put all JSON-LD in `src/lib/schema.ts` so every layout emits the correct pillar stack by page type (WebPage/Article + Org "Data Desk" author + FAQPage + Dataset + GovernmentService + Place on geo pages). Don't hand-roll schema in pages.
- **The "$25k look":** palette (ink/primary/accent/soft/line/muted) + display serif + body sans + mono eyebrow; soft shadows, 14–22px radii, generous whitespace. Hero = gradient + texture, display headline, advisor photo in-context with a floating "live data" stat card + a reviews chip, primary CTA + ghost call button + trust microcopy. Section rhythm: trust bar (carriers + rating) → dark data band (stat numbers) → services grid → 3-step how-it-works → testimonial → CTA band → premium multi-column footer with the TPMO disclaimer.
- **Animations:** scroll-reveal fade-ups (IntersectionObserver) + count-up on stats + hover lifts, all gated on `prefers-reduced-motion` plus an accessibility "pause motion" toggle.
- **Build correctly:** run `npm run build` (NOT raw `astro build`) so the prebuild image-optimizer hooks run; the Cloudflare/Vercel adapter auto-detects the host (override with `DEPLOY_TARGET`).
