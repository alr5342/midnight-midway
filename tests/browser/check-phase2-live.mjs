import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

// Focused release smoke test using actual touch controls and real active time.
// Historical check-live-pages.mjs retains the original Phase 1 contract.
const base = process.argv[2] || 'https://alr5342.github.io/midnight-midway/';
assert.ok(base.startsWith('https://') && base.endsWith('/'));
const output = process.argv[3] || 'tests/results/phase2-publication';
await mkdir(output,{recursive:true});
const {chromium} = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || 'C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const localRevision = execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
const browser = await chromium.launch({headless:true});
const errors = [], resources = new Set(), checks = [];
try {
  const page = await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  page.on('pageerror',error => errors.push(error.message));
  page.on('response',response => {
    if(response.status()>=400) errors.push(`${response.status()} ${response.url()}`);
    if(response.url().startsWith(base)) resources.add(response.url());
  });
  const wait = fn => page.waitForFunction(fn,null,{timeout:20000});
  const visit = () => page.evaluate(() => window.midwayDiagnostics.journey());
  const readyAudio = () => wait(() => window.midwayDiagnostics.audio().status==='playing' && window.midwayDiagnostics.audio().contextState==='running' && window.midwayDiagnostics.storyAudio().status==='ready');
  const response = await page.goto(base+'?diagnostics');
  assert.equal(response.status(),200);
  await wait(() => !document.querySelector('#enter').disabled && window.midwayDiagnostics.prize().ready && window.midwayDiagnostics.ending().ready);
  assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().contextState),'not-created');
  await page.screenshot({path:`${output}/start-phone.png`});
  await page.locator('#enter').tap();await readyAudio();
  assert.equal(await page.evaluate(() => window.midwayDiagnostics.storyAudio().decodedCues),10);
  checks.push('HTTPS entry, scene artwork and wind plus ten story/musical cues decode after Enter');

  for(let completion=1;completion<=2;completion++) {
    for(let ring=0;ring<3;ring++) await page.locator('#bell').tap();
    await page.waitForFunction(expected => window.midwayDiagnostics.journey().ticketsIssued===expected,completion,{timeout:15000});
  }
  assert.equal((await visit()).admissionTickets,2);
  checks.push('Booth story replays without reload and stacks two tickets');

  // Lose top-first, then recover through the environmental bag pickup.
  await page.locator('[data-can=top]').tap();
  await wait(() => !window.midwayDiagnostics.prize().busy);
  await page.locator('[data-can=left]').tap();
  await wait(() => window.midwayDiagnostics.prize().failed && window.midwayDiagnostics.prize().bagReturn?.opacity===1);
  assert.equal((await visit()).ticketsSpent,1);
  const bounds = await page.locator('.scene').first().boundingBox();
  await page.touchscreen.tap(bounds.x+bounds.width*.68,bounds.y+bounds.height*.71);
  assert.equal(await page.evaluate(() => window.midwayDiagnostics.prize().bags),2);
  assert.equal((await visit()).ticketsSpent,1);
  await page.locator('[data-can=left]').tap();
  await wait(() => !window.midwayDiagnostics.prize().busy);
  await page.locator('[data-can=right]').tap();
  await wait(() => window.midwayDiagnostics.journey().completed.prize===1);
  assert.equal((await visit()).souvenirTokens,0);
  checks.push('One paid prize game: failed-round bag pickup is free; support-can win completes haunted story without an early token');

  await page.locator('#music-open').tap();
  assert.equal(await page.locator('#music-clue').isVisible(),true);
  await page.locator('#music-close').tap();
  await page.locator('[data-horse-note=left]').tap();
  await page.locator('#credits-open').tap();
  const frozen = await page.evaluate(() => ({clock:window.midwayDiagnostics.snapshot(),visit:window.midwayDiagnostics.journey(),carousel:window.midwayDiagnostics.carousel()}));
  await page.waitForTimeout(300);
  assert.deepEqual(await page.evaluate(() => ({clock:window.midwayDiagnostics.snapshot(),visit:window.midwayDiagnostics.journey(),carousel:window.midwayDiagnostics.carousel()})),frozen);
  assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().activeSources+window.midwayDiagnostics.storyAudio().activeSources),0);
  await page.locator('#credits-close').tap();await readyAudio();
  for(const note of ['right','center','left']) await page.locator(`[data-horse-note=${note}]`).tap();
  await wait(() => window.midwayDiagnostics.journey().completed.carousel===1 && window.midwayDiagnostics.prize().tokenOffered);
  assert.equal((await visit()).ticketsSpent,2);
  assert.equal((await visit()).admissionTickets,0);
  assert.equal((await visit()).souvenirTokens,1);
  await page.screenshot({path:`${output}/waiting-token-phone.png`});
  checks.push('Environmental music clue, horse melody and full carousel payoff; Credits retains partial melody/payment; carousel-last reveals one token');

  await page.locator('#claim-token').tap();
  await wait(() => window.midwayDiagnostics.ending().age>=3);
  await page.locator('#playback').tap();
  const ending = await page.evaluate(() => ({clock:window.midwayDiagnostics.snapshot(),ending:window.midwayDiagnostics.ending()}));
  await page.waitForTimeout(300);
  assert.deepEqual(await page.evaluate(() => ({clock:window.midwayDiagnostics.snapshot(),ending:window.midwayDiagnostics.ending()})),ending);
  assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().activeSources+window.midwayDiagnostics.storyAudio().activeSources),0);
  await page.locator('#playback').tap();await readyAudio();
  await wait(() => window.midwayDiagnostics.ending().gone);
  assert.equal(await page.evaluate(() => window.midwayDiagnostics.ending().wheel),0);
  await wait(() => window.midwayDiagnostics.snapshot().state==='ended');
  assert.equal(await page.evaluate(() => window.midwayDiagnostics.audio().activeSources+window.midwayDiagnostics.storyAudio().activeSources),0);
  await page.screenshot({path:`${output}/empty-field-phone.png`});
  checks.push('Deliberate claim, real-time disappearance with Play/Pause recovery, empty field/token, wheel gone, final silence and Revisit');

  const verified = [];
  // Include the HTML entry explicitly; compare all fetched runtime bytes.
  resources.add(base+'index.html');
  for(const url of resources) {
    const relative = decodeURIComponent(new URL(url).pathname.slice(new URL(base).pathname.length));
    if(!relative || !/\.(?:html|js|css|png|svg|wav)$/.test(relative)) continue;
    const remote = await page.request.get(url);assert.equal(remote.status(),200);
    let actual=await remote.body(), expected=await readFile(relative);
    if(/\.(?:html|js|css)$/.test(relative)) {
      actual=Buffer.from(actual.toString('utf8').replaceAll('\r\n','\n'));
      expected=Buffer.from(expected.toString('utf8').replaceAll('\r\n','\n'));
    }
    const sha256=createHash('sha256').update(actual).digest('hex');
    assert.equal(sha256,createHash('sha256').update(expected).digest('hex'),`Public mismatch: ${relative}`);
    verified.push({path:relative,sha256});
  }
  for(const file of ['assets/story/ghost-attendant-v3.png','assets/artwork/empty-field-v1.png','assets/story/keepsake-token-v1.svg','src/js/visit.js','src/js/carousel.js','src/js/prize.js','src/js/ending.js']) assert.ok(verified.some(item => item.path===file),`Not fetched: ${file}`);
  assert.equal(verified.filter(item => item.path.endsWith('.wav')).length,11);
  checks.push('All fetched runtime files, HTML, approved artwork and eleven WAVs match local bytes (text line endings normalized)');
  await Promise.all([page.waitForEvent('domcontentloaded'),page.locator('#revisit').tap()]);
  await wait(() => window.midwayDiagnostics?.journey().ticketsIssued===0 && !document.querySelector('#enter').disabled);
  assert.equal((await visit()).souvenirTokens,0);
  await page.goto(base);await page.reload();
  await page.waitForFunction(() => !document.querySelector('#enter').disabled);
  assert.equal(await page.evaluate(() => 'midwayDiagnostics' in window),false);
  assert.deepEqual(errors,[]);
  checks.push('Fresh Revisit, normal public URL/reload, no exposed diagnostics or unexpected page/HTTP errors');
  const result={status:'passed',url:base,verifiedAt:new Date().toISOString(),localRevision,checks,verifiedResources:verified,errors,limits:['Desktop Chromium touch emulation with real active time; final physical-phone verification pending','Firefox Playwright page creation previously failed before navigation; WebKit was not reached','Decode/source/scheduling checks do not establish subjective sound balance','No debrief work or final ZIP in this checkpoint']};
  await writeFile(`${output}/checks.json`,JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({status:result.status,url:base,localRevision,checks,resources:verified.length},null,2));
} catch(error) {
  await writeFile(`${output}/failure.json`,JSON.stringify({url:base,localRevision,checks,errors,error:String(error),stack:error.stack},null,2));
  throw error;
} finally {await browser.close();}
