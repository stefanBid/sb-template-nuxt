---
name: build-check
description: Run the Nuxt type check and production build, and categorize any errors. Trigger phrases (English or Italian) — "check the build", "does the project build?", "check del build".
---

# Build & type check

1. Run `npx nuxt typecheck` (requires `vue-tsc` as a dev dependency — never remove it). Collect every type error (file, line, error code, description).
2. Run `npm run build`. Collect every error (type: TypeScript / Vite / Nitro / Module not found / SSR / Other; file; message).
3. Categorise: **TypeScript errors** (may not block the build but indicate type-safety issues), **Build errors** (blocking — hard failures), **Build warnings** (non-blocking, worth reviewing).
4. Report each category concisely. On failure, suggest a fix direction without auto-applying it.
