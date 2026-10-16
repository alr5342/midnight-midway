# Research

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Updated 2026-10-16. The Developer directed focus exclusively to Phase 1 submission through GitHub Pages, approved P1.5 audio and authorized P1.6 story assets/storyboard. Approved artwork and existing runtime are retained. Story candidates await review; playback/trigger checkpoints remain unstarted and Phase 2 is deferred. Fixed requirements remain in [brief.md](brief.md).

## Goal and approved direction

Create a playful, spooky exploration experience for ages 10+ that builds interest in visiting an unbranded theme park. The chosen concept is **The Midnight Midway**: an abandoned carnival that briefly wakes after dark.

Three alternatives were compared: Midnight Midway, Lanternkeeper's Garden, and Hollow Station. The Developer selected the midway, then supplied [the visual reference](reference/midnight-midway-concept.png). Its composition, rather than the initial verbal concept alone, governs the artwork:

- A stationary Ferris wheel dominates the upper scene; the moon and clouds provide depth.
- Ticket booth left, carousel center, prize stall right; the wet path draws the eye between them.
- Detailed painterly surfaces, weathered burgundy structures, blue-violet shadows and warm amber bulbs.
- Portrait framing retains the complete scene. Tall-phone framing currently uses dark space above and below rather than cropping attractions.
- Small upper-left Play/Pause placement and a bottom-center hint panel are visually approved. Their current symbols/text are mockups, with no behavior.
- The corrected right-hand carriage has matching open sides, narrow posts and a burgundy basket, with a subtle glow.

The Developer explicitly approved the booth refinement, then approved the complete static visual design after the carriage correction. Preserve this baseline; consequential visual revisions require review.

## Artwork approach and evidence

Use a shared 941 × 1672 scene coordinate system. Retain original pixels for visible pieces where possible. Generate only necessary hidden surfaces or local corrections, expose them through masks, and place fixed scenery in front of movable pieces. Do not replace the entire approved scene to make a local edit.

| Decision / experiment | Result and implication | Evidence |
| --- | --- | --- |
| Generated booth extraction | Useful transparent asset, but changed size/details and produced a straight base. Keep the existing approved alignment rather than regenerating the booth. | [Extraction review](assets/REVIEW.md), artwork-review/ |
| Original foreground over booth base | Restored pumpkin, plants, ground and fog; Developer approved the blend. | artwork-review/booth-refinement-v2/ |
| Original-pixel horse/prize masks with localized repairs | Three horses can move independently. Overlapping ghost/cat prizes remain one pair. Fixed poles, railing and shelf lip conceal joins. Small static lifts were inspected; animated motion is not yet verified. | [Layer notes](assets/ARTWORK.md), artwork-review/attractions-v3-final/ |
| Local carriage correction | Matched structure and reduced brightness. Rendered pixel check found zero changes outside its inspection area; Developer approved. | [Edit notes](assets/GONDOLA.md), artwork-review/carriage-v4/checks.json |

Keep the wheel stationary and use small horse bobs rather than full carousel rotation. Large travel, toy rotation, independent ghost/cat motion, or newly exposed surfaces would require additional artwork. Exact motion amplitudes remain to be tested.

The static app has been checked in a desktop browser at 390 × 844, 375 × 667 and 320 × 568. This supports layout review; it does not prove physical-phone performance, audio support, accessibility, or full playback behavior.

## Story, ambience and behavior decisions

### Approved Story 1 direction and interruption policy

The player rings the ticket booth's bell three times, with different audiovisual feedback and visible progress on each activation. The third ring triggers the ghostly attendant: appear, present a floating ticket, stamp it with magical sparks, disappear, and return the booth to normal. The sequence must meet the brief's 5–10 active-second duration and replay without reload. This narrative and three-ring trigger are approved; exact feedback, assets, hint text/timing and storyboard durations will be reviewed at P1.6/P1.8.

The Developer selected automatic pause when the tab/app is hidden, with explicit Play required on return. Reduced-motion preferences initialize before Enter and update live. Ambient wind now joins the shared lifecycle; no bell or story sequence is implemented yet. Preserve trigger progress while paused once the trigger exists; completion must reset it for a new three-ring replay.

The remaining story details below are proposals; the approved plan schedules lighting, fog and bats one system at a time.

| Area | Initial direction to review | Remaining decisions |
| --- | --- | --- |
| Ticket booth — approved Story 1 direction | Three bell rings with distinct feedback; ghostly attendant appears, presents floating ticket, stamps it with magical sparks and disappears as the booth returns to normal. | Approve detailed 5–10 second storyboard, each ring's feedback, hint stages and new bell/window/attendant/ticket/stamp artwork. |
| Carousel | Horses wake and bob in a light sequence; possible ghost passenger, then return to rest. | Story arc, optional passenger, trigger, sound, timing and motion limits. |
| Prize stall | Toys briefly come to life and settle again. Existing ghost/cat pair supports a small shared bounce or sway. | Complete arc and trigger; decide whether shared movement suffices before commissioning separate poses. |
| Ambient effects | Gentle wheel/bulb and gondola glow variation; drifting fog; occasional bats. | Confirm these three distinct effect systems, density, pacing, reduced-motion alternatives and visual restraint. |
| Sound | Low-key looping night/carnival atmosphere with short, distinct attraction feedback. | Find and verify public-domain/CC0 recordings; audition for tone and loop quality on a phone. |

The later Story 1 approval covers its narrative and three-ring trigger. Hint wording/timing, audio files, exact animation and other stories remain open. Resolve only what the next checkpoint needs.

## Sources and credits register

| Material | Source / method | Usage and credit status |
| --- | --- | --- |
| Original visual reference | Developer-supplied reference/midnight-midway-concept.png | Creator/origin and permission for public use not yet recorded. Confirm before public deployment. |
| Booth extraction and repair plate | Built-in image_gen edits of supplied reference | Saved in assets/; exact prompts in [PROMPTS.md](assets/PROMPTS.md). Credit AI-assisted preparation; source-reference provenance remains relevant. |
| Horse/prize backing | Built-in image_gen edit | [Exact prompt](assets/ATTRACTIONS-PROMPT.md); visible subject pixels and SVG masks described in assets/ARTWORK.md. |
| Corrected gondola | Built-in image_gen edit, locally masked | [Exact prompt and saved output](assets/GONDOLA.md). |
| App code and developer credit | Project HTML/CSS/JavaScript; Developer attribution to be supplied | Inventory external code/dependencies if introduced. No runtime framework or external font is currently used. |
| Ambient wind | remaxim, [Short wind sound](https://opengameart.org/content/short-wind-sound), verified 2026-10-16; creator explicitly releases it under CC0 | [CC0 deed](https://creativecommons.org/publicdomain/zero/1.0/), exact download and processing/credit in [CREDITS.md](CREDITS.md). Original preserved; filtered/crossfaded local loop installed. Human audition pending. |
| Story bell | Julie Damsgaard / Spring Spring / Spring Enterprises, [Pleasing Bell Sound Effect](https://opengameart.org/content/pleasing-bell-sound-effect), CC0 verified 2026-10-16 | Three pitched/faded mono PCM ring candidates. Original and processing details in CREDITS.md and assets/story/audio-manifest.json. Human audition pending. |
| Story magic | JaggedStone, [Magic Spell SFX](https://opengameart.org/content/magic-spell-sfx), CC0 verified 2026-10-16 | magical_1_0.ogg supplies arrival/stamp/departure candidates; trimmed/pitched/faded mono PCM derivatives. URLs/edits in CREDITS.md; human audition pending. |

P1.5 licensing research checked the selected item's creator/license statement and the CC0 deed. CC0 permits adaptation/redistribution without copyright attribution requirements; credit is nevertheless recorded for the assignment and creator recognition. Other sound assets still require independent verification. Source selection: short wind is lightweight and fits an empty nighttime midway; mild-wind recordings with bag rustling and high-pitched eerie-tone loops were not installed. No music, speech or startling cues were added. Human evaluation of mood, volume and repetition remains pending.

## Open questions and scope

Current P1.6 result: friendly painterly ghost and empty-window repair generated with built-in image_gen; original code-native prop/effect SVGs; six verified CC0-derived sound candidates; proposed eight-second storyboard with reduced-motion alternatives. Original artwork and main runtime remain unchanged. Static staging and asset/audio decoding checks passed, plus existing unit/shell regressions. Evidence: artwork-review/p1-6/. Asset fit, sound choice and timing await Developer review before P1.7; real playback/lockout/pause/replay and triggers are not yet proven or implemented. Prompt set: assets/story/PROMPTS.md; detailed scope: assets/story/STORYBOARD.md.

Current P1.5 result: local looping wind is integrated with Enter, shared Play/Pause, visibility and native AudioContext interruption handling. Programmatic decode/signal/loop-seam checks passed, including missing-file retry and paused late-load prevention; full 12-unit-test run and bat/shell regressions passed. Credits/provenance are in CREDITS.md. Audio cannot yet be considered human-auditioned or phone-verified. Next review is listening to several loops, pausing/resuming and checking balance with the scene; story assets/sounds remain P1.6 onward. No artwork files changed and no Phase 2 work started.

Current P1.4 result: two occasional code-native bat silhouettes provide the third ambient system alongside lighting/fog, without adding an external artwork asset. The shared clock governs flight and wing movement; reduced motion suppresses flight. Combined touch Pause/resume, live/initial preference, interruption and rapid-toggle checks passed, as did existing fog/shell regressions and all 9 unit tests. Source artwork hashes remain unchanged. Evidence: artwork-review/p1-4/. Visual review and physical-phone verification remain pending. No audio/story or Phase 2 work was started.

Current Phase 1 audit: scene/start/playback, three visual ambient systems and verified CC0 wind ambience exist; ambience awaits listening review. Still needed: story sounds and ticket-booth artwork/control, full 5–10 second sequence, three-ring feedback/progress, progressive hints, lockout/reset/replay, complete credits, accessibility/failure checks and final integration. Ambient audio licensing is verified; visual-reference provenance and future story sounds remain outstanding.

GitHub Pages is the chosen delivery host; repository/account and Git history are not yet established. Deployment work must verify the public candidate's relative asset/module/audio paths and record the tested revision. User's actual phone verification is required; desktop viewport tests do not satisfy it. A final clean submission ZIP must include current project files/docs/credits and exported Git log, be extracted/tested and match the verified revision. These are required later gates, not completed research or deployment results. No extra artwork redesign or Phase 2 story is authorized.

P1.3 uses original code-driven SVG fog wisps, so no external fog raster asset was introduced. Source files remain unchanged; fog and lights share active time. Unit and functional browser checks passed; visibility interruption was simulated and the touch screenshot-byte check failed twice and is held unresolved. Evidence/remaining work: plan.md and artwork-review/p1-3-functional/. Stop for review before adding bats.

Earlier P1.2 evidence: soft wheel-bulb variation and gondola glow share the active-time clock, with no independent timers and steady reduced-motion illumination. Same-scene paused screenshots were pixel-identical across a 500 ms wait; unit/browser checks verified resume phase and interruption behavior. Evidence: artwork-review/p1-2/. Original artwork files remain unchanged. This result does not resolve the earlier app-versus-review strict screenshot comparison, and physical-phone verification is pending.

Developer feedback on the initial P1.2 result: animation was difficult to notice. The revised overlay increases contrast and halo size and adds smooth shimmer to shorter, gentle pulses. Revised pause/resume/reduced-motion and shell regressions passed; low/high phone-size captures show a measurable light difference, with no artwork-file changes. Review evidence: artwork-review/p1-2-visible/ and artwork-review/p1-2-visible-shell/. Perceived visibility and atmosphere still require Developer review; no P1.3 work has started.

Subsequent Developer feedback accepted the visibility but identified alignment errors. Cause: estimated positions did not follow the painted perspective, particularly on the lower-left spoke. Final adjustment uses source-pixel bulb centers rather than regular geometric spacing; all 55 centers passed a 3-source-pixel warm-light check and were inspected at native resolution. Current brightness/shimmer functions are unchanged, as are original artwork files and gondola glow. Pause/resume, reduced motion and shell regressions passed. Evidence: artwork-review/p1-2-alignment/ and the related playback/shell directories listed in plan.md. Stopped at this Phase 1 refinement; final visual review pending, P1.3 unstarted.

Ambient listening review, reduced-motion story treatment and ring feedback/hints remain upcoming checkpoint decisions. Visual-reference provenance, story-sound selection, public hosting and repository setup remain unfinished. The [plan](plan.md) carries verification and playtest evidence; the [specification](spec.md) defines acceptance checks.

Prior planning documents are preserved in docs/history/20261016-144916/. Detailed asset notes describe their original test dates; later approvals recorded here supersede their historical “approval pending” labels.

## Saving transcripts

Only when directed, save the entire current conversation as transcripts/research-YYYY-MM-DD_HHMMSS.md, with messages labeled Developer and Agent, and confirm the path.
