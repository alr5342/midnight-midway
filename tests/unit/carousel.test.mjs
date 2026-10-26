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
      puzzle.play(note,200+replay*12000+index*500);
      assert.equal(puzzle.progress,index+1);
    });
    assert.equal(puzzle.snapshot(2000+replay*12000).solved,true);
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
  puzzle.play('right',10000);
  assert.equal(puzzle.snapshot(10000).solved,true);
  assert.equal(puzzle.snapshot(10000).progress,0);
});
test('pause freezes note feedback/cues and hint age; repeated unlock cannot restart hints',()=>{
  let now=0;const playback=new Playback({now:()=>now});const puzzle=new CarouselPuzzle();
  playback.start();puzzle.unlock(playback.elapsedMs);puzzle.play('left',0);
  now=100;playback.pause();const state=puzzle.snapshot(playback.elapsedMs);
  now+=60000;assert.deepEqual(puzzle.snapshot(playback.elapsedMs),state);
  playback.resume();puzzle.unlock(playback.elapsedMs);
  now+=12000;assert.match(puzzle.snapshot(playback.elapsedMs).hint,/Rain/);
  now+=12000;assert.match(puzzle.snapshot(playback.elapsedMs).hint,/higher voices/);
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

test('correct tune owns eight active seconds, staggers original horses, settles and allows progress-safe replay',()=>{
  const puzzle=new CarouselPuzzle();puzzle.unlock(0);
  for(const note of ['left','right','center','left'])puzzle.play(note,0);
  assert.equal(puzzle.snapshot(0).phase,'lights');
  assert.equal(puzzle.play('right',500),false);
  const ride=puzzle.snapshot(3200);
  assert.equal(ride.phase,'ride');assert.ok(ride.light>.5);
  assert.equal(new Set(ride.horseY).size,3);
  assert.ok(ride.horseY.every(y=>y<=0&&y>=-15));
  assert.ok(puzzle.snapshot(2300).cues.some(cue=>cue.id.startsWith('ride-')));
  assert.equal(puzzle.snapshot(7000).phase,'settle');
  assert.equal(puzzle.snapshot(7999).playing,true);
  const idle=puzzle.snapshot(8000);
  assert.equal(idle.phase,'idle');assert.equal(idle.completed,true);
  assert.ok(idle.horseY.every(y=>y>=-4.8));assert.deepEqual(idle.cues,[]);
  puzzle.play('right',8500);
  assert.equal(puzzle.snapshot(8500).completed,true,'Wrong replay input cannot remove earned completion');
  for(const note of ['left','right','center','left'])puzzle.play(note,9000);
  assert.equal(puzzle.snapshot(9000).playing,true);
});

test('pause freezes payoff visuals/music and reduced motion retains beats without horse travel',()=>{
  let now=0;const clock=new Playback({now:()=>now}),puzzle=new CarouselPuzzle();
  clock.start();puzzle.unlock(0);
  for(const note of ['left','right','center','left'])puzzle.play(note,0);
  for(const age of [700,2300,4500,7000,9500]) {
    now+=age-clock.elapsedMs;clock.pause();const state=puzzle.snapshot(clock.elapsedMs);
    now+=30000;assert.deepEqual(puzzle.snapshot(clock.elapsedMs),state);
    const reduced=puzzle.snapshot(clock.elapsedMs,true);
    assert.deepEqual(reduced.horseY,[0,0,0]);assert.equal(reduced.phase,state.phase);
    clock.resume();assert.deepEqual(puzzle.snapshot(clock.elapsedMs),state);
  }
});

test('quiet completed tune loops seamlessly, freezes with active time and keeps its phase across replay',()=>{
  let now=0;const clock=new Playback({now:()=>now}),puzzle=new CarouselPuzzle();
  clock.start();puzzle.unlock(0);
  assert.deepEqual(puzzle.snapshot(0).musicCues,[]);
  for(const note of ['left','right','center','left'])puzzle.play(note,0);
  assert.deepEqual(puzzle.snapshot(7999).musicCues,[]);
  const first=puzzle.snapshot(8000).musicCues[0];
  assert.equal(first.gain,.22);assert.equal(first.rate,.5);
  now=9000;clock.pause();const frozen=puzzle.snapshot(clock.elapsedMs);
  now+=60000;assert.deepEqual(puzzle.snapshot(clock.elapsedMs),frozen);
  clock.resume();
  for(const note of ['left','right','center','left'])puzzle.play(note,9000);
  assert.equal(puzzle.snapshot(9000).musicCues[0].id,first.id,'Replay must not restart background music');
  const seam=puzzle.snapshot(20001).musicCues;
  assert.ok(seam.some(cue=>cue.id==='midway-tune-0-7'),'Previous tail must finish across the loop seam');
  assert.ok(seam.some(cue=>cue.id==='midway-tune-1-0'));
  assert.deepEqual(puzzle.snapshot(20001,true).musicCues,seam,'Reduced motion retains music');
});
