// P1.6 asset staging only. Timing describes the proposed eight-second story;
// this module does not play the story, run timers or attach a bell trigger.
export const ticketStoryboard = [
  { id: 'idle', label: 'Resting booth', start: null, end: null, cue: null },
  { id: 'arrival', label: '0–1.5s · Attendant appears', start: 0, end: 1.5, cue: 'story-arrival' },
  { id: 'ticket', label: '1.5–3.5s · Floating ticket', start: 1.5, end: 3.5, cue: null },
  { id: 'stamp', label: '3.5–4.5s · Stamp and sparks', start: 3.5, end: 4.5, cue: 'story-stamp' },
  { id: 'depart', label: '4.5–6.5s · Attendant disappears', start: 4.5, end: 6.5, cue: 'story-departure' },
  { id: 'reset', label: '6.5–8s · Settle and reset', start: 6.5, end: 8, cue: null }
];

export function mountTicketArtwork(scene) {
  const layer = document.createElement('div');
  layer.className = 'ticket-story-art';
  layer.dataset.phase = 'idle';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = `<div class="story-window">
    <img class="story-empty-window" src="assets/story/booth-empty-interior-v1.png" alt="">
    <img class="story-attendant" src="assets/story/ghost-attendant-v3.png" alt="">
  </div>
  <img class="story-ticket" src="assets/story/ticket.svg" alt="">
  <img class="story-stamp" src="assets/story/stamp.svg" alt="">
  <img class="story-sparks" src="assets/story/sparks.svg" alt="">
  <img class="story-bell" src="assets/story/bell.svg" alt="">`;
  scene.append(layer);
  return { layer, setPhase: phase => { layer.dataset.phase = phase; } };
}
