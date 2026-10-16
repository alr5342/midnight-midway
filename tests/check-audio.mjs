import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const output = process.argv[2] || 'artwork-review/p1-5';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
await page.addInitScript(() => {
  const NativeContext = window.AudioContext;
  window.AudioContext = class extends NativeContext {
    constructor(...args) {
      super(...args); window.testAudioContext = this;
      const gain = super.createGain.bind(this);
      this.createGain = () => {
        const node = gain(); const analyser = this.createAnalyser(); analyser.fftSize = 1024;
        // Ambience creates the first gain; later story gains must not replace
        // the analyser used by this ambient-only signal regression.
        node.connect(analyser); window.testAnalyser ||= analyser; return node;
      };
    }
  };
});
await page.goto('http://127.0.0.1:4173/?diagnostics');
assert.deepEqual(await page.evaluate(() => window.midwayDiagnostics.audio()), { status: 'idle', contextState: 'not-created', activeSources: 0, duration: 0 });
await page.locator('#enter').focus();
await page.keyboard.press('Enter');
await page.waitForFunction(() => window.midwayDiagnostics.audio().status === 'playing');
const duration = await page.evaluate(() => window.midwayDiagnostics.audio().duration);
assert.ok(duration > 2);
const energy = await page.evaluate(async () => {
  let energy = 0;
  for (let count = 0; count < 10; count++) {
    await new Promise(resolve => setTimeout(resolve, 40));
    const data = new Float32Array(window.testAnalyser.fftSize);
    window.testAnalyser.getFloatTimeDomainData(data);
    energy = Math.max(energy, Math.sqrt(data.reduce((sum, value) => sum + value * value, 0) / data.length));
  }
  return energy;
});
assert.ok(energy > .0001, 'Audio graph produced no measurable signal');
await page.waitForTimeout(Math.ceil(duration * 1000 + 100));
assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().activeSources), 1);
await page.locator('#playback').tap();
await page.waitForFunction(() => window.midwayDiagnostics.audio().contextState === 'suspended');
const frozen = await page.evaluate(() => window.midwayDiagnostics.snapshot());
assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().activeSources), 0);
await page.waitForTimeout(200);
assert.deepEqual(await page.evaluate(() => window.midwayDiagnostics.snapshot()), frozen);
await page.locator('#playback').tap();
await page.waitForFunction(() => window.midwayDiagnostics.audio().status === 'playing');
for (let count = 0; count < 10; count++) await page.locator('#playback').click();
await page.waitForFunction(() => window.midwayDiagnostics.audio().status === 'playing');
assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().activeSources), 1);
// A native AudioContext suspension models an OS/browser interruption, without
// changing the app's visibility state or invoking its Pause button.
await page.evaluate(() => window.testAudioContext.suspend());
await page.waitForFunction(() => window.midwayDiagnostics.snapshot().state === 'paused');
assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().activeSources), 0);
await page.locator('#playback').tap();
await page.waitForFunction(() => window.midwayDiagnostics.audio().status === 'playing');
await page.evaluate(() => {
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  document.dispatchEvent(new Event('visibilitychange'));
});
await page.waitForFunction(() => window.midwayDiagnostics.audio().contextState === 'suspended');
await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().activeSources), 0);
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.locator('#playback').tap();
await page.waitForFunction(() => window.midwayDiagnostics.audio().status === 'playing');
await page.screenshot({ path: `${output}/playing.png` });
assert.deepEqual(errors, []);

// Failure and delayed-response cases use separate pages so production data and
// success-path console assertions remain distinct from deliberately bad input.
const failed = await browser.newPage();
await failed.route('**/assets/audio/midway-wind-loop.wav', route => route.fulfill({ status: 404, body: '' }));
await failed.goto('http://127.0.0.1:4173/?diagnostics');
await failed.locator('#enter').click();
await failed.waitForFunction(() => window.midwayDiagnostics.audio().status === 'unavailable');
assert.equal(await failed.locator('#audio-notice').isVisible(), true);
assert.equal(await failed.evaluate(() => window.midwayDiagnostics.snapshot().state), 'exploring');
await failed.unroute('**/assets/audio/midway-wind-loop.wav');
await failed.locator('#playback').click();
await failed.locator('#playback').click();
await failed.waitForFunction(() => window.midwayDiagnostics.audio().status === 'playing');
const delayed = await browser.newPage();
let release;
const gate = new Promise(resolve => { release = resolve; });
await delayed.route('**/assets/audio/midway-wind-loop.wav', async route => { await gate; await route.continue(); });
await delayed.goto('http://127.0.0.1:4173/?diagnostics');
await delayed.locator('#enter').click();
await delayed.locator('#playback').click();
release();
await delayed.waitForTimeout(350);
assert.equal(await delayed.evaluate(() => window.midwayDiagnostics.audio().activeSources), 0);
const processing = JSON.parse(await readFile('assets/audio/processing.json', 'utf8'));
assert.ok(processing.seamStep < .001);
const result = { tests: 'passed', errors, loopDuration: duration, measuredSignalRms: energy, seamStep: processing.seamStep,
  checks: ['no context/audio before Enter', 'keyboard activation and measurable decoded signal', 'loop continues past buffer duration', 'touch Pause stops source and suspends context', 'shared visual clock freezes', 'resume and rapid toggles retain one source', 'native context suspension pauses experience', 'hidden-tab silence until Play', 'reduced motion preserves audio', 'missing asset notice and retry', 'late load cannot sound while paused'],
  limits: ['Headless signal checks do not establish speaker volume or subjective loop quality', 'Actual phone/call interruption and listening review pending'] };
await writeFile(`${output}/checks.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
