import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const output = process.argv[2] || 'artwork-review/p1-1';
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

// Compare the artwork alone at exactly the same dimensions in app and review.
await page.setViewportSize({ width: 390, height: 844 });
const review = await context.newPage();
await review.goto('http://127.0.0.1:4173/artwork-review.html');
await review.locator('img').evaluateAll(async images => { await Promise.all(images.map(image => image.decode())); });
// Product controls live outside .scene, while review mockups live inside it.
await review.selectOption('#ui', 'off');
const reviewBounds = await review.locator('#scene').boundingBox();
await page.locator('.app-ui').evaluate(element => element.style.visibility = 'hidden');
await page.locator('#stage').evaluate((element, bounds) => {
  element.style.position = 'fixed';
  element.style.width = `${bounds.width}px`;
  element.style.left = `${bounds.x}px`;
  element.style.top = `${bounds.y % 1}px`;
}, reviewBounds);
const appArt = await page.locator('.scene').screenshot();
const cleanReviewArt = await review.locator('#scene').screenshot();
await writeFile(`${output}/artwork-app.png`, appArt);
await writeFile(`${output}/artwork-approved-review.png`, cleanReviewArt);
const artworkSame = await page.evaluate(async ({ a, b }) => {
  const decode = async data => { const image = new Image(); image.src = 'data:image/png;base64,' + data; await image.decode(); const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height; const context = canvas.getContext('2d'); context.drawImage(image, 0, 0); return context.getImageData(0, 0, canvas.width, canvas.height).data; };
  const first = await decode(a), second = await decode(b);
  if (first.length !== second.length) return false;
  return first.every((value, index) => value === second[index]);
}, { a: appArt.toString('base64'), b: cleanReviewArt.toString('base64') });
assert.equal(artworkSame, true, 'App artwork differs from approved review at identical dimensions');
await writeFile(`${output}/artwork-only.png`, appArt);

const hashes = JSON.parse((await readFile('docs/history/20261016-145826/artwork-hashes.json', 'utf8')).replace(/^\uFEFF/, ''));
for (const item of hashes) {
  const current = createHash('sha256').update(await readFile(item.Path)).digest('hex').toUpperCase();
  assert.equal(current, item.Hash, `Artwork changed: ${item.Path}`);
}
await page.goto('http://127.0.0.1:4173');
assert.equal(await page.evaluate(() => 'midwayDiagnostics' in window), false);
assert.deepEqual(errors, []);
const result = { tests: 'passed', errors, layouts, artworkPixelIdentical: artworkSame, artworkFilesUnchanged: hashes.length,
  checks: ['pre-Enter clock/input gate', 'keyboard Enter and focus', 'Space pause', 'paused active-time freeze', 'touch resume', 'reduced-motion initial/live preference', 'simulated hidden-tab pause and explicit return', 'rapid toggles retain one frame loop', 'viewport fit and target size', 'normal URL has no diagnostics'], limitations: ['No audio or effects connected yet', 'Visibility handler tested with synthetic events', 'Physical-device checks pending'] };
await writeFile(`${output}/checks.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
