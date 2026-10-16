// Static artwork composition shared by the preview and comparison pages.
// Pieces retain reference pixels; only hidden surfaces use the generated plate.
const source = 'reference/midnight-midway-concept.png';
const pieces = ['horse-left', 'horse-center', 'horse-right', 'prize-pair'];
for (const scene of document.querySelectorAll('[data-attractions]')) {
  const anchor = scene.querySelector('.booth');
  if (scene.dataset.carriage !== 'before') {
    const carriage = document.createElement('img');
    carriage.className = 'layer carriage-patch';
    carriage.src = 'assets/gondola-style-v2.png';
    carriage.alt = '';
    scene.insertBefore(carriage, anchor);
  }
  for (const kind of ['attraction-patch', 'attraction-piece']) {
    for (const piece of kind === 'attraction-patch' ? ['repair'] : pieces) {
      const image = document.createElement('img');
      image.className = `layer ${kind} ${piece}`;
      image.src = kind === 'attraction-patch' ? 'assets/attractions-hidden-plate-v1.png' : source;
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
