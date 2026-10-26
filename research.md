# Midnight Midway — research and consequential decisions

> **Finalization decision, 2026-10-26:** the supplied debrief protocol stays unchanged; its completed 46-minute-5-second transcript is the deliverable. That transcript supplies the previously missing finished-version Safari phone account. Two original development exports were confirmed by the Developer as all intended conversation materials. Track these exact bytes and the readable Git log so GitHub's source ZIP includes them; verify the actual downloaded/extracted archive. [Final evidence/limits](docs/FINAL-SUBMISSION.md). Earlier deferred-debrief statements below describe the preceding publication checkpoint.

Updated 2026-10-26 for Phase 2 audit. Current app baseline `614e44b`. [Current specification](spec.md) defines behavior; [audit](docs/PHASE-2-AUDIT.md) separates evidence from unresolved requirements. The Developer retains creative control and approves consequential choices before implementation.

## Visual approach

The Developer selected Midnight Midway from three concepts and supplied a ChatGPT-generated reference, confirmed 2026-10-16. The illustration governs composition, texture and lighting: a stationary Ferris wheel, booth, carousel and prize stall in blue-violet shadows and amber light. Selective extraction preserves original pixels, foreground plants/fog/pumpkin conceal joins, and repaired hidden surfaces support limited movement. Local gondola correction matched the other open carriages without moving the wheel. [Asset and review records](docs/artwork/ARTWORK.md), [carriage correction](docs/artwork/GONDOLA.md).

Complex ride rotation was rejected by the Developer in favor of stylized effects. Original horse pixels were exported as transparent layers over the horse-free plate with fixed poles/railing in front. The recorded static carousel comparison changed 315/71,400 crop pixels (0.44%; mean absolute channel error 0.0059/255); this is a local comparison, not a claim of identical full scenes. The Developer approved the reconstructed carousel and stronger staggered lift/quiet tune. [Journey experiments](docs/design/JOURNEY.md).

The ending originally read as screen darkening. Developer review changed it to attraction-specific opacity masks over an empty moonlit field; the Ferris wheel disappears last, while land and brass token remain. The original ten-second staging was subsequently shortened to eight seconds plus a two-second quiet hold. Approved token, field repair and masks are reused; Revisit deliberately starts fresh rather than immediately restoring the park. [Ending implementation](docs/design/ENDING-IMPLEMENTATION.md).

## Interaction and state decisions

Phone reliability takes priority over elaborate physics. Cans use a deterministic support graph: either lower can carries the top down, with the remaining lower can taking the second bag. This authored rule was explicitly approved. Can flight/fall cues, hit regions and brief input locks derive from active time. Failed attempts return bags to compartments for natural pickup; no permanent restart/Retry toolbar remains. [Prize game](docs/design/PRIZE-GAME.md), [peer revisions](docs/design/PEER-REVISION.md).

Carousel inputs moved from a panel to the actual horses after playtesting. Their distinct C5/E-flat5/G5 tones use original additive synthesis rather than the booth bell. Four notes on a weathered ground scrap imply the sequence left → right → center → left; no visible position labels or answer sentence. The paper is present from entry and only unlocks after admission. Exact notes are code-rendered over painted blank paper, avoiding unreliable generated text.

One `Playback` clock supplies all animation ages, feedback, hints, retries, story/audio offsets and ending fades. Scene stories lock competing input. Credits temporarily owns a pause and restores the previous mode and exact models; actual tab/audio interruptions require explicit Play. A reproduced AudioContext suspension/resume race was fixed centrally rather than by resetting activities. Read-only diagnostics expose state only on `?diagnostics`; tests drive actual controls, not state setters.

Narration once had competing writers and stale completed-activity messages. One app-owned selector now chooses the warning/story/inspection/active-activity/objective owner. The lingering bell ring was retained keyboard focus, not an unfinished guidance pulse; focus moves to Play when scene input locks while legitimate keyboard-return outlines remain. [Narration record](docs/design/NARRATION-REVISION.md).

The final ticket policy supersedes the earlier fixed booth → carousel → stall path. A small visit ledger owns issued/spent tickets, paid activities and full-story completion counters. Payment happens only after accepted input; wrong notes, failed-round retries and paused/modal time do not debit. Settling completion counters before the next action closes a boundary replay loophole. Both attractions can be chosen/replayed independently; the global token is awarded once only after both full stories finish, including carousel-last. [Ticket-system acceptance](docs/design/TICKET-SYSTEM.md).

## Peer evidence and its limits

The Developer now confirms two smartphone peer rounds: 2026-10-19 after Phase 1 needed substantial guidance; the later, more complete experience needed minimal guidance. The second-round summarized feedback motivated natural bag retry, removal of permanent restart controls, clearer pause icon, faster ending and Credits recovery. Counts, precise devices, second session date and raw first-session notes are not established. Both sessions involved some guidance, so neither should be represented as a wholly unaided pass. Automated tests establish technical behavior, not independent peer satisfaction or promotional effectiveness. [Peer record](docs/PLAYTEST-NOTES.md).

## Sources and usage terms

Creator item pages and CC0 deed were rechecked 2026-10-26. Preserved originals, derivative metadata, exact image prompts and reproducible preparation sources are listed in [CREDITS.md](CREDITS.md).

| External recording | Primary source / terms | Use |
| --- | --- | --- |
| remaxim, Short wind sound | [Creator page](https://opengameart.org/content/short-wind-sound), CC0 | Filtered/crossfaded looping ambience. |
| Julie Damsgaard / Spring Spring / Spring Enterprises, Pleasing Bell Sound Effect | [Creator page](https://opengameart.org/content/pleasing-bell-sound-effect), CC0 | Three pitched ring cues. |
| JaggedStone, Magic Spell SFX | [Creator page](https://opengameart.org/content/magic-spell-sfx), CC0 | Arrival/stamp/departure derivatives reused in stories. |

[CC0 1.0 deed](https://creativecommons.org/publicdomain/zero/1.0/) permits copying/adaptation/distribution without copyright attribution conditions; creator recognition is retained and no endorsement is implied. Generated images are identified by tool and user-confirmed origin, not assigned an invented CC0 license. Carousel tones/tune and prize throw/tin/chime are original deterministic synthesis. No external runtime code or font is bundled. Playwright is development-only and separately installed.

## Final audit interpretation

Keep historical evidence distinct from current acceptance tests: older browser runners encode sequential admission and the removed controls. Current unit suite, `check-tickets.mjs` and `check-phase2-audit.mjs` verify the final contract. Source-ZIP delivery needs tracked evidence/history because `tests/results/` and `GIT-LOG.txt` are ignored. The older Phase 1 packager and phone approval do not establish a finished Phase 2 submission. The supplied debrief is intentionally deferred to the next checkpoint, not invented from an assumed template.

[Pre-finalization research](docs/history/20261026-finalization/research.md) preserves earlier decisions and source detail verbatim. No runtime or creative change was made during this audit.
