#!/usr/bin/env node
/**
 * build-hero.mjs — the home-page hero photo, in the sizes the page serves.
 *
 * Master: Adobe Stock #724663960, "Arizona desert at sunset with Saguaro cactus
 * in Sonoran Desert near Phoenix" (8000×5340, licensed 2026-09-24 on Brian's
 * Adobe account, free tier). It lives at src/assets/hero/sonoran-sunset-master.jpg
 * and is gitignored — 14.8 MB has no business in the repo. Outputs are committed
 * because public/img is what production serves.
 *
 * Same recipe as nmmedicarehelp.com (its scripts/hero-mobile.mjs explains the
 * numbers): a 2:1 crop that keeps the sky and the two big saguaros on the
 * right, 1600/1200/800 candidates for laptops at quality 55-66 (the scrim
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

const MASTER = 'src/assets/hero/sonoran-sunset-master.jpg';
const OUT = 'public/img/hero-az-sonoran';
if (!existsSync(MASTER)) { console.log('build-hero: master not present, keeping committed outputs'); process.exit(0); }

// 8000×5340 → 8000×4000 (2:1) band, top edge at 500px: sky kept, dead foreground
// dropped. 2:1 rather than NM's 2.55:1 because this hero runs ~830px tall on a
// laptop (copy + the funnel card), and a shorter band would be upscaled 1.4×.
const base = sharp(MASTER).extract({ left: 0, top: 500, width: 8000, height: 4000 });
const jobs = [
  [1600, 55, `${OUT}.webp`],
  [1200, 58, `${OUT}-1200.webp`],
  [800, 66, `${OUT}-800.webp`],
  [640, 46, `${OUT}-640.webp`],
];
for (const [w, q, file] of jobs) {
  const info = await base.clone().resize(w).webp({ quality: q, effort: 6 }).toFile(file);
  console.log(`${file}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}
