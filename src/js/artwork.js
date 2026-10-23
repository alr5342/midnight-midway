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
        image.src = kind === 'attraction-patch' ? new URL('../../assets/artwork/attractions-hidden-plate-v1.png', import.meta.url).href
          : piece.startsWith('horse-') ? new URL(`../../assets/artwork/${piece}.png`, import.meta.url).href : source;
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
  <img class="story-bell" src="${new URL('../../assets/story/bell-painted-v1.png', import.meta.url).href}" alt="">`;
  scene.append(layer);
  return { layer, setPhase: phase => { layer.dataset.phase = phase; } };
}

export function mountCarouselArtwork(scene, inspector) {
  // The same painted scrap and exact notation appear on the ground and in
  // inspection. No words, horse labels or generated notation are baked in.
  const paper = new URL('../../assets/story/music-paper-painted-v1.png', import.meta.url).href;
  const sheet = `<div class="sheet-art" role="img" aria-label="Treble staff: C5, G5, E-flat5, C5.">
    <img src="${paper}" alt="">
    <svg viewBox="0 0 320 220" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.2"><path d="M43 70H278M43 82H278M43 94H278M43 106H278M43 118H278"/>
      <path d="M53 135C69 132 42 53 55 48C70 44 52 81 45 91C27 117 71 124 66 99C63 84 39 92 46 106M80 88V129M136 64V105M192 76V117M248 88V129" stroke-width="2.3"/>
      <path d="M179 56V87Q195 70 179 76" stroke-width="1.9"/></g>
      <g fill="currentColor">${[[86,88],[142,64],[198,76],[254,88]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="7.5" ry="5" transform="rotate(-20 ${x} ${y})"/>`).join('')}</g>
    </svg></div>`;
  const ground = document.createElement('div');
  ground.className='environment-paper';ground.setAttribute('aria-hidden','true');ground.innerHTML=sheet;
  scene.insertBefore(ground,scene.querySelector('.ambient-fog'));
  inspector.innerHTML=sheet;
  const lights=document.createElementNS('http://www.w3.org/2000/svg','svg');
  lights.classList.add('carousel-lighting');lights.setAttribute('viewBox','0 0 941 1672');lights.setAttribute('aria-hidden','true');
  lights.innerHTML=`<defs><radialGradient id="carousel-lamp"><stop stop-color="#fff1bd" stop-opacity=".9"/><stop offset=".3" stop-color="#ffd17e" stop-opacity=".45"/><stop offset="1" stop-color="#d88a45" stop-opacity="0"/></radialGradient></defs>
    ${[[285,823],[322,851],[365,866],[408,878],[452,882],[496,880],[539,871],[582,860],[625,847],[661,829]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="14" fill="url(#carousel-lamp)"/>`).join('')}`;
  scene.insertBefore(lights,scene.querySelector('.ambient-fog'));
  return {lights,ground};
}
