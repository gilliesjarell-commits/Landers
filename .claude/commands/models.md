---
description: Show the muapi.ai image and video models you can choose from, and switch the ones every campaign uses
argument-hint: [image|video] [model name]
---

Choose the image and video models: $ARGUMENTS

The choices live in `_tools/muapi-models.json`; print them with `node _tools/muapi-image.mjs --list`.
The current picks are the **Image model** and **Video model** lines in the Settings block of CLAUDE.md.

1. **No arguments:** show the user both lists as two short tables (model name, what it is), mark the
   one currently set in Settings, and say how to switch: `/models image <name>` or `/models video <name>`.
   Mention that one run can use another model without changing Settings, e.g.
   `/launch-offer <offer> <link> image model flux-2-pro` or `/make-video <slug> video model <name>`.
   Prices aren't in the list: point to muapi.ai's pricing page.
2. **`image <name>` or `video <name>`:**
   - If the name isn't in that list (allow small typos and pick the closest match, and say which), say
     it isn't a tested choice. Video ads need a model that makes a talking narrator with a voice, so
     only offer names from the video list for `video`. For an untested image model, ask before saving
     it, and warn that its settings are sent as-is.
   - Replace the model name on that line of CLAUDE.md Settings (keep the rest of the line).
   - Commit `Set <image|video> model: <name>`, then `git pull --rebase origin main` and `git push origin main`.
   - Say it's saved and applies to the next `/launch-offer`, `/swap-image` or `/make-video`. Images
     already on live pages stay as they are; `/swap-image <slug> all <prompt>` remakes them.
