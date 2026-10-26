# Phase 1 submission record

> Preserved historical Phase 1 record. Current final delivery uses [the complete GitHub source ZIP](FINAL-SUBMISSION.md), including the completed debrief and development exports. The original Phase 1 ZIP/sidecars remain unchanged locally; a redundant nested archive is not included in the source ZIP.

Preservation note, 2026-10-19: the existing final ZIP, verification sidecar, staging and extracted projects remain unchanged at revision 4f7ed1b with their original folder structure. The separate chore/project-structure cleanup updates only the active checkout and future export/package paths. The live site was not replaced. The packaging description below uses current tool paths; frozen submission manifests retain their original paths.

Live app: https://alr5342.github.io/midnight-midway/

Repository: https://github.com/alr5342/midnight-midway

## Exact brief deliverables

1. Working ambient prototype with start screen, unified Play/Pause and one complete discoverable audiovisual story: approved and tested. The eight-second ticket story, three ambient systems, wind audio, feedback, progressive hints, lockout/reset/replay and reduced-motion behavior are included.
2. Shareable HTTPS URL verified on an actual smartphone: approved by Alex Rosemann on 2026-10-16, iPhone 17 Pro / iOS 26.5.1 / Safari. See PHONE-VERIFICATION.md for the precise scope of the user-reported evidence.
3. All project files, current documents and Git log: the extracted candidate passed full file/hash checks and runtime verification. The final version includes these current records and a refreshed Git log; its final artifact acceptance is the sidecar verification report with status passed.

## Archive content and verification method

The packager takes every Git-tracked project file plus the current generated docs/git/GIT-LOG.txt, preserving paths in a single midnight-midway-phase1/ folder. It includes all HTML/CSS/JavaScript, artwork/masks and originals, processed/source audio, research/spec/plan/brief/credits, prompts, history backups, tests/tools, screenshots and existing transcripts/ materials. Hidden .nojekyll/.gitignore/.gitattributes files are retained. SUBMISSION-MANIFEST.json records every included source path, byte size, SHA-256, source commit and live URL; its own hash is intentionally outside that self-inventory.

Excluded: .git object/index internals, local credentials/caches, archive/logs/debug.log, staging/extraction directories and recursive submission archives. Git history remains public in the repository and is exported in docs/git/GIT-LOG.txt. No required project file is replaced by an empty placeholder.

brief.md does **not** require session transcript files for Phase 1. The existing transcripts/ folder contains only .gitkeep; it is included. No full transcript is fabricated or silently reconstructed. Development support is preserved through Git log, docs/history/, prompt/source records, test results and screenshots. Peer playtest findings and completed debrief are Phase 2 deliverables, not missing Phase 1 files.

Verification creates the ZIP, extracts it into a separate new folder, compares the complete inventory and every file's SHA-256, then runs the extracted app/tests using that folder as the server root. Final archive path/hash/source commit and observed results are written to a sidecar verification JSON in submissions/; that report remains outside the ZIP to avoid a circular checksum. Intermediate candidate archives are not the final deliverable.

## Current packaging result

Candidate ZIP: 537 entries, all paths/sizes/SHA-256 values matched after extraction into a separate folder. The extracted project passed all 17 unit tests and the Chromium/Firefox audiovisual preflight; WebKit visual/accessibility/failure checks passed with the already-documented missing Web Audio API in that Windows test build. All 18 approved artwork baseline hashes matched. Evidence: ARCHIVE-CANDIDATE-VERIFICATION.json and ../archive/reviews/submission-candidate/checks.json.

The final delivery ZIP is rebuilt with the completed records and current Git log, then independently extracted, inventoried and run again. Its exact filename is in ../SUBMISSION-MANIFEST.json inside the ZIP. The external final verification JSON records its observed final runtime result, file count, source commit, byte size and SHA-256. All three brief deliverables are satisfied when that final report's status is passed; an inventory-only status is not completion. No creative or Phase 2 change was made.
