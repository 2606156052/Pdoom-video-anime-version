// raw-waveform normalized xcorr (8kHz), lags -1s..+1s: tells if the clip carries the same audio and its offset
import { execFileSync } from 'child_process';
const FF = decodeURIComponent(new URL('../tools/ffmpeg', import.meta.url).pathname);
const pcm = f => { const b = execFileSync(FF, ['-v','error','-i',f,'-ac','1','-ar','8000','-f','f32le','-'], { maxBuffer: 1 << 28 }); return new Float32Array(b.buffer, b.byteOffset, b.length / 4); };
const [v, s] = process.argv.slice(2,4).map(pcm);
const res = [];
for (let lag = -8000; lag <= 8000; lag += 4) { let c = 0, a = 0, b = 0; for (let i = 0; i < v.length; i += 2) { const j = i + lag; if (j < 0 || j >= s.length) continue; c += v[i]*s[j]; a += v[i]*v[i]; b += s[j]*s[j]; } res.push([lag/8, c/Math.sqrt(a*b+1e-12)]); }
res.sort((x,y)=>y[1]-x[1]);
console.log('top lags (ms, ncc):', res.slice(0,5).map(r=>r[0].toFixed(1)+':'+r[1].toFixed(3)).join('  '), '| ncc@0:', res.find(r=>r[0]===0)[1].toFixed(3));
