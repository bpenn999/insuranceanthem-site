/**
 * 602Medicare — single source of truth.
 *
 * Change `PHONE_RAW` below and every phone number, tel: link, schema entry and
 * footer across the whole site updates with it. Nothing else needs touching.
 * Same pattern for email, NPN and address.
 */

/** The real line, live since 2026-08-05. Digits only — every format derives. */
const PHONE_RAW = '6028446002';

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(-10);
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export const site = {
  /**
   * Agency identity. Named for the 602 — the area code the whole Phoenix metro
   * still calls itself by, whatever the overlay says. ONE WORD, no space: it is
   * "602Medicare" in running copy, in schema and in the <title> tag.
   */
  name: '602Medicare',
  legalName: '602Medicare',
  /**
   * The registered entity behind the brand. 602Medicare is a DBA, not a
   * corporation, so the footer copyright has to name the company that actually
   * holds it — "© 602Medicare, a DBA of Kenztara INC". Keep the spelling
   * "Kenztara INC" exactly: that is how it is registered, capital INC and no
   * full stop.
   */
  parentCompany: 'Kenztara INC',
  /**
   * The wordmark lockup, split for the two-tone rendering in the header, the
   * footer band and scripts/og-card.html. It is deliberately NOT derived from
   * `name` by splitting on whitespace — the name has none. Both halves set tight
   * against each other with no letter-space between them.
   */
  wordmark: {
    /** Accent half — --red on light grounds, --red-lift on navy. */
    mark: '602',
    /** Primary half — --navy on light grounds, white on navy. */
    product: 'Medicare',
  },
  /**
   * The positioning line. Two jobs at once: it names the office (Anthem, which
   * is where appointments and the LocalBusiness address actually are) and the
   * reach (Phoenix metro). Keep both halves whenever this is reworded — dropping
   * the office turns a local business into a call centre, and dropping the metro
   * shrinks the brand back to the market it just outgrew.
   */
  tagline:
    'Phoenix-metro Medicare guidance — office in Anthem, serving Glendale, Peoria, North Phoenix & the Valley.',
  description:
    'Phoenix-metro Medicare guidance from an office in Anthem, serving Glendale, Peoria, North Phoenix and across the Valley. Medicare Advantage, Medicare Supplement and Part D, plus long-term care planning — explained plainly by a licensed local advisor with 22+ years of experience.',

  /** Canonical origin — every absolute URL, og:url and schema @id derives from this. */
  origin: 'https://602medicare.com',
  domain: '602medicare.com',

  /** Contact */
  email: 'brian@602medicare.com',
  phone: {
    raw: PHONE_RAW,
    /** (602) 844-6002 — what humans see */
    display: formatPhone(PHONE_RAW),
    /** tel:+16028446002 — what devices dial */
    href: `tel:+1${PHONE_RAW.replace(/\D/g, '').slice(-10)}`,
    /** +1-602-844-6002 — schema.org / structured data */
    schema: `+1-${PHONE_RAW.slice(0, 3)}-${PHONE_RAW.slice(3, 6)}-${PHONE_RAW.slice(6)}`,
  },

  /** The advisor */
  agent: {
    name: 'Brian Penner',
    firstName: 'Brian',
    title: 'Licensed Independent Medicare Advisor',
    npn: '8206556',
    /** Always "22+ Years". Never 21. */
    experience: '22+ Years',
    experienceYears: 22,
    statesLicensed: 18,
  },

  /** Where we are */
  address: {
    locality: 'Anthem',
    region: 'AZ',
    regionName: 'Arizona',
    postalCode: '85086',
    country: 'US',
    /**
     * No street address published — appointments are by arrangement, and there
     * is no storefront to send anyone to. City and state ONLY: do not add a
     * street line here, and do not pad it back out to "Anthem, AZ 85086". The
     * ZIP still reaches structured data through `postalCode` above, which is
     * where a parser looks for it; on the page it just reads as a half-address
     * that raises the question of the missing street.
     */
    display: 'Anthem, AZ',
  },

  /** Geo center of Anthem, AZ — used for LocalBusiness schema */
  geo: {
    latitude: 33.8675,
    longitude: -112.1466,
    /** miles */
    serviceRadius: 30,
  },

  /**
   * Service area — the plain-text list. The generated city PAGES and the schema
   * `areaServed` both derive from src/data/locations.ts, not from here; this is
   * the wider claim, including the communities that are genuinely served without
   * having earned a page of their own yet (Desert Hills, Cave Creek, Sun City).
   * Claiming more here than the pages do is fine; claiming less is not.
   */
  /**
   * The footer's one-line reach claim. Deliberately shorter than `serviceArea`
   * below — it names the four markets that carry the positioning and then says
   * "the Valley" rather than listing nine communities in a footer.
   */
  servingLine: 'Serving Anthem, Glendale, Peoria, North Phoenix & the Valley',

  serviceArea: [
    'Anthem',
    'Glendale',
    'Peoria',
    'North Phoenix',
    'New River',
    'Desert Hills',
    'Carefree',
    'Cave Creek',
    'Sun City',
  ],

  hours: {
    display: 'Monday – Friday, 8:00 AM – 5:00 PM MST',
    schema: [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
    ],
    note: 'Evening and weekend appointments available by request.',
  },

  /** Trust bar — rendered on the home page and in the footer. */
  trust: [
    '22+ Years',
    'Licensed in 18 States',
    'NPN 8206556',
  ],

  /** Booking / lead destinations. Point these at GHL when the account is wired. */
  links: {
    booking: '/contact/',
    quote: '/contact/?intent=quote',
  },

  /**
   * The short intro call every article closes with.
   *
   * `url` is currently an on-site contact link because no calendar is wired up
   * yet. Swap it for a real scheduler (a GHL calendar, Calendly, …) and every
   * article CTA, plus the Learn hub, points at the booking page instead — no
   * other edits. If you point it off-site, widen `connect-src`/`form-action`
   * in public/_headers to match.
   */
  consult: {
    minutes: 15,
    url: '/contact/?intent=15-minute-call',
    label: 'Book a free 15-minute call',
    /** Used in body copy, e.g. "a free 15-minute call" */
    phrase: 'free 15-minute call',
  },

  /**
   * Lead endpoint. EMPTY ON PURPOSE — this is a static site with no backend,
   * so the contact form falls back to opening a prefilled email instead of
   * pretending to submit somewhere. Set this to a CRM/webhook URL (GHL inbound
   * webhook, a Pages Function at /api/lead, Formspree, …) and every form on
   * the site starts POSTing JSON to it with no other changes.
   */
  leadEndpoint: '',

  /** Social profiles — add real URLs as they go live; empty entries are skipped in schema. */
  social: {
    facebook: '',
    linkedin: '',
    google: '',
  },
} as const;

/** Absolute URL helper — always canonical, always trailing-slashed. */
export function abs(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = `/${path}`.replace(/\/{2,}/g, '/');
  const withSlash = clean.endsWith('/') || /\.[a-z0-9]+$/i.test(clean) ? clean : `${clean}/`;
  return `${site.origin}${withSlash}`;
}

export type Site = typeof site;
export default site;
