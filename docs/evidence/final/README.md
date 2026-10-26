# Final submission evidence

Final audit, 2026-10-26. Application baseline `614e44b` remains unchanged. [Submission assessment and ZIP instructions](../../FINAL-SUBMISSION.md).

- [Unit output](unit-tests.txt): all 61 tests passed in this audit.
- [Ticket journeys](ticket-system.json): current three routes, both orders, exact stack/spend/retry/replay behavior, Pause/Credits, interruptions, reduced-motion ending and fresh Revisit passed; no unexpected errors.
- [Chromium audit](chromium-audit.json): complete keyboard journey, initial/live reduced motion, focus, sampled contrast, visible targets in standing/waiting states at five sizes, case-sensitive prefix requests and missing-asset gates passed.
- [WebKit audit](webkit-audit.json): visual/keyboard/layout/reduced-motion journey passed; installed Windows build has no Web Audio API, so no audio pass is claimed.
- [Test inventory](test-inventory.json): all 92 tracked JavaScript files pass syntax checks; current acceptance runners distinguished from preserved historical checkpoint contracts.
- [Reference/debrief checks](reference-checks.json): concrete active source/preview paths resolve; completed transcript read in full, speaker counts match its metadata, closing/save and all-critical-concepts statement present.
- [Fresh public check](public-checks.json): real-time touch journey and all 53 fetched resources/11 WAVs match the published baseline. Normal URL/reload, recovery, Credits/Pause, ending and Revisit pass with no unexpected errors. Generic raw runner limits describe its automation scope; the separately reviewed debrief now supplies the final phone report.
- [Browser/source limitations](browser-limitations.json): exact Firefox page-creation error, WebKit audio-API limit, and final source-page availability, without classifying these as successful tests.
- [Original supplied-material hashes](source-materials.json): protocol, debrief and both development exports, plus the preserved local Phase 1 ZIP. Archive reports are added only after actual download/extraction; absence is not an implied pass.

Firefox recheck returned `browser.newPage: Cannot read properties of undefined (reading '_page')` before navigation, exit 1. It is an installed engine/tooling failure; Firefox gameplay was not exercised. No whole-suite/all-browser pass is claimed. Historical runner scripts are not current acceptance tests merely because their files still exist.

Developer's final Safari phone account and completed debrief are recorded separately; this evidence does not invent unperformed iOS reduced-motion/stamp-beat tests. Source transcripts/protocol and Phase 1 archive hashes are preserved, with byte equality checked again in the downloaded archive.
