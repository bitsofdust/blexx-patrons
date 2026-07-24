# BLEXX Angel Forge

A generative collectible-creature forge for the **BLEXX** world. Standalone HTML —
no build tooling required beyond concatenation — that mints winged "little beings,"
one per seed, across three Houses. Cute-occult collectible aesthetic, designed for
2-color specialty print.

## Quick start

```bash
./build.sh                 # assembles src/ -> dist/index.html and checks JS syntax
open dist/index.html       # (or just double-click it)
```

Edit the sources in `src/`, then re-run `./build.sh`. **Never edit `dist/index.html`
directly** — it is generated and will be overwritten.

## Layout

```
src/head.html       HTML shell: styles + control panel markup
src/logo-data.js    embedded vector logos (SVG path data, generated)
src/forge.js        the generator engine (hand-edited logic lives here)
build.sh            concatenates the three into dist/index.html + node --check
dist/index.html     the built, playable forge
explorations/       static design comps kept for reference (not part of the build)
```

See **CLAUDE.md** for the full design canon (Houses, palettes, ranks, wing system,
chassis rules) and the parked TODO list.

## Put it on GitHub (optional)

This download is already a git repo with history. To push it to your own remote:

```bash
# with the GitHub CLI:
gh repo create blexx-angel-forge --private --source=. --push

# or manually, after creating an empty repo on github.com:
git remote add origin git@github.com:<you>/blexx-angel-forge.git
git push -u origin main
```
