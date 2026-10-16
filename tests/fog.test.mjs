import test from 'node:test';
import assert from 'node:assert/strict';
import { fogAt } from '../fog.js';
import { lightingAt } from '../lighting.js';
import { Playback } from '../playback.js';

test('fog and lights retain their shared phase through a long pause and resume', () => {
  let now = 0;
  const playback = new Playback({ now: () => now });
  playback.start();
  now = 6432;
  playback.pause();
  const frozen = { fog: fogAt(playback.elapsedMs, false), lights: lightingAt(playback.elapsedMs, false) };
  now += 120000;
  assert.deepEqual({ fog: fogAt(playback.elapsedMs, false), lights: lightingAt(playback.elapsedMs, false) }, frozen);
  playback.resume();
  assert.deepEqual(fogAt(playback.elapsedMs, false), frozen.fog);
  now += 1000;
  assert.deepEqual(fogAt(playback.elapsedMs, false), fogAt(7432, false));
});

test('fog remains within its soft-edge overscan and reduced motion never drifts', () => {
  for (let time = 0; time < 240000; time += 211) {
    const fog = fogAt(time, false);
    assert.ok(Math.abs(fog.rearX) <= 26 && Math.abs(fog.rearY) <= 4);
    assert.ok(Math.abs(fog.frontX) <= 38 && Math.abs(fog.frontY) <= 5);
    assert.deepEqual(fogAt(time, true), { rearX: 0, rearY: 0, frontX: 0, frontY: 0 });
  }
});
