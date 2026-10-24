import test from 'node:test';
import assert from 'node:assert/strict';
import {Ending} from '../../src/js/ending.js';
import {Playback} from '../../src/js/playback.js';

test('claim is deliberate and idempotent; park fades in order, wheel last, with a held ending',()=>{
  const ending=new Ending();
  assert.equal(ending.claim(100,false),false);assert.equal(ending.snapshot(20000).claimed,false);
  assert.equal(ending.claim(1000,true),true);assert.equal(ending.claim(3000,true),false);
  const early=ending.snapshot(3000);assert.ok(early.site<.3);assert.equal(early.carousel,1);assert.equal(early.wheel,1);
  const middle=ending.snapshot(6000);assert.ok(middle.carousel<.1);assert.ok(middle.stall>middle.carousel);assert.equal(middle.wheel,1);
  const last=ending.snapshot(9000);assert.equal(last.site,0);assert.equal(last.carousel,0);assert.equal(last.stall,0);assert.ok(last.wheel>0);
  const gone=ending.snapshot(11000);assert.equal(gone.gone,true);assert.equal(gone.wheel,0);assert.equal(gone.fog,0);
  assert.equal(gone.storyLevel,0);assert.equal(gone.windLevel,0);assert.deepEqual(gone.token,[50,46,36]);
  assert.equal(ending.snapshot(12999).resting,false);assert.equal(ending.snapshot(13000).resting,true);
});

test('pause freezes ending poses, token travel, audio fades and hold; reduced motion keeps a stationary token',()=>{
  let now=0;const clock=new Playback({now:()=>now}),ending=new Ending();clock.start();ending.claim(0,true);
  let previousStory=1,previousWind=1;
  for(const age of [200,2200,5000,8000,10000,11900]) {
    now+=age-clock.elapsedMs;clock.pause();const frozen=ending.snapshot(clock.elapsedMs);
    now+=60000;assert.deepEqual(ending.snapshot(clock.elapsedMs),frozen);
    const reduced=ending.snapshot(clock.elapsedMs,true);assert.deepEqual(reduced.token,[50,46,36]);
    assert.equal(reduced.wheel,frozen.wheel);assert.equal(reduced.storyLevel,frozen.storyLevel);
    assert.ok(frozen.storyLevel<=previousStory&&frozen.windLevel<=previousWind);
    previousStory=frozen.storyLevel;previousWind=frozen.windLevel;clock.resume();
  }
  now+=100;clock.finish();assert.equal(clock.state,'ended');const finished=clock.snapshot();
  now+=60000;clock.resume();clock.start();clock.pause();assert.deepEqual(clock.snapshot(),finished);
  assert.equal(clock.canInteract,false);
});
