import { visit } from 'unist-util-visit';
import {
  PLAN_YEAR,
  IRMAA_TAX_YEAR,
  partA,
  partB,
  partD,
  irmaaBrackets,
  usd,
} from '../src/data/medicare-figures.ts';

/**
 * Lets markdown articles reference the CY figures without hard-coding them.
 *
 *   "The standard Part B premium is {{partB.premium}} a month in {{year}}."
 *   → "The standard Part B premium is $202.90 a month in 2026."
 *
 * Why this exists: there are eleven articles quoting these numbers. Typing them
 * by hand would mean the November CMS update became an eleven-file find-and-
 * replace with no way to know you had missed one. With this, the update stays
 * what the README promises — one edit to src/data/medicare-figures.ts.
 *
 * Unknown tokens throw at build time rather than rendering as literal
 * `{{typo}}` on a live page. A silently wrong dollar figure on a Medicare site
 * is the exact failure this whole arrangement exists to prevent.
 */

const b = (tier) => irmaaBrackets[tier];

export const FIGURE_TOKENS = {
  // Years
  'year': String(PLAN_YEAR),
  'nextYear': String(PLAN_YEAR + 1),
  'irmaaTaxYear': String(IRMAA_TAX_YEAR),

  // Part B
  'partB.premium': usd(partB.standardPremium, 2),
  'partB.deductible': usd(partB.deductible),
  'partB.annual': usd(partB.standardPremium * 12),
  'partB.coinsurance': `${Math.round(partB.coinsuranceRate * 100)}%`,

  // Part A
  'partA.deductible': usd(partA.deductible),
  'partA.days61to90': usd(partA.coinsurance61to90),
  'partA.lifetimeReserve': usd(partA.lifetimeReserve),
  'partA.snf': usd(partA.snf21to100),
  'partA.snfTotal': usd(partA.snf21to100 * 80),
  'partA.premiumIfUninsured': usd(partA.premiumIfUninsured),

  // Part D
  'partD.cap': usd(partD.outOfPocketCap),
  'partD.maxDeductible': usd(partD.maxDeductible),

  // IRMAA thresholds
  'irmaa.singleStart': usd(b(1).singleMin),
  'irmaa.jointStart': usd(b(1).jointMin),
  'irmaa.topSingle': usd(b(5).singleMin),
  'irmaa.topJoint': usd(b(5).jointMin),

  // IRMAA tier 1
  'irmaa.t1.partB': usd(b(1).partBTotal, 2),
  'irmaa.t1.partD': usd(b(1).partDSurcharge, 2),
  'irmaa.t1.singleMax': usd(b(1).singleMax),
  'irmaa.t1.jointMax': usd(b(1).jointMax),

  // IRMAA tier 2
  'irmaa.t2.partB': usd(b(2).partBTotal, 2),
  'irmaa.t2.partD': usd(b(2).partDSurcharge, 2),
  'irmaa.t2.singleMax': usd(b(2).singleMax),

  // IRMAA tier 3
  'irmaa.t3.partB': usd(b(3).partBTotal, 2),
  'irmaa.t3.partD': usd(b(3).partDSurcharge, 2),
  'irmaa.t3.singleMax': usd(b(3).singleMax),

  // IRMAA tier 4
  'irmaa.t4.partB': usd(b(4).partBTotal, 2),
  'irmaa.t4.partD': usd(b(4).partDSurcharge, 2),

  // IRMAA top tier
  'irmaa.t5.partB': usd(b(5).partBTotal, 2),
  'irmaa.t5.partD': usd(b(5).partDSurcharge, 2),
  'irmaa.t5.annualExtra': usd(
    (b(5).partBTotal - partB.standardPremium + b(5).partDSurcharge) * 12
  ),
};

const TOKEN_RE = /\{\{\s*([A-Za-z0-9_.]+)\s*\}\}/g;

export default function remarkMedicareFigures() {
  return (tree, file) => {
    const where = file?.history?.[0] ?? 'unknown file';

    // `inlineCode` is included so a token inside backticks still resolves, and
    // `html` so that tokens inside raw HTML blocks do too — blog posts build
    // their stat callouts and scrollable tables as literal markup, and without
    // this those were the one place on the site where a dollar figure had to be
    // typed by hand. Fenced `code` blocks are deliberately left alone.
    visit(tree, ['text', 'inlineCode', 'html'], (node) => {
      if (!node.value || !node.value.includes('{{')) return;

      node.value = node.value.replace(TOKEN_RE, (match, token) => {
        const value = FIGURE_TOKENS[token];
        if (value === undefined) {
          throw new Error(
            `[medicare-figures] Unknown token "${match}" in ${where}.\n` +
              `Add it to plugins/remark-medicare-figures.mjs, or fix the typo.\n` +
              `Known tokens: ${Object.keys(FIGURE_TOKENS).join(', ')}`
          );
        }
        return value;
      });
    });
  };
}
