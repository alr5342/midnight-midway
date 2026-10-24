import { mountSceneArtwork } from './artwork.js';
import { Playback } from './playback.js';
import { connectLighting } from './lighting.js';
import { connectFog } from './fog.js';
import { connectBats } from './bats.js';
import { connectAmbientAudio } from './ambient-audio.js';
import { StoryAudio } from './story-audio.js';
import { connectTicketStory } from './ticket-story.js';
import { connectCarousel } from './carousel.js';
import { connectPrize } from './prize.js';
import { connectEnding } from './ending.js';

mountSceneArtwork();

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
const admission = document.querySelector('#admission');
// Visit progress is independent of the booth's temporary rings/animation reset.
// Reload constructs a fresh visit; no storage or cross-session state is used.
const journey = { admitted: false };
let carousel = null;
let prize = null;
let ending = null;
const audioNotice = document.querySelector('#audio-notice');
let frame = null;
let renderedState = null;
let renderedMotion = null;

connectLighting(document.querySelector('.scene'), playback);
connectFog(document.querySelector('.scene'), playback);
connectBats(document.querySelector('.scene'), playback);
const ambientAudio = connectAmbientAudio(playback, audioStatus => {
  audioNotice.hidden = audioStatus !== 'unavailable';
  audioNotice.textContent = audioStatus === 'unavailable' ? 'Sound unavailable. Pause, then Play to retry.' : '';
});
const storyNotice = document.querySelector('#story-notice');
const storyAudio = new StoryAudio(ambientAudio, { onStatus: value => {
  // Artwork failures own this notice until reload; audio failures are retryable.
  if (ticketStory?.snapshot().assetFailure) return;
  storyNotice.hidden = !['loading', 'unavailable'].includes(value);
  storyNotice.textContent = value === 'unavailable' ? 'Some midway sounds could not load. Pause, then Play to retry.' : value === 'loading' ? 'Loading midway sounds…' : '';
} });
const ticketStory = connectTicketStory(document.querySelector('.scene'), playback, storyAudio, {
  bell: document.querySelector('#bell'), hint, notice: storyNotice,
  onComplete: grantAdmission,
  canInteract: () => !ending?.snapshot().claimed && !carousel?.snapshot().clueOpen && !carousel?.snapshot().playing && !prize?.snapshot().busy,
  idleHint: () => prize?.snapshot().unlocked && !carousel?.snapshot().clueOpen && !carousel?.snapshot().playing ? prize.hint() : carousel?.hint()
});
carousel = connectCarousel(document.querySelector('.scene'), playback, storyAudio, {
  access: () => ({admitted:journey.admitted,storyPlaying:ticketStory.snapshot().playing || Boolean(prize?.snapshot().busy) || Boolean(ending?.snapshot().claimed)}),
  onSolved: () => { stage.dataset.carouselPuzzle = 'solved'; }
});
prize = connectPrize(document.querySelector('.scene'),playback,storyAudio,{
  access: () => ({rideCompleted:carousel.snapshot().completed,blocked:ticketStory.snapshot().playing || carousel.snapshot().playing || carousel.snapshot().clueOpen || Boolean(ending?.snapshot().claimed)})
});
ending=connectEnding(document.querySelector('.scene'),playback,ambientAudio,storyAudio,{
  access:()=>{
    const reward=prize.snapshot();
    return {tokenAwarded:reward.tokenAwarded,tokenOffered:reward.tokenOpacity===1,
      blocked:ticketStory.snapshot().playing || carousel.snapshot().playing || carousel.snapshot().clueOpen || reward.busy};
  },hint
});
connectCredits(playback);
const assets = connectAssetReadiness(document.querySelector('.scene'), enter, document.querySelector('#asset-notice'));

function grantAdmission() {
  if (journey.admitted) return;
  journey.admitted = true;
  renderJourney(playback.snapshot());
}

function journeySnapshot() {
  return { admitted: journey.admitted, admissionTickets: journey.admitted ? 1 : 0, carouselUnlocked: journey.admitted,
    prizeUnlocked: Boolean(carousel?.snapshot().completed), souvenirTokens: prize?.snapshot().tokenAwarded ? 1 : 0 };
}

function renderJourney(snapshot) {
  const availability = journey.admitted ? 'unlocked' : 'locked';
  if (stage.dataset.carousel !== availability) stage.dataset.carousel = availability;
  const hidden = !journey.admitted || snapshot.state === 'start' || Boolean(ending?.snapshot().claimed);
  if (admission.hidden !== hidden) admission.hidden = hidden;
}

function nextFrame() {
  frame = null;
  playback.tick();
  if(ending?.snapshot().resting)playback.finish();
}

playback.subscribe((snapshot) => {
  renderJourney(snapshot);
  const finale=ending?.snapshot();
  // A tab interruption during the quiet final hold must still offer explicit
  // Play; otherwise the hidden control would strand the Revisit timer.
  pause.hidden=snapshot.state==='start'||Boolean(finale?.resting)||Boolean(finale?.gone&&snapshot.state!=='paused');
  hint.hidden=snapshot.state==='start'||Boolean(finale?.gone);
  document.querySelector('#credits-open').hidden=Boolean(finale?.claimed);
  if (renderedState !== snapshot.state || renderedMotion !== snapshot.reducedMotion) {
    stage.dataset.state = snapshot.state;
    stage.dataset.reducedMotion = String(snapshot.reducedMotion);
    startScreen.hidden = snapshot.state !== 'start';
    pause.setAttribute('aria-label', snapshot.state === 'paused' ? 'Play scene' : 'Pause scene');
    pause.title = snapshot.state === 'paused' ? 'Play' : 'Pause';
    pauseIcon.textContent = snapshot.state === 'paused' ? '▶' : 'Ⅱ';
    motionNote.textContent = snapshot.reducedMotion ? 'Reduced motion is enabled for your device.' : '';
    motionNote.hidden = !snapshot.reducedMotion;
    // Announce transitions only; never send frame-by-frame updates to assistive tech.
    if (renderedState !== snapshot.state) {
      status.textContent = snapshot.state === 'start' ? '' : snapshot.state === 'paused' ? 'Scene paused.' : snapshot.state === 'ended' ? 'The visit has ended.' : 'Scene playing.';
      renderedState = snapshot.state;
    }
    renderedMotion = snapshot.reducedMotion;
  }
  if (snapshot.state === 'exploring' && frame === null && !finale?.resting) frame = requestAnimationFrame(nextFrame);
  if (snapshot.state !== 'exploring' && frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
});

enter.addEventListener('click', () => {
  if (!assets.ready) return;
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
    value: Object.freeze({ snapshot: () => ({ ...playback.snapshot(), scheduledFrames: frame === null ? 0 : 1 }), audio: () => ambientAudio.snapshot(), story: () => ticketStory.snapshot(), storyAudio: () => storyAudio.snapshot(), journey: journeySnapshot, carousel: () => carousel.snapshot(), prize: () => prize.snapshot(), ending: () => ending.snapshot() })
  });
}

// Credits are an in-scene modal. Opening it pauses the shared experience;
// closing it never resumes audio or a story without an explicit Play action.
function connectCredits(playback) {
  const dialog = document.querySelector('#credits-dialog');
  const open = document.querySelector('#credits-open');
  const close = document.querySelector('#credits-close');
  open.addEventListener('click', () => {
    playback.pause();
    dialog.showModal();
    close.focus();
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if(event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, a[href]')];
    // Some browsers skip links in their default Tab order. Use the same full
    // control order everywhere instead of only trapping the boundary keys.
    const index = controls.indexOf(document.activeElement);
    const next = (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
    event.preventDefault();
    controls[next].focus();
  });
  dialog.addEventListener('close', () => open.focus({preventScroll:true}));
}

// Keep the start screen usable if a required scene image, stylesheet or mask
// is missing. Validate real URLs rather than inferring success from layout.
function connectAssetReadiness(scene, enter, notice) {
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
