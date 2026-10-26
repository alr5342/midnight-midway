# Painted midway props — 2026-10-23

Generated with the built-in image_gen tool using the Developer-approved `assets/sources/artwork/midnight-midway-concept.png` as a style/lighting reference. Both outputs have real transparent pixels; no original scene raster was overwritten. Previous SVG versions remain in the project.

Saved assets:

- `assets/story/bell-painted-v1.png` — 1457 × 1079, transparent painted service bell. Runtime keeps the approved size, location, active-clock sway and fixed touch area.
- `assets/story/music-paper-painted-v1.png` — 1536 × 1024, transparent blank weathered paper. The ground and inspector use the same painted image. Code supplies exact four-note notation, without words or positional labels. Ground perspective, subdued night lighting and a short contact shadow are applied in CSS; foreground fog passes over it.

Original horses were NOT generated. `assets/artwork/horse-left.png`, `horse-center.png` and `horse-right.png` contain original reference pixels, extracted through the approved masks by `tools/prepare-horse-layers.mjs`. Their full scene-sized transparent canvases preserve alignment. The existing hidden plate and fixed poles/railing are retained.

## Bell prompt (verbatim)

Use case: illustration-story, style-transfer. Asset type: transparent 2D game prop, one old brass desk/service bell for the ticket booth in the supplied haunted midway painting. The input image is STYLE AND LIGHTING REFERENCE ONLY; do not reproduce the park. Paint a single recognisable low domed brass service bell with a small push knob and a dark tarnished oval foot, seen from slightly above in three-quarter frontal perspective. Match the reference's brush-painted storybook surfaces, softly worn edges, deep violet-brown shadows and restrained amber lamplight from above-left; dull antique brass, subtle grime and uneven hand-painted reflections, no polished metallic vector sheen. Its silhouette is wider than tall (about 1.35:1). Isolate the complete bell with a tight transparent margin; no counter, scenery, text, frame, labels, icons, logos or decorative UI. True transparent background. This is an object to blend into the illustrated booth, not a modern product photo.

## Blank paper prompt (verbatim)

Use case: illustration-story, style-transfer. Asset type: transparent 2D game prop, one small weathered scrap of old manuscript paper for the ground near the carousel in the supplied haunted midway painting. The input image is STYLE AND LIGHTING REFERENCE ONLY; do not reproduce the park. Paint ONE roughly rectangular landscape scrap with irregular slightly torn edges, a few believable creases, old ochre-grey fibers, faint water stains and subtly curled corners. Painterly storybook texture, subdued amber light from above-left and cool violet shadows, restrained value and saturation so it can lie on a dark wet path without glowing. View the paper nearly face-on, about 1.5:1 aspect, so it can be tilted into ground perspective by the game. Surface must be BLANK: NO text, NO staff lines, NO music notes, NO symbols; exact musical notation will be added separately. Isolate the complete scrap with a tight truly transparent margin. No ground, scenery, extra props, border, UI, letters or watermark.
