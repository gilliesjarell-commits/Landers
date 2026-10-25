# Video ads add-on (optional, off by default)

Turns each campaign's angles into short video ads for **TikTok, Instagram Reels and Stories, and the
Facebook / Instagram feed**, and shows them on the campaign dashboard with download buttons and their
captions. The main Campaign Agent works the same with or without it.

## What you get per angle
- A UGC-style video ad: an AI narrator (the same person for every angle of a campaign) talks straight to
  camera for ~15 seconds in a real-looking home, with captions timed to her speech, then a 2.5-second end
  card with the publisher name, the lander's promise and "Tap the button below".
- `ads/video/<angle>-9x16.mp4` for TikTok, Reels and Stories, and `<angle>-4x5.mp4` for the Facebook /
  Instagram feed (about 3–5 MB each), plus a poster image.
- A script file with 3 hook options, the narrator script, a TikTok caption (max 100 characters), and Meta
  primary text and headline. All of it also shows on the dashboard with Copy buttons.

## Cost (Higgsfield credits)
| Item | Credits |
| --- | --- |
| Narrator portrait (once per campaign, reused) | ~2 |
| One angle (one 15-second Kling 3.0 clip with voice) | ~26 |
| A whole campaign (3 angles) | ~81 |

Clips that fail the visual check are regenerated, so budget a little extra. The model is one line in the
add-on's rules (`Video model:`); `veo3_1_lite` is the alternative (~24 per angle, two 8-second clips).

## Requirements
- **Higgsfield** connected in Claude Code (claude.ai connector or MCP).
- **ffmpeg** installed: macOS `brew install ffmpeg`, Windows `winget install ffmpeg`, Linux `sudo apt install ffmpeg`.
- Node.js (already installed with Claude Code).

## Turn it on or off
From the repo folder:
```
node _addons/video-ads/toggle.mjs on       # adds /make-video and the video rules to CLAUDE.md
node _addons/video-ads/toggle.mjs off      # removes them (videos already made stay)
node _addons/video-ads/toggle.mjs status
```
Or just ask Claude: "turn on the video ads add-on". Restart Claude Code after switching.

## Use it
```
/make-video home-warranty-2              # all angles
/make-video home-warranty-2 pain         # one angle
```
Videos aren't made automatically at launch ("Make videos at launch: no"), so you only spend credits on
campaigns worth running. When the add-on is on, every `/launch-offer` report ends with a reminder to run
`/make-video`. When it's off, Claude only mentions it if you ask for video ads.

## Rules the videos follow
The same compliance rules as the landers, plus:
- Hooks are second-person or neutral, never an invented first-person customer story, and use no
  numbers the offer owner didn't supply.
- The narrator explains like a friend who knows the topic. She's never presented as a customer, reviewer
  or expert, and never says "I tried it" or "it worked for me".
- The footage is AI-generated. Turn on TikTok's **"AI-generated content"** setting when you upload.

## Files
| File | What it is |
| --- | --- |
| `toggle.mjs` | The on/off switch |
| `make-video.md` | The `/make-video` command (copied into `.claude/commands/` when on) |
| `rules.md` | The block added to CLAUDE.md when on |
| `render.mjs` | Stitches clips, captions and the end card into the 9:16 and 4:5 MP4s (ffmpeg) |
| `dashboard.css`, `dashboard-block.html` | The dashboard's "Video ads" section |
| `fonts/` | Archivo Black and Archivo SemiBold for captions (SIL Open Font License, see the OFL files) |

This folder starts with `_`, so GitHub Pages never publishes it.
