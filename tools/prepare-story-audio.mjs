import { pathToFileURL } from 'node:url';
import { writeFile } from 'node:fs/promises';
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:4173');
const results = await page.evaluate(async () => {
  const context = new AudioContext(), results = [];
  const decode = async path => { const response = await fetch(path); if (!response.ok) throw Error(path); return context.decodeAudioData(await response.arrayBuffer()); };
  const bell = await decode('assets/audio/story-bell.wav');
  const magic = await decode('reference/audio/jaggedstone-magical-original.ogg');
  const cues = [
    ['story-ring-1', bell, .85, 1, .5], ['story-ring-2', bell, 1, 1, .5], ['story-ring-3', bell, 1.15, 1, .5],
    ['story-arrival', magic, .9, 1.2, .35], ['story-stamp', magic, 1.15, .9, .45], ['story-departure', magic, .8, 1.2, .3]
  ];
  for (const [name, buffer, pitch, maxDuration, peak] of cues) {
    const rate = 22050, duration = Math.min(maxDuration, buffer.duration / pitch);
    const offline = new OfflineAudioContext(1, Math.ceil(duration * rate), rate);
    const player = offline.createBufferSource(); player.buffer = buffer; player.playbackRate.value = pitch;
    const gain = offline.createGain(); gain.gain.setValueAtTime(0, 0); gain.gain.linearRampToValueAtTime(1, .015); gain.gain.setValueAtTime(1, Math.max(.015, duration - .09)); gain.gain.linearRampToValueAtTime(0, duration);
    player.connect(gain).connect(offline.destination); player.start();
    const data = (await offline.startRendering()).getChannelData(0);
    let max = 0; for (const sample of data) max = Math.max(max, Math.abs(sample));
    const scale = max ? peak / max : 1;
    const wav = new ArrayBuffer(44 + data.length * 2), view = new DataView(wav);
    const text = (offset, value) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
    text(0,'RIFF'); view.setUint32(4,wav.byteLength-8,true); text(8,'WAVE'); text(12,'fmt '); view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true); view.setUint32(24,rate,true); view.setUint32(28,rate*2,true); view.setUint16(32,2,true); view.setUint16(34,16,true); text(36,'data'); view.setUint32(40,data.length*2,true);
    for (let i=0;i<data.length;i++) view.setInt16(44+i*2, Math.round(data[i]*scale*32767),true);
    const bytes = new Uint8Array(wav); let binary=''; for(let i=0;i<bytes.length;i+=8192) binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
    results.push({ name, base64: btoa(binary), duration, pitch, peak, rate });
  }
  await context.close(); return results;
});
for (const result of results) await writeFile(`assets/audio/${result.name}.wav`, Buffer.from(result.base64,'base64'));
await writeFile('assets/story/audio-manifest.json', JSON.stringify(results.map(({base64,...metadata})=>metadata),null,2));
console.log(JSON.stringify(results.map(({base64,...metadata})=>metadata),null,2));
await browser.close();
