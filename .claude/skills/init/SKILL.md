---
name: init
description: Initialize or reset this Nuxt template project — renames the project, records app context, and resets version/changelog. Trigger phrases (English or Italian) — "initialize the project", "reset the project", "inizializza il progetto".
---

# Initialize / reset the project

1. Ask the user (single batch): new project name; a 2–4 sentence app context (purpose + audience) to store in the App context section of `CLAUDE.md`; any changes to the conventions in `CLAUDE.md` compared to the template defaults.
2. Update `package.json`: `name` (kebab-case of the project name), `description`.
3. Update `app/app.config.ts`: `site.name`, `site.titleTemplate`, and `social.*` values.
4. Update `README.md`: main heading and tagline.
5. Reset `package.json` version to `1.0.0`; reset the version badge in `README.md` if present.
6. Reset `CHANGELOG.md` to a clean [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) skeleton with an `[Unreleased]` section and a `[1.0.0] - <today>` entry ("Initial release").
7. Analyse the `app/` directory (assets/css, components, composables, layouts, pages, types, utils) and check that every catalogue in `CLAUDE.md` (component API tables, composables list, design tokens, pages list, config reference) still matches reality. Report discrepancies briefly, then update `CLAUDE.md` to fix them — don't delete still-valid entries.
8. Report: app context saved, project renamed, files touched (with exact changes), and any inconsistency found but not auto-resolved.
