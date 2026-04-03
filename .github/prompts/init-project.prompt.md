---
agent: agent
description: 'Initialise this template repo for a new project: update name, global rules, app context and instruction files.'
---

# Workflow — Project Initialisation

> **Required mode: Agent.**
> If you do not have access to file system tools (you are in Ask Mode / Chat Mode), reply **only** with:
> "Per eseguire l'inizializzazione del progetto devo essere in modalità **Agent**. Ri-lancia la richiesta in Agent mode."
> Then stop. Do not attempt the workflow.

---

## Step 1 — Collect information

Use `vscode_askQuestions` to ask all four questions **in a single call**:

1. **Username** — Are you still the *Signore della UI*? If not, what name should I use?

2. **Global rules** — Re-read `.github/copilot-instructions.md`.
   Are there any global rules to add, change or remove compared to the template version?
   (If there are no changes, write "no changes".)

3. **Project name** — What is the new project called? (e.g. `MyApp`, `RecipeBook`, `ShopDashboard`)

4. **App context** — Describe briefly what the app does and who it is for (2–4 sentences max). This will be stored as permanent context and used to give you more relevant UI, UX and technical suggestions. (e.g. "A recipe management app for home cooks. Users browse recipes, filter by ingredient and save favourites. The visual style should feel warm and food-oriented.")

Do not proceed until you have received answers to all four questions.

---

## Step 2 — Apply configuration changes

### 2a. Update the username in `copilot-instructions.md`

If the username has changed, replace in `.github/copilot-instructions.md`:
- The `## Identifier name:` line with the new identifier
- Every occurrence of `Signore della UI` / `Signore delle UI` with the new name

### 2b. Add / modify global rules in `copilot-instructions.md`

If the user has provided new rules, add them to the appropriate section of the file without deleting existing ones unless explicitly requested.

### 2c. Save the app context in `copilot-instructions.md`

Add (or replace if already present) the `## App context` section at the very top of `.github/copilot-instructions.md`, right after the heading line, with the text provided by the user. Example:

```markdown
## App context

A recipe management app for home cooks. Users browse recipes, filter by ingredient and save favourites. The visual style should feel warm and food-oriented.
```

This section is used as persistent domain context: refer to it whenever making UI, UX or architectural suggestions to keep them aligned with the app's purpose and audience.

---

### 2d. Reset the project version

In `package.json`, set the version to `1.0.0`:

```json
"version": "1.0.0"
```

Also reset the version badge in `README.md` to `1.0.0` if a badge is present.

---

### 2e. Reset the CHANGELOG

- Open `CHANGELOG.md`
- Delete all existing entries and sections
- Replace the entire content with a clean skeleton:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release.
```

Replace `YYYY-MM-DD` with today's actual date.

---

### 2f. Rename and re-describe the project

Starting from the provided name (e.g. `RecipeBook`), apply these changes:

| File | Field | Value |
|---|---|---|
| `package.json` | `"name"` | kebab-case of the name (e.g. `recipe-book`) |
| `package.json` | `"description"` | A short one-line description — ask the user if unclear |
| `nuxt.config.ts` | `og:site_name` content | The name as-is (e.g. `RecipeBook`) |
| `README.md` | Main `#` heading and tagline | The name as-is + updated tagline |

> Always use `read_file` before editing to find the exact string to replace.

---

## Step 3 — Analyse the `app/` directory

Analyse the entire `app/` directory structure, reading relevant files in parallel:

```
app/
  assets/css/    → design system tokens, theme, typography, utilities, animations
  components/    → Base* and The* components
  composables/   → useAppNotifications, useFloatingUi, useLockScroll, useSanitize + any new ones
  layouts/       → default.vue + any new layouts
  pages/         → index.vue + any new pages
  types/         → global.d.ts
  utils/         → blocksToHtml, generateUuid + any new utils
```

For each area, verify that the corresponding **instruction file** is up to date:

| Directory / file | Instruction file |
|---|---|
| `app/assets/css/` + any `*.vue` | `.github/instructions/design-system.instructions.md` |
| `app/components/` | `.github/instructions/components.instructions.md` |
| `app/pages/`, `app/layouts/` | `.github/instructions/pages-layouts.instructions.md` |
| `app/composables/`, `app/utils/`, `app/types/` | `.github/instructions/composables-utils.instructions.md` |
| `nuxt.config.ts`, `package.json` | `.github/instructions/project-config.instructions.md` |

### What to check for each instruction file

- Are there **new components** in `app/components/` not documented in the instruction?
- Are there **new composables or utils** not listed in the composables-utils instruction?
- Are there **new CSS tokens** in `theme.css` / `typography.css` / `utilities.css` missing from the design-system instruction?
- Are there **new pages or layout patterns** not covered by the pages-layouts instruction?
- Are there **obsolete entries** mentioned in the instructions but no longer present in the code?
- Does the **project deviate** from the stack or conventions described in `copilot-instructions.md`?

### What to do

- **Update** the instruction files to add or remove sections based on the actual state of `app/`
- **Do not delete** general rules or design system tokens if they are still valid
- **Report** any relevant discrepancy to the user before applying changes to instruction files (a brief list is enough), then proceed

---

## Step 4 — Final report

At the end, provide a concise report in Italian with:

- Username set
- App context saved
- Project name and description set
- Files renamed / updated (with the exact changes made)
- Instruction files modified and their main changes
- Any inconsistencies found but not automatically resolved (things that require user intervention)
