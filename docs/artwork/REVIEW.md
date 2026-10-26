# Ticket booth extraction test — 2026-10-16

## Foreground refinement — developer review pending

The developer accepted the selective-layer approach and requested restoration of the booth-base scenery. The preview now places a masked copy of the original reference above the booth: the left foreground pumpkin, vegetation, ground and fog retain their original pixels and coordinates. A soft join above the base and along the right edge blends this foreground into the repaired plate. This is browser compositing, with no new raster generation or alteration to the booth asset, scale or placement.

The hard lower cutoff is hidden by the restored foreground. Original / previous assembly / refined assembly can be compared in `dev/previews/index.html?view=booth`; the previous assembly remains available as a review mode. Original generated assets and earlier screenshots are preserved. Cutout and displaced inspection modes intentionally show the raw extraction without the foreground overlay.

Verification: reran `node tests/browser/visual-check.mjs`; all six review modes and the comparison page rendered without page errors or HTTP failures. Refined views at 390 × 844, 375 × 667 and 320 × 568 had no horizontal overflow. Visually inspected `archive/reviews/booth-refinement-v2/comparison.png`: the original pumpkin is fully visible and the straight cutoff is concealed. Earlier extraction differences above the base remain; this refinement does not claim a pixel-identical booth. No other attraction has been separated or changed.

The observations below describe the first extraction test before this refinement.

## Inputs and outputs

- Original: `assets/sources/artwork/midnight-midway-concept.png`, 941 × 1672. User-supplied visual reference; provenance/usage terms not yet supplied.
- `ticket-booth.png`: transparent booth candidate, 941 × 1672, created with built-in image_gen.
- `midway-clean-plate.png`: opaque repaired scene candidate, 941 × 1672, created with built-in image_gen.
- Exact prompts: `PROMPTS.md`.
- Browser evidence: `archive/reviews/` in the project root.

## Observed results

The cutout has real transparency, confirmed visually over a checkerboard. It preserves the general material, warm lighting and TICKETS lettering, but changes geometry and detail. The generator enlarged/repositioned the booth; CSS applies a uniform 0.76 scale and 13.5% canvas-height translation as a provisional alignment adjustment. This does not make the cutout pixel-identical to the reference.

The repaired plate plausibly continues the left background, but generates new scenery and changes visible detail outside the removed area. It is a review candidate, not a lossless repair.

The reassembled booth has a conspicuous straight bottom edge and lacks the original vegetation/fog overlap. A production version needs a retained foreground occlusion layer and refined edges. Booth interior is still baked into the booth candidate; the window/attendant separation has not been tested yet.

Recommendation: review these candidates before preparing other attractions. If fidelity is insufficient, prefer a layered original or careful manual separation of reference pixels, limiting generated repairs to hidden regions. Do not accept whole-scene regeneration as an exact match.

## Preview verification

`node tests/browser/visual-check.mjs` passed: all three images decoded; all five inspection views rendered; no page errors or HTTP failures. Viewports 390 × 844, 375 × 667 and 320 × 568 had no horizontal overflow. Review-page scrolling is intentional; the artwork itself stays within one fixed composition. Physical-phone verification and developer artwork approval remain pending.

The review uses contain-style framing with dark bars on tall phone proportions, preserving the attractions. Interface placement within the finished experience remains unapproved; review controls are outside the scene.
