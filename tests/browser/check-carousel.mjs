import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../../serve.mjs';
const output=process.argv[2] || 'tests/results/carousel-puzzle';
await mkdir(output,{recursive:true});
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || 'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const server=createPreviewServer({basePath:'/midnight-midway/'});
await new Promise(resolve=>server.listen(4178,'127.0.0.1',resolve));
const base='http://127.0.0.1:4178/midnight-midway/';
const browser=await chromium.launch({headless:true});
const errors=[],layouts=[];
try {
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await page.addInitScript(()=>{
    const Native=window.AudioContext;window.noteStarts=[];
    window.AudioContext=class extends Native {
      constructor(...args){super(...args);window.testContext=this;const create=this.createBufferSource.bind(this);this.createBufferSource=()=>{const source=create(),start=source.start.bind(source);source.start=(when,offset)=>{window.noteStarts.push({rate:source.playbackRate.value,offset,loop:source.loop});return start(when,offset);};return source;};}
    };
  });
  await page.goto(base+'?diagnostics');
  await page.waitForFunction(()=>!document.querySelector('#enter').disabled);
  assert.equal(await page.locator('#carousel-controls').isVisible(),false);
  await page.locator('[data-horse-note="left"]').dispatchEvent('click');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().progress),0);
  await page.locator('#enter').click();
  await page.waitForFunction(()=>window.midwayDiagnostics.storyAudio().status==='ready'&&window.midwayDiagnostics.audio().status==='playing');
  for(let i=0;i<3;i++)await page.locator('#bell').click();
  await page.locator('[data-horse-note="left"]').dispatchEvent('click');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().progress),0);
  await page.waitForFunction(()=>window.midwayDiagnostics.journey().admitted);
  assert.equal(await page.locator('#carousel-controls').isVisible(),true);
  const select=note=>page.locator(`[data-horse-note="${note}"]`);
  await select('left').tap();assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().progress),1);
  await select('center').tap();assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().progress),0);
  assert.match(await page.locator('#carousel-progress').textContent(),/Wrong/);
  await page.locator('#music-open').focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#music-clue').isVisible(),true);
  assert.match(await page.locator('.music-sequence').textContent(),/Left → Right → Center → Left/);
  const rings=await page.evaluate(()=>window.midwayDiagnostics.story().rings);
  await page.locator('#bell').dispatchEvent('click');
  await select('left').dispatchEvent('click');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().progress),0);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.story().rings),rings);
  await page.screenshot({path:`${output}/music-clue.png`});
  await page.locator('#playback').click();
  const pausedPaper=await page.evaluate(()=>window.midwayDiagnostics.carousel());
  await page.locator('#music-close').dispatchEvent('click');await page.waitForTimeout(100);
  assert.deepEqual(await page.evaluate(()=>window.midwayDiagnostics.carousel()),pausedPaper);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
  await page.locator('#playback').click();
  assert.equal(await page.locator('#music-clue').isVisible(),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#music-open').evaluate(el=>el===document.activeElement),true);
  await page.evaluate(()=>window.noteStarts=[]);
  for(const note of ['left','right','center']) {
    await select(note).focus();await page.keyboard.press('Space');
    await page.waitForTimeout(60);
    assert.equal(await select(note).getAttribute('data-active'),'true');
  }
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().progress),3);
  // Suspend all motion/sound while the current note is still sounding.
  await page.locator('#playback').tap();
  const frozen=await page.evaluate(()=>window.midwayDiagnostics.carousel());
  await select('left').dispatchEvent('click');await page.waitForTimeout(180);
  assert.deepEqual(await page.evaluate(()=>window.midwayDiagnostics.carousel()),frozen);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
  await page.locator('#playback').tap();
  await page.waitForTimeout(35);
  const starts=await page.evaluate(()=>window.noteStarts.filter(source=>!source.loop));
  assert.equal(new Set(starts.map(source=>source.rate)).size,3,'Notes must have three distinct pitches');
  assert.ok(starts.some(source=>source.rate>1&&source.offset>.02),'Pitched note must resume from saved buffer offset');
  await select('left').tap();
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().solved),true);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().progress),4);
  assert.match(await page.locator('#carousel-progress').textContent(),/Melody complete/);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.story().playing),false,'Puzzle success must not start another story');
  assert.equal(await page.locator('.story-window').isVisible(),false);
  assert.equal(await page.locator('#admission').isVisible(),true);
  await page.screenshot({path:`${output}/puzzle-solved.png`});
  // The existing booth can still be replayed after solving; puzzle memory stays.
  for(let i=0;i<3;i++)await page.locator('#bell').click();
  assert.equal(await page.locator('#carousel-controls').isVisible(),false);
  await select('right').dispatchEvent('click');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().progress),4);
  await page.waitForFunction(()=>window.midwayDiagnostics.story().completed===2);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().solved),true);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.journey().admissionTickets),1);
  for(const [width,height] of [[390,844],[320,568],[280,568],[844,390]]) {
    await page.setViewportSize({width,height});
    const layout=await page.locator('#carousel-controls').evaluate(el=>{
      const r=el.getBoundingClientRect(),stage=document.querySelector('#stage').getBoundingClientRect();return {fits:r.left>=stage.left&&r.right<=stage.right+.5&&r.bottom<=stage.bottom,targets:[...el.querySelectorAll('button')].map(button=>{const b=button.getBoundingClientRect();return [b.width,b.height];})};
    });
    assert.equal(layout.fits,true);assert.ok(layout.targets.every(([w,h])=>w>=44&&h>=44));
    await page.locator('#music-open').click();
    const paper=await page.locator('#music-clue').boundingBox();assert.ok(paper.x>=0&&paper.y>=0&&paper.x+paper.width<=width&&paper.y+paper.height<=height);
    const pause=await page.locator('#playback').boundingBox();assert.ok(paper.y>pause.y+pause.height,'Clue must not cover Play/Pause');
    await page.locator('#music-close').click();layouts.push({width,height,...layout});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await select('left').click();assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().progress),1);
  await page.evaluate(()=>window.testContext.suspend());
  await page.waitForFunction(()=>window.midwayDiagnostics.snapshot().state==='paused');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().progress),1);
  await page.reload();await page.waitForFunction(()=>!document.querySelector('#enter').disabled);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.carousel().solved),false);
  assert.equal(await page.locator('#carousel-controls').isVisible(),false);
  // Fast-forward only the shared clock for hint tests, not an independent timer.
  await page.clock.install();await page.locator('#enter').click();
  await page.waitForFunction(()=>window.midwayDiagnostics.storyAudio().status==='ready');
  for(let i=0;i<3;i++)await page.locator('#bell').click();
  await page.clock.runFor(10500);const first=await page.locator('#hint').textContent();
  await page.clock.runFor(12000);const second=await page.locator('#hint').textContent();
  await page.locator('#playback').click();await page.clock.runFor(30000);
  await page.locator('#playback').click();assert.equal(await page.locator('#hint').textContent(),second);
  await page.clock.runFor(12000);const third=await page.locator('#hint').textContent();
  assert.equal(new Set([first,second,third]).size,3);
  assert.ok(![first,second,third].some(text=>text.includes('Left → Right')),'Hints must not print the solution');
  assert.deepEqual(errors,[]);
  const git=(...args)=>execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{maxBuffer:32*1024*1024});
  for(const file of git('ls-tree','-r','--name-only','0895f9c','--','assets').toString().trim().split('\n'))assert.deepEqual(await readFile(file),git('show',`0895f9c:${file}`));
  const result={status:'passed',baseCommit:'0895f9c',admissionGate:true,solution:['left','right','center','left'],mistakeResetsAttempt:true,inspectableClueAndFocus:true,clueLocksSceneInput:true,threeDistinctPitches:true,pitchedCueResume:true,pausePreservesAttemptAndFeedback:true,progressiveHints:[first,second,third],hintsPauseWithClock:true,boothReplayPreservesAdmissionAndPuzzle:true,reducedMotion:true,refreshStartsFresh:true,noCarouselStory:true,artworkAudioAssetBytesUnchanged:true,layouts,errors,limits:['Focused desktop Chromium integration, not physical-phone verification','Carousel success remembers the puzzle; ride story and prize-stall unlock remain deferred']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
} finally {await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
