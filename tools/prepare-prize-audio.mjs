import {writeFile} from 'node:fs/promises';

// Original deterministic synthesis, without recordings or external samples.
const sampleRate = 22050;
let seed = 73421;
function noise() { seed = (Math.imul(seed,1664525)+1013904223)>>>0; return seed/2147483648-1; }
const sounds = [
  ['prize-throw', .42, .28, t => {
    const envelope = Math.sin(Math.PI*t/.42)**2;
    return envelope*(.6*noise()+.15*Math.sin(2*Math.PI*(150*t-90*t*t)));
  }],
  ['prize-tin', .85, .4, t => {
    const metal = [413,697,1103,1681].reduce((sum,f,i)=>sum+Math.sin(2*Math.PI*f*t)*Math.exp(-t/(.17-i*.025))/(i+1),0);
    return (1-Math.exp(-t/.0015))*(metal+.25*noise()*Math.exp(-t/.018));
  }],
  ['prize-chime', 2.4, .3, t => [261.626,311.127,391.995,523.251].reduce((sum,f,i)=>{
    const age=t-i*.14;
    return age<0?sum:sum+(1-Math.exp(-age/.02))*Math.exp(-age/.65)*Math.sin(2*Math.PI*f*age)*(.7/(i+1));
  },0)]
];
for(const [name,duration,level,sample] of sounds) {
  const values=Float32Array.from({length:Math.round(sampleRate*duration)},(_,i)=>sample(i/sampleRate)*Math.min(1,(duration-i/sampleRate)/.04));
  let peak=0;for(const value of values)peak=Math.max(peak,Math.abs(value));
  const wav=Buffer.alloc(44+values.length*2);
  wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);
  wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
  wav.writeUInt32LE(sampleRate,24);wav.writeUInt32LE(sampleRate*2,28);
  wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(values.length*2,40);
  values.forEach((value,i)=>wav.writeInt16LE(Math.round(value/peak*level*32767),44+i*2));
  await writeFile(new URL(`../assets/audio/${name}.wav`,import.meta.url),wav);
  console.log(`${name}.wav: original mono PCM16, ${sampleRate} Hz, ${duration}s, peak ${level}`);
}
