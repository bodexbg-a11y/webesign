#!/usr/bin/env bash
# Build and serve the site locally on http://localhost:8000
set -euo pipefail
cd "$(dirname "$0")/.."
node build.mjs
cd dist
exec python3 -m http.server "${1:-8000}"
