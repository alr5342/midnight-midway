import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const output = process.argv[2] || 'artwork-review/p1-4';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'no-preference' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
const sample = () => page.evaluate(() => ({
  ...window.midwayDiagnostics.snapshot(),
  display: getComputedStyle(document.querySelector('.ambient-bats')).display,
  bats: [...document.querySelectorAll('.flying-bat')].map(element => ({ transform: element.getAttribute('transform'), wing: element.querySelector('.bat-wings').getAttribute('transform'), opacity: element.style.opacity })),
  fog: [...document.querySelectorAll('.fog-rear,.fog-front')].map(element => element.getAttribute('transform')),
  lights: [...document.querySelectorAll('.wheel-bulb-light,.gondola-light')].map(element => element.style.opacity)
}));
await page.goto('http://127.0.0.1:4173/?diagnostics');
await page.locator('img').evaluateAll(async images => { await Promise.all(images.map(image => image.decode())); });
assert.equal((await sample()).display, 'none');
await page.locator('#enter').click();
await page.waitForFunction(() => Number(document.querySelector('.flying-bat').style.opacity) > .5);
const first = await sample();
await page.waitForTimeout(120);
const flying = await sample();
assert.notEqual(flying.bats[0].transform, first.bats[0].transform);
assert.notEqual(flying.bats[0].wing, first.bats[0].wing);
await page.screenshot({ path: `${output}/flight-phone.png` });
await page.locator('#playback').tap();
const frozen = await sample();
await page.waitForTimeout(600);
assert.deepEqual(await sample(), frozen);
const resumed = await page.evaluate(() => {
  document.querySelector('#playback').click();
  const bat = document.querySelector('.flying-bat');
  return { transform: bat.getAttribute('transform'), wing: bat.querySelector('.bat-wings').getAttribute('transform') };
});
const numbers = value => value.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g).map(Number);
for (const key of ['transform', 'wing']) {
  const a = numbers(resumed[key]), b = numbers(frozen.bats[0][key]);
  assert.ok(a.every((value, index) => Math.abs(value - b[index]) < .02));
}
await page.waitForTimeout(150);
assert.notEqual((await sample()).bats[0].transform, resumed.transform);
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.waitForFunction(() => window.midwayDiagnostics.snapshot().reducedMotion);
assert.equal((await sample()).display, 'none');
assert.ok((await sample()).bats.every(bat => Number(bat.opacity) === 0));
await page.emulateMedia({ reducedMotion: 'no-preference' });
await page.waitForFunction(() => !window.midwayDiagnostics.snapshot().reducedMotion);
await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
const background = await sample();
await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
await page.waitForTimeout(150);
assert.deepEqual(await sample(), background);
await page.locator('#playback').tap();
for (let index = 0; index < 10; index++) await page.locator('#playback').click();
assert.equal((await sample()).scheduledFrames, 1);
assert.equal(await page.locator('.ambient-bats').count(), 1);
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.reload();
await page.locator('#enter').click();
assert.equal((await sample()).display, 'none');
assert.deepEqual(errors, []);
const result = { tests: 'passed', errors, checks: ['no bats before Enter', 'flight and wing movement', 'all three systems freeze together on touch Pause', 'same-phase resume', 'initial/live reduced motion hides flight', 'hidden-tab pause until Play', 'rapid toggles retain one overlay/loop'], limitations: ['Physical-phone testing pending', 'Visibility simulated', 'Historical strict touch screenshot comparisons remain unresolved; this checks exact clock/DOM transforms'] };
await writeFile(`${output}/checks.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
