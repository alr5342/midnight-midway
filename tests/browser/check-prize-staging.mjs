import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../../serve.mjs';

const output='tests/results/prize-staging';await mkdir(output,{recursive:true});
const git=(...args)=>execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,...args],{maxBuffer:32*1024*1024});
const baseline='5bd5ff2';
const protectedFiles=git('ls-tree','-r','--name-only',baseline,'--','src','assets','index.html','dev/previews/assets/empty-field-v1.png','dev/previews/assets/keepsake-token-v1.svg').toString().trim().split('\n');
for(const file of protectedFiles)assert.deepEqual(await readFile(file),git('show',`${baseline}:${file}`),`Changed approved runtime/ending asset: ${file}`);
const normalize=text=>text.replaceAll('\r\n','\n');
const html=await readFile('dev/previews/index.html','utf8');
assert.equal(html.match(/<template id="preview-ending">[\s\S]*?<\/template>/)[0],git('show',`${baseline}:dev/previews/index.html`).toString().match(/<template id="preview-ending">[\s\S]*?<\/template>/)[0]);
const css=normalize(await readFile('dev/previews/preview.css','utf8')),oldCSS=normalize(git('show',`${baseline}:dev/previews/preview.css`).toString());
const endingComment='/* Manual ending poses only:';
assert.equal(css.slice(css.indexOf(endingComment)),oldCSS.slice(oldCSS.indexOf(endingComment)));
const script=normalize(await readFile('dev/previews/preview.js','utf8')),oldScript=normalize(git('show',`${baseline}:dev/previews/preview.js`).toString());
const endingBranch=text=>text.slice(text.indexOf("if (view === 'ending')"),text.indexOf("if (view === 'artwork')"));
assert.equal(endingBranch(script),endingBranch(oldScript));

const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE||'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const server=createPreviewServer({basePath:'/midnight-midway/'});await new Promise(resolve=>server.listen(4180,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true}),errors=[],layouts=[];
try {
  const page=await browser.newPage({viewport:{width:430,height:1100},hasTouch:true});
  page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await page.addInitScript(()=>{window.createdAudioContexts=0;if(window.AudioContext)window.AudioContext=new Proxy(window.AudioContext,{construct(target,args){window.createdAudioContexts++;return Reflect.construct(target,args);}});});
  const base='http://127.0.0.1:4180/midnight-midway/';
  await page.goto(base+'dev/previews/index.html?view=prize');
  await page.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
  assert.equal(await page.locator('.prize-can').count(),3);
  assert.equal(await page.locator('.prize-props button,.prize-props input,audio,dialog').count(),0);
  assert.equal(await page.locator('#prize-scene p').count(),1,'Only the bottom narration is an in-scene text box');
  assert.deepEqual(await page.locator('.prize-rules text').allTextContents(),['2 BAGS','3 CANS']);
  const before=await page.locator('.prize-props').innerHTML();await page.locator('.prize-can-left').dispatchEvent('click');await page.waitForTimeout(100);
  assert.equal(await page.locator('.prize-props').innerHTML(),before,'Static props must not implement gameplay');
  assert.equal(await page.evaluate(()=>window.createdAudioContexts),0);
  assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
  await page.locator('#prize-phone').screenshot({path:`${output}/phone-390.png`});
  for(const width of [390,320,280]) {
    await page.setViewportSize({width,height:1100});
    await page.selectOption('#prize-ratio','tall');
    const layout=await page.locator('#prize-scene').evaluate(el=>{
      const scene=el.getBoundingClientRect(),bounds=[...el.querySelectorAll('.prize-can,.prize-rules')].map(node=>{const r=node.getBoundingClientRect();return {x:(r.x-scene.x)/scene.width,y:(r.y-scene.y)/scene.height,w:r.width/scene.width,h:r.height/scene.height,fits:r.x>=scene.x&&r.right<=scene.right&&r.y>=scene.y&&r.bottom<=scene.bottom};});
      return {sceneWidth:scene.width,allPropsFit:bounds.every(b=>b.fits),bounds,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert.equal(layout.allPropsFit,true);assert.equal(layout.overflow,false);layouts.push({requestedWidth:width,...layout});
    await page.locator('#prize-phone').screenshot({path:`${output}/phone-${width}.png`});
    await page.locator('#prize-zones').check();
    assert.equal(await page.locator('.prize-aim:visible').count(),3);
    assert.ok((await page.locator('.prize-aim').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().width))).every(w=>w===44));
    await page.locator('#prize-phone').screenshot({path:`${output}/aim-zones-${width}.png`});
    await page.locator('#prize-zones').uncheck();
  }
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
  await page.selectOption('#prize-ratio','short');assert.equal(await page.locator('#prize-phone').getAttribute('data-ratio'),'short');
  await page.goto(base+'dev/previews/index.html?view=ending');await page.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
  for(const beat of ['offered','wheel','gone']){await page.selectOption('#ending-beat',beat);assert.equal(await page.locator('#ending-stage').getAttribute('data-beat'),beat);}
  assert.equal(await page.locator('.ending-land').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await page.locator('.ending-wheel-memory').evaluate(el=>getComputedStyle(el).opacity),'0');
  assert.equal(await page.evaluate(()=>window.createdAudioContexts),0);
  await page.goto(base+'?diagnostics');await page.waitForFunction(()=>!document.querySelector('#enter').disabled);await page.locator('#enter').click();await page.locator('#playback').click();
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.snapshot().state),'paused');
  assert.equal(await page.locator('.prize-props').count(),0,'Preview must not be installed into the app');
  assert.deepEqual(errors,[]);
  const result={status:'passed',staticOnly:true,threeCans:true,twoBeanbags:'painted in the counter asset; visually reviewed',oneBottomNarrationBox:true,previewHasNoGameplayOrAudio:true,proposedAimGuidesOnly:true,protectedRuntimeAndAssetFiles:protectedFiles.length,endingTemplateStylesLogicAndAssetsUnchanged:true,endingPoseSmoke:true,projectPrefixPaths:true,runtimeEnterPauseSmoke:true,layouts,errors,limits:['Artwork/layout approval pending','Aim guides are proposed areas, not tested throwing controls','Physical-phone review pending; no gameplay, scoring, can physics, token award or ending playback']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
