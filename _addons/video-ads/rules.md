<!-- ADDON:video-ads (added by `node _addons/video-ads/toggle.mjs on`; removed by `... off`) -->
## Add-on: Video ads (on)
- **Video model:** `kling3_0` (Kling 3.0, standard, 15 s, sound on, ~26.25 credits per clip). Change this
  line to switch models (e.g. `veo3_1_lite`: two 8 s clips joined, ~24 credits per angle).
- **Make videos at launch:** no. `/launch-offer` never makes videos itself.
- **After every launch:** end the `/launch-offer` report with: "Make video ads with `/make-video <slug>`."
- `/make-video <slug> [angle or all]` makes one UGC-style video per angle: an AI narrator talks to camera
  for ~15 seconds with captions timed to her speech, then a 2.5-second end card. Files: 9:16 (TikTok,
  Reels, Stories) and 4:5 (Facebook / Instagram feed), shown on the campaign dashboard with download
  buttons and their captions. Steps: `.claude/commands/make-video.md`. Assembly: `_addons/video-ads/render.mjs`
  (needs ffmpeg).
- Cost: ~26 credits per angle (~79 for 3 angles) plus ~2 for the narrator portrait, made once per
  campaign and reused so every angle has the same person.
- Video rules (on top of every page and ad rule): the narrator explains, second person; never an invented
  first-person story; never presented as a customer, reviewer or expert; no text, logos or fake app
  screens in the generated footage; no numbers the offer owner didn't supply.
- AI label: the footage is AI-generated. Turn on TikTok's "AI-generated content" setting when uploading,
  and keep the dashboard notice that says so.
- Turn the add-on off with `node _addons/video-ads/toggle.mjs off` (videos already made stay).
<!-- /ADDON:video-ads -->
