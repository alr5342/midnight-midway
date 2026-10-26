// Regression evidence specific to the approved directory/consolidation cleanup.
// Run after tests/results/organization/before-* has been captured locally.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../../serve.mjs';

const output='tests/results/organization';
await mkdir(output,{recursive:true});
const baseline=JSON.parse(await readFile(`${output}/before-inventory.json`,'utf8'));
const mapping=JSON.parse(await readFile('docs/FILE-MAP.json','utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const git=(...args)=>execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{encoding:'utf8'});
const previous=file=>git('show',`4f7ed1b:${file}`).replaceAll('\r\n','\n');
const preserved=[];
for(const entry of baseline) {
  if(!entry.path.startsWith('submissions/') && !entry.path.startsWith('docs/history/') && !entry.path.startsWith('artwork-review/') && !entry.path.startsWith('assets/') && !entry.path.startsWith('reference/') && !['brief.md','AGENTS.md','CLAUDE.md','.nojekyll','.gitattributes'].includes(entry.path)) continue;
  // Relocated artwork notes are current documentation; their links changed.
  if(entry.path.startsWith('assets/') && entry.path.endsWith('.md')) continue;
  const current=mapping[entry.path] || entry.path;
  assert.equal(hash(await readFile(current)),entry.sha256,`Preserved file changed: ${current}`);
  preserved.push(current);
}
// Consolidation must not reorder/remove CSS declarations. Normalize only URL
// relocation and comments/whitespace, then compare the full cascade text.
const normalizeCSS=text=>text.replace(/\/\*[\s\S]*?\*\//g,'').replace(/url\([^)]+\)/g,'url(ASSET)').replaceAll(/\s+/g,'');
const oldCSS=['styles.css','artwork.css','ticket-story-assets.css'].map(previous).join('\n');
assert.equal(normalizeCSS(await readFile('src/css/scene.css','utf8')),normalizeCSS(oldCSS));
assert.equal(normalizeCSS(await readFile('src/css/app.css','utf8')),normalizeCSS(previous('app.css')));
for(const file of ['playback.js','lighting.js','fog.js','bats.js','ticket-story.js','story-audio.js','ambient-audio.js']) {
  const normalize=text=>text.replaceAll('\r\n','\n').replaceAll('./ticket-story-assets.js','./artwork.js')
    .replace("fetch('assets/audio/midway-wind-loop.wav')","fetch(new URL('../../assets/audio/midway-wind-loop.wav', import.meta.url))")
    .replace('fetch(`assets/audio/story-${name}.wav`)','fetch(new URL(`../../assets/audio/story-${name}.wav`, import.meta.url))');
  assert.equal(normalize(await readFile(`src/js/${file}`,'utf8')),normalize(previous(file)),`Unexpected behavior edit: ${file}`);
}
// Confirm that active documentation contains no broken local Markdown links.
async function documents(directory) {
  const found=[];
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    if(entry.name==='history')continue;
    const file=`${directory}/${entry.name}`;
    if(entry.isDirectory())found.push(...await documents(file));
    else if(entry.name.endsWith('.md'))found.push(file);
  }
  return found;
}
const brokenLinks=[];
for(const file of ['README.md','CREDITS.md','research.md','spec.md','plan.md',...await documents('docs')]) {
  const text=await readFile(file,'utf8');
  for(const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const href=match[1];if(/^(?:https?:|#)/.test(href))continue;
    const target=path.resolve(path.dirname(file),href.split(/[?#]/)[0]);
    try {await readFile(target);} catch {brokenLinks.push({file,href});}
  }
}
assert.deepEqual(brokenLinks,[],'Current documentation contains broken local links');

const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || 'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch({headless:true});
const server=createPreviewServer({basePath:'/midnight-midway/'});
await new Promise(resolve=>server.listen(4176,'127.0.0.1',resolve));
const base='http://127.0.0.1:4176/midnight-midway/';
const errors=[],previewResults=[],comparisons=[];
try {
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  async function ready() {await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));}
  async function compareCapture(name,locator) {
    const after=await locator.screenshot({path:`${output}/after-${name}.png`});
    const before=await readFile(`${output}/before-${name}.png`);
    const pixels=await page.evaluate(async ([before,after])=>{
      async function decode(base64) {
        const image=new Image();image.src='data:image/png;base64,'+base64;await image.decode();
        const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
        const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
        return {width:image.width,height:image.height,data:ctx.getImageData(0,0,image.width,image.height).data};
      }
      const a=await decode(before),b=await decode(after);
      if(a.width!==b.width || a.height!==b.height)return {sameDimensions:false};
      let changedPixels=0;
      for(let i=0;i<a.data.length;i+=4)if([0,1,2,3].some(c=>a.data[i+c]!==b.data[i+c]))changedPixels++;
      return {sameDimensions:true,changedPixels};
    },[before.toString('base64'),after.toString('base64')]);
    comparisons.push({name,...pixels});
    assert.equal(pixels.sameDimensions,true);
    // Report pixel differences without retrying historical strict screenshot
    // comparisons; geometry, CSS cascade and source hashes are separate proof.
  }
  await page.goto(base);await page.waitForFunction(()=>!document.querySelector('#enter').disabled);await ready();
  const geometry=await page.evaluate(()=>Object.fromEntries(['#stage','.scene','.booth','.foreground','#enter','#credits-open'].map(selector=>{
    const el=document.querySelector(selector),r=el.getBoundingClientRect();
    return [selector,{x:r.x,y:r.y,width:r.width,height:r.height,transform:getComputedStyle(el).transform}];
  })));
  assert.deepEqual(geometry,JSON.parse(await readFile(`${output}/before-geometry.json`,'utf8')));
  await compareCapture('start',page);
  for(const view of ['artwork','carriage','booth','scene','story']) {
    await page.goto(base+`dev/previews/index.html?view=${view}`);await ready();
    assert.equal(await page.locator('body').getAttribute('data-preview'),view);
    assert.equal(await page.locator('.preview-nav a[aria-current="page"]').count(),1);
    for(const link of await page.locator('a[href]').evaluateAll(links=>links.map(a=>a.href))) {
      if(!link.startsWith(base))continue;
      const response=await page.request.get(link);assert.equal(response.status(),200,link);
    }
    if(view==='artwork') await compareCapture('artwork',page.locator('.phone'));
    if(view==='story') {
      await page.selectOption('#beat','stamp');await compareCapture('story',page.locator('.phone'));
      const audio=page.locator('#sounds audio');assert.equal(await audio.count(),6);
      for(const src of await audio.evaluateAll(items=>items.map(a=>a.src))) assert.equal((await page.request.get(src)).status(),200);
      await page.selectOption('#art','hide');assert.equal(await page.locator('.ticket-story-art').isVisible(),false);
    }
    previewResults.push({view,linksAndImages:true});
  }
  assert.deepEqual(errors,[]);
  const result={status:'passed',baseRevision:'4f7ed1bbcb8e08c9171002c49d8a80450350e252',preservedFiles:preserved.length,submissionFilesUnchanged:preserved.filter(file=>file.startsWith('submissions/')).length,artworkAudioAndHistoryBytesUnchanged:true,cssCascadeUnchanged:true,coreLogicUnchangedExceptPaths:true,startGeometryUnchanged:true,comparisons,previews:previewResults,nestedPagesPath:true,documentationLinks:true,errors,publishedSite:'Not changed; branch was not pushed or deployed'};
  await writeFile(`${output}/organization-checks.json`,JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
} finally {await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
