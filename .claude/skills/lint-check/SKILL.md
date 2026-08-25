---
name: lint-check
description: Auto-fix and check ESLint status, reporting remaining warnings/errors. Trigger phrases (English or Italian) — "check the lint", "is the project clean?", "check del lint".
---

# Lint check

1. Run `npm run lint:fix`. Note which files were modified.
2. Run `npm run lint`. Categorise remaining diagnostics: **warnings** (non-blocking) and **errors** (blocking — do not auto-fix these, list them for manual review).
3. Never silence an issue with `// eslint-disable` — fix the code.
4. Report files auto-fixed, remaining warnings, remaining errors.
