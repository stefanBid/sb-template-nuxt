<div align="center">
  <div style="background: white; padding: 20px; border-radius: 12px; display: inline-block;">
    <img src="https://i.ibb.co/v4B0Js1m/sb-template-nuxt.jpg" alt="SB-Template Nuxt Logo" width="300" style="border-radius: 12px;">
  </div>


  # SB-Template Nuxt

  ![Version](https://img.shields.io/badge/version-3.0.0-blue)
  [![Node.js](https://img.shields.io/badge/node-%3E%3D24.19.0-brightgreen)](https://nodejs.org)
  [![Nuxt](https://img.shields.io/badge/nuxt-4.5.2-00DC82?logo=nuxt.js)](https://nuxt.com)
  [![Vue](https://img.shields.io/badge/vue-3.5.42-4FC08D?logo=vue.js)](https://vuejs.org)
  [![TypeScript](https://img.shields.io/badge/typescript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/tailwind-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
  ![License](https://img.shields.io/badge/license-MIT-green)

  **Stop wasting time on boilerplate. Start building features.**

  A Nuxt 4 starter template with an opinionated design system, reusable UI components, i18n, dark mode and pre-configured AI tooling. Clone it, initialise it for your project, and start building features on day one.

</div>

---

## Developer Notes

> Internal knowledge base for contributors: known issues, gotchas and version decisions that aren't obvious from the code alone. Not part of the numbered docs below — update this section whenever something like this is discovered or resolved.

### ✅ Resolved — `3.0.0`: Fern UI design system redesign

Every component in `app/components/` was recomposed around a new design language ("Fern UI") — new colour tokens, a semantic radius hierarchy (`--radius-sm/md/lg`), accent-tinted shadows (`var(--color-app-shadow)` instead of neutral black), and recurring structural motifs (icon-in-a-block, badge-dot separators, section-tag eyebrows, two-tier surface stacking). This is a breaking visual change for anyone who forked the template pre-`3.0.0` and customised component markup directly, hence the major bump. The canonical reference for the new tokens/motifs is `app/assets/design-system/fern-ui-preview.html` (live preview) and `.claude/skills/fern-ui-migration/references/fern-ui-tokens.md` (the AI-facing spec used to recompose components) — read the latter before hand-styling any new component so it stays consistent with the rest of the system.

### ✅ Resolved — `nuxt` bumped to `4.5.2` (was pinned to `4.4.8`)

`4.5.0` bundles Vite 8, unhead v3 and unctx v3. Re-tested on a feature branch per the note that used to live here: `npx nuxt typecheck` and `npm run build` both pass clean on `4.5.2`. The one real fallout was a peer-dependency conflict — `@intlify/bundle-utils` (pulled in by `@nuxtjs/i18n`) depends on an older `esbuild` range than `vite@8` requires, which broke strict npm peer resolution (`ERESOLVE`). Fixed with a targeted `overrides.esbuild` pin in `package.json` (see [Dependencies](#13-dependencies)) instead of a blanket `legacy-peer-deps` flag, so peer-dep checks stay strict for everything else.

### ✅ Resolved — `NUXT_B2005` false positive on `check-if-page-unused.js`

Build/dev warning `Plugin .../check-if-page-unused.js has no default export and will be ignored at build time` is a known Nuxt false positive — the internal plugin does export a default, Nuxt's build-time check flags it incorrectly. Harmless, doesn't block build or dev server. Tracked upstream: [nuxt/nuxt#35664](https://github.com/nuxt/nuxt/issues/35664). Confirmed absent on both `nuxt@4.4.8` and the current `4.5.2` — if it resurfaces after a future version bump, treat it as a regression tied to that version rather than a project config issue.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Getting Started](#2-getting-started)
3. [Project Structure](#3-project-structure)
4. [Design System](#4-design-system)
5. [Routing](#5-routing)
6. [Layouts](#6-layouts)
7. [Pages](#7-pages)
8. [Components](#8-components)
9. [Composables & Utils](#9-composables--utils)
10. [AI Tooling — Prompts & Instructions](#10-ai-tooling--prompts--instructions)
11. [Deployment](#11-deployment)
12. [Versioning](#12-versioning)
13. [Dependencies](#13-dependencies)

---

## 1. Overview

SB-Template Nuxt is designed to provide a solid and opinionated starting structure for building new web applications. It ships with **Fern UI** — a pre-configured design system (CSS custom properties + Tailwind v4 utilities) covering colours, radius hierarchy, tinted shadows and typography — plus reusable UI components, i18n, dark/light theme, a notification system and layouts, so that developers can focus on building features rather than scaffolding.

> **v3.0.0** is a from-scratch visual redesign: every component was recomposed around the Fern UI tokens (new colour palette, semantic radius scale, accent-tinted shadows, icon-in-a-block and section-tag motifs). See [Developer Notes](#developer-notes) and [Design System](#4-design-system) below.

The template is meant to be cloned and initialised for a specific project (via the `init-project` prompt), progressively replacing placeholder pages and components with real ones while keeping the underlying conventions and tooling intact.

**Target audience:** Vue/Nuxt developers who want a clean, consistent foundation without bikeshedding on folder structure, naming conventions, or design tokens.

---

## 2. Getting Started

### Prerequisites

- **Node.js** ≥ 24.19.0
- **npm**

### Installation

**Option 1: Use as GitHub Template** (Recommended)

1. Click **"Use this template"** on GitHub
2. Clone your new repository:

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```

**Option 2: Clone directly**

```bash
git clone https://github.com/stefanoBid/sb-nuxt-template.git my-project
cd my-project
rm -rf .git && git init
```

### Project Initialisation

After cloning, ask your AI coding assistant to "initialize the project" (see [AI Tooling](#10-ai-tooling--prompts--instructions)) to rename the project, update all config files, reset the version to `1.0.0` and sync `CLAUDE.md` with the codebase.

Then install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Visit **http://localhost:3000**.

### Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server at `http://localhost:3000` |
| `npm run build` | Build for production (outputs to `.output/`) |
| `npm run generate` | Generate static site |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code quality with ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run si` | Safe install dependencies (auto-detects branch, and run `npm install` or `npm ci`) |
| `npm run analyze` | Bundle size report (`nuxi analyze`) |

---

## 3. Project Structure

This section shows the annotated directory tree. The project follows a feature-agnostic structure where each top-level folder has a single responsibility.

```
── nuxt.config.ts           ← Nuxt configuration (modules, SSR, runtimeConfig, routeRules, nitro, vite…)
── netlify.toml             ← versioned Netlify build settings (command, publish dir, Node version)
── .env.example             ← documented NUXT_PUBLIC_* env vars — copy to .env
── package.json             ← dependencies and npm scripts
── tsconfig.json            ← TypeScript config — extends .nuxt/tsconfig.app.json
── eslint.config.mjs        ← ESLint flat config (extends @nuxt/eslint, stylistic rules)
── .nvmrc                   ← pinned Node.js version (24.19.0)
── public/
     favicon.ico
     sitemap.xml
     logo.webp
── server/
     routes/
       robots.txt.ts        ← dynamic robots.txt — disallows indexing outside Netlify production
── i18n/
     locales/
       en.json              ← English translations (source of truth)
       it.json              ← Italian translations
── app/
     app.vue               ← root entry point (NuxtLayout + NuxtPage)
     app.config.ts         ← public build-time branding config (site name, theme colour, social links)
     router.options.ts     ← custom scrollBehavior — smooth-scrolls to a route's #hash (in-page anchor nav)
     error.vue             ← global error page
     assets/
       css/
         main.css          ← entry point: imports all CSS layers in order
         theme.css         ← @theme block: CSS custom properties + dark mode overrides
         typography.css    ← @utility ty-app-* classes
         utilities.css     ← @utility u-app-* classes
         animations.css    ← Vue transition classes (fade, slide-down, scale-fade)
     components/
       base/               ← reusable design-system components (no business logic)
         accordion/        BaseAccordion.vue
         badge/            BaseBadge.vue
         button/           BaseButton.vue
         card/             BaseCard.vue
         checkbox/         BaseCheckbox.vue
         chip/             BaseChip.vue
         close-button/     BaseCloseButton.vue
         combobox/         BaseCombobox.vue
         dialog/           BaseDialog.vue
         icon-button/      BaseIconButton.vue
         icon-menu/        BaseIconMenu.vue
         input/            BaseInput.vue
         media-carousel/   BaseMediaCarousel.vue
         radio/            BaseRadio.vue
         rich-text/        BaseRichText.vue
         select/           BaseSelect.vue
         switch/           BaseSwitch.vue
         textarea/         BaseTextarea.vue
       the-footer/         TheFooter.vue
       the-header/         TheHeader.vue, TheHeaderMenuToggle.vue
       the-notification/   TheNotificationBanner.vue, TheNotificationBox.vue
       the-theme-toggle/   TheThemeToggle.vue
     composables/
       useAppNotifications.ts  ← global notification system (success/warning/error/info)
       useFloatingUi.ts        ← @floating-ui/vue wrapper for dropdown positioning
       useLockScroll.ts        ← scroll lock with multi-caller safety
       useSanitize.ts          ← XSS-safe HTML sanitisation
     layouts/
       default.vue         ← main layout: TheHeader + <slot> + TheFooter + notifications
     pages/
       index.vue           ← homepage (component showcase)
     plugins/
       scrollToTop.client.ts
     types/
       global.d.ts         ← global TS interfaces (MenuItem, RouteItem, NotificationItem, RichBlock*)
     utils/
       blocksToHtml.ts     ← Strapi rich text → HTML string converter
       generateUuid.ts     ← UUID v4 generator
```

---

## 4. Design System

The design system ("Fern UI") lives entirely in `app/assets/css/` and provides a single source of truth for colours, typography, spacing and transitions. **Never use hardcoded values** — always reference the design tokens. For a live view of every token and structural motif in one place, see `app/assets/design-system/fern-ui-preview.html`; for the AI-facing spec used when recomposing a component, see `.claude/skills/fern-ui-migration/references/fern-ui-tokens.md`.

### Colours — `--color-app-*`

All colours are CSS custom properties defined in `theme.css` inside an `@theme` block, auto-mapped to Tailwind utilities. Dark mode is handled via variable overrides inside `.dark` — **never use `dark:` Tailwind variants**.

| Token | Tailwind utility | Usage |
|---|---|---|
| `--color-app-main` | `bg-app-main` | Page background |
| `--color-app-surface` | `bg-app-surface` | Card / elevated surface |
| `--color-app-surface-2` | `bg-app-surface-2` | Nested surfaces, inputs |
| `--color-app-border` | `border-app-border` | Default borders |
| `--color-app-shadow` | `shadow-[0_4px_20px_var(--color-app-shadow)]` | Accent-tinted shadow colour — always used via `var()`, never a neutral black shadow |
| `--color-app-accent` | `bg-app-accent` / `text-app-accent` | Primary CTA, highlights |
| `--color-app-accent-hover` | `hover:bg-app-accent-hover` | Hover state of accent |
| `--color-app-accent-border` | `border-app-accent-border` | Border on accent elements |
| `--color-app-contrast` | `text-app-contrast` | Primary text |
| `--color-app-muted` | `text-app-muted` | Secondary / placeholder text |
| `--color-app-success/warning/error/info` | `text-app-success` etc. | Status colours |
| `--color-app-*-bg` | `bg-app-success-bg` etc. | Status background tints |

Tailwind opacity modifiers are allowed: `bg-app-main/80`, `text-app-muted/70`.

### Radius — `--radius-*`

Defined in `theme.css`'s `@theme` block, these **override Tailwind's default `rounded-sm`/`rounded-md`/`rounded-lg` scale** so the whole app's corner-radius hierarchy is a semantic signal rather than an arbitrary per-component choice (`rounded-full`, used for pills/dots/avatars, is Tailwind's own default and needs no override).

| Token | Value | Tailwind utility | Usage |
|---|---|---|---|
| `--radius-sm` | `10px` | `rounded-sm` | Buttons, inputs, icon blocks, small chips/menu items |
| `--radius-md` | `14px` | `rounded-md` | Standard cards, dropdown/menu panels |
| `--radius-lg` | `22px` | `rounded-lg` | Dialogs, hero/feature panels, page-level elevated blocks |

Always use the canonical `rounded-sm` / `rounded-md` / `rounded-lg` classes (never `rounded-[var(--radius-*)]` arbitrary syntax) so the token override applies.

### Typography — `ty-app-*`

Custom `@utility` classes defined in `typography.css`. Apply them as regular Tailwind classes alongside spacing, colour and layout utilities.

| Class | Font | Usage |
|---|---|---|
| `ty-app-h1` | Poppins | Biggest heading — hero titles (`--fs-app-h1`) |
| `ty-app-h2` | Poppins | Large section headlines (`--fs-app-h2`) |
| `ty-app-h3` | Poppins | Standard titles — cards, dialogs, brand mark (`--fs-app-h3`) |
| `ty-app-h4` | Poppins semibold | Smallest heading — subtitles, notification titles (`--fs-app-h4`) |
| `ty-app-p` | Inter | Body text (`--fs-app-p`) |
| `ty-app-span` | Inter | Inline text at body size, for non-`<p>` elements |
| `ty-app-label` | Inter, uppercase, tracked | Form labels, tags, eyebrows |
| `ty-app-small` | Inter | Fine print |
| `ty-app-code` | Monospace | Inline code |
| `ty-app-btn-label` | Inter bold, uppercase | Button text |
| `ty-app-caption` | Inter italic | Captions, secondary notes |

`ty-app-h1`–`ty-app-p` mirror the `--fs-app-h1`–`--fs-app-p` modular scale in `theme.css` (ratio `--fs-app-scale-ratio`, `1.25`) and reset `margin: 0`, leaving spacing entirely to Tailwind (`mt-*`, `space-y-*`) instead of a hidden default margin. **Pick the class for the element's actual weight in its container, not its HTML tag** — a card's own title is `ty-app-h3` even on a page whose main section headline is `ty-app-h2`; matching two different-weight headings to the same class is what makes a compact card or toast notification look oversized next to the rest of the page.

```vue
<h2 class="ty-app-h3 text-app-contrast">Card title</h2>
<p class="ty-app-p text-app-muted mt-2">Some description.</p>
```

Raw `<h1>`–`<h4>`/`<p>` tags (e.g. inside content rendered by `BaseRichText`) are sized the same way via `@layer base` in `typography.css`, but keep the browser's default bottom margin — appropriate for prose flow where you don't want to hand-manage every paragraph's spacing.

**Font families:**
- `font-app-primary` → Poppins (headings, display)
- `font-app-secondary` → Inter (body, UI)

### Utility classes — `u-app-*`

| Class | Effect |
|---|---|
| `u-app-soft-transition` | `transition-all duration-200 ease-in-out` |
| `u-app-hard-transition` | `transition-all duration-500 ease-in-out` |
| `u-app-focus` | `outline-none ring-app-contrast focus-visible:ring-2` |
| `u-app-focus-within` | `outline-none ring-app-contrast focus-within:ring-2` |

Always add `u-app-soft-transition` to interactive and themed elements so they animate on theme switch.

### Animations — Vue `<Transition>`

Named transition classes defined in `animations.css`. Use as the `name` prop on `<Transition>`.

| Name | Effect | Duration |
|---|---|---|
| `fade` | Opacity + slight Y offset | 800ms |
| `slide-down` | Opacity + slides from top | 200ms |
| `scale-fade` | Opacity + scale from 0.95 | 200ms |

```vue
<Transition name="scale-fade">
  <div v-if="isOpen">…</div>
</Transition>
```

### Icons

Always use the `<Icon>` component from `@nuxt/icon`. The collection prefix is mandatory.

Available collections: `lucide` (UI icons), `flagpack` (country flags).

```vue
<Icon name="lucide:arrow-right" class="size-5 text-app-accent" />
<Icon name="flagpack:it" class="size-5" />
```

Size via Tailwind: `size-4`, `size-5`, `size-6`. Colour via token: `text-app-contrast`, `text-app-muted`, `text-app-accent`. Always set `aria-label` on icon-only interactive elements.

---

## 5. Routing

Routing is handled by Nuxt 4's file-based routing (vue-router under the hood). The file path inside `app/pages/` maps directly to the URL.

### File → URL mapping

| File path | URL | Notes |
|---|---|---|
| `app/pages/index.vue` | `/` | Homepage |
| `app/pages/about.vue` | `/about` | Static page |
| `app/pages/blog/index.vue` | `/blog` | Section index |
| `app/pages/blog/[slug].vue` | `/blog/:slug` | Dynamic segment |
| `app/pages/blog/[[slug]].vue` | `/blog` and `/blog/:slug` | Optional segment |
| `app/pages/[...slug].vue` | `/anything/deep` | Catch-all |
| `app/pages/(group)/page.vue` | `/page` | Route group (folder ignored) |

### Adding a new page

**Step 1 — Create the file** in `app/pages/` following the naming rules above.

**Step 2 — Add `useHead()`** with translated meta tags.

**Step 3 — Add translation keys** to both `i18n/locales/en.json` and `i18n/locales/it.json`.

**Step 4 — Add a `routeRules` entry** in `nuxt.config.ts` if the page should be statically generated:

```ts
routeRules: {
  '/about': { prerender: true },
}
```

### i18n

Every user-facing string in the app goes through `@nuxtjs/i18n` — **never hardcode text in a template or script, no exceptions.** The homepage's "Two languages" section demonstrates this live (switch language from the header toggle and watch the whole page update).

**Locale files** — `i18n/locales/en.json` (source of truth) and `i18n/locales/it.json`, nested plain JSON objects keyed by feature (`pages.home.hero.title`, `footer.tagline`, etc.). Adding a string means adding the same key to **both** files in the same change — nothing renders in the language you forgot.

**Reading translations:**

```vue
<script setup lang="ts">
const { t, locale, setLocale } = useI18n()
</script>

<template>
  <h1>{{ t('pages.home.hero.title') }}</h1>
</template>
```

`$t(...)` also works directly in templates without destructuring `t` first.

**Routing** — configured in `nuxt.config.ts` under `i18n`: strategy `prefix_except_default` (`en` is the default locale and gets no prefix, `/about`; every other locale is prefixed, `/it/about`), `detectBrowserLanguage: false` (deliberate — the app always starts in the default locale rather than guessing from browser headers, so SSR output is deterministic). Always build links with `localePath()`, never a raw string, so the current locale's prefix is added automatically:

```vue
<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink :to="localePath('index')">Home</NuxtLink>
</template>
```

`useLocaleHead({ dir: true, seo: true })` (already wired in `app/layouts/default.vue`) generates the `<html lang>`, canonical and `hreflang` alternate `<link>` tags for every page automatically.

**Switching language** — `TheHeader`'s language control is a `BaseIconMenu` fed by `langs: MenuItem[]` (flag icons via the `flagpack` collection); selecting one emits `change-lang`, which `default.vue` forwards to `setLocale(langCode)`. Add a third locale by adding an entry to `i18n.locales` in `nuxt.config.ts`, a matching `<code>.json` file in `i18n/locales/`, and a `langs` entry in `default.vue`.

---

## 6. Layouts

Layouts live in `app/layouts/`. A page is wrapped in a layout automatically via `NuxtLayout` in `app.vue`.

### `default.vue`

The main layout used by all pages. Structure: `TheHeader` → `<slot>` (page content) → `TheFooter` → `TheNotificationBanner` + `TheNotificationBox`.

No props — all configuration is done at page level via `useHead()` and composables.

### `TheHeader`

Singleton top navigation bar. Renders the nav links it receives via the `routes: RouteItem[]` prop (built in `default.vue` — currently a set of same-page anchor links into the homepage's sections), the language switcher (`BaseIconMenu` with flag icons) and `TheThemeToggle`. The brand mark always links to the localised homepage regardless of what `routes` contains.

On mobile it uses `TheHeaderMenuToggle` to open a drawer. Scroll position drives a subtle background transition.

### `TheFooter`

Singleton bottom section. Contains site links (`RouteItem[]`) and social links.

### `TheThemeToggle`

Icon button that toggles between light and dark mode via `@nuxtjs/color-mode`. No props.

---

## 7. Pages

Pages live in `app/pages/`. Each file is a Vue SFC using `<script setup lang="ts">`. All user-facing strings go through `useI18n()` — never hardcode UI text in templates.

### Minimal page template

```vue
<script setup lang="ts">
// Dependencies
const { t } = useI18n()

// SEO
useHead({
  title: t('pageName.meta.title'),
  meta: [
    { name: 'description', content: t('pageName.meta.description') },
    { property: 'og:title', content: t('pageName.meta.title') },
    { property: 'og:description', content: t('pageName.meta.description') },
  ],
})
</script>

<template>
  <!-- page content -->
</template>
```

### Available pages

| Page | URL | Description |
|---|---|---|
| `index.vue` | `/` | Homepage — Fern UI–style single-page demo (hero, i18n, Buttons, Badges & Chips, Cards, Accordion, Form, Dialog, Components, Responsive), most sections anchored and linked from `TheHeader`'s nav |

---

## 8. Components

All reusable components live in `app/components/`. Component names must describe **what the component is**, not where it is used. All components use design system tokens — never hardcoded values.

`Base` prefix: fully reusable, no business logic, no direct API calls.
`The` prefix: singletons used once per layout (TheHeader, TheFooter, etc.).

### `BaseButton`

Full-featured action button with variants, loading state and link support.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls padding |
| `type` | `'button' \| 'submit' \| 'reset' \| 'link'` | `'button'` | `'link'` renders `<a target="_blank">` |
| `to` | `string` | `undefined` | Required when `type='link'` |
| `ariaLabel` | `string` | `undefined` | For icon-only usage |
| `isDisabled` | `boolean` | `false` | |
| `isLoading` | `boolean` | `false` | Shows spinner |

Slot: `default` (button label / content)

```vue
<BaseButton variant="primary" :is-loading="isSaving" type="submit">Save</BaseButton>
<BaseButton variant="outline" type="link" to="https://example.com">
  <Icon name="lucide:external-link" class="size-4" /> Open
</BaseButton>
```

### `BaseCard`

Flexible card container with slots for header, body and footer.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | `undefined` | |
| `subtitle` | `string` | `undefined` | |
| `paragraph` | `string` | `undefined` | |
| `variant` | `'dark' \| 'dark-hover' \| 'light' \| 'light-hover'` | `'light'` | Background + hover behaviour |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Content alignment |
| `fullCustomContent` | `boolean` | `false` | Disables built-in layout — use `default` slot only |

Slots: `default`, `card-header`, `card-body`, `card-footer`

```vue
<BaseCard title="Card Title" subtitle="Subtitle" variant="dark-hover">
  <template #card-header>
    <Icon name="lucide:star" class="size-6 text-app-accent" />
  </template>
  <template #card-footer>
    <BaseButton>Action</BaseButton>
  </template>
</BaseCard>
```

### `BaseInput`

Text input with label, hints, error states and prefix icon.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `label` | `string` | `undefined` | |
| `placeholder` | `string` | `'Insert a value...'` | |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'search' \| 'tel' \| 'url'` | `'text'` | |
| `hint` | `string` | `undefined` | |
| `error` | `string \| null` | `null` | Shows error label and red border |
| `prefixIcon` | `string` | `undefined` | Iconify name e.g. `lucide:search` |

Model: `defineModel<string>('input')`

```vue
<BaseInput
  id="email"
  v-model:input="email"
  type="email"
  label="Email"
  prefix-icon="lucide:mail"
  :error="emailError"
/>
```

### `BaseTextarea`

Multi-line input with optional character counter.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `label` | `string` | `undefined` | |
| `placeholder` | `string` | `'Insert a value...'` | |
| `hint` | `string` | `undefined` | |
| `error` | `string \| null` | `null` | |
| `maxLength` | `number` | `undefined` | Shows character counter when set |

Model: `defineModel<string>('input')`

### `BaseCheckbox`

Custom checkbox with label slot.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `label` | `string` | `undefined` | Shown if no `default` slot |
| `error` | `string \| null` | `null` | |

Model: `defineModel<boolean>('input')`
Slot: `default` (custom label content)

### `BaseRadio`

Single radio input for a native radio group. Multiple instances sharing the same `name` and bound to the same `v-model` form a group.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `name` | `string` | — | Required — groups radios together |
| `value` | `string` | — | Required — value set on the shared model when selected |
| `label` | `string` | `undefined` | |

Model: `defineModel<string>('input')` (bind the same ref across all radios in the group)

```vue
<BaseRadio id="vis-private" v-model:input="visibility" name="visibility" value="private" label="Private" />
<BaseRadio id="vis-team" v-model:input="visibility" name="visibility" value="team" label="Team" />
```

### `BaseSwitch`

Toggle switch backed by a native checkbox input, styled via `accent`-free custom track/thumb spans.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `name` | `string` | `undefined` | Falls back to `${id}-name` |
| `label` | `string` | `undefined` | Shown next to the switch |

Model: `defineModel<boolean>('input')`

### `BaseSelect`

Native `<select>` wrapper with label, hint, error state and a themed chevron.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `options` | `{ label: string, value: string }[]` | — | Required |
| `label` | `string` | `undefined` | |
| `placeholder` | `string` | `undefined` | Rendered as a disabled first `<option>` |
| `hint` | `string` | `undefined` | |
| `error` | `string \| null` | `null` | |

Model: `defineModel<string>('input')`

### `BaseCombobox`

Generic select component with single/multiple selection and search.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `type` | `'single' \| 'multiple'` | `'single'` | Selection mode |
| `items` | `{ label: string, value: T }[]` | — | Required |
| `label` | `string` | `undefined` | |
| `placeholder` | `string` | `'Insert a value...'` | |
| `hint` | `string` | `undefined` | |
| `error` | `string \| null` | `null` | |
| `prefixIcon` | `string` | `undefined` | |

Model: `defineModel<T[]>('input', { default: () => [] })`

```vue
<BaseCombobox
  id="country"
  v-model:input="selected"
  type="multiple"
  :items="countries"
  label="Countries"
  prefix-icon="lucide:globe"
/>
```

### `BaseChip`

Compact label for tags, badges and status indicators.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `text` | `string` | — | Required |
| `icon` | `string` | `undefined` | Iconify name |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | |
| `clickable` | `boolean` | `false` | Renders as `<button>` |
| `linkable` | `{ href: string, target?: string }` | `undefined` | Renders as `<a>` |

Emits: `chip-click` (only when `clickable: true`)

```vue
<BaseChip text="Vue.js" icon="lucide:code" variant="outline" />
<BaseChip text="Active" icon="lucide:check-circle" variant="primary" :clickable="true" @chip-click="onSelect" />
```

### `BaseBadge`

Non-interactive status label — pairs with `BaseChip` (which is selectable/removable) for the "status vs. selection" distinction from the design system.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `text` | `string` | — | Required |
| `variant` | `'accent' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'outline'` | `'accent'` | |
| `dot` | `boolean` | `false` | Shows a leading status dot |

```vue
<BaseBadge text="Completed" variant="success" />
<BaseBadge text="In progress" variant="accent" :dot="true" />
```

### `BaseDialog`

Modal dialog with size variants, scroll lock and focus trap.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `isOpen` | `boolean` | — | Required |
| `title` | `string` | — | Required |
| `subtitle` | `string` | `undefined` | |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'sm'` | Also scales `title`'s typography (sm→`ty-app-h4` … full→`ty-app-h1`) and the padding, so a bigger dialog doesn't end up with a disproportionately small title, or vice versa |

Emits: `(e: 'close', value: false): void`
Slots: `default` (body), `header` (below title bar), `footer` (bottom actions)
Behaviour: closes on `Escape`, locks scroll, traps focus, uses `<Teleport to="body">`.

```vue
<BaseDialog :is-open="isOpen" title="Confirm action" size="md" @close="isOpen = false">
  <p>Are you sure you want to proceed?</p>
  <template #footer>
    <BaseButton variant="outline" @click="isOpen = false">Cancel</BaseButton>
    <BaseButton @click="onConfirm">Confirm</BaseButton>
  </template>
</BaseDialog>
```

### `BaseAccordion`

Collapsible section. Can be controlled externally or manage its own state.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `title` | `string` | — | Required |
| `icon` | `string` | `undefined` | Iconify name shown in icon box |
| `isOpen` | `boolean` | `undefined` | If omitted, accordion manages state internally |

Emits: `toggle` (only when `isOpen` is controlled externally)
Slot: `default` (body content)

### `BaseIconButton`

Icon-only button with active state styling.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `string` | — | Required. Iconify name |
| `ariaLabel` | `string` | `undefined` | Always set it |
| `isActive` | `boolean` | `false` | Active/pressed state |

Emits: `(e: 'click'): void`

### `BaseIconMenu`

Dropdown menu with floating positioning and keyboard navigation.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `string` | — | Required. Trigger button icon |
| `items` | `MenuItem[]` | — | Required |
| `ariaLabel` | `string` | `undefined` | Forwarded to the trigger's `BaseIconButton` |
| `selectedItemId` | `string \| null` | `null` | Highlighted item, marked with a trailing checkmark |

Emits: `(e: 'select', itemId: string): void`

```vue
<BaseIconMenu
  icon="lucide:more-vertical"
  :items="actions"
  :selected-item-id="activeAction"
  @select="onActionSelect"
/>
```

### `BaseCloseButton`

Accessible close button. No props.

Emits: `(e: 'close', value: false): void`. Renders a `lucide:x` icon button.

### `BaseMediaCarousel`

Image/media carousel with navigation controls. See `app/components/base/media-carousel/BaseMediaCarousel.vue` for the full prop reference.

### `BaseRichText`

Renders a `RichBlock[]` array (Strapi rich text format) as sanitised HTML via `blocksToHtml` + `useSanitize`. Never write `v-html` directly — always use this component. See `app/components/base/rich-text/BaseRichText.vue` for the full prop reference.

---

## 9. Composables & Utils

### `useAppNotifications()`

Global notification system. State is shared across the app via `useState`.

```ts
const { notifications, success, warning, error, info, removeNotification, clearNotifications } = useAppNotifications()

info({
  title: 'Heads up',
  message: 'Your session will expire soon.',
  icon: 'lucide:bell',
  dismissible: true,
  autoClose: true,
  duration: 5000,
})
```

All four methods (`success`, `warning`, `error`, `info`) accept `Omit<NotificationItem, 'type' | 'id'>`. Must be called client-side only — the composable guards this internally.

### `useFloatingUi(config?)`

Wrapper around `@floating-ui/vue` for dropdown/tooltip positioning.

```ts
const { reference, floating, floatingStyles, open, toggleFloating } = useFloatingUi({
  placement: 'bottom-start',
  offset: 8,
  strategy: 'absolute',
})
```

Bind `reference` and `floating` via `ref` on the trigger and panel elements. Bind `floatingStyles` to `:style` on the floating panel.

### `useLockScroll()`

Prevents page scroll. Multi-caller safe — each instance holds its own owner ID.

```ts
const { lock, unlock, isLocked } = useLockScroll()

lock()    // adds app-scroll-locked class to <html>
unlock()  // removes it only when no other caller holds a lock
```

### `useSanitize()`

XSS-safe HTML rendering via `isomorphic-dompurify`.

```ts
const { sanitizeHtml } = useSanitize()
const clean = sanitizeHtml(dirtyHtml) // use via v-html inside BaseRichText only
```

Server-side: skips DOMPurify (content trusted from CMS), converts `\n` to `<br>`. Client-side: full DOMPurify sanitisation with allowlist of safe tags.

### `generateUuid()`

Returns a random UUID v4 string.

```ts
const id = generateUuid() // e.g. '550e8400-e29b-41d4-a716-446655440000'
```

### `blocksToHtml(blocks)`

Converts a `RichBlock[]` array (Strapi rich text format) to an HTML string. Pair with `useSanitize().sanitizeHtml()` before passing to `v-html` — or use via `BaseRichText` directly.

---

## 10. AI Tooling — Prompts & Instructions

This repository ships with a single [`CLAUDE.md`](./CLAUDE.md) file at the project root that gives any AI coding assistant (Claude Code, GitHub Copilot, etc.) full context on the project's conventions, design system, component catalogue and domain. There is no separate scoped-instructions setup — `CLAUDE.md` is always loaded in full.

> Earlier versions of this template split AI context across `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` and `.github/prompts/*.prompt.md`. Those files have been removed and their content merged into `CLAUDE.md`.

### How AI context is configured

| File | Purpose |
|---|---|
| `CLAUDE.md` | Everything: stack, naming conventions, code conventions, design system tokens, full component API catalogue, composables/utils/types reference, pages & layouts conventions, `nuxt.config.ts` reference, and the workflows below |

### Available workflows

Documented inside `CLAUDE.md` under **## Workflows**. They aren't slash commands — just ask the assistant using one of the trigger phrases (or any clearly equivalent wording) and it follows the documented steps.

| Workflow | Trigger phrases | What it does |
|---|---|---|
| Initialize / reset the project | "initialize the project" · "reset the project" | Collects project name and app context; renames the app across config files; resets version to `1.0.0` and the changelog; audits `CLAUDE.md` against the actual `app/` directory |
| Update documentation | "update the documentation" · "update the README" | Compares README with the actual codebase and rewrites it as a structured documentation book |
| Lint check | "check the lint" · "is the project clean?" | Runs `eslint --fix`, reports remaining warnings and blocking errors |
| Build & type check | "check the build" · "does the project build?" | Runs `nuxt typecheck` + `nuxt build`, reports type and build errors |
| Dependency check & update | "check dependencies" · "update dependencies" | Checks outdated packages, auto-updates safe minor/patch bumps, reports major bumps with changelog links, runs `npm audit` + `npm audit fix`, delivers a full vulnerability report |
| GSC / SEO readiness check | "check SEO" · "check GSC readiness" | Validates `sitemap.xml`, the dynamic `server/routes/robots.txt.ts`, global meta/brand values in `nuxt.config.ts` and `app/app.config.ts`, and per-page `useHead`/`useSeoMeta` calls across all pages |
| Full project checkup | "full checkup" · "run a full checkup" | Orchestrates all four checks (dependencies, SEO, build, lint) in sequence; optionally updates documentation |
| Fern UI migration | "apply Fern UI" · "migrate to Fern" · "restyle this component with Fern UI" | Recomposes an existing component's markup/classes around the Fern UI tokens and structural motifs (radius hierarchy, tinted shadow, icon-in-a-block, section-tag) instead of a plain class swap |

### How to run a workflow

Open a chat with your AI coding assistant in the project root (so `CLAUDE.md` is picked up as context) and type one of the trigger phrases above, or describe the task in your own words — the assistant follows the matching workflow section in `CLAUDE.md`.

---

## 11. Deployment

### Netlify (default)

This template is pre-configured for Netlify. The Nitro preset is set to `netlify` in `nuxt.config.ts`, and build settings are versioned in [`netlify.toml`](./netlify.toml) rather than left only in the Netlify dashboard:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

```bash
npm run build
```

The `netlify` preset builds static assets to `dist/` and the SSR function to `.netlify/functions-internal/` — Netlify picks up both automatically from `netlify.toml`.

Add environment variables under **Site settings → Environment variables** (see [Environment variables](#environment-variables) below). A `hooks['build:before']` guard in `nuxt.config.ts` fails the production build (`CONTEXT === 'production'`) if `NUXT_PUBLIC_SITE_URL` is missing or still the template placeholder.

### Other targets

Change the `nitro.preset` in `nuxt.config.ts`:

| Target | Preset |
|---|---|
| Vercel | `'vercel'` |
| Cloudflare Pages | `'cloudflare-pages'` |
| Node.js server | `'node-server'` |

```ts
nitro: {
  preset: 'vercel',
}
```

Then run `npm run build` and deploy the `.output/` folder to your target.

### Environment variables

Copy [`.env.example`](./.env.example) to `.env` at the project root and fill in real values. All client-side variables must be prefixed with `NUXT_PUBLIC_`:

```env
NUXT_PUBLIC_SITE_URL=https://www.yoursite.com
```

Access them in your app via `useRuntimeConfig()`. Declare public vars in `nuxt.config.ts → runtimeConfig.public`.

For non-secret, rarely-changing branding values (site name, theme colour, social links) that don't need an env-var override, use `app/app.config.ts` and `useAppConfig()` instead — see [Project Structure](#3-project-structure).

---

## 12. Versioning

Versioning is fully automated via the [Release Please](https://github.com/googleapis/release-please) GitHub Action (`.github/workflows/release-please.yml`).

### How it works

On every push to `main`, Release Please analyses the commit history following the [Conventional Commits](https://www.conventionalcommits.org) specification and automatically:

1. Creates or updates a **Release PR** that bumps `package.json` version and prepends a new entry to `CHANGELOG.md`
2. When the Release PR is merged, creates a **GitHub Release** with an annotated tag

### Commit convention

| Commit prefix | Bump type | Example |
|---|---|---|
| `fix:` | `patch` | `fix: correct redirect on login` |
| `feat:` | `minor` | `feat: add dark mode toggle` |
| `feat!:` / `BREAKING CHANGE:` | `major` | `feat!: remove legacy API endpoint` |
| `chore:`, `docs:`, `style:`, `refactor:`, `test:` | none | `chore: update dependencies` |

### Tag naming convention

| Pattern | Example | When to use |
|---|---|---|
| `vMAJOR.MINOR.PATCH` | `v1.2.0` | Every production release |
| `vMAJOR.MINOR.PATCH-beta.N` | `v2.0.0-beta.1` | Pre-release / beta builds |

---

## 13. Dependencies

| Package | Version | Purpose |
|---|---|---|
| `nuxt` | ^4.x | Core framework |
| `vue` | ^3.5.x | UI framework |
| `vue-router` | ^5.x | Routing |
| `tailwindcss` | ^4.x | Utility-first CSS |
| `@tailwindcss/vite` | ^4.x | Tailwind v4 Vite plugin |
| `@nuxt/icon` | ^2.x | SVG icon system (lucide + flagpack) |
| `@nuxt/image` | ^2.x | Image optimisation (ipx + Cloudinary) |
| `@nuxt/fonts` | ^0.x | Self-hosted web fonts (Poppins, Inter) |
| `@nuxtjs/i18n` | ^10.x | Multi-language support |
| `@nuxtjs/color-mode` | ^4.x | Dark/light theme |
| `@vueuse/nuxt` | ^14.x | Vue composition utilities |
| `@floating-ui/vue` | ^1.x | Floating element positioning |
| `isomorphic-dompurify` | ^3.x | XSS-safe HTML sanitisation |
| `@iconify-json/lucide` *(dev)* | ^1.x | Lucide icon set |
| `@iconify-json/flagpack` *(dev)* | ^1.x | Flag icon set |
| `@nuxt/eslint` *(dev)* | ^1.x | ESLint + stylistic rules |
| `@types/node` *(dev)* | ^25.x | Node.js type definitions |
| `esbuild` *(via `overrides`)* | ^0.28.x | Not a direct dependency — pinned to a single version across the tree because `@intlify/bundle-utils` (from `@nuxtjs/i18n`) depends on an older `esbuild` range than `vite@8` requires; without the override, strict npm peer resolution fails with `ERESOLVE` |

---

<div align="center">

Built with ❤️ by **Stefano Biddau**

[stefanobiddau.com](https://stefanobiddau.com) · [@stefanoBid](https://github.com/stefanoBid)

</div>
