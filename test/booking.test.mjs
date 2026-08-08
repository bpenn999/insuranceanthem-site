/**
 * Tests for the booking picker's calendar arithmetic.
 *
 * The picker draws a month grid against a calendar in America/Denver, for a
 * market in America/Phoenix, in a browser that could be in any timezone at all.
 * Every date bug on a scheduler lives in the gap between those three, so this
 * pins the behaviour that gap produces rather than the happy path.
 *
 * Run with:  npm test
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  DISPLAY_TZ,
  formatDay,
  formatDayLong,
  formatMonthLong,
  formatSlotRange,
  formatSlotTime,
  isoDayIn,
  monthGrid,
  nextBookableDays,
  parseDay,
  shiftMonth,
  validateDetails,
  weekdayOf,
} from '../src/lib/booking.ts';

/** The calendar's real configuration, as returned by get-availability. */
const MON_TO_FRI = [1, 2, 3, 4, 5];

describe('day strings', () => {
  test('round-trips through parse and format', () => {
    assert.equal(formatDay(2026, 7, 11), '2026-08-11');
    assert.deepEqual(parseDay('2026-08-11'), { y: 2026, m: 7, d: 11 });
  });

  test('pads single-digit months and days', () => {
    assert.equal(formatDay(2027, 0, 3), '2027-01-03');
  });

  test('weekdayOf does not slide a day west of Greenwich', () => {
    // The trap: `new Date("2026-08-11")` is UTC midnight, which in Phoenix is
    // still the 10th. If weekdayOf used a local Date it would return Monday.
    assert.equal(weekdayOf('2026-08-11'), 2, 'Tuesday');
    assert.equal(weekdayOf('2026-08-09'), 0, 'Sunday');
    assert.equal(weekdayOf('2026-08-15'), 6, 'Saturday');
  });

  test('isoDayIn reads the day in the market timezone, not UTC', () => {
    // 03:00 UTC on the 12th is 20:00 on the 11th in Phoenix. A visitor tapping
    // "today" late in the evening must not be shown tomorrow's grid.
    const lateEvening = new Date('2026-08-12T03:00:00Z');
    assert.equal(isoDayIn(lateEvening, DISPLAY_TZ), '2026-08-11');
    assert.equal(isoDayIn(lateEvening, 'UTC'), '2026-08-12');
  });
});

describe('month arithmetic', () => {
  test('steps forward across a year boundary', () => {
    assert.deepEqual(shiftMonth(2026, 11, 1), { y: 2027, m: 0 });
  });
  test('steps backward across a year boundary', () => {
    assert.deepEqual(shiftMonth(2026, 0, -1), { y: 2025, m: 11 });
  });
  test('steps more than a year', () => {
    assert.deepEqual(shiftMonth(2026, 5, 14), { y: 2027, m: 7 });
  });
});

describe('the month grid', () => {
  const grid = monthGrid(2026, 7, { today: '2026-08-08', bookableWeekdays: MON_TO_FRI });

  test('is whole weeks, so the columns line up under their headers', () => {
    assert.equal(grid.length % 7, 0);
  });

  test('starts on a Sunday', () => {
    assert.equal(weekdayOf(grid[0].date), 0);
  });

  test('contains every day of the month exactly once', () => {
    const inMonth = grid.filter((c) => c.inMonth);
    assert.equal(inMonth.length, 31, 'August has 31 days');
    assert.equal(new Set(inMonth.map((c) => c.date)).size, 31);
  });

  test('pads with out-of-month cells that are never selectable', () => {
    for (const c of grid.filter((c) => !c.inMonth)) assert.equal(c.disabled, true);
  });

  test('greys out every weekend', () => {
    for (const c of grid.filter((c) => c.inMonth)) {
      const w = weekdayOf(c.date);
      if (w === 0 || w === 6) assert.equal(c.disabled, true, `${c.date} is a weekend`);
    }
  });

  test('greys out the past but not today', () => {
    const past = grid.find((c) => c.date === '2026-08-07'); // a Friday
    assert.equal(past.disabled, true, 'yesterday is gone');

    // 8 August 2026 is a Saturday, so today is disabled here for being a
    // weekend, not for being today — check the flag rather than the state.
    const today = grid.find((c) => c.date === '2026-08-08');
    assert.equal(today.isToday, true);
  });

  test('today is bookable when today is a weekday', () => {
    const g = monthGrid(2026, 7, { today: '2026-08-11', bookableWeekdays: MON_TO_FRI });
    const today = g.find((c) => c.date === '2026-08-11');
    assert.equal(today.isToday, true);
    assert.equal(today.disabled, false, 'a Tuesday you are standing on is still bookable');
  });

  test('greys out days a lookup has proven empty', () => {
    const g = monthGrid(2026, 7, {
      today: '2026-08-08',
      bookableWeekdays: MON_TO_FRI,
      soldOut: ['2026-08-11'],
    });
    assert.equal(g.find((c) => c.date === '2026-08-11').disabled, true);
    assert.equal(g.find((c) => c.date === '2026-08-12').disabled, false);
  });

  test('accepts soldOut as a Set as well as an array', () => {
    const g = monthGrid(2026, 7, {
      today: '2026-08-08',
      bookableWeekdays: MON_TO_FRI,
      soldOut: new Set(['2026-08-12']),
    });
    assert.equal(g.find((c) => c.date === '2026-08-12').disabled, true);
  });

  test('honours a booking horizon', () => {
    const g = monthGrid(2026, 7, {
      today: '2026-08-08',
      bookableWeekdays: MON_TO_FRI,
      maxDay: '2026-08-14',
    });
    assert.equal(g.find((c) => c.date === '2026-08-14').disabled, false);
    assert.equal(g.find((c) => c.date === '2026-08-17').disabled, true);
  });

  test('February in a leap year is 29 days', () => {
    const g = monthGrid(2028, 1, { today: '2028-01-01', bookableWeekdays: MON_TO_FRI });
    assert.equal(g.filter((c) => c.inMonth).length, 29);
  });

  test('a month that starts on a Sunday gets no leading blanks', () => {
    // 1 February 2026 is a Sunday.
    const g = monthGrid(2026, 1, { today: '2026-01-01', bookableWeekdays: MON_TO_FRI });
    assert.equal(g[0].date, '2026-02-01');
    assert.equal(g[0].inMonth, true);
  });

  test('every month of a year produces whole weeks with no gaps', () => {
    for (let m = 0; m < 12; m++) {
      const g = monthGrid(2027, m, { today: '2027-01-01', bookableWeekdays: MON_TO_FRI });
      assert.equal(g.length % 7, 0, `month ${m} is whole weeks`);
      // Cells must be consecutive days end to end, padding included.
      for (let i = 1; i < g.length; i++) {
        const prev = parseDay(g[i - 1].date);
        const expect = new Date(Date.UTC(prev.y, prev.m, prev.d + 1));
        assert.equal(
          g[i].date,
          formatDay(expect.getUTCFullYear(), expect.getUTCMonth(), expect.getUTCDate()),
          `month ${m} cell ${i} follows the one before it`,
        );
      }
    }
  });
});

describe('warming the next bookable days', () => {
  test('skips the weekend', () => {
    // Saturday 8 August 2026 → the next five bookable days are Mon–Fri.
    assert.deepEqual(nextBookableDays('2026-08-08', MON_TO_FRI, 5), [
      '2026-08-10',
      '2026-08-11',
      '2026-08-12',
      '2026-08-13',
      '2026-08-14',
    ]);
  });

  test('includes the starting day when it is itself bookable', () => {
    assert.equal(nextBookableDays('2026-08-11', MON_TO_FRI, 1)[0], '2026-08-11');
  });

  test('walks across a month boundary', () => {
    const days = nextBookableDays('2026-08-28', MON_TO_FRI, 3);
    assert.deepEqual(days, ['2026-08-28', '2026-08-31', '2026-09-01']);
  });

  test('stops at the horizon rather than looping forever', () => {
    // No bookable weekday at all: without the horizon guard this never returns.
    assert.deepEqual(nextBookableDays('2026-08-08', [], 5), []);
  });
});

describe('displaying a slot', () => {
  // The calendar runs on America/Denver. On 11 August 2026 that is MDT (UTC-6),
  // while Phoenix is on MST (UTC-7) and never moves. So the calendar's 08:00
  // is 07:00 to the Phoenix visitor this site is built for, and that one-hour
  // gap is the reason every displayed time goes through startUtc.
  const slot = {
    start: '2026-08-11T08:00:00',
    end: '2026-08-11T08:30:00',
    startUtc: '2026-08-11T14:00:00.000Z',
    endUtc: '2026-08-11T14:30:00.000Z',
  };

  // Written as an escape, not typed: an assertion against an invisible
  // character is an assertion nobody can review.
  const NBSP = '\u00A0';

  test('reads a slot in Arizona time, not the calendar timezone', () => {
    assert.equal(formatSlotTime(slot.startUtc, DISPLAY_TZ), `7:00${NBSP}AM`);
    assert.equal(formatSlotTime(slot.startUtc, 'America/Denver'), `8:00${NBSP}AM`);
  });

  test('uses a non-breaking space so a time never wraps inside a button', () => {
    const t = formatSlotTime(slot.startUtc, DISPLAY_TZ);
    assert.equal(t.includes(NBSP), true, 'the gap is non-breaking');
    assert.equal(t.includes(' '), false, 'and no ordinary space slipped through');
  });

  test('a range reads as a sentence, with ordinary spaces', () => {
    const r = formatSlotRange(slot, DISPLAY_TZ);
    assert.equal(r, '7:00 AM \u2013 7:30 AM');
    assert.equal(r.includes(NBSP), false, 'both ends converted, not just the first');
  });

  test('an afternoon slot crossing noon still reads PM', () => {
    assert.equal(formatSlotTime('2026-08-11T19:00:00.000Z', DISPLAY_TZ), `12:00${NBSP}PM`);
  });

  test('names the day without sliding it a day west', () => {
    assert.equal(formatDayLong('2026-08-11'), 'Tuesday, August 11');
    assert.equal(formatDayLong('2026-01-01'), 'Thursday, January 1');
  });

  test('names the month', () => {
    assert.equal(formatMonthLong(2026, 7), 'August 2026');
    assert.equal(formatMonthLong(2027, 0), 'January 2027');
  });
});

describe('the details form', () => {
  const base = { firstName: 'Ada', lastName: 'Lovelace', phone: '6028446002', email: '' };

  test('accepts a phone alone', () => {
    assert.equal(validateDetails(base).ok, true);
  });

  test('accepts an email alone', () => {
    assert.equal(validateDetails({ ...base, phone: '', email: 'ada@example.com' }).ok, true);
  });

  test('accepts a formatted phone number', () => {
    assert.equal(validateDetails({ ...base, phone: '(602) 844-6002' }).ok, true);
  });

  test('rejects a missing first name', () => {
    const r = validateDetails({ ...base, firstName: '  ' });
    assert.equal(r.ok, false);
    assert.equal(r.field, 'firstName');
  });

  test('rejects a missing last name', () => {
    const r = validateDetails({ ...base, lastName: '' });
    assert.equal(r.ok, false);
    assert.equal(r.field, 'lastName');
  });

  test('rejects neither phone nor email — the API would too', () => {
    const r = validateDetails({ ...base, phone: '', email: '' });
    assert.equal(r.ok, false);
    assert.match(r.message, /phone number or an email/);
  });

  test('rejects a short phone number', () => {
    const r = validateDetails({ ...base, phone: '602844' });
    assert.equal(r.ok, false);
    assert.equal(r.field, 'phone');
  });

  test('rejects a malformed email even when a good phone is present', () => {
    const r = validateDetails({ ...base, email: 'ada@example' });
    assert.equal(r.ok, false);
    assert.equal(r.field, 'email');
  });
});
