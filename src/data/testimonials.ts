/**
 * ⚠️  PLACEHOLDER TESTIMONIALS — REPLACE BEFORE THE SITE GOES LIVE. ⚠️
 *
 * These are sample entries for layout only. They are NOT real client reviews.
 * Publishing invented reviews is both a compliance problem and an FTC problem,
 * so they are deliberately NOT emitted as Review/AggregateRating structured data
 * (see src/components/Schema.astro — review schema is gated on `placeholder`).
 *
 * To go live: replace each entry with a real, attributable client review, then
 * set `placeholder: false` below. That single flag also turns on review schema.
 */

export const placeholder = true;

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  /** What they came in for — shown as a small tag */
  context: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'I had a stack of mail two inches thick and no idea which envelope mattered. We sat down, went through my prescriptions one at a time, and I walked out understanding exactly what I signed up for and why.',
    name: 'Sample Client',
    location: 'Anthem, AZ',
    context: 'Part D review',
  },
  {
    quote:
      'What I appreciated most was being told what would not work for me. My cardiologist was not in one of the plans and that was the end of that conversation — no talking me into it.',
    name: 'Sample Client',
    location: 'New River, AZ',
    context: 'Turning 65',
  },
  {
    quote:
      'We moved here from out of state and thought we had to start over from scratch. One phone call sorted out what carried over, what did not, and what the deadline was.',
    name: 'Sample Client',
    location: 'Carefree, AZ',
    context: 'Moving to Arizona',
  },
];

export default testimonials;
