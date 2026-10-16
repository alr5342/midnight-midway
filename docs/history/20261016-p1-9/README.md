# Midnight Midway

P1.6, including ghost v3, is approved. P1.7/P1.8 are implemented for review: one eight-second ticket-booth story, three-ring audiovisual feedback/progress, progressive hints, replay and shared Play/Pause. Phase 1 only; no Phase 2 interaction is implemented.

Run `node serve.mjs`, then open http://127.0.0.1:4173 in VS Code Simple Browser or a desktop browser. No installation/build is required. Enter enables lighting, fog, bats and CC0 wind. Explore the ticket-booth bell; three activations summon the attendant, floating ticket and magical stamp. Pause freezes/resumes all active-time effects, hints, progress and sound. Leaving the tab or interrupting audio pauses until explicit Play.

Reduced motion is honored before Enter and live. Touch and keyboard are supported: Enter focuses Play/Pause, then Tab reaches the bell. Bell input waits for initially loading sounds and is locked during the story/pause. Cue failure shows Pause/Play retry guidance; missing story artwork disables the trigger with reload guidance.

**Phase 1 is not complete.** Remaining: Developer story/listening review; full credits and reference provenance; final quality/accessibility checks; Git repository/history/log; GitHub Pages deployment; verification on an actual smartphone; clean extraction-tested ZIP with project files/current docs/Git log. [Detailed audit](docs/PHASE-1-AUDIT.md), [plan](plan.md), [specification](spec.md), [research](research.md), [credits](CREDITS.md).

Tests use an existing local Playwright installation whose path is listed in browser scripts; update that path on another machine. It is not needed to run the app.

```powershell
node --test tests/playback.test.mjs tests/lighting.test.mjs tests/fog.test.mjs tests/bats.test.mjs tests/ambient-audio.test.mjs tests/ticket-story.test.mjs
node tests/check-ticket-story.mjs artwork-review/p1-7-8-review
node tests/check-shell.mjs artwork-review/p1-7-8-shell-final
node tests/check-audio.mjs artwork-review/p1-7-8-audio-final
node tests/check-bats.mjs artwork-review/p1-7-8-bats
```

Automated Chromium signal/viewport checks do not establish human discovery, speaker balance or physical-phone behavior. Historical strict screenshot comparisons remain unresolved; current checks verify frozen active time/DOM state and exact resting story-overlay reset. Evidence and limits are in the audit/plan.

Read-only development diagnostics: /?diagnostics. No diagnostic launch control appears in the app. Static inspectors: /artwork-review.html and /story-review.html. Comparison pages, source images, prompts, previous assets and audio processing records remain preserved. Pre-checkpoint source/docs: docs/history/20261016-p1-7-8/.
