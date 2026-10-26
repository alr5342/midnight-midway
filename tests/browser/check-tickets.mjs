import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../../serve.mjs';

const output='tests/results/ticket-system';await mkdir(output,{recursive:true});
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE||'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const server=createPreviewServer({basePath:'/midnight-midway/'});await new Promise(r=>server.listen(4187,'127.0.0.1',r));
const browser=await chromium.launch({headless:true}),errors=[],checks=[],routes=[],layouts=[];
try {
  async function setup(reduced=false) {
    const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:reduced?'reduce':'no-preference'});
    page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
    await page.goto('http://127.0.0.1:4187/midnight-midway/?diagnostics');
    await page.waitForFunction(()=>!document.querySelector('#enter').disabled&&window.midwayDiagnostics.prize().ready&&window.midwayDiagnostics.ending().ready);
    await page.clock.install();await page.clock.pauseAt(new Date());
    const state=()=>page.evaluate(()=>({clock:window.midwayDiagnostics.snapshot(),visit:window.midwayDiagnostics.journey(),booth:window.midwayDiagnostics.story(),carousel:window.midwayDiagnostics.carousel(),prize:window.midwayDiagnostics.prize(),ending:window.midwayDiagnostics.ending()}));
    const advance=ms=>page.clock.runFor(ms);
    async function nativeReady() {
      for(let i=0;i<200;i++) {
        if(await page.evaluate(()=>window.midwayDiagnostics.audio().status==='playing'&&window.midwayDiagnostics.storyAudio().status==='ready'&&window.midwayDiagnostics.audio().contextState==='running'))return;
        await new Promise(r=>setTimeout(r,20));
      }
      assert.fail('Audio did not resume');
    }
    await page.locator('#enter').tap();await nativeReady();await advance(32);
    async function balance(issued,spent) {
      const v=(await state()).visit;
      assert.equal(v.ticketsIssued,issued);assert.equal(v.ticketsSpent,spent);assert.equal(v.admissionTickets,issued-spent);
      if(issued)assert.equal(await page.locator('#admission span').textContent(),`${issued-spent} ticket${issued-spent===1?'':'s'}`);
    }
    async function earn() {
      const old=(await state()).visit.ticketsIssued;
      for(let i=0;i<3;i++)await page.locator('#bell').tap();
      await advance(7900);assert.equal((await state()).visit.ticketsIssued,old);
      await advance(200);assert.equal((await state()).visit.ticketsIssued,old+1);
    }
    async function modal(label,escape=false) {
      const before=await state(),line=await page.locator('#hint').textContent();
      await page.locator('#credits-open').tap();await advance(15000);
      const paused=await state();
      for(const key of ['visit','booth','carousel','prize','ending'])assert.deepEqual(paused[key],before[key],label);
      assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
      if(escape)await page.keyboard.press('Escape');else await page.locator('#credits-close').tap();
      await nativeReady();assert.deepEqual((await state()).visit,before.visit);
      assert.equal(await page.locator('#hint').textContent(),line);checks.push(`Credits: ${label}`);
    }
    async function pause(label) {
      await page.locator('#playback').tap();const frozen=await state();await advance(15000);
      assert.deepEqual(await state(),frozen,label);
      await page.locator('#playback').tap();await nativeReady();assert.deepEqual((await state()).visit,frozen.visit);checks.push(`Pause: ${label}`);
    }
    async function pickup() {
      const bounds=await page.locator('.scene').first().boundingBox();
      await page.touchscreen.tap(bounds.x+bounds.width*.68,bounds.y+bounds.height*.71);
      assert.equal((await state()).prize.bags,2);assert.deepEqual((await state()).prize.down,[]);
    }
    const note=side=>page.locator(`[data-horse-note=${side}]`).tap();
    const aim=side=>page.locator(`[data-can=${side}]`).tap();
    async function melody() {for(const name of ['left','right','center','left'])await note(name);}
    async function win() {await aim('left');await advance(750);await aim('right');await advance(9500);}
    async function token() {
      const s=await state();assert.equal(s.visit.souvenirTokens,1);assert.equal(s.prize.tokenOffered,true);
      assert.equal(await page.locator('#claim-token').isVisible(),true);
      assert.equal(await page.locator('.prize-token').evaluate(el=>Number(el.style.opacity)),1);
      const left=await page.locator('.prize-token').evaluate(el=>parseFloat(getComputedStyle(el).left));
      assert.ok(Math.abs(left-(await page.locator('.scene').first().boundingBox()).width*.78)<.1,'Keep original stall position');
    }
    return {page,state,advance,balance,earn,modal,pause,pickup,note,aim,melody,win,token,nativeReady};
  }

  // Carousel first: earn while a paid puzzle is unfinished, fail/recover the
  // game at zero balance, then pay for and replay both stories without reload.
  const a=await setup();let {page}=a;
  await page.locator('[data-horse-note=left]').dispatchEvent('click');await page.locator('[data-can=left]').dispatchEvent('click');await a.balance(0,0);
  await a.earn();await a.balance(1,0);assert.equal((await a.state()).visit.prizeUnlocked,true);
  assert.equal(await page.locator('[data-can=top]').getAttribute('aria-disabled'),'false');
  await page.locator('#music-open').tap();await a.modal('free paper before starting',true);await page.locator('#music-close').tap();await a.balance(1,0);
  await a.note('right');await a.note('left');await a.note('center');await a.balance(1,1);
  await page.locator('[data-can=left]').dispatchEvent('click');await a.balance(1,1);
  assert.equal((await a.state()).prize.bags,2);await a.pause('paid melody at zero balance');await a.modal('paid melody');
  await a.earn();await a.balance(2,1);assert.equal((await a.state()).visit.active.carousel,true);
  await a.melody();await a.advance(2500);await a.modal('carousel story');
  await page.locator('[data-can=left]').dispatchEvent('click');await a.balance(2,1);
  await a.advance(5700);assert.equal((await a.state()).visit.completed.carousel,1);assert.equal((await a.state()).visit.souvenirTokens,0);
  await a.aim('top');await a.balance(2,2);
  await page.locator('[data-can=right]').dispatchEvent('click');assert.equal((await a.state()).prize.bags,1);
  await a.advance(100);await a.modal('paid bag flight');await a.advance(650);
  await a.aim('left');await a.advance(850);assert.equal((await a.state()).prize.failed,true);await a.pause('failed paid round');
  for(const [width,height] of [[280,568],[320,568],[390,844],[844,390]]) {
    await page.setViewportSize({width,height});await a.advance(500);await a.pickup();await a.balance(2,2);
    const layout=await page.locator('#admission').evaluate(el=>{const r=el.getBoundingClientRect();return {fits:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,noOverflow:document.documentElement.scrollWidth<=innerWidth};});
    assert.equal(layout.fits,true);assert.equal(layout.noOverflow,true);layouts.push({width,height,...layout});
    await a.aim('top');await a.advance(750);await a.aim('right');await a.advance(850);
  }
  await page.setViewportSize({width:390,height:844});await a.modal('repeat failure at zero tickets');await a.pickup();await a.win();
  await a.balance(2,2);await a.token();const tokenAt=(await a.state()).visit.tokenAt;
  await page.screenshot({path:`${output}/carousel-first-token.png`});
  await a.earn();await a.balance(3,2);
  await a.pickup();await a.balance(3,3);assert.equal(await page.locator('#claim-token').isVisible(),false,'Keep token out of replay aiming space');
  await a.aim('top');await a.advance(750);await a.aim('left');await a.advance(850);await a.pickup();await a.win();await a.balance(3,3);
  assert.equal((await a.state()).visit.completed.prize,2);assert.equal((await a.state()).visit.tokenAt,tokenAt);await a.token();
  await a.earn();await a.balance(4,3);await a.melody();await a.balance(4,4);await a.advance(8700);
  assert.equal((await a.state()).visit.completed.carousel,2);assert.equal((await a.state()).visit.tokenAt,tokenAt);await a.token();
  await a.modal('waiting earned token');
  await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));const interrupted=await a.state();await a.advance(5000);
  assert.deepEqual((await a.state()).visit,interrupted.visit);assert.equal((await a.state()).clock.state,'paused');
  await page.locator('#playback').tap();await a.nativeReady();await a.balance(4,4);
  await page.locator('#claim-token').tap();await a.advance(4000);await a.pause('claimed ending');await a.advance(6200);
  assert.equal((await a.state()).clock.state,'ended');assert.equal((await a.state()).ending.wheel,0);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.audio().activeSources),0);
  await Promise.all([page.waitForEvent('domcontentloaded'),page.locator('#revisit').tap()]);
  await page.waitForFunction(()=>window.midwayDiagnostics?.journey().ticketsIssued===0&&!document.querySelector('#enter').disabled);
  assert.equal((await a.state()).visit.souvenirTokens,0);assert.equal((await a.state()).clock.state,'start');
  routes.push({order:['carousel','prize'],issued:4,spent:4,bothReplays:true,retriesFree:true,revisitFresh:true});

  // Prize first with stacked tickets: no premature token; completing the
  // carousel last reveals the same token at the existing stall coordinates.
  const b=await setup(true);page=b.page;await b.earn();await b.earn();await b.balance(2,0);
  await page.screenshot({path:`${output}/stacked-tickets.png`});
  await b.aim('left');await b.advance(750);await b.aim('right');await b.advance(2000);await b.modal('prize-first story');
  assert.equal((await b.state()).visit.souvenirTokens,0);assert.equal((await b.state()).prize.tokenOpacity,0);
  await b.advance(7500);await b.balance(2,1);assert.equal((await b.state()).visit.completed.prize,1);
  assert.equal(await page.locator('#claim-token').isVisible(),false);assert.equal((await b.state()).visit.souvenirTokens,0);
  await b.melody();await b.balance(2,2);await b.advance(7999);
  assert.equal((await b.state()).visit.souvenirTokens,0,'Full carousel story must finish before the token');
  await b.advance(800);assert.deepEqual((await b.state()).carousel.horseY,[0,0,0]);await b.token();
  assert.equal(await page.locator('#hint').textContent(),'Perhaps this place has one last thing to give.');
  await page.screenshot({path:`${output}/prize-first-carousel-last-token.png`});
  await page.locator('[data-horse-note=right]').dispatchEvent('click');await page.locator('#prize-retry').dispatchEvent('click');await b.balance(2,2);await b.token();
  await page.locator('#claim-token').focus();await page.keyboard.press('Enter');await b.advance(500);
  assert.deepEqual((await b.state()).ending.token,[50,46,36]);await b.advance(9800);
  assert.equal((await b.state()).clock.state,'ended');
  routes.push({order:['prize','carousel'],issued:2,spent:2,noPrematureToken:true,tokenAtStallAfterCarousel:true,reducedMotion:true});

  // Boundary and switching: the completion can settle on input, ahead of the
  // next DOM frame. That replay still requires a new ticket, not a free turn.
  const c=await setup();page=c.page;await c.earn();await c.earn();await c.earn();await c.balance(3,0);
  await c.melody();await c.advance(8001);
  await page.locator('[data-horse-note=right]').dispatchEvent('click');await c.balance(3,2);
  assert.equal((await c.state()).visit.active.carousel,true);
  await c.aim('top');await c.advance(750);await c.balance(3,3);
  await c.note('left');await c.note('right');assert.equal((await c.state()).carousel.progress,2);await c.balance(3,3);
  await c.aim('left');await c.advance(850);await c.modal('two paid activities retained');
  await c.note('center');await c.note('left');await c.advance(8200);
  assert.equal((await c.state()).visit.active.carousel,false);assert.equal((await c.state()).visit.active.prize,true);
  await c.pickup();await c.win();await c.balance(3,3);await c.token();
  routes.push({order:['carousel','carousel replay','prize'],boundaryReplayCharged:true,unfinishedActivitiesSurviveSwitching:true});

  const git=(...args)=>execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{maxBuffer:32*1024*1024});
  for(const file of git('ls-tree','-r','--name-only','498e831','--','assets','dev/previews').toString().trim().split('\n'))assert.deepEqual(await readFile(file),git('show',`498e831:${file}`),`Approved media changed: ${file}`);
  assert.deepEqual(errors,[]);
  const result={status:'passed',routes,stackableTickets:true,acceptedActionsOnly:true,wrongNotesAndFailedRetriesFree:true,paperFree:true,bothAvailableAfterFirstTicket:true,zeroBalanceBoothRecovery:true,oneSouvenirAfterBothStories:true,originalTokenPosition:true,noDuplicateAwards:true,masterPlaybackAndCredits:checks,visibleUnobtrusiveBalance:true,phoneTouchAndKeyboard:true,layouts,approvedMediaUnchanged:true,projectPrefixPaths:true,errors,limits:['Desktop Chromium touch emulation; physical-phone review pending','No deployment or Phase 1 repackaging']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
} finally {await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
