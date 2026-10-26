// Occasional flights use the same active clock as lighting and fog.
// Two bats at most; the route stays above the wheel hub and below the moon.
export function batsAt(elapsedMs, reducedMotion) {
  const seconds = elapsedMs / 1000;
  return [3, 5].map((delay, index) => {
    const flight = ((seconds - delay) % 22 + 22) % 22;
    const visible = !reducedMotion && seconds >= delay && flight < 9;
    const progress = Math.min(flight / 9, 1);
    return {
      visible,
      x: -60 + 1060 * progress,
      y: 245 + index * 42 + 18 * Math.sin(progress * Math.PI * 2 + index),
      wing: 0.72 + 0.28 * Math.sin(seconds * Math.PI * 2 / 0.55 + index),
      opacity: visible ? Math.min(1, progress / .08, (1 - progress) / .08) * .85 : 0
    };
  });
}

export function connectBats(scene, playback) {
  const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  overlay.setAttribute('viewBox', '0 0 941 1672');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.classList.add('ambient-bats');
  // Original code-native silhouettes, separate from the approved raster art.
  overlay.innerHTML = [0, 1].map(() => `<g class="flying-bat" fill="#121020" stroke="#53415e" stroke-width=".65">
    <g class="bat-wings"><path d="M0 0 Q-12 -16 -28 -8 Q-23 -2 -24 4 Q-18 0 -15 6 Q-10 2 -6 8 L0 4 Q6 8 10 2 Q15 6 18 0 Q24 4 23 -2 Q28 -8 28 -8 Q12 -16 0 0Z"/></g>
    <ellipse cx="0" cy="2" rx="3" ry="6"/><path d="M-3 -2 L-3 -7 L0 -4 L3 -7 L3 -2Z"/>
  </g>`).join('');
  scene.append(overlay);
  const groups = [...overlay.querySelectorAll('.flying-bat')];
  return playback.subscribe(snapshot => {
    overlay.style.display = snapshot.state === 'start' || snapshot.reducedMotion ? 'none' : '';
    const bats = batsAt(snapshot.elapsedMs, snapshot.reducedMotion);
    groups.forEach((group, index) => {
      const bat = bats[index];
      group.style.opacity = String(bat.opacity);
      group.setAttribute('transform', `translate(${bat.x} ${bat.y}) scale(.9)`);
      group.querySelector('.bat-wings').setAttribute('transform', `scale(1 ${bat.wing})`);
    });
  });
}
