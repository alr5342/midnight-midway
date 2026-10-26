# Midnight Midway — development and release plan

## Final submission checkpoint, 2026-10-26

Observed result: actual GitHub ZIP of `c42d381` passes all 672-file inventory/blob/original-material checks; the full Chromium audit run from its separate extraction passes. The final follow-up records that evidence and refreshes the history export, then rechecks the final remote source snapshot. See [results and accepted coverage limits](docs/FINAL-SUBMISSION.md).

Completed debrief and final Safari phone evidence are reviewed. The two intended development exports are preserved unchanged and included; current tests/reference checks pass with explicit Firefox/WebKit limits. Refresh the tracked Git log, commit/push the approved materials, verify the actual downloaded GitHub ZIP against the committed inventory, and exercise the extracted game. Record the actual archive result in [FINAL-SUBMISSION.md](docs/FINAL-SUBMISSION.md). No gameplay/artwork changes or extra features. The publication-stage plan below is retained as history; its phone/debrief deferrals are superseded by this checkpoint.

Updated 2026-10-26. Approved runtime `614e44b` is merged into `main` and published; full public verification passed at merge `f46add2`. [Deployment evidence](docs/PHASE-2-DEPLOYMENT.md). The Developer accepted existing testing/known browser coverage limits and authorized publication, without another extensive audit. No creative changes, debrief work or packaging in the publication checkpoint. Stop for review before remaining submission work.

## Completed development

| Checkpoint | Result / evidence |
| --- | --- |
| Approved static composition and selective layering | Original reference, refined booth/foreground, corrected gondola and original horse extraction; [artwork records](docs/artwork/ARTWORK.md). |
| Phase 1 start/playback/ambience/story | Start screen, shared pause clock, wheel/gondola lighting, fog, bats, licensed wind and complete eight-second booth story; [Phase 1 audit](docs/PHASE-1-AUDIT.md). |
| Phase 1 publication and submission | GitHub Pages, Developer phone approval and verified ZIP; [submission record](docs/SUBMISSION.md). Preserve unchanged. |
| Phase 1 peer test and revised direction | First smartphone peer round 2026-10-19 needed substantial guidance. Developer selected a connected visit and practical layered effects; [peer notes](docs/PLAYTEST-NOTES.md). |
| Organization and visual staging | Consolidated preview workspace/styles; preserved assets/history; approved token and field-preserving wheel-last ending. |
| Carousel puzzle and story | Four-note horse puzzle, environmental music clue, wrong-input recovery, eight-second ride and quiet completed-state tune. |
| Prize game and ending | Integrated two-bag/three-can support puzzle, recoverable attempts, eight-second haunted payoff, deliberate claim and empty-field ending. |
| Second peer test and reliability revisions | Smartphone round needed minimal guidance; environmental bag pickup, unobtrusive guidance, clearer pause icon, faster ending and exact Credits recovery. |
| Narration and flexible ticket system | One narration owner; repeatable booth, stackable tickets, either-order paid attractions, free failed-attempt retries, one souvenir after both full stories; [acceptance record](docs/design/TICKET-SYSTEM.md). |

Earlier P1.1–P1.8 plans and later checkpoint entries are retained in the [pre-finalization plan](docs/history/20261026-finalization/plan.md), not overwritten with retroactive tests or approvals. Commit history and design records supply detailed development evidence.

## Remaining reviewable checkpoints

1. **Audit/evidence and publication — completed for review.** Current documents, peer notes, history and selected evidence are committed; development history is merged into `main` and pushed to the existing repository. Pages built the verified merge. A focused real-time public touch journey and 53-file byte comparison passed, including 11 WAVs. Original harness failures are resolved in Chromium; Firefox/Playwright startup and WebKit coverage limits remain recorded. No runtime change. Stop for Developer publication review.
2. **Supplied debrief checkpoint.** Work with the actual uploaded template after the audit is reviewed. Answer its questions using documented evolution, peer findings, tests and limitations; Developer reviews the completed answers. No draft or edits in the current checkpoint.
3. **Release approval and publication — completed.** Existing `alr5342/midnight-midway`, `main` / `/(root)`, no force push/history rewrite or replacement repository. Both orders/paid replays have local evidence; focused public prize-first completion, free failed-round recovery, Credits/Pause, claim/disappearance/Revisit and deployed resources passed. A future code fix would require a new scoped check/deployment; do not claim old verification covers changed runtime.
4. **Finished-app phone verification.** On the published Phase 2 revision, record model, OS, browser and observations for Enter/audio, touch controls, clue, both attraction orders/replays, failed-round pickup, Credits mid-interaction, Pause/tab interruption, reduced motion, token claim/field reveal/Revisit, readability/orientation. Distinguish new observations from the Phase 1 phone record. Fix and retest any actual blocker before proceeding.
5. **Final repository ZIP.** Refresh sources/credits/docs/evidence/debrief and full Git log for the release revision. GitHub's source ZIP omits `.git` and ignored files: make sure the required history export and selected testing evidence are tracked, or explicitly include them in the agreed submission artifact. Existing Phase 1 packager is historical and must not be treated as a Phase 2 acceptance tool. Exclude credentials, caches, debug logs and recursive ZIPs. Preserve the Phase 1 ZIP separately. With packaging authorization, extract the final artifact into a new temporary folder, compare inventory/hashes and run the extracted app under the Pages prefix through a complete journey. Record filename, hash, revision and results; stop on missing or unverified requirements.

Completion requires all three Phase 2 deliverables: peer/revision/final-test evidence; finished app meeting the brief including public HTTPS and actual-phone verification; all project files, updated documents, sources/credits, Git log and completed supplied debrief. Local automation alone cannot close those gates.
