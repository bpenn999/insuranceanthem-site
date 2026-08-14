/**
 * Service-area pages. The office is Anthem, AZ 85086; the reach is the Phoenix
 * metro, which is what the 602Medicare name is claiming. Everything here is real
 * Maricopa County geography — nothing carried over from another market.
 *
 * Add a city by adding an entry: the route, the hub card, the home-page list,
 * the footer link, the nearby cross-links, the Service schema and the
 * LocalBusiness `areaServed` all generate from this array.
 *
 * ORDER IS THE BRAND ORDER — home base first, then the two metro markets the
 * positioning line names, then the outlying communities.
 */

export interface Location {
  slug: string;
  /** "Anthem" */
  city: string;
  /** "Anthem, AZ" */
  label: string;
  zips: string[];
  county: string;
  /** Sentence used as the page intro and the hub card excerpt. Length is free. */
  summary: string;
  /**
   * The <meta name="description"> for this city's page. SEPARATE FROM `summary`
   * on purpose: summary reads as an opening line and runs as long as it needs
   * to, while this one is a 155-character budget Google enforces by truncating.
   * Composing the two — summary plus a name/NPN/phone tail — is what this used
   * to do, and every city page shipped a description 40 to 70 characters over
   * the limit. HARD CAP, asserted at the bottom of this file.
   */
  seoDescription: string;
  /** Genuinely local detail — landmarks, character, who lives there */
  local: string[];
  /** How this community relates to the Anthem home base */
  proximity: string;
  primary?: boolean;
}

export const locations: Location[] = [
  {
    slug: 'anthem-az',
    city: 'Anthem',
    label: 'Anthem, AZ',
    zips: ['85086'],
    county: 'Maricopa County',
    primary: true,
    summary:
      'Independent Medicare help for Anthem residents — Medicare Advantage, Supplement, Part D and long-term care planning, from an advisor who lives here.',
    seoDescription:
      'Independent Medicare help for Anthem, AZ 85086 — Advantage, Supplement, Part D and long-term care, from an advisor who lives in the community.',
    local: [
      'Anthem sits at the north end of Maricopa County along I-17, split between the Country Club side and Parkside.',
      'A large share of the community is at or approaching Medicare age, and Anthem Community Park is where most of my referrals start as a conversation.',
      'Most Anthem residents drive down to Deer Valley or north Phoenix for specialists, which makes provider networks the deciding factor in almost every plan comparison here.',
      'ZIP 85086 covers both Anthem and a good portion of the surrounding desert, so plan availability can differ from what neighbors a few miles south are offered.',
    ],
    proximity: 'This is home base — appointments here are in person whenever you want them to be.',
  },
  {
    slug: 'glendale-az',
    city: 'Glendale',
    label: 'Glendale, AZ',
    zips: ['85301', '85302', '85303', '85304', '85305', '85306', '85308', '85310'],
    county: 'Maricopa County',
    summary:
      'Independent Medicare guidance for Glendale — Advantage, Supplement, Part D and long-term care, compared against the Banner and Abrazo networks you already use.',
    seoDescription:
      'Independent Medicare guidance for Glendale, AZ — Advantage, Supplement and Part D, compared against the Banner and Abrazo networks you already use.',
    local: [
      'Glendale is really several markets in one. Arrowhead and the 85308/85310 ZIPs north of Bell Road skew older and more settled; historic downtown around Catlin Court and the 85301 core is younger, denser and far more likely to be helping a parent through enrollment than enrolling personally.',
      'Banner Thunderbird and Abrazo Arrowhead Campus anchor most of the care people here actually receive, and the two are not carried identically by every Advantage plan. That single fact decides more Glendale plan comparisons than premium does.',
      'Retired Luke Air Force Base families are a real part of this market, and TRICARE For Life changes the math completely — an Advantage plan is usually the wrong answer for that household, and it is worth ten minutes to establish which situation you are in before anyone looks at a plan.',
      'Glendale sits on the Sun City and Peoria borders, so it is common to live in one ZIP, see a specialist in another and use a pharmacy in a third. Networks are drawn around hospital systems, not city limits.',
    ],
    proximity:
      'About 30 minutes south-west of the Anthem office — I-17 down to the Loop 101 and straight across.',
  },
  {
    slug: 'peoria-az',
    city: 'Peoria',
    label: 'Peoria, AZ',
    zips: ['85345', '85381', '85382', '85383', '85385'],
    county: 'Maricopa County',
    summary:
      'Medicare help across Peoria, from the Vistancia and Westbrook Village communities to the older 85345 core — plans checked against your own doctors and prescriptions.',
    seoDescription:
      'Medicare help across Peoria, AZ — from Vistancia and Westbrook Village to the 85345 core, checked against your own doctors and prescriptions.',
    local: [
      'Peoria stretches nearly thirty miles north to south, and the Medicare conversation is genuinely different at each end. Vistancia and the north 85383 corridor are newer, with a lot of recent arrivals still on a plan they bought in another state; 85345 and Westbrook Village have households that have been with the same doctor for twenty years.',
      'That north–south split matters because provider access does too. North Peoria residents drive to Arrowhead or into Sun City for most specialist care, which puts the deciding weight on how far a plan network actually reaches rather than on what it advertises.',
      'A large share of the 55-plus communities here — Westbrook Village, Trilogy at Vistancia — hold seasonal residents who spend part of the year out of state. When somebody is gone four months a year, a Medicare Supplement often ends up fitting better than a network-based plan, and that is a conversation worth having before January rather than after.',
      'ZIPs on the Peoria–Glendale–Sun City seam sit close enough together that neighbors a mile apart can be offered different plan line-ups. It is worth pricing your own ZIP rather than borrowing a friend’s answer.',
    ],
    proximity:
      'Roughly 25 minutes from Anthem — out the Carefree Highway and down Lake Pleasant Parkway into north Peoria.',
  },
  {
    slug: 'phoenix-85086',
    city: 'North Phoenix',
    label: 'North Phoenix (85086)',
    zips: ['85086'],
    county: 'Maricopa County',
    summary:
      'Medicare guidance for the 85086 corner of north Phoenix — Advantage plans, Medigap, Part D and long-term care, reviewed against your own doctors.',
    seoDescription:
      'Medicare guidance for the 85086 corner of north Phoenix — Advantage, Medigap, Part D and long-term care, reviewed against your own doctor list.',
    local: [
      'The 85086 side of north Phoenix runs south from Anthem toward Norterra and the Deer Valley corridor.',
      'Provider access is genuinely good here — HonorHealth Deer Valley and the Norterra medical offices put a lot of networks within reach, which widens the plan options compared to communities further north.',
      'More options is not automatically better. It means the comparison has to be done against your actual doctor list rather than a brochure.',
    ],
    proximity: 'A short run south down I-17 from Anthem.',
  },
  {
    slug: 'scottsdale-az',
    city: 'Scottsdale',
    label: 'Scottsdale, AZ',
    zips: ['85254', '85255', '85258', '85259', '85260', '85262', '85266'],
    county: 'Maricopa County',
    summary:
      'Independent Medicare guidance across Scottsdale — Advantage, Supplement, Part D and long-term care, weighed against the specialists and the higher-income issues that come with this market.',
    seoDescription:
      'Independent Medicare guidance for Scottsdale, AZ — Advantage, Supplement and Part D, weighed against your own specialists, IRMAA and travel plans.',
    local: [
      'Scottsdale runs the better part of thirty miles north to south and behaves like three different Medicare markets along the way. The older, denser south end around Osborn and downtown has households that have used the same doctors for decades. Central Scottsdale — 85258, 85259, 85260 — is where most of the 55-plus community associations sit. North of the 101, in 85262 and 85266, the houses are further apart, the drive to a specialist is longer, and network reach matters more than anything a plan advertises.',
      'This is a market full of people who are attached to a specific physician or practice, and that is the single fact that decides most Scottsdale plan comparisons. The large systems on this side of the Valley are not carried identically by every Advantage plan, and a practice can be in network one plan year and out the next. Bring the actual list of doctors you intend to keep and we check it before anything else — including whether a plan you already like still holds them for the coming year.',
      'Concierge and direct-primary-care memberships are more common here than anywhere else I work. Medicare does not pay the membership fee, and neither does an Advantage plan or a Supplement — that money sits outside the coverage conversation entirely. What matters is whether the physician still bills Medicare for the covered visits underneath the membership, because some do and some have opted out, and the answer changes what your coverage is actually worth. It is worth a phone call to the practice before enrollment season, not after.',
      'Higher incomes make IRMAA a live issue in Scottsdale rather than a footnote. The surcharge on Part B and Part D is set from a tax return two years old, so a business sale, a Roth conversion, an unusually large RMD or a spouse\'s death can raise a premium for reasons that have nothing to do with this year. There is a formal process for appealing it after a life-changing event, and plenty of people who qualify never file. The tax planning belongs with your CPA; getting the timing and the paperwork right is something I can walk you through.',
      'A large share of this market is out of Arizona for part of the year — a summer place, extended family somewhere cooler, or genuine dual residency. Network-based plans and coverage that travels behave very differently for that household, and the honest comparison depends on where you actually receive routine care rather than where your mail goes.',
    ],
    proximity:
      'About 35 to 40 minutes east of the Anthem office — the Carefree Highway across to Scottsdale Road, or the 101 if you are further south.',
  },
  {
    slug: 'carefree-az',
    city: 'Carefree',
    label: 'Carefree, AZ',
    zips: ['85377'],
    county: 'Maricopa County',
    summary:
      'Medicare guidance for Carefree and Cave Creek residents, including Medicare Supplement options that travel and long-term care planning.',
    seoDescription:
      'Medicare guidance for Carefree and Cave Creek, AZ — including Medicare Supplement options that travel, IRMAA and long-term care planning.',
    local: [
      'Carefree and neighboring Cave Creek skew older and higher-income, which makes two things come up constantly: IRMAA surcharges and long-term care planning.',
      'Plenty of Carefree households split the year between Arizona and somewhere cooler, and that single fact often points the plan comparison toward a Medicare Supplement rather than a network-based plan.',
      'Specialist care usually means driving to Scottsdale or north Phoenix, so network breadth matters more here than the extras a plan advertises.',
    ],
    proximity: 'About a 30-minute drive east of Anthem across the Carefree Highway.',
  },
  {
    slug: 'new-river-az',
    city: 'New River',
    label: 'New River, AZ',
    zips: ['85087', '85086'],
    county: 'Maricopa County',
    summary:
      'Medicare help for New River and Desert Hills — plain answers on Advantage versus Supplement, drug plan pricing and enrollment deadlines.',
    seoDescription:
      'Medicare help for New River and Desert Hills, AZ — plain answers on Advantage versus Supplement, drug plan pricing and enrollment deadlines.',
    local: [
      'New River and Desert Hills are more spread out and more rural than Anthem, and a lot of households here are on well water, dirt roads and a long drive to anything.',
      'That distance changes the calculus: a plan with a thin local network looks fine on paper and becomes a real problem when the nearest in-network specialist is forty minutes away.',
      'Anthem is the practical service hub for most New River residents, so we usually meet in the middle.',
    ],
    proximity: 'Immediately north and west of Anthem — often the same ZIP, always the same advisor.',
  },
];

/**
 * Fail the BUILD, not the audit, on an over-long meta description. Google
 * truncates at roughly 155 characters, and a truncated description is the kind
 * of defect that ships silently — it renders fine, it just gets cut in the one
 * place anybody sees it. Catching it here means a new city cannot be added
 * without the limit being respected.
 */
for (const l of locations) {
  if (l.seoDescription.length > 155) {
    throw new Error(
      `locations.ts: ${l.slug} seoDescription is ${l.seoDescription.length} chars (max 155)`,
    );
  }
}

export const locationBySlug = (slug: string) => locations.find((l) => l.slug === slug);

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Tier two: communities we serve and name, but that do NOT have a page.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Both are already covered in prose by an existing page — Desert Hills shares
 * the New River page and Cave Creek shares the Carefree page — and `servedBy`
 * points a reader at it, so every row in the home-page ZIP table now goes
 * somewhere. Nothing here may be listed without a `servedBy`: a row that leads
 * nowhere is the defect this arrangement exists to avoid.
 *
 * They are deliberately NOT entries in `locations` above. Adding them there
 * would generate two more routes, and the honest version of a city page on
 * this site runs 500+ words of genuinely local detail (the audit enforces it).
 * A thin page spun up to fill a table would cost more in crawl quality than the
 * row is worth. Promote one to `locations` when there is real content to put on
 * it — Scottsdale was promoted this way on 2026-08-14 — and add it to CITIES in
 * scripts/audit.mjs and scripts/e2e.mjs when you do.
 */
export interface AdditionalArea {
  city: string;
  label: string;
  zips: string[];
  county: string;
  /** Slug of the page that already covers this community in its copy, if any. */
  servedBy?: string;
}

export const additionalAreas: AdditionalArea[] = [
  {
    city: 'Desert Hills',
    label: 'Desert Hills, AZ',
    zips: ['85086'],
    county: 'Maricopa County',
    servedBy: 'new-river-az',
  },
  {
    city: 'Cave Creek',
    label: 'Cave Creek, AZ',
    zips: ['85331'],
    county: 'Maricopa County',
    servedBy: 'carefree-az',
  },
];

/**
 * The service-area list as it is READ — ordered geographically outward from the
 * Anthem office rather than by brand priority.
 *
 * This is intentionally a different order from `locations` above, which stays in
 * brand order because it drives the footer links, the hub cards and the schema,
 * where "home base, then the markets the positioning line names" is the right
 * sequence. Here the reader is scanning for their own town, and "how far is this
 * from Anthem" is the only ordering that helps them do it.
 */
const ROW_ORDER = [
  'Anthem',
  'Desert Hills',
  'New River',
  'Cave Creek',
  'Carefree',
  'Scottsdale',
  'North Phoenix',
  'Glendale',
  'Peoria',
];

export interface ServiceAreaRow {
  city: string;
  zips: string[];
  /**
   * Path to the page covering this community. REQUIRED. Rows used to be allowed
   * to render as plain text when a community had no page, which is exactly what
   * it looks like when something is broken — Scottsdale sat in the middle of the
   * table looking identical to its neighbors and not responding to a click
   * (reported 2026-08-14). Every row now leads somewhere: either the community's
   * own page or the page whose copy covers it.
   */
  href: string;
}

export const serviceAreaRows: ServiceAreaRow[] = ROW_ORDER.map((city) => {
  const page = locations.find((l) => l.city === city);
  if (page) return { city, zips: page.zips, href: `/service-area/${page.slug}/` };

  const extra = additionalAreas.find((a) => a.city === city);
  if (!extra) {
    // A name in ROW_ORDER that matches neither list is a typo, and it would
    // otherwise drop a whole community out of the table silently.
    throw new Error(`locations.ts: ROW_ORDER names "${city}", which is in neither list`);
  }
  if (!extra.servedBy) {
    throw new Error(
      `locations.ts: "${city}" is in the ZIP table with no page and no servedBy — ` +
        'give it a page in `locations`, or point servedBy at the page that covers it.',
    );
  }
  return { city, zips: extra.zips, href: `/service-area/${extra.servedBy}/` };
});

/** Every community named on the site, for `areaServed` in structured data. */
export const allServedAreas = [
  ...locations.map((l) => ({ city: l.city, county: l.county })),
  ...additionalAreas.map((a) => ({ city: a.city, county: a.county })),
];

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE serving list. One string, used everywhere a list of served cities is
 *  displayed — the hero eyebrow, the contact card, the About page, the ZIP
 *  table's own ordering.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Derived from `serviceAreaRows`, so it is the same nine communities in the
 *  same outward-from-Anthem order as the table, and it cannot fall out of step
 *  with it. It replaced four different hand-written lists that had drifted
 *  apart: a six-city one on the contact card, a four-city one in the hero
 *  eyebrow, another four-city one in the article author bio, and a fifth built
 *  by regex from `locations` on the About page — which produced the genuinely
 *  broken "Anthem, AZ, Glendale, AZ, … New River and AZ".
 *
 *  DO NOT hand-write a serving list anywhere. Import this, or — for prose and
 *  the footer, where a sentence rather than a list is wanted — `site.servingLine`.
 */
export const serviceAreaListText = serviceAreaRows.map((r) => r.city).join(' · ');

export default locations;
