import test from 'node:test';
import assert from 'node:assert/strict';
import { Playback } from '../../src/js/playback.js';

test('active time starts only on Enter and excludes paused wall time', () => {
  let now = 0;
  const playback = new Playback({ now: () => now });
  now = 10000;
  assert.equal(playback.elapsedMs, 0);
  assert.equal(playback.canInteract, false);
  playback.start();
  now += 1234;
  playback.pause();
  now += 60000;
  assert.equal(playback.elapsedMs, 1234);
  assert.equal(playback.canInteract, false);
  playback.resume();
  now += 567;
  assert.equal(playback.elapsedMs, 1801);
  assert.equal(playback.canInteract, true);
});

test('repeated transitions cannot restart the clock or bypass Enter', () => {
  let now = 0;
  const playback = new Playback({ now: () => now });
  playback.resume();
  playback.pause();
  assert.equal(playback.state, 'start');
  playback.start();
  now = 200;
  playback.start();
  playback.resume();
  assert.equal(playback.elapsedMs, 200);
  playback.pause();
  now = 10000;
  playback.pause();
  assert.equal(playback.elapsedMs, 200);
  for (let index = 0; index < 20; index++) { playback.resume(); playback.pause(); }
  assert.equal(playback.elapsedMs, 200);
});

test('reduced-motion changes preserve state/time and paused frames do not advance consumers', () => {
  let now = 0;
  const playback = new Playback({ now: () => now, reducedMotion: true });
  const snapshots = [];
  const unsubscribe = playback.subscribe(snapshot => snapshots.push(snapshot));
  assert.equal(snapshots[0].reducedMotion, true);
  playback.start();
  now = 400;
  playback.pause();
  playback.setReducedMotion(false);
  assert.deepEqual(playback.snapshot(), { state: 'paused', elapsedMs: 400, canInteract: false, reducedMotion: false });
  const count = snapshots.length;
  now = 20000;
  playback.tick();
  assert.equal(snapshots.length, count);
  unsubscribe();
  playback.resume();
  assert.equal(snapshots.length, count);
});
