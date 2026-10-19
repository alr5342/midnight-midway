import test from 'node:test';
import assert from 'node:assert/strict';
import {CarouselPuzzle} from '../../src/js/carousel.js';
import {Playback} from '../../src/js/playback.js';
import {readFile} from 'node:fs/promises';

test('carousel tone is an original non-clipping pitched WAV with a quiet tail, not the booth recording',async()=>{
  const wav=await readFile(new URL('../../assets/audio/carousel-box.wav',import.meta.url));
  const bell=await readFile(new URL('../../assets/audio/story-ring-2.wav',import.meta.url));
  assert.notDeepEqual(wav,bell);
  assert.equal(wav.toString('ascii',0,4),'RIFF');
  assert.equal(wav.readUInt16LE(22),1);
  const rate=wav.readUInt32LE(24),samples=[];
  for(let i=44;i<wav.length;i+=2)samples.push(wav.readInt16LE(i)/32768);
  assert.equal(samples.length/rate,.8);
  assert.ok(Math.max(...samples.map(Math.abs))>.4&&Math.max(...samples.map(Math.abs))<.43);
  let crossings=0;
  for(let i=Math.ceil(.05*rate);i<.2*rate;i++)if(samples[i-1]<=0&&samples[i]>0)crossings++;
  assert.ok(Math.abs(crossings/.15-523.251)<10,'Fundamental should be musical C5');
  assert.ok(samples.slice(-100).every(value=>Math.abs(value)<.001),'Tail must fade rather than click');
  const puzzle=new CarouselPuzzle();puzzle.unlock(0);puzzle.play('left',0);
  assert.equal(puzzle.snapshot(0).cues[0].name,'carousel-box');
});

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
  now+=12000;assert.match(puzzle.snapshot(playback.elapsedMs).hint,/path/);
  now+=12000;assert.match(puzzle.snapshot(playback.elapsedMs).hint,/ink rises/);
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
