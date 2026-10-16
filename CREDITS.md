# Midnight Midway credits

## Developer and AI assistance

**Alex Rosemann** — Developer; concept selection, direction, design decisions, evaluation and testing. Name confirmed by the Developer on 2026-10-16. OpenAI Codex/ChatGPT assisted with implementation and artwork preparation. HTML/CSS/JavaScript and SVG props/effects are project code; no external runtime code library or font is used. Playwright is a development-only browser testing dependency, not bundled into the app.

## Reference and visual assets

The Developer confirmed on 2026-10-16 that reference/midnight-midway-concept.png is **AI-generated with ChatGPT**. It is the supplied source for the approved scene, not an unidentified third-party illustration. This provenance is based on the Developer's confirmation; no claim of an exclusive copyright or CC0 license for generated imagery is made.

OpenAI image generation prepared the booth extraction/clean plate, hidden-surface repairs, localized gondola correction and versioned ghost/window assets. Original scene pixels and masks are retained as described in assets/ARTWORK.md, assets/REVIEW.md and assets/GONDOLA.md; exact prompts and revisions are retained in assets/ and assets/story/PROMPTS.md. Ghost v3 and the complete visual design are approved. Bell/ticket/stamp/sparks, masks and ambient SVG effects are original project code artwork.

## Ambient sound

“Short wind sound” by **remaxim**, OpenGameArt, released by its creator under **CC0 1.0**. Verified 2026-10-16.

- Source and creator's CC0 declaration: https://opengameart.org/content/short-wind-sound
- Original download: https://opengameart.org/sites/default/files/short%20wind%20sound.wav
- License: https://creativecommons.org/publicdomain/zero/1.0/
- Preserved source: reference/audio/remaxim-short-wind-original.wav
- App derivative: assets/audio/midway-wind-loop.wav
- Source SHA-256: 4435F5AD1BAF171F21F876F778D0A8A7447BECEA0C4955BB2566E0C63AB20F41
- Derivative SHA-256: AB2DDEA484CF4D6B5E0F966E39C0F4A8BD60A52336C678A47B6208400F12C5C0
- Processing: mono 22,050 Hz PCM; 60 Hz high-pass and 1,800 Hz low-pass filtering; one-second tail/head crossfade for looping; peak normalized to 0.65; playback gain 0.30. Preparation code: tools/prepare-ambient-audio.mjs. Metrics: assets/audio/processing.json.

CC0 allows copying, adaptation and redistribution without copyright attribution requirements. Credit is retained here for the assignment and creator recognition; no endorsement implied. The wind was the only external sound installed in P1.5.

## Ticket-booth story sounds — P1.7/P1.8 runtime

Verified 2026-10-16 against each creator's OpenGameArt item/license listing during P1.6. These same local files now play in the main app; no new external sound was introduced for P1.7/P1.8. Human balance/listening and physical-phone checks remain pending.

| Source / creator | License and source | Local files and edits |
| --- | --- | --- |
| Pleasing Bell Sound Effect — Julie Damsgaard / Spring Spring / Spring Enterprises | CC0; https://opengameart.org/content/pleasing-bell-sound-effect | Original assets/audio/story-bell.wav from https://opengameart.org/sites/default/files/pleasing-bell.wav. Three mono 22,050 Hz PCM ring cues use pitch 0.85/1.0/1.15, short edge fades and peak normalization to 0.5. |
| Magic Spell SFX — JaggedStone | CC0; https://opengameart.org/content/magic-spell-sfx | Original reference/audio/jaggedstone-magical-original.ogg from https://opengameart.org/sites/default/files/magical_1_0.ogg. Arrival, stamp and departure WAV cues are trimmed, pitch-adjusted, faded and normalized. |

License deed: https://creativecommons.org/publicdomain/zero/1.0/. Exact derivative duration/pitch/peak metadata: assets/story/audio-manifest.json. Reproducible edits: tools/prepare-story-audio.mjs. Human listening review remains pending; machine decode/signal checks do not replace it.

## Ticket-booth story visuals — approved P1.6

Ghost attendant and empty-window plate: built-in image_gen, style/edit reference assets/ticket-booth.png; exact prompts in assets/story/PROMPTS.md. Versioned files are retained in assets/story/; approved originals remain unchanged. Bell, ticket, stamp, sparks and aperture mask are original code-native SVGs. Preparation/integration contract: assets/story/STORYBOARD.md. Ghost v3 and staging are approved.

## Artwork and code

Ghost revision: ghost-attendant-v2.png and ghost-attendant-v3.png were created with built-in image_gen edits using the previous version as the reference. v3 is the approved runtime character: obscured face, weathered uniform and narrow spectral silhouette. All prior sprites remain available; exact prompts are appended to assets/story/PROMPTS.md. The background, props and sounds were not regenerated.

Developer name and supplied-reference origin are now recorded above from the Developer's confirmation. AI-assisted artwork preparation and original SVG effect code are documented in research.md and assets/. No approved image or sound was changed during submission preparation.

The app now includes a keyboard-accessible Credits dialog with Developer, visual/code assistance and sound creator/source/license credits. It pauses the shared experience and requires explicit Play after closing. This source record includes detailed original/derivative processing beyond the concise in-app presentation.

## Development tools

Playwright 1.63.0, Microsoft contributors: https://github.com/microsoft/playwright, Apache-2.0 license (verified in the installed package metadata/LICENSE). Used only to automate Chromium/Firefox/WebKit tests. The app does not bundle Playwright or the downloaded test browsers. No other external runtime code or font is included.
