/**
 * Service-area pages. Anthem, AZ 85086 and the communities immediately around it.
 * Everything here is real North Valley / north Phoenix geography — nothing carried
 * over from another market. Add a city by adding an entry; the route generates itself.
 */

export interface Location {
  slug: string;
  /** "Anthem" */
  city: string;
  /** "Anthem, AZ" */
  label: string;
  zips: string[];
  county: string;
  /** Sentence used in meta description and the page intro */
  summary: string;
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
    local: [
      'Anthem sits at the north end of Maricopa County along I-17, split between the Country Club side and Parkside.',
      'A large share of the community is at or approaching Medicare age, and Anthem Community Park is where most of my referrals start as a conversation.',
      'Most Anthem residents drive down to Deer Valley or north Phoenix for specialists, which makes provider networks the deciding factor in almost every plan comparison here.',
      'ZIP 85086 covers both Anthem and a good portion of the surrounding desert, so plan availability can differ from what neighbors a few miles south are offered.',
    ],
    proximity: 'This is home base — appointments here are in person whenever you want them to be.',
  },
  {
    slug: 'carefree-az',
    city: 'Carefree',
    label: 'Carefree, AZ',
    zips: ['85377'],
    county: 'Maricopa County',
    summary:
      'Medicare guidance for Carefree and Cave Creek residents, including Medicare Supplement options that travel and long-term care planning.',
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
    local: [
      'New River and Desert Hills are more spread out and more rural than Anthem, and a lot of households here are on well water, dirt roads and a long drive to anything.',
      'That distance changes the calculus: a plan with a thin local network looks fine on paper and becomes a real problem when the nearest in-network specialist is forty minutes away.',
      'Anthem is the practical service hub for most New River residents, so we usually meet in the middle.',
    ],
    proximity: 'Immediately north and west of Anthem — often the same ZIP, always the same advisor.',
  },
  {
    slug: 'phoenix-85086',
    city: 'North Phoenix',
    label: 'North Phoenix (85086)',
    zips: ['85086'],
    county: 'Maricopa County',
    summary:
      'Medicare guidance for the 85086 corner of north Phoenix — Advantage plans, Medigap, Part D and long-term care, reviewed against your own doctors.',
    local: [
      'The 85086 side of north Phoenix runs south from Anthem toward Norterra and the Deer Valley corridor.',
      'Provider access is genuinely good here — HonorHealth Deer Valley and the Norterra medical offices put a lot of networks within reach, which widens the plan options compared to communities further north.',
      'More options is not automatically better. It means the comparison has to be done against your actual doctor list rather than a brochure.',
    ],
    proximity: 'A short run south down I-17 from Anthem.',
  },
];

export const locationBySlug = (slug: string) => locations.find((l) => l.slug === slug);
export default locations;
