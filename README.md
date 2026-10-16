# Midnight Midway

Published Phase 1 app: https://alr5342.github.io/midnight-midway/ — repository: https://github.com/alr5342/midnight-midway. The approved prototype includes in-scene credits, startup asset checks and accessibility/browser/path verification. One eight-second ticket-booth story, ambience, progressive hints, replay and shared Play/Pause are implemented. No Phase 2 work is included.

Run `node serve.mjs`, then open http://127.0.0.1:4173 in VS Code Simple Browser or a desktop browser. No installation/build is required. Enter enables lighting, fog, bats and CC0 wind. Explore the ticket-booth bell; three activations summon the attendant, floating ticket and magical stamp. Pause freezes/resumes all active-time effects, hints, progress and sound. Leaving the tab or interrupting audio pauses until explicit Play.

Reduced motion is honored before Enter and live. Touch and keyboard are supported: Enter focuses Play/Pause, then Tab reaches the bell. Bell input waits for initially loading sounds and is locked during the story/pause. Cue failure shows Pause/Play retry guidance; missing story artwork disables the trigger with reload guidance.

**Phase 1 submission finalization:** the prototype and public HTTPS site are approved, including Alex Rosemann’s actual iPhone 17 Pro / iOS 26.5.1 / Safari review. The extracted archive candidate passed inventory/hash, 17 unit and browser checks. Final ZIP contents and acceptance results are described in [docs/SUBMISSION.md](docs/SUBMISSION.md); the final verification sidecar must have status passed before submission. Developer/asset credits and Git history/log are included. [Detailed audit](docs/PHASE-1-AUDIT.md), [plan](plan.md), [specification](spec.md), [research](research.md), [credits](CREDITS.md).

Tests use an existing local Playwright installation whose path is listed in browser scripts; update that path on another machine. It is not needed to run the app.

```powershell
node --test tests/playback.test.mjs tests/lighting.test.mjs tests/fog.test.mjs tests/bats.test.mjs tests/ambient-audio.test.mjs tests/ticket-story.test.mjs
node tests/check-ticket-story.mjs artwork-review/p1-7-8-review
node tests/check-shell.mjs artwork-review/p1-7-8-shell-final
node tests/check-audio.mjs artwork-review/p1-7-8-audio-final
node tests/check-bats.mjs artwork-review/p1-7-8-bats
node tests/check-submission-ready.mjs artwork-review/p1-9-final
node tools/check-secrets.mjs
node tools/export-git-log.mjs
```

Final preflight: Chromium/Firefox pass the full audiovisual flow; WebKit passes visual/accessibility/path checks but has no Web Audio API in this Windows test build. Its audio remains unverified. Results: artwork-review/p1-9-final/checks.json. Desktop checks do not establish human discovery, phone speaker balance or physical-phone behavior. The final preflight supports PLAYWRIGHT_MODULE for a different installed Playwright entry path. Historical strict screenshot comparisons remain unresolved; current checks verify frozen active time/DOM state and exact resting story-overlay reset. Evidence and limits are in the audit/plan.

Credits (upper right) is available before/after Enter. It pauses the scene; closing leaves it paused until Play. Startup image/stylesheet/mask failure keeps Enter disabled with reload guidance. [Deployment evidence](docs/DEPLOYMENT.md), [GitHub Pages handoff](docs/GITHUB-PAGES.md) and [physical-phone checklist](docs/PHONE-VERIFICATION.md) describe the current result and next steps. The archive includes source/assets/docs/Git log, existing transcript-folder materials, history and supporting tests/evidence; see docs/SUBMISSION.md.

Read-only development diagnostics: /?diagnostics. No diagnostic launch control appears in the app. Static inspectors: /artwork-review.html and /story-review.html. Comparison pages, source images, prompts, previous assets and audio processing records remain preserved. Pre-checkpoint source/docs: docs/history/20261016-p1-7-8/. For the extracted app, run node serve.mjs inside midnight-midway-phase1/. No install/build is needed for the app. Browser automation needs the separately installed Playwright package/browsers; they are not bundled.
