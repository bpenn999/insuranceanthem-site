---
name: life-insurance-blog-writer
description: >-
  Self-contained skill to research, write, verify, and test a complete, compliant life-insurance blog article for a USA website — term life, whole life, universal/IUL, final expense/burial, group vs individual, riders, underwriting, beneficiaries, and how-much-coverage needs analysis. Picks a trending/high-intent topic, rotates categories, writes answer-first long-form (3,000–8,000 words by topic) with TL;DR, Table of Contents, verified statistics, charts/graphs, FAQ, author bio, Sources, related articles, compliant CTAs; sets meta title/description, canonical, Open Graph, JSON-LD schema, image alt; follows brand colors; self-reviews, builds/previews to confirm charts + stats render and UI spacing is correct; and runs an embedded SEO+AEO checklist at the end. YMYL — highest accuracy/expertise bar; state-regulated, no guaranteed-returns/investment claims, underwriting varies. Trigger on: "write a life insurance article", "life insurance blog post", "write about term vs whole life / final expense / IUL / how much life insurance".
---

# Life Insurance Blog Writer (USA · YMYL) — self-contained

Produces ONE complete, verified, compliant, tested life-insurance article and prepares it to publish. Everything needed is in this file — no other skill required. Life-insurance content is **YMYL**: never guess a number, never give individualized advice, always cite authoritative sources, always include disclaimers, and always state the **year** for any figure.

**Length:** 3,000–8,000 words matched to topic/intent. Be more complete and useful than what currently ranks — never pad.

---

## Workflow (do in order)

### STEP 0 — Learn the site & brand (never hardcode)
- Read the brand source (`src/data/site.ts` / `BRAND.md` / theme tokens): **brand colors, fonts, components, tone/voice**.
- Pick a **real, credentialed human as the visible byline / reviewer** (licensed life agent / financial professional). The **schema author is the Organization** ("<Site> Data Desk"); the human is shown on-page and may be `reviewedBy`. Single-Person schema authors are **banned for YMYL** (life/finance). E-E-A-T matters.
- Inspect the existing post collection: copy the **exact frontmatter shape, slug pattern, categories/tags, MDX components** in use and match them. List existing slugs so you do NOT duplicate a topic.

### STEP 1 — Pick a topic from real demand
- **Check Google Trends** for life-insurance terms — rising queries and seasonality.
- **Keyword research:** ONE primary keyword + 2–4 semantic variations with genuine intent. Confirm not already covered (no cannibalization).
- **Write ahead of the calendar:** **Life Insurance Awareness Month** (September) · **tax season / year-end financial planning** (Jan–Apr) · life-event triggers year-round (new baby, new home/mortgage, marriage, business partnership).

### STEP 2 — Choose the article TYPE and ROTATE the category
Track recent posts; pick a fresh category each time:
1. **Explainer / "What is"** — "How term life works", "What is final expense insurance?", "Cash value explained"
2. **How-to / step-by-step** — "How much life insurance do I need? (DIME method)", "How to name beneficiaries", "How to compare quotes", "How to file a claim"
3. **Comparison / "vs"** — "Term vs whole life", "IUL vs whole life", "Final expense vs term for seniors", "Group vs individual coverage"
4. **Cost / pricing** — "What life insurance costs by age & coverage", "Why whole life costs more than term"
5. **Timely / seasonal** — "Why September is the time to review coverage", "Coverage after a new baby or mortgage"
6. **Myths & mistakes** — "Life insurance myths", "Mistakes that delay or deny a claim"
7. **News / data commentary** — coverage-gap & ownership trends (neutral, data-backed)
8. **Data / trends** — LIMRA/III Insurance Barometer findings
9. **Audience guides** — young families, new parents, business owners (key-person/buy-sell), seniors, smokers, people with diabetes/health conditions, stay-at-home parents

### STEP 3 — Verify EVERY statistic
- No fabricated/unsourced numbers. Each stat: figure + **year** + **link to an authoritative source** (whitelist below). Never quote a single premium as universal — rates vary by age, health, carrier, and state. Omit/qualify anything unverifiable.

### STEP 4 — Write the article (required structure — include ALL)
Brand voice; plain, accessible language (define jargon like term, cash value, rider, underwriting, beneficiary).
- **Meta title** 50–60 chars (keyword near front) · **Meta description** 140–160 chars.
- **TL;DR / Key Takeaways** box near the top.
- **Table of Contents** with jump links.
- **Answer-first intro** (core answer in first 1–2 sentences); keyword in first 100 words.
- Clean **H2/H3 hierarchy**, one **H1**; question-style subheadings (AEO).
- **Verified statistics** (figure + year + linked source).
- **1–3 charts/graphs** that render (Step 5) + **comparison table** where relevant (e.g. term vs whole).
- **FAQ section** (real questions → concise answers) → FAQPage schema.
- **Compliant CTA(s)** — "compare quotes", "talk to a licensed agent", "estimate your coverage need".
- **Author bio + credentials**; **published + last-updated dates**.
- **Sources / References** section.
- **Related Articles** (internal links).
- **Compliance disclaimers** (Step 9).

### STEP 5 — Charts, graphs & stats (must render)
- Use the site's existing chart components/library (inline SVG preferred). Reuse the project pattern. Each chart: title, labeled axes/legend, **source caption with year**, accessible markup (`role="img"`, `aria-label`). Verified data only (e.g. sample term rates by age clearly labeled "illustrative, varies by carrier/health").
- **Hero image:** features the **advisor in-context** (no anonymous stock b-roll). Use a **unique image per post** — never reuse a hero across articles. For a real landmark/location, composite the advisor over a real photo (don't AI-generate the landmark).

### STEP 6 — SEO + AEO essentials (bake in while writing)
- **SEO:** unique meta title + description; self-referencing **canonical**; clean headings; internal + authoritative external links; **descriptive alt on every image**; compressed images with width/height; CLS-safe.
- **AEO:** standalone answer-first passages; FAQ; clear entities (policy types, who it's for); citable sourced facts; liftable tables/step lists.
- **Open Graph + Twitter Card:** `og:title`, `og:description`, `og:url` (this page), `og:image` (~1200×630), `og:type`; `twitter:card=summary_large_image`.
- **JSON-LD:** `Article` + author `Organization` ("<Site> Data Desk") + publisher `Organization` + `reviewedBy` `Person` (visible byline) + `BreadcrumbList` + `FAQPage` + `Dataset` (per the Dataset bullet below) (HowTo for tutorials). `datePublished` + `dateModified` always present. Match visible content.
- **Dataset schema (Pillar 3 — the moat):** inject one `Dataset` block per authoritative/.gov source cited (Brain-sourced figures included). `creator.url` = the **exact endpoint** (e.g. `cdc.gov/places`, `census.gov`, `bls.gov`, `irs.gov`), NOT the homepage. Use the JSON template: `{"@context":"https://schema.org","@type":"Dataset","name":"<source dataset name>","description":"<1 sentence on what was pulled>","creator":{"@type":"Organization","name":"<source name>","url":"<exact endpoint URL>"},"license":"https://creativecommons.org/publicdomain/zero/1.0/","isAccessibleForFree":true}`. Skip ONLY if no external data is cited.
- **Pillar 4 (site-level) reminder:** confirm the site serves a valid `/llms.txt` (with a "Tools (agent-callable)" section), does **not** block AI crawlers, and (data-driven sites) exposes WebMCP (`/.well-known/mcp.json` + `/mcp` proxy + in-page `navigator.modelContext`). If missing, flag it — the `seo-aeo-page-audit` will gate on it.

### STEP 7 — Branding & UI consistency
- Brand colors/fonts/components via tokens (never hardcode hex). Use existing components. **Do not change global UI/CSS** — author within existing components.

### STEP 8 — Links
- 3–5 **internal** (descriptive anchors) to relevant posts + money pages (quote, contact); 1–3 **external** to **authoritative sources only**. Never link competitor blogs, lead-gen farms, or AI pages. No broken links.

### STEP 9 — Life-insurance compliance (mandatory)
- **State-regulated:** benefits, riders, pricing, and eligibility vary by carrier, state, age, and **underwriting/health** — never present one quote as universal or guaranteed.
- **No investment/guaranteed-return claims** for protection products (especially whole/IUL); describe cash value and illustrations conservatively and state they are **not guarantees** of future performance.
- **Informational-only:** "For general information only — not insurance, financial, tax, or legal advice. Coverage, riders, costs, and eligibility vary by individual, health, carrier, and state. Consult a licensed agent and review the policy illustration."
- Avoid fear-based or false-urgency tactics. Respect **TCPA** consent for call/text quote CTAs. Note tax points (e.g. death benefit generally income-tax-free) with an IRS source and a "consult a tax professional" caveat.

### STEP 10 — Self-review, build & TEST (don't skip)
1. Re-read end to end: accuracy, flow, no contradictions, every stat sourced + dated, disclaimers present, CTA compliant, no guaranteed-return language.
2. **Build / preview**; fix any error your file caused.
3. **Confirm rendering:** charts/graphs display, stats + tables show, FAQ works, schema present.
4. **Test the UI:** desktop AND mobile (preview/screenshot) — proper **spacing**, no overflow/cut-off, readable contrast, **all images have alt**, brand colors correct, layout not broken. Fix and rebuild.

### STEP 11 — Final SEO + AEO checklist (embedded — run before publish)
Fix all 🔴 before publishing.
- [ ] 🔴 Meta title 50–60 (unique) · meta description 140–160 (unique) · self-referencing canonical
- [ ] 🔴 One H1 + keyword in first 100 words · clean H2/H3 · answer-first intro
- [ ] 🔴 3,000–8,000 words; original, intent-matched, more complete than competitors
- [ ] 🔴 Every statistic: figure + year + authoritative source link (no fabricated numbers; rates labeled illustrative)
- [ ] 🔴 TL;DR box · Table of Contents · FAQ (+ FAQPage schema)
- [ ] 🔴 JSON-LD: Article + author Organization ("<Site> Data Desk", NOT a single Person for YMYL) + publisher Organization + reviewedBy Person (visible byline) + BreadcrumbList + FAQPage (HowTo if tutorial); datePublished + dateModified present; matches content
- [ ] 🔴 Dataset schema present for every .gov/authoritative source cited (creator.url = exact endpoint)
- [ ] 🔴 Hero features the advisor in-context (no anonymous stock); unique image per post (never reused)
- [ ] 🔴 Every image has descriptive alt; charts + comparison tables render
- [ ] 🔴 State-regulated + no-guaranteed-return + informational disclaimers present; no universal/guaranteed price claims
- [ ] 🟡 Open Graph + Twitter Card tags set
- [ ] 🟡 3–5 internal links + 1–3 authoritative external links; no broken links
- [ ] 🟡 Author bio + credentials; published + updated dates; Sources section; Related Articles
- [ ] 🟡 Brand colors/fonts/components; no global UI change; UI spacing tested desktop + mobile
- [ ] 🟡 Core Web Vitals not regressed; mobile-friendly; HTTPS
- [ ] 🟢 Category rotated vs recent posts; topic not duplicated (no cannibalization); if the site is one of several templated sites, the copy is genuinely rewritten per site (not a templated near-duplicate); `updatedDate` set

---

## Source whitelist (cite these only; verify every number; state the year)
- **Research/industry (.org):** NAIC (naic.org), LIMRA (limra.com research & Insurance Barometer Study), Insurance Information Institute (iii.org), Society of Actuaries (soa.org), ACLI (acli.com).
- **Primary (.gov):** IRS.gov (tax treatment of proceeds/cash value, estate considerations), SSA.gov (survivor-benefit context), CDC/NCHS (life-expectancy/mortality context), state Departments of Insurance (.gov), CFPB.gov.
- **Reputable news** only if no primary source (AP, Reuters) — prefer underlying data.
- **Never cite:** competitor agency blogs, lead-gen content farms, undated/anonymous stats, AI-generated pages.

## Must-verify life-insurance numbers (figure + year + source)
Average premiums by age/term/face amount (label illustrative), coverage-gap & ownership rates (LIMRA/III), mortality/life-expectancy context (CDC/NCHS), tax treatment of death benefit/cash value (IRS) — cite source and year; never invent rates.

## Disclaimer library (adapt to the site's legal copy)
- **Variability:** "Rates and eligibility vary by age, health, carrier, and state and are determined by underwriting; figures shown are illustrative, not quotes."
- **No guarantees:** "Cash value and policy illustrations are not guarantees of future performance and are not investment advice."
- **Informational:** "For general information only — not insurance, financial, tax, or legal advice. Consult a licensed agent and review your policy illustration; consult a tax professional for tax questions."

**Bottom line:** accuracy + compliance outweigh length. A correct, sourced, compliant 3,500-word article beats an 8,000-word unverified one.
