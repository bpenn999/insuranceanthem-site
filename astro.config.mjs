// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMedicareFigures from './plugins/remark-medicare-figures.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://daisymountainmedicare.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
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
