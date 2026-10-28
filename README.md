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
| Project name + domain | `package.json` name, `NUXT_PUBLIC_SITE_URL` in `.env`, site name in `app/app.config.ts` and `site.name` in `nuxt.config.ts` |
| Description (what it does, for whom) | "App context" in `CLAUDE.md`, default meta description |
| Pages | One `app/pages/<name>.vue` per page (with its `definePageMeta({ sitemap })`), nav entries, i18n meta keys |
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

**Optional power-up:** the `sb-context-fe` plugins (`sb-core`, `sb-github`, `sb-health`, `sb-design`) add shortcuts. They live outside your repo; only the project context they write in `.sb-context/` can be committed (personal files stay out through its own `.gitignore`):

```
/plugin marketplace add stefanBid/sb-context-fe
/plugin install sb-context-fe@sb-context-fe
```

| Skill | Say |
|---|---|
| `/sb-core:setup` | "set up the plugin on this project" (run first) |
| `/sb-health:build` | "check the build" |
| `/sb-health:lint` | "check the lint" |
| `/sb-health:deps` | "check dependencies" |
| `/sb-health:seo` | "check SEO" |
| `/sb-health:docs` | "update the documentation" |
| `/sb-health:checkup` | "full checkup" (all of the above) |
| `/sb-design:align` / `/sb-design:migrate` | "reorganize the global style" / "refactor the templates after the style change" |
| `/sb-github:admin` | "open a PR", "set up the branch rules" |

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
server/routes/    Nitro routes (robots.txt: `Disallow: /` outside Netlify production, else points to /sitemap_index.xml)
nuxt.config.ts    single source of truth for the Nuxt setup (documented inline)
```

Design system: colours, shadows, radii, type scale and motion are closed token sets in `app/assets/css/` — read `theme.css` and `typography.css`, they are the reference. Components: read `app/components/base/` for props.

---

## Sitemap

Generated by [`@nuxtjs/sitemap`](https://nuxt.com/modules/sitemap) — there is no hand-written `sitemap.xml`.

- **Pages are discovered automatically** from `app/pages/`; hreflang alternates (plus `x-default`) come from `@nuxtjs/i18n`.
- **Files produced** (prerendered at build, `sitemap.zeroRuntime: true`, no sitemap code in the server bundle): `/sitemap_index.xml`, one sitemap per language (`/__sitemap__/en-US.xml`, `/__sitemap__/it-IT.xml`). `/sitemap.xml` redirects to the index (Netlify `_redirects`). Submit `/sitemap_index.xml` in Google Search Console.
- **Domain**: every `<loc>` resolves against `site.url` in `nuxt.config.ts`, read from `NUXT_PUBLIC_SITE_URL` at build time.
- **Metadata lives in each page**, at the top of `<script setup>`. One call covers every language of the page:

  ```ts
  definePageMeta({
    sitemap: { lastmod: '2025-11-24', changefreq: 'monthly', priority: 1.0 },
  })
  ```

  Update `lastmod` by hand only when the content really changes (`autoLastmod` is off on purpose: on Netlify the file date is the checkout date). Exclude a page with `definePageMeta({ sitemap: false })`, or a pattern with `sitemap.exclude`.
- **New page**: add the `definePageMeta({ sitemap })` call above when you create it.
- **Dynamic content (CMS, `[slug].vue`)**: those URLs are not discovered on their own. Return them from a server endpoint built with `defineSitemapEventHandler` (e.g. `server/api/__sitemap__/urls.ts`) and register it in `sitemap.sources: ['/api/__sitemap__/urls']`. Then either keep `zeroRuntime` and trigger a Netlify rebuild (build hook) when the content changes, or drop `zeroRuntime` and serve the sitemap at runtime with `cacheMaxAgeSeconds`.

---

## Versioning and branches

- Releases use [release-please](https://github.com/googleapis/release-please) on conventional commits (`feat:`, `fix:`, `feat!:`). In **this template** it manages tags and `CHANGELOG.md`; `init-project` removes it from your copy (re-add it if you want it).
- `main` is the only long-lived branch and changes only through pull requests from short-lived branches (`feat/…`, `fix/…`, `chore/deps-…`).
- Deployment target: Netlify (`netlify.toml`). A production build fails if `NUXT_PUBLIC_SITE_URL` is missing or still the placeholder.

## License

See `LICENSE`.
