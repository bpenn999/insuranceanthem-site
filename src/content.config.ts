import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** Shown in listings and used as the meta description if `description` is absent */
    summary: z.string(),
    description: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Which product line this belongs to, for cross-linking */
    topic: z.enum([
      'Medicare Advantage',
      'Medicare Supplement',
      'Part D',
      'Long-Term Care',
      'Enrollment',
      'Costs',
    ]),
    /** Rough read time in minutes */
    readMinutes: z.number().int().positive(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
