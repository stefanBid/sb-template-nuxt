---
name: init-project
description: First-run setup for a project created from this template. Asks for project name/domain, description, pages, languages, colour palette and fonts, then rewrites package.json, app.config.ts, i18n, theme.css, fonts and release files accordingly. Run right after cloning; safe to re-run to fix mistakes. Trigger phrases — "init project", "initialize the project", "inizializza il progetto".
---

# init-project

Onboarding for a fresh clone of the template. The skill stays in the repo after it finishes so the process can be repeated to correct mistakes; the user decides when to remove it.

## 0. Preconditions

- Read `.template-version` (template release this project started from) — keep it, never reset it.
- If `package.json` `name` is not `sb-nuxt-template`, the project was already initialised: this is a **re-run**. Ask what to fix (full redo or specific steps), pre-fill answers from the current state (`package.json`, `app.config.ts`, `nuxt.config.ts`, `theme.css`, `CLAUDE.md` "App context"), and only change what the user confirms. Every step in section 2 must be idempotent (skip files already deleted, don't duplicate pages, keys or routes, replace the "App context" block instead of appending).
- Check the working tree is clean (`git status --short`); if not, ask.

## 1. Ask (one AskUserQuestion round, then follow-ups only if needed)

1. **Project name** (kebab-case, for `package.json`) and **domain** (e.g. `example.com`, or "none yet").
2. **Description** — what it does and who it is for (2–4 sentences). Goes into `CLAUDE.md` "App context" and the default meta description.
3. **Pages** — list (e.g. about, pricing, contact). Default: only `index`. For each page also its sitemap `changefreq` and `priority` (`lastmod` = today); never invent them.
4. **Languages** — how many, which codes (default `en` only; the template ships `en` + `it`). First one is the default locale.
5. **Palette** — options: "I give you a primary hex", "pick one for me from the description", "decide later with global style".
6. **Fonts** — display + body families (Google Fonts), "pick for me", or "decide later". **Skip this question when the answer to 5 was "decide later"**, and set both to later.

If anything is "later", leave the shipped palette/fonts untouched and note it in `CLAUDE.md`.

## 2. Apply

Do each edit, then summarise the diff.

1. **package.json**: `name` → project name, `version` → `0.0.1`. Same `name`/`version` in the root and `packages[""]` of `package-lock.json`.
2. **Release reset**: delete `CHANGELOG.md`, `.release-please-manifest.json` (if present) and `.github/workflows/release-please.yml`. Ask whether the user wants release-please in the new repo; if yes, recreate the workflow without the `if: github.repository == …` guard, with manifest `{".": "0.0.0"}`.
3. **app.config.ts**: `site.name` (same value in `site.name` of `nuxt.config.ts`), `site.titleTemplate`, and replace the placeholder `social.*` values (ask for real ones or blank them). Domain → `NUXT_PUBLIC_SITE_URL` in a new `.env` (copy `.env.example`); remind the user to set it in Netlify too.
4. **i18n**: edit `i18n.locales` / `defaultLocale` in `nuxt.config.ts`; create/remove `i18n/locales/<code>.json` so each locale has the same keys (copy `en.json`; translate values if the user asked, else keep source text and say so). Update the language-switcher data if it lists locales.
5. **Pages**: for each page create `app/pages/<name>.vue` from the minimal template in `CLAUDE.md`, starting its `<script setup>` with `definePageMeta({ sitemap: { lastmod, changefreq, priority } })` (the answers from question 3; the sitemap picks the page up on its own), add `<name>.meta.title/description` keys to every locale file, and add the route to the header `RouteItem[]` used in `app/layouts/default.vue`.
6. **Palette** (if given): set `--sb-primary`, `-hover`, `-soft`, `--sb-on-primary` in `app/assets/css/theme.css` for **both** `:root, [data-theme="light"]` and `[data-theme="dark"]`. Derive the dark primary lighter. Verify with `node .claude/skills/init-project/scripts/contrast.mjs app/assets/css/theme.css --prefix sb` (both themes; exit code 1 = a required pair fails). Adjust until it passes; never leave a failing pair.
7. **Fonts** (if given): update `--font-display` / `--font-body` in `typography.css` **and** `fonts.families` in `nuxt.config.ts` (names must match; weights 400/600/700 only).
8. **CLAUDE.md**: fill "App context" with the description, pages and languages. Keep the rest.
9. **README.md**: replace the template intro with project name + description; keep the "Getting started" section.
10. Run `npm ci` if `node_modules` is missing, then `npm run lint:fix && npx nuxt typecheck && npm run build`. Report failures verbatim; fix those caused by the edits.

## 3. Finish

- Do **not** delete this skill. Tell the user it can be re-run to fix mistakes, and that they can remove `.claude/skills/init-project/` by hand once happy.
- Suggest first commit: `git add -A && git commit -m "chore: initialise project"`. Do not commit or push without being asked.
- Mention the optional `sb-context-fe` plugins (`/sb-core:setup` first, then `/sb-design:align` to refine palette, type scale and motion later, plus checks and GitHub admin) — see the README.
