import test from 'node:test';
import assert from 'node:assert/strict';
import {TicketStory} from '../../src/js/ticket-story.js';
import {CarouselPuzzle} from '../../src/js/carousel.js';
import {PrizeGame} from '../../src/js/prize.js';
import {Playback} from '../../src/js/playback.js';
const melody=['left','right','center','left'];

test('booth restart cancels partial rings and an unearned story; completed admission remains recorded',()=>{
  const booth=new TicketStory();booth.ring(0);booth.ring(1);booth.restart(2);
  assert.equal(booth.snapshot(2).rings,0);
  for(let i=0;i<3;i++)booth.ring(100);
  booth.restart(2500);assert.equal(booth.snapshot(20000).completed,0);assert.deepEqual(booth.snapshot(20000).cues,[]);
  for(let i=0;i<3;i++)booth.ring(21000);
  assert.equal(booth.snapshot(29000).completed,1);
  booth.restart(30000);assert.equal(booth.snapshot(40000).completed,1);
});

test('carousel restart cancels unfinished playback and future music, but preserves earned ride and music phase',()=>{
  const ride=new CarouselPuzzle();ride.unlock(0);ride.play('left',0);ride.restart(100);
  assert.equal(ride.progress,0);for(const note of melody)ride.play(note,200);
  ride.restart(2000);assert.equal(ride.snapshot(20000).completed,false);assert.deepEqual(ride.snapshot(20000).musicCues,[]);
  for(const note of melody)ride.play(note,21000);
  assert.equal(ride.snapshot(29000).completed,true);const anchor=ride.musicStartedAt;
  for(const note of melody)ride.play(note,30000);
  ride.restart(32000);assert.equal(ride.snapshot(32000).playing,false);assert.equal(ride.snapshot(32000).completed,true);
  assert.equal(ride.musicStartedAt,anchor);assert.equal(ride.progress,0);
});

test('every legal losing pair recovers repeatedly; resets in flight and story cannot complete an abandoned attempt',()=>{
  for(const second of ['left','right']) {
    const game=new PrizeGame();game.unlock(0);
    for(let cycle=0;cycle<10;cycle++) {
      const base=cycle*2000;assert.equal(game.throwAt('top',base),true);game.snapshot(base+650);
      assert.equal(game.throwAt(second,base+700),true);assert.equal(game.snapshot(base+1350).failed,true);
      assert.equal(game.retry(base+1400),true);assert.equal(game.bags,2);assert.equal(game.down.size,0);
    }
  }
  for(const at of [100,400,1000,2000,6000]) {
    const game=new PrizeGame();game.unlock(0);game.throwAt('left',0);
    if(at>=1000) {game.snapshot(650);game.throwAt('right',700);}
    game.restart(at);const state=game.snapshot(25000);
    assert.equal(state.busy,false);assert.equal(state.bags,2);assert.deepEqual(state.down,[]);assert.equal(state.tokenAwarded,false);
  }
});

test('paused activity reset neither resumes time nor removes the earned token',()=>{
  let now=0;const clock=new Playback({now:()=>now}),game=new PrizeGame();clock.start();game.unlock(0);
  game.throwAt('left',0);game.snapshot(650);game.throwAt('right',700);game.snapshot(9350);
  now=10000;clock.pause();game.restart(clock.elapsedMs);now+=30000;
  assert.equal(clock.state,'paused');assert.equal(clock.elapsedMs,10000);
  assert.equal(game.snapshot(clock.elapsedMs).tokenAwarded,true);assert.equal(game.snapshot(clock.elapsedMs).bags,2);
});
