---
name: docs-update
description: Update README.md to match the current codebase (components, composables, pages, config). Trigger phrases (English or Italian) — "update the documentation", "update the README", "aggiorna la documentazione".
---

# Update documentation

1. Read in parallel: `README.md`, `package.json`, `nuxt.config.ts`, `CLAUDE.md`, the full `app/` directory (components, composables, pages, layouts), `i18n/locales/en.json`.
2. Compare the README against the actual codebase: outdated sections, missing sections (new components/composables/pages/conventions), incorrect versions, broken links. Report the differences briefly, then proceed without waiting for approval.
3. Rewrite `README.md` (English), keeping its existing 13-section structure (Overview, Getting Started, Project Structure, Design System, Routing, Layouts, Pages, Components, Composables & Utils, AI Tooling, Deployment, Versioning, Dependencies). Sections **AI Tooling** and **Deployment** are mandatory — always present. Don't invent information; mark unverifiable details as TBD.
4. Confirm what changed and note any TBD sections that need user input.

See the "Documentation sync rule" in the project's root `CLAUDE.md` for when this workflow must run proactively (not just on explicit request).
