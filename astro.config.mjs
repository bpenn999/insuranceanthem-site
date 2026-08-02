// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMedicareFigures from './plugins/remark-medicare-figures.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://insuranceanthem.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you'),
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
