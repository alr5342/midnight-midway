# Research

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Updated 2026-10-16. Static visual design is approved by the Developer. This document records that approval; future behavior proposals and the development plan await review. Fixed assignment requirements remain in [brief.md](brief.md).

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

## Story and ambience proposals — not approved behavior

| Area | Initial direction to review | Remaining decisions |
| --- | --- | --- |
| Ticket booth | Bell summons attendant; ticket appears, is stamped, then the attendant retreats. Recommended first story because the booth is visually distinct. | Confirm first-story choice, 5–10 second storyboard, trigger/progress, hint stages and extra window/attendant/ticket artwork. |
| Carousel | Horses wake and bob in a light sequence; possible ghost passenger, then return to rest. | Story arc, optional passenger, trigger, sound, timing and motion limits. |
| Prize stall | Toys briefly come to life and settle again. Existing ghost/cat pair supports a small shared bounce or sway. | Complete arc and trigger; decide whether shared movement suffices before commissioning separate poses. |
| Ambient effects | Gentle wheel/bulb and gondola glow variation; drifting fog; occasional bats. | Confirm these three distinct effect systems, density, pacing, reduced-motion alternatives and visual restraint. |
| Sound | Low-key looping night/carnival atmosphere with short, distinct attraction feedback. | Find and verify public-domain/CC0 recordings; audition for tone and loop quality on a phone. |

The static approval does not approve these story beats, hint wording/timing, audio, interaction patterns or exact animation. Resolve only what the next checkpoint needs.

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

Next review should confirm the first story, ambience choices, reduced-motion treatment, trigger progression and interruption policy. Source provenance, audio selection, public hosting and physical-phone testing remain unfinished. The [plan](plan.md) carries verification and playtest evidence; the [specification](spec.md) defines acceptance checks.

Prior planning documents are preserved in docs/history/20261016-144916/. Detailed asset notes describe their original test dates; later approvals recorded here supersede their historical “approval pending” labels.

## Saving transcripts

Only when directed, save the entire current conversation as transcripts/research-YYYY-MM-DD_HHMMSS.md, with messages labeled Developer and Agent, and confirm the path.
