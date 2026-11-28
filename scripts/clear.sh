#!/usr/bin/env bash
# clear.sh — Nuxt projects
# Removes everything the project generates locally (all ignored by git): the Nuxt and Nitro build
# outputs and caches, the Nitro dev storage, the Netlify output, node_modules, the test coverage,
# the lint cache, the logs and the macOS .DS_Store files, then cleans the npm cache.
# Never touches .env or the Impeccable design context.
# Run 'npm run si' afterwards to reinstall the dependencies.

set -e

cd "$(dirname "$0")/.."

# .nuxt / .output / dist: Nuxt dev and build outputs
# .nitro / .cache: Nitro and build caches
# .data: Nitro dev storage (useStorage, kv)
# .netlify: Netlify CLI output
# node_modules: dependencies (also holds the Vite and Vitest caches)
# coverage: Vitest coverage report
# logs: log folder
for dir in .nuxt .output dist .nitro .cache .data .netlify node_modules coverage logs; do
  if [[ -e "$dir" ]]; then
    echo "🗑️  Removing '$dir'..."
    rm -rf "$dir"
  fi
done

echo "🗑️  Removing the lint cache, log files and .DS_Store..."
rm -f .eslintcache
find . -maxdepth 1 -type f -name '*.log' -delete
find . -path ./.git -prune -o -type f -name '.DS_Store' -print -delete

echo "🧹 Cleaning the npm cache..."
npm cache clean --force

echo "✅ Done — run 'npm run si' to reinstall the dependencies."
