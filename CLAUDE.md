# Campaign Agent (Claude Code edition)

## Settings (a buyer changes only this block)
- **Site URL:** `https://gilliesjarell-commits.github.io/Landers/`
- **Default traffic:** Facebook + Native (Taboola/Outbrain)
- **Test budget:** $50 split across 3 angles (~$16.67 each)
- **Images:** muapi.ai (see muapi.ai pricing). Needs your muapi key in the `MUAPI_API_KEY`
  environment variable. Set to `none` to ship pages with empty image spots you fill yourself.
- **Image model:** `nano-banana-pro`
- **Video model:** `kling-v3.0-standard-image-to-video` (used by the video ads add-on)
  (Run `/models` to see every choice and switch. To use a different model for one run only, add it
  to the command, e.g. `/launch-offer <offer> <link> image model flux-2-pro` or
  `/make-video <slug> video model veo3.1-fast-image-to-video`.)
- **Legal business name:** `[Your Business LLC]`
- **Contact email:** `[contact@yourdomain.com]`
- **Mailing address:** `[Street, City, State ZIP, Country]`
- **Governing law:** `[State / Country]`
  (These four fill the Privacy Policy and Terms on every campaign. While they're in [brackets], the
  pages show them highlighted and the dashboard warns. Change them here, then run `/legal all`.)

This repo publishes affiliate landing pages to GitHub Pages at the Site URL above.
Anything pushed to `main` goes live within about a minute.

## The method (Chanel's accelerator; every campaign follows it)
1. **Research the niche and build the customer avatar** before writing anything.
2. **Score all 5 angles for that avatar and build bridge pages for the best 3:**

   | Angle | File | What it does |
   | --- | --- | --- |
   | Pain Point | `pain.html` | The daily suffering and frustration, then the way out |
   | Curiosity | `curiosity.html` | Teases an unexpected discovery; the click closes the loop |
   | Social Proof | `social-proof.html` | Leads with what others have experienced |
   | Fear | `fear.html` | What happens if they don't act |
   | Direct Benefit | `benefit.html` | Leads with the end result and transformation |

3. **Run the test:** the budget split equally across the 3 angles, all at once, one ad set per
   angle pointing at its own bridge page. Judge the results with your own benchmarks for the
   traffic source; lander CTR norms differ a lot (Meta vs. pop, for example), so this repo sets
   no CTR or kill/scale rules and the dashboards carry no test plan.

### Angle guardrails by vertical
Research picks the angles; these rules override the scores.
- **Social Proof** only when there is real proof to point to: numbers or reviews the offer owner
  published, or a verifiable public fact about the category (with its source in `research.md`).
  No proof → skip Social Proof. Never invent people, quotes, or results.
- **Fear** must be factual and proportionate: real consequences, no scare claims. Skip it in
  Health (ad networks restrict health fear appeals) and for anything aimed at vulnerable people.
- **BizOpp and Finance:** no income or earnings claims in any angle.
- **Health:** no cure, treatment, or before/after claims in any angle.

## Lander formats (from the Prompt Vault)
Every page is one **angle** in one **format**. Always start from the matching template in
`templates/` and replace its content; never build a page from scratch.

| Format | Template | What it is | Best niches | Best traffic |
| --- | --- | --- | --- | --- |
| Advertorial | `templates/advertorial.html` | Editorial-style article that presells | Health, supplements, weight loss, anti-aging, biz opp | Native, Facebook |
| Direct | `templates/direct.html` | Little copy: headline, 4 benefits, CTA above the fold | Insurance, solar, home services | Google Search, Bing |
| Quiz | `templates/quiz.html` | 3–4 easy questions, auto-advance, loading screen, auto-redirect to the offer | Debt, loans, finance, insurance, Medicare, solar, home services | Facebook, TikTok |

**How to pick the format for each page:**
1. Start from the niche's natural formats in the table above.
2. Match the traffic source: high-intent search traffic wants Direct (they already know what they
   want); cold social traffic converts better on Quiz (low effort, engaging); native traffic expects
   an Advertorial (it sits next to articles).
3. Match the angle: Pain and Social Proof read best as an Advertorial (a story), Curiosity fits a
   Quiz ("Are you overpaying?"), Direct Benefit fits a Direct page. Fear fits an Advertorial.
4. Use at most 2 formats in one test, so the result still tells you something. If the niche and
   traffic clearly point to one format, use it for all 3 pages.
5. Write one line per page in `research.md` saying why that format.

**Format rules:**
- Advertorial: "Advertisement" label at the top, a generic publication name (never a real outlet),
  a staff byline (never an invented reporter), a CTA in the hero, mid-article, and at the end.
  Scenes are second person ("You open the email..."), never invented people.
- Direct: the whole page reads in about 10 seconds. CTA above the fold and at the bottom. The
  timing line must be true (e.g. "rates change at renewal"), never fake scarcity.
- Quiz: opens straight on question 1, no start button. 3–4 questions, 3–4 answers each, ZIP code
  last when the offer is location-based. Edit only the CONFIG block (plus the title, headline,
  accent colors and the footer's LEGAL block). Every answer goes to the same
  offer URL. Never say "you qualify" or "you're approved". Use the niche quiz questions from the
  accelerator's Top 10 Niches list when they fit.
- Give each page its own accent color (`--accent` in the template) so the 3 are easy to tell apart.
- **Tracking pass-through:** every template has a "TRACKING PASS-THROUGH" script. Keep it on every
  page, and give every CTA link the `data-cta` attribute. It copies the tracker's click ID
  (`rtkcid`, `clickid`, `cid`, ...) from the page URL onto every CTA and the quiz redirect, so
  RedTrack, Voluum and similar trackers always match clicks and conversions.

## Page style: logo, images and graphics
Every page ships test-ready: a logo header, real images and the template's graphics. A plain page
with empty image spots is only acceptable when Images is `none` in Settings.

### Logo: one generic publisher per campaign
- Each campaign gets one made-up publisher name that fits the niche ("The Homekeeping Desk",
  "Everyday Driver Notes"). Never a real outlet, never the offer's brand. The same name appears on
  all 3 pages: the logo, the advertorial byline and footer, and the quiz `CONFIG.brand`.
- The logo is one file, `<slug>/img/logo.svg`, shared by every page. Copy `templates/img/logo.svg`
  and change the name, the initial and the brand color (one color for the whole campaign, not
  the per-page accent). Set `textLength` and the width with the formula in the file's comment:
  `textLength` pins the name to that width, so it is never cut off on any device.
- The name usually changes later to match the domain you buy. Swap it with
  `/swap-logo <slug> <Name or domain> [logo file]`.

### Image spots
| Format | File in `<slug>/img/` | Shape | What it shows |
| --- | --- | --- | --- |
| Advertorial | `<angle>-hero.webp` | 16:9 | The angle's moment (the problem, the surprise, the result) |
| Advertorial | `<angle>-inline-1.webp` | 3:2 | The second-person scene ("You open the email...") |
| Advertorial | `<angle>-inline-2.webp` | 3:2 | The calm "after": the problem handled. Also the inline CTA thumbnail |
| Quiz | `<angle>-hero.webp` | 16:9 | Banner strip above the headline (`CONFIG.banner`) |
| Quiz (optional) | `<angle>-answer-1.webp` ... `-4.webp` | 1:1 | One question as a 2x2 picture grid (home type, vehicle, room...) |
| Direct | `<angle>-hero.webp` | 4:3 | The end result, beside the headline |
| Direct | `<angle>-band.webp` | 16:9 | A wide scene, darkened behind the bottom CTA |

The dashboard card for each page shows that page's `<angle>-hero.webp`.

### Making the images (muapi.ai)
- **Model:** the Image model in Settings, or the one the user named for this run (a run-only choice
  is never saved to Settings). The aspect ratio comes from the table. Write every image as one entry
  in a jobs file in the scratch folder (never the repo):
  `[{"prompt": "...", "aspect_ratio": "16:9", "out": "<scratch>/pain-hero.png"}]`, then run
  `node _tools/muapi-image.mjs <jobs.json> --model <image model>`. It fits each job to the model
  (models and their settings are in `_tools/muapi-models.json`; a shape the model can't make becomes
  its closest one, shown under `used`), submits them, waits, downloads each to its `out` path and
  prints one JSON line per image (`status`, `url`, `error`). Resubmit only the ones that failed (a
  rate limit shows as 429). A model name that isn't in the list is sent as-is: check its fields on
  muapi.ai first.
- **Every image must look like a real photograph, never an illustration.** Start every prompt with
  the photo recipe for its type, then the scene, then the ending:
  - People and rooms: `Real candid photograph, documentary photojournalism style, shot on a
    full-frame DSLR with a 35mm lens at f/2.8, natural available light, true-to-life colors, real
    skin texture, subtle film grain.`
  - Objects and equipment: `Real photograph taken with a phone camera, natural light, true-to-life colors.`
  - Houses and buildings: `Real estate listing photograph, shot on a DSLR, daylight, true-to-life colors.`
  - Wide 16:9 images also start with: `Wide horizontal landscape photograph that fills the entire
    frame edge to edge, no borders, no bars.` (otherwise the model can return a boxed portrait shot)
  - Scene: who (matching the avatar's age and setting), where, doing what, mood. Calm and
    believable, never stock-photo grins.
  - Always end with: `Not an illustration, not a painting, not CGI, not a 3D render. No text, no
    labels, no logos, no brand names, no watermarks.`
- **Save small (pop and social traffic is mostly mobile):** convert each downloaded image
  to WebP in `<slug>/img/<file>.webp`, under 200 KB each. Max width: 1200 px for 16:9 heroes and
  bands, 1000 px for 3:2 and 4:3 images, 600 px for 1:1 answers. With ImageMagick:
  `magick in.png -resize "1200x>" -strip -quality 78 -define webp:method=6 out.webp`
  (`convert` on older installs; on a Mac without ImageMagick: `brew install webp`, then
  `cwebp -q 78 -resize 1200 0 in.png -o out.webp`). If a file is still over 200 KB, lower the
  quality in steps of 6. Never commit the original PNGs.
- **Look at every image before using it** (open the saved file): reject and regenerate anything
  with borders or bars, readable text or labels, logos, distorted hands or faces, or an
  illustrated / CGI look. Then list the set for the user (file names and what each shows).
- If an image was made but couldn't be downloaded (status `generated_not_downloaded`, some cloud
  sessions), put its `url` straight into the `src`, add a dashboard notice, and tell the user to
  allow the image host named in the error, or run `/swap-image <slug> all` from their own terminal.
- If Images is `none`, `MUAPI_API_KEY` isn't set, or `api.muapi.ai` can't be reached: leave the
  spots (they show a tinted block, never a broken icon) and add a dashboard notice listing the file
  names to drop into `img/`.

### Image ads (matched to the traffic source)
Every launch also makes ready-to-upload image ads for each of the 3 angles, but only the sizes the
campaign's traffic can use:

| Traffic | Files in `<slug>/ads/img/` | What they are |
| --- | --- | --- |
| Facebook / Instagram | `<angle>-feed-4x5.webp`, `<angle>-feed-1x1.webp` | Feed images with the angle's ad headline and the publisher name on a dark gradient at the bottom |
| Native (Taboola, Outbrain) | `<angle>-native-16x9.webp` | Clean thumbnails, no text |
| Google Search, Bing, pop, push, TikTok | none | Search ads are text; pop has no creative; TikTok is video (see the video ads add-on) |

- One new photo per size family per angle (a 4:5 photo makes both feed images; a 16:9 photo makes the
  native one), generated like the lander images (Settings model, photo recipe, image rules). Show a
  different moment from the lander hero so the ad and the page don't repeat.
- Build the finished files with `node _tools/ad-image.mjs` (feed: `feed <photo> <slug>/ads/img/<angle>
  "<headline>" "<publisher>"`; native: `native <photo> <slug>/ads/img/<angle>`). The headline is the
  angle's best Meta headline (40 characters max), never a claim the page doesn't make.
- Look at every finished ad before using it. Same rules as every image, plus: no fake buttons, play
  icons, notification badges or platform UI on the image.
- On the dashboard, each angle's tab shows its image ads first (before the ad copy) with a Download
  button each.
- Images `none` in Settings → no image ads; the dashboard lists the file names and sizes to make.

### Image rules (ad networks review images too)
- Images illustrate a situation; they never prove anything. No before/after, no body
  transformations, no people presented as customers, reviewers, doctors or experts, no fake
  screenshots of results, bills, checks or apps.
- No text, logos, brand names, badges, seals or "as seen on" marks inside an image. No real or
  famous people, no recognizable products or brands.
- Advertorial images carry the caption "Photo illustration." Every footer says "Images are illustrations."
- Health: no bodies in focus, no pills or "miracle" product shots. Finance and BizOpp: no cash
  piles, luxury goods or wealth lifestyle shots.

### Graphics (use what the template has)
- **Advertorial:** reading-progress bar, Key points box, pull quote (a line from the article,
  never a quote from a person), "Without / With" comparison of situations (never of results),
  FAQ, tinted final CTA box. Drop one only if it truly doesn't fit the angle.
- **Direct:** split hero with image, 3 feature cards with icons from the template's ICON SET,
  FAQ, image CTA band.
- **Quiz:** logo header with a true trust line, banner image, emoji `icon`s on text answers,
  one picture-grid question when images are on, trust row (true statements only), loading checklist.

### Swap commands
| Command | What it does |
| --- | --- |
| `/swap-link <slug> <link>` | Puts the real affiliate link on every CTA and quiz redirect |
| `/swap-logo <slug> <Name or domain> [logo file]` | Renames the publisher on every page and rebuilds or replaces `img/logo.svg` |
| `/swap-image <slug> <file or all> [image file, URL or new prompt]` | Replaces one image spot, or regenerates / downloads them all |
| `/models [image|video] [name]` | Lists the muapi.ai image and video models and switches the one in Settings |
| `/legal <slug or all> [traffic sources]` | Fills the Privacy Policy and Terms from Settings, and rewrites each page's LEGAL footer block for its traffic sources |

## Legal pages and disclaimers
Ad networks review the landing page, not just the ad. Every campaign ships with:
- `<slug>/privacy.html` and `<slug>/terms.html`, copied from `templates/privacy.html` and
  `templates/terms.html`. Fill `data-ph` spans: `publisher` (the campaign's publisher name), `date`
  (launch date), and `business`, `email`, `address`, `state` from Settings. Keep `pixels` as
  "None at this time" until a pixel is installed. A value still in [brackets] keeps `class="ph"`
  (yellow) and the dashboard gets a "Legal pages" warning. In terms.html, add the vertical's line to
  "Not advice" (see the vertical table); for age-restricted offers, replace the "Children" section
  of privacy.html with an "Age" section (21+/18+).
- A **LEGAL block** in every lander's footer (between `<!-- LEGAL` and `<!-- /LEGAL -->`): one
  line per traffic source from the table below, then the links Privacy Policy · Terms of Service ·
  Contact. Rewrite the whole block when the traffic changes.

These are starting templates, not legal advice. Say so once in the report and suggest a lawyer
review before scaling.

### Lines per traffic source
| Traffic | What the platform expects | LEGAL block line |
| --- | --- | --- |
| Meta (Facebook, Instagram) | Privacy policy linked on the page (required with pixels or any data collection); a non-affiliation line is standard practice | "This site is not a part of the Facebook website or Meta Platforms, Inc., and is not endorsed by Meta in any way. Facebook and Instagram are trademarks of Meta Platforms, Inc." |
| Google Search / Display / YouTube | Business identity and contact info, policy pages linked from every page (Misrepresentation and Destination requirements) | "This site is not a part of Google LLC or YouTube and is not endorsed by Google in any way. Google and YouTube are trademarks of Google LLC." |
| Microsoft / Bing | Same as Google | "This site is not a part of Microsoft Corporation or Bing and is not endorsed by Microsoft in any way. Microsoft and Bing are trademarks of Microsoft Corporation." |
| TikTok | Privacy policy clearly displayed and easy to find; mobile-friendly | "This site is not a part of TikTok or ByteDance Ltd. and is not endorsed by TikTok in any way. TikTok is a trademark of ByteDance Ltd." |
| Native (Taboola, Outbrain) | "Advertorial" / "Advertisement" clearly at the top of editorial-style pages; privacy policy | "This page is paid advertising, not independent news or editorial content." Advertorial top label reads "Advertisement · Advertorial". |
| Pop / push / redirect (PropellerAds, Zeropark, ...) | No platform line; affiliate disclosure, privacy link, never mimic system alerts or "you've won" | (none, just the links) |

Several sources in one campaign → one line each.

### Lines per vertical (in the page footer, and in terms.html "Not advice")
| Vertical | Line |
| --- | --- |
| Insurance | "Rates, savings, and coverage vary by driver, vehicle, location, and insurer. We are not an insurance company or agent." (adapt for the product) |
| Home warranty | "A home warranty is a service contract, not homeowners insurance. Coverage, exclusions and fees vary by plan and state." |
| Finance, loans, debt | "We are not a lender or financial advisor. Terms, rates and eligibility are set by the provider. Not financial advice." |
| Health, supplements | "This content is not medical advice. Talk to your doctor." For dietary supplements also: "These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease." |
| BizOpp | "Results vary and are not typical. We make no income or earnings claims." |
| Gambling | "18+ / 21+ where required. Play only where legal. Gambling is entertainment, not income. Help: 1-800-GAMBLER." |
| Sweepstakes | "Enter for a chance to win; no guaranteed prize. Each giveaway follows its sponsor's official rules. A real sweepstakes never asks you to pay to collect a prize." |

## Folder layout: one folder per offer
```
<offer-slug>/
  research.md      offer check, avatar, the 5 angle scores and why the 3 were picked
  <angle>.html     three bridge pages, one per chosen angle (file names above)
  ad-copy.md       hooks, PAS bodies and ad copy per angle and traffic source
  index.html       campaign dashboard, built from templates/dashboard.html (always keep its design)
  img/             logo.svg plus each page's images (file names in "Image spots")
  ads/img/         image ads for the campaign's traffic sources (see "Image ads")
  privacy.html     Privacy Policy (from templates/privacy.html)
  terms.html       Terms of Service (from templates/terms.html)
```
Live URLs: `<Site URL><offer-slug>/` (dashboard) and `<Site URL><offer-slug>/pain.html`, etc.

`<offer-slug>` is lowercase with hyphens: "Auto Insurance" → `auto-insurance`.

`_tools/` holds the image-ad builder and its fonts; `_addons/` holds optional add-ons. Folders
starting with `_` are never published.

**Optional add-on: video ads** (`_addons/video-ads/`, off unless its rules block appears at the end of
this file). If the user asks for video ads while it's off, say it's an add-on, what it makes (UGC-style
narrator videos for TikTok, Reels and the Meta feed, one muapi.ai Kling 3.0 clip per angle) and how to turn
it on: `node _addons/video-ads/toggle.mjs on`, then restart Claude Code. Don't mention it otherwise.


## Rules for every page
- Bridge pages presell: conversational, empathetic, not hype-y, and they don't name the
  offer's brand.
- Each HTML file is self-contained: inline CSS, no build step, no JS frameworks.
  Google Fonts is fine. Pages must look right on a phone (test at 375px wide).
- The file must start with `<!DOCTYPE html>`, with nothing before it .
- Every call-to-action button links to the affiliate URL. If there isn't one yet, use
  the placeholder `https://example.com/offer` so it can be swapped with one find/replace.
- **Compliance (ad networks reject pages over this):**
  - No invented testimonials, reviews, star ratings, or "as seen on" logos.
  - No specific savings numbers, prices, or stats unless the offer owner supplied them.
    Say "could save", "compare rates", not "save $847".
  - No fake urgency (countdown timers, "only 3 left").
  - A visible affiliate disclosure in the footer, plus the LEGAL block (traffic-source lines and
    Privacy / Terms / Contact links). See "Legal pages and disclaimers".
  - Regulated offers (insurance, finance, health) also get a short disclaimer, e.g.
    "Rates and savings vary by driver, vehicle, and state."
- Ad copy follows the same rules as the pages. "Story-style" ads are written as a
  second-person scenario ("You open the renewal email…"), never as a made-up
  first-person customer experience.

## Deploying
Commit with a clear message ("Launch campaign: Auto Insurance") and push to `main`.
GitHub Pages rebuilds automatically.

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
