# Phase 2 evidence index

Prepared 2026-10-26 for review; application baseline `614e44b`. This directory is intended to be tracked so the eventual GitHub source ZIP includes selected evidence. Fresh `tests/results/` output remains ignored. Current documents/evidence are uncommitted pending Developer review; no final archive or publication is implied.

## Current observed checks

- [Full unit output](current/unit-tests.txt): `node --test tests/unit/*.test.mjs`, 61 pass / 0 fail, exit 0, observed 2026-10-26. Some retained internal restart-method tests cover model behavior; they do not imply a permanent restart toolbar still exists.
- [Current ticket-flow report](current/checks.json): fresh `node tests/browser/check-tickets.mjs`, exit 0 on 2026-10-26. Three routes exercise both first-completion orders, paid replay/boundary timing, failed-round recovery at zero balance, exact payment, Credits/Pause, reduced motion, one token and fresh Revisit under a Pages prefix. Four touch-emulated layouts; no unexpected HTTP/JavaScript errors.
- Current captures copied byte-for-byte from that run: [carousel-first token](current/carousel-first-token.png), [prize-first/carousel-last token](current/prize-first-carousel-last-token.png), [stacked ticket balance](current/stacked-tickets.png). The carousel-first phone-sized capture was visually inspected during this audit.
- [Original audit-draft attempt record](audit-draft-attempts.json): historical failures, preserved unchanged. Both original failures are resolved in the authorized follow-up; this old record is not its current status.
- [Browser-harness resolution](browser-audit/resolution.json), [observed run output](browser-audit/run-output.txt), [native focus probe](browser-audit/modal-focus-probe.json), [waiting-token capture](browser-audit/chromium-waiting-token.png), [empty-field capture](browser-audit/chromium-empty-field.png): the complete Chromium audit passes. The full command then exits 1 inside Playwright Firefox page creation, before game navigation; WebKit not reached. No aggregate pass or unexported numeric metrics are invented. Corrections are test-only; original game/media/debrief bytes remain intact. Stopped after two full follow-up failures under AGENTS.md; no third retry.
- [Static verification](static-verification.json) and [file manifest](manifest.json): scope/inventory checks, Phase 1 ZIP hash, preserved evidence provenance and SHA-256 hashes. These are local preparation records, not final ZIP acceptance.

## Historical evidence copied without reclassifying it as current

- [Peer-revision report](historical/peer-revision-checks.json), [returned bags capture](historical/returned-bags.png): from `tests/results/peer-revision/`, corresponding to the documented 2026-10-25 peer-revision checkpoint (before flexible tickets). Earlier report has 22 modal contexts. Its old progression is not the final ticket contract.
- [Ending-runtime report](historical/ending-runtime-checks.json), [mid-fade](historical/ending-4s.png), [empty-field hold](historical/empty-field-hold.png): from `tests/results/ending-runtime/`, preserved from the earlier ending/peer-revision checks. Ordered fade/audio/interruptions/failure-path evidence supplements the current complete ticket journeys; it does not constitute a fresh final public-site check.
- Additional history: `archive/reviews/`, `docs/design/*CHECKS.json`, design narratives and the [Git snapshot](../../git/PHASE-2-HISTORY.txt). Do not count historical outputs as newly rerun acceptance tests.

## Limits

These are desktop automation and Developer-reported peer findings. No physical-phone test of the current app, fully unaided peer result, screen-reader-user audit, or current public Phase 2 deployment is established here. Current Chromium now completes all audit stages, including path/failure checks; remaining cross-engine verification stopped at Playwright Firefox page creation. Previous Windows WebKit lacked Web Audio; that is not an iPhone audio result. Final submission still needs supplied-debrief work, outstanding browser verification, release/phone verification and archive extraction testing. [Full requirements audit](../../PHASE-2-AUDIT.md).
