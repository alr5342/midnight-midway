// Read-only source-pixel analysis for positioning the wheel's light overlays.
import { pathToFileURL } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
await mkdir('tests/results/p1-2-alignment', { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 941, height: 760 } });
await page.goto('http://127.0.0.1:4173/dev/previews/index.html?view=artwork');
const points = await page.evaluate(async () => {
  const image = new Image(); image.src = new URL('../../assets/artwork/midway-clean-plate.png',location.href).href; await image.decode();
  const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
  const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, image.width, image.height).data;
  const seen = new Set(), points = [];
  const bright = (x, y) => {
    if (x < 100 || x > 780 || y < 80 || y > 690) return false;
    const i = (y * image.width + x) * 4;
    return pixels[i] > 225 && pixels[i + 1] > 145 && pixels[i + 2] > 45 && pixels[i] > pixels[i + 2] * 1.05;
  };
  for (let y = 80; y <= 690; y++) for (let x = 100; x <= 780; x++) {
    const key = y * image.width + x;
    if (seen.has(key) || !bright(x, y)) continue;
    const queue = [[x, y]], cluster = [];
    seen.add(key);
    while (queue.length) {
      const [cx, cy] = queue.pop(); cluster.push([cx, cy]);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy, next = ny * image.width + nx;
        if (!seen.has(next) && bright(nx, ny)) { seen.add(next); queue.push([nx, ny]); }
      }
    }
    if (cluster.length < 3 || cluster.length > 85) continue;
    const px = Math.round(cluster.reduce((sum, point) => sum + point[0], 0) / cluster.length);
    const py = Math.round(cluster.reduce((sum, point) => sum + point[1], 0) / cluster.length);
    // Keep the wheel above the carousel and out of the nearby hanging lights.
    if (py > 620 && (px < 290 || px > 610)) continue;
    points.push([px, py]);
  }
  return points;
});
await writeFile('archive/reviews/p1-2-alignment/source-bulb-centers.json', JSON.stringify(points));
await page.setContent('<style>body{margin:0;background:#050711}img{width:941px;position:absolute;left:0;top:0}svg{position:absolute;inset:0}</style><img src="http://127.0.0.1:4173/assets/artwork/midway-clean-plate.png"><svg width="941" height="760">' + points.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#62fff1" stroke-width="1"/>`).join('') + '</svg>');
await page.locator('img').evaluate(image => image.decode());
await page.screenshot({ path: 'archive/reviews/p1-2-alignment/source-centers.png' });
console.log(JSON.stringify({ points, count: points.length }));
await browser.close();
