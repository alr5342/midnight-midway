import { legacyAssetPath, artworkBaseline } from '../helpers/legacy-paths.mjs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const output = process.argv[2] || 'tests/results/p1-1';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', hasTouch: true });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
const snapshot = () => page.evaluate(() => window.midwayDiagnostics.snapshot());
await page.goto('http://127.0.0.1:4173/?diagnostics');
await page.locator('img').evaluateAll(async images => { await Promise.all(images.map(image => image.decode())); });
await page.waitForTimeout(120);
assert.deepEqual(await snapshot(), { state: 'start', elapsedMs: 0, canInteract: false, reducedMotion: true, scheduledFrames: 0 });
assert.equal(await page.locator('#motion-note').isVisible(), true);
assert.equal(await page.locator('#playback').isVisible(), false);
await page.screenshot({ path: `${output}/start.png` });
await page.locator('#enter').focus();
await page.keyboard.press('Enter');
assert.equal(await page.locator('#start-screen').isVisible(), false);
assert.equal(await page.locator('#playback').evaluate(element => element === document.activeElement), true);
await page.waitForTimeout(150);
const running = await snapshot();
assert.equal(running.state, 'exploring');
assert.equal(running.canInteract, true);
assert.equal(running.scheduledFrames, 1);
assert.ok(running.elapsedMs >= 100);
await page.screenshot({ path: `${output}/playing.png` });
await page.keyboard.press('Space');
const paused = await snapshot();
await page.waitForTimeout(200);
assert.deepEqual(await snapshot(), paused);
assert.equal(paused.scheduledFrames, 0);
assert.equal(paused.canInteract, false);
assert.equal(await page.locator('#playback').getAttribute('aria-label'), 'Play scene');
await page.screenshot({ path: `${output}/paused.png` });
await page.emulateMedia({ reducedMotion: 'no-preference' });
await page.waitForFunction(() => window.midwayDiagnostics.snapshot().reducedMotion === false);
assert.equal((await snapshot()).reducedMotion, false);
assert.equal((await snapshot()).state, 'paused');
await page.locator('#playback').tap();
assert.equal((await snapshot()).state, 'exploring');
await page.evaluate(() => {
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  document.dispatchEvent(new Event('visibilitychange'));
});
const backgroundPause = await snapshot();
await page.evaluate(() => {
  delete document.hidden;
  document.dispatchEvent(new Event('visibilitychange'));
});
await page.waitForTimeout(100);
assert.deepEqual(await snapshot(), backgroundPause);
assert.equal(backgroundPause.state, 'paused');
await page.locator('#playback').tap();
for (let index = 0; index < 10; index++) await page.locator('#playback').click();
assert.equal((await snapshot()).state, 'exploring');
assert.equal((await snapshot()).scheduledFrames, 1);

const layouts = [];
for (const [width, height] of [[390, 844], [375, 667], [320, 568], [844, 390]]) {
  await page.setViewportSize({ width, height });
  const layout = await page.evaluate(() => {
    const scene = document.querySelector('.scene').getBoundingClientRect();
    const button = document.querySelector('#playback').getBoundingClientRect();
    return { overflow: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight,
      sceneFits: scene.left >= 0 && scene.top >= 0 && scene.right <= innerWidth + 1 && scene.bottom <= innerHeight + 1,
      target: [button.width, button.height] };
  });
  assert.equal(layout.overflow, false);
  assert.equal(layout.sceneFits, true);
  assert.ok(layout.target.every(size => size >= 44));
  layouts.push({ width, height, ...layout });
  await page.screenshot({ path: `${output}/viewport-${width}x${height}.png` });
}

const hashes = artworkBaseline();
for (const item of hashes) {
  const current = createHash('sha256').update(await readFile(legacyAssetPath(item.Path))).digest('hex').toUpperCase();
  assert.equal(current, item.Hash, `Artwork changed: ${item.Path}`);
}
await page.goto('http://127.0.0.1:4173');
assert.equal(await page.evaluate(() => 'midwayDiagnostics' in window), false);
assert.deepEqual(errors, []);
const result = { tests: 'passed', errors, layouts, artworkFilesUnchanged: hashes.length,
  checks: ['pre-Enter clock/input gate', 'keyboard Enter and focus', 'Space pause', 'paused active-time freeze', 'touch resume', 'reduced-motion initial/live preference', 'simulated hidden-tab pause and explicit return', 'rapid toggles retain one frame loop', 'viewport fit and target size', 'normal URL has no diagnostics'], limitations: ['Shell regression only; story, audio and effects have separate integration checks', 'Visibility handler tested with synthetic events', 'Physical-device checks pending', 'Historical app-versus-review screenshot equality failed; see tests/results/p1-1-final/ and plan.md'] };
await writeFile(`${output}/checks.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
