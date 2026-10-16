# Phase 1 GitHub Pages deployment — 2026-10-16

Authorized by the Developer after local prepublication review. No creative/runtime change or Phase 2 work was made during deployment.

- Public repository: https://github.com/alr5342/midnight-midway
- Public HTTPS app: https://alr5342.github.io/midnight-midway/
- Owner/account verified through Git Credential Manager and GitHub API: alr5342. GitHub CLI was not installed; existing authenticated Git/REST access was used without saving or displaying tokens.
- Existing main branch pushed normally, preserving fd52572, b5cc4e3 and 96cd9d5. No force push, history rewrite or different account.
- Pages source: main, /(root); static .nojekyll app. Authenticated API confirmed built status and HTTPS enforcement. First successful deployment: https://github.com/alr5342/midnight-midway/actions/runs/38980313295
- Full live-browser verified application commit: 96cd9d56555b57d40a6a18fe0d671b38a00f1d82. Follow-up documentation/test/evidence commit contains no changes to runtime HTML/CSS/JS/artwork/audio; latest published tip is available in the repository Actions deployment and exported Git log.

## Public-site verification

`node tests/check-live-pages.mjs https://alr5342.github.io/midnight-midway/ artwork-review/pages-live` passed in Chromium using phone viewports. Evidence: ../artwork-review/pages-live/checks.json and start/stamp-paused/rest screenshots.

- HTTPS entry and reload work; normal URL does not expose diagnostics.
- 42 deployed runtime resources loaded and matched local bytes (source text compared with normalized Git line endings); includes approved ghost/artwork/masks and all seven runtime WAV files.
- Enter loads decoded wind/story audio; no context before activation.
- Three-ring progress, extra-input lockout, full story and reset/replay work with touch and keyboard.
- Pause during stamp freezes active clock, story state and DOM; ambient/story sources stop, then explicit Play continues.
- Reduced-motion replay completes with stationary ticket and restored exploration.
- Credits is accessible, pauses the shared experience and closes without auto-resuming.
- Tested 390×844, 375×667, 320×568 and 844×390 without scene scrolling.
- No page errors or HTTP failures in the public success path.

Anonymous Pages-metadata endpoints returned 404 even though the public deployment succeeded. Authenticated metadata and the public site/workflow were checked separately; this was not an account/permission failure. Tokens were not persisted.

## Remaining gates

The Developer has now approved the actual-phone review: iPhone 17 Pro / iOS 26.5.1 / Safari, 2026-10-16. See PHONE-VERIFICATION.md for the scope of the reported evidence. No individual OS-interruption or per-beat logs were supplied or fabricated. The Windows WebKit test build's missing Web Audio API remains a test-environment limitation; it does not establish Safari/iPhone audio behavior.

The Developer authorized final ZIP preparation after phone approval. The extracted candidate passed inventory/hash and runtime checks; final artifact/Git-log acceptance is recorded in SUBMISSION.md and its verification sidecar. Phase 2 remains deferred.
