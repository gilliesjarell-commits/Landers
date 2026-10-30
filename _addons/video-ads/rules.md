<!-- ADDON:video-ads (added by `node _addons/video-ads/toggle.mjs on`; removed by `... off`) -->
## Add-on: Video ads (on)
- **Video model:** the Video model in Settings (switch it with `/models`), or one named for a single
  `/make-video` run. It must be a model with a voice (the video list in `/models`).
- **Make videos at launch:** no. `/launch-offer` never makes videos itself.
- **After every launch:** end the `/launch-offer` report with: "Make video ads with `/make-video <slug>`."
- `/make-video <slug> [angle or all]` makes one UGC-style video per angle: an AI narrator talks to camera
  for ~15 seconds with captions timed to her speech, then a 2.5-second end card. Files: 9:16 (TikTok,
  Reels, Stories) and 4:5 (Facebook / Instagram feed), shown on the campaign dashboard with download
  buttons and their captions. Steps: `.claude/commands/make-video.md`. Assembly: `_addons/video-ads/render.mjs`
  (needs ffmpeg).
- Cost: one muapi video clip per angle plus one narrator portrait, made once per campaign and reused so
  every angle has the same person (prices on muapi.ai's pricing page).
- Video rules (on top of every page and ad rule): the narrator explains, second person; never an invented
  first-person story; never presented as a customer, reviewer or expert; no text, logos or fake app
  screens in the generated footage; no numbers the offer owner didn't supply.
- AI label: the footage is AI-generated. Turn on TikTok's "AI-generated content" setting when uploading,
  and keep the dashboard notice that says so.
- Turn the add-on off with `node _addons/video-ads/toggle.mjs off` (videos already made stay).
<!-- /ADDON:video-ads -->
