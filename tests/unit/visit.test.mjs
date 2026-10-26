import test from 'node:test';
import assert from 'node:assert/strict';
import {Visit} from '../../src/js/visit.js';

test('each booth completion awards exactly one stackable ticket; rerenders and stale completions cannot duplicate it',()=>{
  const visit=new Visit();assert.equal(visit.canPlay('carousel'),false);
  for(let i=1;i<=4;i++) {
    assert.equal(visit.award(i,i*8000),true);assert.equal(visit.award(i,i*8000),false);
    assert.equal(visit.tickets,i);assert.equal(visit.snapshot().carouselUnlocked,true);assert.equal(visit.snapshot().prizeUnlocked,true);
  }
  assert.equal(visit.award(2,40000),false);assert.equal(visit.tickets,4);
});

test('only accepted starts charge; wrong notes, retries and resumed paid input never charge again',()=>{
  const visit=new Visit();let actions=0;
  assert.equal(visit.play('carousel',0,()=>{actions++;return true;}),false);assert.equal(actions,0);
  visit.award(2,0);
  assert.equal(visit.play('invalid',0,()=>true),false);
  assert.equal(visit.play('carousel',0,()=>false),false);assert.equal(visit.tickets,2);
  assert.equal(visit.play('carousel',1,()=>true),true);assert.equal(visit.tickets,1);
  for(let i=0;i<10;i++)assert.equal(visit.play('carousel',i+2,()=>true),true);
  assert.equal(visit.tickets,1);assert.equal(visit.spent,1);
  assert.equal(visit.play('prize',20,()=>true),true);
  for(let i=0;i<20;i++)assert.equal(visit.play('prize',i+30,()=>true),true);
  assert.equal(visit.tickets,0);assert.equal(visit.spent,2);
});

test('both orders award one token after both successful stories; paid replays and stale completion reports preserve it',()=>{
  for(const order of [['carousel','prize'],['prize','carousel']]) {
    const visit=new Visit();visit.award(4,0);
    for(const [i,name] of order.entries()) {
      visit.play(name,i*10000,()=>true);assert.equal(visit.snapshot().souvenirTokens,0);
      assert.equal(visit.complete(name,1,i*10000+8000),true);
      assert.equal(visit.snapshot().souvenirTokens,i===1?1:0);
      assert.equal(visit.complete(name,1,20000),false);
    }
    const tokenAt=visit.tokenAt;
    for(const name of order) {
      assert.equal(visit.play(name,30000,()=>true),true);
      assert.equal(visit.complete(name,1,30000),false,'A stale report cannot end the new paid replay');
      assert.equal(visit.active[name],true);
      assert.equal(visit.complete(name,2,38000),true);
    }
    assert.equal(visit.tokenAt,tokenAt);assert.equal(visit.snapshot().souvenirTokens,1);assert.equal(visit.tickets,0);
  }
});

test('successful replay needs a fresh ticket, unfinished paid activities survive switching and later booth visits',()=>{
  const visit=new Visit();visit.award(2,0);visit.play('carousel',1,()=>true);visit.play('prize',2,()=>true);
  assert.deepEqual(visit.active,{carousel:true,prize:true});
  visit.complete('prize',1,9000);assert.equal(visit.play('prize',9100,()=>true),false);
  assert.equal(visit.play('carousel',9200,()=>true),true,'The other activity remains paid at zero balance');
  visit.award(3,17000);assert.equal(visit.tickets,1);
  assert.equal(visit.play('prize',18000,()=>false),false);assert.equal(visit.tickets,1);
  assert.equal(visit.play('prize',18001,()=>true),true);assert.equal(visit.tickets,0);
  assert.equal(visit.complete('carousel',1,19000),true);assert.equal(visit.snapshot().souvenirTokens,1);
});

test('reading frozen visit state cannot spend/award; new Revisit starts with no balance, activities or souvenir',()=>{
  const visit=new Visit();visit.award(3,0);visit.play('prize',1,()=>true);const before=visit.snapshot();
  for(let i=0;i<100;i++)assert.deepEqual(visit.snapshot(),before);
  before.active.prize=false;assert.equal(visit.active.prize,true,'Snapshots cannot mutate paid sessions');
  const fresh=new Visit();assert.equal(fresh.tickets,0);assert.equal(fresh.issued,0);assert.equal(fresh.snapshot().souvenirTokens,0);
  assert.deepEqual(fresh.active,{carousel:false,prize:false});
});
