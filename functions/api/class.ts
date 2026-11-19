/**
 * /api/class — same-origin proxy to the Medicare 101 Class engine
 * (Worker `medicare-class`, repo ~/Documents/GitHub/medicare-class-engine).
 *
 *   GET  ?op=sessions&tz=…        next class times in the visitor's zone
 *   GET  ?op=reg&r=…              what the watch room needs
 *   POST {op:'register', …}       registration → engine (fires X) + lead scoreboard
 *   POST {op:'event', r, type, pos?, text?}   join / progress / complete / book_click / booked / question
 *
 * The engine key never reaches the browser. Env (Pages secrets): CLASS_KEY;
 * TRACK_URL/TRACK_KEY as for /api/lead. Spec: ~/Claude/Projects/medigap-webinar/CONTRACT.md
 */
import { isBot, readAttribution, reportConversion, attributionNote, type TrackEnv } from '../../src/lib/attribution.ts';

interface Env extends TrackEnv { CLASS_KEY?: string; CLASS_ENGINE_URL?: string }
interface Context { request: Request; env: Env; waitUntil?: (p: Promise<unknown>) => void }

const BRAND = '602';
const SITE = '602medicare.com';
const ENGINE = 'https://medicare-class.brianinsuranceservices.workers.dev';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const s = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

export const onRequest = async (context: Context): Promise<Response> => {
  const { request, env } = context;
  const base = env.CLASS_ENGINE_URL || ENGINE;
  const key = env.CLASS_KEY || '';
  if (!key) return json(503, { error: 'not_configured' });
  const url = new URL(request.url);
  const hdr = { 'x-class-key': key, 'content-type': 'application/json' };

  if (request.method === 'GET') {
    const op = url.searchParams.get('op');
    if (op === 'sessions') {
      const r = await fetch(`${base}/sessions?tz=${encodeURIComponent(url.searchParams.get('tz') || 'America/Phoenix')}`);
      return json(r.status, await r.json());
    }
    if (op === 'ics') {
      const id = (url.searchParams.get('r') || '').replace(/[^a-z0-9]/g, '').slice(0, 12);
      const r = await fetch(`${base}/ics/${id}.ics`);
      return new Response(r.body, { status: r.status, headers: {
        'content-type': r.headers.get('content-type') || 'text/calendar; charset=utf-8',
        'content-disposition': 'attachment; filename="medicare-101-class.ics"', 'cache-control': 'no-store' } });
    }
    if (op === 'reg') {
      const id = (url.searchParams.get('r') || '').replace(/[^a-z0-9]/g, '').slice(0, 12);
      const r = await fetch(`${base}/reg/${id}`, { headers: hdr });
      return json(r.status, await r.json());
    }
    return json(400, { error: 'op' });
  }
  if (request.method !== 'POST') return json(405, { error: 'method' });

  const origin = request.headers.get('origin');
  if (origin) {
    let host = '';
    try { host = new URL(origin).host; } catch { host = ''; }
    if (host !== url.host) return json(403, { error: 'origin' });
  }
  let b: any;
  try { b = JSON.parse(await request.text()); } catch { return json(400, { error: 'json' }); }

  if (b?.op === 'event') {
    const r = await fetch(`${base}/event`, {
      method: 'POST', headers: hdr,
      body: JSON.stringify({ r: s(b.r, 12), type: s(b.type, 20), pos: Number(b.pos) || 0, text: s(b.text, 1000) }),
    });
    return json(r.status, await r.json());
  }

  if (b?.op === 'register') {
    const ua = request.headers.get('user-agent');
    if (ua && isBot(ua)) return json(403, { error: 'bot' });
    if (b.website) return json(200, { ok: true }); // honeypot
    const attr = readAttribution(request.headers.get('cookie'));
    const src = [s(b.src, 120), ...attributionNote(attr)].filter(Boolean).join(' · ');
    const r = await fetch(`${base}/register`, {
      method: 'POST', headers: hdr,
      body: JSON.stringify({
        brand: BRAND, first: s(b.first, 60), last: s(b.last, 60), email: s(b.email, 120), phone: s(b.phone, 30),
        zip: s(b.zip, 10), birth: s(b.birth, 20), session_iso: s(b.session_iso, 40), tz: s(b.tz, 64),
        src: src.slice(0, 300), page: s(b.page, 200), test: b.test === true && url.searchParams.get('test') === '1',
      }),
    });
    const body: any = await r.json();
    if (r.ok && body?.ok && !(b.test === true)) {
      const job = reportConversion(env, {
        site: SITE, type: 'lead', attr, page: s(b.page, 200), form: 'Medicare 101 Class',
        contact: { first: s(b.first, 60), last: s(b.last, 60), phone: s(b.phone, 30), email: s(b.email, 120) },
      });
      if (context.waitUntil) context.waitUntil(job); else await job;
    }
    // Hand back only what the confirmation screen needs.
    return json(r.status, body?.ok ? { ok: true, id: body.id, label: body.label, watch_url: body.watch_url } : body);
  }
  return json(400, { error: 'op' });
};

export default { onRequest };
