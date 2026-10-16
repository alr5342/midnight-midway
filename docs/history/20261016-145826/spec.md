# Technical Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Updated 2026-10-16. **Approved:** Midnight Midway static visual design, including the booth foreground and corrected carriage. **Pending review:** the proposed behavior, architecture and checkpoints below. No future checkpoint is authorized by this document alone.

## Goal, scope and current state

Meet [brief.md](brief.md) through one portrait, browser-based Halloween scene that rewards exploration and promotes an unbranded theme park. Tone is playful and spooky for ages 10+, without disturbing gore, realistic violence or real-world suffering.

Phase 1 delivers the complete ambience, start screen, unified Play/Pause and **one complete discoverable story**, deployed over HTTPS and verified on a physical phone. Phase 2 adds peer-informed revisions, the remaining two stories and final polish/evidence/debrief. Phase 1 takes priority over expanding features.

Current implementation is a buildless HTML/CSS/JavaScript **static artwork review**, not the Phase 1 experience. Preview: `node serve.mjs`, then http://127.0.0.1:4173 in VS Code Simple Browser. No install/build is required. Review controls and comparison pages are development tools; their page scrolling does not define the final app layout.

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

## Proposed shared behavior model

Keep the buildless project structure. Use one small runtime coordinator for playback state and active elapsed time, with effects, audio, hints, feedback and story sequences participating in that lifecycle. This prevents independently running timers or sounds from continuing while paused.

Proposed states: start; exploring; story-playing; paused, retaining the previous active state. A story has one owner and completes through an explicit reset/return path. Play/Pause remains available during a story; other scene actions are locked. Pause disables scene input and freezes all participants. Resume continues from the saved state/time rather than restarting sequences or duplicating listeners/loops.

Before implementation, confirm tab/background interruption policy, whether partial trigger progress persists between stories, and recovery behavior after audio or asset failure. Recommended failure behavior is readable feedback, a usable visual experience when audio is unavailable, and a safe return to exploration on story failure. These policies remain proposals until reviewed.

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

## Story scope — proposals awaiting approval

| Story | Candidate arc | Artwork/behavior still needed |
| --- | --- | --- |
| Ticket booth — recommended Phase 1 | Bell/booth responds; attendant presents and stamps a ticket; attendant disappears and booth settles. | Window/interior separation, attendant/ticket/stamp assets, verified sounds; approve storyboard, trigger, progress/reset rule, hint stages and timing. |
| Carousel — Phase 2 | Horses wake in sequence with coordinated light/sound, then return to rest. Optional ghost rider only if approved. | Test bob range against existing masks, define a complete story arc, trigger/hints, sounds and any approved new character asset. |
| Prize stall — Phase 2 | Ghost/cat prizes briefly come alive, perform a playful response and settle. | Define beginning/middle/end and trigger; paired movement can use existing artwork. Individual movement/turning needs additional hidden surfaces or poses and review. |

Do not implement all three at once. Confirm the first story before commissioning its additional artwork. Exact triggers, hints and timings are deliberately open.

## Test evidence and completion gates

Existing evidence: static screenshots in artwork-review/booth-refinement-v2/, attractions-v3-final/ and carriage-v4/; carriage checks.json verifies zero rendered changes outside its edit area. Tests cover desktop-browser phone viewports, not physical devices or future runtime.

Run current visual checks when implementation affects layout/layers; add focused behavior checks for shared playback and story timing as those systems exist. Test each new result with related working behavior, retain screenshots/logs/observations, then obtain Developer review before the next consequential checkpoint.

Phase 1 is complete only when all Phase 1 acceptance checks pass, one story is discoverable and replayable, HTTPS and physical-phone checks are recorded, and files/docs/git history/credits are ready. Phase 2 additionally requires all three stories, peer playtesting and evidenced revisions, complete final checks and the provided debrief.

## Exclusions and change control

No 3D, wheel rotation, full carousel rotation, multiple navigable scenes, specific park branding or extra attractions. No backend/framework is currently needed. New scope or consequential design changes require a reviewed spec/plan update.

This turn changes documentation only. The next checkpoint remains unstarted pending Developer review of [plan.md](plan.md).

## Saving transcripts

Only when directed, save the entire current conversation as transcripts/spec-YYYY-MM-DD_HHMMSS.md, with messages labeled Developer and Agent, and confirm the path.
