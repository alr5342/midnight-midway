import { pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';

const { chromium } = await import(pathToFileURL(process.argv[2] || 'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);

const outputDirectory = process.argv[3] || 'tests/results/attractions-v3';
await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 1100 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
await page.goto('http://127.0.0.1:4173/dev/previews/index.html?view=artwork');
await page.locator('img').evaluateAll(async (images) => {
  await Promise.all(images.map((image) => image.decode()));
});
for (const mode of ['original', 'before', 'assembled', 'attraction-pieces', 'attraction-displaced', 'cutout', 'plate', 'displaced']) {
  await page.selectOption('#view', mode);
  await page.locator('.phone').screenshot({ path: `${outputDirectory}/${mode}.png` });
}
for (const [width, height] of [[390, 844], [375, 667], [320, 568]]) {
  await page.setViewportSize({ width, height });
  await page.selectOption('#view', 'assembled');
  await page.selectOption('#ratio', height === 844 ? 'tall' : 'short');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (overflow) errors.push(`Horizontal overflow at ${width} × ${height}`);
  await page.screenshot({ path: `${outputDirectory}/phone-${width}.png`, fullPage: true });
}
const assets = await page.locator('img').evaluateAll((images) => images.map((image) => ({
  source: image.getAttribute('src'), width: image.naturalWidth, height: image.naturalHeight
})));
await page.setViewportSize({ width: 1280, height: 1000 });
await page.goto('http://127.0.0.1:4173/dev/previews/index.html?view=booth');
await page.locator('img').evaluateAll(async (images) => { await Promise.all(images.map((image) => image.decode())); });
await page.screenshot({ path: `${outputDirectory}/comparison.png`, fullPage: true });
await page.goto('http://127.0.0.1:4173/dev/previews/index.html?view=scene');
await page.locator('img').evaluateAll(async (images) => { await Promise.all(images.map((image) => image.decode())); });
await page.screenshot({ path: `${outputDirectory}/full-scene-comparison.png`, fullPage: true });
console.log(JSON.stringify({ assets, errors, screenshots: outputDirectory }, null, 2));
await browser.close();
if (errors.length) process.exitCode = 1;
