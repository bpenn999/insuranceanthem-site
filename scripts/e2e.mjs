/**
 * Headless end-to-end checks driven over the Chrome DevTools Protocol.
 * Node's built-in WebSocket means this needs no dependencies at all.
 *
 *   node e2e.mjs            (requires `npx astro preview --port 4331` running)
 */
const BASE = process.env.BASE || 'http://localhost:4331';
const PORT = 9333;

import { spawn } from 'node:child_process';

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
    const rev = await evaluate(p, `
      const armed = [...document.querySelectorAll('[data-armed]')];
      // Only assert on elements comfortably inside the viewport — one that is
      // half off the bottom legitimately has not met the observer threshold yet.
      const visible = armed.filter(el => {
        const r = el.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= innerHeight * 0.85 && r.height > 0;
      });
      const missed = visible.filter(el => !el.hasAttribute('data-revealed'));
      return {
        vh: innerHeight, total: armed.length, visible: visible.length,
        missed: missed.map(el => el.tagName + '.' + String(el.className).slice(0, 40)),
      };
    `);
    check('every fully-visible armed element is revealed',
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
    document.getElementById('lead-phone').value = '6235550100';
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
  check('light usage favours Advantage', /Advantage comes out/.test(light.head), light.head);
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
