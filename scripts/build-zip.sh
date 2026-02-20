#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"

mkdir -p "$DIST_DIR"

OUT="$DIST_DIR/deshort-chrome-webstore.zip"
rm -f "$OUT"

# Zip only runtime files (exclude .git, dist, scripts)
cd "$ROOT_DIR"
zip -r "$OUT" \
  manifest.json \
  content \
  icons \
  -x "*.DS_Store" \
  -x "content/*.map" \
  -x "**/.git/**" \
  -x "dist/**" \
  -x "scripts/**" \
  >/dev/null

echo "$OUT"
