import test from 'node:test';
import assert from 'node:assert/strict';
import {selectNarration} from '../../src/js/narration.js';
import {Visit} from '../../src/js/visit.js';
import {TicketStory} from '../../src/js/ticket-story.js';
import {CarouselPuzzle} from '../../src/js/carousel.js';
import {PrizeGame} from '../../src/js/prize.js';
import {Ending} from '../../src/js/ending.js';

function journey() {
  const visit=new Visit(),booth=new TicketStory(),carousel=new CarouselPuzzle(),prize=new PrizeGame(),ending=new Ending();
  function context(time) {
    const bell=booth.snapshot(time);visit.award(bell.completed,time);
    if(visit.issued) {carousel.unlock(time);prize.unlock(time);}
    const ride=carousel.snapshot(time),game=prize.snapshot(time);
    visit.complete('carousel',ride.completedStories,time);visit.complete('prize',game.completedStories,time);
    return {clock:{state:'exploring',elapsedMs:time},visit:visit.snapshot(),booth:bell,
      carousel:{...ride,clueOpen:false},prize:game,ending:{...ending.snapshot(time),ready:true}};
  }
  const read=(time,extra={})=>selectNarration({...context(time),...extra});
  const admit=(time=0)=>{for(let i=0;i<3;i++)booth.ring(time);context(time+8000);};
  const note=(name,time)=>{context(time);return visit.play('carousel',time,()=>carousel.play(name,time));};
  const aim=(name,time)=>{context(time);return visit.play('prize',time,()=>prize.throwAt(name,time));};
  const ride=time=>{for(const name of ['left','right','center','left'])note(name,time);context(time+8000);};
  const win=time=>{aim('left',time);context(time+650);aim('right',time+700);context(time+9350);};
  return {visit,booth,carousel,prize,ending,context,read,admit,note,aim,ride,win};
}

test('first ticket offers both choices; inspection is free and next accepted activity owns its hints',()=>{
  const j=journey();j.admit();assert.match(j.read(8000).text,/carousel and prize stall/);
  j.carousel.inspect(8000);const open={...j.carousel.snapshot(8000),clueOpen:true};
  assert.equal(j.read(8000,{carousel:open}).owner,'inspection');assert.equal(j.visit.tickets,1);
  j.note('left',8000);assert.equal(j.visit.tickets,0);
  assert.equal(j.read(8000).text,'The painted horses have forgotten how the music goes.');
  j.booth.ring(9000);assert.equal(j.read(9100).owner,'carousel');
});

test('prize-first success asks for another ticket and guides the remaining carousel without offering a token',()=>{
  const j=journey();j.admit();j.win(9000);
  assert.equal(j.visit.snapshot().souvenirTokens,0);assert.equal(j.read(19000).owner,'booth');
  assert.match(j.read(19000).text,/painted horses still wait/);assert.match(j.read(19000).text,/another ticket/);
  j.admit(20000);assert.equal(j.visit.tickets,1);
  assert.equal(j.read(32000).owner,'carousel');assert.doesNotMatch(j.read(32000).text,/prize stall/);
});

test('completed activity without payment cannot steal later hints; intentional paid replay owns only its activity',()=>{
  const j=journey();j.admit();j.ride(9000);j.admit(18000);
  j.aim('top',27000);assert.equal(j.read(28000).owner,'prize');
  assert.equal(j.note('right',28000),false);assert.equal(j.read(28000).owner,'prize');
  j.carousel.inspect(28000);
  assert.equal(j.read(28000,{carousel:{...j.carousel.snapshot(28000),clueOpen:true}}).owner,'inspection');
  assert.equal(j.read(28000).owner,'prize');
  j.admit(29000);j.note('right',38000);assert.equal(j.read(38000).owner,'carousel');
  assert.equal(j.visit.spent,3);
});

test('wrong-note text remains readable and yields to new input without stating the sequence',()=>{
  const j=journey();j.admit();j.note('right',9000);
  assert.equal(j.carousel.snapshot(10000).mistake,false);assert.match(j.read(12000).text,/missing bars/);
  j.note('left',12000);assert.doesNotMatch(j.read(12000).text,/missing bars/);
  const hints=[12000,24000,36000].map(time=>j.read(time).text);
  assert.equal(new Set(hints).size,3);assert.ok(hints.every(line=>!/left|right|center|centre/i.test(line)));
  assert.equal(j.visit.spent,1);
});

test('failed-round pickup remains paid; throws preserve prose and one-bag guidance continues',()=>{
  const j=journey();j.admit();j.aim('top',9000);const before=j.read(9100).text;
  assert.match(before,/old sign/);assert.match(j.read(10000).text,/One bag remains/);
  assert.match(j.read(24000).text,/deeper dents/);j.aim('right',24000);
  assert.match(j.read(24100).text,/deeper dents/);assert.match(j.read(24700).text,/beanbag boxes/);
  assert.equal(j.read(37000).text,'The returned beanbags are yours to take.');
  j.visit.play('prize',37000,()=>j.prize.retry(37000));
  assert.equal(j.visit.tickets,0);assert.equal(j.visit.spent,1);assert.equal(j.read(37000).owner,'prize');
});

test('both completion orders finish at the waiting souvenir; token copy uses its own award age',()=>{
  for(const order of [['carousel','prize'],['prize','carousel']]) {
    const j=journey();j.admit();j.admit(9000);
    let time=18000;
    for(const name of order) {if(name==='carousel')j.ride(time);else j.win(time);time+=10000;}
    assert.equal(j.visit.snapshot().souvenirTokens,1);
    assert.equal(j.read(time).text,'Perhaps this place has one last thing to give.');
    j.booth.ring(time);assert.equal(j.read(time).owner,'token');
    assert.equal(j.read(time+12000).text,'The token waits for your hand.');
    assert.equal(j.read(time,{ending:{...j.ending.snapshot(time),ready:false,assetFailure:true}}).owner,'notice');
  }
});

test('stories, inspection, Pause and ending retain their priority over paid activity hints',()=>{
  const j=journey();j.admit();j.admit(9000);j.note('left',18000);j.aim('top',19000);
  assert.equal(j.read(19100).owner,'prize');j.booth.ring(20000);j.booth.ring(20000);j.booth.ring(20000);
  assert.equal(j.read(22000).owner,'booth-story');
  const frozen=j.context(22000);
  assert.equal(selectNarration({...frozen,clock:{state:'paused',elapsedMs:22000}}).text,'Paused. Choose Play to continue.');
  assert.equal(selectNarration(frozen).owner,'booth-story');
  assert.equal(j.visit.spent,2);
  j.ending.claim(30000,true);
  assert.equal(j.read(31000,{warning:'Old warning'}).text,'Some places can only stay for a little while.');
  assert.equal(j.read(34100).text,'The night lets go of what it borrowed.');
  assert.equal(j.read(36500).text,'Keep something of this night.');
  assert.equal(j.read(38100).hidden,true);
});

test('fresh start hides narration; no-order discovery stays local and uses no fixed carousel-to-stall handoff',()=>{
  const j=journey();assert.equal(j.read(0,{clock:{state:'start',elapsedMs:0}}).hidden,true);
  j.admit();j.admit(9000);assert.equal(j.read(17100).owner,'choice');
  j.win(18000);assert.equal(j.read(29000).owner,'carousel');
  assert.doesNotMatch(j.read(29000).text,/Beyond the carousel/);
});
