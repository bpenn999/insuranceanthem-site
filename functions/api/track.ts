/**
 * POST /api/track — conversion reporting to the lead scoreboard.
 *
 * The browser tells this route about the two conversions that never pass
 * through /api/lead:
 *
 *   booking     the picker writes appointments straight to GoGuruX from the
 *               browser, so the server only hears about one if it is told
 *   call_click  a tap on the phone number
 *
 * and this route forwards them to the scoreboard — a separate Worker that
 * counts leads, bookings and shows per channel — with the visitor's
 * attribution, read from the cookie src/components/Attribution.astro wrote.
 * Form leads are reported by /api/lead itself.
 *
 * Environment (Pages → Settings → Variables and secrets → Production):
 *   TRACK_URL   the scoreboard's ingest URL
 *   TRACK_KEY   the shared ingest key
 * Unset means tracking is off, and this route does nothing, successfully.
 *
 * It answers 204 to every well-formed request. Nothing the visitor does
 * depends on the answer, and a reporting failure is nobody's error to see.
 */
import {
  isBot, readAttribution, reportConversion, type Conversion, type TrackEnv,
} from '../../src/lib/attribution.ts';

interface Context {
  request: Request;
  env: TrackEnv;
  waitUntil?: (p: Promise<unknown>) => void;
}

const SITE = '602medicare.com';
const text = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
const done = (status = 204, headers: Record<string, string> = {}) =>
  new Response(null, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

export const onRequest = async (context: Context): Promise<Response> => {
  const { request, env } = context;
  if (request.method !== 'POST') return done(405, { Allow: 'POST' });

  // Same-origin only, the same rule /api/lead applies.
  const origin = request.headers.get('origin');
  if (origin) {
    let host = '';
    try { host = new URL(origin).host; } catch { host = ''; }
    if (host !== new URL(request.url).host) return done(403);
  }
  if (isBot(request.headers.get('user-agent'))) return done();

  let b: any;
  try { b = JSON.parse(await request.text()); } catch { return done(400); }
  const type = b?.type;
  if (type !== 'booking' && type !== 'call_click') return done(422);

  const event: Conversion = {
    site: SITE,
    type,
    attr: readAttribution(request.headers.get('cookie')),
    page: text(b.page, 200),
    form: text(b.form, 80),
  };
  if (type === 'booking') {
    const start = text(b.appt?.start, 40);
    if (!start || Number.isNaN(Date.parse(start))) return done(422);
    event.contact = {
      first: text(b.contact?.first, 60), last: text(b.contact?.last, 60),
      phone: text(b.contact?.phone, 30), email: text(b.contact?.email, 120),
    };
    event.appt = { start, kind: text(b.appt?.kind, 80), ref: text(b.appt?.ref, 80) };
  }

  const job = reportConversion(env ?? {}, event);
  if (context.waitUntil) context.waitUntil(job); else await job;
  return done();
};

export default { onRequest };
