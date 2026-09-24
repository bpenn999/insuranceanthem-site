#!/usr/bin/env node
/**
 * build-hero.mjs — the home-page hero photo, in the sizes the page serves.
 *
 * Master: Adobe Stock #794591049, "A lone saguaro cactus stands tall in the
 * desert at sunset near Phoenix Arizona" (6000×4000, Brian's pick from a sheet
 * of eleven on 2026-09-24, licensed on his Adobe account, free tier). It lives
 * at src/assets/hero/lone-saguaro-master.jpg
 * and is gitignored — 14.8 MB has no business in the repo. Outputs are committed
 * because public/img is what production serves.
 *
 * Same recipe as nmmedicarehelp.com (its scripts/hero-mobile.mjs explains the
 * numbers): a 2:1 crop that keeps the sky and the saguaro on the right, 1600/1200/800 candidates for laptops at quality 70-72 (the scrim
 * covers 40-90% of it, so quality-80 detail was 135 KB of invisible rocks), and a 640-wide
 * quality-50 file for phones, where the image is cover-cropped to a narrow
 * vertical slice under a 70-90% navy scrim and quality-80 detail is invisible.
 * The mobile file is picked by <source media="(max-width:820px)"> in
 * src/pages/index.astro and preloaded by the matching media-scoped <link> in
 * src/components/BaseHead.astro — change WIDTH or the breakpoint in all three
 * places or the phone downloads two heroes.
 */
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

const MASTER = 'src/assets/hero/lone-saguaro-master.jpg';
const OUT = 'public/img/hero-az-saguaro';
if (!existsSync(MASTER)) { console.log('build-hero: master not present, keeping committed outputs'); process.exit(0); }

// 6000×4000 → a 4800×2400 (2:1) window starting 1200px in from the left and
// 800px down: the saguaro moves from dead centre to ~52% of the frame, which at
// laptop width puts it at the funnel card's left edge instead of behind it, the
// pink cloud band stays in the lower half, and the black foreground is dropped.
const base = sharp(MASTER).extract({ left: 1200, top: 800, width: 4800, height: 2400 });
const jobs = [
  [1600, 72, `${OUT}.webp`],
  [1200, 72, `${OUT}-1200.webp`],
  [800, 70, `${OUT}-800.webp`],
  [640, 52, `${OUT}-640.webp`],
];
for (const [w, q, file] of jobs) {
  const info = await base.clone().resize(w).webp({ quality: q, effort: 6 }).toFile(file);
  console.log(`${file}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}
