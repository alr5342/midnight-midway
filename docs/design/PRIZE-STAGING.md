# Prize-stall visual staging

## Scope and approval

The Developer selected the three-can knockdown game: three stacked cans, two beanbags, and an aiming discovery supported by dents, scuffs and a weathered sign. Use reliable phone controls rather than complex physics. This checkpoint stages only the objects; their appearance and placement await visual approval. No throws, scoring, falling cans, prize story, token award or ending playback are implemented.

The preview adds a modest counter extension beneath the existing prizes. Three worn cream/burgundy cans form a pyramid; two cloth bags rest at the front left. The physical sign reads “2 BAGS / 3 CANS” without giving an aiming solution. Existing prizes, scene artwork, token and ending remain unchanged. The only in-scene narration box stays at the bottom. Optional 44px aim outlines are review guides, not working touch controls; interaction accuracy will require its own implementation and phone testing.

## Review

Open http://127.0.0.1:4173/dev/previews/index.html?view=prize#prize-phone with the local server running. Controls above the phone switch framing and proposed aim guides. The main prototype is unchanged. Stop here for visual approval before building gameplay or choosing exact cascade rules.

## Artwork provenance

Preview-only assets generated with OpenAI built-in imagegen, using assets/sources/artwork/midnight-midway-concept.png as the style/lighting reference. The Developer confirmed that reference was generated with ChatGPT. No external artwork, recording or font was downloaded. No exclusive copyright or CC0 claim is made for generated imagery.

- dev/previews/assets/prize-can-v1.png: transparent painted tin, reused for the three separate cans.
- dev/previews/assets/prize-counter-v1.png: transparent shelf, two bags and blank plaque. A clipped duplicate keeps the bags in front of the cans; an enlarged plaque crop carries exact SVG lettering. These are preview compositions, not edits to runtime artwork.

### Can prompt

Use case: illustration-story. Asset: ONE transparent painted game prop for the right-hand prize stall in the supplied haunted midway painting; supplied image is STYLE/LIGHTING REFERENCE ONLY, do not alter or reproduce it. Paint ONE squat old-fashioned carnival knockdown tin can, front view with a little top ellipse visible, width about 0.8 of its height. Worn cream-painted tin with two faded muted burgundy-red bands, tarnished rolled metal rims, a believable shallow dent and repeated beanbag scuffs on the lower third. No bullseye, face, letters, numbers, symbols, eyes or instructions. Painterly storybook brushwork and gritty worn surfaces, amber lamplight from above-left, deep cool brown-violet shadows to the right, matching the reference. Retain a clean readable cylindrical silhouette for phone scale. Single complete isolated can, not a stack, no ground or backdrop, truly transparent alpha, tight clear margin. It must look like an actual object in this illustrated carnival, not a shiny product photo or a vector/UI icon.

### Counter prompt

Use case: illustration-story. Asset: transparent painted counter extension for a small three-can knockdown carnival game, matching the supplied haunted midway prize stall; supplied image is STYLE AND LIGHTING REFERENCE ONLY, do not alter or reproduce the scene. Paint a compact old wooden shelf that projects from the stall toward the viewer, wide and low, with a narrow visible horizontal tabletop and a short battered burgundy-red front fascia. Two small dark support brackets below, no legs or full cabinet. Front-facing, seen a little from above, tabletop receding very slightly toward the right. Leave the MIDDLE and RIGHT of the tabletop EMPTY for a separately composited three-can pyramid. Put exactly TWO worn dark-red cloth beanbags together on the far LEFT of the tabletop, with stitches, soft fabric creases and contact shadows. A small weathered blank cream wooden placard hangs on the LOWER RIGHT of the front fascia; keep it fully BLANK for exact rules lettering to be added in code. Warm amber light from above-left, cool brown-violet shadows, painterly brush texture, scratched wood edges, faded circus trim to match the reference. No tin cans, prizes, people, background, scenery, text, logos, extra signs, big rack backboard or UI panels. Complete compact shelf, beanbags and blank placard isolated together with true transparent alpha. Wide landscape prop, close-cropped with clear margins.

## Verification

Command: node tests/browser/check-prize-staging.mjs. Passed in Chromium under a /midnight-midway/ project prefix. Captures and machine results: tests/results/prize-staging/. Reviewed final phone-390.png for can contact, bag visibility and scene integration.

- All props fit at viewport widths 390, 320 and 280px (scene widths 368, 298 and 258px within the review page); no horizontal overflow.
- Three cans, one bottom narration, no game controls, audio contexts or animations in this static preview; reduced-motion and framing/guide controls checked.
- 55 runtime/approved asset files match baseline 5bd5ff2 byte-for-byte. Approved ending template, styles, logic and assets are unchanged; ending pose smoke checks passed.
- Existing app Enter/Pause smoke check passed. Zero browser or HTTP errors.

This is not gameplay, full regression or physical-phone certification. Visual approval and eventual touch/cascade/playback testing remain pending. No merge, push or deployment.
