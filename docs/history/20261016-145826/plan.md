# Implementation Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Updated 2026-10-16. **The static visual design is approved. This forward development plan is proposed for review.** No animation, audio or story checkpoint has started. Complete Phase 1 first; Phase 2 is a roadmap to refine using playtest findings.

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
- [ ] Developer reviews these updated documents and forward plan.

Evidence and limitations: [booth review](assets/REVIEW.md), [attraction notes](assets/ARTWORK.md), [carriage notes](assets/GONDOLA.md); screenshots in artwork-review/booth-refinement-v2/, attractions-v3-final/ and carriage-v4/. Historical asset notes retain their original pending labels; the approval above supersedes those labels.

Current preview: `node serve.mjs` → http://127.0.0.1:4173. VS Code: Simple Browser: Show. No .git directory is currently present. Physical-phone testing, source-reference provenance, verified audio and public hosting remain unfinished. Prior versions of these documents are preserved in docs/history/20261016-144916/.

## Phase 1 — week 1 prototype

Goal: complete ambient-scene requirements, start screen, unified Play/Pause and one discoverable, replayable story; shareable HTTPS URL verified on a physical phone; current files/docs/git log.

These are sequential results, not permission to implement the entire table in one pass. Exact content is confirmed when needed.

| ID / status | Checkpoint and tangible result | Main risk | Testing and exit evidence |
| --- | --- | --- | --- |
| P1.0 — pending | Review this plan; confirm first story, three ambience systems, reduced-motion treatment and interruption/progress rules. Recommend ticket booth first, subject to Developer choice. Record the narrow runtime contract and agree repository/baseline preservation. | Building behavior or assets from unapproved assumptions. | Approved small behavior/story brief and explicit acceptance checks; baseline screenshots retained; repository setup/log verified when performed. |
| P1.1 — not started | Convert the review composition into the single-screen app shell while retaining separate review pages. Add the real start/Enter and Play/Pause controls, reduced-motion initialization and shared lifecycle. Use development diagnostics to verify the lifecycle before adding effects. | Fragmented state; pre-start activity; phone viewport or focus regressions. | Nothing starts before Enter. Keyboard/touch controls and focus work. Pause freezes diagnostic active time/input. Resize and safe-area checks; compare to approved artwork. |
| P1.2 — not started | Add only gentle lighting: wheel bulbs and subtle corrected-gondola glow. Wheel geometry stays stationary. | Overbright/strobing effect or altered approved carriage. | Resting/max-light screenshots; Enter gating; repeated pause/resume; reduced-motion alternative. Count this as one ambient system, not multiple effects. |
| P1.3 — not started | Add drifting fog in separate depth layers. | Fog obscures targets or exposes hard joins. | Inspect whole composition and foreground at maximum opacity/offset; pause mid-drift; verify reduced-motion and lighting regression. |
| P1.4 — not started | Add the third distinct ambient system, proposed occasional bats, with restrained density. | Clutter, excessive motion or weak phone performance. | Check paths against focal point/text; test all three systems together, global pause and reduced-motion behavior. Developer reviews pacing. |
| P1.5 — not started | Research, verify and audition public-domain/CC0 ambience, then add the selected loop to the shared lifecycle. Record source/license/credits before use. | Browser audio activation, poor loops, duplicate sound or unverified terms. | Enter activates audio; start/pause/resume and interruption policy tested in a browser and on a phone when available. Audition loop seam and balance; simulate unavailable audio; verify no stacked playback. |
| P1.6 — not started | Approve Story 1's timed beginning/middle/end and prepare only its missing artwork and verified sounds. For the proposed booth story: window/interior, attendant, ticket and stamp/response assets as needed. | Attractive scene without a clear story, or new art that breaks the visual baseline. | Review storyboard totaling 5–10 active seconds; static asset/occlusion comparison and reduced-motion alternative; verified audio register. Do not commission other stories' assets yet. |
| P1.7 — not started | Build Story 1's audiovisual sequence using a development-only launch path; complete reset/replay and shared pause integration before discovery logic. | Orphan effects/timers, bad timing or incomplete return to rest. | Measure active duration; pause/resume near beginning/middle/end; replay at least three times; inspect extremes and compare reset frame to baseline. Check story failure recovery. |
| P1.8 — not started | Add Story 1's approved discovery trigger, unique audiovisual feedback, visible progress, progressive hints and scene lockout. Remove development launch controls from the public experience. | Trigger is confusing, hints give away the answer, or input races launch concurrent actions. | Touch/keyboard equivalence; partial/wrong/repeated input; pause during feedback/hint delay; cross-input lockout; clear completion and replay without reload. Developer tests discovery before peer testing. |
| P1.9 — not started | Review Phase 1 as one coherent experience; fix scoped defects and finish accessibility, credits, loading/failure handling and source records. | Passing isolated checks while the combined app fails. | Run all Phase 1 checks in spec.md: all three ambience systems, start, pause, one complete story, reduced motion, text/targets/focus, repeated cycles, missing assets/audio and artwork regression. Confirm visual-reference permission and all audio terms for publication. |
| P1.10 — not started | Prepare agreed hosting, deploy over public HTTPS, verify on a physical smartphone and assemble the Phase 1 handoff. | Local success does not survive deployed URLs, mobile browsers or device interruptions. | Record URL, device/browser, actual touch/audio/start/pause/replay results and fixes. Confirm no missing files or console errors. Supply project files, current docs, sources/credits and git log. Mark Phase 1 complete only after all checks pass. |

The incomplete attractions must not behave like functioning story triggers in the Phase 1 public build. Their presentation can stay in the scene; confirm the affordance treatment during P1.0/P1.8. No new navigation, effects or stories are added merely to fill the prototype.

## Phase 2 — week 2 playtest, complete and polish

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

## Next action after review

P1.0: confirm the first-story choice and the small behavior contract. Then review the P1.1 implementation scope before changing runtime code. The current turn updates documentation only; approved artwork and all app code remain untouched.

## Saving transcripts

Only when directed, save the entire current conversation as transcripts/plan-YYYY-MM-DD_HHMMSS.md or transcripts/build-YYYY-MM-DD_HHMMSS.md, with messages labeled Developer and Agent, and confirm the path.
