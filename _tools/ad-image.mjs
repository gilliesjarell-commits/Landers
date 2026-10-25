#!/usr/bin/env node
// Image ads: turns generated photos into finished ad images (WebP, under 200 KB).
// Usage:
//   node _tools/ad-image.mjs feed   <photo-4x5> <out-prefix> "<headline>" "<publisher>"
//       → <out-prefix>-feed-4x5.webp (1080x1350) and <out-prefix>-feed-1x1.webp (1080x1080), headline on the image
//   node _tools/ad-image.mjs native <photo-16x9> <out-prefix>
//       → <out-prefix>-native-16x9.webp (1200x675), no text (native networks prefer clean thumbnails)
// Needs ImageMagick (`magick`, or `convert` on older installs). macOS: brew install imagemagick
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const BOLD = join(here, 'fonts', 'ArchivoBlack-Regular.ttf');
const SEMI = join(here, 'fonts', 'Archivo-SemiBold.ttf');
const die = m => { console.error('ad-image: ' + m); process.exit(1); };

let IM = null;
for (const bin of ['magick', 'convert']) { try { execFileSync(bin, ['-version'], { stdio: 'ignore' }); IM = bin; break; } catch {} }
if (!IM) die('ImageMagick not found. Install it (macOS: brew install imagemagick) and try again.');
const im = args => execFileSync(IM, args, { stdio: 'inherit' });

// Save as WebP under 200 KB: start at quality 78 and step down if needed.
function saveWebp(src, out) {
  for (let q = 78; q >= 48; q -= 6) {
    im([src, '-strip', '-quality', String(q), '-define', 'webp:method=6', out]);
    if (statSync(out).size <= 200 * 1024) break;
  }
  console.log(`${out}  ${(statSync(out).size / 1024).toFixed(0)} KB`);
}

const [mode, photo, prefix, headline, publisher] = process.argv.slice(2);
if (!mode || !photo || !prefix) die('usage: feed <photo> <out-prefix> "<headline>" "<publisher>"  |  native <photo> <out-prefix>');
if (!existsSync(photo)) die('photo not found: ' + photo);
mkdirSync(dirname(resolve(prefix)), { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'adimg-'));
try {
  if (mode === 'native') {
    const base = join(tmp, 'n.png');
    im([photo, '-resize', '1200x675^', '-gravity', 'center', '-extent', '1200x675', base]);
    saveWebp(base, `${prefix}-native-16x9.webp`);
  } else if (mode === 'feed') {
    if (!headline) die('feed mode needs a headline');
    const head = join(tmp, 'head.png'), brand = join(tmp, 'brand.png'), grad = join(tmp, 'grad.png');
    im(['-background', 'none', '-fill', 'white', '-font', BOLD, '-pointsize', '64', '-interline-spacing', '4',
      '-size', '940x', '-gravity', 'west', 'caption:' + headline, head]);
    im(['-background', 'none', '-fill', 'rgba(255,255,255,0.85)', '-font', SEMI, '-pointsize', '30', 'label:' + (publisher || ''), brand]);
    const make = (w, h, out) => {
      const base = join(tmp, `b${w}x${h}.png`), comp = join(tmp, `c${w}x${h}.png`);
      im([photo, '-resize', `${w}x${h}^`, '-gravity', 'center', '-extent', `${w}x${h}`, base]);
      im(['-size', `${w}x560`, 'gradient:rgba(0,0,0,0)-rgba(0,0,0,0.82)', grad]);
      im([base, grad, '-gravity', 'south', '-composite',
        head, '-gravity', 'southwest', '-geometry', '+70+114', '-composite',
        brand, '-gravity', 'southwest', '-geometry', '+70+60', '-composite', comp]);
      saveWebp(comp, out);
    };
    make(1080, 1350, `${prefix}-feed-4x5.webp`);
    make(1080, 1080, `${prefix}-feed-1x1.webp`);
  } else die('mode must be feed or native');
} finally { rmSync(tmp, { recursive: true, force: true }); }
