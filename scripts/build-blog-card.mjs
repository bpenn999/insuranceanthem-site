/**
 * Render a branded featured image for a blog post.
 *
 *   node scripts/build-blog-card.mjs <out-name> "<kicker>" "<title>"
 *   node scripts/build-blog-card.mjs turning-65-anthem-2026 \
 *     "Enrollment · Anthem, AZ" "Turning 65 in Anthem, AZ"
 *
 * Writes public/blog/<out-name>.png at 1200×630 — the same aspect the OG tags
 * want, so one file serves as both the in-article featured image and the social
 * card for that post.
 *
 * Why generated rather than stock: a licensed stock photo of a smiling retiree
 * says nothing a reader could not guess, costs money per post, and drags the
 * fleet's no-masked-imagery review into every publish. A typographic card built
 * from the badge palette is on-brand by construction and free to regenerate
 * when a headline changes.
 *
 * Same Chrome dependency and the same caveats as scripts/build-og.mjs: fonts
 * come off Google Fonts, so this needs network, and a card that renders in
 * Georgia rather than Fraunces is a failed font fetch rather than a bug here.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME =
  process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const [name, kicker, title] = process.argv.slice(2);
if (!name || !kicker || !title) {
  console.error('usage: node scripts/build-blog-card.mjs <out-name> "<kicker>" "<title>"');
  process.exit(2);
}

// Escaped because both strings land inside markup. They are author-supplied
// rather than user-supplied, but a title with an ampersand in it would break
// the render silently, which is the annoying failure mode.
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const badge = readFileSync(join(ROOT, 'public/logo/602medicare-logo-transparent.png'));
const html = readFileSync(join(ROOT, 'scripts/blog-card.html'), 'utf8')
  .replace('{{BADGE}}', `data:image/png;base64,${badge.toString('base64')}`)
  .replace('{{KICKER}}', esc(kicker))
  .replace('{{TITLE}}', esc(title));

const work = mkdtempSync(join(tmpdir(), 'blogcard-'));
const page = join(work, 'card.html');
const shot = join(work, 'card.png');
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

mkdirSync(join(ROOT, 'public/blog'), { recursive: true });
const out = join(ROOT, 'public/blog', `${name}.png`);
writeFileSync(out, readFileSync(shot));
rmSync(work, { recursive: true, force: true });
console.log(`wrote public/blog/${name}.png (${statSync(out).size} bytes)`);
