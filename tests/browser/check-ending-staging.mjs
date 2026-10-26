import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../../serve.mjs';

const output=process.argv[2] || 'tests/results/ending-field-staging';
await mkdir(output,{recursive:true});
const git=(...args)=>execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{maxBuffer:32*1024*1024});
const protectedFiles=git('ls-tree','-r','--name-only','840227d','--','src','assets','index.html','submissions').toString().trim().split('\n').filter(Boolean);
for(const file of protectedFiles) assert.deepEqual(await readFile(file),git('show',`840227d:${file}`),`Protected runtime/media changed: ${file}`);
assert.deepEqual(await readFile('dev/previews/assets/keepsake-token-v1.svg'),git('show','ee0959b:dev/previews/assets/keepsake-token-v1.svg'),'Approved token direction changed');
const zip='submissions/midnight-midway-phase1-20261016184044-final.zip';
assert.equal(createHash('sha256').update(await readFile(zip)).digest('hex'),'4c3d9bc0f40726dc2de73d8e2fbe9afe802a8dc8418f2d7b3f850edfdd1a6aa3');

const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || 'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
// Project-prefix hosting verifies nested preview SVG/CSS/module paths.
const server=createPreviewServer({basePath:'/midnight-midway/'});
await new Promise(resolve=>server.listen(4177,'127.0.0.1',resolve));
const base='http://127.0.0.1:4177/midnight-midway/';
const browser=await chromium.launch({headless:true});
const errors=[],layouts=[],captures=[];
try {
  const page=await browser.newPage({viewport:{width:390,height:1000},hasTouch:true});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await page.addInitScript(()=>{
    window.createdAudioContexts=0;
    if(window.AudioContext)window.AudioContext=new Proxy(window.AudioContext,{construct(target,args){window.createdAudioContexts++;return Reflect.construct(target,args);}});
  });
  const decode=()=>page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
  await page.goto(base+'dev/previews/index.html?view=ending');await decode();
  assert.equal(await page.locator('.ending-wheel-memory .carriage-patch').count(),1);
  assert.equal(await page.locator('audio').count(),0);
  for(const beat of ['offered','claimed','fading','wheel','gone']) {
    await page.selectOption('#ending-beat',beat);
    assert.equal(await page.locator('#ending-stage').getAttribute('data-beat'),beat);
    const path=`${output}/${beat}.png`;
    await page.locator('#ending-phone').screenshot({path});captures.push({beat,path});
    const before=await page.locator('#ending-stage').evaluate(el=>({beat:el.dataset.beat,siteOpacity:getComputedStyle(el.querySelector('.ending-artwork')).opacity,animations:document.getAnimations().length}));
    await page.waitForTimeout(150);
    assert.deepEqual(await page.locator('#ending-stage').evaluate(el=>({beat:el.dataset.beat,siteOpacity:getComputedStyle(el.querySelector('.ending-artwork')).opacity,animations:document.getAnimations().length})),before);
    assert.equal(before.animations,0);
  }
  assert.equal(await page.locator('.ending-artwork').evaluate(el=>getComputedStyle(el).opacity),'0');
  assert.equal(await page.locator('.ending-land').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await page.locator('.ending-darkness').count(),0);
  for(const name of ['booth','carousel','stall','wheel']) assert.equal(await page.locator(`.ending-${name}-memory`).evaluate(el=>getComputedStyle(el).opacity),'0');
  assert.equal(await page.locator('.ending-fog').evaluate(el=>getComputedStyle(el).opacity),'0');
  assert.equal(await page.locator('.ending-wheel-memory').evaluate(el=>getComputedStyle(el).opacity),'0');
  assert.equal(await page.locator('.ending-last-light').evaluate(el=>getComputedStyle(el).opacity),'0');
  assert.equal(await page.locator('.ending-pause').isVisible(),false);
  assert.equal(await page.locator('.ending-revisit').isVisible(),false);
  await page.locator('#ending-return').check();
  assert.equal(await page.locator('.ending-revisit').isVisible(),true);
  await page.locator('#ending-phone').screenshot({path:`${output}/gone-with-revisit.png`});
  // A placement mockup cannot initiate a real reset or ending.
  assert.equal(await page.locator('.ending-revisit').evaluate(el=>el.tagName),'SPAN');
  assert.equal(await page.evaluate(()=>window.createdAudioContexts),0);
  for(const [width,height,ratio] of [[390,844,'tall'],[375,667,'short'],[320,568,'short']]) {
    await page.setViewportSize({width,height});await page.selectOption('#ending-ratio',ratio);
    await page.selectOption('#ending-beat','fading');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const result=await page.locator('#ending-phone').evaluate(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height};});
    assert.ok(result.width<=width);layouts.push({viewportWidth:width,viewportHeight:height,ratio,phoneWidth:result.width,phoneHeight:result.height});
    await page.screenshot({path:`${output}/preview-${width}.png`,fullPage:true});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
  for(const view of ['artwork','carriage','booth','scene','story']) {
    await page.goto(base+`dev/previews/index.html?view=${view}`);await decode();
    assert.ok(await page.locator('.scene').count()>0);
    if(view==='story') {await page.selectOption('#beat','stamp');assert.equal(await page.locator('.story-stamp').isVisible(),true);}
  }
  // Smoke-check unchanged app startup/Enter/Pause on the same project prefix.
  await page.goto(base+'?diagnostics');await page.waitForFunction(()=>!document.querySelector('#enter').disabled);
  await page.locator('#enter').click();await page.locator('#playback').click();
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.snapshot().state),'paused');
  assert.deepEqual(errors,[]);
  // Contact sheet is a browser-rendered review page, not a changed scene asset.
  const sheet=await browser.newPage({viewport:{width:1400,height:720},deviceScaleFactor:1});
  const labels={offered:'Token offered',claimed:'2s · Booth fading',fading:'5s · Attractions fading',wheel:'8s · Last wheel',gone:'10s · Empty land'};
  const cards=[];
  for(const {beat,path} of captures)cards.push(`<figure><figcaption>${labels[beat]}</figcaption><img src="data:image/png;base64,${(await readFile(path)).toString('base64')}"></figure>`);
  await sheet.setContent(`<style>body{margin:0;padding:24px;background:#090c18;color:#e8d8bb;font:16px Georgia,serif}h1{font-weight:normal;margin:0 0 20px}section{display:flex;gap:16px}figure{margin:0;width:250px}figcaption{margin-bottom:12px}img{width:250px;height:auto}</style><h1>A night remembered — static visual staging</h1><section>${cards.join('')}</section>`);
  await sheet.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
  await sheet.screenshot({path:`${output}/contact-sheet.png`,fullPage:true});
  const result={status:'passed',staticOnly:true,protectedRuntimeAndAssetFiles:protectedFiles.length,phase1ZipUnchanged:true,tokenUnchanged:true,allSixPreviewModes:true,manualStages:captures.map(item=>item.beat),finalParkLayersInvisible:true,emptyLandRemainsVisible:true,noBlackoutOverlay:true,optionalRevisitPlacementOnly:true,noAudioContextsOrAnimations:true,layouts,projectPrefixPaths:true,unchangedAppEnterPauseSmoke:true,errors,limitations:['Static poses only; ten-second timing, audio fades, gameplay, claim and fresh-journey reset are not implemented or verified','New empty-field repair is a preview candidate, not approved production artwork','Human visual approval is pending']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
} finally {await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
