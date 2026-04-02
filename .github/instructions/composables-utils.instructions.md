---
applyTo: "**/composables/**,**/utils/**,**/types/**"
---

# Composables, Utils & Types — sb-template-nuxt

## Available composables

### `useAppNotifications()`
Global notification system. State is shared across the app via `useState`.

```ts
const { notifications, removeNotification, clearNotifications, success, warning, error, info } = useAppNotifications()

// Show a notification
info({
  title: 'Title',
  message: 'Message text',       // required
  icon: 'lucide:bell',           // optional — Iconify name
  dismissible: true,             // optional — show close button
  autoClose: true,               // optional — auto-dismiss
  duration: 5000,                // optional — ms before auto-close
})
```

Methods: `success()`, `warning()`, `error()`, `info()` — all accept `Omit<NotificationItem, 'type' | 'id'>`.
`removeNotification(id: string)`, `clearNotifications()`.
`notifications` is a `ComputedRef<NotificationItem[]>`.

> Must be called client-side only (`import.meta.client`). The composable guards this internally.

---

### `useFloatingUi(config?)`
Wrapper around `@floating-ui/vue` for dropdown/tooltip/menu positioning.

```ts
const { reference, floating, floatingStyles, open, toggleFloating } = useFloatingUi({
  placement: 'bottom-start',  // default
  offset: 8,                  // default
  strategy: 'absolute',       // default
})
```

- `reference` / `floating` — `Ref<HTMLElement | null>` to bind via `ref`
- `floatingStyles` — bind to `:style` on the floating element
- `open` — `Ref<boolean>` current visibility state
- `toggleFloating(state?: boolean)` — open/close the floating element

---

### `useLockScroll()`
Prevents page scroll. Each instance gets a unique owner ID, so multiple callers are safe.

```ts
const { lock, unlock, isLocked } = useLockScroll()

lock()    // adds app-scroll-locked class to <html>
unlock()  // removes it (only when no other owner holds the lock)
```

- SSR-safe: guards with `import.meta.client`
- `isLocked: ComputedRef<boolean>`

---

### `useSanitize()`
XSS-safe HTML rendering via `isomorphic-dompurify`.

```ts
const { sanitizeHtml } = useSanitize()
const clean = sanitizeHtml(dirtyHtml)
```

- Server-side: skips DOMPurify (content trusted from CMS), converts `\n` to `<br>`
- Client-side: full DOMPurify sanitisation with allowlist of safe tags/attributes
- Use with `v-html` only via `BaseRichText` — never write `v-html` directly with unsanitised content

---

## Writing new composables

1. File in `app/composables/`, named `useSomething.ts`
2. Export a default function named `useSomething`
3. Always type return values explicitly
4. Use `useState` for global/shared state, `ref`/`computed` for local state
5. Guard any DOM/browser access with `if (!import.meta.client) return`
6. Private helpers use `_` prefix (e.g. `_ensureOwnerId`)

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

## Available utils

### `generateUuid(): string`
Returns a random UUID v4 string. Used internally by `useAppNotifications` and `useLockScroll`.

### `blocksToHtml(blocks: RichBlock[]): string`
Converts a `RichBlock[]` array (Strapi rich text format) to an HTML string. Used by `BaseRichText` — pair it with `useSanitize().sanitizeHtml()` before passing to `v-html`.

---

## Global TypeScript types (`app/types/global.d.ts`)

All shared interfaces are declared globally — no import needed anywhere in the app.

### `MenuItem`
```ts
interface MenuItem {
  code: string
  label: string
  iconType: 'nuxt-icon' | 'custom'
  icon: string
}
```
Used for language switcher items and icon-menu entries.

---

### `RouteItem`
```ts
interface RouteItem {
  name: string
  path: string
  disabled?: true
}
```
Used for navigation links in `TheHeader` and `TheFooter`.

---

### `NotificationItem`
```ts
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
```

---

### `RichBlock*` types

Strapi-compatible rich text block structure used by `BaseRichText` and `blocksToHtml`.

```ts
type RichBlock = RichBlockParagraph | RichBlockHeading | RichBlockList | RichBlockImage | RichBlockQuote | RichBlockCode | RichBlockDivider

// Leaf nodes
interface RichBlockText    { type: 'text'; text: string; bold?: boolean; italic?: boolean; underline?: boolean; strikethrough?: boolean; code?: boolean }
interface RichBlockLink    { type: 'link'; url: string; children: RichBlockText[] }

// Block nodes
interface RichBlockParagraph { type: 'paragraph'; children: RichBlockChild[] }
interface RichBlockHeading   { type: 'heading'; level: 1|2|3|4|5|6; children: RichBlockText[] }
// … (see global.d.ts for full definitions)
```

---

## Adding new global types

Add new shared interfaces to `app/types/global.d.ts` inside the `declare global {}` block. Never define shared types inline in components or pages.
