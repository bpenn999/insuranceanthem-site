/**
 * GET /api/availability?date=YYYY-MM-DD — the slots, from the feed that is
 * actually in step with Brian's calendar.
 *
 * ── WHY THIS ROUTE EXISTS (2026-08-18)
 * On Thursday 20 August 602medicare.com offered an unbroken run of half-hours
 * from 7:00 while Brian's Google Calendar carried a confirmed "Off" from 07:00
 * to 20:00 Arizona. He booked the 7:30 to prove it. GoGuruX's availability had
 * every one of those hours marked free.
 *
 * Medicare On Main, the same person and the same diary, greyed that Thursday
 * out. It reads a different feed:
 *
 *   GET backend.leadconnectorhq.com/calendars/{id}/free-slots
 *       ?startDate={ms}&endDate={ms}&timezone={tz}
 *
 * Unauthenticated, CORS-open, and it lists ONLY what is free — a day with
 * nothing on it is simply absent from the response. Asked for 18–31 August it
 * answered 18, 25, 26, 27, 28 and 31 and **no 20th**, which is exactly what
 * MOM's own date grid shows (verified 2026-08-18). The gaps inside those days
 * are Brian's existing appointments.
 *
 * So this route reads slots from there and stops asking GoGuruX for them. The
 * booking itself is still written to GoGuruX, which is MOM's arrangement
 * exactly: READ from the feed that honours the diary, WRITE where the diary
 * lives. GoGuruX is still asked for the calendar object, because the id on it
 * is what create-booking needs — but never again for what is free.
 *
 * ── WHY THE LOOP CLOSES
 * A booking made here goes to GoGuruX, GoGuruX puts it on Brian's Google
 * Calendar (a booking made on 2026-08-17 is sitting on it), and free-slots
 * reads Google. So a slot taken through this site disappears from this feed.
 *
 * ── FAILING CLOSED
 * If the feed cannot be read this answers 502 and NO slots — it never falls
 * back to GoGuruX's unfiltered list, which is the whole reason this file
 * exists. The picker then shows GoGuruX's widget and the phone number.
 *
 * GOOGLE_SERVICE_ACCOUNT_JSON is OPTIONAL and off by default. Set it and the
 * route subtracts Google's own busy list as a second, independent check. Left
 * unset — the normal case — the feed above is trusted on its own, because it
 * has been shown to be right. A configured-but-failing credential is logged and
 * skipped rather than closing the calendar: the primary source is sound, and
 * taking the site's booking offline over a secondary check would be its own
 * outage.
 *
 * ── THE CONTRACT the picker depends on, pinned by scripts/e2e.mjs
 *   200 { success: true, calendar, slots, filtered }  — free per the feed
 *   400 { success: false }  — no date, or one that is not YYYY-MM-DD
 *   405 { success: false }  — anything that is not a GET
 *   502 { success: false }  — the feed or the calendar lookup failed
 */

import {
  busyFromFreeBusy,
  dayWindow,
  filterSlots,
  mergeIntervals,
  type Interval,
} from '../../src/lib/freebusy.ts';
import { parseFreeSlots } from '../../src/lib/booking.ts';

interface Env {
  /**
   * The whole service-account JSON, pasted in. Secret — Pages → Settings →
   * Environment variables → Production. Only `client_email` and `private_key`
   * are read.
   */
  GOOGLE_SERVICE_ACCOUNT_JSON?: string;
  /**
   * Whose diary to check. Defaults to the calendar the bookings already land
   * on, which is the one that had "Off" on it.
   */
  GOOGLE_CALENDAR_ID?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const GOGURUX = 'https://roiypxggqlgbzrspkeoo.supabase.co';

/**
 * The same public anon key the browser used to send, and that GoGuruX ships in
 * its own widget to every visitor. It is not a secret and never was; it lives
 * here rather than in an env var because pretending otherwise would only make
 * it harder to find.
 */
const GOGURUX_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvaXlweGdncWxnYnpyc3BrZW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNDY3NTUsImV4cCI6MjA2MTYyMjc1NX0.KBULK0GoGRIXOW0uRFya8kLuiXaxpTsA5RW2tUlDOPY';

const LOCATION_SLUG = 'medicareonmain-com';
const CALENDAR_SLUG = '602-medicare';
const DEFAULT_CALENDAR_ID = 'brianinsuranceservices@gmail.com';

/** The availability feed. Public, unauthenticated, CORS-open. */
const FREE_SLOTS_API = 'https://backend.leadconnectorhq.com';

/**
 * The calendar whose free time this site offers.
 *
 * `📞 PHONE APPOINTMENT` — Brian's phone calendar, 9:00–17:00 Mountain,
 * Monday to Friday, and the one MOM books phone calls against. It is his diary,
 * not a second one: 602Medicare is the same advisor taking the same calls, so
 * its free time IS this site's free time. Reading it is what makes a day he has
 * blocked disappear from this site too.
 *
 * ⚠️ NOT `spMuN10Xch53LxXzOgcF` ("15 - Minute Call"). MOM pointed at that one
 * until 2026-08-17 and moved off it: 11 appointments to this one's 276, and
 * none of the hours, team assignment or meeting-format work was ever done on
 * it. Whatever a CTA on this site says about fifteen minutes, do not "correct"
 * this to match the name.
 */
const FREE_SLOTS_CALENDAR = '8CcYJMIVgaxb2XBKcKtk';

/** Arizona, which never observes DST — see src/lib/booking.ts. */
const DISPLAY_TZ = 'America/Phoenix';

/** Fallback slot length when the calendar object does not state one. */
const DEFAULT_MINUTES = 30;

/** Both upstreams together must stay well under a visitor's patience. */
const TIMEOUT_MS = 8_000;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Availability is stale the moment someone else books. Never cache it.
      'Cache-Control': 'no-store',
    },
  });

/* ── Google auth ────────────────────────────────────────────────────────────
   A service account, signed here rather than via a library, because Workers
   have WebCrypto and this is forty lines. The alternative — an OAuth refresh
   token — needs a browser round trip nobody can perform on a deploy. */

/** base64url without padding, which is what JWT wants. */
const b64url = (bytes: ArrayBuffer | Uint8Array): string => {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (const byte of b) s += String.fromCharCode(byte);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const b64urlText = (text: string) => b64url(new TextEncoder().encode(text));

/**
 * PEM → the DER bytes WebCrypto wants for PKCS#8.
 *
 * Returns the ArrayBuffer rather than the view: `importKey` wants a
 * `BufferSource` backed by a plain ArrayBuffer, and a bare `new Uint8Array(n)`
 * is typed loosely enough (`ArrayBufferLike`, which admits SharedArrayBuffer)
 * that it does not satisfy it.
 */
function pemToBytes(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN [^-]+-----/, '')
    .replace(/-----END [^-]+-----/, '')
    .replace(/\s+/g, '');
  const raw = atob(body);
  const buffer = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return buffer;
}

/**
 * A Google access token for the read-only calendar scope.
 *
 * `private_key` arrives from the JSON with literal `\n` sequences when it has
 * been pasted through a dashboard field, so those are turned back into real
 * newlines before parsing — the single most common reason this step fails.
 */
async function googleToken(saJson: string): Promise<string> {
  let sa: { client_email?: string; private_key?: string };
  try {
    sa = JSON.parse(saJson);
  } catch {
    throw new Error('service account JSON does not parse');
  }
  if (!sa.client_email || !sa.private_key) {
    throw new Error('service account JSON has no client_email/private_key');
  }

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const unsigned =
    `${b64urlText(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64urlText(JSON.stringify(claim))}`;

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToBytes(sa.private_key.replace(/\\n/g, '\n')),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsigned),
  );

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${b64url(sig)}`,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; error?: string };
  if (!res.ok || !body.access_token) {
    throw new Error(`token exchange ${res.status} ${body.error ?? ''}`.trim());
  }
  return body.access_token;
}

/** Google's busy intervals for the day, widened so no timezone can clip it. */
async function googleBusy(env: Env, day: string): Promise<Interval[]> {
  const token = await googleToken(env.GOOGLE_SERVICE_ACCOUNT_JSON!);
  const calendarId = env.GOOGLE_CALENDAR_ID || DEFAULT_CALENDAR_ID;
  const { timeMin, timeMax } = dayWindow(day);

  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: calendarId }] }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`freebusy ${res.status}`);
  // Throws on an unreadable calendar rather than reading it as a clear day.
  return busyFromFreeBusy(await res.json());
}

/* ── the feed ───────────────────────────────────────────────────────────── */

/**
 * The day's free slots, as start instants, from the free-slots feed.
 *
 * The feed is keyed by day and only carries days that have times, so a day
 * Brian has blocked is simply not in the answer and this returns nothing for
 * it. `parseFreeSlots` skips the `traceId` that rides alongside the days.
 *
 * The window is the requested day in Arizona, which is the timezone the feed is
 * asked to answer in, so the keys come back as the same day string that was
 * asked for.
 */
async function freeSlots(day: string): Promise<string[]> {
  const startMs = Date.parse(`${day}T00:00:00-07:00`);
  if (!Number.isFinite(startMs)) throw new Error(`bad day ${day}`);
  const endMs = startMs + 86_400_000 - 1;

  const q = new URLSearchParams({
    startDate: String(startMs),
    endDate: String(endMs),
    timezone: DISPLAY_TZ,
  });
  const res = await fetch(
    `${FREE_SLOTS_API}/calendars/${FREE_SLOTS_CALENDAR}/free-slots?${q}`,
    { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT_MS) },
  );
  if (!res.ok) throw new Error(`free-slots ${res.status}`);

  const days = parseFreeSlots(await res.json());
  return days.get(day) ?? [];
}

/* ── the route ──────────────────────────────────────────────────────────── */

export const onRequest = async ({ request, env }: Context): Promise<Response> => {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ success: false, error: 'method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json; charset=utf-8', Allow: 'GET' },
    });
  }

  const day = new URL(request.url).searchParams.get('date') ?? '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return json(400, { success: false, error: 'date must be YYYY-MM-DD' });
  }

  // The feed says what is free; GoGuruX is asked only for the calendar object,
  // because create-booking needs the id on it. Neither depends on the other.
  const [slotsResult, calendarResult] = await Promise.allSettled([
    freeSlots(day),
    (async () => {
      const q = new URLSearchParams({
        date: day,
        duration: String(DEFAULT_MINUTES),
        location_slug: LOCATION_SLUG,
        calendar_slug: CALENDAR_SLUG,
      });
      const res = await fetch(`${GOGURUX}/functions/v1/get-availability?${q}`, {
        headers: { Authorization: `Bearer ${GOGURUX_ANON}`, apikey: GOGURUX_ANON },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`get-availability ${res.status}`);
      const body = (await res.json()) as { calendar?: { slot_duration?: number } };
      // NOTE: body.slots is deliberately IGNORED. It is the list that offered a
      // day Brian had blocked out, and nothing here reads it again.
      if (!body?.calendar) throw new Error('get-availability returned no calendar');
      return body.calendar;
    })(),
  ]);

  // ⚠️ No feed, no slots. Never a fall-through to the list this route replaced.
  if (slotsResult.status === 'rejected') {
    console.error('availability: free-slots failed, withholding —', String(slotsResult.reason));
    return json(502, { success: false, error: 'availability unavailable' });
  }
  if (calendarResult.status === 'rejected') {
    console.error('availability: calendar lookup failed —', String(calendarResult.reason));
    return json(502, { success: false, error: 'scheduler unavailable' });
  }

  const minutes = Number(calendarResult.value?.slot_duration) || DEFAULT_MINUTES;
  const raw = slotsResult.value
    .map((iso) => {
      const start = Date.parse(iso);
      if (!Number.isFinite(start)) return null;
      return {
        startUtc: new Date(start).toISOString(),
        endUtc: new Date(start + minutes * 60_000).toISOString(),
        available: true,
      };
    })
    .filter((s): s is { startUtc: string; endUtc: string; available: true } => s !== null);

  // The optional second opinion. Unset is the normal case and not a failure;
  // configured-but-broken is logged and skipped rather than closing the
  // calendar, because the feed above is already the trustworthy source.
  let slots = raw;
  let busy: Interval[] = [];
  if (env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      busy = await googleBusy(env, day);
      slots = filterSlots(raw, busy);
    } catch (err) {
      console.error('availability: optional diary check skipped —', String(err));
    }
  }

  const dropped = raw.length - slots.length;
  if (dropped > 0) {
    console.log(
      `availability ${day}: diary check withheld ${dropped}/${raw.length} slot(s) the ` +
        `feed still listed, against ${mergeIntervals(busy).length} busy span(s)`,
    );
  }

  return json(200, {
    success: true,
    calendar: calendarResult.value,
    slots,
    filtered: { offered: raw.length, withheld: dropped },
  });
};
