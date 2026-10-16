# Ticket-booth story — approved P1.6; P1.7/P1.8 runtime review

The approved narrative is unchanged: three bell rings with different feedback summon a ghostly attendant, who presents a floating ticket, stamps it with magical sparks, then disappears and returns the booth to normal. Implemented sequence duration: **8 active seconds**, excluding pauses. P1.6 (ghost v3/assets/storyboard) is approved; P1.7/P1.8 now implement this sequence and its trigger at the main URL. Static staging remains a separate inspector.

| Active time | Beat | Visual / sound | Reduced-motion treatment |
| --- | --- | --- | --- |
| 0–1.5 s | Beginning: attendant appears | Local empty-window plate replaces only the aperture; attendant fades in behind original arch/counter. Soft arrival chime. | Opacity-only reveal; no floating travel. |
| 1.5–3.5 s | Middle: ticket offered | Separate ADMIT ONE ticket floats just in front of the window/counter; attendant remains visible. | Stationary ticket reveal. |
| 3.5–4.5 s | Middle: stamp and sparks | Separate stamp makes one short downward motion; small amber sparks and magical accent at impact. | Stationary stamp plus a brief steady glow; no moving particles/flashing. |
| 4.5–6.5 s | End: departure | Ghost and stamp fade; departure chime; ticket briefly remains, then fades. | Opacity-only changes. |
| 6.5–8 s | End: settle/reset | Remove all temporary window/character/prop/spark overlays; reveal approved booth pixels, retain bell, reset three-ring progress, return clearly to exploration. | Same reset without motion. |

## Prepared assets

- ghost-attendant-v3.png: revised AI-generated transparent painterly sprite, with an obscured face, worn attendant uniform, elongated narrow silhouette and spectral lower fade. Eerie without graphic horror; candidate for ages 10+. v1 and the intermediate v2 are preserved. Exact prompts in PROMPTS.md. Only this character source changed in staging; timing, placement, props, sounds and background remain unchanged.
- booth-empty-interior-v1.png: AI-assisted local interior repair. Applied only through booth-window-mask.svg; approved exterior remains original. Exact prompt in PROMPTS.md.
- bell.svg, ticket.svg, stamp.svg, sparks.svg: original code-native props/effects with warm brass/paper/burgundy colors. Ticket text remains editable/readable.
- booth-window-mask.svg: original-scene coordinates; clips the ghost/interior behind the approved frame and counter. Uses the approved booth transform rather than moving/rescaling the booth.
- audio-manifest.json: six locally decoded PCM cues, with pitch/duration/peak metadata. Sources and license verification in ../../CREDITS.md; preparation code in ../../tools/prepare-story-audio.mjs.

Static staging: ../../story-review.html. Artwork/assets/timings are approved. The main app now implements playback and discovery; runtime pacing/discoverability/listening await Developer review. The separate inspector does not by itself prove a functioning sequence.

## P1.7 integration contract — implemented, runtime review pending

Use the existing active-time coordinator; a paused story retains its elapsed offset, beat and any scheduled/cued sound state. Audio must share the existing user-activated context/lifecycle rather than independent HTML audition players. Pause stops every story sound/motion/effect and input; explicit Play resumes remaining active time. Prevent duplicate cue playback on repeated ticks/resume. Keep Play/Pause usable while scene actions are locked. Complete at 8 active seconds, remove temporary overlays/listeners/nodes and restore exact resting layers. Replay at least three times without reload; test pauses at beginning/middle/end and failures.

P1.6 asset preparation introduced no production playback or timers. P1.7/P1.8 now use the shared clock/context. Review-page audio controls remain deliberate user-activated auditions, separate from the app, and are not copied into its flow.

## P1.8 trigger/feedback — implemented, runtime review pending

One bell target, minimum 44 × 44 CSS px (visual bell may be smaller), touch and keyboard activation. Ring 1: warm glint + lower bell tone; ring 2: brighter glint + middle tone; ring 3: strongest restrained glow + higher tone, then exactly one story. Preserve progress through pause; ignore further scene input while playing; reset after completion. Implemented hint text/timing is recorded below; it never directly spells out three taps.

Implemented P1.8: one 44 × 44 minimum transparent bell target, three pitched bell responses with increasing glow and one/two-chime progress. Initial sound loading gates input; progress survives Pause; third ring locks the bell and starts exactly one story. Completion resets progress for replay. Hints at entry/12/24 active seconds: “The ticket booth is waiting for a visitor…”; “A quiet bell rests on the old counter.”; “Perhaps the bell is waiting for a little persistence.” Partial ring feedback briefly replaces the hint, then timed discovery hints continue. Completion briefly announces that the bell waits again. All times derive from the shared clock.

No Phase 2 assets or behavior are included. GitHub Pages, real-phone public-link verification and the final submission ZIP/current docs/Git log remain required Phase 1 gates. Exact audit: ../../docs/PHASE-1-AUDIT.md. Sound players in the static inspector remain auditions only; production cues use StoryAudio and the shared ambient AudioContext.
