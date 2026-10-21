# sb-template-nuxt

Production-ready **Nuxt 4** starter: SSR, Tailwind CSS v4 closed design system, base components, i18n, dark/light theme, notification system. Built to be set up in minutes with Claude Code.

**Stack:** Nuxt 4 · Vue 3 (`<script setup>`) · Tailwind v4 · `@nuxt/icon` · `@nuxt/image` · `@nuxt/fonts` · `@nuxtjs/i18n` · `@nuxtjs/color-mode` · `sb-floating-panel-vue` · TypeScript strict · ESLint · Netlify.

---

## Quick start

### 1. Create your project

Click **Use this template** on GitHub (leave *Include all branches* off), then clone your new repo:

```bash
git clone https://github.com/<you>/<your-project>.git
cd <your-project>
```

### 2. Install

Requires Node **24.19.0** (`nvm use`).

```bash
npm ci
cp .env.example .env
```

### 3. Initialise the project

The template ships with its own version (`3.x`), changelog and placeholder content. The bundled `init-project` skill (`.claude/skills/init-project`, no plugin needed) replaces all of that with your project. Open Claude Code in the folder and say:

```
init project
```

(or `/init-project`, or "inizializza il progetto"). It asks, in one go:

| Question | What it changes |
|---|---|
| Project name + domain | `package.json` name, `NUXT_PUBLIC_SITE_URL` in `.env`, site name in `app/app.config.ts` |
| Description (what it does, for whom) | "App context" in `CLAUDE.md`, default meta description |
| Pages | One `app/pages/<name>.vue` per page, nav entries, i18n meta keys |
| Languages | `i18n` config in `nuxt.config.ts`, one `i18n/locales/<code>.json` each |
| Palette | `--sb-primary*` tokens in `app/assets/css/theme.css` (both themes, contrast-checked) |
| Fonts | `typography.css` + `fonts.families` (skipped if you postpone the palette) |

When it finishes it stays in `.claude/skills/`, so you can re-run it to fix mistakes; delete it by hand once you are happy. It also resets the release state: version `0.0.1`, no `CHANGELOG.md`, template's release workflow removed. The file `.template-version` records which template release you started from — keep it, it helps with future migrations.

Then check everything works:

```bash
npm run dev          # http://localhost:3000
```

If you would rather not use Claude Code, do the same by hand: edit the files in the table above, delete `CHANGELOG.md` and `.github/workflows/release-please.yml`, set `version` to `0.0.1`.

---

## Working with the agent

`CLAUDE.md` is the single source of context: stack, naming, i18n rule, design-system rules. The agent reads it automatically — keep it short and project-specific. Fill "App context" and add rules as the project grows.

Talk to it in plain language, English or Italian:

- *"Add a pricing page with three cards"* → it creates the page, i18n keys in every locale, and uses `Base*` components and design tokens.
- *"Add a Base component for tabs"* → follows the component conventions in `CLAUDE.md`.
- *"Translate the contact page to French"* → adds the locale consistently.

**Optional power-up:** the `sb-context-nuxt` plugin adds shortcuts. It lives outside your repo, so nothing from it is ever committed:

```
/plugin marketplace add stefanBid/sb-context-nuxt
/plugin install sb-context-nuxt@sb-context-nuxt
```

| Skill | Say |
|---|---|
| `build-check` | "check the build" |
| `lint-check` | "check the lint" |
| `dependency-check` | "check dependencies" |
| `seo-check` | "check SEO" |
| `docs-update` | "update the documentation" |
| `full-checkup` | "full checkup" (all of the above) |
| `global-style-nuxt` / `global-style-refactor` | "reorganize the global style" / "refactor the templates after the style change" |
| `gh-repo-admin` | "open a PR", "set up the branch rules" |

---

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm run preview` | Production build / preview |
| `npm run generate` | Static generation |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npx nuxt typecheck` | Type check |
| `npm run si` | Safe install: `npm ci` on `main`, `npm install` elsewhere |
| `npm run analyze` | Bundle size report |

On `main` always `npm ci`, never `npm install`.

---

## Project layout

```
app/
  assets/css/     main.css, theme.css, typography.css, animation.css
  components/     base/ (reusable) · the-* (layout singletons)
  composables/    useAppNotifications, useLockScroll, usePointerHighlight, useScrollSpy, useSanitize
  layouts/ pages/ plugins/ types/ utils/
  app.config.ts   public branding (site name, social links)
i18n/locales/     en.json, it.json
server/routes/    Nitro routes (robots.txt)
nuxt.config.ts    single source of truth for the Nuxt setup (documented inline)
```

Design system: colours, shadows, radii, type scale and motion are closed token sets in `app/assets/css/` — read `theme.css` and `typography.css`, they are the reference. Components: read `app/components/base/` for props.

---

## Versioning and branches

- Releases use [release-please](https://github.com/googleapis/release-please) on conventional commits (`feat:`, `fix:`, `feat!:`). In **this template** it manages tags and `CHANGELOG.md`; `init-project` removes it from your copy (re-add it if you want it).
- `main` is the only long-lived branch and changes only through pull requests from short-lived branches (`feat/…`, `fix/…`, `chore/deps-…`).
- Deployment target: Netlify (`netlify.toml`). A production build fails if `NUXT_PUBLIC_SITE_URL` is missing or still the placeholder.

## License

See `LICENSE`.
