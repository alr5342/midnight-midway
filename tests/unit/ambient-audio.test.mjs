import test from 'node:test';
import assert from 'node:assert/strict';
import { AmbientAudio } from '../../src/js/ambient-audio.js';

function harness(loadOverride) {
  const starts = [], active = new Set(), listeners = new Map();
  const context = {
    state: 'suspended', destination: {},
    createGain: () => ({ gain: { value: 0 }, connect() {} }),
    createBufferSource() {
      const source = { connect() {}, disconnect() {}, start(when, offset) { starts.push(offset); active.add(source); }, stop() { active.delete(source); } };
      return source;
    },
    resume() { this.state = 'running'; return Promise.resolve(); },
    suspend() { this.state = 'suspended'; return Promise.resolve(); },
    decodeAudioData: async () => ({ duration: 4 }),
    addEventListener: (name, listener) => listeners.set(name, listener)
  };
  let interruptions = 0;
  const audio = new AmbientAudio({ createContext: () => context, onInterrupt: () => interruptions++, load: loadOverride || (async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(0) })) });
  return { audio, context, active, starts, listeners, interruptions: () => interruptions };
}

test('ending wind level survives context creation and Pause/Play without returning to full volume',async()=>{
  const {audio}=harness();audio.setLevel(.4);await audio.play(2000);
  assert.ok(Math.abs(audio.gain.gain.value-.12)<1e-9);
  audio.pause();audio.setLevel(.2);await audio.play(2000);
  assert.ok(Math.abs(audio.gain.gain.value-.06)<1e-9);
  audio.setLevel(0);assert.equal(audio.gain.gain.value,0);audio.pause();
});

test('audio starts only on explicit play, stops synchronously and resumes from active time', async () => {
  const { audio, active, starts } = harness();
  assert.equal(audio.snapshot().contextState, 'not-created');
  await audio.play(1500);
  assert.equal(active.size, 1);
  assert.equal(starts[0], 1.5);
  audio.pause();
  assert.equal(active.size, 0);
  await audio.play(6500);
  assert.equal(starts[1], 2.5);
  assert.equal(active.size, 1);
  await audio.play(6700);
  assert.equal(active.size, 1);
});

test('pausing during a late download prevents unwanted playback; subsequent Play retries safely', async () => {
  let resolve;
  const deferred = new Promise(done => { resolve = done; });
  const { audio, active } = harness(() => deferred);
  const pending = audio.play(0);
  audio.pause();
  resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(0) });
  await pending;
  assert.equal(active.size, 0);
  await audio.play(1000);
  assert.equal(active.size, 1);
});

test('load failure is reported without throwing; browser interruption notifies the coordinator', async () => {
  const failed = harness(async () => ({ ok: false }));
  await failed.audio.play(0);
  assert.equal(failed.audio.snapshot().status, 'unavailable');
  assert.equal(failed.active.size, 0);
  const running = harness();
  await running.audio.play(0);
  running.context.state = 'interrupted';
  running.listeners.get('statechange')();
  assert.equal(running.interruptions(), 1);
});

test('native suspension during resume/loading pauses the coordinator before a late source can start',async()=>{
  let release;const delayed=new Promise(resolve=>{release=resolve;});
  const running=harness(()=>delayed);
  const notify=running.audio.onInterrupt;
  running.audio.onInterrupt=()=>{notify();running.audio.pause();};
  const pending=running.audio.play(0);
  assert.equal(running.audio.status,'loading');
  running.context.state='suspended';running.listeners.get('statechange')();
  assert.equal(running.interruptions(),1);
  release({ok:true,arrayBuffer:async()=>new ArrayBuffer(0)});await pending;
  assert.equal(running.active.size,0);
  assert.equal(running.audio.wanted,false,'No automatic resume after interruption');
  await running.audio.play(1000);assert.equal(running.active.size,1);
});

test('a delayed event from our own suspension cannot interrupt the matching resume', async () => {
  const running = harness();
  await running.audio.play(1500);
  running.audio.pause();
  let release;
  running.context.resume = () => new Promise(resolve => { release = resolve; });
  const pending = running.audio.play(1500);
  running.listeners.get('statechange')();
  assert.equal(running.context.state, 'suspended');
  assert.equal(running.interruptions(), 0, 'The pending owned suspension belongs to this resume');
  running.context.state = 'running';
  release();
  await pending;
  assert.equal(running.active.size, 1);
  assert.equal(running.starts.at(-1), 1.5);
  running.context.state = 'suspended';
  running.listeners.get('statechange')();
  assert.equal(running.interruptions(), 1, 'A later native suspension still interrupts playback');
});
