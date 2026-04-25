---
agent: agent
description: 'Run a full project health checkup: dependencies, SEO, build, lint — and optionally update docs.'
---

# Workflow — Full Project Checkup

> **Trigger phrase**: "checkup completo", "full checkup", "fai un checkup del progetto", "controlla tutto" or any clearly equivalent phrase.

> **Required mode: Agent.**
> If you do not have access to file system tools (you are in Ask Mode / Chat Mode), reply **only** with:
> "Per eseguire il checkup completo devo essere in modalità **Agent**. Ri-lancia la richiesta in Agent mode."
> Then stop. Do not attempt the workflow.

---

## Overview

This workflow orchestrates the four specific check prompts in order, collects all their results, and then:
1. Decides whether to update the documentation
2. Stops and asks you to fix blockers first if there are blocking errors

**This prompt does not duplicate logic.** It delegates to the existing prompts and aggregates their outcomes.

---

## Step 1 — Dependencies check

Follow the full workflow defined in `check-dependencies.prompt.md`.

Record the outcome:
- List of packages auto-updated (name + old → new version)
- List of packages needing manual attention
- Vulnerability status

---

## Step 2 — SEO / GSC check

Follow the full workflow defined in `check-gsc.prompt.md`.

Record the outcome:
- `sitemap.xml` status (valid / issues found)
- `robots.txt` status
- Global meta tags status
- Per-page `useHead` / `useSeoMeta` issues, if any

---

## Step 3 — Build check

Follow the full workflow defined in `check-build.prompt.md`.

Record the outcome:
- TypeScript errors (Category A)
- Build errors — blocking (Category B)
- Build warnings (Category C)

---

## Step 4 — Lint check

Follow the full workflow defined in `check-lint.prompt.md`.

Record the outcome:
- Files auto-fixed
- Remaining warnings
- Remaining errors — blocking

---

## Step 5 — Evaluate blockers

After all four checks, evaluate the full results.

### If there are blocking errors (build errors or lint errors that could not be auto-fixed):

> Stop the workflow. Report clearly to the user:
> "Ci sono problemi bloccanti che non posso risolvere autonomamente. Correggili manualmente e poi richiedi 'full checkup' di nuovo."

List each blocker with: file path, rule / error type, description.

**Do not proceed to Step 6 if there are blockers.**

---

## Step 6 — Decide whether to update documentation

After the version bump, evaluate whether the README needs updating:

**Update documentation if any of the following changed:**
- A new dependency was added or a major one was updated
- A new component, page, composable or utility was added
- Project configuration changed significantly (new module, new route rule, etc.)
- The version badge needs reflecting a new state

**Skip documentation update if:**
- Only patch-level dependency bumps occurred (e.g. `^10.1.0` → `^10.2.0`)
- Only auto-fix lint corrections were applied with no structural changes
- Only SEO meta tag values were corrected

If the documentation should be updated, follow the workflow defined in `update-docs.prompt.md`.

If not, explicitly state:
> "La documentazione non richiede aggiornamenti per le modifiche effettuate in questo checkup."

---

## Step 7 — Final summary report

Provide a concise final report in Italian:

```
## Risultato Full Checkup

### 📦 Dipendenze
- <esito sintetico>

### 🔍 SEO / GSC
- <esito sintetico>

### 🏗️ Build
- <esito sintetico>

### 🧹 Lint
- <esito sintetico>

###  Documentazione
- Aggiornata / Non richiede aggiornamenti

### 🎯 Stato finale
Checkup completato con successo. Il progetto è pronto.
```

If the workflow was stopped due to blockers, replace the final status with:
> "⛔ Checkup interrotto — ci sono problemi bloccanti da risolvere manualmente prima di procedere."
