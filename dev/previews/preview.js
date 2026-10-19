import { mountSceneArtwork, ticketStoryboard, mountTicketArtwork } from '../../src/js/artwork.js';
const requested = new URLSearchParams(location.search).get('view') || 'artwork';
const view = ['artwork','carriage','booth','scene','story','ending'].includes(requested) ? requested : 'artwork';
document.body.dataset.preview = view;
document.querySelector('#preview-content').append(document.querySelector('#preview-' + view).content.cloneNode(true));
document.querySelector('.preview-nav a[href="?view=' + view + '"]').setAttribute('aria-current','page');
mountSceneArtwork();
if (view === 'ending') {
  const stage = document.querySelector('#ending-stage');
  const descriptions = {
    offered: 'Before claim: the token waits above the prize counter. The park remains fully visible.',
    claimed: '2 seconds: the keepsake moves into view. Soft fog gathers as the lower lights begin to recede.',
    fading: '5 seconds: the booth, carousel and stall retreat behind fog and darkness. The wheel still holds its shape.',
    wheel: '8 seconds: the Ferris wheel is the final faint memory. Its right-hand gondola holds the last amber light.',
    gone: '10 seconds: only the brass keepsake remains against darkness. No automatic return to the park.'
  };
  // Reuse the complete approved assembly for the last wheel silhouette,
  // including the corrected gondola; no original-reference replacement.
  const memory = stage.querySelector('.ending-artwork').cloneNode(true);
  memory.classList.remove('ending-artwork');
  stage.querySelector('.ending-wheel-memory').append(memory);
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
