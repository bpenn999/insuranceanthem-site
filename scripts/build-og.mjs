/**
 * Render scripts/og-card.html to public/og-602medicare.png (1200x630).
 *
 *   node scripts/build-og.mjs
 *
 * The card is pure type — the 602Medicare wordmark, no mark — so the template is
 * fully self-contained with no image to inline. Fonts still come from Google
 * Fonts, so this needs network; that is why --virtual-time-budget is generous.
 * If the render ever comes back in Georgia rather than Fraunces, that is a
 * failed font fetch, not a template bug.
 *
 * Override the browser with CHROME=/path/to/chrome, same as scripts/e2e.mjs.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME =
  process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const html = readFileSync(join(ROOT, 'scripts/og-card.html'), 'utf8');

const work = mkdtempSync(join(tmpdir(), 'og-'));
const page = join(work, 'card.html');
const shot = join(work, 'og.png');
writeFileSync(page, html);

const res = spawnSync(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    '--virtual-time-budget=8000',
    `--screenshot=${shot}`,
    `file://${page}`,
  ],
  { stdio: 'inherit' },
);

if (res.status !== 0) {
  console.error(`chrome exited ${res.status}`);
  rmSync(work, { recursive: true, force: true });
  process.exit(1);
}

const out = join(ROOT, 'public/og-602medicare.png');
writeFileSync(out, readFileSync(shot));
rmSync(work, { recursive: true, force: true });
console.log(`wrote public/og-602medicare.png (${statSync(out).size} bytes)`);
