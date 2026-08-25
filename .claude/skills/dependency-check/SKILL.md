---
name: dependency-check
description: Check for outdated/vulnerable npm dependencies and safely auto-update minor/patch bumps. Trigger phrases (English or Italian) — "check dependencies", "update dependencies", "verifichiamo le dipendenze".
---

# Dependency check & update

This is a delicate process — never auto-update a package with a major version bump without verifying it won't break the project.

1. Read `package.json` for current `dependencies`/`devDependencies` and `engines.node`.
2. Run `npm outdated`. For each outdated package, note Current / Wanted / Latest.
3. Classify:
   - **Safe to auto-update**: Latest has the same major as the declared constraint (minor/patch only). Do a quick changelog/release-notes check first for new required config, renamed/removed APIs used in this project, or peer-dependency changes (especially `nuxt`, `vue`, `vite`) — if a concern surfaces, move it to "needs attention" even with the same major.
   - **Needs attention**: Latest has a different major, or the changelog check revealed a concern.
4. For safe updates, edit `package.json` directly (update the `^` constraint) — don't rely on `npm update` alone, it doesn't touch declared constraints. Then run `npm run si`.
5. Vulnerability check: `npm fund` (informational), `npm audit` (classify severity/package/via/fix-availability), `npm audit fix` (auto-resolve what's within semver range). **Never run `npm audit fix --force`** — it can silently introduce breaking major bumps. If a vulnerability needs `--force`, stop and report it (package, advisory, severity) for the user to decide. Re-run `npm audit` after fixing to confirm final state.
6. Report: auto-updated packages (old → new version), packages needing attention (with reason + changelog link), vulnerabilities resolved vs remaining (and whether the fix depends on this project or on upstream maintainers), funding notices.
