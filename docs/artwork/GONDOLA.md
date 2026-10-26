# Right-hand Ferris wheel carriage refinement — 2026-10-16

Developer requested matching the other gondolas' structure/style while preserving position and surrounding scene, retaining only a subtle mysterious glow.

## Output and integration

- Generated candidate: `assets/artwork/gondola-style-v2.png`, edited from `assets/artwork/midway-clean-plate.png` with the built-in image_gen tool.
- Integration: `assets/masks/gondola-patch-mask.svg` exposes only the local carriage footprint. All other pixels continue to come from the existing assembled scene.
- The original reference, scene plate, booth, horse/prize assets and earlier screenshots remain preserved.
- `dev/previews/index.html?view=carriage` shows the same assembled scene with the patch off and on. Main phone preview and full-scene review display the updated carriage. Historical booth comparisons remain unchanged.

The revised carriage has a dark peaked canopy, slender posts, open sides and a burgundy half-height basket. Its strong yellow enclosure is replaced by dark open gaps and restrained amber highlights. Location and scale are retained; a faint figure remains in the generated candidate despite the prompt asking to remove it. This does not affect the developer's requested structural change and retains the mysterious character.

## Verification

`node tests/browser/check-carriage.mjs` passed. Visually inspected the native-resolution detail and before/after phone composition. Pixel comparison of the same rendered scene with the patch hidden/shown found 1,716 changed pixels inside the carriage inspection rectangle and **zero changed pixels outside** it. The source-coordinate inspection rectangle is x=650..775, y=350..490 on the 941 × 1672 scene; the actual patch is tighter and follows the carriage footprint.

No browser errors or HTTP failures. Phone previews at 390 × 844, 375 × 667 and 320 × 568 had no horizontal overflow. Evidence: `archive/reviews/carriage-v4/`, including `checks.json`, before/after screenshots and close-up. Developer visual approval remains pending. No motion, audio or story behavior was added.

## Exact prompt

+Use case: precise-object-edit.
Edit target: attached midnight midway background plate, original portrait framing 941 × 1672.
Change ONLY the brightly enclosed Ferris wheel gondola on the far right at the wheel's three-o'clock position, centered approximately (714, 419), occupying roughly x=655..764 and y=358..481. This is the glowing cabin BELOW the dark gondola near (660, 275).
Make this one gondola match the other wheel gondolas: same weathered burgundy/purple carved half-height basket, curved faceted underside, narrow dark slender posts, small dark peaked canopy with ragged fabric, OPEN sides above the waist-high basket. It must read as the same family of open carnival carriages as the gondolas at upper left and upper right, not a glass lantern, box, enclosed cabin or house.
Keep its existing center, suspension attachment, overall scale and camera perspective. Reduce the bright yellow enclosed panes to a faint low amber glow coming from deep inside the open basket. Upper open gaps should be predominantly dark blue-violet, with background visible, not glowing glass. Remove the conspicuous figure silhouette. Retain restrained warm highlights on the basket edge.
Preserve all surrounding wheel rim, spokes, bulbs, flags, attachment bars, sky, clouds, other gondolas and the ENTIRE rest of the scene unchanged. No zoom, crop, global light/color changes or redesign. Output opaque full portrait image at identical framing; this will be applied only as a tightly masked localized patch.
