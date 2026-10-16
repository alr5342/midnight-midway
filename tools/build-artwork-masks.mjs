import { readFile, writeFile } from 'node:fs/promises';

// Expand only the repair mask so a lifted piece cannot reveal its old edge.
// The source-piece masks keep the original scene coordinates and scale.
const names = ['horse-left', 'horse-center', 'horse-right', 'prize-pair'];
const paths = [];
for (const name of names) {
  const svg = await readFile(`assets/${name}-mask.svg`, 'utf8');
  paths.push(...svg.matchAll(/<path\b[^>]*\/>/g));
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 941 1672">
  <defs><filter id="edge" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feMorphology operator="dilate" radius="2"/><feGaussianBlur stdDeviation=".65"/></filter></defs>
  <g filter="url(#edge)">${paths.map(match => match[0]).join('\n')}</g>
</svg>\n`;
await writeFile('assets/attraction-repair-mask.svg', svg);
console.log(`Built repair mask from ${paths.length} source contours.`);
