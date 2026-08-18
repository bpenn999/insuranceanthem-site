/**
 * GET /api/availability?date=YYYY-MM-DD — the slots, minus Brian's actual diary.
 *
 * ── WHY THIS ROUTE EXISTS (2026-08-18)
 * On Thursday 20 August the booking page offered an unbroken run of half-hours
 * from 7:00, and Brian's Google Calendar carried a confirmed "Off" from 07:00 to
 * 20:00 Arizona. He booked 7:30 to prove it. GoGuruX had every one of those
 * hours marked free.
 *
 * The Google connection is real — a booking made through GoGuruX on 2026-08-17
 * is sitting on that calendar — but for this calendar it runs ONE WAY:
 * appointments go out, busy time does not come back. That is a setting inside a
 * platform this site cannot reach and has no API for.
 *
 * So the page stops taking the scheduler's word for it. It asks this route, and
 * this route asks Google. A slot that lands on anything in the diary is dropped
 * before the browser ever sees it. Whatever GoGuruX believes, the site cannot
 * offer a time Brian is not free.
 *
 * ── IT FAILS CLOSED, AND THAT IS THE POINT
 * If Google cannot be reached, or the calendar has not been shared, or the
 * credential is wrong, this answers 503 and NO slots. It never falls through to
 * the unfiltered list. The picker then shows GoGuruX's own widget and the phone
 * number, which is a visible, ordinary state — where quietly serving unchecked
 * slots is the exact failure this route was built to end.
 *
 * The one deliberate exception is being UNCONFIGURED. With no service-account
 * credential set, this answers 501 and the site behaves exactly as it did
 * before — no worse, no pretending. See README for the six lines of setup.
 *
 * ── THE CONTRACT the picker depends on, pinned by scripts/e2e.mjs
 *   200 { success: true, calendar, slots, filtered }  — checked against the diary
 *   400 { success: false }  — no date, or one that is not YYYY-MM-DD
 *   405 { success: false }  — anything that is not a GET
 *   501 { success: false }  — no Google credential configured here
 *   502 { success: false }  — GoGuruX refused, timed out, or answered nonsense
 *   503 { success: false }  — the diary could not be read; slots withheld
 */

import {
  busyFromFreeBusy,
  dayWindow,
  filterSlots,
  mergeIntervals,
  type Interval,
} from '../../src/lib/freebusy.ts';

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

  // Unconfigured is not a failure, it is "not switched on yet". Say so plainly
  // and let the picker fall back, rather than serving slots nobody checked.
  if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.error('GOOGLE_SERVICE_ACCOUNT_JSON is not set — availability not filtered, none served');
    return json(501, { success: false, error: 'diary check not configured' });
  }

  // The scheduler's answer, and the diary, fetched together — one is useless
  // without the other and neither depends on the other's result.
  const [slotsResult, busyResult] = await Promise.allSettled([
    (async () => {
      const q = new URLSearchParams({
        date: day,
        duration: '30',
        location_slug: LOCATION_SLUG,
        calendar_slug: CALENDAR_SLUG,
      });
      const res = await fetch(`${GOGURUX}/functions/v1/get-availability?${q}`, {
        headers: { Authorization: `Bearer ${GOGURUX_ANON}`, apikey: GOGURUX_ANON },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`get-availability ${res.status}`);
      const body = await res.json();
      if (!(body as { success?: boolean })?.success) throw new Error('get-availability not ok');
      return body as { calendar?: unknown; slots?: unknown };
    })(),
    googleBusy(env, day),
  ]);

  if (slotsResult.status === 'rejected') {
    console.error('availability: upstream failed —', String(slotsResult.reason));
    return json(502, { success: false, error: 'scheduler unavailable' });
  }

  // ⚠️ THE LINE THAT MATTERS. No diary, no slots. Not "serve them anyway".
  if (busyResult.status === 'rejected') {
    console.error('availability: diary unreadable, withholding slots —', String(busyResult.reason));
    return json(503, { success: false, error: 'diary unavailable' });
  }

  const raw = Array.isArray(slotsResult.value.slots)
    ? (slotsResult.value.slots as Array<{ startUtc: string; endUtc: string }>)
    : [];
  const slots = filterSlots(raw, busyResult.value);

  const dropped = raw.length - slots.length;
  if (dropped > 0) {
    console.log(
      `availability ${day}: withheld ${dropped}/${raw.length} slot(s) against ` +
        `${mergeIntervals(busyResult.value).length} busy span(s)`,
    );
  }

  return json(200, {
    success: true,
    calendar: slotsResult.value.calendar ?? null,
    slots,
    // So a human reading the network tab can see the guard did something.
    filtered: { offered: raw.length, withheld: dropped },
  });
};
