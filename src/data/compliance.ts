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
/**
 * Organization/product counts for the TPMO line. Source: Brian's X book of business
 * (11/16/2026 — 10 Medicare carriers, ~159 distinct plans). Same numbers fleet-wide.
 */
export const ORG_COUNT = 10;
export const PRODUCT_COUNT = 150;

export const tpmoDisclaimer = `We do not offer every plan available in your area. Currently, we represent ${ORG_COUNT} organizations which offer ${PRODUCT_COUNT} products in your area. Please contact Medicare.gov or 1-800-MEDICARE to get information on all of your options.`;

export function tpmoText(): string {
  return tpmoDisclaimer;
}

export const proprietaryNotice = `This is a proprietary website and is not associated, endorsed or authorized by the Social Security Administration, the Department of Health and Human Services or the Centers for Medicare & Medicaid Services. This site contains decision-support content and information about Medicare, services related to Medicare and services for people with Medicare. If you would like to find more information about the Medicare program, please visit the Official U.S. Government Site for People with Medicare at www.medicare.gov.`;

export const nonAffiliation = `${site.name} is not connected with or endorsed by the United States government or the federal Medicare program.`;

export const npnLine = `${site.agent.name} · National Producer Number ${site.agent.npn} · Licensed in ${site.agent.statesLicensed} states`;

export const notAdvice =
  'The information on this site is general in nature and is not medical, legal or tax advice. Plan benefits, premiums, networks and formularies change every plan year — always confirm current details before you enroll.';
