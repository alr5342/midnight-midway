# Journey clarity and activity recovery

Authorized from 15f2597, 2026-10-24: revise booth/carousel/stall transitions without revealing solutions; fix failed-can recovery; provide an unobtrusive current-activity restart and separate full-visit restart; verify the entire journey through normal touch controls. Preserve artwork, rules, shared Pause/reduced motion, earned progress and approved ending. No deployment.

The bottom narration stays the only text box. A compact control row above it provides Restart activity (Retry game after a failed attempt / Replay game after winning) and Restart visit. Activity restart cancels its current attempt or playback even while paused, without resuming the scene or removing admission, ride completion or an earned token. Full-visit restart reloads the start screen. Completed ending retains the approved token-only hold/Revisit behavior.

## Findings and fixes

- At the 280px baseline, a touch at 68% scene width / 71% scene height on the left beanbag area hit `music-open`. Observed: `failed:true`, `bags:0`, `clueOpen:true`. The opened inspection then blocked prize input. After the layer fix, the same real touch hits `prize-retry`: `failed:false`, `bags:2`, `clueOpen:false`. This is a reproduced blocking path; it is not a claim to have observed the Developer's physical phone directly.
- The locked music target could intercept the center of Enter at 280px. A parent's pointer-events setting did not disable explicitly enabled descendant buttons. Start-state scene actions are now hidden; disabled scene buttons cannot intercept pointer input. Original model guards remain in place.
- Active prize targets sit above overlapping ground-clue input; open inspection sits above scene targets. Recovery controls have their own higher UI layer so the paper cannot block restarting. The new grid has one explicitly bounded column, and the control row moves below top controls in short landscape layouts. The actual game props do not move.
- Each model has a restart method that clears its transient attempt, playback and cues while preserving earned state. The visit owner tracks the last interacted activity, advances the default to carousel after admission and prize after first completed ride, and dispatches one reset. Cancelled stories do not finish later or grant unearned progress. The completed carousel retains its idle/music phase when replay is cancelled.
- New controls are native buttons supporting touch and keyboard. Activity reset is allowed during a story and while paused; it never resumes a paused scene. After token claim, activity reset is disabled; whole-visit restart remains available during the disappearance. The approved final hold/Revisit behavior remains.

## Verification

- `node --test tests/unit/activity-restart.test.mjs tests/unit/ending.test.mjs tests/unit/prize.test.mjs tests/unit/carousel.test.mjs tests/unit/ticket-story.test.mjs tests/unit/playback.test.mjs tests/unit/ambient-audio.test.mjs` — **38 passed**. Includes 20 model-level failed/retry cycles and cancellation before/during stories, preservation of earned milestones, and existing audio/Pause/reduced-motion checks.
- `node tests/browser/check-journey-recovery.mjs` — **passed**. Actual touch inputs recover eight failed attempts across 280×568, 320×568, 390×844 and 844×390. It checks both explicit Retry and the original problematic bag-edge touch, smallest-layout Enter, inspection/partial-puzzle reset, reset during flight/story/Pause, reduced motion, preserved progress and separate full-visit reset. Both recovery buttons fit, receive taps and have minimum 44px height; no horizontal overflow.
- A separate **normal-speed touch playthrough**, with no virtual clock, forced input events, diagnostic state mutation or puzzle bypass, completes: Enter → admission → inspect clue → carousel → deliberate two-throw loss → visible Retry game → win → full prize story → claim → empty field → Revisit → fresh start screen. Final audio sources stop. The diagnostics are read-only observations.
- Served under `/midnight-midway/` for Pages project-path compatibility. No browser/HTTP errors. All existing `assets/` and development-preview files byte-match 15f2597. No new assets, sound or license dependencies.

Evidence: `tests/results/journey-recovery/checks.json`, phone/control captures, `clear-retry.png`, and `normal-gameplay-empty-field.png`. Visually reviewed the 280px and 390px control layouts and explicit Retry state. Baseline reproduction was recorded in tool output before the fix; local probe material is in the ignored tests/results directory.

Focused secret scan and `git diff --check` passed. Local preview returned HTTP 200 at http://127.0.0.1:4173/. The preserved Phase 1 ZIP SHA-256 remains `4c3d9bc0f40726dc2de73d8e2fbe9afe802a8dc8418f2d7b3f850edfdd1a6aa3`.

Limits: Chromium with touch emulation and a normal-speed browser journey; this does not certify a new physical-phone or full cross-browser review. Developer review is pending. No push, merge or deployment; original artwork, main/public site and archived Phase 1 submission are preserved.
