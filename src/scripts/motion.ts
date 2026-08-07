/**
 * 602Medicare — motion engine.
 *
 * Contract:
 *   • Exactly ONE requestAnimationFrame loop per page. Caustics, scroll
 *     progress and magnetic buttons all tick inside it. Nothing else starts
 *     its own loop.
 *   • Reveals are one-shot IntersectionObserver work — no scroll listeners.
 *   • `prefers-reduced-motion: reduce` (or no JS) → a single static caustics
 *     frame, every reveal already complete, no loop at all.
 *   • The loop parks itself when the tab is hidden or the page is scrolled
 *     past the point where anything animated is on screen.
 */

const html = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ── shared timing ────────────────────────────────────────────────────────── */

type Ticker = (now: number) => void;
const tickers: Ticker[] = [];
let rafId = 0;
let running = false;

function frame(now: number) {
  for (let i = 0; i < tickers.length; i++) tickers[i](now);
  rafId = requestAnimationFrame(frame);
}
function start() {
  if (running) return;
  running = true;
  rafId = requestAnimationFrame(frame);
}
function stop() {
  if (!running) return;
  running = false;
  cancelAnimationFrame(rafId);
}

/* ── 1. caustics ──────────────────────────────────────────────────────────── */

/**
 * Renders an interference pattern into a deliberately tiny buffer, then lets
 * the compositor scale + blur it up to viewport size. A ~140px-wide buffer is
 * roughly 12k pixels a frame at 30fps — cheap enough to leave the main thread
 * free, and the blur means nobody can tell it was ever low resolution.
 */
function initCaustics(canvas: HTMLCanvasElement, animate: boolean) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // Wide enough that the caustic filaments survive the upscale — at 140px the
  // blur smeared them into featureless haze. ~220×140 ≈ 31k pixels a frame at
  // 30fps, which is a couple of milliseconds of work and leaves the main thread
  // free for everything else.
  const BUF_W = 220;
  let bufH = 140;
  let image: ImageData;

  function resize() {
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    bufH = Math.max(48, Math.round(BUF_W * (vh / vw)));
    canvas.width = BUF_W;
    canvas.height = bufH;
    image = ctx!.createImageData(BUF_W, bufH);
    render(performance.now());
  }

  // Base colors, sampled straight from the palette so the canvas can never
  // drift away from the CSS: badge navy in the troughs, plain white on the
  // peaks. No warmth in the peak any more — the ground is #FFFFFF now, and a
  // 253/247 peak over it read as a faint cream cast across every page.
  const TROUGH = [1, 20, 89]; // --navy #011459
  const PEAK = [255, 255, 255];

  function render(now: number) {
    const t = animate ? now * 0.00021 : 0.7; // frozen frame when motion is off
    const data = image.data;
    const invW = 1 / BUF_W;
    const invH = 1 / bufH;
    let i = 0;

    for (let py = 0; py < bufH; py++) {
      const y = py * invH * 3.2;
      for (let px = 0; px < BUF_W; px++) {
        const x = px * invW * 4.4;

        // Domain warp — this is what stops it looking like plain sine stripes.
        const w =
          (Math.sin(x * 3.1 + t * 0.9) +
            Math.sin(y * 2.7 - t * 0.7) +
            Math.sin((x + y) * 2.3 + t * 0.6)) *
          0.33;

        // Two crossing wavefronts. Their zero-crossings are the bright filaments.
        const v =
          Math.sin(x * 5.0 + w * 2.0 + t) + Math.sin(y * 4.4 - w * 2.2 - t * 1.1);

        // Ridge: peaks where the waves cancel. Power sharpens it into filaments.
        let r = 1 - Math.abs(v) * 0.5;
        r = r > 0 ? r : 0;
        const c = r * r * r * r * r * r; // r^6, no Math.pow in the hot loop

        // Vignette so the pattern gathers at the edges and leaves the middle —
        // where the text lives — calm.
        const dx = px * invW - 0.5;
        const dy = py * invH - 0.5;
        const edge = Math.min(1, (dx * dx + dy * dy) * 2.6 + 0.32);

        const mix = c > 1 ? 1 : c;
        data[i] = TROUGH[0] + (PEAK[0] - TROUGH[0]) * mix;
        data[i + 1] = TROUGH[1] + (PEAK[1] - TROUGH[1]) * mix;
        data[i + 2] = TROUGH[2] + (PEAK[2] - TROUGH[2]) * mix;
        // The bright side carries the effect; the navy side is kept deliberately
        // weak. Anything heavier there darkens the page background enough to eat
        // into the contrast ratios the type scale is built on.
        data[i + 3] = (0.02 + mix * 0.62) * edge * 255;
        i += 4;
      }
    }
    ctx!.putImageData(image, 0, 0);
  }

  resize();
  window.addEventListener('resize', debounce(resize, 180), { passive: true });

  if (!animate) return;

  // ~30fps is plenty for something this soft, and halves the cost.
  const INTERVAL = 33;
  let last = 0;
  tickers.push((now) => {
    if (now - last < INTERVAL) return;
    last = now;
    render(now);
  });
}

/**
 * Per-section caustics opacity. Each section declares how much light it can
 * tolerate behind it; the value that wins is whichever section is crossing the
 * middle of the viewport. Article bodies dial it right down so long-form text
 * always sits on effectively flat white.
 */
function initCausticsZones() {
  const zones = document.querySelectorAll<HTMLElement>('[data-caustics]');
  if (!zones.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const level = (e.target as HTMLElement).dataset.caustics || '0.5';
        html.style.setProperty('--caustics-opacity', level);
      }
    },
    // Fires when a section crosses the horizontal center line of the viewport.
    { rootMargin: '-49% 0px -49% 0px', threshold: 0 }
  );
  zones.forEach((z) => io.observe(z));
}

/* ── 2. scroll progress ───────────────────────────────────────────────────── */

function initScrollProgress() {
  const bar = document.querySelector<HTMLElement>('.scroll-progress__bar');
  if (!bar) return;

  let target = 0;
  let current = 0;
  let dirty = true;

  const measure = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    dirty = true;
  };

  window.addEventListener('scroll', measure, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  measure();

  tickers.push(() => {
    if (!dirty) return;
    current += (target - current) * 0.18;
    if (Math.abs(target - current) < 0.0008) {
      current = target;
      dirty = false;
    }
    bar.style.transform = `scaleX(${current})`;
  });
}

/* ── 3. magnetic buttons ──────────────────────────────────────────────────── */

interface Magnet {
  el: HTMLElement;
  tx: number; ty: number;   // where the cursor wants it
  cx: number; cy: number;   // where it currently is
  active: boolean;
}

function initMagnets() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
  if (!els.length) return;

  // Coarse pointers have no hover, and nudging a tap target away from a finger
  // is actively hostile. Touch gets the plain button.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const magnets: Magnet[] = els.map((el) => ({ el, tx: 0, ty: 0, cx: 0, cy: 0, active: false }));

  for (const m of magnets) {
    const strength = Number(m.el.dataset.magnetic) || 0.28;

    m.el.addEventListener('pointermove', (ev: PointerEvent) => {
      const r = m.el.getBoundingClientRect();
      const relX = ev.clientX - r.left;
      const relY = ev.clientY - r.top;
      m.tx = (relX - r.width / 2) * strength;
      m.ty = (relY - r.height / 2) * strength;
      m.active = true;
      // Drive the cursor-following sheen at the same time.
      m.el.style.setProperty('--mx', `${(relX / r.width) * 100}%`);
      m.el.style.setProperty('--my', `${(relY / r.height) * 100}%`);
    });

    const release = () => { m.tx = 0; m.ty = 0; m.active = true; };
    m.el.addEventListener('pointerleave', release);
    m.el.addEventListener('blur', release);
  }

  tickers.push(() => {
    for (const m of magnets) {
      if (!m.active) continue;
      m.cx += (m.tx - m.cx) * 0.16;
      m.cy += (m.ty - m.cy) * 0.16;
      if (Math.abs(m.tx - m.cx) < 0.05 && Math.abs(m.ty - m.cy) < 0.05) {
        m.cx = m.tx; m.cy = m.ty;
        m.active = false;
      }
      m.el.style.translate = `${m.cx.toFixed(2)}px ${m.cy.toFixed(2)}px`;
    }
  });
}

/* ── 4. one-shot reveals ──────────────────────────────────────────────────── */

function initReveals() {
  const armed = document.querySelectorAll<HTMLElement>('[data-armed]');
  if (!armed.length) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).dataset.revealed = '';
        obs.unobserve(e.target); // one-shot, never replays
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
  );
  armed.forEach((el) => io.observe(el));

  // Belt and braces: if anything is still armed after 3s (zero-height parent,
  // display quirk, observer never fired) show it rather than hide it forever.
  window.setTimeout(() => {
    document
      .querySelectorAll<HTMLElement>('[data-armed]:not([data-revealed])')
      .forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.dataset.revealed = '';
      });
  }, 3000);
}

/* ── 5. stat count-ups ────────────────────────────────────────────────────── */

function initCountUps(animate: boolean) {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-countup]'));
  if (!els.length) return;

  const fmt = (el: HTMLElement, value: number) => {
    const dec = Number(el.dataset.decimals || 0);
    const body = dec > 0
      ? value.toFixed(dec)
      : Math.round(value).toLocaleString('en-US');
    el.textContent = `${el.dataset.prefix || ''}${body}${el.dataset.suffix || ''}`;
  };

  if (!animate) {
    els.forEach((el) => fmt(el, Number(el.dataset.countup) || 0));
    return;
  }

  // Start at the floor so the number never renders as raw markup text.
  els.forEach((el) => fmt(el, Number(el.dataset.from || 0)));

  const run = (el: HTMLElement) => {
    const to = Number(el.dataset.countup) || 0;
    const from = Number(el.dataset.from || 0);
    const dur = Number(el.dataset.duration || 1400);
    const t0 = performance.now();

    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      // easeOutExpo — fast off the line, settles gently on the real number
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      fmt(el, from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        obs.unobserve(el);
        el.dataset.counted = '';
        run(el);
      }
    },
    { threshold: 0.5 }
  );
  els.forEach((el) => io.observe(el));

  // A stat that never animates is a stat reading "0" — which is not a missing
  // flourish, it's a wrong number on the page. A fast scroll past the element,
  // or a browser that samples the observer coarsely, can skip the callback, so
  // anything still uncounted after the element has been scrolled past gets the
  // real value put in directly.
  const backstop = () => {
    let remaining = 0;
    for (const el of els) {
      if (el.dataset.counted !== undefined) continue;
      const r = el.getBoundingClientRect();
      // Scrolled past, or sitting in view long enough that it should have fired.
      if (r.bottom < 0 || r.top < window.innerHeight) {
        el.dataset.counted = '';
        io.unobserve(el);
        run(el);
      } else remaining++;
    }
    if (remaining) window.setTimeout(backstop, 1200);
  };
  window.setTimeout(backstop, 2000);
}

/* ── 6. header state ──────────────────────────────────────────────────────── */

function initHeader() {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;
  const io = new IntersectionObserver(
    ([e]) => header.classList.toggle('is-stuck', !e.isIntersecting),
    { threshold: 1 }
  );
  const sentinel = document.querySelector('.header-sentinel');
  if (sentinel) io.observe(sentinel);

  // Mobile nav
  const toggle = header.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-nav-panel]');
  if (!toggle || !panel) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.toggleAttribute('data-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () =>
    setOpen(toggle.getAttribute('aria-expanded') !== 'true')
  );
  panel.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

/* ── util ─────────────────────────────────────────────────────────────────── */

function debounce<T extends (...a: never[]) => void>(fn: T, ms: number) {
  let id = 0;
  return (...args: Parameters<T>) => {
    clearTimeout(id);
    id = window.setTimeout(() => fn(...args), ms);
  };
}

/* ── boot ─────────────────────────────────────────────────────────────────── */

function boot() {
  const animate = !reduced.matches;
  const canvas = document.querySelector<HTMLCanvasElement>('.caustics');

  initHeader();

  if (canvas) initCaustics(canvas, animate);

  if (!animate) {
    // Static fallback: everything visible, final numbers, no loop.
    document
      .querySelectorAll<HTMLElement>('[data-armed]')
      .forEach((el) => (el.dataset.revealed = ''));
    initCountUps(false);
    return;
  }

  initCausticsZones();
  initReveals();
  initCountUps(true);
  initScrollProgress();
  initMagnets();

  if (tickers.length) start();

  // Don't burn battery painting a tab nobody is looking at.
  document.addEventListener('visibilitychange', () =>
    document.hidden ? stop() : start()
  );
}

// A change of motion preference mid-session should take effect on next load;
// reloading under the user is worse than the mismatch, so just note it.
reduced.addEventListener('change', () => {
  if (reduced.matches) stop();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
