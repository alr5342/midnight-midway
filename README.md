# Midnight Midway

Current local checkpoint: approved narration overhaul with the Developer's three wording changes. One bottom-box writer selects the pending objective, active story or explicit inspection; partial replays and completed objects cannot steal later hints. Handoffs yield immediately to the next interaction. The bell releases its lingering focus ring when its story starts, retains deliberate keyboard focus when revisited, and remains replayable. [Scope, copy ownership and verification](docs/design/NARRATION-REVISION.md). Current sequential progression and one admission ticket are unchanged; stackable/spendable tickets and either-order attractions are a later checkpoint. Awaiting local review; no deployment.

Prior peer revisions remain: natural returned-bag pickup, gradual environmental glows, SVG pause icon, exact Credits recovery and an eight-second wheel-last ending plus two-second quiet hold. [Prior checks](docs/design/PEER-REVISION.md).

The Developer reports two peer-playtest rounds, after the Phase 1 prototype and with the more complete journey. [Notes for the eventual debrief](docs/PLAYTEST-NOTES.md) preserve that chronology and distinguish supplied observations from missing session details.

Published Phase 1 app: https://alr5342.github.io/midnight-midway/ — [GitHub repository](https://github.com/alr5342/midnight-midway).

One illustrated phone scene with lighting, fog, bats, looping wind, a start screen and one eight-second ticket-booth story. Three bell activations summon the spectral attendant, ticket and magical stamp. Progressive hints, replay, credits, touch/keyboard controls and initial/live reduced motion are implemented. One Play/Pause control coordinates all motion, sound, effects, timers and interaction. Tab/OS audio interruptions wait for explicit Play.

## Run locally

Complete the three-ring booth story to receive admission, then tap the carousel horses. The tune is left → right → center → left; the ground paper shows only four musical notes and becomes inspectable after admission. A wrong note resets only the melody attempt. The eight-second carousel payoff settles into staggered horse bobbing and quiet music, without rotation. The stall then wakes: two beanbags must knock down all three cans. Either lower can carries the top down; a top-first throw leaves too much standing. A failed round remains recoverable through bag pickup. Winning plays the eight-second prize story and offers a brass Ferris-wheel token. Deliberately claiming it fades the attractions over the empty field, with the wheel last. Revisit or refresh begins a fresh visit. Completed stories remain replayable before claim without clearing earned milestones.

The bottom narration is the only in-scene text box. One active-time clock coordinates motion, audio, hints, throws and fades. Pause freezes them all; reduced motion keeps the narrative and sound with stationary feedback instead of travel/pulsing. Original artwork and assets remain intact. [Journey and checkpoint history](docs/design/JOURNEY.md).

Approved visual reference: [keepsake/disappearance staging](http://127.0.0.1:4173/dev/previews/index.html?view=ending). Its original ten-second pose labels are historical; the runtime now scales the same sequence to eight seconds.

Run `node serve.mjs`, then open http://127.0.0.1:4173/index.html in VS Code Simple Browser or a desktop browser. No installation, framework or build is needed to run the app.

The combined development workspace is http://127.0.0.1:4173/dev/previews/index.html. Its navigation retains the artwork inspector, booth/carriage comparisons, full scene and manual story staging with sound auditions. These previews are separate from the working app. Read-only runtime diagnostics remain available at `/?diagnostics`.

## Organization

Runtime JavaScript lives in `src/js/`; shared scene/artwork/story styles and app-only styles in `src/css/`. Artwork, masks, story props, processed sound and source originals have separate folders under `assets/`. Current documents stay at the root or in `docs/`. Older review evidence and superseded development entry points are preserved in `archive/`. [Folder responsibilities and consolidation details](docs/PROJECT-STRUCTURE.md), [old-to-new path index](docs/FILE-MAP.json).

## Tests

From the project root:

```powershell
node --test tests/unit/*.test.mjs
node tests/browser/check-narration.mjs
node tests/browser/check-peer-revision.mjs
node tests/browser/check-ending.mjs
node tools/check-secrets.mjs
node tools/export-git-log.mjs
```

Current targeted browser checks are `node tests/browser/check-peer-revision.mjs` and `node tests/browser/check-ending.mjs`. The former supersedes `check-journey-recovery.mjs`, whose historical contract includes the removed restart toolbar. Existing older runners are preserved for their checkpoint evidence; they are not all current acceptance tests. Fresh captures/logs go into ignored `tests/results/`; earlier evidence stays unchanged in `archive/reviews/`. Browser checks need a separately installed Playwright package and browsers, which are not bundled or needed by the app. The scripts retain this machine's installed path and support `PLAYWRIGHT_MODULE` where indicated.

Preflight tests the project under `/midnight-midway-check/` and checks filename case for GitHub Pages compatibility. Chromium/Firefox support the full audiovisual checks. The installed Windows WebKit build has no Web Audio API; its visual/accessibility/path checks pass, but its audio is unverified. Historical strict touch screenshot comparisons remain unresolved; current regressions verify exact frozen active time/DOM state and resting story reset. See the [audit](docs/PHASE-1-AUDIT.md) for scope and limitations.

## Published Phase 1 and preserved submission

The published prototype was approved on an actual iPhone 17 Pro / iOS 26.5.1 / Safari by Alex Rosemann. The finalized Phase 1 ZIP, extraction, checksum and verification sidecar remain unchanged in `submissions/`. They record revision `4f7ed1b` and retain the original folder structure. Local cleanup and journey revisions are on separate development branches, currently `feature/carousel-puzzle`; they have not been merged, pushed or deployed. The physical-phone approval applies to the published Phase 1 version, not these local changes.

The active Git-log exporter now writes `docs/git/GIT-LOG.txt`. The packager uses that location for future exports; it does not alter the existing submission. Run it only when a new package is authorized. [Submission record](docs/SUBMISSION.md), [deployment evidence](docs/DEPLOYMENT.md), [Pages instructions](docs/GITHUB-PAGES.md), [phone review](docs/PHONE-VERIFICATION.md).

[Brief](brief.md) · [research](research.md) · [specification](spec.md) · [plan](plan.md) · [developer/asset credits](CREDITS.md).
