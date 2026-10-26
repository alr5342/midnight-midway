import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const base=process.argv[2] || 'https://alr5342.github.io/midnight-midway/';
assert.ok(base.startsWith('https://'),'Public verification requires HTTPS');
const output=process.argv[3] || 'tests/results/pages-live';
await mkdir(output,{recursive:true});
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || 'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const browser=await chromium.launch({headless:true});
const errors=[],resources=new Map(),checks=[];
try {
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{
    if(response.status()>=400) errors.push(`${response.status()} ${response.url()}`);
    if(response.url().startsWith(base)) resources.set(response.url(),{status:response.status(),type:response.headers()['content-type']});
  });
  const response=await page.goto(base+'?diagnostics');assert.equal(response.status(),200);
  assert.equal(await page.title(),'The Midnight Midway');
  await page.waitForFunction(()=>!document.querySelector('#enter').disabled);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.audio().contextState),'not-created');
  await page.screenshot({path:`${output}/start-phone.png`});
  await page.locator('#enter').click();
  await page.waitForFunction(()=>window.midwayDiagnostics.audio().status==='playing' && window.midwayDiagnostics.storyAudio().status==='ready');
  checks.push('HTTPS entry, artwork/masks and all audio decoded');
  await page.locator('#credits-open').click();
  assert.equal(await page.locator('#credits-dialog').isVisible(),true);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.audio().activeSources),0);
  await page.locator('#credits-close').click();
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.snapshot().state),'paused');
  await page.locator('#playback').click();
  checks.push('Credits, shared pause and explicit resume');
  for(let ring=1;ring<=3;ring++) {
    await page.locator('#bell').tap();
    assert.equal(await page.evaluate(()=>window.midwayDiagnostics.story().rings),ring);
    await page.waitForTimeout(140);
  }
  await page.locator('#bell').dispatchEvent('click');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.story().rings),3);
  await page.waitForFunction(()=>window.midwayDiagnostics.story().beat==='stamp');
  await page.locator('#playback').tap();
  const frozen=await page.evaluate(()=>({clock:window.midwayDiagnostics.snapshot(),story:window.midwayDiagnostics.story(),markup:document.querySelector('.ticket-story-art').outerHTML}));
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.audio().activeSources),0);
  await page.waitForTimeout(350);
  assert.deepEqual(await page.evaluate(()=>({clock:window.midwayDiagnostics.snapshot(),story:window.midwayDiagnostics.story(),markup:document.querySelector('.ticket-story-art').outerHTML})),frozen);
  await page.screenshot({path:`${output}/stamp-paused-phone.png`});
  await page.locator('#playback').tap();
  await page.waitForFunction(()=>window.midwayDiagnostics.story().completed===1);
  checks.push('Three-ring progress/lockout, full story and exact pause/resume');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('#bell').focus();
  await page.keyboard.press('Enter');await page.keyboard.press('Enter');await page.keyboard.press('Space');
  await page.waitForFunction(()=>window.midwayDiagnostics.story().beat==='ticket');
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.story().ticketY),0);
  await page.waitForFunction(()=>window.midwayDiagnostics.story().completed===2);
  assert.equal(await page.locator('.story-window').isVisible(),false);
  assert.equal(await page.evaluate(()=>window.midwayDiagnostics.story().rings),0);
  checks.push('Keyboard replay and reduced-motion complete story');
  await page.locator('#playback').tap();
  for(const [width,height] of [[390,844],[375,667],[320,568],[844,390]]) {
    await page.setViewportSize({width,height});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth || document.documentElement.scrollHeight>innerHeight),false);
  }
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:`${output}/rest-phone.png`});
  // Verify the deployed bytes, not only successful HTTP status. Normalize text
  // line endings because Git intentionally stores source files with LF.
  const verified=[];
  for(const [url,resource] of resources) {
    const relative=decodeURIComponent(new URL(url).pathname.slice(new URL(base).pathname.length));
    if(!relative || !/\.(?:js|css|png|svg|wav)$/.test(relative)) continue;
    const remote=await page.request.get(url);assert.equal(remote.status(),200);
    let actual=await remote.body(),expected=await readFile(relative);
    if(/\.(?:js|css)$/.test(relative)) {actual=Buffer.from(actual.toString('utf8').replaceAll('\r\n','\n'));expected=Buffer.from(expected.toString('utf8').replaceAll('\r\n','\n'));}
    assert.equal(createHash('sha256').update(actual).digest('hex'),createHash('sha256').update(expected).digest('hex'),`Deployed file mismatch: ${relative}`);
    verified.push({path:relative,...resource});
  }
  assert.ok(verified.some(file=>file.path==='assets/story/ghost-attendant-v3.png'));
  assert.equal(verified.filter(file=>file.path.endsWith('.wav')).length,7);
  assert.ok(verified.filter(file=>file.path.endsWith('.svg')).length>=10);
  checks.push('Deployed source/artwork/masks and seven audio assets match local bytes');
  await page.goto(base);
  assert.equal(await page.evaluate(()=>'midwayDiagnostics' in window),false);
  await page.reload();await page.waitForFunction(()=>!document.querySelector('#enter').disabled);
  assert.deepEqual(errors,[]);
  checks.push('Normal public URL/reload works, no diagnostics or missing resources');
  const result={status:'passed',url:base,verifiedAt:new Date().toISOString(),checks,verifiedResources:verified,errors,limits:['Desktop Chromium at phone viewports; actual-phone verification remains required','No submission ZIP created']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));
  console.log(JSON.stringify({status:result.status,url:base,checks,verifiedResources:verified.length},null,2));
} finally {await browser.close();}
