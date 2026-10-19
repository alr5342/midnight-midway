# Midnight Midway

Published Phase 1 app: https://alr5342.github.io/midnight-midway/ — [GitHub repository](https://github.com/alr5342/midnight-midway).

One illustrated phone scene with lighting, fog, bats, looping wind, a start screen and one eight-second ticket-booth story. Three bell activations summon the spectral attendant, ticket and magical stamp. Progressive hints, replay, credits, touch/keyboard controls and initial/live reduced motion are implemented. One Play/Pause control coordinates all motion, sound, effects, timers and interaction. Tab/OS audio interruptions wait for explicit Play.

## Run locally

Current local checkpoint: complete the three-ring booth story to receive admission, then tap the actual carousel horses. The tune is left → right → center → left. Inspect the aged paper on the ground beside the carousel if needed: only four musical notes are shown, without horse names or an arrow sequence. A wrong note resets only the attempt. Notes briefly brighten the corresponding horse and use three pitches of an original synthesized music-box tone. Touch regions are at least 44px across; keyboard names remain available. Revised atmospheric hints point toward the bell, horse sounds and nearby paper without stating the solution. The larger foreground bell gently sways with active time; its fixed generous touch area covers the movement. Reduced motion keeps the bell still. The ticket and music share worn paper, faded ink and engraved details. Progressive hints use active time. Pause retains notes, clue and progress; refresh starts fresh. Puzzle success is recorded, but carousel story animation and prize-stall progression are not implemented. No deployment.

Approved visual checkpoint: [keepsake/disappearance staging](http://127.0.0.1:4173/dev/previews/index.html?view=ending). Select poses manually; the approved journey is recorded in [docs/design/JOURNEY.md](docs/design/JOURNEY.md). Ending playback remains unimplemented.

Run `node serve.mjs`, then open http://127.0.0.1:4173/index.html in VS Code Simple Browser or a desktop browser. No installation, framework or build is needed to run the app.

The combined development workspace is http://127.0.0.1:4173/dev/previews/index.html. Its navigation retains the artwork inspector, booth/carriage comparisons, full scene and manual story staging with sound auditions. These previews are separate from the working app. Read-only runtime diagnostics remain available at `/?diagnostics`.

## Organization

Runtime JavaScript lives in `src/js/`; shared scene/artwork/story styles and app-only styles in `src/css/`. Artwork, masks, story props, processed sound and source originals have separate folders under `assets/`. Current documents stay at the root or in `docs/`. Older review evidence and superseded development entry points are preserved in `archive/`. [Folder responsibilities and consolidation details](docs/PROJECT-STRUCTURE.md), [old-to-new path index](docs/FILE-MAP.json).

## Tests

From the project root:

```powershell
node --test tests/unit/*.test.mjs
node tests/run-regressions.mjs
node tests/browser/check-submission-ready.mjs tests/results/preflight
node tools/check-secrets.mjs
node tools/export-git-log.mjs
```

The browser runner starts a local server when needed and executes the existing shell, audio, lighting, fog, bats, wheel alignment, story/replay and preview regressions. Fresh captures/logs go into ignored `tests/results/`; earlier evidence stays unchanged in `archive/reviews/`. Browser checks need a separately installed Playwright package and browsers, which are not bundled or needed by the app. The scripts retain this machine's installed path. The preflight also supports `PLAYWRIGHT_MODULE` for a different Playwright entry path.

Preflight tests the project under `/midnight-midway-check/` and checks filename case for GitHub Pages compatibility. Chromium/Firefox support the full audiovisual checks. The installed Windows WebKit build has no Web Audio API; its visual/accessibility/path checks pass, but its audio is unverified. Historical strict touch screenshot comparisons remain unresolved; current regressions verify exact frozen active time/DOM state and resting story reset. See the [audit](docs/PHASE-1-AUDIT.md) for scope and limitations.

## Published Phase 1 and preserved submission

The published prototype was approved on an actual iPhone 17 Pro / iOS 26.5.1 / Safari by Alex Rosemann. The finalized Phase 1 ZIP, extraction, checksum and verification sidecar remain unchanged in `submissions/`. They record revision `4f7ed1b` and retain the original folder structure. The organizational cleanup is confined to the separate `chore/project-structure` branch; it has not been merged, pushed or deployed. The physical-phone approval applies to the published Phase 1 version.

The active Git-log exporter now writes `docs/git/GIT-LOG.txt`. The packager uses that location for future exports; it does not alter the existing submission. Run it only when a new package is authorized. [Submission record](docs/SUBMISSION.md), [deployment evidence](docs/DEPLOYMENT.md), [Pages instructions](docs/GITHUB-PAGES.md), [phone review](docs/PHONE-VERIFICATION.md).

[Brief](brief.md) · [research](research.md) · [specification](spec.md) · [plan](plan.md) · [developer/asset credits](CREDITS.md). No narrative redesign or additional stories are implemented in this cleanup.
