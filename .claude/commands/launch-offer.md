---
description: Research an offer, pick the 3 best angles and the best lander format for each (advertorial, direct, quiz), then build and deploy the pages, ad copy and dashboard to GitHub Pages
argument-hint: <offer> [affiliate link] [EPC] [traffic source]
---

You are the Campaign Agent. Research, build and deploy a complete test campaign for this offer:

**Offer:** $ARGUMENTS

Read the arguments:
- A URL is the affiliate link. No URL → use the placeholder `https://example.com/offer` and say so at the end.
- A dollar amount (e.g. `$1.20` or `EPC 1.20`) is the offer's EPC.
- A traffic source (Facebook, Google Search, Google Display, TikTok, Native) overrides the default in CLAUDE.md.

**First:** if the Site URL in CLAUDE.md is still `YOUR_SITE_URL`, stop and tell the user to run `/setup` first.

Follow CLAUDE.md for the method, the 5 angles, folder layout, and compliance rules. Work through
these steps in order without stopping, unless the offer is too vague to research (then ask one question).

## 1. Check the offer
- Pick the offer slug (e.g. `auto-insurance`). If `<slug>/` already exists, add `-2`, `-3`, …
- Name the vertical: Health, Finance, BizOpp, Insurance, Education, Home Services, or Other.
- **Traffic source policy check:** search the traffic source's current ad policy for this vertical.
  If the source bans it (e.g. Google Ads does not allow credit repair ads, including lead gen),
  stop and tell the user, name the policy, and suggest a source that allows it. Don't build
  anything until they pick one. If it's allowed with restrictions (certification, special ad
  category), note the requirement in `research.md` and on the dashboard.
- EPC: if the user gave one, record it in `research.md` and show it in an EPC chip on the dashboard.
  It's information only: no minimum, no warning. If none was given, leave the chip out.

## 2. Research the niche and build the avatar
Use web search to see what this audience is actually saying and what competitors run.
Answer the accelerator's avatar questions, specifically:
1. Who is this person? (age, income, lifestyle, daily frustrations)
2. Their top 10 pain points related to the problem.
3. What they've already tried that didn't work.
4. What would make them click an ad right now.
5. Where they spend time online.

## 3. Pick the 3 angles (show your reasoning)
Score all 5 angles for THIS avatar, 1–5 each, one line of reasoning per angle:
Pain Point · Curiosity · Social Proof · Fear · Direct Benefit.
Then apply the vertical guardrails in CLAUDE.md (Social Proof needs real proof; some angles are
risky in some verticals) and pick the 3 highest that pass. Name the 2 you skipped and why.

Then pick the **format** for each of the 3 pages (Advertorial, Direct, or Quiz) using the
"How to pick the format" rules in CLAUDE.md: niche, traffic source, and angle. One line each on why.

Save all of steps 1–3 to `<slug>/research.md` and print a short summary: 3 angles, each with its format.

## 4. Build the three pages from the templates
**4a. Publisher and logo.** Pick one generic publisher name for the campaign (never a real outlet,
never the offer's brand) and one brand color. Copy `templates/img/logo.svg` to `<slug>/img/logo.svg`
and set the name, initial, color and width (see "Page style" in CLAUDE.md).

**4b. Pages.** For each chosen angle, copy the matching template from `templates/` to `<slug>/<angle>.html`
(`pain.html`, `curiosity.html`, `social-proof.html`, `fear.html`, `benefit.html`), then replace the
sample content with this offer's copy for that angle. Keep the template's structure, layout, graphics
and compliance pieces; change the copy, the `<title>`, the accent colors, the publisher name, and
every `img/` path to this angle (`img/<angle>-hero.webp`, ...). Delete the template's top comment.
- **Advertorial:** headline, dek, hero line, Key points, story sections, pull quote (a line from the
  article), Without/With comparison, explainer, how it works, FAQ, final CTA. Image alt text and
  captions to match. Conversational, empathetic, not hype-y. Don't name the offer's brand.
- **Direct:** short. Headline, one supporting line, 4 benefit checks, a true timing line, 3 feature
  cards (icons from the ICON SET), 3 steps, 3 FAQs, bottom CTA band.
- **Quiz:** edit only the CONFIG block (questions with `icon`s, one picture-grid question if images
  are on, brand, banner, subhead, trust items, loading title and steps, disclaimer, offer URL), the
  headline, the title, and the accent colors. 3–4 easy questions for this niche; ZIP last if the
  offer is location-based.
Follow the format rules in CLAUDE.md. Give each page its own accent color.
Every CTA (and the quiz's offerUrl) uses the affiliate link plus the angle's tracking tag:
`?sub=pain`, `?sub=curiosity`, `?sub=socialproof`, `?sub=fear`, `?sub=benefit`
(use `&sub=` if the link already has a `?`).

**4c. Legal pages and disclaimers.** Follow "Legal pages and disclaimers" in CLAUDE.md: create
`<slug>/privacy.html` and `<slug>/terms.html` from the templates (publisher, launch date, Settings values,
the vertical's line), and write each lander's LEGAL footer block with one line per traffic source
(Native also changes the advertorial top label).

**4d. Images.** Follow "Making the images" and "Image rules" in CLAUDE.md: write one prompt per
image spot the 3 pages use (photo recipe first), generate them with `node _tools/muapi-image.mjs` (one jobs file for all of them),
then save them as WebP under 200 KB and look at each one (regenerate any with borders, text or an
illustrated look) into
`<slug>/img/` (or link the muapi URLs if the download is blocked). Skip this step if Images is
`none` in Settings, `MUAPI_API_KEY` isn't set or muapi can't be reached, and say so on the dashboard.

**4e. Image ads.** Follow "Image ads" in CLAUDE.md: only the sizes the traffic source uses (Facebook /
Instagram → feed 4:5 + 1:1 with the headline; Native → 16:9, no text; none for Google, Bing, pop, TikTok).
Generate the photos in the same muapi jobs file as the lander images when you can, build the files with
`node _tools/ad-image.mjs`, and look at each one. Use the Meta headlines you write in step 5 (write them
first if needed). Skip if Images is `none`.

## 5. Write the ad copy → `<slug>/ad-copy.md`
For each chosen angle:
- **Hooks:** 3 scroll-stopping hooks, under 15 words each.
- **PAS body:** one Pain → Agitate → Solution body.
Then per traffic source:
- **Facebook / TikTok:** 3 primary texts (short, medium, and story-style written as a second-person
  scenario), 3 headlines (≤40 characters), 2 descriptions (≤30 characters).
- **Native:** 5 headlines (≤60 characters).
- **Google Search:** 15 headlines (≤30 characters) and 4 descriptions (≤90 characters), with the
  main keyword named.
Each angle lists its matching live landing page URL.

## 6. Build the dashboard → `<slug>/index.html`
Copy `templates/dashboard.html` to `<slug>/index.html` and replace its sample content, keeping its
design exactly (dark background, glow, cards, tabs, Copy buttons). Follow the
instructions in the template's top comment:
- Title, offer name, sub line, and meta chips: launch date, vertical, EPC (only if given),
  test budget, traffic source, affiliate link status. Status "Testing".
- Notices for anything to know before launch: traffic-source policy requirements, placeholder link,
  the compliance baseline for regulated niches, the publisher name (swap with `/swap-logo`), and
  images that are linked from muapi or still missing, and the "Legal pages" warning while any
  Settings business detail is still a placeholder. Skip the block if there's nothing to flag.
- "Why these angles": all 5 angles with scores; the 3 picked highlighted, the 2 skipped dimmed.
- Image ads (if the traffic has any): first block in each angle's ad-copy pane, one figure per file with
  a Download button (markup in the template's top comment).
- One card per page: hero image thumbnail, angle, format (Advertorial / Direct / Quiz), one-line summary,
  live link, full URL.
- All ad copy grouped by angle, each item with a Copy button.
- No test plan and no CTR / Kill vs Scale rules.
Use absolute live URLs: `<Site URL from CLAUDE.md><slug>/<file>`. Don't link to research.md.

## 7. Check before deploying
- Every HTML file starts with `<!DOCTYPE html>`, and every page came from a template.
- Quiz pages: the CONFIG offerUrl has the right sub tag, and there's no start button.
- Every CTA points to the affiliate link (or placeholder) with the right `sub` tag.
- No invented testimonials, ratings, results, or specific savings/income numbers.
- Social Proof and Fear pages follow the guardrails in CLAUDE.md.
- Every dashboard link matches a file that exists.
- Every `img/` path on every page points to a file in `<slug>/img/` (or a muapi URL), `img/logo.svg`
  exists, and the publisher name is the same on all 3 pages.
- `privacy.html` and `terms.html` exist, every lander's footer has the LEGAL block with the right
  traffic-source lines and working Privacy / Terms / Contact links.
- Image ads exist for exactly the sizes the traffic source uses, each under 200 KB, and each dashboard
  pane shows them.
- Images follow the image rules: no text or logos in them, no before/after, no "customer" people.
- At 375px wide, each page shows its logo header and the first CTA (or quiz question 1) without scrolling far.
Fix anything that fails.

## 8. Deploy
- `git add <slug>/` (this includes `img/` and `ads/`) then commit: `Launch campaign: <Offer Name>`.
- `git pull --rebase origin main`, then `git push origin main`.

## 9. Report
End with only this:
- **Angles picked:** the 3, each with its format and one line on why.
- **Dashboard:** the live dashboard URL
- **Landers:** the three live URLs
- GitHub Pages takes about 1 minute to go live.
- If the placeholder link was used: "Swap it in with `/swap-link <slug> <your link>`."
- The publisher name, and: "Rename it to match your domain with `/swap-logo <slug> <name>`."
- If Settings still has placeholder business details: "Fill your business details in CLAUDE.md Settings, then run `/legal <slug>`."
- If images are linked from muapi or missing: "Save them into the repo with `/swap-image <slug> all`."
