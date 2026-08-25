# CLAUDE.md — sb-template-nuxt

Nuxt 4 GitHub repository template. Production-ready SSR starting point with design system (CSS custom properties + Tailwind v4), base components, i18n, dark/light theme, notification system.

This file is the **single source of AI context** for the project. It replaces the former `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` and `.github/prompts/*.prompt.md` files — all their content has been merged here and those files have been removed.

---

## App context

*(Placeholder — filled in by the "initialize project" workflow below with 2–4 sentences describing what the app does and who it's for. Until then, treat this as a generic template with no specific product context.)*

---

## Stack

- **Nuxt 4** (Vue 3, `<script setup>`, SSR enabled)
- **Tailwind CSS v4** via `@tailwindcss/vite` — no config file, tokens in CSS `@theme`
- **@nuxt/icon** — Iconify SVG mode (`lucide` + `flagpack`)
- **@nuxt/image** — `ipx` local provider (Cloudinary provider can be added via `image.providers.cloudinary`; `provider="none"` is pre-registered for arbitrary external URLs, e.g. CMS media)
- **@nuxt/fonts** — self-hosted Poppins/Inter, explicitly declared in `fonts.families` (not auto-detected, since the family names only appear inside CSS custom properties in `theme.css`)
- **@nuxtjs/i18n** — `en` default, `it` secondary; `prefix_except_default`
- **@nuxtjs/color-mode** — dark/light via `.dark` class on `<html>`
- **@vueuse/nuxt**, **@floating-ui/vue**, **isomorphic-dompurify**
- **ESLint** with `@nuxt/eslint`, **TypeScript** strict mode
- Deployment target: **Netlify** (Nitro preset)

---

## npm install policy

> **On `main` branch: `npm ci` only. Never `npm install`.**

- `npm ci` installs exactly as pinned, never mutates `package-lock.json`
- `npm install` allowed on feature/fix/develop branches
- Use `npm run si` when unsure — auto-detects branch
- `package.json` pins `esbuild` via `overrides` (`^0.28.0`) to keep a single version across the tree — `@intlify/bundle-utils` depends on an older `esbuild` range than `vite@8` requires, which otherwise breaks strict peer resolution. Update the override's range together whenever `vite` or `@nuxtjs/i18n` bump their `esbuild` requirement.

---

## Project structure

Standard Nuxt 4 layout (`app/` source directory: `assets`, `components/base|the-*`, `composables`, `layouts`, `pages`, `plugins`, `types`, `utils`, plus `app.config.ts` at its root) and a top-level `server/routes/` for Nitro server routes (e.g. `robots.txt.ts`), alongside root-level config files and `i18n/locales/`. Explore with `ls`/`find` — the naming conventions below explain how new files should be named.

`app/app.config.ts` holds public, build-time, non-secret branding config (`site.*` — name, title template, theme colour, OG/Twitter image; `social.*` — email, phone, social links) consumed via `useAppConfig()`. It's distinct from `runtimeConfig` in `nuxt.config.ts`: `app.config.ts` values aren't overridable by environment variables and are meant to change rarely, while `runtimeConfig.public.*` is for values that vary per deploy (see `.env.example`).

---

## Naming conventions

| Element | Style | Example |
|---|---|---|
| Directory | kebab-case | `my-feature/` |
| Vue file | PascalCase + prefix | `BaseButton.vue`, `TheHeader.vue` |
| Composable file | camelCase + `use` | `useAppNotifications.ts` |
| Utility / type file | camelCase | `generateUuid.ts` |
| CSS utility | `ty-app-*` / `u-app-*` | `ty-app-title`, `u-app-soft-transition` |
| CSS variable | `--color-app-*`, `--font-app-*` | `--color-app-accent` |

- `Base` prefix: fully reusable, no business logic, no API calls
- `The` prefix: singletons used once per layout

---

## Code conventions

### Vue & Nuxt 4

- All hardcoded strings and code comments in **English**
- `<script setup lang="ts">` — no Options API, no `defineComponent`
- Nuxt auto-imports: composables, utils, components, Vue APIs, Nuxt composables — no manual imports
- `useRuntimeConfig()` for env vars — never `process.env` in components
- Data fetching: `useFetch` / `useAsyncData` over `$fetch` in components
- Server-only logic goes in `server/` (Nitro); never import server utilities in client components
- `<ClientOnly>` for browser-only components

### `<script setup>` structure

Always in this order, omit unused sections:

```ts
// Dependencies      ← composables destructured at top
// Input / Output    ← props, model, emit
// Data              ← refs, reactive state, computed
// Events            ← handler functions
```

### Props

```ts
interface MyComponentProps {
  title: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<MyComponentProps>(), {
  subtitle: undefined,
  size: 'sm',
})
```

Define a typed inline interface first, then pass it to `withDefaults`. Only list props that have a non-required default.

### defineModel

```ts
const model = defineModel<string>('input')
```

Always provide the model name string and the generic type.

### defineEmits — call-signature syntax

```ts
const emit = defineEmits<{
  (e: 'close', value: false): void
  (e: 'select', item: MyItem): void
}>()
```

Use the call-signature syntax inside the generic, not the object/tuple syntax.

### Function naming

| Category | Prefix | Examples |
|---|---|---|
| Event handlers / watchers | `on` | `onClose`, `onKeydown` |
| Internal helpers | `_` | `_buildPayload`, `_resetState` |
| General utilities | free | `fetchData`, `resetForm` |

### TypeScript

- Strict mode on — no `any`, use `unknown` + narrow
- `interface` for object shapes; `type` for unions/utility types
- Global interfaces in `app/types/global.d.ts` — never inline in components
- Always type composable return values explicitly

### Styling

- Default: inline Tailwind utilities in template — no custom CSS classes unless requested
- Colours: `text-app-contrast`, `bg-app-surface`, `border-app-border` (from `--color-app-*`)
- Typography: `ty-app-title`, `ty-app-paragraph`, etc.
- Transitions: `u-app-soft-transition` (200ms), `u-app-hard-transition` (500ms)
- Focus: `u-app-focus`, `u-app-focus-within`
- **No `dark:` Tailwind variants** — dark mode via CSS variables only
- **No `<style>` blocks** unless explicitly requested
- Dynamic classes: `:class` array/object bindings — never string concatenation

### Icons

```vue
<Icon name="lucide:arrow-right" class="size-5 text-app-accent" />
<Icon name="flagpack:it" class="size-5" />
```

Collection prefix mandatory. Available collections: `lucide` (UI icons), `flagpack` (country flags). Size via Tailwind (`size-4`, `size-5`…), colour via token. Always `aria-label` on icon-only buttons.

### Accessibility

- `aria-label` on all icon-only interactive elements
- `aria-describedby` for form hints/errors; `aria-invalid` on inputs with errors

### i18n — absolute rule

> **Never hardcode strings in Vue templates or scripts. No exceptions.**

```ts
// In <script setup>
const { t } = useI18n()

// In template
$t('key')
```

Always add keys to **both** `i18n/locales/en.json` and `i18n/locales/it.json` simultaneously.

### ESLint

No semicolons · single quotes · trailing commas · 2-space indent · `vue/attributes-order: alphabetical` · max 3 attributes per line (1 per line when multiline) · `no-console: warn` (error in production) · `no-debugger: error`.

**Never silence an issue with `// eslint-disable` comments.** Fix the underlying code instead.

---

## Design system

### Colours (`--color-app-*`)

All colours are CSS custom properties defined in `app/assets/css/theme.css` inside an `@theme` block and auto-mapped to Tailwind utilities. **Never hardcode raw hex values.**

| Token | Tailwind utility | Usage |
|---|---|---|
| `--color-app-main` | `bg-app-main` | Page background |
| `--color-app-surface` | `bg-app-surface` | Card / elevated surface |
| `--color-app-surface-2` | `bg-app-surface-2` | Nested surfaces, inputs |
| `--color-app-border` | `border-app-border` | Default borders |
| `--color-app-shadow` | `shadow-[0_4px_20px_var(--color-app-shadow)]` | Shadows via `var()` |
| `--color-app-accent` | `bg-app-accent` / `text-app-accent` | Primary CTA |
| `--color-app-accent-hover` | `hover:bg-app-accent-hover` | Hover on accent |
| `--color-app-accent-border` | `border-app-accent-border` | Accent borders |
| `--color-app-contrast` | `text-app-contrast` | Primary text |
| `--color-app-muted` | `text-app-muted` | Secondary / placeholder text |
| `--color-app-success/warning/error/info` | `text-app-*` / `bg-app-*` | Status colours |
| `--color-app-*-bg` | `bg-app-*-bg` | Status background tints |

Opacity modifiers allowed: `bg-app-main/80`, `text-app-muted/70`.

Dark mode: handled via CSS variable overrides in `.dark` class — never use `dark:` variants.

### Typography (`ty-app-*`)

| Class | Font | Usage |
|---|---|---|
| `ty-app-hero` | Poppins, uppercase | Full-bleed hero |
| `ty-app-impact` | Poppins, uppercase | Large display headings |
| `ty-app-title` | Poppins | Section titles (responsive `text-2xl`→`text-4xl`) |
| `ty-app-title-lg` | Poppins | Large titles (`text-3xl`→`text-6xl`) |
| `ty-app-title-xl` | Poppins | Extra large titles (`text-4xl`→`text-7xl`) |
| `ty-app-subtitle` | Inter semibold | Sub-headings (`text-base`→`text-xl`) |
| `ty-app-subtitle-lg` | Inter semibold | Large sub-headings (`text-lg`→`text-2xl`) |
| `ty-app-subtitle-xl` | Inter semibold | Extra large sub-headings (`text-xl`→`text-3xl`) |
| `ty-app-paragraph` | Inter | Body text (`text-sm`→`text-lg`) |
| `ty-app-label` | Inter uppercase tracked | Form labels, tags |
| `ty-app-btn-label` | Inter bold uppercase | Button text |
| `ty-app-caption` | Inter italic | Captions, secondary notes |

Font families: `font-app-primary` (Poppins), `font-app-secondary` (Inter).

### Utility classes (`u-app-*`)

| Class | Effect |
|---|---|
| `u-app-soft-transition` | `transition-all duration-200 ease-in-out` |
| `u-app-hard-transition` | `transition-all duration-500 ease-in-out` |
| `u-app-focus` | `outline-none ring-app-contrast focus-visible:ring-2` |
| `u-app-focus-within` | `outline-none ring-app-contrast focus-within:ring-2` |
| `u-app-no-focus` | Removes all focus outlines (only on elements with custom focus handling) |

Always add `u-app-soft-transition` to interactive and themed elements.

### Animations (Vue `<Transition>`)

| Name | Effect | Duration |
|---|---|---|
| `fade` | Opacity + slight Y offset | 800ms |
| `slide-down` | Opacity + slides from top | 200ms |
| `scale-fade` | Opacity + scale from 0.95 | 200ms |

```vue
<Transition name="scale-fade">
  <div v-if="isOpen">...</div>
</Transition>
```

---

## Component API catalogue

### `BaseButton`

| Prop | Type | Default |
|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` |
| `type` | `'button' \| 'submit' \| 'reset' \| 'link'` | `'button'` |
| `to` | `string` | `undefined` |
| `ariaLabel` | `string` | `undefined` |
| `isDisabled` | `boolean` | `false` |
| `isLoading` | `boolean` | `false` |

Slot: `default`. `type='link'` renders `<a target="_blank">`.

### `BaseCard`

| Prop | Type | Default |
|---|---|---|
| `title` | `string` | `undefined` |
| `subtitle` | `string` | `undefined` |
| `paragraph` | `string` | `undefined` |
| `variant` | `'dark' \| 'dark-hover' \| 'light' \| 'light-hover'` | `'light'` |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` |
| `fullCustomContent` | `boolean` | `false` |

Slots: `default`, `card-header`, `card-body`, `card-footer`.

### `BaseInput`

| Prop | Type | Default |
|---|---|---|
| `id` | `string` | required |
| `name` | `string` | `undefined` (falls back to `${id}-name`) |
| `label` | `string` | `undefined` |
| `placeholder` | `string` | `'Insert a value...'` |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'search' \| 'tel' \| 'url'` | `'text'` |
| `hint` | `string` | `undefined` |
| `error` | `string \| null` | `null` |
| `autocomplete` | `string` | `'off'` |
| `prefixIcon` | `string` | `undefined` |

Model: `defineModel<string>('input')`.

### `BaseTextarea`

| Prop | Type | Default |
|---|---|---|
| `id` | `string` | required |
| `name` | `string` | `undefined` |
| `label` | `string` | `undefined` |
| `placeholder` | `string` | `'Insert a value...'` |
| `hint` | `string` | `undefined` |
| `error` | `string \| null` | `null` |
| `maxLength` | `number` | `undefined` |

Model: `defineModel<string>('input')`. Shows a character counter when `maxLength` is set.

### `BaseCheckbox`

| Prop | Type | Default |
|---|---|---|
| `id` | `string` | required |
| `name` | `string` | `undefined` |
| `label` | `string` | `undefined` |
| `error` | `string \| null` | `null` |

Model: `defineModel<boolean>('input')`. Slot: `default` (custom label).

### `BaseCombobox`

Generic (`<script setup lang="ts" generic="T">`).

| Prop | Type | Default |
|---|---|---|
| `id` | `string` | required |
| `type` | `'single' \| 'multiple'` | `'single'` |
| `items` | `{ label: string, value: T }[]` | required |
| `name` | `string` | `undefined` |
| `label` | `string` | `undefined` |
| `placeholder` | `string` | `'Insert a value...'` |
| `hint` | `string` | `undefined` |
| `error` | `string \| null` | `null` |
| `prefixIcon` | `string` | `undefined` |

Model: `defineModel<T[]>('input', { default: () => [] })`.

### `BaseChip`

| Prop | Type | Default |
|---|---|---|
| `text` | `string` | required |
| `icon` | `string` | `undefined` |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` |
| `clickable` | `boolean` | `false` |
| `linkable` | `{ href: string, target?: string, rel?: string }` | `undefined` |

Emits: `chip-click` (when `clickable: true`).

### `BaseDialog`

| Prop | Type | Default |
|---|---|---|
| `isOpen` | `boolean` | required |
| `title` | `string` | required |
| `subtitle` | `string` | `undefined` |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'sm'` |

Emits: `(e: 'close', value: false): void`. Slots: `default`, `header`, `footer`.
Closes on `Escape`, locks scroll, traps focus, uses `<Teleport to="body">`.

### `BaseAccordion`

| Prop | Type | Default |
|---|---|---|
| `id` | `string` | required |
| `title` | `string` | required |
| `icon` | `string` | `undefined` |
| `isOpen` | `boolean` | `undefined` |

Emits: `toggle` (when `isOpen` controlled externally). Slot: `default`.

### `BaseIconButton`

| Prop | Type | Default |
|---|---|---|
| `icon` | `string` | required |
| `ariaLabel` | `string` | `undefined` |
| `isActive` | `boolean` | `false` |

Emits: `(e: 'click'): void`.

### `BaseIconMenu`

| Prop | Type | Default |
|---|---|---|
| `icon` | `string` | required |
| `items` | `MenuItem[]` | required |
| `selectedItemId` | `string \| null` | `null` |

Emits: `(e: 'select', itemId: string): void`. Uses `useFloatingUi` with `placement: 'bottom-start'`.

### `BaseCloseButton`

No props. Emits: `(e: 'close', value: false): void`. Renders `lucide:x` icon button.

### `BaseMediaCarousel`

| Prop | Type |
|---|---|
| `items` | `MediaItem[]` |

`MediaItem`: `{ type: 'photo' | 'video', url: string, alternativeText?, caption?, previewUrl?, width?, height? }`. Auto-plays, pauses on video playback.

### `BaseRichText`

| Prop | Type |
|---|---|
| `blocks` | `RichBlock[]` |

Converts `RichBlock[]` → sanitised HTML via `blocksToHtml` + `useSanitize`. Never write `v-html` directly — always go through this component.

### `TheHeader`

| Prop | Type |
|---|---|
| `routes` | `RouteItem[]` |
| `langs` | `MenuItem[]` |
| `selectedLangId` | `string \| null` |

Emits: `(e: 'change-lang', langCode: string): void`.

### `TheHeaderMenuToggle`

| Prop | Type |
|---|---|
| `open` | `boolean` |

Emits: `(e: 'toggle', newOpenValue: boolean): void`.

### `TheFooter`

| Prop | Type |
|---|---|
| `email` | `string` |
| `phone` | `string` |
| `githubUrl` | `string` |
| `instagramUrl` | `string` |
| `linkedinUrl` | `string` |
| `quickLinks` | `RouteItem[]` |

### `TheNotificationBanner`

Driven by `useAppNotifications`. Do not instantiate manually — managed by `default.vue`.

### `TheThemeToggle`

No props. Toggles dark/light mode via `@nuxtjs/color-mode`.

### `TheNotificationBox`

No props. Fixed-position wrapper (`<div class="fixed ...">` with a `default` slot) used alongside `TheNotificationBanner` in `default.vue`.

### Creating a new component

1. Create a folder in `app/components/base/` using kebab-case: `app/components/base/my-widget/`
2. Create the file using PascalCase + prefix: `BaseMyWidget.vue`
3. Structure `<script setup>` with the standard section order (Dependencies / Input-Output / Data / Events)
4. `<script setup lang="ts">` only — no Options API
5. Props: inline interface + `withDefaults`, only defaults for non-required props
6. Use design system tokens for all styling — no raw hex values, no hardcoded sizes
7. Add `u-app-soft-transition` to themed/interactive elements
8. For a heavy or below-the-fold component used conditionally in a real page (not the `index.vue` showcase, which intentionally renders every component at once), prefer Nuxt's `Lazy` prefix (`<LazyBaseDialog v-if="isOpen" />`) or `hydrate-on-visible` to defer loading/hydration instead of bundling it into the initial page chunk

---

## Composables

### `useAppNotifications()`

```ts
const { notifications, removeNotification, clearNotifications, success, warning, error, info } = useAppNotifications()

info({
  title: 'Title',
  message: 'Message text',    // required
  icon: 'lucide:bell',        // optional
  dismissible: true,          // optional
  autoClose: true,            // optional
  duration: 5000,             // optional, ms
})
```

Methods: `success()`, `warning()`, `error()`, `info()` — all accept `Omit<NotificationItem, 'type' | 'id'>`.
`notifications` is `ComputedRef<NotificationItem[]>`. State is shared across the app via `useState`.
Must be called client-side only (`import.meta.client`) — composable guards internally.

### `useFloatingUi(config?)`

```ts
const { reference, floating, floatingStyles, open, toggleFloating } = useFloatingUi({
  placement: 'bottom-start',  // default
  offset: 8,
  strategy: 'absolute',
})
```

`reference` / `floating` bind via `ref` on the trigger/panel elements. `floatingStyles` binds to `:style` on the floating panel.

### `useLockScroll()`

```ts
const { lock, unlock, isLocked } = useLockScroll()
lock()   // adds app-scroll-locked to <html>
unlock() // removes (only when no other owner holds lock)
```

SSR-safe, multi-caller safe (each instance holds its own owner ID). `isLocked: ComputedRef<boolean>`.

### `useSanitize()`

```ts
const { sanitizeHtml } = useSanitize()
const clean = sanitizeHtml(dirtyHtml)
```

Client: full DOMPurify sanitisation with an allowlist of safe tags/attributes. Server: skips DOMPurify (content trusted from CMS), converts `\n` → `<br>`.
Use only via `BaseRichText` — never write `v-html` directly with unsanitised content.

### Writing new composables

1. File in `app/composables/`, named `useSomething.ts`
2. Export default function named `useSomething`
3. Always type return values explicitly
4. `useState` for global state, `ref`/`computed` for local
5. Guard DOM access with `if (!import.meta.client) return`
6. Private helpers use `_` prefix

```ts
export default function useMyFeature() {
  // Internal state
  const _cache = ref<Map<string, string>>(new Map())

  // State (public)
  const items = computed(() => [..._cache.value.values()])

  // Methods
  function add(key: string, value: string) {
    _cache.value.set(key, value)
  }

  return { items, add }
}
```

---

## Utils

- `generateUuid(): string` — random UUID v4. Used internally by `useAppNotifications` and `useLockScroll`.
- `blocksToHtml(blocks: RichBlock[]): string` — Strapi rich text → HTML; pair with `sanitizeHtml` before `v-html`.

---

## Global TypeScript types (`app/types/global.d.ts`)

All globally declared — no import needed. See the file for the current type list (`MenuItem`, `RouteItem`, `NotificationItem`, `RichBlock*`).

New shared types go in `global.d.ts` inside `declare global {}` — never inline in components.

---

## Pages & layouts

### File-name → URL mapping

Standard Nuxt 4 file-based routing (`app/pages/`) — dynamic `[param]`, optional `[[param]]`, catch-all `[...slug]`, ignored `(group)` folders, nested index routes. Named routes for `localePath()` are generated from the file path (e.g. `blog/[slug].vue` → `blog-slug`).

### Creating a new page

1. Create the `.vue` file inside `app/pages/` following the naming rules above
2. Add `useHead()` with translated meta tags
3. Add translation keys to both `i18n/locales/en.json` and `i18n/locales/it.json`
4. If the page should be statically generated, add a `routeRules` entry in `nuxt.config.ts`

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

// Data

// Events
</script>

<template>
  <!-- page content -->
</template>
```

For multi-locale head (html `lang`, canonical, alternate links) use `useLocaleHead()` — already handled in `app/layouts/default.vue`.

### i18n routing

```ts
const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()

localePath('index')   // '/' (en) or '/it' (it)
localePath('about')   // '/about' or '/it/about'
```

Strategy: `prefix_except_default` — `en` no prefix, `it` uses `/it/...`.

### Data fetching

```ts
// Simple
const { data, status, error } = await useFetch<MyType>('/api/endpoint')

// With key
const { data } = await useAsyncData('unique-key', () =>
  $fetch<MyType>('/api/endpoint', { query: { id: route.params.id } }),
)
```

`useFetch` for straightforward calls, `useAsyncData` when a stable key or custom logic is needed. `$fetch` only inside server routes or event handlers.

### Layout system

Default layout (`app/layouts/default.vue`): TheHeader (sticky `h-16`) + `<main>` (`pt-16 px-6 md:px-10`, `max-w-350`) + TheFooter + notifications.

Override on a page:
```vue
<script setup>
definePageMeta({ layout: 'custom-layout-name' })
</script>
```

To create a new layout, add `app/layouts/my-layout.vue` and expose a `<slot>`.

### Route rules (rendering mode)

```ts
routeRules: {
  '/': { isr: 3600 },    // incremental static regen, refreshes without a redeploy
  '/it': { isr: 3600 },
  // omit = SSR (default)
  // { prerender: true } = fully static at build time — only once content is truly frozen
  // { ssr: false } = SPA
}
```

For dynamic routes with static content (e.g. `/blog/[slug]`), use `nuxt generate` + prerender hooks instead of `prerender: true` on a wildcard.

---

## nuxt.config.ts reference

The single source of truth for the entire Nuxt application setup — never duplicate configuration across files. Its own header comment block documents every section and the rationale behind non-obvious choices (sourcemaps disabled for security, `isomorphic-dompurify` excluded from the server bundle, `detectBrowserLanguage: false` being intentional, etc.) — read it directly rather than this file, which will drift out of sync with it over time.

Environment profiles use Nuxt's native `$development`/`$production` keys (activated by `NODE_ENV`, or explicitly via `nuxt build --envName <name>`) instead of scattered `process.env.NODE_ENV` checks — currently only `devtools.enabled` differs between them. Key order inside `defineNuxtConfig({...})` is enforced by `nuxt/nuxt-config-keys-order` (part of the `@nuxt/eslint` config) — run `npm run lint:fix` after adding a new top-level key rather than guessing its position.

Brand-specific values (site name, theme colour, OG/Twitter image, social links) live in `app/app.config.ts`, not here — `nuxt.config.ts`'s `app.head` only carries structural meta (viewport, favicon, `og:type`, `twitter:card`).

A `hooks['build:before']` guard fails a Netlify production build (`process.env.CONTEXT === 'production'`) if `NUXT_PUBLIC_SITE_URL` is missing or still the template placeholder — see `.env.example`.

`tsconfig.json` is fully delegated to the auto-generated `.nuxt/tsconfig.*.json` references (strict mode, path aliases, Vue types) — never manually add `compilerOptions` there; run `nuxt prepare` to regenerate after changes.

---

## package.json scripts

Standard Nuxt/ESLint scripts (`dev`, `build`, `generate`, `preview`, `postinstall`, `lint`, `lint:fix`) — see `package.json`. Non-standard scripts:

| Script | Command |
|---|---|
| `si` | `bash scripts/safe-install.sh` — auto-detects branch, runs `npm ci` on `main` / `npm install` elsewhere |
| `analyze` | `nuxi analyze` — bundle size report, run when a component/dependency feels heavier than expected |

Node.js version: **24.19.0** (`.nvmrc`). Use `nvm use`.

Environment variables: copy `.env.example` to `.env` and fill in real values — every `NUXT_PUBLIC_*` var maps to `runtimeConfig.public.*`. Netlify build settings (build command, publish dir, Node version) are versioned in `netlify.toml` — update it, not just the Netlify dashboard, if the build changes.

### Dependencies

Keep this table in sync with `package.json` — versions drift, treat `package.json` as authoritative.

| Package | Purpose |
|---|---|
| `nuxt` | Core framework |
| `vue`, `vue-router` | UI framework / routing |
| `tailwindcss`, `@tailwindcss/vite` | Utility-first CSS (v4, Vite plugin) |
| `@nuxt/eslint` | ESLint integration |
| `@nuxt/icon` | Icon system |
| `@nuxt/image` | Image optimisation |
| `@nuxt/fonts` | Self-hosted web fonts |
| `@nuxtjs/i18n` | Internationalisation |
| `@nuxtjs/color-mode` | Dark/light mode |
| `@vueuse/core`, `@vueuse/nuxt` | Vue composition utilities |
| `@floating-ui/vue` | Floating element positioning |
| `isomorphic-dompurify` | HTML sanitisation (client-side) |
| `eslint` | Linter |
| `@iconify-json/lucide` *(dev)* | Lucide icon collection |
| `@iconify-json/flagpack` *(dev)* | Flag icon collection |
| `@types/node` *(dev)* | Node.js types |
| `typescript` *(dev)* | Explicit peer of `vue-tsc` — required, not auto-installed by npm's default peer resolution |
| `vue-tsc` *(dev)* | Powers `nuxt typecheck` — never remove |

---

## Workflows

Recurring maintenance/setup routines, each implemented as a skill under `.claude/skills/` — invoke by name or by the trigger phrases below (English or Italian both work):

| Skill | Trigger phrases |
|---|---|
| `init` | "initialize the project", "reset the project", "inizializza il progetto" |
| `docs-update` | "update the documentation", "update the README", "aggiorna la documentazione" |
| `full-checkup` | "full checkup", "run a full checkup", "checkup completo" |
| `build-check` | "check the build", "does the project build?", "check del build" |
| `lint-check` | "check the lint", "is the project clean?", "check del lint" |
| `dependency-check` | "check dependencies", "update dependencies", "verifichiamo le dipendenze" |
| `seo-check` | "check SEO", "check GSC readiness", "verifica la SEO" |

---

## Documentation sync rule

> Every change that creates a discrepancy with `README.md` must be followed by a documentation update in the same session.

Applies to: adding/removing/renaming components, pages, composables, utils, layouts, dependencies, `nuxt.config.ts` changes affecting documented config, structure changes, naming/convention changes.

Edit only the affected section — do not rewrite the full README unless asked.
