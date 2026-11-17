/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE ONLY PLACE DOLLAR FIGURES LIVE.
 *
 *  Every number CMS resets each year lives here and nowhere else. When the new
 *  plan year is announced (CMS publishes Parts A & B premiums and deductibles
 *  in mid-November for the following January), update this file and every tool,
 *  article and page on the site updates with it.
 *
 *  ⚠️  ANNUAL UPDATE DUE: mid-November each year, for the following plan year.
 *      Sources to check:
 *        • CMS fact sheet — cms.gov/newsroom/fact-sheets (Parts A & B)
 *        • CMS Part D fact sheet (out-of-pocket cap, base beneficiary premium)
 *        • SSA IRMAA determination tables
 *
 *  CURRENT DATA: CY2027. Verified 2026-11-17 against the CMS 2027 Parts A & B
 *  fact sheet (released 2026-11-17) incl. its IRMAA tables, and the CY2027
 *  Rate Announcement / Part D bid release for the Part D figures.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** The plan year every figure below applies to. Rendered on-page next to the numbers. */
export const PLAN_YEAR = 2027;

/**
 * The CALENDAR year the editorial copy was written against. The markdown
 * tokens {{year}} / {{nextYear}} resolve to this (e.g. "your {{nextYear}} plan"
 * during AEP, "January 1, {{nextYear}}"), NOT to the figures' plan year. Copy
 * that sits next to a dollar figure uses {{figYear}} (= PLAN_YEAR) instead.
 * Bump this on January 1, and re-read the AEP posts that say "next year".
 */
export const CONTENT_YEAR = 2026;

/** The tax year whose MAGI determines this plan year's IRMAA (two-year lookback). */
export const IRMAA_TAX_YEAR = PLAN_YEAR - 2;

export const partB = {
  /** Standard monthly premium, before any IRMAA surcharge */
  standardPremium: 209.4,
  /** Annual deductible */
  deductible: 292,
  /** Coinsurance after the deductible, on Original Medicare with no supplement */
  coinsuranceRate: 0.2,
};

export const partA = {
  /** Inpatient hospital deductible, per benefit period */
  deductible: 1776,
  /** Daily coinsurance, hospital days 61–90 */
  coinsurance61to90: 444,
  /** Daily coinsurance, lifetime reserve days */
  lifetimeReserve: 888,
  /** Total lifetime reserve days available, once ever */
  lifetimeReserveDays: 60,
  /** Daily coinsurance, skilled nursing facility days 21–100 */
  snf21to100: 222,
  /** Monthly premium for those without enough work quarters (most people pay $0) */
  premiumIfUninsured: 597,

  /**
   * Part A premium by quarters of Medicare-covered employment.
   *
   * 40+ quarters is premium-free — that is how most people get Part A. Below
   * that there are two tiers: 30–39 quarters qualifies for a 45% reduction
   * ($597 × 0.55 ≈ $328), and under 30 quarters pays the full amount.
   */
  premiumByQuarters: {
    /** 40 or more quarters */
    free: 0,
    /** 30–39 quarters — the 45%-reduced premium */
    reduced: 328,
    /** Fewer than 30 quarters — full premium */
    full: 597,
  },
  /** Quarters needed for premium-free Part A */
  quartersForFree: 40,
  /** Minimum quarters for the reduced premium */
  quartersForReduced: 30,
};

/**
 * Medigap Plan G and Plan N cost sharing.
 *
 * Medigap benefits are standardised by federal law: Plan G from one carrier
 * covers exactly what Plan G from another covers. Only price, rate history and
 * service differ. These are the benefit rules, not any carrier's premiums.
 */
export const medigap = {
  planG: {
    /** Plan G leaves you the Part B deductible and essentially nothing else */
    coversPartBExcess: true,
    officeCopay: 0,
    erCopay: 0,
  },
  planN: {
    /** Plan N does NOT cover Part B excess charges */
    coversPartBExcess: false,
    /** Up to $20 per office visit */
    officeCopay: 20,
    /** Up to $50 per ER visit — waived if the visit results in admission */
    erCopay: 50,
    erCopayWaivedOnAdmission: true,
  },
  /**
   * Part B excess charge: a provider who does not accept Medicare assignment
   * may bill up to 15% above the Medicare-approved amount. Plan G covers this;
   * Plan N does not.
   *
   * Eight states prohibit excess charges entirely (CT, MA, MN, NY, OH, PA, RI,
   * VT). Arizona is NOT among them, so this is a live consideration here.
   */
  partBExcessMaxRate: 0.15,
  excessChargeBannedStates: ['CT', 'MA', 'MN', 'NY', 'OH', 'PA', 'RI', 'VT'],
};

/**
 * The Part B "giveback" — properly, the Part B premium reduction benefit.
 *
 * Some Medicare Advantage plans pay part or all of your Part B premium, which
 * shows up as a reduced deduction from your Social Security payment.
 *
 * The critical honest detail: it reduces only the STANDARD premium portion. An
 * IRMAA surcharge is unaffected and still owed in full.
 */
export const giveback = {
  /** A plan cannot give back more than the standard premium */
  maxMonthly: 209.4,
  reducesIrmaa: false,
};

export const partD = {
  /** Annual out-of-pocket cap on covered drugs (excludes premiums) */
  outOfPocketCap: 2400,
  /** Maximum deductible a plan may charge */
  maxDeductible: 700,
  /**
   * National base beneficiary premium — the figure the Part D late enrollment
   * penalty is calculated against (NOT what any plan charges).
   * Source: CMS, "Medicare Part D 2027 National Average Monthly Bid Amount
   * Information" (released 2026-07-28):
   * https://www.cms.gov/newsroom/fact-sheets/medicare-part-d-2027-national-average-monthly-bid-amount-information
   * — CY2027 BBP = $38.99 (2026) × 1.06 = $41.33. Updated 2026-11-17.
   */
  baseBeneficiaryPremium: 41.33,
};

/**
 * IRMAA brackets. Thresholds are inclusive at the top of each band — i.e. a
 * single filer at exactly $112,000 pays the standard premium; $112,001 lands in
 * tier 1. `singleMax`/`jointMax` of `null` means "no upper bound".
 */
export interface IrmaaBracket {
  tier: number;
  singleMin: number;
  singleMax: number | null;
  jointMin: number;
  jointMax: number | null;
  /** Monthly surcharge added to the standard Part B premium */
  partBSurcharge: number;
  /** Total monthly Part B premium at this tier */
  partBTotal: number;
  /** Monthly surcharge added to whatever your Part D plan premium is */
  partDSurcharge: number;
}

export const irmaaBrackets: IrmaaBracket[] = [
  { tier: 0, singleMin: 0,       singleMax: 112_000, jointMin: 0,       jointMax: 224_000, partBSurcharge: 0,      partBTotal: 209.4, partDSurcharge: 0 },
  { tier: 1, singleMin: 112_000, singleMax: 141_000, jointMin: 224_000, jointMax: 282_000, partBSurcharge: 83.7,   partBTotal: 293.1, partDSurcharge: 15.4 },
  { tier: 2, singleMin: 141_000, singleMax: 177_000, jointMin: 282_000, jointMax: 354_000, partBSurcharge: 209.4,  partBTotal: 418.8, partDSurcharge: 39.7 },
  { tier: 3, singleMin: 177_000, singleMax: 212_000, jointMin: 354_000, jointMax: 424_000, partBSurcharge: 335.0,  partBTotal: 544.4, partDSurcharge: 64.0 },
  { tier: 4, singleMin: 212_000, singleMax: 500_000, jointMin: 424_000, jointMax: 750_000, partBSurcharge: 460.6,  partBTotal: 670.0, partDSurcharge: 88.3 },
  { tier: 5, singleMin: 500_000, singleMax: null,    jointMin: 750_000, jointMax: null,    partBSurcharge: 502.4,  partBTotal: 711.8, partDSurcharge: 96.4 },
];

/**
 * Married filing separately has its own two-step table rather than the full six
 * brackets — kept separate because collapsing it into the main table produces
 * wrong answers for a small but real group of people.
 */
export const irmaaSeparate = [
  { min: 0,       max: 112_000, partBTotal: 209.4, partDSurcharge: 0 },
  { min: 112_000, max: 388_000, partBTotal: 670.0, partDSurcharge: 88.3 },
  { min: 388_000, max: null,    partBTotal: 711.8, partDSurcharge: 96.4 },
];

export type FilingStatus = 'single' | 'joint' | 'separate';

export interface IrmaaResult {
  /** 0 = standard, 1–5 = surcharge tiers. `separate` filers map onto 0 / 4 / 5. */
  tier: number;
  partBTotal: number;
  partDSurcharge: number;
  /** Extra paid per month versus the standard bracket, Part B + Part D combined */
  monthlyExtra: number;
  /** Top of this bracket, or null if unbounded — used for the "close to an edge" warning */
  upperEdge: number | null;
  surcharged: boolean;
}

/**
 * Look up an IRMAA bracket.
 *
 * Boundaries are exclusive at the bottom and inclusive at the top: a single
 * filer at exactly $112,000 pays the standard premium, and $112,001 is tier 1.
 * That matches how SSA states the thresholds ("greater than $112,000") and it
 * is the one place this calculation is easy to get wrong by a whole bracket.
 */
export function lookupIrmaa(magi: number, filing: FilingStatus): IrmaaResult {
  if (filing === 'separate') {
    const band =
      irmaaSeparate.find((b) => magi > b.min && (b.max === null || magi <= b.max)) ??
      irmaaSeparate[0];
    const idx = irmaaSeparate.indexOf(band);
    return {
      tier: idx === 0 ? 0 : idx === 1 ? 4 : 5,
      partBTotal: band.partBTotal,
      partDSurcharge: band.partDSurcharge,
      monthlyExtra: band.partBTotal - partB.standardPremium + band.partDSurcharge,
      upperEdge: band.max,
      surcharged: band.partBTotal > partB.standardPremium,
    };
  }

  const joint = filing === 'joint';
  const band =
    irmaaBrackets.find((b) => {
      const min = joint ? b.jointMin : b.singleMin;
      const max = joint ? b.jointMax : b.singleMax;
      return magi > min && (max === null || magi <= max);
    }) ?? irmaaBrackets[0];

  return {
    tier: band.tier,
    partBTotal: band.partBTotal,
    partDSurcharge: band.partDSurcharge,
    monthlyExtra: band.partBTotal - partB.standardPremium + band.partDSurcharge,
    upperEdge: joint ? band.jointMax : band.singleMax,
    surcharged: band.tier > 0,
  };
}

/**
 * Long-term care costs.
 *
 * Source: CareScout (Genworth) Cost of Care Survey, fielded July–November 2025,
 * published March 2026 — the most recent edition. Verified 2026-08-02.
 *
 * ⚠️  These are MEDIANS, and long-term care pricing varies more within a single
 *     metro than almost any other figure on this site. They are a starting
 *     point for a conversation, never a quote. The estimator built on them
 *     lets every figure be overridden with a real local number.
 *
 * The 2025 survey merged "homemaker services" and "home health aide" into one
 * non-medical caregiver category, so there is no longer a separate rate for each.
 */
export const careCosts = {
  surveyYear: 2025,
  surveySource: 'CareScout Cost of Care Survey',
  /** The survey's standard assumption for in-home care hours */
  assumedHomeHoursPerWeek: 44,

  national: {
    /** Non-medical caregiver, hourly */
    homeCareHourly: 35,
    /** Skilled private-duty nursing at home, hourly */
    homeNurseHourly: 90,
    /** Adult day health care, per day */
    adultDayDaily: 95,
    /** Assisted living community, per month */
    assistedLivingMonthly: 6200,
    /** Nursing home semi-private room, per day */
    nursingSemiPrivateDaily: 315,
    /** Nursing home private room, per day */
    nursingPrivateDaily: 355,
  },

  arizona: {
    homeCareHourly: 38,
    assistedLivingMonthly: 6250,
    /** Statewide median, per month */
    nursingSemiPrivateMonthly: 8365,
    nursingPrivateMonthly: 11437,
    /** Memory care typically runs ~25% above assisted living */
    memoryCareMonthly: 7800,
  },
};

/** Late-enrollment penalties. */
export const penalties = {
  /** Part B: +10% of the standard premium per full 12 months of delay, for life */
  partBPerYear: 0.1,
  /** Part D: +1% of the national base beneficiary premium per month, for life */
  partDPerMonth: 0.01,
  /**
   * A break in creditable drug coverage only counts once it reaches 63 days
   * in a row. Medicare.gov: "Go 63 days or more without creditable drug
   * coverage" (42 CFR 423.46: "a continuous period of 63 days or longer").
   */
  partDGapDays: 63,
};

export interface PartBPenalty {
  /** Full 12-month periods — a partial year does not count */
  periods: number;
  /** Penalty as a fraction of the standard premium, e.g. 0.2 */
  rate: number;
  /** Monthly penalty in dollars on this plan year's standard premium */
  monthly: number;
  yearly: number;
}

/**
 * Part B late enrollment penalty. `months` = months you could have had Part B
 * but did not, and were not covered through current employment (yours or a
 * spouse's). 10% per FULL 12-month period, on the current standard premium.
 */
export function partBLatePenalty(months: number, premium = partB.standardPremium): PartBPenalty {
  const m = Math.max(0, Math.floor(Number.isFinite(months) ? months : 0));
  const periods = Math.floor(m / 12);
  const rate = Math.round(periods * penalties.partBPerYear * 100) / 100;
  const monthly = Math.round(rate * premium * 100) / 100;
  return { periods, rate, monthly, yearly: Math.round(monthly * 12 * 100) / 100 };
}

export interface PartDPenalty {
  /** Months that count toward the penalty (0 if no gap reached 63 days) */
  months: number;
  /** Penalty as a fraction of the base beneficiary premium, e.g. 0.24 */
  rate: number;
  /** Monthly penalty, rounded to the nearest $0.10 as Medicare does */
  monthly: number;
  yearly: number;
}

/**
 * Part D late enrollment penalty. `months` = full months without creditable
 * drug coverage after the Initial Enrollment Period; `longestGapDays` = the
 * longest unbroken stretch without it. Under 63 days in a row → no penalty.
 * 1% per month × national base beneficiary premium, rounded to $0.10.
 */
export function partDLatePenalty(
  months: number,
  longestGapDays: number,
  base = partD.baseBeneficiaryPremium,
): PartDPenalty {
  const m = Math.max(0, Math.floor(Number.isFinite(months) ? months : 0));
  const counts = longestGapDays >= penalties.partDGapDays ? m : 0;
  const rate = Math.round(counts * penalties.partDPerMonth * 100) / 100;
  // The epsilon keeps a value like 9.35 from rounding down on float error.
  const monthly = Math.round(rate * base * 10 + 1e-9) / 10;
  return { months: counts, rate, monthly, yearly: Math.round(monthly * 12 * 100) / 100 };
}

/** Medicare rounds a premium to the nearest $0.10. */
export const roundToDime = (n: number) => Math.round(n * 10 + 1e-9) / 10;

export const usd = (n: number, decimals = 0) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
