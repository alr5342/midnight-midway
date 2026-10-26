# Peer-playtesting record

Updated 2026-10-26 from the Developer's direct confirmation and the previously recorded feedback. These are summarized reports, not fabricated quotations or participant-level measurements. Automated tests are separate evidence.

| Round | Date / version | What is established | What remains unknown |
| --- | --- | --- | --- |
| Initial Phase 1 prototype | **2026-10-19**, per Developer confirmation. Exact session time/revision not supplied. | Peers used smartphones and needed **a lot of guidance**. This exposed a discoverability/usability limitation in the one-story prototype. | Participant count, phone/browser models, raw observations and individual outcomes. No specific earlier general edit can be attributed to a peer without confirmation. |
| More complete experience | Occurred before the Developer's second-round feedback request recorded in `docs/design/PEER-REVISION.md` on 2026-10-25; actual session date not confirmed. Exact tested revision not supplied. | Peers used smartphones and needed **minimal guidance**, as confirmed 2026-10-26. The following summarized feedback was supplied by the Developer after peer playtesting and personal review. | Participant count, models/browsers, raw report and exact assistance given. Minimal guidance is not the same as a wholly unaided test. |

The brief asks peers to explore without explanation/assistance. The reported first session did not achieve that condition; the second needed less help but is not documented as fully unaided. Report this limitation honestly. The supplied reports suggest improved discoverability, but they do not establish quantitative improvement or that all latest revisions were retested by peers.

## Second-round findings, resulting revisions and evidence

| Reported observation | Consequential change | Technical evidence / limits |
| --- | --- | --- |
| Permanent Restart Activity/Visit controls interrupted the seamless scene. | Removed gameplay toolbar; active-time environmental hints/glows grow gradually without giving solutions. | Guidance model tests and [peer revision](design/PEER-REVISION.md); later ticket-flow checks retain current controls. |
| Retry should feel part of the game; failed rounds must recover. | Bags return to counter compartments; tap either to reset that round. Earlier progress/payment remains intact. | Repeated failed-round touch pickup at four sizes; current ticket runner verifies free retries at zero balance. |
| Pause looked like Roman numeral II. | Replaced font glyph with drawn pause bars and retained accessible labels. | Recorded visual review and current SVG source. |
| Disappearance felt too slow. | Approved sequence shortened to eight seconds with wheel last, plus two-second quiet hold. | Ending model/browser evidence; current full journey reaches final field/Revisit. |
| Credits could strand an unfinished interaction. | Modal owns a temporary pause; exact prior state resumes unless already paused/interrupted. Fixed AudioContext transition race centrally. | Earlier 22-context regression, real-time Close/Escape probe, plus current ticket-flow modal checks. |

Subsequent Developer review also led to the centralized narration rewrite/bell-focus correction and stackable tickets/either-order paid replay. Those are consequential **Developer-directed revisions**; do not automatically attribute them to the two peer sessions. [Narration record](design/NARRATION-REVISION.md), [ticket system](design/TICKET-SYSTEM.md).

## Evidence provenance and outstanding records

- Developer confirmed both rounds in the 2026-10-25 feedback request, and supplied the first date/smartphone/guidance details in the 2026-10-26 reply.
- Existing `docs/design/PEER-REVISION.md` and this file are the available summarized second-round records. The Developer mentioned a recent upload; the workspace search found no separate identifiable raw peer-results attachment. If that report exists elsewhere, link/preserve it before submission rather than imply it was inspected.
- Phase 1's separate Developer-approved iPhone review is recorded in [PHONE-VERIFICATION.md](PHONE-VERIFICATION.md); it is not substituted for peer testing or a finished Phase 2 phone pass.
- Selected technical outputs are preserved in [Phase 2 evidence](evidence/phase2/README.md). These validate behavior, not peer comprehension or the Client's promotional impact.
- `debrief.md` has now been supplied. Its contents are deliberately untouched and unreviewed in this checkpoint, following the Developer's instruction to handle it afterward.
