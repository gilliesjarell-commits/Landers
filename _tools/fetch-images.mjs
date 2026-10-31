#!/usr/bin/env node
// Downloads generated images and saves them into the repo (WebP, under 200 KB), and builds image ads.
// Used by the "Fetch images" GitHub Action when a session can't reach the image host itself,
// but it runs anywhere with Node 18+ and ImageMagick.
//
//   node _tools/fetch-images.mjs <jobs.json>
//
// jobs.json:
//   [ { "url": "https://...png", "out": "my-offer/img/pain-hero.webp", "width": 1200 },
//     { "url": "https://...png", "ad": "feed", "out": "my-offer/ads/img/pain", "headline": "...", "publisher": "..." },
//     { "url": "https://...png", "ad": "native", "out": "my-offer/ads/img/pain" } ]
// Widths: 1200 for 16:9 heroes and bands, 1000 for 3:2 and 4:3, 600 for 1:1 answers.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, statSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
let IM = null;
for (const bin of ['magick', 'convert']) { try { execFileSync(bin, ['-version'], { stdio: 'ignore' }); IM = bin; break; } catch {} }
if (!IM) { console.error('ImageMagick not found'); process.exit(1); }

const jobs = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const tmp = mkdtempSync(join(tmpdir(), 'fetch-'));
let failed = 0;
for (const [i, j] of jobs.entries()) {
  try {
    const res = await fetch(j.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = join(tmp, `${i}.png`);
    writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
    if (j.ad) {
      const args = [join(here, 'ad-image.mjs'), j.ad, raw, j.out];
      if (j.ad === 'feed') args.push(j.headline, j.publisher);
      execFileSync(process.execPath, args, { stdio: 'inherit' });
    } else {
      mkdirSync(dirname(j.out), { recursive: true });
      for (let q = 78; q >= 42; q -= 6) {
        execFileSync(IM, [raw, '-resize', `${j.width || 1200}x>`, '-strip', '-quality', String(q), '-define', 'webp:method=6', j.out]);
        if (statSync(j.out).size <= 200 * 1024) break;
      }
      console.log(`${j.out}  ${(statSync(j.out).size / 1024).toFixed(0)} KB`);
    }
  } catch (e) {
    failed++;
    console.error(`FAILED ${j.out}: ${e.message}`);
  }
}
rmSync(tmp, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
