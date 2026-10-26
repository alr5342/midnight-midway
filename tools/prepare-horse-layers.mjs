import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

// Deterministic extraction of the approved pixels, not generated replacement
// horses. Keep the original scene-sized canvas so positions cannot drift.
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || 'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const output='tests/results/carousel-payoff/artwork';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1000,height:1800}});
  await page.goto('http://127.0.0.1:4173/');
  await page.setContent(`<link rel="stylesheet" href="/src/css/scene.css"><style>body{margin:0}.scene{width:941px}</style><div class="scene" data-view="assembled" data-attractions><img class="plate layer" src="/assets/artwork/midway-clean-plate.png"><img class="booth layer" src="/assets/artwork/ticket-booth.png"><img class="foreground layer" src="/assets/sources/artwork/midnight-midway-concept.png"></div>`);
  await page.evaluate(async()=>{const {mountSceneArtwork}=await import('/src/js/artwork.js');mountSceneArtwork();await Promise.all([...document.images].map(image=>image.decode()));});
  await page.evaluate(async()=>{
    // Always compare against the pre-extraction representation, even after the
    // runtime has switched to the exported transparent files.
    for(const name of ['left','center','right']) {
      const image=document.querySelector(`.horse-${name}`);
      image.src='/assets/sources/artwork/midnight-midway-concept.png';
      image.style.maskImage=`url('/assets/masks/horse-${name}-mask.svg')`;
      await image.decode();
    }
  });
  const scene=page.locator('.scene'),before=await scene.screenshot({path:`${output}/approved-static.png`});
  const layers=await page.evaluate(async()=>{
    const source=new Image();source.src='/assets/sources/artwork/midnight-midway-concept.png';await source.decode();
    const result=[];
    for(const name of ['left','center','right']) {
      const mask=new Image();mask.src=`/assets/masks/horse-${name}-mask.svg`;await mask.decode();
      const canvas=document.createElement('canvas');canvas.width=941;canvas.height=1672;
      const ctx=canvas.getContext('2d');ctx.drawImage(source,0,0);ctx.globalCompositeOperation='destination-in';ctx.drawImage(mask,0,0);
      const pixels=ctx.getImageData(0,0,941,1672).data;let opaque=0,clear=0;
      for(let i=3;i<pixels.length;i+=4){if(pixels[i]===255)opaque++;if(pixels[i]===0)clear++;}
      result.push({name,opaque,clear,png:canvas.toDataURL('image/png').split(',')[1]});
    }
    return result;
  });
  for(const layer of layers){assert.ok(layer.opaque>4000&&layer.clear>1500000);await writeFile(`assets/artwork/horse-${layer.name}.png`,Buffer.from(layer.png,'base64'));}
  await page.evaluate(async()=>{
    for(const horse of document.querySelectorAll('.horse-left,.horse-center,.horse-right')) {
      const name=['left','center','right'].find(name=>horse.classList.contains(`horse-${name}`));
      horse.src=`/assets/artwork/horse-${name}.png`;horse.style.maskImage='none';await horse.decode();
    }
  });
  const after=await scene.screenshot({path:`${output}/reassembled-static.png`});
  const comparison=await page.evaluate(async([a,b])=>{
    async function pixels(base64){const img=new Image();img.src='data:image/png;base64,'+base64;await img.decode();const c=document.createElement('canvas');c.width=941;c.height=1672;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return ctx.getImageData(250,900,420,170).data;}
    const x=await pixels(a),y=await pixels(b);let changed=0,error=0;
    for(let i=0;i<x.length;i+=4){let differs=false;for(let c=0;c<3;c++){error+=Math.abs(x[i+c]-y[i+c]);if(x[i+c]!==y[i+c])differs=true;}if(differs)changed++;}
    return {changedPixels:changed,changedFraction:changed/(420*170),meanChannelError:error/(420*170*3)};
  },[before.toString('base64'),after.toString('base64')]);
  assert.ok(comparison.changedFraction<.02&&comparison.meanChannelError<1,'Static reconstruction differs: stop before animation');
  await page.addStyleTag({content:'.horse-left,.horse-center,.horse-right{visibility:hidden}'});
  await scene.screenshot({path:`${output}/horse-free.png`});
  await page.addStyleTag({content:'.horse-left,.horse-center,.horse-right{visibility:visible}.horse-left{transform:translateY(-6px)}.horse-center{transform:translateY(-10px)}.horse-right{transform:translateY(-8px)}'});
  await scene.screenshot({path:`${output}/lifted-static.png`});
  const result={status:'passed',comparison,layers:layers.map(({png,...info})=>info),source:'Original pixels and approved SVG masks; existing hidden plate fills behind horses',staticReviewRequired:true};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
