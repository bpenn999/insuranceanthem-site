import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import site, { abs } from '../config/site';
import { products } from '../data/products';
import { tools } from '../data/tools';
import { locations } from '../data/locations';

/**
 * /llms.txt — the plain-text map an AI crawler reads instead of guessing.
 *
 * GENERATED, not hand-maintained. Every entry derives from the same data the
 * pages themselves render from, so publishing a guide or adding a tool updates
 * this file with no edit here — and a rebrand carries through automatically,
 * because every URL comes from `site.origin` via abs().
 *
 * Deliberately excluded from the sitemap (see astro.config.mjs): it is a
 * machine-readable index, not a page, and the audit asserts every sitemap URL
 * has a real HTML route behind it.
 */
export const prerender = true;

export const GET: APIRoute = async () => {
  const learn = (await getCollection('learn', ({ data }) => !data.draft)).sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
  });

  const line = (label: string, path: string, note: string) => `- [${label}](${abs(path)}): ${note}`;

  const body = `# ${site.name}

> ${site.tagline}

${site.description}

Licensed independent agency. ${site.agent.name}, ${site.agent.title} — NPN ${site.agent.npn},
licensed in ${site.agent.statesLicensed} states, ${site.agent.experience.toLowerCase()} of experience.
Based in ${site.address.display}. Phone ${site.phone.display}. Email ${site.email}.
Hours: ${site.hours.display}.

We do not offer every plan available in your area. Any information we provide is
limited to those plans we do offer in your area. Please contact Medicare.gov or
1-800-MEDICARE to get information on all of your options. ${site.name} is not
connected with or endorsed by the United States government or the federal
Medicare program.

## Coverage
${products.map((p) => line(p.fullName, `/${p.slug}/`, p.blurb)).join('\n')}
${line('Compare all four', '/medicare-plans/', 'How the four fit together and which one a given situation calls for.')}

## Free tools
Every tool runs in the browser. No email gate, no sign-up, nothing stored.
${tools.map((t) => line(t.name, `/tools/${t.slug}/`, `${t.blurb} (about ${t.minutes} min)`)).join('\n')}

## Guides
${learn.map((a) => line(a.data.title, `/learn/${a.id}/`, a.data.summary)).join('\n')}

## Service area
${locations.map((l) => line(l.label, `/service-area/${l.slug}/`, l.summary)).join('\n')}
Also serving: ${site.serviceArea.join(', ')}.

## Company
${line('About ' + site.agent.firstName, '/about/', `Who ${site.agent.firstName} is, how he is paid, and what happens after you enroll.`)}
${line('Contact', '/contact/', `Book a ${site.consult.phrase} or send a question.`)}
${line('Privacy Policy', '/privacy/', 'What we collect and what we never do with it.')}
${line('Terms of Use', '/terms/', 'Terms, plus the required Medicare marketing disclosures.')}
${line('Accessibility', '/accessibility/', 'WCAG 2.2 AA commitments and how to report a barrier.')}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
