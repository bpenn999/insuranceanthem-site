/**
 * JSON-LD for a service-area city page.
 *
 * Lives here rather than inline in `src/pages/service-area/[slug].astro` because
 * CLAUDE.md is explicit: schema is centralised, never hand-rolled in a page. The
 * page passes the result to `BaseLayout`'s `schemaNodes`, which is the sanctioned
 * seam for per-page nodes; `src/components/Schema.astro` still owns the site-wide
 * graph (InsuranceAgency/LocalBusiness, Person, WebSite, BreadcrumbList) and
 * nothing here duplicates a node it already emits — these reference those by
 * `@id` instead.
 *
 * WHAT WAS MISSING BEFORE 2026-08-18, and why each addition is here:
 *
 *   Place       — `areaServed` pointed at a bare string, so the city was a label
 *                 rather than an entity anything could be said about.
 *   WebPage     — the city pages carried NO date of any kind. For Medicare copy
 *                 that is a real gap, not a formality: networks, formularies and
 *                 premiums all reset every January, so "when was this last true"
 *                 is the first question both a reader and a crawler have.
 *   author      — the agency, not the advisor. On YMYL health-and-money content
 *                 the accountable entity should be the organization, with the
 *                 credentialed human attached as `reviewedBy`. Brian is still
 *                 named, still carries his NPN in the Person node, and still
 *                 appears in the visible copy.
 *
 * DELIBERATELY ABSENT — `geo` on the Place. Coordinates for six of these seven
 * communities would have to be guessed, and a plausible guess inside structured
 * data is a fabrication wearing the costume of a fact. CLAUDE.md: never invent a
 * statistic. Add real coordinates to `locations.ts` and wire them in here when
 * there is a source for them.
 *
 * ALSO ABSENT — `Dataset`. The four-pillar standard wants every local figure
 * wrapped in one, but that presumes figures worth wrapping. This site publishes
 * none on a city page on purpose: plan counts and premiums move every plan year
 * and a stale number is worse than no number, which is a decision the FAQ copy
 * states out loud. The county-level CDC PLACES data that *would* qualify is
 * identical for all seven cities — every one of them is in Maricopa — so putting
 * it on each page would hand back exactly the near-duplicate problem the
 * 2026-08-18 rewrite existed to remove. It belongs on the hub page, once.
 */

import type { Location } from '../data/locations';

interface Ids {
  /** Site origin, e.g. https://602medicare.com — no trailing slash. */
  origin: string;
  /** Absolute-URL helper from src/config/site. */
  abs: (path: string) => string;
}

export function locationSchemaNodes(
  location: Location,
  { title, description }: { title: string; description: string },
  { origin, abs }: Ids,
): Record<string, unknown>[] {
  const path = `/service-area/${location.slug}/`;
  /**
   * Fragment appended AFTER abs(), never passed through it. `abs()` adds a
   * trailing slash to anything without a file extension, so `abs(path + '#place')`
   * yields `…/#place/` — which resolved, because every reference to it was
   * mangled the same way, but is not the id anyone would write and would stop
   * matching the moment one reference was built differently.
   */
  const pageUrl = abs(path);
  const placeId = `${pageUrl}#place`;
  const orgId = `${origin}/#organization`;
  const personId = `${origin}/#brian-penner`;

  return [
    {
      '@type': 'Place',
      '@id': placeId,
      name: location.label,
      address: {
        '@type': 'PostalAddress',
        addressLocality: location.city,
        addressRegion: 'AZ',
        addressCountry: 'US',
        postalCode: location.zips[0],
      },
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: location.county,
        containedInPlace: { '@type': 'State', name: 'Arizona' },
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      about: { '@id': placeId },
      isPartOf: { '@id': `${origin}/#website` },
      inLanguage: 'en-US',
      datePublished: location.reviewed,
      dateModified: location.reviewed,
      author: { '@id': orgId },
      reviewedBy: { '@id': personId },
      publisher: { '@id': orgId },
    },
    {
      '@type': 'FAQPage',
      mainEntity: location.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'Service',
      name: `Medicare insurance guidance in ${location.label}`,
      description: location.summary,
      url: pageUrl,
      provider: { '@id': orgId },
      areaServed: { '@id': placeId },
    },
  ];
}
