import { Playback } from './playback.js';
import { connectLighting } from './lighting.js';
import { connectFog } from './fog.js';
import { connectBats } from './bats.js';

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const playback = new Playback({ reducedMotion: motionPreference.matches });
const stage = document.querySelector('#stage');
const startScreen = document.querySelector('#start-screen');
const enter = document.querySelector('#enter');
const pause = document.querySelector('#playback');
const pauseIcon = pause.querySelector('span');
const hint = document.querySelector('#hint');
const motionNote = document.querySelector('#motion-note');
const status = document.querySelector('#playback-status');
let frame = null;
let renderedState = null;
let renderedMotion = null;

connectLighting(document.querySelector('.scene'), playback);
connectFog(document.querySelector('.scene'), playback);
connectBats(document.querySelector('.scene'), playback);

function nextFrame() {
  frame = null;
  playback.tick();
}

playback.subscribe((snapshot) => {
  if (renderedState !== snapshot.state || renderedMotion !== snapshot.reducedMotion) {
    stage.dataset.state = snapshot.state;
    stage.dataset.reducedMotion = String(snapshot.reducedMotion);
    startScreen.hidden = snapshot.state !== 'start';
    pause.hidden = snapshot.state === 'start';
    hint.hidden = snapshot.state === 'start';
    pause.setAttribute('aria-label', snapshot.state === 'paused' ? 'Play scene' : 'Pause scene');
    pause.title = snapshot.state === 'paused' ? 'Play' : 'Pause';
    pauseIcon.textContent = snapshot.state === 'paused' ? '▶' : 'Ⅱ';
    hint.textContent = snapshot.state === 'paused' ? 'Paused. Choose Play to continue.' : 'Some guests never left the midway…';
    motionNote.textContent = snapshot.reducedMotion ? 'Reduced motion is enabled for your device.' : '';
    motionNote.hidden = !snapshot.reducedMotion;
    // Announce transitions only; never send frame-by-frame updates to assistive tech.
    if (renderedState !== snapshot.state) {
      status.textContent = snapshot.state === 'start' ? '' : snapshot.state === 'paused' ? 'Scene paused.' : 'Scene playing.';
      renderedState = snapshot.state;
    }
    renderedMotion = snapshot.reducedMotion;
  }
  if (snapshot.state === 'exploring' && frame === null) frame = requestAnimationFrame(nextFrame);
  if (snapshot.state !== 'exploring' && frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
});

enter.addEventListener('click', () => {
  playback.start();
  pause.focus({ preventScroll: true });
});
pause.addEventListener('click', () => {
  if (playback.state === 'paused') playback.resume();
  else playback.pause();
});
motionPreference.addEventListener('change', event => playback.setReducedMotion(event.matches));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) playback.pause();
  // Returning to the tab deliberately does not resume playback.
});
window.addEventListener('pagehide', () => playback.pause());

// Read-only diagnostics, enabled only on the explicit development URL.
// No diagnostic controls or runtime counters appear in the product interface.
if (new URLSearchParams(location.search).has('diagnostics')) {
  Object.defineProperty(window, 'midwayDiagnostics', {
    value: Object.freeze({ snapshot: () => ({ ...playback.snapshot(), scheduledFrames: frame === null ? 0 : 1 }) })
  });
}
