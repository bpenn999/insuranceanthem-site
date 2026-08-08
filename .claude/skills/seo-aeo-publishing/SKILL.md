---
name: seo-aeo-publishing
description: >-
  Mandatory SEO + AEO (Answer Engine Optimization) checklist for any website. ALWAYS use this BEFORE
  creating, editing, or publishing ANY page or blog post, and before any build/deploy that ships new or
  changed content — even when the user only says "add a page", "write a blog", "new article", "make a
  landing page", "update this section", or "make it live". It guarantees every page/post has a correct
  meta title and description, canonical, Open Graph + Twitter tags, valid JSON-LD with the RIGHT schema
  for the content type (Organization, WebSite, WebPage, Service, BreadcrumbList, Article/BlogPosting,
  FAQPage, HowTo, ItemList), required on-page FAQs, and — for blogs — a table of contents, author box,
  related articles, cited sources, and rich content blocks (stats, charts, how-to, issue/fix,
  comparison). Pages and blogs get DIFFERENT schema; this skill picks the right one. Load the
  brand-identity skill first so all names, author, and disclaimer facts come from the project's BRAND.md.
---

# SEO + AEO Publishing Checklist

Every page and post must be discoverable by **search engines** (Google/Bing) **and** quotable by
**answer engines / LLMs** (Google AI Overviews, ChatGPT, Perplexity, Claude). That second audience — AEO —
is why the rules below push hard on direct answers, structured data, FAQs, and cited sources: answer
engines lift content that is unambiguous, well-structured, and verifiable.

**Load `brand-identity` first.** All brand facts (brand name, title suffix, Organization details,
default author, primary CTA, compliance disclaimer) come from the project's `BRAND.md`. This skill never
hardcodes them — it references "the brand name (from BRAND.md)", etc. If `BRAND.md` is missing, the
brand-identity skill creates it first.

## How to use this skill

1. Decide the content type — **Page** or **Blog post** — and follow that section. They need different
   schema and different on-page elements.
2. Build the content, then run the **Pre-publish gate** at the bottom. Don't call anything "done",
   "live", or "ready to deploy" until every box is checked and the production build passes clean.
3. For verbatim JSON-LD templates, read `references/schema-library.md`. For the markup of FAQs, TOC,
   author box, related articles, sources, and the rich content blocks, read `references/content-blocks.md`.

## Reuse the site's existing SEO plumbing

Most sites already have a shared `<head>`/layout component and a content pipeline. Reuse them rather than
duplicating tags per page. Find: where `<title>`/meta/canonical/OG live, how per-page tags are injected,
where structured content (e.g. a blog collection) is defined, and where the canonical site URL is set.

> **This project (Astro) — concrete map:**
> - `src/layouts/BaseLayout.astro` owns the `<head>`: `<title>`, `description`, `canonical`, full OG +
>   Twitter, and a **`head` named slot** for per-page tags (JSON-LD, article meta). Props: `title`,
>   `description`, `ogTitle`, `ogDescription`, `image`, `ogType`.
> - `src/pages/blog/[...slug].astro` already emits **BlogPosting** + (when `faq` frontmatter exists)
>   **FAQPage** JSON-LD. Extend these; don't reinvent them.
> - `src/content.config.ts` defines blog frontmatter (incl. optional `faq`). Add new fields here
>   (`updatedDate`, `sources`, `relatedSlugs`) instead of hardcoding per post.
> - Absolute URLs come from `Astro.site` (`astro.config.mjs`). Always build URLs from it.

If a required element (sitemap, robots, llms.txt, author box, TOC component) doesn't exist yet, create it.

---

## Canonical domain — set the real production URL FIRST (critical)

This is the single most damaging, easiest-to-miss SEO bug. Get it right before anything else.

- **Set the site's canonical base URL to the real production custom domain** (e.g.
  `https://yourbrand.com`) — the value `BRAND.md` lists as the production domain. In Astro that's
  `site` in `astro.config.mjs`; every framework has an equivalent.
- **NEVER ship a preview/staging host as the canonical base.** Hosts like `*.pages.dev`,
  `*.netlify.app`, `*.vercel.app`, `*.workers.dev`, `*.github.io`, or `localhost` must never appear in
  `canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD `url`/`@id`, the sitemap, `robots.txt`, or
  `llms.txt`. If Google sees a preview domain as canonical, it may treat the staging copy as
  authoritative and **drop your production pages from the index**.
- **Derive ALL absolute URLs from that one base** — canonical, OG/Twitter, every JSON-LD URL/@id,
  the sitemap, robots `Sitemap:`, and llms.txt links. Never hardcode a host anywhere else.
- **Deploys are stale until you redeploy.** After changing the domain or any SEO markup, **rebuild and
  redeploy**, then re-check the **live production URL** — an SEO audit of an old deploy will report
  problems you already fixed in code. "Fixed in the repo" ≠ "fixed on the live site."

Verify in the build output (run before deploy):
```bash
# Must print 0 — no preview/staging host may leak into the built site
grep -rEl 'pages\.dev|netlify\.app|vercel\.app|workers\.dev|github\.io|localhost' dist | wc -l
# Canonical on a representative page must be the production domain
grep -o '<link rel="canonical"[^>]*>' dist/index.html
```

---

## PAGE checklist

A "page" is a marketing/informational route: home, a service/offer page, about, pricing, etc.

### Metadata (all required)
- **Title:** unique, 50–60 chars, primary keyword near the front, ends with the brand title suffix from
  `BRAND.md`.
- **Meta description:** 140–160 chars, benefit-led, includes the primary keyword and a soft CTA. Written
  for a human deciding whether to click — not a keyword dump.
- **Canonical:** resolves to the real **production** URL on the custom domain (see "Canonical domain"
  above) — never a preview host, never the wrong path.
- **Open Graph + Twitter:** title, description, and a real `image` (1200×630, absolute URL on the
  production domain). `og:url` must equal the canonical. Give each page its own image; don't ship every
  page with the bare logo.
- **`ogType`:** `website` for pages.
- **Headings:** exactly one `<h1>` matching search intent; logical `h2/h3` nesting, no skipped levels;
  semantic landmarks (`header`, `main`, `section`, `nav`, `footer`).

### Structured data (JSON-LD — see `references/schema-library.md`)
- **Organization** + **WebSite** — site-wide identity, emitted once in the shared layout.
- **WebPage** — this page (`name`, `description`, `url`, `isPartOf`, `breadcrumb`).
- **BreadcrumbList** — Home → … → this page.
- **Service** — when the page describes the offering (fill from `BRAND.md`).
- **FAQPage** — from the page's FAQ block (next).
Multiple JSON-LD blocks per page are fine; keep each valid and matched to visible content.

### Required on-page elements
- **FAQs (required on every page).** ≥3–5 real prospect questions with direct answers, as an accessible
  accordion AND FAQPage JSON-LD whose text matches the visible answers (mismatched FAQ schema risks a
  manual action). Markup in `references/content-blocks.md`.
- **One clear primary CTA** (the primary CTA from `BRAND.md` unless the page has a more specific goal).
- **Compliance disclaimer** in the footer (exact text in `BRAND.md`).
- **Descriptive alt text** on every meaningful image; `alt=""` for decorative ones.
- **2–3 internal links** to relevant pages/posts with descriptive anchor text (never "click here").

---

## BLOG checklist

A blog post teaches/persuades and targets a query. It must be genuinely useful and citation-ready.

### Frontmatter (drives schema + SEO)
Required: `title`, `description`, `pubDate`. Recommended: `author` (defaults to the brand author in
`BRAND.md`), `cover` + `coverAlt`, `tags`, `faq`. Add when relevant: `updatedDate` (→ `dateModified`),
`sources` (`{label, url}[]`), `relatedSlugs`. Type any new field in the content config.
- **Title:** compelling + keyword-bearing; include the year for time-sensitive topics. 50–60 chars where possible.
- **Description:** 140–160 chars; doubles as meta description and blog-card summary.

### Structured data (see `references/schema-library.md`)
- **BlogPosting/Article** — headline, description, `datePublished`, `dateModified`, `author` as a
  **Person** when a real author is named (else the brand Organization), `publisher` = Organization,
  `image`, `mainEntityOfPage`, `keywords`, `articleSection`, `wordCount`.
- **BreadcrumbList** — Home → Blog → this post.
- **FAQPage** — when the post has an FAQ block (it should).
- **HowTo** — when the post contains a step-by-step procedure.

### Required on-page elements (what makes a blog "complete")
1. **Table of contents** — auto-built from `h2/h3`, sticky on desktop, smooth-scroll jump links.
2. **Author box** — name, short bio, optional avatar; powers the `author` Person schema and E-E-A-T.
   Default author/bio from `BRAND.md` unless a real person is credited.
3. **Related articles** — 2–3 links at the end (from `relatedSlugs`, else newest same-tag posts).
4. **Cited sources** — a "Sources" section listing every external claim's origin as real links. A major
   AEO trust signal.
5. **FAQs** — 3–6 questions matched to FAQPage schema.
6. **Rich content blocks** — use several of: **stat callouts**, **charts/graphs**, **how-to steps**,
   **issue→fix**, **comparison tables**, definition boxes, pull quotes. Markup + AEO notes in
   `references/content-blocks.md`.
7. **Clear answer up top** — open with a 2–4 sentence direct answer to the post's core question before
   expanding. The single highest-leverage AEO move.

---

## AEO principles (pages AND blogs)

Answer engines reward content they can extract and trust:
- **Answer first, elaborate second** — direct answer in the first ~50 words under a heading.
- **Question-shaped headings** — phrase `h2/h3` as the questions people ask; the next paragraph answers
  it; FAQPage/HowTo schema mirrors it.
- **Self-contained chunks** — each section makes sense lifted out of context; define terms inline.
- **Cite and link claims** — numbers, stats, and quotes get a linked source; unsourced stats get distrusted.
- **Schema matches visible content** — never inject FAQ/HowTo schema for content that isn't on the page.
- **Comparison tables and stat callouts** are disproportionately quoted — use them where natural.
- **Plain, scannable language** — short sentences, descriptive anchors, semantic HTML.

## Site-wide SEO/AEO assets (create if missing)
- **`robots.txt`** — allow crawling, link the sitemap; don't block AI crawlers (AEO needs them).
- **XML sitemap** — generate one (in Astro: add `@astrojs/sitemap`).
- **`llms.txt`** — a markdown summary of the site + key links for LLMs (emerging AEO standard).
- **Real default OG image(s)** (1200×630) per major section, plus favicons.

---

## Pre-publish gate (run before saying "done"/"live"/"deploy")

Verify, don't assume. Don't claim completion until ALL pass.

- [ ] Loaded `brand-identity`; `BRAND.md` exists; names, author, Organization, disclaimer are correct.
- [ ] Correct content type chosen; its checklist above fully satisfied.
- [ ] Title (50–60 chars) and meta description (140–160 chars) unique and keyword-aware.
- [ ] **Canonical base = the real production custom domain.** No preview/staging host (`*.pages.dev`,
      `*.netlify.app`, `*.vercel.app`, `*.workers.dev`, `*.github.io`, `localhost`) in canonical, OG,
      JSON-LD, sitemap, robots, or llms.txt. Verified with the grep in "Canonical domain" → prints 0.
- [ ] `og:url` equals the canonical; OG + Twitter image is a real 1200×630 on the production domain.
- [ ] One `<h1>`; clean heading hierarchy; semantic landmarks.
- [ ] JSON-LD present for the RIGHT types; every block valid and matching visible content.
- [ ] FAQs present (page: required; blog: 3–6) and FAQPage schema text == visible text.
- [ ] Blog only: TOC, author box, related articles, cited sources, and ≥2 rich content blocks present.
- [ ] All images have descriptive alt text; decorative images use `alt=""`.
- [ ] 2–3 descriptive internal links added.
- [ ] Compliance disclaimer present; performance-claim note (from `BRAND.md`) near any income/lead claim.
- [ ] WebMCP tools exposed for the page's key actions (see the **webmcp** skill).
- [ ] Production build completes with no errors/warnings.
- [ ] **Redeployed after changes, then re-checked the LIVE production URL** — canonical/OG/JSON-LD on
      the live site reflect the change. (A stale deploy makes an audit report already-fixed problems.)
- [ ] (Recommended) Validate rendered JSON-LD in Google's Rich Results Test before deploy.

Reference files:
- `references/schema-library.md` — verbatim JSON-LD templates for every schema type above.
- `references/content-blocks.md` — markup for FAQs, TOC, author box, related, sources, and the
  stats/chart/how-to/issue-fix/comparison blocks, each with its AEO note.
