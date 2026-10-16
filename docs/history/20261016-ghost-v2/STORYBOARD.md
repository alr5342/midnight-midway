# Ticket-booth story — P1.6 review draft

The approved narrative is unchanged: three bell rings with different feedback summon a ghostly attendant, who presents a floating ticket, stamps it with magical sparks, then disappears and returns the booth to normal. Proposed sequence duration: **8 active seconds**, excluding pauses. This checkpoint prepares assets and static staging only; it does not implement story playback or the trigger.

| Active time | Beat | Visual / sound | Reduced-motion treatment |
| --- | --- | --- | --- |
| 0–1.5 s | Beginning: attendant appears | Local empty-window plate replaces only the aperture; attendant fades in behind original arch/counter. Soft arrival chime. | Opacity-only reveal; no floating travel. |
| 1.5–3.5 s | Middle: ticket offered | Separate ADMIT ONE ticket floats just in front of the window/counter; attendant remains visible. | Stationary ticket reveal. |
| 3.5–4.5 s | Middle: stamp and sparks | Separate stamp makes one short downward motion; small amber sparks and magical accent at impact. | Stationary stamp plus a brief steady glow; no moving particles/flashing. |
| 4.5–6.5 s | End: departure | Ghost and stamp fade; departure chime; ticket briefly remains, then fades. | Opacity-only changes. |
| 6.5–8 s | End: settle/reset | Remove all temporary window/character/prop/spark overlays; reveal approved booth pixels, retain bell, reset three-ring progress, return clearly to exploration. | Same reset without motion. |

## Prepared assets

- ghost-attendant-v1.png: AI-generated transparent painterly sprite, friendly and age-appropriate. Exact prompt in PROMPTS.md.
- booth-empty-interior-v1.png: AI-assisted local interior repair. Applied only through booth-window-mask.svg; approved exterior remains original. Exact prompt in PROMPTS.md.
- bell.svg, ticket.svg, stamp.svg, sparks.svg: original code-native props/effects with warm brass/paper/burgundy colors. Ticket text remains editable/readable.
- booth-window-mask.svg: original-scene coordinates; clips the ghost/interior behind the approved frame and counter. Uses the approved booth transform rather than moving/rescaling the booth.
- audio-manifest.json: six locally decoded PCM cues, with pitch/duration/peak metadata. Sources and license verification in ../../CREDITS.md; preparation code in ../../tools/prepare-story-audio.mjs.

Static staging: ../../story-review.html. Main app/artwork is unchanged. Asset style, aperture fit, phone-size readability, storyboard timings and sound candidates await Developer approval. The staging does not prove a functioning sequence.

## P1.7 integration contract — next checkpoint, not implemented

Use the existing active-time coordinator; a paused story retains its elapsed offset, beat and any scheduled/cued sound state. Audio must share the existing user-activated context/lifecycle rather than independent HTML audition players. Pause stops every story sound/motion/effect and input; explicit Play resumes remaining active time. Prevent duplicate cue playback on repeated ticks/resume. Keep Play/Pause usable while scene actions are locked. Complete at 8 active seconds, remove temporary overlays/listeners/nodes and restore exact resting layers. Replay at least three times without reload; test pauses at beginning/middle/end and failures.

Story asset preparation introduces no production sound playback or timers. Review-page audio controls are deliberate user-activated auditions, separate from the app, and must not be copied into its flow.

## P1.8 trigger/feedback plan — not implemented

One bell target, minimum 44 × 44 CSS px (visual bell may be smaller), touch and keyboard activation. Ring 1: warm glint + lower bell tone; ring 2: brighter glint + middle tone; ring 3: strongest restrained glow + higher tone, then exactly one story. Preserve progress through pause; ignore further scene input while playing; reset after completion. Suggested progressive clues: “The booth is waiting for a visitor”; later “A quiet bell rests on the counter”; later “Perhaps it needs a little persistence.” Exact text and active-time delays need review before P1.8. Avoid directly spelling out the three taps.

No Phase 2 assets or behavior are included. GitHub Pages, real-phone public-link verification and the final submission ZIP/current docs/Git log remain required Phase 1 gates.
