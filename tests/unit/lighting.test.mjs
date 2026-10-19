import test from 'node:test';
import assert from 'node:assert/strict';
import { Playback } from '../../src/js/playback.js';
import { lightingAt } from '../../src/js/lighting.js';

test('lighting follows active time and resumes the same phase after a long pause', () => {
  let now = 0;
  const playback = new Playback({ now: () => now });
  playback.start();
  now = 2200;
  playback.pause();
  const pausedLight = lightingAt(playback.elapsedMs, false);
  now += 90000;
  assert.deepEqual(lightingAt(playback.elapsedMs, false), pausedLight);
  playback.resume();
  assert.deepEqual(lightingAt(playback.elapsedMs, false), pausedLight);
  now += 500;
  assert.deepEqual(lightingAt(playback.elapsedMs, false), lightingAt(2700, false));
});

test('reduced motion is constant and normal lighting stays within gentle bounds', () => {
  const reduced = lightingAt(0, true);
  for (let time = 0; time <= 88000; time += 100) {
    assert.deepEqual(lightingAt(time, true), reduced);
    const light = lightingAt(time, false);
    assert.ok(light.bulbs >= 0.10 && light.bulbs <= 0.700001);
    assert.ok(light.gondola >= 0.10 && light.gondola <= 0.720001);
  }
});
