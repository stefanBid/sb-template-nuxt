---
agent: agent
description: 'Run a full ESLint check: auto-fix warnings and info, list errors for manual review.'
---

# Workflow — Lint Check

> **Trigger phrase**: "check del lint", "controlla il lint", "il progetto è pulito?", "fai un lint check" or any clearly equivalent phrase.

> **Required mode: Agent.**
> If you do not have access to file system tools (you are in Ask Mode / Chat Mode), reply **only** with:
> "Per eseguire il lint check devo essere in modalità **Agent**. Ri-lancia la richiesta in Agent mode."
> Then stop. Do not attempt the workflow.

---

## Linter context

This project uses **ESLint** with `@nuxt/eslint` and stylistic rules. The full configuration is in `eslint.config.mjs`. Key enforced rules:
- No semicolons, single quotes, trailing commas, 2-space indent
- `vue/attributes-order: alphabetical`
- Max 3 attributes per line in singleline mode, 1 per line in multiline
- `no-console: warn` (errors in production), `no-debugger: error`

**Never silence an issue with `// eslint-disable` comments.** Issues must be fixed in code, not hidden.

---

## Step 1 — Run auto-fix

Run the ESLint auto-fixer to apply all automatically fixable corrections:

```
npm run lint:fix
```

Record which files were modified.

---

## Step 2 — Run full lint check

After auto-fix, run the linter to surface any remaining issues:

```
npm run lint
```

Parse the full output and categorise every diagnostic.

---

## Step 3 — Categorise results

### Category A — Auto-fixed ✅
Issues that were resolved in Step 1 (stylistic formatting, import order, trailing commas, quotes, etc.). List the files touched.

### Category B — Remaining warnings ⚠️
`warning` lines still present after auto-fix. These are **not blocking** but should be addressed. List each one with:
- File path and line number
- Rule name
- Description

### Category C — Errors ❌
`error` lines — **blocking issues**. **Do not attempt to fix these automatically.** List each one with:
- File path and line number
- Rule name
- Description

Present Category C clearly to the user for manual intervention.

---

## Step 4 — Report to the user

Provide a concise summary in Italian:

```
## Risultato lint check

### ✅ Fix applicati automaticamente
- eslint --fix: X file corretti
- (lista dei file modificati)

### ⚠️ Warning rimanenti
- path/to/file.vue:15 — rule-name: Descrizione

### ❌ Errori (intervento richiesto)
- path/to/file.vue:42 — rule-name: Descrizione

### 🎯 Stato finale
Progetto pulito / Progetto con X errori da risolvere
```

If there are **no errors and no warnings** after auto-fix, close with:
> "Il progetto è lint-clean. Nessun intervento manuale richiesto."
