import test from 'node:test';
import assert from 'node:assert/strict';
import { Playback } from '../playback.js';
import { batsAt } from '../bats.js';
import { fogAt } from '../fog.js';
import { lightingAt } from '../lighting.js';

test('occasional flights have an idle gap, bounded routes and no reduced-motion flight', () => {
  assert.ok(batsAt(0, false).every(bat => !bat.visible));
  assert.ok(batsAt(8000, false).every(bat => bat.visible));
  assert.ok(batsAt(18000, false).every(bat => !bat.visible));
  assert.ok(batsAt(30000, false).every(bat => bat.visible));
  for (let time = 0; time <= 100000; time += 137) {
    const bats = batsAt(time, false);
    assert.equal(bats.length, 2);
    for (const bat of bats) {
      assert.ok(bat.y >= 227 && bat.y <= 305);
      assert.ok(bat.opacity >= 0 && bat.opacity <= .85);
      if (bat.visible) assert.ok(bat.x >= -60 && bat.x <= 1000);
    }
    assert.ok(batsAt(time, true).every(bat => !bat.visible && bat.opacity === 0));
  }
});

test('pause freezes flight, wing pose, fog and lighting and excludes long wall-time gaps', () => {
  let now = 0;
  const playback = new Playback({ now: () => now });
  const combined = () => ({ bats: batsAt(playback.elapsedMs, false), fog: fogAt(playback.elapsedMs, false), light: lightingAt(playback.elapsedMs, false) });
  playback.start();
  now = 6400;
  playback.pause();
  const frozen = combined();
  now += 90000;
  assert.deepEqual(combined(), frozen);
  playback.resume();
  assert.deepEqual(combined(), frozen);
  now += 1000;
  assert.deepEqual(batsAt(playback.elapsedMs, false), batsAt(7400, false));
});
