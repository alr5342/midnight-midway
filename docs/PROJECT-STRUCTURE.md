# Project structure and consolidation

Approved organizational cleanup, 2026-10-19, on `chore/project-structure`. Goal: simplify the active project without altering approved visuals, sound, gameplay or creative direction. Acceptance requires preserved media/submission hashes, CSS and core behavior, working previews, browser regressions and Pages subdirectory compatibility. No merge, push or deployment is authorized at this checkpoint.

```text
project-4-template/
├── index.html                      App entry point
├── serve.mjs                       Buildless local server
├── README.md, brief.md              Getting started and assignment
├── research.md, spec.md, plan.md    Current project documents
├── CREDITS.md, AGENTS.md, CLAUDE.md
├── .gitignore, .gitattributes, .nojekyll
├── src/
│   ├── js/                         Nine runtime modules
│   └── css/                        scene.css and app.css
├── assets/
│   ├── artwork/                    Approved scene layers
│   ├── masks/                      Scene-coordinate SVG masks
│   ├── story/                      Props, attendant versions and cue manifest
│   ├── audio/                      Runtime WAVs and processing metrics
│   └── sources/
│       ├── artwork/                Original scene, also used at runtime
│       └── audio/                  Three preserved sound originals
├── dev/previews/                    One HTML workspace, JS and review CSS
├── tests/
│   ├── unit/                       Six suites, 17 tests
│   ├── browser/                    Integration/visual checks
│   ├── helpers/                    Historical path/inventory resolution
│   ├── results/                    Ignored fresh logs and captures
│   └── run-regressions.mjs
├── tools/                          Preparation, inspection, export and packaging
├── docs/
│   ├── artwork/                    Layer notes, prompts and story staging
│   ├── git/                        Generated, ignored GIT-LOG.txt
│   ├── history/                    Immutable snapshots
│   ├── FILE-MAP.json                Old-to-new path index
│   └── ...                         Audit/deployment/submission records
├── archive/
│   ├── reviews/                    Earlier captures/results, unchanged
│   ├── development-source/         Superseded entry points/helpers/styles
│   └── logs/                       Local debug log, preserved/ignored
├── submissions/                    Existing delivery, unchanged/ignored
└── transcripts/                    Existing supporting materials
```

## Consolidated

| Former active files | Active replacement | Reason |
| --- | --- | --- |
| Five preview HTML files | dev/previews/index.html, five query-selected templates | One workspace retains every inspector/comparison and sound audition. |
| styles.css, artwork.css, ticket-story-assets.css | src/css/scene.css | Shared scene/staging declarations retain their original cascade order. |
| credits.js, asset-readiness.js | src/js/app.js | App-only startup/modal helpers live beside their only caller. |
| artwork.js, ticket-story-assets.js | src/js/artwork.js | App and previews share one scene/prop/staging owner. |
| Repeated inline comparison CSS | dev/previews/preview.css | Retains the old two-/three-column gaps and breakpoints. |

The active HTML/JavaScript/CSS count is **23 → 15**: HTML 6 → 2, JavaScript 13 → 10 (nine runtime modules plus preview.js), CSS 4 → 3. Archived originals and tests/tools are outside this count. Former separate entry points/helpers/styles remain in archive/development-source/ and Git history. No important files were deleted.

Playback, lighting, fog, bats, ambient audio, story audio and ticket-story timing remain separate because each owns meaningful behavior with focused tests. App-only CSS stays separate so its controls/effects do not affect inspectors. No bundle or build step was added.

## Relocated

Scene PNGs moved to assets/artwork/, masks to assets/masks/, reference/source sounds to assets/sources/, artwork Markdown to docs/artwork/, and tests to unit/browser folders. Old captures moved intact from artwork-review/ to archive/reviews/. docs/history/, transcripts/ and submissions/ were not rewritten. [FILE-MAP.json](FILE-MAP.json) resolves original paths, including frozen evidence references.

assets/sources/artwork/midnight-midway-concept.png remains a runtime dependency: foreground, horses and prizes still use its original pixels. Do not omit it from hosting or packaging.

All page/module/image/mask/sound paths respect the project subdirectory. JavaScript-generated artwork/audio URLs resolve from import.meta.url so both root app and nested previews work. No leading `/assets` path or hosting-specific base URL was introduced. .nojekyll and root index.html still support main / (root) Pages publishing after a separately approved merge/deployment.

## Preservation and verification

The historical artwork inventory contains 12 media files, five Markdown notes and a placeholder. Notes now have current links; media checks compare every original image/mask hash. The inventory itself is unchanged. A separate organization check verifies all artwork, original/processed sound, snapshots, old review captures and all 2,209 existing submission files against the pre-cleanup inventory, including the relocated placeholder.

The live Phase 1 URL and existing submission retain commit 4f7ed1b and the original structure. They were not repackaged or replaced. The active packager/exporter use docs/git/GIT-LOG.txt for a future authorized package.

The app start capture has zero changed pixels and identical geometry. Preview captures have small subpixel-edge differences after adding workspace navigation; media bytes and the scene CSS cascade are preserved. Fresh captures/logs are in tests/results/organization/; the durable result is [ORGANIZATION-CHECKS.json](ORGANIZATION-CHECKS.json).

Windows WebKit lacks Web Audio in the installed test build; no audio pass is claimed for it. Existing phone approval applies to published Phase 1, not a new phone test of this unmerged branch. Historical strict touch screenshot comparisons remain documented in the Phase 1 audit.
