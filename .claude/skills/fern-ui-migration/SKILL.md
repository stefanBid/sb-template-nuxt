---
name: fern-ui-migration
description: Recompose existing UI components (Vue/Nuxt SFCs, React components, or plain HTML) to the Fern UI design system chosen for this project. Use this whenever the user asks to "apply Fern UI", "update to the new design", "migrate to Fern", "restyle this component with Fern UI", or names a component and asks to bring it in line with the design system / design tokens / theme.css. Always use this skill instead of doing an ad-hoc class swap — Fern UI recomposition means re-thinking the composition (radius hierarchy, tinted shadow, structural motifs) around the component's existing markup, not just replacing color class names. Trigger even if the user doesn't say "Fern" by name but references "il nuovo design", "i token", or points at the theme/preview file.
---

# Fern UI Migration

Recompose one or more existing components to the Fern UI design system while
leaving their functional behavior completely untouched. This skill encodes
the design system extracted from the project's `fern-ui-preview.html` /
`theme.css` and the recomposition approach already validated on `TheFooter.vue`.

Read `references/fern-ui-tokens.md` before editing anything — it has the full
token table (colors, radius hierarchy, shadow, typography) and the list of
structural motifs (icon-in-a-block, badge dot, section tag, two-tier surface,
card-weight matching) that make a result read as "Fern UI" rather than a
generic reskin.

## Step 0 — Locate the design source

Before working on any component, read the project's live design source at
`./app/assets/design-system/fern-ui-preview.html` (path relative to the repo
root). This is the ground truth for token values — not memory, and not the
bundled `references/fern-ui-tokens.md`, which is a snapshot and may drift out
of date. If the tokens in that file differ from `references/fern-ui-tokens.md`,
re-derive the current values from the live file and prefer it.

If `./app/assets/design-system/fern-ui-preview.html` doesn't exist in the
repo (moved, renamed, or this skill was copied into a different project),
say so explicitly and ask for the correct path rather than silently falling
back to the bundled reference as if it were current — don't guess a new
location.

Also make sure you have the current version of:
- Any shared/base components the target component depends on (e.g. a
  `BaseChip`, `BaseButton`, icon component). If a dependency already renders
  itself using the design tokens, leave it alone — don't re-implement it
  inline just to "make it more Fern"; that's the dependency's job, not this
  component's.

## Step 1 — Establish the functional-parity contract

Before writing any markup, write down (in a scratch note, not necessarily
shown to the user unless asked) everything that must not change:

- Every prop: name, type, default value, optionality.
- Every emitted event / callback.
- Every conditional render branch (loading, empty, disabled, error states).
- Every external call: i18n keys (`t(...)`), routing (`localePath`, `to=`),
  data fetching, computed values, slots.
- Any accessibility attribute already present (`aria-*`, `alt`, `for`/`id`
  pairs, focus order).

If the user gave an explicit list of constraints, use exactly that list. If
the constraint list is empty, missing, or a placeholder, default to the
strictest interpretation: **preserve everything** — treat the component's
current props/events/behavior as a frozen API and only change markup,
classes, and purely-visual structure. State this assumption briefly to the
user rather than silently guessing looser constraints.

Never introduce a new required prop, remove a prop, rename an emitted event,
or change what a function/computed returns as part of a "design" pass. If the
design genuinely requires new functionality (e.g. a mobile accordion needs
open/close state that didn't exist before), call this out explicitly to the
user as a functional addition, separate from the recomposition, before doing it.

## Step 2 — Recompose, don't reskin

For the target component:

1. Identify the 2–4 structurally distinct regions of the component (e.g. for
   a footer: brand block, nav links, contact/social, legal bar).
2. For each region, decide its role/weight (primary content vs. secondary
   strip vs. interactive list vs. status indicator) and pick the matching
   radius/surface tier from `references/fern-ui-tokens.md` — don't apply one
   radius or one surface color uniformly everywhere.
3. Look for at least one place to swap a generic decorative element (pipe
   separators, plain inline icons, flat dividers) for one of the Fern
   structural motifs (badge dot, icon-in-a-block, section tag, two-tier
   surface). This is the part that makes it look designed, not just re-themed.
4. Keep the existing DOM/element types where feasible (same tag, same
   component usage) — change classes, wrapper structure, and ordering as
   needed, but don't gratuitously replace e.g. a `<NuxtLink>` with a `<div>`.
5. Route every color/radius/shadow value through the existing token classes
   or CSS variables — never hardcode a hex value or an arbitrary pixel radius
   that isn't one of `--radius-sm/md/lg/pill`.
6. Preserve responsive breakpoints already present (same breakpoint prefixes),
   adjusting layout only as the new composition requires.

## Step 3 — Comments

Any code comment you add or modify while doing this work must be written in
English, regardless of the language used elsewhere in the conversation or in
the surrounding code/copy. This applies to inline comments, block comments,
and template comments (e.g. Vue `<!-- -->`) alike. Don't add comments purely
to narrate obvious markup — reserve them for explaining a non-obvious design
decision (e.g. why a section uses surface-2 instead of surface, why a radius
tier was chosen), the same way the reference footer implementation does.

## Step 4 — Verify functional parity before presenting

Diff your result against the Step 1 contract:
- [ ] All props still present, same names/types/defaults
- [ ] All events/emits unchanged
- [ ] All conditional branches still exist and render the same content
- [ ] All i18n keys, routes, and data bindings untouched
- [ ] No hardcoded colors/radii outside the token system
- [ ] Accessibility attributes preserved or improved, never dropped

If anything fails this check, fix it before presenting the result.

## Step 5 — Running across multiple components

If the user names several components (or says "all the components", "the
ones I choose"), process them one at a time using Steps 1–4 for each, and
briefly summarize per-component what changed structurally (not a full class
diff) so the user can review quickly. Don't silently batch-apply the same
literal class string to every component — each one still needs its own
region/weight analysis per Step 2, since a footer, a card, and a nav bar have
different structural roles even under the same token system.
