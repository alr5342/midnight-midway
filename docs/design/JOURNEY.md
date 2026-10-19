# A night remembered — approved journey and visual staging

Developer approval: 2026-10-19. This supersedes the independent-story proposals and wheel-light celebration ending. The shipped Phase 1 version and submission remain preserved. The Developer subsequently approved the field-preserving visual staging and authorized only the admission/progression checkpoint described below; full ending and later gameplay are not authorized yet.

Approved visual correction: the midway structures disappear while moonlit land/field stays visible; the wheel disappears last, leaving token and empty land. The static preview uses an empty-field repair behind independently masked attraction layers. Token direction and Revisit placement are unchanged. This visual staging is now approved; ending playback remains deferred.

## Approved design

Goal: briefly awaken an abandoned midway, then leave with its memory. Preserve the illustrated scene and assets; use small stylized movements, light, fog, opacity and sound. No carousel/wheel rotation, background rebuild, extensive dialogue or larger mystery. Tone: eerie, magical, slightly bittersweet, ages 10+.

1. Admission: three bell rings retain their distinct feedback and existing eight-second attendant story. The stamped ticket remains as evidence and unlocks the carousel.
2. Carousel: horses play low/middle/high notes. Solution: left → right → centre → left, without rhythm accuracy. An inspectable music scrap shows notation and horse symbols. Wrong notes reset only the attempt. The proposed eight-second payoff uses canopy light, subtle independent horse bobs and one horse briefly holding an unnatural raised position before settling.
3. Carnival game: targets score 1, 2 and 3. Two beanbags must total exactly 4; fallen targets cannot score again. Either order of 1 + 3 wins. Rules: “Two throws. Four points.” Unlimited retries reset only the attempt. A compact same-screen panel over the lower path remains the proposed presentation; its layout needs review before implementation.
4. Prize story: the proposed eight-second sequence gives a hollow winning bell, small paired ghost/cat lift/settle, then reveals an antique brass Ferris-wheel token. The shelf pair is not awarded or separated.
5. Claim: the token waits after the prize story ends. A separate deliberate touch/keyboard claim starts the ending. Completed activities remain replayable before claiming without losing progress.
6. Ending: ten active seconds. The booth, carousel, stall and other park elements disappear in stages, revealing the moonlit field. The wheel/gondola are the last attraction traces. Finally only the souvenir and empty land remain. Its embossed wheel and inscription read “A NIGHT REMEMBERED.”
7. Return: hold the quiet token-only state, then offer subtle Revisit. Revisit starts a completely fresh journey through the start screen. Refresh also restarts; no saved progress. The return-option delay is not fixed by this visual checkpoint.

Each attraction still needs a distinct replayable 5–10-second audiovisual story, unique feedback/progress, progressive hints and touch/keyboard support. One sequence owns scene input at a time; Play/Pause stays usable during playback. The existing active-time clock/context must freeze and resume all effects, cues, hints, input and fades. Interruptions require explicit Play. Reduced motion uses stationary reveals and gentle fades. Verify future external sound sources as public-domain/CC0; no new audio is introduced here.

## Current checkpoint: manual visual poses

These approved poses remain a static review reference. The next authorized runtime work is admission only, not playback of the ending.

Open [ending staging](../../dev/previews/index.html?view=ending). The selector manually switches these poses; timestamps describe future playback, not implemented timing:

| Pose | Visual staging |
| --- | --- |
| Before claim | Approved scene visible; small token above the prize counter. |
| 2 seconds | Booth fades first; carousel/stall/wheel remain over revealed land. |
| 5 seconds | Carousel nearly gone, stall fading; field stays visible. |
| 8 seconds | Wheel is the last structure above empty land; token stays clear. |
| 10 seconds | All park layers invisible; token and moonlit field remain. |

“Show eventual Revisit placement” displays an inert label only on the last pose. It never resets anything. Pause is also an inert placement mockup, hidden in the final resting pose. A larger token detail below the phone supports material/inscription review.

The token candidate is original editable SVG: dev/previews/assets/keepsake-token-v1.svg. Brass gradients, deterministic grain, worn rim and embossed wheel follow the existing code-native prop approach. It is preview-only, not installed into production assets.

The whole-screen darkness layer has been removed. A built-in imagegen edit supplies dev/previews/assets/empty-field-v1.png as a preview-only candidate: the land/sky/path behind the carnival, with artificial structures, lights, fences, flags, barrels and jack-o-lanterns removed. Original artwork files remain untouched. Exact prompt/provenance: [empty-field prompt](EMPTY-FIELD-PROMPT.md).

Feathered, original-coordinate masks isolate booth/carousel/stall/wheel from copies of the approved assembly, retaining the corrected gondola. Stage opacities reveal the field beneath them instead of reducing landscape brightness. Other midway elements fade with the full original assembly. Low-opacity fog supports the joins, not a blackout. The final field stays fully visible. There are no transitions, animation frames, timers, audio, claim logic, puzzles, journey state or reset behavior.

## Verification and review gate

`node tests/browser/check-ending-staging.mjs` passed: six preview modes, five poses, fully visible final field, all final park-layer opacities zero, no blackout overlay, unchanged token bytes, optional return placement, 390/375/320 viewport widths, no horizontal overflow, Pages-style project-prefix paths, no preview AudioContext/animations and unchanged app Enter/Pause smoke checks. All 45 existing runtime/media files match cleanup baseline 840227d byte-for-byte. The final Phase 1 ZIP SHA-256 is unchanged. Revised captures/results: tests/results/ending-field-staging/. Prior blackout-stage captures remain in tests/results/ending-staging/.

The staging checks above were recorded before the admission implementation. They are Chromium desktop verification, not physical-phone or ending playback tests. The field is approved in this visual staging, but remains preview-only until a separately authorized ending implementation. No ending asset is installed into the running app.

## Admission checkpoint — implemented, runtime review pending

Goal: finish the unchanged eight-second attendant story, receive one persistent admission ticket and unlock the carousel. Preserve three-ring feedback, ghost/prop animation, sound, replay, global Play/Pause and reduced motion. No carousel puzzle, additional wheel milestone, ending playback or deployment in this checkpoint.

The app owns one in-memory admitted flag independent of TicketStory's temporary rings/animation reset. The story connector reports each completed sequence once, after all eight active seconds; granting admission is idempotent. One existing ticket.svg is displayed in a compact badge between Play/Pause and Credits, labelled “Carousel unlocked.” data-carousel on the stage and read-only journey diagnostics expose the same availability flag. This is a noninteractive status display; carousel inputs are deliberately deferred.

The badge/progress remain during Pause, story replays, credits and tab/audio interruptions. Extra rings while a story plays cannot award early or duplicate anything. Refresh reconstructs a fresh visit with no ticket and a locked carousel. No storage is used. New idle/completion hint text confirms admission; the original partial-ring/story feedback remains.

Acceptance: no award before full completion, exactly one admission across three replays, unchanged resting story reset, preserved progress through pause/interruption/reduced motion, fresh reload, keyboard/touch bell operation and nonoverlapping ticket/controls in portrait and landscape. Run unit, full ticket/audio regression and browser/subpath preflight. Evidence: tests/results/admission-progress/. Stop for Developer review before the carousel puzzle.

Observed verification: all 17 unit tests pass; three full story cycles preserve one admission ticket and unlocked state. Pause at every story beat, native audio suspension, tab-return handling, refresh reset, touch/keyboard and reduced motion pass. Badge/control bounds pass at 390×844, 375×667, 320×568, 280×568 and 844×390. Chromium/Firefox pass full audiovisual preflight; Windows WebKit passes admission/visual/accessibility/path checks but has no Web Audio API, so no audio pass is claimed there. Artwork/composition and audio engines/assets are unchanged; Phase 1 ZIP hash is unchanged. Detailed result: [ADMISSION-CHECKS.json](ADMISSION-CHECKS.json). Runtime approval is pending; no deployment occurred.
