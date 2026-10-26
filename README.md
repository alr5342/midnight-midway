# The Midnight Midway

A phone-sized illustrated Halloween midway: ring for admission, spend tickets on a musical carousel or a two-beanbag can game, then claim a brass keepsake as the park disappears. Spooky, playful, ages 10+, unbranded. Ferris wheel and carousel stay stationary; layered artwork, lighting, fog, sound and staggered horse movement create the atmosphere.

**Phase 2 published and public-browser verified, 2026-10-26.** Full public journey verified at merge `f46add2`, with runtime unchanged from approved application baseline `614e44b`; later evidence updates change documentation only. [Deployment and verification record](docs/PHASE-2-DEPLOYMENT.md). Final physical-phone verification, supplied debrief and final ZIP remain separate checkpoints. [Requirements audit and remaining gates](docs/PHASE-2-AUDIT.md).

[Play the finished app](https://alr5342.github.io/midnight-midway/) · [GitHub repository](https://github.com/alr5342/midnight-midway). Pages uses the existing `main` / `/(root)` source. The previous phone approval applies only to Phase 1; a new review of this finished public app is still required.

## Run and play

Run `node serve.mjs`, then open http://127.0.0.1:4173/index.html. No dependency installation or build is needed for the app. VS Code Simple Browser can use the same URL. The consolidated artwork/story/ending inspector is at http://127.0.0.1:4173/dev/previews/index.html; it is separate from gameplay. `/?diagnostics` exposes read-only development state.

Complete the eight-second booth story to earn a ticket; repeat to stack more. The first accepted note or throw spends one ticket on that activity. Wrong melodies and failed can rounds are free retries within the paid activity. Pick up returned beanbags to reset a failed round. Successful attraction replays cost new tickets; the booth stays available for more. Complete both attraction stories in either order to reveal one token at the prize stall. Deliberately claim it for the wheel-last disappearance; Revisit/refresh starts a fresh visit.

One Play/Pause control coordinates motion, sound, effects, timers and interaction. Credits freezes exact progress and restores the previous playback mode. Genuine tab/audio interruptions wait for Play. Reduced motion keeps stationary story states and sound without travel/bobbing/pulsing. One bottom narration box provides hints; the music scrap enlarges for inspection without another instructional panel.

## Verification

From the project root:

```powershell
node --test tests/unit/*.test.mjs
node tests/browser/check-tickets.mjs
node tools/check-secrets.mjs
node tools/export-git-log.mjs
```

The 2026-10-26 audit observed **61 unit tests passing** and the current Chromium ticket runner passing both orders, exact payment/retry/replay rules, Credits/Pause, reduced motion, touch layouts and the ending. [Tracked reports/captures and limitations](docs/evidence/phase2/README.md).

Browser tests need a separately installed Playwright package and browsers; the app does not. Set `PLAYWRIGHT_MODULE` to its `index.mjs` if needed. Older browser runners retain historical single-ticket/sequential contracts and are not current acceptance tests. The corrected `check-phase2-audit.mjs` now completes its **Chromium audit**, including initial/live reduced motion, visible-state target measurements, focus/contrast/layout, ending/Revisit, filename case and startup failures. The full command then failed inside Playwright's Firefox page creation before loading the game; WebKit was not reached, so no overall cross-browser pass is claimed. [Follow-up evidence](docs/evidence/phase2/browser-audit/resolution.json). Historical Windows WebKit lacked Web Audio; no Safari/iPhone audio pass is inferred from that environment. Automation is not physical-phone, screen-reader-user or unaided peer verification.

## Project and evidence

- `index.html`, `.nojekyll`, `serve.mjs`: buildless entry, Pages support and local preview.
- `src/js/`, `src/css/`: runtime controllers, shared clock/audio/progression and styles.
- `assets/`: artwork, masks, story props, sound, preserved original recordings/reference and derivative metadata.
- `dev/previews/`: consolidated development inspector and approved staging candidates.
- `tests/`, `tools/`: unit/browser checks and reproducible asset/history preparation.
- `docs/`: current audit, peer notes, sources/design/artwork records, deployment/submission history and tracked evidence.
- `archive/`: older review evidence and superseded entry points; preserved.
- `submissions/`: preserved Phase 1 ZIP and verification sidecars (local/ignored, not nested in a final source ZIP).

[Folder responsibilities](docs/PROJECT-STRUCTURE.md), [historical path map](docs/FILE-MAP.json). Root document copies before finalization are preserved in [docs/history/20261026-finalization/](docs/history/20261026-finalization/); their earlier “current checkpoint” statements are historical.

Two smartphone peer rounds are recorded: 2026-10-19 needed substantial guidance; the later round needed minimal guidance. Findings, revisions, provenance and missing raw records are explicit in [PLAYTEST-NOTES.md](docs/PLAYTEST-NOTES.md). No wholly unaided pass is claimed.

## Release and submission

The approved development history is merged into `main` and published through the existing Pages repository/source. Focused public verification passed: actual journey, Credits/Pause, failed-round recovery, claim/disappearance/Revisit and 53 matching runtime resources including 11 WAVs. Firefox/WebKit coverage limits remain documented; no new extensive audit. Next: review publication, verify the finished app on a physical phone, complete the supplied debrief in its separate checkpoint, then create and extraction-test the final repository ZIP. [Release plan](plan.md), [Pages record](docs/GITHUB-PAGES.md).

`docs/git/PHASE-2-HISTORY.txt` is a tracked history snapshot through the verified publication merge; refresh it for the final submission. `node tools/export-git-log.mjs` creates the full `docs/git/GIT-LOG.txt`, intentionally ignored. GitHub's source ZIP omits ignored files and `.git`; the final repository must contain a tracked history export, selected evidence and the completed supplied debrief. The historical Phase 1 packager is not a final Phase 2 acceptance tool.

Phase 1 public/phone/archive records remain intact: [submission](docs/SUBMISSION.md), [deployment](docs/DEPLOYMENT.md), [phone record](docs/PHONE-VERIFICATION.md). The audit rechecked the original ZIP hash without replacing it.

[Assignment](brief.md) · [research](research.md) · [specification](spec.md) · [plan](plan.md) · [credits](CREDITS.md).
