# Technical Specification

Current authorization: the Developer approved the revised field-preserving ending staging and requested the admission checkpoint only. Completion of the unchanged eight-active-second ticket story awards one in-memory admission ticket and unlocks carousel availability. Replays/pauses retain that progress; refresh clears it. Reuse ticket.svg in a persistent status badge; do not add carousel inputs, ending playback, new artwork/audio or deployment. Scope/acceptance: docs/design/JOURNEY.md.

Ending clarification: the park fades away; the land stays visible. The final composition is token plus empty moonlit field, with the Ferris wheel the last major attraction to disappear. The previous blackout staging is superseded. Only revised static preview poses are authorized; the empty-field repair is a review candidate and the approved runtime/artwork remain unchanged.

Latest approved direction, 2026-10-19: [A night remembered](docs/design/JOURNEY.md) defines the connected journey, keepsake claim and disappearance. Revisit/refresh restart without saved progress. Preserve Phase 1 deliverables and artwork. Current authorization is manual development-preview poses only: no new runtime gameplay, audio or ending playback. Earlier Phase 1 contracts below remain the baseline, not a claim that the new journey is implemented.

Organizational checkpoint, 2026-10-19: active source is grouped under src/, with one combined development preview workspace and consolidated shared scene styles/artwork helpers. All approved behavior and media remain required. Root index.html/serve.mjs and GitHub Pages main / (root) compatibility are retained. Work is isolated on chore/project-structure; the public site and original Phase 1 submission are unchanged. See docs/PROJECT-STRUCTURE.md for the approved cleanup scope; this adds no story or creative requirement.

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Updated 2026-10-16. **Phase 1 only.** Developer approved submission preparation and authorized publishing. GitHub Pages is live at https://alr5342.github.io/midnight-midway/ from alr5342/midnight-midway, main / (root), with existing Git history preserved. Public browser/resource/story checks passed, and Alex Rosemann approved actual iPhone 17 Pro / iOS 26.5.1 / Safari review. Archive candidate extraction/runtime checks passed; final ZIP acceptance is recorded in docs/SUBMISSION.md and the final verification sidecar. Phase 2 is deferred.

## Goal, scope and current state

Meet [brief.md](brief.md) through one portrait, browser-based Halloween scene that rewards exploration and promotes an unbranded theme park. Tone is playful and spooky for ages 10+, without disturbing gore, realistic violence or real-world suffering.

Phase 1 delivers the complete ambience, start screen, unified Play/Pause and **one complete discoverable story**, deployed over HTTPS and verified on a physical phone. Phase 2 adds peer-informed revisions, the remaining two stories and final polish/evidence/debrief. Phase 1 takes priority over expanding features.

Current implementation is a buildless HTML/CSS/JavaScript **interactive prototype with lighting, fog, bats, looping wind and the complete ticket-booth story**. Developer/asset credits, source confirmation, public deployment and phone review are approved; final archive verification governs submission readiness. Preview: `node serve.mjs`, then http://127.0.0.1:4173 in VS Code Simple Browser. No install/build is required. Preserved artwork and story inspectors are separate development pages.

Phase 1 submission has three mandatory gates: requirement-complete prototype with one story; shareable GitHub Pages HTTPS URL verified on the Developer's actual smartphone; clean, extraction-tested submission ZIP with project files, current documents and exported Git log. Record the deployed revision, phone/browser and observed results. No Phase 1 completion claim until all three are verified. Repository/history and hosting are complete; the extracted candidate passed, and the final artifact must have a passed inventory/runtime verification report.

## Approved visual contract

- Preserve the current assembled scene: Ferris wheel focal point, left ticket booth, center carousel, right prize stall, moonlit sky, wet path, pumpkins and foreground framing.
- Preserve palette, texture, relative scale, placement and corrected open gondola structure/glow. Wheel remains stationary; horses use small bobs rather than rotation.
- Share the original 941 × 1672 artwork coordinates across source images, masks, repairs, effects and future hit areas. Scale the scene consistently; retain all three attractions at supported portrait sizes.
- Preserve the booth's existing scale/translation and the original foreground overlay that restores its pumpkin, vegetation and fog.
- Retain three independent horse masks, the paired ghost/cat mask, hidden-surface repairs, and fixed poles/railing/shelf trim. Keep repairs localized; use appropriate foreground overlap.
- Retain approved upper-left Play/Pause and bottom-center hint placement. These are functioning runtime controls/text. The transparent bell target is centered on the separate bell asset, with a minimum 44 × 44 CSS-pixel hit area; brief progress text appears below the booth.
- Add future effects in separate layers; do not bake motion into or regenerate the approved full background. Check small motion offsets against masks before accepting an effect.
- Preserve original assets and version new candidates. Artwork references, prompts, source/credit status and known limits are in [research.md](research.md), [ARTWORK.md](docs/artwork/ARTWORK.md) and [GONDOLA.md](docs/artwork/GONDOLA.md).

Acceptance: original/approved/current phone screenshots show no unintended crop, movement, missing pumpkin, rectangular cutoff, duplicate subject edge or visible repair gap. Compare both resting and maximum motion positions. Static artwork approval does not establish motion quality.

## P1.1 shared behavior model

Keep the buildless project structure. Use one small runtime coordinator for playback state and active elapsed time, with effects, audio, hints, feedback and story sequences participating in that lifecycle. This prevents independently running timers or sounds from continuing while paused.

Implemented states: start, exploring and paused. Before Enter, active time is zero, no frame loop is scheduled and scene input is gated off. Enter starts the active-time clock and focuses the real Play/Pause button. Pause freezes active time, gates scene input and cancels the frame loop; Play resumes the saved time. Subscribed future systems receive shared state, elapsed time and reduced-motion preference. The app uses one scheduled frame loop while exploring and none while paused/start. Reduced-motion preference is read before entry and followed live.

The approved interruption rule pauses on hidden-tab/pagehide events and never resumes merely because the tab becomes visible again. Play is required. User-facing controls have keyboard focus styling and at least 44 × 44 CSS-pixel targets; the scene fits without scrolling, preserving full artwork proportions and safe-area padding.

Story ownership is maintained separately from playback state: a paused story remains locked, with its starting active time and progress retained. The global coordinator keeps start/exploring/paused, while TicketStory owns its eight-second sequence and completion/reset. All effects, audio, hints and scene actions use this shared lifecycle.

### P1.2 lighting contract

Use a separate, noninteractive SVG light overlay; never change underlying raster assets or wheel/gondola geometry. Following Developer feedback that the initial lighting was hard to notice, wheel bulbs now use a 5-second breathing pulse with a small smooth 1.7-second shimmer, opacity bounded at 0.10–0.70. Gondola glow uses a 6.5-second pulse and small 2.1-second shimmer, opacity bounded at 0.10–0.72. Soft bulb halos have radius 11 in original scene coordinates; the gondola glow is a 36 × 28-radius ellipse within/around its open interior. No carriage panels or wheel movement are added.

Both derive only from shared active time and have no independent timers/CSS animation. Before Enter the overlay contributes no pixels. Pause holds the rendered phase; resume continues rather than resets. Reduced-motion mode has constant wheel/gondola opacity 0.26/0.24, initialized before entry and updated on preference changes. Lighting counts as one ambient system. Revised visibility was accepted and alignment was carried forward on the Developer's instruction to continue to P1.3.

Acceptance: both light groups change during normal playback; pause produces identical rendered scene captures across a wait; immediate resume retains phase and subsequent phase matches active elapsed time. Verify initial/live reduced motion, interruption pause, repeated toggles, low/high appearance and unchanged source artwork hashes.

P1.2 final alignment refinement: the Developer accepted the revised lighting visibility and requested accurate rim/spoke placement. All 55 overlay centers now follow painted bulb positions sampled from the approved scene plate, not estimated evenly spaced lines. Source-pixel checks verify warm bulb pixels within 3 original-image pixels of every center; native-resolution inspection confirms the perspective and joins. The number/radius of halos, all brightness/shimmer functions and gondola glow geometry are unchanged from the visibility revision. No wheel rotation or underlying artwork changes. This approved lighting implementation is retained unchanged in the current prototype.

Implemented story failure policy: initially loading cues gate the bell; a failed cue shows a Pause/Play retry notice and leaves the visual sequence usable. A failed story image hides temporary artwork and disables the bell with reload guidance; Play/Pause remains usable. Bell progress freezes with pause and resets after completion. Main background/mask failure recovery remains a final quality check. Cross-story rules are deferred.

### P1.3 fog contract

Add soft, noninteractive SVG wisps over the path, behind the booth/retained foreground. Preserve artwork files, silhouettes and lighting. Two fog groups derive transforms only from shared active time: rear horizontal range ±26 source pixels over 28 seconds; front ±38 over 34 seconds; vertical range ±4/±5 source pixels. Soft transparent edges and overscan avoid visible cutoffs. No independent timer or CSS animation.

Hide fog before Enter. Freeze time/transforms during Pause; resume the same phase. Initial/live reduced-motion mode uses static zero-offset wisps. Test Enter, normal drift, pause/resume with lighting, interruption behavior, rapid toggles and maximum offsets. Keep controls, hints, attractions and foreground pumpkin readable. Fog is one of the three implemented ambient systems. Functional checks passed; historical touch screenshot-byte equality remains unresolved as documented in plan.md. Developer approved P1.3.

### P1.4 bats contract

At most two code-native SVG bats fly in 9-second passes staggered at active seconds 3/5, repeating every 22 seconds with idle time. Position, wing pose and soft entry/exit opacity derive only from shared active elapsed time. Route y=227..305 in source coordinates stays above the hub/attractions, below most of the moon and away from text/controls. Preserve all underlying artwork and stationary wheel geometry. Use no additional timer/CSS animation or interactive target.

Hide bats before Enter and in reduced-motion mode (both initial and live preference). Pause freezes flight/wing/opacity along with lights/fog; Play resumes from saved phase. Check bounds, density, idle intervals, combined pause/resume, hidden-tab interruption, rapid toggles and existing viewport/input behavior. Three ambient systems, wind and the ticket story are implemented. P1.4 is approved; physical-device verification remains pending.

### P1.5 audio contract

Use the locally hosted CC0 wind derivative documented in CREDITS.md. Initialize/resume AudioContext only within Enter/Play activation; no audible playback or context before Enter. Use one looping buffer source at gain 0.30, with playback offset derived from current shared active time modulo decoded loop duration. A late asset load must not start sound while paused; rapid controls must not stack sources. Pause stops/disconnects the source and suspends the context; Play resumes at saved active-time phase.

Hidden-tab/pagehide and native AudioContext interruption/suspension must pause the whole scene and require explicit Play, rather than silently resuming sound. Reduced motion retains audio while disabling/reducing visual motion. A missing/blocked/undecodable asset must leave visuals and Play/Pause usable with readable retry feedback. Source terms and attribution are recorded before use. Headless decode/signal/loop/lifecycle checks are required, followed by Developer listening and eventual actual-phone/public-link checks. Do not claim physical-device or subjective sound quality verification from automation.

## P1.7/P1.8 runtime contract

TicketStory owns ring count, feedback time, sequence start, hint origin and completion count. Third ring begins one eight-active-second story; further scene actions are rejected until completion. Pause retains ownership. The single global RAF updates visuals/audio desired state; there is no story timer or shipped development launch control. Bell feedback lasts up to 850 active milliseconds with increasingly bright glow, distinct pitched cues and one/two-chime text progress. Completion clears temporary layers/cues/progress, announces return, and permits three-ring replay.

Hints begin with the booth/visitor clue, then quiet-bell at 12 active seconds and persistence at 24. Ring feedback temporarily overrides the hint for 2.2 active seconds; partial progress never permanently suppresses later hints. Completion restarts discovery timing. Cues preload only after Enter on the existing context; initial loading blocks bell consumption. Late loads cannot sound while paused. Pause stops/disconnects all story sources; explicit Play recreates only currently active cues at their saved offsets. Repeated ticks cannot restart a cue.

The shared context's interruption uses the established pause-until-Play policy for both ambience and story. Missing cues show retry guidance while visuals remain usable; missing story images disable the story target with reload guidance. Inspectors remain development tools. P1.9 adds main-scene readiness checks: Enter is disabled until direct scene images decode and stylesheet/mask requests succeed. Failure keeps a readable reload notice and credits accessible; it cannot create audio or launch a broken scene.

### P1.9 credits and delivery contract

Credits is a native, titled modal inside the existing screen. It credits Alex Rosemann, Developer-confirmed ChatGPT-generated reference, image/code assistance and the three verified CC0 sound sources/derivatives. No new creative feature is added. Opening credits pauses the shared clock/context; closing/Escape restores focus to Credits and leaves playback paused until Play. Explicit forward/backward Tab order includes every control/link consistently across browsers. The modal may scroll internally, while the scene never scrolls or navigates away. Targets remain at least 44px and text contrast at least 4.5:1 in tested panels.

The buildless app remains at repository root with relative URLs and .nojekyll. A separate local subpath server verifies GitHub project-site behavior, exact filename case, module/image/mask/audio requests and failure handling. Real local Git commits preserve the existing prototype and this preparation; no retrospective history is invented. Export docs/git/GIT-LOG.txt after the last commit. Developer subsequently authorized publication; P1.10a is live with public HTTPS verification recorded in docs/DEPLOYMENT.md. The Developer subsequently approved their actual iPhone Safari review and authorized final packaging. Candidate archive hash/runtime checks passed; the final ZIP must independently pass extraction/verification. Desktop checks are not substituted for the physical-phone report.

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

Approved and implemented story: eight active seconds with contiguous beats 0–1.5 arrival, 1.5–3.5 floating ticket, 3.5–4.5 stamp/sparks, 4.5–6.5 disappearance and 6.5–8 settle/reset. Detailed assets, cue timing and reduced-motion alternatives: [STORYBOARD.md](docs/artwork/story/STORYBOARD.md). Static review remains at /dev/previews/index.html?view=story; the functional story is on the main app URL.

Implemented layers: masked local empty-window plate and approved ghost v3 behind the existing frame/counter; separate original SVG bell/ticket/stamp/sparks. All use the existing source coordinate system/booth transform. Temporary window/character/props disappear at reset, preserving baseline pixels; bell remains as the live trigger. Reduced motion avoids travel, stamp movement and particle expansion, retaining opacity reveals and a steady glow. P1.7/P1.8 added no independent clock or timer.

Six local WAV cues: three distinctly pitched bell responses and arrival/stamp/departure magical accents. Verified CC0 source URLs, creators and processing are in [CREDITS.md](CREDITS.md); cue metadata in assets/story/audio-manifest.json. StoryAudio uses the existing user-activated context, shared active time, paused cue offsets, single-fire ownership and cleanup. Review-page audio players remain auditions only. P1.7/P1.8 runtime tests verify duration, reset/replay, lockout, cue pause/resume and touch/keyboard controls separately from asset checks.

Story 1 narrative/trigger are approved: activate the booth bell three distinct times; each ring has different audiovisual feedback and shows progress. The third ring starts exactly one sequence: ghostly attendant appears, presents a floating ticket, stamps it with magical sparks, disappears, and the booth returns to normal. Other scene input is locked during the sequence; Play/Pause remains usable. At completion restore the baseline and reset ring progress for another three-ring replay. Pause does not consume progress or active story/hint time. The approved beats and reduced-motion treatment are implemented; runtime feedback, pacing and discovery await Developer review.

| Story | Candidate arc | Artwork/behavior still needed |
| --- | --- | --- |
| Ticket booth — implemented Phase 1 story, review pending | Three bell rings with distinct feedback; ghostly attendant appears, presents a floating ticket, stamps it with magical sparks, then disappears and booth returns to normal. | P1.7/P1.8 implemented; review pacing/discovery/audio, complete P1.9 credits/source/final-quality checks, then public-phone/submission gates. |
| Carousel — Phase 2 | Horses wake in sequence with coordinated light/sound, then return to rest. Optional ghost rider only if approved. | Test bob range against existing masks, define a complete story arc, trigger/hints, sounds and any approved new character asset. |
| Prize stall — Phase 2 | Ghost/cat prizes briefly come alive, perform a playful response and settle. | Define beginning/middle/end and trigger; paired movement can use existing artwork. Individual movement/turning needs additional hidden surfaces or poses and review. |

Do not implement all three at once. Story 1 is selected, but its additional artwork and detailed timing belong to P1.6, sequence to P1.7, and three-ring discovery/feedback/hints to P1.8. Other stories' triggers and detailed timing remain open.

## Test evidence and completion gates

Existing evidence: static screenshots in archive/reviews/booth-refinement-v2/, attractions-v3-final/ and carriage-v4/; carriage checks.json verifies zero rendered changes outside its edit area. Tests cover desktop-browser phone viewports, not physical devices or future runtime.

Run current visual checks when implementation affects layout/layers; add focused behavior checks for shared playback and story timing as those systems exist. Test each new result with related working behavior, retain screenshots/logs/observations, then obtain Developer review before the next consequential checkpoint.

Phase 1 is complete only when all Phase 1 acceptance checks pass, one story is discoverable and replayable, HTTPS and physical-phone checks are recorded, and files/docs/git history/credits are ready. Phase 2 additionally requires all three stories, peer playtesting and evidenced revisions, complete final checks and the provided debrief.

## Exclusions and change control

No 3D, wheel rotation, full carousel rotation, multiple navigable scenes, specific park branding or extra attractions. No backend/framework is currently needed. New scope or consequential design changes require a reviewed spec/plan update.

P1.6–P1.8 are approved. P1.9 submission preparation is held for review; no Phase 2 behavior exists. Full Chromium/Firefox audiovisual and WebKit visual/accessibility preflight results are recorded in docs/PHASE-1-AUDIT.md. This Windows WebKit build has no Web Audio API, so its audio remains unverified. Public URL and actual-phone gates are satisfied; final ZIP acceptance is recorded in its verification sidecar. Historical screenshot-comparison limits remain in plan.md.

## Saving transcripts

Only when directed, save the entire current conversation as transcripts/spec-YYYY-MM-DD_HHMMSS.md, with messages labeled Developer and Agent, and confirm the path.
