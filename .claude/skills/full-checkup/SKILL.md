---
name: full-checkup
description: Run the full project health routine — dependencies, SEO, build, lint, docs — and aggregate the results. Trigger phrases (English or Italian) — "full checkup", "run a full checkup", "checkup completo".
---

# Full project checkup

Orchestrates the checks below in order and aggregates results — doesn't duplicate their logic:

1. Dependency check (the `dependency-check` skill)
2. SEO/GSC readiness check (the `seo-check` skill)
3. Build & type check (the `build-check` skill)
4. Lint check (the `lint-check` skill)
5. If there are blocking errors (build errors or lint errors that can't be auto-fixed): **stop**, report each blocker (file, rule/error type, description), and ask the user to fix them manually before re-running.
6. If no blockers: decide whether `README.md` needs updating (new/updated dependency, new component/page/composable/util, significant config change) and run the `docs-update` skill if so.
7. Final summary: dependencies, SEO, build, lint, docs status, overall result.
