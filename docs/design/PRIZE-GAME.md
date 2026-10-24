# Three-can game and waiting token

This retains the original game checkpoint. Current handoff, timing revisions and implemented claim/ending are recorded in [ENDING-IMPLEMENTATION.md](ENDING-IMPLEMENTATION.md); the earlier deferred-ending statements below are historical.

## Original approved scope

Starting from e160093 on feature/carousel-puzzle, preserve the approved static prize layout, original scene, existing admission/ride progression and ending staging. The Developer approved the following support rule and explicitly chose to stop this checkpoint at the waiting token. No claim, disappearance, Revisit implementation, deployment, merge or push.

Done means: a reliable integrated two-bag game, visible/audible throw and fall feedback, recoverable failed attempts, a complete replayable eight-second haunted prize story, one retained token, and shared Pause/Play/reduced-motion behavior. Review this local implementation before further work.

## Interaction and progression

- Finish the carousel's full payoff to unlock the cans. Props already exist in the scene; unlocking introduces no popup or new text box.
- Tap a can to aim, or focus the transparent target and press Enter/Space. There is no drag, timing test, random trajectory or physics simulation. Targets are at least 44px; the right one stays within the scene on narrow/landscape layouts.
- There are exactly two bags. Either lower can carries the top down; the other lower can needs the second bag. Top-first drops only the top, leaving both lower cans. Rapid taps, down cans, locked controls and paused input spend nothing.
- After an unsuccessful second throw, two bags visibly return to the shelf; tap them to collect a fresh pair. After winning, the bags return once the story ends and offer replay. Returned props do not refill the logical attempt until collected. Retry resets only cans/bags, preserving admission, carousel completion and an already earned token. Replays can fail without losing that token; successful replays play the story again without awarding duplicates.
- The worn sign states the bag/can count. Dents and scuffs provide visual clues. Progressive bottom narration suggests the old sign, then low scuffs, without printing a winning sequence. Screen-reader-only status reports bag/can counts and the received keepsake; no extra visible instruction box.
- Refresh starts a fresh visit without saved state.

## Feedback and eight-second story

Each throw takes 1.45 active seconds. The cloth bag follows a short authored arc, impact begins at 0.38s, and a supported top can falls 0.115s later. Cans tilt, fall and fade beyond the shelf; hit sounds vary in pitch. This is deterministic animation of the approved layers, not a physical simulation.

After the final successful throw settles:

| Active story time | Beat |
| --- | --- |
| 0–1s | A hollow winning chord sounds from the empty stall. |
| 1–4.5s | Original ghost/cat prize pixels brighten and lift slightly, then settle, with spectral arrival/departure accents. |
| 4.5–6s | The approved brass Ferris-wheel token appears in a small spark reveal. |
| 6–8s | The token settles; prizes return to rest. |
| After 8s | One souvenir is retained. The token waits visibly; the bag area offers replay. Claim is deliberately unimplemented. |

All other scene inputs are locked through the throw/story, while Play/Pause and Credits retain their existing behavior. Clue inspection and other stories also lock the prize game. Activated carousel idle/music and wind continue underneath, all sharing the same active-time clock and AudioContext. Pause/interruption stops sources and all advancement; explicit Play resumes cues at saved offsets. Reduced motion removes bag travel, can rotation/translation, prize lift and token travel, retaining gentle opacity changes, sound and timing.

## Code and assets

- src/js/prize.js owns attempt/story state and connects it to existing playback/audio. App callbacks coordinate input ownership and bottom narration; no second scheduler or timers.
- src/js/artwork.js mounts the approved props. Runtime copies in assets/story/ are byte-identical to preview prize-can-v1.png, prize-counter-v1.png and keepsake-token-v1.svg. Original approved artwork, audio and every development preview file remain unchanged.
- Two clipped bag layers reuse counter pixels; original code supplies a small shaded wood fill where a used bag exposes the shelf. Cans retain approved position, size and texture. No new image generation.
- New sounds are original deterministic synthesis via tools/prepare-prize-audio.mjs. See CREDITS.md and [original prop prompts](PRIZE-STAGING.md). No external assets or new dependencies.

## Focused verification

- node --test tests/unit/prize.test.mjs tests/unit/carousel.test.mjs tests/unit/ticket-story.test.mjs tests/unit/playback.test.mjs — 24 passed.
- node tests/browser/check-prize.mjs — passed, including final screen-reader status confirmation.
- node tests/browser/check-carousel.mjs tests/results/prize-game-carousel-regression — passed, including exact melody, clues, original horse targets, completed tune, shared Pause/interruption and booth replay.
- node tests/browser/check-ticket-story.mjs tests/results/prize-game-booth-regression — passed, including three complete cycles, one admission ticket, all story beats, audio failure/retry, missing-art handling and unchanged booth artwork.

Prize-game captures/results: tests/results/prize-game/. Reviewed ready-phone.png, layout-280.png, haunted-story.png and waiting-token.png. All targets fit and their centers receive the correct input at 390×844, 320×568, 280×568 and 844×390; no horizontal overflow. Checks exercise both winning orders (unit), top-first failure/retry, rapid/input locks, keyboard aiming, replay, one token, refresh, Pause during flight/fall/every story phase, native audio interruption, resumed audio offsets, reduced motion and Pages-style /midnight-midway/ asset paths. Original assets and preview files are byte-compared to e160093. No browser/HTTP errors. Focused secret scan and git diff --check passed. The preserved Phase 1 ZIP SHA-256 remains 4c3d9bc0f40726dc2de73d8e2fbe9afe802a8dc8418f2d7b3f850edfdd1a6aa3.

Limits: desktop Chromium touch emulation and visual inspection, not physical-phone or full cross-browser certification. Audio character, perceived touch comfort and pacing still need Developer review. Disappearance remains approved static staging; no claim or ending playback is claimed. Public Phase 1 site, main branch and submission archive are untouched.
