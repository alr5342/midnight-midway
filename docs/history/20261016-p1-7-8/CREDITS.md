# Midnight Midway credits

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

## Ticket-booth story sounds — P1.6 candidates

Verified 2026-10-16 against each creator's OpenGameArt item/license listing. These files are prepared for review; they are not yet played by the main app.

| Source / creator | License and source | Local files and edits |
| --- | --- | --- |
| Pleasing Bell Sound Effect — Julie Damsgaard / Spring Spring / Spring Enterprises | CC0; https://opengameart.org/content/pleasing-bell-sound-effect | Original assets/audio/story-bell.wav from https://opengameart.org/sites/default/files/pleasing-bell.wav. Three mono 22,050 Hz PCM ring cues use pitch 0.85/1.0/1.15, short edge fades and peak normalization to 0.5. |
| Magic Spell SFX — JaggedStone | CC0; https://opengameart.org/content/magic-spell-sfx | Original reference/audio/jaggedstone-magical-original.ogg from https://opengameart.org/sites/default/files/magical_1_0.ogg. Arrival, stamp and departure WAV cues are trimmed, pitch-adjusted, faded and normalized. |

License deed: https://creativecommons.org/publicdomain/zero/1.0/. Exact derivative duration/pitch/peak metadata: assets/story/audio-manifest.json. Reproducible edits: tools/prepare-story-audio.mjs. Human listening review remains pending; machine decode/signal checks do not replace it.

## Ticket-booth story visuals — P1.6 candidates

Ghost attendant and empty-window plate: built-in image_gen, style/edit reference assets/ticket-booth.png; exact prompts in assets/story/PROMPTS.md. Both are new versioned files in assets/story/; approved originals remain unchanged. Bell, ticket, stamp, sparks and aperture mask are original code-native SVGs. Preparation/integration contract: assets/story/STORYBOARD.md. These candidates await Developer review.

## Artwork and code

Ghost revision: ghost-attendant-v2.png and ghost-attendant-v3.png were created with built-in image_gen edits using the previous version as the reference. v3 is the current staged candidate: obscured face, weathered uniform and narrow spectral silhouette. All prior sprites remain available; exact prompts are appended to assets/story/PROMPTS.md. The background, props and sounds were not regenerated.

Developer credit/name and the supplied visual reference's creator/origin/public-use permission still need to be recorded before submission. See research.md's source register. AI-assisted artwork preparation and original SVG effect code are documented there and in assets/. No artwork source files were changed for P1.5.

These project credits will be incorporated into the final in-app credits presentation during Phase 1 completion checks; this file is not a claim that the full credits requirement is already complete.
