---
name: brand-identity
description: >-
  Establish and enforce a single source of brand truth (a BRAND.md file at the project root) so every
  page, blog post, component, marketing copy, image alt text, and metadata/JSON-LD value stays on-brand
  and consistent. ALWAYS load this before producing or editing ANY site-visible content, and load it
  FIRST — before the seo-aeo-publishing or webmcp skills, which both depend on the brand facts.
  Trigger whenever the user says "add a page", "write a blog/article", "new section", "update copy",
  "change the hero", "set up branding", "create a brand guide", or anything that yields visible text,
  imagery, or schema. If BRAND.md does not exist yet, this skill creates it from a codebase audit; if it
  exists, this skill makes you read and follow it.
---

# Brand Identity

Brand details (names, voice, colors, fonts, CTAs, legal/compliance language) must never be hardcoded
into skills, components, or one-off copy. They live in **one file: `BRAND.md` at the project root.**
This skill's job is to (1) make sure that file exists, and (2) make every piece of site work conform to it.

## Workflow

### 1. Locate the brand file
Look for `BRAND.md` (or `brand.md`) at the project root. If it exists, **read it fully before writing any
copy, metadata, or schema.** It is the source of truth — when you need a name, audience, tone, CTA, color
token, author, or disclaimer, take it from there.

### 2. If `BRAND.md` is missing, create it
Bootstrap it from the codebase rather than guessing:
- **Audit the repo** for brand signals: README, `package.json`, the homepage and key components (hero,
  nav, footer, pricing), the CSS design tokens/variables, fonts, logos/images, and any legal pages
  (privacy, terms) for the legal entity and disclaimers.
- **Extract** the brand name + legal entity, the offering, the audience, the tone/voice, the visual
  system (color tokens, fonts, shape/motion, iconography), the primary CTA(s), the default author, and
  any mandatory compliance/legal language.
- **Confirm gaps with the user** (anything you can't infer confidently — social profiles, exact
  disclaimer wording, custom domain).
- **Write `BRAND.md` at the project root** using the structure below, then proceed using it.

### 3. Apply it everywhere
For all subsequent work, conform copy, headings, OG/Twitter tags, JSON-LD identity nodes, image alt
text, and CTAs to `BRAND.md`. If a task would contradict the brand file (wrong name, off-tone, missing
disclaimer), fix the content — or update `BRAND.md` first if the brand itself has genuinely changed.

### 4. Keep it current
When the brand evolves (rename, new palette, new offer), update `BRAND.md` in the same change so it never
drifts from what's shipping.

## What `BRAND.md` should contain

Keep it skimmable. Recommended sections:

- **Names** — display brand vs. legal entity vs. product/credit lines, and exactly where each is used;
  the page `<title>` suffix; copyright line.
- **Production domain** — record the REAL production custom domain (e.g. `https://brand.com`), never a
  preview/staging host (`*.pages.dev`, `*.netlify.app`, `*.vercel.app`, `*.workers.dev`, `localhost`).
  This value is the canonical base every absolute URL (canonical, OG, JSON-LD, sitemap, robots, llms.txt)
  is derived from — getting it wrong de-indexes the site. State that all URLs derive from it; never
  hardcode a host elsewhere.
- **What the brand is (and is NOT)** — the offering in 2–3 sentences, plus hard boundaries (what it must
  never claim to be/do).
- **Audience** — who you're writing to, and who you're not.
- **Voice & tone** — 4–6 principles with short sample lines for cadence.
- **Primary CTA(s)** — exact label(s) and destination URL(s); the one-primary-action rule.
- **Visual system** — color tokens (point to the CSS variables; "use variables, never raw hex"), fonts
  and their roles, shape/radius, motion + reduced-motion rule, iconography, imagery guidance, alt-text rule.
- **Default author** — name + bio used for blog `author` Person/Organization schema.
- **Mandatory compliance/legal language** — exact wording that must appear (footer disclaimers,
  performance-claim notes), and where.
- **Organization facts** — the values JSON-LD/metadata need (`name`, `legalName`, `description`,
  `address`, `logo`, `sameAs`).

## Why this matters

Consistency is what makes a site read as one professional brand instead of a patchwork. Centralizing the
facts also means the SEO and WebMCP skills emit correct Organization/author schema and on-voice tool
descriptions automatically — they read the same file you do. A skill hardcoding brand strings would rot
the moment the brand changes; a `BRAND.md` updated in place stays true.

## Related skills
- **seo-aeo-publishing** — the SEO/AEO checklist every page and blog must pass; pulls
  Organization/author/disclaimer facts from `BRAND.md`.
- **webmcp** — exposes each page's actions to AI agents; tool descriptions use the `BRAND.md` voice.
