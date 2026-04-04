#!/usr/bin/env bash
# safe-install.sh
# On the 'main' branch: runs 'npm ci' (read-only, no package-lock.json mutation).
# On any other branch: runs 'npm install' (allows adding/updating packages).

set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

if [[ "$BRANCH" == "main" ]]; then
  echo "⚠️  Branch 'main' detected — 'npm install' is not allowed here."
  echo "➡️  Running 'npm ci' instead..."
  npm ci "$@"
else
  echo "ℹ️  Branch: '$BRANCH' — running 'npm install'..."
  npm install "$@"
fi
