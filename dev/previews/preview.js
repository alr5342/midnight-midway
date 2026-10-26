import { mountSceneArtwork, ticketStoryboard, mountTicketArtwork, mountCarouselArtwork } from '../../src/js/artwork.js';
const requested = new URLSearchParams(location.search).get('view') || 'artwork';
const view = ['artwork','carriage','booth','scene','story','ending','prize'].includes(requested) ? requested : 'artwork';
document.body.dataset.preview = view;
document.querySelector('#preview-content').append(document.querySelector('#preview-' + view).content.cloneNode(true));
document.querySelector('.preview-nav a[href="?view=' + view + '"]').setAttribute('aria-current','page');
mountSceneArtwork();
if (view === 'prize') {
  const scene=document.querySelector('#prize-scene');
  mountTicketArtwork(scene);
  mountCarouselArtwork(scene,document.createElement('div'));
  document.querySelector('#prize-ratio').addEventListener('change',event=>{
    document.querySelector('#prize-phone').dataset.ratio=event.target.value;
  });
  document.querySelector('#prize-zones').addEventListener('change',event=>{
    scene.dataset.aimZones=String(event.target.checked);
  });
}
if (view === 'ending') {
  const stage = document.querySelector('#ending-stage');
  const descriptions = {
    offered: 'Before claim: the token waits above the prize counter. The park remains fully visible.',
    claimed: '2 seconds: the booth fades first, revealing moonlit land. The carousel, prize stall and wheel still stand.',
    fading: '5 seconds: the carousel is almost gone and the prize stall follows. The field stays visible beneath them.',
    wheel: '8 seconds: only the Ferris wheel remains over the empty land, with one last warm gondola light.',
    gone: '10 seconds: the wheel is gone too. The keepsake and empty moonlit land remain. No automatic return.'
  };
  // Source-coordinate, feathered inspection masks isolate the four attractions
  // from copies of the approved assembly. The corrected gondola is retained.
  // Empty land underneath replaces painted park pixels, rather than dimming them.
  const masks = {
    booth: 'M0 490 L155 485 L280 660 L300 1160 L245 1245 L0 1290Z',
    carousel: 'M278 810 L455 700 L525 698 L727 820 L730 1155 L285 1165Z',
    stall: 'M738 660 L941 530 L941 1250 L770 1190 L715 930Z',
    wheel: 'M182 88 Q510 -15 722 150 Q835 290 786 490 L708 600 L620 728 L350 728 L290 650 L270 518 L160 478 Q105 285 182 88Z'
  };
  for (const element of stage.querySelectorAll('[data-attraction]')) {
    const memory = stage.querySelector('.ending-artwork').cloneNode(true);
    memory.classList.remove('ending-artwork');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 941 1672"><defs><filter id="edge" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter></defs><path d="${masks[element.dataset.attraction]}" fill="white" filter="url(#edge)"/></svg>`;
    element.style.maskImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    element.append(memory);
  }
  document.querySelector('#ending-beat').addEventListener('change', event => {
    stage.dataset.beat = event.target.value;
    document.querySelector('#ending-caption').textContent = descriptions[event.target.value];
    stage.setAttribute('aria-label', descriptions[event.target.value]);
  });
  document.querySelector('#ending-ratio').addEventListener('change', event => {
    document.querySelector('#ending-phone').dataset.ratio = event.target.value;
  });
  document.querySelector('#ending-return').addEventListener('change', event => {
    stage.dataset.return = String(event.target.checked);
  });
}
if (view === 'artwork') {
const scene = document.querySelector('#scene');
const phone = document.querySelector('#phone');
const captions = {
  original: 'Original reference. All artwork remains visible; no animation or scene interactions.',
  assembled: 'Full static assembly with original horse and prize pixels. Play/Pause and hint are nonfunctional placement mockups.',
  'attraction-pieces': 'Three independently masked horses and one overlapping ghost/cat prize pair, using original reference pixels.',
  'attraction-displaced': 'Small static lifts expose the hidden-surface repairs. No motion or story behavior is running.',
  before: 'Previous assembly, preserved for comparison: straight booth cutoff and obscured foreground.',
  plate: 'Repaired background with ticket booth removed. Inspect the newly revealed area on the left.',
  cutout: 'Extracted booth over checkerboard. Inspect silhouette, transparency, lettering and edge quality.',
  displaced: 'Booth shifted right to expose the repaired area. This is an inspection view, not a proposed composition.'
};
document.querySelector('#view').addEventListener('change', (event) => {
  scene.dataset.view = event.target.value;
  document.querySelector('#caption').textContent = captions[event.target.value];
});
document.querySelector('#ratio').addEventListener('change', (event) => {
  phone.dataset.ratio = event.target.value;
});
document.querySelector('#ui').addEventListener('change', (event) => {
  phone.dataset.ui = event.target.value;
});

}
if (view === 'story') {
    const artwork = mountTicketArtwork(document.querySelector('#story-scene'));
    const select = document.querySelector('#beat');
    for (const beat of ticketStoryboard) select.add(new Option(beat.label, beat.id));
    select.addEventListener('change', () => artwork.setPhase(select.value));
    document.querySelector('#art').addEventListener('change', event => { artwork.layer.hidden = event.target.value === 'hide'; });
    for (const name of ['ring-1','ring-2','ring-3','arrival','stamp','departure']) {
      const label = document.createElement('p'); label.textContent = name;
      const audio = document.createElement('audio'); audio.controls = true; audio.preload = 'none'; audio.src = new URL(`../../assets/audio/story-${name}.wav`, import.meta.url).href; audio.style.maxWidth = '100%';
      audio.addEventListener('play', () => { document.querySelectorAll('#sounds audio').forEach(other => { if (other !== audio) other.pause(); }); });
      document.querySelector('#sounds').append(label,audio);
    }

}
