import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { ticketStoryboard } from '../ticket-story-assets.js';
const timed = ticketStoryboard.filter(beat => beat.start !== null);
assert.equal(timed[0].start, 0);
assert.equal(timed.at(-1).end, 8);
timed.slice(1).forEach((beat,index) => assert.equal(beat.start, timed[index].end));
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const output = 'artwork-review/p1-6'; await mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
const errors=[]; page.on('pageerror',error=>errors.push(error.message)); page.on('response',response=>{if(response.status()>=400) errors.push(`${response.status()} ${response.url()}`);});
await page.goto('http://127.0.0.1:4173/story-review.html');
await page.waitForSelector('.ticket-story-art');
await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(image=>image.decode()));});
for(const beat of ticketStoryboard) {
  await page.selectOption('#beat',beat.id);
  await page.locator('.phone').screenshot({path:`${output}/${beat.id}.png`});
  const expected=['arrival','ticket','stamp','depart'].includes(beat.id);
  assert.equal(await page.locator('.story-window').isVisible(),expected);
}
const metrics=await page.evaluate(async()=>{
  const context=new AudioContext(), clips=[];
  for(const name of ['ring-1','ring-2','ring-3','arrival','stamp','departure']) {
    const response=await fetch(`assets/audio/story-${name}.wav`); if(!response.ok) throw Error(name);
    const audio=await context.decodeAudioData(await response.arrayBuffer());
    let peak=0;for(const value of audio.getChannelData(0)) peak=Math.max(peak,Math.abs(value));
    clips.push({name,duration:audio.duration,peak});
  }
  await context.close();
  const image=new Image();image.src='assets/story/ghost-attendant-v1.png';await image.decode();
  const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
  const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const data=ctx.getImageData(0,0,image.width,image.height).data;
  let transparent=0; for(let i=3;i<data.length;i+=4) if(data[i]===0)transparent++;
  return {clips,ghost:{width:image.width,height:image.height,transparentPixels:transparent}};
});
assert.ok(metrics.ghost.transparentPixels>0,'Ghost sprite lacks transparent pixels');
// Browser sample-rate conversion can overshoot the prepared peak slightly;
// verify the meaningful invariant: decoded cues are non-silent and unclipped.
assert.ok(metrics.clips.every(clip=>clip.duration>0&&clip.peak>0&&clip.peak<1),JSON.stringify(metrics.clips));
assert.equal(new Set(metrics.clips.slice(0,3).map(clip=>clip.duration)).size,3);
await page.selectOption('#beat','stamp');
await page.setViewportSize({width:1100,height:1900});
await page.locator('.phone').evaluate(element=>{element.style.width='941px';element.style.maxWidth='none';});
await page.locator('main').evaluate(element=>{element.style.maxWidth='none';});
const box=await page.locator('.scene').boundingBox();
await page.screenshot({path:`${output}/booth-detail.png`,clip:{x:box.x+30,y:box.y+760,width:290,height:350}});
const hashes=JSON.parse((await readFile('docs/history/20261016-145826/artwork-hashes.json','utf8')).replace(/^\uFEFF/,''));
for(const entry of hashes)assert.equal(createHash('sha256').update(await readFile(entry.Path)).digest('hex').toUpperCase(),entry.Hash);
assert.deepEqual(errors,[]);
const result={tests:'passed',eightSecondStoryboard:true,errors,metrics,unchangedArtworkFiles:hashes.length,limits:['Static staging only: runtime playback/lockout/pause in P1.7 and trigger/hints in P1.8','Sound listening and physical-phone review pending']};
await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();
