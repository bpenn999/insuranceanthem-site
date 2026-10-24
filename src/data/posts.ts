import type { BlogFrontmatter } from '../layouts/BlogLayout.astro';

/**
 * Every published blog post, newest first.
 *
 * The glob is eager and build-time, so dropping a new .md into src/pages/blog/
 * shows up on the blog hub AND the home page's "Latest from the blog" row with
 * no edit here. Both read from this one list so they can never disagree.
 */
const modules = import.meta.glob<{ frontmatter: BlogFrontmatter; url: string }>(
  '../pages/blog/*.md',
  { eager: true },
);

export interface Post extends BlogFrontmatter {
  href: string;
  date: Date;
}

export const posts: Post[] = Object.values(modules)
  .filter((m) => !m.frontmatter.draft)
  .map((m) => ({
    ...m.frontmatter,
    // Astro gives the route without a trailing slash; the site is
    // trailingSlash: 'always', so every internal href needs one or the audit's
    // link check counts it as broken.
    href: m.url.endsWith('/') ? m.url : `${m.url}/`,
    date: new Date(m.frontmatter.publishedAt),
  }))
  .sort((a, b) => b.date.getTime() - a.date.getTime());

export const fmtPostDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
