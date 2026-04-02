---
agent: agent
description: 'Update README.md to reflect the current state of the codebase.'
---

# Workflow — Update Documentation

> **Trigger phrase**: "aggiorna la documentazione", "aggiorna il README", "update docs" or any clearly equivalent phrase.

> **Required mode: Agent.**
> If you do not have access to file system tools (you are in Ask Mode / Chat Mode), reply **only** with:
> "Per aggiornare la documentazione devo essere in modalità **Agent**. Ri-lancia la richiesta in Agent mode."
> Then stop. Do not attempt the workflow.

---

## Step 1 — Read the current state

Read all of the following **in parallel** before writing anything:

- `README.md` — current content
- `package.json` — project name, version, all dependencies
- `nuxt.config.ts` — modules, providers, configuration
- `.github/copilot-instructions.md` — app context, stack, conventions
- `.github/instructions/*.instructions.md` — all sub-context instruction files
- `app/` directory structure (all sub-levels)
- `app/components/` — all Base and The components
- `app/composables/` — all composables
- `app/pages/` — all pages
- `app/layouts/` — all layouts
- `i18n/locales/en.json` — translation key structure

---

## Step 2 — Identify differences

Compare what is documented in `README.md` against the actual codebase. Note:

- Sections that are outdated or no longer accurate
- Missing sections (new components, composables, pages, conventions not yet documented)
- Incorrect version numbers, package versions or stack information
- Broken or missing links

Report the list of differences to the user with a brief summary, then proceed without waiting for approval.

---

## Step 3 — Rewrite README.md

Rewrite `README.md` entirely. Writing language: **English**.

### Required structure

```
# [Project Name]
> One-line description from App context

[Version badge]  [Node badge]  [Nuxt badge]  [TypeScript badge]  [Tailwind badge]

---

## Table of Contents
1. Overview
2. Getting Started
3. Project Structure
4. Design System
5. Components
6. Pages & Routing
7. Composables & Utils
8. i18n
9. AI Tooling — Prompts & Instructions
10. Deployment
11. Dependencies

---

## 1. Overview
[Expanded app context, purpose, tech stack highlights]

## 2. Getting Started
### Prerequisites
### Installation
### Available scripts

## 3. Project Structure
[Annotated directory tree: root config files + app/ directory]

## 4. Design System
### Colours — CSS custom properties
[Table of all --color-app-* tokens with usage]
### Typography — ty-app-* utilities
[Table of all ty-app-* classes with font, size, usage]
### Utility classes — u-app-*
[Table of all u-app-* classes]
### Animations
[Table of named Vue transitions]
### Icons
[How to use @nuxt/icon, available collections]
### Dark mode
[How dark mode works via CSS variables]

## 5. Components
### Base components
[One subsection per Base* component with props table, emits, slots]
### Singleton components (The*)
[One subsection per The* component with props table]
### Creating a new component
[Step-by-step process]

## 6. Pages & Routing
### File-based routing
[File naming → URL mapping table]
### Creating a new page
[Step-by-step process]
### Layouts
[Default layout description, how to override]
### i18n routing
[prefix_except_default strategy explained]

## 7. Composables & Utils
[One subsection per composable with API table]
[One subsection per util function]
### Global TypeScript types
[Table of global interfaces from global.d.ts]

## 8. i18n
### Adding a new translation key
### Adding a new language

## 9. AI Tooling — Prompts & Instructions
[MANDATORY — never omit]
### How GitHub Copilot is configured
### Available prompts
[Table: prompt file | trigger phrase | description]
### How to run a prompt
### Instruction files
[Table: file | applyTo | content]

## 10. Deployment
[MANDATORY — never omit]
### Netlify (default)
### Changing the deployment target
### Environment variables

## 11. Dependencies
[Table: package | version | purpose — split runtime / devDependencies]
```

### Rules

- Every chapter must have a short introductory paragraph before any subsections
- Props tables use three columns: `Prop`, `Type / Default`, `Description`
- Version badges must reflect the current versions in `package.json` and `nuxt.config.ts`
- Do not invent information — if something is not verifiable from the code, omit it or mark it as TBD
- **Sections 9 (AI Tooling) and 10 (Deployment) are mandatory** — always present regardless of what else changes

---

## Step 4 — Write the file

Overwrite `README.md` with the new content.

Then confirm to the user in Italian with:
- A brief summary of what changed
- Any sections marked as TBD that need their input
