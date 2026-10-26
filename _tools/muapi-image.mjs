#!/usr/bin/env node
// Generate images (and video clips) with muapi.ai (no installs; needs Node 18+).
//
//   node _tools/muapi-image.mjs <jobs.json> [--model nano-banana-pro] [--resolution 1k]
//
// jobs.json is a list of things to make:
//   [{ "prompt": "...", "aspect_ratio": "16:9", "out": "/scratch/pain-hero.png" }, ...]
// "out" is where the original download goes (a scratch folder, never the repo).
// A job can name its own muapi "model"; every other field is sent to that model as-is, e.g. a video:
//   { "model": "kling-v3.0-standard-image-to-video", "prompt": "...", "image_url": "https://...",
//     "duration": 15, "generate_audio": true, "out": "/scratch/pain-clip.mp4" }
// --resolution only applies to jobs that use the default (--model) image model.
// The API key comes from MUAPI_API_KEY (or MUAPI_KEY). Get one at https://muapi.ai/access-keys
//
// Prints one JSON line per job: { out, status, url, request_id, error }.
// Exits 1 if any job failed, so you can resubmit only the failed ones.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const BASE = 'https://api.muapi.ai/api/v1';
const CONCURRENCY = 4;
const POLL_MS = 3000;
const TIMEOUT_MS = 15 * 60 * 1000; // video clips can take several minutes

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : def;
};
const model = flag('--model', 'nano-banana-pro');
const resolution = flag('--resolution', '1k');
const jobsFile = args[0];

const key = process.env.MUAPI_API_KEY || process.env.MUAPI_KEY;
if (!jobsFile) {
  console.error('Usage: node _tools/muapi-image.mjs <jobs.json> [--model nano-banana-pro] [--resolution 1k]');
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
  const result = { out: job.out, status: 'failed', url: null, request_id: null, error: null };
  try {
    if (!job.prompt || !job.out) throw new Error('each job needs "prompt" and "out"');
    const { out, model: jobModel, ...input } = job;
    if (!jobModel) {
      input.aspect_ratio ??= '1:1';
      input.resolution ??= resolution;
    }
    const submit = await api('POST', `/${jobModel || model}`, input);
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
      const img = await fetch(result.url);
      if (!img.ok) throw new Error(`HTTP ${img.status}`);
      await mkdir(dirname(job.out), { recursive: true });
      await writeFile(job.out, Buffer.from(await img.arrayBuffer()));
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
