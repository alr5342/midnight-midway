import assert from 'node:assert/strict';
import {mkdir, readdir, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../../serve.mjs';

// Current-contract audit. Native media/context events are independent of the
// test clock. Measure controls in their real visible states: standing cans
// before throws, then pickup/claim after success. Historical Phase 1 preflight
// retains its original single-ticket and Credits assertions.
const output = 'tests/results/phase2-audit';
await mkdir(output, {recursive:true});
const playwright = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || 'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const prefix = '/midnight-midway/';
const server = createPreviewServer({basePath:prefix});
await new Promise(resolve => server.listen(4188, '127.0.0.1', resolve));
const base = `http://127.0.0.1:4188${prefix}`;
const results = [];

function contrast(foreground, background) {
  const fg = foreground.match(/[\d.]+/g).map(Number);
  const bg = background.match(/[\d.]+/g).map(Number);
  const alpha = bg[3] ?? 1;
  const luminance = rgb => rgb.slice(0,3).map(v => v/255).map(v => v<=.04045 ? v/12.92 : ((v+.055)/1.055)**2.4).reduce((sum,v,i) => sum+v*[.2126,.7152,.0722][i],0);
  // Composite against white: conservative for the dark illustrated scene.
  const a = luminance(fg), b = luminance(bg.map(v => v*alpha+255*(1-alpha)));
  return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}

try {
  for (const name of (process.env.TEST_BROWSERS || 'chromium,firefox,webkit').split(',')) {
    console.log(`Auditing ${name}`);
    const browser = await playwright[name].launch({headless:true});
    try {
      const page = await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
      const errors = [], requests = new Set();
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => {if(response.status()>=400) errors.push(`${response.status()} ${response.url()}`);});
      page.on('request', request => {if(request.url().startsWith(base)) requests.add(new URL(request.url()).pathname);});
      await page.goto(base+'?diagnostics');
      await page.waitForFunction(() => !document.querySelector('#enter').disabled && window.midwayDiagnostics.prize().ready && window.midwayDiagnostics.ending().ready);
      await page.clock.install();
      await page.clock.pauseAt(new Date());
      const state = () => page.evaluate(() => ({clock:window.midwayDiagnostics.snapshot(),visit:window.midwayDiagnostics.journey(),booth:window.midwayDiagnostics.story(),carousel:window.midwayDiagnostics.carousel(),prize:window.midwayDiagnostics.prize(),ending:window.midwayDiagnostics.ending()}));
      const advance = ms => page.clock.runFor(ms);
      const key = async selector => {await page.locator(selector).focus();await page.keyboard.press('Enter');};
      async function closeCredits(escape=false) {
        // Native dialog close/focus events can arrive after keyboard.press
        // returns, independently of the installed clock. Settle that event
        // before focusing the next gameplay button; never mask it with sleeps.
        await page.evaluate(() => {
          window.auditCreditsClosed = new Promise(resolve => {
            document.querySelector('#credits-dialog').addEventListener('close',() => resolve(true),{once:true});
          });
        });
        if(escape) await page.keyboard.press('Escape');
        else await key('#credits-close');
        await page.evaluate(() => window.auditCreditsClosed);
        assert.equal(await page.locator('#credits-dialog').isVisible(),false);
        assert.equal(await page.locator('#credits-open').evaluate(el => el===document.activeElement),true);
      }
      const layouts=[];
      async function checkLayouts(phase, selectors) {
        for(const [width,height] of [[390,844],[375,667],[320,568],[280,568],[844,390]]) {
          await page.setViewportSize({width,height});
          const layout = await page.evaluate(selectors => {
            const r=document.querySelector('#stage').getBoundingClientRect();
            return {
              overflow:document.documentElement.scrollWidth>innerWidth || document.documentElement.scrollHeight>innerHeight,
              fits:r.left>=0&&r.top>=0&&r.right<=innerWidth+.5&&r.bottom<=innerHeight+.5,
              targets:selectors.map(selector => {
                const el=document.querySelector(selector), b=el.getBoundingClientRect();
                return {selector,visible:el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden',width:b.width,height:b.height};
              })
            };
          },selectors);
          assert.equal(layout.overflow,false);assert.equal(layout.fits,true);
          for(const target of layout.targets) {
            assert.equal(target.visible,true,`${name}: ${phase} ${target.selector} must be visible at ${width}`);
            assert.ok(target.width>=44 && target.height>=44,`${name}: ${phase} ${target.selector} undersized at ${width}: ${target.width}x${target.height}`);
          }
          await key('#credits-open');
          const rect=await page.locator('#credits-dialog').boundingBox();
          assert.ok(rect.x>=0&&rect.y>=0&&rect.x+rect.width<=width+.5&&rect.y+rect.height<=height+.5);
          await closeCredits(true);
          layouts.push({phase,width,height,...layout});
        }
        await page.setViewportSize({width:390,height:844});
      }
      assert.equal((await state()).clock.state,'start');
      assert.equal((await state()).clock.reducedMotion,true);
      assert.equal((await state()).clock.scheduledFrames,0);
      assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().contextState),'not-created');
      const audioAvailable = await page.evaluate(() => typeof (window.AudioContext || window.webkitAudioContext)==='function');
      async function audioReady() {
        // Native decoding/context transitions are not driven by the test clock.
        for(let i=0;i<250;i++) {
          const ready = await page.evaluate(() => {
            const a=window.midwayDiagnostics.audio(), s=window.midwayDiagnostics.storyAudio();
            return a.status==='playing' && s.status==='ready';
          });
          if(ready || !audioAvailable) return;
          await new Promise(resolve => setTimeout(resolve,20));
        }
        const diagnostics=await page.evaluate(() => ({clock:window.midwayDiagnostics.snapshot(),ambient:window.midwayDiagnostics.audio(),story:window.midwayDiagnostics.storyAudio(),focus:document.activeElement.id,modal:document.querySelector('#credits-dialog').open}));
        await writeFile(`${output}/${name}-audio-failure.json`,JSON.stringify(diagnostics,null,2));
        assert.fail(`${name}: audio did not start: ${JSON.stringify(diagnostics)}`);
      }
      await key('#credits-open');
      for(let i=0;i<12;i++) {
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.querySelector('#credits-dialog').contains(document.activeElement)),true);
      }
      await closeCredits(true);
      assert.equal(await page.locator('#credits-open').evaluate(el => el===document.activeElement),true);
      await key('#enter');await audioReady();await advance(32);

      // Keyboard journey, prize first. Touch, payment boundaries, failures and
      // replays are exercised separately by check-tickets.mjs.
      async function admission() {
        for(let i=0;i<3;i++) await key('#bell');
        await advance(8100);
      }
      await admission();await admission();
      assert.equal((await state()).visit.admissionTickets,2);
      await key('#playback');
      await checkLayouts('standing cans', ['#playback','#bell','#credits-open','#music-open','[data-horse-note=left]','[data-horse-note=center]','[data-horse-note=right]','[data-can=top]','[data-can=left]','[data-can=right]']);
      assert.equal((await state()).visit.admissionTickets,2,'Layout/modal checks cannot spend admission');
      await key('#playback');await audioReady();
      await key('[data-can=left]');await advance(750);
      await key('[data-can=right]');await advance(9500);
      assert.equal((await state()).visit.completed.prize,1);
      assert.equal((await state()).visit.souvenirTokens,0);
      await key('#music-open');
      assert.equal(await page.locator('#music-clue').isVisible(),true);
      await key('#music-close');
      for(const note of ['left','right','center','left']) await key(`[data-horse-note=${note}]`);
      await advance(3000);
      const beforeCredits = await state();
      await key('#credits-open');await advance(15000);
      for(const field of ['visit','booth','carousel','prize','ending']) assert.deepEqual((await state())[field],beforeCredits[field]);
      assert.equal(await page.evaluate(() => window.midwayDiagnostics.storyAudio().activeSources),0);
      await closeCredits();await audioReady();await advance(5200);
      assert.equal((await state()).visit.completed.carousel,1);
      assert.equal((await state()).visit.souvenirTokens,1);
      assert.deepEqual((await state()).carousel.horseY,[0,0,0]);
      async function motionPreference(reduced) {
        await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});
        // Native matchMedia delivery is asynchronous, independent of fake RAF.
        for(let i=0;i<100;i++) {
          if((await state()).clock.reducedMotion===reduced) return;
          await new Promise(resolve => setTimeout(resolve,20));
        }
        assert.fail('Native reduced-motion change was not delivered');
      }
      await motionPreference(false);await advance(1000);
      assert.equal((await state()).clock.reducedMotion,false);
      assert.ok((await state()).carousel.horseY.some(y => y<0));
      await motionPreference(true);await advance(32);
      assert.deepEqual((await state()).carousel.horseY,[0,0,0]);
      await key('#playback');const frozen = await state();await advance(15000);
      assert.deepEqual(await state(),frozen);
      assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().activeSources),0);
      await key('#credits-open');await closeCredits();
      assert.equal((await state()).clock.state,'paused','Credits must retain an existing pause');

      const ratios = {};
      for(const selector of ['#hint','#credits-open','#credits-dialog','#credits-close','#enter','#admission']) {
        const colors = await page.locator(selector).evaluate(el => ({fg:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor}));
        ratios[selector]=contrast(colors.fg,colors.bg);
        assert.ok(ratios[selector]>=4.5,`${name}: ${selector} contrast ${ratios[selector]}`);
      }
      for(const can of ['top','left','right']) assert.equal(await page.locator(`[data-can=${can}]`).isHidden(),true,'Knocked-down can buttons intentionally leave the layout');
      await checkLayouts('waiting token', ['#playback','#bell','#credits-open','#music-open','[data-horse-note=left]','[data-horse-note=center]','[data-horse-note=right]','#prize-retry','#claim-token']);
      await key('#playback');await audioReady();await advance(32);
      await page.screenshot({path:`${output}/${name}-waiting-token.png`});
      await key('#claim-token');await advance(10300);
      assert.equal((await state()).clock.state,'ended');
      assert.equal((await state()).ending.wheel,0);
      assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().activeSources+window.midwayDiagnostics.storyAudio().activeSources),0);
      await page.screenshot({path:`${output}/${name}-empty-field.png`});
      await Promise.all([page.waitForEvent('domcontentloaded'),key('#revisit')]);
      await page.waitForFunction(() => window.midwayDiagnostics?.journey().ticketsIssued===0 && !document.querySelector('#enter').disabled);
      assert.equal((await state()).clock.state,'start');
      for(const pathname of requests) {
        let directory='.';
        for(const part of decodeURIComponent(pathname.slice(prefix.length)).split('/').filter(Boolean)) {
          assert.ok((await readdir(directory)).includes(part),`Case mismatch: ${pathname}`);directory+=`/${part}`;
        }
      }
      assert.deepEqual(errors,[]);
      const missingAssetGates=[];
      if(name==='chromium') {
        for(const missing of ['assets/artwork/midway-clean-plate.png','src/css/scene.css']) {
          const failed=await browser.newPage();
          await failed.route(`**/${missing}`,route => route.fulfill({status:404,body:''}));
          await failed.goto(base+'?diagnostics');
          await failed.waitForFunction(() => document.querySelector('#asset-notice').textContent.includes('could not load'));
          assert.equal(await failed.locator('#enter').isDisabled(),true);
          assert.equal(await failed.evaluate(() => window.midwayDiagnostics.audio().contextState),'not-created');
          await failed.locator('#credits-open').click();assert.equal(await failed.locator('#credits-dialog').isVisible(),true);
          await failed.close();missingAssetGates.push(missing);
        }
      }
      results.push({browser:name,version:browser.version(),status:'passed',audioAvailable,audioVerified:audioAvailable,keyboardJourney:true,initialAndLiveReducedMotion:true,creditsFocusAndExactResume:true,pausedCreditsRemainPaused:true,playPauseFreezesModelsAndAudio:true,endingAndFreshRevisit:true,projectPrefix:prefix,caseSensitiveRequests:requests.size,contrastRatios:ratios,layouts,missingAssetGates,errors});
      console.log(`${name}: passed${audioAvailable?'':' (visual only: this build has no Web Audio API)'}`);
    } finally {await browser.close();}
  }
  const result={checkedAt:new Date().toISOString(),status:results.every(r=>r.audioVerified)?'passed':'passed-with-environment-limit',results,limits:['Desktop engine automation, not physical-phone or assistive-technology user testing','No public Phase 2 deployment checked','WebKit without Web Audio cannot verify Safari/iPhone audio; no audio pass claimed','Contrast checks cover sampled text panels, not every artwork pixel']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2));
  console.log(JSON.stringify({status:result.status,browsers:results.map(r=>({name:r.browser,audioVerified:r.audioVerified}))},null,2));
} finally {server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
