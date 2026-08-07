/**
 * Site-wide FAQs. Rendered on the home page and emitted as FAQPage schema there.
 * Product-specific questions live on each product page instead (see products.ts).
 */

export interface Faq {
  q: string;
  a: string;
}

export const homeFaqs: Faq[] = [
  {
    q: 'What does it cost to work with you?',
    a: 'Nothing. There is no fee to you at any point. Insurance carriers pay a set commission to licensed agents, and that amount is the same whether you enroll through me, through a call center, or directly with the carrier. Your premium does not go up for having help.',
  },
  {
    /**
     * The old answer here was simply wrong — it said "Yes", and listed four
     * product lines. The practice is wider than that. Keep this list and the
     * one in src/data/products.ts describing the same business; if a product
     * line is added or dropped, both change together.
     */
    q: 'Do you only sell Medicare?',
    a: "Medicare is the core of the practice — Advantage, Supplement, and Part D. Around it sits the coverage that fills Medicare's real gaps: long-term care (traditional and limited-pay), dental-vision-hearing, cancer–heart attack–stroke plans, hospital indemnity, short-term home health care, and final expense. There is also a retirement income and Social Security planning division for households with $250,000 or more in investable assets. One practice, built around what actually happens after 65.",
  },
  {
    q: 'When can I actually make a change to my Medicare coverage?',
    a: 'The main windows are your Initial Enrollment Period around your 65th birthday, the Annual Enrollment Period from October 15 to December 7 each year, the Medicare Advantage Open Enrollment Period from January 1 to March 31, and Special Enrollment Periods triggered by life events like moving or losing employer coverage. Our Enrollment Window Checker will pin down your exact dates.',
  },
  {
    q: 'I already have a plan. Is it worth reviewing?',
    a: 'Almost always, yes. Formularies, premiums, networks and extra benefits all reset every January. The most expensive mistake I see is a plan that was an excellent fit three years ago and quietly stopped being one. A review takes about twenty minutes and costs nothing.',
  },
  {
    q: 'Do we have to meet in person?',
    a: 'Your choice. The office is in Anthem, and I meet face to face there and across the rest of the Valley — Desert Hills, New River, Cave Creek, Carefree, Scottsdale, north Phoenix, Glendale and Peoria. Plenty of clients would rather do the whole thing by phone or video, and that works just as well.',
  },
  {
    q: 'What should I have ready before we talk?',
    a: 'Your red, white and blue Medicare card if you have one, a list of your prescriptions with dosages, the names of the doctors you want to keep, and your preferred pharmacy. That is enough to do real work in a single conversation.',
  },
];

export default homeFaqs;
