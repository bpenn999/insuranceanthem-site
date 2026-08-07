/**
 * Real client reviews. Verbatim.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  TWO RULES, AND THEY ARE BOTH LEGAL RULES RATHER THAN STYLE PREFERENCES.
 *
 *  1. DO NOT EDIT THE QUOTES. Not the wording, not the punctuation, and not
 *     the spelling — "I would not got to", "reccomend" and "chose from" are all
 *     in the originals and all stay. A testimonial that has been tidied up is
 *     no longer the review the client left, and "we only fixed the typos" is
 *     not a distinction the FTC's endorsement guides recognize.
 *
 *  2. NO Review OR AggregateRating STRUCTURED DATA. These are display-only.
 *     They are Google reviews of Brian at Medicare On Main — a different legal
 *     entity — so emitting them as 602Medicare's own review schema would be
 *     asserting something untrue to a search engine, which is exactly the case
 *     Google's own guidelines call out. Nothing in src/components/Schema.astro
 *     touches this file, and nothing should start to.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The disclosure below runs under the cards wherever they appear. It exists
 * because rule 2 is invisible to a reader: without it, five reviews on a
 * 602Medicare page read as five 602Medicare clients.
 */

export interface Testimonial {
  /** Verbatim. See rule 1 above. */
  quote: string;
  name: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'Brian is very helpful and talks you through all the steps to choose the best medical plan for your circumstances. Highly recommend him. Both myself and my husband have greatly appreciated his assistance during this complicated time of our lives.',
    name: 'Cricket Green',
  },
  {
    quote:
      'Outstanding highly recommend to all. Went above and beyond to take care of us. I would not got to or trust anyone else.',
    name: 'Jon Pedersen',
  },
  {
    quote:
      'Brian is knowledgeable as to many different options of insurances plans. He was prompt and prepared. I had several options to chose from. I obtained the insurance plan and great advice I needed. I would recommend his service.',
    name: 'Todd Stubbs',
  },
  {
    quote:
      'Brian was kind and patient as he explained our options and answered our questions. He was prepared with the best plans for us. We reccomend him for anyone looking for Medicare Insurance. Thank you!',
    name: 'Janet Hazleton',
  },
  {
    quote:
      'Brian was very professional and fast with my Medicare and Medicaid Insurance Coverage. He was more than helpful and knowledgeable.',
    name: 'Carolyn Kirk',
  },
];

/**
 * The three-card cut, for places where five would crowd the column — currently
 * the About page, under Brian's bio. Taken off the top of the list rather than
 * hand-picked, so adding a review at position 0 changes both surfaces at once.
 */
export const testimonialsSlim: Testimonial[] = testimonials.slice(0, 3);

/**
 * Required wherever the cards appear. Names the source and the other agency
 * plainly — see rule 2 above for why this is not optional.
 */
export const testimonialsDisclosure =
  "Verified Google reviews from Brian Penner's clients at Medicare On Main, our sister agency — backed by 22+ years of Medicare experience.";

export default testimonials;
