/**
 * Tests for the two pieces of arithmetic that would actually hurt someone if
 * they were wrong: the Medicare enrollment windows and the IRMAA bracket
 * boundaries.
 *
 * Run with:  npm test
 * No test framework — node:test is built in and this needs nothing else.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { enrollmentWindows, nextAep, nextMaOep, utc } from '../src/data/enrollment.ts';
import {
  lookupIrmaa,
  irmaaBrackets,
  partB,
  partA,
  partD,
  PLAN_YEAR,
  IRMAA_TAX_YEAR,
} from '../src/data/medicare-figures.ts';

/** "1961-03-15" → Date in UTC */
const d = (iso) => {
  const [y, m, day] = iso.split('-').map(Number);
  return utc(y, m - 1, day);
};
const iso = (date) => date.toISOString().slice(0, 10);

describe('enrollment windows — the ordinary case', () => {
  // Born 15 March 1961 → turns 65 in March 2026.
  const w = enrollmentWindows(d('1961-03-15'));

  test('IEP starts three months before the birthday month', () => {
    assert.equal(iso(w.iepStart), '2025-12-01');
  });
  test('IEP ends at the end of the third month after', () => {
    assert.equal(iso(w.iepEnd), '2026-06-30');
  });
  test('IEP spans seven whole months', () => {
    const months =
      (w.iepEnd.getUTCFullYear() - w.iepStart.getUTCFullYear()) * 12 +
      (w.iepEnd.getUTCMonth() - w.iepStart.getUTCMonth()) + 1;
    assert.equal(months, 7);
  });
  test('coverage can start on the first of the birthday month', () => {
    assert.equal(iso(w.coverageStart), '2026-03-01');
  });
  test('the early deadline is the last day of the month before coverage starts', () => {
    assert.equal(iso(w.earlyDeadline), '2026-02-28');
  });
  test('Medigap OEP runs six months from the coverage start', () => {
    assert.equal(iso(w.medigapStart), '2026-03-01');
    assert.equal(iso(w.medigapEnd), '2026-08-31');
  });
  test('not flagged as a born-on-the-first case', () => {
    assert.equal(w.bornFirst, false);
  });
});

describe('enrollment windows — born on the first of the month', () => {
  // Born 1 March 1961: Medicare deems age 65 attained in FEBRUARY 2026.
  const w = enrollmentWindows(d('1961-03-01'));

  test('is flagged', () => assert.equal(w.bornFirst, true));
  test('the anchor month shifts back to February', () => {
    assert.equal(iso(w.anchor), '2026-02-01');
  });
  test('every window shifts a month earlier than the 15 March case', () => {
    assert.equal(iso(w.iepStart), '2025-11-01');
    assert.equal(iso(w.iepEnd), '2026-05-31');
    assert.equal(iso(w.coverageStart), '2026-02-01');
    assert.equal(iso(w.medigapEnd), '2026-07-31');
  });
});

describe('enrollment windows — year-boundary rollovers', () => {
  test('born 1 January rolls the anchor into the previous December', () => {
    const w = enrollmentWindows(d('1961-01-01'));
    assert.equal(iso(w.anchor), '2025-12-01');
    assert.equal(iso(w.iepStart), '2025-09-01');
    assert.equal(iso(w.iepEnd), '2026-03-31');
    assert.equal(iso(w.medigapEnd), '2026-05-31');
  });

  test('born 15 January reaches back into the prior year for the IEP start', () => {
    const w = enrollmentWindows(d('1961-01-15'));
    assert.equal(iso(w.iepStart), '2025-10-01');
    assert.equal(iso(w.coverageStart), '2026-01-01');
  });

  test('born 15 November pushes the IEP end into the following year', () => {
    const w = enrollmentWindows(d('1960-11-15'));
    assert.equal(iso(w.iepStart), '2025-08-01');
    assert.equal(iso(w.iepEnd), '2026-02-28');
  });

  test('born 15 December: IEP end lands on a 31-day month', () => {
    const w = enrollmentWindows(d('1960-12-15'));
    assert.equal(iso(w.iepEnd), '2026-03-31');
  });
});

describe('enrollment windows — leap years and short months', () => {
  test('February end dates respect leap years', () => {
    // Born 15 Nov 1958 → 65 in Nov 2023 → IEP ends Feb 2024 (leap).
    assert.equal(iso(enrollmentWindows(d('1958-11-15')).iepEnd), '2024-02-29');
    // Born 15 Nov 1960 → 65 in Nov 2025 → IEP ends Feb 2026 (not leap).
    assert.equal(iso(enrollmentWindows(d('1960-11-15')).iepEnd), '2026-02-28');
  });

  test('a 29 February birthday still resolves to a real anchor', () => {
    const w = enrollmentWindows(d('1960-02-29'));
    assert.equal(iso(w.anchor), '2025-02-01');
    assert.equal(w.bornFirst, false);
  });

  test('a 31st-of-the-month birthday does not overflow into the next month', () => {
    const w = enrollmentWindows(d('1961-01-31'));
    assert.equal(iso(w.anchor), '2026-01-01');
    assert.equal(iso(w.coverageStart), '2026-01-01');
  });
});

describe('enrollment windows — no timezone drift', () => {
  test('every returned date sits exactly on UTC midnight', () => {
    for (const day of ['1961-01-01', '1961-06-15', '1960-12-31']) {
      const w = enrollmentWindows(d(day));
      for (const [key, value] of Object.entries(w)) {
        if (!(value instanceof Date)) continue;
        assert.equal(
          value.getTime() % 864e5,
          0,
          `${key} for ${day} is not on a UTC day boundary`
        );
      }
    }
  });
});

describe('annual windows', () => {
  test('AEP mid-year returns this years window', () => {
    const a = nextAep(d('2026-08-02'));
    assert.equal(iso(a.start), '2026-10-15');
    assert.equal(iso(a.end), '2026-12-07');
  });
  test('AEP after 7 December rolls to next year', () => {
    const a = nextAep(d('2026-12-20'));
    assert.equal(iso(a.start), '2027-10-15');
  });
  test('AEP on the closing day is still this year', () => {
    assert.equal(iso(nextAep(d('2026-12-07')).start), '2026-10-15');
  });
  test('MA-OEP after 31 March rolls to next year', () => {
    assert.equal(iso(nextMaOep(d('2026-08-02')).start), '2027-01-01');
  });
  test('MA-OEP during Q1 returns the current window', () => {
    assert.equal(iso(nextMaOep(d('2026-02-10')).start), '2026-01-01');
  });
});

describe('IRMAA — bracket boundaries are exclusive at the bottom', () => {
  test('exactly at the first threshold is still standard', () => {
    const r = lookupIrmaa(109_000, 'single');
    assert.equal(r.tier, 0);
    assert.equal(r.surcharged, false);
    assert.equal(r.partBTotal, partB.standardPremium);
    assert.equal(r.partDSurcharge, 0);
  });

  test('one dollar over lands in tier 1', () => {
    const r = lookupIrmaa(109_001, 'single');
    assert.equal(r.tier, 1);
    assert.equal(r.surcharged, true);
    assert.equal(r.partBTotal, 284.1);
    assert.equal(r.partDSurcharge, 14.5);
  });

  test('every single-filer boundary is off-by-one safe', () => {
    for (const b of irmaaBrackets) {
      if (b.singleMax === null) continue;
      assert.equal(lookupIrmaa(b.singleMax, 'single').tier, b.tier, `at ${b.singleMax}`);
      assert.equal(lookupIrmaa(b.singleMax + 1, 'single').tier, b.tier + 1, `at ${b.singleMax + 1}`);
    }
  });

  test('every joint-filer boundary is off-by-one safe', () => {
    for (const b of irmaaBrackets) {
      if (b.jointMax === null) continue;
      assert.equal(lookupIrmaa(b.jointMax, 'joint').tier, b.tier, `at ${b.jointMax}`);
      assert.equal(lookupIrmaa(b.jointMax + 1, 'joint').tier, b.tier + 1, `at ${b.jointMax + 1}`);
    }
  });
});

describe('IRMAA — filing statuses do not bleed into each other', () => {
  test('a joint filer at the single threshold pays nothing extra', () => {
    assert.equal(lookupIrmaa(150_000, 'joint').tier, 0);
    assert.equal(lookupIrmaa(150_000, 'single').tier, 2);
  });

  test('married filing separately uses its own steeper table', () => {
    assert.equal(lookupIrmaa(109_000, 'separate').tier, 0);
    // Separate filers jump straight to the tier-4 amounts above the threshold.
    const r = lookupIrmaa(200_000, 'separate');
    assert.equal(r.partBTotal, 649.2);
    assert.equal(r.partDSurcharge, 83.3);
    // …and to the top tier above $391,000.
    assert.equal(lookupIrmaa(400_000, 'separate').partBTotal, 689.9);
  });
});

describe('IRMAA — edges and extremes', () => {
  test('zero income is standard', () => assert.equal(lookupIrmaa(0, 'single').tier, 0));
  test('an enormous income lands in the top tier with no upper edge', () => {
    const r = lookupIrmaa(50_000_000, 'single');
    assert.equal(r.tier, 5);
    assert.equal(r.upperEdge, null);
  });
  test('monthlyExtra is Part B surcharge plus Part D surcharge', () => {
    const r = lookupIrmaa(300_000, 'single');
    const expected = r.partBTotal - partB.standardPremium + r.partDSurcharge;
    assert.ok(Math.abs(r.monthlyExtra - expected) < 1e-9);
  });
  test('surcharges rise monotonically across the tiers', () => {
    let prevB = -1;
    let prevD = -1;
    for (const b of irmaaBrackets) {
      assert.ok(b.partBTotal > prevB, `Part B not increasing at tier ${b.tier}`);
      assert.ok(b.partDSurcharge >= prevD, `Part D not increasing at tier ${b.tier}`);
      prevB = b.partBTotal;
      prevD = b.partDSurcharge;
    }
  });
});

describe('published figures match the CY2026 CMS fact sheet', () => {
  test('plan year and IRMAA lookback', () => {
    assert.equal(PLAN_YEAR, 2026);
    assert.equal(IRMAA_TAX_YEAR, 2024);
  });
  test('Part B', () => {
    assert.equal(partB.standardPremium, 202.9);
    assert.equal(partB.deductible, 283);
  });
  test('Part A', () => {
    assert.equal(partA.deductible, 1736);
    assert.equal(partA.coinsurance61to90, 434);
    assert.equal(partA.lifetimeReserve, 868);
    assert.equal(partA.snf21to100, 217);
  });
  test('Part D out-of-pocket cap', () => {
    assert.equal(partD.outOfPocketCap, 2100);
  });
  test('the standard bracket total equals the standard premium', () => {
    assert.equal(irmaaBrackets[0].partBTotal, partB.standardPremium);
  });
  test('joint thresholds are double the single ones — except the top one', () => {
    // The joint column is 2× the single column all the way up, and then the
    // final threshold breaks the pattern: single $500,000 pairs with joint
    // $750,000, not $1,000,000. That exception is in the statute, not a typo.
    const TOP_SINGLE = 500_000;
    const TOP_JOINT = 750_000;

    for (const b of irmaaBrackets) {
      const expectMin = b.singleMin === TOP_SINGLE ? TOP_JOINT : b.singleMin * 2;
      assert.equal(b.jointMin, expectMin, `tier ${b.tier} min`);

      if (b.singleMax === null) {
        assert.equal(b.jointMax, null, `tier ${b.tier} max`);
        continue;
      }
      const expectMax = b.singleMax === TOP_SINGLE ? TOP_JOINT : b.singleMax * 2;
      assert.equal(b.jointMax, expectMax, `tier ${b.tier} max`);
    }
  });

  test('the top-tier exception is exactly where we think it is', () => {
    // A joint filer at $900,000 is in the top tier; 2× logic would have put
    // them in tier 4. Worth pinning so a future edit cannot quietly "fix" it.
    assert.equal(lookupIrmaa(900_000, 'joint').tier, 5);
    assert.equal(lookupIrmaa(700_000, 'joint').tier, 4);
  });
});
