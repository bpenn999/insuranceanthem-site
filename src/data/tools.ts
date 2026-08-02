/**
 * Free Tools hub. Each entry has a real working page — nothing here is a stub.
 */

export interface Tool {
  slug: string;
  name: string;
  blurb: string;
  /** Short verb phrase for the tile CTA */
  cta: string;
  minutes: number;
  icon: 'compass' | 'calendar' | 'calculator' | 'list';
}

export const tools: Tool[] = [
  {
    slug: 'plan-type-finder',
    name: 'Advantage or Supplement?',
    blurb:
      'Six questions about your doctors, your travel and your budget. Tells you which side of the Medicare fork actually fits — and why.',
    cta: 'Find my plan type',
    minutes: 2,
    icon: 'compass',
  },
  {
    slug: 'enrollment-timeline',
    name: 'Enrollment Window Checker',
    blurb:
      'Enter your birthday and get your exact Initial Enrollment Period dates, your Medigap open enrollment window, and the deadlines that carry lifetime penalties.',
    cta: 'Check my dates',
    minutes: 1,
    icon: 'calendar',
  },
  {
    slug: 'medicare-cost-estimator',
    name: 'Annual Cost Estimator',
    blurb:
      'Compare what a year on a Medicare Advantage plan versus a Supplement plus Part D would realistically cost you — premiums, deductibles and expected visits included.',
    cta: 'Estimate my year',
    minutes: 3,
    icon: 'calculator',
  },
  {
    slug: 'irmaa-estimator',
    name: 'IRMAA Surcharge Estimator',
    blurb:
      'Higher income means a surcharge on Part B and Part D. See which bracket your tax return puts you in before the letter arrives.',
    cta: 'Check my bracket',
    minutes: 1,
    icon: 'list',
  },
];

export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
export default tools;
