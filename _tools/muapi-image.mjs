#!/usr/bin/env node
// Generate images with muapi.ai (no installs; needs Node 18+).
//
//   node _tools/muapi-image.mjs <jobs.json> [--model nano-banana-pro] [--resolution 1k]
//
// jobs.json is a list of images to make:
//   [{ "prompt": "...", "aspect_ratio": "16:9", "out": "/scratch/pain-hero.png" }, ...]
// "out" is where the original download goes (a scratch folder, never the repo).
// The API key comes from MUAPI_API_KEY (or MUAPI_KEY). Get one at https://muapi.ai/access-keys
//
// Prints one JSON line per job: { out, status, url, request_id, error }.
// Exits 1 if any job failed, so you can resubmit only the failed ones.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const BASE = 'https://api.muapi.ai/api/v1';
const RATIOS = ['1:1', '3:4', '4:3', '9:16', '16:9', '3:2', '2:3', '5:4', '4:5', '21:9'];
const CONCURRENCY = 4;
const POLL_MS = 3000;
const TIMEOUT_MS = 5 * 60 * 1000;

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
    const aspect = job.aspect_ratio || '1:1';
    if (!RATIOS.includes(aspect)) throw new Error(`aspect_ratio must be one of ${RATIOS.join(', ')}`);
    const submit = await api('POST', `/${model}`, { prompt: job.prompt, aspect_ratio: aspect, resolution });
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
      if (Date.now() - start > TIMEOUT_MS) throw new Error('timed out after 5 minutes');
    }

    try {
      const img = await fetch(result.url);
      if (!img.ok) throw new Error(`HTTP ${img.status}`);
      await mkdir(dirname(job.out), { recursive: true });
      await writeFile(job.out, Buffer.from(await img.arrayBuffer()));
      result.status = 'saved';
    } catch (e) {
      // Image made, but its host is blocked here: the URL can be used directly.
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
