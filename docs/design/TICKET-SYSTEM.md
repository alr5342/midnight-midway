# Ticket balance and flexible attraction order

Authorized from 498e831: each completed eight-second booth story awards one stackable ticket. The first ticket makes both attractions discoverable/playable; a first accepted horse note or can throw starts its paid activity. A new replay after success also costs one ticket. Paper inspection is free. Wrong melody inputs, failed two-bag rounds and returned-bag retries belong to the existing paid activity and do not spend another ticket. An unfinished paid activity remains paid if the player explores elsewhere or returns to the booth.

Each attraction retains its independent puzzle, eight-second story, animation/audio, completion history and replay. Success ends its paid activity. A central visit record awards the souvenir exactly once after both attraction stories have finished, in either order. The original token appears at the prize stall, including when the carousel finishes last. Keep it out of the prize aiming space during an active replay round, restoring it at round rest; the earned token is never revoked. Claim and the approved eight-second disappearance/two-second hold/Revisit remain unchanged.

One app-owned narration writer remains. Update handoffs/hints for choosing either attraction, the one-ticket cost, returning to the bell, paid attempt recovery and the remaining uncompleted attraction. Use the existing compact ticket badge for the live balance, including zero after admission. No new artwork, puzzle solution, story, permanent control, deployment or submission packaging.

Acceptance: two completion orders; stack and spend exact balances; one charge per accepted activity; no charge for invalid/blocked input, paper, wrong notes, retries, Pause/Credits, interruptions or repeated renders; paid attempts preserved when switching; replay of both attractions after success; one token only after full completion of both stories; token at the existing stall position in either order; zero-ticket return-to-booth recovery; fresh Revisit; touch/keyboard, reduced motion and shared clock/audio. Test focused models plus real UI journeys under a Pages-style prefix, preserve approved asset/submission bytes, stop for review.

## Implementation

- `Visit` owns issued/available/spent tickets, the two paid activity flags, completed-story counts, selected paid activity and a single souvenir timestamp. Booth completion numbers and attraction story counters make repeated reports idempotent. Accepted actions commit payment synchronously; rejected actions cannot debit funds.
- Controllers settle story completions before processing input as well as on frames. This closes the old paid activity before a replay can start at the exact eight-second boundary. Wrong-note resets and failed-round pickup reuse active payment. Completion closes only that attraction's payment; another unfinished paid activity remains intact.
- Both controls become available after the first issue. Horse input needs a ticket or an already paid carousel activity; paper inspection remains free even at zero balance. The prize game no longer depends on carousel completion. A fresh prize replay pays at bag pickup, then both throws and any failed retries remain covered.
- Prize-local completion no longer awards the souvenir. The visit grants it only after both full stories, and the prize renderer shows the existing token using that global timestamp. Its existing gentle reveal is reused after either final story. It stays earned through replay, leaves the aiming space during a prize round and returns at round rest. Claim/disappearance code and artwork are unchanged.
- The existing ticket badge now announces its compact live balance, including zero. Narration offers either attraction, follows paid input, directs depleted players back to the booth and guides the remaining unfinished attraction. The booth can receive discovery guidance again when a new ticket is needed; it still releases its keyboard ring when the story begins. No new external asset or sound.

## Observed verification

All 49 targeted unit tests pass:

```powershell
node --test tests/unit/visit.test.mjs tests/unit/narration.test.mjs tests/unit/carousel.test.mjs tests/unit/prize.test.mjs tests/unit/ticket-story.test.mjs tests/unit/playback.test.mjs tests/unit/ending.test.mjs tests/unit/guidance.test.mjs tests/unit/activity-restart.test.mjs
node tests/browser/check-tickets.mjs
```

The focused Chromium runner passes three actual touch/keyboard UI routes with accelerated shared active time, no diagnostic state setters and no unexpected HTTP/JavaScript errors:

| Route | Verified result |
| --- | --- |
| Carousel → prize | Earn while a paid melody is unfinished; exactly two initial payments; repeated failed-round pickup at zero balance at four sizes; both milestones and token; earn/pay/replay each attraction; unchanged one souvenir; deliberate claim, paused ending, final silence and fresh Revisit. Four tickets issued/spent across initial plays and both successful replays. |
| Prize → carousel | Stack two tickets; prize story finishes with no premature token; completing the carousel last shows the token at the original prize-stall coordinates; zero balance cannot start further replays; keyboard claim and reduced-motion ending pass. Two tickets issued/spent. |
| Carousel → paid carousel replay + prize | A replay input just after completion pays for a new turn; two unfinished paid activities retain their state when switching; Credits preserves both; a failed prize round retries free; completion produces one token. Three tickets issued/spent. |

Credits retains exact visit/model state at free inspection, paid melody, carousel story, bag flight, failed rounds, waiting token, prize-first story and two simultaneously unfinished activities. Pause preserves payment and timing during zero-balance melody, failure and ending. A page interruption leaves the site paused until explicit Play, with funds intact. Invalid/blocked/rapid inputs and wrong notes cause no extra payment. Full stories must finish before milestones or tickets are awarded.

The badge and returned-bag touch target work at 280×568, 320×568, 390×844 and 844×390 without horizontal overflow. Stacked-balance and both-order token captures were visually inspected at phone size. Evidence: `tests/results/ticket-system/checks.json` and adjacent PNGs. Earlier browser runners retain their historical single-ticket/sequential contracts; `check-tickets.mjs` is the current acceptance runner. Relevant model tests were updated where global souvenir ownership replaced prize-local ownership.

All `assets/` and `dev/previews/` bytes match baseline 498e831. The preserved Phase 1 ZIP SHA-256 remains `4c3d9bc0f40726dc2de73d8e2fbe9afe802a8dc8418f2d7b3f850edfdd1a6aa3`. Local preview responds HTTP 200; no publishing or repackaging.

Limits: desktop Chromium touch emulation, not new physical-phone/peer approval. The interpretation that failed attempts remain within a paid activity is documented above for Developer review. Stop here; no deployment or further feature work.
