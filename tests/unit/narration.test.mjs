import test from 'node:test';
import assert from 'node:assert/strict';
import {selectNarration} from '../../src/js/narration.js';
import {TicketStory} from '../../src/js/ticket-story.js';
import {CarouselPuzzle} from '../../src/js/carousel.js';
import {PrizeGame} from '../../src/js/prize.js';
import {Ending} from '../../src/js/ending.js';
import {Playback} from '../../src/js/playback.js';

function journey() {
  const booth = new TicketStory(), carousel = new CarouselPuzzle(), prize = new PrizeGame(), ending = new Ending();
  const read = (time, objective, extra = {}) => selectNarration({
    clock: {state: 'exploring', elapsedMs: time}, objective,
    booth: booth.snapshot(time), carousel: {...carousel.snapshot(time), clueOpen: false},
    prize: prize.snapshot(time), ending: {...ending.snapshot(time), ready: true}, ...extra
  });
  const admit = () => {for(let i=0;i<3;i++)booth.ring(0);booth.snapshot(8000);carousel.unlock(8000);};
  const ride = () => {carousel.play('center',9000);for(const note of ['left','right','center','left'])carousel.play(note,9000);carousel.snapshot(17000);prize.unlock(17000);};
  return {booth, carousel, prize, ending, read, admit, ride};
}

test('immediate next input preempts admission handoff; stale partial bell replay cannot steal the objective', () => {
  const j=journey();j.admit();
  assert.match(j.read(8000,'carousel').text,/Your ticket promises a ride/);
  j.carousel.play('left',8000);
  assert.equal(j.read(8000,'carousel').text,'The painted horses have forgotten how the music goes.');
  j.booth.ring(9000);
  assert.equal(j.read(9100,'carousel').owner,'carousel');
  j.ride();
  assert.equal(j.read(17500,'prize').text,'Beyond the carousel, the prize stall seems to be waiting for someone.');
  j.prize.throwAt('top',17500);j.prize.snapshot(18150);
  assert.equal(j.read(19000,'prize').owner,'prize');
  assert.match(j.read(19000,'prize').text,/One bag remains/);
});

test('inspection owns its exact open interval, including immediately after admission', () => {
  const j=journey();j.admit();j.carousel.inspect(8000);
  const open={...j.carousel.snapshot(8000),clueOpen:true};
  assert.equal(j.read(8000,'carousel',{carousel:open}).text,'The ink kept the tune; the horses kept its voices.');
  assert.equal(j.read(8000,'carousel').text,'The painted horses have forgotten how the music goes.');
  j.ride();j.carousel.inspect(18000);
  assert.equal(j.read(18000,'prize',{carousel:{...j.carousel.snapshot(18000),clueOpen:true}}).owner,'inspection');
  assert.equal(j.read(18000,'prize').owner,'prize');
});

test('completed horse feedback is quiet; intentional replay owns only its story and cannot repeat the handoff', () => {
  const j=journey();j.admit();j.ride();j.carousel.play('right',22000);
  assert.equal(j.read(22000,'prize').owner,'prize');
  for(const note of ['left','right','center','left'])j.carousel.play(note,23000);
  assert.equal(j.read(25000,'prize').owner,'carousel-story');
  const later=j.read(31100,'prize');
  assert.equal(later.owner,'prize');assert.doesNotMatch(later.text,/Beyond the carousel/);
  assert.equal(j.carousel.snapshot(31100).completedAt,17000,'Narration metadata retains the first completion');
});

test('wrong-note text outlives its glint, yields to new input, and does not reveal the sequence', () => {
  const j=journey();j.admit();j.carousel.play('right',9000);
  assert.equal(j.carousel.snapshot(10000).mistake,false,'Existing short visual feedback is unchanged');
  assert.match(j.read(10000,'carousel').text,/missing bars/);
  assert.match(j.read(12000,'carousel').text,/missing bars/);
  j.carousel.play('left',12000);
  assert.doesNotMatch(j.read(12000,'carousel').text,/missing bars/);
  const hints=[12000,24000,36000].map(time=>j.carousel.snapshot(time).hint);
  assert.equal(new Set(hints).size,3);assert.ok(hints.every(text=>!/left|right|center|centre/i.test(text)));
});

test('throws retain pre-throw prose; one-bag and failed-round recovery hints keep progressing', () => {
  const j=journey();j.admit();j.ride();
  const before=j.read(21000,'prize').text;
  j.prize.throwAt('top',21000);
  assert.equal(j.read(21100,'prize').text,before);
  j.prize.snapshot(21650);
  assert.match(j.read(22000,'prize').text,/One bag remains/);
  assert.match(j.read(36000,'prize').text,/deeper dents/);
  const second=j.read(36000,'prize').text;j.prize.throwAt('left',36000);
  assert.equal(j.read(36100,'prize').text,second);
  assert.match(j.read(36700,'prize').text,/beanbag boxes/);
  assert.equal(j.read(49000,'prize').text,'The returned beanbags are yours to take.');
  j.prize.retry(49000);assert.equal(j.read(49000,'prize').owner,'prize');assert.equal(j.prize.bags,2);
});

test('waiting token outranks partial completed activities, while a full booth replay remains available', () => {
  const j=journey();j.admit();j.ride();j.prize.throwAt('left',18000);j.prize.snapshot(18650);j.prize.throwAt('right',19000);
  assert.equal(j.read(20000,'prize').owner,'prize-story');
  assert.equal(j.read(28000,'token').text,'Perhaps this place has one last thing to give.');
  assert.equal(j.read(28000,'token',{ending:{...j.ending.snapshot(28000),ready:false,assetFailure:true}}).text,
    'The ending artwork could not load. Reload to try again.');
  j.booth.ring(28000);j.carousel.play('right',28000);
  assert.equal(j.read(28000,'token').owner,'token');
  j.booth.ring(28500);j.booth.ring(29000);
  assert.equal(j.read(30000,'token').owner,'booth-story');
  assert.equal(j.read(37100,'token').owner,'token');
  assert.equal(j.booth.completed,2);assert.equal(j.prize.tokenAwarded,true);
});

test('pause freezes copy age; warnings, ending and final quiet follow the shared priority rule', () => {
  const j=journey();j.admit();let now=0;const clock=new Playback({now:()=>now});clock.start();now=24000;
  const before=j.read(clock.elapsedMs,'carousel');clock.pause();now+=60000;
  assert.equal(j.read(clock.elapsedMs,'carousel',{clock:clock.snapshot()}).text,'Paused. Choose Play to continue.');
  clock.resume();assert.deepEqual(j.read(clock.elapsedMs,'carousel'),before);
  assert.equal(j.read(24000,'carousel',{warning:'Sound could not load.'}).owner,'notice');
  j.ending.claim(25000,true);
  assert.equal(j.read(26000,'token',{warning:'Old warning'}).text,'Some places can only stay for a little while.');
  assert.equal(j.read(29000,'token').text,'The night lets go of what it borrowed.');
  assert.equal(j.read(31500,'token').text,'Keep something of this night.');
  assert.equal(j.read(33100,'token').hidden,true);
});

test('objective is supplied by the coordinator, independent of local attraction prose', () => {
  const j=journey();
  assert.equal(j.read(1000,'prize').text,'The old sign still offers a chance at a prize.');
  assert.equal(j.read(1000,'carousel').text,'The painted horses have forgotten how the music goes.');
  assert.equal(j.read(0,'booth',{clock:{state:'start',elapsedMs:0}}).hidden,true);
});
