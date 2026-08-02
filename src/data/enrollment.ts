/**
 * Medicare enrollment date arithmetic.
 *
 * Pulled out of the tool page so it can be tested in isolation — these dates
 * carry lifetime penalties, and an off-by-one month here is not a cosmetic bug.
 *
 * Everything is computed in UTC. A local-timezone Date built from "1961-03-01"
 * is 1961-02-28T17:00 in Arizona, which silently shifts every derived window by
 * a month. UTC throughout removes that class of bug entirely.
 */

export interface EnrollmentWindows {
  /** The month Medicare treats as the 65th-birthday month (0-indexed, may be shifted) */
  anchor: Date;
  /** True when the born-on-the-first rule shifted everything a month earlier */
  bornFirst: boolean;
  /** Initial Enrollment Period — 7 months */
  iepStart: Date;
  iepEnd: Date;
  /** Last day to enroll and still have coverage begin on `coverageStart` */
  earlyDeadline: Date;
  /** Earliest possible Part A/B coverage start */
  coverageStart: Date;
  /** Medigap open enrollment — 6 months, once, never repeats */
  medigapStart: Date;
  medigapEnd: Date;
}

export const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d));

/** Last day of month `m` in year `y`. `m` may be out of range and will roll. */
export const endOfMonth = (y: number, m: number) => utc(y, m + 1, 0);

/**
 * Derive every enrollment window from a date of birth.
 *
 * The born-on-the-first rule: Medicare deems you to attain age 65 on the day
 * *before* your birthday. For anyone born on the 1st that lands in the previous
 * month, and every window shifts back with it. This catches out more people
 * than any other rule in Part B enrollment.
 */
export function enrollmentWindows(dob: Date): EnrollmentWindows {
  const bornFirst = dob.getUTCDate() === 1;

  const year = dob.getUTCFullYear() + 65;
  // Note: `month` can go to -1 for a 1 January birthday. Date.UTC rolls it back
  // into the previous December correctly, so no special-casing is needed.
  const month = dob.getUTCMonth() - (bornFirst ? 1 : 0);

  const anchor = utc(year, month, 1);

  return {
    anchor,
    bornFirst,
    iepStart: utc(year, month - 3, 1),
    iepEnd: endOfMonth(year, month + 3),
    earlyDeadline: endOfMonth(year, month - 1),
    coverageStart: utc(year, month, 1),
    // Medigap OEP assumes Part B begins with the IEP, which is the standard case.
    medigapStart: utc(year, month, 1),
    medigapEnd: endOfMonth(year, month + 5),
  };
}

/** The Annual Enrollment Period (15 Oct – 7 Dec) that is next, relative to `today`. */
export function nextAep(today: Date) {
  const y = today.getUTCFullYear();
  const end = utc(y, 11, 7);
  return today > end
    ? { start: utc(y + 1, 9, 15), end: utc(y + 1, 11, 7) }
    : { start: utc(y, 9, 15), end };
}

/** The Medicare Advantage Open Enrollment Period (1 Jan – 31 Mar) next up. */
export function nextMaOep(today: Date) {
  const y = today.getUTCFullYear();
  const end = utc(y, 2, 31);
  return today > end
    ? { start: utc(y + 1, 0, 1), end: utc(y + 1, 2, 31) }
    : { start: utc(y, 0, 1), end };
}
