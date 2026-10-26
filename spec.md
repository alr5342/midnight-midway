# Midnight Midway — current specification

Updated 2026-10-26. Approved application baseline: `614e44b`, now merged into `main` and published without runtime or creative changes. [Deployment and public verification](docs/PHASE-2-DEPLOYMENT.md) record the actual release. Fixed assignment requirements: [brief.md](brief.md). Final submission evidence and outstanding phone/debrief/archive gates: [Phase 2 audit](docs/PHASE-2-AUDIT.md).

## Goal and constraints

Create a spooky, playful, unbranded seasonal theme-park promotion for ages 10+. One illustrated abandoned midway briefly returns to life, then disappears, leaving a brass keepsake. Keep the approved composition, original horse pixels, painterly props and restrained 2D effects. No realistic violence, gore or real-world suffering. The Ferris wheel and carousel never rotate.

The complete scene fits one vertical smartphone viewport without scrolling or page changes. Ferris wheel/illuminated gondola is the main focal point; ticket booth, carousel and prize stall are distinct environmental features. Lighting, drifting fog and bats supply three ambient effects. Looping wind and the activated carousel's quiet original tune share the sound system. One bottom narration box provides atmospheric, progressively helpful hints; the sheet inspector shows only the enlarged environmental clue, not another instruction panel.

## Visit, tickets and replay

- Enter starts the scene and unlocks sound. Nothing animates or plays before activation. Initial and live reduced-motion preferences are honored.
- The booth remains available throughout exploration. Three bell activations trigger its eight-second story; each full completion awards one stackable admission ticket. Repeated frame/input reports cannot duplicate awards.
- The first ticket unlocks both attractions; either may be completed first. The first accepted horse note or throw spends one ticket. Invalid/blocked input, paper inspection, Pause, Credits and audio interruptions never spend tickets.
- Wrong melodies and failed two-bag rounds remain covered by their paid activity until its full story succeeds. Switching attractions or returning to the booth retains unfinished paid activities independently.
- After success, starting another play costs a new ticket. All three stories remain individually replayable without reloading until the ending is claimed. At zero tickets the player can obtain more from the booth.
- Both full attraction stories must finish at least once before one souvenir token appears at the existing prize-stall location. This also works when the carousel finishes last. Replays never duplicate or revoke that reward; it stays clear of active can aiming.
- Claiming the token deliberately begins the ending. Attraction layers fade over the approved empty field over eight active seconds, Ferris wheel last. The token and land remain. After a two-second quiet hold, Revisit reloads a completely fresh visit. Refresh also restarts; no persistent storage is used.

## Three discoverable stories

| Attraction | Trigger and clue | Eight-second audiovisual payoff | Recovery / replay |
| --- | --- | --- | --- |
| Ticket booth | Three rings of the painted brass bell; distinct pitch/glow/narration with each ring. Timed hints and growing environmental emphasis suggest the bell. | Eerie attendant arrives, presents a floating ticket, stamps it with magical sparks, departs; booth returns to normal. | New rings can begin after completion; each story grants one ticket. |
| Carousel | Tap actual horses: left C5, center E-flat5, right G5. Solution left → right → center → left. Weathered ground paper exists from entry and is inspectable free after admission; its four musical notes suggest the tune without position labels. | Lights awaken, staggered vertical horse movement and music form a short supernatural ride, then settle into subtle bobbing and a quiet looping tune. | Wrong notes sound discord and clear only the attempt. Completed rides can be purchased again. No rotation. |
| Prize stall | Three stacked cans, two beanbags. Either lower can drops itself and the supported top can; the remaining lower can needs the other throw. Dents/scuffs/sign suggest the support relationship. | Hollow chime and haunted prize movement, then a settled stall; the souvenir is offered only once both attraction stories have finished. | On failure the bags return to their compartments; tapping a bag resets the cans and restores two throws within the paid activity. Completed games can be purchased again through pickup. |

All story triggers give visual and audible feedback. Other scene interaction is blocked throughout each story, with exploration restored afterward. Inspecting the sheet blocks underlying scene input. Keyboard buttons and touch targets address the same models.

## Shared playback and accessibility

One active-time `Playback` clock owns ambient motion, feedback, hints, throws, stories, completed carousel idle, sound offsets and ending fades. Pause stops time, sources, effects and scene input; Play resumes the same state. Hidden-page/pagehide or genuine audio interruption pauses until explicit Play. Credits temporarily freezes exact state and restores the previous playing/paused mode on Close/Escape, unless a browser interruption invalidates that resume.

Reduced motion removes travel/bobbing/pulsing while retaining stationary story states, sound, progress and the ending fade. Buttons have accessible names/focus indicators and at least 44px target bounds at tested sizes. Native Credits traps focus and returns it to the opener. Narration/status and live ticket count announce changes rather than animation frames. Sampled text contrast is checked conservatively; this is not a complete assistive-technology certification.

## Implementation and delivery

Buildless root `index.html`, shared `src/css/`, modular `src/js/`, local `assets/`, separate `dev/previews/`, browser/unit tests, preparation tools and preserved source originals. Relative/module-relative paths and `.nojekyll` support GitHub Pages `main` / `/(root)`. No external runtime libraries, fonts or network requests are needed after local assets load.

Keep sources, exact image prompts, original recordings, derivative metadata, developer/asset credits and meaningful Git history. Phase 1 public app and ZIP remain historical deliverables; their phone approval does not verify Phase 2. Final release requires approved documentation, the supplied debrief completed in a later step, current public HTTPS deployment, physical-phone verification, refreshed Git log and an extracted-and-tested complete repository ZIP.

The brief requires visible trigger progress. Bell/cans have explicit changing state; carousel inputs have pitch/glint/discord and a tracked prefix, but no persistent visible prefix counter. Final review should confirm that this satisfies the intended interpretation before claiming unconditional compliance. No new UI is authorized by this audit.

## Historical record

[Pre-finalization specification](docs/history/20261026-finalization/spec.md) preserves earlier checkpoints verbatim. [Design records](docs/design/JOURNEY.md), [ticket-system acceptance](docs/design/TICKET-SYSTEM.md), [artwork evidence](docs/artwork/ARTWORK.md) and the Git history preserve the evolution; superseded sequential progression and permanent restart controls are not current behavior.
