---
description: Swap the affiliate link on an existing campaign and redeploy
argument-hint: <offer-slug> <new affiliate link>
---

Swap the affiliate link for an existing campaign: $ARGUMENTS

1. The first word is the folder (e.g. `auto-insurance`), the rest is the new link.
2. In every bridge page in `<slug>/` (the angle files: `pain.html`, `curiosity.html`,
   `social-proof.html`, `fear.html`, `benefit.html`, whichever exist), replace every CTA link
   (the placeholder `https://example.com/offer` or the old affiliate link) with the new link,
   keeping each page's `sub=` tag (`?sub=pain`, or `&sub=pain` if the new link already has a `?`).
   On quiz pages, the link lives in the script's CONFIG block as `offerUrl`: update it there too.
3. Confirm every CTA (and every quiz `offerUrl`) uses the new link and the correct tag.
4. Commit `Update affiliate link: <slug>`, then `git pull --rebase origin main` and
   `git push origin main`.
5. Report the live URLs of the bridge pages.
