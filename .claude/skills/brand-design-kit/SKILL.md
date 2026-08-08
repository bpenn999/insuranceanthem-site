---
name: brand-design-kit
description: >-
  Self-contained skill to generate a complete brand + design system for an insurance agency website — brand name treatment, color palette (with accessible contrast), typography (heading + body), logo direction, spacing scale, and the core UI component set (buttons, cards, stat row, chart, FAQ accordion, CTA band) — written into a single source of truth (BRAND.md + src/config/site.config.ts design tokens) that the website builder and the blog writers all read. Tone/voice guide included. No image-generation dependency (logo/photos are bring-your-own; generation is optional). Trigger on: "brand kit", "design system", "brand tokens", "set up the brand", "colors and fonts for <brand>", "site design system".
---

# Brand Design Kit (insurance · design tokens) — self-contained

Produces ONE brand + design system as the single source of truth every other skill reads (STEP 0 of the website builder and the blog writers). No hard dependency on any image/logo generator.

---

## Workflow (do in order)

### STEP 1 — Brand intake
- Capture: brand name, niche, the licensed advisor (name + NPN), production domain, phone, address, service area, positioning, and any existing assets (logo, colors, photos).
- If assets exist, **honor them** — extract palette/type from the real logo, don't reinvent.

### STEP 2 — Color palette (accessible)
- Define tokens: `--brand`, `--brand-ink`, `--accent`, `--bg`, `--surface`, `--text`, `--muted`, `--success`, `--warning`.
- **Contrast must pass WCAG AA** (4.5:1 body, 3:1 large). Provide a dark-mode-friendly variant.
- Insurance trust palette guidance: calm, credible (blues/greens/ink) — avoid circus/neon. Match the niche (e.g. Medicare = trustworthy/clinical; life = warm/protective).

### STEP 3 — Typography
- One **heading** family + one **body** family (web-safe or self-hosted; declare `font-display: swap`). Define a type scale (h1→small) and line-heights for readability (Medicare audience is 60+ → larger base size, generous line-height).

### STEP 4 — Logo direction (bring-your-own first)
- **Logo source order:** (1) client-provided logo; (2) a clean **wordmark built from the chosen typography** (no generator needed); (3) image/logo generation **only if a generator is connected** (optional). NEVER block on a missing logo — ship the wordmark.

### STEP 5 — Component set (tokens, not hardcoded)
- Define the reusable components the builder/writers use: button (primary/secondary), card, **stat row** (`.stats`), **accessible bar chart** (`.chart`, `role="img"`/`aria-label`), **FAQ accordion** (maps to FAQPage schema), CTA band, source-line caption. All driven by tokens — never hardcode hex.

### STEP 6 — Imagery rules (NO Higgsfield required)
- Hero/imagery source order: (1) **real photo of the advisor** (best for E-E-A-T); (2) **generation only if a generator is connected** (e.g. Higgsfield) for composites/unique images; (3) **brand graphic/illustration** (colors + type, no faces). NEVER anonymous stock as a hero. Document this rule in BRAND.md so every downstream skill follows it.

### STEP 7 — Voice & compliance tone
- Define tone (plain, credible, reassuring; answer-first). Bake in the niche compliance posture so copy never drifts: no banned superlatives ("best", "#1"), no "we offer all/every plan", no "free" misuse, no guaranteed savings/returns; informational-only; state-regulated/varies-by-plan.

### STEP 8 — Write the source of truth
- Output **`BRAND.md`** (human-readable brand book) + **`src/config/site.config.ts`** (machine-readable tokens: colors, fonts, brand facts, advisor, CTA, disclaimers, imagery rule). These are what `insurance-website-builder`, `location-page-factory`, and the blog writers read in their STEP 0.

---

## Checklist
- [ ] 🔴 Color tokens defined + WCAG AA contrast verified + dark-mode variant
- [ ] 🔴 Heading + body type families + readable scale (60+ friendly)
- [ ] 🔴 Logo present (client logo OR typographic wordmark — never blocked)
- [ ] 🔴 Component set defined via tokens (button/card/stat row/chart/FAQ/CTA/source caption)
- [ ] 🔴 Imagery rule documented: real advisor photo → optional generation → brand graphic; NEVER anonymous stock; no Higgsfield dependency
- [ ] 🔴 Voice + compliance tone documented (no banned superlatives / "all plans" / "free" / guaranteed savings)
- [ ] 🔴 `BRAND.md` + `src/config/site.config.ts` written as the single source of truth

## Notes
- This kit carries NO image-generation dependency. Generation (Higgsfield, etc.) is strictly optional and only used if already connected.
- Downstream: `insurance-website-builder` (consumes tokens), the niche blog writers (STEP 0), `location-page-factory`.

---

## Pillar-1 byline spec (brand serves the AI-citation moat)
The brand kit doesn't emit schema, but it MUST leave room for it. The article/page template needs a **visible human byline** (the advisor) even though the **schema `author` is the Organization "<Site> Data Desk"** (Pillar 1, YMYL). Ship a **byline component spec**: advisor photo + name + "reviewed by" + the Org "Data Desk" line, so every writer renders authorship consistently. Footer must leave room for the TPMO + non-affiliation disclaimers; no imagery implying government endorsement (no Medicare-card / federal-seal motifs).

## Implementation notes — Big Sioux gold-standard design DNA (the "$25k look")
Optional richer system when reskinning the gold-standard template:
- **Palette tokens:** `ink` (deep navy) / `primary` / `primary-dark` / `accent` (e.g. gold or tan) / `soft` (tint bg) / `line` (borders) / `muted` (secondary text) — mirrored in `design-tokens.css` + `site.config.ts`.
- **Font pairing:** elegant display serif (e.g. Fraunces / Cormorant) + clean body sans (e.g. Inter / Hanken Grotesk) + mono eyebrow (e.g. IBM Plex Mono); explicit fallbacks, CLS-safe.
- **Logo:** prefer a **minimal symbolic mark** tied to locale/brand meaning (e.g. flowing water for a river city) with light/dark + favicon + clear-space — but never block on it (typographic wordmark is the fallback).
- **Advisor photo direction:** chest-up portrait, plain shirt, no logo, approachable; the recurring human across the whole site; define consistent in-context variants. Document the **unique-image-per-page** rule for the builder/writers.
- **Component patterns:** hero (gradient + texture + advisor + floating stat card), trust bar, dark data band (stat numbers), services grid (icon cards), 3-step how-it-works, testimonial, CTA band, premium multi-column footer; 14–22px radii, soft shadows.
- **Animation language:** scroll-reveal fade-ups, hero entrance, count-up on stats, hover lifts — always `prefers-reduced-motion`-safe + an a11y "pause motion" toggle.
