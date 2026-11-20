/**
 * POST /api/capi — Meta Conversions API relay (added 2026-11-20).
 *
 * Why: a booking from the Medigap same-letter ad (Crystal Hall, 11/19) never
 * reached Ads Manager because her browser blocked the Meta pixel. The pixel
 * still fires where it can; this route sends the SAME event from the server
 * with the SAME event_id, so Meta de-duplicates when both arrive and still
 * counts it when only this one does.
 *
 * The browser posts { event_name, event_id, email, phone, first, last, zip,
 * fbc, fbp, source_url, content_name }. Contact fields are normalised and
 * SHA-256 hashed here before they leave the server, as Meta requires. IP and
 * user agent come from the request itself.
 *
 * Environment (Pages → Settings → Variables and secrets → Production):
 *   FB_CAPI_TOKEN   dataset access token (Events Manager → Turning 65 → Settings)
 *   FB_PIXEL_ID     optional, defaults to 1480958159463999 ("Turning 65")
 *   FB_TEST_CODE    optional; when set, events go to Test Events only
 * No token = this route does nothing, successfully (204).
 */
interface Env { FB_CAPI_TOKEN?: string; FB_PIXEL_ID?: string; FB_TEST_CODE?: string }
interface Context { request: Request; env: Env; waitUntil?: (p: Promise<unknown>) => void }

const ALLOWED = new Set(['Lead', 'Schedule', 'CompleteRegistration', 'Contact']);
const str = (v: unknown, n = 200) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

async function sha256(v: string): Promise<string | undefined> {
  if (!v) return undefined;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const onRequest = async ({ request, env, waitUntil }: Context): Promise<Response> => {
  if (request.method !== 'POST') return json(405, { error: 'method' });
  if (!env.FB_CAPI_TOKEN) return new Response(null, { status: 204 });

  // Same-site posts only: the page that fired the pixel is the one asking.
  const origin = request.headers.get('Origin') || '';
  if (origin && !/^https:\/\/([a-z0-9-]+\.)*(602medicare\.com|insuranceanthem\.pages\.dev)$/.test(origin) && !/^http:\/\/localhost(:\d+)?$/.test(origin)) {
    return json(403, { error: 'origin' });
  }

  let b: Record<string, unknown>;
  try { b = await request.json(); } catch { return json(400, { error: 'json' }); }

  const event_name = str(b.event_name, 40);
  const event_id = str(b.event_id, 100);
  if (!ALLOWED.has(event_name) || !event_id) return json(400, { error: 'event' });

  let phone = str(b.phone, 30).replace(/\D/g, '');
  if (phone.length === 10) phone = '1' + phone;
  const zip = str(b.zip, 10).replace(/\D/g, '').slice(0, 5);

  const user_data: Record<string, unknown> = {
    em: await sha256(str(b.email, 200).toLowerCase()),
    ph: await sha256(phone),
    fn: await sha256(str(b.first, 80).toLowerCase()),
    ln: await sha256(str(b.last, 80).toLowerCase()),
    zp: await sha256(zip),
    st: await sha256('az'),
    country: await sha256('us'),
    client_ip_address: request.headers.get('CF-Connecting-IP') || undefined,
    client_user_agent: request.headers.get('User-Agent') || undefined,
    fbc: str(b.fbc, 300) || undefined,
    fbp: str(b.fbp, 300) || undefined,
  };
  for (const k of Object.keys(user_data)) if (user_data[k] === undefined) delete user_data[k];

  const payload: Record<string, unknown> = {
    data: [{
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id,
      action_source: 'website',
      event_source_url: str(b.source_url, 500) || 'https://602medicare.com/',
      user_data,
      custom_data: { content_name: str(b.content_name, 120) || undefined },
    }],
  };
  if (env.FB_TEST_CODE) payload.test_event_code = env.FB_TEST_CODE;

  const pixel = env.FB_PIXEL_ID || '1480958159463999';
  const send = fetch(`https://graph.facebook.com/v22.0/${pixel}/events?access_token=${encodeURIComponent(env.FB_CAPI_TOKEN)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));

  // Wait for Meta's answer (so a test can see it), but never longer than 4s.
  const res = await Promise.race([send, new Promise((r) => setTimeout(() => r(null), 4000))]);
  if (!res && waitUntil) waitUntil(send.catch(() => {}));
  return json(200, { ok: true, meta: res });
};
