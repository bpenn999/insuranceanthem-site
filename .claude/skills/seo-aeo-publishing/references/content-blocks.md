# Content Blocks — markup + AEO notes

Reusable, accessible, brand-agnostic patterns for the on-page elements the checklist requires. Style
them with the site's design tokens (in this project: the CSS variables in `src/styles/global.css` — use
variables, never raw hex). Each block lists **why it matters for AEO** so you keep the structure that
makes content extractable and quotable. Keep visible text and any matching JSON-LD identical.

**Contents**
1. FAQ accordion (+ FAQPage schema)
2. Table of contents
3. Author box
4. Related articles
5. Sources / citations
6. Stat callouts
7. Charts & graphs
8. How-to steps (+ HowTo schema)
9. Issue → Fix
10. Comparison table
11. Definition box & pull quote
12. Direct-answer intro

---

## 1. FAQ accordion (required: every page; 3–6 per blog)

```html
<section class="faq" aria-labelledby="faq-h">
  <h2 id="faq-h">Frequently asked questions</h2>
  <div class="faq-item">
    <button class="faq-q" aria-expanded="false">{question}</button>
    <div class="faq-a"><p>{answer}</p></div>
  </div>
  <!-- repeat -->
</section>
```
Drive both the visible answers and the FAQPage JSON-LD (schema-library §7) from the **same data** so they
never diverge. Reuse the existing toggle logic in `src/scripts/main.js` (`.faq-q` handler). Prefer real
`<button>`s with `aria-expanded` for accessibility.
**AEO:** FAQs are the most directly quoted block in AI answers. Write each answer to stand alone in
40–60 words, answering the question in the first sentence.

## 2. Table of contents (required: blogs)

Auto-generate from `h2/h3` rather than hand-maintaining. In Astro you get headings from
`const { headings } = await render(post)`.

```html
<nav class="toc" aria-label="Table of contents">
  <p class="toc-title">On this page</p>
  <ol>
    <li><a href="#slug">{heading.text}</a></li>
    <!-- nest h3s under their h2 -->
  </ol>
</nav>
```
Ensure every heading has a stable `id` (Astro adds slug ids automatically). Sticky on desktop; collapsible
on mobile. Smooth-scroll is already enabled site-wide (`scroll-behavior: smooth`).
**AEO:** a clean outline helps answer engines understand structure and pick the right section to cite.

## 3. Author box (required: blogs)

```html
<aside class="author-box" aria-label="About the author">
  <img class="author-avatar" src="{avatar}" alt="{author} headshot" width="64" height="64" />
  <div>
    <p class="author-name">{author}</p>
    <p class="author-bio">{bio}</p>
  </div>
</aside>
```
Pull `author`/`bio`/`avatar` from frontmatter, falling back to the default author + bio in `BRAND.md`.
Mirror these into the `author` Person/Organization node (schema-library §8).
**AEO/E-E-A-T:** a named, described author signals expertise and authorship provenance.

## 4. Related articles (required: blogs)

```html
<section class="related" aria-labelledby="rel-h">
  <h2 id="rel-h">Keep reading</h2>
  <ul class="related-grid">
    <li><a href="/blog/{slug}/">{title}</a><span>{description}</span></li>
    <!-- 2–3 items -->
  </ul>
</section>
```
Source from `relatedSlugs` frontmatter; otherwise the newest non-draft posts sharing a tag (exclude the
current post). Optionally emit ItemList schema (schema-library §11).
**AEO/SEO:** descriptive internal links spread authority and keep readers on-site.

## 5. Sources / citations (required: blogs)

```html
<section class="sources" aria-labelledby="src-h">
  <h2 id="src-h">Sources</h2>
  <ol>
    <li><a href="{url}" rel="nofollow noopener" target="_blank">{label}</a></li>
  </ol>
</section>
```
List every external claim's origin as a real link. Take items from a `sources` frontmatter array
(`{label, url}[]`).
**AEO:** linked, verifiable sources are a top trust signal — unsourced stats get discounted or skipped.

## 6. Stat callouts

```html
<div class="stat-grid" data-stagger>
  <div class="stat"><span class="stat-num">64%</span><span class="stat-label">{what it measures}</span>
    <a class="stat-src" href="{url}">Source</a></div>
  <!-- repeat -->
</div>
```
**AEO:** big, labeled, sourced numbers are highly quotable. Always attach the source to each stat.

## 7. Charts & graphs

Prefer lightweight, dependency-free visuals that degrade gracefully and stay crawlable:
- **Inline SVG** bar/line charts (no JS) — best for static, accessible, fast.
- **CSS bars** for simple comparisons.
- Only reach for a JS chart library when interactivity is essential (keep it lazy-loaded).

```html
<figure class="chart">
  <!-- inline <svg> ... </svg> -->
  <figcaption>{what the chart shows}. Source: <a href="{url}">{label}</a></figcaption>
</figure>
<table class="visually-hidden"><!-- same data as rows for accessibility + extraction --></table>
```
**AEO:** a chart image is opaque to text-based answer engines — ALWAYS pair it with the underlying numbers
in text or a (optionally visually-hidden) `<table>`, plus a captioned source.

## 8. How-to steps (+ HowTo schema)

```html
<section class="howto" aria-labelledby="howto-h">
  <h2 id="howto-h">How to {do the thing}</h2>
  <ol class="steps">
    <li><h3>{step name}</h3><p>{what to do}</p></li>
  </ol>
</section>
```
Emit HowTo JSON-LD (schema-library §10) with the same step names/text.
**AEO:** ordered, named steps map directly to how-to rich results and step-by-step AI answers.

## 9. Issue → Fix

```html
<div class="issuefix">
  <div class="issue"><span class="tag">Issue</span><p>{the problem}</p></div>
  <div class="fix"><span class="tag">Fix</span><p>{the solution}</p></div>
</div>
```
**AEO:** the problem/solution pairing matches a very common query intent and is easy to lift verbatim.

## 10. Comparison table

```html
<div class="table-wrap">
  <table>
    <caption>{what's being compared}</caption>
    <thead><tr><th scope="col">Option</th><th scope="col">{criterion}</th>…</tr></thead>
    <tbody><tr><th scope="row">{row}</th><td>…</td></tr></tbody>
  </table>
</div>
```
Use real `<table>` semantics (`<caption>`, `<thead>`, `scope`) — never a grid of `<div>`s.
**AEO:** comparison tables are among the most frequently extracted structures; keep them honest and scoped.

## 11. Definition box & pull quote

```html
<div class="def-box"><dfn>{term}</dfn><p>{one-sentence definition}</p></div>

<blockquote class="pull-quote"><p>{quotable line}</p></blockquote>
```
**AEO:** a crisp inline definition is ideal for "what is X" answers; pull quotes surface your strongest claim.

## 12. Direct-answer intro (required: blogs; encouraged: pages)

Open the body with a 2–4 sentence answer to the page's core question, before any TOC or long preamble:

```html
<p class="answer-lede"><strong>Short answer:</strong> {2–4 sentences that fully answer the title question}.</p>
```
**AEO:** answer engines preferentially lift the first concise, complete answer they find. This is the
single highest-leverage block on the page.

---

### General rules
- Match every visible block that has a schema (FAQ, HowTo, comparison-as-data) to JSON-LD with identical text.
- Keep all interactive blocks accessible (real buttons, `aria-*`, keyboard support) and motion behind
  `prefers-reduced-motion`.
- Style with brand tokens from `BRAND.md` / the design system — never introduce off-brand colors or fonts.
