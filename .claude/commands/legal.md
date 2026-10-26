---
description: Fill the Privacy Policy and Terms from Settings and update every page's traffic-source disclaimers, then redeploy
argument-hint: <offer-slug or "all"> [traffic sources, e.g. "Meta, Native"]
---

Update the legal pages and disclaimers: $ARGUMENTS

Rules: "Legal pages and disclaimers" in CLAUDE.md.

1. The first word is a campaign folder (e.g. `home-warranty-2`) or `all` (every campaign folder that has
   an `index.html` dashboard and pages built from the templates). Anything after it is a new list of
   traffic sources for that campaign (e.g. `Meta, Native` or `Google Search`).
   If the user gave business details in the message ("my business is X LLC, email y@z.com"), first save
   them into the Settings block of CLAUDE.md.
2. For each campaign:
   - If `privacy.html` / `terms.html` are missing, create them from `templates/privacy.html` and
     `templates/terms.html` (delete the template comment; logo `alt` and `publisher` = the campaign's
     publisher name; `date` = today; add the vertical's "Not advice" line and the Age section if the
     offer is age-restricted).
   - Fill every `data-ph` span from Settings: `business`, `email`, `address`, `state`. A value that is
     still in [brackets] in Settings stays a placeholder (keeps `class="ph"`); a real value drops the
     class. Keep the `data-ph` attributes so this can run again. Update `date` to today when anything
     changed.
   - Traffic sources: use the ones given in the arguments, otherwise the campaign's dashboard "Traffic"
     chip. Rewrite the LEGAL block (between `<!-- LEGAL` and `<!-- /LEGAL -->`) in the footer of every
     lander with one line per source from the table in CLAUDE.md, then the Privacy / Terms / Contact
     links. For Native, the advertorial top label reads "Advertisement · Advertorial". If the traffic
     changed, update the dashboard's Traffic chip too.
   - Dashboard notice: keep the "Legal pages" warning while any placeholder is left; otherwise replace it
     with a short blue notice linking the two pages.
3. Check: every lander links to `privacy.html` and `terms.html` and both exist; no `class="ph"` remains
   unless Settings still has brackets; pages still look right at 375px wide.
4. Commit `Update legal pages: <slug or all>`, then `git pull --rebase origin main` and
   `git push origin main`.
5. Report what was filled, which placeholders are still open, and the live privacy/terms URLs. Remind
   the user these are starting templates, not legal advice.
