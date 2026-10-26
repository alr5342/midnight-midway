import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PrizeGame} from '../../src/js/prize.js';
import {Playback} from '../../src/js/playback.js';

test('admission/ride gate, supported stack and two bags are deterministic in either winning order',()=>{
  for(const [first,last] of [['left','right'],['right','left']]) {
    const game=new PrizeGame();assert.equal(game.throwAt(first,0),false);
    game.unlock(0);assert.equal(game.throwAt(first,0),true);
    assert.equal(game.bags,1);assert.equal(game.throwAt(last,100),false,'Rapid taps cannot spend another bag');
    assert.equal(game.snapshot(200).down.length,0,'Can is not down before impact');
    const settled=game.snapshot(650);assert.deepEqual(new Set(settled.down),new Set([first,'top']));
    assert.equal(game.throwAt(first,700),false,'Down cans never consume a bag');
    assert.equal(game.throwAt(last,700),true);assert.equal(game.bags,0);
    assert.equal(game.snapshot(1349).playing,false);
    assert.equal(game.snapshot(1350).playing,true);
    assert.equal(game.snapshot(9349).completed,false,'Milestone waits for full story');
    assert.equal(game.snapshot(9350).completed,true);
    assert.equal(game.snapshot(9350).completedStories,1);
    assert.equal(game.snapshot(20000).completedStories,1);
  }
});

test('top-first loses; explicit retry resets only the attempt, replay preserves completed prize history',()=>{
  const game=new PrizeGame();game.unlock(0);
  game.throwAt('top',0);game.snapshot(650);game.throwAt('left',700);
  assert.equal(game.snapshot(1350).failed,true);assert.equal(game.throwAt('right',3000),false);
  assert.equal(game.completed,false);assert.equal(game.retry(3000),true);
  assert.equal(game.bags,2);assert.equal(game.down.size,0);
  game.throwAt('left',3000);game.snapshot(4450);game.throwAt('right',4500);
  assert.equal(game.snapshot(13950).completed,true);
  assert.equal(game.retry(14000),true);assert.equal(game.completed,true);
  game.throwAt('top',14000);game.snapshot(15450);game.throwAt('right',15500);
  assert.equal(game.snapshot(16950).failed,true);assert.equal(game.completed,true);
  assert.match(game.snapshot(16950).hint,/boxes/);
  game.retry(17000);game.throwAt('right',17000);game.snapshot(18450);game.throwAt('left',18500);
  assert.equal(game.snapshot(27950).completedStories,2);
  assert.equal(game.snapshot(27950).completed,true);
});

test('shared pause freezes throws, story, hints and cues; reduced motion removes travel, retains timing/feedback',()=>{
  let now=0;const clock=new Playback({now:()=>now}),game=new PrizeGame();clock.start();game.unlock(0);
  game.throwAt('left',0);
  for(const age of [200,600,700]) {
    now+=age-clock.elapsedMs;clock.pause();const frozen=game.snapshot(clock.elapsedMs);
    now+=60000;assert.deepEqual(game.snapshot(clock.elapsedMs),frozen);clock.resume();
    const reduced=game.snapshot(clock.elapsedMs,true);
    assert.ok(reduced.canPos.every(can=>can.x===0&&can.y===0&&can.tilt===0));
    assert.deepEqual(reduced.cues,frozen.cues);assert.equal(reduced.flying.tilt,0);
  }
  game.throwAt('right',clock.elapsedMs);
  for(const age of [3500,5000,8500,10500]) {
    now+=age-clock.elapsedMs;clock.pause();const frozen=game.snapshot(clock.elapsedMs);
    now+=60000;assert.deepEqual(game.snapshot(clock.elapsedMs),frozen);clock.resume();
    const reduced=game.snapshot(clock.elapsedMs,true);
    assert.equal(reduced.prizeY,0);assert.equal(reduced.playing,frozen.playing);
  }
});

test('environmental hints progress on active time without spelling out the winning order',()=>{
  const game=new PrizeGame();game.unlock(0);game.unlock(30000);
  const hints=[0,14000,28000].map(time=>game.snapshot(time).hint);
  assert.equal(new Set(hints).size,3);assert.ok(!hints.some(text=>/\bleft\b|\bright\b|top first|two throws/i.test(text)));
});

test('new original sounds have valid distinct PCM samples with clean bounded peaks and quiet tails',async()=>{
  const fingerprints=[];
  for(const name of ['prize-throw','prize-tin','prize-chime']) {
    const wav=await readFile(new URL(`../../assets/audio/${name}.wav`,import.meta.url));
    assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.readUInt32LE(24),22050);
    let peak=0,tail=0;
    for(let i=44;i<wav.length;i+=2) {const value=Math.abs(wav.readInt16LE(i))/32767;peak=Math.max(peak,value);if(i>wav.length-220)tail=Math.max(tail,value);}
    assert.ok(peak>.1&&peak<.5);assert.ok(tail<.03);fingerprints.push(wav.toString('base64'));
  }
  assert.equal(new Set(fingerprints).size,3);
});

test('fast settling leaves audible tin tails, rejects rapid input and permits an immediate settled second aim',()=>{
  const game=new PrizeGame();game.unlock(0);game.throwAt('left',0);
  assert.equal(game.throwAt('right',649),false);
  assert.equal(game.snapshot(650).throwing,false);
  assert.ok(game.snapshot(650).cues.some(cue=>cue.name==='prize-tin'),'No dead wait for audio decay');
  assert.equal(game.throwAt('right',650),true);
  assert.ok(game.snapshot(700).cues.some(cue=>cue.id==='tin-1-left'),'First hit can finish under the next throw');
  assert.equal(game.snapshot(1300).playing,true);
});

test('stall wake-up has light and quiet sound once, freezes with the clock and settles without a new instruction',()=>{
  const game=new PrizeGame();game.unlock(1000);
  assert.ok(game.snapshot(1500).wakeLight>0);
  assert.ok(game.snapshot(1500).cues.some(cue=>cue.id.startsWith('stall-wake')&&cue.gain<.2));
  assert.equal(game.snapshot(4500).wakeLight,0);game.unlock(10000);assert.equal(game.snapshot(10000).wakeLight,0);
  assert.ok(game.snapshot(1500,true).wakeLight>0);
});
