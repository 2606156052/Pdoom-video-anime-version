// mouthsync.mjs <clip.mp4> <slice.mp3> x0 y0 x1 y1 (mouth search box as fractions)
// mouth-open signal (dark red interior pixels) vs vocal-band energy -> best retime lag
import { execFileSync } from 'child_process';
import fs from 'fs';
const localFF = decodeURIComponent(new URL('./tools/ffmpeg', import.meta.url).pathname);
const FF = fs.existsSync(localFF) ? localFF : 'ffmpeg';

const [clip, slice, ...box] = process.argv.slice(2); const [x0, y0, x1, y1, ts = 0, te = 99] = box.map(Number);
const SW = 320, SH = 180, F = 24;
const raw = execFileSync(FF, ['-v', 'error', '-i', clip, '-vf', `fps=${F},scale=${SW}:${SH}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 30 });
const nF = raw.length / (SW * SH * 3), mouth = [];
for (let f = 0; f < nF; f++) { let c = 0;
  for (let y = Math.floor(y0 * SH); y < y1 * SH; y++) for (let x = Math.floor(x0 * SW); x < x1 * SW; x++) {
    const o = f * SW * SH * 3 + (y * SW + x) * 3, r = raw[o], g = raw[o + 1], b = raw[o + 2];
    const l = (0.3 * r + 0.59 * g + 0.11 * b) / 255; if (l < 0.33 && r > g * 1.35) c++; }
  mouth.push(c); }
const b = execFileSync(FF, ['-v', 'error', '-i', slice, '-af', 'highpass=f=300,lowpass=f=3400', '-ac', '1', '-ar', '9600', '-f', 'f32le', '-'], { maxBuffer: 1 << 28 });
const x = new Float32Array(b.buffer, b.byteOffset, b.length / 4), voc = []; const hop = 9600 / F;
for (let i = 0; i + hop <= x.length; i += hop) { let s = 0; for (let j = 0; j < hop; j++) s += x[i + j] ** 2; voc.push(Math.sqrt(s / hop)); }
const z = a => { const m = a.reduce((p, c) => p + c) / a.length, sd = Math.sqrt(a.reduce((p, c) => p + (c - m) ** 2, 0) / a.length) || 1; return a.map(v => (v - m) / sd); };
const a0 = Math.round(ts * F), a1 = Math.min(mouth.length, Math.round(te * F)); const M = z(mouth.slice(a0, a1)), V = z(voc.slice(a0)); const out = [];
for (let lag = -30; lag <= 30; lag++) { let c = 0, n = 0; for (let i = 0; i < M.length; i++) { const j = i - lag; if (j >= 0 && j < V.length) { c += M[i] * V[j]; n++; } } out.push([lag, c / n]); }
out.sort((a, b) => b[1] - a[1]);
console.log(JSON.stringify({ frames: nF, bestLagFrames: out[0][0], bestLagMs: Math.round(out[0][0] * 1000 / F), r: +out[0][1].toFixed(3), rAt0: +out.find(o => o[0] === 0)[1].toFixed(3), top: out.slice(0, 4).map(o => o[0] + ':' + o[1].toFixed(2)).join(' '), note: '+lag = mouth moves AFTER voice; show clip earlier by lag' }));
{ const mx = Math.max(...mouth), mn = Math.min(...mouth); console.log('voice:', voc.map(v => { const m = Math.max(...voc); return ' .:-=+*#%@'[Math.min(9, Math.floor(v / m * 10))]; }).join('')); console.log('mouth:', mouth.map(v => ' .:-=+*#%@'[Math.min(9, Math.floor((v - mn) / (mx - mn + 1) * 10))]).join('')); }
