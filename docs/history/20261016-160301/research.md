# Research

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Updated 2026-10-16. The Developer directed focus exclusively to Phase 1 submission through GitHub Pages, approved P1.3 fog and authorized P1.4 bats. Approved artwork and existing effects are retained. Bats await review; later checkpoints remain unstarted and Phase 2 is deferred. Fixed assignment requirements remain in [brief.md](brief.md).

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

The Developer selected automatic pause when the tab/app is hidden, with explicit Play required on return. P1.1 initializes reduced-motion preferences before Enter and updates them live; P1.2 connects lighting to that lifecycle. No audio, bell or story sequence is implemented yet. Preserve trigger progress while paused once the trigger exists; completion must reset it for a new three-ring replay.

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
| Ambient and story audio | None selected or installed | For every selected file record creator, original item URL, license/terms URL, public-domain basis or CC0 statement, retrieval date, intended use and edits. Verify before use. |

No external audio licensing research has been completed. Freesound is a possible search location named in the brief, not evidence that every file there is CC0. Do not substitute an agent recommendation for verified usage terms.

## Open questions and scope

Current P1.4 result: two occasional code-native bat silhouettes provide the third ambient system alongside lighting/fog, without adding an external artwork asset. The shared clock governs flight and wing movement; reduced motion suppresses flight. Combined touch Pause/resume, live/initial preference, interruption and rapid-toggle checks passed, as did existing fog/shell regressions and all 9 unit tests. Source artwork hashes remain unchanged. Evidence: artwork-review/p1-4/. Visual review and physical-phone verification remain pending. No audio/story or Phase 2 work was started.

Current Phase 1 audit: scene/start/playback, lighting and approved fog exist; bats are newly implemented and await review. Still needed: verified public-domain/CC0 ambient and story audio, missing ticket-booth story artwork/control, full 5–10 second sequence, three-ring feedback/progress, progressive hints, lockout/reset/replay, credits, accessibility/failure checks and integrated verification. No selected audio or public-source provenance has been verified yet.

GitHub Pages is the chosen delivery host; repository/account and Git history are not yet established. Deployment work must verify the public candidate's relative asset/module/audio paths and record the tested revision. User's actual phone verification is required; desktop viewport tests do not satisfy it. A final clean submission ZIP must include current project files/docs/credits and exported Git log, be extracted/tested and match the verified revision. These are required later gates, not completed research or deployment results. No extra artwork redesign or Phase 2 story is authorized.

P1.3 uses original code-driven SVG fog wisps, so no external fog raster asset was introduced. Source files remain unchanged; fog and lights share active time. Unit and functional browser checks passed; visibility interruption was simulated and the touch screenshot-byte check failed twice and is held unresolved. Evidence/remaining work: plan.md and artwork-review/p1-3-functional/. Stop for review before adding bats.

Earlier P1.2 evidence: soft wheel-bulb variation and gondola glow share the active-time clock, with no independent timers and steady reduced-motion illumination. Same-scene paused screenshots were pixel-identical across a 500 ms wait; unit/browser checks verified resume phase and interruption behavior. Evidence: artwork-review/p1-2/. Original artwork files remain unchanged. This result does not resolve the earlier app-versus-review strict screenshot comparison, and physical-phone verification is pending.

Developer feedback on the initial P1.2 result: animation was difficult to notice. The revised overlay increases contrast and halo size and adds smooth shimmer to shorter, gentle pulses. Revised pause/resume/reduced-motion and shell regressions passed; low/high phone-size captures show a measurable light difference, with no artwork-file changes. Review evidence: artwork-review/p1-2-visible/ and artwork-review/p1-2-visible-shell/. Perceived visibility and atmosphere still require Developer review; no P1.3 work has started.

Subsequent Developer feedback accepted the visibility but identified alignment errors. Cause: estimated positions did not follow the painted perspective, particularly on the lower-left spoke. Final adjustment uses source-pixel bulb centers rather than regular geometric spacing; all 55 centers passed a 3-source-pixel warm-light check and were inspected at native resolution. Current brightness/shimmer functions are unchanged, as are original artwork files and gondola glow. Pause/resume, reduced motion and shell regressions passed. Evidence: artwork-review/p1-2-alignment/ and the related playback/shell directories listed in plan.md. Stopped at this Phase 1 refinement; final visual review pending, P1.3 unstarted.

Fog visual review, bat pacing, reduced-motion story treatment and ring feedback/hints remain upcoming checkpoint decisions. Source provenance, audio selection, public hosting and repository setup remain unfinished. The [plan](plan.md) carries verification and playtest evidence; the [specification](spec.md) defines acceptance checks.

Prior planning documents are preserved in docs/history/20261016-144916/. Detailed asset notes describe their original test dates; later approvals recorded here supersede their historical “approval pending” labels.

## Saving transcripts

Only when directed, save the entire current conversation as transcripts/research-YYYY-MM-DD_HHMMSS.md, with messages labeled Developer and Agent, and confirm the path.
