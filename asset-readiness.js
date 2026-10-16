// Keep the start screen usable if a required scene image, stylesheet or mask
// is missing. Validate real URLs rather than inferring success from layout.
export function connectAssetReadiness(scene, enter, notice) {
  const state = { ready:false };
  enter.disabled = true;
  notice.hidden = false;
  notice.textContent = 'Loading the midway…';
  const styles = [...document.querySelectorAll('link[rel="stylesheet"]')];
  const masks = new Set();
  for (const element of [scene,...scene.querySelectorAll('*')]) {
    const value = getComputedStyle(element).maskImage;
    for (const match of value.matchAll(/url\(["']?([^"')]+)["']?\)/g)) masks.add(match[1]);
  }
  Promise.all([
    ...[...scene.querySelectorAll(':scope > img')].map(image=>image.decode()),
    // A failed stylesheet can still expose an empty CSSStyleSheet, so sheet
    // presence alone is not evidence that its request succeeded.
    ...[...styles.map(link=>link.href),...masks].map(async url => {
      const response = await fetch(url);
      if(!response.ok) throw Error('Scene stylesheet or mask missing');
    })
  ]).then(() => {
    state.ready = true;
    enter.disabled = false;
    notice.hidden = true;
  }).catch(() => {
    notice.textContent = 'The midway artwork could not load. Reload to try again.';
    // Credits remain available; do not launch a broken scene or start audio.
  });
  return state;
}
