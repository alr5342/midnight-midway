import { legacyAssetPath, artworkBaseline } from '../helpers/legacy-paths.mjs';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const output = process.argv[2] || 'tests/results/p1-7-8';
await mkdir(output, {recursive:true});
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if(response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
await page.addInitScript(() => {
  const NativeContext = window.AudioContext;
  window.audioStarts = [];
  window.AudioContext = class extends NativeContext {
    constructor(...args) {
      super(...args); window.testAudioContext = this;
      const createGain = this.createGain.bind(this);
      this.createGain = () => {
        const gain = createGain(), analyser = this.createAnalyser(); analyser.fftSize = 1024;
        gain.connect(analyser); window.storyAnalyser = analyser; return gain;
      };
      const create = this.createBufferSource.bind(this);
      this.createBufferSource = () => {
        const source = create(), start = source.start.bind(source);
        source.start = (when,offset) => { window.audioStarts.push({loop:source.loop,offset}); start(when,offset); };
        return source;
      };
    }
  };
});
await page.goto('http://127.0.0.1:4173/?diagnostics');
const story = () => page.evaluate(() => window.midwayDiagnostics.story());
const audio = () => page.evaluate(() => window.midwayDiagnostics.storyAudio());
assert.equal(await page.locator('#bell').isVisible(),false);
assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().contextState),'not-created');
await page.locator('#enter').click();
await page.waitForFunction(() => window.midwayDiagnostics.story().assetsReady && window.midwayDiagnostics.storyAudio().status === 'ready');
assert.equal((await audio()).sharedContext,true);
const restingMarkup = await page.locator('.ticket-story-art').evaluate(element=>element.outerHTML);
const bellBox = await page.locator('#bell').boundingBox(); assert.ok(bellBox.width>=44 && bellBox.height>=44);
await page.keyboard.press('Tab');
assert.equal(await page.locator('#bell').evaluate(element=>element===document.activeElement),true,'Tab from Play/Pause should reach bell');

async function pauseAndVerify(label) {
  await page.locator('#playback').tap();
  await page.waitForFunction(() => window.midwayDiagnostics.audio().contextState === 'suspended');
  const frozen = await page.evaluate(() => ({clock:window.midwayDiagnostics.snapshot(),story:window.midwayDiagnostics.story(),markup:document.querySelector('.ticket-story-art').outerHTML,hint:document.querySelector('#hint').textContent}));
  assert.equal((await audio()).activeSources,0);
  assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().activeSources),0);
  await page.locator('#bell').dispatchEvent('click');
  await page.waitForTimeout(240);
  assert.deepEqual(await page.evaluate(() => ({clock:window.midwayDiagnostics.snapshot(),story:window.midwayDiagnostics.story(),markup:document.querySelector('.ticket-story-art').outerHTML,hint:document.querySelector('#hint').textContent})),frozen,label);
  await page.locator('#playback').tap();
  await page.waitForFunction(() => window.midwayDiagnostics.audio().status === 'playing');
}

await page.locator('#bell').tap();
assert.equal((await story()).rings,1);
assert.match(await page.locator('#ring-progress').textContent(),/1 chime/);
const cueEnergy = await page.evaluate(async () => {
  let energy = 0;
  for(let sample=0;sample<5;sample++) {
    await new Promise(resolve=>setTimeout(resolve,20));
    const values = new Float32Array(window.storyAnalyser.fftSize);
    window.storyAnalyser.getFloatTimeDomainData(values);
    energy = Math.max(energy, Math.sqrt(values.reduce((sum,value)=>sum+value*value,0)/values.length));
  }
  return energy;
});
assert.ok(cueEnergy>.0001,'Story audio graph produced no measurable signal');
await page.waitForTimeout(110); await pauseAndVerify('ring feedback');
await page.locator('#bell').focus(); await page.keyboard.press('Enter');
assert.equal((await story()).rings,2);
assert.match(await page.locator('#ring-progress').textContent(),/2 chimes/);
await page.keyboard.press('Space');
assert.equal((await story()).playing,true);
assert.equal((await story()).rings,3);
await page.locator('#bell').dispatchEvent('click');
assert.equal((await story()).rings,3);
await page.waitForTimeout(120); await pauseAndVerify('arrival');
for(const beat of ['ticket','stamp','depart','reset']) {
  await page.waitForFunction(beat => window.midwayDiagnostics.story().beat === beat,beat);
  await page.screenshot({path:`${output}/${beat}.png`});
  await pauseAndVerify(beat);
}
await page.waitForFunction(() => window.midwayDiagnostics.story().completed === 1);
assert.equal((await story()).rings,0);
assert.equal(await page.locator('.story-window').isVisible(),false);
assert.equal(await page.locator('.story-ticket').isVisible(),false);
assert.equal((await audio()).activeSources,0);
assert.equal(await page.locator('.ticket-story-art').evaluate(element=>element.outerHTML),restingMarkup,'Reset must restore resting overlay state');
assert.match(await page.locator('#hint').textContent(),/bell waits again/);

// Replay twice without a reload; rapid fourth/fifth presses cannot add stories.
for (const count of [2,3]) {
  for(let ring=0;ring<5;ring++) await page.locator('#bell').dispatchEvent('click');
  assert.equal((await story()).rings,3);
  if(count===2) {
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(() => window.midwayDiagnostics.story().beat === 'stamp');
    const state=await story(); assert.equal(state.ticketY,0);assert.equal(state.stampY,0);assert.equal(state.sparkScale,1);
    await page.screenshot({path:`${output}/reduced-stamp.png`});
    // Native shared-context interruption pauses the story and all sound.
    await page.evaluate(() => window.testAudioContext.suspend());
    await page.waitForFunction(() => window.midwayDiagnostics.snapshot().state === 'paused');
    assert.equal((await audio()).activeSources,0);
    await page.locator('#playback').tap();
  }
  await page.waitForFunction(count => window.midwayDiagnostics.story().completed === count,count);
}
const starts=await page.evaluate(() => window.audioStarts);
assert.ok(starts.some(start => !start.loop && start.offset > .1),'Paused cue was not resumed from an offset');
assert.equal(await page.locator('.ticket-story-art').count(),1);
assert.equal(await page.evaluate(() => window.midwayDiagnostics.snapshot().scheduledFrames),1);
await page.locator('#playback').tap();

// Accelerated hint checks still advance the actual shared RAF/performance clock.
const hints=await browser.newPage({viewport:{width:320,height:568},reducedMotion:'reduce'});
await hints.goto('http://127.0.0.1:4173/?diagnostics');
await hints.clock.install();
await hints.locator('#enter').click();
const first=await hints.locator('#hint').textContent();
await hints.clock.runFor(12100); const second=await hints.locator('#hint').textContent();
await hints.locator('#playback').click();
await hints.clock.runFor(30000);assert.equal(await hints.locator('#hint').textContent(),'Paused. Choose Play to continue.');
await hints.locator('#playback').click();assert.equal(await hints.locator('#hint').textContent(),second);
await hints.clock.runFor(12100);const third=await hints.locator('#hint').textContent();
assert.equal(new Set([first,second,third]).size,3);
assert.ok(!/three|3|times/i.test(third),'Hint gives away the solution');
await hints.screenshot({path:`${output}/hints-small-phone.png`});

const failed = await browser.newPage();
await failed.route('**/assets/audio/story-stamp.wav',route=>route.fulfill({status:404,body:''}));
await failed.goto('http://127.0.0.1:4173/?diagnostics');await failed.locator('#enter').click();
await failed.waitForFunction(()=>window.midwayDiagnostics.storyAudio().status==='unavailable');
assert.equal(await failed.locator('#story-notice').isVisible(),true);
await failed.unroute('**/assets/audio/story-stamp.wav');
await failed.locator('#playback').click();await failed.locator('#playback').click();
await failed.waitForFunction(()=>window.midwayDiagnostics.storyAudio().status==='ready');
assert.equal(await failed.locator('#story-notice').isVisible(),false);

const brokenArt=await browser.newPage();
await brokenArt.route('**/assets/story/ghost-attendant-v3.png',route=>route.fulfill({status:404,body:''}));
await brokenArt.goto('http://127.0.0.1:4173/?diagnostics');await brokenArt.locator('#enter').click();
await brokenArt.waitForFunction(()=>window.midwayDiagnostics.story().assetFailure);
await brokenArt.locator('#bell').dispatchEvent('click');
assert.equal(await brokenArt.evaluate(()=>window.midwayDiagnostics.story().rings),0);
assert.equal(await brokenArt.locator('#story-notice').isVisible(),true);
await brokenArt.locator('#playback').click();
assert.equal(await brokenArt.evaluate(()=>window.midwayDiagnostics.snapshot().state),'paused');

const delayed=await browser.newPage();let release;
const wait=new Promise(resolve=>{release=resolve;});
await delayed.route('**/assets/audio/story-*.wav',async route=>{await wait;await route.continue();});
await delayed.goto('http://127.0.0.1:4173/?diagnostics');await delayed.locator('#enter').click();
await delayed.waitForFunction(()=>window.midwayDiagnostics.story().assetsReady);
await delayed.locator('#bell').dispatchEvent('click');
assert.equal(await delayed.evaluate(()=>window.midwayDiagnostics.story().rings),0,'Input must wait for initially loading cues');
await delayed.locator('#playback').click();release();
await delayed.waitForFunction(()=>window.midwayDiagnostics.storyAudio().status==='ready');
assert.equal(await delayed.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);

const hashes=artworkBaseline();
for(const entry of hashes) assert.equal(createHash('sha256').update(await readFile(legacyAssetPath(entry.Path))).digest('hex').toUpperCase(),entry.Hash);
assert.deepEqual(errors,[]);
const result={tests:'passed',completedCycles:3,pauseBeats:['ring feedback','arrival','ticket','stamp','depart','reset'],touchAndKeyboard:true,distinctProgress:true,cueResumeOffset:true,cueEnergy,sharedContext:true,exactRestingOverlayReset:true,progressiveHints:[first,second,third],audioFailureRetry:true,artFailureSafe:true,lateLoadPaused:true,unchangedArtworkFiles:hashes.length,errors,limits:['Desktop Chromium only; physical phone/audio listening/public deployment still pending']};
await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2)); console.log(JSON.stringify(result,null,2));
await browser.close();
