import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../../serve.mjs';

const output='tests/results/journey-recovery';await mkdir(output,{recursive:true});
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE||'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const server=createPreviewServer({basePath:'/midnight-midway/'});await new Promise(r=>server.listen(4184,'127.0.0.1',r));
const browser=await chromium.launch({headless:true}),errors=[],layouts=[];
const base='http://127.0.0.1:4184/midnight-midway/?diagnostics';
const watch=page=>{
  page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
};
async function loaded(page) {
  await page.waitForFunction(()=>Boolean(window.midwayDiagnostics?.ending().ready&&window.midwayDiagnostics.prize().ready&&!document.querySelector('#enter').disabled));
}
const melody=async page=>{for(const note of ['left','right','center','left'])await page.locator(`[data-horse-note=${note}]`).tap();};
const bell=async page=>{for(let i=0;i<3;i++)await page.locator('#bell').tap();};
try {
  const page=await browser.newPage({viewport:{width:280,height:568},hasTouch:true});watch(page);
  await page.goto(base);await loaded(page);
  // The smallest-layout Enter center used to be intercepted by locked paper.
  await page.locator('#enter').tap();await page.waitForFunction(()=>window.midwayDiagnostics.storyAudio().status==='ready');
  await page.clock.install();await page.clock.pauseAt(new Date());
  const advance=ms=>page.clock.runFor(ms),restart=page.locator('#restart-activity');
  await page.locator('#bell').tap();await restart.tap();assert.equal(await page.evaluate(()=>window.midwayDiagnostics.story().rings),0);
  await bell(page);await advance(2000);await restart.tap();await advance(9000);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().admitted),false,'Cancelled booth cannot award later');
  await bell(page);await advance(8200);
  assert.match(await page.locator('#hint').textContent(),/carousel/i);
  await page.locator('[data-horse-note=left]').tap();await page.locator('#music-open').tap();await restart.tap();
  assert.equal(await page.locator('#music-clue').isVisible(),false);assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().progress),0);
  await melody(page);await advance(2500);await page.locator('#playback').tap();await restart.tap();
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.snapshot().state),'paused');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().playing),false);
  await page.locator('#playback').tap();await advance(9000);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().prizeUnlocked),false);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().admissionTickets),1);
  await melody(page);await advance(8200);
  assert.match(await page.locator('#hint').textContent(),/prize stall/i);

  let failedAttempts=0;
  for(const [width,height] of [[280,568],[320,568],[390,844],[844,390]]) {
    await page.setViewportSize({width,height});
    const layout=await page.locator('#visit-tools').evaluate(group=>{
      const rects=[...group.querySelectorAll('button')].map(button=>{const r=button.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {id:button.id,x:r.x,y:r.y,width:r.width,height:r.height,fits:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,receivesTap:hit===button,interceptor:hit?.id||hit?.className};});
      return {rects,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    await page.screenshot({path:`${output}/layout-${width}.png`});
    assert.ok(layout.rects.every(r=>r.width>=44&&r.height>=44&&r.fits&&r.receivesTap),JSON.stringify({width,height,...layout}));assert.equal(layout.overflow,false);layouts.push({width,height,...layout});
    for(const [index,side] of ['left','right'].entries()) {
      await page.locator('[data-can=top]').tap();await advance(750);await page.locator(`[data-can=${side}]`).tap();await advance(750);
      assert.equal(await page.evaluate(()=>window.midwayDiagnostics.prize().failed),true);assert.equal(await restart.textContent(),'Retry game');
      if(index===0)await restart.tap();
      else {
        const r=await page.locator('.scene').first().boundingBox(),point={x:r.x+r.width*.68,y:r.y+r.height*.71};
        assert.equal(await page.evaluate(p=>document.elementFromPoint(p.x,p.y)?.id,point),'prize-retry','Bag edge must not open sheet music');
        await page.touchscreen.tap(point.x,point.y);
      }
      assert.equal(await page.evaluate(()=>window.midwayDiagnostics.prize().bags),2);
      assert.equal(await page.evaluate(()=>window.midwayDiagnostics.prize().busy),false);
      assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().clueOpen),false);
      failedAttempts++;
    }
    await page.screenshot({path:`${output}/controls-${width}.png`});
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-can=left]').tap();await restart.tap();await advance(1000);
  assert.deepEqual(await page.evaluate(()=>window.midwayDiagnostics.prize().down),[]);
  await page.locator('[data-can=left]').tap();await advance(750);await page.locator('[data-can=right]').tap();await advance(2500);
  await page.locator('#playback').tap();await restart.tap();
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.snapshot().state),'paused');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.prize().busy),false);
  await page.locator('#playback').tap();await advance(10000);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.prize().tokenAwarded),false,'Cancelled prize story cannot finish later');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().prizeUnlocked),true);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('[data-can=right]').tap();await advance(750);await page.locator('[data-can=left]').tap();await advance(9000);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().souvenirTokens),1);
  await restart.tap();assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().souvenirTokens),1);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.prize().bags),2);
  await page.locator('#bell').tap();await restart.tap();
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().admissionTickets),1);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().souvenirTokens),1);
  await Promise.all([page.waitForEvent('domcontentloaded'),page.locator('#restart-visit').tap()]);
  await page.waitForFunction(()=>Boolean(window.midwayDiagnostics));
  assert.equal(await page.locator('#start-screen').isVisible(),true);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().admitted),false);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().souvenirTokens),0);
  await page.close();

  // Separate normal-speed playthrough: real clock, actual touch controls,
  // no model mutations, forced events, scene fast-forward or story bypass.
  const real=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});watch(real);
  await real.goto(base);await loaded(real);await real.locator('#enter').tap();
  await real.waitForFunction(()=>window.midwayDiagnostics.storyAudio().status==='ready');
  await bell(real);await real.waitForFunction(()=>window.midwayDiagnostics.journey().admitted);
  assert.match(await real.locator('#hint').textContent(),/carousel/i);
  await real.locator('#music-open').tap();await real.locator('#music-close').tap();
  await melody(real);await real.waitForFunction(()=>window.midwayDiagnostics.journey().prizeUnlocked);
  assert.match(await real.locator('#hint').textContent(),/prize stall/i);
  await real.locator('[data-can=top]').tap();await real.waitForFunction(()=>!window.midwayDiagnostics.prize().throwing);
  await real.locator('[data-can=left]').tap();await real.waitForFunction(()=>window.midwayDiagnostics.prize().failed);
  await real.screenshot({path:`${output}/clear-retry.png`});
  await real.getByRole('button',{name:/^Retry game/}).tap();
  await real.locator('[data-can=left]').tap();await real.waitForFunction(()=>!window.midwayDiagnostics.prize().throwing);
  await real.locator('[data-can=right]').tap();await real.waitForFunction(()=>window.midwayDiagnostics.prize().tokenAwarded);
  await real.locator('#claim-token').tap();await real.waitForFunction(()=>window.midwayDiagnostics.ending().gone);
  await real.screenshot({path:`${output}/normal-gameplay-empty-field.png`});
  await real.waitForFunction(()=>window.midwayDiagnostics.ending().resting);
  assert.equal(await real.evaluate(()=>window.midwayDiagnostics.snapshot().state),'ended');
  assert.equal(await real.evaluate(()=>window.midwayDiagnostics.audio().activeSources),0);
  assert.equal(await real.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
  await Promise.all([real.waitForEvent('domcontentloaded'),real.locator('#revisit').tap()]);
  await real.waitForFunction(()=>Boolean(window.midwayDiagnostics));
  assert.equal(await real.evaluate(()=>window.midwayDiagnostics.snapshot().state),'start');
  assert.equal(await real.evaluate(()=>window.midwayDiagnostics.journey().souvenirTokens),0);
  const git=(...args)=>execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{maxBuffer:32*1024*1024});
  for(const file of git('ls-tree','-r','--name-only','15f2597','--','assets','dev/previews').toString().trim().split('\n'))assert.deepEqual(await readFile(file),git('show',`15f2597:${file}`),`Approved artwork/preview changed: ${file}`);
  assert.deepEqual(errors,[]);
  const result={status:'passed',failedAttemptsRecovered:failedAttempts,bagEdgeClueInterceptionFixed:true,smallPhoneEnterAccessible:true,currentActivityRestart:true,pausedAndInFlightRestart:true,unearnedStoriesCancelled:true,earnedProgressPreserved:true,fullVisitReset:true,clearTransitionCopy:true,reducedMotion:true,normalSpeedTouchJourneyThroughRevisit:true,noDiagnosticStateMutation:true,finalSilence:true,approvedAssetsUnchanged:true,projectPrefixPaths:true,layouts,errors,limits:['Desktop Chromium touch emulation, not physical-phone certification','No deployment']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
} finally {await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
