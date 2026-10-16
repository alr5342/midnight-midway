# Implementation Plan

## Active checkpoint — 2026-10-16

User authorized a local static phone composition and one ticket-booth extraction test. No animations, audio or story interactions in this checkpoint.

- [x] Preserve original reference and create buildless local preview (`node serve.mjs`).
- [x] Prepare transparent booth and repaired-background candidates; provide original, reassembled, isolated, plate and displaced inspection views.
- [x] Run browser verification and save screenshots in `artwork-review/`; results and artwork limitations in `assets/REVIEW.md`.
- [ ] Developer reviews composition and extraction fidelity before further artwork preparation.

Main risk: generated extraction changes original artwork and needs foreground overlap/edge cleanup. Passing browser checks does not establish artwork approval.

### Ticket booth foreground refinement

Developer accepted the overall reconstruction and requested a focused base/foreground fix. Restored the original left foreground as a masked layer above the existing booth without changing its asset or transform. Six review modes and a side-by-side comparison are available; browser checks and visual screenshot review completed. Updated evidence: `artwork-review/booth-refinement-v2/`, findings: `assets/REVIEW.md`. Developer review remains pending before any other attraction work.

### Full static artwork checkpoint

Developer explicitly approved the ticket booth refinement and authorized carousel/prize preparation plus static Play/Pause and hint placement. Booth review is complete; the broader artwork checkpoint is pending review.

- [x] Prepare three independent original-pixel horse layers, a ghost/cat prize pair, localized repaired backing and fixed foreground trim.
- [x] Add nonfunctional interface placement mockups and artwork-only / isolated / statically lifted inspection views.
- [x] Run browser checks and inspect screenshots at phone sizes; evidence in `artwork-review/attractions-v3-final/`.
- [ ] Developer reviews full scene, interface placement and extraction quality before animation or story interaction work.

Artwork structure and current limits: `assets/ARTWORK.md`. Main constraint: small bobbing/lift motions; overlapping prizes stay a pair. No animations, audio or scene interactions added.

### Focused right-hand gondola refinement

Developer requested changing only the bright enclosed far-right gondola to match the others with a subtle glow. Added a locally masked edited carriage without replacing the full scene. Browser and visual checks completed; pixel comparison found zero changes outside the carriage inspection area. Before/after review: `carriage-review.html`; details and exact image prompt: `assets/GONDOLA.md`; evidence: `artwork-review/carriage-v4/`. Awaiting developer review before further work.

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Track the next useful build checkpoints, verification, and consequential revisions.

## Working agreement

Developer: Keep the browser preview running, choose priorities, test results directly, and plan only the next few checkpoints.

Agent: Read the project documents and inspect the files. Keep each checkpoint small enough to run and judge. Do not expand scope or mark Developer verification complete.

Start or continue a fresh chat with:

`Read the project documents, inspect the current build, and help me complete the next unchecked checkpoint.`

## Checkpoints

Create your own checklist for the next few results, using the workflow in `brief.md` and the current `spec.md`. Name the main risk, what each checkpoint should produce, and how you will verify it. Review and approve the approach before implementation.

Test each result before continuing, including related behavior that already works. Update priorities as evidence emerges and preserve meaningful working checkpoints in git. Before delivery, verify the deployed app against the brief and specification.

## Evidence and revisions

Record non-identifying playtest observations, separating what Users did or said from your interpretation. Use the findings to choose revision priorities and record what changed and how you verified the improvement.

Keep implementation progress and verification here. Update `research.md` when evidence changes a decision and `spec.md` when intended behavior changes; link to those updates rather than duplicating them. Record consequential changes, not every small adjustment.

## Saving transcripts

When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md` or `transcripts/build-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
