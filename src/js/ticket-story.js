import { ticketStoryboard, mountTicketArtwork } from './artwork.js';

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const cueDurations = { 'ring-1': .729, 'ring-2': .620, 'ring-3': .539, arrival: 1.2, stamp: .9, departure: 1.2 };

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
    this.feedbackAt = elapsedMs;
    if (this.rings === 3) { this.startedAt = elapsedMs; this.cycle++; }
    return true;
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
    let hint = waiting >= 24 ? 'Perhaps the bell is waiting for a little persistence.' : waiting >= 12 ? 'A quiet bell rests on the old counter.' : 'The ticket booth is waiting for a visitor…';
    if (this.completed > 0) hint = 'Admission secured. The carousel is unlocked.';
    if (this.rings > 0 && !playing && elapsedMs - this.feedbackAt < 2200) hint = this.rings === 1 ? 'One chime… something stirs inside.' : 'Two chimes… the booth seems to be listening.';
    if (playing) hint = beat === 'reset' ? 'The booth falls quiet again…' : 'A ticket for a guest who never left…';
    if (!playing && this.completedAt !== null && elapsedMs - this.completedAt < 2200) hint = 'Your ticket is yours. The carousel is unlocked.';
    const cues = [];
    if (this.feedbackAt !== null) cues.push({ id: `ring-${this.cycle}-${this.feedbackAt}-${this.rings}`, name: `ring-${this.rings}`, at: this.feedbackAt, duration: cueDurations[`ring-${this.rings}`] });
    if (playing) {
      for (const [name, at] of [['arrival', 0], ['stamp', 3.5], ['departure', 4.5]]) cues.push({ id: `${this.cycle}-${name}`, name, at: this.startedAt + at * 1000, duration: cueDurations[name] });
    }
    const departure = seconds === null ? 0 : smooth((seconds - 4.5) / 2);
    return {
      playing, rings: this.rings, beat, seconds, completed: this.completed, feedback, hint,
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

export function connectTicketStory(scene, playback, cueAudio, { bell, progress, hint, notice, onComplete = () => {} }) {
  const art = mountTicketArtwork(scene);
  art.layer.hidden = true;
  const model = new TicketStory();
  let assetsReady = false;
  let assetFailure = false;
  let lastProgress = '';
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
    part('bell').style.filter = `drop-shadow(0 0 ${2 + state.rings * 2}px rgba(255,217,125,${state.feedback * (.3 + .2 * state.rings)}))`;
    bell.hidden = snapshot.state === 'start';
    // Keep a stable keyboard focus target while rejecting paused/locked input.
    bell.setAttribute('aria-disabled', String(!snapshot.canInteract || state.playing || !assetsReady || cueAudio.status === 'loading'));
    bell.dataset.rings = state.rings;
    bell.dataset.story = state.playing ? 'playing' : 'idle';
    const text = state.playing ? 'The attendant is here…' : state.rings ? `${state.rings} ${state.rings === 1 ? 'chime' : 'chimes'}` : '';
    if (text !== lastProgress) { progress.textContent = text; lastProgress = text; }
    progress.hidden = !text || snapshot.state === 'start';
    const hintText = snapshot.state === 'paused' ? 'Paused. Choose Play to continue.' : state.hint;
    if (hintText !== lastHint) { hint.textContent = hintText; lastHint = hintText; }
    cueAudio.sync(snapshot, state.cues);
  }
  playback.subscribe(render);
  bell.addEventListener('click', () => {
    if (!playback.canInteract || !assetsReady || assetFailure || cueAudio.status === 'loading') return;
    if (model.ring(playback.elapsedMs)) render(playback.snapshot());
  });
  return { snapshot: () => ({ ...model.snapshot(playback.elapsedMs, playback.reducedMotion), assetsReady, assetFailure }) };
}
