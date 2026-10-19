// Lighting has no independent timer or CSS animation: its phase is derived
// solely from the playback clock, which excludes paused/background time.
export function lightingAt(elapsedMs, reducedMotion) {
  if (reducedMotion) return { bulbs: 0.26, gondola: 0.24 };
  const phase = elapsedMs / 1000;
  // Broad breathing pulses carry a small smooth shimmer, never abrupt flashes.
  const wheelPulse = 0.5 + 0.5 * Math.sin(phase * Math.PI * 2 / 5);
  const wheelShimmer = 0.90 + 0.10 * Math.sin(phase * Math.PI * 2 / 1.7);
  const carriagePulse = 0.5 + 0.5 * Math.sin(phase * Math.PI * 2 / 6.5 + 0.4);
  const carriageShimmer = 0.94 + 0.06 * Math.sin(phase * Math.PI * 2 / 2.1);
  return {
    bulbs: 0.10 + 0.60 * wheelPulse * wheelShimmer,
    gondola: 0.10 + 0.62 * carriagePulse * carriageShimmer
  };
}

export function connectLighting(scene, playback) {
  const namespace = 'http://www.w3.org/2000/svg';
  const overlay = document.createElementNS(namespace, 'svg');
  overlay.setAttribute('viewBox', '0 0 941 1672');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.classList.add('ambient-lighting');
  // Centers checked against bright bulb pixels in the approved 941 × 1672 plate.
  // Follow painted perspective, not an ideal circle or evenly spaced spoke line.
  const bulbs = [
    [142,277], [233,163], [292,120], [314,115], [334,109], [372,103],
    [405,98], [425,98], [458,100], [492,106], [538,120],
    [557,127], [580,140], [602,154], [621,166], [637,180], [655,196], [670,214],
    [684,231], [706,258], [719,276], [735,308], [749,342],
    [764,396], [768,423], [770,453], [766,490], [760,520],
    [174,292], [216,310], [251,325], [285,339], [317,352], [352,367],
    [381,380], [198,440], [234,435], [276,429], [308,426], [349,422],
    [368,420], [575,382], [611,374], [663,361], [695,354],
    [561,449], [607,466], [630,475], [673,490], [715,505],
    [407,527], [392,561], [379,595], [364,632], [350,663]
  ];
  overlay.innerHTML = `<defs>
    <radialGradient id="bulb-halo"><stop stop-color="#fff3c4"/><stop offset=".3" stop-color="#ffd28a" stop-opacity=".65"/><stop offset="1" stop-color="#ffb557" stop-opacity="0"/></radialGradient>
    <radialGradient id="gondola-halo"><stop stop-color="#eeb476" stop-opacity=".8"/><stop offset=".55" stop-color="#d58e56" stop-opacity=".3"/><stop offset="1" stop-color="#c48556" stop-opacity="0"/></radialGradient>
  </defs><g class="wheel-bulb-light">${bulbs.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="11" fill="url(#bulb-halo)"/>`).join('')}</g>
  <ellipse class="gondola-light" cx="713" cy="423" rx="36" ry="28" fill="url(#gondola-halo)"/>`;
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
