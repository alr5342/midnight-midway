import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { lightingAt } from '../lighting.js';
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const output = process.argv[2] || 'artwork-review/p1-2';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
await page.goto('http://127.0.0.1:4173/?diagnostics');
await page.locator('img').evaluateAll(async images => { await Promise.all(images.map(image => image.decode())); });
const sample = () => page.evaluate(() => ({
  ...window.midwayDiagnostics.snapshot(),
  bulbs: Number(document.querySelector('.wheel-bulb-light').style.opacity),
  gondola: Number(document.querySelector('.gondola-light').style.opacity),
  display: getComputedStyle(document.querySelector('.ambient-lighting')).display
}));
assert.equal((await sample()).display, 'none');
await page.waitForTimeout(150);
assert.equal((await sample()).elapsedMs, 0);
await page.locator('#enter').click();
assert.notEqual((await sample()).display, 'none');
const first = await sample();
await page.waitForTimeout(400);
const advanced = await sample();
assert.notEqual(advanced.bulbs, first.bulbs);
assert.notEqual(advanced.gondola, first.gondola);
await page.locator('#playback').click();
const paused = await sample();
const before = await page.locator('.scene').screenshot({ path: `${output}/paused-before.png` });
await page.waitForTimeout(500);
const after = await page.locator('.scene').screenshot({ path: `${output}/paused-after.png` });
assert.deepEqual(await sample(), paused);
assert.equal(before.equals(after), true, 'Rendered scene changed while paused');
// Read opacity immediately after resume in the same task, before another frame.
const resumed = await page.evaluate(() => {
  document.querySelector('#playback').click();
  return { bulbs: Number(document.querySelector('.wheel-bulb-light').style.opacity), gondola: Number(document.querySelector('.gondola-light').style.opacity) };
});
assert.ok(Math.abs(resumed.bulbs - paused.bulbs) < 0.001);
assert.ok(Math.abs(resumed.gondola - paused.gondola) < 0.001);
await page.waitForTimeout(300);
const progressing = await sample();
const expected = lightingAt(progressing.elapsedMs, false);
assert.ok(Math.abs(progressing.bulbs - expected.bulbs) < 0.003);
assert.ok(Math.abs(progressing.gondola - expected.gondola) < 0.003);
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.waitForFunction(() => window.midwayDiagnostics.snapshot().reducedMotion);
const reduced = await sample();
await page.waitForTimeout(250);
assert.equal((await sample()).bulbs, reduced.bulbs);
assert.equal((await sample()).gondola, reduced.gondola);
assert.equal(reduced.bulbs, lightingAt(0, true).bulbs);
await page.emulateMedia({ reducedMotion: 'no-preference' });
await page.waitForFunction(() => !window.midwayDiagnostics.snapshot().reducedMotion);
await page.evaluate(() => {
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  document.dispatchEvent(new Event('visibilitychange'));
});
const hidden = await sample();
await page.waitForTimeout(200);
await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
assert.deepEqual(await sample(), hidden);
assert.equal(hidden.state, 'paused');
await page.locator('#playback').click();
for (let index = 0; index < 10; index++) await page.locator('#playback').click();
assert.equal((await sample()).scheduledFrames, 1);
assert.equal(await page.locator('.ambient-lighting').count(), 1);

// Capture reviewed bounds without changing the production clock or controls.
await page.locator('#playback').click();
for (const [name, light] of [['low', { bulbs: .04, gondola: .03 }], ['high', { bulbs: .20, gondola: .13 }]]) {
  await page.evaluate(light => {
    document.querySelector('.wheel-bulb-light').style.opacity = light.bulbs;
    document.querySelector('.gondola-light').style.opacity = light.gondola;
  }, light);
  await page.screenshot({ path: `${output}/${name}.png` });
}
// Initial reduced-motion entry also stays constant, not just live changes.
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.reload();
await page.locator('#enter').click();
assert.equal((await sample()).bulbs, .12);
await page.waitForTimeout(250);
assert.equal((await sample()).bulbs, .12);
assert.equal((await sample()).gondola, .08);
assert.deepEqual(errors, []);
const result = { tests: 'passed', errors, pausedRenderedPixelsIdentical: true,
  checks: ['hidden before Enter', 'both light groups advance', 'paused scene pixels unchanged after 500ms', 'resume retains phase', 'shared-clock phase after resume', 'initial and live reduced motion constant', 'hidden-tab lighting freeze until explicit Play', 'rapid toggles: one overlay and one loop'],
  limits: ['No fog, bats, audio or story behavior', 'Physical-phone verification pending', 'Visibility simulated with events'] };
await writeFile(`${output}/checks.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
