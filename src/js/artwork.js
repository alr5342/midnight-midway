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

// Promote the approved preview props without repainting the scene. Bags use
// clipped original pixels so each can leave the shelf independently.
export function mountPrizeArtwork(scene) {
  const counter = new URL('../../assets/story/prize-counter-v1.png',import.meta.url).href;
  const can = new URL('../../assets/story/prize-can-v1.png',import.meta.url).href;
  const token = new URL('../../assets/story/keepsake-token-v1.svg',import.meta.url).href;
  const bagPaths = [
    'M130 235L327 141L395 181L426 274L334 349L161 324Z',
    'M330 205L430 175Q557 175 650 285L641 310L470 334L334 349Z'
  ];
  const layer=document.createElement('div');
  layer.className='prize-props';layer.setAttribute('aria-hidden','true');
  layer.innerHTML=`<svg class="prize-counter" viewBox="0 0 2048 768">
    <defs><mask id="prize-empty-bags" maskUnits="userSpaceOnUse" x="0" y="0" width="2048" height="768"><rect width="2048" height="768" fill="white"/>${bagPaths.map(d=>`<path d="${d}" fill="black"/>`).join('')}</mask>
    <linearGradient id="prize-wood" x2="0" y2="1"><stop stop-color="#69432d"/><stop offset="1" stop-color="#35241c"/></linearGradient></defs>
    <path d="M130 287L585 241L655 310L334 349L161 324Z" fill="url(#prize-wood)"/>
    <image href="${counter}" width="2048" height="768" mask="url(#prize-empty-bags)"/>
    <g class="beanbag-boxes" stroke="#352018" stroke-width="7" stroke-linejoin="round"><path d="M110 301L341 256L378 331L133 375Z" fill="#39291f"/><path d="M356 287L638 266L677 327L390 369Z" fill="#39291f"/>
    <path d="M110 301L133 375L133 394L110 319ZM133 375L378 331L378 350L133 394ZM356 287L390 369L390 388L356 306ZM390 369L677 327L677 347L390 388Z" fill="url(#prize-wood)"/></g>
    <path d="M120 303L341 263M367 289L634 273" fill="none" stroke="#a27545" stroke-width="5" opacity=".55"/></svg>
    ${['left','right','top'].map(side=>`<img class="prize-can prize-can-${side}" src="${can}" alt="">`).join('')}
    ${bagPaths.map((d,i)=>`<svg class="prize-counter prize-bag-${i}" viewBox="0 0 2048 768"><defs><clipPath id="prize-bag-${i}"><path d="${d}"/></clipPath></defs><image href="${counter}" width="2048" height="768" clip-path="url(#prize-bag-${i})"/></svg>`).join('')}
    <svg class="prize-rules" viewBox="0 0 160 90"><svg width="160" height="90" viewBox="1450 390 520 230" preserveAspectRatio="none"><image href="${counter}" width="2048" height="768"/></svg><g fill="currentColor" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" opacity=".85"><text x="80" y="41" font-size="24">2 BAGS</text><text x="80" y="68" font-size="24">3 CANS</text></g></svg>
    <svg class="prize-flying-bag" viewBox="130 140 300 220"><defs><clipPath id="prize-thrown-bag"><path d="${bagPaths[0]}"/></clipPath></defs><image href="${counter}" width="2048" height="768" clip-path="url(#prize-thrown-bag)"/></svg>
    <img class="prize-token" src="${token}" alt="">
    <img class="prize-sparks" src="${new URL('../../assets/story/sparks.svg',import.meta.url).href}" alt="">`;
  const wake=document.createElementNS('http://www.w3.org/2000/svg','svg');
  wake.setAttribute('viewBox','0 0 941 1672');wake.classList.add('prize-wake');
  wake.innerHTML=`<defs><radialGradient id="stall-glow"><stop stop-color="#fff2ba" stop-opacity=".85"/><stop offset=".35" stop-color="#ffb85f" stop-opacity=".4"/><stop offset="1" stop-color="#d38236" stop-opacity="0"/></radialGradient></defs>${[[748,657],[787,632],[827,609],[869,588],[908,565],[935,552]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="18" fill="url(#stall-glow)"/>`).join('')}<ellipse cx="790" cy="1090" rx="100" ry="45" fill="url(#stall-glow)"/>`;
  layer.append(wake);
  scene.insertBefore(layer,scene.querySelector('.ambient-fog'));
  return layer;
}
