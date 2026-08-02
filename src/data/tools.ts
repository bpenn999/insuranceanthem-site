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
  icon: 'compass' | 'calendar' | 'calculator' | 'list' | 'scale' | 'refund' | 'home';
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
  {
    slug: 'plan-g-vs-plan-n',
    name: 'Plan G vs Plan N',
    blurb:
      'Plan N costs less each month but adds copays and leaves excess charges to you. Find the number of visits where the two swap places.',
    cta: 'Find my breakeven',
    minutes: 2,
    icon: 'scale',
  },
  {
    slug: 'part-b-giveback',
    name: 'Part B Giveback Estimator',
    blurb:
      'Some Advantage plans pay back part of your Part B premium. See what a giveback is actually worth — and what it does not touch.',
    cta: 'Estimate my giveback',
    minutes: 1,
    icon: 'refund',
  },
  {
    slug: 'part-a-premium',
    name: 'Part A Premium Calculator',
    blurb:
      'Most people get Part A free on 40 work quarters. Fewer than that and there are two tiers — find out which one applies to you.',
    cta: 'Check my quarters',
    minutes: 1,
    icon: 'calendar',
  },
  {
    slug: 'cost-of-care',
    name: 'Cost of Care Estimator',
    blurb:
      'In-home help, assisted living or skilled nursing — what each realistically costs per year in Arizona, and what Medicare pays toward it.',
    cta: 'Estimate care costs',
    minutes: 2,
    icon: 'home',
  },
];

export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
export default tools;
