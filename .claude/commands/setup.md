---
description: One-time setup for the Campaign Agent: sets your GitHub Pages URL and checks the repo is ready
---

Set up the Campaign Agent in this repo. Explain each step in plain language: the user may be a beginner.

1. Find this repo's GitHub owner and name from `git remote get-url origin`.
   If there is no remote, tell the user to create a public GitHub repo, turn on
   GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root), and open this
   folder from that repo. Then stop.
2. Work out the Site URL: `https://<owner>.github.io/<repo>/` (or `https://<owner>.github.io/`
   if the repo is named `<owner>.github.io`). Show it and ask the user to confirm it matches
   what they see under Settings → Pages. If they give a different URL, use theirs.
3. Replace `YOUR_SITE_URL` in CLAUDE.md with the confirmed URL (keep the trailing slash).
4. If there is no `index.html` at the repo root, create a simple one that says
   "Campaign Agent is live" so the site has a home page.
5. Ask for the business details used on every campaign's Privacy Policy and Terms: legal business
   name, contact email, mailing address, and governing law (state / country). Save them into the
   Settings block of CLAUDE.md. They can skip any of them: the pages then show a yellow placeholder
   and the dashboard warns, and they can add them later and run `/legal all`.
6. Commit `Set up Campaign Agent` and push to `main`.
7. Tell the user setup is done, that the site can take about a minute to update, and that
   they can now run: `/launch-offer <your offer> <your affiliate link>`.
