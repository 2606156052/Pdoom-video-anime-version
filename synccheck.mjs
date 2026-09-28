// synccheck.mjs <video.mp4> <slice.mp3>: estimate audio offset of generated clip vs source slice
import { execFileSync } from 'child_process';
const FF = decodeURIComponent(new URL('../tools/ffmpeg', import.meta.url).pathname);
const pcm = f => { const b = execFileSync(FF, ['-v', 'error', '-i', f, '-ac', '1', '-ar', '8000', '-f', 'f32le', '-'], { maxBuffer: 1 << 28 }); return new Float32Array(b.buffer, b.byteOffset, b.length / 4); };
const env = x => { const h = 80, o = []; for (let i = 0; i + h <= x.length; i += h) { let s = 0; for (let j = 0; j < h; j++) s += x[i + j] * x[i + j]; o.push(Math.sqrt(s / h)); } // 10ms frames
  const d = o.map((v, i) => Math.max(0, v - (o[i - 1] || 0))); const m = d.reduce((a, b) => a + b) / d.length; return d.map(v => v - m); };
const [v, s] = process.argv.slice(2).map(f => env(pcm(f)));
let best = [0, -1e9];
for (let lag = -100; lag <= 100; lag++) { let c = 0, n = 0; for (let i = 0; i < v.length; i++) { const j = i + lag; if (j >= 0 && j < s.length) { c += v[i] * s[j]; n++; } } c /= n || 1; if (c > best[1]) best = [lag, c]; }
let zero = 0; { let n = 0; for (let i = 0; i < Math.min(v.length, s.length); i++) { zero += v[i] * s[i]; n++; } zero /= n; }
console.log(JSON.stringify({ lagMs: best[0] * 10, corrBest: +best[1].toExponential(3), corrAtZero: +zero.toExponential(3), note: 'positive lag = generated audio is EARLY vs slice' }));
