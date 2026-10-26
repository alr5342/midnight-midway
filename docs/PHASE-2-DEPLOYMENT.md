# Phase 2 publication — 2026-10-26

The Developer explicitly approved committing the remaining reviewed work, preserving and merging development history into `main`, and updating the existing `alr5342/midnight-midway` GitHub Pages site. This supersedes the prior hold on publication; it does not authorize new creative features, debrief edits or ZIP packaging.

Repository: https://github.com/alr5342/midnight-midway

Public HTTPS URL: https://alr5342.github.io/midnight-midway/

## Candidate and preparation

- Approved application baseline: `614e44beffa18869d09983d3fa406c0be6655e76`. Pending reviewed changes are documentation, evidence and browser harness work; runtime/artwork remain identical to this baseline.
- Authenticated account verified as `alr5342`, with repository push/admin permission. Existing Pages source verified as `main` / `/(root)`, HTTPS enforced. No replacement repository or account.
- The uploaded `debrief.md` remains unmodified and excluded from this release commit because its contents have not yet been reviewed/completed. It will be addressed separately, as requested.
- Prior Phase 1 archive remains local and unchanged: `submissions/midnight-midway-phase1-20261016184044-final.zip`, SHA-256 `4c3d9bc0f40726dc2de73d8e2fbe9afe802a8dc8418f2d7b3f850edfdd1a6aa3`. Historical Phase 1 deployment/phone/archive records remain separate.
- Focused public verification: `node tests/browser/check-phase2-live.mjs`. Real-time Chromium touch journey exercises two booth awards/stacking, paid failed-round recovery, prize story, clue and carousel, Credits/Pause, one token when carousel finishes last, deliberate claim, disappearance, Revisit and normal public reload. All fetched runtime resources are compared with local bytes; no extensive new browser audit.

## Deployment and verification — passed

- Approved review/evidence commit: `3f9c165`. Development was merged into `main` with a normal two-parent merge, preserving the prior `4f7ed1b` Phase 1 main and all development commits. No force push or rewritten history.
- First Phase 2 deployment and full public-journey verification: **`f46add2972288c72f82590dfa8ed46f1ef5fdf7e`**. [Merge commit](https://github.com/alr5342/midnight-midway/commit/f46add2972288c72f82590dfa8ed46f1ef5fdf7e).
- Authenticated Pages metadata confirmed built status for that exact commit, source `main` / `/(root)`, no build error. [Preserved Pages result](evidence/phase2/publication/pages-build.json). A subsequent documentation/evidence commit records this result; its runtime remains identical to the verified merge.
- `node tests/browser/check-phase2-live.mjs` exited **0**, 2026-10-26. This was a real-active-time Chromium touch journey at 390×844 on the public HTTPS URL. [Full public verification report](evidence/phase2/publication/checks.json).
- **53 runtime resources match local bytes**, including HTML, JavaScript, CSS, approved artwork/masks/props and all **11 WAVs**. Text line endings are normalized for comparison; binary artwork/audio are byte-exact. No unexpected HTTP or JavaScript errors.

Observed public behavior: Enter gates audio; wind and ten story/musical cues decode; repeating the booth story stacks two tickets; a failed can round recovers through bag pickup without another charge; the support-can win completes its haunted story; the sheet clue and four-note carousel work; Credits preserves a partial melody and payment; carousel-last awards one token at the stall; claim triggers the approved disappearance; Play/Pause freezes/resumes it; the empty field/token, wheel-last fade, final silence and Revisit work. Normal public URL/reload exposes no diagnostics.

Phone-sized evidence: [start](evidence/phase2/publication/start-phone.png), [waiting token](evidence/phase2/publication/waiting-token-phone.png), [empty field](evidence/phase2/publication/empty-field-phone.png). These are desktop Chromium captures, not an actual-phone review. The focused public journey used prize-first order; both orders and paid replays were already covered locally, and no new broad audit was run.

The tracked history snapshot is refreshed through the verified merge; the generated ignored `docs/git/GIT-LOG.txt` is refreshed after the final evidence commit. A log cannot contain the hash of its own containing commit; final submission history will be refreshed again in the packaging checkpoint.

## Known limitations and next gate

The complete local Chromium audit passed. Firefox previously failed inside Playwright while creating a page before loading the game; WebKit was not reached. These remain documented test-environment/coverage limitations, not inferred game failures. No fresh Safari/iPhone pass is claimed. Public Chromium verification is not a physical-phone test or subjective audio-balance review.

After publication review, verify the final public app on a physical smartphone, complete the supplied debrief in its separate checkpoint, then prepare and extraction-test the final repository ZIP. Earlier Phase 1 phone approval does not close the Phase 2 phone gate. No ZIP is created during publication.
