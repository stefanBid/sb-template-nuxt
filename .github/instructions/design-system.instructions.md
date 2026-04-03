---
applyTo: "**/*.vue"
---

# Design System — sb-template-nuxt

## Colours (`--color-app-*`)

All colours are defined as CSS custom properties in `app/assets/css/theme.css` inside an `@theme` block and auto-mapped to Tailwind utilities (`bg-app-*`, `text-app-*`, `border-app-*`). **Never hardcode raw hex values.**

| Token | Tailwind utility | Usage |
|---|---|---|
| `--color-app-main` | `bg-app-main` / `text-app-main` | Page background |
| `--color-app-surface` | `bg-app-surface` | Card / elevated surface |
| `--color-app-surface-2` | `bg-app-surface-2` | Nested surfaces, inputs |
| `--color-app-border` | `border-app-border` | Default borders |
| `--color-app-shadow` | `shadow-[0_4px_20px_var(--color-app-shadow)]` | Shadows (always via `var()`) |
| `--color-app-accent` | `bg-app-accent` / `text-app-accent` | Primary CTA, highlights |
| `--color-app-accent-hover` | `hover:bg-app-accent-hover` | Hover state of accent |
| `--color-app-accent-border` | `border-app-accent-border` | Border on accent elements |
| `--color-app-contrast` | `text-app-contrast` | Primary text |
| `--color-app-muted` | `text-app-muted` | Secondary / placeholder text |
| `--color-app-success` | `text-app-success` / `bg-app-success` | Success state |
| `--color-app-warning` | `text-app-warning` / `bg-app-warning` | Warning state |
| `--color-app-error` | `text-app-error` / `bg-app-error` | Error state |
| `--color-app-info` | `text-app-info` / `bg-app-info` | Info state |
| `--color-app-success-bg` | `bg-app-success-bg` | Success tint background |
| `--color-app-warning-bg` | `bg-app-warning-bg` | Warning tint background |
| `--color-app-error-bg` | `bg-app-error-bg` | Error tint background |
| `--color-app-info-bg` | `bg-app-info-bg` | Info tint background |

Tailwind opacity modifiers are allowed: `bg-app-main/80`, `text-app-muted/70`.

---

## Dark mode

Dark mode is handled **entirely via CSS variable overrides** inside the `.dark` class in `theme.css`.
**Never use `dark:` Tailwind variants for colour utilities** — use the colour token and it adapts automatically.

---

## Typography (`ty-app-*`)

Custom `@utility` classes defined in `app/assets/css/typography.css`. Apply them as regular Tailwind classes.

| Class | Font | Usage |
|---|---|---|
| `ty-app-hero` | Poppins, uppercase | Full-bleed hero text |
| `ty-app-impact` | Poppins, uppercase | Large display headings |
| `ty-app-title` | Poppins | Section titles (responsive: `text-2xl` → `text-4xl`) |
| `ty-app-title-lg` | Poppins | Large section titles (`text-3xl` → `text-6xl`) |
| `ty-app-title-xl` | Poppins | Extra large titles (`text-4xl` → `text-7xl`) |
| `ty-app-subtitle` | Inter semibold | Sub-headings (`text-base` → `text-xl`) |
| `ty-app-subtitle-lg` | Inter semibold | Large sub-headings (`text-lg` → `text-2xl`) |
| `ty-app-subtitle-xl` | Inter semibold | Extra large sub-headings (`text-xl` → `text-3xl`) |
| `ty-app-paragraph` | Inter | Body text (`text-sm` → `text-lg`) |
| `ty-app-label` | Inter, uppercase, tracked | Form labels, tags |
| `ty-app-btn-label` | Inter bold, uppercase | Button text |
| `ty-app-caption` | Inter italic | Captions, secondary notes |

### Font families
- `font-app-primary` → Poppins (headings, display)
- `font-app-secondary` → Inter (body, UI)

---

## Utility classes (`u-app-*`)

Defined in `app/assets/css/utilities.css`.

| Class | Effect |
|---|---|
| `u-app-soft-transition` | `transition-all duration-200 ease-in-out` |
| `u-app-hard-transition` | `transition-all duration-500 ease-in-out` |
| `u-app-focus` | `outline-none ring-app-contrast focus-visible:ring-2` |
| `u-app-focus-within` | `outline-none ring-app-contrast focus-within:ring-2` |
| `u-app-no-focus` | Removes all focus outlines (use only on elements with custom focus handling) |

Always add `u-app-soft-transition` to interactive and themed elements so they animate on theme switch.

---

## Animations (Vue `<Transition>`)

Named transition classes defined in `app/assets/css/animations.css`. Use them as the `name` prop on `<Transition>` / `<TransitionGroup>`.

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

## Icons

Always use the `<Icon>` component from `@nuxt/icon`. **The collection prefix is mandatory.**

Available collections: `lucide` (UI icons), `flagpack` (country flags).

```vue
<Icon name="lucide:arrow-right" class="size-5 text-app-accent" />
<Icon name="flagpack:it" class="size-5" />
```

- Size via Tailwind: `size-4`, `size-5`, `size-6`, `size-7`, etc.
- Colour via token: `text-app-contrast`, `text-app-muted`, `text-app-accent`
- Always `aria-label` on icon-only buttons
