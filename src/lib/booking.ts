/**
 * Booking-picker arithmetic — the parts that are worth testing on their own.
 *
 * The picker itself lives in src/components/BookingPicker.astro. Everything in
 * here is pure: no DOM, no fetch, no clock of its own. Anything that reads
 * "today" takes it as an argument, so the unit tests can pin it.
 *
 * WHY A DATE STRING AND NOT A `Date` runs through the whole file: the calendar
 * this drives is in one timezone (America/Denver), the market it serves is in
 * another (America/Phoenix, which never observes DST), and the visitor's
 * browser is in a third. A `Date` carries an instant, not a day, and every
 * "which day is this?" bug on a scheduler comes from letting those two ideas
 * blur. So a *day* is always the string "YYYY-MM-DD", built and compared in the
 * display timezone, and an *instant* is always a UTC ISO string from the API.
 */

/** The market's timezone. Arizona does not observe DST, so this is MST year round. */
export const DISPLAY_TZ = 'America/Phoenix';

/** How the timezone is named to a visitor. */
export const DISPLAY_TZ_LABEL = 'Arizona time';

/**
 * U+00A0, written as an escape rather than typed.
 *
 * A literal non-breaking space in source is invisible in every diff and every
 * editor, and the tests that assert on it would then be asserting against a
 * character nobody can see. Named and escaped, it is reviewable.
 */
const NBSP = '\u00A0';

export type DayCell = {
  /** "YYYY-MM-DD" */
  date: string;
  /** Day of the month, 1–31 */
  day: number;
  /** False for the leading/trailing blanks that pad the grid to whole weeks. */
  inMonth: boolean;
  /** Past, or a weekday the calendar never takes bookings on. */
  disabled: boolean;
  /** Today, in the display timezone. */
  isToday: boolean;
};

/**
 * "YYYY-MM-DD" for an instant, as read in `tz`.
 *
 * en-CA is not an affectation — it is the only widely-supported locale whose
 * short date format is already ISO order, so this needs no reassembly.
 */
export function isoDayIn(instant: Date, tz: string = DISPLAY_TZ): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant);
}

/** "2026-08-11" → { y: 2026, m: 7, d: 11 } (m is 0-based, like Date). */
export function parseDay(day: string): { y: number; m: number; d: number } {
  const [y, m, d] = day.split('-').map(Number);
  return { y, m: m - 1, d };
}

/** { 2026, 7, 11 } → "2026-08-11" */
export function formatDay(y: number, m: number, d: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

/**
 * Day of the week for a day string, 0 = Sunday.
 *
 * Built through `Date.UTC` on purpose: `new Date("2026-08-11")` is parsed as
 * UTC midnight but `new Date(2026, 7, 11)` as local midnight, and west of
 * Greenwich the first of those lands on the previous day. Neither is wanted
 * here — this is pure calendar arithmetic with no instant involved.
 */
export function weekdayOf(day: string): number {
  const { y, m, d } = parseDay(day);
  return new Date(Date.UTC(y, m, d)).getUTCDay();
}

/** Shift a "YYYY-MM-01"-style month by `n` months, clamping the day to the 1st. */
export function shiftMonth(y: number, m: number, n: number): { y: number; m: number } {
  const total = y * 12 + m + n;
  return { y: Math.floor(total / 12), m: ((total % 12) + 12) % 12 };
}

/**
 * The full month grid: whole weeks, Sunday-first, padded with out-of-month
 * blanks so the cells always line up under their weekday headers.
 *
 * `bookableWeekdays` comes from the calendar itself (`[1,2,3,4,5]` — Mon–Fri).
 * A day is disabled if it is in the past, is not a bookable weekday, or has
 * been proven empty by a lookup that came back with no slots.
 */
export function monthGrid(
  year: number,
  month: number,
  opts: {
    today: string;
    bookableWeekdays: number[];
    /** Days proven to have no slots left, e.g. a fully-booked Tuesday. */
    soldOut?: Set<string> | string[];
    /** How far ahead the calendar accepts bookings. Days beyond it are disabled. */
    maxDay?: string;
  },
): DayCell[] {
  const { today, bookableWeekdays, maxDay } = opts;
  const soldOut = opts.soldOut instanceof Set ? opts.soldOut : new Set(opts.soldOut ?? []);

  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: DayCell[] = [];

  // Leading blanks, back-filled with the tail of the previous month so the
  // cells are never empty boxes a screen reader has to guess at.
  const prev = shiftMonth(year, month, -1);
  const daysInPrev = new Date(Date.UTC(prev.y, prev.m + 1, 0)).getUTCDate();
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    cells.push({
      date: formatDay(prev.y, prev.m, d),
      day: d,
      inMonth: false,
      disabled: true,
      isToday: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = formatDay(year, month, d);
    const past = date < today;
    const tooFar = maxDay ? date > maxDay : false;
    const wrongDay = !bookableWeekdays.includes(weekdayOf(date));
    cells.push({
      date,
      day: d,
      inMonth: true,
      disabled: past || tooFar || wrongDay || soldOut.has(date),
      isToday: date === today,
    });
  }

  // Trailing blanks to complete the final week.
  const next = shiftMonth(year, month, 1);
  let d = 1;
  while (cells.length % 7 !== 0) {
    cells.push({
      date: formatDay(next.y, next.m, d),
      day: d,
      inMonth: false,
      disabled: true,
      isToday: false,
    });
    d++;
  }

  return cells;
}

/**
 * The next `count` days a visitor could actually book, starting at `from`.
 *
 * Used to warm the availability lookups in the background so a fully-booked day
 * is greyed out before someone taps it, rather than after. Bounded on purpose:
 * every entry is one request to a third party, so this covers the window people
 * actually book in rather than the whole month.
 */
export function nextBookableDays(
  from: string,
  bookableWeekdays: number[],
  count: number,
  horizonDays = 60,
): string[] {
  const out: string[] = [];
  const { y, m, d } = parseDay(from);
  const cursor = new Date(Date.UTC(y, m, d));
  for (let i = 0; i < horizonDays && out.length < count; i++) {
    const day = formatDay(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate());
    if (bookableWeekdays.includes(cursor.getUTCDay())) out.push(day);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}

/* ─────────────────────────────────────────────────────────────────────────
   MOM'S FEED, PORTED (2026-08-18)

   Medicare On Main spent a day on exactly this bug and landed somewhere
   different from where this file started, so the difference is worth stating
   plainly, because it is the whole fix:

     · THIS SITE asked GoGuruX for a day's slots and then filtered them —
       `slots.filter(s => s.available !== false)`. A slot the vendor returns
       WITHOUT saying anything about its availability therefore passes straight
       through and is offered to a visitor. That is how times Brian had blocked
       in Google Calendar came to be bookable.

     · MOM asks GoHighLevel's free-slots feed, which lists ONLY what is free —
       days with no times are simply absent — and renders exactly what it is
       handed. There is no flag to misread, and nothing can be offered that the
       vendor did not positively name as free.

   The second rule is the one that cannot go wrong: TRUST ONLY WHAT IS
   POSITIVELY LISTED. Never open a day by rule and close it by evidence; open
   nothing, and let the feed open what it will. Everything below implements
   that, and it is pure so it can be tested without a network.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * GoHighLevel's free-slots endpoint answers with nothing at all when the range
 * it is given exceeds a month (MOM verified 2026-08-13: 31 days returns the
 * full set, 32 days returns `{traceId}` and no days). Every request is clamped
 * to this.
 */
export const MAX_RANGE_DAYS = 31;

/** Days in a calendar month. `day 0` of the next month is the last of this one. */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/**
 * The `startDate`/`endDate` window for one month's free-slots request, in ms.
 *
 * Starts at today rather than the 1st when the month is the current one —
 * asking about days already gone wastes the range — and never spans more than
 * `MAX_RANGE_DAYS`, past which the endpoint returns nothing at all rather than
 * an error, which is the failure mode most likely to be read as "no
 * availability" instead of "the request was malformed".
 */
export function monthWindow(
  year: number,
  month: number,
  today: string,
): { startMs: number; endMs: number } {
  const first = formatDay(year, month, 1);
  const from = first < today ? today : first;
  const { y, m, d } = parseDay(from);
  const startMs = Date.UTC(y, m, d);

  const spanEnd = Date.UTC(year, month, daysInMonth(year, month), 23, 59, 59);
  const capped = startMs + MAX_RANGE_DAYS * 86_400_000;
  return { startMs, endMs: Math.min(spanEnd, capped) };
}

/**
 * The free-slots response → day → slot start instants.
 *
 * The body is keyed by "YYYY-MM-DD" and carries a `traceId` alongside the days,
 * which is why the keys are matched against a date shape rather than simply
 * iterated. A day with an empty `slots` array is dropped, so **the returned
 * map's key set IS the set of bookable days** — no separate "sold out" bookkeeping,
 * and no weekday rule that could open a day the feed never offered.
 *
 * Anything unrecognised yields an empty map rather than a throw. An empty
 * calendar is a visible, honest state that still shows the phone number; a
 * throw would fall back to the embed, which is also fine — but the caller
 * should be the one deciding that, from a shape it can see.
 */
export function parseFreeSlots(body: unknown): Map<string, string[]> {
  const days = new Map<string, string[]>();
  if (!body || typeof body !== 'object') return days;

  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) continue; // skips `traceId`
    const raw = (v as { slots?: unknown } | null)?.slots;
    const slots = Array.isArray(raw) ? raw.map(String).filter(Boolean) : [];
    if (slots.length) days.set(k, slots);
  }
  return days;
}

/**
 * The month grid, drawn from a free-slots map rather than from a weekday rule.
 *
 * The companion to `monthGrid` above, and the difference between them is the
 * point: `monthGrid` enables a day unless something proves it unbookable, while
 * this enables a day only when the feed named it. Anything the vendor did not
 * list — a bank holiday, a day Brian blocked out, a morning that filled while
 * the page was open — is shut, without this file needing to know why.
 */
export function monthGridFromFeed(
  year: number,
  month: number,
  opts: { today: string; days: Map<string, string[]> },
): DayCell[] {
  const { today, days } = opts;
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const cells: DayCell[] = [];

  const prev = shiftMonth(year, month, -1);
  const daysInPrev = daysInMonth(prev.y, prev.m);
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    cells.push({
      date: formatDay(prev.y, prev.m, d),
      day: d,
      inMonth: false,
      disabled: true,
      isToday: false,
    });
  }

  for (let d = 1; d <= daysInMonth(year, month); d++) {
    const date = formatDay(year, month, d);
    cells.push({
      date,
      day: d,
      inMonth: true,
      // The whole rule, in one line.
      disabled: !days.has(date) || date < today,
      isToday: date === today,
    });
  }

  const next = shiftMonth(year, month, 1);
  let d = 1;
  while (cells.length % 7 !== 0) {
    cells.push({
      date: formatDay(next.y, next.m, d),
      day: d,
      inMonth: false,
      disabled: true,
      isToday: false,
    });
    d++;
  }
  return cells;
}

/** "9:00 AM" for an instant, read in the display timezone. */
export function formatSlotTime(startUtc: string, tz: string = DISPLAY_TZ): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(new Date(startUtc))
    // Non-breaking space between the minutes and the meridiem so "9:00 AM"
    // never wraps across two lines inside a button.
    .replace(/\s/g, NBSP);
}

/** "Tuesday, August 11" for a day string. */
export function formatDayLong(day: string): string {
  const { y, m, d } = parseDay(day);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(Date.UTC(y, m, d)));
}

/** "August 2026" for a month header. */
export function formatMonthLong(year: number, month: number): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month, 1)));
}

/**
 * "9:00 AM – 9:30 AM" for a slot, read in the display timezone.
 *
 * An en dash with ordinary spaces around it, not the non-breaking spaces
 * `formatSlotTime` uses — this string is read in a sentence, not squeezed into
 * a button.
 */
export function formatSlotRange(
  slot: { startUtc: string; endUtc: string },
  tz: string = DISPLAY_TZ,
): string {
  const t = (v: string) => formatSlotTime(v, tz).replaceAll(NBSP, ' ');
  return `${t(slot.startUtc)} – ${t(slot.endUtc)}`;
}

/**
 * A phone number is enough on its own, and so is an email — but one of the two
 * has to be there, because the API rejects a booking with neither and there
 * would be no way to reach whoever made it.
 */
export function validateDetails(d: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}): { ok: true } | { ok: false; field: string; message: string } {
  if (!d.firstName.trim()) {
    return { ok: false, field: 'firstName', message: 'Please enter your first name.' };
  }
  if (!d.lastName.trim()) {
    return { ok: false, field: 'lastName', message: 'Please enter your last name.' };
  }
  if (!d.phone.trim() && !d.email.trim()) {
    return {
      ok: false,
      field: 'phone',
      message: 'Please enter a phone number or an email address so we can reach you.',
    };
  }
  if (d.phone.trim() && d.phone.replace(/\D/g, '').length < 10) {
    return { ok: false, field: 'phone', message: 'Please enter a 10-digit phone number.' };
  }
  if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) {
    return { ok: false, field: 'email', message: 'Please check the email address.' };
  }
  return { ok: true };
}
