import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../../serve.mjs';
const output='tests/results/peer-revision';await mkdir(output,{recursive:true});
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE||'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const server=createPreviewServer({basePath:'/midnight-midway/'});await new Promise(r=>server.listen(4185,'127.0.0.1',r));
const browser=await chromium.launch({headless:true}),errors=[],phases=[],layouts=[];
try {
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.addInitScript(()=>{const Native=window.AudioContext;window.contexts=[];window.AudioContext=class extends Native{constructor(...args){super(...args);window.contexts.push(this);}};});
  const base='http://127.0.0.1:4185/midnight-midway/';
  await page.goto(base+'?diagnostics');await page.waitForFunction(()=>window.midwayDiagnostics?.prize().ready&&window.midwayDiagnostics.ending().ready&&!document.querySelector('#enter').disabled);
  const state=()=>page.evaluate(()=>({clock:window.midwayDiagnostics.snapshot(),story:window.midwayDiagnostics.story(),carousel:window.midwayDiagnostics.carousel(),prize:window.midwayDiagnostics.prize(),journey:window.midwayDiagnostics.journey(),ending:window.midwayDiagnostics.ending()}));
  const models=()=>page.evaluate(()=>({story:window.midwayDiagnostics.story(),carousel:window.midwayDiagnostics.carousel(),prize:window.midwayDiagnostics.prize(),journey:window.midwayDiagnostics.journey(),ending:window.midwayDiagnostics.ending()}));
  async function nativeReady() {
    for(let i=0;i<200;i++) {
      if(await page.evaluate(()=>window.midwayDiagnostics.snapshot().state==='exploring'&&window.midwayDiagnostics.audio().status==='playing'&&window.contexts.at(-1).state==='running'))return;
      await new Promise(r=>setTimeout(r,20));
    }
    assert.fail(JSON.stringify(await page.evaluate(()=>({clock:window.midwayDiagnostics.snapshot(),audio:window.midwayDiagnostics.audio(),contexts:window.contexts.map(c=>c.state)}))));
  }
  await page.locator('#credits-open').tap();await page.locator('#credits-close').tap();assert.equal((await state()).clock.state,'start');
  assert.equal(await page.locator('#restart-activity,#restart-visit,#visit-tools').count(),0);
  assert.equal(await page.locator('#playback .pause-bars rect').count(),2);assert.equal(await page.locator('#playback').textContent(),'');
  await page.locator('#enter').tap();await nativeReady();await page.waitForFunction(()=>window.midwayDiagnostics.storyAudio().status==='ready');
  await page.clock.install();await page.clock.pauseAt(new Date());
  const advance=ms=>page.clock.runFor(ms);
  async function credits(label,escape=false) {
    const previous=(await state()).clock.state;
    await page.locator('#credits-open').tap();
    const frozen=await models();const elapsed=(await state()).clock.elapsedMs;
    await advance(20000);assert.deepEqual(await models(),frozen,`${label}: modal must freeze exact models`);
    assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
    if(escape)await page.keyboard.press('Escape');else await page.locator('#credits-close').tap();
    assert.equal((await state()).clock.state,previous,`${label}: restore prior playback state`);
    assert.equal((await state()).clock.elapsedMs,elapsed);
    assert.deepEqual(await models(),frozen,`${label}: closing must not reset progress`);
    if(previous==='exploring')await nativeReady();
    phases.push(label);
  }
  await advance(12000);const earlyGuide=(await state()).story.guidance.strength;
  await advance(20000);assert.ok((await state()).story.guidance.strength>earlyGuide);
  await page.screenshot({path:`${output}/bell-guidance.png`});await credits('idle guidance');
  await page.locator('#bell').tap();await credits('one bell ring');
  await page.locator('#bell').tap();await credits('two bell rings',true);
  await page.locator('#playback').tap();await credits('already paused bell state');
  assert.equal(await page.locator('#playback .play-triangle').getAttribute('hidden'),null);
  await page.locator('#playback').tap();await nativeReady();await page.locator('#bell').tap();
  await advance(2200);await credits('ghost story');await advance(6000);
  assert.equal((await state()).journey.admitted,true);
  await page.locator('[data-horse-note=left]').tap();await credits('partial melody');
  await page.locator('#music-open').tap();await credits('open sheet inspection',true);
  assert.equal((await state()).carousel.clueOpen,true);await page.locator('#music-close').tap();
  // One wrong note restores the attempt naturally; then perform the melody.
  await page.locator('[data-horse-note=center]').tap();await advance(30000);
  await page.screenshot({path:`${output}/carousel-guidance.png`});
  for(const note of ['left','right','center','left'])await page.locator(`[data-horse-note=${note}]`).tap();
  await advance(2500);await credits('carousel payoff');await advance(5800);
  assert.equal((await state()).journey.prizeUnlocked,true);
  const can=side=>page.locator(`[data-can=${side}]`);
  for(const [width,height] of [[280,568],[320,568],[390,844],[844,390]]) {
    await page.setViewportSize({width,height});
    await can('top').tap();await advance(120);await credits(`bag flight ${width}`);await advance(650);
    await credits(`between throws ${width}`);await can('left').tap();await advance(850);
    assert.equal((await state()).prize.failed,true);await credits(`failed round ${width}`);
    await advance(500);
    const r=await page.locator('.scene').first().boundingBox(),points=[.68,.727].map(x=>({x:r.x+r.width*x,y:r.y+r.height*.71}));
    const hit=await page.evaluate(p=>document.elementFromPoint(p.x,p.y)?.id,points[0]);assert.equal(hit,'prize-retry');
    assert.equal(await page.locator('#prize-retry').innerText(),'');
    await page.touchscreen.tap(points[width===320?1:0].x,points[width===320?1:0].y);
    assert.equal((await state()).prize.bags,2);assert.deepEqual((await state()).prize.down,[]);assert.equal((await state()).carousel.clueOpen,false);
    layouts.push({width,height,pickupWorks:true,clueNotIntercepted:true});
    await page.screenshot({path:`${output}/natural-pickup-${width}.png`});
  }
  await page.setViewportSize({width:390,height:844});
  await can('top').tap();await advance(750);await can('right').tap();await advance(850);
  await page.emulateMedia({reducedMotion:'reduce'});await advance(30000);
  assert.equal((await state()).prize.bagReturn.y,0);
  await page.screenshot({path:`${output}/returned-bags.png`});
  await page.locator('#prize-retry').focus();await page.keyboard.press('Enter');assert.equal((await state()).prize.bags,2);
  await can('left').tap();await advance(750);await can('right').tap();await advance(2500);
  await credits('haunted prize story');await advance(6500);
  assert.equal((await state()).journey.souvenirTokens,1);await credits('waiting claim');
  assert.equal(await page.locator('#claim-token').isVisible(),true);
  // Stress rapid transitions without wall-time sleeps between modal gestures.
  for(let i=0;i<8;i++) {await page.locator('#credits-open').tap();await page.locator('#credits-close').tap();assert.equal((await state()).clock.state,'exploring');}
  await nativeReady();assert.equal((await state()).journey.souvenirTokens,1);
  // A real page interruption owns its own pause even if Credits was playing.
  await page.locator('#credits-open').tap();await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
  await page.locator('#credits-close').tap();assert.equal((await state()).clock.state,'paused');
  await page.locator('#playback').tap();await nativeReady();
  await page.locator('#claim-token').tap();
  await advance(6400);assert.equal((await state()).ending.stall,0);assert.ok((await state()).ending.wheel>0);
  await advance(1700);assert.equal((await state()).ending.gone,true);assert.equal((await state()).ending.wheel,0);
  assert.equal((await state()).ending.resting,false);
  await page.screenshot({path:`${output}/eight-second-ending.png`});
  await advance(2100);assert.equal((await state()).clock.state,'ended');assert.equal(await page.locator('#revisit').isVisible(),true);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.audio().activeSources),0);
  const git=(...args)=>execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{maxBuffer:32*1024*1024});
  for(const file of git('ls-tree','-r','--name-only','810dea4','--','assets','dev/previews').toString().trim().split('\n'))assert.deepEqual(await readFile(file),git('show',`810dea4:${file}`),`Existing artwork changed: ${file}`);
  assert.deepEqual(errors,[]);
  const result={status:'passed',creditsPhases:phases,exactProgressPreserved:true,priorPlayingAndPausedRestored:true,escapePreservesInspection:true,rapidCreditsCycles:8,externalInterruptionStillNeedsPlay:true,noPermanentRestartControls:true,svgPauseSymbol:true,progressiveGuidance:true,naturalBagPickupAndKeyboard:true,reducedMotion:true,eightSecondWheelLastEnding:true,finalSilence:true,approvedAssetBytesUnchanged:true,projectPrefixPaths:true,layouts,errors,limits:['Desktop Chromium touch emulation; physical peer re-review pending','Playtest chronology is user-reported, not automated evidence of peer behavior','No deployment']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
} finally {await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
