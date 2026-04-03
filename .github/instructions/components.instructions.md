---
applyTo: "**/components/**"
---

# Components — sb-template-nuxt

## Component types

| Prefix | Rule | Examples |
|---|---|---|
| `Base` | Fully reusable, zero business logic, no direct API calls | `BaseButton`, `BaseInput` |
| `The` | Singleton — used once per layout | `TheHeader`, `TheFooter` |

Never mix business logic or API calls into `Base` components.

---

## Creating a new component

1. Create a folder in `app/components/base/` using **kebab-case**: `app/components/base/my-widget/`
2. Create the file using **PascalCase + prefix**: `BaseMyWidget.vue`
3. Structure the `<script setup>` block with sections in order:
   ```ts
   // Dependencies
   // Input / Output
   // Data
   // Events
   ```
4. Always use `<script setup lang="ts">` — no Options API.
5. Define props with an inline interface + `withDefaults`. Only list props that need a default in `withDefaults`.
6. Use design system tokens for all styling — no raw hex values, no hardcoded sizes.
7. Add `u-app-soft-transition` to themed/interactive elements.

---

## Base component API catalogue

### `BaseButton`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Visual style |
| `type` | `'button' \| 'submit' \| 'reset' \| 'link'` | `'button'` | `'link'` renders an `<a>` tag with `target="_blank"` |
| `to` | `string` | `undefined` | Required when `type='link'` |
| `ariaLabel` | `string` | `undefined` | For icon-only usage |
| `isDisabled` | `boolean` | `false` | |
| `isLoading` | `boolean` | `false` | |

Slot: `default` (button label / content)

---

### `BaseCard`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | `undefined` | |
| `subtitle` | `string` | `undefined` | |
| `paragraph` | `string` | `undefined` | |
| `variant` | `'dark' \| 'dark-hover' \| 'light' \| 'light-hover'` | `'light'` | Background + hover behaviour |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Content alignment |
| `fullCustomContent` | `boolean` | `false` | If true, disables built-in layout — use `default` slot only |

Slots: `default`, `card-header`, `card-body`, `card-footer`

---

### `BaseInput`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `name` | `string` | `undefined` | Falls back to `${id}-name` |
| `label` | `string` | `undefined` | |
| `placeholder` | `string` | `'Insert a value...'` | |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'search' \| 'tel' \| 'url'` | `'text'` | |
| `hint` | `string` | `undefined` | |
| `error` | `string \| null` | `null` | Shows error message and red border |
| `autocomplete` | `string` | `'off'` | |
| `prefixIcon` | `string` | `undefined` | Iconify name e.g. `lucide:search` |

Model: `defineModel<string>('input')`

---

### `BaseTextarea`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `name` | `string` | `undefined` | |
| `label` | `string` | `undefined` | |
| `placeholder` | `string` | `'Insert a value...'` | |
| `hint` | `string` | `undefined` | |
| `error` | `string \| null` | `null` | |
| `maxLength` | `number` | `undefined` | Shows character counter when set |

Model: `defineModel<string>('input')`

---

### `BaseCheckbox`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `name` | `string` | `undefined` | |
| `label` | `string` | `undefined` | Shown if no `default` slot |
| `error` | `string \| null` | `null` | |

Model: `defineModel<boolean>('input')`
Slot: `default` (custom label content)

---

### `BaseCombobox`
Generic component (`<script setup lang="ts" generic="T">`).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `type` | `'single' \| 'multiple'` | `'single'` | Selection mode |
| `items` | `{ label: string, value: T }[]` | — | Required |
| `name` | `string` | `undefined` | |
| `label` | `string` | `undefined` | |
| `placeholder` | `string` | `'Insert a value...'` | |
| `hint` | `string` | `undefined` | |
| `error` | `string \| null` | `null` | |
| `prefixIcon` | `string` | `undefined` | |

Model: `defineModel<T[]>('input', { default: () => [] })`

---

### `BaseChip`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `text` | `string` | — | Required |
| `icon` | `string` | `undefined` | Iconify name |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | |
| `clickable` | `boolean` | `false` | Renders as `<button>` |
| `linkable` | `{ href: string, target?: string, rel?: string }` | `undefined` | Renders as `<a>` |

Emits: `chip-click` (only when `clickable: true`)

---

### `BaseDialog`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `isOpen` | `boolean` | — | Required |
| `title` | `string` | — | Required |
| `subtitle` | `string` | `undefined` | |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'sm'` | |

Emits: `(e: 'close', value: false): void`
Slots: `default` (body), `header` (below title bar), `footer` (bottom action area)
Behaviour: closes on `Escape`, locks scroll when open, traps focus, uses `<Teleport to="body">`.

---

### `BaseAccordion`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | Required |
| `title` | `string` | — | Required |
| `icon` | `string` | `undefined` | Iconify name shown in icon box |
| `isOpen` | `boolean` | `undefined` | If omitted, accordion manages state internally |

Emits: `toggle` (only when `isOpen` is controlled externally)
Slot: `default` (body content)

---

### `BaseIconButton`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `string` | — | Required. Iconify name |
| `ariaLabel` | `string` | `undefined` | Always set it |
| `isActive` | `boolean` | `false` | Active/pressed state styling |

Emits: `(e: 'click'): void`

---

### `BaseIconMenu`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `string` | — | Required. Trigger button icon |
| `items` | `MenuItem[]` | — | Required |
| `selectedItemId` | `string \| null` | `null` | Highlighted item |

Emits: `(e: 'select', itemId: string): void`
Uses `useFloatingUi` internally with `placement: 'bottom-start'`.

---

### `BaseCloseButton`
No props.
Emits: `(e: 'close', value: false): void`
Renders a close (`lucide:x`) icon button.

---

### `BaseMediaCarousel`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `MediaItem[]` | — | Required |

`MediaItem`: `{ type: 'photo' \| 'video', url: string, alternativeText?: string, caption?: string, previewUrl?: string, width?: number, height?: number }`
Auto-plays, pauses on video playback.

---

### `BaseRichText`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `blocks` | `RichBlock[]` | — | Required |

Converts `RichBlock[]` to sanitised HTML via `blocksToHtml` + `useSanitize`. Uses a `<style scoped>` block to apply typography tokens to the rendered HTML.

---

## Singleton components (`The*`)

### `TheHeader`
| Prop | Type | Notes |
|---|---|---|
| `routes` | `RouteItem[]` | Nav links |
| `langs` | `MenuItem[]` | Language switcher items |
| `selectedLangId` | `string` | Currently active locale code |

Emits: `(e: 'change-lang', langCode: string): void`

### `TheFooter`
| Prop | Type | Notes |
|---|---|---|
| `email` | `string` | |
| `phone` | `string` | |
| `githubUrl` | `string` | |
| `instagramUrl` | `string` | |
| `linkedinUrl` | `string` | |
| `quickLinks` | `RouteItem[]` | |

### `TheNotificationBanner`
Driven by `useAppNotifications`. Do not instantiate manually — managed by `default.vue`.

### `TheThemeToggle`
No props. Toggles dark/light mode via `@nuxtjs/color-mode`.
