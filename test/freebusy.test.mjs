/**
 * The diary filter, tested against the day that exposed the bug.
 *
 * Thursday 20 August 2026, from Brian's own Google Calendar:
 *
 *   07:00–20:00  "Off"                                  ← the whole working day
 *   08:00–08:30  Check ACC approval — Kenztara AZ
 *   11:00–12:00  Medicare Leadership Syndicate Idea Swap
 *   15:30–16:00  ZZ Moab SyncTest
 *
 * …all Arizona time (UTC-7, no DST). The booking page offered 7:00, 7:30, 8:00,
 * 8:30, 9:00, 9:30, 10:00 and 10:30 that morning and let him book 7:30. Every
 * assertion below is that day: after this filter, nothing is offered.
 *
 * Run with:  npm test
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  busyFromFreeBusy,
  conflicts,
  dayWindow,
  filterSlots,
  mergeIntervals,
} from '../src/lib/freebusy.ts';

/** Arizona is UTC-7 year round, so a wall-clock hour maps straight to Z. */
const az = (hhmm) => `2026-08-20T${hhmm}:00-07:00`;

/** The real freeBusy answer Google would give for that Thursday. */
const THURSDAY = {
  calendars: {
    'brianinsuranceservices@gmail.com': {
      busy: [
        { start: az('07:00'), end: az('20:00') }, // "Off"
        { start: az('08:00'), end: az('08:30') },
        { start: az('11:00'), end: az('12:00') },
        { start: az('15:30'), end: az('16:00') },
      ],
    },
  },
};

/** The eight slots the live site actually offered, in the order it showed them. */
const OFFERED = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30'].map(
  (t) => {
    const startUtc = new Date(az(t)).toISOString();
    return {
      startUtc,
      endUtc: new Date(Date.parse(startUtc) + 30 * 60_000).toISOString(),
      available: true, // GoGuruX's own word for it, which is the problem
    };
  },
);

describe('the Thursday that started this', () => {
  test('every slot the site offered is refused', () => {
    const busy = busyFromFreeBusy(THURSDAY);
    assert.equal(filterSlots(OFFERED, busy).length, 0);
  });

  test('specifically the 7:30 he was able to book', () => {
    const busy = busyFromFreeBusy(THURSDAY);
    const half7 = OFFERED.filter((s) => s.startUtc === new Date(az('07:30')).toISOString());
    assert.equal(half7.length, 1, 'fixture lost the 7:30 slot');
    assert.equal(filterSlots(half7, busy).length, 0);
  });

  test("`available: true` from the vendor does not save a slot", () => {
    // The old filter trusted this flag. The diary outranks it.
    const busy = busyFromFreeBusy(THURSDAY);
    assert.equal(filterSlots([{ ...OFFERED[0], available: true }], busy).length, 0);
  });

  test('a slot after "Off" ends is still offered — this is a filter, not a shutter', () => {
    const busy = busyFromFreeBusy(THURSDAY);
    const evening = [{
      startUtc: new Date(az('20:00')).toISOString(),
      endUtc: new Date(az('20:30')).toISOString(),
    }];
    assert.equal(filterSlots(evening, busy).length, 1);
  });
});

describe('conflicts', () => {
  const busy = [{ start: 100, end: 200 }];

  test('back-to-back is not a conflict', () => {
    assert.equal(conflicts({ start: 50, end: 100 }, busy), false);  // ends as it starts
    assert.equal(conflicts({ start: 200, end: 250 }, busy), false); // starts as it ends
  });

  test('a five-minute clip is still a conflict', () => {
    assert.equal(conflicts({ start: 195, end: 260 }, busy), true);
    assert.equal(conflicts({ start: 40, end: 105 }, busy), true);
  });

  test('enclosed, enclosing and identical all conflict', () => {
    assert.equal(conflicts({ start: 120, end: 180 }, busy), true);
    assert.equal(conflicts({ start: 0, end: 500 }, busy), true);
    assert.equal(conflicts({ start: 100, end: 200 }, busy), true);
  });

  test('no busy time means nothing conflicts', () => {
    assert.equal(conflicts({ start: 100, end: 200 }, []), false);
  });
});

describe('busyFromFreeBusy', () => {
  test('an unreadable calendar THROWS rather than reading as free', () => {
    // Google says this when the calendar was never shared with the service
    // account. An empty `busy` would be indistinguishable from a clear day, and
    // treating it as one is how the whole diary gets offered out again.
    assert.throws(
      () => busyFromFreeBusy({
        calendars: { 'brian@example.com': { busy: [], errors: [{ reason: 'notFound' }] } },
      }),
      /unreadable \(notFound\)/,
    );
  });

  test('a missing busy array throws', () => {
    assert.throws(() => busyFromFreeBusy({ calendars: { x: {} } }), /no busy array/);
  });

  test('a response with no calendars throws', () => {
    for (const junk of [null, undefined, {}, 'nope', 42]) {
      assert.throws(() => busyFromFreeBusy(junk), /no calendars/);
    }
  });

  test('a genuinely clear day is an empty list, not an error', () => {
    assert.deepEqual(busyFromFreeBusy({ calendars: { x: { busy: [] } } }), []);
  });

  test('several calendars are pooled', () => {
    const busy = busyFromFreeBusy({
      calendars: {
        a: { busy: [{ start: az('09:00'), end: az('09:30') }] },
        b: { busy: [{ start: az('14:00'), end: az('15:00') }] },
      },
    });
    assert.equal(busy.length, 2);
  });

  test('a zero-length or malformed entry is dropped, not thrown on', () => {
    const busy = busyFromFreeBusy({
      calendars: {
        a: {
          busy: [
            { start: az('09:00'), end: az('09:00') },
            { start: 'not a date', end: az('10:00') },
            { start: az('11:00'), end: az('11:30') },
          ],
        },
      },
    });
    assert.equal(busy.length, 1);
  });
});

describe('mergeIntervals', () => {
  test('overlapping spans become one', () => {
    assert.deepEqual(
      mergeIntervals([{ start: 0, end: 100 }, { start: 50, end: 200 }]),
      [{ start: 0, end: 200 }],
    );
  });

  test('touching spans become one', () => {
    assert.deepEqual(
      mergeIntervals([{ start: 0, end: 100 }, { start: 100, end: 200 }]),
      [{ start: 0, end: 200 }],
    );
  });

  test('a span swallowed by another does not extend it', () => {
    assert.deepEqual(
      mergeIntervals([{ start: 0, end: 500 }, { start: 100, end: 200 }]),
      [{ start: 0, end: 500 }],
    );
  });

  test('separate spans stay separate, in order', () => {
    assert.deepEqual(
      mergeIntervals([{ start: 300, end: 400 }, { start: 0, end: 100 }]),
      [{ start: 0, end: 100 }, { start: 300, end: 400 }],
    );
  });

  test('the input is not mutated', () => {
    const input = [{ start: 0, end: 100 }, { start: 50, end: 200 }];
    mergeIntervals(input);
    assert.equal(input[0].end, 100);
  });
});

describe('filterSlots', () => {
  test('a slot with unparseable times is dropped, never kept', () => {
    const kept = filterSlots(
      [{ startUtc: 'nonsense', endUtc: 'also nonsense' }, { startUtc: az('20:00'), endUtc: az('20:30') }],
      [],
    );
    assert.equal(kept.length, 1);
  });

  test('a backwards slot is dropped', () => {
    assert.equal(filterSlots([{ startUtc: az('10:00'), endUtc: az('09:00') }], []).length, 0);
  });

  test('an empty diary changes nothing', () => {
    assert.equal(filterSlots(OFFERED, []).length, OFFERED.length);
  });
});

describe('dayWindow', () => {
  test('covers the day plus a day either side, so no timezone can clip it', () => {
    const { timeMin, timeMax } = dayWindow('2026-08-20');
    assert.equal(timeMin, '2026-08-19T00:00:00.000Z');
    assert.equal(timeMax, '2026-08-22T00:00:00.000Z');
  });

  test('rejects a day it cannot read', () => {
    assert.throws(() => dayWindow('20th August'), /bad day/);
  });
});
