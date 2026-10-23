export class AmbientAudio {
  constructor({ onStatus, onInterrupt, createContext = () => new (window.AudioContext || window.webkitAudioContext)(), load = () => fetch(new URL('../../assets/audio/midway-wind-loop.wav', import.meta.url)) } = {}) {
    this.onStatus = onStatus || (() => {});
    this.onInterrupt = onInterrupt || (() => {});
    this.createContext = createContext;
    this.load = load;
    this.context = null;
    this.source = null;
    this.buffer = null;
    this.loading = null;
    this.wanted = false;
    this.generation = 0;
    this.elapsedMs = 0;
    this.status = 'idle';
  }

  report(status) { this.status = status; this.onStatus(status); }

  async play(elapsedMs) {
    this.wanted = true;
    this.elapsedMs = elapsedMs;
    const generation = ++this.generation;
    try {
      if (!this.context || this.context.state === 'closed') {
        this.context = this.createContext();
        this.gain = this.context.createGain();
        this.gain.gain.value = .30;
        this.gain.connect(this.context.destination);
        const context = this.context;
        context.addEventListener('statechange', () => {
          if (context !== this.context || !this.wanted) return;
          // A native suspension can arrive while resume/decode is pending,
          // before status reaches playing. Explicit Pause clears wanted first.
          if (context.state === 'interrupted' || context.state === 'closed' || context.state === 'suspended') this.onInterrupt();
        });
      }
      // Called synchronously inside Enter/Play's activation event, before fetch.
      const resume = this.context.resume();
      this.report('loading');
      if (!this.loading) {
        this.loading = this.load().then(response => {
          if (!response.ok) throw Error('Ambient audio unavailable');
          return response.arrayBuffer();
        }).then(bytes => this.context.decodeAudioData(bytes)).then(buffer => (this.buffer = buffer));
        this.loading.catch(() => { this.loading = null; });
      }
      await Promise.all([resume, this.loading]);
      if (!this.wanted || generation !== this.generation) return;
      if (this.context.state !== 'running') { this.onInterrupt(); return; }
      this.stopSource();
      const source = this.context.createBufferSource();
      source.buffer = this.buffer;
      source.loop = true;
      source.connect(this.gain);
      // A late download starts at current active time, not at stale entry time.
      const offset = (this.getElapsed ? this.getElapsed() : this.elapsedMs) / 1000 % this.buffer.duration;
      source.start(0, offset);
      this.source = source;
      this.report('playing');
    } catch {
      if (generation === this.generation && this.wanted) {
        this.stopSource();
        this.report('unavailable');
      }
    }
  }

  stopSource() {
    if (!this.source) return;
    this.source.stop();
    this.source.disconnect();
    this.source = null;
  }

  pause() {
    this.wanted = false;
    this.generation++;
    this.stopSource();
    if (this.context && this.context.state !== 'closed') this.context.suspend().catch(() => {});
    if (this.status !== 'idle') this.report('paused');
  }

  snapshot() {
    return { status: this.status, contextState: this.context?.state || 'not-created', activeSources: this.source ? 1 : 0, duration: this.buffer?.duration || 0 };
  }
}

export function connectAmbientAudio(playback, onStatus) {
  const audio = new AmbientAudio({ onStatus, onInterrupt: () => playback.pause() });
  audio.getElapsed = () => playback.elapsedMs;
  let previous = 'start';
  playback.subscribe(snapshot => {
    if (snapshot.state === previous) return;
    previous = snapshot.state;
    if (snapshot.state === 'exploring') void audio.play(snapshot.elapsedMs);
    else audio.pause();
  });
  return audio;
}
