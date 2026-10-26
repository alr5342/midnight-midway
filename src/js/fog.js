// Fog and lighting share active time. No CSS animation or separate timer can
// continue drifting during Pause or while the app is hidden.
export function fogAt(elapsedMs, reducedMotion) {
  if (reducedMotion) return { rearX: 0, rearY: 0, frontX: 0, frontY: 0 };
  const seconds = elapsedMs / 1000;
  return {
    rearX: 26 * Math.sin(seconds * Math.PI * 2 / 28),
    rearY: 4 * Math.sin(seconds * Math.PI * 2 / 19),
    frontX: 38 * Math.sin(seconds * Math.PI * 2 / 34 + 0.7),
    frontY: 5 * Math.sin(seconds * Math.PI * 2 / 23)
  };
}

export function connectFog(scene, playback) {
  const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  overlay.setAttribute('viewBox', '0 0 941 1672');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.classList.add('ambient-fog');
  // Broad, soft overlapping wisps sit on the path, below the attractions.
  // Overscan past the canvas edges avoids revealing the ends while drifting.
  overlay.innerHTML = `<defs>
    <radialGradient id="fog-soft"><stop stop-color="#b9b7d4" stop-opacity=".20"/><stop offset=".5" stop-color="#aaa9ce" stop-opacity=".10"/><stop offset="1" stop-color="#aaa9ce" stop-opacity="0"/></radialGradient>
  </defs>
  <g class="fog-rear" fill="url(#fog-soft)">
    <ellipse cx="330" cy="1155" rx="300" ry="55"/>
    <ellipse cx="680" cy="1135" rx="235" ry="42"/>
    <ellipse cx="490" cy="1193" rx="240" ry="35"/>
  </g>
  <g class="fog-front" fill="url(#fog-soft)">
    <ellipse cx="20" cy="1330" rx="260" ry="58"/>
    <ellipse cx="260" cy="1355" rx="260" ry="47"/>
    <ellipse cx="740" cy="1390" rx="320" ry="55"/>
  </g>`;
  // Rear wisps pass behind the booth/retained foreground; front wisps also
  // remain behind those silhouettes, preserving the approved pumpkin edges.
  scene.insertBefore(overlay, scene.querySelector('.booth'));
  const rear = overlay.querySelector('.fog-rear');
  const front = overlay.querySelector('.fog-front');
  return playback.subscribe(snapshot => {
    overlay.style.display = snapshot.state === 'start' ? 'none' : '';
    const fog = fogAt(snapshot.elapsedMs, snapshot.reducedMotion);
    rear.setAttribute('transform', `translate(${fog.rearX} ${fog.rearY})`);
    front.setAttribute('transform', `translate(${fog.frontX} ${fog.frontY})`);
  });
}
