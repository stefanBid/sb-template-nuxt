<div align="center">
  <div style="background: white; padding: 20px; border-radius: 12px; display: inline-block;">
    <img src="https://stunning-confidence-0ce6b255c4.media.strapiapp.com/sb_template_nuxt_logo_cd2c1f9652.webp" alt="SB-Template Nuxt Logo" width="200">
  </div>

  # SB-Template Nuxt

  ![Version](https://img.shields.io/badge/version-2.4.5-blue)
  [![Node.js](https://img.shields.io/badge/node-%3E%3D24.11.0-brightgreen)](https://nodejs.org)
  [![Nuxt](https://img.shields.io/badge/nuxt-4-00DC82?logo=nuxt.js)](https://nuxt.com)
  [![Vue](https://img.shields.io/badge/vue-3-4FC08D?logo=vue.js)](https://vuejs.org)
  [![TypeScript](https://img.shields.io/badge/typescript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/tailwind-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
  ![License](https://img.shields.io/badge/license-MIT-green)

  **Stop wasting time on boilerplate. Start building features.**

  A Nuxt 4 starter template with an opinionated design system, reusable UI components, i18n, dark mode and pre-configured AI tooling. Clone it, initialise it for your project, and start building features on day one.

</div>

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

SB-Template Nuxt is designed to provide a solid and opinionated starting structure for building new web applications. It ships with a pre-configured design system (CSS custom properties + Tailwind v4 utilities), reusable UI components, i18n, dark/light theme, a notification system and layouts so that developers can focus on building features rather than scaffolding.

The template is meant to be cloned and initialised for a specific project (via the `init-project` prompt), progressively replacing placeholder pages and components with real ones while keeping the underlying conventions and tooling intact.

**Target audience:** Vue/Nuxt developers who want a clean, consistent foundation without bikeshedding on folder structure, naming conventions, or design tokens.

---

## 2. Getting Started

### Prerequisites

- **Node.js** ≥ 24.11.0
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

After cloning, run the `init-project` prompt in Copilot Agent mode (see [AI Tooling](#10-ai-tooling--prompts--instructions)) to rename the project, update all config files, reset the version to `1.0.0` and sync the instruction files.

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

---

## 3. Project Structure

This section shows the annotated directory tree. The project follows a feature-agnostic structure where each top-level folder has a single responsibility.

```
── nuxt.config.ts           ← Nuxt configuration (modules, SSR, runtimeConfig, routeRules, nitro, vite…)
── package.json             ← dependencies and npm scripts
── tsconfig.json            ← TypeScript config — extends .nuxt/tsconfig.app.json
── eslint.config.mjs        ← ESLint flat config (extends @nuxt/eslint, stylistic rules)
── .nvmrc                   ← pinned Node.js version (24.11.0)
── public/
     favicon.ico
     robots.txt
     sitemap.xml
     logo.webp
── i18n/
     locales/
       en.json              ← English translations (source of truth)
       it.json              ← Italian translations
── app/
     app.vue               ← root entry point (NuxtLayout + NuxtPage)
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
         rich-text/        BaseRichText.vue
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

The design system lives entirely in `app/assets/css/` and provides a single source of truth for colours, typography, spacing and transitions. **Never use hardcoded values** — always reference the design tokens.

### Colours — `--color-app-*`

All colours are CSS custom properties defined in `theme.css` inside an `@theme` block, auto-mapped to Tailwind utilities. Dark mode is handled via variable overrides inside `.dark` — **never use `dark:` Tailwind variants**.

| Token | Tailwind utility | Usage |
|---|---|---|
| `--color-app-main` | `bg-app-main` | Page background |
| `--color-app-surface` | `bg-app-surface` | Card / elevated surface |
| `--color-app-surface-2` | `bg-app-surface-2` | Nested surfaces, inputs |
| `--color-app-border` | `border-app-border` | Default borders |
| `--color-app-accent` | `bg-app-accent` / `text-app-accent` | Primary CTA, highlights |
| `--color-app-accent-hover` | `hover:bg-app-accent-hover` | Hover state of accent |
| `--color-app-accent-border` | `border-app-accent-border` | Border on accent elements |
| `--color-app-contrast` | `text-app-contrast` | Primary text |
| `--color-app-muted` | `text-app-muted` | Secondary / placeholder text |
| `--color-app-success/warning/error/info` | `text-app-success` etc. | Status colours |
| `--color-app-*-bg` | `bg-app-success-bg` etc. | Status background tints |

Tailwind opacity modifiers are allowed: `bg-app-main/80`, `text-app-muted/70`.

### Typography — `ty-app-*`

Custom `@utility` classes defined in `typography.css`. Apply them as regular Tailwind classes alongside spacing, colour and layout utilities.

| Class | Font | Usage |
|---|---|---|
| `ty-app-hero` | Poppins, uppercase | Full-bleed hero text |
| `ty-app-impact` | Poppins, uppercase | Large display headings |
| `ty-app-title-xl` | Poppins | Extra large titles (`text-4xl` → `text-7xl`) |
| `ty-app-title-lg` | Poppins | Large section titles (`text-3xl` → `text-6xl`) |
| `ty-app-title` | Poppins | Section titles (`text-2xl` → `text-4xl`) |
| `ty-app-subtitle-xl` | Inter semibold | Extra large sub-headings |
| `ty-app-subtitle-lg` | Inter semibold | Large sub-headings |
| `ty-app-subtitle` | Inter semibold | Sub-headings |
| `ty-app-paragraph` | Inter | Body text |
| `ty-app-label` | Inter, uppercase, tracked | Form labels, tags |
| `ty-app-btn-label` | Inter bold, uppercase | Button text |
| `ty-app-caption` | Inter italic | Captions, secondary notes |

```vue
<h1 class="ty-app-title text-app-contrast">Welcome</h1>
<p class="ty-app-paragraph text-app-muted">Some description.</p>
```

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

### i18n routing

The strategy is `prefix_except_default`: `/about` is English, `/it/about` is Italian. Use `localePath()` for all navigation links:

```vue
<NuxtLink :to="localePath('/about')">About</NuxtLink>
```

---

## 6. Layouts

Layouts live in `app/layouts/`. A page is wrapped in a layout automatically via `NuxtLayout` in `app.vue`.

### `default.vue`

The main layout used by all pages. Structure: `TheHeader` → `<slot>` (page content) → `TheFooter` → `TheNotificationBanner` + `TheNotificationBox`.

No props — all configuration is done at page level via `useHead()` and composables.

### `TheHeader`

Singleton top navigation bar. Renders the main nav links (`RouteItem[]` hardcoded in the component), the language switcher (`BaseIconMenu` with flag icons) and `TheThemeToggle`.

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
| `index.vue` | `/` | Homepage — full component showcase |

---

## 8. Components

All reusable components live in `app/components/`. Component names must describe **what the component is**, not where it is used. All components use design system tokens — never hardcoded values.

`Base` prefix: fully reusable, no business logic, no direct API calls.
`The` prefix: singletons used once per layout (TheHeader, TheFooter, etc.).

### `BaseButton`

Full-featured action button with variants, loading state and link support.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Visual style |
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

### `BaseDialog`

Modal dialog with size variants, scroll lock and focus trap.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `isOpen` | `boolean` | — | Required |
| `title` | `string` | — | Required |
| `subtitle` | `string` | `undefined` | |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'sm'` | |

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
| `selectedItemId` | `string \| null` | `null` | Highlighted item |

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

This repository ships with pre-configured [GitHub Copilot](https://github.com/features/copilot) context that makes the AI assistant aware of the project's conventions, design system and domain. All configuration lives under `.github/` and is versioned alongside the code.

### How GitHub Copilot is configured

| File / folder | Purpose |
|---|---|
| `.github/copilot-instructions.md` | Global rules: app context, response language, stack, naming conventions |
| `.github/instructions/*.instructions.md` | Scoped rules loaded automatically per file type (e.g. only for `**/*.vue` files) |
| `.github/prompts/*.prompt.md` | Reusable Agent-mode workflows triggered by a phrase or `#filename` syntax |

### Available prompts

| Prompt file | Trigger phrases | What it does |
|---|---|---|
| `init-project.prompt.md` | "Inizializziamo il progetto" · "Reset del progetto" | Collects project name and context; renames the app across all config files; resets version to `1.0.0`; audits and updates instruction files |
| `update-docs.prompt.md` | "Aggiorna la documentazione" · "Aggiorna il README" | Compares README with the actual codebase and rewrites it as a structured documentation book |
| `check-lint.prompt.md` | "Check del lint" · "Il progetto è pulito?" | Runs `eslint --fix`, reports remaining warnings and blocking errors |
| `check-build.prompt.md` | "Check del build" · "Il progetto builda?" | Runs `nuxt typecheck` + `nuxt build`, reports type and build errors |
| `bump-version.prompt.md` | "Aggiornami il progetto alla versione X.Y.Z" | Detects changes via git, shows a CHANGELOG draft for approval, then updates `package.json` version, `CHANGELOG.md` and README badges |
| `check-dependencies.prompt.md` | "Verifichiamo le dipendenze" · "Aggiorna le dipendenze" | Checks outdated packages, auto-updates safe minor/patch bumps, reports major bumps with changelog links, runs `npm audit` + `npm audit fix`, delivers a full vulnerability report |
| `check-gsc.prompt.md` | "Check GSC" · "Verifica la SEO" · "Il progetto è pronto per GSC?" | Validates `sitemap.xml`, `robots.txt`, global meta tags in `nuxt.config.ts`, and per-page `useHead`/`useSeoMeta` calls across all pages |
| `full-checkup.prompt.md` | "Checkup completo" · "Full checkup" · "Controlla tutto" | Orchestrates all four checks (dependencies, SEO, build, lint) in sequence; auto-proposes a version bump based on findings; optionally updates documentation |

### How to run a prompt

**Option A — Trigger phrase**

1. Open the **Copilot Chat** panel in VS Code
2. Switch to **Agent mode**
3. Type one of the trigger phrases from the table above

**Option B — Direct invocation**

1. Open **Copilot Chat** in **Agent mode**
2. Type `#` followed by the prompt filename (e.g. `#init-project.prompt.md`) and select it from the picker
3. Send the message

> All prompts require **Agent mode**. They will not work in Ask or Chat mode.

### Instruction files

| File | Applies to | Governs |
|---|---|---|
| `design-system.instructions.md` | `**/*.vue` | CSS tokens, colours, typography, utilities, animations, icons |
| `components.instructions.md` | `**/components/**` | Full API catalogue for all `Base*` + `The*` components, creation rules |
| `pages-layouts.instructions.md` | `**/pages/**`, `**/layouts/**` | Nuxt 4 file-based routing, page template, SEO, i18n, data fetching |
| `composables-utils.instructions.md` | `**/composables/**` | Available composables, utils, global TypeScript types, SSR-safe patterns |
| `project-config.instructions.md` | `nuxt.config.ts`, `package.json` | Complete `nuxt.config.ts` key reference, scripts, dependencies, env vars |

---

## 11. Deployment

### Netlify (default)

This template is pre-configured for Netlify. The Nitro preset is set to `netlify` in `nuxt.config.ts`.

```bash
npm run build
```

Connect your GitHub repository to Netlify with:
- **Build command:** `npm run build`
- **Publish directory:** `.output/public`

Add environment variables under **Site settings → Environment variables**.

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

Create a `.env` file at the project root. All client-side variables must be prefixed with `NUXT_PUBLIC_`:

```env
NUXT_PUBLIC_API_URL=https://api.yoursite.com
```

Access them in your app via `useRuntimeConfig()`. Declare public vars in `nuxt.config.ts → runtimeConfig.public`.

---

## 12. Versioning

The project uses manual versioning via `package.json` and maintains a `CHANGELOG.md` following the [Keep a Changelog](https://keepachangelog.com) convention with Semantic Versioning.

### Workflow — from bump to tag

```bash
# 1. Update the version in package.json manually or via npm
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

# 2. Update CHANGELOG.md with the new release section

# 3. Stage and commit
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 1.0.1"

# 4. Create an annotated tag
git tag -a "v1.0.1" -m "Release v1.0.1"

# 5. Push commit and tag
git push origin main
git push origin v1.0.1
```

### Using the `bump-version` prompt

The `bump-version` Copilot Agent prompt automates steps 1–5: it detects changes via `git log`, generates a CHANGELOG draft for approval, updates `package.json`, `CHANGELOG.md` and README badges, then creates the commit and tag. See [AI Tooling](#10-ai-tooling--prompts--instructions) for usage.

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
| `@nuxtjs/i18n` | ^10.x | Multi-language support |
| `@nuxtjs/color-mode` | ^4.x | Dark/light theme |
| `@vueuse/nuxt` | ^14.x | Vue composition utilities |
| `@floating-ui/vue` | ^1.x | Floating element positioning |
| `isomorphic-dompurify` | ^3.x | XSS-safe HTML sanitisation |
| `@iconify-json/lucide` *(dev)* | ^1.x | Lucide icon set |
| `@iconify-json/flagpack` *(dev)* | ^1.x | Flag icon set |
| `@nuxt/eslint` *(dev)* | ^1.x | ESLint + stylistic rules |
| `@types/node` *(dev)* | ^25.x | Node.js type definitions |

---

<div align="center">

Built with ❤️ by **Stefano Biddau**

[stefanobiddau.com](https://stefanobiddau.com) · [@stefanoBid](https://github.com/stefanoBid)

</div>
