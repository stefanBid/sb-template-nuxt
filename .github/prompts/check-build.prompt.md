---
agent: agent
description: 'Run a full build and TypeScript type check: report all blocking errors for manual review.'
---

# Workflow — Build & Type Check

> **Trigger phrase**: "check del build", "verifica il build", "il progetto builda?", "fai un build check" or any clearly equivalent phrase.

> **Required mode: Agent.**
> If you do not have access to file system tools (you are in Ask Mode / Chat Mode), reply **only** with:
> "Per eseguire il build check devo essere in modalità **Agent**. Ri-lancia la richiesta in Agent mode."
> Then stop. Do not attempt the workflow.

---

## Step 1 — TypeScript type check

Run the Nuxt type checker first (faster than a full build):

```
npx nuxt typecheck
```

Parse the output. Collect every type error with:
- File path and line number
- Error code (e.g. `TS2345`)
- Description

If this command is not available (not installed), skip to Step 2.

> **Note:** `vue-tsc` must be kept as a dev dependency to ensure `npx nuxt typecheck` works correctly. Do not remove it from `package.json`.

---

## Step 2 — Production build

Run the full Nuxt production build:

```
npm run build
```

> This compiles both client and server bundles. It will surface import errors, missing modules, SSR incompatibilities, and Vite/Rollup errors that the type checker cannot catch.

Parse the full terminal output. Collect every error with:
- Type: `TypeScript error`, `Vite error`, `Nitro error`, `Module not found`, `SSR error`, or `Other`
- File path (if available)
- Error message

---

## Step 3 — Categorise results

### Category A — TypeScript errors 🔷
Type errors from Step 1. These do not always block the build but indicate type-safety issues.

### Category B — Build errors ❌
Hard errors from Step 2 that prevented the build from completing. These are **blocking** — the app cannot be deployed until they are resolved.

### Category C — Build warnings ⚠️
Non-blocking messages from the build output worth reviewing (chunk size warnings, deprecated API usage, etc.).

---

## Step 4 — Report to the user

Provide a concise summary in Italian:

```
## Risultato build check

### 🔷 Errori TypeScript
- path/to/file.vue:20 — TS2345: Descrizione

### ❌ Errori di build (bloccanti)
- Tipo: Vite error
  File: path/to/file.ts
  Messaggio: Descrizione

### ⚠️ Warning di build
- Descrizione del warning

### 🎯 Stato finale
Build completata con successo / Build fallita — X errori bloccanti da risolvere
```

If the build **completes without errors**, close with:
> "Build completata con successo. Il progetto è pronto per il deploy."

If the build **fails**, close with a clear list of the blocking errors and, where possible, a suggested fix direction (without auto-applying it).
