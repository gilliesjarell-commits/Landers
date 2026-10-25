#!/usr/bin/env node
// Video ads add-on: assembles generated clips into finished ads with captions and an end card.
// Usage: node _addons/video-ads/render.mjs <spec.json>
// Needs ffmpeg on the PATH (macOS: brew install ffmpeg). Node comes with Claude Code.
//
// spec.json:
// {
//   "out": "home-warranty-2/ads/video/pain",          // writes <out>-9x16.mp4, <out>-4x5.mp4, <out>-poster.webp
//   "clips": [ { "file": "clip1.mp4", "seconds": 5, "caption": "Hook line on screen" }, ... ],
//   "endcard": { "seconds": 3, "brand": "The Homekeeping Desk", "headline": "See plans for your home",
//                "cta": "Tap the button below", "bg": "#1d3b53", "accent": "#c2410c" },
//   "voice": "optional/voiceover.mp3",                   // optional narration track
//   "clipAudio": true,                                   // optional: keep each clip's own sound (talking narrator clips)
//   "captionPosition": "lower"                           // optional: "upper" (default, b-roll) or "lower" (a face on screen)
// }
// A clip can carry several timed captions instead of one: "captions": [ { "text": "...", "from": 0, "to": 3.5 }, ... ]
// (seconds from the start of that clip).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, statSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FONT_BOLD = join(here, 'fonts', 'ArchivoBlack-Regular.ttf');
const FONT_SEMI = join(here, 'fonts', 'Archivo-SemiBold.ttf');
const FPS = 30;

function die(msg) { console.error('render: ' + msg); process.exit(1); }
function ff(args) { execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' }); }
function hex(c) { return '0x' + String(c || '#000000').replace('#', ''); }

// Wrap text into balanced lines of at most `max` characters (no lone word on the last line).
function wrap(text, max) {
  const first = greedy(text, max); let best = first;
  const spread = ls => Math.max(...ls.map(l => l.length)) - Math.min(...ls.map(l => l.length));
  for (let m = max - 1; m >= 8; m--) {
    const ls = greedy(text, m);
    if (ls.length > first.length) break;
    if (spread(ls) < spread(best)) best = ls;
  }
  return best;
}
function greedy(text, max) {
  const lines = []; let line = '';
  for (const word of String(text).trim().split(/\s+/)) {
    if (!line) line = word;
    else if ((line + ' ' + word).length <= max) line += ' ' + word;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines;
}

// drawtext reads each line from its own file, so quotes, colons and % need no escaping.
let tfCount = 0;
function textFile(dir, s) { const p = join(dir, `t${tfCount++}.txt`); writeFileSync(p, s); return p; }
function esc(p) { return p.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'"); }

function textBlock(dir, { lines, font, size, color, yCenter, start, end, box }) {
  const lh = Math.round(size * 1.38);
  const top = yCenter - (lines.length * lh) / 2;
  return lines.map((ln, i) => {
    const parts = [
      `fontfile='${esc(font)}'`, `textfile='${esc(textFile(dir, ln))}'`, `fontsize=${size}`, `fontcolor=${color}`,
      `x=(w-text_w)/2`, `y=${Math.round(top + i * lh)}`, `enable='between(t,${start.toFixed(2)},${end.toFixed(2)})'`,
    ];
    if (box) parts.push('box=1', `boxcolor=${box}`, `boxborderw=${Math.round(size * 0.28)}`);
    return 'drawtext=' + parts.join(':');
  });
}

const specPath = process.argv[2];
if (!specPath) die('usage: node _addons/video-ads/render.mjs <spec.json>');
try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); } catch { die('ffmpeg not found. Install it (macOS: brew install ffmpeg) and try again.'); }
for (const f of [FONT_BOLD, FONT_SEMI]) if (!existsSync(f)) die('missing font ' + f);

const spec = JSON.parse(readFileSync(specPath, 'utf8'));
if (!spec.out || !Array.isArray(spec.clips) || !spec.clips.length) die('spec needs "out" and at least one clip');
const end = Object.assign({ seconds: 3, brand: '', headline: 'Learn more', cta: 'Tap the button below', bg: '#111827', accent: '#2563eb' }, spec.endcard || {});
const out = resolve(spec.out);
mkdirSync(dirname(out), { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'vidads-'));

try {
  // 1. Normalize every clip to 1080x1920, 30 fps, no audio, exact length.
  const segs = []; const windows = []; const audioSegs = []; let t = 0;
  spec.clips.forEach((c, i) => {
    const src = resolve(c.file); if (!existsSync(src)) die('clip not found: ' + c.file);
    const secs = Number(c.seconds) || 5; const seg = join(tmp, `seg${i}.mp4`);
    ff(['-i', src, '-t', String(secs), '-an', '-vf',
      `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=${FPS},setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=${secs}`,
      '-t', String(secs), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', seg]);
    segs.push(seg);
    if (Array.isArray(c.captions)) c.captions.forEach(k => windows.push({ start: t + Number(k.from || 0), end: t + Math.min(secs, Number(k.to || secs)), caption: k.text || '' }));
    else windows.push({ start: t, end: t + secs, caption: c.caption || '' });
    if (spec.clipAudio) audioSegs.push(clipAudio(src, secs, join(tmp, `a${i}.wav`)));
    t += secs;
  });
  // 2. End card background (texts are drawn per format below).
  const endSeg = join(tmp, 'end.mp4');
  ff(['-f', 'lavfi', '-i', `color=c=${hex(end.bg)}:s=1080x1920:r=${FPS}:d=${end.seconds}`, '-vf', 'format=yuv420p',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', endSeg]);
  const endStart = t; const total = t + Number(end.seconds);
  if (spec.clipAudio) {
    // The clips' own sound, then silence under the end card, as one narration track.
    audioSegs.push(silence(Number(end.seconds), join(tmp, 'aend.wav')));
    const alist = join(tmp, 'alist.txt');
    writeFileSync(alist, audioSegs.map(s => `file '${s.replace(/'/g, "'\\''")}'`).join('\n'));
    spec.voice = join(tmp, 'track.wav');
    ff(['-f', 'concat', '-safe', '0', '-i', alist, '-c', 'copy', spec.voice]);
  }
  // 3. Join into one silent base video.
  const list = join(tmp, 'list.txt');
  writeFileSync(list, [...segs, endSeg].map(s => `file '${s.replace(/'/g, "'\\''")}'`).join('\n'));
  const base = join(tmp, 'base.mp4');
  ff(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', base]);

  // 4. Render each format: crop, captions, end card text, audio.
  const formats = [
    { name: '9x16', w: 1080, h: 1920, capY: 0.30, cap: 62, chars: 20 },
    { name: '4x5', w: 1080, h: 1350, capY: 0.24, cap: 56, chars: 24 },
  ];
  const results = [];
  if (spec.captionPosition === 'lower') { formats[0].capY = 0.64; formats[1].capY = 0.70; }
  for (const f of formats) {
    const vf = [];
    if (f.h !== 1920) vf.push(`crop=${f.w}:${f.h}:0:${(1920 - f.h) / 2}`);
    for (const wdw of windows) {
      if (!wdw.caption) continue;
      vf.push(...textBlock(tmp, { lines: wrap(wdw.caption, f.chars), font: FONT_BOLD, size: f.cap, color: 'white',
        yCenter: Math.round(f.h * f.capY), start: wdw.start + 0.15, end: wdw.end - 0.05, box: 'black@0.62' }));
    }
    const pillW = 780, pillH = 120, pillY = Math.round(f.h * 0.66);
    if (end.brand) vf.push(...textBlock(tmp, { lines: [end.brand], font: FONT_SEMI, size: 40, color: 'white@0.85',
      yCenter: Math.round(f.h * 0.30), start: endStart, end: total }));
    vf.push(...textBlock(tmp, { lines: wrap(end.headline, 16), font: FONT_BOLD, size: 78, color: 'white',
      yCenter: Math.round(f.h * 0.47), start: endStart, end: total }));
    vf.push(`drawbox=x=(iw-${pillW})/2:y=${pillY}:w=${pillW}:h=${pillH}:color=${hex(end.accent)}@1:t=fill:enable='between(t,${endStart.toFixed(2)},${total.toFixed(2)})'`);
    vf.push(...textBlock(tmp, { lines: [end.cta], font: FONT_BOLD, size: 46, color: 'white',
      yCenter: pillY + pillH / 2, start: endStart, end: total }));
    vf.push('format=yuv420p');

    const file = `${out}-${f.name}.mp4`;
    const audioIn = spec.voice ? ['-i', resolve(spec.voice)] : ['-f', 'lavfi', '-t', String(total), '-i', 'anullsrc=r=44100:cl=stereo'];
    if (spec.voice && !existsSync(resolve(spec.voice))) die('voice file not found: ' + spec.voice);
    const af = spec.voice ? ['-af', `apad,atrim=0:${total},afade=t=out:st=${Math.max(0, total - 0.4)}:d=0.4`] : [];
    ff(['-i', base, ...audioIn, '-filter_script:v', writeFilter(tmp, f.name, vf), ...af, '-map', '0:v', '-map', '1:a',
      '-t', String(total), '-c:v', 'libx264', '-preset', 'medium', '-crf', '26', '-maxrate', '3M', '-bufsize', '6M',
      '-pix_fmt', 'yuv420p', '-r', String(FPS), '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', file]);
    results.push(file);
  }
  // 5. Poster frame for the dashboard.
  const poster = `${out}-poster.webp`;
  ff(['-ss', '0.8', '-i', results[0], '-frames:v', '1', '-vf', 'scale=540:-2', '-c:v', 'libwebp', '-quality', '72', poster]);
  results.push(poster);
  for (const r of results) console.log(`${r}  ${(statSync(r).size / 1048576).toFixed(2)} MB`);
  console.log(`duration ${total.toFixed(1)}s`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

function hasAudio(file) {
  try { return execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', file]).toString().trim() !== ''; }
  catch { return false; }
}
function silence(secs, out) { ff(['-f', 'lavfi', '-t', String(secs), '-i', 'anullsrc=r=44100:cl=stereo', '-c:a', 'pcm_s16le', out]); return out; }
function clipAudio(src, secs, out) {
  if (!hasAudio(src)) return silence(secs, out);
  ff(['-i', src, '-vn', '-t', String(secs), '-af', `aresample=44100,apad,atrim=0:${secs}`, '-ac', '2', '-c:a', 'pcm_s16le', out]);
  return out;
}
function writeFilter(dir, name, parts) { const p = join(dir, `filter-${name}.txt`); writeFileSync(p, parts.join(',\n')); return p; }
