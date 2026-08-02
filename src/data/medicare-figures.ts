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
 *  CURRENT DATA: CY2026. Verified 2026-08-02 against the CMS 2026 Parts A & B
 *  fact sheet (released 2025-11-14) and published 2026 IRMAA tables.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** The plan year every figure below applies to. Rendered on-page next to the numbers. */
export const PLAN_YEAR = 2026;

/** The tax year whose MAGI determines this plan year's IRMAA (two-year lookback). */
export const IRMAA_TAX_YEAR = PLAN_YEAR - 2;

export const partB = {
  /** Standard monthly premium, before any IRMAA surcharge */
  standardPremium: 202.9,
  /** Annual deductible */
  deductible: 283,
  /** Coinsurance after the deductible, on Original Medicare with no supplement */
  coinsuranceRate: 0.2,
};

export const partA = {
  /** Inpatient hospital deductible, per benefit period */
  deductible: 1736,
  /** Daily coinsurance, hospital days 61–90 */
  coinsurance61to90: 434,
  /** Daily coinsurance, lifetime reserve days */
  lifetimeReserve: 868,
  /** Total lifetime reserve days available, once ever */
  lifetimeReserveDays: 60,
  /** Daily coinsurance, skilled nursing facility days 21–100 */
  snf21to100: 217,
  /** Monthly premium for those without enough work quarters (most people pay $0) */
  premiumIfUninsured: 565,

  /**
   * Part A premium by quarters of Medicare-covered employment.
   *
   * 40+ quarters is premium-free — that is how most people get Part A. Below
   * that there are two tiers: 30–39 quarters qualifies for a 45% reduction
   * ($565 × 0.55 ≈ $311), and under 30 quarters pays the full amount.
   */
  premiumByQuarters: {
    /** 40 or more quarters */
    free: 0,
    /** 30–39 quarters — the 45%-reduced premium */
    reduced: 311,
    /** Fewer than 30 quarters — full premium */
    full: 565,
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
  maxMonthly: 202.9,
  reducesIrmaa: false,
};

export const partD = {
  /** Annual out-of-pocket cap on covered drugs (excludes premiums) */
  outOfPocketCap: 2100,
  /** Maximum deductible a plan may charge */
  maxDeductible: 615,
};

/**
 * IRMAA brackets. Thresholds are inclusive at the top of each band — i.e. a
 * single filer at exactly $109,000 pays the standard premium; $109,001 lands in
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
  { tier: 0, singleMin: 0,       singleMax: 109_000, jointMin: 0,       jointMax: 218_000, partBSurcharge: 0,      partBTotal: 202.9, partDSurcharge: 0 },
  { tier: 1, singleMin: 109_000, singleMax: 137_000, jointMin: 218_000, jointMax: 274_000, partBSurcharge: 81.2,   partBTotal: 284.1, partDSurcharge: 14.5 },
  { tier: 2, singleMin: 137_000, singleMax: 171_000, jointMin: 274_000, jointMax: 342_000, partBSurcharge: 202.9,  partBTotal: 405.8, partDSurcharge: 37.5 },
  { tier: 3, singleMin: 171_000, singleMax: 205_000, jointMin: 342_000, jointMax: 410_000, partBSurcharge: 324.6,  partBTotal: 527.5, partDSurcharge: 60.4 },
  { tier: 4, singleMin: 205_000, singleMax: 500_000, jointMin: 410_000, jointMax: 750_000, partBSurcharge: 446.3,  partBTotal: 649.2, partDSurcharge: 83.3 },
  { tier: 5, singleMin: 500_000, singleMax: null,    jointMin: 750_000, jointMax: null,    partBSurcharge: 487.0,  partBTotal: 689.9, partDSurcharge: 91.0 },
];

/**
 * Married filing separately has its own two-step table rather than the full six
 * brackets — kept separate because collapsing it into the main table produces
 * wrong answers for a small but real group of people.
 */
export const irmaaSeparate = [
  { min: 0,       max: 109_000, partBTotal: 202.9, partDSurcharge: 0 },
  { min: 109_000, max: 391_000, partBTotal: 649.2, partDSurcharge: 83.3 },
  { min: 391_000, max: null,    partBTotal: 689.9, partDSurcharge: 91.0 },
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
 * filer at exactly $109,000 pays the standard premium, and $109,001 is tier 1.
 * That matches how SSA states the thresholds ("greater than $109,000") and it
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
};

export const usd = (n: number, decimals = 0) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
