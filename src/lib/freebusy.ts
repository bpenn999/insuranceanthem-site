/**
 * Subtracting Brian's real diary from whatever the scheduler offers.
 *
 * ── WHY THIS EXISTS (2026-08-18)
 * On Thursday 20 August the booking page offered 7:00, 7:30, 8:00, 8:30, 9:00,
 * 9:30, 10:00 and 10:30 in an unbroken run, while Brian's Google Calendar
 * carried a confirmed event called "Off" from 07:00 to 20:00 Arizona time. The
 * appointment he booked to demonstrate it — 7:30 — sat squarely inside that
 * block. GoGuruX had every one of those hours marked free.
 *
 * The connection to Google is real: a booking made through GoGuruX on
 * 2026-08-17 is sitting on that same calendar. But it runs ONE WAY. Appointments
 * go out to Google; busy time does not come back. Nothing in a static site can
 * change what the scheduler believes, and the scheduler is not going to be
 * argued with from here.
 *
 * So the site stops taking its word for it. `functions/api/availability.ts`
 * fetches the slots, asks Google what Brian is actually doing that day, and
 * drops every slot that lands on something. This file is the arithmetic —
 * pure, no network, no clock — so the rule that matters can be tested rather
 * than hoped at.
 *
 * ── THE RULE
 * A slot survives only if it overlaps NOTHING. Not "starts outside", not
 * "mostly clear" — a half-hour that clips the end of a meeting by five minutes
 * is a half-hour Brian cannot take, and offering it is the whole bug.
 */

/** A half-open interval in epoch milliseconds: `[start, end)`. */
export type Interval = { start: number; end: number };

/** The shape the picker reads, and the only two fields that matter here. */
export type SlotLike = { startUtc: string; endUtc: string };

/**
 * Google's freeBusy response → the busy intervals across every calendar in it.
 *
 * The response is `{ calendars: { <id>: { busy: [{start, end}], errors?: [] } } }`.
 * An `errors` entry on a calendar means Google could not read it — most often
 * the calendar has not been shared with the service account. That is NOT an
 * empty diary and must never be treated as one, so it throws: the caller turns
 * that into a refusal to serve slots at all. A scheduler that quietly forgets to
 * check is the failure this whole file exists to prevent.
 */
export function busyFromFreeBusy(body: unknown): Interval[] {
  const calendars = (body as { calendars?: Record<string, unknown> } | null)?.calendars;
  if (!calendars || typeof calendars !== 'object') {
    throw new Error('freebusy: no calendars in response');
  }

  const out: Interval[] = [];
  for (const [id, value] of Object.entries(calendars)) {
    const cal = value as { busy?: unknown; errors?: unknown } | null;

    const errors = cal?.errors;
    if (Array.isArray(errors) && errors.length) {
      const reason = (errors[0] as { reason?: string })?.reason ?? 'unknown';
      throw new Error(`freebusy: ${id} unreadable (${reason})`);
    }

    if (!Array.isArray(cal?.busy)) {
      throw new Error(`freebusy: ${id} returned no busy array`);
    }

    for (const b of cal.busy as Array<{ start?: string; end?: string }>) {
      const start = Date.parse(String(b?.start));
      const end = Date.parse(String(b?.end));
      // A malformed or zero-length entry is dropped rather than thrown on: it
      // cannot block anything, and one odd row should not close the calendar.
      if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
        out.push({ start, end });
      }
    }
  }
  return out;
}

/**
 * Merge overlapping and touching intervals, so the filter below does less work
 * and so a day's busy time can be logged as a handful of spans rather than
 * forty fragments.
 */
export function mergeIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length < 2) return [...intervals];
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  // Copied, not aliased: the loop below writes to `last.end`, and without this
  // the first interval the CALLER handed in gets silently widened.
  const out: Interval[] = [{ ...sorted[0] }];
  for (const next of sorted.slice(1)) {
    const last = out[out.length - 1];
    if (next.start <= last.end) {
      last.end = Math.max(last.end, next.end);
    } else {
      out.push({ ...next });
    }
  }
  return out;
}

/**
 * Does `slot` touch any of `busy`?
 *
 * Half-open on both sides, which is the one detail worth being deliberate
 * about: a 9:00–9:30 slot against a 9:30–10:00 meeting does NOT overlap. Back-to-back
 * is not a conflict, and treating it as one would quietly delete a working slot
 * from every day that has an appointment in it.
 */
export function conflicts(slot: Interval, busy: Interval[]): boolean {
  return busy.some((b) => slot.start < b.end && b.start < slot.end);
}

/**
 * The slots that survive the diary.
 *
 * A slot whose timestamps do not parse is DROPPED, not kept. It cannot be
 * checked against anything, and an unverifiable slot is exactly the kind this
 * function exists to refuse.
 */
export function filterSlots<T extends SlotLike>(slots: T[], busy: Interval[]): T[] {
  const merged = mergeIntervals(busy);
  return slots.filter((s) => {
    const start = Date.parse(s?.startUtc);
    const end = Date.parse(s?.endUtc);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false;
    return !conflicts({ start, end }, merged);
  });
}

/** The UTC day window for a "YYYY-MM-DD", widened by `padHours` at each end. */
export function dayWindow(day: string, padHours = 24): { timeMin: string; timeMax: string } {
  const base = Date.parse(`${day}T00:00:00Z`);
  if (!Number.isFinite(base)) throw new Error(`freebusy: bad day ${day}`);
  const pad = padHours * 3_600_000;
  return {
    timeMin: new Date(base - pad).toISOString(),
    timeMax: new Date(base + 86_400_000 + pad).toISOString(),
  };
}
