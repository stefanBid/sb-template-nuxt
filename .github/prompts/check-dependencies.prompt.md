---
agent: agent
description: 'Check for outdated packages, auto-update safe ones, report breaking changes and audit vulnerabilities.'
---

# Workflow — Dependency Check & Update

> **Trigger phrase**: "verifichiamo le dipendenze", "aggiorna le dipendenze", "check delle dipendenze" or any clearly equivalent phrase.

> **Required mode: Agent.**
> If you do not have access to file system tools (you are in Ask Mode / Chat Mode), reply **only** with:
> "Per eseguire il check delle dipendenze devo essere in modalità **Agent**. Ri-lancia la richiesta in Agent mode."
> Then stop. Do not attempt the workflow.

---

## Context

This project uses **npm** with a `package.json` at the root. Dependencies are split into `dependencies` (runtime) and `devDependencies` (build/tooling only). Version constraints use the `^` caret — meaning minor and patch updates are allowed within the declared major.

**This is a delicate process.** Never auto-update a package with a major version bump without first verifying it does not break the project's current configuration. When in doubt, report it and let the user decide.

---

## Step 1 — Read current dependencies

Read `package.json` to get the full list of `dependencies` and `devDependencies` with their declared version constraints and the `engines.node` field.

---

## Step 2 — Check for outdated packages

Run:

```
npm outdated
```

Parse the full output. For each outdated package, note:
- **Current** — version currently installed
- **Wanted** — latest version matching the declared `^` constraint (safe by semver)
- **Latest** — absolute latest published version

---

## Step 3 — Categorise updates

For each outdated package, classify it into one of two categories:

### Safe to update automatically ✅
Criteria: the **Latest** version has the **same major** as the currently declared constraint (minor or patch bump only, e.g. `^1.x` → `^1.y`). These follow semantic versioning and should not contain breaking API changes.

Additionally, use `fetch_webpage` to do a **quick documentation check** on the package's changelog or release notes before applying the update. Specifically look for:
- New required configuration options
- Renamed or removed APIs used in the project
- Changes to peer dependencies (especially `nuxt`, `vue`, `vite`)

If the docs check reveals a breaking concern for this project, **move the package to the "needs attention" category** even if the major version is the same.

Relevant changelogs to check:
| Package | Changelog URL |
|---|---|
| `nuxt` | https://github.com/nuxt/nuxt/releases |
| `vue` | https://github.com/vuejs/core/blob/main/CHANGELOG.md |
| `@nuxtjs/i18n` | https://github.com/nuxtjs/i18n/releases |
| `@nuxtjs/color-mode` | https://github.com/nuxt-modules/color-mode/releases |
| `@nuxt/icon` | https://github.com/nuxt/icon/releases |
| `@nuxt/image` | https://github.com/nuxt/image/releases |
| `@nuxt/eslint` | https://github.com/nuxt/eslint/releases |
| `@vueuse/nuxt` | https://github.com/vueuse/vueuse/releases |
| `@floating-ui/vue` | https://github.com/floating-ui/floating-ui/releases |
| `tailwindcss` | https://github.com/tailwindlabs/tailwindcss/releases |

For packages not in the list, use `https://www.npmjs.com/package/[package-name]?activeTab=versions` or the GitHub repo if known.

### Needs your attention ⚠️
Criteria: the **Latest** version has a **different major** than the currently declared constraint (e.g. currently `^3.x`, latest is `4.x`), **or** the docs check revealed a concern. These may include removed APIs, new required configuration, peer dependency conflicts or migration steps.

---

## Step 4 — Apply safe updates

For each package in the "safe" category, **edit `package.json` directly**: update the version constraint to the Latest version using the `^` caret (e.g. `"^1.2.0"` → `"^1.5.0"`).

Do **not** run `npm update` as a substitute — it only changes `package-lock.json` without updating the declared constraints in `package.json`.

After all constraints are updated, run:

```
npm install
```

This resolves and locks the new versions in `package-lock.json`.

---

## Step 5 — Vulnerability check

Run the full audit chain in order:

### 5a. Check funding requests
```
npm fund
```
Note which packages have funding requests. These are informational only — no action required.

### 5b. Audit vulnerabilities
```
npm audit
```
Parse the output and classify each vulnerability:
- **Severity**: `critical`, `high`, `moderate`, `low`
- **Package**: the affected package name
- **Via**: the dependency path (direct or transitive)
- **Fix available**: whether `npm audit fix` can resolve it

### 5c. Auto-fix resolvable vulnerabilities
```
npm audit fix
```
This resolves vulnerabilities that can be fixed within the allowed semver range. Note which packages were patched.

> ⛔ **NEVER run `npm audit fix --force`. EVER. Under any circumstances.**
> `--force` bypasses semver constraints and can silently introduce breaking major version bumps across the entire dependency tree. If a vulnerability can only be resolved with `--force`, **stop**, report it to the user with full details (package name, advisory URL, severity), and let the user decide.

After `npm audit fix`, run `npm audit` again to capture the final state.

---

## Step 6 — Final report

Provide a concise report in Italian with the following sections:

---

### 📦 Aggiornamenti applicati automaticamente
| Pacchetto | Vecchia versione | Nuova versione | Note |
|---|---|---|---|
| … | … | … | … |

If none: "Nessun aggiornamento applicato — tutte le dipendenze erano già all'ultima versione compatibile."

---

### ⚠️ Aggiornamenti che richiedono la tua attenzione
| Pacchetto | Versione attuale | Ultima versione | Perché non auto-aggiornato |
|---|---|---|---|
| … | … | … | Major bump / breaking change rilevato |

For each package in this list, include:
- A brief description of the breaking change or concern
- The changelog URL

If none: "Nessun aggiornamento critico da segnalare."

---

### 🔒 Vulnerabilità

#### Risolte automaticamente con `npm audit fix`
| Pacchetto | Severità | CVE / Advisory |
|---|---|---|
| … | … | … |

#### Rimanenti (non risolvibili automaticamente)
| Pacchetto | Severità | Dipendenza | Motivo del blocco |
|---|---|---|---|
| … | … | diretta / transitiva | `--force` richiesto / dipende dagli sviluppatori del pacchetto |

Indicate clearly for each remaining vulnerability whether:
- **Dipende da te**: it's a direct dependency you can update or replace
- **Dipende dagli sviluppatori**: it's a transitive dependency — a fix must come from the upstream package maintainers

If no vulnerabilities: "Nessuna vulnerabilità rilevata. Il progetto è pulito."

---

### 💰 Funding
List packages with funding requests, if any. No action required unless you wish to support the maintainers.
