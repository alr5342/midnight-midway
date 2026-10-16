import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import { lightingAt } from '../lighting.js';
import { lightingAt as approvedBrightness } from '../docs/history/20261016-153817/lighting.js';
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const output = 'artwork-review/p1-2-alignment';
await mkdir(output, { recursive: true });
for (let time = 0; time <= 90000; time += 137) {
  assert.deepEqual(lightingAt(time, false), approvedBrightness(time, false));
  assert.deepEqual(lightingAt(time, true), approvedBrightness(time, true));
}
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 1900 } });
await page.goto('http://127.0.0.1:4173/?diagnostics');
await page.locator('#enter').click();
await page.locator('#playback').click();
const alignment = await page.evaluate(async () => {
  const image = new Image(); image.src = 'assets/midway-clean-plate.png'; await image.decode();
  const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
  const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, image.width, image.height).data;
  const misses = [];
  const circles = [...document.querySelectorAll('.wheel-bulb-light circle')];
  for (const circle of circles) {
    const x = Number(circle.getAttribute('cx')), y = Number(circle.getAttribute('cy'));
    let warmPixels = 0;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const i = ((y + dy) * image.width + x + dx) * 4;
      if (pixels[i] > 225 && pixels[i + 1] > 145 && pixels[i + 2] > 45 && pixels[i] > pixels[i + 2] * 1.05) warmPixels++;
    }
    if (warmPixels < 3) misses.push({ x, y, warmPixels });
    if (circle.getAttribute('r') !== '11') throw Error('Approved halo radius changed');
  }
  return { checkedBulbs: circles.length, misses, sourceTolerancePixels: 3 };
});
assert.deepEqual(alignment.misses, []);
assert.equal(alignment.checkedBulbs, 55);
await page.locator('#stage').evaluate(element => { element.style.width = '941px'; });
await page.locator('.app-ui').evaluate(element => { element.style.visibility = 'hidden'; });
await page.evaluate(() => {
  document.querySelector('.wheel-bulb-light').style.opacity = '.70';
  document.querySelector('.gondola-light').style.opacity = '.72';
});
await page.locator('img').evaluateAll(async images => { await Promise.all(images.map(image => image.decode())); });
const bounds = await page.locator('.scene').boundingBox();
await page.screenshot({ path: `${output}/aligned-wheel-native.png`, clip: { x: bounds.x + 100, y: bounds.y + 80, width: 690, height: 630 } });
await page.locator('#stage').evaluate(element => { element.style.width = ''; });
await page.locator('.app-ui').evaluate(element => { element.style.visibility = ''; });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: `${output}/aligned-phone.png` });
const result = { tests: 'passed', alignment, brightnessAndTimingUnchanged: true, haloCountAndSizeUnchanged: true };
await writeFile(`${output}/alignment-checks.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
