# Implementation Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Updated 2026-10-16. **Phase 1 submission is the sole active goal.** Developer authorized continuation from lighting to P1.3 fog and selected GitHub Pages for eventual deployment. Fog is implemented and held for review. No bats, audio, bell or story sequence is implemented. Prioritize assignment requirements over extra polish; stop after each checkpoint. Phase 2 is deferred and not authorized.

## Phase 1 submission gates — all must be verified

| Required deliverable | Current state | Work still required |
| --- | --- | --- |
| Working prototype | Incomplete: approved scene, start screen, shared Play/Pause, lighting and newly implemented fog. | Review fog; add third ambient system (bats), verified public-domain/CC0 looping audio, complete 5–10 second ticket-booth story, three distinct ring responses/progress, progressive hints, replay/lockout, credits and combined accessibility/failure/runtime checks. |
| Shareable URL verified on actual phone | Not deployed or physically verified. GitHub Pages is the selected host. | Confirm repository/account, deploy final candidate, test public HTTPS URL/assets and user’s actual phone, record device/browser/results, fix defects and retest the deployed revision. Desktop emulation is insufficient. |
| Project files, current docs and Git log | Files/docs exist; folder has no Git repository/log and no submission ZIP. | Establish Git history with secret checks before commits, keep docs/credits/evidence current, export the final Git log, create and extract-test a clean submission ZIP matching the verified build. |

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
- [ ] Developer reviews P1.3 before continuing.

Evidence and limitations: [booth review](assets/REVIEW.md), [attraction notes](assets/ARTWORK.md), [carriage notes](assets/GONDOLA.md); screenshots in artwork-review/booth-refinement-v2/, attractions-v3-final/ and carriage-v4/. Historical asset notes retain their original pending labels; the approval above supersedes those labels.

Current app: `node serve.mjs` → http://127.0.0.1:4173. VS Code: Simple Browser: Show. Preserved static inspector: /artwork-review.html. No .git directory is currently present. Physical-phone testing, source-reference provenance, verified audio, repository setup and public hosting remain unfinished. Prior documents are preserved in docs/history/20261016-144916/; the pre-P1.1 files and artwork hash inventory are in docs/history/20261016-145826/.

## Phase 1 — week 1 prototype

Goal: complete ambient-scene requirements, start screen, unified Play/Pause and one discoverable, replayable story; shareable HTTPS URL verified on a physical phone; current files/docs/git log.

These are sequential results, not permission to implement the entire table in one pass. Exact content is confirmed when needed.

| ID / status | Checkpoint and tangible result | Main risk | Testing and exit evidence |
| --- | --- | --- | --- |
| P1.0 — scope confirmed; setup outstanding | Plan and three-ring ticket story approved. Hidden-tab pause requires explicit Play on return. Baseline preserved. Exact effect pacing/reduced-motion alternatives remain for their checkpoints; repository setup still outstanding. | Building behavior or assets from unapproved assumptions. | Story direction and interruption choice recorded; baseline copied and artwork hashes captured. No repository or commit was created in this checkpoint. |
| P1.1 — approved | Single-screen app shell, Enter, real Play/Pause, reduced-motion initialization and shared active-time lifecycle; preserved separate artwork inspector. | Fragmented state; pre-start activity; phone viewport or focus regressions. | Unit and functional browser checks pass; no scroll at tested sizes; 18 artwork files unchanged by hash. Historical strict screenshot comparison remains unresolved, documented below; Developer approved the shell. |
| P1.2 — carried forward on instruction to continue | Wheel-bulb lighting and corrected-gondola glow, aligned to painted bulbs and driven by shared clock. | Overbright/strobing effect or altered approved carriage. | Normal/reduced-motion, start gating, rendered freeze, resume phase, alignment and repeated toggles passed. This is one ambient system. |
| P1.3 — implemented; Developer review pending | Drifting fog wisps in separate path layers, behind booth and retained foreground. | Fog obscures targets or exposes hard joins. | Functional fog/light pause and resume, reduced motion, interruption and drift bounds passed; lighting/shell regressions passed. Touch screenshot-byte assertion unresolved after two attempts, documented below. |
| P1.4 — not started | Add the third distinct ambient system, proposed occasional bats, with restrained density. | Clutter, excessive motion or weak phone performance. | Check paths against focal point/text; test all three systems together, global pause and reduced-motion behavior. Developer reviews pacing. |
| P1.5 — not started | Research, verify and audition public-domain/CC0 ambience, then add the selected loop to the shared lifecycle. Record source/license/credits before use. | Browser audio activation, poor loops, duplicate sound or unverified terms. | Enter activates audio; start/pause/resume and interruption policy tested in a browser and on a phone when available. Audition loop seam and balance; simulate unavailable audio; verify no stacked playback. |
| P1.6 — not started | Detail the approved three-ring ticket story's timed arc and prepare only its missing artwork/sounds: bell, window/interior, ghostly attendant, floating ticket, stamp and magical sparks. | Attractive scene without a clear story, or new art that breaks the visual baseline. | Review storyboard totaling 5–10 active seconds; static asset/occlusion comparison and reduced-motion alternative; verified audio register. Do not commission other stories' assets yet. |
| P1.7 — not started | Build Story 1's audiovisual sequence using a development-only launch path; complete reset/replay and shared pause integration before discovery logic. | Orphan effects/timers, bad timing or incomplete return to rest. | Measure active duration; pause/resume near beginning/middle/end; replay at least three times; inspect extremes and compare reset frame to baseline. Check story failure recovery. |
| P1.8 — not started | Add three valid bell activations, different audiovisual feedback per ring, visible progress, progressive hints and scene lockout. Third ring launches one story. Reset progress on completion for replay; freeze progress on pause. Remove development launch controls from the public experience. | Trigger is confusing, hints give away the answer, or input races launch concurrent actions. | Touch/keyboard equivalence; partial/repeated input; third-ring single launch; pause during feedback/hints; lockout; clear completion and replay without reload. Developer tests discovery before peer testing. |
| P1.9 — not started | Review Phase 1 as one coherent experience; fix scoped defects and finish accessibility, credits, loading/failure handling and source records. | Passing isolated checks while the combined app fails. | Run all Phase 1 checks in spec.md: all three ambience systems, start, pause, one complete story, reduced motion, text/targets/focus, repeated cycles, missing assets/audio and artwork regression. Confirm visual-reference permission and all audio terms for publication. |
| P1.10a — not started | Deploy the requirement-complete candidate through GitHub Pages using the agreed repository. | Incorrect repository/path or files missing from public build. | Record repository, deployed revision and public HTTPS URL; verify relative asset/module/audio paths, reload/direct entry and no missing resources. Stop for review. |
| P1.10b — not started | User verifies the public link on their actual smartphone. | Desktop automation misses phone touch/audio/interruption failures. | Record device/browser and observed start, all ambience/audio, pause/resume, bell/progress/hints, full story/replay, reduced motion and viewport behavior. Fix/redeploy/retest failures. No completion claim without this evidence. |
| P1.10c — not started | Prepare the final submission ZIP after the deployed revision passes phone testing. | Stale build, absent Git log/docs, leaked secrets or unusable archive. | Export final Git log; include project sources, assets, current docs, credits and relevant tests/evidence. Exclude credentials/caches, Git internals and recursive submission archives; preserve all local work. Extract to a fresh workspace folder, verify file inventory and run the extracted app. Record ZIP filename, tested deployed revision and all three deliverable gates. |

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

Implemented in index.html, app.css, app.js and playback.js. Preserved the original inspector as artwork-review.html and retained comparison pages. App code uses the existing artwork compositor and all original asset files unchanged. Before Enter no audio/effects exist, active time stays zero, and the frame loop/input gate are inactive. Enter starts the lifecycle; keyboard/touch Play/Pause freezes/resumes the active clock. Reduced-motion preference initializes before entry and follows live changes. Switching away pauses and requires explicit Play on return.

Verification:

- `node --test tests/playback.test.mjs`: 3 tests passed, including a simulated 60-second pause excluded from active time, repeated transition safety and reduced-motion updates without losing paused state/time.
- `node tests/check-shell.mjs artwork-review/p1-1-checked`: passed pre-entry gating, Enter/focus, Space pause, touch resume, frozen paused time, live reduced-motion change, synthetic hidden-tab pause/explicit return and rapid toggles with one scheduled loop. No page errors or HTTP failures.
- Portrait 390 × 844, 375 × 667, 320 × 568 and landscape 844 × 390 fit the viewport with no scroll; Play/Pause target remains 44 × 44 CSS px. Screenshots and checks.json are in artwork-review/p1-1-checked/.
- Hash comparison against the pre-checkpoint snapshot: all 18 assets/reference files unchanged. Visually inspected start, playing and paused screens and artwork-only captures.
- **Unresolved check:** strict rendered pixel equality between the app and review screenshot failed twice. Stopped this comparison approach rather than continuing variations. Captures are in artwork-review/p1-1-final/; the attempted test is preserved in docs/history/20261016-145826/check-shell-artwork-attempt.mjs. Exact cause is not established; no pixel-identical rendering claim is made. Functional browser tests are separate from this unresolved visual assertion.

Historical P1.1 limits: no audio/effect/story participants were connected, so actual audiovisual pause was not verified. Hidden-tab behavior used synthetic visibility events, not a physical phone. There was no bell interaction or P1.2 implementation. Developer subsequently approved this checkpoint; its strict app-versus-review rendering comparison remains unresolved.

## P1.2 initial result — visibility revision requested

Implemented lighting.js, connected through app.js, with a separate SVG overlay styled in app.css. Original artwork, masks, layer transforms and geometry are unchanged. Light varies gently over existing wheel bulbs (8-second cycle) and within the corrected gondola (11-second cycle), with low opacity and soft edges. There are no independent animation timers or CSS animations: both values derive from shared active elapsed time. Before Enter the overlay is hidden. Pause holds its phase; Play resumes that phase. Reduced-motion mode uses constant illumination, both on initial entry and when changed live.

Verification:

- `node --test tests/playback.test.mjs tests/lighting.test.mjs`: all 5 tests passed, including exclusion of a 90-second pause from lighting phase and constant reduced-motion illumination.
- `node tests/check-lighting.mjs`: passed entry gating, both light groups advancing, exact rendered freeze during pause, immediate resume-phase continuity, clock-derived phase after resume, initial/live reduced motion, simulated hidden-tab freeze and repeated toggles with one overlay/one scheduled loop. Paused scene screenshots 500 ms apart were pixel-identical. This successful same-scene freeze check is separate from P1.1's unresolved app-versus-review pixel comparison.
- P1.1 browser regression passed: keyboard Enter/focus, Space pause, touch resume, state/time freeze, interruption policy, rapid toggles, 44 × 44 target and no viewport overflow at three portrait sizes plus landscape. All 18 original assets/reference files still match the pre-P1.1 hash inventory.
- Visually inspected low/high opacity screenshots. Evidence: artwork-review/p1-2/ and artwork-review/p1-2-shell-regression/. No browser errors or HTTP failures.

Reduced-motion values: wheel 0.12 and gondola 0.08 opacity. Normal bounds: wheel 0.04–0.20, gondola 0.03–0.13. These are restrained additive overlays; original painted lights remain visible. Independent cycles are not synchronized into a flashing pattern. This counts as one ambient-lighting system, not two required ambient effects.

Limits: physical-phone verification remains pending; visibility tests use synthetic events. No fog, bats, audio or story behavior has been added. P1.3 remains unstarted. Pre-P1.2 files are preserved in docs/history/20261016-151003/.

## Next action after review

Review P1.3 at the local app URL: Enter, inspect the path fog and lights, Pause, wait, then Play. After review, the next effect is P1.4 bats; keep repository setup tracked so subsequent checkpoints have real Git history. Do not start another checkpoint before review. GitHub Pages, actual-phone verification and ZIP packaging remain later delivery gates; Phase 2 remains deferred.

### P1.2 visibility revision — Developer review pending

Developer tested the initial effect and reported that animation was hard to notice. Revised only the light overlay: greater bright/dim contrast, broader soft halos, 5-second wheel and 6.5-second gondola pulses, each with a small smooth shimmer. No sharp flashes, wheel rotation, raster edits or carriage-structure changes. Reduced motion stays constant. Exact bounds and periods are in spec.md; earlier values/results above describe the initial version.

Tests: all 5 playback/lighting unit tests passed. `node tests/check-lighting.mjs artwork-review/p1-2-visible` passed Enter gating, normal variation, exact rendered pause freeze, resume phase, initial/live reduced motion, synthetic hidden-tab pause and repeated toggles. Phone-size low/high captures differ by at least 8 RGB levels at 2,875 wheel-region pixels and 438 gondola-region pixels; this quantifies increased visible range, not a substitute for Developer judgement. Visually inspected both captures.

`node tests/check-shell.mjs artwork-review/p1-2-visible-shell` passed keyboard/touch, clock/input gating and viewport regressions; all 18 original artwork files still match their stored hashes. No page/HTTP errors. Evidence is saved in those output directories. Pre-revision code/docs/tests are preserved in docs/history/20261016-153242/. Physical-phone verification remains pending. Stopped at revised P1.2; P1.3 and later work remain unstarted.

### P1.2 final alignment refinement — stopped for review

Developer approved the revised visibility/animation style and requested only rim/spoke alignment, explicitly excluding P1.3 and any additional features today. Replaced estimated overlay coordinates with centers checked against the actual painted bulbs, especially correcting the lower-left spoke. Same 55 halos, same radius, same brightness/pulse/shimmer functions and same gondola glow; wheel and all underlying artwork remain stationary/unchanged. Read-only source analysis is in tools/inspect-wheel-lights.mjs; no detection or new interaction was added to the app.

Checks completed:

- `node --test tests/playback.test.mjs tests/lighting.test.mjs`: 5 passed.
- `node tests/check-light-alignment.mjs`: all 55 centers have bright warm bulb pixels within 3 source pixels; brightness values in normal/reduced-motion modes exactly match the pre-adjustment function over sampled active times. Native-resolution wheel and phone screenshots visually inspected.
- `node tests/check-lighting.mjs artwork-review/p1-2-alignment-playback`: passed Enter gating, pixel-identical scene freeze during Pause, same-phase resume, live/initial reduced motion, interruption pause and repeated toggles.
- `node tests/check-shell.mjs artwork-review/p1-2-alignment-shell`: passed keyboard/touch, shared clock/input gate, target sizing and three portrait/one landscape viewport checks. All 18 original artwork/reference files remain unchanged by hash. No page/HTTP errors.

Evidence: artwork-review/p1-2-alignment/, artwork-review/p1-2-alignment-playback/ and artwork-review/p1-2-alignment-shell/. Pre-adjustment source/docs preserved in docs/history/20261016-153817/. Physical-phone verification remains pending. Final P1.2 alignment is held for Developer review. P1.3 is not started; no additional Phase 1 or Phase 2 feature work was performed.

## P1.3 fog results — held for review

Implemented fog.js and connected it to the existing playback coordinator through app.js. Six soft SVG wisps drift in two groups along the path, with 28/34-second horizontal cycles and bounded vertical movement. The fog overlay sits behind the booth and retained foreground to preserve pumpkin/vegetation silhouettes; it is noninteractive and never replaces the underlying artwork. No new raster assets, wheel movement or lighting changes. Before Enter fog is hidden; Pause freezes shared active time and transforms; Play resumes the saved phase. Reduced-motion mode uses static wisps, initialized before entry and followed live.

Verification:

- `node --test tests/playback.test.mjs tests/lighting.test.mjs tests/fog.test.mjs`: 7 passed; includes a 120-second pause with fog/lighting phase preserved, bounded drift and constant reduced-motion transforms.
- `node tests/check-fog.mjs artwork-review/p1-3-functional`: passed start gating, simultaneous fog/light advancement, exact frozen clock/opacities/transforms while paused, same-phase resume, initial/live reduced motion, synthetic hidden-tab freeze and repeated toggles with one fog overlay/one shared frame loop. Left/right extreme screenshots visually inspected.
- Lighting regression passed at artwork-review/p1-3-lighting-regression/, including same-scene rendered freeze through mouse activation. Shell regression passed at artwork-review/p1-3-shell-regression/: keyboard/touch, clock/input gate, three portrait and one landscape viewport, all 18 original artwork/reference file hashes unchanged. No page/HTTP errors.
- **Unresolved test:** touch-enabled screenshot byte equality failed twice despite frozen state/transforms. First attempted comparison included native touch-button feedback; second excluded app UI but still failed. Stopped this comparison approach rather than retrying variants. Failed captures are in artwork-review/p1-3/ and p1-3-verified/; attempted test preserved in docs/history/20261016-154736/check-fog-screenshot-attempt.mjs. Functional checks are separate and do not claim pixel identity for this touch capture.

Pre-checkpoint files are preserved in docs/history/20261016-154736/. Physical-device verification remains pending; browser visibility tests were synthetic. Fog plus lighting are two of the three required ambient systems. Bats, audio, story, credits, Git, deployment, phone verification and final ZIP remain incomplete. P1.4 and all Phase 2 work are unstarted. Stop here for Developer review.

## Saving transcripts

Only when directed, save the entire current conversation as transcripts/plan-YYYY-MM-DD_HHMMSS.md or transcripts/build-YYYY-MM-DD_HHMMSS.md, with messages labeled Developer and Agent, and confirm the path.
