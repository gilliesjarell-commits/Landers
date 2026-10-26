#!/usr/bin/env node
// Video ads add-on switch.
//   node _addons/video-ads/toggle.mjs on       adds /make-video and the video rules to CLAUDE.md
//   node _addons/video-ads/toggle.mjs off      removes them again (videos already made stay)
//   node _addons/video-ads/toggle.mjs status
// Restart Claude Code (or start a new session) after switching so it picks up the change.
import { readFileSync, writeFileSync, existsSync, copyFileSync, rmSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const claudeMd = join(root, 'CLAUDE.md');
const cmdSrc = join(here, 'make-video.md');
const cmdDst = join(root, '.claude', 'commands', 'make-video.md');
const START = '<!-- ADDON:video-ads';
const END = '<!-- /ADDON:video-ads -->';

const mode = (process.argv[2] || 'status').toLowerCase();
const md = readFileSync(claudeMd, 'utf8');
const isOn = () => existsSync(cmdDst) && readFileSync(claudeMd, 'utf8').includes(START);

function stripBlock(text) {
  const a = text.indexOf(START); if (a < 0) return text;
  const b = text.indexOf(END, a); if (b < 0) return text;
  const after = text.slice(b + END.length).replace(/^\n+/, '');
  return text.slice(0, a).trimEnd() + '\n' + (after ? '\n' + after : '');
}

if (mode === 'on') {
  mkdirSync(dirname(cmdDst), { recursive: true });
  copyFileSync(cmdSrc, cmdDst);
  const rules = readFileSync(join(here, 'rules.md'), 'utf8').trim();
  writeFileSync(claudeMd, stripBlock(md).trimEnd() + '\n\n' + rules + '\n');
  console.log('Video ads add-on: ON. Added /make-video and the "Add-on: Video ads" rules to CLAUDE.md.');
  console.log('Needs: MUAPI_API_KEY set (muapi.ai), and ffmpeg installed (macOS: brew install ffmpeg).');
  console.log('Restart Claude Code, then run: /make-video <offer-slug>');
} else if (mode === 'off') {
  if (existsSync(cmdDst)) rmSync(cmdDst);
  writeFileSync(claudeMd, stripBlock(md));
  console.log('Video ads add-on: OFF. Removed /make-video and its rules. Videos already made stay in <slug>/ads/video/.');
  console.log('Restart Claude Code so the command disappears.');
} else if (mode === 'status') {
  console.log('Video ads add-on: ' + (isOn() ? 'ON' : 'OFF'));
} else {
  console.error('Usage: node _addons/video-ads/toggle.mjs on|off|status'); process.exit(1);
}
