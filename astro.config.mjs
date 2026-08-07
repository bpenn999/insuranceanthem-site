// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMedicareFigures from './plugins/remark-medicare-figures.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://602medicare.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // 'always', not 'auto'. The home page shipped 34 KB of CSS as TWO
    // render-blocking <link>s (Kinetic 23 KB + index 11 KB), which on a
    // throttled 4G phone is two extra round trips standing between the HTML
    // and first paint. Inlined, they cost bytes in a document that was already
    // being downloaded — and the document is gzipped on the way out.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      // /llms.txt is a machine-readable index, not a page — the audit asserts
      // every sitemap URL has an HTML route behind it, and it has none.
      filter: (page) => !page.includes('/thank-you') && !page.endsWith('/llms.txt'),
      changefreq: 'weekly',
      lastmod: new Date(),
    }),
  ],
  markdown: {
    // Substitutes {{partB.premium}}-style tokens from src/data/medicare-figures.ts
    // so articles never hard-code a dollar figure. See plugins/ for the token
    // list. An unknown token fails the build rather than shipping `{{typo}}`.
    processor: unified({ remarkPlugins: [remarkMedicareFigures] }),
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  compressHTML: true,
});
