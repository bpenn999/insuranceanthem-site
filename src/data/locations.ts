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
  /**
   * City-specific FAQs, rendered on the page AND emitted as FAQPage schema.
   *
   * REQUIRED, and deliberately not defaulted. These used to be generated from a
   * single template in [slug].astro with the city, ZIP and county tokens swapped
   * in, which meant seven pages shipped the same four questions and the same
   * four answers — the largest identical block on any city page, duplicated a
   * second time inside structured data. Google Search Console read the result
   * the way it reads any doorway set: 18 pages "Discovered – currently not
   * indexed" and 5 "Crawled – currently not indexed" as of 2026-08-13.
   *
   * A default here would quietly recreate that, because a new city would build
   * and pass without anyone writing its questions. Make the questions ones a
   * resident of THIS town would actually type — the network, the drive, the
   * seasonal split, whatever the local paragraphs establish — rather than the
   * same four questions wearing a different city's name.
   */
  faqs: { q: string; a: string }[];
  /** How this community relates to the Anthem home base */
  proximity: string;
  /**
   * ISO date (YYYY-MM-DD) this city's copy was last actually read and revised.
   * Becomes `dateModified` on the page's WebPage node.
   *
   * These pages carried no date at all until 2026-08-18, which left the one
   * question a reader and a crawler both ask — is this still true? — with no
   * answer on the page. Medicare copy has a real shelf life: networks,
   * formularies and premiums all reset every January, so a city page that was
   * accurate in one plan year can be quietly wrong in the next while looking
   * identical.
   *
   * BUMP THIS ONLY WHEN THE COPY ACTUALLY CHANGED. A date advanced to look
   * fresh is worse than an honest old one — it tells Google the page was
   * revised, Google re-crawls, finds nothing new, and trusts the next signal
   * less. The build rejects a future date for the same reason.
   */
  reviewed: string;
  /**
   * The `.gov` pages behind the rules THIS city's copy leans on.
   *
   * City pages scored 11/20 on accuracy-and-sourcing before these existed, and
   * the reason was not that anything was wrong — it was that every claim stood
   * naked. The copy tells a Carefree reader that Medicare does not pay for
   * custodial care and that Form SSA-44 exists, tells a New River reader the
   * Part B penalty is permanent, tells a Glendale reader what TRICARE For Life
   * does. All true, all consequential, none of it checkable without leaving the
   * page and searching. On YMYL health-and-money content that gap is the whole
   * difference between authoritative and merely confident.
   *
   * PER CITY, not shared. The point is to cite the rules that page actually
   * relies on — which differ, because the copy differs. A single site-wide
   * source list bolted onto all seven pages would be one more identical block,
   * and identical blocks are what put these pages in "Crawled – currently not
   * indexed" to begin with.
   *
   * `.gov` only, asserted at the bottom of this file. A carrier's own page is
   * not a source for what Medicare covers, and linking one on a page that must
   * not imply carrier endorsement is a compliance problem as well as a sourcing
   * one.
   */
  sources: { label: string; url: string }[];
  primary?: boolean;
  /**
   * Optional <title> override (≤60 chars, asserted below). Defaults to
   * "Medicare Help in {label}". Used where the search people actually type is
   * "Medicare agent {place}" rather than the generic wording.
   */
  seoTitle?: string;
  /**
   * Optional booking topic. 't65' sends the hero's booking button to
   * `/book/?topic=t65`, which relabels the picker and tags the booking as a
   * Turning-65 planning call. Set it only where the copy makes the T65 case.
   */
  bookTopic?: 't65';
  /**
   * Non-government pages behind LOCAL facts on this page — a hospital's own
   * page for its address and programs, a community association's own site for
   * its rec centers. Kept separate from `sources`, which stay .gov/.mil-only
   * because they back Medicare RULES. Rendered under their own heading so a
   * reader can tell the two kinds of citation apart. https only.
   */
  localSources?: { label: string; url: string }[];
  /**
   * Neighboring pages to point at instead of restating them. Rendered as a
   * short "next door" list under the local copy. Slugs must exist (asserted).
   */
  seeAlso?: { slug: string; note: string }[];
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
      'Anthem sits at the north end of Maricopa County along I-17, split between the gated Country Club side and Parkside. It is far enough up the corridor to feel separate from Phoenix and close enough that the city is where most serious medical care actually happens — which is the tension underneath nearly every coverage decision made here.',
      'A large share of the community is at or approaching Medicare age, and word travels. Most of my referrals start as a conversation at Anthem Community Park or across a fence rather than as a form on a website, which has a useful side effect: people arrive already knowing what their neighbor was told. That is worth something, but it is also how a plan that suited one household gets adopted by three more it does not fit. Doctors, prescriptions and travel differ house to house even on the same street.',
      'Most Anthem residents drive down to Deer Valley or north Phoenix for specialist care, and that makes provider networks the deciding factor in almost every comparison here rather than a detail to check afterward. A plan that reads well on premium and benefits is worth nothing if the cardiologist you have seen for eight years sits outside it. Worth knowing too: a hospital being in network does not mean the physician groups practicing inside it are, since anesthesiology, radiology and hospitalist groups contract separately.',
      'ZIP 85086 covers both Anthem and a good stretch of the surrounding desert, including much of Desert Hills and part of New River. Plan availability is set at the county level, so the menu is the same across it — but the ZIP is what a quote pulls from, and households a few miles south in a different ZIP can genuinely be offered a different line-up. Price your own rather than borrowing the answer somebody down the road was given.',
      'Anthem is a master-planned community, which has a practical consequence most people do not think about until enrollment season: a very large number of households here arrived from somewhere else within the last fifteen years, and a good share of them are still carrying a plan decision made under another state\'s rules. A Supplement bought in a state with its own birthday or open-enrollment rule does not carry those rights to Arizona, and an Advantage plan bought elsewhere had a network drawn around a different city entirely.',
      'Because the office is here, an Anthem review can be genuinely unhurried — there is no drive to build around it on either side. That matters more than it sounds like it should. The reviews that catch an expensive problem are the ones where somebody brought the actual pill bottles and the actual insurance cards instead of trying to remember what they were.',
    ],
    faqs: [
      {
        q: 'Where do you meet Anthem clients?',
        a: 'Wherever you like. The office is here in 85086, so in-person is easy — but plenty of Anthem clients would rather I come to the kitchen table, and plenty more prefer to do the whole thing by phone or video. The comparison work is identical either way; only the setting changes.',
      },
      {
        q: 'I moved to Anthem from another state and kept my old plan. Is that a problem?',
        a: 'Often, yes, and it is the single most common thing I find here. A Medicare Advantage plan\'s network was drawn around where you used to live, so it may cover almost nothing in Maricopa County. A Medicare Supplement travels with you and generally does not have that problem — but the rules that let you switch Supplements without health questions vary by state, and Arizona does not have the birthday rule some states do. Moving out of a plan\'s service area creates a Special Enrollment Period, which is the window that matters, and it does not stay open indefinitely.',
      },
      {
        q: 'My doctors are all down in Deer Valley. Does that limit my options?',
        a: 'It focuses them rather than limiting them. Most Anthem residents drive south for specialist care, so the question is never "does this plan work in Anthem" — it is "does this plan hold the specific Deer Valley and north Phoenix practices you already use." That is a list I check name by name before recommending anything, because a plan can carry a hospital and still not carry the physician group practicing inside it.',
      },
      {
        q: 'Do you charge Anthem residents for a review?',
        a: 'No, and there is no version of this where you pay me. Carriers pay licensed agents a commission set by CMS, and it is identical whether you enroll through me, through a television call center or directly with the carrier. Your premium does not change. The only thing that changes is whether somebody local checked your doctors and your prescriptions first.',
      },
    ],
    sources: [
      { label: 'Moving and Medicare — Special Enrollment Periods', url: 'https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-does-medicare-coverage-start' },
      { label: 'Medigap: when you can buy without health questions', url: 'https://www.medicare.gov/health-drug-plans/medigap/ready-to-buy' },
      { label: 'Find & compare plans by ZIP', url: 'https://www.medicare.gov/plan-compare/' },
    ],
    reviewed: '2026-08-18',
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
      'Retired Luke Air Force Base families are a real part of this market, and TRICARE For Life changes the math completely — an Advantage plan is usually the wrong answer for that household, and it is worth ten minutes to establish which situation you are in before anyone looks at a plan. TRICARE For Life sits behind Original Medicare and pays much of what Medicare leaves, but it requires you to keep Part B active — and layering an Advantage plan on top generally buys a network restriction you did not have while paying for benefits you already hold.',
      'Glendale sits on the Sun City and Peoria borders, so it is entirely normal to live in one ZIP, see a specialist in another and use a pharmacy in a third. Networks are drawn around hospital systems rather than city limits, which means the city line on a map tells you almost nothing about what a plan will cover. It also means the west Valley is one of the easier places to assume a plan works because it "covers Glendale" and discover the practice you use sits on the far side of a boundary you did not know existed.',
      'Part D is where Glendale households lose money quietly, and it is worth separating from the medical plan entirely. Drug plans use preferred pharmacies, and the same prescription filled at a preferred chain versus a non-preferred one down the street can differ by a meaningful amount every month. A plan can also drop a drug from its formulary or move it to a higher tier in January without the premium moving at all — which is why a stable premium is not evidence that nothing changed. Bring the actual bottles, not a remembered list; the dose and the manufacturer both matter to the pricing.',
    ],
    faqs: [
      {
        q: 'Does my plan need to cover Banner Thunderbird or Abrazo Arrowhead?',
        a: 'It needs to cover whichever one you actually use, and they are not carried identically by every Advantage plan in Maricopa County. This decides more Glendale comparisons than premium does. It is also worth knowing that a hospital being in network does not guarantee the physician groups practicing inside it are — anesthesiology, radiology and hospitalist groups contract separately. I check the hospital and the doctors as two different questions.',
      },
      {
        q: 'I am retired military near Luke Air Force Base. Do I need Medicare Advantage?',
        a: 'Almost certainly not, and this is the most expensive mistake I see in west Glendale. If you have TRICARE For Life, it works as a wraparound behind Original Medicare and is genuinely excellent coverage — but it requires you to keep Part B, and enrolling in a Medicare Advantage plan on top of it usually buys you a network restriction you did not have and pays for benefits you already hold. Ten minutes establishing which situation you are in should come before anyone shows you a plan.',
      },
      {
        q: 'My part of Glendale is nothing like Arrowhead. Does that change the advice?',
        a: 'It changes the starting point. North of Bell Road in 85308 and 85310 the conversation is usually somebody enrolling for themselves and weighing Arrowhead-area specialists. Around the 85301 core and Catlin Court it is far more often an adult child helping a parent through it, sometimes on a timeline driven by a hospital discharge. Those need different paperwork and a different pace, and the second one has deadlines that are easy to miss.',
      },
      {
        q: 'Do you come out to Glendale, or do I drive to Anthem?',
        a: 'I come to you. It is about thirty minutes from the Anthem office down I-17 to the 101, and I would rather make that drive than have you make it. Phone and video work equally well if that is simpler — several Glendale clients have never met me in person and have had their plans reviewed every year regardless.',
      },
    ],
    sources: [
      { label: 'TRICARE For Life and Medicare', url: 'https://tricare.mil/Plans/HealthPlans/TFL' },
      { label: 'Medicare alongside other coverage you already have', url: 'https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage' },
      { label: 'Part D: pharmacy networks and drug costs', url: 'https://www.medicare.gov/drug-coverage-part-d/costs-for-medicare-drug-coverage' },
    ],
    reviewed: '2026-08-18',
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
      'That north–south split matters because provider access does too. North Peoria residents drive to Arrowhead or into Sun City for most specialist care, which puts the deciding weight on how far a plan network actually reaches rather than on what it advertises. Sun City in particular has a concentration of practices built around Medicare patients, and a great many north Peoria households end up receiving care there regardless of which side of the city line they sleep on — so a plan needs to be judged against where you actually go, not against the town on your mailing address.',
      'A large share of the 55-plus communities here — Westbrook Village, Trilogy at Vistancia — hold seasonal residents who spend part of the year out of state. When somebody is gone four months a year, a Medicare Supplement often ends up fitting better than a network-based plan, and that is a conversation worth having before January rather than after.',
      'ZIPs on the Peoria–Glendale–Sun City seam sit close enough together that neighbors a mile apart can be offered different plan line-ups. It is worth pricing your own ZIP rather than borrowing a friend’s answer, particularly in a city where so many people compare notes inside the same community association.',
      'North Peoria is still building, and coverage decisions made on the assumption that the medical offices nearby will stay nearby tend to age badly in a fast-growing corridor. New practices open, existing ones get absorbed into larger groups, and a group changing ownership can change which plans it accepts for reasons that have nothing to do with you. This is an argument for reviewing annually rather than for picking any particular plan — the right answer in 85383 in 2023 is not automatically the right answer now, and the only way to know is to check.',
    ],
    faqs: [
      {
        q: 'I am in Vistancia or Trilogy and I am away part of the year. Advantage or Supplement?',
        a: 'That seasonal split usually points toward a Medicare Supplement, and it is the most common reason I recommend one in north Peoria. A Supplement pairs with Original Medicare and works with any provider in the country who accepts Medicare, so four months in another state is a non-event. Most Advantage plans build their network around Maricopa County and cover you elsewhere only for emergencies and urgent care — which is fine until routine care is what you need. The decision is worth making before January rather than after, because the rights to move into a Supplement without health questions are time-limited.',
      },
      {
        q: 'Is Medicare different at the north and south ends of Peoria?',
        a: 'The plans available are set by county, so the menu is the same. What differs is which plan on that menu fits. In 85383 and the Vistancia corridor I see a lot of recent arrivals still carrying an out-of-state plan and driving to Arrowhead or Sun City for specialists, so network reach decides it. In 85345 and Westbrook Village I more often see households who have used the same physician for twenty years and simply need that relationship protected. Same list, different answer.',
      },
      {
        q: 'My neighbor got a different set of plans than I did. Why?',
        a: 'Almost always the ZIP. Plan availability is set at the county level, but the ZIP determines which county record your quote pulls, and the Peoria–Glendale–Sun City seam is stitched tightly enough that two houses a mile apart can land differently. It can also be timing — a plan available during your Initial Enrollment may not be open to you outside a valid election period. Either way, price your own ZIP; borrowing a friend\'s answer is how people end up disappointed at the pharmacy counter.',
      },
      {
        q: 'How far is the drive if I want to meet in person?',
        a: 'You do not need to make it. North Peoria is about twenty-five minutes from the Anthem office out the Carefree Highway and down Lake Pleasant Parkway, and I would rather come to you. If the south end of the city is easier, that works too — and if a phone or video review suits you better, the comparison is exactly the same.',
      },
    ],
    sources: [
      { label: 'Medigap basics: how it works with Original Medicare', url: 'https://www.medicare.gov/health-drug-plans/medigap/basics' },
      { label: 'Medicare Advantage plans and their networks', url: 'https://www.medicare.gov/health-drug-plans/health-plans' },
      { label: 'Find & compare plans by ZIP', url: 'https://www.medicare.gov/plan-compare/' },
    ],
    reviewed: '2026-08-18',
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
      'The 85086 side of north Phoenix runs south from Anthem down the I-17 corridor toward Norterra and Deer Valley. It shares a ZIP with Anthem, which has a specific and useful consequence: the plan menu is identical. Anything available to an Anthem resident is available here. What is not identical is the drive, and the drive is what decides whether a network actually works for you.',
      'Provider access is the real difference, and it runs in your favor. HonorHealth Deer Valley and the medical offices around Norterra and Happy Valley put a large number of practices within a short drive, which means more Advantage networks are genuinely usable here than in the communities twenty minutes further north. More plans clear the "can I actually get to my doctor" bar.',
      'More options is not automatically better, and this is where people in 85086 get talked into something. A wider field means more plans look reasonable on a comparison sheet, and the differences move from geography to the fine print — formulary tiers, prior authorization requirements, whether a specific specialist group is contracted this year. The comparison has to run against your actual doctor list and your actual prescriptions, because at this point the brochure has stopped being able to tell you anything useful.',
      'This part of north Phoenix has been absorbing growth for years, and a lot of households here are still relatively new arrivals. That produces two recurring situations: somebody carrying a plan whose network was drawn around a different state entirely, and somebody who enrolled correctly three years ago and has not looked since. Networks, formularies and premiums all reset every January, and the plan that fit at enrollment is not guaranteed to be the plan you have now.',
      'Because you are close to the Anthem office, this is one of the easier places to do an unhurried in-person review — and the reviews that catch something expensive are almost always the unhurried ones. Bring the insurance cards and the actual pill bottles rather than a remembered list. Dose and manufacturer both affect what a drug plan charges you, and neither is something people recall accurately.',
    ],
    faqs: [
      {
        q: 'I am in 85086 but not in Anthem. Do I get the same plans?',
        a: 'Yes. Medicare plan availability is set by county, and the quote pulls from your ZIP — you are in the same 85086 and the same Maricopa County, so the menu is identical to what an Anthem resident sees. The difference is not which plans you can buy, it is which of them make sense given where you actually drive for care.',
      },
      {
        q: 'Does being near HonorHealth Deer Valley give me more choices?',
        a: 'In practice, yes. A plan network is only worth what you can reach, and the concentration of practices around Deer Valley, Norterra and Happy Valley means more Advantage networks are genuinely usable from here than from communities further up I-17. That widens the field — which makes the comparison harder rather than easier, because the deciding factors move from distance to formulary tiers and prior authorization rules.',
      },
      {
        q: 'I just moved to north Phoenix. What should I do first?',
        a: 'Establish whether your current plan still works here before anything else. If it is a Medicare Advantage plan from another state, its network was built around a different city and may cover very little in Maricopa County. Moving out of a plan\'s service area opens a Special Enrollment Period, which is a limited window and the cleanest way to fix this — so it is worth doing early rather than waiting for the fall. A Medicare Supplement generally travels without that problem, but the rules for switching Supplements without health questions differ by state and Arizona does not have the birthday rule some states do.',
      },
      {
        q: 'How quickly can you get to me?',
        a: 'Quickly — it is a short run south down I-17 from the office, and I would rather drive than have you come up. In-person, phone or video all work, and the comparison is identical in each. If it is easier to meet somewhere near Norterra or Happy Valley than at your house, that is fine too.',
      },
    ],
    sources: [
      { label: 'Plan availability is set where you live', url: 'https://www.medicare.gov/plan-compare/' },
      { label: 'Joining a plan, and when you are allowed to', url: 'https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/joining-a-plan' },
      { label: 'Medigap: when you can buy without health questions', url: 'https://www.medicare.gov/health-drug-plans/medigap/ready-to-buy' },
    ],
    reviewed: '2026-08-18',
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
    faqs: [
      {
        q: 'I want to keep my doctor. How do I know a plan holds them?',
        a: 'We check, name by name, before anything else — and we check it for the coming plan year rather than the current one, because a practice can be contracted in one year and out the next without anyone writing to tell you. This is the fact that decides most Scottsdale comparisons. Bring the actual list of physicians you intend to keep, including specialists you see once a year, since those are the ones people forget until they need the appointment.',
      },
      {
        q: 'I pay for a concierge or direct primary care membership. How does Medicare interact with it?',
        a: 'The membership fee sits outside Medicare entirely — neither Original Medicare, nor an Advantage plan, nor a Supplement pays any part of it, and no plan you buy will change that. The question that actually matters is whether the physician still bills Medicare for the covered services underneath the membership. Some do, and Medicare works normally for those visits. Some have formally opted out of Medicare, and in that case Medicare pays nothing toward their care at all, whatever coverage you hold. It is worth one phone call to the practice to establish which, and worth making that call before enrollment season rather than after.',
      },
      {
        q: 'My income is high enough that I keep hearing about IRMAA. What is it?',
        a: 'It is an income-related surcharge added to your Part B and Part D premiums, and it is a live issue across most of Scottsdale rather than a footnote. It is calculated from a tax return two years old, so a business sale, a Roth conversion, an unusually large required distribution or a spouse\'s death can raise your premium on the basis of a year that no longer describes you. If the change came from a qualifying life-changing event, you can appeal with Form SSA-44 and have it recalculated against current income. The tax strategy belongs with your CPA — the filing and the timing I can walk you through.',
      },
      {
        q: 'Scottsdale is a big city. Does my part of it matter?',
        a: 'It affects the answer more than people expect. South of the 101, in the older and denser part of the city, most households have long-standing relationships with nearby practices and the plan simply has to protect them. In central Scottsdale — 85258, 85259, 85260 — a lot of my work comes through 55-plus community associations, and the comparison tends to hinge on specific specialist groups. North of the 101 in 85262 and 85266 the houses are further apart and the drive to a specialist is longer, which pushes network reach ahead of everything a plan advertises.',
      },
    ],
    sources: [
      { label: 'Using doctors and providers with Original Medicare', url: 'https://www.medicare.gov/providers-services/original-medicare' },
      { label: 'IRMAA: Part B and Part D income-related premiums', url: 'https://www.ssa.gov/benefits/medicare/medicare-premiums.html' },
      { label: 'Form SSA-44 — life-changing event appeal', url: 'https://www.ssa.gov/forms/ssa-44.pdf' },
    ],
    reviewed: '2026-08-18',
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
      'Carefree and neighboring Cave Creek skew older and higher-income than most of the north Valley, and that combination puts two subjects on the table in nearly every conversation here: IRMAA surcharges and long-term care planning. Neither is really a plan-selection question, which is why both get skipped by anyone selling from a call center, and both cost considerably more than picking the wrong Advantage plan would.',
      'IRMAA is the one that catches people off guard. The surcharge added to your Part B and Part D premiums is calculated from a tax return two years old, so a property sale, a Roth conversion, an unusually large required distribution or the death of a spouse can raise your premium for reasons that have nothing to do with your income this year. There is a formal appeal for that — Form SSA-44, filed on a life-changing event — and a great many people who qualify never file it because nobody told them it exists.',
      'Plenty of Carefree households split the year between here and somewhere cooler, and that single fact usually points the comparison toward a Medicare Supplement rather than a network-based plan. A Supplement pairs with Original Medicare and works with any provider nationwide who accepts Medicare, so four or five months away is a non-event. Most Advantage plans build their network around Maricopa County and cover you elsewhere for emergencies and urgent care only — fine right up until routine care is what you need in July.',
      'There is very little medical infrastructure inside the town limits, and that is a real planning input rather than a complaint. Specialist care generally means driving to Scottsdale or north Phoenix, so network breadth and reach matter far more here than the dental or fitness extras a plan advertises. A plan with a rich benefits list and a network that stops short of the practice you use is not a bargain.',
      'Long-term care is the conversation this community actually needs and most rarely gets. Medicare does not pay for custodial care — help with bathing, dressing, meals, the things that make staying at home possible — and it covers a skilled nursing stay only under narrow conditions and only for a limited period. In a market where staying in the house is usually the whole point, that gap is worth planning around deliberately, well before anybody needs it, when there are still options other than paying out of pocket.',
    ],
    faqs: [
      {
        q: 'My Part B premium jumped and my income did not. Why?',
        a: 'That is IRMAA, and it is common in Carefree and Cave Creek. The surcharge is set from your tax return two years prior, so a property sale, a Roth conversion, a large required minimum distribution or the loss of a spouse can raise this year\'s premium on the strength of a year that no longer reflects your situation. If a qualifying life-changing event caused it, you can appeal using Form SSA-44 and have the determination redone against current income. Plenty of people who qualify never file it. The tax planning belongs with your CPA; getting the form and the timing right is something I can walk you through.',
      },
      {
        q: 'We are only in Arizona part of the year. Which way should we lean?',
        a: 'Usually toward a Medicare Supplement. It works with any provider in the country who accepts Medicare, so spending several months elsewhere changes nothing about your coverage. Most Advantage plans are built around a Maricopa County network and will cover you out of area for emergencies and urgent care but not for routine care. The important detail is timing: the right to buy a Supplement without answering health questions is limited to specific windows, and outside them a carrier can decline you. That makes this a decision to get right early rather than to revisit after a problem.',
      },
      {
        q: 'Will Medicare pay for in-home care or assisted living?',
        a: 'No, and this is the most expensive misunderstanding I encounter in this market. Medicare does not cover custodial care — help with bathing, dressing, meals and the ordinary business of staying in your own home — and it pays for a skilled nursing facility only after a qualifying hospital stay, only while you are actively improving, and only for a limited number of days. Assisted living is not covered at all. That leaves a gap most Carefree households can technically self-fund and would rather not, which is why planning for it deliberately is worth doing while you still have choices.',
      },
      {
        q: 'There are no specialists in town. Does that limit which plans work?',
        a: 'It makes network reach the deciding factor. Nearly everyone here drives to Scottsdale or north Phoenix for specialist care, so the question is whether a plan holds those specific practices — not whether it operates in 85377. This is also why the advertised extras are a poor way to choose: a plan can lead with dental and a fitness membership and still not carry the cardiologist you have seen for a decade.',
      },
    ],
    sources: [
      { label: 'IRMAA: how the income-related premium is set', url: 'https://www.ssa.gov/benefits/medicare/medicare-premiums.html' },
      { label: 'Form SSA-44 — life-changing event appeal', url: 'https://www.ssa.gov/forms/ssa-44.pdf' },
      { label: 'What Medicare does not cover: long-term/custodial care', url: 'https://www.medicare.gov/coverage/long-term-care' },
      { label: 'Skilled nursing facility care — the limits', url: 'https://www.medicare.gov/coverage/skilled-nursing-facility-snf-care' },
    ],
    reviewed: '2026-08-18',
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
      'New River and Desert Hills are more spread out and considerably more rural than Anthem — well water, dirt roads, acreage, and a long drive to anything. People choose this on purpose, and the coverage conversation ought to respect that rather than quietly assume everyone lives ten minutes from a hospital.',
      'That distance changes the calculus more than any other single factor. A plan with a thin local network looks perfectly reasonable on a comparison sheet and becomes a genuine problem when the nearest in-network specialist is forty minutes down I-17. Out here the right question is not which plan has the best benefits, it is which plan holds providers you can actually reach on a day you feel unwell — and how far the nearest in-network urgent care and emergency department are, because that is the trip you cannot plan around.',
      'A lot of households here are self-employed, ranching, contracting or otherwise never had employer coverage, which means Medicare is the first real insurance decision they have made in decades. There is no HR department to ask and no group plan rolling over automatically. It also means the Part B enrollment timing is entirely on you: miss the window without qualifying coverage in place and the late enrollment penalty is permanent, added to your premium for as long as you have Part B.',
      'Because the drive is long, the pharmacy question deserves more weight here than it usually gets. Part D plans price the same prescription differently depending on whether the pharmacy is preferred, and most plans will let you fill ninety days by mail instead of thirty at a counter. For somebody making a real trip to pick up medication, mail order is often both cheaper and dramatically less annoying — but it has to be set up deliberately, and the plan has to be one that supports it well.',
      'Anthem is the practical service hub for most of New River and Desert Hills, and that makes meeting easy: it is the same trip you already make for groceries. A good share of the area also shares ZIP 85086 with Anthem outright, so the plan menu is frequently identical — what differs is which of those plans survives the drive test.',
    ],
    faqs: [
      {
        q: 'I live well outside town. Will a Medicare Advantage plan actually work out here?',
        a: 'Some will and some will not, and the difference is worth taking seriously. Advantage plans work through a network, and a network that looks broad across Maricopa County can still leave you with a forty-minute drive to the nearest participating specialist. Before recommending one I check where its providers actually sit relative to your address — including urgent care and the nearest in-network emergency department, since that is the trip nobody schedules. If the answer is poor, a Medicare Supplement paired with Original Medicare removes the network question entirely, because it works with any provider who accepts Medicare.',
      },
      {
        q: 'I have never had employer coverage. When do I have to sign up?',
        a: 'Your Initial Enrollment Period runs seven months — the three months before the month you turn 65, that month, and the three months after. Without qualifying coverage from a current employer, that is your window, and there is no group plan behind you to fall back on. Miss it and the Part B late enrollment penalty is permanent: it adds to your premium for as long as you hold Part B, not for a year. Part D carries its own separate penalty on the same principle. This is the one deadline out here I push people hard on, because it is the only mistake in Medicare that never stops costing money.',
      },
      {
        q: 'Getting to a pharmacy is a real trip. Can that be made easier?',
        a: 'Yes, and it is usually worth building the drug plan around. Most Part D plans cover a ninety-day supply by mail, which turns four pharmacy runs into one delivery, and plans also charge different amounts at preferred versus non-preferred pharmacies for the identical prescription. For a household in Desert Hills or off New River Road, mail order is frequently both cheaper and far less trouble — but the plan has to support it properly and it has to be set up on purpose. Bring the actual bottles when we look; dose and manufacturer both change the price.',
      },
      {
        q: 'Do I have to come to you?',
        a: 'No. New River and Desert Hills sit immediately north and west of Anthem and a good part of the area shares my ZIP, so I am close. Most people find it easiest to meet in Anthem since they are already coming in, but I am happy to drive out, and phone or video works just as well if the trip is not convenient.',
      },
    ],
    sources: [
      { label: 'Part B late enrollment penalty', url: 'https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties' },
      { label: 'When to sign up: your Initial Enrollment Period', url: 'https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-does-medicare-coverage-start' },
      { label: 'Part D costs and mail-order pharmacy', url: 'https://www.medicare.gov/drug-coverage-part-d/costs-for-medicare-drug-coverage' },
    ],
    reviewed: '2026-08-18',
    proximity: 'Immediately north and west of Anthem — often the same ZIP, always the same advisor.',
  },
  /*
   * ── Retirement communities (added 2026-11-04) ─────────────────────────────
   * Every Maricopa ZIP gets the same CMS plan list, so these two pages are
   * built on what is NOT shared: the hospital each community sits around, its
   * Census age and household profile, and — for Sun City West — the federal
   * six-month rule that collides with a long summer away. Every figure below
   * was read off the cited page on 2026-11-04 (Census QuickFacts, Banner's own
   * hospital pages, the two recreation-center associations). Peoria and
   * Glendale are linked via `seeAlso` rather than restated.
   */
  {
    slug: 'sun-city-az',
    city: 'Sun City',
    label: 'Sun City, AZ',
    zips: ['85351', '85373'],
    county: 'Maricopa County',
    seoTitle: 'Medicare Agent in Sun City, AZ 85351',
    bookTopic: 't65',
    summary:
      'Medicare help for Sun City, AZ — plans checked against Banner Boswell and the specialists who practice around it, with phone reviews a son or daughter can join from anywhere.',
    seoDescription:
      'Medicare agent for Sun City, AZ 85351 and 85373 — Advantage, Supplement and Part D checked against Banner Boswell and your own doctors. Phone or in person.',
    local: [
      'Sun City is not technically a city. The Census Bureau counts it as an unincorporated census-designated place: 39,931 people at the 2020 count, and 74.7% of residents aged 65 or older. The Recreation Centers of Sun City, which calls itself the original 55+ adult community, reports more than 33,000 members, eight recreation centers, eight golf courses and 124 chartered clubs. With no city hall, those rec centers and clubs are where Sun City trades information about everything, Medicare plans included.',
      'The medical anchor is Banner Boswell Medical Center at 10401 W. Thunderbird Blvd., on the same boulevard as the rec-center association\'s own office. Banner says Boswell has served the northwest Valley since 1970 and describes it as a destination medical center specializing in the diseases of the elderly. It lists a heart center, Joint Commission certification as a primary stroke center, and a deep brain stimulation program for Parkinson\'s disease and essential tremor that it says is one of three in the Valley. A large share of Sun City\'s cardiology, neurology and orthopedic care happens on or near that campus, so Boswell, and the physicians who work out of it, is the first test any plan here has to pass.',
      'That is where the HMO-versus-PPO choice stops being abstract. Medicare.gov describes an HMO as generally requiring you to use the plan\'s network except for emergencies, urgent care and out-of-area dialysis; most HMOs also have you pick a primary care doctor and get a referral before seeing a specialist. A PPO lets you go out of network for covered services and pay more for it. For a Sun City resident whose cardiologist and neurologist both admit at Boswell, the useful question is narrow: is each of those named physicians in this plan\'s network for the coming year, and in an HMO, will the primary care doctor you choose refer into that group? If the answer for either specialist is no, a PPO, or Original Medicare with a Supplement, earns a serious look whatever the premium difference.',
      'The household numbers say something too. Census estimates put Sun City at 22,718 households averaging 1.63 people, which means a great many single-person homes, and a lot of Medicare help here comes from a son or daughter in another state. 1-800-MEDICARE will not discuss your record with that person until you authorize it in writing on Form CMS-10106, which can be filed through your Medicare.gov account. I am glad to run a review by phone with your family member on the line from wherever they live; it tends to settle questions that would otherwise take three separate calls.',
      'Census also counts 6,029 veterans in Sun City. VA care and Medicare do not coordinate the way two insurance plans do: the VA says plainly that it does not bill Medicare, and it still encourages enrolled veterans to sign up for Medicare so they are covered at non-VA hospitals and doctors. A veteran who sees the VA for some things and a Boswell specialist for others needs Medicare built for the non-VA half, which is a different design problem from the TRICARE For Life households the Glendale page covers.',
      'Not everyone here is retired yet. A quarter of Sun City residents are under 65, many of them people who bought in at 55 and will reach Medicare at an address where the neighbors have had it for twenty years. Your Initial Enrollment Period is seven months long, centered on your 65th birthday month, and your Medigap Open Enrollment Period is the six months starting when Part B begins at 65 or older. It is the one stretch when a Supplement company cannot turn you down or charge more for your health history. A neighbor\'s plan is a reasonable place to start that conversation and a poor place to finish it.',
    ],
    faqs: [
      {
        q: 'Do Medicare Advantage plans in Sun City include Banner Boswell?',
        a: 'Some do and some do not, and the answer can change from one plan year to the next. Every plan sold in Sun City is drawn from the same Maricopa County list, so the question is never which plans exist here; it is which of them contract with Boswell and with the specific physicians you see there. I check the hospital and each of your doctors by name for the coming year before suggesting anything, and you can confirm them yourself in the plan\'s directory or by calling the plan.',
      },
      {
        q: 'My daughter helps with my Medicare from out of state. Can she join the appointment?',
        a: 'Yes, and it usually helps. Sun City reviews are usually done by phone, so she can be on the line from wherever she is. Separately, if you want her to be able to call 1-800-MEDICARE about your record on her own, you need to authorize that in writing with Form CMS-10106, either online through your Medicare.gov account or by mail. It takes a few minutes and saves a lot of frustration later.',
      },
      {
        q: 'I get some care at the VA. Do I still need Medicare Part B?',
        a: 'The VA itself recommends signing up for Medicare when you are eligible. It does not bill Medicare, so Medicare is what covers you at a non-VA hospital such as Boswell, and if you skip Part B and need it later you can face a late-enrollment penalty for as long as you have Part B. Which Medicare setup fits depends on how much of your care is VA and how much is local, and that split is what we would go through on a call.',
      },
      {
        q: 'I moved to Sun City at 58 and turn 65 next year. When should I start?',
        a: 'About three months before your birthday month, when your seven-month Initial Enrollment Period opens. If a Medicare Supplement is a possibility, the six months after your Part B start date matter most, because that is your one-time Medigap Open Enrollment Period, when insurers cannot use your health history against you. A planning call before that window opens is the most useful hour you can spend on this; the booking link on this page is set up for exactly that conversation.',
      },
      {
        q: 'Is Medicare in Sun City any different from Peoria or Glendale?',
        a: 'No. Medicare plan availability is set by county, and Sun City, Peoria and Glendale all sit inside Maricopa County, so the plan list is the same. What differs from one household to the next is which doctors you use, which pharmacy you fill at and how much of the year you are actually here. Those are the details a review in 85351 or 85373 turns on.',
      },
    ],
    sources: [
      { label: 'Census QuickFacts: Sun City and Sun City West, Arizona', url: 'https://www.census.gov/quickfacts/fact/table/suncitycdparizona,suncitywestcdparizona/PST045224' },
      { label: 'How Medicare HMO plans use networks and referrals', url: 'https://www.medicare.gov/health-drug-plans/health-plans/your-health-plan-options/HMO' },
      { label: 'Form CMS-10106: letting 1-800-MEDICARE talk to a family member', url: 'https://www.cms.gov/cms10106-authorization-disclose-personal-health-information' },
      { label: 'VA health care and Medicare or other insurance', url: 'https://www.va.gov/resources/va-health-care-and-other-insurance/' },
      { label: 'Your Medigap Open Enrollment Period', url: 'https://www.medicare.gov/health-drug-plans/medigap/ready-to-buy' },
    ],
    localSources: [
      { label: 'Banner Boswell Medical Center (Banner Health)', url: 'https://www.bannerhealth.com/locations/sun-city/banner-boswell-medical-center' },
      { label: 'Recreation Centers of Sun City', url: 'https://www.suncityaz.org/' },
    ],
    seeAlso: [
      { slug: 'peoria-az', note: 'Peoria wraps around Sun City on three sides; its page covers Westbrook Village and the north Peoria corridor.' },
      { slug: 'glendale-az', note: 'Just south and east, including the Arrowhead hospitals and TRICARE For Life for Luke AFB retirees.' },
      { slug: 'sun-city-west-az', note: 'Sun City West, built around Banner Del E. Webb and a more seasonal population.' },
    ],
    reviewed: '2026-11-04',
    proximity:
      'About 29 miles by road from the Anthem office, so most Sun City reviews happen by phone. In person works too, in Anthem or by arrangement.',
  },
  {
    slug: 'sun-city-west-az',
    city: 'Sun City West',
    label: 'Sun City West, AZ',
    zips: ['85375'],
    county: 'Maricopa County',
    seoTitle: 'Medicare Agent in Sun City West, AZ 85375',
    summary:
      'Medicare help for Sun City West: plans weighed against Banner Del E. Webb, and against the months of the year you spend somewhere else.',
    seoDescription:
      'Medicare agent for Sun City West, AZ 85375. Advantage vs. Supplement for part-year residents, checked against Banner Del E. Webb and your doctors.',
    local: [
      'Sun City West is younger than Sun City as a place and older as a population. Census QuickFacts puts 85.0% of residents at 65 or older, against 74.7% in Sun City a few miles east, out of 25,806 people at the 2020 count. The community\'s own history says the Del Webb Corporation built its 16,900 homes between 1978 and 1997, and the Recreation Centers of Sun City West, which describes the community as for active adults 55 and older, runs four recreation centers (Beardsley, Kuentz, Palm Ridge and R.H. Johnson) and seven golf courses.',
      'Banner Del E. Webb Medical Center sits inside the community on W. Meeker Blvd. Banner says it opened in 1988, has 404 licensed beds with room to add 92 more, serves as a BannerAir helicopter base, and lists cardiac care, robotic surgery, orthopedics, women\'s health and stroke care among its programs. For most households here it is simply the hospital; Banner Boswell in Sun City is about seven miles southeast. So the first thing to settle about any plan is how it treats Del Webb and the physicians who admit patients there.',
      'The bigger Sun City West question is the calendar. A lot of households here spend a long summer somewhere cooler, and Medicare Advantage has a hard edge for that. Under the federal rule at 42 CFR 422.74, a Medicare Advantage plan must disenroll a member who has been outside its service area for more than six months. The exception is a plan with a visitor/traveler benefit, which may let you stay enrolled up to the start of the 13th month. Inside those six months, an HMO covers you away from Maricopa County only for emergencies, urgent care and out-of-area dialysis, so a routine specialist visit up north is on you.',
      'That is why Original Medicare with a Medicare Supplement fits so many part-year residents here. Original Medicare lets you use any doctor or hospital that takes Medicare anywhere in the U.S., and a Supplement pays its share of the same claim without a network or a service area. The catch is timing. After your one-time Medigap Open Enrollment Period, an insurer can generally use medical underwriting, so moving from an Advantage plan to a Supplement at 74 is a health-questions conversation, not a form. Medicare does give a 12-month trial right to people who try an Advantage plan for the first time, and that window is worth knowing about before it closes.',
      'The Census income figures run higher here than next door. Per-capita income in Sun City West is nearly 30% above Sun City\'s, and 34.7% of adults hold a bachelor\'s degree or more, against 26.0% in Sun City. In practice that shows up as a different set of questions: whether the Part B and Part D income surcharges (IRMAA) will apply after a large IRA withdrawal or a home sale, whether a Supplement\'s higher premium is the right trade for predictable costs, and how Medicare fits a broader retirement-income plan. I handle the Medicare side, the practice has a retirement-income and Social Security division for that conversation, and the tax questions belong with your tax advisor.',
      'Sun City West is about 31 miles by road from the Anthem office, at the far west end of the area I cover, so reviews here are usually by phone. That suits part-year residents anyway: a fall review can happen from a cabin in Wisconsin as easily as from a kitchen in 85375. The Medicare Open Enrollment Period runs October 15 to December 7, and changes made then start January 1. If you are already in an Advantage plan, there is a second window from January 1 to March 31 to switch plans or go back to Original Medicare.',
    ],
    faqs: [
      {
        q: 'I spend summers out of state. Can my Medicare Advantage plan drop me?',
        a: 'Yes, if you are gone long enough. Federal rules require a Medicare Advantage plan to disenroll a member who has been out of its service area for more than six months, unless the plan offers a visitor/traveler benefit that extends the limit. Even inside six months, an HMO generally covers you out of the area only for emergencies, urgent care and out-of-area dialysis. If your summers run long, ask the plan in writing how it treats your dates, or look at Original Medicare with a Supplement, which has no service area.',
      },
      {
        q: 'Does my plan cover Banner Del E. Webb Medical Center?',
        a: 'That depends on the plan and the year. Every plan offered in 85375 comes from the same Maricopa County list, but which ones contract with Del Webb, and with the physicians who admit there, varies and can change each January. I check the hospital and each of your doctors by name before recommending anything, and the Open Enrollment Period from October 15 to December 7 is the time to do it.',
      },
      {
        q: 'Can I switch from Medicare Advantage to a Supplement at my age?',
        a: 'Often, but it may not be automatic. Outside your one-time Medigap Open Enrollment Period, a Supplement insurer can generally ask health questions and decline or price based on the answers. There are exceptions: if you joined an Advantage plan for the first time within the last 12 months, Medicare gives you a trial right to go back. Before dropping an Advantage plan, find out whether a Supplement will actually accept you, because the order you do things in matters.',
      },
      {
        q: 'Do you meet with clients in Sun City West?',
        a: 'Sun City West reviews are usually done by phone, which works whether you are at home on Meeker Boulevard or away for the summer. The office is in Anthem, about 31 miles by road, and in-person meetings are by arrangement. The comparison itself is the same either way: your doctors, your prescriptions, your pharmacy and how many months a year you are actually here.',
      },
    ],
    sources: [
      { label: '42 CFR 422.74: Medicare Advantage disenrollment, including the six-month absence rule', url: 'https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-422/subpart-B/section-422.74' },
      { label: 'Compare Original Medicare and Medicare Advantage', url: 'https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage' },
      { label: 'How Medigap works, including the trial right', url: 'https://www.medicare.gov/health-drug-plans/medigap/basics/how-medigap-works' },
      { label: 'Joining a plan: Open Enrollment dates', url: 'https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/joining-a-plan' },
      { label: 'Census QuickFacts: Sun City West and Sun City, Arizona', url: 'https://www.census.gov/quickfacts/fact/table/suncitywestcdparizona,suncitycdparizona/PST045224' },
    ],
    localSources: [
      { label: 'Banner Del E. Webb Medical Center (Banner Health)', url: 'https://www.bannerhealth.com/locations/sun-city-west/banner-del-e-webb-medical-center' },
      { label: 'Sun City West community history', url: 'https://suncitywest.com/history/' },
      { label: 'Recreation Centers of Sun City West', url: 'https://suncitywest.com/' },
    ],
    seeAlso: [
      { slug: 'sun-city-az', note: 'Sun City, built around Banner Boswell, with more households still approaching 65.' },
      { slug: 'peoria-az', note: 'Peoria, including Westbrook Village and Trilogy at Vistancia.' },
    ],
    reviewed: '2026-11-04',
    proximity:
      'About 31 miles by road from the Anthem office, at the west end of the area I cover. Phone reviews are the norm here; in person by arrangement.',
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
  if (l.seoTitle && l.seoTitle.length > 60) {
    throw new Error(`locations.ts: ${l.slug} seoTitle is ${l.seoTitle.length} chars (max 60)`);
  }
  for (const { url } of l.localSources ?? []) {
    if (!/^https:\/\//.test(url)) throw new Error(`locations.ts: ${l.slug} localSource ${url} is not https`);
  }
  for (const { slug } of l.seeAlso ?? []) {
    if (slug === l.slug || !locations.some((o) => o.slug === slug)) {
      throw new Error(`locations.ts: ${l.slug} seeAlso points at unknown slug "${slug}"`);
    }
  }
  if (l.seoDescription.length > 155) {
    throw new Error(
      `locations.ts: ${l.slug} seoDescription is ${l.seoDescription.length} chars (max 155)`,
    );
  }
}

/**
 * Fail the BUILD on a city page that is a near-copy of another one.
 *
 * The seoDescription check above exists because a truncated description ships
 * silently. This exists for the same reason and a worse outcome: duplicated city
 * copy renders perfectly, passes every other check, and simply does not get
 * indexed. There is no error state to notice — the page is live, it looks right,
 * and it is invisible. The only signal is a Search Console row weeks later.
 *
 * Two rules, both derived from what actually went wrong on 2026-08-13:
 *
 *   1. No FAQ question or answer may appear on two city pages. When these were
 *      generated from one template they were identical everywhere, and they were
 *      the single largest shared block on the page — emitted twice over, once as
 *      prose and once as FAQPage structured data.
 *
 *   2. No `local` paragraph may be reused, and there must be enough of them to
 *      carry a page. Carefree, New River and North Phoenix each shipped three
 *      one-line paragraphs against Scottsdale's five substantial ones, and
 *      scored 85%, 81% and 85% duplicate against Anthem where Scottsdale scored
 *      56%. Depth is what separated them.
 *
 * The thresholds are floors, not targets. Clearing them is not evidence a page
 * is good — only that it is not obviously a clone.
 */
{
  const seenFaq = new Map<string, string>();
  const seenPara = new Map<string, string>();

  for (const l of locations) {
    if (l.faqs.length < 4) {
      throw new Error(`locations.ts: ${l.slug} has ${l.faqs.length} FAQs (minimum 4)`);
    }
    if (l.local.length < 4) {
      throw new Error(
        `locations.ts: ${l.slug} has ${l.local.length} local paragraphs (minimum 4). ` +
          'A three-line city page is the shape Google declines to index.',
      );
    }

    if (l.sources.length < 2) {
      throw new Error(
        `locations.ts: ${l.slug} has ${l.sources.length} sources (minimum 2). ` +
          'Cite the rules this page actually leans on.',
      );
    }
    for (const { url } of l.sources) {
      // `.gov` and `.mil` both — tricare.mil is the Defense Health Agency's own
      // page on TRICARE For Life, which is the authority for the Glendale copy
      // about retired military households, and there is no .gov equivalent.
      // Nothing else qualifies: a carrier's page is not a source for what
      // Medicare covers, and linking one on a page that must not imply carrier
      // endorsement is a compliance problem as well as a sourcing one.
      if (!/^https:\/\/(www\.)?[a-z0-9.-]+\.(gov|mil)\//.test(url)) {
        throw new Error(`locations.ts: ${l.slug} source ${url} is not an https .gov/.mil URL`);
      }
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(l.reviewed)) {
      throw new Error(`locations.ts: ${l.slug} reviewed "${l.reviewed}" is not YYYY-MM-DD`);
    }
    // A future review date is the specific failure worth blocking: it is what a
    // date bumped to look fresh looks like, and it makes `dateModified` a claim
    // the page cannot support.
    if (l.reviewed > new Date().toISOString().slice(0, 10)) {
      throw new Error(`locations.ts: ${l.slug} reviewed ${l.reviewed} is in the future`);
    }

    const words = l.local.join(' ').split(/\s+/).filter(Boolean).length;
    if (words < 350) {
      throw new Error(
        `locations.ts: ${l.slug} has ${words} words of local detail (minimum 350). ` +
          'The page template supplies the rest; this is the part that is actually about the city.',
      );
    }

    for (const { q, a } of l.faqs) {
      for (const [kind, text] of [['question', q], ['answer', a]] as const) {
        const key = text.trim().toLowerCase();
        const owner = seenFaq.get(key);
        if (owner) {
          throw new Error(
            `locations.ts: ${l.slug} reuses a FAQ ${kind} from ${owner}. ` +
              'Write one a resident of this town would actually ask.',
          );
        }
        seenFaq.set(key, l.slug);
      }
    }

    for (const para of l.local) {
      const key = para.trim().toLowerCase();
      const owner = seenPara.get(key);
      if (owner) {
        throw new Error(`locations.ts: ${l.slug} reuses a local paragraph from ${owner}.`);
      }
      seenPara.set(key, l.slug);
    }
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
