# Approved narration and bell revision

Authorized from 56c010d. Apply the Developer-approved narration proposal, with these exact substitutions: carousel discovery, “The painted horses have forgotten how the music goes.”; prize-stall transition, “Beyond the carousel, the prize stall seems to be waiting for someone.”; waiting token, “Perhaps this place has one last thing to give.”

Goal: one bottom narration owner, guided by the pending objective and actual active interaction. Completed activities must not steal later hints. Intentional story replay and explicit paper inspection may temporarily own narration, then yield to the pending objective. Completion handoffs yield immediately to the next input. Text feedback must be readable rather than flashing with short visual/audio feedback. Hints, feedback and story copy use shared active time and retain their phase through Pause/Credits. Fix the lingering bell ring without disabling replay or suppressing deliberate keyboard focus.

Preserve artwork, story/audio timing, puzzle solutions, current admission → carousel → prize gating, replay and eight-second ending. Keep local attraction prose independent of progression; the coordinator alone chooses the next objective and handoff. Future direction is recorded only: stackable booth tickets, ticket use at carousel/prize in either order, token available after both. Do not implement those rules, ticket spending, new replay UI or deployment in this checkpoint.

Acceptance: reproduce and fix partial bell replay overriding prize hints, completed horse/paper use leaking carousel text into later states, first-admission text covering immediate note/clue input, unreadable error/throw messages, and one-bag/failed recovery hints suppressing needed guidance. Verify the approved substitutions, exact narration after Pause/Credits, bell focus/glow after completion and continued three-ring replay. Focused model/narration tests and a phone-size normal-input browser journey through recovery and ending; no unrelated suite.

## Implementation

`src/js/narration.js` holds the approved copy, local state wording and a single priority selector. Attraction models expose their local hint plus the timestamps needed for that selector; they do not write the bottom box. `app.js` is its only writer and supplies the current pending objective. Removed the previous last-touched-activity state, fallback routing, duplicate ending writer and model-specific handoff prose.

Start/final quiet hides narration; Pause owns its explicit message; the claimed ending owns its copy; actionable warnings, active stories and explicit inspection can temporarily override exploration. Otherwise the pending objective wins. First-completion handoffs last at most 3.2 active seconds and yield immediately to the next input. Booth replay does not repeat admission handoffs, and carousel replay retains its first completion time for the same reason. The waiting token wins over partial completed-attraction input, but an intentional story replay still plays normally and returns to the objective.

Wrong-note narration holds for 3.2 active seconds while glint/audio timing is unchanged. New input replaces it immediately. Throws retain pre-throw bag-count wording; no unrelated 650ms sentence is inserted. One-bag guidance progresses to the dents hint, and failed-round wording progresses to collecting the returned bags. Each eight-second attraction story uses two sustained lines. Ending copy follows its existing three phases and disappears during the final quiet hold. All timing uses the existing active clock; no new timer, animation or storage.

The bell circle was reproduced with keyboard activation: focus remained on `#bell` after admission, drawing the shared 3px focus-visible outline. Its discovery halo was already inactive. The third accepted ring now transfers bell focus to Play/Pause as the story locks scene input; completion also releases bell focus if still present. Deliberate keyboard return retains the outline, and three-ring replay remains available. At rest after completion, only the painted bell's contact shadow is applied; no inactive halo filter remains.

## Observed verification

All 40 targeted unit tests pass, including eight narration cases for the actual routing/recovery failures, readable feedback, pending token/error handling, objective-independent local prose and frozen hint age. Existing puzzle solutions, authored timing, replay/progress retention, cues and reduced-motion checks remain covered.

```powershell
node --test tests/unit/narration.test.mjs tests/unit/carousel.test.mjs tests/unit/ticket-story.test.mjs tests/unit/prize.test.mjs tests/unit/ending.test.mjs tests/unit/guidance.test.mjs tests/unit/playback.test.mjs
node tests/browser/check-narration.mjs
node tests/browser/check-ticket-story.mjs tests/results/narration-revision/ticket-regression
```

The focused Chromium journey passes using actual touch/keyboard controls and accelerated shared active time, without diagnostic state setters. It covers all three exact wording edits, immediate post-admission inspection, readable wrong-note text, partial bell replay during later objectives, completed horse/paper input returning to the prize/token, failed two-throw recovery through real bag pickup, intentional booth/carousel story replay, and the existing claim/field/Revisit ending with final silence. Credits restores exact text, owner, model state and elapsed time during the ghost, sheet inspection, bag flight, failed round and waiting token. Explicit Pause restores text during wrong-note feedback, waiting token and ending. Live reduced motion retains narration and keeps horses stationary.

The keyboard bell test confirms no lingering outline/halo at completion, an enabled bell, and visible focus when deliberately selected again. Browser evidence also confirms the current one-ticket, sequential gating remains intact across replay; future stacking/spending/order rules are absent.

The existing real-time ticket/audio regression also passes three full story cycles, distinct audible feedback, saved cue offsets, Pause at all story beats, native/tab interruptions, safe artwork/audio failure recovery, late loading while paused, five layouts and fresh refresh. Its old copy assertion was updated to the approved wording. Failure-message checks now wait for the actual rendered recovery text as well as the model failure status, avoiding a race with the next shared frame. Both browser checks report zero unexpected HTTP/JavaScript errors.

Bottom narration fits without horizontal overflow at 280×568, 320×568, 390×844 and 844×390. Admission, returned-bag and waiting-token captures were visually inspected at phone size. All existing `assets/` and `dev/previews/` files byte-match 56c010d. The Phase 1 ZIP SHA-256 remains `4c3d9bc0f40726dc2de73d8e2fbe9afe802a8dc8418f2d7b3f850edfdd1a6aa3`. Detailed JSON/captures: `tests/results/narration-revision/`; baseline bell observation: `tests/results/narration-before.mjs` and `bell-focus-before.png`.

Limits: desktop Chromium with touch emulation, not a new physical-phone or peer pass. Human evaluation of the revised writing remains pending. No new assets, creative features, progression rules, merge, push or deployment. Stop for Developer review before the ticket/either-order checkpoint.

Final local hygiene: secret scan and `git diff --check` pass; the preview at http://127.0.0.1:4173/ responds HTTP 200.
