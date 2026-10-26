# Full static artwork checkpoint — 2026-10-16

## Approved and pending

The developer approved the ticket-booth foreground refinement. It remains in the scene at the same size and position, with the same original foreground mask. The carousel, prize layers and interface placement shown here await developer review.

## Layer structure

`src/js/artwork.js` composes the following between the existing scene plate and booth/foreground:

1. A localized hidden-surface plate, generated with the built-in image_gen tool. Only masked repair regions are exposed; the generated full scene never replaces the approved full background.
2. Three independently masked original carousel horses at their exact original canvas coordinates and scale.
3. One masked original ghost/cat prize pair. These overlap in the reference and remain together for a small bounce or sway; separate toy motion would need further hidden-surface artwork.
4. Fixed original carousel poles, front railing and prize shelf lip, covering the moving pieces at the appropriate depth.

Source pixels come from `assets/sources/artwork/midnight-midway-concept.png`. Human-readable SVG masks are `horse-left-mask.svg`, `horse-center-mask.svg`, `horse-right-mask.svg` and `prize-pair-mask.svg`. `fixed-trim-mask.svg` defines fixed overlaps. `attraction-repair-mask.svg` slightly expands and softens the repair footprint to avoid revealing original subject edges during small offsets. Rebuild the latter with `node tools/build-artwork-masks.mjs` after changing source masks.

No raster pixels are rescaled or regenerated for the new visible horses/prizes. Masks trace their silhouettes; they are intended for small bobbing/lift motions rather than rotation or dramatic travel. The isolated and statically lifted views expose the masks and repairs for review. Small silhouette/background fringes may be apparent under magnification; phone-size acceptance and motion amplitude approval remain with the developer. The original background is still visible beyond the repair footprint, so large translations would require expanding the repair and checking surrounding scenery.

## Interface placement proposal

- A 44 × 44 px circular Play/Pause placeholder at the upper-left of the artwork, over the sky and away from the focal wheel hub, moon and attractions.
- A short, high-contrast hint panel at the bottom center, over the path. Current text is a sample visual hint, not an approved progression or instruction.
- Review controls can hide both placeholders. They are decorative and intentionally have no playback or story behavior; real keyboard-accessible controls will be implemented with the future playback system.
- Tall phone framing retains the complete scene with dark space above and below. Final use of that space for interface placement can be adjusted after review.

## Verification and evidence

Ran the browser check after restarting the preview server with SVG MIME support. The first screenshot run exposed missing masks in the old server process; the verified/final screenshots show the actual extracted pieces. No browser page errors or HTTP failures in the final run. Eight review modes and both comparison pages rendered. Refined UI views at 390 × 844, 375 × 667 and 320 × 568 had no horizontal overflow. Inspected the full assembly, checkerboard and small static-lift screenshots.

Final evidence: `archive/reviews/attractions-v3-final/`. Original and earlier booth screenshots remain preserved. There is no animation, audio, story triggering or playback implementation in this checkpoint. Physical-device verification remains pending.
