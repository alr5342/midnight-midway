import test from 'node:test';
import assert from 'node:assert/strict';
import {guidanceAt} from '../../src/js/guidance.js';
import {CarouselPuzzle} from '../../src/js/carousel.js';
import {PrizeGame} from '../../src/js/prize.js';
import {Playback} from '../../src/js/playback.js';

test('guidance grows on active time, stays bounded and uses stationary reduced-motion light',()=>{
  assert.equal(guidanceAt(0,0).strength,0);
  assert.ok(guidanceAt(24000,0).strength>guidanceAt(12000,0).strength);
  assert.equal(guidanceAt(100000,0).strength,1);
  assert.equal(guidanceAt(24000,0,true).halo,guidanceAt(24000,0,true).strength);
  let now=0;const clock=new Playback({now:()=>now});clock.start();now=24000;clock.pause();
  const frozen=guidanceAt(clock.elapsedMs,0);now+=60000;assert.deepEqual(guidanceAt(clock.elapsedMs,0),frozen);
});

test('wrong melody spam does not suppress help; genuine new prefix progress restarts its wait',()=>{
  const ride=new CarouselPuzzle();ride.unlock(0);ride.play('right',12000);ride.play('right',24000);
  assert.ok(ride.snapshot(24000).guidance.strength>0);
  ride.play('left',24000);assert.equal(ride.snapshot(24000).guidance.strength,0);
  ride.play('center',25000);ride.play('left',26000);
  assert.ok(ride.snapshot(40000).guidance.strength>0,'Repeated already-known prefix does not keep resetting the timer');
});

test('returned bags settle into pickup positions, recovery is idempotent and repeated failures strengthen help',()=>{
  const game=new PrizeGame();game.unlock(0);game.throwAt('top',0);game.snapshot(650);game.throwAt('left',700);
  const landing=game.snapshot(1350);assert.equal(landing.pickupAvailable,true);assert.equal(landing.bagReturn.opacity,0);
  assert.equal(game.snapshot(1800).bagReturn.opacity,1);assert.equal(game.snapshot(1800).bagReturn.y,0);
  assert.equal(game.snapshot(1400,true).bagReturn.y,0);
  assert.equal(game.retry(1800),true);assert.equal(game.retry(1800),false,'A second pickup cannot double-reset or spend a throw');
  assert.equal(game.bags,2);assert.equal(game.down.size,0);
  game.throwAt('top',2000);game.snapshot(2650);game.throwAt('right',2700);
  assert.ok(game.snapshot(3350).guidance.strength>=.36);
});
