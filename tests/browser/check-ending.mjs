import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../../serve.mjs';

const output='tests/results/ending-runtime';await mkdir(output,{recursive:true});
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE||'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const server=createPreviewServer({basePath:'/midnight-midway/'});await new Promise(resolve=>server.listen(4182,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true}),errors=[],layouts=[];
try {
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await page.addInitScript(()=>{
    const Native=window.AudioContext;window.gains=[];window.starts=[];
    window.AudioContext=class extends Native {
      constructor(...args){super(...args);window.context=this;
        const gain=this.createGain.bind(this);this.createGain=()=>{const node=gain();window.gains.push(node);return node;};
        const buffer=this.createBufferSource.bind(this);this.createBufferSource=()=>{const node=buffer(),start=node.start.bind(node);node.start=(when,offset)=>{window.starts.push({offset,duration:node.buffer.duration,rate:node.playbackRate.value});return start(when,offset);};return node;};
      }
    };
  });
  const base='http://127.0.0.1:4182/midnight-midway/';
  const snap=()=>page.evaluate(()=>window.midwayDiagnostics.ending());
  const advance=ms=>page.clock.runFor(ms);
  // Native AudioContext state events use wall time, not the virtual scene
  // clock. Poll them from the test host while leaving active time frozen.
  async function waitNative(predicate,label,client=page) {
    for(let attempt=0;attempt<200;attempt++) {
      if(await client.evaluate(predicate))return;
      await new Promise(resolve=>setTimeout(resolve,20));
    }
    assert.fail(`Native event did not settle: ${label}`);
  }
  let clockInstalled=false;
  async function arriveAtPrize() {
    await waitNative(()=>!document.querySelector('#enter').disabled&&window.midwayDiagnostics?.ending().ready&&window.midwayDiagnostics.prize().ready,'artwork readiness');
    await page.locator('#enter').click();
    await waitNative(()=>window.midwayDiagnostics.audio().status==='playing'&&window.midwayDiagnostics.storyAudio().status==='ready','audio readiness');
    if(!clockInstalled) {await page.clock.install();await page.clock.pauseAt(new Date());clockInstalled=true;}
    for(let i=0;i<3;i++)await page.locator('#bell').click();await advance(8100);
    for(const note of ['left','right','center','left'])await page.locator(`[data-horse-note=${note}]`).tap();
    await advance(8500);
  }
  await page.goto(base+'?diagnostics');
  await page.locator('#claim-token').dispatchEvent('click');assert.equal((await snap()).claimed,false);
  await arriveAtPrize();
  const wake=await page.evaluate(()=>({state:window.midwayDiagnostics.prize(),markup:document.querySelector('.prize-wake').outerHTML,starts:window.starts}));
  assert.ok(wake.state.wakeLight>0);assert.ok(wake.starts.some(cue=>Math.abs(cue.duration-.85)<.01&&Math.abs(cue.rate-.8)<.01));
  await page.screenshot({path:`${output}/stall-awake.png`});
  await page.locator('#playback').tap();const wakeFrozen=await page.locator('.prize-wake').getAttribute('style');await advance(5000);assert.equal(await page.locator('.prize-wake').getAttribute('style'),wakeFrozen);await page.locator('#playback').tap();
  // Win using taps on painted can centers. No separate game screen or time gap.
  await page.setViewportSize({width:280,height:568});
  const bounds=await page.locator('.scene').first().boundingBox();
  // Both generous lower-can hit circles contain this point at 280px. DOM
  // order would pick right; the nearer painted can is left.
  await page.touchscreen.tap(bounds.x+bounds.width*.824,bounds.y+bounds.height*.673);await advance(660);
  assert.deepEqual(new Set(await page.evaluate(()=>window.midwayDiagnostics.prize().down)),new Set(['left','top']));
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.prize().throwing),false);
  await page.locator('[data-can=right]').tap();await advance(9000);
  assert.equal(await page.locator('#claim-token').isVisible(),true);assert.equal((await snap()).claimed,false);
  await page.screenshot({path:`${output}/claimable-token.png`});
  for(const [width,height] of [[390,844],[320,568],[280,568],[844,390]]) {
    await page.setViewportSize({width,height});
    const box=await page.locator('#claim-token').evaluate(button=>{const r=button.getBoundingClientRect();return {width:r.width,height:r.height,fits:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,receivesTap:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===button};});
    assert.ok(box.width>=44&&box.height>=44&&box.fits&&box.receivesTap);layouts.push({viewportWidth:width,viewportHeight:height,...box});
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('#playback').tap();await page.locator('#claim-token').dispatchEvent('click');assert.equal((await snap()).claimed,false);await page.locator('#playback').tap();
  await page.locator('#claim-token').focus();await page.keyboard.press('Enter');
  assert.equal((await snap()).claimed,true);
  const claimedAt=await page.evaluate(()=>window.midwayDiagnostics.snapshot().elapsedMs);
  const gotoAge=async age=>{const current=(await snap()).age;await advance(Math.max(0,age*1000-current*1000));};
  const assertFrozen=async label=>{
    await page.locator('#playback').tap();
    const frozen=await page.evaluate(()=>({ending:window.midwayDiagnostics.ending(),markup:document.querySelector('.ending-runtime').outerHTML,gains:window.gains.slice(0,2).map(g=>g.gain.value)}));
    const bags=await page.evaluate(()=>window.midwayDiagnostics.prize().bags);
    await page.locator('#bell').dispatchEvent('click');await page.locator('[data-can=left]').dispatchEvent('click');await page.locator('#prize-retry').dispatchEvent('click');await page.locator('#claim-token').dispatchEvent('click');
    await advance(9000);
    assert.deepEqual(await page.evaluate(()=>({ending:window.midwayDiagnostics.ending(),markup:document.querySelector('.ending-runtime').outerHTML,gains:window.gains.slice(0,2).map(g=>g.gain.value)})),frozen,label);
    assert.equal(await page.evaluate(()=>window.midwayDiagnostics.prize().bags),bags);
    assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
    assert.equal(await page.evaluate(()=>window.midwayDiagnostics.audio().activeSources),0);
    await page.locator('#playback').tap();
  };
  await gotoAge(.3);await assertFrozen('claim and moving token');
  for(const age of [2,5,8]) {
    await gotoAge(age);
    await page.screenshot({path:`${output}/ending-${age}s.png`});
    const state=await snap();const gains=await page.evaluate(()=>window.gains.slice(0,2).map(g=>g.gain.value));
    // AudioParam values reflect the last rendered frame; the diagnostic model
    // samples current active time, up to one frame later.
    assert.ok(Math.abs(gains[0]-.30*state.windLevel)<.003,JSON.stringify({gains,state}));assert.ok(Math.abs(gains[1]-.65*state.storyLevel)<.003,JSON.stringify({gains,state}));
    assert.equal(await page.locator('.ending-land').evaluate(el=>getComputedStyle(el).opacity),'1');
    await assertFrozen(`ending at ${age}s`);
  }
  await waitNative(()=>window.midwayDiagnostics.audio().status==='playing'&&window.context.state==='running','Play resumed native audio');
  await page.evaluate(()=>window.context.suspend());
  await waitNative(()=>window.midwayDiagnostics.snapshot().state==='paused','native suspension pauses scene');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.snapshot().state),'paused');
  const interrupted=await snap();await advance(5000);assert.deepEqual(await snap(),interrupted);await page.locator('#playback').tap();
  await gotoAge(10.1);
  assert.equal((await snap()).gone,true);assert.equal((await snap()).wheel,0);
  assert.equal(await page.locator('#revisit').isVisible(),false,'Allow a quiet final hold');
  assert.equal(await page.locator('#hint').isVisible(),false);assert.equal(await page.locator('#playback').isVisible(),false);
  assert.equal(await page.locator('#credits-open').isVisible(),false);assert.equal(await page.locator('#admission').isVisible(),false);
  assert.ok(await page.locator('.ending-memory').evaluateAll(nodes=>nodes.every(n=>Number(n.style.opacity)===0)));
  assert.equal(await page.locator('.ending-copy').first().evaluate(el=>el.style.opacity),'0');
  assert.equal(await page.locator('.scene').first().evaluate(el=>el.style.visibility),'hidden');
  assert.deepEqual(await page.evaluate(()=>window.gains.slice(0,2).map(g=>g.gain.value)),[0,0]);
  await page.screenshot({path:`${output}/empty-field-hold.png`});
  // Returning during the hold must not strand an invisible pause control.
  await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
  assert.equal(await page.locator('#playback').isVisible(),true);
  await advance(5000);assert.equal(await page.locator('#revisit').isVisible(),false);
  await page.locator('#playback').tap();await gotoAge(12.1);
  assert.equal(await page.locator('#revisit').isVisible(),true);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.snapshot().state),'ended');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.snapshot().scheduledFrames),0);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.audio().activeSources),0);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
  const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));assert.equal(new Set(ids).size,ids.length,'Frozen copies must namespace SVG IDs');
  await page.screenshot({path:`${output}/revisit.png`});
  await Promise.all([page.waitForEvent('domcontentloaded'),page.locator('#revisit').tap()]);
  await waitNative(()=>window.midwayDiagnostics?.snapshot().state==='start'&&!document.querySelector('#enter').disabled,'fresh revisit modules');
  assert.equal(await page.locator('#start-screen').isVisible(),true);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().admitted),false);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().souvenirTokens),0);
  assert.equal((await snap()).claimed,false);

  await page.emulateMedia({reducedMotion:'reduce'});await arriveAtPrize();
  await page.locator('[data-can=right]').tap();await advance(700);
  // The 650ms model settle can precede the next DOM frame by up to 17ms.
  assert.equal(await page.locator('[data-can=left]').getAttribute('aria-disabled'),'false',JSON.stringify(await page.evaluate(()=>({clock:window.midwayDiagnostics.snapshot(),prize:window.midwayDiagnostics.prize(),audio:window.midwayDiagnostics.audio()}))));
  await page.locator('[data-can=left]').tap();await advance(9000);
  await page.locator('#claim-token').tap();await advance(500);
  assert.deepEqual((await snap()).token,[50,46,36]);
  const tokenGeometry=()=>page.locator('.ending-token').evaluate(el=>[el.style.left,el.style.top,el.style.width]);
  const stationary=await tokenGeometry();await advance(3500);
  assert.deepEqual(await tokenGeometry(),stationary);
  await page.screenshot({path:`${output}/reduced-motion.png`});
  await advance(8200);assert.equal(await page.evaluate(()=>window.midwayDiagnostics.snapshot().state),'ended');
  await page.reload();await waitNative(()=>Boolean(window.midwayDiagnostics?.ending().ready),'refresh modules');assert.equal((await snap()).claimed,false);

  // Missing approved field: keep the journey playable, but never claim into
  // a broken ending. This expected HTTP failure is recorded separately.
  const missing=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  await missing.route('**/assets/artwork/empty-field-v1.png',route=>route.fulfill({status:404,body:'missing'}));
  await missing.goto(base+'?diagnostics');
  await waitNative(()=>window.midwayDiagnostics?.ending().assetFailure&&!document.querySelector('#enter').disabled&&window.midwayDiagnostics.prize().ready,'missing-field safe entry',missing);
  await missing.locator('#enter').click();
  await waitNative(()=>window.midwayDiagnostics.storyAudio().status==='ready','missing-field audio',missing);
  await missing.clock.install();await missing.clock.pauseAt(new Date());
  for(let i=0;i<3;i++)await missing.locator('#bell').click();await missing.clock.runFor(8100);
  for(const note of ['left','right','center','left'])await missing.locator(`[data-horse-note=${note}]`).tap();await missing.clock.runFor(8100);
  await missing.locator('[data-can=left]').tap();await missing.clock.runFor(700);await missing.locator('[data-can=right]').tap();await missing.clock.runFor(9000);
  assert.equal(await missing.evaluate(()=>window.midwayDiagnostics.prize().tokenAwarded),true);
  assert.equal(await missing.locator('#claim-token').getAttribute('aria-disabled'),'true');
  assert.match(await missing.locator('#hint').textContent(),/could not load/);
  await missing.locator('#claim-token').dispatchEvent('click');
  assert.equal(await missing.evaluate(()=>window.midwayDiagnostics.ending().claimed),false);await missing.close();
  const git=(...args)=>execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{maxBuffer:32*1024*1024});
  for(const file of git('ls-tree','-r','--name-only','6487dc4','--','assets','dev/previews').toString().trim().split('\n'))assert.deepEqual(await readFile(file),git('show',`6487dc4:${file}`),`Approved asset changed: ${file}`);
  assert.deepEqual(await readFile('assets/artwork/empty-field-v1.png'),await readFile('dev/previews/assets/empty-field-v1.png'));
  assert.deepEqual(errors,[]);
  const result={status:'passed',stallWakeCue:true,quickSettledThrows:true,claimDeliberateAndKeyboardAccessible:true,claimLockedOnPause:true,tenSecondOrderedDisappearance:true,opaqueApprovedField:true,wheelLast:true,audioFadeLevelsAndPauseResume:true,nativeInterruptionRequiresPlay:true,finalHoldInterruptionRecoverable:true,tokenThenRevisit:true,endedClockAndNoFrames:true,finalSilence:true,revisitAndRefreshFresh:true,reducedMotionStationaryToken:true,missingFieldSafe:true,approvedAssetBytesUnchanged:true,uniqueSvgIds:true,projectPrefixPaths:true,layouts,errors,limits:['Chromium with phone touch emulation; physical-device review pending','No publishing or deployment']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
} finally {await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
