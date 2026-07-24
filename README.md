# BLEXX Patrons

A generative collectible-creature forge for the **BLEXX** world. Standalone HTML —
no build tooling required beyond concatenation — that mints winged Patrons,
one per seed, across three Houses, and seals them into a public Registry.
Cute-occult collectible aesthetic, designed for 2-color specialty print.

## Quick start

```bash
./build.sh                 # assembles src/ -> index.html and checks JS syntax
open index.html             # (or just double-click it)
```

Edit the sources in `src/`, then re-run `./build.sh`. **Never edit `index.html`
directly** — it is generated and will be overwritten.

## Layout

```
src/head.html       HTML shell: styles + control panel markup
src/logo-data.js    embedded vector logos (SVG path data, generated)
src/forge.js        the generator engine + Registry wiring (hand-edited logic lives here)
build.sh             concatenates the three into index.html + node --check
index.html           the built, playable forge (served by GitHub Pages)
firebase-config.js   public Firebase web config (safe to publish)
firestore.rules      Registry access rules: public read, create-only
explorations/       static design comps kept for reference (not part of the build)
```

See **CLAUDE.md** for the full design canon (Houses, palettes, ranks, wing system,
chassis rules) and the parked TODO list.

## Deploy

- **Site**: `git push` to `main` — served by GitHub Pages from the repo root.
- **Registry**: `firebase deploy --only firestore:rules` (project `blexx-patrons`).
