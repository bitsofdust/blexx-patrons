#!/usr/bin/env bash
# Assemble src/ into index.html (repo root, for GitHub Pages) and
# syntax-check the JS.
set -euo pipefail
cd "$(dirname "$0")"
{
  cat src/head.html
  echo '<script>'
  cat src/logo-data.js
  cat src/forge.js
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > index.html
cat src/logo-data.js src/forge.js > /tmp/_blexx_check.js
if command -v node >/dev/null 2>&1; then
  node --check /tmp/_blexx_check.js && echo "OK  index.html  ($(wc -c < index.html) bytes)"
else
  echo "built index.html  ($(wc -c < index.html) bytes)  [node not found: skipped JS check]"
fi
