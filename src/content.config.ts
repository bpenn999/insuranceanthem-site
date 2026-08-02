import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * The Learn hub.
 *
 * Drop a new `.md` file into src/content/learn/ and it appears on /learn/, gets
 * its own route, its Article + FAQPage JSON-LD, its breadcrumbs and its sitemap
 * entry — no code changes anywhere. Everything below is derived from frontmatter.
 *
 * Dollar figures belong in the body as {{partB.premium}}-style tokens, not typed
 * out — see plugins/remark-medicare-figures.mjs.
 */
const learn = defineCollection({
  loader: glob({ base: './src/content/learn', pattern: '**/*.md' }),
  schema: z.object({
    /** H1 and the card title. Write for humans. */
    title: z.string().min(10),

    /** SEO <title>. Kept ≤60 chars so Google does not truncate it. */
    seoTitle: z.string().max(60),

    /** Meta description. ≤155 chars for the same reason. */
    description: z.string().max(155),

    /** Card excerpt on the hub, and the lede under the H1. */
    summary: z.string().min(40),

    category: z.enum([
      'Medicare Advantage',
      'Medicare Supplement',
      'Part D',
      'Long-Term Care',
      'Enrollment',
      'Costs',
    ]),

    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    readMinutes: z.number().int().positive(),

    /** Emitted as FAQPage structured data. Two or more, or omit entirely. */
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),

    /**
     * Related product pages, as slugs (`medicare-advantage`, `part-d`, …), and
     * tools (`irmaa-estimator`, …). Rendered as an in-article related block and
     * validated against the real data files at build time by the audit script.
     */
    relatedProducts: z.array(z.string()).default([]),
    relatedTools: z.array(z.string()).default([]),

    /** Pin to the top of the hub */
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { learn };
