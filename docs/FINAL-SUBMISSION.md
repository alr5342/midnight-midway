# Project 4 final submission audit

Updated 2026-10-26. Authority: [brief](../brief.md), supplied [debrief protocol](../debrief.md), current specification, preserved development evidence and completed debrief transcript. Runtime/artwork remain unchanged from approved `614e44b`; the finalization changes only submission metadata, documentation and evidence.

Repository: https://github.com/alr5342/midnight-midway

Finished app: https://alr5342.github.io/midnight-midway/

## Requirements assessment

| Requirement | Evidence / result |
| --- | --- |
| Phase 1 ambient prototype, start, Play/Pause and one complete story | Approved prototype, public deployment and actual-phone review preserved in [Phase 1 audit](PHASE-1-AUDIT.md), [phone record](PHONE-VERIFICATION.md) and [original submission record](SUBMISSION.md). Original final ZIP SHA-256 remains `4c3d9bc0f40726dc2de73d8e2fbe9afe802a8dc8418f2d7b3f850edfdd1a6aa3`. |
| Phase 1 project files/documents/Git log | Original archive and verification sidecars remain intact locally. Git history and historical source/review records remain preserved. The final source ZIP contains the finished source, history export and historical evidence, rather than a redundant nested Phase 1 ZIP. |
| One cohesive vertical scene, focal point and ≥3 environmental features | Approved illustrated wheel/booth/carousel/prize composition; tested phone layouts without scene scrolling. |
| ≥3 ambient effects and looping background sound | Wheel/gondola lighting, fog, bats and wind; quiet activated-carousel tune; shared pause/reduced-motion behavior. |
| Three 5–10-second discoverable audiovisual stories, replayable without reload | Three eight-active-second booth/carousel/prize stories. Repeat booth for stackable tickets; either paid attraction can be completed/replayed; wrong notes and failed-round retries do not spend extra tickets. One token after both stories, deliberate claim, wheel-last disappearance and fresh Revisit. |
| Distinct triggers, feedback, progress, progressive hints and story input lock | Current models/UI journeys verify bell rings, distinct horse notes, can support/falls, hint ownership and blocking competing input. Carousel uses audible/transient visual feedback, mistake/reset feedback and story launch rather than a persistent prefix counter; the brief does not specify a counter. That interpretation remains explicit, not a newly added UI. |
| Start/Enter, all-system Play/Pause, touch/keyboard, reduced motion, contrast and targets | All current unit/ticket checks and full Chromium audit pass; WebKit visual/keyboard/layout/reduced-motion path passes. Sampled text contrast ≥4.5:1 and target bounds ≥44px at five sizes. No claim of a complete screen-reader-user audit. |
| Suitable tone, approved artwork and permitted/credited sources | Developer-approved ages-10+ eerie/playful illustrated scene, no gore/realistic violence/branding. [Credits](../CREDITS.md) preserve Developer, ChatGPT/image-generation provenance, original code/synthesis, original downloads and CC0 sound terms/links. Wind/bell creator pages remain available; the final magic-page re-fetch timed out, with earlier source/license verification retained. |
| Public HTTPS and finished-app physical-phone verification | Public Chromium journey/resource checks plus explicit final-version Safari phone account in the debrief. [Finished-phone record](PHASE-2-PHONE-VERIFICATION.md) separates reported observations from unperformed device checks. |
| Peer testing, sustained revision and final evidence | Two smartphone peer rounds, meaningful staged commits, design/source records and current evidence. Debrief supplies the observed bell-discovery failure, peer suggestion and later phone retest. Assistance followed discovery difficulty; no wholly unaided successful completion or invented counts/metrics are claimed. |
| Updated documents, source assets, code, credits and Git log | Current docs, asset originals/prompts/preparation tools, tests and tracked `docs/git/PHASE-2-HISTORY.txt`; GitHub retains full revision history. Generated `GIT-LOG.txt` is ignored, so the tracked history snapshot is the ZIP's required log. |
| Completed debrief | Supplied protocol remains unchanged; completed [46-minute-5-second transcript](../transcripts/debrief-2026-10-26_140247.md) contains 23 Developer/23 Agent messages, all ten critical concepts, recap and save direction. A debrief transcript is this protocol's deliverable; do not fill answers into or rewrite the protocol. |
| Conversation materials | Developer confirmed the two original exports in `docs/transcripts/` plus the debrief are all intended materials. All are preserved byte-for-byte. Existing source truncation markers remain part of the original exports; missing tool output has not been reconstructed. |

**Assessment:** required functional deliverables and supplied submission materials are present. This is a qualified verification, not a universal-browser or completely unaided-peer-testing claim. The limitations below are retained for honest submission.

## Current verification and limitations

- **61/61 unit tests**, **92 JavaScript syntax checks**, current three-route ticket integration, complete Chromium keyboard/accessibility/path/failure audit, and WebKit visual/keyboard/reduced-motion journey pass. [Evidence index](evidence/final/README.md).
- Static scan: 107 concrete references across 21 active app/preview files resolve; 14 dynamic references are exercised through browser requests. Current documentation links and required archive paths are checked separately.
- Firefox's installed Playwright engine fails at page creation before game navigation. Windows WebKit has no Web Audio API, so its audio is not passed. Actual Safari phone/audio observations are separately user-reported.
- Historical checkpoint runners encode removed controls, sequential admission, earlier asset arrangements or required old fixtures. They are inventoried as superseded, not relabelled as successful current tests or rewritten to weaken assertions. Consequently this report does **not** say every historical test script passes against the redesigned app.
- Peer sessions needed guidance. The debrief describes an initial discovery attempt relying only on in-app narration before help; a wholly unaided successful full session is not established. This is a process limitation, not evidence to invent retroactively.
- Device-specific reduced motion and pausing exactly at the stamp/sound beat were not personally executed by the Developer. Automated checks cover their models/shared timing; do not substitute hypothetical reasoning for those phone checks.
- Source transcripts are about 34 MB and 97 MB, below GitHub's 100 MiB per-file limit. They remain ordinary Git blobs, not LFS pointers. Original transcript/protocol bytes are protected by `.gitattributes`.

## GitHub ZIP contents and verification

The source archive must contain root `index.html`, `.nojekyll`, `brief.md`, `research.md`, `spec.md`, `plan.md`, `CREDITS.md`, supplied `debrief.md`; `src/`, `assets/` including originals, `dev/previews/`, tests/tools, current/historical documentation, both development exports, the completed debrief transcript and tracked Git log. It must not substitute pointers for the large transcripts.

Local `debug.log`, credentials/caches, fresh `tests/results/`, `.git` internals and the separate existing Phase 1 ZIP are intentionally excluded. Historical reviews/source snapshots are intentional evidence, not disposable temporary files. No important local files are deleted.

Archive verification is performed on the **actual GitHub download** after committing/pushing: require one top-level directory, compare its complete inventory and file hashes with the committed tree, verify the original transcript/protocol bytes, reject caches/secrets/nested delivery archives, extract to a new temporary folder and exercise the extracted game under `/midnight-midway/`. The observed archive result is added to the handoff; no ZIP completion is inferred merely from a push.

A GitHub source ZIP contains a source snapshot, not the `.git` object database. The tracked readable Git log supplies the assignment's log; full history remains on GitHub. A log cannot contain its own containing commit hash, so its documented through-revision is explicit and the generated local export is refreshed afterward.

## Download for submission

1. Open https://github.com/alr5342/midnight-midway and select **main**.
2. Select the green **Code** button, then **Download ZIP**.
3. Submit that complete downloaded ZIP. Do not select just individual files or substitute a Pages save-page export.
4. Optional inspection: extract it and confirm the root `debrief.md`, completed `transcripts/debrief-2026-10-26_140247.md`, both `docs/transcripts/` exports and `docs/git/PHASE-2-HISTORY.txt` are present.

Direct branch archive: https://github.com/alr5342/midnight-midway/archive/refs/heads/main.zip

GitHub instructions: [Downloading source code archives](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives), [file size limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github). Final source/archive verification uses the actual pushed revision, not a guessed URL result.
