# Fern UI — Design Tokens & Composition Patterns

Extracted from `fern-ui-preview.html` (the canonical Fern UI starter kit preview).
This is the single source of truth for colors, radius, shadow, typography, and
structural motifs. Read this before touching any component's markup or classes.

## 1. CSS custom properties (theme.css)

```css
:root{
  --font-app-primary:'Poppins',sans-serif;   /* headings, brand, numerals */
  --font-app-secondary:'Inter',sans-serif;   /* body, labels, UI text */

  --color-app-main:#f8faf9;        /* page background */
  --color-app-surface:#ffffff;     /* elevated content (cards, panels, dialogs) */
  --color-app-surface-2:#f1f5f3;   /* subtle nested surface (list rows, icon chips) */
  --color-app-shadow:rgba(0,159,93,.08); /* tinted with the accent, not neutral black */
  --color-app-border:#d4e4dc;

  --color-app-accent:#009F5D;
  --color-app-accent-hover:#00804a;
  --color-app-accent-border:#007041;
  --color-app-contrast:#1a1a1a;    /* primary text */
  --color-app-muted:#5a6c62;       /* secondary text */

  --color-app-success:#16a34a;
  --color-app-warning:#f59e0b;
  --color-app-error:#dc2626;
  --color-app-info:#3b82f6;
  /* + -bg variants for each semantic color, used for badges */

  --radius-sm:10px;   /* buttons, inputs, icon blocks, link focus rings */
  --radius-md:14px;   /* standard cards */
  --radius-lg:22px;   /* feature cards, dialogs, hero panels, elevated page-level blocks */
  --radius-pill:999px;/* chips, badges' dot, switches, avatar circles */
}
```

Dark mode flips `--color-app-*` via the `.dark` class on `<html>`. Never hardcode
colors — every visual choice must route through these variables so both themes
stay correct for free.

## 2. Radius hierarchy — this is a semantic signal, not decoration

| Radius | Value | Used for |
|---|---|---|
| `--radius-sm` | 10px | Buttons, inputs, small icon/avatar squares, focus outlines |
| `--radius-md` | 14px | Regular content cards (`.card`) |
| `--radius-lg` | 22px | Anything "page-level elevated": hero token panel, dialogs, feature card |
| `--radius-pill` | 999px | Chips, badges' status dot, toggle switches, circular avatars |

When recomposing a component, pick the radius that matches the element's role
in this table — don't default everything to one radius, and don't invent new
values.

## 3. Shadow — always tinted, never neutral

Fern shadows always carry the accent tint via `var(--color-app-shadow)`, and are
usually a soft, long, low-opacity spread rather than a hard drop shadow:

```css
box-shadow: 0 20px 44px -18px var(--color-app-shadow), 0 2px 8px var(--color-app-shadow);
```

Smaller elevated elements (cards) can use a lighter single-layer version:

```css
box-shadow: 0 1px 2px var(--color-app-shadow);
```

Use shadow to mark genuine elevation (a panel floating above the page background),
not as blanket decoration on every box.

## 4. Typography

- `--font-app-primary` (Poppins): h1–h4, brand mark, numerals/stats, accordion triggers.
- `--font-app-secondary` (Inter): body copy, labels, buttons, form fields, nav.
- Scale ratio 1.25, fluid via `clamp()`.
- Labels (`label`, `.section-tag`, `.field-label`) are small, uppercase-or-not,
  letter-spaced, and colored — either muted (neutral label) or **accent**
  (`.section-tag`: accent color, semibold, used as an eyebrow before a heading).
  Use the accent variant when a piece of text functions as a category tag /
  eyebrow rather than a plain muted caption.

## 5. Structural motifs to reuse (not generic decoration)

These are the load-bearing "Fern-ness" details. When recomposing a component,
actively look for a place to apply one of these instead of a generic divider,
pipe character, or plain icon:

- **Icon-in-a-block**: small icon or mark hosted inside a bordered square with
  `--radius-sm` and `--color-app-surface-2` background (`.brand-mark`,
  `.card-feature .icon`, `.avatar`). Never leave a meaningful icon "naked" and
  inline if it can be a small hosted block instead.
- **Badge dot**: a `currentColor` filled circle (`.badge-dot`) used as a status
  indicator prefix. Reuse this shape (a small filled circle) anywhere a plain
  separator or bullet is currently doing that job — e.g. replace a `|` pipe
  or generic `•` with a proper pill-radius dot styled with theme colors.
  Applies just as well to hover-reveal affordances (a dot that fades/scales in
  on hover next to a link).
- **Section tag / eyebrow**: small accent-colored label before a heading
  (`.section-tag`). Use for column/section headers that currently read as
  plain muted uppercase captions, to tie the component back to the rest of
  the design system.
- **Two-tier surface stacking**: `--color-app-surface` for the "main" elevated
  content, `--color-app-surface-2` for a secondary/nested tier within the same
  visually-grouped block (e.g. a card's list rows, a panel's footer strip).
  Prefer stacking surfaces inside one rounded, bordered container over adding
  a second independent bordered box.
- **Card treatments differ by content weight**: a "feature" card (gradient
  surface→surface-2, `--radius-lg`, icon block) reads as promoted content; a
  plain `.card` (`--radius-md`) reads as standard; a `.card-list` (rows with
  `border-bottom` dividers, no card-in-card) reads as a compact index. Pick the
  treatment that matches the content's actual weight instead of using one
  card style everywhere.
- **Tinted focus & hover**: interactive elements transition border-color /
  color toward `--color-app-accent` on hover/focus rather than a generic
  gray or opacity-only change.

## 6. What NOT to do

- Don't just find-and-replace old color classes with `app-*` token classes and
  call it done — that's a token migration, not a Fern recomposition.
- Don't add drop shadows, gradients, or rounded corners that aren't tied to one
  of the tokens/roles above.
- Don't invent new radius or color values "in the spirit of" Fern — always
  route through the existing CSS variables (or the Tailwind utility that maps
  to them, if the project has one).
- Don't reach for generic decorative characters (pipes, asterisks, em-dashes)
  as separators when a themed dot/badge shape is available and fits better.
