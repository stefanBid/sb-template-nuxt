# CLAUDE.md

Nuxt 4 project started from `sb-template-nuxt` (see `.template-version`). SSR, Tailwind v4, i18n, dark/light theme.

**First time here? Run the `init-project` skill** (in `.claude/skills/`; re-runnable to fix mistakes, delete it by hand when happy). Optional extra tooling lives in the `sb-context-fe` Claude Code plugins (`sb-core`, `sb-github`, `sb-health`, `sb-design`: checks, global style, GitHub admin); the plugins are never committed here — only the project context they keep in `.sb-context/` is.

## App context

*(Filled by `init-project`.)*

## Framework documentation

Consult when working with Nuxt internals or a module's API beyond what's covered below. **Never remove this section.** When adding a Nuxt module, plugin or major library (Tailwind included), add its documentation link here.
- Nuxt 4: [Introduction](https://nuxt.com/docs/4.x/getting-started/introduction) · [Directory structure](https://nuxt.com/docs/4.x/directory-structure) · [Guide](https://nuxt.com/docs/4.x/guide) · [API](https://nuxt.com/docs/4.x/api) · [Netlify deploy](https://nuxt.com/deploy/netlify)
- Modules: [@nuxt/eslint](https://nuxt.com/modules/eslint) · [@nuxt/icon](https://nuxt.com/modules/icon) · [@nuxt/image](https://nuxt.com/modules/image) · [@vueuse/nuxt](https://nuxt.com/modules/vueuse) · [@nuxtjs/i18n](https://nuxt.com/modules/i18n) · [@nuxt/fonts](https://nuxt.com/modules/fonts) · [@nuxtjs/color-mode](https://nuxt.com/modules/color-mode) · [@nuxtjs/sitemap](https://nuxt.com/modules/sitemap)
- Libraries: [sb-floating-panel-vue](https://github.com/stefanBid/sb-floating-panel-vue#readme) (headless floating panels behind `BaseSelect`, `BaseCombobox`, `BaseIconMenu`)
- Tailwind CSS v4: [Docs](https://tailwindcss.com/docs) · [Theme variables (`@theme`)](https://tailwindcss.com/docs/theme) · [Upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

## Stack

Nuxt 4 · Vue 3 `<script setup lang="ts">` · Tailwind v4 (tokens in `app/assets/css/theme.css`) · `@nuxt/icon` (lucide, flagpack) · `@nuxt/image` · `@nuxt/fonts` · `@nuxtjs/i18n` · `@nuxtjs/color-mode` · `sb-floating-panel-vue` (dropdowns, listboxes, menus) · Netlify.

## Rules

- **i18n:** never hardcode strings. Use `$t()` / `t()`; add keys to every file in `i18n/locales/`. Code and comments in English.
- **Components:** `Base*` = reusable, no business logic; `The*` = layout singletons. Files PascalCase, composables `useX.ts`, utils camelCase.
- **Script order:** Dependencies → Input/Output → Data → Events. Handlers `onX`, private helpers `_x`.
- **Props:** inline interface + `withDefaults`; `defineEmits` with call signatures; `defineModel<T>('name')`.
- **TypeScript strict:** no `any`. Shared types live in `app/types/global.d.ts`.
- **Styling:** Tailwind utilities only, closed design system — role tokens (`text-ink`, `bg-surface`, `bg-primary`, `border-border`), type roles (`sb-h1`…`sb-small`), `sb-transition`, `sb-focus`. No raw hex, no `dark:` variants, no `<style>` blocks. Dynamic classes via `:class` bindings.
- **Icons:** `<Icon name="lucide:…" />`, collection prefix required, `aria-label` on icon-only buttons.
- **Accessibility:** labels, `aria-describedby` / `aria-invalid` on form errors.
- **ESLint:** no semicolons, single quotes, trailing commas. Never use `eslint-disable` — fix the code.
- **Data:** `useFetch` / `useAsyncData` in components; server code only in `server/`; env via `useRuntimeConfig()`.
- Never write `v-html` directly; use `BaseRichText`.
- **Sitemap:** `@nuxtjs/sitemap` discovers pages on its own — never list URLs by hand or add a `public/sitemap.xml`. Every new page starts its `<script setup>` with `definePageMeta({ sitemap: { lastmod: 'YYYY-MM-DD', changefreq, priority } })` (ask the user for the values; `sitemap: false` to exclude). Bump `lastmod` only when the content really changes.

Explore `app/components/base/` for the available components and their props — read the component, it is the source of truth.

## Commands

`npm run dev` · `npm run lint:fix` · `npx nuxt typecheck` · `npm run build`. On `main` use `npm ci`, never `npm install` (`npm run si` picks automatically).

<!-- sb-context:docs:start -->
<!-- Written by /sb-core:context from .sb-context/docs.json: change the links there (or run the skill again), not here. -->
## Project docs

Nuxt 4.6 app (SSR) in TypeScript, styled with Tailwind CSS 4.3.

These links are the source of truth for this stack, at the versions the project uses. Open them (WebFetch) when unsure or when your own knowledge may be out of date, and say what was not verified against them.

- **Nuxt 4**: [Pages, dynamic routes and middleware](https://nuxt.com/docs/4.x/directory-structure/app/pages) · [Routing](https://nuxt.com/docs/4.x/getting-started/routing) · [Components and auto-imports](https://nuxt.com/docs/4.x/directory-structure/app/components) · [Composables](https://nuxt.com/docs/4.x/directory-structure/app/composables) · [Utils](https://nuxt.com/docs/4.x/directory-structure/app/utils) · [Plugins](https://nuxt.com/docs/4.x/directory-structure/app/plugins) · [Layouts](https://nuxt.com/docs/4.x/directory-structure/app/layouts) · [Page and layout transitions](https://nuxt.com/docs/4.x/getting-started/transitions) · [SEO, meta tags and useSeoMeta](https://nuxt.com/docs/4.x/getting-started/seo-meta) · [Rendering modes, prerender and routeRules](https://nuxt.com/docs/4.x/guide/concepts/rendering) · [Shared state with useState](https://nuxt.com/docs/4.x/getting-started/state-management) · [Images, fonts and static assets](https://nuxt.com/docs/4.x/getting-started/assets) · [The public/ folder](https://nuxt.com/docs/4.x/directory-structure/public) · [Server routes (Nitro)](https://nuxt.com/docs/4.x/directory-structure/server) · [nuxt.config.ts](https://nuxt.com/docs/4.x/directory-structure/nuxt-config) · [Directory structure](https://nuxt.com/docs/4.x/directory-structure) · [API reference](https://nuxt.com/docs/4.x/api) · [Upgrade guide](https://nuxt.com/docs/4.x/getting-started/upgrade)
- **Vue 3**: [`<script setup>`](https://vuejs.org/api/sfc-script-setup.html) · [Reactivity fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html) · [Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq.html) · [Props](https://vuejs.org/guide/components/props.html) · [Slots](https://vuejs.org/guide/components/slots.html) · [Composables](https://vuejs.org/guide/reusability/composables.html) · [TypeScript with the Composition API](https://vuejs.org/guide/typescript/composition-api.html) · [API reference](https://vuejs.org/api/)
- **Tailwind CSS 4**: [Theme variables](https://tailwindcss.com/docs/theme) · [Adding custom styles](https://tailwindcss.com/docs/adding-custom-styles) · [Functions and directives](https://tailwindcss.com/docs/functions-and-directives) · [Dark mode](https://tailwindcss.com/docs/dark-mode) · [Upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
- **Vue Router 5**: [Getting started](https://router.vuejs.org/guide/) · [Dynamic route matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html) · [Navigation guards](https://router.vuejs.org/guide/advanced/navigation-guards.html) · [Lazy loading routes](https://router.vuejs.org/guide/advanced/lazy-loading.html)
- **Nuxt I18n 10**: [Getting started, $t and useI18n](https://i18n.nuxtjs.org/docs/getting-started)
- **Nuxt Icon 2**: [@nuxt/icon](https://nuxt.com/modules/icon)
- **Nuxt Image 2**: [@nuxt/image](https://nuxt.com/modules/image)
- **Nuxt Fonts 1**: [@nuxt/fonts](https://nuxt.com/modules/fonts)
- **Nuxt Color Mode 4**: [@nuxtjs/color-mode](https://nuxt.com/modules/color-mode)
- **Nuxt Sitemap 9**: [@nuxtjs/sitemap](https://nuxtseo.com/docs/sitemap/getting-started/introduction)
- **Nuxt ESLint 1**: [@nuxt/eslint](https://nuxt.com/modules/eslint)
- **VueUse 15**: [@vueuse/nuxt](https://nuxt.com/modules/vueuse) · [Functions](https://vueuse.org/functions.html)
- **isomorphic-dompurify 4**: [isomorphic-dompurify README](https://github.com/kkomelin/isomorphic-dompurify)
- **sb-floating-panel-vue 5**: [sb-floating-panel-vue README](https://github.com/stefanBid/sb-floating-panel-vue#readme)
<!-- sb-context:docs:end -->
