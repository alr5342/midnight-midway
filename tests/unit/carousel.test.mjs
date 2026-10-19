import test from 'node:test';
import assert from 'node:assert/strict';
import {CarouselPuzzle} from '../../src/js/carousel.js';
import {Playback} from '../../src/js/playback.js';

test('admission gates notes; exact four-note sequence solves and can be replayed',()=>{
  const puzzle=new CarouselPuzzle();
  assert.equal(puzzle.play('left',0),false);
  puzzle.unlock(100);
  for(let replay=0;replay<2;replay++) {
    ['left','right','center','left'].forEach((note,index)=>{
      puzzle.play(note,200+replay*4000+index*500);
      assert.equal(puzzle.progress,index+1);
    });
    assert.equal(puzzle.snapshot(2000+replay*4000).solved,true);
  }
});
test('a wrong note clears only the attempt, produces discord and retains learned progress',()=>{
  const puzzle=new CarouselPuzzle();puzzle.unlock(0);
  puzzle.play('left',10);puzzle.play('center',20);
  assert.equal(puzzle.snapshot(20).progress,0);
  assert.equal(puzzle.snapshot(20).mistake,true);
  assert.equal(puzzle.snapshot(20).cues.length,2);
  assert.equal(puzzle.snapshot(800).mistake,false);
  for(const note of ['left','right','center','left'])puzzle.play(note,1000);
  puzzle.play('right',2000);
  assert.equal(puzzle.snapshot(2000).solved,true);
  assert.equal(puzzle.snapshot(2000).progress,0);
});
test('pause freezes note feedback/cues and hint age; repeated unlock cannot restart hints',()=>{
  let now=0;const playback=new Playback({now:()=>now});const puzzle=new CarouselPuzzle();
  playback.start();puzzle.unlock(playback.elapsedMs);puzzle.play('left',0);
  now=100;playback.pause();const state=puzzle.snapshot(playback.elapsedMs);
  now+=60000;assert.deepEqual(puzzle.snapshot(playback.elapsedMs),state);
  playback.resume();puzzle.unlock(playback.elapsedMs);
  now+=12000;assert.match(puzzle.snapshot(playback.elapsedMs).hint,/scrap/);
  now+=12000;assert.match(puzzle.snapshot(playback.elapsedMs).hint,/returns/);
});
test('notes have distinct minor-triad pitches; clue feedback cannot replay an old note',()=>{
  const puzzle=new CarouselPuzzle();puzzle.unlock(0);
  const rates=[];
  for(const [index,note] of ['left','right','center'].entries()) {
    puzzle.play(note,index*1000);rates.push(puzzle.snapshot(index*1000).cues[0].rate);
  }
  assert.equal(new Set(rates).size,3);
  const id=puzzle.snapshot(2010).cues[0].id;
  puzzle.inspect(2010);assert.equal(puzzle.snapshot(2010).cues[0].id,id);
});
