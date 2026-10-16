# Midnight Midway — static artwork checkpoint

Run `node serve.mjs` from this folder, then open http://127.0.0.1:4173 in VS Code's Simple Browser (`Simple Browser: Show` in the Command Palette). No installation or build is needed.

Alternatively, open `index.html` with VS Code Live Preview. The page provides original, reassembled, repaired-background, transparent-cutout and displaced-layer inspection views. These are development review controls, not story interactions.

The reference is preserved in `reference/`. Generated extraction-test assets are in `assets/`. No animation, sound or story behavior is implemented. Artwork needs developer review before extending the layer system.

See `assets/REVIEW.md` for observed fidelity limitations and `assets/PROMPTS.md` for exact generation prompts. Browser screenshots are in `artwork-review/`.

The current full-scene checkpoint is at `/scene-review.html`, with source layout and limits in `assets/ARTWORK.md`. The approved booth comparison remains at `/comparison.html`. The main preview adds isolated/lifted horse and prize views plus a toggle for static interface mockups. New repair generation prompt: `assets/ATTRACTIONS-PROMPT.md`.

Browser verification: `node tests/visual-check.mjs <absolute-path-to-playwright/index.mjs>`. The optional argument uses an existing local Playwright installation; the fallback path is specific to this development machine. No browser dependencies are required to run the preview itself.
