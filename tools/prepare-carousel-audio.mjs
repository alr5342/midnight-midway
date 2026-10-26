import {writeFile} from 'node:fs/promises';

// Original additive synthesis, no sampled recording. A soft reed body and a
// short wooden-tine attack distinguish the carousel from the booth's bell.
const sampleRate = 22050, duration = .8, frequency = 523.251;
const samples = new Float32Array(Math.round(sampleRate * duration));
for (let i = 0; i < samples.length; i++) {
  const t = i / sampleRate;
  const phase = 2 * Math.PI * frequency * t + .008 * Math.sin(2 * Math.PI * 5 * t);
  const attack = 1 - Math.exp(-t / .007);
  const fade = Math.min(1, (duration - t) / .08);
  const body = Math.exp(-t / .19) * (Math.sin(phase) + .3 * Math.sin(2 * phase) + .12 * Math.sin(3 * phase));
  const tine = .18 * Math.exp(-t / .025) * Math.sin(4 * phase);
  samples[i] = attack * fade * (body + tine);
}
const peak = Math.max(...samples.map(Math.abs));
const wav = Buffer.alloc(44 + samples.length * 2);
wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(sampleRate, 24); wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36);
wav.writeUInt32LE(samples.length * 2, 40);
samples.forEach((value, i) => wav.writeInt16LE(Math.round(value / peak * .42 * 32767), 44 + i * 2));
await writeFile(new URL('../assets/audio/carousel-box.wav', import.meta.url), wav);
console.log('Original carousel-box.wav: mono PCM16, 22050 Hz, 0.8 s, C5, peak 0.42');
