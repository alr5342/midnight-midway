import {pathToFileURL} from 'node:url';
import {createPreviewServer} from '../serve.mjs';
const {chromium}=await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const server=createPreviewServer({basePath:'/check/'});await new Promise(resolve=>server.listen(4174,'127.0.0.1',resolve));
const browser=await chromium.launch();
try {
  for(const missing of ['assets/artwork/midway-clean-plate.png','assets/masks/horse-left-mask.svg','src/css/scene.css']) {
    const page=await browser.newPage();const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route(`**/${missing}`,route=>route.fulfill({status:404,body:''}));
    await page.goto('http://127.0.0.1:4174/check/?diagnostics');await page.waitForTimeout(500);
    console.log(JSON.stringify({missing,errors,...await page.evaluate(()=>({notice:document.querySelector('#asset-notice').textContent,disabled:document.querySelector('#enter').disabled,sheets:[...document.querySelectorAll('link[rel=stylesheet]')].map(link=>({href:link.href,sheet:!!link.sheet})),mask:getComputedStyle(document.querySelector('.horse-left')).maskImage}))}));
    await page.close();
  }
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
