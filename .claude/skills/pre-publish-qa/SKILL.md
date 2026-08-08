---
name: pre-publish-qa
description: >-
  The single pre-publish / pre-deploy gate for this website. ALWAYS run this BEFORE saying a page or
  the site is "done", "ready", "live", or before any build/deploy or git push of site changes — even
  for a one-page tweak. It runs the COMPLETE checklist across four areas and will not pass until every
  item is verified: (1) brand consistency (brand-identity / BRAND.md), (2) SEO + AEO (seo-aeo-publishing:
  meta, canonical, OG, JSON-LD schema per content type, FAQs, blog TOC/author/related/sources),
  (3) WebMCP tools per page (webmcp), and (4) header/footer/layout consistency — every page must use the
  SAME shared Nav and Footer, cookie consent, and skip link. Use it whenever you add or edit a page,
  blog post, layout, or component, or when asked to "check the site", "QA before deploy", "make sure SEO
  and MCP are complete", or "make the header and footer consistent".
---

# Pre-Publish QA Gate

This is the final gate before shipping. It composes the three building-block skills and adds a
**layout-consistency** check, then verifies everything with real commands. Don't claim the site is ready
until every section passes — evidence before assertions.

Load the building-block skills as you go; this skill is the orchestrator:
- **brand-identity** → names, voice, author, disclaimer from `BRAND.md`.
- **seo-aeo-publishing** → the full SEO/AEO checklist + JSON-LD schema library + content blocks.
- **webmcp** → per-page agent tools.

## 1. Brand consistency
- [ ] `BRAND.md` exists and is current; the runtime mirror (`src/lib/brand.ts`) matches it.
- [ ] Display name, legal entity, CTA label/URL, and the compliance disclaimer match `BRAND.md` everywhere.
- [ ] No stale/old brand strings remain (grep for the previous name).

## 2. SEO + AEO (per page AND per blog post)
Follow **seo-aeo-publishing** in full. Quick gate:
- [ ] Unique title (50–60 chars) ending in the brand suffix; meta description (140–160 chars).
- [ ] **Canonical base = the real production custom domain (from `BRAND.md`), not a preview host**
      (`*.pages.dev`, `*.netlify.app`, `*.vercel.app`, `*.workers.dev`, `*.github.io`, `localhost`).
      `og:url` equals canonical; OG/Twitter image is a real 1200×630 on the production domain.
- [ ] One `<h1>`; clean heading hierarchy; semantic landmarks.
- [ ] Correct JSON-LD for the content type, all valid and matching visible content:
  - Page: Organization + WebSite (site-wide) + WebPage + BreadcrumbList (+ Service, + FAQPage).
  - Blog post: + BlogPosting (author Person, editor/reviewer when present) + FAQPage.
  - Blog index: + Blog + BreadcrumbList.
- [ ] Pages have FAQs; blog posts have TOC, author box, related articles, cited sources, and FAQs.
- [ ] `robots.txt`, sitemap (`/sitemap-index.xml`), and `llms.txt` exist; utility pages are `noindex`.

## 3. WebMCP (every page)
Follow **webmcp**. Quick gate:
- [ ] Site-wide tools present on every page (`getPageContext`, `openJoinFlow`).
- [ ] Page-specific tools registered for the page's key actions, with intent-rich descriptions and
      valid JSON-Schema inputs; read-only tools flagged.
- [ ] `/.well-known/webmcp` manifest lists the stable tools.

## 4. Header / footer / layout consistency  ← the consistency guarantee
Every page must feel like one site. The shared shell is owned by `BaseLayout` + the `Nav` and `Footer`
components — no page or layout may ship its own one-off header or footer.
- [ ] **Same header:** every page renders the shared `Nav` component (same logo, links, mobile menu).
      No bespoke `<nav>` markup in any page or layout.
- [ ] **Same footer:** every page renders the shared `Footer` component (same columns, legal links,
      Accessibility link, and Cookie Settings button).
- [ ] **Shared shell on every page:** skip-to-content link + `#main` landmark, aurora background,
      cookie consent, and WebMCP all come from `BaseLayout` (legal/doc pages go through `LegalLayout`,
      which itself wraps `BaseLayout` + shared `Nav`/`Footer`).
- [ ] **No duplicate/diverging styles:** a document/section stylesheet (e.g. `legal.css`) must NOT
      redefine global tokens, `body`, `nav`, or `footer` — those live once in `global.css`.
- [ ] **Mobile header works:** the mobile menu opens, is fully opaque/readable (no page text bleeding
      through), and closes on link tap.
- [ ] **Cookie + a11y controls:** the footer Cookie Settings re-opens the consent modal on every page;
      the modal opens/closes (Accept / Reject / Save / X / Esc) and is hidden by default.

## Verification commands (run them — don't eyeball)

```bash
# 1) Clean build (zero errors/warnings)
npm run build

# 1b) No preview/staging domain leaked into the build — MUST print 0
grep -rEl 'pages\.dev|netlify\.app|vercel\.app|workers\.dev|github\.io|localhost' dist | wc -l

# 2) Every built page has site-wide identity, page schema, and WebMCP
python - <<'PY'
import glob, json, re
BS=chr(92)
for f in sorted(glob.glob('dist/**/*.html', recursive=True)):
    html=open(f,encoding='utf-8').read()
    blocks=re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
    bad=0
    for b in blocks:
        try: json.loads(b)
        except: bad+=1
    page=f.replace(BS,'/').replace('dist/','').replace('/index.html','') or 'home'
    print(f"{page:48} ld+json={len(blocks):2} bad={bad} "
          f"nav={'Y' if 'nav-shell' in html else 'N'} "
          f"footer={'Y' if 'footer-cols' in html else 'N'} "
          f"webmcp={'Y' if 'data-webmcp-tools' in html else 'N'} "
          f"cookie={'Y' if 'data-cookie-settings' in html else 'N'}")
PY
```
- [ ] Build passes clean.
- [ ] Every content page shows `nav=Y footer=Y webmcp=Y cookie=Y` and `bad=0` JSON-LD.
- [ ] (Recommended) Validate a couple of pages' JSON-LD in Google's Rich Results Test before deploy.

## Project map (where the shared shell lives)
- `src/layouts/BaseLayout.astro` — head/SEO, site-wide JSON-LD, skip link, `#main`, cookie consent, WebMCP.
- `src/layouts/LegalLayout.astro` — wraps `BaseLayout` + shared `Nav`/`Footer` for doc pages.
- `src/components/Nav.astro`, `src/components/Footer.astro` — the ONLY header/footer; reuse everywhere.
- `src/components/CookieConsent.astro` — banner + re-openable preferences (footer button).
- `src/lib/brand.ts`, `src/lib/seo.ts` — brand constants + JSON-LD builders.

If any check fails, fix it and re-run the verification commands before declaring done.
