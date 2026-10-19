# A night remembered — approved journey, staging pending

Developer approval: 2026-10-19. This supersedes the independent-story proposals and wheel-light celebration ending. The shipped Phase 1 version and submission remain preserved. Only the static ending preview is authorized for implementation now.

## Approved design

Goal: briefly awaken an abandoned midway, then leave with its memory. Preserve the illustrated scene and assets; use small stylized movements, light, fog, opacity and sound. No carousel/wheel rotation, background rebuild, extensive dialogue or larger mystery. Tone: eerie, magical, slightly bittersweet, ages 10+.

1. Admission: three bell rings retain their distinct feedback and existing eight-second attendant story. The stamped ticket remains as evidence and unlocks the carousel.
2. Carousel: horses play low/middle/high notes. Solution: left → right → centre → left, without rhythm accuracy. An inspectable music scrap shows notation and horse symbols. Wrong notes reset only the attempt. The proposed eight-second payoff uses canopy light, subtle independent horse bobs and one horse briefly holding an unnatural raised position before settling.
3. Carnival game: targets score 1, 2 and 3. Two beanbags must total exactly 4; fallen targets cannot score again. Either order of 1 + 3 wins. Rules: “Two throws. Four points.” Unlimited retries reset only the attempt. A compact same-screen panel over the lower path remains the proposed presentation; its layout needs review before implementation.
4. Prize story: the proposed eight-second sequence gives a hollow winning bell, small paired ghost/cat lift/settle, then reveals an antique brass Ferris-wheel token. The shelf pair is not awarded or separated.
5. Claim: the token waits after the prize story ends. A separate deliberate touch/keyboard claim starts the ending. Completed activities remain replayable before claiming without losing progress.
6. Ending: ten active seconds. Lower attraction lights recede, fog thickens, the park disappears into darkness, and wheel/gondola are the last attraction traces. Only the souvenir remains. Its embossed wheel and inscription read “A NIGHT REMEMBERED.”
7. Return: hold the quiet token-only state, then offer subtle Revisit. Revisit starts a completely fresh journey through the start screen. Refresh also restarts; no saved progress. The return-option delay is not fixed by this visual checkpoint.

Each attraction still needs a distinct replayable 5–10-second audiovisual story, unique feedback/progress, progressive hints and touch/keyboard support. One sequence owns scene input at a time; Play/Pause stays usable during playback. The existing active-time clock/context must freeze and resume all effects, cues, hints, input and fades. Interruptions require explicit Play. Reduced motion uses stationary reveals and gentle fades. Verify future external sound sources as public-domain/CC0; no new audio is introduced here.

## Current checkpoint: manual visual poses

Open [ending staging](../../dev/previews/index.html?view=ending). The selector manually switches these poses; timestamps describe future playback, not implemented timing:

| Pose | Visual staging |
| --- | --- |
| Before claim | Approved scene visible; small token above the prize counter. |
| 2 seconds | Token grows toward centre; faint fog/darkness gathers. |
| 5 seconds | Lower attractions recede behind fog/darkness; wheel stays visible. |
| 8 seconds | Faint wheel silhouette and last warm gondola glow; token remains clear. |
| 10 seconds | Opaque darkness conceals all artwork/fog/wheel glow; token alone remains. |

“Show eventual Revisit placement” displays an inert label only on the last pose. It never resets anything. Pause is also an inert placement mockup, hidden in the final resting pose. A larger token detail below the phone supports material/inscription review.

The token candidate is original editable SVG: dev/previews/assets/keepsake-token-v1.svg. Brass gradients, deterministic grain, worn rim and embossed wheel follow the existing code-native prop approach. It is preview-only, not installed into production assets.

Darkness/fog are CSS layers. The wheel memory is a masked clone of the approved assembly, including the corrected carriage, rather than the uncorrected reference. This conceals painted lights without editing the background. Final darkness is fully opaque. There are no transitions, animation frames, timers, audio, claim logic, puzzles, journey state or reset behavior.

## Verification and review gate

`node tests/browser/check-ending-staging.mjs` passed: six preview modes, five poses, optional return placement, 390/375/320 viewport widths, no horizontal overflow, Pages-style project-prefix paths, no preview AudioContext/animations and unchanged app Enter/Pause smoke checks. All 45 existing runtime/media files match cleanup baseline 840227d byte-for-byte. The final Phase 1 ZIP SHA-256 is unchanged. Captures/results: tests/results/ending-staging/.

This is Chromium desktop verification, not a physical-phone or future ending playback test. Review token scale/material, offered placement, fog/concealment, last-wheel readability and Revisit placement. Visual approval is pending. Stop before full ending or gameplay implementation until the Developer approves the staging and next checkpoint.
