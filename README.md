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

If you would rather not use Claude Code, do the same by hand: edit the files in the table above, delete `CHANGELOG.md`, `.github/workflows/release-please.yml`, `release-please-config.json` and `.release-please-manifest.json`, set `version` to `0.0.1`.

### 4. Configure the GitHub repository

A repo created from a template gets the files (workflows included) but **not the repository settings**: the `main` ruleset, the merge settings and the security features stay on the template. The workflows are written for those settings, so without them the CI runs but protects nothing. Once the first CI run on `main` has finished, apply them as described in [CI and repository rules](#ci-and-repository-rules): ruleset, merge settings, security.

---

## Working with the agent

`CLAUDE.md` is the single source of context: stack, naming, i18n rule, design-system rules. The agent reads it automatically — keep it short and project-specific. Fill "App context" and add rules as the project grows.

Talk to it in plain language, English or Italian:

- *"Add a pricing page with three cards"* → it creates the page, i18n keys in every locale, and uses `Base*` components and design tokens.
- *"Add a Base component for tabs"* → follows the component conventions in `CLAUDE.md`.
- *"Translate the contact page to French"* → adds the locale consistently.

**Optional power-up:** the `sb-context-fe` plugins (`sb-core`, `sb-github`, `sb-health`, `sb-design`) add shortcuts. They live outside your repo. The context they write goes in `.sb-context/`, which this template ignores (it is the maintainer's local context); in your project, remove the `.sb-context/` line from `.gitignore` to commit it (personal files then stay out through the folder's own `.gitignore`):

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
| `npm run typecheck` | Type check (`nuxt typecheck`, also run by the CI) |
| `npm run si` | Safe install: `npm ci` on `main`, `npm install` elsewhere |
| `npm run analyze` | Bundle size report |

On `main` always `npm ci`, never `npm install`.

---

## Project layout

```
app/
  assets/css/     main.css, theme.css, typography.css, animation.css
  components/     base/ (reusable) · the-* (layout singletons)
  composables/    useAppNotifications, useLockScroll, usePageTransition, usePointerHighlight, useScrollSpy, useSanitize
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

<!-- ci-and-rules:start -->
## CI and repository rules

The workflows and the repository settings are one setup, but GitHub copies only the first half when you create a repo from a template. The workflows assume this configuration:

- **`build` and `commitlint` are required checks of the ruleset.** That is why `build-check.yml` runs on every PR, with no `paths-ignore`, and skips its jobs from the inside: a required check must always report, and a skipped job counts as passed. Without the ruleset, a red check does not block the merge.
- **Squash merge only.** `commitlint.yml` lints only the PR title because that title becomes the single commit on `main` that release-please reads. With merge commits or rebase allowed, the branch's own commits land on `main` without being checked.
- **`main` changes only through PRs.** A direct push skips both checks.

### Workflows (copied with the template)

| File | Runs on | What it does | Required check |
|---|---|---|---|
| `build-check.yml` | PR into `main`, push to `main` | lint, type check, build; skips drafts, bot PRs and docs-only changes (`**/*.md`, `LICENSE`, `.claude/`, `.sb-context/`, `.impeccable/`) | `build` |
| `commitlint.yml` | PR into `main` (also when the title is edited) | the PR title follows Conventional Commits (it becomes the squash commit read by release-please) | `commitlint` |
| `release-please.yml` | push to `main` | version, changelog, tag, GitHub Release; runs only on `stefanBid/sb-template-nuxt` (`init-project` removes it from your copy, or recreates it without the guard if you want releases) | — |

Change the commands in `build-check.yml` (the `Lint`, `Type check`, `Build` steps; add a `Test` step when the project has tests). The job names are the required checks: renaming one means updating the ruleset too.

### Ruleset `Main Ruleset` on `main` (NOT copied: apply it on the new repo)

| Rule | State | Notes |
|---|---|---|
| Restrict deletions | on | `main` cannot be deleted |
| Block force pushes | on | |
| Require a pull request before merging | on | 0 approvals (solo maintainer), squash only; `require_extra_approval_for_unattributed_changes` on |
| Require status checks to pass | on | `build`, `commitlint` (GitHub Actions); "up to date with main" off (release-please moves `main` at every merge) |
| Require linear history | on | |
| Restrict creations / updates | off | |
| Require signed commits | off | |
| Require deployments to succeed | off | |
| Require code scanning results | off | |
| Bypass list | empty | nobody, admins included |

Apply it after the first CI run on `main` (otherwise the required checks never report):

```bash
gh api -X POST repos/{owner}/{repo}/rulesets --input .github/rulesets/main-protected.json
```

Customize: GitHub → Settings → Rules → Rulesets → `Main Ruleset`, or edit the JSON and `gh api -X PUT repos/{owner}/{repo}/rulesets/<id> --input .github/rulesets/main-protected.json`. On a private repo rulesets need a paid plan.

### Merge settings (NOT copied)

| Setting | State |
|---|---|
| Squash merge | on, title = PR title, message = PR body |
| Merge commit / rebase merge | off |
| Delete branch on merge | on |
| Auto-merge | off |

```bash
gh api -X PATCH repos/{owner}/{repo} \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true \
  -f squash_merge_commit_title=PR_TITLE -f squash_merge_commit_message=PR_BODY
```

### Security (NOT copied)

| Feature | State | Why |
|---|---|---|
| Dependabot alerts | on | notifies vulnerable dependencies |
| Dependabot security updates | off | no automatic PRs: updates are done by hand |
| Dependabot version updates (`dependabot.yml`) | absent | it would only open PRs |
| Secret scanning + push protection | on | free on public repos; private ones need GitHub Advanced Security |

```bash
gh api -X PUT repos/{owner}/{repo}/vulnerability-alerts
gh api -X DELETE repos/{owner}/{repo}/automated-security-fixes
```

How often you are emailed about alerts is a personal setting: GitHub → Settings → Notifications → Dependabot alerts.
<!-- ci-and-rules:end -->

## License

See `LICENSE`.
