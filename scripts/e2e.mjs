/**
 * Headless end-to-end checks driven over the Chrome DevTools Protocol.
 * Node's built-in WebSocket means this needs no dependencies at all.
 *
 *   node e2e.mjs            (requires `npx astro preview --port 4331` running)
 */
const BASE = process.env.BASE || 'http://localhost:4331';
const PORT = 9333;

import { spawn } from 'node:child_process';

/**
 * The brand facts, from the one file that holds them.
 *
 * Node strips the types on its own from v23, so this needs no flag and no build
 * step. It is imported rather than retyped because both of the checks that used
 * a frozen literal here went stale the moment the value behind it moved: the
 * footer CTA was asserted to be `/contact/?intent=15-minute-call` long after it
 * became `/book/`, and the NAP block was asserted to read "Anthem, AZ 85086"
 * after the ZIP was deliberately dropped from the published address. Both then
 * failed for months while the site itself was correct. An assertion sourced
 * from site.ts cannot go stale that way.
 */
import site from '../src/config/site.ts';

/**
 * Read the same flag the page reads, so the booking blocks below follow what
 * actually ships rather than what once did. Flipping `booking.mode` back to
 * `'native'` re-arms the native-picker checks on its own — nothing here needs
 * editing to match.
 */
import { booking } from '../src/config/booking.ts';

const CHROME =
  process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chrome = spawn(CHROME, [
  '--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  // Headless defaults to a ~470px-tall viewport, which changes which elements
  // are ever in view. Pin a normal desktop size so the run is deterministic.
  '--window-size=1440,900',
  `--remote-debugging-port=${PORT}`, '--user-data-dir=/tmp/ia-e2e-profile',
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForChrome() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error('Chrome did not expose a debugging port');
}

let msgId = 0;
function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const pending = new Map();
  const events = [];
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    else events.push(m);
  });
  const ready = new Promise((res) => ws.addEventListener('open', res));
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const id = ++msgId;
      pending.set(id, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result)));
      ws.send(JSON.stringify({ id, method, params }));
    });
  return { ws, ready, send, events };
}

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? '  ✔' : '  ✖'} ${name}${detail && !ok ? `  → ${detail}` : ''}`);
};

/**
 * A check that is deliberately not running, printed rather than deleted.
 *
 * Used only for the native-picker blocks, which cover code that is still here
 * and still correct but is not what `/book/` serves today. Deleting them would
 * lose the coverage; running them would assert a page nobody is served. So they
 * announce themselves, with the reason, and count as neither pass nor failure.
 */
const skip = (name, why) => console.log(`  ⊘ ${name}  → ${why}`);

async function openPage(path, preload) {
  // Open blank first when a preload script is needed, so the instrumentation is
  // installed before any of the page's own JavaScript runs.
  const startUrl = preload ? 'about:blank' : BASE + path;
  const r = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(startUrl)}`, { method: 'PUT' });
  const target = await r.json();
  const cdp = connect(target.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send('Runtime.enable');
  await cdp.send('Page.enable');
  await cdp.send('Log.enable');
  // `--window-size` does not reach CDP-created targets in new headless, and the
  // ~470px default viewport changes which elements are ever in view. Force a
  // normal desktop viewport so runs are deterministic.
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
  });
  if (preload) {
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: preload });
    await cdp.send('Page.navigate', { url: BASE + path });
  } else {
    await cdp.send('Page.reload');
  }
  cdp.consoleErrors = [];
  cdp.ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
      cdp.consoleErrors.push(m.params.entry.text);
    }
    if (m.method === 'Runtime.exceptionThrown') {
      cdp.consoleErrors.push(m.params.exceptionDetails.text + ' ' +
        (m.params.exceptionDetails.exception?.description || ''));
    }
  });
  await sleep(1200); // let modules execute
  cdp.targetId = target.id;
  return cdp;
}

async function evaluate(cdp, expr) {
  const r = await cdp.send('Runtime.evaluate', {
    expression: `(function(){${expr}})()`,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || ''));
  return r.result.value;
}

async function closePage(cdp) {
  await fetch(`http://127.0.0.1:${PORT}/json/close/${cdp.targetId}`);
  cdp.ws.close();
}

/* ═══════════════════════════════════════════════════════════════════════ */

// ── 0. /api/lead — the CRM relay, against a mocked upstream ──────────────────
// First, and before Chrome is even waited on. This is the only part of the site
// with a server side, it never opens a page, and a browser that will not start
// should not be what stops it being checked.
//
// The real GoGuruX webhook is never called: `globalThis.fetch` is stubbed, and
// what is asserted is the payload shape this relay sends upstream plus the
// status codes LeadForm.astro branches on — 200 shows the thank-you card,
// anything else falls back to the mailto hand-off.
console.log('\nAPI — /api/lead relay (mocked upstream)');
{
  const { onRequest } = await import('../functions/api/lead.ts');

  const ORIGIN = `https://${site.domain}`;
  const ENV = { GOGURUX_WEBHOOK_URL: 'https://stub.invalid/inbound/hook' };
  const OK = () => new Response('{"received":true}', { status: 200 });

  /**
   * Drive the function once with a stubbed upstream, and report both what came
   * back and what it tried to send. `console.error` is captured rather than
   * printed: the 502 cases below log on purpose, and a wall of expected error
   * text buried in the check output is how a real one gets missed.
   */
  async function callLead(opts = {}) {
    const {
      method = 'POST',
      body,
      contentType = 'application/json',
      origin = ORIGIN,
      env = ENV,
      upstream = OK,
    } = opts;

    const sent = [];
    const realFetch = globalThis.fetch;
    const realError = console.error;
    const logged = [];
    globalThis.fetch = async (url, init) => {
      sent.push({ url: String(url), init });
      return upstream();
    };
    console.error = (...a) => logged.push(a.join(' '));

    try {
      const headers = {};
      if (origin) headers.origin = origin;
      if (body !== undefined) headers['content-type'] = contentType;
      const request = new Request(`${ORIGIN}/api/lead`, {
        method,
        headers,
        body: body === undefined ? undefined
          : typeof body === 'string' ? body
          : JSON.stringify(body),
      });

      const res = await onRequest({ request, env });
      let json = null;
      try { json = await res.clone().json(); } catch { /* not JSON */ }

      return {
        status: res.status,
        allow: res.headers.get('allow'),
        json,
        calls: sent.length,
        relayed: sent[0] ? JSON.parse(String(sent[0].init.body)) : null,
        upstreamUrl: sent[0]?.url || '',
        logged,
      };
    } finally {
      globalThis.fetch = realFetch;
      console.error = realError;
    }
  }

  check('the forms post to the route this function serves',
    site.leadEndpoint === '/api/lead', site.leadEndpoint);

  // --- the happy path ------------------------------------------------------
  {
    const r = await callLead({
      body: {
        name: 'Mary Anne Ruiz', phone: '(480) 555-0147', email: 'mary@example.com',
        zip: '85086', coverage_interest: 'turning-65', consent: 'on',
        message: 'Most important to me: keeping my current doctors.',
        source: 'contact-form',
      },
    });

    check('a complete submission answers 200 { ok: true }',
      r.status === 200 && r.json?.ok === true, `${r.status} ${JSON.stringify(r.json)}`);
    check('it posts to the webhook from the environment, once',
      r.calls === 1 && r.upstreamUrl === ENV.GOGURUX_WEBHOOK_URL,
      `${r.calls} call(s) → ${r.upstreamUrl}`);
    check('the relayed body carries the documented contact shape',
      r.relayed?.contact?.email === 'mary@example.com'
      && r.relayed.contact.phone === '(480) 555-0147'
      && r.relayed.contact.zip === '85086',
      JSON.stringify(r.relayed?.contact));
    check('one name field is split into first_name and last_name',
      r.relayed?.contact?.first_name === 'Mary'
      && r.relayed.contact.last_name === 'Anne Ruiz',
      JSON.stringify(r.relayed?.contact));
    check('source is passed through when the form names one',
      r.relayed?.source === 'contact-form', r.relayed?.source);
    check('notes read as prose, not as machine values',
      /Situation: Turning 65/.test(r.relayed?.notes || '')
      && /Message: Most important to me/.test(r.relayed?.notes || ''),
      JSON.stringify(r.relayed?.notes));
    check('notes record the TCPA consent the checkbox captured',
      /TCPA consent given/.test(r.relayed?.notes || ''), JSON.stringify(r.relayed?.notes));
  }

  // --- the shapes a submission can legitimately arrive in -------------------
  {
    const r = await callLead({
      contentType: 'application/x-www-form-urlencoded',
      body: 'first=Ada&last=Byron&email=ada@example.com&zip=85383&situation=review',
    });
    check('a form-encoded POST is accepted too (JS-off native submit)',
      r.status === 200 && r.relayed?.contact?.first_name === 'Ada'
      && r.relayed.contact.last_name === 'Byron',
      `${r.status} ${JSON.stringify(r.relayed?.contact)}`);
    check('`situation` is read as coverage_interest',
      /Situation: Has a plan/.test(r.relayed?.notes || ''), JSON.stringify(r.relayed?.notes));
    check('an unconsented submission says so rather than staying silent',
      /No TCPA consent/.test(r.relayed?.notes || ''), JSON.stringify(r.relayed?.notes));
  }

  {
    const r = await callLead({ body: { first: 'Sam', phone: '4805550147' } });
    check('a phone with no email is enough',
      r.status === 200 && r.relayed?.contact?.phone === '4805550147', String(r.status));
    check('source falls back to the site when the form does not name one',
      r.relayed?.source === site.domain, r.relayed?.source);
  }

  check('an email with no phone is enough',
    (await callLead({ body: { first: 'Sam', email: 'sam@example.com' } })).status === 200);

  // --- what it refuses -----------------------------------------------------
  {
    const r = await callLead({ body: { first: 'Nobody', zip: '85086' } });
    check('neither email nor phone is refused with 400',
      r.status === 400 && r.json?.ok === false, `${r.status} ${JSON.stringify(r.json)}`);
    check('a refused submission is never relayed to the CRM', r.calls === 0, String(r.calls));
  }

  {
    const r = await callLead({ method: 'GET', body: undefined });
    check('GET is refused with 405 and an Allow header',
      r.status === 405 && r.allow === 'POST', `${r.status} allow=${r.allow}`);
    check('a non-POST never reaches the CRM', r.calls === 0, String(r.calls));
  }

  {
    const r = await callLead({
      origin: 'https://not-our-site.example',
      body: { first: 'Spam', email: 'spam@example.com' },
    });
    check('a cross-origin POST is refused with 403',
      r.status === 403, `${r.status} ${JSON.stringify(r.json)}`);
    check('a cross-origin POST never reaches the CRM', r.calls === 0, String(r.calls));
  }

  check('a body that is not JSON at all is refused, not crashed on',
    (await callLead({ body: 'not json{{{' })).status === 400);

  // --- what it does when the CRM is the thing that is broken ---------------
  // Every one of these must be non-200, because non-200 is what sends the
  // visitor to the prefilled email instead of a thank-you card over a lead
  // that went nowhere.
  {
    const r = await callLead({
      body: { first: 'Sam', phone: '4805550147' },
      upstream: () => new Response('nope', { status: 500 }),
    });
    check('an upstream 500 answers 502 { ok: false }',
      r.status === 502 && r.json?.ok === false, `${r.status} ${JSON.stringify(r.json)}`);
    check('it reports what the CRM answered, so a rejection is diagnosable',
      r.json?.upstream_status === 500, JSON.stringify(r.json));
  }

  {
    const r = await callLead({
      body: { first: 'Sam', phone: '4805550147' },
      upstream: () => { throw new Error('connection reset'); },
    });
    check('an unreachable CRM answers 502 rather than throwing',
      r.status === 502 && r.json?.ok === false, `${r.status} ${JSON.stringify(r.json)}`);
  }

  {
    const r = await callLead({ env: {}, body: { first: 'Sam', phone: '4805550147' } });
    check('an unset GOGURUX_WEBHOOK_URL answers 502, not a cheerful 200',
      r.status === 502 && r.json?.ok === false, `${r.status} ${JSON.stringify(r.json)}`);
    check('it says so in the logs so the cause is findable',
      r.logged.some((l) => /GOGURUX_WEBHOOK_URL/.test(l)), r.logged.join(' | '));
    check('nothing is posted anywhere when there is nowhere to post',
      r.calls === 0, String(r.calls));
  }
}

// ── availability: the feed that is in step with Brian's calendar ────────────
// Thursday 20 August 2026: this site offered an unbroken run of half-hours from
// 7:00 while Brian's calendar carried "Off" 07:00–20:00, and he booked 7:30 to
// prove it. Medicare On Main greyed that Thursday out, because it reads
// GoHighLevel's free-slots feed instead. Asked for 18–31 August that feed
// answers 18, 25, 26, 27, 28, 31 and no 20th (verified against the live
// calendar, 2026-08-18).
//
// /api/availability now reads the same feed. These drive the real function with
// every upstream stubbed, and the sharpest check is that GoGuruX's slot list is
// never used again for anything.
console.log('\nAPI — /api/availability (the free-slots feed, mocked upstreams)');
{
  const { onRequest } = await import('../functions/api/availability.ts');
  const { generateKeyPairSync } = await import('node:crypto');

  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const SA = JSON.stringify({
    client_email: 'guard@602medicare.iam.gserviceaccount.com',
    private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
  });

  const ORIGIN = `https://${site.domain}`;
  const az = (day, hhmm) => `${day}T${hhmm}:00-07:00`;

  /** What the feed really answers for a working Tuesday. */
  const TUESDAY_FEED = {
    '2026-08-25': { slots: ['08:30', '09:00', '09:30'].map((t) => az('2026-08-25', t)) },
    traceId: 'stub',
  };
  /** And for the Thursday he is off: the day is simply not there. */
  const THURSDAY_FEED = { traceId: 'stub' };

  /** The eight slots GoGuruX offered that Thursday — which must never surface. */
  const GOGURUX_SLOTS = ['07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30'].map((t) => {
    const startUtc = new Date(az('2026-08-20', t)).toISOString();
    return { startUtc, endUtc: new Date(Date.parse(startUtc) + 30 * 60000).toISOString(), available: true };
  });

  async function call(opts = {}) {
    const {
      method = 'GET',
      date = '2026-08-20',
      env = {},
      feed = THURSDAY_FEED,
      feedStatus = 200,
      goguruxSlots = GOGURUX_SLOTS,
      goguruxCalendar = { id: 'gogurux-cal', slot_duration: 30, time_zone: 'America/Denver' },
      goguruxStatus = 200,
      busy = [],
      freebusyStatus = 200,
      tokenStatus = 200,
    } = opts;

    const seen = [];
    const realFetch = globalThis.fetch;
    const realError = console.error;
    const realLog = console.log;
    const logged = [];
    globalThis.fetch = async (url, init) => {
      const u = String(url);
      seen.push(u);
      if (u.includes('oauth2.googleapis.com')) {
        return new Response(JSON.stringify(tokenStatus === 200 ? { access_token: 'tok' } : { error: 'nope' }),
          { status: tokenStatus });
      }
      if (u.includes('freeBusy')) {
        return new Response(JSON.stringify({ calendars: { 'brianinsuranceservices@gmail.com': { busy } } }),
          { status: freebusyStatus });
      }
      if (u.includes('free-slots')) {
        return new Response(JSON.stringify(feed), { status: feedStatus });
      }
      if (u.includes('get-availability')) {
        return new Response(JSON.stringify({ success: goguruxStatus === 200, calendar: goguruxCalendar, slots: goguruxSlots }),
          { status: goguruxStatus });
      }
      return realFetch(url, init);
    };
    console.error = (...a) => logged.push(a.join(' '));
    console.log = (...a) => logged.push(a.join(' '));

    try {
      const qs = date === null ? '' : `?date=${encodeURIComponent(date)}`;
      const res = await onRequest({ request: new Request(`${ORIGIN}/api/availability${qs}`, { method }), env });
      let json = null;
      try { json = await res.clone().json(); } catch { /* not JSON */ }
      return { status: res.status, json, seen, logged: logged.join(' | '), allow: res.headers.get('allow') };
    } finally {
      globalThis.fetch = realFetch;
      console.error = realError;
      console.log = realLog;
    }
  }

  /* ── the Thursday ─────────────────────────────────────────────────────── */
  {
    const r = await call();
    check('THE BUG: the blocked Thursday now offers nothing',
      r.status === 200 && r.json.success === true && r.json.slots.length === 0,
      `${r.status} kept=${r.json?.slots?.length}`);
    check('THE SMOKING GUN: GoGuruX\'s eight slots are never used',
      !JSON.stringify(r.json.slots).includes('T14:00:00'), JSON.stringify(r.json.slots).slice(0, 120));
    check('it read the free-slots feed', r.seen.some((u) => u.includes('free-slots')));
    check('it asked GoGuruX only for the calendar the booking needs',
      r.json.calendar?.id === 'gogurux-cal');
  }

  /* ── a working day ────────────────────────────────────────────────────── */
  {
    const r = await call({ date: '2026-08-25', feed: TUESDAY_FEED });
    check('a day the feed lists is offered in full', r.json.slots.length === 3);
    check('the feed\'s start times survive the round trip',
      r.json.slots[0].startUtc === new Date(az('2026-08-25', '08:30')).toISOString(),
      r.json.slots[0]?.startUtc);
    check('an end time is derived from the calendar\'s slot length',
      Date.parse(r.json.slots[0].endUtc) - Date.parse(r.json.slots[0].startUtc) === 30 * 60000);
    check('a different slot length is honoured',
      (await call({ date: '2026-08-25', feed: TUESDAY_FEED,
        goguruxCalendar: { id: 'c', slot_duration: 45 } }))
        .json.slots[0].endUtc === new Date(Date.parse(az('2026-08-25', '08:30')) + 45 * 60000).toISOString());
  }

  /* ── failing closed ───────────────────────────────────────────────────── */
  {
    const r = await call({ feedStatus: 500, feed: {} });
    check('a feed outage is 502 and NO slots', r.status === 502 && !r.json.slots);
    check('it never falls back to GoGuruX\'s list', !JSON.stringify(r.json).includes('startUtc'));
    check('and says so in the logs', /free-slots failed, withholding/.test(r.logged));
  }
  {
    const r = await call({ goguruxStatus: 500 });
    check('no calendar object means 502 — there would be nothing to book against',
      r.status === 502);
  }

  /* ── the optional second opinion ──────────────────────────────────────── */
  {
    const r = await call({ date: '2026-08-25', feed: TUESDAY_FEED });
    check('with no credential set the feed is trusted on its own',
      r.status === 200 && r.json.slots.length === 3);
    check('and Google is not called at all', !r.seen.some((u) => u.includes('freeBusy')));
  }
  {
    const r = await call({
      date: '2026-08-25', feed: TUESDAY_FEED, env: { GOOGLE_SERVICE_ACCOUNT_JSON: SA },
      busy: [{ start: az('2026-08-25', '09:00'), end: az('2026-08-25', '09:30') }],
    });
    check('a configured diary check subtracts anything the feed still listed',
      r.json.slots.length === 2
        && !r.json.slots.some((s) => s.startUtc === new Date(az('2026-08-25', '09:00')).toISOString()),
      String(r.json.slots.length));
    check('and reports what it withheld', r.json.filtered.withheld === 1);
  }
  {
    const r = await call({
      date: '2026-08-25', feed: TUESDAY_FEED,
      env: { GOOGLE_SERVICE_ACCOUNT_JSON: SA }, tokenStatus: 401,
    });
    check('a broken optional check is skipped, not turned into an outage',
      r.status === 200 && r.json.slots.length === 3);
    check('but it is logged rather than passed over in silence',
      /optional diary check skipped/.test(r.logged));
  }

  /* ── the shape of the route ───────────────────────────────────────────── */
  {
    const r = await call({ method: 'POST' });
    check('POST is refused with 405 and an Allow header', r.status === 405 && r.allow === 'GET');
  }
  {
    check('a missing date is 400', (await call({ date: null })).status === 400);
    check('a date it cannot read is 400, never guessed at',
      (await call({ date: '20th August' })).status === 400);
  }
}

await waitForChrome();

// ── 1. home page: motion engine + hero funnel ────────────────────────────────
console.log('\nHome — motion engine');
{
  const p = await openPage('/');
  check('motion class applied', await evaluate(p, `return document.documentElement.classList.contains('motion')`));
  check('caustics canvas has painted pixels', await evaluate(p, `
    const c = document.querySelector('canvas.caustics');
    if (!c || !c.width) return false;
    const d = c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    let nonzero = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) nonzero++;
    return nonzero > d.length / 8;
  `));
  check('caustics animates between frames', await evaluate(p, `
    const c = document.querySelector('canvas.caustics');
    const g = c.getContext('2d');
    const snap = () => g.getImageData(0,0,c.width,c.height).data.slice(0, 4000).join(',');
    const a = snap();
    return new Promise(res => setTimeout(() => res(snap() !== a), 400));
  `));
  {
    /* This used to assert against the viewport AT LOAD, and had been failing on
       a correct page for as long as the hero has filled the first screen: the
       first armed element on this page sits at y≈997 on a 900px viewport, so
       "visible" was always 0 and `visible > 3` could never be true. It was
       measuring the hero's height, not the reveal engine.

       So it scrolls to the armed elements first and then asserts. That is the
       behaviour worth pinning anyway — a reveal engine's job is to fire when
       something comes INTO view, which is a thing this now actually does. */
    const rev = await evaluate(p, `
      const armed = [...document.querySelectorAll('[data-armed]')];
      if (!armed.length) return { total: 0, visible: 0, missed: ['no armed elements at all'] };
      armed[0].scrollIntoView({ block: 'center', behavior: 'auto' });
      return new Promise(res => setTimeout(() => {
        // Only assert on elements comfortably inside the viewport — one that is
        // half off the bottom legitimately has not met the observer threshold yet.
        const visible = armed.filter(el => {
          const r = el.getBoundingClientRect();
          return r.top >= 0 && r.bottom <= innerHeight * 0.85 && r.height > 0;
        });
        const missed = visible.filter(el => !el.hasAttribute('data-revealed'));
        res({
          vh: innerHeight, total: armed.length, visible: visible.length,
          missed: missed.map(el => el.tagName + '.' + String(el.className).slice(0, 40)),
        });
      }, 1200));
    `);
    check('every armed element scrolled into view is revealed',
      rev.visible > 3 && rev.missed.length === 0, JSON.stringify(rev));
  }
  check('kinetic words carry staggered delays', await evaluate(p, `
    const w = [...document.querySelectorAll('.hero__title .k-word')];
    return w.length > 5 && w[0].style.getPropertyValue('--k-delay') !== w[3].style.getPropertyValue('--k-delay');
  `));
  check('no double spaces in the h1 text', await evaluate(p, `
    return !/\\s{2,}/.test(document.querySelector('h1').textContent.trim());
  `));
  check('scroll progress bar responds to scroll', await evaluate(p, `
    scrollTo(0, document.body.scrollHeight / 2);
    return new Promise(res => setTimeout(() => {
      const t = getComputedStyle(document.querySelector('.scroll-progress__bar')).transform;
      res(t !== 'none' && !t.startsWith('matrix(0,'));
    }, 700));
  `));
  // Scroll the whole page slowly, the way a person would, then confirm no stat
  // is left showing a placeholder zero.
  check('every stat count-up reaches its real value', await evaluate(p, `
    return new Promise(res => {
      let y = 0;
      const step = () => {
        y += 400;
        scrollTo(0, y);
        if (y < document.body.scrollHeight) return setTimeout(step, 60);
        setTimeout(() => {
          const els = [...document.querySelectorAll('[data-countup]')];
          const bad = els.filter(el => el.textContent.replace(/[^0-9]/g,'') !== String(el.dataset.countup));
          res(els.length > 0 && bad.length === 0);
        }, 2500);
      };
      step();
    });
  `));
  check('no stat is left at zero even after a jump-scroll', await evaluate(p, `
    // Jump straight past everything — the observer can miss this entirely, so
    // this exercises the backstop rather than the happy path.
    scrollTo(0, document.body.scrollHeight);
    return new Promise(res => setTimeout(() => {
      const els = [...document.querySelectorAll('[data-countup]')];
      res(els.every(el => el.textContent.replace(/[^0-9]/g,'') === String(el.dataset.countup)));
    }, 4000));
  `));
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

// ── 1b. exactly one rAF loop, instrumented before page scripts run ───────────
console.log('\nHome — animation loop discipline');
{
  const PRELOAD = `
    (function () {
      window.__rafPerFrame = [];
      var orig = window.requestAnimationFrame.bind(window);
      var frame = 0, count = 0;
      // Tick a reference loop so we know when a frame boundary passes.
      orig(function mark() { window.__rafPerFrame.push(count); count = 0; frame++; orig(mark); });
      window.requestAnimationFrame = function (cb) { count++; return orig(cb); };
    })();
  `;
  const p = await openPage('/', PRELOAD);
  await sleep(2500);
  const stats = await evaluate(p, `
    // Ignore the first few frames (boot, count-up animations) and look at the
    // steady state, where only the persistent loop should be scheduling.
    const s = window.__rafPerFrame.slice(-40);
    return { frames: s.length, max: Math.max(...s), avg: s.reduce((a,b)=>a+b,0)/s.length };
  `);
  check('steady state schedules at most one rAF callback per frame',
    stats.frames > 20 && stats.max <= 1, JSON.stringify(stats));

  check('loop parks itself when the tab is hidden', await evaluate(p, `
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    return new Promise(res => setTimeout(() => {
      const before = window.__rafPerFrame.length;
      const c = document.querySelector('canvas.caustics');
      const g = c.getContext('2d');
      const snap = () => g.getImageData(0,0,c.width,c.height).data.slice(0,4000).join(',');
      const a = snap();
      setTimeout(() => res(snap() === a), 500);
    }, 200));
  `));
  check('loop resumes when the tab comes back', await evaluate(p, `
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    const c = document.querySelector('canvas.caustics');
    const g = c.getContext('2d');
    const snap = () => g.getImageData(0,0,c.width,c.height).data.slice(0,4000).join(',');
    const a = snap();
    return new Promise(res => setTimeout(() => res(snap() !== a), 500));
  `));
  await closePage(p);
}

// ── 2. hero funnel flow ──────────────────────────────────────────────────────
console.log('\nHome — hero funnel');
{
  const p = await openPage('/');
  check('starts on step 1 with no focus ring', await evaluate(p, `
    const s = document.querySelector('.funnel__step[data-active]');
    return s?.dataset.step === '1' && document.activeElement === document.body;
  `));
  check('choosing an intent auto-advances to the ZIP step', await evaluate(p, `
    document.querySelector('[data-set="intent"][data-value="turning-65"]').click();
    return document.querySelector('.funnel__step[data-active]')?.dataset.step === '2';
  `));
  check('a bad ZIP is rejected', await evaluate(p, `
    const i = document.querySelector('[data-funnel-zip]'); i.value = '12';
    document.querySelector('[data-funnel-next]').click();
    return !document.querySelector('[data-funnel-zip-error]').hidden
        && document.querySelector('.funnel__step[data-active]')?.dataset.step === '2';
  `));
  check('a good ZIP advances', await evaluate(p, `
    const i = document.querySelector('[data-funnel-zip]'); i.value = '85086';
    i.dispatchEvent(new Event('input'));
    document.querySelector('[data-funnel-next]').click();
    return document.querySelector('.funnel__step[data-active]')?.dataset.step === '3';
  `));
  check('back button returns to the ZIP step with the value kept', await evaluate(p, `
    document.querySelector('[data-funnel-back]').click();
    const ok = document.querySelector('.funnel__step[data-active]')?.dataset.step === '2'
            && document.querySelector('[data-funnel-zip]').value === '85086';
    document.querySelector('[data-funnel-next]').click();
    return ok;
  `));
  const funnel = await evaluate(p, `
    document.querySelector('[data-set="priority"][data-value="doctors"]').click();
    const s = document.querySelector('.funnel__step[data-active]');
    return {
      step: s?.dataset.step,
      headline: document.querySelector('[data-funnel-headline]').textContent,
      body: document.querySelector('[data-funnel-body]').textContent,
      cta: document.querySelector('[data-funnel-cta]').getAttribute('href'),
      stash: sessionStorage.getItem('ia_funnel'),
      progress: document.querySelector('[data-funnel-bar]').style.width,
    };
  `);
  check('reaches the result step', funnel.step === '4', JSON.stringify(funnel));
  check('result matches the "keep my doctors" branch', /Supplement/.test(funnel.headline), funnel.headline);
  check('result folds in the turning-65 note', /Medigap|65/.test(funnel.body), funnel.body.slice(0, 90));
  check('CTA carries zip + situation + priority', funnel.cta === '/contact/?intent=quote&zip=85086&situation=turning-65&priority=doctors', funnel.cta);
  check('answers stashed for the contact page', JSON.parse(funnel.stash || '{}').zip === '85086', funnel.stash);
  check('progress bar reaches 100%', funnel.progress === '100%', funnel.progress);
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

// ── 3. contact form prefill + validation ─────────────────────────────────────
console.log('\nContact — form');
{
  const p = await openPage('/contact/?intent=quote&zip=85086&situation=turning-65&priority=rx');
  check('ZIP prefilled from the query string', await evaluate(p, `return document.getElementById('lead-zip').value === '85086'`));
  check('situation prefilled', await evaluate(p, `return document.getElementById('lead-situation').value === 'turning-65'`));
  check('priority seeded into the message', await evaluate(p, `return /prescription/i.test(document.getElementById('lead-message').value)`));
  check('an unknown situation value does not blank the select', await evaluate(p, `
    const s = document.getElementById('lead-situation');
    return [...s.options].some(o => o.value === s.value);
  `));
  check('empty submit is blocked with field errors', await evaluate(p, `
    const f = document.querySelector('[data-lead]');
    document.getElementById('lead-name').value = '';
    f.requestSubmit();
    return [...document.querySelectorAll('.field__error')].some(e => e.textContent.trim().length > 0)
        && !document.querySelector('[data-lead-done]').hidden === false;
  `));
  check('a short phone number is rejected', await evaluate(p, `
    document.getElementById('lead-name').value = 'Test Person';
    document.getElementById('lead-phone').value = '123';
    document.getElementById('lead-consent').checked = true;
    document.querySelector('[data-lead]').requestSubmit();
    return document.querySelector('[data-error-for="phone"]').textContent.includes('10-digit');
  `));
  check('missing consent is rejected', await evaluate(p, `
    document.getElementById('lead-phone').value = '4805550147';
    document.getElementById('lead-consent').checked = false;
    document.querySelector('[data-lead]').requestSubmit();
    return document.querySelector('[data-error-for="consent"]').textContent.length > 0;
  `));
  check('honeypot named xtr_field, not an autofill token', await evaluate(p, `
    const names = [...document.querySelectorAll('.lead__hp input')].map(i => i.name);
    const banned = ['company','website','address','organization','url'];
    return names.includes('xtr_field') && !names.some(n => banned.includes(n));
  `));
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

// ── 3b. the contact form actually posts ──────────────────────────────────────
// The check this suite was missing. /api/lead was covered in isolation and the
// form was covered up to validation, and between those two the question nobody
// asked was whether pressing the button reaches the relay at all. It did — but
// a CRM rejection dropped it into the email draft, and from the outside that is
// indistinguishable from a form that never posts. This pins both branches.
//
// `astro preview` serves static files and has no /api/lead, so the endpoint is
// stubbed in the page: that is the point, since what is under test is the form's
// behaviour against a given answer, not the relay's.
const leadStub = (status) => `
  (() => {
    window.__lead = { posts: [] };
    const real = window.fetch;
    window.fetch = function (input, init) {
      const url = String(typeof input === 'string' ? input : (input && input.url) || '');
      if (url.includes('/api/lead')) {
        window.__lead.posts.push({
          url,
          method: (init && init.method) || 'GET',
          body: init && init.body,
        });
        return Promise.resolve(new Response(
          ${status === 200 ? `'{"ok":true}'` : `'{"ok":false,"error":"The CRM did not accept the submission"}'`},
          { status: ${status}, headers: { 'Content-Type': 'application/json' } }
        ));
      }
      return real.apply(this, arguments);
    };
  })();
`;

const fillAndSubmit = `
  document.getElementById('lead-name').value = 'Mary Anne Ruiz';
  document.getElementById('lead-phone').value = '(480) 555-0147';
  document.getElementById('lead-email').value = 'mary@example.com';
  document.getElementById('lead-zip').value = '85086';
  document.getElementById('lead-situation').value = 'turning-65';
  document.getElementById('lead-message').value = 'I want to keep my cardiologist.';
  document.getElementById('lead-consent').checked = true;
  document.querySelector('[data-lead]').requestSubmit();
  return new Promise(res => setTimeout(() => res({
    posts: window.__lead.posts,
    formHidden: document.querySelector('[data-lead]').hidden,
    doneHidden: document.querySelector('[data-lead-done]').hidden,
    doneBody: document.querySelector('[data-lead-done-body]').textContent,
    protocol: location.protocol,
  }), 900));
`;

console.log('\nContact — the submit actually posts');
{
  const p = await openPage('/contact/', leadStub(200));
  const r = await evaluate(p, fillAndSubmit);
  const body = r.posts[0] ? JSON.parse(r.posts[0].body) : null;

  check('pressing send issues exactly one request to /api/lead',
    r.posts.length === 1 && r.posts[0].url === '/api/lead',
    JSON.stringify(r.posts.map((x) => x.url)));
  check('it is a POST', r.posts[0]?.method === 'POST', r.posts[0]?.method);
  check('the name field is split into first and last',
    body?.first === 'Mary' && body?.last === 'Anne Ruiz', JSON.stringify(body));
  check('the payload carries email, phone and ZIP',
    body?.email === 'mary@example.com' && body?.phone === '(480) 555-0147'
    && body?.zip === '85086', JSON.stringify(body));
  check('the payload carries the message and the "what\'s going on" answer',
    /cardiologist/.test(body?.message || '') && body?.coverage_interest === 'turning-65',
    JSON.stringify(body));
  check('the payload names this form as the source',
    body?.source === `${site.domain}/contact`, body?.source);
  check('the TCPA consent travels with it',
    !!body?.consent, JSON.stringify(body?.consent));

  check('a 200 swaps the form for the on-page success card',
    r.formHidden === true && r.doneHidden === false, JSON.stringify(r));
  check('the success card reads "Got it"',
    /^Got it — I'll be in touch within one business day/.test(r.doneBody || ''), r.doneBody);
  check('a successful post never mentions the email app',
    !/email app/i.test(r.doneBody || ''), r.doneBody);
  check('a successful post never leaves the page for a mailto',
    r.protocol === 'http:', r.protocol);
  await closePage(p);
}

// ── 3c. …and only falls back to email when the post fails ────────────────────
console.log('\nContact — the mailto fallback, when the relay is down');
{
  const p = await openPage('/contact/', leadStub(502));
  const r = await evaluate(p, fillAndSubmit);

  check('a failing relay is still attempted first', r.posts.length === 1,
    JSON.stringify(r.posts.map((x) => x.url)));
  check('a non-200 falls back to the email draft',
    /email app should be opening/i.test(r.doneBody || ''), r.doneBody);
  check('the fallback names the practice inbox and the phone number',
    (r.doneBody || '').includes(site.email) && (r.doneBody || '').includes(site.phone.display),
    r.doneBody);
  check('the fallback never claims the success copy',
    !/^Got it/.test(r.doneBody || ''), r.doneBody);
  await closePage(p);
}

// ── 4. plan type finder ──────────────────────────────────────────────────────
console.log('\nTool — plan type finder');
{
  const p = await openPage('/tools/plan-type-finder/');
  check('incomplete submit is refused', await evaluate(p, `
    document.getElementById('ptf').requestSubmit();
    return document.getElementById('ptf-result').hidden
        && document.getElementById('ptf-error').textContent.length > 0;
  `));
  const supp = await evaluate(p, `
    const set = (n,v) => document.querySelector(\`input[name="\${n}"][value="\${v}"]\`).checked = true;
    set('doctors',3); set('premium',0); set('travel',3); set('usage',3); set('extras',0); set('timing','new');
    document.getElementById('ptf').requestSubmit();
    return { hidden: document.getElementById('ptf-result').hidden,
             head: document.getElementById('ptf-head').textContent,
             body: document.getElementById('ptf-body').textContent,
             err: document.getElementById('ptf-error').textContent };
  `);
  check('supplement-leaning answers give a Supplement result', !supp.hidden && /Supplement/.test(supp.head), JSON.stringify(supp).slice(0,150));
  check('a new-to-Medicare answer surfaces the Medigap window', /Medigap open enrollment/.test(supp.body), supp.body.slice(0,120));
  const adv = await evaluate(p, `
    const set = (n,v) => document.querySelector(\`input[name="\${n}"][value="\${v}"]\`).checked = true;
    set('doctors',0); set('premium',3); set('travel',0); set('usage',0); set('extras',2); set('timing','established');
    document.getElementById('ptf').requestSubmit();
    return { head: document.getElementById('ptf-head').textContent,
             body: document.getElementById('ptf-body').textContent };
  `);
  check('advantage-leaning answers give an Advantage result', /Advantage/.test(adv.head), adv.head);
  check('an established member gets the underwriting caution instead', /health questions/.test(adv.body), adv.body.slice(-140));
  check('no plan or carrier is ever named', await evaluate(p, `
    const t = document.body.textContent;
    return !/(Humana|Aetna|UnitedHealth|Cigna|Wellcare|Blue Cross|\\$0 premium plan named)/i.test(t);
  `));
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

// ── 5. enrollment window checker ─────────────────────────────────────────────
console.log('\nTool — enrollment window checker');
{
  const p = await openPage('/tools/enrollment-timeline/');
  const ordinary = await evaluate(p, `
    document.getElementById('ewc-dob').value = '1961-03-15';
    document.getElementById('ewc').requestSubmit();
    return { hidden: document.getElementById('ewc-result').hidden,
             timeline: document.getElementById('ewc-timeline').textContent,
             head: document.getElementById('ewc-head').textContent };
  `);
  check('shows a result', !ordinary.hidden);
  check('IEP dates match the tested module', /December 1, 2025 – June 2026|December 2025 – June 2026/.test(ordinary.timeline), ordinary.timeline.slice(0,160));
  check('Medigap window shown as Mar 1 – Aug 31 2026', /March 1, 2026 – August 31, 2026/.test(ordinary.timeline), ordinary.timeline.slice(0,300));
  const first = await evaluate(p, `
    document.getElementById('ewc-dob').value = '1961-03-01';
    document.getElementById('ewc').requestSubmit();
    return { body: document.getElementById('ewc-body').textContent,
             timeline: document.getElementById('ewc-timeline').textContent };
  `);
  check('born-on-the-first is explained', /born on the first/.test(first.body), first.body.slice(0,120));
  check('born-on-the-first names February, not March', /turning 65 in February rather than March/.test(first.body), first.body.slice(0,180));
  check('born-on-the-first shifts Medigap to Feb 1 – Jul 31', /February 1, 2026 – July 31, 2026/.test(first.timeline), first.timeline.slice(0,300));
  const emp = await evaluate(p, `
    document.querySelector('input[name="employer"][value="yes"]').checked = true;
    document.getElementById('ewc-dob').value = '1961-03-15';
    document.getElementById('ewc').requestSubmit();
    return document.getElementById('ewc-body').textContent;
  `);
  check('employer-coverage path warns about COBRA and small employers', /COBRA/.test(emp) && /fewer than 20/.test(emp), emp.slice(0,120));
  check('a future date of birth is rejected', await evaluate(p, `
    document.getElementById('ewc-dob').value = '2035-01-01';
    document.getElementById('ewc').requestSubmit();
    return document.getElementById('ewc-error').textContent.includes('future');
  `));
  check('an empty date is rejected', await evaluate(p, `
    document.getElementById('ewc-dob').value = '';
    document.getElementById('ewc').requestSubmit();
    return document.getElementById('ewc-error').textContent.length > 0;
  `));
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

// ── 6. IRMAA estimator ───────────────────────────────────────────────────────
console.log('\nTool — IRMAA estimator');
{
  const p = await openPage('/tools/irmaa-estimator/');
  const standard = await evaluate(p, `
    document.getElementById('irmaa-magi').value = '109000';
    document.getElementById('irmaa').requestSubmit();
    return { head: document.getElementById('irmaa-head').textContent,
             stats: document.getElementById('irmaa-stats').textContent };
  `);
  check('exactly at the threshold → no surcharge', /No IRMAA surcharge/.test(standard.head), standard.head);
  check('shows the standard $202.90 premium', /\\$202\\.90/.test(standard.stats.replace(/\$/g,'\\$')) || standard.stats.includes('202.90'), standard.stats);
  const tier1 = await evaluate(p, `
    document.getElementById('irmaa-magi').value = '109001';
    document.getElementById('irmaa').requestSubmit();
    return { head: document.getElementById('irmaa-head').textContent,
             stats: document.getElementById('irmaa-stats').textContent,
             body: document.getElementById('irmaa-body').textContent };
  `);
  check('one dollar over → Tier 1', /Tier 1/.test(tier1.stats), tier1.stats);
  check('shows the $284.10 Part B figure', tier1.stats.includes('284.10'), tier1.stats);
  check('shows the $14.50 Part D surcharge', tier1.stats.includes('14.50'), tier1.stats);
  check('surfaces the SSA-44 retirement appeal', /SSA-44/.test(tier1.body), tier1.body.slice(0,140));
  const joint = await evaluate(p, `
    document.querySelector('input[name="filing"][value="joint"]').checked = true;
    document.getElementById('irmaa-magi').value = '150000';
    document.getElementById('irmaa').requestSubmit();
    return document.getElementById('irmaa-head').textContent;
  `);
  check('joint filer at $150k pays no surcharge', /No IRMAA surcharge/.test(joint), joint);
  const near = await evaluate(p, `
    document.querySelector('input[name="filing"][value="single"]').checked = true;
    document.getElementById('irmaa-magi').value = '105000';
    document.getElementById('irmaa').requestSubmit();
    return document.getElementById('irmaa-body').textContent;
  `);
  check('warns when close to a bracket edge', /close to an edge/i.test(near), near.slice(0,140));
  check('negative income is rejected', await evaluate(p, `
    document.getElementById('irmaa-magi').value = '-5';
    document.getElementById('irmaa').requestSubmit();
    return document.getElementById('irmaa-error').textContent.length > 0;
  `));
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

// ── 7. cost estimator ────────────────────────────────────────────────────────
console.log('\nTool — cost estimator');
{
  const p = await openPage('/tools/medicare-cost-estimator/');
  const light = await evaluate(p, `
    const v = (id,val) => document.getElementById(id).value = val;
    v('c-primary',1); v('c-specialist',0); v('c-imaging',1); v('c-hospital',0); v('c-drugs',10);
    v('c-ma-premium',0); v('c-ma-moop',5500); v('c-sup-premium',150); v('c-pdp-premium',35);
    document.getElementById('cost').requestSubmit();
    return { hidden: document.getElementById('cost-result').hidden,
             head: document.getElementById('cost-head').textContent,
             cols: document.getElementById('cost-cols').textContent };
  `);
  check('renders a comparison', !light.hidden && light.cols.includes('Medicare Advantage') && light.cols.includes('Supplement'));
  check('light usage favors Advantage', /Advantage comes out/.test(light.head), light.head);
  check('both columns include the Part B premium', (light.cols.match(/Part B premium/g) || []).length === 2, light.cols);
  const heavy = await evaluate(p, `
    const v = (id,val) => document.getElementById(id).value = val;
    // 4 admissions × $1,500 alone clears the $5,500 out-of-pocket maximum.
    v('c-primary',12); v('c-specialist',20); v('c-imaging',15); v('c-hospital',4); v('c-drugs',300);
    document.getElementById('cost').requestSubmit();
    return { head: document.getElementById('cost-head').textContent,
             body: document.getElementById('cost-body').textContent,
             cols: document.getElementById('cost-cols').textContent };
  `);
  check('heavy usage flips to the Supplement', /Supplement route comes out/.test(heavy.head), heavy.head);
  check('explains hitting the Advantage out-of-pocket cap', /out-of-pocket maximum/.test(heavy.body), heavy.body.slice(0,130));
  check('caps drug spend at the 2026 Part D limit', /\\$2,100/.test(heavy.body) || heavy.body.includes('$2,100'), heavy.body.slice(0,400));
  check('a winner is flagged exactly once', await evaluate(p, `
    return document.querySelectorAll('.cost-col[data-winner]').length === 1;
  `));
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

// ── 7b. the Learn hub ────────────────────────────────────────────────────────
console.log('\nLearn — hub');
const LEARN_SLUGS = [
  'medicare-advantage-vs-medigap',
  'medicare-part-d-explained',
  'irmaa-explained',
  'late-enrollment-penalties',
  'medicare-enrollment-periods',
  'medicare-out-of-pocket-costs',
  'special-enrollment-periods',
  'medicare-advantage-networks',
];
{
  const p = await openPage('/learn/');

  const hub = await evaluate(p, `
    return {
      cards: document.querySelectorAll('[data-learn-grid] > li').length,
      chips: document.querySelectorAll('.cat').length,
      hrefs: [...document.querySelectorAll('[data-learn-grid] a')].map(a => a.getAttribute('href')),
      h1: document.querySelector('h1')?.textContent.trim(),
      navLearn: !!document.querySelector('.nav-desktop a[href="/learn/"]'),
      footerLearn: !!document.querySelector('.site-footer a[href="/learn/"]'),
    };
  `);
  check('hub renders a card per article', hub.cards >= 11, String(hub.cards));
  check('every required article is on the hub',
    LEARN_SLUGS.every((s) => hub.hrefs.includes(`/learn/${s}/`)),
    LEARN_SLUGS.filter((s) => !hub.hrefs.includes(`/learn/${s}/`)).join(', '));
  check('"Learn" is in the top nav', hub.navLearn);
  check('"Learn" is in the footer', hub.footerLearn);
  check('hub h1 has no double spaces', !/\s{2,}/.test(hub.h1 || 'x'), hub.h1);

  check('category chips filter the grid', await evaluate(p, `
    const chip = [...document.querySelectorAll('.cat')].find(c => c.dataset.cat === 'Enrollment');
    if (!chip) return false;
    chip.click();
    const cards = [...document.querySelectorAll('[data-learn-grid] > li')];
    const shown = cards.filter(c => !c.hidden);
    return shown.length > 0
        && shown.length < cards.length
        && shown.every(c => c.dataset.cat === 'Enrollment')
        && chip.getAttribute('aria-pressed') === 'true';
  `));
  check('filtering writes a shareable ?topic= param', await evaluate(p, `
    return new URL(location.href).searchParams.get('topic') === 'Enrollment';
  `));
  check('"All" restores every card', await evaluate(p, `
    document.querySelector('.cat[data-cat="all"]').click();
    return [...document.querySelectorAll('[data-learn-grid] > li')].every(c => !c.hidden);
  `));
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);

  // Deep link straight into a filtered view.
  const q = await openPage('/learn/?topic=Costs');
  check('?topic= deep link applies on load', await evaluate(q, `
    const shown = [...document.querySelectorAll('[data-learn-grid] > li')].filter(c => !c.hidden);
    return shown.length > 0 && shown.every(c => c.dataset.cat === 'Costs');
  `));
  await closePage(q);
}

// ── 7c. every required article ───────────────────────────────────────────────
console.log('\nLearn — articles');
for (const slug of LEARN_SLUGS) {
  const p = await openPage(`/learn/${slug}/`);
  const a = await evaluate(p, `
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap(s => { try { return JSON.parse(s.textContent)['@graph'] || []; } catch { return []; } });
    const types = ld.map(n => n['@type']);
    const article = ld.find(n => n['@type'] === 'Article');
    const faq = ld.find(n => n['@type'] === 'FAQPage');
    const text = document.body.innerText;
    return {
      h1s: document.querySelectorAll('h1').length,
      title: document.title,
      desc: document.querySelector('meta[name=description]')?.content || '',
      canonical: document.querySelector('link[rel=canonical]')?.href || '',
      types,
      faqCount: faq?.mainEntity?.length ?? 0,
      faqRendered: document.querySelectorAll('.art__faq details').length,
      crumbs: document.querySelectorAll('.crumbs li').length,
      productLinks: document.querySelectorAll('a[href^="/medicare-advantage/"], a[href^="/medicare-supplement/"], a[href^="/part-d/"], a[href^="/long-term-care/"]').length,
      toolLinks: document.querySelectorAll('a[href^="/tools/"]').length,
      ctaHref: document.querySelector('.art__cta a.btn')?.getAttribute('href') || '',
      hasYear: /\\b2026\\b/.test(text),
      unresolved: /\\{\\{[a-zA-Z]/.test(document.body.innerHTML),
      words: text.split(/\\s+/).filter(Boolean).length,
      datePublished: article?.datePublished || '',
    };
  `);

  const bare = a.title.replace(/\s*\|\s*602Medicare\s*$/, '');
  const ok = (label, cond, detail) => check(`${slug} — ${label}`, cond, detail);

  ok('single h1', a.h1s === 1, String(a.h1s));
  ok(`SEO title ≤60 (${bare.length})`, bare.length <= 60 && bare.length > 10, bare);
  ok(`meta description ≤155 (${a.desc.length})`, a.desc.length <= 155 && a.desc.length > 40, a.desc);
  ok('canonical points at 602medicare.com', a.canonical === `https://602medicare.com/learn/${slug}/`, a.canonical);
  ok('Article + FAQPage + BreadcrumbList schema',
    a.types.includes('Article') && a.types.includes('FAQPage') && a.types.includes('BreadcrumbList'),
    a.types.join(','));
  ok('FAQ schema matches the rendered FAQ', a.faqCount >= 3 && a.faqCount === a.faqRendered,
    `schema ${a.faqCount} vs rendered ${a.faqRendered}`);
  ok('breadcrumbs rendered', a.crumbs === 3, String(a.crumbs));
  ok('links to a product page', a.productLinks > 0, String(a.productLinks));
  ok('links to a tool', a.toolLinks > 0, String(a.toolLinks));
  // The href is the booking page; the OFFER of a 15-minute call is in the
  // label. Asserting the offer against the href is what made this stale.
  ok('booking CTA points at the calendar', a.ctaHref === site.consult.url, a.ctaHref);
  ok('year-stamped 2026 figures', a.hasYear);
  ok('no unresolved {{tokens}}', !a.unresolved);
  ok('substantive length', a.words > 1200, `${a.words} rendered words`);
  ok('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

// ── 7d. the old hub is gone, and article motion is the light variant ─────────
console.log('\nLearn — consolidation & motion density');
{
  const p = await openPage(`/learn/${LEARN_SLUGS[0]}/`);
  check('article pages use the light motion density', await evaluate(p, `
    return document.documentElement.dataset.density === 'light';
  `));
  check('caustics run dimmer than the home page', await evaluate(p, `
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--caustics-opacity'));
    return v > 0 && v <= 0.25;
  `));
  check('article still reveals its content', await evaluate(p, `
    const armed = [...document.querySelectorAll('[data-armed]')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= innerHeight * 0.85 && r.height > 0;
    });
    return armed.length > 0 && armed.every(el => el.hasAttribute('data-revealed'));
  `));
  await closePage(p);

  const gone = await fetch(`${BASE}/articles/`).then((r) => r.status).catch(() => 0);
  check('the old /articles/ hub no longer builds', gone === 404, `got ${gone}`);
}

// ── 7e. the footer, sampled across every page type ───────────────────────────
console.log('\nFooter — every page type');
for (const path of ['/', '/medicare-advantage/', '/tools/cost-of-care/',
                    '/learn/irmaa-explained/', '/service-area/anthem-az/',
                    '/service-area/glendale-az/', '/service-area/peoria-az/', '/terms/']) {
  const p = await openPage(path);
  const f = await evaluate(p, `
    const el = document.querySelector('footer.site-footer');
    if (!el) return null;
    // innerText returns text AFTER text-transform, so the agent line reads
    // "22+ YEARS EXPERIENCE". Compare case-insensitively rather than asserting
    // on how CSS happened to render it.
    const raw = el.innerText;
    const t = { includes: (s) => raw.toLowerCase().includes(s.toLowerCase()) };
    const href = (h) => !!el.querySelector('a[href="' + h + '"]');
    const body = document.body.innerText;
    const TPMO = 'We do not offer every plan available in your area';
    const NONAFF = 'not connected with or endorsed by the United States government';
    const count = (hay, needle) => hay.split(needle).length - 1;
    return {
      wordmark: t.includes('602Medicare'),
      agent: t.includes('Brian Penner') && t.includes('22+ Years') && t.includes('NPN 8206556'),
      nap: t.includes(${JSON.stringify(site.address.display)})
         && t.includes(${JSON.stringify(site.phone.display)})
         && t.includes(${JSON.stringify(site.email)}),
      wrongBrand: ['Moab','Monticello','Grand Junction'].filter(c => t.includes(c)),
      services: ['/medicare-advantage/','/medicare-supplement/','/part-d/','/long-term-care/'].every(href),
      learnHub: href('/learn/'),
      learnArticles: el.querySelectorAll('a[href^="/learn/"]').length - 1,
      toolsHub: href('/tools/'),
      toolLinks: el.querySelectorAll('a[href^="/tools/"]').length - 1,
      company: ['/about/','/contact/','/accessibility/','/privacy/','/terms/'].every(href),
      ctaHref: el.querySelector('a.btn')?.getAttribute('href') || '',
      ctaLabel: el.querySelector('a.btn')?.textContent.trim() || '',
      license: t.includes('Licensed in 18 states'),
      copyright: /© 2026 602Medicare/i.test(raw),
      tpmoInFooter: count(raw, TPMO),
      tpmoInPage: count(body, TPMO),
      nonAffInPage: count(body, NONAFF),
      overflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
    };
  `);
  const ok = (label, cond, detail) => check(`${path} — ${label}`, cond, detail);
  ok('footer present', f !== null);
  if (!f) { await closePage(p); continue; }
  ok('brand block', f.wordmark && f.agent);
  ok('NAP block', f.nap);
  ok('no wrong-brand offices', f.wrongBrand.length === 0, f.wrongBrand.join(', '));
  ok('Services column complete', f.services);
  ok('Learn column with articles', f.learnHub && f.learnArticles >= 3, `${f.learnArticles} articles`);
  ok('Tools column with all 8', f.toolsHub && f.toolLinks === 8, `${f.toolLinks} tools`);
  ok('Company column complete', f.company);
  // href = where it goes, label = what it offers. Checking the offer against
  // the href is what left this failing after the calendar page landed.
  ok('booking CTA', f.ctaHref === site.consult.url && /15-minute/.test(f.ctaLabel),
    `${f.ctaLabel} → ${f.ctaHref}`);
  ok('licensing line', f.license);
  ok('2026 copyright', f.copyright);
  ok('TPMO exactly once, in the footer', f.tpmoInPage === 1 && f.tpmoInFooter === 1,
     `page ${f.tpmoInPage}, footer ${f.tpmoInFooter}`);
  ok('non-affiliation exactly once', f.nonAffInPage === 1, String(f.nonAffInPage));
  ok('no horizontal overflow', f.overflow);
  await closePage(p);
}

// ── 7e2. the service-area pages ──────────────────────────────────────────────
// Every city page is generated from one entry in src/data/locations.ts, so this
// is really a check on that data file: a city listed there must produce a real
// page, appear on the hub, cross-link from its neighbors and land in the
// LocalBusiness areaServed. Glendale and Peoria are the two the 602Medicare
// positioning line names, so they get asserted by name rather than by loop —
// silently losing either one would gut the metro claim without failing a count.
console.log('\nService area — city pages');
{
  const CITIES = [
    { slug: 'anthem-az', city: 'Anthem', zip: '85086', primary: true },
    { slug: 'glendale-az', city: 'Glendale', zip: '85308' },
    { slug: 'peoria-az', city: 'Peoria', zip: '85383' },
    { slug: 'phoenix-85086', city: 'North Phoenix', zip: '85086' },
    { slug: 'scottsdale-az', city: 'Scottsdale', zip: '85260' },
    { slug: 'carefree-az', city: 'Carefree', zip: '85377' },
    { slug: 'new-river-az', city: 'New River', zip: '85087' },
  ];

  // The hub first — every city has to be reachable from it.
  const hub = await openPage('/service-area/');
  const hubState = await evaluate(hub, `
    return {
      cards: document.querySelectorAll('.places > li').length,
      hrefs: [...document.querySelectorAll('.places a[href^="/service-area/"]')]
        .map(a => new URL(a.href).pathname),
      text: document.body.innerText,
    };
  `);
  check(`hub lists all ${CITIES.length} cities`, hubState.cards === CITIES.length,
    `${hubState.cards} cards`);
  for (const c of CITIES) {
    check(`hub links ${c.city}`, hubState.hrefs.includes(`/service-area/${c.slug}/`));
  }
  check('hub names Glendale and Peoria in its copy',
    /Glendale/.test(hubState.text) && /Peoria/.test(hubState.text));
  await closePage(hub);

  for (const c of CITIES) {
    const p = await openPage(`/service-area/${c.slug}/`);
    const a = await evaluate(p, `
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .flatMap(s => { try { return JSON.parse(s.textContent)['@graph'] || []; } catch { return []; } });
      const org = ld.find(n => (n['@type'] || []).includes && n['@type'].includes('LocalBusiness'));
      const svc = ld.find(n => n['@type'] === 'Service');
      const faq = ld.find(n => n['@type'] === 'FAQPage');
      const text = document.body.innerText;
      return {
        h1s: document.querySelectorAll('h1').length,
        h1: document.querySelector('h1')?.innerText.trim() || '',
        title: document.title,
        desc: document.querySelector('meta[name=description]')?.content || '',
        canonical: document.querySelector('link[rel=canonical]')?.href || '',
        crumbs: document.querySelectorAll('.crumbs li').length,
        types: ld.map(n => Array.isArray(n['@type']) ? n['@type'].join('+') : n['@type']),
        areaServed: (org?.areaServed || []).map(x => x.name),
        svcArea: svc?.areaServed?.name || '',
        faqCount: faq?.mainEntity?.length ?? 0,
        faqRendered: document.querySelectorAll('details').length,
        nearby: document.querySelectorAll('.nearby a[href^="/service-area/"]').length,
        localParas: document.querySelectorAll('.loc__body p').length,
        words: text.split(/\\s+/).filter(Boolean).length,
        text,
        overflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
      };
    `);
    const ok = (label, cond, detail) => check(`${c.slug} — ${label}`, cond, detail);

    ok('single h1', a.h1s === 1, String(a.h1s));
    ok('h1 names the city', a.h1.includes(c.city), a.h1);
    ok('title carries the brand', a.title.includes('602Medicare'), a.title);
    ok(`meta description ≤155 (${a.desc.length})`, a.desc.length <= 155 && a.desc.length > 40, a.desc);
    ok('canonical points at 602medicare.com',
      a.canonical === `https://602medicare.com/service-area/${c.slug}/`, a.canonical);
    ok('breadcrumbs rendered', a.crumbs === 3, String(a.crumbs));
    ok('Service + FAQPage + BreadcrumbList schema',
      a.types.includes('Service') && a.types.includes('FAQPage') && a.types.includes('BreadcrumbList'),
      a.types.join(','));
    ok('Service areaServed is this city', a.svcArea === c.city, a.svcArea);
    // The whole point of the data-driven list: the org node's areaServed has to
    // carry EVERY city, on every page, not just the one being viewed.
    ok('LocalBusiness areaServed covers all cities',
      CITIES.every((x) => a.areaServed.includes(x.city)), a.areaServed.join(', '));
    ok('FAQ schema matches the rendered FAQ',
      a.faqCount >= 3 && a.faqCount === a.faqRendered,
      `schema ${a.faqCount} vs rendered ${a.faqRendered}`);
    ok('cross-links every other city', a.nearby === CITIES.length - 1, String(a.nearby));
    ok('has genuine local copy', a.localParas >= 3, `${a.localParas} paragraphs`);
    ok('substantive length', a.words > 500, `${a.words} rendered words`);
    ok('quotes the local ZIP', a.text.includes(c.zip));
    ok('602 phone, not the old 623', a.text.includes('(602) 844-6002') && !a.text.includes('(623)'));
    ok('no horizontal overflow', a.overflow);
    ok('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
    await closePage(p);
  }
}

// ── 7f. footer at mobile width ───────────────────────────────────────────────
console.log('\nFooter — mobile');
{
  const p = await openPage('/');
  await p.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await sleep(500);
  check('mobile: footer columns stack without overflow', await evaluate(p, `
    const f = document.querySelector('footer.site-footer');
    return document.documentElement.scrollWidth <= window.innerWidth + 1
        && f.getBoundingClientRect().width <= window.innerWidth + 1;
  `));
  check('mobile: every footer link is a reachable tap target', await evaluate(p, `
    const links = [...document.querySelectorAll('footer.site-footer a')];
    return links.length > 20 && links.every(a => {
      const r = a.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.left >= -1 && r.right <= window.innerWidth + 1;
    });
  `));
  await closePage(p);
}

// ── 7g. the four new calculators ─────────────────────────────────────────────
console.log('\nTool — Plan G vs Plan N');
{
  const p = await openPage('/tools/plan-g-vs-plan-n/');
  const light = await evaluate(p, `
    const v = (id,val) => document.getElementById(id).value = val;
    v('gn-g',165); v('gn-n',130); v('gn-office',3); v('gn-er',0);
    document.getElementById('gn').requestSubmit();
    return { hidden: document.getElementById('gn-result').hidden,
             head: document.getElementById('gn-head').textContent,
             body: document.getElementById('gn-body').textContent,
             cols: document.getElementById('gn-cols').textContent };
  `);
  check('renders a comparison', !light.hidden && light.cols.includes('Plan G') && light.cols.includes('Plan N'));
  // Shared comparison-column CSS lives in ToolLayout, not on one tool page. It
  // used to live on the cost estimator, which meant a second tool reusing the
  // markup rendered unstyled full-width blocks — invisible to a text-only check.
  check('comparison columns are laid out side by side', await evaluate(p, `
    const cols = [...document.querySelectorAll('.cost-col')];
    if (cols.length !== 2) return false;
    const [a, b] = cols.map(c => c.getBoundingClientRect());
    const container = document.querySelector('.cost-cols').getBoundingClientRect();
    return Math.abs(a.y - b.y) < 2 && a.width < container.width * 0.6;
  `));
  check('few visits favor Plan N', /Plan N comes out/.test(light.head), light.head);
  check('states a breakeven visit count', /breakeven is about \d+ office/.test(light.body), light.body.slice(0, 120));
  const heavy = await evaluate(p, `
    document.getElementById('gn-office').value = 40;
    document.getElementById('gn').requestSubmit();
    return document.getElementById('gn-head').textContent;
  `);
  check('many visits flip it to Plan G', /Plan G comes out/.test(heavy), heavy);
  check('excess-charge field appears only when relevant', await evaluate(p, `
    const wrap = document.getElementById('gn-excess-wrap');
    const before = wrap.hidden;
    const r = document.querySelector('input[name="excess"][value="some"]');
    r.checked = true; r.dispatchEvent(new Event('change'));
    return before === true && wrap.hidden === false;
  `));
  check('excess charges are modeled at 15%', await evaluate(p, `
    document.getElementById('gn-excess-amt').value = 2000;
    document.getElementById('gn-office').value = 3;
    document.getElementById('gn').requestSubmit();
    // 15% of 2000 = 300, and it must land in the Plan N column only.
    // Compare against whitespace-collapsed text, so the needle must be too.
    const cols = document.getElementById('gn-cols').textContent.replace(/\\s/g,'');
    return cols.includes('Excesscharges$300') && cols.includes('Excesscharges$0');
  `));
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

console.log('\nTool — Part B giveback');
{
  const p = await openPage('/tools/part-b-giveback/');
  const base = await evaluate(p, `
    document.getElementById('gb-amount').value = 50;
    document.getElementById('gb').requestSubmit();
    return { hidden: document.getElementById('gb-result').hidden,
             stats: document.getElementById('gb-stats').textContent,
             body: document.getElementById('gb-body').textContent };
  `);
  check('renders a result', !base.hidden);
  check('nets $50 off the $202.90 premium', base.stats.includes('202.90') && base.stats.includes('152.90'), base.stats);
  check('annualises to $600', base.stats.includes('$600'), base.stats);
  check('caps a giveback above the standard premium', await evaluate(p, `
    document.getElementById('gb-amount').value = 400;
    document.getElementById('gb').requestSubmit();
    return /Capped at the standard premium/.test(document.getElementById('gb-body').textContent);
  `));
  check('states that IRMAA is NOT reduced', await evaluate(p, `
    document.getElementById('gb-amount').value = 50;
    const r = document.querySelector('input[name="irmaa"][value="yes"]');
    r.checked = true; r.dispatchEvent(new Event('change'));
    document.getElementById('gb-surcharge').value = 81.20;
    document.getElementById('gb').requestSubmit();
    return /IRMAA surcharge is untouched/.test(document.getElementById('gb-body').textContent);
  `));
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

console.log('\nTool — Part A premium');
{
  const p = await openPage('/tools/part-a-premium/');
  const free = await evaluate(p, `
    document.getElementById('pa-years').value = 15;
    document.getElementById('pa').requestSubmit();
    return { head: document.getElementById('pa-head').textContent,
             stats: document.getElementById('pa-stats').textContent };
  `);
  check('15 years → premium-free', /premium-free/.test(free.head) && free.stats.includes('60'), free.head);
  const reduced = await evaluate(p, `
    document.getElementById('pa-years').value = 8;
    document.getElementById('pa').requestSubmit();
    return document.getElementById('pa-stats').textContent;
  `);
  check('8 years (32 quarters) → the $311 reduced tier', reduced.includes('311') && reduced.includes('Reduced'), reduced);
  const full = await evaluate(p, `
    document.getElementById('pa-years').value = 5;
    document.getElementById('pa').requestSubmit();
    return document.getElementById('pa-stats').textContent;
  `);
  check('5 years (20 quarters) → the $565 full tier', full.includes('565') && full.includes('Full'), full);
  check('boundary: exactly 40 quarters is free', await evaluate(p, `
    const r = document.querySelector('input[name="mode"][value="quarters"]');
    r.checked = true; r.dispatchEvent(new Event('change'));
    document.getElementById('pa-quarters').value = 40;
    document.getElementById('pa').requestSubmit();
    return /premium-free/.test(document.getElementById('pa-head').textContent);
  `));
  check('boundary: 39 quarters is not free', await evaluate(p, `
    document.getElementById('pa-quarters').value = 39;
    document.getElementById('pa').requestSubmit();
    return document.getElementById('pa-stats').textContent.includes('311');
  `));
  check('surfaces the spouse-record route', await evaluate(p, `
    return /spouse/i.test(document.getElementById('pa-body').textContent);
  `));
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

console.log('\nTool — cost of care');
{
  const p = await openPage('/tools/cost-of-care/');
  const al = await evaluate(p, `
    const r = document.querySelector('input[name="type"][value="assisted"]');
    r.checked = true; r.dispatchEvent(new Event('change'));
    document.getElementById('coc-years').value = 3;
    document.getElementById('coc').requestSubmit();
    return { hidden: document.getElementById('coc-result').hidden,
             rate: document.getElementById('coc-rate').value,
             stats: document.getElementById('coc-stats').textContent,
             body: document.getElementById('coc-body').textContent };
  `);
  check('renders a result', !al.hidden);
  check('defaults to the Arizona assisted-living median', al.rate === '6250', al.rate);
  check('assisted living: Medicare pays nothing', /Medicare pays nothing/.test(al.body), al.body.slice(0, 140));
  check('3 years of assisted living ≈ $225,000', al.stats.includes('225,000'), al.stats);
  const home = await evaluate(p, `
    const r = document.querySelector('input[name="type"][value="home"]');
    r.checked = true; r.dispatchEvent(new Event('change'));
    return { rate: document.getElementById('coc-rate').value,
             hoursShown: !document.getElementById('coc-hours-wrap').hidden };
  `);
  check('home care switches to an hourly rate and shows hours', home.rate === '38' && home.hoursShown,
    JSON.stringify(home));
  const nursing = await evaluate(p, `
    const r = document.querySelector('input[name="type"][value="nursingSemi"]');
    r.checked = true; r.dispatchEvent(new Event('change'));
    document.getElementById('coc').requestSubmit();
    return { stats: document.getElementById('coc-stats').textContent,
             body: document.getElementById('coc-body').textContent };
  `);
  check('nursing home credits the 20 covered days', !/\$0.*Medicare pays/.test(nursing.stats.replace(/\s/g,'')) && /days 1–20/.test(nursing.body), nursing.body.slice(0, 140));
  check('names the CareScout source', await evaluate(p, `
    return /CareScout/.test(document.body.innerText);
  `));
  check('national toggle changes the default', await evaluate(p, `
    const t = document.querySelector('input[name="type"][value="assisted"]');
    t.checked = true; t.dispatchEvent(new Event('change'));
    const azRate = document.getElementById('coc-rate').value;
    const n = document.querySelector('input[name="region"][value="national"]');
    n.checked = true; n.dispatchEvent(new Event('change'));
    return azRate === '6250' && document.getElementById('coc-rate').value === '6200';
  `));
  check('no console errors', p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

// ── 7h. the tools hub lists all eight ────────────────────────────────────────
console.log('\nTools hub');
{
  const p = await openPage('/tools/');
  const TOOL_SLUGS = ['plan-type-finder', 'enrollment-timeline', 'medicare-cost-estimator',
    'irmaa-estimator', 'plan-g-vs-plan-n', 'part-b-giveback', 'part-a-premium', 'cost-of-care'];
  const hub = await evaluate(p, `
    return [...document.querySelectorAll('.tools a.card-link')].map(a => a.getAttribute('href'));
  `);
  check('hub grid lists all 8 tools', TOOL_SLUGS.every((s) => hub.includes(`/tools/${s}/`)),
    TOOL_SLUGS.filter((s) => !hub.includes(`/tools/${s}/`)).join(', '));
  check('no duplicate tiles', new Set(hub).size === hub.length, String(hub.length));
  await closePage(p);
}

// ── 8. reduced motion + mobile nav ───────────────────────────────────────────
console.log('\nAccessibility');
{
  const p = await openPage('/');
  await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await p.send('Page.reload');
  await sleep(1500);
  check('reduced motion: no armed element is hidden', await evaluate(p, `
    // .draw-rule is a decorative hairline drawn at 0.35 opacity by design, so
    // assert "not hidden" rather than "fully opaque".
    const els = [...document.querySelectorAll('[data-armed]')];
    const hidden = els.filter(el => {
      if (el.classList.contains('draw-rule')) return parseFloat(getComputedStyle(el).opacity) === 0;
      return parseFloat(getComputedStyle(el).opacity) < 1;
    });
    return els.length > 5 && hidden.length === 0;
  `));
  check('reduced motion: decorative rules are drawn, not collapsed', await evaluate(p, `
    return [...document.querySelectorAll('.draw-rule')].every(el => {
      const m = getComputedStyle(el).transform;
      return m === 'none' || !/^matrix\\(0[,)]/.test(m);
    });
  `));
  check('reduced motion: kinetic words are not translated away', await evaluate(p, `
    return [...document.querySelectorAll('.k-word')]
      .every(el => { const t = getComputedStyle(el).transform; return t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)'; });
  `));
  check('reduced motion: scroll progress bar removed', await evaluate(p, `
    return getComputedStyle(document.querySelector('.scroll-progress')).display === 'none';
  `));
  check('reduced motion: caustics still render a static frame', await evaluate(p, `
    const c = document.querySelector('canvas.caustics');
    const d = c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
    return n > 0;
  `));
  check('reduced motion: that frame does NOT animate', await evaluate(p, `
    const c = document.querySelector('canvas.caustics');
    const g = c.getContext('2d');
    const snap = () => g.getImageData(0,0,c.width,c.height).data.slice(0,4000).join(',');
    const a = snap();
    return new Promise(res => setTimeout(() => res(snap() === a), 500));
  `));
  await closePage(p);

  const m = await openPage('/');
  await m.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await sleep(400);
  check('mobile: nav toggle opens the panel', await evaluate(m, `
    const t = document.querySelector('[data-nav-toggle]');
    t.click();
    return t.getAttribute('aria-expanded') === 'true'
        && document.querySelector('[data-nav-panel]').hasAttribute('data-open');
  `));
  check('mobile: Escape closes it and restores scrolling', await evaluate(m, `
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    return document.querySelector('[data-nav-toggle]').getAttribute('aria-expanded') === 'false'
        && document.body.style.overflow === '';
  `));
  check('mobile: no horizontal overflow', await evaluate(m, `
    return document.documentElement.scrollWidth <= window.innerWidth + 1;
  `));
  check('mobile: magnetic buttons are disabled on coarse pointers', await evaluate(m, `
    const b = document.querySelector('[data-magnetic]');
    return !b.style.translate;
  `));
  await closePage(m);
}

// ── 12. the booking picker, on a phone ───────────────────────────────────────
// This is the page every CTA on the site lands on, and its audience is 65-plus
// on a handset. So the whole flow is walked at 375×812 — an iPhone SE/12 mini,
// the narrowest screen worth supporting — and the size of every control the
// visitor has to hit is measured rather than eyeballed.
//
// The availability and booking calls are STUBBED. Two reasons, both firm:
// a suite that booked an appointment every time it ran would fill Brian's real
// calendar with test entries, and one that depended on a third party's uptime
// would go red for reasons that have nothing to do with this code. The live API
// is checked separately, once, read-only, at the end of this block.
console.log('\nBooking — 375px, the full flow');
if (booking.mode !== 'native') {
  skip('the whole native-picker flow', `booking.mode is '${booking.mode}' — /book/ serves GoGuruX's widget`);
} else {
  const NAVY = 'rgb(1, 20, 89)';
  const MIN_TAP = 48;   // px, the floor for anything you tap
  const MIN_TYPE = 18;  // px, the floor for type on a control

  // Intercepts only the scheduler's origin; every other request on the page is
  // left completely alone.
  const stub = `
    (() => {
      const real = window.fetch;
      window.__bookingCalls = [];
      const CAL = {
        id: 'test-calendar-id', name: '602 Medicare', slot_duration: 30,
        time_zone: 'America/Denver', bookable_weekdays: [1,2,3,4,5],
      };
      window.fetch = function (input, init) {
        const url = String(typeof input === 'string' ? input : input.url || '');
        if (!url.includes('supabase.co') && !url.includes('/api/availability')) return real.apply(this, arguments);
        window.__bookingCalls.push({ url, method: (init && init.method) || 'GET', body: init && init.body });

        if (url.includes('/api/availability')) {
          const date = new URL(url, location.origin).searchParams.get('date');
          // 08:00–10:30 in the calendar's own timezone (UTC-6 in August), which
          // is 07:00–09:30 in Arizona — the one-hour gap the picker exists to
          // present correctly.
          const slots = [0,1,2,3,4,5].map((i) => {
            const s = new Date(date + 'T14:00:00.000Z');
            s.setUTCMinutes(s.getUTCMinutes() + i * 30);
            const e = new Date(s.getTime() + 30 * 60000);
            return { start: date + 'T08:00:00', end: date + 'T08:30:00',
                     startUtc: s.toISOString(), endUtc: e.toISOString(), available: true };
          });
          return Promise.resolve(new Response(
            JSON.stringify({ success: true, calendar: CAL, slots }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }));
        }
        if (url.includes('create-booking')) {
          return Promise.resolve(new Response(
            JSON.stringify({ contact_id: 'test-contact' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }));
        }
        return real.apply(this, arguments);
      };
    })();
  `;

  const p = await openPage('/book/', stub);
  await p.send('Emulation.setDeviceMetricsOverride', {
    width: 375, height: 812, deviceScaleFactor: 2, mobile: true,
  });
  await p.send('Page.reload');
  await sleep(2200); // the boot request plus the first warm lookups

  /* ── the date grid ─────────────────────────────────────────────────────── */

  check('mobile: the date grid renders without being opened', await evaluate(p, `
    const g = document.querySelector('[data-cal-grid]');
    if (!g) return false;
    const cells = g.querySelectorAll('[data-day]');
    const r = g.getBoundingClientRect();
    // A whole month of whole weeks is 35 or 42 cells, and the grid has to have
    // real area — this is the check that would have caught the collapsed embed.
    return cells.length >= 35 && r.width > 300 && r.height > 200;
  `));

  check('mobile: the grid is a full month, not a strip of a few days', await evaluate(p, `
    const inMonth = [...document.querySelectorAll('[data-day]')]
      .filter(b => !b.classList.contains('bk__day--outside'));
    return inMonth.length >= 28 && inMonth.length <= 31;
  `));

  check('mobile: no dropdown, listbox or scroll wheel anywhere in the picker',
    await evaluate(p, `
      const bk = document.querySelector('[data-booking]');
      return bk.querySelectorAll('select, [role="listbox"], [role="combobox"], input[type="date"], input[type="time"]').length === 0;
    `));

  check('mobile: no horizontal overflow', await evaluate(p, `
    return document.documentElement.scrollWidth <= window.innerWidth + 1;
  `));

  {
    const cells = await evaluate(p, `
      const days = [...document.querySelectorAll('[data-day]')]
        .filter(b => !b.disabled);
      return days.map(b => {
        const r = b.getBoundingClientRect();
        return { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100,
                 f: parseFloat(getComputedStyle(b).fontSize), d: b.dataset.day };
      });
    `);
    const tooSmall = cells.filter((c) => c.w < MIN_TAP || c.h < MIN_TAP);
    const tooFine = cells.filter((c) => c.f < MIN_TYPE);
    check(`mobile: every bookable day cell is ≥${MIN_TAP}px on both sides`,
      cells.length > 5 && tooSmall.length === 0,
      `${cells.length} cells, ${tooSmall.length} too small: ${JSON.stringify(tooSmall.slice(0, 3))}`);
    check(`mobile: every day cell is ≥${MIN_TYPE}px type`,
      tooFine.length === 0, JSON.stringify(tooFine.slice(0, 3)));
  }

  check('mobile: unavailable days are greyed and unclickable', await evaluate(p, `
    const shut = [...document.querySelectorAll('[data-day].bk__day--shut')];
    return shut.length > 3 && shut.every(b => b.disabled);
  `));

  check('the fallback phone line is present before anything is chosen',
    await evaluate(p, `
      return /Calendar not loading\\?/.test(document.body.innerText)
          && !!document.querySelector('[data-cta="book-fallback-call"]');
    `));

  check('the time step is not shown until a day is chosen', await evaluate(p, `
    return document.querySelector('[data-step-time]').hidden === true;
  `));

  /* ── pick a day ────────────────────────────────────────────────────────── */

  check('choosing a day fills it navy', await evaluate(p, `
    const day = [...document.querySelectorAll('[data-day]')].find(b => !b.disabled);
    day.click();
    return new Promise(res => setTimeout(() => {
      const on = document.querySelector('[data-day].bk__day--on');
      res(!!on && getComputedStyle(on).backgroundColor === '${NAVY}'
          && on.getAttribute('aria-pressed') === 'true');
    }, 600));
  `));

  check('the time slots appear below the calendar', await evaluate(p, `
    const cal = document.querySelector('[data-cal-grid]').getBoundingClientRect();
    const step = document.querySelector('[data-step-time]');
    const slots = step.querySelectorAll('[data-slot]');
    // "Below" literally: further down the document than the grid it follows.
    return step.hidden === false && slots.length > 0
        && step.getBoundingClientRect().top > cal.top;
  `));

  check('the times are labelled with the timezone they are in', await evaluate(p, `
    return /Arizona time/i.test(document.querySelector('[data-time-sub]').textContent);
  `));

  check('slots are shown in Arizona time, not the calendar timezone', await evaluate(p, `
    // The stub's first slot is 14:00Z. Denver reads that as 8:00 AM, Phoenix as
    // 7:00 AM. Showing 8:00 would send a visitor to the phone an hour late.
    const first = document.querySelector('[data-slot] .bk__slot-time');
    return /^7:00\\s?AM$/.test(first.textContent.replace(/\\u00a0/g, ' ').trim());
  `));

  {
    const slots = await evaluate(p, `
      return [...document.querySelectorAll('[data-slot]')].map(b => {
        const r = b.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height),
                 f: parseFloat(getComputedStyle(b).fontSize), t: b.innerText.trim() };
      });
    `);
    const small = slots.filter((s) => s.w < MIN_TAP || s.h < MIN_TAP);
    const fine = slots.filter((s) => s.f < MIN_TYPE);
    check(`mobile: every time button is ≥${MIN_TAP}px`,
      slots.length > 1 && small.length === 0, JSON.stringify(small.slice(0, 3)));
    check(`mobile: every time button is ≥${MIN_TYPE}px type`,
      fine.length === 0, JSON.stringify(fine.slice(0, 3)));
  }

  check('Continue is disabled until a time is chosen', await evaluate(p, `
    return document.querySelector('[data-continue]').disabled === true;
  `));

  /* ── pick a time ───────────────────────────────────────────────────────── */

  check('choosing a time fills it navy and shows a checkmark', await evaluate(p, `
    const s = document.querySelectorAll('[data-slot]')[1];
    s.click();
    // The fill and the tick both cross-fade over 140ms, and getComputedStyle
    // during a transition returns the interpolated value — so read the END
    // state, not the frame the click landed on.
    return new Promise(res => setTimeout(() => {
      const on = document.querySelector('[data-slot].bk__slot--on');
      if (!on) return res(false);
      const tick = on.querySelector('.bk__slot-tick');
      res(getComputedStyle(on).backgroundColor === '${NAVY}'
       && on.getAttribute('aria-pressed') === 'true'
       && parseFloat(getComputedStyle(tick).opacity) === 1
       && !!tick.querySelector('svg'));
    }, 400));
  `));

  check('only one time is selected at a time', await evaluate(p, `
    document.querySelectorAll('[data-slot]')[3].click();
    return document.querySelectorAll('[data-slot].bk__slot--on').length === 1;
  `));

  check('Continue becomes available', await evaluate(p, `
    return document.querySelector('[data-continue]').disabled === false;
  `));

  /* ── continue ──────────────────────────────────────────────────────────── */

  check('Continue opens the details step with the chosen time echoed back',
    await evaluate(p, `
      document.querySelector('[data-continue]').click();
      return new Promise(res => setTimeout(() => {
        const step = document.querySelector('[data-step-details]');
        const chosen = document.querySelector('[data-chosen]').textContent;
        res(step.hidden === false && /Arizona time/.test(chosen) && /AM|PM/.test(chosen));
      }, 700));
    `));

  {
    const fields = await evaluate(p, `
      return [...document.querySelectorAll('.bk__field input, .bk__field textarea')].map(el => {
        const r = el.getBoundingClientRect();
        return { n: el.name, h: Math.round(r.height), f: parseFloat(getComputedStyle(el).fontSize) };
      });
    `);
    const fine = fields.filter((f) => f.f < MIN_TYPE);
    const short = fields.filter((f) => f.h < MIN_TAP);
    check(`mobile: every form field is ≥${MIN_TYPE}px type`,
      fields.length >= 4 && fine.length === 0, JSON.stringify(fine));
    check(`mobile: every form field is ≥${MIN_TAP}px tall`,
      short.length === 0, JSON.stringify(short));
  }

  check('the form refuses a booking with no way to reach anyone', await evaluate(p, `
    const f = document.querySelector('[data-booking-form]');
    f.querySelector('[name=firstName]').value = 'Ada';
    f.querySelector('[name=lastName]').value = 'Lovelace';
    f.querySelector('[name=phone]').value = '';
    f.querySelector('[name=email]').value = '';
    f.requestSubmit();
    return new Promise(res => setTimeout(() => {
      const err = document.querySelector('[data-form-error]');
      res(err.hidden === false && /phone number or an email/i.test(err.textContent)
          && document.querySelector('[data-done]').hidden === true);
    }, 300));
  `));

  /* ── book it ───────────────────────────────────────────────────────────── */

  check('a complete form books and confirms', await evaluate(p, `
    const f = document.querySelector('[data-booking-form]');
    f.querySelector('[name=phone]').value = '(602) 555-0143';
    f.requestSubmit();
    return new Promise(res => setTimeout(() => {
      const done = document.querySelector('[data-done]');
      res(done.hidden === false && /Arizona time/.test(
        document.querySelector('[data-done-when]').textContent));
    }, 900));
  `));

  check('the booking POST carried the fields the API requires', await evaluate(p, `
    const post = window.__bookingCalls.filter(c => c.url.includes('create-booking')).pop();
    if (!post) return false;
    const b = JSON.parse(post.body);
    return post.method === 'POST'
        && b.calendarId === 'test-calendar-id'
        && b.firstName === 'Ada' && b.lastName === 'Lovelace'
        && /^\\d{4}-\\d{2}-\\d{2}T/.test(b.startTime) && !!b.endTime
        && b.durationMinutes === 30
        && b.locationType === 'phone'
        // The CALENDAR's timezone goes to the server; only the display is
        // converted to Arizona. Sending Phoenix here would move the appointment.
        && b.timeZone === 'America/Denver';
  `));

  check('the phone fallback survives all the way to the confirmation',
    await evaluate(p, `
      return /Calendar not loading\\?/.test(document.body.innerText);
    `));

  check('the third-party embed was never loaded on the happy path',
    await evaluate(p, `
      const f = document.querySelector('[data-fallback-frame]');
      return document.querySelector('[data-fallback]').hidden === true && !f.src;
    `));

  check('no console errors through the whole flow',
    p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

// ── 12b. the fallback, when the API is down ──────────────────────────────────
// The picker talks to an undocumented endpoint (see src/config/booking.ts). The
// thing that keeps that acceptable is this: when it fails, the visitor gets the
// embed they had before plus a phone number, not an empty box.
console.log('\nBooking — the API is down');
if (booking.mode !== 'native') {
  skip('the failed-lookup fallback', `booking.mode is '${booking.mode}' — there is no lookup to fail`);
} else {
  const p = await openPage('/book/', `
    (() => {
      const real = window.fetch;
      window.fetch = function (input) {
        const url = String(typeof input === 'string' ? input : input.url || '');
        if (url.includes('/api/availability') || url.includes('supabase.co')) return Promise.reject(new Error('offline'));
        return real.apply(this, arguments);
      };
    })();
  `);
  await p.send('Emulation.setDeviceMetricsOverride', {
    width: 375, height: 812, deviceScaleFactor: 2, mobile: true,
  });
  await p.send('Page.reload');
  await sleep(2200);

  check('a failed lookup falls back to the embed rather than an empty box',
    await evaluate(p, `
      const box = document.querySelector('[data-fallback]');
      const frame = document.querySelector('[data-fallback-frame]');
      return box.hidden === false && !!frame.getAttribute('src');
    `));

  check('the phone number is still on the page when everything else failed',
    await evaluate(p, `
      return /Calendar not loading\\?/.test(document.body.innerText)
          && !!document.querySelector('[data-cta="book-fallback-call"]');
    `));

  check('a fallback is not reported as a page error',
    p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

// ── 12c. the live scheduler still answers ────────────────────────────────────
// The one check in this suite that touches the network. It is read-only — it
// asks for availability and never books — and it exists because the endpoint
// behind /book/ is undocumented and unversioned. If GoGuruX changes its shape,
// this is what says so, instead of the page quietly falling back to the embed
// for every visitor and nobody noticing.
console.log('\nBooking — the live scheduler');
if (booking.mode !== 'native') {
  skip('the live availability endpoint', `booking.mode is '${booking.mode}' — the site no longer calls it`);
} else {
  // The next Monday-to-Friday day from now, in the market's timezone. Asking
  // about a Saturday would come back legitimately empty and read as a break.
  const day = (() => {
    const d = new Date();
    for (let i = 0; i < 8; i++) {
      const iso = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Phoenix', year: 'numeric', month: '2-digit', day: '2-digit',
      }).format(d);
      const w = new Date(iso + 'T00:00:00Z').getUTCDay();
      if (w >= 1 && w <= 5) return iso;
      d.setDate(d.getDate() + 1);
    }
    return null;
  })();

  let body = null, err = '';
  try {
    const q = new URLSearchParams({
      date: day, duration: String(booking.defaultDuration),
      location_slug: booking.locationSlug, calendar_slug: booking.calendarSlug,
    });
    const res = await fetch(`${booking.supabaseUrl}/functions/v1/get-availability?${q}`, {
      headers: { Authorization: `Bearer ${booking.supabaseAnonKey}` },
      signal: AbortSignal.timeout(20000),
    });
    body = await res.json();
  } catch (e) { err = String(e); }

  check('the live availability endpoint answers', !!body?.success, err || JSON.stringify(body).slice(0, 200));
  check('it still names the calendar the picker books against',
    !!body?.calendar?.id && !!body?.calendar?.time_zone,
    JSON.stringify(body?.calendar || {}).slice(0, 200));
  check('it still returns slots shaped the way the picker reads them',
    Array.isArray(body?.slots) && body.slots.length > 0
      && typeof body.slots[0].startUtc === 'string'
      && typeof body.slots[0].endUtc === 'string',
    JSON.stringify(body?.slots?.[0] || body?.slots || null).slice(0, 200));
  check('the calendar still takes bookings Monday to Friday',
    Array.isArray(body?.calendar?.bookable_weekdays) && body.calendar.bookable_weekdays.length > 0,
    JSON.stringify(body?.calendar?.bookable_weekdays));
}

// ── 12d. the widget, which is what /book/ actually serves ────────────────────
// GoGuruX's own booking widget, the same one Medicare On Main books against.
// It is primary because it is the only thing that reliably honours the Google
// Calendar blocks on this calendar — the hand-rolled picker offered times Brian
// had blocked, which is the failure these checks exist to keep from returning.
//
// The strongest assertion here is the negative one: the page must not call the
// availability endpoint AT ALL. A slot this site never fetches is a slot it
// cannot offer over the top of something in Brian's diary.
console.log('\nBooking — the GoGuruX widget');
if (booking.mode !== 'embed') {
  skip('the widget path', `booking.mode is '${booking.mode}' — /book/ draws its own controls`);
} else {
  const p = await openPage('/book/', `
    (() => {
      const real = window.fetch;
      window.__calls = [];
      window.fetch = function (input) {
        window.__calls.push(String(typeof input === 'string' ? input : input.url || ''));
        return real.apply(this, arguments);
      };
    })();
  `);
  await p.send('Emulation.setDeviceMetricsOverride', {
    width: 375, height: 812, deviceScaleFactor: 2, mobile: true,
  });
  await p.send('Page.reload');
  await sleep(2200);

  const w = await evaluate(p, `
    const box = document.querySelector('[data-fallback]');
    const frame = document.querySelector('[data-fallback-frame]');
    const note = document.querySelector('[data-fallback-note]');
    const steps = [...document.querySelectorAll('.bk__step')];
    const r = frame ? frame.getBoundingClientRect() : null;
    return {
      shown: !!box && box.hidden === false,
      src: frame ? frame.src : null,
      w: r ? Math.round(r.width) : 0,
      h: r ? Math.round(r.height) : 0,
      noteText: note ? note.textContent.trim() : null,
      stepsHidden: steps.length > 0 && steps.every(s => s.hidden),
      dayCells: document.querySelectorAll('[data-day]').length,
      supabase: (window.__calls || []).filter(u => u.includes('supabase.co')),
      overflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
      phone: /Calendar not loading\\?/.test(document.body.innerText)
             && !!document.querySelector('[data-cta="book-fallback-call"]'),
    };
  `);

  check('the widget is what the page shows', w.shown && !!w.src);
  check('it points at the calendar MOM books against',
    w.src === booking.embedUrl, w.src);
  check('NOTHING asks the availability endpoint',
    w.supabase.length === 0, w.supabase.join(' | '));
  check('the native picker is not drawn at all',
    w.stepsHidden && w.dayCells === 0, `stepsHidden=${w.stepsHidden} cells=${w.dayCells}`);
  check('the widget is not apologised for — it is the intended calendar',
    w.noteText === '', w.noteText);
  check('the frame has real area on a phone', w.w > 300 && w.h > 200, `${w.w}×${w.h}`);
  check('no horizontal overflow at 375px', w.overflow);
  check('the phone number is on the page, as in every other state', w.phone);
  check('the widget path is not reported as a page error',
    p.consoleErrors.length === 0, p.consoleErrors.join(' | '));
  await closePage(p);
}

/* ═══════════════════════════════════════════════════════════════════════ */
chrome.kill();
const failed = results.filter((r) => !r.ok);
console.log('\n' + '─'.repeat(70));
console.log(`${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log('\nFailures:');
  for (const f of failed) console.log(`  ✖ ${f.name}${f.detail ? `\n      ${f.detail}` : ''}`);
  process.exit(1);
}
console.log('✅ All end-to-end checks passed.');
