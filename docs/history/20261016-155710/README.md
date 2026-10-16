# Midnight Midway

## Current checkpoint: P1.3 fog — review pending

The main URL opens the single-screen app with Enter and real Play/Pause. Lighting and drifting path fog use the shared playback clock. Pause freezes their state and Play resumes the same phase; switching away pauses until Play. Reduced-motion preference is read before entry and followed live, providing steady light/static fog. Artwork assets/geometry are unchanged. Bats, sound and the three-ring story remain later checkpoints. Phase 1 submission is incomplete; GitHub Pages, actual-phone verification and final ZIP/Git log remain required.

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
