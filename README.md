# Midnight Midway

Current local checkpoint: stackable tickets and flexible attraction order. Every completed booth story adds one ticket. Start the carousel or prize game with one ticket; wrong notes and failed-round retries remain covered until that activity succeeds. Both attractions unlock with the first ticket and can be replayed with new tickets after success. Finish both stories in either order to receive one souvenir at the prize stall. The existing compact badge shows the available balance, including zero. [Scope, payment rules and verification](docs/design/TICKET-SYSTEM.md). Awaiting local review; no deployment.

The approved narration rewrite and bell focus correction remain. One bottom-box writer now follows the selected paid activity, remaining milestones or the need for another ticket. [Prior narration checkpoint](docs/design/NARRATION-REVISION.md).

Prior peer revisions remain: natural returned-bag pickup, gradual environmental glows, SVG pause icon, exact Credits recovery and an eight-second wheel-last ending plus two-second quiet hold. [Prior checks](docs/design/PEER-REVISION.md).

The Developer reports two peer-playtest rounds, after the Phase 1 prototype and with the more complete journey. [Notes for the eventual debrief](docs/PLAYTEST-NOTES.md) preserve that chronology and distinguish supplied observations from missing session details.

Published Phase 1 app: https://alr5342.github.io/midnight-midway/ — [GitHub repository](https://github.com/alr5342/midnight-midway).

One illustrated phone scene with lighting, fog, bats, looping wind, a start screen and one eight-second ticket-booth story. Three bell activations summon the spectral attendant, ticket and magical stamp. Progressive hints, replay, credits, touch/keyboard controls and initial/live reduced motion are implemented. One Play/Pause control coordinates all motion, sound, effects, timers and interaction. Tab/OS audio interruptions wait for explicit Play.

## Run locally

Complete the three-ring booth story for a ticket; repeat it to collect more. Either attraction can come next. The first accepted horse note spends a ticket on the carousel: its tune remains left → right → center → left. The ground paper is free to inspect after the first admission. Wrong notes reset only the melody attempt. Its eight-second payoff settles into staggered horse bobbing and quiet music, without rotation.

The first accepted throw spends a ticket on the prize game: two beanbags must knock down all three cans. Either lower can carries the top down; a top-first throw leaves too much standing. Pick up returned bags after failure to retry the paid game free. Winning plays the same eight-second haunted prize story. Starting a replay after success costs a new ticket (prize replay starts at bag pickup). Unfinished paid activities remain paid if you explore elsewhere or return to the booth.

After both stories have completed, the brass Ferris-wheel token appears at the existing prize-stall location, including when the carousel finishes last. It remains earned across replays and stays out of the prize aiming space during a replay round. Claim it to fade the attractions over the empty field, with the wheel last. Revisit or refresh begins a fresh visit.

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
node tests/browser/check-tickets.mjs
node tools/check-secrets.mjs
node tools/export-git-log.mjs
```

The current focused browser runner is `check-tickets.mjs`: both orders, payments, retries, replays, Pause/Credits, reduced motion and the unchanged ending. Older ticket/narration/ending runners retain their historical sequential, single-ticket contracts and are preserved as checkpoint evidence; they are not current acceptance tests. Fresh captures/logs go into ignored `tests/results/`; earlier evidence stays unchanged in `archive/reviews/`. Browser checks need a separately installed Playwright package and browsers, which are not bundled or needed by the app. The current runner supports `PLAYWRIGHT_MODULE` for another installation.

Preflight tests the project under `/midnight-midway-check/` and checks filename case for GitHub Pages compatibility. Chromium/Firefox support the full audiovisual checks. The installed Windows WebKit build has no Web Audio API; its visual/accessibility/path checks pass, but its audio is unverified. Historical strict touch screenshot comparisons remain unresolved; current regressions verify exact frozen active time/DOM state and resting story reset. See the [audit](docs/PHASE-1-AUDIT.md) for scope and limitations.

## Published Phase 1 and preserved submission

The published prototype was approved on an actual iPhone 17 Pro / iOS 26.5.1 / Safari by Alex Rosemann. The finalized Phase 1 ZIP, extraction, checksum and verification sidecar remain unchanged in `submissions/`. They record revision `4f7ed1b` and retain the original folder structure. Local cleanup and journey revisions are on separate development branches, currently `feature/carousel-puzzle`; they have not been merged, pushed or deployed. The physical-phone approval applies to the published Phase 1 version, not these local changes.

The active Git-log exporter now writes `docs/git/GIT-LOG.txt`. The packager uses that location for future exports; it does not alter the existing submission. Run it only when a new package is authorized. [Submission record](docs/SUBMISSION.md), [deployment evidence](docs/DEPLOYMENT.md), [Pages instructions](docs/GITHUB-PAGES.md), [phone review](docs/PHONE-VERIFICATION.md).

[Brief](brief.md) · [research](research.md) · [specification](spec.md) · [plan](plan.md) · [developer/asset credits](CREDITS.md).
