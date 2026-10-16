import { pathToFileURL } from 'node:url';
import { writeFile } from 'node:fs/promises';
const { chromium } = await import(pathToFileURL('C:/Users/arose/AppData/Local/npm-cache/_npx/6bcb61ec6d5aea22/node_modules/playwright/index.mjs').href);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:4173');
const result = await page.evaluate(async () => {
  const context = new AudioContext();
  const response = await fetch('reference/audio/remaxim-short-wind-original.wav');
  if (!response.ok) throw Error('Source audio unavailable');
  const source = await context.decodeAudioData(await response.arrayBuffer());
  const rate = 22050;
  const offline = new OfflineAudioContext(1, Math.ceil(source.duration * rate), rate);
  const player = offline.createBufferSource(); player.buffer = source;
  const lowpass = offline.createBiquadFilter(); lowpass.type = 'lowpass'; lowpass.frequency.value = 1800;
  const highpass = offline.createBiquadFilter(); highpass.type = 'highpass'; highpass.frequency.value = 60;
  player.connect(lowpass).connect(highpass).connect(offline.destination); player.start();
  const filtered = (await offline.startRendering()).getChannelData(0);
  const overlap = Math.min(rate, Math.floor(filtered.length / 4));
  const data = new Float32Array(filtered.length - overlap);
  for (let i = 0; i < data.length; i++) {
    const mix = i / overlap;
    data[i] = i < overlap ? filtered[data.length + i] * (1 - mix) + filtered[i] * mix : filtered[i];
  }
  let peak = 0;
  for (const value of data) peak = Math.max(peak, Math.abs(value));
  const gain = peak ? .65 / peak : 1;
  const wav = new ArrayBuffer(44 + data.length * 2), view = new DataView(wav);
  const text = (offset, value) => [...value].forEach((character, i) => view.setUint8(offset + i, character.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, wav.byteLength - 8, true); text(8, 'WAVE');
  text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  text(36, 'data'); view.setUint32(40, data.length * 2, true);
  let squares = 0;
  for (let i = 0; i < data.length; i++) { const value = data[i] * gain; squares += value * value; view.setInt16(44 + i * 2, Math.round(value * 32767), true); }
  const bytes = new Uint8Array(wav); let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  await context.close();
  return { base64: btoa(binary), metrics: { sourceDuration: source.duration, loopDuration: data.length / rate, sampleRate: rate, channels: 1, peak: .65, rms: Math.sqrt(squares / data.length), seamStep: Math.abs(data[0] - data.at(-1)) * gain, overlapSeconds: overlap / rate } };
});
await writeFile('assets/audio/midway-wind-loop.wav', Buffer.from(result.base64, 'base64'));
await writeFile('assets/audio/processing.json', JSON.stringify(result.metrics, null, 2));
console.log(JSON.stringify(result.metrics, null, 2));
await browser.close();
