---
name: seo-aeo-page-audit
description: Use right after creating or editing any web page or article to audit it for search (SEO) and answer-engine (AEO/GEO) readiness. Checks title/meta, canonical, headings, content depth, internal/external links, images/alt, structured data (schema), Core Web Vitals, indexability, duplicate-content risk, and search-engine spam-policy compliance. Produces a prioritized pass/fail report with concrete fixes. Trigger when a page/post/article is written or updated, or when the user asks to "check SEO", "audit this page", "is this page ready to publish", "SEO check", "AEO check", or "pre-publish review".
---

# SEO + AEO Page Audit

A generic, reusable audit for **a single web page or article**. Works on any stack (static HTML, any CMS or framework, MDX/Markdown). Run it after a page is created or edited, before publishing.

## How to run this audit

1. **Identify the target.** Determine the exact file(s) for the page/article being checked (source file and, if available, the built/rendered HTML). If unclear, ask which page/URL to audit.
2. **Inspect, don't assume.** Read the page source and, where possible, the rendered `<head>` and body. Measure real values (character counts, heading order, link targets, image alts).
3. **Score every item** in Parts A–G below as ✅ pass, ⚠️ needs work, or ❌ fail. Use the severity tags: 🔴 must-fix (blocks publish), 🟡 should-fix, 🟢 nice-to-have.
4. **Run the P0 gates:** **Part H** (Four-Pillar AI Citation Standard) and **Part J** (Insurance Compliance — reason through the copy). Then **reason through Part I** (Readability & Engageability) as a human.
5. **Report** using the Output Format at the end: two scores (AEO/AI Readiness, P0-gated on Part H; and Human Experience) + a READY / NEAR / NOT-READY verdict, then issues grouped by severity with a one-line fix each. **A page is NOT READY if any Part H pillar fails or Part J is FIX-REQUIRED — even if Parts A–G all pass.**
6. **Apply or recommend fixes** per the user's preference. Validate any structured data you add.

Use these character targets: **title 50–60 chars**, **meta description 140–160 chars**.

---

## Part A — Core on-page SEO (every page)

### A1. Title & metadata (`<head>`)
- [ ] 🔴 **Title tag** present, **unique across the site**, 50–60 chars, primary keyword near the front.
- [ ] 🔴 **Meta description** present, unique, 140–160 chars, includes the keyword and a reason to click.
- [ ] 🔴 **Canonical tag** present and **self-referencing** to this page's own URL (correct protocol/host, no stray parameters).
- [ ] 🔴 **Exactly one `<h1>`**, containing the primary keyword.
- [ ] 🟡 **Open Graph**: `og:title`, `og:description`, `og:url` (this page), `og:image` (~1200×630), `og:type`.
- [ ] 🟡 **Twitter Card**: `summary_large_image` with title, description, image.
- [ ] 🟡 `<html lang>` set; charset and responsive `viewport` present.

### A2. URL / slug
- [ ] 🔴 Short, lowercase, hyphenated, keyword-bearing slug; no tracking params in the canonical URL.
- [ ] 🟡 Consistent trailing-slash + host (www/non-www, http→https) — one canonical form, others redirect.

### A3. Headings & content structure
- [ ] 🔴 Logical hierarchy H1 → H2 → H3, no skipped levels, no duplicate H1.
- [ ] 🔴 **Primary keyword appears in the first 100 words.**
- [ ] 🟡 Descriptive subheadings; scannable (short paragraphs, lists, bolded key points).

### A4. Content quality & depth
- [ ] 🔴 Substantive, original, genuinely useful content matched to search intent (no placeholder/empty sections).
- [ ] 🔴 Length appropriate to intent and competitive with what currently ranks (be more complete, not just longer).
- [ ] 🟡 Demonstrates real experience/expertise (first-hand detail, specifics, data) — E-E-A-T.
- [ ] 🟡 No keyword stuffing; natural language; covers the sub-questions a reader would have.

### A5. Links
- [ ] 🔴 Internal links to relevant pages with descriptive anchor text (not "click here"); no orphan page.
- [ ] 🟡 1–3 outbound links to authoritative sources where claims are made.
- [ ] 🔴 No broken links or redirect chains (everything returns 200).

### A6. Images & media
- [ ] 🔴 Every meaningful image has descriptive **alt text** (decorative images use empty `alt=""`).
- [ ] 🟡 Compressed, modern format (WebP/AVIF), explicit `width`/`height` (prevents layout shift), lazy-load below the fold.
- [ ] 🟢 Descriptive file names.

### A7. Technical & indexability
- [ ] 🔴 Page returns **200** and renders without console/runtime errors.
- [ ] 🔴 Page is **indexable** (not blocked by robots.txt or an unintended `noindex`); included in the XML sitemap.
- [ ] 🔴 **Utility/thin pages are `noindex`** (checkout, thank-you, cart, internal search, filtered/parameter URLs). Note: a robots.txt `Disallow` does NOT remove a page from the index — use a `noindex` meta tag.
- [ ] 🟡 **Core Web Vitals** pass: LCP < 2.5s, INP < 200ms, CLS < 0.1.
- [ ] 🟡 Mobile-friendly/responsive; HTTPS; no mixed content.

---

## Part B — AEO / GEO (answer-engine readiness)

Optimizes for AI answers and featured snippets (assistants, AI overviews, conversational search).

- [ ] 🔴 **Answer-first:** the core question is answered directly in the first 1–2 sentences (≈ first 40–60 words).
- [ ] 🔴 **Self-contained passages:** each section makes sense quoted on its own — engines cite passages, not whole pages.
- [ ] 🔴 **FAQ section** with real questions phrased the way people ask them, each with a concise 2–3 sentence answer.
- [ ] 🟡 **Entity clarity:** explicitly name the product/service, who it's for, and (if relevant) location — avoid vague "we/it".
- [ ] 🟡 **Citable facts:** statistics include a year and a linked authoritative source; no fabricated numbers.
- [ ] 🟡 **Liftable formats:** comparison tables, step lists, and definition blocks where useful.
- [ ] 🟢 Question-style subheadings that mirror conversational/voice queries.

---

## Part C — Article / long-form content (when the page is an article)

- [ ] 🔴 Compelling headline (H1) with the primary keyword; title tag optimized separately for click-through.
- [ ] 🔴 Intro states the takeaway/answer within the first 2–3 sentences.
- [ ] 🔴 **Table of contents** with jump links for long pieces.
- [ ] 🔴 **Key-takeaways / summary box** near the top.
- [ ] 🔴 **Author byline with bio/credentials**; visible **published and last-updated dates**.
- [ ] 🟡 One primary keyword + 2–4 semantic variations used naturally (URL, H1, first paragraph, ≥1 subheading).
- [ ] 🟡 3–5 internal links with varied anchors; 1–3 authoritative external links.
- [ ] 🟡 Original insight/data/examples (the "Experience" signal); not generic rephrasing of competitors.
- [ ] 🟡 Clear call-to-action linking to the relevant next step on the site.
- [ ] 🟢 Charts/tables/visuals for data; optimized images with alt text.

---

## Part D — Duplicate-content & cannibalization

- [ ] 🔴 This page targets a **distinct keyword + intent** — no other page on the site competes for the same term (cannibalization).
- [ ] 🔴 **Self-referencing canonical** (never canonical to a different domain or unrelated page).
- [ ] 🔴 **Unique title and meta description** vs every other page.
- [ ] 🟡 If the site is one of several **similar/templated sites**, the substantive copy is genuinely rewritten per site (unique examples, terminology, framing) — not the same text with a word swapped. Templated near-duplicates across domains are detectable and devalued.
- [ ] 🟡 Old/duplicate URLs are **301-redirected** to the canonical version rather than left live.
- [ ] 🟢 Spot-check originality with a duplicate-content checker before publishing.

---

## Part E — Search-engine policy compliance (avoid penalties)

Verify the page does not trip these common spam-policy issues (and broader quality systems):

- [ ] 🔴 **Not thin / low-value** — has original value beyond ads/affiliate links/boilerplate.
- [ ] 🔴 **Not scaled/auto-generated without value** — any AI-assisted content is reviewed, accurate, and genuinely helpful.
- [ ] 🔴 **Not a doorway page** — not one of many near-identical pages whose only purpose is to funnel users to one destination.
- [ ] 🔴 **No cloaking / sneaky redirects** — users and crawlers see the same content.
- [ ] 🔴 **No hidden text or keyword stuffing.**
- [ ] 🟡 **No manipulative links** (paid links without rel attributes, link exchanges, sitewide cross-link blocks at scale).
- [ ] 🟡 **Structured data matches visible content** — no fake reviews/ratings or markup for unseen content.
- [ ] 🟡 **Build for people first.** Content that genuinely helps a user satisfies both search quality systems and AI answer engines.

### E1. YMYL pages (extra scrutiny)
If the page covers **money, health, legal, safety, or major life decisions** ("Your Money or Your Life"), it's held to a higher expertise/accuracy bar:
- [ ] 🔴 Author/organization expertise and credentials are visible.
- [ ] 🔴 Claims are accurate, current, and sourced; appropriate disclaimers present (e.g., "not professional advice").
- [ ] 🟡 Conservative, verifiable statements — avoid unprovable financial/medical/legal promises.

---

## Part F — Structured data by page type (JSON-LD)

Add and validate the schema appropriate to the page (validate at a Rich Results / schema validator; zero errors; markup must match visible content):

| Page type | Recommended schema |
|---|---|
| Site-wide | `Organization` (or `LocalBusiness`), `WebSite` |
| Home | `Organization` + `WebSite` |
| Article / news / post | `Article` (or `NewsArticle`) + author `Organization` ("<Site> Data Desk", NOT a single `Person` for YMYL) + `reviewedBy` `Person` (visible byline) + publisher `Organization` + `BreadcrumbList` (+ `FAQPage` if an FAQ exists) + `Dataset` (one per .gov/authoritative source cited) |
| How-to / tutorial | `HowTo` (+ `BreadcrumbList`) |
| Product | `Product` + `Offer` (+ `AggregateRating`/`Review` only if real) |
| Service / category | `Service` (+ `LocalBusiness` if local) + `BreadcrumbList` |
| Location / geo / service-area page | `LocalBusiness` + `GovernmentService` + `Place` + `BreadcrumbList` + `FAQPage` (+ `Dataset` if it cites local .gov data) — matches the enrollmedicare geo-page recipe; NOT just `LocalBusiness` |
| FAQ block | `FAQPage` |
| Comparison / list | `Article` + `BreadcrumbList` |
| Local business / location | `LocalBusiness` with NAP, hours, geo |

---

## Part G — Site-level files (verify these exist for the site)

- [ ] 🔴 `robots.txt` — allows crawl of indexable content, disallows utility paths, lists the `Sitemap:` URL.
- [ ] 🔴 **XML sitemap** — contains only indexable canonical URLs, valid `lastmod`; submitted in Search Console.
- [ ] 🟡 Custom `404` page.
- [ ] 🟡 Default social/OG image (~1200×630).
- [ ] 🔴 `llms.txt` — valid `/llms.txt` (H1 + summary + sections) **including a "Tools (agent-callable)" section**. (Pillar 4; see Part H.)
- [ ] 🔴 AI crawlers **NOT blocked** in `robots.txt`/WAF: GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended, ClaudeBot, Bingbot. (Pillar 4.)
- [ ] 🔴 Data-driven sites: WebMCP exposed — `/.well-known/mcp.json` (≥1 tool) + a `/mcp` proxy that answers `tools/list` + in-page `navigator.modelContext`. (Pillar 4.)

---

## Part H — Four-Pillar AI Citation Standard (P0 — blocks publish)

The SAA moat. **Every one of these is 🔴. A page is NOT READY if ANY pillar fails, even if Parts A–G all pass.**

- [ ] 🔴 **Pillar 1 — Authoritative author:** `Article`/`WebPage` schema with an Org-level **"<Site> Data Desk"** author (NOT a single `Person` for YMYL: Medicare, ACA, life, health, finance). The named human stays as a visible byline / `reviewedBy`. `datePublished` + `dateModified` both present.
- [ ] 🔴 **Pillar 2 — FAQPage:** `FAQPage` schema with 3–5 Q&A pairs phrased as **real search queries**.
- [ ] 🔴 **Pillar 3 — Dataset (the moat):** a `Dataset` schema block for **every** .gov/authoritative source the page cites; `creator.url` = the **exact endpoint** (e.g. `cdc.gov/places`, `census.gov`, `healthcare.gov`, `cms.gov`) — NOT the homepage. Skip ONLY if the page cites no external data.
- [ ] 🔴 **Pillar 4 — Agentic Readiness (site-level):** valid `/llms.txt` with a **"Tools (agent-callable)"** section; AI crawlers **NOT blocked** in `robots.txt`/WAF (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended, ClaudeBot, Bingbot); and for **data-driven sites** WebMCP is exposed — `/.well-known/mcp.json` + a `/mcp` proxy + in-page `navigator.modelContext`.

---

## Part I — Readability & Engageability (Human Experience)

A second axis, scored **independently** of the AEO/AI axis. **Reason through these as a human reader — don't just tick boxes.** Quote the offending passage and rewrite it.

- Does the **intro actually answer** the question a human asked (not just an SEO preamble)?
- Is it **scannable** — short paragraphs, bullets, **bolded takeaways**, clear visual hierarchy and whitespace?
- Is the **reading level appropriate** for the audience (Medicare/senior audience is 60+ → aim ~6th–8th grade)?
- Are **jargon terms defined** on first use (APTC, IRMAA, CSR, underwriting, cash value, etc.)?
- Is there a **real reason to keep reading** — a hook, momentum, payoff — or does it read as filler?
- Does the page **feel like a person wrote it for a person** (voice, rhythm) rather than templated AI slop?

**Output two scores + a verdict:**
1. **AEO/AI Readiness** — P0-GATED on Part H (any Part H pillar fails ⇒ capped at NOT-READY).
2. **Human Experience** — readability + engageability (not gated).

Combined verdict: **READY** (AEO clean + HX strong) · **NEAR** (minor should-fixes, no P0) · **NOT-READY** (any Part H pillar fails, OR open 🔴 in Parts A–G).

---

## Part J — Insurance Compliance (the AI reasons about the words)

**Reasoning-based, not a checklist.** Read the rendered copy **sentence by sentence** — body, headings, CTAs, alt text, meta — and *reason* about whether the words break an insurance-marketing rule. Do not just tick a box. For each issue, return: **the exact offending phrase**, **where it is** (file/section), **which rule it breaks**, and **a compliant rewrite**.

Catch the insurance-marketing violations a generic SEO audit misses:
- **Banned superlatives / ranking claims** — "the best", "#1", "cheapest", "top-rated", "most popular".
- **"Every / all plans" claims** — "we offer all the plans", "every plan in your area". CMS TPMO requires you to say you do **NOT** offer every plan; flag self-contradiction with the TPMO disclaimer as a hard fail.
- **Implied government affiliation** — wording or imagery suggesting endorsement by Medicare / CMS / the federal government.
- **"Free" misuse** — calling a $0-premium plan "free".
- **Guaranteed savings / returns** — "you'll save $X", "guaranteed returns" (especially life/IUL/annuity).
- **Missing required disclaimers** — TPMO + non-affiliation (Medicare); HealthCare.gov direction (ACA); no-guarantee / illustration caveats (life); informational-only.
- **TCPA** — call/text CTAs without consent language.
- **Unsourced / absolute claims** on YMYL topics.

**Output:** a verdict — **PASS** or **FIX REQUIRED** — plus the flagged phrases with rewrites, phrased as the AI's reasoning (not a static form). Part J runs as part of the audit; a **FIX-REQUIRED** result **blocks publish** (same gate as Part H). The writers call this before publish.

---

## Quick pre-publish gate (condensed)

Tick all before publishing any page:
1. [ ] Unique title (50–60) + meta description (140–160) + self-referencing canonical
2. [ ] One H1, clean heading order, keyword in first 100 words, answer-first intro
3. [ ] Adequate, original, intent-matched content; no duplicate of another page/site
4. [ ] Internal links (descriptive anchors) + ≥1 authoritative external link; no broken links
5. [ ] All images have alt text; Core Web Vitals not regressed
6. [ ] Valid JSON-LD that matches the content; FAQ schema if an FAQ is present
7. [ ] Indexable + in sitemap; utility/thin pages set to `noindex`
8. [ ] Facts sourced (no fabrication); author + dates shown (for articles); clear CTA
9. [ ] Passes policy check (not thin/doorway/cloaked/stuffed); YMYL pages have visible expertise
10. [ ] **Four Pillars pass** (Part H) — Org "Data Desk" author + FAQPage + Dataset-per-source + Pillar-4 site surfaces (llms.txt w/ Tools section, AI crawlers not blocked, WebMCP on data sites)
11. [ ] **Insurance compliance pass** (Part J) — no banned superlatives / "every-plan" overclaims / "free" misuse / guaranteed-savings; required disclaimers present; FIX-REQUIRED blocks publish

---

## Output format (what to return after auditing)

```
SEO + AEO Audit — <page URL or path>
Verdict: READY ✅ | NEAR 🟡 | NOT READY ❌   (NOT READY if any Part H pillar fails or Part J = FIX REQUIRED)
AEO/AI Readiness: <score>/100   (P0-gated on Part H)
Human Experience:  <score>/100   (Part I — readability + engageability)

Four Pillars (Part H): P1 author <pass/fail> · P2 FAQPage <pass/fail> · P3 Dataset <pass/fail> · P4 site-agentic <pass/fail>
Compliance (Part J): PASS | FIX REQUIRED

🔴 Must-fix
- <Item> — <what's wrong> → <one-line fix>

🟡 Should-fix
- <Item> — <fix>

🟢 Nice-to-have
- <Item> — <fix>

Readability & Engageability (Part I): <quote offending passage → rewrite>; reading-level/scannability/voice notes
Compliance (Part J): <offending phrase> @ <where> — breaks <rule> → <compliant rewrite>

What's already good: <short list>
```

Keep findings specific and evidence-based (quote the actual title length, heading order, missing alt, etc.). Recommend fixes; apply them only if the user wants you to.
