import { pathToFileURL } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const directory = process.argv[2] || 'artwork-review/carriage-v4';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1000, height: 1050 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
await page.goto('http://127.0.0.1:4173/carriage-review.html');
await page.locator('img').evaluateAll(async images => { await Promise.all(images.map(image => image.decode())); });
await page.screenshot({ path: `${directory}/comparison.png`, fullPage: true });
// Capture the same element with the patch off/on to exclude subpixel differences
// between two grid columns from the pixel-preservation check.
const scene = page.locator('.scene').last();
await scene.evaluate(element => element.querySelector('.carriage-patch').style.visibility = 'hidden');
const before = await scene.screenshot({ path: `${directory}/before.png` });
await scene.evaluate(element => element.querySelector('.carriage-patch').style.visibility = '');
const after = await scene.screenshot({ path: `${directory}/after.png` });
const preservation = await page.evaluate(async ({ before, after }) => {
  async function decode(data) {
    const image = new Image();
    image.src = 'data:image/png;base64,' + data;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    return { width: image.width, height: image.height, data: context.getImageData(0, 0, image.width, image.height).data };
  }
  const a = await decode(before), b = await decode(after);
  let changedInside = 0, changedOutside = 0;
  for (let y = 0; y < a.height; y++) for (let x = 0; x < a.width; x++) {
    const i = (y * a.width + x) * 4;
    if (a.data[i] === b.data[i] && a.data[i + 1] === b.data[i + 1] && a.data[i + 2] === b.data[i + 2]) continue;
    const sourceX = x / a.width * 941, sourceY = y / a.height * 1672;
    if (sourceX >= 650 && sourceX <= 775 && sourceY >= 350 && sourceY <= 490) changedInside++;
    else changedOutside++;
  }
  return { changedInside, changedOutside };
}, { before: before.toString('base64'), after: after.toString('base64') });
// Native-resolution inspection of the edited carriage and nearby wheel.
await page.goto('http://127.0.0.1:4173/artwork-review.html');
await page.locator('#phone').evaluate(element => { element.style.width = '941px'; element.style.maxWidth = 'none'; });
await page.locator('main').evaluate(element => { element.style.maxWidth = 'none'; });
await page.selectOption('#ui', 'off');
await page.locator('img').evaluateAll(async images => { await Promise.all(images.map(image => image.decode())); });
const bounds = await page.locator('#scene').boundingBox();
await page.screenshot({ path: `${directory}/carriage-detail.png`, clip: { x: bounds.x + 610, y: bounds.y + 320, width: 210, height: 200 } });
await page.locator('#phone').evaluate(element => { element.style.width = ''; element.style.maxWidth = ''; });
await page.selectOption('#ui', 'on');
for (const [width, height] of [[390, 844], [375, 667], [320, 568]]) {
  await page.setViewportSize({ width, height });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push(`Overflow at ${width}`);
  await page.locator('#phone').screenshot({ path: `${directory}/phone-${width}.png` });
}
const result = { preservation, errors };
await writeFile(`${directory}/checks.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
if (errors.length || preservation.changedOutside || !preservation.changedInside) process.exitCode = 1;
