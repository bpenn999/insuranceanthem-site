import site from '../config/site';

/**
 * CMS TPMO disclaimer.
 *
 * Wording follows the CY2027 MA/Part D final rule (Federal Register 2026-04-06),
 * which removes the required SHIP reference while keeping Medicare.gov and
 * 1-800-MEDICARE. Marketing provisions take effect 2026-10-01; adopted early,
 * consistent with the rest of the fleet.
 *
 * Do not re-add "or your local State Health Insurance Program (SHIP)".
 */
export const tpmoDisclaimer = `We do not offer every plan available in your area. Currently we represent ${site.agent.statesLicensed} organizations which offer ${'{PLAN_COUNT}'} products in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.`;

/**
 * Rendered version. `planCount` is intentionally a plain string so it can be set
 * to the real carrier/product count once contracts are confirmed. Until then the
 * shorter compliant form (no product count) is used.
 */
export function tpmoText(planCount?: number | string): string {
  if (planCount == null || planCount === '') {
    return 'We do not offer every plan available in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.';
  }
  return tpmoDisclaimer.replace('{PLAN_COUNT}', String(planCount));
}

export const nonAffiliation =
  'Insurance Anthem is not connected with or endorsed by the United States government or the federal Medicare program.';

export const npnLine = `${site.agent.name} · National Producer Number ${site.agent.npn} · Licensed in ${site.agent.statesLicensed} states`;

export const notAdvice =
  'The information on this site is general in nature and is not medical, legal or tax advice. Plan benefits, premiums, networks and formularies change every plan year — always confirm current details before you enroll.';
