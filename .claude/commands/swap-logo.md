---
description: Rename a campaign's publisher (usually to match your domain) and swap its logo, then redeploy
argument-hint: <offer-slug> <new publisher name or domain> [logo file or URL]
---

Swap the publisher name and logo for an existing campaign: $ARGUMENTS

1. The first word is the folder (e.g. `home-warranty-2`). The rest is the new name, plus an optional
   logo file path or URL at the end.
   - A domain (`homekeepingdesk.com`) becomes a readable name: "Homekeeping Desk". Ask only if it's ambiguous.
   - The name must stay a generic publisher: never a real news outlet and never the offer's brand.
     If it is one, stop and say why.
2. Find the old name: the `alt` of `img/logo.svg` on the campaign's pages (or the quiz's `CONFIG.brand`).
3. Logo:
   - If a logo file or URL was given, copy it into `<slug>/img/` (keep its extension) and point every
     `img/logo.svg` reference on the campaign's pages at the new file.
   - Otherwise rebuild `<slug>/img/logo.svg` from `templates/img/logo.svg` with the new name, its first
     letter in the mark, the campaign's existing brand color, and the width formula in the file's comment.
4. Replace the old name with the new one everywhere on the campaign's pages: logo `alt` text, the
   advertorial byline ("<Name> staff"), the byline seal letter, footers and disclosures, and the
   quiz `CONFIG.brand`, and `privacy.html` / `terms.html` (logo `alt` and the `data-ph="publisher"` spans). Leave the dashboard's design alone; update its publisher notice if it has one.
5. Check: no page still shows the old name (`grep -ri "<old name>" <slug>/`), every logo `src` points
   at a file that exists, and pages still look right at 375px wide.
6. Commit `Update publisher: <slug> → <New Name>`, then `git pull --rebase origin main` and
   `git push origin main`.
7. Report the new name and the live URLs of the pages.
