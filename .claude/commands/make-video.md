---
description: (Video ads add-on) Make UGC-style AI narrator video ads (9:16 + 4:5) for a campaign with muapi.ai, add them to its dashboard, redeploy
argument-hint: <offer-slug> [angle or "all"] [video model <name>]
---

Make video ads for: $ARGUMENTS

Follow "Add-on: Video ads" and every compliance rule in CLAUDE.md. Files live in `_addons/video-ads/`.

## 1. Check
- First word = campaign folder (e.g. `home-warranty-2`). Second = one angle (`pain`, `curiosity`,
  `socialproof`, `fear`, `benefit`) or `all` (default: every angle page the campaign has).
- `video model <name>` (or `image model <name>` for the narrator portrait) uses that model for this
  run only. Otherwise use the Video model and Image model in CLAUDE.md Settings. Check the name is in
  `node _tools/muapi-image.mjs --list`; if not, say it isn't a tested choice and ask before using it.
- `MUAPI_API_KEY` must be set and `api.muapi.ai` reachable (everything is generated with
  `node _tools/muapi-image.mjs`). If not, stop and say so. Generated files go to a scratch folder,
  never the repo.
- `ffmpeg -version` must work. If not, tell the user how to install it (macOS `brew install ffmpeg`,
  Windows `winget install ffmpeg`, Linux `sudo apt install ffmpeg`) and stop.
- Read the campaign's `research.md`, `ad-copy.md` and each angle page so every video matches its lander.
- Cost: one 15-second clip per angle with the Video model in CLAUDE.md, plus one narrator portrait the
  first time. Say in one line how many clips and images this run makes (prices are on muapi.ai's
  pricing page for each model), and continue.

## 2. Script → `<slug>/ads/video/<angle>-script.md`
One 15-second narrator script per angle, then a 2.5-second end card:
- **Hooks:** 3 options under 8 words. The best one opens the script.
- **Script:** 4 short sentences, 36–42 words in all, spoken by the narrator straight to camera:
  hook → the problem or the surprise → what the page offers → "Tap below to see …".
- **Narrator rules:** she explains like a friend who knows the topic. Second person ("your AC"), never
  "I tried / I saved / it worked for me", never presented as a customer, reviewer or expert, no numbers
  or results the offer owner didn't supply, no fake urgency, plus the vertical's guardrails (no income
  claims, no cure claims, no "you've won"...).
- **Copy:** TikTok caption (max 100 characters), Meta primary text (1–2 sentences), Meta headline
  (max 40 characters).

## 3. Narrator (once per campaign)
- If `<slug>/ads/video/narrator.txt` exists, reuse the image URL inside it, so every angle (and every
  later run) has the same person. If that URL no longer loads, use the live copy instead:
  `<Site URL><slug>/ads/video/narrator.webp` (published once the first videos are deployed).
- Otherwise generate one 9:16 portrait with the Settings image model (one job with
  `"aspect_ratio": "9:16"` for `node _tools/muapi-image.mjs`): `Real candid photograph framed like a
  vertical smartphone selfie, natural window light, true-to-life colors, real skin texture. <a friendly
  narrator who matches the avatar's age and world, casual clothes> stands in <a lived-in setting that fits
  the niche>, holding the phone at arm's length and looking straight into the camera with a warm, natural
  expression, mouth slightly open as if mid-sentence. Clean photo only: no timestamp, no date stamp, no
  on-screen interface, no overlays, no captions. Not an illustration, not CGI, not a 3D render. No text,
  no logos, no brand names, no watermarks.`
- Look at it. Regenerate if there's any text or overlay, warped hands or face, or a CGI look. Save it as
  `<slug>/ads/video/narrator.webp` (1080 px wide, under 300 KB) and the `url` the script printed in
  `narrator.txt`.

## 4. Clips
- One clip per angle, all in one jobs file for `node _tools/muapi-image.mjs --video-model <video model>`:
  `{"kind": "video", "prompt": "...", "image": "<narrator URL>", "seconds": 15, "aspect_ratio": "9:16",
  "out": "<scratch>/<angle>-clip.mp4"}`. The script fits it to the model (clip length, sound, image field).
- **Models with shorter clips** (the `used.seconds` in the output, e.g. Veo 3.1 makes 8 s): split each
  script into 2 parts of about equal length, make 2 clips per angle from the same narrator image, and
  give both clips to the render spec in order (each with its own `seconds` and captions).
- Prompt: `Vertical selfie-style phone video, realistic and candid. The woman from the image holds the
  phone at arm's length in <setting> and talks straight to the camera in a warm, casual American English
  voice, like explaining something to a friend. She says: "<script>" Natural hand gestures, slight handheld
  camera movement, accurate lip sync. Only her voice and soft room tone, no music. No text or captions on
  screen, no logos.` (Use "the man" / "the person" to match the narrator.)
- Run it and wait (clips can take several minutes). Resubmit only the clips that failed (a rate limit
  shows as 429). If a clip shows `generated_not_downloaded`, its host is blocked: tell the user to allow
  the host named in the error, or run `/make-video` from their own terminal, and stop.
- **Check every clip:** extract 4 frames and look at them (same person, no text or logos, no warped hands
  or face); confirm it has sound (`ffmpeg -i clip.mp4 -af volumedetect -vn -f null -`). Regenerate a clip
  that fails.
- **Find the sentence breaks:** `ffmpeg -i clip.mp4 -af silencedetect=n=-35dB:d=0.4 -f null -` (if it finds
  none, try `-30dB`, then `-26dB` with `d=0.2`). Each pause ends one sentence; use them to time the captions.

## 5. Assemble
Write a spec JSON in the scratch folder (format at the top of `_addons/video-ads/render.mjs`):
`out` = `<slug>/ads/video/<angle>`, `"clipAudio": true`, `"captionPosition": "lower"`, the clip (or
clips) with their real length in `"seconds"` and one timed caption per sentence (`from`/`to` from the pauses), and the end card
(publisher name, the lander's promise as the headline, CTA "Tap the button below", `bg` = the logo's brand
color, `accent` = the angle page's accent color). Run:
```
node _addons/video-ads/render.mjs <spec.json>
```
It writes `<angle>-9x16.mp4` (TikTok, Reels, Stories), `<angle>-4x5.mp4` (Facebook / Instagram feed) and
`<angle>-poster.webp`. Each MP4 must be under 8 MB. Extract a few frames and check the captions sit below
the narrator's face and inside the frame.

## 6. Dashboard
In `<slug>/index.html`:
- Add the CSS from `_addons/video-ads/dashboard.css` once, just before `</style>` (between its markers).
- In each angle's pane, after the image ads block (or right after the "Lands on" line if there are none),
  add or replace the block between `<!-- VIDEO ADS -->` and `<!-- /VIDEO ADS -->` from
  `_addons/video-ads/dashboard-block.html` (angle file names, TikTok caption, Meta primary text, headline;
  every text item keeps its Copy button).
- Add one blue `.notice`: "Video ads: UGC-style videos with an AI narrator who explains the offer and never
  claims to be a customer. The footage is AI-generated, so turn on TikTok's 'AI-generated content' setting
  when you upload."

## 7. Deploy and report
- `git add <slug>/ads <slug>/index.html`, commit `Add video ads: <slug>`, `git pull --rebase origin main`,
  `git push origin main`.
- Report: each video's live URL (`<Site URL><slug>/ads/video/<angle>-9x16.mp4`, `-4x5.mp4`), how many
  clips and images were generated on muapi and with which models, and the TikTok AI-label reminder.
