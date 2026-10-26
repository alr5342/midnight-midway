# Stall transition, responsive throws and the memory ending

## Authorized checkpoint

From 6487dc4, the Developer requested a subtle stall wake-up after the carousel, a responsiveness review without changing can-game rules, and implementation of the already approved claim/disappearance/Revisit ending. Preserve original artwork, the approved token/empty field, one bottom narration box, shared Pause/Play and reduced motion. Stop for local review; no deployment.

## Implementation and acceptance

- One warm stall-light shimmer and quiet metallic carnival clatter signal the first completed carousel story. The cue uses active time and does not explicitly instruct the player or restart on carousel replay.
- Throws settle in 650ms instead of 1450ms: 220ms flight, accelerated falls and 65ms support stagger. Metal sound tails are independent of input lock. Pointer aims choose the nearest standing can within the existing touch regions; keyboard retains named targets. Two bags and the support rule are unchanged. Returned bags remain the retry/replay affordance.
- An earned token retains its progress but clears the stack/claim touch area during a replay attempt, preventing accidental claim while aiming. Its reveal plays again with the prize story; failed replays restore the already earned waiting token.
- After the full prize story, the waiting token has a glowing minimum-44px touch/keyboard target. Claim is explicit and rejected while paused, during another interaction/story, or before required ending artwork loads. Prior stories remain replayable until claim.
- Claim freezes copies of the actual current scene over the approved empty field. Miscellaneous park elements and booth fade first, carousel follows, stall next, wheel last at ten active seconds. The landscape remains opaque, not darkened. Original pixels/masks and the corrected gondola are retained; no new generated artwork.
- The approved brass token moves toward its approved final position/size. Reduced motion replaces travel with a stationary token reveal and retains gradual attraction opacity fades.
- Wind and story/music master levels fade on active time; paused audio stops and resumes at the saved offsets and fade levels. Browser interruptions require explicit Play. All other scene inputs lock after claim.
- At ten seconds only token and empty land remain; narration and controls clear. After a two-active-second hold, Revisit appears in the approved position. The playback clock finishes and audio/animation frames stop. Revisit reloads into a completely fresh start screen, with Enter required again. Refresh likewise restarts.
- If an interruption pauses the quiet hold, Play is temporarily available so returning cannot strand the Revisit timer. It clears on resume, and the park stays absent.

Tests must exercise wake-up, rapid taps/nearest-can aims, retry timing, replay, deliberate claim, each disappearance phase, audio levels, Pause/interruption, reduced motion, final silence/no frames, Revisit/refresh, missing field safety, touch sizes/layouts, unchanged source assets and Pages-style project paths. Physical-phone review remains a separate user check.

## Verification

- `node --test tests/unit/ending.test.mjs tests/unit/prize.test.mjs tests/unit/carousel.test.mjs tests/unit/ticket-story.test.mjs tests/unit/playback.test.mjs tests/unit/ambient-audio.test.mjs` — **34 passed**. Includes exact game rules, 650ms settle, independent sound tails, one-time wake-up, claim idempotence, fade order/hold, terminal playback, reduced motion and fade levels across audio context creation/resume.
- `node tests/browser/check-prize.mjs` — **passed**, including original interaction/story/replay regressions, current fast timing, returned bags, token clearing during replay, Pause, native interruption, reduced motion and fresh refresh.
- `node tests/browser/check-ending.mjs` — **passed**. Exercises the complete admission/ride/game/claim journey, an ambiguous 280px aim that would select the wrong DOM target without nearest-can resolution, warm wake-up and sound, keyboard claim, paused-claim rejection, every disappearance phase, rendered master audio levels and frozen poses, native audio interruption, recovery during the final hold, silence/no frames at rest, unique cloned SVG IDs, Revisit followed by a full reduced-motion journey, refresh, and an earned token with a deliberately missing field asset. The missing-field test expects its 404 and proves claim stays disabled with a bottom-box error instead of disappearing into a broken scene. The normal journey has zero browser/HTTP errors.
- Game and claim targets fit and receive taps at 390×844, 320×568, 280×568 and 844×390. All were served under `/midnight-midway/` to check GitHub Pages project paths. The bottom narration remains the only visible instructional text box.
- All pre-existing asset and development-preview bytes match 6487dc4. The runtime field is byte-identical to the approved preview field. The preserved Phase 1 ZIP SHA-256 remains `4c3d9bc0f40726dc2de73d8e2fbe9afe802a8dc8418f2d7b3f850edfdd1a6aa3`.
- Secret scan and `git diff --check` passed. Local server returns HTTP 200 at http://127.0.0.1:4173/.

Captures/results: `tests/results/ending-runtime/` and `tests/results/prize-game/`. Visually inspected stall/claim staging, 2s/5s/8s fades, final field/Revisit and reduced-motion captures. Testing accounts for one animation frame between model time and rendered gain values; native AudioContext readiness and navigation are awaited separately from the virtual scene clock.

Limits: desktop Chromium with touch emulation, not a new physical-phone or full cross-browser certification. Developer review of feel, sound balance and ending remains pending. No deployment or approval of the implemented ending is implied by automated checks. Main, the published site and Phase 1 archive remain unchanged.
