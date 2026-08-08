---
name: blog-post-writer
description: >-
  Use to research, write, verify, and test a complete, publish-ready blog article for ANY website or niche. Picks a trending / high-intent topic, rotates content categories (explainer, how-to, comparison, cost, timely, myths, news, data/trends), writes answer-first long-form (3,000–8,000 words depending on topic) with a Table of Contents, TL;DR, verified statistics, charts/graphs, FAQ, author bio, Sources section, related articles, and a clear CTA. Enforces SEO + AEO: meta title, meta description, canonical, Open Graph + Twitter Card, JSON-LD schema, image alt text. Uses only authoritative sources and verifies every number. Follows the site's brand colors/components, self-reviews, builds/previews to confirm charts + stats render and UI spacing is correct, then runs the SEO + AEO page audit. Niche-agnostic master skill. Trigger on: "write a blog post", "draft an article", "new blog article", "write about X".
---

# Blog Post Writer (generic, any niche)

Produces ONE complete, verified, well-tested article and prepares it for publish. Niche-agnostic — for a specific industry (e.g. Medicare, ACA, Life Insurance) use the matching niche skill, which supplies the categories, sources, compliance, and seasonal calendar and then defers to THIS process for structure, length, SEO/AEO, and testing.

## Length
**3,000–8,000 words, matched to the topic and search intent.** Pillar/comparison/ultimate-guide pieces trend longer; focused how-tos/news can be shorter. Be more *complete and useful* than what currently ranks — never pad.

---

## Workflow (in order)

### STEP 0 — Learn the site & brand (never hardcode)
- Read brand source (`site.ts` / `BRAND.md` / theme tokens): **brand colors, fonts, components, tone/voice**.
- Pick a **real, credentialed human as the visible byline / reviewer** from the author data (E-E-A-T). The **schema author is the Organization** ("<Site> Data Desk"); the human is shown on-page and may be `reviewedBy`. For YMYL niches (Medicare, ACA, life, health, finance) single-Person schema authors are **banned** — show the qualified human on-page, Org as schema author.
- Inspect the existing post collection: copy the **exact frontmatter shape, slug pattern, categories/tags, and MDX components** in use; match them. List existing slugs so you do NOT duplicate a topic.

### STEP 1 — Pick a topic from real demand
- **Check Google Trends** for the niche's terms (rising queries, seasonality).
- **Keyword research:** ONE primary keyword + 2–4 semantic variations with genuine intent.
- Use seasonal/timely angles relevant to the niche. Confirm the topic isn't already covered (no cannibalization).

### STEP 2 — Choose the article TYPE and ROTATE the category
Don't keep writing one category. Rotate (track recent posts, pick a fresh one):
1. **Explainer / "what is"** 2. **How-to / step-by-step** 3. **Comparison / "vs"** 4. **Cost / pricing** 5. **Timely / deadlines / seasonal** 6. **Myths & mistakes** 7. **News / policy commentary** (data-backed, neutral) 8. **Data / trends** 9. **Audience-specific guides**.
Vary topic and angle so the blog reads as a broad authority resource.

### STEP 3 — Verify EVERY statistic
- **No fabricated or unsourced numbers.** Each stat needs: figure + **year** + **link to a primary/authoritative source**.
- Prefer the most recent official data; state the year. If a number can't be verified authoritatively, omit it or make it qualitative.

### STEP 4 — Write the article (required structure)
In brand voice, plain accessible language. Include ALL:
- **Meta title** (50–60 chars, primary keyword near front) and **meta description** (140–160).
- **TL;DR / Key Takeaways** box near the top.
- **Table of Contents** with jump links.
- **Answer-first intro** (core answer in the first 1–2 sentences); keyword in the first 100 words.
- Clean **H2/H3 hierarchy**, one H1; question-style subheadings where natural (AEO).
- **Verified stats** (year + linked source).
- **1–3 charts/graphs** that render (Step 5) + a **comparison table** where relevant.
- **FAQ** (real questions → concise answers) → FAQPage schema.
- **Clear CTA** appropriate to the site.
- **Author bio + credentials**; **published + last-updated dates**.
- **Sources / References** section (every citation).
- **Related Articles** (internal links).
- Niche disclaimers if applicable (YMYL).

### STEP 5 — Charts, graphs & stats (must render)
- Use the site's existing chart components/library (inline SVG preferred). Reuse the project pattern; don't invent UI.
- Each chart: title, labeled axes/legend, **source caption with year**, accessible markup (`role="img"`, `aria-label`). Verified data only.
- **Hero image:** features the **advisor in-context** (no anonymous stock b-roll). Use a **unique image per post** — never reuse a hero across articles. For a real landmark/location, composite the advisor over a real photo (don't AI-generate the landmark).

### STEP 6 — SEO + AEO essentials (bake in while writing)
- **SEO:** unique meta title + description, self-referencing **canonical**, clean headings, internal + authoritative external links, descriptive **image alt text**, compressed images with width/height, fast/CLS-safe.
- **AEO:** answer-first passages that stand alone, FAQ, entity clarity, citable sourced facts, liftable tables/step-lists.
- **Open Graph + Twitter Card:** `og:title`, `og:description`, `og:url` (this page), `og:image` (~1200×630), `og:type`; `twitter:card=summary_large_image`.
- **JSON-LD schema:** `Article` (or `BlogPosting`) + author `Organization` ("<Site> Data Desk") + publisher `Organization` + `reviewedBy` `Person` (visible byline) + `BreadcrumbList` + `FAQPage` + `Dataset` (per the Dataset bullet below) (and `HowTo` for tutorials). `datePublished` + `dateModified` always present. Markup must match visible content.
- **Dataset schema (Pillar 3 — the moat):** inject one `Dataset` block per authoritative/.gov source cited (Brain-sourced figures included). `creator.url` = the **exact endpoint** (e.g. `cdc.gov/places`, `census.gov`, `cms.gov`), NOT the homepage. Use the JSON template: `{"@context":"https://schema.org","@type":"Dataset","name":"<source dataset name>","description":"<1 sentence on what was pulled>","creator":{"@type":"Organization","name":"<source name>","url":"<exact endpoint URL>"},"license":"https://creativecommons.org/publicdomain/zero/1.0/","isAccessibleForFree":true}`. Skip ONLY if no external data is cited.
- **Pillar 4 (site-level) reminder:** confirm the site serves a valid `/llms.txt` (with a "Tools (agent-callable)" section), does **not** block AI crawlers, and (data-driven sites) exposes WebMCP (`/.well-known/mcp.json` + `/mcp` proxy + in-page `navigator.modelContext`). If missing, flag it — the `seo-aeo-page-audit` will gate on it.

### STEP 7 — Branding & UI consistency
- Use brand colors/fonts/components via the site's tokens (never hardcode hex). Use existing section/MDX components. **Do not change global UI/CSS** — author within existing components.

### STEP 8 — Links
- 3–5 **internal** links (descriptive anchors) to relevant posts/money pages; 1–3 **external** links to **authoritative sources only** (official/government, established research orgs, reputable news). Never link content farms, competitors, or AI-generated pages. No broken links.

### STEP 9 — Self-review, build & TEST (don't skip)
1. Re-read end to end: accuracy, flow, no contradictions, every stat sourced, CTA present, disclaimers (if YMYL).
2. **Build/preview** the site; fix any error your file caused.
3. **Confirm rendering:** charts/graphs display (not broken/empty), stats + tables show, FAQ works, schema present.
4. **Test UI:** view the rendered page on **desktop + mobile** (preview/screenshot) — proper **spacing**, no overflow/cut-off, readable contrast, **all images have alt**, brand colors correct, layout not broken. Fix and rebuild.

### STEP 10 — Run the SEO + AEO audit
- Run the **`seo-aeo-page-audit`** skill (or its checklist) on the finished article. Resolve every 🔴 must-fix before publishing.

---

## Required components checklist
- [ ] 3,000–8,000 words appropriate to topic/intent
- [ ] Meta title 50–60 + meta description 140–160 + self-referencing canonical
- [ ] TL;DR box · Table of Contents · answer-first intro · one H1 · keyword in first 100 words
- [ ] Every stat verified (figure + year + authoritative source link)
- [ ] 1–3 rendering charts/graphs (source caption + aria) + comparison table where relevant
- [ ] FAQ (+ FAQPage schema)
- [ ] Open Graph + Twitter Card tags
- [ ] JSON-LD: Article + author Organization ("<Site> Data Desk", NOT a single Person for YMYL) + publisher Organization + reviewedBy Person (visible byline) + BreadcrumbList + FAQPage (HowTo if tutorial); datePublished + dateModified present
- [ ] Dataset schema present for every .gov/authoritative source cited (creator.url = exact endpoint)
- [ ] Hero features the advisor in-context (no anonymous stock); unique image per post (never reused)
- [ ] All images have descriptive alt text
- [ ] Author bio + credentials; published + updated dates
- [ ] Sources/References section
- [ ] 3–5 internal links + authoritative external links; no broken links
- [ ] Related Articles section
- [ ] Brand colors/fonts/components; no global UI changes
- [ ] Category rotated (not same as recent); topic not duplicated (no cannibalization); if site is one of several templated sites, copy is genuinely rewritten per site (not a templated near-duplicate)
- [ ] Built + previewed; charts/stats render; UI spacing tested desktop + mobile
- [ ] `seo-aeo-page-audit` run — all 🔴 resolved

## Notes
- Accuracy > volume. A correct, sourced 3,500-word piece beats an 8,000-word unverified one.
- For YMYL niches (money, health, legal, safety) enforce stronger E-E-A-T, conservative claims, and disclaimers — use the niche skill.
