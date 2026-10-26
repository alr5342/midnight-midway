# Implementation Plan

## Current checkpoint: tickets and either-order replay

Authorized from 498e831: implement the recorded stackable-ticket direction. Centralize issuance/payment/milestones in one visit ledger; connect accepted attraction input to one payment lasting until story success; retain free recovery within an unfinished paid activity. Make both attractions available after admission, award one original stall token after both full stories, update the existing count badge and order-independent narration. Preserve artwork, puzzles, story timing and ending. [Scope, rules and tests](docs/design/TICKET-SYSTEM.md).

Verify stacking, both orders, no premature/duplicate token, depleted balance, earning while an activity is unfinished, wrong inputs, failed-round pickup, paid replays, switching paid activities, the exact completion boundary, Pause/Credits, interruptions, touch/keyboard, reduced motion and fresh Revisit. Stop for local Developer review; no merge, push, deployment or Phase 1 packaging. Earlier sequential checkpoint statements below are historical.

Complete for local review: 49 targeted unit tests and the focused three-route browser runner pass. Both orders, paid replays, free recovery, one token and unchanged ending are verified under a project-prefix URL. Phone-size captures were inspected; physical-device/peer review is pending. Evidence: tests/results/ticket-system/. Approved assets and Phase 1 ZIP remain unchanged.

## Current checkpoint: approved narration and bell focus

From 56c010d, implement only the approved narration rewrite (including the three Developer edits), one-owner priority/state correction and lingering bell ring fix. Reuse all artwork, feedback, shared time and current progression. [Scope and verification](docs/design/NARRATION-REVISION.md). Test the actual failure cases: partial booth replay during later puzzles, completed horse/paper input, immediate clue inspection after admission, one-bag/failed recovery, story replay and waiting claim; verify Pause/Credits, reduced motion, phone layout and the existing ending.

Complete for local review: all 40 targeted unit tests, the focused narration/touch journey and the existing three-cycle real-time ticket/audio regression pass. Approved media and Phase 1 ZIP are unchanged. Captures and machine output: tests/results/narration-revision/. These browser checks do not establish new physical-phone or peer approval.

Stop for Developer review after this checkpoint; no deployment. The requested future design is stackable admission tickets, one ticket to use carousel or prize stall in either order, then the token after both. Those progression/replay changes are not implemented or authorized as part of this checkpoint. The preserved Phase 1 submission and public site remain unchanged.

## Current checkpoint: peer-playtest revisions, 2026-10-25

Authorized from 810dea4: remove permanent restarts; recover failed rounds by picking up returned beanbags; increase environmental guidance when progress stalls; draw the pause symbol; shorten the existing disappearance to eight seconds; preserve exact state through Credits. Existing puzzles, stories, approved media and public Phase 1 submission remain intact. [Scope and results](docs/design/PEER-REVISION.md).

Implementation and focused recovery checks are complete for local review. Credits returns to its prior playing/paused state; external browser interruptions still require Play. The targeted browser run covers unfinished interactions, repeated modal cycles, touch pickup at four sizes, reduced motion and the wheel-last ending under a Pages-style path. Stop for Developer review; do not merge, push or deploy.

Carry both reported peer rounds into the eventual debrief: initial Phase 1 prototype, then the more complete journey. [Playtest notes and missing details](docs/PLAYTEST-NOTES.md). The supplied debrief template and any further peer/device evaluation remain future work; no final debrief or new physical-phone pass is claimed.

## Earlier checkpoints and Phase 1 plan (historical)

Current checkpoint from 15f2597, 2026-10-24: fix touch recovery and transition clarity, add progress-preserving activity restart and distinct full-visit restart, and verify normal gameplay through Revisit. Complete for local review: 38 unit tests and the focused recovery browser check passed, including eight repeated failed attempts at four viewport sizes plus a normal-speed touch journey. [Evidence and limits](docs/design/JOURNEY-RECOVERY.md). Stop here; no merge, push or deployment. Earlier entries below are historical.

Current authorized checkpoint, from 5bd5ff2: static visual staging for the Developer-selected three-can knockdown game (three stacked cans, two beanbags, subtle environmental aiming clues). The preview is prepared and focused browser checks passed. Stop for visual approval before throws, cascade rules, scoring, prize story or ending playback. No deployment. See [staging record](docs/design/PRIZE-STAGING.md). Earlier checkpoint entries below are historical.

Current authorized checkpoint, from ea3fa7d: modestly increase carousel horse motion and keep a quiet eerie tune playing after activation, using the existing shared timing/audio system. Prize-stall game is a brainstorming/approval step only; do not implement prize gameplay or ending. Completed refinement: lifts increased to 12/15/13.5 scene pixels, completed idle 32%, original 12-second background phrase at cue gain 0.22 with preserved phase across replay/pause. Focused verification: 19 carousel/ticket-audio/playback unit tests and the carousel browser integration passed; capture of stronger movement visually inspected. Evidence: tests/results/carousel-tune/; records: docs/design/JOURNEY.md and CAROUSEL-PAYOFF-CHECKS.json. Stop for review with prize-game alternatives. No deployment.

Current checkpoint: approved ending staging; admission progression implemented for review. Award once only after the full booth story, retain the ticket/carousel unlock across replay and Pause, and restart fresh on refresh. Existing bell/ghost/audio sequence stays intact. Evidence and commands: docs/design/JOURNEY.md, tests/results/admission-progress/. Stop for Developer review before carousel mechanics; no deployment.

Ending staging correction: replace whole-screen darkness with separate attraction fades over a preview-only empty moonlit field. Booth goes first, then carousel/stall; wheel last; token and land remain. Token/Revisit placement are preserved. Static checks pass; visual approval of this revision is pending. Still no full playback, gameplay or deployment. See docs/design/JOURNEY.md and tests/results/ending-field-staging/.

Latest checkpoint, 2026-10-19: the Developer approved the journey and memory-token ending; see [design/staging record](docs/design/JOURNEY.md). On design/ending-staging, based on the unmerged cleanup branch, the static preview is prepared and checked; visual approval is pending. Stop before admission persistence, musical/game mechanics, claim, ten-second playback or fresh-journey reset. Main, the public site and Phase 1 submission are unchanged. Future implementation checkpoints require individual review after staging approval.

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Updated 2026-10-16. **Phase 1 only.** Public prototype and phone review are approved. Alex Rosemann tested the live site on iPhone 17 Pro / iOS 26.5.1 / Safari and authorized final submission packaging. Archive candidate inventory/hash and extracted-runtime checks passed; final ZIP acceptance is recorded in the external verification JSON described in docs/SUBMISSION.md. Live URL: https://alr5342.github.io/midnight-midway/. No creative changes or Phase 2 work.

## Phase 1 submission gates — all must be verified

| Required deliverable | Current state | Work still required |
| --- | --- | --- |
| Working prototype | Approved; full story/ambience, credits and quality checks passed. | No additional feature work. Historical test limits are recorded in docs/PHASE-1-AUDIT.md. |
| Shareable URL verified on actual phone | Satisfied: public HTTPS browser checks plus Developer-approved iPhone 17 Pro / iOS 26.5.1 / Safari review. | Phone review is user-reported; no individual per-check evidence is invented. See docs/PHONE-VERIFICATION.md. |
| Project files, current docs and Git log | Extracted candidate passed all-file hashes and runtime checks; final ZIP includes refreshed current docs/log and manifest. | Use the final artifact only after its verification sidecar reports passed; see docs/SUBMISSION.md. |

Phase 1 is not complete until every row passes. No public deployment or ZIP has been created in P1.3. Archive/readme/credits presentation must serve the assignment; no optional visual redesigns or extra story work in Phase 1.

## Working agreement

Use [brief.md](brief.md) for fixed requirements, [spec.md](spec.md) for acceptance checks and [research.md](research.md) for decisions/sources. Review each checkpoint's concrete result before the next consequential change. If a checkpoint grows large, split it; if an approach fails twice, report the attempts and reassess with the Developer.

Every implementation checkpoint includes: run the result; test its main risk and related working behavior; show screenshots, output or observations; record consequential findings here; obtain Developer review. Do not mark Developer/physical-phone verification complete from browser automation alone.

Preserve approved assets and use versioned candidates for new artwork. Preserve meaningful checkpoints in git once repository setup is agreed; check for secrets before every commit. Do not publish, discard work or make unrelated visual changes as part of a checkpoint silently.

## Completed baseline and evidence

- [x] Developer selected Midnight Midway and supplied the visual reference.
- [x] Built static phone preview and original/assembled/isolated/displaced inspection views.
- [x] Refined booth base with original pumpkin, vegetation and fog; Developer approved.
- [x] Prepared three horse masks, paired ghost/cat prizes, localized hidden-surface repairs and fixed trim; reviewed static composition and interface mockups.
- [x] Corrected far-right gondola locally; Developer approved the complete static visual design.
- [x] Recorded desktop-browser checks at 390 × 844, 375 × 667 and 320 × 568. Carriage pixel check found no changes outside its inspection area.
- [x] Developer approved the documents/forward plan and selected the three-ring ticket-booth story.
- [x] Developer approved the P1.1 shell and authorized P1.2 lighting.
- [x] Developer authorized continuation to P1.3 and selected GitHub Pages for Phase 1 submission.
- [x] Developer approved P1.3 and authorized P1.4 bats only.
- [x] Developer approved P1.4 and authorized P1.5 audio only.
- [x] Developer approved P1.5 and authorized P1.6 story assets/storyboard only.
- [x] Developer approved P1.6 including the revised ghost and authorized P1.7/P1.8 together.
- [x] Developer approved functional P1.7/P1.8 and authorized final submission preparation.
- [ ] Developer reviews P1.9/prepublication result before publishing or packaging.

Evidence and limitations: [booth review](docs/artwork/REVIEW.md), [attraction notes](docs/artwork/ARTWORK.md), [carriage notes](docs/artwork/GONDOLA.md); screenshots in archive/reviews/booth-refinement-v2/, attractions-v3-final/ and carriage-v4/. Historical asset notes retain their original pending labels; the approval above supersedes those labels.

Current app: `node serve.mjs` → http://127.0.0.1:4173. VS Code: Simple Browser: Show. Preserved static inspectors: /dev/previews/index.html?view=artwork and /dev/previews/index.html?view=story. Local main Git history is now present. Audio sources and Developer-confirmed AI-reference provenance are recorded; Developer/in-app credits are implemented. Public hosting, actual-phone verification and final ZIP remain unfinished. Prior documents are preserved in docs/history/20261016-144916/; original artwork hash inventory is in docs/history/20261016-145826/.

## Phase 1 — week 1 prototype

Goal: complete ambient-scene requirements, start screen, unified Play/Pause and one discoverable, replayable story; shareable HTTPS URL verified on a physical phone; current files/docs/git log.

These are sequential results, not permission to implement the entire table in one pass. Exact content is confirmed when needed.

| ID / status | Checkpoint and tangible result | Main risk | Testing and exit evidence |
| --- | --- | --- | --- |
| P1.0 — scope confirmed; setup outstanding | Plan and three-ring ticket story approved. Hidden-tab pause requires explicit Play on return. Baseline preserved. Exact effect pacing/reduced-motion alternatives remain for their checkpoints; repository setup still outstanding. | Building behavior or assets from unapproved assumptions. | Story direction and interruption choice recorded; baseline copied and artwork hashes captured. No repository or commit was created in this checkpoint. |
| P1.1 — approved | Single-screen app shell, Enter, real Play/Pause, reduced-motion initialization and shared active-time lifecycle; preserved separate artwork inspector. | Fragmented state; pre-start activity; phone viewport or focus regressions. | Unit and functional browser checks pass; no scroll at tested sizes; 18 artwork files unchanged by hash. Historical strict screenshot comparison remains unresolved, documented below; Developer approved the shell. |
| P1.2 — carried forward on instruction to continue | Wheel-bulb lighting and corrected-gondola glow, aligned to painted bulbs and driven by shared clock. | Overbright/strobing effect or altered approved carriage. | Normal/reduced-motion, start gating, rendered freeze, resume phase, alignment and repeated toggles passed. This is one ambient system. |
| P1.3 — approved | Drifting fog wisps in separate path layers, behind booth and retained foreground. | Fog obscures targets or exposes hard joins. | Functional fog/light pause and resume, reduced motion, interruption and drift bounds passed; lighting/shell regressions passed. Historical touch screenshot-byte assertion unresolved, documented below. |
| P1.4 — approved | Two occasional bats follow an upper-scene route with wing movement, using the shared clock. Hidden in reduced-motion mode. | Clutter, excessive motion or weak phone performance. | All three systems freeze/resume together; initial/live reduced motion, interruption, rapid toggles and fog/shell regressions passed. Phone screenshot inspected; physical-device verification pending. |
| P1.5 — approved | CC0 wind loop; source/processing/credit recorded. Audio starts on Enter and participates in pause/resume/interruption policy. | Browser activation, loop/volume, duplicate sound or unverified terms. | Unit and Web Audio checks passed; Developer approved. Actual-phone verification remains pending. |
| P1.6 — approved | Eight-second storyboard, revised ghost v3, masked empty-window plate, original props and six CC0-derived cues. Static inspector retained. | Art fit/readability. | Developer approved revised ghost/staging. Prior versions and evidence retained. |
| P1.7 — approved | Complete audiovisual sequence driven by shared active time/context; paused cue offsets, normal/reduced-motion staging, cleanup/reset and replay. | Orphan effects/timers or incomplete return to rest. | Eight-second boundary unit checks; browser pauses at every beat, three replays, exact resting overlay reset and measurable story signal. Tested through the real bell because P1.7/P1.8 were authorized together; no development launch UI shipped. |
| P1.8 — approved | Three bell activations, pitched sound/glow/text feedback, progressive hints at 12/24 active seconds, story lockout, reset and touch/keyboard controls. | Discovery confusion or concurrent actions. | Touch/Enter/Space, paused input rejection, excess-click lockout, frozen progress/hints, reduced motion and sound/art failure checks passed. Human discovery and phone listening remain unverified. |
| P1.9 — approved | In-app Developer/asset credits, confirmed ChatGPT reference origin, main image/stylesheet/mask startup checks, final accessibility/browser/subpath preflight and local Git/log. | Browser differences, broken hosted paths or incomplete credits. | Final evidence in docs/PHASE-1-AUDIT.md; stop before publishing/packaging. Real-phone/public URL remain separate gates. |
| P1.10a — published; public browser checks passed | Deploy the requirement-complete candidate through GitHub Pages using the agreed repository. | Incorrect repository/path or files missing from public build. | Record repository, deployed revision and public HTTPS URL; verify relative asset/module/audio paths, reload/direct entry and no missing resources. Stop for review. |
| P1.10b — Developer phone review complete | User verifies the public link on their actual smartphone. | Desktop automation misses phone touch/audio/interruption failures. | Record device/browser and observed start, all ambience/audio, pause/resume, bell/progress/hints, full story/replay, reduced motion and viewport behavior. Fix/redeploy/retest failures. No completion claim without this evidence. |
| P1.10c — candidate verified; final artifact acceptance in verification report | Prepare the final submission ZIP after the deployed revision passes phone testing. | Stale build, absent Git log/docs, leaked secrets or unusable archive. | Export final Git log; include project sources, assets, current docs, credits and relevant tests/evidence. Exclude credentials/caches, Git internals and recursive submission archives; preserve all local work. Extract to a fresh workspace folder, verify file inventory and run the extracted app. Record ZIP filename, tested deployed revision and all three deliverable gates. |

The incomplete attractions must not behave like functioning story triggers in the Phase 1 public build. Their presentation can stay in the scene; confirm the affordance treatment during P1.0/P1.8. No new navigation, effects or stories are added merely to fill the prototype.

## Phase 2 — deferred roadmap; not authorized

Begin after Phase 1 meets its completion gate. Detailed story and revision decisions follow the evidence rather than being frozen now.

| ID / status | Checkpoint and tangible result | Main risk | Testing and exit evidence |
| --- | --- | --- | --- |
| P2.1 — not started | Let peer Users explore Phase 1 unaided on smartphones. Observe first, ask questions afterward, record non-identifying notes and choose revision priorities with the Developer. | Agent/Developer assumptions about discovery and enjoyment. | Separate what Users did/said from interpretation; capture evidence on trigger discovery, hints, pause, readability, story comprehension and pacing. |
| P2.2 — not started | Address the highest-priority findings in small, reviewed changes; update spec/research only where intended behavior or decisions change. | Broad redesign or breaking the approved scene/working story. | Each revision has a linked observation and before/after evidence; rerun related Phase 1 behavior. Repeat this checkpoint per distinct priority. |
| P2.3 — not started | Approve carousel storyboard, trigger/hint design and any additional assets/sounds. | Existing horse masks cannot support proposed motion. | 5–10 second narrative review; static extremes/occlusions and reduced-motion plan; verify source/credits. Prefer small bobs; no full rotation. |
| P2.4 — not started | Implement carousel audiovisual sequence and reset through the shared lifecycle. | New effects interfere with Story 1 or pause state. | Time the sequence, pause at each stage, repeat playback and verify both stories' reset frames and audio cleanup. |
| P2.5 — not started | Add carousel discovery, progress, feedback and progressive hints. | Competing hint timers or simultaneous stories. | Touch/keyboard discovery tests, cross-story lockout, hint timing during pause, replay and Story 1 regression. Review with Developer. |
| P2.6 — not started | Approve prize-stall storyboard, trigger/hints and asset scope. Use the ghost/cat pair unless independent poses are deliberately approved. | Unplanned hidden-surface work or a gesture without a clear story arc. | 5–10 second narrative review; inspect static poses/joins, reduced-motion treatment and verified sound choices. |
| P2.7 — not started | Implement prize sequence, cleanup and replay using the shared lifecycle. | Toy edges/shelf overlap or incomplete reset. | Inspect motion extremes, time sequence, pause/resume at each stage and repeat playback; regress existing stories. |
| P2.8 — not started | Add prize discovery, unique feedback/progress and progressive hints. | Three stories compete for input and clues. | Test each alone and in varied order, repeated/mixed inputs, lockout and reset. Confirm every scene action has audiovisual feedback. |
| P2.9 — not started | Playtest the complete experience, revise highest-priority findings, then polish visuals, sound balance and pacing within the approved direction. | Accumulated special cases or phone slowdowns. | Observe unaided peers again; check whether revisions improve the recorded issue. Review shared state/reset logic and simplify duplicated/conflicting behavior; run full regression afterward. |
| P2.10 — not started | Final HTTPS/device verification and delivery; add the provided debrief.md when available and complete it. | Missing evidence, credits, requirement or delivery file. | Verify every brief/spec requirement, all three 5–10 second stories and replays, accessibility/reduced motion, global pause, licensed assets and final deployed phone behavior. Deliver notes/revisions/evidence, full files, updated docs/credits, git log and completed debrief. |

## Evidence and completion discipline

For each checkpoint record its ID, observed result, check command/manual steps, device/browser where relevant, evidence path, remaining defects and Developer review outcome. Runtime automation should test actual lifecycle/timing guarantees; screenshots and human observation judge visual blend and narrative clarity.

Do not equate a desktop viewport screenshot with physical-phone verification. Test the actual deployed URL and record results. Keep meaningful working git checkpoints and check secrets before commits. Record playtest observations without identifying participants.

Link decisions to research.md and intended behavior to spec.md rather than copying every implementation detail. Retain earlier evidence when revising, and keep all three documents current for consequential changes.

## P1.1 results — subsequently approved by Developer

Implemented in index.html, src/css/app.css, src/js/app.js and src/js/playback.js. Preserved the original inspector as dev/previews/index.html?view=artwork and retained comparison pages. App code uses the existing artwork compositor and all original asset files unchanged. Before Enter no audio/effects exist, active time stays zero, and the frame loop/input gate are inactive. Enter starts the lifecycle; keyboard/touch Play/Pause freezes/resumes the active clock. Reduced-motion preference initializes before entry and follows live changes. Switching away pauses and requires explicit Play on return.

Verification:

- `node --test tests/unit/playback.test.mjs`: 3 tests passed, including a simulated 60-second pause excluded from active time, repeated transition safety and reduced-motion updates without losing paused state/time.
- `node tests/browser/check-shell.mjs archive/reviews/p1-1-checked`: passed pre-entry gating, Enter/focus, Space pause, touch resume, frozen paused time, live reduced-motion change, synthetic hidden-tab pause/explicit return and rapid toggles with one scheduled loop. No page errors or HTTP failures.
- Portrait 390 × 844, 375 × 667, 320 × 568 and landscape 844 × 390 fit the viewport with no scroll; Play/Pause target remains 44 × 44 CSS px. Screenshots and checks.json are in archive/reviews/p1-1-checked/.
- Hash comparison against the pre-checkpoint snapshot: all 18 assets/reference files unchanged. Visually inspected start, playing and paused screens and artwork-only captures.
- **Unresolved check:** strict rendered pixel equality between the app and review screenshot failed twice. Stopped this comparison approach rather than continuing variations. Captures are in archive/reviews/p1-1-final/; the attempted test is preserved in docs/history/20261016-145826/check-shell-artwork-attempt.mjs. Exact cause is not established; no pixel-identical rendering claim is made. Functional browser tests are separate from this unresolved visual assertion.

Historical P1.1 limits: no audio/effect/story participants were connected, so actual audiovisual pause was not verified. Hidden-tab behavior used synthetic visibility events, not a physical phone. There was no bell interaction or P1.2 implementation. Developer subsequently approved this checkpoint; its strict app-versus-review rendering comparison remains unresolved.

## P1.2 initial result — visibility revision requested

Implemented src/js/lighting.js, connected through src/js/app.js, with a separate SVG overlay styled in src/css/app.css. Original artwork, masks, layer transforms and geometry are unchanged. Light varies gently over existing wheel bulbs (8-second cycle) and within the corrected gondola (11-second cycle), with low opacity and soft edges. There are no independent animation timers or CSS animations: both values derive from shared active elapsed time. Before Enter the overlay is hidden. Pause holds its phase; Play resumes that phase. Reduced-motion mode uses constant illumination, both on initial entry and when changed live.

Verification:

- `node --test tests/unit/playback.test.mjs tests/unit/lighting.test.mjs`: all 5 tests passed, including exclusion of a 90-second pause from lighting phase and constant reduced-motion illumination.
- `node tests/browser/check-lighting.mjs`: passed entry gating, both light groups advancing, exact rendered freeze during pause, immediate resume-phase continuity, clock-derived phase after resume, initial/live reduced motion, simulated hidden-tab freeze and repeated toggles with one overlay/one scheduled loop. Paused scene screenshots 500 ms apart were pixel-identical. This successful same-scene freeze check is separate from P1.1's unresolved app-versus-review pixel comparison.
- P1.1 browser regression passed: keyboard Enter/focus, Space pause, touch resume, state/time freeze, interruption policy, rapid toggles, 44 × 44 target and no viewport overflow at three portrait sizes plus landscape. All 18 original assets/reference files still match the pre-P1.1 hash inventory.
- Visually inspected low/high opacity screenshots. Evidence: archive/reviews/p1-2/ and archive/reviews/p1-2-shell-regression/. No browser errors or HTTP failures.

Reduced-motion values: wheel 0.12 and gondola 0.08 opacity. Normal bounds: wheel 0.04–0.20, gondola 0.03–0.13. These are restrained additive overlays; original painted lights remain visible. Independent cycles are not synchronized into a flashing pattern. This counts as one ambient-lighting system, not two required ambient effects.

Limits: physical-phone verification remains pending; visibility tests use synthetic events. No fog, bats, audio or story behavior has been added. P1.3 remains unstarted. Pre-P1.2 files are preserved in docs/history/20261016-151003/.

## Next action after review

P1.10a and the Developer’s P1.10b phone review are complete. Final submission archive preparation is explicitly authorized; see docs/SUBMISSION.md and the final verification sidecar for inventory/runtime acceptance. Once the final report says passed, provide the ZIP/live URL and close Phase 1. Phase 2 remains deferred.

### P1.2 visibility revision — Developer review pending

Developer tested the initial effect and reported that animation was hard to notice. Revised only the light overlay: greater bright/dim contrast, broader soft halos, 5-second wheel and 6.5-second gondola pulses, each with a small smooth shimmer. No sharp flashes, wheel rotation, raster edits or carriage-structure changes. Reduced motion stays constant. Exact bounds and periods are in spec.md; earlier values/results above describe the initial version.

Tests: all 5 playback/lighting unit tests passed. `node tests/browser/check-lighting.mjs archive/reviews/p1-2-visible` passed Enter gating, normal variation, exact rendered pause freeze, resume phase, initial/live reduced motion, synthetic hidden-tab pause and repeated toggles. Phone-size low/high captures differ by at least 8 RGB levels at 2,875 wheel-region pixels and 438 gondola-region pixels; this quantifies increased visible range, not a substitute for Developer judgement. Visually inspected both captures.

`node tests/browser/check-shell.mjs archive/reviews/p1-2-visible-shell` passed keyboard/touch, clock/input gating and viewport regressions; all 18 original artwork files still match their stored hashes. No page/HTTP errors. Evidence is saved in those output directories. Pre-revision code/docs/tests are preserved in docs/history/20261016-153242/. Physical-phone verification remains pending. Stopped at revised P1.2; P1.3 and later work remain unstarted.

### P1.2 final alignment refinement — stopped for review

Developer approved the revised visibility/animation style and requested only rim/spoke alignment, explicitly excluding P1.3 and any additional features today. Replaced estimated overlay coordinates with centers checked against the actual painted bulbs, especially correcting the lower-left spoke. Same 55 halos, same radius, same brightness/pulse/shimmer functions and same gondola glow; wheel and all underlying artwork remain stationary/unchanged. Read-only source analysis is in tools/inspect-wheel-lights.mjs; no detection or new interaction was added to the app.

Checks completed:

- `node --test tests/unit/playback.test.mjs tests/unit/lighting.test.mjs`: 5 passed.
- `node tests/browser/check-light-alignment.mjs`: all 55 centers have bright warm bulb pixels within 3 source pixels; brightness values in normal/reduced-motion modes exactly match the pre-adjustment function over sampled active times. Native-resolution wheel and phone screenshots visually inspected.
- `node tests/browser/check-lighting.mjs archive/reviews/p1-2-alignment-playback`: passed Enter gating, pixel-identical scene freeze during Pause, same-phase resume, live/initial reduced motion, interruption pause and repeated toggles.
- `node tests/browser/check-shell.mjs archive/reviews/p1-2-alignment-shell`: passed keyboard/touch, shared clock/input gate, target sizing and three portrait/one landscape viewport checks. All 18 original artwork/reference files remain unchanged by hash. No page/HTTP errors.

Evidence: archive/reviews/p1-2-alignment/, archive/reviews/p1-2-alignment-playback/ and archive/reviews/p1-2-alignment-shell/. Pre-adjustment source/docs preserved in docs/history/20261016-153817/. Physical-phone verification remains pending. Final P1.2 alignment is held for Developer review. P1.3 is not started; no additional Phase 1 or Phase 2 feature work was performed.

## P1.3 fog results — subsequently approved by Developer

Implemented src/js/fog.js and connected it to the existing playback coordinator through src/js/app.js. Six soft SVG wisps drift in two groups along the path, with 28/34-second horizontal cycles and bounded vertical movement. The fog overlay sits behind the booth and retained foreground to preserve pumpkin/vegetation silhouettes; it is noninteractive and never replaces the underlying artwork. No new raster assets, wheel movement or lighting changes. Before Enter fog is hidden; Pause freezes shared active time and transforms; Play resumes the saved phase. Reduced-motion mode uses static wisps, initialized before entry and followed live.

Verification:

- `node --test tests/unit/playback.test.mjs tests/unit/lighting.test.mjs tests/unit/fog.test.mjs`: 7 passed; includes a 120-second pause with fog/lighting phase preserved, bounded drift and constant reduced-motion transforms.
- `node tests/browser/check-fog.mjs archive/reviews/p1-3-functional`: passed start gating, simultaneous fog/light advancement, exact frozen clock/opacities/transforms while paused, same-phase resume, initial/live reduced motion, synthetic hidden-tab freeze and repeated toggles with one fog overlay/one shared frame loop. Left/right extreme screenshots visually inspected.
- Lighting regression passed at archive/reviews/p1-3-lighting-regression/, including same-scene rendered freeze through mouse activation. Shell regression passed at archive/reviews/p1-3-shell-regression/: keyboard/touch, clock/input gate, three portrait and one landscape viewport, all 18 original artwork/reference file hashes unchanged. No page/HTTP errors.
- **Unresolved test:** touch-enabled screenshot byte equality failed twice despite frozen state/transforms. First attempted comparison included native touch-button feedback; second excluded app UI but still failed. Stopped this comparison approach rather than retrying variants. Failed captures are in archive/reviews/p1-3/ and p1-3-verified/; attempted test preserved in docs/history/20261016-154736/check-fog-screenshot-attempt.mjs. Functional checks are separate and do not claim pixel identity for this touch capture.

Pre-checkpoint files are preserved in docs/history/20261016-154736/. Physical-device verification remains pending; browser visibility tests were synthetic. Fog plus lighting are two of the three required ambient systems. Bats, audio, story, credits, Git, deployment, phone verification and final ZIP remain incomplete. P1.4 and all Phase 2 work are unstarted. Stop here for Developer review.

## P1.4 bats results — subsequently approved by Developer

Added src/js/bats.js and connected it to the existing shared playback lifecycle; one noninteractive SVG overlay holds two original code-native silhouettes. Each makes a 9-second pass, staggered at 3/5 seconds into a 22-second cycle, with idle intervals. Paths occupy source y=227..305, above the wheel hub and attractions and away from controls/hints. Soft entry/exit opacity and small wing movement avoid abrupt appearance. Wheel geometry, lighting behavior, fog and artwork assets are unchanged.

No bats before Enter. Normal playback advances flight, wings and opacity only from active elapsed time. Pause freezes them with lighting/fog; Play resumes the saved phase. Initial/live reduced-motion mode hides flying bats, leaving the reference's static silhouettes intact. No independent animation timer or CSS animation was added.

Verification:

- `node --test tests/unit/playback.test.mjs tests/unit/lighting.test.mjs tests/unit/fog.test.mjs tests/unit/bats.test.mjs`: 9 passed, including bounded routes, idle intervals, reduced-motion flight suppression and combined phase preservation across a 90-second pause.
- `node tests/browser/check-bats.mjs`: passed Enter gating, visible flight/wing progression, exact clock/DOM-state freeze across all three systems with touch Pause, resume-phase continuity, initial/live reduced motion, synthetic hidden-tab pause and repeated toggles with one overlay/one frame loop. No page/HTTP errors.
- Fog and shell browser regressions passed; all 18 original artwork/reference file hashes unchanged. Three portrait and one landscape viewport fit with no scroll, keyboard/touch controls and target size retained.
- Visually inspected phone flight screenshot. Evidence: archive/reviews/p1-4/, p1-4-fog-regression/ and p1-4-shell-regression/. Pre-checkpoint files preserved in docs/history/20261016-155710/.

Limits: physical-phone verification remains pending; interruption tests were synthetic. Prior strict touch screenshot comparisons remain unresolved; current assertions verify exact shared clock/DOM transforms and do not claim rendered pixel equality. There are now three implemented ambient systems, but Phase 1 remains incomplete without audio, story, credits, final integration, Git/history, GitHub Pages deployment, actual-phone public-link verification and an extraction-tested submission ZIP with current documents/Git log. Stop at P1.4; P1.5 and all Phase 2 work are unstarted.

## P1.5 ambient audio — subsequently approved by Developer

Selected remaxim's Short wind sound from OpenGameArt. Verified the item’s author and CC0 listing/creator declaration against the original page and checked the CC0 deed. Exact URLs, original/derivative paths and processing details are in CREDITS.md. Downloaded the original after native network approval; no new image or story asset was generated.

Prepared a 3.235-second mono 22,050 Hz PCM loop with high/low-pass softening, one-second circular crossfade and peak normalization. Runtime gain is 0.30. The setting is deserted-midway wind, avoiding music, voices and startling story cues. This is a candidate for Developer listening review, not a claim of a completed human audition. Signal/loop measurements are in assets/audio/processing.json; sound reproduction/volume on an actual phone remains unverified.

AmbientAudio lazily creates/resumes Web Audio inside Enter/Play activation. No audio context exists before Enter. One looping source uses an offset from shared active time, including after late loads; Pause stops/disconnects it immediately and suspends the context. Resume uses the saved phase without stacked sources. Hidden-tab/pagehide and native AudioContext interruption pause the whole experience and require explicit Play. Failed audio leaves the visual scene usable with a concise retry notice; Pause/Play retries. Generation guards prevent a late fetch/decode/resume from making sound while paused.

Verification:

- Full playback/lighting/fog/bat/audio unit run: 12 passed. Audio tests cover active-time offsets, single source, load/pause races, failure handling and interruption notification.
- `node tests/browser/check-audio.mjs`: actual Chromium Web Audio decoded the local asset and produced measurable signal; continued beyond loop duration; passed keyboard Enter, touch pause/context suspension, shared-clock freeze, resume/rapid toggles, native context suspension, hidden-tab silence, reduced-motion audio, missing-file retry and delayed download while paused. Final audio code rechecked after strengthening interruption handling.
- Bat and shell regressions passed; all three effect states and viewport/input behavior retained. All 18 original artwork/reference files in the baseline hash inventory are unchanged. Newly added audio files are additional assets, not artwork replacements.
- Loop seam step measured about 0.00000021 normalized amplitude. This is a signal continuity check, not proof of subjective sound quality or phone speaker balance. No page/HTTP errors in success paths; the missing-file test deliberately serves a 404.

Evidence: archive/reviews/p1-5/, p1-5-bats-regression/ and p1-5-shell-final/. Pre-checkpoint files are preserved in docs/history/20261016-160301/. Existing historical screenshot comparison limitations remain unresolved; they were not retried. Native context suspension was tested, but real phone calls/OS interruptions and human listening remain pending. P1.6, story sounds and all Phase 2 work are unstarted. Phase 1 is still incomplete; public deployment, actual-phone verification and submission ZIP/Git log gates remain open.

## P1.6 story assets/storyboard — subsequently approved, including ghost v3

Prepared only Story 1. docs/artwork/story/STORYBOARD.md proposes an 8-active-second sequence: arrival 0–1.5, ticket 1.5–3.5, stamp/sparks 3.5–4.5, departure 4.5–6.5 and settle/reset 6.5–8. Reduced-motion plan uses stationary/opacity reveals and steady magical glow instead of travel/particles. Pause must retain story/cue position; later integration must use the shared clock/context, never the review audition players.

Prepared AI-generated ghost-attendant-v1.png and local booth-empty-interior-v1.png, original SVG bell/ticket/stamp/sparks and window mask, plus six processed WAV cues. Verified external bell and magic sources are CC0; authors, exact URLs and edits are recorded in CREDITS.md. PNG generation used the built-in image_gen tool; prompts in docs/artwork/story/PROMPTS.md. Only the original window aperture is overlaid during staged story beats; original frame/counter remain in front. Rest/reset removes temporary story layers. No production file or runtime effect was changed.

Static staging is at dev/previews/index.html?view=story. Select beats with keyboard/touch; optional audio controls audition one candidate at a time. This is a development review page, not a second app scene or live bell trigger. Visually inspected phone-size stamp staging and native-resolution booth detail. Scene art and props align; final Developer judgment remains pending.

Verification: `node tests/browser/check-story-assets.mjs` passed contiguous eight-second timeline, six static beats/window visibility, transparent ghost PNG (702,230 fully transparent pixels), six non-silent/unclipped decoded cues and distinct three-ring pitch/durations, zero page/HTTP errors and all 18 original artwork hashes unchanged. An initial peak-bound assertion was too strict for browser sample-rate conversion (ring 3 decoded peak about 0.513); corrected the check to meaningful non-silence/non-clipping rather than requiring the preparation peak to survive resampling exactly. All 12 existing runtime unit tests and the shell regression passed. Evidence: archive/reviews/p1-6/ and p1-6-shell-regression/. Pre-checkpoint docs preserved in docs/history/20261016-163002/.

No story motion/audio scheduling, playback lockout or bell interaction is implemented yet. P1.7 and P1.8 must test real playback/pause/reset/replay and touch/keyboard input. Prepared sounds need human audition and actual-phone verification. No Phase 2 asset or feature was created. Phase 1 remains incomplete; GitHub Pages, real-phone public-link verification and submission ZIP/current docs/Git log remain open gates. Stop here for review before P1.7.

## P1.6 ghost-only revision — subsequently approved

Developer requested a less welcoming, more mysterious old carnival attendant. Retained v1 and an intermediate v2; v3 is staged with obscured eyes, restrained features, weathered uniform, narrow silhouette and wispy lower fade. The first revision remained too youthful/polished; a second pass strengthened the shadowed, aged direction. Prompts: docs/artwork/story/PROMPTS.md. Static review: dev/previews/index.html?view=story (select Arrival, Ticket or Stamp). No P1.7/P1.8 implementation or Phase 2 work was started.

Verified `node tests/browser/check-story-assets.mjs archive/reviews/p1-6-ghost-v3`: all six poses, contiguous eight-second storyboard, transparent sprite, six non-silent/unclipped decoded sounds and all 18 baseline artwork files passed; no page/HTTP errors. Phone-size staging and booth detail inspected. A separate scope check confirmed 24 protected runtime/style/prop/audio files unchanged and that the staging module differs only by the ghost image filename. Evidence: archive/reviews/p1-6-ghost-v3/; prior files and scope inventory: docs/history/20261016-ghost-v2/. Character approval remains pending; Phase 1 submission gates remain open.

## P1.7/P1.8 implemented together — stopped for Developer review

Developer explicitly approved revised P1.6 and authorized both checkpoints plus a brief audit. Added src/js/ticket-story.js (active-time sequence/trigger/feedback/hints and staging adapter) and src/js/story-audio.js (short cues sharing the ambient context). Connected these to index.html/src/js/app.js with a transparent 44px minimum bell target and compact progress/failure messages. Original artwork, approved ghost, props, sounds, wheel geometry and ambience functions remain unchanged. No Phase 2 behavior or new creative asset was added.

Third ring starts eight active seconds: arrival, ticket, stamp/sparks, departure and settle/reset. Input is locked until completion, including through pause. Three increasingly bright/pitched responses and visible progress precede the story. Timed hints at entry/12/24 seconds continue after partial progress and freeze on pause. Reset restores resting story-overlay markup, clears progress/cues and permits replay without reload. Enter/Play activate only the existing audio context; Pause stops all cue/ambient sources. Resume starts remaining cue portions from active offsets. Initial sound loading gates the bell; missing cues have Pause/Play retry guidance, and missing story images safely disable the target with reload guidance.

Verification: 17 playback/lighting/fog/bat/ambient/story unit tests passed. Browser story checks passed three real-clock cycles, touch/Enter/Space, natural Tab from Play/Pause to bell, extra-click lockout, pauses at feedback and all five beats, frozen clock/DOM/hints, shared-context interruption, live reduced motion, measurable story signal, offset resume, exact resting-overlay reset and delayed/missing asset handling. All 18 original artwork/reference inventory hashes unchanged. Existing shell, ambient audio and all-three-effect regressions passed. Evidence: archive/reviews/p1-7-8-review/, p1-7-8-shell-final/, p1-7-8-audio-final/ and p1-7-8-bats/. Pre-checkpoint code/docs/test files: docs/history/20261016-p1-7-8/.

Corrected two test/integration issues: audio preparation now returns its promise so completion can be awaited; the ambient signal regression now retains the first gain's analyser rather than being overwritten by the new story channel. Both final checks passed. Historical rendered screenshot-comparison limitations remain unchanged; tests here prove exact paused state/DOM and resting-overlay reset, not universal rendered pixel identity.

Exact requirement audit: docs/PHASE-1-AUDIT.md. Remaining: Developer pacing/discovery/listening review; Developer credit/reference origin and public-use permission/in-app credits; P1.9 final quality/accessibility/main-art failure checks; genuine Git history/log; GitHub Pages deployed revision/HTTPS verification; actual-phone results; clean extraction-tested ZIP with current files/docs/log. No submission gate is claimed complete. Stop now for review; do not begin P1.9, deployment or Phase 2 automatically.

## P1.9 submission preparation — stopped before publishing/packaging

Developer approved the prototype and authorized required credits/accessibility/browser/path/Git work only. Confirmed Alex Rosemann and ChatGPT-generated reference origin with Developer; recorded both in CREDITS.md/research and an in-scene native Credits modal. It pauses the shared experience, retains story/progress, traps Tab/Shift-Tab among all controls, closes with Escape/Close, restores focus and requires explicit Play. Progressive hints now have live-status semantics. No approved image, sound, story timing or ambient function was changed.

Added startup image/stylesheet/mask readiness checks with disabled Enter and readable reload guidance on failure. Test findings: failed stylesheets may still expose a CSSStyleSheet, so request status is checked; default modal tab behavior varies across engines, so explicit full control order replaced boundary-only handling; the test waits for the queued native close event before asserting focus restoration. Main-image/mask/stylesheet 404s are tested alongside existing story/audio failure checks.

Final verification: 17 unit tests passed; story regression (three cycles/all beat pauses/cue signal/offsets/failure/reduced motion) and shell regression passed at archive/reviews/p1-9-story/ and p1-9-shell/. New preflight at archive/reviews/p1-9-final/ passed full audiovisual flow in Chromium and Firefox, and visual/accessibility/failure checks in WebKit. Five viewport sizes (including 280px narrow and landscape), 44px targets, ≥4.5:1 text contrast, modal focus/explicit resume, exact-case paths under /midnight-midway-check/ and all 18 artwork baseline hashes passed. WebKit 26.6 on this Windows test setup exposes neither AudioContext constructor: unavailable-audio fallback passed, but WebKit audio was **not** verified. Aggregate result: passed-with-environment-limit. No Safari/iPhone or screen-reader-user pass is claimed.

Initialized real local main history: first commit records the already-approved prototype and existing evidence, followed by the preparation checkpoint. No earlier commits were fabricated. Focused secret scanner runs before commits. Git writes initially hit sandbox restrictions/ownership mismatch; subsequent commands used only a workspace-scoped safe.directory override outside the sandbox, with no global trust setting change. Firefox sandbox launch stalled; owned test processes were stopped, and final browsers ran outside the sandbox. Test-browser downloads are outside the project and not bundled.

Prepared .nojekyll, .gitattributes, .gitignore and tools/export-git-log.mjs. docs/git/GIT-LOG.txt is exported after the final local commit and intentionally ignored to avoid a circular self-reference; include a refreshed export in the later ZIP. Publishing handoff: docs/GITHUB-PAGES.md. Actual-phone worksheet: docs/PHONE-VERIFICATION.md. Pre-preparation source/docs retained in docs/history/20261016-p1-9/ and Git baseline. Previous failed/intermediate preflight captures remain preserved; use p1-9-final/checks.json for current results.

Stop for review now. No remote, GitHub repository/upload, Pages deployment or submission ZIP was created. Next: approve local preparation, publish intended repository/main root, verify actual HTTPS assets/revision, test actual phone (including audio), then refresh docs/log and create/extract-test the complete submission ZIP. Phase 1 remains incomplete until all three deliverables pass. No Phase 2 work.

## P1.10a publication — complete; P1.10b phone gate pending

Developer explicitly authorized public alr5342/midnight-midway creation/push/Pages, with no different-account fallback. CLI was absent; existing Git Credential Manager login was verified as alr5342 through GitHub API. Created that exact public repository, attached credential-free origin and pushed existing main normally, preserving all three commits. Configured Pages main / (root), built successfully, HTTPS enforced. Repository: https://github.com/alr5342/midnight-midway; app: https://alr5342.github.io/midnight-midway/. No authentication/permissions failure or alternate account was used.

Public verification: `node tests/browser/check-live-pages.mjs https://alr5342.github.io/midnight-midway/ archive/reviews/pages-live` passed. 42 deployed source/image/mask/audio files matched local bytes (normalized source text line endings), including all seven runtime WAVs; Enter/decode, Credits/pause, touch progress/lockout, full story, frozen stamp pause/resume, keyboard reduced-motion replay, reset, viewport fit and normal-URL reload passed with no page/HTTP errors. Full app-tested commit 96cd9d56555b57d40a6a18fe0d671b38a00f1d82; first successful workflow https://github.com/alr5342/midnight-midway/actions/runs/38980313295. Follow-up deployment record commit adds only docs/tests/evidence; runtime/artwork/audio unchanged.

Evidence and remaining gates: docs/DEPLOYMENT.md, archive/reviews/pages-live/checks.json, docs/PHONE-VERIFICATION.md. Anonymous Pages metadata returned 404; authenticated status confirmed built/main/root/HTTPS and preserved history. No secrets saved; focused scan before upload/commits. Refresh Git log after the record commit. Stop for Developer's actual-phone test, then prepare/extract-test complete ZIP only after that gate passes. Phase 1 remains incomplete; no ZIP or Phase 2 work.

## P1.10b/P1.10c final submission — phone approved; extracted candidate verified

Developer reported that the live site worked on their phone, explicitly approved the phone review, and supplied iPhone 17 Pro / iOS 26.5.1 / Safari. Recorded that report in docs/PHONE-VERIFICATION.md without fabricating individual screenshots, OS-interruption or per-beat results. This satisfies the brief's actual-smartphone review gate.

Developer authorized final ZIP creation/extraction/testing. Added tools/package-phase1.mjs/.ps1: all Git-tracked project files plus refreshed docs/git/GIT-LOG.txt, one midnight-midway-phase1/ root, hidden deployment files, source/assets/audio originals, current documents, complete history/prompts/tests/screenshots and transcripts/.gitkeep. Excludes .git internals, secrets/caches/archive/logs/debug.log and recursive archives. Every included file has path/size/SHA-256 in generated SUBMISSION-MANIFEST.json. The brief requires no Phase 1 session transcripts; none are invented.

Candidate archive contained 537 entries. Fresh extraction matched every file/hash and passed 17 unit tests plus Chromium/Firefox full audiovisual preflight, WebKit visual/accessibility/failure checks and 18 unchanged artwork hashes. Windows WebKit's absent audio API remains a recorded environment limitation; actual iPhone Safari review is separately approved. Evidence: docs/ARCHIVE-CANDIDATE-VERIFICATION.json and archive/reviews/submission-candidate/. Final packaging rebuilds current records/log, independently extracts/tests that exact artifact, and records observed acceptance/file count/size/commit/checksum in its external verification JSON. Only status passed closes the final artifact gate.

No runtime/artwork/audio/creative change was made. Refresh/publish documentation and Git log, then deliver the final ZIP/location/live link once final extraction/runtime checks pass. Phase 2 remains deferred. See docs/SUBMISSION.md for complete deliverable scope and exclusions.

## Organizational cleanup — 2026-10-19

Developer approved consolidation on a separate branch. Scope: simplify directories and related previews/styles/helpers while preserving all media, gameplay, Git history, public site and Phase 1 materials. No creative/narrative implementation, merge, push or deployment before Developer review.

On chore/project-structure, five review pages now share one workspace; three scene stylesheets share a preserved cascade; startup/credits helpers live in app.js; scene/story artwork lives in artwork.js. Playback, audio, effects and story controllers remain separate. Current commands are in README.md; structure and relocated paths are in docs/PROJECT-STRUCTURE.md and docs/FILE-MAP.json. Existing Phase 1 ZIPs/extractions retain their original paths/bytes.

Checkpoint verification covers 17 unit tests, shell/audio/effects/story/preview regressions, three-browser Pages-subdirectory/accessibility/failure preflight, app geometry/captures, document links and preserved media/history/review/submission hashes. Windows WebKit audio remains an environment limitation. Observed results: docs/ORGANIZATION-CHECKS.json. Stop for Developer review after cleanup.

## Saving transcripts

Only when directed, save the entire current conversation as transcripts/plan-YYYY-MM-DD_HHMMSS.md or transcripts/build-YYYY-MM-DD_HHMMSS.md, with messages labeled Developer and Agent, and confirm the path.
