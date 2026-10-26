import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../../serve.mjs';

const output='tests/results/prize-game';await mkdir(output,{recursive:true});
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE||'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const server=createPreviewServer({basePath:'/midnight-midway/'});
await new Promise(resolve=>server.listen(4181,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true}),errors=[],layouts=[];
try {
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await page.addInitScript(()=>{
    const Native=window.AudioContext;window.audioStarts=[];
    window.AudioContext=class extends Native {
      constructor(...args){super(...args);window.testContext=this;const create=this.createBufferSource.bind(this);this.createBufferSource=()=>{
        const source=create(),start=source.start.bind(source);
        source.start=(when,offset)=>{window.audioStarts.push({offset,duration:source.buffer.duration,rate:source.playbackRate.value});return start(when,offset);};return source;
      };}
    };
  });
  const base='http://127.0.0.1:4181/midnight-midway/';
  await page.goto(base+'?diagnostics');
  await page.waitForFunction(()=>!document.querySelector('#enter').disabled&&window.midwayDiagnostics.prize().ready);
  assert.equal(await page.locator('.prize-can').count(),3);
  assert.equal(await page.locator('#prize-controls').isVisible(),false);
  await page.locator('[data-can=left]').dispatchEvent('click');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.prize().bags),2);
  await page.locator('#enter').click();
  await page.waitForFunction(()=>window.midwayDiagnostics.storyAudio().status==='ready'&&window.midwayDiagnostics.audio().status==='playing');
  await page.clock.install();await page.clock.pauseAt(new Date());
  for(let i=0;i<3;i++)await page.locator('#bell').click();
  await page.clock.runFor(8100);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().admitted),true);
  await page.locator('[data-can=left]').dispatchEvent('click');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.prize().bags),2,'Prize stays locked through the ride');
  for(const note of ['left','right','center','left'])await page.locator(`[data-horse-note=${note}]`).tap();
  await page.clock.runFor(8100);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().prizeUnlocked),true);
  assert.equal(await page.locator('#prize-controls').isVisible(),true);
  await page.screenshot({path:`${output}/ready-phone.png`});

  // Pointer and physical object alignment at the actual app scale, not only
  // the separate development preview. Every center must receive its own tap.
  for(const [width,height] of [[390,844],[320,568],[280,568],[844,390]]) {
    await page.setViewportSize({width,height});
    const layout=await page.locator('#prize-controls').evaluate(el=>{
      const stage=document.querySelector('#stage').getBoundingClientRect();
      const targets=[...el.querySelectorAll('[data-can]')].map(button=>{
        const r=button.getBoundingClientRect();
        return {name:button.dataset.can,width:r.width,height:r.height,fits:r.left>=stage.left-.5&&r.right<=stage.right+.5&&r.top>=stage.top&&r.bottom<=stage.bottom,receivesTap:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===button};
      });
      return {targets,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert.ok(layout.targets.every(t=>t.width>=44&&t.height>=44&&t.fits&&t.receivesTap),JSON.stringify({width,height,...layout}));
    assert.equal(layout.overflow,false);layouts.push({width,height,...layout});
    await page.screenshot({path:`${output}/layout-${width}.png`});
  }
  await page.setViewportSize({width:390,height:844});
  const can=side=>page.locator(`[data-can=${side}]`);
  const snap=()=>page.evaluate(()=>window.midwayDiagnostics.prize());
  const freeze=async(label)=>{
    await page.locator('#playback').tap();
    const frozen=await page.evaluate(()=>({prize:window.midwayDiagnostics.prize(),carousel:window.midwayDiagnostics.carousel(),story:window.midwayDiagnostics.story(),art:document.querySelector('.prize-props').outerHTML}));
    assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
    assert.equal(await page.evaluate(()=>window.midwayDiagnostics.audio().activeSources),0);
    await can('right').dispatchEvent('click');await page.locator('#prize-retry').dispatchEvent('click');
    await page.clock.runFor(12000);
    assert.deepEqual(await page.evaluate(()=>({prize:window.midwayDiagnostics.prize(),carousel:window.midwayDiagnostics.carousel(),story:window.midwayDiagnostics.story(),art:document.querySelector('.prize-props').outerHTML})),frozen,label);
    await page.locator('#playback').tap();
  };

  await can('top').tap();await page.clock.runFor(180);
  const flight=await snap();assert.equal(flight.throwing,true);assert.equal(flight.bags,1);
  await can('right').dispatchEvent('click');assert.equal((await snap()).bags,1,'Rapid throws locked');
  const rings=await page.evaluate(()=>window.midwayDiagnostics.story().rings);
  await page.locator('#bell').dispatchEvent('click');await page.locator('#music-open').dispatchEvent('click');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.story().rings),rings);
  assert.equal(await page.locator('#music-clue').isVisible(),false);
  await freeze('beanbag flight');await page.clock.runFor(140);
  await page.screenshot({path:`${output}/can-falling.png`});
  await freeze('can falling');await page.clock.runFor(400);
  assert.deepEqual((await snap()).down,['top']);
  await can('left').tap();await page.clock.runFor(1500);
  assert.equal((await snap()).failed,true);assert.equal((await snap()).tokenAwarded,false);
  assert.equal(await page.locator('#prize-retry').isVisible(),true);
  assert.deepEqual(await page.locator('.prize-bag-0,.prize-bag-1').evaluateAll(bags=>bags.map(bag=>bag.style.opacity)),['1','1'],'Returned bags must make retry discoverable');
  await page.screenshot({path:`${output}/retry.png`});
  await page.locator('#prize-retry').tap();assert.equal((await snap()).bags,2);
  // Keyboard uses the same aims, without an additional panel or control mode.
  await can('left').focus();await page.keyboard.press('Enter');await page.clock.runFor(1500);
  assert.deepEqual(new Set((await snap()).down),new Set(['left','top']));
  const startsBefore=await page.evaluate(()=>window.audioStarts.length);
  await can('right').tap();await page.clock.runFor(800);
  assert.equal((await snap()).phase,'win');assert.equal((await snap()).tokenAwarded,false);
  await freeze('winning chime');
  await page.clock.runFor(1800);
  assert.equal((await snap()).phase,'haunted');await page.screenshot({path:`${output}/haunted-story.png`});
  await freeze('haunted prizes');
  await page.clock.runFor(3200);
  assert.equal((await snap()).phase,'token');await page.screenshot({path:`${output}/token-reveal.png`});
  await freeze('token reveal');
  await page.clock.runFor(3000);
  assert.equal((await snap()).completedStories,1);assert.equal((await snap()).tokenAwarded,true);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().souvenirTokens),1);
  assert.equal(await page.locator('.prize-token').evaluate(el=>el.style.opacity),'1');
  assert.match(await page.locator('#prize-status').textContent(),/Brass Ferris-wheel keepsake received/);
  assert.deepEqual(await page.locator('.prize-bag-0,.prize-bag-1').evaluateAll(bags=>bags.map(bag=>bag.style.opacity)),['1','1'],'Returned bags must make replay discoverable');
  const starts=await page.evaluate(count=>window.audioStarts.slice(count),startsBefore);
  assert.ok(starts.some(s=>Math.abs(s.duration-2.4)<.01&&s.offset>0),'Winning chime resumes at a saved offset');
  assert.ok(starts.some(s=>Math.abs(s.duration-.85)<.01),'Tin hit is decoded and played');
  await page.screenshot({path:`${output}/waiting-token.png`});

  // Native audio interruption uses the same explicit-resume rule.
  await page.evaluate(()=>window.testContext.suspend());
  for(let i=0;i<5;i++)await page.clock.runFor(20);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.snapshot().state),'paused');
  const interrupted=await snap();await page.clock.runFor(12000);assert.deepEqual(await snap(),interrupted);
  await page.locator('#playback').tap();
  // Booth and carousel replays cannot reset the waiting prize or admission.
  for(let i=0;i<3;i++)await page.locator('#bell').click();
  await page.clock.runFor(8100);
  assert.equal((await snap()).tokenAwarded,true);assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().admissionTickets),1);
  for(const note of ['left','right','center','left'])await page.locator(`[data-horse-note=${note}]`).tap();
  await can('left').dispatchEvent('click');assert.equal((await snap()).bags,0);
  await page.clock.runFor(8100);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('#prize-retry').tap();
  assert.equal(await page.locator('#claim-token').isVisible(),false,'Claim must not overlap replay aiming');
  assert.equal((await snap()).tokenOpacity,0,'Keep earned token progress while clearing replay artwork');
  await can('right').tap();await page.clock.runFor(650);
  assert.ok((await snap()).canPos.every(p=>p.x===0&&p.y===0&&p.tilt===0));
  await page.clock.runFor(850);await can('left').tap();await page.clock.runFor(3500);
  assert.equal((await snap()).prizeY,0);await page.clock.runFor(6500);
  assert.equal((await snap()).completedStories,2);assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().souvenirTokens),1);
  // Only the existing bottom narration is visible as an instructional box.
  assert.equal(await page.locator('.hint-mockup:visible').count(),1);
  assert.equal(await page.locator('.prize-controls p,.prize-controls dialog').count(),0);
  await page.reload();await page.clock.runFor(100);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().souvenirTokens),0);
  assert.equal((await snap()).unlocked,false);assert.equal((await snap()).bags,2);
  assert.equal(await page.locator('#prize-controls').isVisible(),false);

  const git=(...args)=>execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{maxBuffer:32*1024*1024});
  const files=git('ls-tree','-r','--name-only','e160093','--','assets','dev/previews').toString().trim().split('\n');
  for(const file of files)assert.deepEqual(await readFile(file),git('show',`e160093:${file}`),`Approved asset/preview changed: ${file}`);
  for(const name of ['prize-can-v1.png','prize-counter-v1.png','keepsake-token-v1.svg'])assert.deepEqual(await readFile(`assets/story/${name}`),await readFile(`dev/previews/assets/${name}`));
  assert.deepEqual(errors,[]);
  const result={status:'passed',touchAndKeyboard:true,twoBagsAndSupportedStack:true,topFirstFailureAndManualRetry:true,rapidInputLocked:true,oneEightSecondPrizeStory:true,waitingTokenAwardedOnce:true,progressSafeReplay:true,sharedPauseAtEveryPhase:true,audioResumeOffsets:true,nativeInterruptionWaitsForPlay:true,reducedMotion:true,allApprovedAssetsAndPreviewsUnchanged:true,refreshStartsFresh:true,projectPrefixPaths:true,layouts,errors,limits:['Desktop Chromium touch emulation; physical-phone review pending','Prize regression only; claim and disappearance are covered by check-ending.mjs']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
} finally {await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
