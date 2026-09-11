#!/usr/bin/env bash
# Serve the landing page locally on http://localhost:8000
set -euo pipefail
cd "$(dirname "$0")/.."
exec python3 -m http.server "${1:-8000}"
