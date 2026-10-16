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
