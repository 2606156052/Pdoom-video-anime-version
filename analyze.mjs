// Audio analysis: tempo, beat phase, energy envelope -> analysis.json
import fs from 'fs';
const SR = 22050, buf = fs.readFileSync('song_mono.f32');
const x = new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
const HOP = 256, N = 1024, nF = Math.floor((x.length - N) / HOP);
// radix-2 FFT magnitude
function fftMag(re) {
  const n = re.length, im = new Float64Array(n);
  for (let i = 1, j = 0; i < n; i++) { let b = n >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; } }
  for (let len = 2; len <= n; len <<= 1) { const a = -2 * Math.PI / len;
    for (let i = 0; i < n; i += len) for (let k = 0; k < len / 2; k++) {
      const c = Math.cos(a * k), s = Math.sin(a * k), ur = re[i + k], ui = im[i + k];
      const vr = re[i + k + len / 2] * c - im[i + k + len / 2] * s, vi = re[i + k + len / 2] * s + im[i + k + len / 2] * c;
      re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi; } }
  const m = new Float64Array(n / 2); for (let i = 0; i < n / 2; i++) m[i] = Math.log1p(Math.hypot(re[i], im[i])); return m;
}
const win = Float64Array.from({ length: N }, (_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N));
let prev = null; const flux = new Float64Array(nF), rms = new Float64Array(nF), low = new Float64Array(nF), voc = new Float64Array(nF);
const bin = f => Math.round(f * N / SR);
for (let f = 0; f < nF; f++) {
  const fr = new Float64Array(N); let e = 0;
  for (let i = 0; i < N; i++) { const v = x[f * HOP + i]; fr[i] = v * win[i]; e += v * v; }
  rms[f] = Math.sqrt(e / N); const m = fftMag(fr);
  let s = 0; if (prev) for (let k = 1; k < m.length; k++) s += Math.max(0, m[k] - prev[k]); flux[f] = s; prev = m;
  for (let k = bin(30); k < bin(150); k++) low[f] += m[k];
  for (let k = bin(300); k < bin(3400); k++) voc[f] += m[k];
}
const fps = SR / HOP;
// onset envelope normalise
const mean = a => a.reduce((p, c) => p + c, 0) / a.length;
const on = flux.map((v, i) => Math.max(0, v - mean(flux.slice(Math.max(0, i - 20), i + 20))));
// tempo via autocorrelation 70-180 bpm
let best = [0, 0]; const lagScores = [];
for (let bpm = 70; bpm <= 180; bpm += 0.1) { const lag = 60 * fps / bpm; let s = 0;
  for (let i = 0; i + lag * 4 < nF; i += 1) { const j = i + lag; const a = Math.floor(j), fr = j - a; s += on[i] * (on[a] * (1 - fr) + on[a + 1] * fr); }
  lagScores.push([bpm, s]); if (s > best[1]) best = [bpm, s]; }
lagScores.sort((a, b) => b[1] - a[1]);
const bpm = best[0], period = 60 / bpm;
// phase: maximise onset sum on beat grid
let bp = [0, 0]; for (let ph = 0; ph < period; ph += 0.002) { let s = 0; for (let t = ph; t < nF / fps; t += period) { const i = Math.round(t * fps); s += on[i] + 0.5 * (on[i - 1] || 0) + 0.5 * (on[i + 1] || 0); } if (s > bp[1]) bp = [ph, s]; }
// half-second envelopes
const seg = (a, t0, t1) => mean(Array.from(a.slice(Math.floor(t0 * fps), Math.floor(t1 * fps))));
const env = []; for (let t = 0; t < nF / fps - 0.5; t += 0.5) env.push({ t, rms: +seg(rms, t, t + .5).toFixed(4), low: +seg(low, t, t + .5).toFixed(1), voc: +seg(voc, t, t + .5).toFixed(1), on: +seg(on, t, t + .5).toFixed(2) });
// strongest onsets (hits)
const hits = []; for (let i = 2; i < nF - 2; i++) if (on[i] > on[i - 1] && on[i] >= on[i + 1]) hits.push([i / fps, on[i]]);
hits.sort((a, b) => b[1] - a[1]);
const out = { bpm: +bpm.toFixed(2), topTempos: lagScores.slice(0, 8).map(a => +a[0].toFixed(1)), beatPhase: +bp[0].toFixed(3), duration: nF / fps, env, topHits: hits.slice(0, 60).map(h => +h[0].toFixed(3)).sort((a, b) => a - b) };
fs.writeFileSync('analysis.json', JSON.stringify(out));
console.log(out.bpm, out.topTempos, out.beatPhase);
// print envelope compactly
const mx = Math.max(...env.map(e => e.rms));
for (let i = 0; i < env.length; i += 2) { const e = env[i]; console.log(e.t.toFixed(1).padStart(6), '#'.repeat(Math.round(40 * e.rms / mx)).padEnd(40), 'v' + Math.round(e.voc)); }
