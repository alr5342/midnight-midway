import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../../serve.mjs';

const output='tests/results/narration-revision';await mkdir(output,{recursive:true});
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE||'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const server=createPreviewServer({basePath:'/midnight-midway/'});await new Promise(r=>server.listen(4186,'127.0.0.1',r));
const browser=await chromium.launch({headless:true}),errors=[],checks=[],layouts=[];
try {
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  const state=()=>page.evaluate(()=>({clock:window.midwayDiagnostics.snapshot(),booth:window.midwayDiagnostics.story(),carousel:window.midwayDiagnostics.carousel(),prize:window.midwayDiagnostics.prize(),ending:window.midwayDiagnostics.ending(),journey:window.midwayDiagnostics.journey()}));
  const text=()=>page.locator('#hint').textContent();
  const owner=()=>page.locator('#hint').getAttribute('data-owner');
  async function nativeReady() {
    for(let i=0;i<200;i++) {
      if(await page.evaluate(()=>window.midwayDiagnostics.audio().status==='playing'&&window.midwayDiagnostics.storyAudio().status==='ready'&&window.midwayDiagnostics.audio().contextState==='running'))return;
      await new Promise(r=>setTimeout(r,20));
    }
    assert.fail('Native audio did not resume');
  }
  await page.goto('http://127.0.0.1:4186/midnight-midway/?diagnostics');
  await page.waitForFunction(()=>!document.querySelector('#enter').disabled&&window.midwayDiagnostics.prize().ready&&window.midwayDiagnostics.ending().ready);
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.locator('#enter').tap();await nativeReady();
  const advance=ms=>page.clock.runFor(ms);
  // Downloads settle on native events; render their status on the shared RAF.
  await advance(32);
  async function credits(label,escape=false) {
    const before=await state(),line=await text(),source=await owner();
    await page.locator('#credits-open').tap();await advance(15000);
    const during=await state();
    for(const key of ['booth','carousel','prize','ending','journey'])assert.deepEqual(during[key],before[key],`${label}: ${key} frozen`);
    if(escape)await page.keyboard.press('Escape');else await page.locator('#credits-close').tap();
    await nativeReady();assert.equal(await text(),line);assert.equal(await owner(),source);
    assert.equal((await state()).clock.elapsedMs,before.clock.elapsedMs);checks.push(`Credits: ${label}`);
  }
  async function pause(label) {
    const line=await text(),before=await state();await page.locator('#playback').tap();await advance(15000);
    assert.equal(await text(),'Paused. Choose Play to continue.');
    assert.equal((await state()).clock.elapsedMs,before.clock.elapsedMs);
    await page.locator('#playback').tap();await nativeReady();assert.equal(await text(),line);checks.push(`Pause: ${label}`);
  }
  assert.match(await text(),/late shift/);
  await advance(12100);assert.equal(await text(),'A little brass bell waits beneath the window.');
  await advance(12000);assert.match(await text(),/quiet chime/);
  await page.locator('#bell').focus();await page.keyboard.press('Enter');
  assert.match(await text(),/seems to be listening/);
  await page.keyboard.press('Enter');assert.equal(await text(),'The silence inside has grown thin.');
  await advance(12500);assert.match(await text(),/another answer/);
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'playback');
  await advance(1800);assert.equal(await text(),'Someone has kept the late shift all these years.');await credits('ghost story');
  await advance(2300);assert.equal(await text(),'There is still a place for one more visitor.');
  await advance(4000);assert.match(await text(),/Your ticket promises a ride/);
  const bell=await page.locator('#bell').evaluate(el=>({focused:el.matches(':focus-visible'),disabled:el.getAttribute('aria-disabled'),outline:getComputedStyle(el).outlineStyle}));
  assert.equal(bell.focused,false);assert.equal(bell.disabled,'false');
  const bellFilter=await page.locator('.story-bell').evaluate(el=>el.style.filter);
  assert.equal(bellFilter.match(/drop-shadow/g).length,1,'Only the contact shadow remains');
  await page.screenshot({path:`${output}/admission-no-bell-ring.png`});
  assert.equal((await state()).journey.admissionTickets,1);assert.equal((await state()).journey.prizeUnlocked,false);
  // An immediate inspection must beat the old fixed admission-message window.
  await page.locator('#music-open').tap();assert.equal(await owner(),'inspection');await credits('immediate sheet inspection',true);
  await page.locator('#music-close').tap();assert.equal(await text(),'The painted horses have forgotten how the music goes.');
  const note=side=>page.locator(`[data-horse-note=${side}]`);
  await note('right').tap();await advance(1200);assert.match(await text(),/missing bars/);await pause('readable wrong note');
  await note('left').tap();assert.equal(await text(),'The painted horses have forgotten how the music goes.');
  await note('center').tap();await advance(12500);assert.match(await text(),/Rain spared/);
  await advance(12000);assert.match(await text(),/higher voices/);
  // Partial bell replay no longer owns exploration narration.
  await page.locator('#bell').focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
  assert.equal(await page.locator('#bell').evaluate(el=>el.matches(':focus-visible')),true,'Deliberate keyboard focus stays visible');
  await page.keyboard.press('Enter');assert.equal(await owner(),'carousel');
  for(const side of ['left','right','center','left'])await note(side).tap();
  await advance(2000);assert.equal(await text(),'For a moment, the years loosen their hold.');
  await advance(2500);assert.equal(await text(),'An old evening finds its way back.');
  await advance(3700);assert.equal(await text(),'Beyond the carousel, the prize stall seems to be waiting for someone.');
  for(const [width,height] of [[280,568],[320,568],[390,844],[844,390]]) {
    await page.setViewportSize({width,height});
    const layout=await page.locator('#hint').evaluate(el=>{const r=el.getBoundingClientRect();return {fits:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,noOverflow:document.documentElement.scrollWidth<=innerWidth};});
    assert.equal(layout.fits,true);assert.equal(layout.noOverflow,true);layouts.push({width,height,...layout});
  }
  await page.setViewportSize({width:390,height:844});await advance(4000);
  const prizeLine=await text();await note('right').tap();assert.equal(await text(),prizeLine);
  await page.locator('#music-open').tap();assert.equal(await owner(),'inspection');
  await page.locator('#music-close').tap();assert.equal(await text(),prizeLine);
  await page.locator('#bell').tap();assert.equal((await state()).booth.rings,2);assert.equal(await text(),prizeLine);
  const can=side=>page.locator(`[data-can=${side}]`);
  await can('top').tap();assert.equal(await text(),prizeLine);await advance(100);await credits('bag flight');
  await advance(650);assert.match(await text(),/One bag remains/);assert.equal(await owner(),'prize');
  await advance(14500);assert.match(await text(),/deeper dents/);
  const beforeThrow=await text();await can('right').tap();assert.equal(await text(),beforeThrow);
  await advance(850);assert.match(await text(),/beanbag boxes/);await credits('failed round');
  await advance(12500);assert.equal(await text(),'The returned beanbags are yours to take.');
  await page.screenshot({path:`${output}/returned-bag-guidance.png`});
  const bounds=await page.locator('.scene').first().boundingBox();
  await page.touchscreen.tap(bounds.x+bounds.width*.68,bounds.y+bounds.height*.71);
  assert.equal((await state()).prize.bags,2);assert.deepEqual((await state()).prize.down,[]);
  // The third outstanding ring intentionally replays the same story; no new
  // stackable ticket rule or fixed admission handoff is introduced.
  await page.locator('#bell').tap();assert.equal(await owner(),'booth-story');await advance(8200);
  assert.equal((await state()).booth.completed,2);assert.equal((await state()).journey.admissionTickets,1);
  assert.equal(await owner(),'prize');assert.doesNotMatch(await text(),/Your ticket promises/);
  await can('left').tap();await advance(750);await can('right').tap();await advance(1250);
  assert.equal(await text(),'For a moment, the stall seems to remember its old crowd.');
  await advance(4000);assert.equal(await text(),'Something has been kept for the last visitor.');
  await advance(3900);assert.equal(await text(),'Perhaps this place has one last thing to give.');
  await page.screenshot({path:`${output}/waiting-token.png`});
  await note('right').tap();assert.equal(await owner(),'token');await page.locator('#bell').tap();assert.equal(await owner(),'token');
  await page.locator('#music-open').tap();assert.equal(await owner(),'inspection');await page.locator('#music-close').tap();assert.equal(await owner(),'token');
  // A full carousel replay still works, then yields to the waiting token.
  for(const side of ['left','right','center','left'])await note(side).tap();
  assert.equal(await owner(),'carousel-story');await advance(8200);assert.equal(await owner(),'token');
  await advance(4000);assert.equal(await text(),'The token waits for your hand.');
  await credits('waiting token');await pause('waiting token');
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>window.midwayDiagnostics.snapshot().reducedMotion);assert.equal(await owner(),'token');
  assert.deepEqual((await state()).carousel.horseY,[0,0,0]);assert.equal((await state()).journey.admissionTickets,1);
  await page.locator('#claim-token').tap();assert.equal(await text(),'Some places can only stay for a little while.');
  await advance(3000);assert.equal(await text(),'The night lets go of what it borrowed.');await pause('ending');
  await advance(3000);assert.equal(await text(),'Keep something of this night.');
  await advance(2100);assert.equal(await page.locator('#hint').isVisible(),false);
  await advance(2100);assert.equal(await page.locator('#revisit').isVisible(),true);
  assert.equal((await state()).clock.state,'ended');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.audio().activeSources),0);
  const git=(...args)=>execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{maxBuffer:32*1024*1024});
  for(const file of git('ls-tree','-r','--name-only','56c010d','--','assets','dev/previews').toString().trim().split('\n'))assert.deepEqual(await readFile(file),git('show',`56c010d:${file}`),`Approved media changed: ${file}`);
  assert.deepEqual(errors,[]);
  const result={status:'passed',approvedCopyIncludingThreeEdits:true,oneNarrationWriter:true,immediateCluePreemptsHandoff:true,partialBellReplayCannotStealObjective:true,completedHorseAndPaperYieldBack:true,readableWrongNote:true,noThrowTextFlash:true,oneBagHintsProgress:true,naturalRetry:true,boothAndCarouselReplayPreserved:true,oneAdmissionNoTicketSpending:true,existingSequentialGates:true,tokenNarrationPriority:true,creditsAndPauseRestoreExactCopy:checks,reducedMotion:true,endingAndFinalSilence:true,approvedMediaUnchanged:true,projectPrefixPaths:true,layouts,errors,limits:['Desktop Chromium with touch emulation; physical-phone review pending','No new ticket/replay progression, publishing or deployment']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
} finally {await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
