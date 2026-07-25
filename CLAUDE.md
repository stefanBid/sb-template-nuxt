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
- **@nuxt/image** — `ipx` local provider (Cloudinary provider can be added via `image.providers.cloudinary`)
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

---

## Project structure

```
── nuxt.config.ts
── package.json
── tsconfig.json
── eslint.config.mjs
── .nvmrc                   ← Node 24.11.0
── public/
     favicon.ico, robots.txt, sitemap.xml, logo.webp, example.jpg
── i18n/locales/
     en.json                ← source of truth
     it.json
── app/
     app.vue                ← NuxtLayout + NuxtPage
     error.vue
     assets/css/
       main.css             ← imports all CSS in cascade order
       theme.css            ← @theme: CSS vars + dark mode overrides
       typography.css       ← ty-app-* @utility classes
       utilities.css        ← u-app-* @utility classes
       animations.css       ← Vue transition classes
     components/
       base/
         accordion/         BaseAccordion.vue
         button/            BaseButton.vue
         card/              BaseCard.vue
         checkbox/          BaseCheckbox.vue
         chip/              BaseChip.vue
         close-button/      BaseCloseButton.vue
         combobox/          BaseCombobox.vue
         dialog/            BaseDialog.vue
         icon-button/       BaseIconButton.vue
         icon-menu/         BaseIconMenu.vue
         input/             BaseInput.vue
         media-carousel/    BaseMediaCarousel.vue
         rich-text/         BaseRichText.vue
         textarea/          BaseTextarea.vue
       the-footer/          TheFooter.vue
       the-header/          TheHeader.vue, TheHeaderMenuToggle.vue
       the-notification/    TheNotificationBanner.vue, TheNotificationBox.vue
       the-theme-toggle/    TheThemeToggle.vue
     composables/
       useAppNotifications.ts
       useFloatingUi.ts
       useLockScroll.ts
       useSanitize.ts
     layouts/
       default.vue          ← TheHeader + <slot> + TheFooter + notifications
     pages/
       index.vue
     plugins/
       scrollToTop.client.ts
     types/
       global.d.ts          ← MenuItem, RouteItem, NotificationItem, RichBlock*
     utils/
       blocksToHtml.ts
       generateUuid.ts
```

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
| `selectedLangId` | `string` |

Emits: `(e: 'change-lang', langCode: string): void`.

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

### Creating a new component

1. Create a folder in `app/components/base/` using kebab-case: `app/components/base/my-widget/`
2. Create the file using PascalCase + prefix: `BaseMyWidget.vue`
3. Structure `<script setup>` with the standard section order (Dependencies / Input-Output / Data / Events)
4. `<script setup lang="ts">` only — no Options API
5. Props: inline interface + `withDefaults`, only defaults for non-required props
6. Use design system tokens for all styling — no raw hex values, no hardcoded sizes
7. Add `u-app-soft-transition` to themed/interactive elements

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

All globally declared — no import needed.

```ts
interface MenuItem {
  code: string
  label: string
  iconType: 'nuxt-icon' | 'custom'
  icon: string
}

interface RouteItem {
  name: string
  path: string
  disabled?: true
}

interface NotificationItem {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  icon?: string | null
  title?: string | null
  message: string
  dismissible?: boolean
  autoClose?: boolean
  duration?: number
}

type RichBlock = RichBlockParagraph | RichBlockHeading | RichBlockList | RichBlockImage | RichBlockQuote | RichBlockCode | RichBlockDivider

// Leaf nodes
interface RichBlockText { type: 'text', text: string, bold?: boolean, italic?: boolean, underline?: boolean, strikethrough?: boolean, code?: boolean }
interface RichBlockLink { type: 'link', url: string, children: RichBlockText[] }
```

New shared types go in `global.d.ts` inside `declare global {}` — never inline in components.

---

## Pages & layouts

### File-name → URL mapping

| File | URL |
|---|---|
| `app/pages/index.vue` | `/` |
| `app/pages/about.vue` | `/about` |
| `app/pages/blog/index.vue` | `/blog` |
| `app/pages/blog/[slug].vue` | `/blog/:slug` |
| `app/pages/blog/[[slug]].vue` | `/blog` and `/blog/:slug` |
| `app/pages/[...slug].vue` | catch-all |
| `app/pages/(group)/page.vue` | `/page` (group ignored) |

Nested routes: a folder + `index.vue` creates a parent route; a folder + named file creates a child route (e.g. `account/index.vue` → `/account`, `account/settings.vue` → `/account/settings`).

Named routes (generated from file path, used in `localePath()`): `index.vue` → `index`, `about.vue` → `about`, `blog/index.vue` → `blog`, `blog/[slug].vue` → `blog-slug`.

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
  '/': { prerender: true },    // static
  '/it': { prerender: true },
  // omit = SSR (default)
  // { isr: 60 } = ISR
  // { ssr: false } = SPA
}
```

For dynamic routes with static content (e.g. `/blog/[slug]`), use `nuxt generate` + prerender hooks instead of `prerender: true` on a wildcard.

---

## nuxt.config.ts reference

The single source of truth for the entire Nuxt application setup. Every key has a specific purpose — never duplicate configuration across files.

### `modules`

```ts
modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@nuxtjs/i18n', '@nuxtjs/color-mode', '@vueuse/nuxt']
```

Add new Nuxt modules here. Order matters — modules initialise in sequence.

### `ssr: true` — never disable

This template is designed for server-side rendering.

### `devtools`

```ts
devtools: { enabled: process.env.NODE_ENV !== 'production' }
```

Active only in development. Do not change.

### `app.head`

Global HTML head applied to all pages; page-level `useHead()` calls merge with and override these values.

| Meta | Value | Purpose |
|---|---|---|
| `viewport` | `width=device-width, initial-scale=1` | Mobile responsiveness |
| `format-detection` | `telephone=no` | Disable iOS phone number detection |
| `theme-color` | `#0f0f20` | Mobile browser bar colour |
| `og:type` | `website` | Open Graph type |
| `og:site_name` | placeholder — replace with real site name |
| `og:image` | placeholder — replace with real OG image (1200×630px) |
| `twitter:card` | `summary` (switch to `summary_large_image` for wide cards) |
| `twitter:image` | placeholder — replace with real Twitter image |
| `link[favicon]` | `/favicon.ico` |

Replace all placeholder values before going to production.

### `css`

```ts
css: ['./app/assets/css/main.css']
```

Single entry point. `main.css` imports the full cascade in order: Tailwind → `theme.css` → `typography.css` → `utilities.css` → `animations.css` → global `html`/`body` styles. **Never add more entries here** — import inside `main.css` instead.

### `runtimeConfig`

```ts
runtimeConfig: {
  public: {
    siteUrl: 'https://www.yoursite.com',
  }
}
```

Keys under `public` are exposed to the client; keys at root level are server-only. Access via `useRuntimeConfig()` — never `process.env` in components.

Convention: `NUXT_PUBLIC_MY_VAR` in `.env` → auto-mapped to `runtimeConfig.public.myVar`.

### `routeRules`

Per-route rendering strategy — see [Route rules](#route-rules-rendering-mode) above.

### `sourcemap`

```ts
sourcemap: { client: false, server: false }
```

Disabled in all environments for security. Do not enable in production.

### `compatibilityDate`

```ts
compatibilityDate: '2025-07-15'
```

Locks Nuxt behaviour to a specific feature snapshot. Update only intentionally when upgrading Nuxt.

### `nitro`

```ts
nitro: {
  preset: 'netlify',
  externals: { external: ['isomorphic-dompurify'] }
}
```

`preset: 'netlify'` — deployment target, change to `'vercel'`, `'node-server'`, etc. when deploying elsewhere. `isomorphic-dompurify` is excluded from the server bundle because it requires `jsdom`, incompatible with the Netlify serverless runtime — it's used client-side only.

### `vite`

```ts
vite: { plugins: [tailwindcss()] }
```

No `tailwind.config.js` — all tokens in `theme.css` via `@theme`.

### `eslint`

```ts
eslint: { config: { stylistic: true } }
```

Enables stylistic formatting rules via `@nuxt/eslint`. Full rule set in `eslint.config.mjs`.

### `i18n`

```ts
i18n: {
  baseUrl: 'https://www.yoursite.com',  // replace before going live
  strategy: 'prefix_except_default',
  defaultLocale: 'en',
  locales: [
    { code: 'en', iso: 'en-US', language: 'en-US', name: 'English', file: 'en.json' },
    { code: 'it', iso: 'it-IT', language: 'it-IT', name: 'Italiano', file: 'it.json' },
  ],
  langDir: 'locales/',
  detectBrowserLanguage: false,
}
```

`detectBrowserLanguage: false` is intentional — prevents unexpected redirects. To add a new locale: add an entry to `locales[]`, create `i18n/locales/<code>.json`, add the code to `setLocale` type hints in the codebase.

### `icon`

```ts
icon: {
  mode: 'svg',
  serverBundle: 'local',
  fallbackToApi: false,
  clientBundle: { scan: true, includeCustomCollections: true, sizeLimitKb: 256 }
}
```

`fallbackToApi: false` — only locally installed collections are used. To add a collection: `npm install @iconify-json/<name>`.

### `image`

```ts
image: {
  provider: 'ipx',
  domains: [],
  quality: 80,
  format: ['webp', 'avif', 'png'],
  screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }
}
```

Default provider is `ipx` (local). To use Cloudinary for remote images, add a `providers.cloudinary` block (`{ name: 'cloudinary', options: { baseURL: process.env.NUXT_PUBLIC_CLOUDINARY_BASE } }`) and pass `provider="cloudinary"` to `<NuxtImg>`. To allow images from an external domain (e.g. a CMS), add it to `domains[]`.

### `tsconfig.json`

```json
{
  "files": [],
  "references": [
    { "path": "./.nuxt/tsconfig.app.json" },
    { "path": "./.nuxt/tsconfig.server.json" }
  ]
}
```

Fully delegated to the auto-generated `.nuxt/tsconfig.app.json` (strict mode, path aliases, Vue types). Never manually add `compilerOptions` here unless for a very specific override — run `nuxt prepare` to regenerate after changes.

---

## package.json scripts

| Script | Command |
|---|---|
| `dev` | `nuxt dev` |
| `build` | `nuxt build` |
| `generate` | `nuxt generate` |
| `preview` | `nuxt preview` |
| `postinstall` | `nuxt prepare` |
| `lint` | `eslint .` |
| `lint:fix` | `eslint . --fix` |
| `si` | `bash scripts/safe-install.sh` — auto-detects branch, runs `npm ci` on `main` / `npm install` elsewhere |

Node.js version: **24.11.0** (`.nvmrc`). Use `nvm use`.

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
| `@nuxtjs/i18n` | Internationalisation |
| `@nuxtjs/color-mode` | Dark/light mode |
| `@vueuse/core`, `@vueuse/nuxt` | Vue composition utilities |
| `@floating-ui/vue` | Floating element positioning |
| `isomorphic-dompurify` | HTML sanitisation (client-side) |
| `eslint` | Linter |
| `@iconify-json/lucide` *(dev)* | Lucide icon collection |
| `@iconify-json/flagpack` *(dev)* | Flag icon collection |
| `@types/node` *(dev)* | Node.js types |
| `vue-tsc` *(dev)* | Powers `nuxt typecheck` — never remove |

---

## Workflows

These are recurring maintenance/setup routines carried over from the former `.github/prompts/*.prompt.md` files. They're not slash commands — just documented procedures to follow when the user asks for one of these things (any clearly equivalent phrasing works, English or Italian).

### Initialize / reset the project

Trigger: "initialize the project", "reset the project", "inizializza il progetto".

1. Ask the user (single batch): new project name; a 2–4 sentence app context (purpose + audience) to store in the [App context](#app-context) section above; any changes to the conventions in this file compared to the template defaults.
2. Update `package.json`: `name` (kebab-case of the project name), `description`.
3. Update `nuxt.config.ts`: `og:site_name` meta value.
4. Update `README.md`: main heading and tagline.
5. Reset `package.json` version to `1.0.0`; reset the version badge in `README.md` if present.
6. Reset `CHANGELOG.md` to a clean [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) skeleton with an `[Unreleased]` section and a `[1.0.0] - <today>` entry ("Initial release").
7. Analyse the `app/` directory (assets/css, components, composables, layouts, pages, types, utils) and check that every catalogue in this file (component API tables, composables list, design tokens, pages list, config reference) still matches reality. Report discrepancies briefly, then update this file to fix them — don't delete still-valid entries.
8. Report: app context saved, project renamed, files touched (with exact changes), and any inconsistency found but not auto-resolved.

### Update documentation

Trigger: "update the documentation", "update the README", "aggiorna la documentazione".

1. Read in parallel: `README.md`, `package.json`, `nuxt.config.ts`, this `CLAUDE.md`, the full `app/` directory (components, composables, pages, layouts), `i18n/locales/en.json`.
2. Compare the README against the actual codebase: outdated sections, missing sections (new components/composables/pages/conventions), incorrect versions, broken links. Report the differences briefly, then proceed without waiting for approval.
3. Rewrite `README.md` (English), keeping its existing 13-section structure (Overview, Getting Started, Project Structure, Design System, Routing, Layouts, Pages, Components, Composables & Utils, AI Tooling, Deployment, Versioning, Dependencies). Sections **AI Tooling** and **Deployment** are mandatory — always present. Don't invent information; mark unverifiable details as TBD.
4. Confirm what changed and note any TBD sections that need user input.

### Full project checkup

Trigger: "full checkup", "run a full checkup", "checkup completo".

Orchestrates the checks below in order and aggregates results — doesn't duplicate their logic:

1. Dependency check (below)
2. SEO/GSC readiness check (below)
3. Build & type check (below)
4. Lint check (below)
5. If there are blocking errors (build errors or lint errors that can't be auto-fixed): **stop**, report each blocker (file, rule/error type, description), and ask the user to fix them manually before re-running.
6. If no blockers: decide whether `README.md` needs updating (new/updated dependency, new component/page/composable/util, significant config change) and run the "Update documentation" workflow if so.
7. Final summary: dependencies, SEO, build, lint, docs status, overall result.

### Build & type check

Trigger: "check the build", "does the project build?", "check del build".

1. Run `npx nuxt typecheck` (requires `vue-tsc` as a dev dependency — never remove it). Collect every type error (file, line, error code, description).
2. Run `npm run build`. Collect every error (type: TypeScript / Vite / Nitro / Module not found / SSR / Other; file; message).
3. Categorise: **TypeScript errors** (may not block the build but indicate type-safety issues), **Build errors** (blocking — hard failures), **Build warnings** (non-blocking, worth reviewing).
4. Report each category concisely. On failure, suggest a fix direction without auto-applying it.

### Lint check

Trigger: "check the lint", "is the project clean?", "check del lint".

1. Run `npm run lint:fix`. Note which files were modified.
2. Run `npm run lint`. Categorise remaining diagnostics: **warnings** (non-blocking) and **errors** (blocking — do not auto-fix these, list them for manual review).
3. Never silence an issue with `// eslint-disable` — fix the code.
4. Report files auto-fixed, remaining warnings, remaining errors.

### Dependency check & update

Trigger: "check dependencies", "update dependencies", "verifichiamo le dipendenze".

This is a delicate process — never auto-update a package with a major version bump without verifying it won't break the project.

1. Read `package.json` for current `dependencies`/`devDependencies` and `engines.node`.
2. Run `npm outdated`. For each outdated package, note Current / Wanted / Latest.
3. Classify:
   - **Safe to auto-update**: Latest has the same major as the declared constraint (minor/patch only). Do a quick changelog/release-notes check first for new required config, renamed/removed APIs used in this project, or peer-dependency changes (especially `nuxt`, `vue`, `vite`) — if a concern surfaces, move it to "needs attention" even with the same major.
   - **Needs attention**: Latest has a different major, or the changelog check revealed a concern.
4. For safe updates, edit `package.json` directly (update the `^` constraint) — don't rely on `npm update` alone, it doesn't touch declared constraints. Then run `npm run si`.
5. Vulnerability check: `npm fund` (informational), `npm audit` (classify severity/package/via/fix-availability), `npm audit fix` (auto-resolve what's within semver range). **Never run `npm audit fix --force`** — it can silently introduce breaking major bumps. If a vulnerability needs `--force`, stop and report it (package, advisory, severity) for the user to decide. Re-run `npm audit` after fixing to confirm final state.
6. Report: auto-updated packages (old → new version), packages needing attention (with reason + changelog link), vulnerabilities resolved vs remaining (and whether the fix depends on this project or on upstream maintainers), funding notices.

### GSC / SEO readiness check

Trigger: "check SEO", "check GSC readiness", "verifica la SEO".

1. Read `nuxt.config.ts` for `i18n.baseUrl` (production domain), `routeRules` (prerendered vs SSR routes), `app.head.meta` (global defaults), and `i18n.locales` (codes + hreflang values).
2. Check `public/robots.txt`: `User-Agent: *`, `Allow: /`, a `Sitemap:` directive pointing at the production domain (not `localhost`), matching `i18n.baseUrl`.
3. Check `public/sitemap.xml`: valid XML with `urlset` + `xmlns:xhtml` namespaces, all `<loc>` URLs on the production domain, `<lastmod>`/`<changefreq>`/`<priority>` per URL, `<xhtml:link>` alternates for every locale, correct `x-default`, hreflang values matching `i18n.locales[].iso`, and all prerendered routes represented.
4. Check global meta tags aren't placeholders (`yourdomain.com`, `Your Site Name`, etc.) — flag any that still are.
5. Scan `app/pages/**/*.vue` for `useHead`/`useSeoMeta`: each page should set `title`, `description`/`ogDescription`, `ogTitle`, `ogImage`, all via `t()`/`$t()` (no hardcoded strings, no `TODO`/`…` placeholders). Flag pages with no head call at all — they inherit only global defaults.
6. Report per check (robots.txt, sitemap.xml, global meta, per-page table) plus a summary of blockers vs warnings vs OK.

---

## Documentation sync rule

> Every change that creates a discrepancy with `README.md` must be followed by a documentation update in the same session.

Applies to: adding/removing/renaming components, pages, composables, utils, layouts, dependencies, `nuxt.config.ts` changes affecting documented config, structure changes, naming/convention changes.

Edit only the affected section — do not rewrite the full README unless asked.
