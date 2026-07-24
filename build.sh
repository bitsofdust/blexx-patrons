#!/usr/bin/env bash
# Assemble src/ into dist/index.html and syntax-check the JS.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist
{
  cat src/head.html
  echo '<script>'
  cat src/logo-data.js
  cat src/forge.js
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > dist/index.html
cat src/logo-data.js src/forge.js > /tmp/_blexx_check.js
if command -v node >/dev/null 2>&1; then
  node --check /tmp/_blexx_check.js && echo "OK  dist/index.html  ($(wc -c < dist/index.html) bytes)"
else
  echo "built dist/index.html  ($(wc -c < dist/index.html) bytes)  [node not found: skipped JS check]"
fi
