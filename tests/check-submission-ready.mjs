import assert from 'node:assert/strict';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { createPreviewServer } from '../serve.mjs';

const playwright = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || 'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const output=process.argv[2] || 'artwork-review/p1-9';
await mkdir(output,{recursive:true});
const server = createPreviewServer({basePath:'/midnight-midway-check/'});
await new Promise(resolve=>server.listen(4174,'127.0.0.1',resolve));
const base='http://127.0.0.1:4174/midnight-midway-check/';
const results=[];

// Composite translucent backgrounds against white for conservative text
// contrast; the app's dark artwork only increases the measured contrast.
function contrast(foreground,background) {
  const parse=value=>value.match(/[\d.]+/g).map(Number);
  const fg=parse(foreground), bg=parse(background), alpha=bg[3] ?? 1;
  const luminance=rgb=>rgb.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  const l1=luminance(fg),l2=luminance(bg.slice(0,3).map(v=>v*alpha+255*(1-alpha)));
  return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
}

try {
  for(const name of (process.argv[3] || process.env.TEST_BROWSERS || 'chromium,firefox,webkit').split(',')) {
    console.log(`Starting ${name} preflight`);
    const browser=await playwright[name].launch({headless:true,timeout:15000});
    try {
      const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
      const errors=[],requests=new Set();
      page.on('pageerror',error=>errors.push(error.message));
      page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
      page.on('request',request=>{if(request.url().startsWith(base))requests.add(new URL(request.url()).pathname);});
      await page.goto(base+'?diagnostics');
      const audioCapability=await page.evaluate(()=>({standard:typeof window.AudioContext,prefixed:typeof window.webkitAudioContext}));
      const supportsAudio=audioCapability.standard==='function' || audioCapability.prefixed==='function';
      console.log(`${name} AudioContext availability: ${JSON.stringify(audioCapability)}`);
      await page.waitForFunction(()=>!document.querySelector('#enter').disabled);
      await page.locator('#credits-open').click();
      assert.equal(await page.locator('#credits-dialog').isVisible(),true);
      assert.match(await page.locator('#credits-dialog').textContent(),/Alex Rosemann/);
      assert.match(await page.locator('#credits-dialog').textContent(),/ChatGPT/);
      assert.equal(await page.evaluate(()=>window.midwayDiagnostics.audio().contextState),'not-created');
      // Native modal focus must stay inside, including forward/backward wraps.
      for(let i=0;i<12;i++) {
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(()=>document.querySelector('#credits-dialog').contains(document.activeElement)),true);
      }
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#credits-dialog').isVisible(),false);
      // The native dialog queues its close event; WebKit can hide the modal
      // before our close-event focus restoration has run.
      await page.waitForFunction(()=>document.querySelector('#credits-open')===document.activeElement);
      assert.equal(await page.locator('#credits-open').evaluate(el=>el===document.activeElement),true);
      await page.locator('#enter').focus();await page.keyboard.press('Enter');
      if(!supportsAudio) {
        // Do not fake Web Audio or claim an audio pass in a test build lacking
        // the API. Check the actual unavailable notice and visual-only fallback.
        await page.waitForFunction(()=>window.midwayDiagnostics.audio().status==='unavailable' && window.midwayDiagnostics.storyAudio().status==='unavailable');
        assert.equal(await page.locator('#audio-notice').isVisible(),true);
      } else await page.waitForFunction(()=>window.midwayDiagnostics.audio().status==='playing' && window.midwayDiagnostics.storyAudio().status==='ready',null,{timeout:10000}).catch(async error=>{
        const diagnostics=await page.evaluate(()=>({clock:window.midwayDiagnostics.snapshot(),ambient:window.midwayDiagnostics.audio(),storyAudio:window.midwayDiagnostics.storyAudio(),story:window.midwayDiagnostics.story(),audioConstructors:{standard:typeof window.AudioContext,prefixed:typeof window.webkitAudioContext}}));
        await writeFile(`${output}/${name}-startup-failure.json`,JSON.stringify({diagnostics,errors},null,2));
        console.error(JSON.stringify(diagnostics)); throw error;
      });
      assert.equal(await page.locator('#playback').evaluate(el=>el===document.activeElement),true);
      await page.keyboard.press('Tab');assert.equal(await page.locator('#bell').evaluate(el=>el===document.activeElement),true);
      await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>window.midwayDiagnostics.story().rings),1);
      const ratios={};
      for(const selector of ['#hint','#ring-progress','#credits-open','#credits-dialog','#credits-close','#audio-notice','#story-notice','#enter']) {
        const colors=await page.locator(selector).evaluate(el=>({fg:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor}));
        ratios[selector]=contrast(colors.fg,colors.bg);assert.ok(ratios[selector]>=4.5,`${name} ${selector} text contrast ${ratios[selector]}`);
      }
      await page.keyboard.press('Enter');await page.keyboard.press('Space');
      await page.waitForFunction(()=>window.midwayDiagnostics.story().beat==='ticket');
      await page.locator('#credits-open').click();
      const paused=await page.evaluate(()=>window.midwayDiagnostics.snapshot());
      const pausedStory=await page.evaluate(()=>window.midwayDiagnostics.story());
      assert.equal(paused.state,'paused');
      assert.equal(await page.evaluate(()=>window.midwayDiagnostics.storyAudio().activeSources),0);
      await page.waitForTimeout(180);
      assert.deepEqual(await page.evaluate(()=>window.midwayDiagnostics.story()),pausedStory);
      await page.locator('#credits-close').click();
      assert.equal(await page.evaluate(()=>window.midwayDiagnostics.snapshot().state),'paused');
      await page.locator('#playback').click();
      await page.waitForFunction(()=>window.midwayDiagnostics.story().completed===1);
      assert.equal(await page.locator('.story-window').isVisible(),false);
      await page.locator('#playback').click();
      const layouts=[];
      for(const [width,height] of [[390,844],[375,667],[320,568],[844,390],[280,568]]) {
        await page.setViewportSize({width,height});
        const layout=await page.evaluate(()=>{
          const rect=document.querySelector('#stage').getBoundingClientRect();
          return {overflow:document.documentElement.scrollWidth>innerWidth || document.documentElement.scrollHeight>innerHeight, fits:rect.right<=innerWidth+.5 && rect.bottom<=innerHeight+.5, targets:['#playback','#bell','#credits-open'].map(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return [r.width,r.height];})};
        });
        assert.equal(layout.overflow,false);assert.equal(layout.fits,true);
        assert.ok(layout.targets.every(([w,h])=>w>=44 && h>=44));
        await page.locator('#credits-open').click();
        const modal=await page.locator('#credits-dialog').boundingBox();assert.ok(modal.x>=0 && modal.y>=0 && modal.x+modal.width<=width+.5 && modal.y+modal.height<=height+.5);
        await page.screenshot({path:`${output}/${name}-credits-${width}x${height}.png`});
        await page.keyboard.press('Escape');layouts.push({width,height,...layout});
      }
      // Every request's path must match filesystem case exactly. Windows alone
      // would otherwise hide names that fail on GitHub Pages' case-sensitive host.
      for(const pathname of requests) {
        const parts=decodeURIComponent(pathname.slice('/midnight-midway-check/'.length)).split('/').filter(Boolean);
        let directory='.';
        for(const part of parts) { assert.ok((await readdir(directory)).includes(part),`Case mismatch: ${pathname}`);directory+=`/${part}`; }
      }
      assert.deepEqual(errors,[]);

      const failureResults=[];
      for(const missing of ['assets/midway-clean-plate.png','assets/horse-left-mask.svg','artwork.css']) {
        const failed=await browser.newPage();
        await failed.route(`**/${missing}`,route=>route.fulfill({status:404,body:''}));
        await failed.goto(base+'?diagnostics');
        await failed.waitForFunction(()=>document.querySelector('#asset-notice').textContent.includes('could not load'));
        assert.equal(await failed.locator('#enter').isDisabled(),true);
        assert.equal(await failed.evaluate(()=>window.midwayDiagnostics.audio().contextState),'not-created');
        await failed.locator('#credits-open').click();assert.equal(await failed.locator('#credits-dialog').isVisible(),true);
        await failed.close();failureResults.push(missing);
      }
      results.push({browser:name,status:supportsAudio?'passed':'visual/accessibility/failure checks passed; audio API unavailable in this test build',audioCapability,audioVerified:supportsAudio,projectSubpath:true,caseSensitivePaths:true,resourceCount:requests.size,contrastRatios:ratios,layouts,creditsFocusTrapAndExplicitResume:true,reducedMotionStory:true,missingAssetsSafelyGated:failureResults,errors});
      console.log(`${name} preflight passed`);
    } finally { await browser.close(); }
  }
  const inventory=JSON.parse((await readFile('docs/history/20261016-145826/artwork-hashes.json','utf8')).replace(/^\uFEFF/,''));
  for(const entry of inventory) {
    const relative=entry.Path.replaceAll('\\','/').split('/project-4-template/')[1];
    assert.equal(createHash('sha256').update(await readFile(relative)).digest('hex').toUpperCase(),entry.Hash);
  }
  const status=results.every(result=>result.audioVerified)?'passed':'passed-with-environment-limit';
  await writeFile(`${output}/checks.json`,JSON.stringify({status,results,unchangedArtworkFiles:inventory.length,limits:['Physical smartphone and public HTTPS not yet verified','Automated semantics/focus/contrast checks do not replace assistive-technology user testing',...results.filter(result=>!result.audioVerified).map(result=>`${result.browser}: AudioContext API unavailable in this test build; no audio pass claimed`)]},null,2));
  console.log(JSON.stringify({status,browsers:results.map(r=>({name:r.browser,audioVerified:r.audioVerified})),unchangedArtworkFiles:inventory.length},null,2));
} finally { server.closeAllConnections(); await new Promise(resolve=>server.close(resolve)); }
