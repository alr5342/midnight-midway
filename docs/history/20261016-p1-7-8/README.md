# Midnight Midway

## Current checkpoint: P1.6 story assets/storyboard — review pending

The production app remains at the approved P1.5 state. Open http://127.0.0.1:4173/story-review.html to inspect the proposed eight-second story manually and audition CC0 sound candidates. No live bell trigger or story playback exists yet. Assets/timing/integration contract: assets/story/STORYBOARD.md. Tests: `node tests/check-story-assets.mjs`; evidence: artwork-review/p1-6/. P1.7, P1.8 and Phase 2 are unstarted.

The main URL opens the single-screen app with Enter and real Play/Pause. Enter activates looping CC0 wind alongside lighting, fog and bats. Pause stops audio and freezes effects; Play resumes the active-time phase. Switching away or browser audio interruption pauses until Play. Reduced motion keeps audio with steady light/static fog and no flying bats. Artwork is unchanged. The three-ring story remains later work. Phase 1 submission is incomplete; GitHub Pages, actual-phone verification and final ZIP/Git log remain required.

Audio credits/license/processing: CREDITS.md. Checks: `node --test tests/ambient-audio.test.mjs` and `node tests/check-audio.mjs`; evidence: artwork-review/p1-5/. Listen through several loops with device volume on and test Pause/Play. Headless signal checks do not replace listening/phone verification. P1.6 and Phase 2 have not started.

P1.4 checks: `node --test tests/playback.test.mjs tests/lighting.test.mjs tests/fog.test.mjs tests/bats.test.mjs` and `node tests/check-bats.mjs`. Evidence: artwork-review/p1-4/. Stopped for review; no P1.5 or Phase 2 work started.

Fog checks: `node --test tests/playback.test.mjs tests/lighting.test.mjs tests/fog.test.mjs` and `node tests/check-fog.mjs artwork-review/p1-3-functional`. Functional checks passed; an unresolved touch screenshot-byte comparison is documented in plan.md. No Phase 2 work has started.

The preserved artwork inspector is at http://127.0.0.1:4173/artwork-review.html. Existing comparison pages remain available separately. The historical static-artwork instructions below describe that inspector rather than the current main URL.

Runtime checks: `node --test tests/playback.test.mjs` and `node tests/check-shell.mjs artwork-review/p1-1-checked`. Read-only clock/state diagnostics are available only at `/?diagnostics`. Results/limitations, including an unresolved strict screenshot-equality check, are recorded in plan.md.

Lighting checks: `node --test tests/playback.test.mjs tests/lighting.test.mjs` and `node tests/check-lighting.mjs`. Revised P1.2 evidence is in artwork-review/p1-2-visible/; the initial version is preserved in artwork-review/p1-2/. The successful paused-frame equality check is separate from the historical app-versus-review screenshot comparison.

Run `node serve.mjs` from this folder, then open http://127.0.0.1:4173 in VS Code's Simple Browser (`Simple Browser: Show` in the Command Palette). No installation or build is needed.

Alternatively, open `index.html` with VS Code Live Preview. The page provides original, reassembled, repaired-background, transparent-cutout and displaced-layer inspection views. These are development review controls, not story interactions.

The reference is preserved in `reference/`. Generated extraction-test assets are in `assets/`. No animation, sound or story behavior is implemented. Artwork needs developer review before extending the layer system.

See `assets/REVIEW.md` for observed fidelity limitations and `assets/PROMPTS.md` for exact generation prompts. Browser screenshots are in `artwork-review/`.

The current full-scene checkpoint is at `/scene-review.html`, with source layout and limits in `assets/ARTWORK.md`. The approved booth comparison remains at `/comparison.html`. The main preview adds isolated/lifted horse and prize views plus a toggle for static interface mockups. New repair generation prompt: `assets/ATTRACTIONS-PROMPT.md`.

Browser verification: `node tests/visual-check.mjs <absolute-path-to-playwright/index.mjs>`. The optional argument uses an existing local Playwright installation; the fallback path is specific to this development machine. No browser dependencies are required to run the preview itself.
