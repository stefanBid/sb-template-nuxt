# CLAUDE.md — sb-template-nuxt

Nuxt 4 GitHub repository template. Production-ready SSR starting point with design system (CSS custom properties + Tailwind v4), base components, i18n, dark/light theme, notification system.

---

## Stack

- **Nuxt 4** (Vue 3, `<script setup>`, SSR enabled)
- **Tailwind CSS v4** via `@tailwindcss/vite` — no config file, tokens in CSS `@theme`
- **@nuxt/icon** — Iconify SVG mode (`lucide` + `flagpack`)
- **@nuxt/image** — `ipx` local + Cloudinary provider
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

### defineModel

```ts
const model = defineModel<string>('input')
```

### defineEmits — call-signature syntax

```ts
const emit = defineEmits<{
  (e: 'close', value: false): void
  (e: 'select', item: MyItem): void
}>()
```

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

Collection prefix mandatory. Always `aria-label` on icon-only buttons.

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

No semicolons · single quotes · trailing commas · 2-space indent · `vue/attributes-order: alphabetical` · max 3 attributes per line

---

## Design system

### Colours (`--color-app-*`)

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
| `u-app-no-focus` | Removes all focus outlines |

Always add `u-app-soft-transition` to interactive and themed elements.

### Animations (Vue `<Transition>`)

| Name | Effect | Duration |
|---|---|---|
| `fade` | Opacity + slight Y offset | 800ms |
| `slide-down` | Opacity + slides from top | 200ms |
| `scale-fade` | Opacity + scale from 0.95 | 200ms |

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
| `name` | `string` | `undefined` |
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

Model: `defineModel<string>('input')`.

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

`MediaItem`: `{ type: 'photo' | 'video', url: string, alternativeText?, caption?, previewUrl?, width?, height? }`.

### `BaseRichText`

| Prop | Type |
|---|---|
| `blocks` | `RichBlock[]` |

Converts `RichBlock[]` → sanitised HTML via `blocksToHtml` + `useSanitize`.

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

Driven by `useAppNotifications`. Do not instantiate manually.

### `TheThemeToggle`

No props. Toggles dark/light mode via `@nuxtjs/color-mode`.

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
`notifications` is `ComputedRef<NotificationItem[]>`.
Must be called client-side only (`import.meta.client`) — composable guards internally.

### `useFloatingUi(config?)`

```ts
const { reference, floating, floatingStyles, open, toggleFloating } = useFloatingUi({
  placement: 'bottom-start',  // default
  offset: 8,
  strategy: 'absolute',
})
```

### `useLockScroll()`

```ts
const { lock, unlock, isLocked } = useLockScroll()
lock()   // adds app-scroll-locked to <html>
unlock() // removes (only when no other owner holds lock)
```

SSR-safe. `isLocked: ComputedRef<boolean>`.

### `useSanitize()`

```ts
const { sanitizeHtml } = useSanitize()
const clean = sanitizeHtml(dirtyHtml)
```

Client: full DOMPurify. Server: skips DOMPurify, converts `\n` → `<br>`.
Use only via `BaseRichText` — never write `v-html` directly with unsanitised content.

### Writing new composables

1. File in `app/composables/`, named `useSomething.ts`
2. Export default function named `useSomething`
3. Always type return values explicitly
4. `useState` for global state, `ref`/`computed` for local
5. Guard DOM access with `if (!import.meta.client) return`
6. Private helpers use `_` prefix

---

## Utils

- `generateUuid(): string` — random UUID v4
- `blocksToHtml(blocks: RichBlock[]): string` — Strapi rich text → HTML; pair with `sanitizeHtml` before `v-html`

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

`$fetch` only inside server routes.

### Layout system

Default layout (`app/layouts/default.vue`): TheHeader (sticky `h-16`) + `<main>` (`pt-16 px-6 md:px-10`, `max-w-350`) + TheFooter + notifications.

Override on a page:
```vue
<script setup>
definePageMeta({ layout: 'custom-layout-name' })
</script>
```

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

---

## nuxt.config.ts reference

### `modules`

```ts
modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@nuxtjs/i18n', '@nuxtjs/color-mode', '@vueuse/nuxt']
```

### `ssr: true` — never disable

### `css`

```ts
css: ['./app/assets/css/main.css']
```

Never add more entries here — import inside `main.css`.

### `runtimeConfig`

```ts
runtimeConfig: {
  public: {
    apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  }
}
```

`NUXT_PUBLIC_MY_VAR` → auto-mapped to `runtimeConfig.public.myVar`.

### `nitro`

```ts
nitro: {
  preset: 'netlify',
  externals: { external: ['isomorphic-dompurify'] }
}
```

### `vite`

```ts
vite: { plugins: [tailwindcss()] }
```

No `tailwind.config.js` — all tokens in `theme.css` via `@theme`.

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

### `icon`

```ts
icon: {
  mode: 'svg',
  serverBundle: 'local',
  fallbackToApi: false,
  clientBundle: { scan: true, includeCustomCollections: true, sizeLimitKb: 256 }
}
```

To add a collection: `npm install @iconify-json/<name>`.

### `image`

```ts
image: {
  provider: 'ipx',
  providers: {
    cloudinary: { name: 'cloudinary', options: { baseURL: process.env.NUXT_PUBLIC_CLOUDINARY_BASE } }
  },
  domains: [],
  quality: 80,
  format: ['webp', 'avif', 'png'],
  screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }
}
```

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

Node.js version: **24.11.0** (`.nvmrc`). Use `nvm use`.

---

## Documentation sync rule

> Every change that creates a discrepancy with `README.md` must be followed by a documentation update in the same session.

Applies to: adding/removing/renaming components, pages, composables, utils, layouts, prompt files, instruction files, dependencies, `nuxt.config.ts` changes affecting documented config, structure changes, naming/convention changes.

Edit only the affected section — do not rewrite the full README unless asked.
