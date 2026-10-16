// One active-time clock for all future effects, audio, hints and story sequences.
// State transitions notify subscribers; consumers must use canInteract for input.
export class Playback {
  constructor({ now = () => performance.now(), reducedMotion = false } = {}) {
    this.now = now;
    this.state = 'start';
    this.reducedMotion = reducedMotion;
    this.accumulatedMs = 0;
    this.activeSince = null;
    this.listeners = new Set();
  }

  get elapsedMs() {
    return this.accumulatedMs + (this.activeSince === null ? 0 : this.now() - this.activeSince);
  }

  get canInteract() { return this.state === 'exploring'; }

  snapshot() {
    return { state: this.state, elapsedMs: this.elapsedMs, canInteract: this.canInteract, reducedMotion: this.reducedMotion };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  notify() {
    const snapshot = this.snapshot();
    for (const listener of this.listeners) listener(snapshot);
  }

  start() {
    if (this.state !== 'start') return;
    this.state = 'exploring';
    this.activeSince = this.now();
    this.notify();
  }

  pause() {
    if (this.state !== 'exploring') return;
    this.accumulatedMs = this.elapsedMs;
    this.activeSince = null;
    this.state = 'paused';
    this.notify();
  }

  resume() {
    if (this.state !== 'paused') return;
    this.activeSince = this.now();
    this.state = 'exploring';
    this.notify();
  }

  setReducedMotion(value) {
    if (this.reducedMotion === value) return;
    this.reducedMotion = value;
    this.notify();
  }

  tick() {
    if (this.state === 'exploring') this.notify();
  }
}
