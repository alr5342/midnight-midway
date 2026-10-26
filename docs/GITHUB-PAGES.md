# GitHub Pages — current release handoff

> **Current final submission:** [FINAL-SUBMISSION.md](FINAL-SUBMISSION.md) supersedes the earlier handoff below. Final Safari phone/debrief evidence is now reviewed; the submission is GitHub's **Code → Download ZIP** on **main**, with original transcripts, source assets, current docs and tracked Git log. Current final tests include WebKit visual checks; audio/API and Firefox limits remain documented.

Updated 2026-10-26 for Phase 2 review. Existing repository: [alr5342/midnight-midway](https://github.com/alr5342/midnight-midway). Existing public HTTPS URL: https://alr5342.github.io/midnight-midway/. Pages source is **main / /(root)**. Do not recreate the repository, add another origin or rewrite history.

**Phase 2 published with Developer authorization, 2026-10-26.** Development history was merged into main and pushed normally. Pages built merge `f46add2972288c72f82590dfa8ed46f1ef5fdf7e`, whose public journey and 53 runtime resources/11 WAVs passed focused Chromium verification. Subsequent evidence updates do not change its runtime. [Deployment record](PHASE-2-DEPLOYMENT.md). Prior Phase 1 history/archive remain preserved. Debrief, final-phone review and packaging remain separate; [submission gates](PHASE-2-AUDIT.md).

## Prepared locally

- Root `index.html`, `.nojekyll`, `src/` and `assets/`; static HTML/CSS/JS, no build or runtime service.
- Current Chromium gameplay and complete browser-audit checks use `/midnight-midway/`; filename-case inventory passes. Remaining cross-engine checks stopped at a Playwright Firefox page-creation failure before navigation; WebKit was not reached. Original media/target harness failures are resolved. See the audit before unconditional browser sign-off.
- Source originals, exact image prompts, reproducible sound processing, credits and selected testing evidence remain in the repository. Phase 1 ZIP/sidecars are preserved separately.
- Current history snapshot is `docs/git/PHASE-2-HISTORY.txt`; regenerate for the final release. `docs/git/GIT-LOG.txt` is an ignored local export and will not appear in a plain GitHub source ZIP.

## After Developer approval

1. Complete the supplied debrief and open audit checks. Inspect `git status` and the branch diff; keep any new Developer files, especially the uploaded debrief. Run the secret scan before committing. Preserve all existing commits; do not force-push.
2. Review and merge the approved development history into `main`, commit approved final documents/evidence, then push to the **existing** origin with the correct account. If authentication/permissions fail, stop and ask the Developer to restore access; never publish under another account.
3. Confirm Settings → Pages still uses main / /(root), then wait for a successful Pages deployment. Record its actual revision/result. A successful local test or push alone is not proof of publication.
4. Verify the public HTTPS page/reload, artwork/masks/modules/audio, both attraction orders, precise ticket payments/free retries, story replay, Credits/Pause/interruptions, reduced motion, claim/field reveal/Revisit. Compare deployed resource bytes or normalized source with the approved revision; record unexpected requests/errors and fix blockers before phone review.
5. Test that exact public revision on an actual smartphone. Record model/OS/browser and observed results rather than transferring Phase 1 approval. Cover audio unlock/levels, target reliability, hints/paper, recovery/replay, Credits mid-action, pause/tab/OS interruption, orientation/browser chrome and full ending.
6. Refresh documents and Git history, then obtain packaging approval. The final repository ZIP must contain project code/assets/source originals/credits, current docs, completed supplied debrief, selected evidence and readable Git log. Extract separately and verify inventory/hashes and a complete working journey before claiming submission completion.

The historical Phase 1 publication instructions are preserved [verbatim](history/20261026-finalization/GITHUB-PAGES.md). Their new-repository and old Credits behavior apply to that stage only. [Phase 1 deployment record](DEPLOYMENT.md), [Phase 1 phone record](PHONE-VERIFICATION.md), [Phase 1 archive record](SUBMISSION.md).
