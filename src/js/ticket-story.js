import { ticketStoryboard, mountTicketArtwork } from './artwork.js';
import {guidanceAt} from './guidance.js';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const cueDurations = { 'ring-1': .729, 'ring-2': .620, 'ring-3': .539, arrival: 1.2, stamp: .9, departure: 1.2 };
const narration = {
  arrival: 'After all these years, someone is still on duty.',
  ticket: 'No one asks how you found this place.',
  stamp: 'Every guest was expected. Even the late ones.',
  depart: 'Some promises outlive the people who made them.',
  reset: 'The night keeps its own hours.'
};

// All times are shared active milliseconds. No story timer runs independently.
export class TicketStory {
  constructor() {
    this.rings = 0;
    this.startedAt = null;
    this.feedbackAt = null;
    this.hintSince = 0;
    this.completedAt = null;
    this.completed = 0;
    this.cycle = 0;
  }

  ring(elapsedMs) {
    if (this.startedAt !== null) return false;
    this.rings++;
    this.hintSince=elapsedMs;
    this.feedbackAt = elapsedMs;
    if (this.rings === 3) { this.startedAt = elapsedMs; this.cycle++; }
    return true;
  }

  restart(time) {
    this.snapshot(time);
    this.rings=0;this.startedAt=null;this.feedbackAt=null;
    this.hintSince=time;this.cycle++;
  }

  snapshot(elapsedMs, reducedMotion = false) {
    let seconds = this.startedAt === null ? null : (elapsedMs - this.startedAt) / 1000;
    if (seconds !== null && seconds >= 8) {
      this.completed++;
      this.completedAt = elapsedMs;
      this.hintSince = elapsedMs;
      this.startedAt = null;
      this.feedbackAt = null;
      this.rings = 0;
      seconds = null;
    }
    const playing = seconds !== null;
    const beat = playing ? ticketStoryboard.find(beat => beat.start !== null && seconds >= beat.start && seconds < beat.end).id : 'idle';
    const feedback = this.feedbackAt === null ? 0 : clamp(1 - (elapsedMs - this.feedbackAt) / 850);
    const waiting = (elapsedMs - this.hintSince) / 1000;
    let hint = waiting >= 24 ? 'A bell was how you called them, in the old days.' : waiting >= 12 ? 'The little bell outlasted whoever rang it last.' : 'They used to keep someone here, however late the hour.';
    if (this.completed > 0) hint = 'Your ticket belongs to the silent carousel. Its horses are still waiting.';
    if (this.rings > 0 && !playing && elapsedMs - this.feedbackAt < 2200) hint = this.rings === 1 ? 'For a moment, the waiting feels mutual.' : 'Whoever is inside has not quite finished waiting.';
    if (playing) hint = narration[beat];
    if (!playing && this.completedAt !== null && elapsedMs - this.completedAt < 2200) hint = 'Your ticket belongs to the silent carousel. Its horses are still waiting.';
    const cues = [];
    if (this.feedbackAt !== null) cues.push({ id: `ring-${this.cycle}-${this.feedbackAt}-${this.rings}`, name: `ring-${this.rings}`, at: this.feedbackAt, duration: cueDurations[`ring-${this.rings}`] });
    if (playing) {
      for (const [name, at] of [['arrival', 0], ['stamp', 3.5], ['departure', 4.5]]) cues.push({ id: `${this.cycle}-${name}`, name, at: this.startedAt + at * 1000, duration: cueDurations[name] });
    }
    const departure = seconds === null ? 0 : smooth((seconds - 4.5) / 2);
    return {
      playing, rings: this.rings, beat, seconds, completed: this.completed, feedback, hint,
      guidance:guidanceAt(elapsedMs,this.hintSince,reducedMotion),
      bellX: reducedMotion || playing ? 0 : .6 * Math.sin(elapsedMs / 1000 * Math.PI * 2 / 5.6),
      bellY: reducedMotion || playing ? 0 : -.14 * (1 - Math.cos(elapsedMs / 1000 * Math.PI * 2 / 5.6)),
      bellTilt: reducedMotion || playing ? 0 : 2 * Math.sin(elapsedMs / 1000 * Math.PI * 2 / 5.6),
      cues: cues.filter(cue => elapsedMs >= cue.at && elapsedMs < cue.at + cue.duration * 1000),
      ghostOpacity: !playing ? 0 : .82 * smooth(seconds / 1.1) * (1 - departure),
      ghostY: reducedMotion || !playing ? 0 : 5 * (1 - smooth(seconds / 1.5)),
      ticketOpacity: !playing ? 0 : smooth((seconds - 1.5) / .4) * (1 - smooth((seconds - 5.4) / 1.1)),
      ticketY: reducedMotion || seconds === null ? 0 : -3 * Math.sin(Math.max(0, seconds - 1.5) * Math.PI),
      stampY: reducedMotion || seconds === null ? 0 : -9 * (1 - smooth((seconds - 3.5) / .3)),
      sparkOpacity: beat !== 'stamp' ? 0 : reducedMotion ? .7 : .9 * (1 - smooth((seconds - 3.8) / .7)),
      sparkScale: reducedMotion || seconds === null ? 1 : 1 + .2 * smooth((seconds - 3.8) / .7)
    };
  }
}

export function connectTicketStory(scene, playback, cueAudio, { bell, hint, notice, onComplete = () => {}, onActivity = () => {}, canInteract = () => true, idleHint = () => null }) {
  const art = mountTicketArtwork(scene);
  art.layer.hidden = true;
  const model = new TicketStory();
  let assetsReady = false;
  let assetFailure = false;
  let lastHint = '';
  let reportedCompletions = 0;
  const part = name => art.layer.querySelector(`.story-${name}`);
  Promise.all([...art.layer.querySelectorAll('img')].map(image => image.decode())).then(() => {
    assetsReady = true;
    render(playback.snapshot());
  }).catch(() => {
    assetFailure = true;
    art.layer.hidden = true;
    notice.hidden = false;
    notice.textContent = 'The booth artwork could not load. Reload to try again.';
    render(playback.snapshot());
  });

  function render(snapshot) {
    const state = model.snapshot(snapshot.elapsedMs, snapshot.reducedMotion);
    // Notify once per finished story, never at the stamp beat or on each frame.
    // The visit owner decides whether this completion grants new progress.
    if (state.completed > reportedCompletions) {
      reportedCompletions = state.completed;
      onComplete();
    }
    art.layer.hidden = snapshot.state === 'start' || assetFailure;
    art.setPhase(state.beat);
    part('attendant').style.opacity = state.ghostOpacity;
    part('attendant').style.transform = `translateY(${state.ghostY}px)`;
    part('ticket').style.opacity = state.ticketOpacity;
    part('ticket').style.transform = `translateY(${state.ticketY}px)`;
    part('stamp').style.transform = `translateY(${state.stampY}px)`;
    part('sparks').style.opacity = state.sparkOpacity;
    part('sparks').style.transform = `scale(${state.sparkScale})`;
    const bellX = state.bellX * scene.clientWidth / 100;
    const bellY = state.bellY * scene.clientHeight / 100;
    part('bell').style.transform = `translate(${bellX}px, ${bellY}px) rotate(${state.bellTilt}deg)`;
    const guide=!state.playing&&state.completed===0?state.guidance.halo:0;
    part('bell').style.filter = `drop-shadow(1px 2px 2px #08061190) drop-shadow(0 0 ${2 + state.rings * 2+guide*9}px rgba(255,217,125,${Math.max(guide*.55,state.feedback * (.3 + .2 * state.rings))}))`;
    bell.hidden = snapshot.state === 'start';
    // Keep a stable keyboard focus target while rejecting paused/locked input.
    bell.setAttribute('aria-disabled', String(!snapshot.canInteract || !canInteract() || state.playing || !assetsReady || cueAudio.status === 'loading'));
    bell.dataset.rings = state.rings;
    bell.dataset.story = state.playing ? 'playing' : 'idle';
    const explorationHint = !state.playing && (!state.rings || !canInteract()) && state.completed > 0 && snapshot.elapsedMs - model.completedAt >= 2200 ? idleHint(snapshot) : null;
    // One visible narration box also owns loading/failure guidance.
    const warning = [notice, document.querySelector('#audio-notice')].find(item=>!item.hidden);
    const hintText = snapshot.state === 'paused' ? 'Paused. Choose Play to continue.' : warning?.textContent || explorationHint || state.hint;
    if (hintText !== lastHint) { hint.textContent = hintText; lastHint = hintText; }
    cueAudio.sync(snapshot, state.cues);
  }
  playback.subscribe(render);
  bell.addEventListener('click', () => {
    if (!playback.canInteract || !canInteract() || !assetsReady || assetFailure || cueAudio.status === 'loading') return;
    if (model.ring(playback.elapsedMs)) {onActivity();playback.notify();}
  });
  return { snapshot: () => ({ ...model.snapshot(playback.elapsedMs, playback.reducedMotion), assetsReady, assetFailure }),restart:()=>model.restart(playback.elapsedMs) };
}
