const cueNames = ['ring-1', 'ring-2', 'ring-3', 'arrival', 'stamp', 'departure', 'carousel-box', 'prize-throw', 'prize-tin', 'prize-chime'];

// Short cues share the ambience's user-activated AudioContext. Desired cues are
// derived from active time, so pause/resume and late loads retain exact offsets.
export class StoryAudio {
  constructor(ambient, { onStatus = () => {}, load = name => fetch(new URL(`../../assets/audio/${name === 'carousel-box' || name.startsWith('prize-') ? name : `story-${name}`}.wav`, import.meta.url)) } = {}) {
    this.ambient = ambient;
    this.onStatus = onStatus;
    this.load = load;
    this.buffers = new Map();
    this.sources = new Map();
    this.cueGains = new Map();
    this.loading = null;
    this.context = null;
    this.status = 'idle';
    this.snapshotState = null;
    this.cues = [];
    this.startedSources = 0;
    this.channels = new Map();
  }

  report(status) { this.status = status; this.onStatus(status); }

  prepare() {
    const context = this.ambient.context;
    if (!context || context.state === 'closed') { this.report('unavailable'); return; }
    if (this.context !== context) {
      this.stopAll();
      this.context = context;
      this.gain = context.createGain();
      this.gain.gain.value = .65;
      this.gain.connect(context.destination);
    }
    if (this.loading) return this.loading;
    if (this.buffers.size === cueNames.length) { this.report('ready'); return Promise.resolve(); }
    this.report('loading');
    this.loading = Promise.all(cueNames.map(async name => {
      if (this.buffers.has(name)) return;
      const response = await this.load(name);
      if (!response.ok) throw Error(`Missing story sound: ${name}`);
      const buffer = await context.decodeAudioData(await response.arrayBuffer());
      this.buffers.set(name, buffer);
    })).then(() => {
      this.report('ready');
    }).catch(() => { this.report('unavailable'); }).finally(() => { this.loading = null; });
    return this.loading;
  }

  stop(id) {
    const source = this.sources.get(id);
    if (source) { source.stop(); source.disconnect(); this.sources.delete(id); }
    const gain=this.cueGains.get(id);
    if(gain){gain.disconnect();this.cueGains.delete(id);}
  }

  stopAll() { for (const id of this.sources.keys()) this.stop(id); }

  sync(snapshot, cues, channel = 'ticket') {
    // Independent activities contribute cues to one shared clock/context.
    this.channels.set(channel, cues);
    cues = [...this.channels.values()].flat();
    const wasPlaying = this.snapshotState === 'exploring';
    this.snapshotState = snapshot.state;
    this.cues = cues;
    if (snapshot.state !== 'exploring') { this.stopAll(); return; }
    if (!wasPlaying || this.context !== this.ambient.context) this.prepare();
    const desired = new Set(cues.map(cue => cue.id));
    for (const id of this.sources.keys()) if (!desired.has(id)) this.stop(id);
    if (this.context?.state !== 'running') return;
    for (const cue of cues) {
      const buffer = this.buffers.get(cue.name);
      const rate = cue.rate || 1;
      const offset = (snapshot.elapsedMs - cue.at) / 1000 * rate;
      if (!buffer || this.sources.has(cue.id) || offset < 0 || offset >= buffer.duration) continue;
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      if (source.playbackRate) source.playbackRate.value = rate;
      if(cue.gain !== undefined) {
        const gain=this.context.createGain();
        gain.gain.value=cue.gain;gain.connect(this.gain);source.connect(gain);
        this.cueGains.set(cue.id,gain);
      } else source.connect(this.gain);
      source.start(0, offset);
      this.sources.set(cue.id, source);
      this.startedSources++;
      // Retain the entry until its active-time interval expires: ticks cannot
      // restart an already-ended cue because of audio/render clock skew.
    }
  }

  snapshot() { return { status: this.status, activeSources: this.sources.size, startedSources: this.startedSources, decodedCues: this.buffers.size, sharedContext: this.context === this.ambient.context }; }
}
