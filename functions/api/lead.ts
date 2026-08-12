/**
 * POST /api/lead — the relay between the website's forms and the CRM.
 *
 * Cloudflare Pages compiles every file under `functions/` into a Worker and
 * routes it by path, so this file *is* the route. `wrangler pages deploy dist`
 * picks the directory up from the repo root; nothing imports it and nothing
 * needs to.
 *
 * Why a relay instead of posting the CRM webhook from the browser: the GoGuruX
 * inbound webhook URL is itself the credential — anyone holding it can write
 * into the CRM. Shipping it in `site.ts` would publish it in the built HTML of
 * every page. It lives in `GOGURUX_WEBHOOK_URL` instead (Cloudflare Pages →
 * Settings → Environment variables → Production), which only this Worker reads.
 *
 * The contract the browser depends on, and which scripts/e2e.mjs pins:
 *   200 { ok: true }   — the CRM accepted it (upstream 2xx)
 *   400 { ok: false }  — no email and no phone; there is no lead here to relay
 *   405 { ok: false }  — anything that is not a POST
 *   502 { ok: false }  — the CRM refused, timed out, or is not configured
 *
 * Any non-200 sends LeadForm.astro down its mailto hand-off, so a CRM outage
 * degrades to a prefilled email rather than a lost enquiry. That is the reason
 * a failure here answers honestly instead of returning 200 to look tidy.
 */

interface Env {
  /** GoGuruX inbound webhook. Secret — set in the Pages dashboard, never here. */
  GOGURUX_WEBHOOK_URL?: string;
}

/** The slice of Pages' EventContext this function actually uses. */
interface Context {
  request: Request;
  env: Env;
}

/** Where a submission came from when the form did not say. */
const DEFAULT_SOURCE = '602medicare.com';

/** Upstream budget. Longer than this and the visitor is staring at a spinner. */
const UPSTREAM_TIMEOUT_MS = 10_000;

const json = (status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // A lead POST is never cacheable, and never a thing to share cross-site.
      'Cache-Control': 'no-store',
      ...headers,
    },
  });

/**
 * Human labels for the funnel's machine values.
 *
 * The CRM shows `notes` to a person, so "I'm turning 65" belongs there rather
 * than `turning-65`. Kept in step with the options in HeroFunnel.astro and the
 * `situation` select in LeadForm.astro — an unmapped value falls through as-is
 * rather than being dropped, so a new option is never silently lost.
 */
const INTEREST_LABELS: Record<string, string> = {
  'turning-65': "Turning 65 — new to Medicare",
  review: 'Has a plan, wants it reviewed',
  retiring: 'Retiring / losing employer coverage',
  'new-to-area': 'New to Arizona',
  rx: 'Prescription costs went up',
  ltc: 'Long-term care planning',
  'helping-parent': 'Helping a parent',
  other: 'Something else',
};

/** Trim, collapse whitespace, and treat a blank as absent. */
function clean(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Read the body as a flat string map, whichever way it was sent.
 *
 * Both site forms send JSON, but a form-encoded POST is what arrives if
 * JavaScript ever fails to load and the browser submits the form natively, so
 * this accepts it rather than 400-ing on a submission that is perfectly valid.
 */
async function readFields(request: Request): Promise<Record<string, string>> {
  const type = request.headers.get('content-type') || '';

  if (type.includes('application/json')) {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (v === null || v === undefined) continue;
      out[k] = typeof v === 'string' ? v : String(v);
    }
    return out;
  }

  const form = await request.formData();
  const out: Record<string, string> = {};
  for (const [k, v] of form.entries()) out[k] = typeof v === 'string' ? v : '';
  return out;
}

/**
 * Split a single "Your name" field into first and last.
 *
 * The contact form asks for one name field on purpose — two boxes is friction
 * on a form aimed at people in their sixties — so the split happens here rather
 * than being pushed onto the visitor. Everything after the first token is the
 * surname, which keeps "Mary Anne Van Der Berg" intact.
 */
function splitName(full: string): { first: string; last: string } {
  const parts = full.split(' ').filter(Boolean);
  if (parts.length === 0) return { first: '', last: '' };
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

/**
 * The compact human-readable summary the CRM shows next to the contact.
 *
 * Only the answers that were actually given appear — an empty line for every
 * question nobody answered turns a note nobody reads. The consent line is not
 * decoration: TCPA requires the practice to be able to show that the visitor
 * agreed to be contacted, and this note is where that evidence lands.
 */
function buildNotes(f: Record<string, string>): string {
  const interest = clean(f.coverage_interest || f.situation || f.intent);
  const lines: string[] = [];

  if (interest) lines.push(`Situation: ${INTEREST_LABELS[interest] || interest}`);
  if (clean(f.age)) lines.push(`Age: ${clean(f.age)}`);
  if (clean(f.rx)) lines.push(`Prescriptions: ${clean(f.rx)}`);

  const message = clean(f.message);
  if (message) lines.push(`Message: ${message}`);

  // `consent` is the checkbox in LeadForm.astro: "on" from a native form post,
  // "true"/"on" from the JSON path. Anything else is treated as not given.
  const consented = ['on', 'true', 'yes', '1'].includes(clean(f.consent).toLowerCase());
  lines.push(
    consented
      ? `TCPA consent given on the website form at ${new Date().toISOString()}.`
      : 'No TCPA consent checkbox recorded with this submission.'
  );

  return lines.join('\n');
}

export const onRequest = async (context: Context): Promise<Response> => {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' }, { Allow: 'POST' });
  }

  // Same-origin only, and deliberately no CORS headers: this endpoint exists
  // for this site's own forms. A browser that sends an Origin from anywhere
  // else is not one of them. A missing Origin (curl, a server-side caller) is
  // allowed through — it is not a browser being tricked into posting.
  const origin = request.headers.get('origin');
  if (origin) {
    let originHost = '';
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = '';
    }
    if (originHost !== new URL(request.url).host) {
      return json(403, { ok: false, error: 'Cross-origin submissions are not accepted' });
    }
  }

  let fields: Record<string, string>;
  try {
    fields = await readFields(request);
  } catch {
    return json(400, { ok: false, error: 'Could not read the submission body' });
  }

  const email = clean(fields.email);
  const phone = clean(fields.phone);

  // The one hard requirement. A submission with neither is not a lead — there
  // is no way to answer it — so it is refused here rather than filed in the CRM
  // as a contact nobody can reach.
  if (!email && !phone) {
    return json(400, { ok: false, error: 'An email address or a phone number is required' });
  }

  const named = splitName(clean(fields.name));
  const first = clean(fields.first || fields.first_name) || named.first;
  const last = clean(fields.last || fields.last_name) || named.last;

  const payload = {
    contact: {
      first_name: first,
      last_name: last,
      email,
      phone,
      zip: clean(fields.zip),
    },
    source: clean(fields.source) || DEFAULT_SOURCE,
    notes: buildNotes(fields),
  };

  const webhook = env.GOGURUX_WEBHOOK_URL;
  if (!webhook) {
    // Answering 200 here would tell the browser the lead landed when nothing
    // was sent anywhere. 502 sends it down the mailto path instead.
    console.error('GOGURUX_WEBHOOK_URL is not set — lead not relayed');
    return json(502, { ok: false, error: 'Lead relay is not configured' });
  }

  try {
    const upstream = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!upstream.ok) {
      console.error(`GoGuruX rejected the lead: ${upstream.status}`);
      return json(502, { ok: false, error: 'The CRM did not accept the submission' });
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error('GoGuruX relay failed', err);
    return json(502, { ok: false, error: 'The CRM could not be reached' });
  }
};

export default { onRequest };
