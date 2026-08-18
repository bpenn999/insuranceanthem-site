/**
 * The four product lines. MEDICARE ONLY — no ACA / marketplace / under-65 health.
 * Drives the home services grid, the nav dropdown, the footer and each product page.
 */

export interface Product {
  slug: string;
  /** Short label — nav, grid tiles */
  name: string;
  /** Full name — page H1s, schema */
  fullName: string;
  /** One line, plain English */
  blurb: string;
  /**
   * The <meta name="description"> for this product page. SEPARATE FROM `blurb`
   * on purpose, and HARD CAPPED at 155 — asserted at the bottom of this file.
   * The page used to compose `blurb` plus a fixed name/experience/geography
   * tail, which put all four pages between 179 and 186 characters: over the
   * limit by construction, on every one of them, forever.
   */
  seoDescription: string;
  /** 2–3 sentences for the product page intro */
  intro: string;
  icon: 'shield' | 'plus' | 'pill' | 'home';
  points: string[];
  /** "Who it fits" bullets */
  fit: string[];
  faqs: { q: string; a: string }[];
  /**
   * The `.gov` pages behind this product's claims, rendered as a sources block
   * and emitted as `citation` on the page's WebPage node.
   *
   * These are the four money pages and they carried no citations at all —
   * describing what a Medicare Advantage network does, what a Supplement pays,
   * what Part D costs, what Medicare does not cover for long-term care, with
   * nothing a reader could check. Same gap the Learn shelf and the city pages
   * had; same reason it matters more here, because these are the pages someone
   * lands on before deciding to call.
   *
   * `.gov`/`.mil` only, asserted below. Never a carrier page: these pages must
   * not imply carrier endorsement, so a carrier link would be a compliance
   * problem before it was ever a sourcing one.
   */
  sources: { label: string; url: string }[];
  /**
   * ISO date the copy was last actually reviewed. Drives `dateModified` and a
   * visible line, same contract as `reviewed` in locations.ts: bump it only
   * when the copy really changed, and never forward to look fresh.
   */
  reviewed: string;
}

export const products: Product[] = [
  {
    slug: 'medicare-advantage',
    name: 'Medicare Advantage',
    fullName: 'Medicare Advantage (Part C)',
    blurb: 'All-in-one plans that bundle Part A, Part B and usually Part D.',
    seoDescription:
      'All-in-one plans bundling Part A, Part B and usually Part D — with your doctors checked against the network first. Anthem, Scottsdale & the Valley.',
    intro:
      'A Medicare Advantage plan replaces the way you receive your Original Medicare benefits. One card, one plan, usually with prescription drug coverage folded in — and often extras like dental, vision and hearing. The trade-off is a network and a set of plan rules, which is exactly what we go through together before you enroll.',
    icon: 'shield',
    points: [
      'Bundles Part A, Part B and usually Part D into one plan',
      'Often includes dental, vision, hearing and fitness benefits',
      'Yearly out-of-pocket maximum protects you from unlimited costs',
      'Uses a provider network — we check your doctors before you enroll',
      'Many plans in Maricopa County carry a $0 monthly premium',
    ],
    fit: [
      'You want predictable copays and a cap on annual spending',
      'Your doctors are already in the plan network',
      'Extra benefits like dental and vision matter to you',
      'You are comfortable with referrals or network rules',
    ],
    reviewed: '2026-08-18',
    sources: [
      { label: 'Medicare Advantage and other health plans', url: 'https://www.medicare.gov/health-drug-plans/health-plans' },
      { label: 'Joining a Medicare plan', url: 'https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/joining-a-plan' },
      { label: 'Find and compare plans in your ZIP', url: 'https://www.medicare.gov/plan-compare/' },
    ],
    faqs: [
      {
        q: 'Do I still pay my Part B premium on a Medicare Advantage plan?',
        a: 'Yes. You keep paying your Part B premium to Medicare, plus any premium the plan itself charges. Many Advantage plans available in the Anthem area have a $0 plan premium, but the Part B premium never goes away.',
      },
      {
        q: 'What happens if my doctor leaves the network?',
        a: 'Networks can change from year to year. That is the single biggest reason to review your plan every fall during the Annual Enrollment Period — we re-check your providers and your prescriptions against next year\'s plan before anything is locked in.',
      },
      {
        q: 'Can I travel with a Medicare Advantage plan?',
        a: 'Emergency and urgent care are covered nationwide. Routine care outside the service area depends on the plan — some PPOs travel far better than HMOs. If you spend part of the year out of state, tell me up front and we will weight the search accordingly.',
      },
    ],
  },
  {
    slug: 'medicare-supplement',
    name: 'Medicare Supplement',
    fullName: 'Medicare Supplement Insurance (Medigap)',
    blurb: 'Fills the gaps in Original Medicare. Any doctor that takes Medicare.',
    seoDescription:
      'Medigap fills the gaps Original Medicare leaves, and any doctor who takes Medicare takes it. Independent guidance in Anthem, Scottsdale & the Valley.',
    intro:
      'A Medicare Supplement — often called Medigap — works alongside Original Medicare instead of replacing it. It pays the deductibles and coinsurance Medicare leaves behind, so your costs become far more predictable. There is no network: if a provider accepts Medicare, they accept your supplement.',
    icon: 'plus',
    points: [
      'Works with Original Medicare — no network, no referrals',
      'Standardized plans (Plan G, Plan N and others) by federal law',
      'Same benefits from every carrier — only price and service differ',
      'Travels with you anywhere in the country',
      'Requires a separate Part D plan for prescriptions',
    ],
    fit: [
      'You want to keep any doctor or specialist who takes Medicare',
      'You would rather pay a steady monthly premium than variable copays',
      'You travel, snowbird, or split time between states',
      'You are in your Medigap open enrollment window or can pass underwriting',
    ],
    reviewed: '2026-08-18',
    sources: [
      { label: 'Medigap basics', url: 'https://www.medicare.gov/health-drug-plans/medigap/basics' },
      { label: 'When you can buy Medigap without health questions', url: 'https://www.medicare.gov/health-drug-plans/medigap/ready-to-buy' },
      { label: 'Using providers with Original Medicare', url: 'https://www.medicare.gov/providers-services/original-medicare' },
    ],
    faqs: [
      {
        q: 'What is the difference between Plan G and Plan N?',
        a: 'Both cover the same core gaps. Plan G leaves you only the annual Part B deductible; Plan N costs less each month but adds small copays for office and emergency room visits and does not cover Part B excess charges. Which one wins depends on how often you actually see a doctor — we run the math on your real usage.',
      },
      {
        q: 'Can I be turned down for a Medicare Supplement?',
        a: 'During your six-month Medigap open enrollment period, which starts when you are 65 and enrolled in Part B, you cannot be turned down or charged more for health reasons. Outside that window, and outside a guaranteed-issue situation, Arizona carriers can use medical underwriting. Timing matters enormously here.',
      },
      {
        q: 'Does a supplement cover my prescriptions?',
        a: 'No. Medigap plans sold today do not include drug coverage. You pair the supplement with a standalone Part D plan — we build both sides at the same time so nothing falls through the cracks.',
      },
    ],
  },
  {
    slug: 'part-d',
    name: 'Part D',
    fullName: 'Medicare Part D Prescription Drug Coverage',
    blurb: 'Prescription drug plans, priced against your actual medication list.',
    seoDescription:
      'Part D drug plans priced against your actual medication list and pharmacy, not the premium alone. Anthem, Scottsdale & the Phoenix metro.',
    intro:
      'Part D covers prescription drugs. Every plan has its own formulary, its own tiers and its own preferred pharmacies, which means the cheapest premium is very often not the cheapest plan for you. The only honest way to choose is to price your specific medication list, at your specific pharmacy, across every plan available in your ZIP.',
    icon: 'pill',
    points: [
      'Standalone drug plans that pair with Original Medicare or a supplement',
      'Every plan uses a different formulary and tier structure',
      'Preferred pharmacies can change your cost dramatically',
      'A late-enrollment penalty applies for life if you delay without other coverage',
      'Plans change every January — a yearly review is not optional',
    ],
    fit: [
      'You have Original Medicare or a Medicare Supplement',
      'You take any regular prescriptions — even one',
      'You want to avoid the lifetime late-enrollment penalty',
      'Your drug costs jumped this year and you want to know why',
    ],
    reviewed: '2026-08-18',
    sources: [
      { label: 'Medicare Part D drug coverage', url: 'https://www.medicare.gov/drug-coverage-part-d' },
      { label: 'Costs for Medicare drug coverage', url: 'https://www.medicare.gov/drug-coverage-part-d/costs-for-medicare-drug-coverage' },
      { label: 'How to get prescription drug coverage', url: 'https://www.medicare.gov/drug-coverage-part-d/how-to-get-prescription-drug-coverage' },
    ],
    faqs: [
      {
        q: 'I barely take any medication. Do I still need Part D?',
        a: 'Usually yes. If you go more than 63 days after your Initial Enrollment Period without creditable drug coverage, Medicare adds a penalty to your premium for as long as you have Part D. A low-cost plan now is almost always cheaper than the permanent penalty later.',
      },
      {
        q: 'Why did my drug plan cost go up in January?',
        a: 'Formularies, tiers and preferred pharmacy agreements reset every plan year. A drug that was tier 2 can move to tier 3, and your pharmacy can drop out of the preferred network. This is the most common reason people call me in January — and the reason we re-price your list every fall.',
      },
      {
        q: 'Can you actually check my specific medications?',
        a: 'Yes, and it is the whole point. Bring your list with dosages and your preferred pharmacy, and we compare total annual cost — premium plus deductible plus copays — across the plans in ZIP 85086.',
      },
    ],
  },
  {
    slug: 'long-term-care',
    name: 'Long-Term Care',
    fullName: 'Long-Term Care Planning',
    blurb: 'Coverage for the care Medicare was never designed to pay for.',
    seoDescription:
      'Coverage for the care Medicare was never designed to pay for — traditional and limited-pay. Independent guidance in Anthem, Scottsdale & the Valley.',
    intro:
      'This is the gap most people do not find out about until they need it. Medicare pays for short, skilled, rehabilitative stays — not for extended custodial care, assisted living or ongoing help with daily activities. Long-term care planning is how you keep that cost from landing on your savings or your family.',
    icon: 'home',
    points: [
      'Medicare does not pay for extended custodial or assisted-living care',
      'Traditional long-term care policies and hybrid life/LTC options',
      'Protects retirement assets and takes pressure off adult children',
      'Premiums and eligibility both depend heavily on your age and health',
      'The best time to look at it is well before you need it',
    ],
    fit: [
      'You have retirement assets you would rather not spend down on care',
      'You have watched a parent or spouse go through extended care',
      'You are in your late 50s to early 70s and in reasonable health',
      'You want a plan that does not put the burden on your kids',
    ],
    reviewed: '2026-08-18',
    sources: [
      { label: 'Long-term care — what Medicare covers', url: 'https://www.medicare.gov/coverage/long-term-care' },
      { label: 'Skilled nursing facility care, and its limits', url: 'https://www.medicare.gov/coverage/skilled-nursing-facility-snf-care' },
      { label: 'What Medicare covers', url: 'https://www.medicare.gov/coverage' },
    ],
    faqs: [
      {
        q: "Doesn't Medicare cover nursing home care?",
        a: 'Only in a limited way. Medicare can cover up to 100 days in a skilled nursing facility following a qualifying hospital stay, with cost sharing after day 20, and only while you are actively improving. Custodial care — help with bathing, dressing, eating — is not covered at all, and that is the care most people end up needing.',
      },
      {
        q: 'Is long-term care insurance worth it?',
        a: 'It depends entirely on your assets, your family situation and your health. For some people self-funding genuinely is the right answer, and I will tell you so. For others, a hybrid policy that returns a death benefit if care is never needed solves the "what if I pay in and never use it" objection.',
      },
      {
        q: 'How much does care actually cost in Arizona?',
        a: 'Assisted living and in-home care in the Phoenix metro area run well into five figures per year, and skilled nursing runs considerably higher. We look at real regional numbers rather than national averages when we build the plan.',
      },
    ],
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export default products;

/**
 * Fail the BUILD on an over-long meta description — the same guard
 * src/data/locations.ts uses for city pages. Google truncates at roughly 155
 * characters, and a truncated description is the defect that ships silently:
 * it renders fine, it just gets cut in the one place anybody sees it.
 */
for (const p of products) {
  if (p.seoDescription.length > 155) {
    throw new Error(
      `products.ts: ${p.slug} seoDescription is ${p.seoDescription.length} chars (max 155)`,
    );
  }
}

/**
 * Fail the BUILD on an unsourced or badly sourced product page, for the same
 * reason locations.ts fails on a duplicated one: the defect ships silently. An
 * uncited page renders perfectly and simply reads as less trustworthy to both a
 * person and a crawler, and nobody notices because there is nothing to see.
 */
for (const p of products) {
  if (p.sources.length < 2) {
    throw new Error(`products.ts: ${p.slug} has ${p.sources.length} sources (minimum 2)`);
  }
  for (const { url } of p.sources) {
    if (!/^https:\/\/(www\.)?[a-z0-9.-]+\.(gov|mil)\//.test(url)) {
      throw new Error(`products.ts: ${p.slug} source ${url} is not an https .gov/.mil URL`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.reviewed)) {
    throw new Error(`products.ts: ${p.slug} reviewed "${p.reviewed}" is not YYYY-MM-DD`);
  }
  if (p.reviewed > new Date().toISOString().slice(0, 10)) {
    throw new Error(`products.ts: ${p.slug} reviewed ${p.reviewed} is in the future`);
  }
}
