# Campaign Agent Runbook

One offer in, a live 3-angle test campaign out: pain, curiosity, and benefit landers,
ad copy for Meta and native, and a dashboard linking everything together.

## What's in the system
| File | What it does |
| --- | --- |
| `CLAUDE.md` | The rules: the 3-angle method, folder layout, compliance, and the **Settings** block (site URL, traffic, budget). Claude reads it automatically. |
| `.claude/commands/launch-offer.md` | The `/launch-offer` command: the full build-and-deploy pipeline. |
| `.claude/commands/swap-link.md` | The `/swap-link` command: puts the real affiliate link on a campaign and redeploys. |
| `.claude/commands/swap-logo.md` | The `/swap-logo` command: renames the generic publisher (e.g. to match your domain) and swaps the logo. |
| `.claude/commands/swap-image.md` | The `/swap-image` command: replaces one image, or regenerates / saves them all. |
| `.claude/commands/models.md` | The `/models` command: lists the muapi.ai image and video models and switches the one every campaign uses. |
| `.claude/commands/legal.md` | The `/legal` command: fills the Privacy Policy and Terms from your business details and updates the traffic-source disclaimers. |
| `templates/` | The 3 lander formats (advertorial, direct, quiz), the dashboard, and the sample logo in `templates/img/`. |
| `<offer>/` | One folder per campaign (e.g. `auto-insurance/`). |

## Run it
1. Open Claude Code in this repo: `cd landers` then `claude` in the terminal, or pick
   the `landers` repo at claude.ai/code.
2. Type:
   ```
   /launch-offer auto insurance https://your-affiliate-link
   ```
   Leave the link off to use a placeholder.
3. Wait for the report with the dashboard URL. Give GitHub Pages about a minute, then open it.
4. If you launched with the placeholder, add the real link later:
   ```
   /swap-link auto-insurance https://your-affiliate-link
   ```
5. When you have a domain, rename the publisher to match it:
   ```
   /swap-logo auto-insurance yourdomain.com
   ```

## Logo, images and graphics
Every campaign ships with a logo header, AI images and the template's graphics, so the pages are
test-ready without tweaks.
- **Logo:** each campaign gets a made-up publisher name (e.g. "The Homekeeping Desk") and one logo
  file, `<offer>/img/logo.svg`, used on all 3 pages. When you buy a domain, rename it:
  `/swap-logo home-warranty-2 homekeepingdesk.com` (add a logo file path to use your own artwork).
- **Images:** generated with muapi.ai, Nano Banana Pro unless you pick another model with `/models` (8–14 per campaign; needs your key in `MUAPI_API_KEY`, from https://muapi.ai/access-keys), compressed to WebP under 200KB and saved in
  `<offer>/img/`. File names and shapes are listed in CLAUDE.md under "Image spots".
  - Replace one: `/swap-image home-warranty-2 pain-hero.webp ~/Downloads/my-photo.jpg`
  - Regenerate one with a new idea: `/swap-image home-warranty-2 pain-hero.webp a family relaxing in a cool living room`
  - Save or regenerate them all: `/swap-image home-warranty-2 all`
  - Rather fill them yourself? Set **Images** to `none` in CLAUDE.md Settings, then drop your files
    into `<offer>/img/` with the listed names.
- **Image ads:** every launch also makes ready-to-upload ad images for the campaign's traffic:
  Facebook / Instagram feed (4:5 and 1:1, headline on the image) and native thumbnails (16:9, no text).
  Google, Bing, pop and TikTok campaigns get none. They're on the dashboard with Download buttons.
- **Video ads (optional add-on):** off by default. See `_addons/video-ads/README.md`
  (`node _addons/video-ads/toggle.mjs on`, then `/make-video <slug>` after a launch).
- **Cloud sessions:** allow `api.muapi.ai` (and the image host it returns) under Network access, and add
  `MUAPI_API_KEY` to the environment variables. If only the image host is blocked, the pages link
  the images from muapi instead of saving them. They still show, but run
  `/swap-image <offer> all` from your own terminal to save them into the repo.

## Privacy Policy, Terms and platform disclaimers
Every campaign has `privacy.html` and `terms.html`, and every page's footer links to them, with
the disclaimer line each traffic source expects (Meta, Google, Microsoft, TikTok, Native; pop
traffic needs none).
1. Put your business details in the **Settings** block of CLAUDE.md once: legal business name,
   contact email, mailing address, governing law. Until you do, they show highlighted in yellow.
2. Run `/legal all` to fill them on every campaign (new campaigns fill them automatically).
3. Moving a campaign to another traffic source? `/legal home-warranty-2 Google Search` rewrites its
   disclaimer lines.
4. Installing a Meta Pixel or Google tag? Ask Claude to list it in the campaign's privacy.html.
These are starting templates, not legal advice: have a lawyer review them before you scale.
