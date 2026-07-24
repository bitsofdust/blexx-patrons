# BLEXX Angel Forge — working notes for Claude Code

Generative collectible-creature forge for the BLEXX world. A single standalone
HTML app that mints winged "little beings," one per seed, across three Houses.
Cute-occult collectible aesthetic. Intended for 2-color specialty print (letterpress
/ spot color), with foil and NFC as chase/finish layers.

## Build & run
- `./build.sh` concatenates `src/head.html` + `src/logo-data.js` + `src/forge.js`
  into `dist/index.html`, then runs `node --check` on the JS.
- Zero dependencies, no bundler. `dist/index.html` opens directly in a browser.
- **Edit `src/` only.** `dist/` is generated — never hand-edit it.

## Source files
- `src/head.html` — HTML shell: CSS (design tokens as CSS vars), control-panel
  markup (House select, Sigil/Relic finish, Reroll, Single/9-up, seed lock, legend).
  Ends *before* the inline `<script>`; build.sh injects the tag.
- `src/logo-data.js` — embedded vector logos as SVG path data:
  `LOGO_VB` (viewBoxes), `LOGO_D` (path `d` strings: blexx crown + 3 House
  wordmarks), `LOGO_BB` (glyph content bounding boxes), `LOGO_TARGET_H` (shared
  wordmark glyph height ≈ 10.91, so all House wordmarks render at one cap height).
  Regenerate with `svgpathtools` if the logo SVGs change.
- `src/forge.js` — the generator. Ends at `render();`; build.sh closes the tags.

## Design canon (locked — confirm with Dusty before changing)

Three Houses. Each House's **sigil shape echoes three times**: in the head, the
body, and the wing.

| House          | shape    | wing    | topper | ground (bg) | figure ink |
|----------------|----------|---------|--------|-------------|------------|
| Chance         | triangle | pointed | nubs   | #ed2024 red | #ebe71e yellow |
| Manifestation  | circle   | round   | spark  | #405eab blue| #71ccd4 cyan   |
| Devotion       | square   | square  | halo   | #882782 purple | #ee1f42 crimson |

Lighter tone = figure ink, darker = ground. Grooves/veins cut to the ground color.
Two spot colors per card.

**Rank ladders** (5 rungs common→rare; geometric 0.6 falloff ≈ 43/27/15/9/5%):
- Chance: Quirk · Charm · Imp · Oracle · Fortune
- Manifestation: Spark · Cog · Gizmo · Engine · Dynamo
- Devotion: Wisp · Halo · Cherub · Idol · Seraph

**Names**: procedural cute-occult portmanteaus with House-flavored suffixes, seeded
off a separate stream (`seed ^ 0x5f3759df`). ROOTS = occult words + Goetic-derived
stems. Seam-dedupe prevents doubled letters. Each being also carries a legions count
(kept in data, **not** shown on the card face) and a code `A-<base36(seed)>`.

**Chassis**: one normalized standing skeleton for every House — small head (House
shape, with a face: two eyes + grin) + body (House shape) + neck + two straight legs
to a plinth (no feet) + paired wings + topper. Head and body carry a ground-colored
**knockout stroke** (`paint-order="stroke"`) so they sit clearly in front of the
wings. All shapes are normalized to height `2r` so the three Houses read the same
height.

**Wing system** — three independent dials:
- *shape*: FIXED by House (pointed / round / square)
- *size*: ROLLABLE — none / tiny / small / large (weighted 8 / 20 / 40 / 32;
  "none" is the rare wingless variant)
- *texture*: ROLLABLE — straight / web / dotted / solid
  ("web" = fly-wing venation: radial veins plus cross-veins forming cells)

**Card face** shows ONLY: BLEXX crown (top), the creature, name (rounded font),
rank (uppercase), House wordmark (bottom). Legions, edition, and seed are **not** on
the face — they live in the meta readout line and the SVG `<desc>`. Card viewBox is
`0 0 240 360`. Wordmark font is Quicksand (Google Fonts), standing in for the
intended Urbane Rounded.

**Finishes**:
- Sigil — standard House 2-color.
- Relic — silver-gradient ink on bone (#E9E6DC), groove #3b382f (chase).
- FLUX — rare (~14%) fluoro-on-jet recolor (chase).

## Forge internals
- PRNG: `mb32`. `derive(seed, forcedHouse)` deterministically produces every
  parameter (House, flux, wing size/texture/rib-count, name, rank, legions, code, ed).
- `colorsFor(p, finish)` resolves the palette (incl. Relic silver + FLUX).
- `card(...)` renders one 240×360 SVG; `drawFigure(...)` draws the creature.
- Controls: House (All/Chance/Manifestation/Devotion), Finish, Reroll, Single vs
  9-up press sheet, Seed lock (reproduce any being by its seed).

## Parked TODO
- Widen + House-flavor the name ROOTS bank so a fixed 72-being roster (24/House)
  doesn't repeat.
- Roster-minting view: turn locked seeds into a numbered catalog / contact sheet
  (grimoire model — fixed finite pantheon; Standard/FLUX/Relic as variant printings
  = the rarity layer).
- Possible tweaks: round the square wing's corners if it reads too blocky; thicken
  "web" veins if too faint; decide whether wingless "none" stays rare.
- Production: 2-color letterpress/spot cards, foil/Relic chase, NFC.
