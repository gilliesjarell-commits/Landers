#!/usr/bin/env node
// Generate images and video clips with muapi.ai (no installs; needs Node 18+).
//
//   node _tools/muapi-image.mjs <jobs.json> [--model <name>] [--video-model <name>]
//   node _tools/muapi-image.mjs --list            show the models you can choose from
//
// jobs.json is a list of things to make. "out" is where the download goes (a scratch folder, never the repo).
//   Image:  { "prompt": "...", "aspect_ratio": "16:9", "out": "/scratch/pain-hero.png" }
//   Video:  { "kind": "video", "prompt": "...", "image": "https://.../narrator.png", "seconds": 15,
//             "aspect_ratio": "9:16", "out": "/scratch/pain-clip.mp4" }
// Which model: the job's own "model", else --model (images) / --video-model (videos), else the default in
// _tools/muapi-models.json. Models listed there are translated automatically (shape, resolution, image
// field, clip length, sound). A shape a model can't make is swapped for its closest one (pages crop to
// fit). Any other muapi model name works too; its job fields are then sent as-is.
// The API key comes from MUAPI_API_KEY (or MUAPI_KEY). Get one at https://muapi.ai/access-keys
//
// Prints one JSON line per job: { out, model, status, url, request_id, used, error }.
// "used" shows what was actually requested when it differs (e.g. a closer shape or clip length).
// Exits 1 if any job failed, so you can resubmit only the failed ones.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = 'https://api.muapi.ai/api/v1';
const CONCURRENCY = 4;
const POLL_MS = +(process.env.MUAPI_POLL_MS || 3000);
const TIMEOUT_MS = 15 * 60 * 1000; // video clips can take several minutes

const here = dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(await readFile(join(here, 'muapi-models.json'), 'utf8'));

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : undefined;
};

if (args.includes('--list')) {
  for (const kind of ['image', 'video']) {
    console.log(`\n${kind.toUpperCase()} MODELS (default: ${catalog.defaults[kind]})`);
    for (const [name, m] of Object.entries(catalog[kind])) console.log(`  ${name.padEnd(36)} ${m.note}`);
  }
  console.log('\nAny other muapi.ai model name also works (fields sent as-is). Prices: muapi.ai pricing page.');
  process.exit(0);
}

const imageModel = flag('--model') || catalog.defaults.image;
const videoModel = flag('--video-model') || catalog.defaults.video;
const jobsFile = args[0];

const key = process.env.MUAPI_API_KEY || process.env.MUAPI_KEY;
if (!jobsFile) {
  console.error('Usage: node _tools/muapi-image.mjs <jobs.json> [--model <name>] [--video-model <name>]   (or --list)');
  process.exit(2);
}
if (!key) {
  console.error('MUAPI_API_KEY is not set. Create a key at https://muapi.ai/access-keys and set it, e.g.');
  console.error('  export MUAPI_API_KEY=your_key   (Mac/Linux)   or   setx MUAPI_API_KEY your_key   (Windows)');
  process.exit(2);
}

const jobs = JSON.parse(await readFile(jobsFile, 'utf8'));
const headers = { 'x-api-key': key, 'Content-Type': 'application/json' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ratioValue = (r) => { const [w, h] = r.split(':').map(Number); return w / h; };
const closestRatio = (want, list) =>
  list.reduce((best, r) => (Math.abs(Math.log(ratioValue(r) / ratioValue(want))) <
    Math.abs(Math.log(ratioValue(best) / ratioValue(want))) ? r : best), list[0]);
const fitSeconds = (want, spec) => {
  if (Array.isArray(spec)) return spec.find((s) => s >= want) ?? spec[spec.length - 1];
  return Math.min(spec.max, Math.max(spec.min, want));
};

// Turn a simple job into the request body the chosen model expects.
function buildInput(job) {
  const { out, model: own, kind = 'image', image, seconds, ...input } = job;
  const model = own || (kind === 'video' ? videoModel : imageModel);
  const m = catalog[kind]?.[model];
  const used = {};
  if (!m) { // not in the catalog: send the fields as they are
    if (image) input.image_url = image;
    if (seconds) input.duration = seconds;
    return { model, input, used };
  }
  if (input.aspect_ratio && m.ratios) {
    const r = closestRatio(input.aspect_ratio, m.ratios);
    if (r !== input.aspect_ratio) used.aspect_ratio = r;
    input.aspect_ratio = r;
  } else if (!m.ratios) {
    delete input.aspect_ratio; // the model follows the input image's shape
  }
  if (kind === 'image') {
    input.aspect_ratio ??= '1:1';
    if (m.resolution) input[m.resolution.field] ??= m.resolution.value;
  } else {
    if (!image) throw new Error('a video job needs "image" (the start image URL)');
    if (m.image === 'images_list') input.images_list = [image]; else input.image_url = image;
    if (m.seconds) {
      const s = fitSeconds(seconds || 5, m.seconds);
      if (seconds && s !== seconds) used.seconds = s;
      input.duration = s;
    }
    if (m.audio) input[m.audio] = true;
  }
  for (const [k, v] of Object.entries(m.extra || {})) input[k] ??= v;
  return { model, input, used };
}

async function api(method, path, body) {
  const res = await fetch(BASE + path, { method, headers, body: body && JSON.stringify(body) });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}: ${(data.detail || data.error || data.message || text).toString().slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

async function runJob(job) {
  const result = { out: job.out, model: null, status: 'failed', url: null, request_id: null, used: null, error: null };
  try {
    if (!job.prompt || !job.out) throw new Error('each job needs "prompt" and "out"');
    const { model, input, used } = buildInput(job);
    result.model = model;
    if (Object.keys(used).length) result.used = used;
    const submit = await api('POST', `/${model}`, input);
    const id = submit.request_id || submit.id || submit.data?.request_id;
    if (!id) throw new Error('no request_id in response: ' + JSON.stringify(submit).slice(0, 200));
    result.request_id = id;

    const start = Date.now();
    while (true) {
      await sleep(POLL_MS);
      const r = await api('GET', `/predictions/${id}/result`);
      const d = r.data || r;
      if (d.status === 'completed' || d.status === 'succeeded') {
        result.url = (d.outputs || [])[0];
        if (!result.url) throw new Error('completed with no outputs');
        break;
      }
      if (d.status === 'failed') throw new Error(d.error || 'generation failed');
      if (Date.now() - start > TIMEOUT_MS) throw new Error('timed out after 15 minutes');
    }

    try {
      const file = await fetch(result.url);
      if (!file.ok) throw new Error(`HTTP ${file.status}`);
      await mkdir(dirname(job.out), { recursive: true });
      await writeFile(job.out, Buffer.from(await file.arrayBuffer()));
      result.status = 'saved';
    } catch (e) {
      // File made, but its host is blocked here: the URL can be used directly.
      result.status = 'generated_not_downloaded';
      result.error = 'download failed: ' + e.message;
    }
  } catch (e) {
    result.error = (e.status === 429 ? 'rate limited (429): ' : '') + e.message;
  }
  console.log(JSON.stringify(result));
  return result;
}

const queue = [...jobs];
const results = [];
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
  while (queue.length) results.push(await runJob(queue.shift()));
}));
process.exit(results.some((r) => r.status === 'failed') ? 1 : 0);
