# Technical Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Updated 2026-10-16. **Approved:** static visual design, forward plan, P1.1 shell, ticket-booth Story 1 narrative/three-ring trigger, and hidden-tab pause with explicit Play to resume. P1.2 lighting is implemented and awaits Developer review. Later checkpoints remain unstarted.

## Goal, scope and current state

Meet [brief.md](brief.md) through one portrait, browser-based Halloween scene that rewards exploration and promotes an unbranded theme park. Tone is playful and spooky for ages 10+, without disturbing gore, realistic violence or real-world suffering.

Phase 1 delivers the complete ambience, start screen, unified Play/Pause and **one complete discoverable story**, deployed over HTTPS and verified on a physical phone. Phase 2 adds peer-informed revisions, the remaining two stories and final polish/evidence/debrief. Phase 1 takes priority over expanding features.

Current implementation is a buildless HTML/CSS/JavaScript **app shell with P1.2 lighting**, not the complete Phase 1 experience. Preview: `node serve.mjs`, then http://127.0.0.1:4173 in VS Code Simple Browser. No install/build is required. The preserved static inspector is at /artwork-review.html. Its review controls/page scrolling are separate from the single-screen app.

## Approved visual contract

- Preserve the current assembled scene: Ferris wheel focal point, left ticket booth, center carousel, right prize stall, moonlit sky, wet path, pumpkins and foreground framing.
- Preserve palette, texture, relative scale, placement and corrected open gondola structure/glow. Wheel remains stationary; horses use small bobs rather than rotation.
- Share the original 941 × 1672 artwork coordinates across source images, masks, repairs, effects and future hit areas. Scale the scene consistently; retain all three attractions at supported portrait sizes.
- Preserve the booth's existing scale/translation and the original foreground overlay that restores its pumpkin, vegetation and fog.
- Retain three independent horse masks, the paired ghost/cat mask, hidden-surface repairs, and fixed poles/railing/shelf trim. Keep repairs localized; use appropriate foreground overlap.
- Retain approved upper-left Play/Pause and bottom-center hint placement. The existing hint text and pause symbol are static placeholders, not functioning controls or final copy.
- Add future effects in separate layers; do not bake motion into or regenerate the approved full background. Check small motion offsets against masks before accepting an effect.
- Preserve original assets and version new candidates. Artwork references, prompts, source/credit status and known limits are in [research.md](research.md), [ARTWORK.md](assets/ARTWORK.md) and [GONDOLA.md](assets/GONDOLA.md).

Acceptance: original/approved/current phone screenshots show no unintended crop, movement, missing pumpkin, rectangular cutoff, duplicate subject edge or visible repair gap. Compare both resting and maximum motion positions. Static artwork approval does not establish motion quality.

## P1.1 shared behavior model

Keep the buildless project structure. Use one small runtime coordinator for playback state and active elapsed time, with effects, audio, hints, feedback and story sequences participating in that lifecycle. This prevents independently running timers or sounds from continuing while paused.

Implemented states: start, exploring and paused. Before Enter, active time is zero, no frame loop is scheduled and scene input is gated off. Enter starts the active-time clock and focuses the real Play/Pause button. Pause freezes active time, gates scene input and cancels the frame loop; Play resumes the saved time. Subscribed future systems receive shared state, elapsed time and reduced-motion preference. The app uses one scheduled frame loop while exploring and none while paused/start. Reduced-motion preference is read before entry and followed live.

The approved interruption rule pauses on hidden-tab/pagehide events and never resumes merely because the tab becomes visible again. Play is required. User-facing controls have keyboard focus styling and at least 44 × 44 CSS-pixel targets; the scene fits without scrolling, preserving full artwork proportions and safe-area padding.

Future story-playing state must retain story ownership through pause, lock other scene actions and use explicit completion/reset. Story state and audio are not implemented. Lighting is the first participant connected to the shared lifecycle; the current hint remains static placeholder copy.

### P1.2 lighting contract

Use a separate, noninteractive SVG light overlay; never change underlying raster assets or wheel/gondola geometry. Following Developer feedback that the initial lighting was hard to notice, wheel bulbs now use a 5-second breathing pulse with a small smooth 1.7-second shimmer, opacity bounded at 0.10–0.70. Gondola glow uses a 6.5-second pulse and small 2.1-second shimmer, opacity bounded at 0.10–0.72. Soft bulb halos have radius 11 in original scene coordinates; the gondola glow is a 36 × 28-radius ellipse within/around its open interior. No carriage panels or wheel movement are added.

Both derive only from shared active time and have no independent timers/CSS animation. Before Enter the overlay contributes no pixels. Pause holds the rendered phase; resume continues rather than resets. Reduced-motion mode has constant wheel/gondola opacity 0.26/0.24, initialized before entry and updated on preference changes. Lighting counts as one ambient system. Revised visual pacing/brightness is awaiting P1.2 review; P1.3 is unstarted.

Acceptance: both light groups change during normal playback; pause produces identical rendered scene captures across a wait; immediate resume retains phase and subsequent phase matches active elapsed time. Verify initial/live reduced motion, interruption pause, repeated toggles, low/high appearance and unchanged source artwork hashes.

Future failure policy still needs detailed review: readable errors, usable visuals if audio fails and a safe return to exploration after story failure. Bell progress freezes with pause and resets after completion for replay. Cross-story progress rules are deferred until multiple stories exist.

## Acceptance checks mapped to the brief

The brief is authoritative; this table turns its sections into project checks without replacing its requirements.

| Brief section | Check for this experience | Phase |
| --- | --- | --- |
| Ambient scene: composition/features | One portrait scene, no scene scrolling/page switching, Ferris wheel focal point and all three attractions recognizable; final app fits the visible phone viewport and safe areas. Check at the three existing sizes and on a physical phone. | 1 |
| Ambient scene: effects | At least three distinct ambient effect systems are present in normal-motion mode. Proposed: restrained lighting, fog, bats. Each starts only after Enter, stays visually coherent and participates in pause/resume. | 1 |
| Ambient scene: sound | Verified public-domain/CC0 ambience loops after Enter, without stacked playback or disruptive loop seams. Every audio file has a recorded source and verified terms before use. | 1 |
| Technical: start/reduced motion | Start screen has a real keyboard/touch Enter button. No scene audio or motion before activation. Read reduced-motion preference before starting; provide reviewed low-motion/static alternatives that preserve story meaning and feedback. Test preference before load and during a session. | 1 |
| Technical: Play/Pause | One accessible control pauses/resumes motion, audio, effects, hint/feedback/story timers and scene input together. Pause in exploration, during trigger progress and at beginning/middle/end of a story; wait, resume and check unchanged remaining active time. Repeat rapidly without duplicate loops. | 1, regress in 2 |
| Stories: complete sequences | Each story has a readable beginning, middle and end; lasts 5–10 seconds of active playback, excluding paused time; includes animation, sound and visual effects; ends in a clear stable scene and replays without reload. Reduced-motion alternatives retain the narrative. | 1 story in 1; all 3 in 2 |
| Stories: discovery/feedback | Each attraction has its own discoverable trigger, unique audiovisual response and visible progress. Every scene action has meaningful visual/audio feedback. Progressive text hints help without directly giving away the solution; time advancement pauses with the experience. | 1 story in 1; all 3 in 2 |
| Stories: lockout/reset | Other scene interactions cannot change progress or start another story during playback. Test touch, keyboard, repeated presses and near-simultaneous inputs. Play/Pause remains usable; ending restores exploration and the reviewed trigger/replay state. | 1, regress in 2 |
| Technical: accessibility | Real semantic controls, visible keyboard focus, logical focus order, readable hints, sufficient text/control contrast and generous targets (proposed minimum 44 × 44 CSS px). Touch and keyboard produce equivalent outcomes. Do not rely only on color or hover. | 1, refine in 2 |
| Technical: delivery/credits | Public HTTPS URL works directly on a physical smartphone. Credit Developer and external code/visual/audio assets, with verified permission for public use. Keep credits accessible without turning scene exploration into scrolling/page navigation; presentation to be reviewed. | Both |
| Quality/workflow | Consistent pacing and visual blend, no uncaught errors or missing assets, coordinated cleanup/reset, acceptable phone responsiveness. Record evidence, meaningful git checkpoints and consequential revisions. | Both |

## Story scope

Story 1 narrative/trigger are approved: activate the booth bell three distinct times; each ring has different audiovisual feedback and shows progress. The third ring starts exactly one sequence: ghostly attendant appears, presents a floating ticket, stamps it with magical sparks, disappears, and the booth returns to normal. Other scene input is locked during the sequence; Play/Pause remains usable. At completion restore the baseline and reset ring progress for another three-ring replay. Pause does not consume progress or active story/hint time. Detailed feedback, progressive clues, beat durations and reduced-motion sparks treatment remain to be reviewed before their checkpoints.

| Story | Candidate arc | Artwork/behavior still needed |
| --- | --- | --- |
| Ticket booth — approved Phase 1 story | Three bell rings with distinct feedback; ghostly attendant appears, presents a floating ticket, stamps it with magical sparks, then disappears and booth returns to normal. | Bell overlay/control, window/interior separation, attendant/ticket/stamp/spark assets, verified sounds; review detailed 5–10 second storyboard, feedback and progressive hints. |
| Carousel — Phase 2 | Horses wake in sequence with coordinated light/sound, then return to rest. Optional ghost rider only if approved. | Test bob range against existing masks, define a complete story arc, trigger/hints, sounds and any approved new character asset. |
| Prize stall — Phase 2 | Ghost/cat prizes briefly come alive, perform a playful response and settle. | Define beginning/middle/end and trigger; paired movement can use existing artwork. Individual movement/turning needs additional hidden surfaces or poses and review. |

Do not implement all three at once. Story 1 is selected, but its additional artwork and detailed timing belong to P1.6, sequence to P1.7, and three-ring discovery/feedback/hints to P1.8. Other stories' triggers and detailed timing remain open.

## Test evidence and completion gates

Existing evidence: static screenshots in artwork-review/booth-refinement-v2/, attractions-v3-final/ and carriage-v4/; carriage checks.json verifies zero rendered changes outside its edit area. Tests cover desktop-browser phone viewports, not physical devices or future runtime.

Run current visual checks when implementation affects layout/layers; add focused behavior checks for shared playback and story timing as those systems exist. Test each new result with related working behavior, retain screenshots/logs/observations, then obtain Developer review before the next consequential checkpoint.

Phase 1 is complete only when all Phase 1 acceptance checks pass, one story is discoverable and replayable, HTTPS and physical-phone checks are recorded, and files/docs/git history/credits are ready. Phase 2 additionally requires all three stories, peer playtesting and evidenced revisions, complete final checks and the provided debrief.

## Exclusions and change control

No 3D, wheel rotation, full carousel rotation, multiple navigable scenes, specific park branding or extra attractions. No backend/framework is currently needed. New scope or consequential design changes require a reviewed spec/plan update.

P1.1 is approved. P1.2 lighting is implemented and held for review; no P1.3 or later behavior has started. Evidence and the historical strict screenshot-comparison limitation are recorded in [plan.md](plan.md).

## Saving transcripts

Only when directed, save the entire current conversation as transcripts/spec-YYYY-MM-DD_HHMMSS.md, with messages labeled Developer and Agent, and confirm the path.
