# CLAUDE.md

Nuxt 4 project started from `sb-template-nuxt` (see `.template-version`). SSR, Tailwind v4, i18n, dark/light theme.

**First time here? Run the `init-project` skill** (in `.claude/skills/`; re-runnable to fix mistakes, delete it by hand when happy). Optional extra tooling lives in the `sb-context-nuxt` Claude Code plugin (checks, global style, GitHub admin); it is never committed here — only project-specific context is.

## App context

*(Filled by `init-project`.)*

## Framework documentation

Consult when working with Nuxt internals or a module's API beyond what's covered below. **Never remove this section.** When adding a Nuxt module, plugin or major library (Tailwind included), add its documentation link here.
- Nuxt 4: [Introduction](https://nuxt.com/docs/4.x/getting-started/introduction) · [Directory structure](https://nuxt.com/docs/4.x/directory-structure) · [Guide](https://nuxt.com/docs/4.x/guide) · [API](https://nuxt.com/docs/4.x/api) · [Netlify deploy](https://nuxt.com/deploy/netlify)
- Modules: [@nuxt/eslint](https://nuxt.com/modules/eslint) · [@nuxt/icon](https://nuxt.com/modules/icon) · [@nuxt/image](https://nuxt.com/modules/image) · [@vueuse/nuxt](https://nuxt.com/modules/vueuse) · [@nuxtjs/i18n](https://nuxt.com/modules/i18n) · [@nuxt/fonts](https://nuxt.com/modules/fonts) · [@nuxtjs/color-mode](https://nuxt.com/modules/color-mode) · [@nuxtjs/sitemap](https://nuxt.com/modules/sitemap)
- Tailwind CSS v4: [Docs](https://tailwindcss.com/docs) · [Theme variables (`@theme`)](https://tailwindcss.com/docs/theme) · [Upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

## Stack

Nuxt 4 · Vue 3 `<script setup lang="ts">` · Tailwind v4 (tokens in `app/assets/css/theme.css`) · `@nuxt/icon` (lucide, flagpack) · `@nuxt/image` · `@nuxt/fonts` · `@nuxtjs/i18n` · `@nuxtjs/color-mode` · Netlify.

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

Explore `app/components/base/` for the available components and their props — read the component, it is the source of truth.

## Commands

`npm run dev` · `npm run lint:fix` · `npx nuxt typecheck` · `npm run build`. On `main` use `npm ci`, never `npm install` (`npm run si` picks automatically).
