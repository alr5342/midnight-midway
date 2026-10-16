// Lighting has no independent timer or CSS animation: its phase is derived
// solely from the playback clock, which excludes paused/background time.
export function lightingAt(elapsedMs, reducedMotion) {
  if (reducedMotion) return { bulbs: 0.12, gondola: 0.08 };
  const phase = elapsedMs / 1000;
  return {
    bulbs: 0.12 + 0.08 * Math.sin(phase * Math.PI * 2 / 8),
    gondola: 0.08 + 0.05 * Math.sin(phase * Math.PI * 2 / 11)
  };
}

export function connectLighting(scene, playback) {
  const namespace = 'http://www.w3.org/2000/svg';
  const overlay = document.createElementNS(namespace, 'svg');
  overlay.setAttribute('viewBox', '0 0 941 1672');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.classList.add('ambient-lighting');
  // Existing bulb positions in the approved composition; never move wheel art.
  const bulbs = [
    [141,279], [219,178], [285,121], [314,111], [344,104], [373,101],
    [402,99], [433,100], [463,103], [492,109], [521,117],
    [549,128], [576,141], [603,158], [628,176], [650,194], [670,215],
    [690,239], [707,263], [723,290], [737,316], [750,344],
    [760,396], [765,425], [768,455], [766,486], [760,519],
    [178,298], [214,315], [250,332], [287,348], [324,365], [361,382],
    [398,398], [195,434], [232,432], [269,430], [306,428], [343,426],
    [380,423], [575,392], [610,380], [645,368], [682,356],
    [562,451], [598,466], [635,481], [672,497], [709,512],
    [394,529], [373,563], [351,597], [330,630], [310,663]
  ];
  overlay.innerHTML = `<defs>
    <radialGradient id="bulb-halo"><stop stop-color="#fff3c4"/><stop offset=".3" stop-color="#ffd28a" stop-opacity=".65"/><stop offset="1" stop-color="#ffb557" stop-opacity="0"/></radialGradient>
    <radialGradient id="gondola-halo"><stop stop-color="#eeb476" stop-opacity=".8"/><stop offset=".55" stop-color="#d58e56" stop-opacity=".3"/><stop offset="1" stop-color="#c48556" stop-opacity="0"/></radialGradient>
  </defs><g class="wheel-bulb-light">${bulbs.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="7" fill="url(#bulb-halo)"/>`).join('')}</g>
  <ellipse class="gondola-light" cx="713" cy="423" rx="23" ry="19" fill="url(#gondola-halo)"/>`;
  scene.append(overlay);
  const wheel = overlay.querySelector('.wheel-bulb-light');
  const gondola = overlay.querySelector('.gondola-light');
  return playback.subscribe(snapshot => {
    // Before entry the overlay contributes no pixels. Reduced motion receives
    // constant illumination; Pause retains precisely the last active-time phase.
    overlay.style.display = snapshot.state === 'start' ? 'none' : '';
    const light = lightingAt(snapshot.elapsedMs, snapshot.reducedMotion);
    wheel.style.opacity = String(light.bulbs);
    gondola.style.opacity = String(light.gondola);
  });
}
