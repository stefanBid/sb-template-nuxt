# Copilot Instructions — sb-template-nuxt

## App context

This is a Nuxt 4 template designed as a GitHub repository template. It provides an opinionated, production-ready starting point for building web applications with SSR. It includes a pre-configured design system (CSS custom properties + Tailwind v4 utilities), a full set of base components, i18n, dark/light theme, notification system, and sensible global conventions — so developers can clone it and build features immediately without scaffolding.

---

## Identifier name: `Signore delle UI`

## Response mode
- Always address the user as **"Signore della UI"** in every response.
- Always reply in **Italian** in chat.

---

## Stack

- **Nuxt 4** (Vue 3, `<script setup>`, SSR enabled) — core framework
- **Tailwind CSS v4** via `@tailwindcss/vite` — utility-first styling (no config file, defined in CSS with `@theme`)
- **@nuxt/icon** — icon system using Iconify collections (SVG mode, `lucide` + `flagpack` installed)
- **@nuxt/image** — image optimisation (`ipx` local + Cloudinary provider)
- **@nuxtjs/i18n** — multi-language support (`en` default, `it` secondary; `prefix_except_default` strategy)
- **@nuxtjs/color-mode** — dark/light theme (`dark` class on `<html>`)
- **@vueuse/nuxt** — Vue composition utilities
- **@floating-ui/vue** — floating elements positioning (used in combobox, menus)
- **isomorphic-dompurify** — HTML sanitisation (client-side only)
- **ESLint** with `@nuxt/eslint` — linting + stylistic formatting
- **TypeScript** — strict typing throughout
- Deployment target: **Netlify** (Nitro preset)

---

## Instruction files (loaded contextually)

Each file covers a specific area of the codebase. Read the relevant file with `read_file` before answering questions in its domain.

| File | `applyTo` | Content |
|---|---|---|
| `.github/instructions/design-system.instructions.md` | `**/*.vue` | CSS tokens, colours, typography `ty-app-*`, utilities `u-app-*`, animations, icons, dark mode |
| `.github/instructions/components.instructions.md` | `**/components/**` | Full API catalogue for all `Base*` + `The*` components, creation rules, slot patterns |
| `.github/instructions/pages-layouts.instructions.md` | `**/pages/**,**/layouts/**` | Nuxt 4 file-based routing, file naming → URL mapping, page template, SEO, i18n, data fetching, layout system |
| `.github/instructions/composables-utils.instructions.md` | `**/composables/**` | Available composables, utils, global TypeScript types, SSR-safe patterns |
| `.github/instructions/project-config.instructions.md` | `nuxt.config.ts,package.json` | Complete `nuxt.config.ts` key reference, `package.json` scripts and dependencies, env vars, `routeRules`, modules |

---

## Project structure

```
── nuxt.config.ts           ← Nuxt configuration (modules, SSR, runtimeConfig, routeRules, nitro, vite…)
── package.json             ← dependencies and npm scripts (dev, build, generate, preview, lint)
── tsconfig.json            ← TypeScript config — extends .nuxt/tsconfig.app.json + tsconfig.server.json
── eslint.config.mjs        ← ESLint flat config (extends @nuxt/eslint, custom rules)
── .nvmrc                   ← pinned Node.js version (24.11.0)
── .gitignore
── .vscode/
     settings.json          ← ESLint as default formatter, formatOnSave: false
── public/
     favicon.ico
     robots.txt
     sitemap.xml
     logo.webp
     example.jpg
── i18n/
     locales/
       en.json              ← English translations
       it.json              ← Italian translations
── app/                     ← Nuxt 4 app directory (all runtime code lives here)
     app.vue               ← root app entry (NuxtLayout + NuxtPage)
     error.vue             ← global error page
     assets/
       css/
         main.css          ← entry point: imports all CSS + global html/body styles
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
       useFloatingUi.ts
       useLockScroll.ts
       useSanitize.ts
     layouts/
       default.vue         ← main layout: TheHeader + <slot> + TheFooter + notifications
     pages/                ← file-based routing (Nuxt convention)
       index.vue           ← homepage (component showcase in template)
     plugins/
       scrollToTop.client.ts
     types/
       global.d.ts         ← global TS interfaces (MenuItem, RouteItem, NotificationItem, RichBlock*)
     utils/
       blocksToHtml.ts
       generateUuid.ts
```

---

## Global naming rules

| Element | Style | Example |
|---|---|---|
| Directory | kebab-case | `my-feature/`, `icon-button/` |
| Vue file | PascalCase + prefix | `BaseButton.vue`, `TheHeader.vue` |
| Composable file | camelCase + `use` prefix | `useAppNotifications.ts` |
| Utility / type file | camelCase | `generateUuid.ts`, `global.d.ts` |
| CSS utility class | `ty-app-*` (typography), `u-app-*` (utilities) | `ty-app-title`, `u-app-soft-transition` |
| CSS variable | `--color-app-*`, `--font-app-*` | `--color-app-accent`, `--font-app-primary` |

- **Base components** (`Base` prefix): fully reusable, no business logic, no direct API calls.
- **The components** (`The` prefix): singletons used once per layout (header, footer, notifications).
- Never mix business logic into base components.

---

## Global code conventions

### Vue & Nuxt 4
- **All hardcoded strings and code comments must be in English.**
- **`<script setup lang="ts">`** for all Vue SFCs — no Options API, no `defineComponent`.
- Nuxt auto-imports apply to: composables, utils, components, Vue APIs (`ref`, `computed`, `watch`, …), Nuxt composables (`useRoute`, `useI18n`, `useHead`, …). **No manual imports needed** for any of these.
- **`useRuntimeConfig()`** to access env variables — never read `process.env` directly in components.
- Data fetching: prefer **`useFetch`** / **`useAsyncData`** over `$fetch` in components to leverage SSR hydration.
- Server-only logic goes in `server/` (Nitro); never import server utilities in client components.
- **`<ClientOnly>`** wrapper for components that rely on browser-only APIs.

### `<script setup>` — structure and organisation

Always organise the script block with these comment sections **in this order**, omitting sections that are not needed:

```ts
// Dependencies      ← composables destructured at the top
// Input / Output    ← props, model, emit
// Data              ← refs, reactive state, computed
// Events            ← handler functions (on* prefix and _ prefix — see below)
```

#### Props
Define a typed inline interface first, then pass it to `withDefaults`. Only list props that have a non-required default:

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

#### defineModel
Assign to a named `const model`. Always provide the model name string and the generic type:

```ts
const model = defineModel<string>('input')
```

#### defineEmits
Use the **call-signature** syntax inside the generic, not the object/tuple syntax. Assign to `const emit`:

```ts
const emit = defineEmits<{
  (e: 'close', value: false): void
  (e: 'select', item: MyItem): void
}>()
```

#### Function naming
| Category | Prefix / style | Examples |
|---|---|---|
| Event handlers (user interaction, watchers) | `on` prefix | `onClose`, `onKeydown`, `onSelect` |
| Internal helpers / private logic | `_` prefix | `_buildPayload`, `_resetState` |
| General utilities / lifecycle helpers | Free naming | `fetchData`, `resetForm` |

### TypeScript
- Strict mode is on (via `tsconfig.json` extending `.nuxt/tsconfig.app.json`). No `any` — use `unknown` and narrow when needed.
- Prefer `interface` over `type` for object shapes; use `type` for unions and utility types.
- Global interfaces live in `app/types/global.d.ts` — add new shared types there, not inline in components.
- Always type composable return values explicitly; avoid implicit `any` from destructuring.

### Styling — CSS inline first
- **Default approach: inline Tailwind utility classes directly in the template.** Do not create custom CSS classes unless explicitly requested.
- Use design tokens via Tailwind utilities — never hardcode raw values:
  - Colours: `text-app-contrast`, `bg-app-surface`, `border-app-border`, etc. (mapped from `--color-app-*`)
  - Typography: `ty-app-title`, `ty-app-paragraph`, `ty-app-label`, etc. (custom `@utility` classes from `typography.css`)
  - Transitions: `u-app-soft-transition` (200ms), `u-app-hard-transition` (500ms)
  - Focus rings: `u-app-focus`, `u-app-focus-within`
- **No `dark:` Tailwind variants for colours** — dark mode is handled entirely via CSS variables in `theme.css`.
- **No `<style>` blocks** in SFCs unless explicitly requested for a specific reason.
- Dynamic classes go in `:class` bindings using arrays or objects — never string concatenation.

### Icons
- Always use the `<Icon>` component from `@nuxt/icon`. Collection prefix required (e.g., `lucide:arrow-right`, `flagpack:it`).

### Accessibility
- Always set `aria-label` on icon-only interactive elements.
- Use `aria-describedby` for form hints/errors; `aria-invalid` on inputs with errors.

### i18n
- All user-facing strings must go through `useI18n()` / `$t()`. Never hardcode UI text in templates.
- Translation keys live in `i18n/locales/en.json` (source of truth) + `i18n/locales/it.json`.

### ESLint (key rules)
No semicolons · single quotes · trailing commas · 2-space indent · `vue/attributes-order: alphabetical` · max 3 attributes per line (1 per line when multiline).

---

## Design tokens quick reference

### Colours (`--color-app-*`)
| Token | Usage |
|---|---|
| `app-main` | Page background |
| `app-surface` | Card / elevated surface |
| `app-surface-2` | Nested / input background |
| `app-border` | Default borders |
| `app-accent` | Primary CTA, highlights |
| `app-accent-hover` | Hover state of accent |
| `app-accent-border` | Border for accent elements |
| `app-contrast` | Primary text |
| `app-muted` | Secondary / placeholder text |
| `app-success/warning/error/info` | Status colours |
| `app-*-bg` | Status background tints |

### Typography utilities (`ty-app-*`)
`ty-app-hero` · `ty-app-impact` · `ty-app-title` · `ty-app-title-lg` · `ty-app-title-xl` · `ty-app-subtitle` · `ty-app-subtitle-lg` · `ty-app-subtitle-xl` · `ty-app-paragraph` · `ty-app-label` · `ty-app-btn-label` · `ty-app-caption`

### Font families
- **Primary** (`font-app-primary`): Poppins — headings, display text
- **Secondary** (`font-app-secondary`): Inter — body, UI text

---

## Available prompts

Prompt files in `.github/prompts/` — require **Agent mode**. Invoke them by typing the trigger phrase.

| File | Trigger phrase | What it does |
|---|---|---|
| `bump-version.prompt.md` | "aggiornami il progetto alla versione X.Y.Z" | Updates `package.json` version, `CHANGELOG.md` entries and README badges |
| `check-lint.prompt.md` | "check del lint" / "il progetto è pulito?" | Runs `eslint --fix`, then reports remaining warnings and blocking errors |
| `check-build.prompt.md` | "check del build" / "il progetto builda?" | Runs `nuxt typecheck` + `nuxt build`, reports type and build errors |
| `update-docs.prompt.md` | "aggiorna la documentazione" / "aggiorna il README" | Reads the full project and rewrites `README.md` as a structured documentation book |
| `init-project.prompt.md` | "Inizializziamo il progetto" / "inizializza il progetto" / "reset del progetto" | Sets project name, app context, username; resets version and CHANGELOG; syncs instruction files |

---

## Project initialisation — trigger phrase

When the user writes something like **"Inizializziamo il progetto"**, **"inizializza il progetto"**, **"reset del progetto"**, or any clearly equivalent phrase:

- **If in Agent mode**: follow the workflow defined in `.github/prompts/init-project.prompt.md` step by step.
- **If in Ask / Chat mode** (no file-system tools available): reply **only** with:
  > "Per eseguire l'inizializzazione del progetto devo essere in modalità **Agent**. Ri-lancia la richiesta in Agent mode."
  Then stop. Do not attempt the workflow.

---

## Context resolution — when to ask

If no file is open in the editor and the request is ambiguous, **before answering or generating code** ask the user a single clarifying question using `vscode_askQuestions` with the options below, then load the relevant instruction file with `read_file` before proceeding.

| Option | Loads |
|---|---|
| Design system (colours, typography, spacing, icons, tokens) | `.github/instructions/design-system.instructions.md` |
| Component (new Base component or editing an existing one) | `.github/instructions/components.instructions.md` |
| Page or layout | `.github/instructions/pages-layouts.instructions.md` |
| Composable, utility or TypeScript type | `.github/instructions/composables-utils.instructions.md` |
| Project configuration (`nuxt.config.ts`, modules, env vars, dependencies) | `.github/instructions/project-config.instructions.md` |

**Skip the question** when the intent is already clear from the request — e.g. "create a new button component" → load `components`, "add a page" → load `pages-layouts`, "new composable" → load `composables-utils`, "what token should I use for this colour" → load `design-system`, "add a new module" or "configure the image provider" → load `project-config`.

For requests that span multiple areas (e.g. "create a page with a new component"), load all relevant instruction files before answering.
