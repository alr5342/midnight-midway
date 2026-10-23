# A night remembered — approved journey and visual staging

Developer approval: 2026-10-19. This supersedes the independent-story proposals and wheel-light celebration ending. The shipped Phase 1 version and submission remain preserved. The Developer subsequently approved the field-preserving visual staging, authorized admission/progression, then requested the four-note carousel puzzle from commit 0895f9c. The carousel story, full ending and later gameplay remain deferred.

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

## Admission checkpoint — retained baseline at 0895f9c

Goal: finish the unchanged eight-second attendant story, receive one persistent admission ticket and unlock the carousel. Preserve three-ring feedback, ghost/prop animation, sound, replay, global Play/Pause and reduced motion. No carousel puzzle, additional wheel milestone, ending playback or deployment in this checkpoint.

The app owns one in-memory admitted flag independent of TicketStory's temporary rings/animation reset. The story connector reports each completed sequence once, after all eight active seconds; granting admission is idempotent. One existing ticket.svg is displayed in a compact badge between Play/Pause and Credits, labelled “Carousel unlocked.” data-carousel on the stage and read-only journey diagnostics expose the same availability flag. This is a noninteractive status display; carousel inputs are deliberately deferred.

The badge/progress remain during Pause, story replays, credits and tab/audio interruptions. Extra rings while a story plays cannot award early or duplicate anything. Refresh reconstructs a fresh visit with no ticket and a locked carousel. No storage is used. New idle/completion hint text confirms admission; the original partial-ring/story feedback remains.

Acceptance: no award before full completion, exactly one admission across three replays, unchanged resting story reset, preserved progress through pause/interruption/reduced motion, fresh reload, keyboard/touch bell operation and nonoverlapping ticket/controls in portrait and landscape. Run unit, full ticket/audio regression and browser/subpath preflight. Evidence: tests/results/admission-progress/. Stop for Developer review before the carousel puzzle.

Observed verification: all 17 unit tests pass; three full story cycles preserve one admission ticket and unlocked state. Pause at every story beat, native audio suspension, tab-return handling, refresh reset, touch/keyboard and reduced motion pass. Badge/control bounds pass at 390×844, 375×667, 320×568, 280×568 and 844×390. Chromium/Firefox pass full audiovisual preflight; Windows WebKit passes admission/visual/accessibility/path checks but has no Web Audio API, so no audio pass is claimed there. Artwork/composition and audio engines/assets are unchanged; Phase 1 ZIP hash is unchanged. Detailed result: [ADMISSION-CHECKS.json](ADMISSION-CHECKS.json). Runtime approval is pending; no deployment occurred.

## Initial carousel puzzle checkpoint — superseded presentation

Based on admission commit 0895f9c, on feature/carousel-puzzle. Three note buttons beneath the carousel correspond to left/center/right horses; a press plays the matching pitch and briefly brightens that horse and button. The exact order left → right → center → left solves the four-note attempt. Wrong input produces a lower accent, written feedback and zeroes only the attempt. Four matches show “Melody complete”; another note starts a new attempt while the learned-success flag remains. This does not complete the ride story or unlock the prize stall.

The ♫ control opens an in-scene paper with staff notation, the four horse labels/arrows, and text explaining low/middle/high. Close/Escape restores focus to the paper control. The clue never auto-enters notes. While it is open, bell/note input is rejected. Play/Pause remains available; paused inspection cannot change clue/attempt state. Credits and native interruption rules retain the existing explicit-resume behavior.

Hints start at admission: “Each horse remembers a different note”; after 12 active seconds, “A scrap of music rests beside the horses”; after 24, “The tune returns to the horse where it began.” Exact solution is confined to the inspectable clue. The initial ticket completion acknowledgement remains briefly before these hints. Partial input and solved state are retained during booth replay, Pause and reduced motion; refresh resets the visit.

All note/clue cues use the existing licensed audio assets/context. StoryAudio keeps separate ticket/carousel cue channels and accounts for pitch rate when resuming offsets. Scene-input changes notify the shared coordinator synchronously so another activity cannot remain visually enabled for a frame. No independent timer, CSS animation, horse bob, full ride sequence, new external asset, ending playback or deployment is introduced.

Relevant commands: `node --test tests/unit/carousel.test.mjs tests/unit/ticket-story.test.mjs tests/unit/playback.test.mjs`; `node tests/browser/check-carousel.mjs`; `node tests/browser/check-ticket-story.mjs tests/results/carousel-puzzle/ticket-regression`. Results/captures are under tests/results/carousel-puzzle/. Stop for Developer review before the carousel audiovisual story.

Observed result: 13 relevant unit tests pass, including pitched buffer offsets and independent audio channels. Focused Chromium checks pass note matching, incorrect attempts, clue/focus and paused inspection, hint timing, native interruption, reduced motion, fresh reload, four portrait/landscape layouts and puzzle retention across booth replay. The existing three-cycle ticket regression also passes. Original artwork/audio assets match 0895f9c byte-for-byte. No unrelated ambience, full cross-browser, public-site or packaging suites were run for this checkpoint. Summary: [CAROUSEL-CHECKS.json](CAROUSEL-CHECKS.json).

## Horse-input refinement - implemented for review

The visible Left/Center/Right/music panel is removed. Transparent accessible buttons now sit over the actual horses; their elliptical touch regions have minimum 44px dimensions and the middle target follows its raised head. Brief shared-clock horse glints remain; no horse movement or story animation is added. A small weathered SVG music scrap beside the carousel opens the existing inspectable clue. Keyboard names, focus outline, Close/Escape focus return and paused clue/input rules remain.

Notes now use an original synthesized music-box/reed WAV, with low C5, middle E-flat5 and high G5. The wrong-note accent uses the same original tone an octave lower. No external sound was acquired; all old booth/wind/magic assets are unchanged. New tones use the existing context, channels and saved pitch-adjusted resume offsets, with natural faded tails. Exact solution, wrong-attempt reset, hints, learned success and admission are unchanged.

Verification: 14 focused unit tests; focused Chromium touch/keyboard/clue/pause/audio/interruption/reduced-motion/progression checks, actual horse-head hit testing and 44px target dimensions at 390x844, 320x568, 280x568 and 844x390; existing three-cycle booth regression. Evidence: tests/results/carousel-horse-input/; durable summary: CAROUSEL-HORSE-CHECKS.json. All pre-existing artwork/audio assets byte-match 0895f9c; zero browser/HTTP errors. No deployment or physical-phone verification of this refinement. Human touch/listening approval is pending. Stop here before the carousel story.

## Playtest edits: hints, foreground bell and illustrated paper - implemented for review

Scope: preserve the admission, four-note puzzle logic, learned progress, booth animation/audio and all background artwork. No carousel story payoff. Hints now move from brass/lamplight to the counter bell and a possible chime; carousel hints move from individual horse voices to pale paper on the path and the rise/fall of its ink. Mistake/completion text is quieter, without saying the sequence or announcing an unlock repeatedly. The ticket HUD reads Admit one.

Bell: slightly lower/closer, 7.5% scene width versus 5.3%, gentle 5.6-second sideways sway, small lift/tilt and a contact shadow. Motion derives from shared active time, freezes on Pause and is suppressed during booth playback/reduced motion. The stationary, generous touch region encloses the full movement; no extra timer/RAF. Initial browser runs stopped because a moving touch target never satisfied the runner's stable-element check. Replaced that approach with a fixed region that also makes human phone taps more forgiving.

Ticket: revised existing SVG with deterministic paper grain, worn edges, faded ornamental ink and an engraved wheel. Music: new original music-sheet.svg reused for the perspective ground scrap and enlarged inspection. Only four notes on a treble staff, C5 / G5 / E-flat5 / C5, with the flat accidental matching the actual middle pitch. No visible positional wording, arrows, caption or explanatory panel. Accessible alternative describes musical pitches, not horse positions. Close/Escape, focus return and pause/input lockout remain.

Verification: 15 relevant unit tests and both focused Chromium browser regressions pass. Horse-head hits, touch sequences, minimum target dimensions, bell containment/access, clue bounds and Play/Pause access pass at 390x844, 320x568, 280x568 and 844x390; the booth also passes 375x667. All eight-second story beats, three replay cycles, one admission ticket, active-time hints, native interruption, cue resume and refresh reset pass. Pause/resting-overlay regression excludes only the intentionally varying idle bell transform. All assets present at 0895f9c remain byte-identical except the explicitly requested ticket.svg redesign; music-sheet.svg is new. Screenshots inspected at phone size. No browser/HTTP errors. Relevant evidence: tests/results/environmental-props/; summary: ENVIRONMENTAL-PROPS-CHECKS.json.

Physical-phone touch, listening and subjective art/clue difficulty are pending Developer review. No merge, push, deployment or Phase 1 package changes. Stop before the carousel story payoff.

## Bell and narration revision - 2026-10-23, implemented for review

Based on a846386. Replace only the bell SVG treatment with muted, textured bronze, fine worn highlights, patina and engraved scallops echoing the booth trim. Preserve the approved prop bounds, 5.6-second sway, fixed generous touch area and all existing sound/story/progression logic. Remove the ring-progress element, described-by reference, connector option/render code and obsolete CSS, including the attendant caption. The accessible bell button and main bottom live region remain.

Bottom copy now reads as short story narration instead of an action report. Initial booth copy: They used to keep someone here, however late the hour. Later cues recall the old bell/calling custom; successive rings suggest a shared wait without counting. Attendant beats evoke duty, unexpected guests and old promises. Completion points toward an old tune beyond the booth. Carousel hints move from an unfinished song to the horses' voices and a few bars spared by rain; no sequence is stated. Play/Pause and error guidance stay explicit. No puzzle logic, clue notation, ticket, background or audio asset changes.

Verification passed: 15 focused unit tests, focused carousel Chromium browser checks and three-cycle ticket-story regression. Check removal of floating bell progress, actual touch/keyboard input, note sequence and retained admission, paper inspection/focus, cue offset resume, native audio interruption, active-time hints, paused sway and reduced motion. Four carousel layouts (390x844, 320x568, 280x568, 844x390); booth also checks 375x667. Fixed bell target contains the visible prop. Background/audio asset bytes unchanged; only previously requested ticket and current bell redesign differ from the original asset baseline. Zero browser/HTTP errors.

Commands: node --test tests/unit/carousel.test.mjs tests/unit/ticket-story.test.mjs tests/unit/playback.test.mjs; node tests/browser/check-carousel.mjs; node tests/browser/check-ticket-story.mjs tests/results/bell-narration/ticket-regression. Captures/results: tests/results/bell-narration/. Phone-sized booth capture visually inspected; physical-phone art/text review is pending. No merge, push, deployment, new story payoff or submission package changes. Stop for Developer review.

## Painted props and carousel payoff - 2026-10-23, implemented for review

Scope approved from 2765f8e: painterly brass service bell, environmental music scrap visible from entry but admission-locked, one bottom in-scene narration box, and a finite carousel payoff followed by quiet completed idle. Keep all other journey/story structure and original background files. Asset prompts/paths are recorded in PAINTED-PROPS.md; prior SVGs remain as source history.

Static gate completed BEFORE animation: export original pixels using the approved left/center/right masks to scene-sized transparent horse PNGs. Reuse the existing horse-free hidden plate plus fixed poles/railing. Comparison of original masked rendering and reassembly at 941x1672: 315 changed pixels out of the 420x170 carousel crop (0.441%), mean absolute RGB error 0.005924/255, attributable to edge rasterization. Static reassembly, horse-free and lifted poses were inspected. Original horses were not generated; no original reference/background raster was edited. Reproducible tool: node tools/prepare-horse-layers.mjs. Static captures: tests/results/carousel-payoff/artwork/.

Ground paper lives in the scene, beneath the existing fog. It uses the same painted blank surface and four-note code overlay as inspection, in perspective with subdued night lighting and a short contact shadow. Its DOM/image does not change on admission. A separate transparent target starts locked and out of keyboard tab order; admission enables inspection. No labels, arrows or written solution. Remove the carousel progress element/CSS/controller output. Internal audio/artwork notices now feed the main bottom narration rather than separate panels. Start screen, Credits and the admission ticket remain existing UI.

The unchanged four-note solution starts eight shared-clock seconds: lights rise (0-1.2), staggered original horse lifts and six-note music-box phrase (1.2-6), settle (6-8). Heights stay within 8/10/9 original-scene pixels; idle range is 22% of those lifts, with quiet steady lights and no endlessly repeating music. No carousel or wheel rotation. Reduced motion retains story phases/audio but removes horse travel. Payoff locks booth/note/paper input. Pause freezes all visuals/cues and native audio suspension waits for explicit Play. Afterwards the existing booth and melody remain replayable; admission/earned ride completion never reset or duplicate. Refresh starts a new visit. Prize-stall gameplay and ending remain deferred.

Relevant checks: node --test tests/unit/carousel.test.mjs tests/unit/ticket-story.test.mjs tests/unit/playback.test.mjs tests/unit/ambient-audio.test.mjs; node tests/browser/check-carousel.mjs; node tests/browser/check-ticket-story.mjs tests/results/carousel-payoff/ticket-regression. Evidence/results are in tests/results/carousel-payoff/. Human physical-phone review of the new artwork, motion and listening experience remains pending. No push, merge, deployment or submission package changes.

Observed results: 21 relevant unit tests passed, static extraction/reassembly gate passed, focused carousel browser run passed, and the full three-cycle booth regression passed with zero page/HTTP errors. Project-subdirectory asset paths, four carousel phone/landscape layouts and the 375x667 booth layout passed. Browser payoff checks include manual Pause, native suspension of a running context, explicit resume and a rendered reduced-motion payoff. Summary: CAROUSEL-PAYOFF-CHECKS.json.

Interruption-test investigation: calling suspend() on an already-suspended context while Play was still pending produced no new state-change event and stalled the original immediate-interruption test twice. Stopped that test approach and captured actual state in tests/results/carousel-payoff/interruption-diagnostic.json. Integration now waits for running audio before injecting suspension. Separately, the shared listener now honors actual suspended-state events during loading; a dedicated unit test verifies immediate coordination, no late source start and explicit Play retry. Existing booth regression remains green.
