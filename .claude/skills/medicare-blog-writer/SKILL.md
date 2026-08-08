---
name: medicare-blog-writer
description: >-
  Self-contained skill to research, write, verify, and test a complete, compliant Medicare blog article for a USA Medicare website — Original Medicare (Parts A/B), Medicare Advantage (Part C), Medigap/Supplement, Part D, eligibility, enrollment periods, costs. Picks a trending/high-intent topic, rotates categories, writes answer-first long-form (3,000–8,000 words by topic) with TL;DR, Table of Contents, verified statistics, charts/graphs, FAQ, author bio, Sources, related articles, compliant CTAs; sets meta title/description, canonical, Open Graph, JSON-LD schema, image alt; follows brand colors; self-reviews, builds/previews to confirm charts + stats render and UI spacing is correct; and runs an embedded SEO+AEO checklist at the end. YMYL — highest accuracy/expertise bar; enforces CMS Medicare marketing compliance (TPMO + non-affiliation, no prohibited superlatives). Trigger on: "write a Medicare article", "Medicare blog post", "write about Medicare Advantage / Medigap / Part D / AEP / turning 65".
---

# Medicare Blog Writer (USA · YMYL) — self-contained

Produces ONE complete, verified, compliant, tested Medicare article and prepares it to publish. Everything needed is in this file — no other skill required. Medicare content is **YMYL (Your Money or Your Life)**: never guess a number, never give individualized advice, always cite primary sources, always include the required disclaimers, and always state the **plan year**.

**Length:** 3,000–8,000 words matched to topic/intent (ultimate guides & comparisons longer; focused how-tos/news shorter). Be more complete and useful than what currently ranks — never pad.

---

## Workflow (do in order)

### STEP 0 — Learn the site & brand (never hardcode)
- Read the brand source (`src/data/site.ts` / `BRAND.md` / theme tokens): **brand colors, fonts, components, tone/voice**.
- Pick a **real, credentialed human as the visible byline / reviewer** (licensed agent + NPN, or "reviewed by a licensed Medicare agent"). The **schema author is the Organization** ("<Site> Data Desk"); the human is shown on-page and may be `reviewedBy`. Single-Person schema authors are **banned for YMYL** (Medicare). Medicare articles must show a qualified human on-page (E-E-A-T).
- Inspect the existing post collection: copy the **exact frontmatter shape, slug pattern, categories/tags, MDX components** in use and match them. List existing slugs so you do NOT duplicate a topic.

### STEP 1 — Pick a topic from real demand
- **Check Google Trends** (trends.google.com) for Medicare terms — note rising queries and seasonality.
- **Keyword research:** ONE primary keyword + 2–4 semantic variations with genuine intent. Confirm the topic isn't already on the site (no cannibalization).
- **Write ahead of the Medicare calendar:**
  - **AEP** (Annual Enrollment) Oct 15 – Dec 7 · **MA OEP** Jan 1 – Mar 31 · **IEP** (7-month window around turning 65) · **SEPs** for qualifying events · **Medigap Open Enrollment** (6 months from Part B effective date).

### STEP 2 — Choose the article TYPE and ROTATE the category
Don't keep writing one category — track recent posts and pick a fresh one:
1. **Explainer / "What is"** — "What is Medicare Part D?", "Medigap vs Medicare Advantage explained"
2. **How-to / step-by-step** — "How to enroll in Medicare at 65", "How to switch from Advantage to Original + Medigap", "How to appeal a coverage denial"
3. **Comparison / "vs"** — "Plan G vs Plan N", "Medicare Advantage vs Original Medicare + Medigap", "PDP options compared" (no banned superlatives)
4. **Cost / pricing** — "Part B premium & deductible this year", "IRMAA brackets explained", "What Medigap costs"
5. **Timely / enrollment** — "AEP checklist", "What's changing this plan year"
6. **Myths & mistakes** — "Enrollment mistakes that trigger lifelong penalties"
7. **News / policy commentary** — CMS premium/benchmark updates, rule changes (neutral, data-backed)
8. **Data / trends** — enrollment trends from CMS/KFF
9. **Audience guides** — turning 65, working past 65, veterans + Medicare, dual-eligible (Medicaid), low-income (LIS/Extra Help)

### STEP 3 — Verify EVERY statistic (no exceptions)
- No fabricated or unsourced numbers. Each stat needs: figure + **year/plan year** + **link to a primary source**.
- Use the **source whitelist** below; prefer the most recent official data. If you can't verify a number authoritatively, omit it or make it qualitative. Flag anything uncertain.

### STEP 4 — Write the article (required structure — include ALL)
Brand voice; plain, accessible language (much of this audience is 60+ — short sentences, define jargon).
- **Meta title** 50–60 chars, primary keyword near the front.
- **Meta description** 140–160 chars, keyword + reason to click.
- **TL;DR / Key Takeaways** box near the top (3–6 bullets).
- **Table of Contents** with jump links.
- **Answer-first intro** — answer the core question in the first 1–2 sentences; keyword in the first 100 words.
- Clean **H2/H3 hierarchy**, exactly one **H1**; use question-style subheadings where natural (AEO).
- **Verified statistics** (figure + year + linked source).
- **1–3 charts/graphs** that render (Step 5) + a **comparison table** where the topic warrants (e.g. Plan G vs N).
- **FAQ section** (real questions → concise 2–3 sentence answers) → FAQPage schema.
- **Compliant CTA(s)** — "compare plans", "talk to a licensed agent", "check your options" (see compliance; avoid banned superlatives and "free" misuse).
- **Author bio + credentials**; visible **published + last-updated dates**.
- **Sources / References** section listing every cited link.
- **Related Articles** (internal links).
- **Compliance disclaimers** (Step 9) including the TPMO + non-affiliation statements.

### STEP 5 — Charts, graphs & stats (must actually render)
- Build with the site's existing chart components/library (inline SVG preferred; dark-mode friendly). Reuse the project pattern — don't invent UI.
- Each chart: clear title, labeled axes/legend, **source caption with year**, accessible markup (`role="img"`, `aria-label`). Verified data only.
- **Hero image:** features the **advisor in-context** (no anonymous stock b-roll). Use a **unique image per post** — never reuse a hero across articles. For a real landmark/location, composite the advisor over a real photo (don't AI-generate the landmark).

### STEP 6 — SEO + AEO essentials (bake in while writing)
- **SEO:** unique meta title + description; self-referencing **canonical**; clean heading hierarchy; internal + authoritative external links; **descriptive alt text on every image**; compressed images with width/height; fast & CLS-safe.
- **AEO:** answer-first passages that stand alone when quoted; FAQ; clear entities (name the plan types, who it's for, plan year); citable sourced facts; liftable comparison tables and step lists.
- **Open Graph + Twitter Card:** `og:title`, `og:description`, `og:url` (this page), `og:image` (~1200×630), `og:type`; `twitter:card=summary_large_image`.
- **JSON-LD schema:** `Article` (or `BlogPosting`) + author `Organization` ("<Site> Data Desk") + publisher `Organization` + `reviewedBy` `Person` (the visible byline) + `BreadcrumbList` + `FAQPage` + `Dataset` (per the Dataset bullet below) (and `HowTo` for tutorials). `datePublished` + `dateModified` always present. Markup must match visible content.
- **Dataset schema (Pillar 3 — the moat):** inject one `Dataset` block per authoritative/.gov source cited (Brain-sourced figures included). `creator.url` = the **exact endpoint** (e.g. `cdc.gov/places`, `census.gov`, `healthcare.gov`, `cms.gov`), NOT the homepage. Use the JSON template: `{"@context":"https://schema.org","@type":"Dataset","name":"<source dataset name>","description":"<1 sentence on what was pulled>","creator":{"@type":"Organization","name":"<source name>","url":"<exact endpoint URL>"},"license":"https://creativecommons.org/publicdomain/zero/1.0/","isAccessibleForFree":true}`. Skip ONLY if no external data is cited.
- **Pillar 4 (site-level) reminder:** confirm the site serves a valid `/llms.txt` (with a "Tools (agent-callable)" section), does **not** block AI crawlers, and (data-driven sites) exposes WebMCP (`/.well-known/mcp.json` + `/mcp` proxy + in-page `navigator.modelContext`). If missing, flag it — the `seo-aeo-page-audit` will gate on it.

### STEP 7 — Branding & UI consistency
- Use brand colors/fonts/components via the site's tokens (never hardcode hex). Use existing section/MDX components. **Do not change global UI/CSS** — author only within existing components.

### STEP 8 — Links
- 3–5 **internal** links (descriptive anchors) to relevant posts + money pages (compare plans, contact); 1–3 **external** links to **authoritative sources only** (see whitelist). Never link competitor agency blogs, content farms, or AI-generated pages. No broken links/redirect chains.

### STEP 9 — Medicare compliance (mandatory — CMS Communications & Marketing Guidelines)
- **TPMO disclaimer (include verbatim):** "We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options."
- **Non-affiliation:** "Not affiliated with or endorsed by the U.S. government or the federal Medicare program."
- **Informational-only:** "This article is for general information only and is not medical, insurance, tax, or legal advice. Confirm details at Medicare.gov or 1-800-MEDICARE and consult a licensed agent."
- **Do NOT:** use prohibited superlatives ("best", "cheapest", "#1", "most popular"); imply government affiliation; misuse the Medicare name/logo/card imagery; promise specific savings; use "free" misleadingly for $0-premium plans.
- Respect **TCPA** consent for any call/text quote CTA. State the **plan year** for all figures. Note when rules vary by state/plan.

### STEP 10 — Self-review, build & TEST (don't skip)
1. Re-read end to end: accuracy, flow, no contradictions, every stat sourced + dated, disclaimers present, CTA compliant.
2. **Build / preview** the site; fix any error your file caused.
3. **Confirm rendering:** charts/graphs display (not broken/empty), stats + tables show, FAQ works, schema present.
4. **Test the UI:** view the rendered page on **desktop AND mobile** (preview/screenshot) — proper **spacing**, no overflow/cut-off, readable contrast, **all images have alt**, brand colors correct, layout not broken. Fix and rebuild.

### STEP 11 — Final SEO + AEO checklist (embedded — run before publish)
Mark each ✅/❌; fix all 🔴 before publishing.
- [ ] 🔴 Meta title 50–60 (unique) · meta description 140–160 (unique) · self-referencing canonical
- [ ] 🔴 One H1 + primary keyword in first 100 words · clean H2/H3 · answer-first intro
- [ ] 🔴 3,000–8,000 words; original, intent-matched, more complete than competitors
- [ ] 🔴 Every statistic has figure + year + authoritative source link (no fabricated numbers)
- [ ] 🔴 TL;DR box · Table of Contents · FAQ (+ FAQPage schema)
- [ ] 🔴 JSON-LD: Article + author Organization ("<Site> Data Desk", NOT a single Person for YMYL) + publisher Organization + reviewedBy Person (visible byline) + BreadcrumbList + FAQPage (HowTo if tutorial); datePublished + dateModified present; matches content
- [ ] 🔴 Dataset schema present for every .gov/authoritative source cited (creator.url = exact endpoint)
- [ ] 🔴 Hero features the advisor in-context (no anonymous stock); unique image per post (never reused)
- [ ] 🔴 Every image has descriptive alt text; charts render; comparison tables render
- [ ] 🔴 TPMO disclaimer + non-affiliation + informational-only present; no banned superlatives; plan year stated
- [ ] 🟡 Open Graph + Twitter Card tags set
- [ ] 🟡 3–5 internal links (descriptive anchors) + 1–3 authoritative external links; no broken links
- [ ] 🟡 Author bio + credentials; published + updated dates; Sources section; Related Articles
- [ ] 🟡 Brand colors/fonts/components; no global UI change; UI spacing tested desktop + mobile
- [ ] 🟡 Core Web Vitals not regressed (LCP<2.5s, INP<200ms, CLS<0.1); mobile-friendly; HTTPS
- [ ] 🟢 Category rotated vs recent posts; topic not duplicated (no cannibalization); if the site is one of several templated sites, the copy is genuinely rewritten per site (not a templated near-duplicate); `updatedDate` set for future refresh

---

## Source whitelist (cite these only; verify every number; state the plan year)
- **Primary (.gov):** CMS.gov, Medicare.gov, SSA.gov, MedPAC.gov, HHS.gov, IRS.gov (IRMAA/tax), state Departments of Insurance / SHIP programs.
- **Research (.org):** KFF (kff.org) & KFF Health News, NCOA (ncoa.org), Commonwealth Fund, Peterson-KFF Health System Tracker, AARP Public Policy Institute.
- **Reputable news** only if no primary source exists (AP, Reuters) — prefer the underlying official data.
- **Never cite:** competitor agency blogs, lead-gen content farms, undated/anonymous stats, or AI-generated pages.

## Must-verify Medicare numbers (always: figure + plan year + source)
Part A & B premiums/deductibles, Part D & IRMAA brackets, Medicare Advantage enrollment & out-of-pocket maximums, Medigap pricing ranges, late-enrollment penalty amounts, LIS/Extra Help thresholds — from CMS/Medicare.gov/KFF/SSA for the stated year.

## Disclaimer library (adapt to the site's legal copy)
- **TPMO:** "We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options."
- **Non-affiliation:** "Not affiliated with or endorsed by the U.S. government or the federal Medicare program."
- **Informational:** "For general information only — not medical, insurance, tax, or legal advice. Eligibility, costs, and plan availability vary by location and plan year. Consult a licensed agent and confirm at Medicare.gov."

**Bottom line:** accuracy + compliance outweigh length. A correct, sourced, compliant 3,500-word article beats an 8,000-word unverified one.
