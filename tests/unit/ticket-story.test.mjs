import test from 'node:test';
import assert from 'node:assert/strict';
import { TicketStory } from '../../src/js/ticket-story.js';
import { Playback } from '../../src/js/playback.js';
import { StoryAudio } from '../../src/js/story-audio.js';

test('idle bell sway shares active time, freezes on pause and is suppressed by reduced motion/story playback',()=>{
  let now=0;const playback=new Playback({now:()=>now}),story=new TicketStory();
  playback.start();const resting=story.snapshot(playback.elapsedMs);
  now=900;const moving=story.snapshot(playback.elapsedMs);
  assert.notEqual(moving.bellX,resting.bellX);
  assert.ok(Math.abs(moving.bellX)<=.6&&Math.abs(moving.bellTilt)<=2);
  playback.pause();now+=60000;
  assert.deepEqual(story.snapshot(playback.elapsedMs),moving);
  const reduced=story.snapshot(playback.elapsedMs,true);
  assert.deepEqual([reduced.bellX,reduced.bellY,reduced.bellTilt],[0,0,0]);
  playback.resume();assert.deepEqual(story.snapshot(playback.elapsedMs),moving);
  for(let i=0;i<3;i++)story.ring(playback.elapsedMs);
  const playing=story.snapshot(playback.elapsedMs);
  assert.deepEqual([playing.bellX,playing.bellY,playing.bellTilt],[0,0,0]);
});

test('three distinct responses launch one eight-second story; replay resets the attempt and preserves completion history', () => {
  const story = new TicketStory();
  for (let cycle = 0; cycle < 3; cycle++) {
    const base = cycle * 11000;
    for (let ring = 1; ring <= 3; ring++) {
      assert.equal(story.ring(base + ring * 700), true);
      const state = story.snapshot(base + ring * 700);
      assert.equal(state.rings, ring);
      assert.ok(state.cues.some(cue => cue.name === `ring-${ring}`));
    }
    assert.equal(story.ring(base + 2200), false, 'story must reject further scene input');
    for (const [offset, beat] of [[0,'arrival'],[1500,'ticket'],[3500,'stamp'],[4500,'depart'],[6500,'reset']]) {
      assert.equal(story.snapshot(base + 2100 + offset).beat, beat);
    }
    assert.equal(story.snapshot(base + 10099).playing, true);
    const reset = story.snapshot(base + 10100);
    assert.equal(reset.playing, false);
    assert.equal(reset.rings, 0);
    assert.equal(reset.completed, cycle + 1);
    assert.deepEqual(reset.cues, []);
  }
});

test('shared pause freezes story, feedback and hints at beginning/middle/end', () => {
  let now = 0;
  const playback = new Playback({ now: () => now });
  const story = new TicketStory();
  playback.start();
  story.ring(0); story.ring(0); story.ring(0);
  for (const activeTime of [200, 2000, 3800, 5000, 7000]) {
    now += activeTime - playback.elapsedMs;
    playback.pause();
    const frozen = story.snapshot(playback.elapsedMs);
    now += 60000;
    assert.deepEqual(story.snapshot(playback.elapsedMs), frozen);
    playback.resume();
    assert.deepEqual(story.snapshot(playback.elapsedMs), frozen);
  }
  assert.equal(story.snapshot(0).hint, 'After all these years, someone is still on duty.');
  const exploring = new TicketStory();
  assert.notEqual(exploring.snapshot(0).hint, exploring.snapshot(12000).hint);
  assert.notEqual(exploring.snapshot(12000).hint, exploring.snapshot(24000).hint);
  exploring.ring(1000);
  assert.match(exploring.snapshot(1000).hint, /waiting/);
  assert.match(exploring.snapshot(24000).hint, /bell/, 'Partial progress must not suppress later discovery hints');
});

test('reduced motion keeps narrative but suppresses travel and spark expansion', () => {
  const story = new TicketStory(); story.ring(0); story.ring(0); story.ring(0);
  for (const t of [100,1800,3600,3900,5000,6900]) {
    const reduced = story.snapshot(t, true);
    assert.equal(reduced.ghostY, 0); assert.equal(reduced.ticketY, 0);
    assert.equal(reduced.stampY, 0); assert.equal(reduced.sparkScale, 1);
    assert.equal(reduced.beat, story.snapshot(t, false).beat);
  }
});

function audioHarness(load) {
  const starts = [], sources = new Set();
  const context = {
    state: 'running', destination: {},
    createGain: () => ({gain: {value: 0},connect() {},disconnect() {this.disconnected=true;}}),
    decodeAudioData: async () => ({duration: 1.2}),
    createBufferSource() { const source = {playbackRate:{value:1},connect(target) {this.output=target;},disconnect() {},start(when,offset) { starts.push(offset); sources.add(source); },stop() { sources.delete(source); }}; return source; }
  };
  const audio = new StoryAudio({context}, {load: load || (async () => ({ok:true,arrayBuffer:async () => new ArrayBuffer(0)}))});
  return {audio, context, starts, sources};
}

test('cue resume uses saved offset, ticks cannot duplicate sources and expired cues are removed', async () => {
  const {audio, starts, sources} = audioHarness(); await audio.prepare();
  const cue = {id:'arrival-1',name:'arrival',at:0,duration:1.2};
  const state = elapsedMs => ({state:'exploring',elapsedMs});
  audio.sync(state(250), [cue]); audio.sync(state(300), [cue]);
  assert.deepEqual(starts,[.25]);
  audio.sync({state:'paused',elapsedMs:300},[cue]); assert.equal(sources.size,0);
  audio.sync(state(300),[cue]); assert.deepEqual(starts,[.25,.3]);
  audio.sync(state(1300),[]); assert.equal(sources.size,0);
});

test('late loads cannot sound while paused; failures leave a retryable scheduler', async () => {
  let release;
  const delayed = new Promise(resolve => { release = resolve; });
  const {audio,sources} = audioHarness(() => delayed);
  const pending = audio.prepare();
  audio.sync({state:'paused',elapsedMs:0},[]);
  release({ok:true,arrayBuffer:async () => new ArrayBuffer(0)}); await pending;
  assert.equal(sources.size,0);
  const failed = audioHarness(async () => ({ok:false})); await failed.audio.prepare();
  assert.equal(failed.audio.status,'unavailable');
  failed.audio.load = async () => ({ok:true,arrayBuffer:async () => new ArrayBuffer(0)});
  await failed.audio.prepare(); assert.equal(failed.audio.status,'ready');
});

test('carousel and booth channels coexist and pitched cues resume at the correct buffer offset',async()=>{
  const {audio,starts,sources}=audioHarness();await audio.prepare();
  const ticket=[{id:'ticket-arrival',name:'arrival',at:0,duration:1.2}];
  const note=[{id:'carousel-note',name:'ring-2',at:0,duration:.4,rate:1.5}];
  audio.sync({state:'exploring',elapsedMs:0},ticket);
  audio.sync({state:'exploring',elapsedMs:200},note,'carousel');
  assert.equal(starts.length,2);assert.ok(Math.abs(starts[1]-.3)<1e-9);assert.equal(sources.size,2);
  audio.sync({state:'exploring',elapsedMs:250},ticket);
  assert.equal(sources.size,2,'Booth updates must not cancel a carousel channel');
  audio.sync({state:'paused',elapsedMs:250},ticket);assert.equal(sources.size,0);
  audio.sync({state:'exploring',elapsedMs:250},ticket);
  assert.equal(starts.length,4);assert.ok(starts.every((offset,index)=>Math.abs(offset-[0,.3,.25,.375][index])<1e-9));
  assert.deepEqual([...sources].map(source=>source.playbackRate.value),[1,1.5]);
  audio.sync({state:'exploring',elapsedMs:800},[],'carousel');
  assert.equal(sources.size,1,'Clearing carousel cues must preserve the booth cue');
});

test('quiet music has independent gain, preserves pitched resume offsets and disconnects its gain on pause',async()=>{
  const {audio,sources,starts}=audioHarness();await audio.prepare();
  const music=[{id:'quiet-note',name:'carousel-box',at:0,duration:1.6,rate:.5,gain:.22}];
  audio.sync({state:'exploring',elapsedMs:200},music,'carousel-ambience');
  const source=[...sources][0],gain=source.output;
  assert.equal(gain.gain.value,.22);assert.equal(audio.gain.gain.value,.65);
  assert.deepEqual(starts,[.1]);
  audio.sync({state:'exploring',elapsedMs:250},[],'ticket');
  assert.equal(sources.size,1,'Booth updates must retain the music channel');
  audio.sync({state:'paused',elapsedMs:300},music,'carousel-ambience');
  assert.equal(sources.size,0);assert.equal(audio.cueGains.size,0);assert.equal(gain.disconnected,true);
  audio.sync({state:'exploring',elapsedMs:300},music,'carousel-ambience');
  assert.deepEqual(starts,[.1,.15]);assert.equal([...sources][0].output.gain.value,.22);
});
