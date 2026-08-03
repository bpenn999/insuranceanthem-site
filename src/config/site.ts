/**
 * Daisy Mountain Insurance — single source of truth.
 *
 * ⚠️  PHONE IS A PLACEHOLDER. Change `phone.raw` below and every phone number,
 *     tel: link, schema entry and footer across the whole site updates with it.
 *     Nothing else needs touching. Same pattern for email, NPN and address.
 */

const PHONE_RAW = '6235550100'; // ← PLACEHOLDER (623) 555-0100. Swap this one string.

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(-10);
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export const site = {
  /**
   * Agency identity. Named for Daisy Mountain — the landmark Anthem sits under,
   * and the name locals already use for this stretch of the north valley.
   */
  name: 'Daisy Mountain Insurance',
  legalName: 'Daisy Mountain Insurance',
  tagline:
    'An independent Medicare agency serving Anthem, New River, Desert Hills, Carefree and North Phoenix — named for Daisy Mountain, the landmark Anthem sits under.',
  description:
    'Independent Medicare agency serving Anthem, New River, Desert Hills, Carefree and North Phoenix. Medicare Advantage, Medicare Supplement, Part D and Long-Term Care — explained plainly by a licensed local advisor with 22+ years of experience.',

  /** Canonical origin — every absolute URL, og:url and schema @id derives from this. */
  origin: 'https://daisymountaininsurance.com',
  domain: 'daisymountaininsurance.com',

  /** Contact */
  email: 'brian@daisymountaininsurance.com',
  phone: {
    raw: PHONE_RAW,
    /** (623) 555-0100 — what humans see */
    display: formatPhone(PHONE_RAW),
    /** tel:+16235550100 — what devices dial */
    href: `tel:+1${PHONE_RAW.replace(/\D/g, '').slice(-10)}`,
    /** +1-623-555-0100 — schema.org / structured data */
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
    /** No street address published — appointments are by arrangement. */
    display: 'Anthem, AZ 85086',
  },

  /** Geo center of Anthem, AZ — used for LocalBusiness schema */
  geo: {
    latitude: 33.8675,
    longitude: -112.1466,
    /** miles */
    serviceRadius: 30,
  },

  /** Service area — every city page and schema areaServed derives from this list. */
  /**
   * Desert Hills has no location page of its own yet — it is here because the
   * brand line names it, and schema areaServed must not claim less than the
   * copy does. Add the page and it slots in beside the other four.
   */
  serviceArea: ['Anthem', 'Carefree', 'New River', 'Desert Hills', 'Phoenix 85086'],

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
