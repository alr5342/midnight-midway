# Peer-playtest revision checkpoint

Authorized from 810dea4, 2026-10-25: remove permanent activity/visit restart controls; replace labelled Retry with environmental bag pickup; strengthen time-based environmental guidance without solutions; draw a recognizable pause icon; shorten the approved disappearance; fix Credits recovery without losing interaction state. No new puzzle, story, deployment or regenerated artwork.

Acceptance: Credits restores prior playing/paused state and exact interaction progress across bell rings, melody/clue, bag flight/failure, story and waiting token. External interruptions still require explicit Play. Guidance grows on shared active time, freezes during pause/modal, respects reduced motion and highlights relevant objects rather than answers. Failed rounds return the existing bags to counter compartments; pickup resets only that attempt and keeps earlier progress. Ending takes eight active seconds in the existing fade order, then retains the two-second quiet hold/Revisit.

## Implementation and findings

- Removed the permanent toolbar and its event handlers. The bottom narration remains the only scene text box; Revisit remains an ending-only fresh start.
- A small pure guidance envelope uses shared active time since meaningful progress. Soft halos begin after eight idle seconds and ramp to forty; repeated failed can rounds add a bounded floor. All horses/cans receive equal emphasis, so glows locate the activity without revealing the answer. Reduced motion uses stationary light. No independent timer or CSS animation was introduced.
- Reused the existing painted bags and accessible touch target, adding only small original SVG wooden compartments. After the final failed throw, the bags return over 450 active milliseconds; the cans remain as the player left them until pickup. Touching either bag or using keyboard Enter resets only that round. Repeated failures remain recoverable. The same pickup permits completed-story replay before claiming the token.
- Credits now owns a temporary pause rather than resetting any model. Close/Escape restores prior playback mode; an external page interruption still requires explicit Play. Tests reproduced a second cause of the reported stall: a delayed event from the app's own AudioContext suspension raced with Escape/resume and paused the scene again. The audio engine now identifies that matching owned transition. Genuine interruptions during initial loading/resume and after playback resumes still pause correctly.
- Replaced the font-dependent numeral with two drawn SVG bars, retaining accessible Pause/Play labels. Scaled the existing ending poses, sound fade and masks to eight seconds without changing their order. The opaque field remains; the wheel fades last, then the two-second quiet hold precedes Revisit.

## Observed verification, 2026-10-25

All 42 targeted unit tests passed:

```powershell
node --test tests/unit/activity-restart.test.mjs tests/unit/guidance.test.mjs tests/unit/ending.test.mjs tests/unit/prize.test.mjs tests/unit/carousel.test.mjs tests/unit/ticket-story.test.mjs tests/unit/playback.test.mjs tests/unit/ambient-audio.test.mjs
node tests/browser/check-peer-revision.mjs
node tests/browser/check-ending.mjs
```

Both focused Chromium browser checks passed with no unexpected HTTP or JavaScript errors under `/midnight-midway/`. The peer-revision check preserves exact models and elapsed time across 22 Credits contexts: idle guidance, partial bell rings, an already paused scene, ghost playback, partial melody, open sheet inspection, carousel playback, flight/between-throw/failed-round states at four sizes, haunted prize playback and waiting claim. It also verifies eight rapid modal cycles, Escape, external interruption while Credits is open, keyboard pickup, reduced motion, progressive guidance and the eight-second wheel-last ending. A separate real-time probe passed four alternating Close/Escape cycles with two bell rings retained and audio running.

Returned-bag touch pickup passes at 280×568, 320×568, 390×844 and 844×390 without the adjacent paper intercepting input. Captures of the compartments, narrow-phone layout and drawn pause symbol were visually inspected. The ending check plays admission → carousel → two-can-support win → prize story → deliberate claim → empty field → Revisit, and checks pause/audio levels throughout, genuine native suspension, interruption during the final hold, fresh Revisit/refresh, reduced-motion stationary token and safe missing-field behavior.

Evidence/captures: `tests/results/peer-revision/` and `tests/results/ending-runtime/`. Historical `check-journey-recovery.mjs` is retained but superseded because it asserts the removed restart toolbar. No unrelated regression suite was run for this checkpoint.

All existing `assets/` and `dev/previews/` files byte-match baseline 810dea4. The preserved Phase 1 ZIP SHA-256 remains `4c3d9bc0f40726dc2de73d8e2fbe9afe802a8dc8418f2d7b3f850edfdd1a6aa3`. Secret scan and whitespace checks pass; the local preview responds HTTP 200. No merge, push or deployment.

These checks use desktop Chromium touch emulation, not a new physical-phone or peer pass. Developer review of the guidance strength, pickup affordance and faster pacing is pending. The public Phase 1 site's earlier phone approval does not verify this local revision.

## Debrief carry-forward

The Developer reports two peer-playtest rounds: one after the Phase 1 prototype, and another with the more complete experience. Participant counts, exact dates/devices and detailed observations from the first round have not been supplied; do not invent them. [Playtest notes](../PLAYTEST-NOTES.md) retain both rounds and the current feedback. The supplied debrief template is absent; this checkpoint does not claim a completed debrief or final submission.
