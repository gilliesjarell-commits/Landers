---
description: Replace one image on a campaign, or regenerate / save all of them, then redeploy
argument-hint: <offer-slug> <image file name or "all"> [image file, URL, or new prompt]
---

Swap images for an existing campaign: $ARGUMENTS

Image spots and file names are listed under "Image spots" in CLAUDE.md
(e.g. `pain-hero.webp`, `curiosity-answer-2.webp`, `benefit-band.webp`). Image ads live in
`<slug>/ads/img/` (`pain-feed-4x5.webp`, `pain-feed-1x1.webp`, `pain-native-16x9.webp`; see "Image ads").
For an image ad, the new photo goes through `node _tools/ad-image.mjs` again (feed rebuilds both 4:5 and
1:1 with the headline; native rebuilds the 16:9), never straight into the file.

1. The first word is the folder (e.g. `home-warranty-2`). The second is the image file name (with or
   without `img/`) or `all`. Anything after that is the new image source.
2. **One image** (`<slug> pain-hero.webp <source>`):
   - **A local file:** convert it to WebP at `<slug>/img/<file>.webp`, under 200 KB, using the sizes
     and commands in "Save small" in CLAUDE.md.
   - **A URL:** download it into `<slug>/img/<file>` the same way.
   - **Text (a new prompt) or nothing:** generate a new image with Higgsfield (the Settings model,
     the spot's shape, the photo recipe in CLAUDE.md; no text prompt → write one from the page's
     angle and copy), then save it as WebP under 200 KB and look at it before using it.
   - Make sure the page's `src` points at `img/<file>`.
3. **`all`:**
   - Images currently linked from Higgsfield (`src` starting with `https://`): download each into
     `<slug>/img/<angle>-<spot>.webp` (WebP, under 200 KB) and point the `src` back at the local file.
   - Spots with no file in `img/`: generate them with Higgsfield (one batch) and save them.
   - With a text prompt after `all`, regenerate every image in that style instead.
   - Update the dashboard card thumbnails and remove its "images linked/missing" notice once every
     image is local.
4. Check every image against the "Image rules" in CLAUDE.md (no text or logos, no before/after,
   no "customer" people) and that every `img/` path on the pages points to a real file.
5. Commit `Update images: <slug>`, then `git pull --rebase origin main` and `git push origin main`.
6. Report which images changed and the live URLs of the pages.
