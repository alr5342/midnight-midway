# Midnight Midway credits and asset sources

Current Phase 2 application baseline: `614e44b`. Source/license audit updated 2026-10-26. Historical checkpoint-by-checkpoint credits are preserved [verbatim](docs/history/20261026-finalization/CREDITS.md). Current in-app Credits names the Developer, AI assistance and external sound creators/terms; it temporarily pauses and restores the previous activity mode, except after genuine browser interruptions.

## Developer and assistance

**Alex Rosemann** — Developer: concept selection, creative direction, design decisions, review and testing. Name confirmed 2026-10-16. OpenAI Codex/ChatGPT assisted with research, implementation, testing and artwork preparation. HTML/CSS/JavaScript, SVG props/masks/effects and original synthesized audio are project work created with that assistance. No external runtime code library or font is bundled.

## Reference and visual assets

The Developer confirmed 2026-10-16 that `assets/sources/artwork/midnight-midway-concept.png` was **AI-generated with ChatGPT**. This is user-confirmed provenance, not an unidentified third-party illustration; no exclusive-copyright or CC0 claim is made for generated imagery.

| Material | Origin / treatment | Supporting sources |
| --- | --- | --- |
| Scene, booth extraction/clean plate, hidden-surface repairs and corrected gondola | Supplied ChatGPT reference; localized built-in OpenAI image generation edits, source-pixel masks and foreground occlusion. | [Layer notes](docs/artwork/ARTWORK.md), [extraction review](docs/artwork/REVIEW.md), [gondola prompt/review](docs/artwork/GONDOLA.md). |
| Ghost attendant and empty-window plate | Built-in OpenAI image generation; v3 approved. Previous sprites retained, not discarded. | [Exact story prompts](docs/artwork/story/PROMPTS.md), [storyboard](docs/artwork/story/STORYBOARD.md). |
| Bell and blank music scrap | `assets/story/bell-painted-v1.png`, `music-paper-painted-v1.png`: built-in OpenAI image generation using the approved scene for texture/lighting. Notation/contact shadow/perspective added in project code. | [Exact painted-prop prompts](docs/design/PAINTED-PROPS.md). Earlier `bell.svg` retained as original vector-source history. |
| Three carousel horses | Original scene pixels extracted through approved masks to transparent PNGs, not generated replacement horses. | `tools/prepare-horse-layers.mjs`, [static comparison](docs/design/CAROUSEL-PAYOFF-CHECKS.json). |
| Prize cans/counter/bags | Built-in OpenAI image generation; runtime `assets/story/prize-can-v1.png` and `prize-counter-v1.png` are byte-identical to approved preview candidates. Exact sign lettering and wooden bag compartments are original SVG code. | [Exact prize staging prompts](docs/design/PRIZE-STAGING.md). |
| Empty land behind disappearing park | `assets/artwork/empty-field-v1.png`: byte-identical promotion of approved preview field, edited from ChatGPT reference with built-in OpenAI image generation. | [Exact field prompt](docs/design/EMPTY-FIELD-PROMPT.md). |
| Brass Ferris-wheel token, admission ticket, notation, stamp/sparks, masks, ambient effects and pause icon | Original SVG/CSS/JavaScript work; token has an engraved wheel, worn brass rim and “A NIGHT REMEMBERED” inscription. No external image/font used. | `assets/story/`, `assets/masks/`, `src/js/`, `src/css/`, [ending record](docs/design/ENDING-IMPLEMENTATION.md). |

Preview candidates remain in `dev/previews/assets/`; those promoted above are used in the current app and are no longer merely proposals. Earlier records describe the authorization at the time, not the current release state.

## External audio — CC0

Creator item pages and the [CC0 1.0 deed](https://creativecommons.org/publicdomain/zero/1.0/) were verified before use on 2026-10-16 and rechecked 2026-10-26. CC0 permits copying/adaptation/distribution without copyright attribution conditions; attribution is retained for the assignment and creator recognition. No endorsement is implied.

| Recording / creator | Primary source and original download | Preserved source / derivative |
| --- | --- | --- |
| Short wind sound — **remaxim** | [Creator/CC0 page](https://opengameart.org/content/short-wind-sound), [original WAV](https://opengameart.org/sites/default/files/short%20wind%20sound.wav) | `assets/sources/audio/remaxim-short-wind-original.wav` → `assets/audio/midway-wind-loop.wav`. Mono 22,050 Hz PCM; 60 Hz high-pass/1,800 Hz low-pass; one-second seam crossfade; normalized peak 0.65, playback gain 0.30. |
| Pleasing Bell Sound Effect — **Julie Damsgaard / Spring Spring / Spring Enterprises** | [Creator/CC0 page](https://opengameart.org/content/pleasing-bell-sound-effect), [original WAV](https://opengameart.org/sites/default/files/pleasing-bell.wav) | `assets/sources/audio/story-bell.wav` → three ring cues. Mono 22,050 Hz PCM, pitch factors 0.85/1.0/1.15, edge fades, normalized peak 0.5. |
| Magic Spell SFX — **JaggedStone** | [Creator/CC0 page](https://opengameart.org/content/magic-spell-sfx), [recorded original download](https://opengameart.org/sites/default/files/magical_1_0.ogg) | `assets/sources/audio/jaggedstone-magical-original.ogg` → arrival/stamp/departure WAVs. Trimmed, pitch-adjusted, faded and normalized; cues also reused for later haunted moments. |

Reproducible processing: `tools/prepare-ambient-audio.mjs`, `tools/prepare-story-audio.mjs`. Exact derivative metadata: `assets/audio/processing.json`, `assets/story/audio-manifest.json`.

Wind SHA-256 values retained from acquisition/processing:

- Original: `4435F5AD1BAF171F21F876F778D0A8A7447BECEA0C4955BB2566E0C63AB20F41`
- Derivative: `AB2DDEA484CF4D6B5E0F966E39C0F4A8BD60A52336C678A47B6208400F12C5C0`

## Original synthesized sound

- `assets/audio/carousel-box.wav`: original additive synthesis, not a sample of the booth bell. Mono PCM16, 22,050 Hz, 0.8 seconds, C5 fundamental 523.251 Hz, harmonic reed body/tine attack, faded tail, peak 0.42. Reproduce with `node tools/prepare-carousel-audio.mjs`. Interactive horses use minor-triad ratios 1, 2^(3/12), 2^(7/12); wrong notes add an octave-lower accent.
- The quiet completed carousel tune is original code composition: C4, G4, E-flat4, C4, F4, E-flat4, B-flat3, C4, one note every 1.5 active seconds / 12-second cycle. Reuses the original tone at lower rates, gain 0.22 through the 0.65 story master. Source: `src/js/carousel.js` and `src/js/story-audio.js`.
- `assets/audio/prize-throw.wav`, `prize-tin.wav`, `prize-chime.wav`: original deterministic synthesis, mono PCM16, 22,050 Hz; 0.42/0.85/2.4 seconds; peak 0.28/0.4/0.3. Source/seed/partials/envelopes: `tools/prepare-prize-audio.mjs`. The stall wake and token claim reuse these cues.

Automated decode/signal/scheduling checks do not prove subjective sound balance. Previous Developer approvals are recorded, but final public Phase 2 listening/phone verification remains a release gate.

## Development tools and sources

Playwright **1.63.0**, Microsoft contributors, [official repository](https://github.com/microsoft/playwright), Apache-2.0 (installed package metadata and LICENSE checked). Used only for automated Chromium/Firefox/WebKit testing; neither Playwright nor its downloaded browsers is bundled in the app. Node.js runs the local server, tests and preparation/export tools; it is not a browser runtime dependency. Assignment template requirements remain in `brief.md`; exact development instructions are preserved in the project.
