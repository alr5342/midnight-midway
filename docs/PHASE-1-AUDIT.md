# Phase 1 audit — submission preparation, 2026-10-16

Authority: ../brief.md, especially **Phase 1: Playtest prototype (week 1)**. Developer approved P1.6–P1.8 and authorized final local credits/accessibility/browser/Git preparation. **Stop before publishing or packaging. No Phase 2 work.**

## Exact requirement checklist

| Brief requirement / Phase 1 scope | Current status and evidence |
| --- | --- |
| Browser-based HTML/CSS/JavaScript; expected 2D approach | Pass: buildless layered PNG/SVG app; no backend/framework/external font. |
| One cohesive portrait scene without scene scrolling/page switching | Desktop pass: 390×844, 375×667, 320×568, 844×390 and narrow 280×568 checked. Native Credits modal stays in scene and can scroll internally; app viewport does not scroll. Actual-phone chrome/safe areas remain pending. |
| Strong focal point and at least three distinct environmental features | Approved: stationary Ferris wheel, ticket booth, carousel, prize stall. All 18 baseline artwork hashes unchanged; approved ghost v3 preserved. |
| At least three ambient effects | Pass: wheel/gondola lighting, fog and occasional bats. Shared active time; reduced motion uses steady lights/static fog and no flying bats. |
| Looping ambient background sound | Automated pass; Developer approved prototype: CC0 wind loop, measured signal and seam, no stacked sources, pause/resume offsets. Physical-phone speaker balance/repetition remains a real-device check. |
| Verified public-domain/CC0 ambient and story sounds before use | Pass: existing source/license records for remaxim wind, Julie Damsgaard/Spring Spring bell and JaggedStone magic; original downloads, derivative details and exact URLs in ../CREDITS.md. No new external sound introduced. |
| Start screen; Enter starts scene/audio/animation | Pass: no audio context/effect clock before Enter. P1.9 waits for main image decode and stylesheet/mask fetch success; failure keeps Enter disabled with reload guidance and Credits available. |
| Reduced motion honored before beginning | Pass: initial preference and live changes tested; stationary story/steady sparks retain narrative. |
| One Play/Pause stops/resumes all motion, sound, effects, timers and interaction | Automated pass: one RAF/active clock, stopped cue/ambient sources and suspended shared context. Paused rings/hints/feedback/story retain active offsets; explicit Play after tab/pagehide/audio interruption. Credits opens paused and closes still paused. Real OS/phone interruptions remain pending. |
| One complete discoverable audiovisual story; beginning/middle/end; 5–10 seconds; replay | Pass: eight active seconds; attendant → ticket → magical stamp/sparks → departure/reset. Three real-clock replays without reload; measurable story signal and exact resting overlay reset. Prototype approved by Developer. |
| Scene trigger, unique audiovisual responses and visible progress | Pass: three distinct bell tones with increasing glow and text progress; third ring launches exactly one story. Touch/Enter/Space and extra-click lockout tested. Other attractions remain noninteractive. |
| Progressive text hints over time, without direct instructions | Pass: entry/12/24 active-second hints, no explicit three-tap answer. Partial progress briefly replaces the hint, then timed hints continue; pause freezes hint time. Human discovery on the public phone remains to observe. |
| Disable other scene actions while story plays; clearly return | Pass: only bell is a scene action; locked during story/pause. Completion clears cues/progress/temporary art, announces return and enables replay; Play/Pause remains available. |
| Reliable touch/keyboard, readable text, contrast and appropriately sized controls | Automated/visual checks: natural Play/Pause→bell tab order, named semantic buttons, visible focus, live hints/progress, minimum 44px targets and text contrast ≥4.5:1 in tested panels. Credits has explicit full Tab/Shift-Tab order, Escape/Close, focus return and unchanged pause state. No full screen-reader-user audit claimed. |
| Spooky/playful, ages 10+, no gore/realistic violence/suffering, no specific branding | Approved direction preserved; no new creative assets/features. Developer approved the revised ghost and complete prototype. |
| Credit Developer and external code/visual/audio assets; allowed material | Complete source record/presentation: Alex Rosemann confirmed by Developer; reference confirmed ChatGPT-generated on 2026-10-16; AI/code-art assistance and all sound source/license credits in modal and CREDITS.md. Playwright development-only source/license credited. |
| Cohesive/stable behavior and scoped failure handling | Automated story/shell regressions pass; missing cues retry through Pause/Play, missing story image disables trigger, and missing main image/mask/stylesheet blocks broken startup with guidance. Additional-engine results below; physical phone remains unverified. |
| Shareable public HTTPS URL verified on physical smartphone | **Pending, not deployed:** GitHub Pages handoff prepared; no remote/push/Pages action. Must record actual URL, deployed commit, device/browser and observations in PHONE-VERIFICATION.md. |
| All project files, current documents and Git log | Local Git main history established from the existing approved state; source/docs/evidence retained, focused secret checks before commits, export via tools/export-git-log.mjs. **Final ZIP pending:** refresh log after deployed-phone verification, create complete archive, extract and test. |

The full brief's three stories, peer-playtest revision evidence and completed debrief belong to Phase 2. Their absence is not a Phase 1 defect. No carousel/prize story, extra animation or creative addition was made.

## Final evidence and known limits

- 17 unit tests passed: playback, lighting, fog, bats, ambient audio, ticket story and cue scheduling.
- Story regression: artwork-review/p1-9-story/ — three cycles, all story/feedback pauses, touch/keyboard, progressive hints, reduced motion, shared-context interruption, cue offsets/signal, exact reset and sound/art failure paths.
- Shell regression: artwork-review/p1-9-shell/ — viewport fit, controls, pre-entry gate, explicit interruption resume and original artwork hashes.
- Submission preflight checks /midnight-midway-check/ (project-site prefix), exact-case resource paths, keyboard-only story, Credits modality/focus/pause, conservative text contrast and five viewport sizes. Missing main image, mask and stylesheet checks verify disabled Enter/no audio with readable guidance.
- Final evidence: artwork-review/p1-9-final/checks.json. Chromium and Firefox passed the complete audiovisual preflight. WebKit passed visual/accessibility/project-path/failure checks, but this Windows WebKit 26.6 test build exposes neither AudioContext nor webkitAudioContext (both measured as undefined). Its unavailable-audio notice and visual-only fallback passed; **WebKit audio is not verified**. Aggregate result is passed-with-environment-limit, not an all-browser audio pass. No fake audio API was injected. Actual Safari/iPhone must be verified on the physical phone. [Playwright documents platform-dependent WebKit features](https://github.com/microsoft/playwright/blob/main/docs/src/browsers.md).
- Startup testing showed that a failed stylesheet can still expose an empty CSSStyleSheet. Readiness now verifies HTTP success. Native modal Tab behavior also varied, so one explicit full control order replaces boundary-only handling. Tests wait for the queued dialog close event before checking restored focus.
- Sandbox Firefox launch stalled; the owned test processes were stopped and browser checks ran outside the sandbox. This environment issue is recorded separately from app behavior.
- Earlier strict rendered screenshot comparisons failed twice and remain documented in plan.md. Not retried here. Exact paused state/DOM and resting-overlay reset passed; no universal rendered-pixel identity claim.
- Automated contrast/focus/semantics do not replace screen-reader user evaluation. Desktop WebKit is not a physical iPhone. Public host resources, actual touch/audio unlock, speaker balance, OS interruptions, battery/performance and browser chrome still require the actual-phone/public-link checklist.

## Review and delivery gates

1. Review the local prototype and submission preparation. The WebKit audio limitation is an unavailable API in this test build; verify audio on the actual target phone/browser instead of calling this desktop result an audio pass.
2. After approval, follow GITHUB-PAGES.md to create the intended empty GitHub repository, push main and enable Pages from main / (root). .nojekyll and relative asset paths are prepared. Record the actual public HTTPS URL and deployed commit; verify public resources and full story.
3. Verify that URL on the actual phone using PHONE-VERIFICATION.md, record observed results, and fix/redeploy/retest defects.
4. Update documents and refresh GIT-LOG.txt for the verified revision. Only then create the complete submission ZIP, exclude secrets/caches/Git internals/debug output/recursive archives, extract into a fresh folder and test its inventory/app.

**Phase 1 is not complete until all three deliverables pass.** No repository upload, public deployment or ZIP was performed during preparation.
