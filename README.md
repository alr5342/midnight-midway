# Midnight Midway

The Phase 1 prototype is approved. Submission preparation adds in-scene credits, startup asset checks and accessibility/browser/path verification. One eight-second ticket-booth story, ambience, progressive hints, replay and shared Play/Pause are implemented. No Phase 2 work is included.

Run `node serve.mjs`, then open http://127.0.0.1:4173 in VS Code Simple Browser or a desktop browser. No installation/build is required. Enter enables lighting, fog, bats and CC0 wind. Explore the ticket-booth bell; three activations summon the attendant, floating ticket and magical stamp. Pause freezes/resumes all active-time effects, hints, progress and sound. Leaving the tab or interrupting audio pauses until explicit Play.

Reduced motion is honored before Enter and live. Touch and keyboard are supported: Enter focuses Play/Pause, then Tab reaches the bell. Bell input waits for initially loading sounds and is locked during the story/pause. Cue failure shows Pause/Play retry guidance; missing story artwork disables the trigger with reload guidance.

**Phase 1 is not complete.** Alex Rosemann and the ChatGPT-generated reference are credited; local Git history/log and publishing handoff are prepared. Review the submission-preparation result before publishing. Remaining delivery gates: GitHub Pages deployment/public verification, an actual smartphone test, and a clean extraction-tested ZIP with complete project files/current docs/Git log. [Detailed audit](docs/PHASE-1-AUDIT.md), [plan](plan.md), [specification](spec.md), [research](research.md), [credits](CREDITS.md).

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

Credits (upper right) is available before/after Enter. It pauses the scene; closing leaves it paused until Play. Startup image/stylesheet/mask failure keeps Enter disabled with reload guidance. [GitHub Pages walkthrough](docs/GITHUB-PAGES.md) and [physical-phone checklist](docs/PHONE-VERIFICATION.md) describe the next steps; no publish or ZIP has occurred.

Read-only development diagnostics: /?diagnostics. No diagnostic launch control appears in the app. Static inspectors: /artwork-review.html and /story-review.html. Comparison pages, source images, prompts, previous assets and audio processing records remain preserved. Pre-checkpoint source/docs: docs/history/20261016-p1-7-8/.
