---
agent: agent
description: 'Bump the project to a new version: update package.json, README badges and CHANGELOG.'
---

# Workflow — Version Bump

> **Trigger phrase**: "aggiornami il progetto alla versione X.Y.Z" or any clearly equivalent phrase containing a version number.

> **Required mode: Agent.**
> If you do not have access to file system tools (you are in Ask Mode / Chat Mode), reply **only** with:
> "Per fare il bump della versione devo essere in modalità **Agent**. Ri-lancia la richiesta in Agent mode."
> Then stop. Do not attempt the workflow.

---

## Step 1 — Read current state

Read in parallel:
- `package.json` — extract the current `version` field (e.g. `2.3.1`)
- `README.md` — locate all version badges
- `CHANGELOG.md` — read the top section to understand the current format

The **new version** is the one provided by the user in the trigger phrase (e.g. `2.4.0`).

Parse the current and target versions into their semver parts (major, minor, patch) to determine the bump type:
- Same major + same minor → `patch`
- Same major + different minor → `minor`
- Different major → `major`

---

## Step 2 — Detect changes

Run the following commands to gather change information:

```
git log --oneline -20
git status --short
```

Compile a list of detected changes grouped by type:
- **Features** — new pages, components, composables, routes
- **Changed** — existing components updated or refactored
- **Fixed** — bugs resolved
- **Dependencies** — packages added, removed or updated in `package.json`
- **Configuration** — changes to `nuxt.config.ts`, ESLint, CI, etc.

---

## Step 3 — Present changes for approval

Show the user the detected changes and the proposed CHANGELOG entry **before writing anything**:

```
## [X.Y.Z] — YYYY-MM-DD

### Features
- …

### Changed
- …

### Fixed
- …
```

Ask the user:
- Are these changes correct and complete?
- Are there any entries to add, remove or rephrase?

**Wait for explicit approval before proceeding to Step 4.**

---

## Step 4 — Apply all changes

Once the user confirms, apply all changes.

### 4a. Update `package.json`

Edit the `version` field in `package.json` directly:

```json
"version": "X.Y.Z"
```

Then run to sync the lock file:
```
npm install --package-lock-only
```

### 4b. Update `CHANGELOG.md`

Prepend a new entry at the top of the changelog (below the `# Changelog` heading) following the Keep a Changelog format:

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Features
- Description of new feature

### Changed
- Description of change

### Fixed
- Description of fix
```

Use today's date in `YYYY-MM-DD` format. Only include sections that have entries.

### 4c. Update version badges in `README.md`

Find all version-related badges (e.g. `![Version](...)`, `![Nuxt](...)`, `![Node.js](...)`) and update any that reference the old version string to the new one.

If a generic version badge exists, update it:
```markdown
![Version](https://img.shields.io/badge/version-X.Y.Z-blue)
```

---

## Step 5 — Confirm to the user

Provide a concise confirmation in Italian:
- New version applied
- Files updated (`package.json`, `CHANGELOG.md`, `README.md`)
- CHANGELOG entry written
