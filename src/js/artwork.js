// Approved scene composition shared by the runtime and development previews.
// Pieces retain reference pixels; only hidden surfaces use the generated plate.
const source = new URL('../../assets/sources/artwork/midnight-midway-concept.png', import.meta.url).href;
const pieces = ['horse-left', 'horse-center', 'horse-right', 'prize-pair'];
export function mountSceneArtwork() {
  for (const scene of document.querySelectorAll('[data-attractions]')) {
    const anchor = scene.querySelector('.booth');
    if (scene.dataset.carriage !== 'before') {
      const carriage = document.createElement('img');
      carriage.className = 'layer carriage-patch';
      carriage.src = new URL('../../assets/artwork/gondola-style-v2.png', import.meta.url).href;
      carriage.alt = '';
      scene.insertBefore(carriage, anchor);
    }
    for (const kind of ['attraction-patch', 'attraction-piece']) {
      for (const piece of kind === 'attraction-patch' ? ['repair'] : pieces) {
        const image = document.createElement('img');
        image.className = `layer ${kind} ${piece}`;
        image.src = kind === 'attraction-patch' ? new URL('../../assets/artwork/attractions-hidden-plate-v1.png', import.meta.url).href : source;
        image.alt = '';
        scene.insertBefore(image, anchor);
      }
    }
    const rail = document.createElement('img');
    rail.className = 'layer attraction-occlusion';
    rail.src = source;
    rail.alt = '';
    scene.insertBefore(rail, anchor);
  }
}

// Shared eight-second storyboard and prop staging. TicketStory owns runtime
// playback, timing and interaction; inspectors stage these assets manually.
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
    <img class="story-empty-window" src="${new URL('../../assets/story/booth-empty-interior-v1.png', import.meta.url).href}" alt="">
    <img class="story-attendant" src="${new URL('../../assets/story/ghost-attendant-v3.png', import.meta.url).href}" alt="">
  </div>
  <img class="story-ticket" src="${new URL('../../assets/story/ticket.svg', import.meta.url).href}" alt="">
  <img class="story-stamp" src="${new URL('../../assets/story/stamp.svg', import.meta.url).href}" alt="">
  <img class="story-sparks" src="${new URL('../../assets/story/sparks.svg', import.meta.url).href}" alt="">
  <img class="story-bell" src="${new URL('../../assets/story/bell.svg', import.meta.url).href}" alt="">`;
  scene.append(layer);
  return { layer, setPhase: phase => { layer.dataset.phase = phase; } };
}
