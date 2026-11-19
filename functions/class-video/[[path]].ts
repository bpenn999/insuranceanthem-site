/**
 * /class-video/<slug>/… — same-origin pass-through to the Medicare 101 Class
 * video (HLS playlist + segments + poster), hosted as static assets on the
 * `medicare-class` engine Worker (~/Documents/GitHub/medicare-class-engine).
 * Same-origin keeps the site CSP and the no-workers.dev-in-dist rule intact.
 */
const ENGINE = 'https://medicare-class.brianinsuranceservices.workers.dev';

export const onRequestGet = async ({ request, params }: { request: Request; params: { path?: string[] } }) => {
  const parts = (params.path || []).filter((p) => /^[a-z0-9._-]+$/i.test(p) && p !== '..' && p !== '.');
  if (parts.length < 2) return new Response('Not found', { status: 404 });
  const range = request.headers.get('range');
  const upstream = await fetch(`${ENGINE}/v/${parts.join('/')}`, {
    headers: range ? { range } : {},
    cf: { cacheTtl: 86400, cacheEverything: true },
  } as RequestInit);
  const h = new Headers();
  for (const k of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag']) {
    const v = upstream.headers.get(k);
    if (v) h.set(k, v);
  }
  h.set('cache-control', parts[parts.length - 1].endsWith('.m3u8') ? 'public, max-age=300' : 'public, max-age=86400');
  return new Response(upstream.body, { status: upstream.status, headers: h });
};
