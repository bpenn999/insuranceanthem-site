---
name: aca-blog-writer
description: >-
  Self-contained skill to research, write, verify, and test a complete, compliant ACA / Health Insurance Marketplace blog article for a USA website — individual & family plans, metal tiers (Bronze/Silver/Gold/Platinum), premium tax credits/subsidies, cost-sharing reductions, eligibility, Open Enrollment & Special Enrollment, and alternatives (ICHRA; short-term caveats). Picks a trending/high-intent topic, rotates categories, writes answer-first long-form (3,000–8,000 words by topic) with TL;DR, Table of Contents, verified statistics, charts/graphs, FAQ, author bio, Sources, related articles, compliant CTAs; sets meta title/description, canonical, Open Graph, JSON-LD schema, image alt; follows brand colors; self-reviews, builds/previews to confirm charts + stats render and UI spacing is correct; and runs an embedded SEO+AEO checklist at the end. YMYL — highest accuracy/expertise bar; directs readers to HealthCare.gov / state Marketplaces and states income/plan-year caveats. Trigger on: "write an ACA article", "Marketplace / Obamacare blog post", "write about ACA subsidies / Open Enrollment / metal tiers".
---

# ACA / Marketplace Blog Writer (USA · YMYL) — self-contained

Produces ONE complete, verified, compliant, tested ACA article and prepares it to publish. Everything needed is in this file — no other skill required. ACA content is **YMYL**: never guess a number, never give individualized advice, always cite primary sources, always include disclaimers, and always state the **plan year**.

**Length:** 3,000–8,000 words matched to topic/intent. Be more complete and useful than what currently ranks — never pad.

---

## Workflow (do in order)

### STEP 0 — Learn the site & brand (never hardcode)
- Read the brand source (`src/data/site.ts` / `BRAND.md` / theme tokens): **brand colors, fonts, components, tone/voice**.
- Pick a **real, credentialed human as the visible byline / reviewer** (licensed health agent / certified Marketplace navigator). The **schema author is the Organization** ("<Site> Data Desk"); the human is shown on-page and may be `reviewedBy`. Single-Person schema authors are **banned for YMYL** (ACA/health). E-E-A-T matters.
- Inspect the existing post collection: copy the **exact frontmatter shape, slug pattern, categories/tags, MDX components** in use and match them. List existing slugs so you do NOT duplicate a topic.

### STEP 1 — Pick a topic from real demand
- **Check Google Trends** for ACA/Marketplace/Obamacare terms — rising queries and seasonality.
- **Keyword research:** ONE primary keyword + 2–4 semantic variations with genuine intent. Confirm not already covered (no cannibalization).
- **Write ahead of the calendar:** **Open Enrollment** Nov 1 – Jan 15 (most states; some state exchanges differ) · **Special Enrollment Periods** for qualifying life events (job loss, marriage, birth, move, income change) · year-round Medicaid/CHIP enrollment.

### STEP 2 — Choose the article TYPE and ROTATE the category
Track recent posts; pick a fresh category each time:
1. **Explainer / "What is"** — "How premium tax credits work", "Metal tiers explained", "What are cost-sharing reductions?"
2. **How-to / step-by-step** — "How to enroll on HealthCare.gov", "How to estimate your subsidy", "How to report an income change"
3. **Comparison / "vs"** — "Bronze vs Silver (and when Silver+CSR wins)", "ACA vs employer plan vs ICHRA", "Marketplace vs Medicaid"
4. **Cost / subsidies** — "What an ACA plan costs by income", "Out-of-pocket maximums this plan year"
5. **Timely / enrollment** — "Open Enrollment checklist", "What's changing this plan year"
6. **Myths & mistakes** — "ACA mistakes that cost you a subsidy"
7. **News / policy commentary** — Marketplace premium/subsidy rule changes (neutral, data-backed)
8. **Data / trends** — enrollment & premium trends (CMS/KFF)
9. **Audience guides** — self-employed, gig workers, early retirees (pre-65), losing job coverage, mixed-status families, young adults aging off a parent's plan

### STEP 3 — Verify EVERY statistic
- No fabricated/unsourced numbers. Each stat: figure + **year/plan year** + **link to a primary source** (whitelist below). Prefer the latest official data; omit/qualify anything unverifiable.

### STEP 4 — Write the article (required structure — include ALL)
Brand voice; plain, accessible language (define jargon like APTC, FPL, CSR, SEP).
- **Meta title** 50–60 chars (keyword near front) · **Meta description** 140–160 chars.
- **TL;DR / Key Takeaways** box near the top.
- **Table of Contents** with jump links.
- **Answer-first intro** (core answer in first 1–2 sentences); keyword in first 100 words.
- Clean **H2/H3 hierarchy**, one **H1**; question-style subheadings (AEO).
- **Verified statistics** (figure + year + linked source).
- **1–3 charts/graphs** that render (Step 5) + **comparison table** where relevant (e.g. metal tiers).
- **FAQ section** (real questions → concise answers) → FAQPage schema.
- **Compliant CTA(s)** — "check your subsidy", "compare Marketplace plans", "talk to a licensed agent".
- **Author bio + credentials**; **published + last-updated dates**.
- **Sources / References** section.
- **Related Articles** (internal links).
- **Compliance disclaimers** (Step 9).

### STEP 5 — Charts, graphs & stats (must render)
- Use the site's existing chart components/library (inline SVG preferred). Reuse the project pattern. Each chart: title, labeled axes/legend, **source caption with year**, accessible markup (`role="img"`, `aria-label`). Verified data only.
- **Hero image:** features the **advisor in-context** (no anonymous stock b-roll). Use a **unique image per post** — never reuse a hero across articles. For a real landmark/location, composite the advisor over a real photo (don't AI-generate the landmark).

### STEP 6 — SEO + AEO essentials (bake in while writing)
- **SEO:** unique meta title + description; self-referencing **canonical**; clean headings; internal + authoritative external links; **descriptive alt on every image**; compressed images with width/height; CLS-safe.
- **AEO:** standalone answer-first passages; FAQ; clear entities (plan types, who it's for, plan year); citable sourced facts; liftable tables/step lists.
- **Open Graph + Twitter Card:** `og:title`, `og:description`, `og:url` (this page), `og:image` (~1200×630), `og:type`; `twitter:card=summary_large_image`.
- **JSON-LD:** `Article` + author `Organization` ("<Site> Data Desk") + publisher `Organization` + `reviewedBy` `Person` (visible byline) + `BreadcrumbList` + `FAQPage` + `Dataset` (per the Dataset bullet below) (HowTo for tutorials). `datePublished` + `dateModified` always present. Match visible content.
- **Dataset schema (Pillar 3 — the moat):** inject one `Dataset` block per authoritative/.gov source cited (Brain-sourced figures included). `creator.url` = the **exact endpoint** (e.g. `healthcare.gov`, `cms.gov`, `census.gov`, `cdc.gov/places`), NOT the homepage. Use the JSON template: `{"@context":"https://schema.org","@type":"Dataset","name":"<source dataset name>","description":"<1 sentence on what was pulled>","creator":{"@type":"Organization","name":"<source name>","url":"<exact endpoint URL>"},"license":"https://creativecommons.org/publicdomain/zero/1.0/","isAccessibleForFree":true}`. Skip ONLY if no external data is cited.
- **Pillar 4 (site-level) reminder:** confirm the site serves a valid `/llms.txt` (with a "Tools (agent-callable)" section), does **not** block AI crawlers, and (data-driven sites) exposes WebMCP (`/.well-known/mcp.json` + `/mcp` proxy + in-page `navigator.modelContext`). If missing, flag it — the `seo-aeo-page-audit` will gate on it.

### STEP 7 — Branding & UI consistency
- Brand colors/fonts/components via tokens (never hardcode hex). Use existing components. **Do not change global UI/CSS** — author within existing components.

### STEP 8 — Links
- 3–5 **internal** (descriptive anchors) to relevant posts + money pages; 1–3 **external** to **authoritative sources only**. Never link competitor blogs, content farms, or AI pages. No broken links.

### STEP 9 — ACA compliance (mandatory)
- **Direct readers to HealthCare.gov** or their **state Marketplace** for official enrollment/eligibility.
- **Subsidies (premium tax credits) and CSRs depend on income, household size, location, and plan year** — never promise specific premiums or savings; show ranges/examples with the year, and note when enhanced-subsidy rules are scheduled to change.
- **Informational-only:** "For general information only — not insurance, tax, or legal advice. Eligibility and costs depend on your income, household, location, and plan year. Visit HealthCare.gov or your state Marketplace and consult a licensed agent or navigator."
- Be cautious with non-ACA "short-term"/"sharing" plans — clearly note they are **not ACA-compliant** and lack guaranteed-issue/essential-health-benefit protections. Respect **TCPA** consent on call/text CTAs.

### STEP 10 — Self-review, build & TEST (don't skip)
1. Re-read end to end: accuracy, flow, no contradictions, every stat sourced + dated, disclaimers present, CTA compliant.
2. **Build / preview**; fix any error your file caused.
3. **Confirm rendering:** charts/graphs display, stats + tables show, FAQ works, schema present.
4. **Test the UI:** desktop AND mobile (preview/screenshot) — proper **spacing**, no overflow/cut-off, readable contrast, **all images have alt**, brand colors correct, layout not broken. Fix and rebuild.

### STEP 11 — Final SEO + AEO checklist (embedded — run before publish)
Fix all 🔴 before publishing.
- [ ] 🔴 Meta title 50–60 (unique) · meta description 140–160 (unique) · self-referencing canonical
- [ ] 🔴 One H1 + keyword in first 100 words · clean H2/H3 · answer-first intro
- [ ] 🔴 3,000–8,000 words; original, intent-matched, more complete than competitors
- [ ] 🔴 Every statistic: figure + year + authoritative source link (no fabricated numbers)
- [ ] 🔴 TL;DR box · Table of Contents · FAQ (+ FAQPage schema)
- [ ] 🔴 JSON-LD: Article + author Organization ("<Site> Data Desk", NOT a single Person for YMYL) + publisher Organization + reviewedBy Person (visible byline) + BreadcrumbList + FAQPage (HowTo if tutorial); datePublished + dateModified present; matches content
- [ ] 🔴 Dataset schema present for every .gov/authoritative source cited (creator.url = exact endpoint)
- [ ] 🔴 Hero features the advisor in-context (no anonymous stock); unique image per post (never reused)
- [ ] 🔴 Every image has descriptive alt; charts + comparison tables render
- [ ] 🔴 HealthCare.gov/state-Marketplace direction + income/plan-year caveats + informational disclaimer present; no guaranteed-savings claims
- [ ] 🟡 Open Graph + Twitter Card tags set
- [ ] 🟡 3–5 internal links + 1–3 authoritative external links; no broken links
- [ ] 🟡 Author bio + credentials; published + updated dates; Sources section; Related Articles
- [ ] 🟡 Brand colors/fonts/components; no global UI change; UI spacing tested desktop + mobile
- [ ] 🟡 Core Web Vitals not regressed; mobile-friendly; HTTPS
- [ ] 🟢 Category rotated vs recent posts; topic not duplicated (no cannibalization); if the site is one of several templated sites, the copy is genuinely rewritten per site (not a templated near-duplicate); `updatedDate` set

---

## Source whitelist (cite these only; verify every number; state the plan year)
- **Primary (.gov):** HealthCare.gov, CMS.gov (CCIIO / Marketplace data & reports), IRS.gov (premium tax credit / Form 8962), HHS.gov, Census.gov (coverage data), state Marketplace sites (.gov), state Departments of Insurance.
- **Research (.org):** KFF (kff.org) — subsidy calculator & Marketplace data, KFF Health News, Commonwealth Fund, Urban Institute, Peterson-KFF Health System Tracker.
- **Reputable news** only if no primary source (AP, Reuters) — prefer underlying official data.
- **Never cite:** competitor agency blogs, lead-gen content farms, undated stats, AI-generated pages.

## Must-verify ACA numbers (figure + plan year + source)
Federal Poverty Level thresholds, premium-tax-credit parameters & income bands, benchmark (second-lowest-cost Silver) premiums, out-of-pocket maximums, CSR eligibility levels, Marketplace enrollment totals — from HealthCare.gov/CMS/KFF/IRS for the stated year.

## Disclaimer library (adapt to the site's legal copy)
- **Official channel:** "Enroll and confirm eligibility at HealthCare.gov or your state Marketplace."
- **Subsidy caveat:** "Premium tax credits and cost-sharing reductions depend on your income, household size, location, and plan year; amounts shown are examples, not guarantees."
- **Informational:** "For general information only — not insurance, tax, or legal advice. Consult a licensed agent or certified navigator."

**Bottom line:** accuracy + compliance outweigh length. A correct, sourced, compliant 3,500-word article beats an 8,000-word unverified one.
