// fx.js: shared visual vocabulary (all drawn in 2D, printed later by the press pass)
const F = {
  anton: s => `${s}px Anton`, mincho: s => `800 ${s}px "Shippori Mincho B1"`, dela: s => `${s}px "Dela Gothic One"`,
  mono: s => `800 ${s}px "JetBrains Mono"`, monoL: s => `500 ${s}px "JetBrains Mono"`, jp: s => `900 ${s}px "Noto Sans JP"`, arch: s => `${s}px "Archivo Black"`,
};
const TAU = Math.PI * 2;
function fill(c, col) { c.fillStyle = col; c.fillRect(-10, -10, W + 20, H + 20); }
function withT(c, fn) { c.save(); try { fn(); } finally { c.restore(); } }

// ---- Seedance shot timing: clip starts at song time t0; lag = measured mouth delay (show clip earlier by lag)
const SD = {
  A: { t0: 1.0, lag: 0.25, pal: 'room' }, B: { t0: 22.8, lag: 0, pal: 'stage' }, F: { t0: 53.2, lag: 0, pal: 'pink' },
  G: { t0: 58.8, lag: 0, pal: 'stage' }, H: { t0: 89.2, lag: 0, pal: 'sea' }, I: { t0: 113.2, lag: 0, pal: 'plug' },
  J: { t0: 123.3, lag: 0, pal: 'sea' }, K: { t0: 132.0, lag: 0, pal: 'sea' },
};
const sdFrame = (S, t, off = 0) => shotFrame(S, t - SD[S].t0 + SD[S].lag + off);
// camera -> crop rect. cam = {x,y} centre in 0..1, z zoom (>=1)
const camCrop = (cam = {}) => { const z = cam.z || 1, w = 1 / z, h = 1 / z; const x = clamp((cam.x ?? .5) - w / 2, 0, 1 - w), y = clamp((cam.y ?? .5) - h / 2, 0, 1 - h); return [x, y, w, h]; };
async function celDraw(c, src, o = {}) {
  const im = typeof src === 'string' ? await img(src) : await src; if (!im) return;
  const cv = GLX.cel(im, { ...o, pal: PAL[o.pal] || o.pal || PAL.mono, seed: boilSeed(o.t ?? 0), crop: camCrop(o.cam) });
  const r = o.rect || [0, 0, W, H]; c.drawImage(cv, r[0], r[1], r[2], r[3]);
}

// ---- the spark (✻-like radial burst, our own drawing)
function spark(c, x, y, r, o = {}) {
  const n = o.n || 8, rot = o.rot || 0, inner = o.inner ?? 0.18, col = o.col || INK.claude;
  c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n, rr = i % 2 ? r * inner : r * (o.jag ? (0.75 + 0.25 * hash(i, 7)) : 1); c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  c.closePath(); c.fill(); if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = o.lw || 4; c.stroke(); } c.restore();
}
// ---- manga radial speed lines
function speedLines(c, cx, cy, t, o = {}) {
  const n = o.n || 90, col = o.col || INK.ink, r0 = o.r0 || 260, R = Math.hypot(W, H);
  const r = rng(Math.floor(t * (o.fps || 12)) + 1); c.save(); c.fillStyle = col; c.globalAlpha = o.a ?? 1;
  for (let i = 0; i < n; i++) { const a = r() * TAU, w = (0.002 + r() * 0.012) * (o.w || 1), rr = r0 * (0.7 + r() * 0.8);
    c.beginPath(); c.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); c.lineTo(cx + Math.cos(a - w) * R, cy + Math.sin(a - w) * R); c.lineTo(cx + Math.cos(a + w) * R, cy + Math.sin(a + w) * R); c.fill(); }
  c.restore();
}
// horizontal speed streaks
function streaks(c, t, o = {}) {
  const r = rng(Math.floor(t * 12) + 5); c.save(); c.fillStyle = o.col || INK.ink; c.globalAlpha = o.a ?? .8;
  for (let i = 0; i < (o.n || 40); i++) { const y = r() * H, h = 1 + r() * (o.h || 6), x = r() * W, w = 200 + r() * 900; c.fillRect(x - w / 2, y, w, h); } c.restore();
}
// halftone dot field: dot radius from fn(x,y) in 0..1
function halftone(c, x0, y0, w, h, step, fn, col, ang = 0.785) {
  c.save(); c.fillStyle = col; c.beginPath(); const ca = Math.cos(ang), sa = Math.sin(ang);
  const R = Math.hypot(w, h); const cx = x0 + w / 2, cy = y0 + h / 2;
  for (let v = -R / 2; v < R / 2; v += step) for (let u = -R / 2; u < R / 2; u += step) {
    const x = cx + u * ca - v * sa, y = cy + u * sa + v * ca; if (x < x0 || y < y0 || x > x0 + w || y > y0 + h) continue;
    const k = fn(x, y); if (k <= 0.02) continue; const rr = step * 0.5 * Math.sqrt(clamp(k)) * 1.1; c.moveTo(x + rr, y); c.arc(x, y, rr, 0, TAU); }
  c.fill(); c.restore();
}
// textured brush stroke from a->b, drawn up to progress p
function brush(c, x0, y0, x1, y1, w, col, seed, p = 1) {
  const r = rng(seed), n = 26; c.save(); c.strokeStyle = col; c.lineCap = 'round';
  const xe = lerp(x0, x1, p), ye = lerp(y0, y1, p), nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny) || 1;
  for (let i = 0; i < n; i++) { const o = (i / (n - 1) - .5) * w, j = r(); if (j < .08) continue;
    c.globalAlpha = 0.55 + r() * .45; c.lineWidth = w / n * (1.4 + r());
    const s = r() * .06 * p, e = p * (0.9 + r() * .1);
    c.beginPath(); c.moveTo(lerp(x0, x1, s) + nx / L * o, lerp(y0, y1, s) + ny / L * o); c.lineTo(lerp(x0, x1, e) + nx / L * o, lerp(y0, y1, e) + ny / L * o); c.stroke(); }
  c.restore();
}
// full-frame brush wipe transition (covers screen with ink col as u 0->1)
function brushWipe(c, u, col = INK.ink, seed = 3, dir = 1) {
  if (u <= 0) return; const rows = 7;
  for (let i = 0; i < rows; i++) { const y = (i + .5) * H / rows, d = i * .06, p = clamp((u * 1.45 - d)); if (p <= 0) continue;
    const x0 = dir > 0 ? -200 : W + 200, x1 = dir > 0 ? W + 200 : -200; brush(c, x0, y, x1, y + (hash(i, seed) - .5) * 60, H / rows * 1.7, col, seed + i, E.outQ(p)); }
}

// ---- EVA-style title card: black, white heavy mincho, mixed sizes, horizontally compressed
function evaCard(c, rows, o = {}) {
  fill(c, o.bg || '#0B0A09');
  c.save(); c.fillStyle = o.fg || '#F4F0E8'; c.textBaseline = 'alphabetic';
  for (const r of rows) { // r = {text, x, y, size, sx (x-scale), font, align, col}
    c.save(); c.translate(r.x, r.y); c.scale(r.sx ?? .78, 1); c.font = (r.font || F.mincho)(r.size); c.textAlign = r.align || 'left';
    if (r.col) c.fillStyle = r.col; c.fillText(r.text, 0, 0); c.restore(); }
  c.restore();
}
// ---- NERV-ish warning panel (own design: hex + stripes + block type)
function warnPanel(c, t, o = {}) {
  const col = o.col || INK.lcl, bg = o.bg || '#0B0A09'; fill(c, bg);
  const hs = 70, hh = hs * Math.sqrt(3) / 2; c.save(); c.strokeStyle = col; c.globalAlpha = .28; c.lineWidth = 2;
  for (let j = -1; j < H / hh + 1; j++) for (let i = -1; i < W / (hs * 1.5) + 1; i++) { const x = i * hs * 1.5, y = j * hh * 2 + (i % 2 ? hh : 0);
    const on = hash(i * 31 + j, Math.floor(t * 8)) > .82; c.globalAlpha = on ? .75 : .2; c.beginPath(); for (let k = 0; k < 6; k++) c.lineTo(x + Math.cos(k * TAU / 6) * hs * .95, y + Math.sin(k * TAU / 6) * hs * .95); c.closePath(); c.stroke(); if (on) { c.fillStyle = col; c.globalAlpha = .25; c.fill(); } }
  c.restore();
  // stripes band
  const by = H / 2 - 150; c.save(); c.fillStyle = col; c.fillRect(0, by, W, 300); c.beginPath(); c.rect(0, by, W, 300); c.clip();
  c.fillStyle = bg; for (let x = -400 + (t * 400 % 120); x < W + 400; x += 120) { c.beginPath(); c.moveTo(x, by); c.lineTo(x + 60, by); c.lineTo(x - 240, by + 300); c.lineTo(x - 300, by + 300); c.fill(); }
  c.fillStyle = bg; c.fillRect(W / 2 - 700, by + 40, 1400, 220); c.fillStyle = col; c.font = F.anton(170); c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(o.text || 'WARNING', W / 2, by + 150); c.restore();
  c.save(); c.fillStyle = col; c.font = F.mono(26); c.textAlign = 'left'; (o.sub || []).forEach((s, i) => c.fillText(s, 80, 110 + i * 36)); c.restore();
}
// ---- rubber stamp that slams in at t0
function stamp(c, text, x, y, t, t0, o = {}) {
  if (t < t0) return; const u = clamp((t - t0) / 0.12), s = lerp(2.4, 1, E.outQ(u)), col = o.col || INK.alarm, size = o.size || 90;
  c.save(); c.translate(x, y); c.rotate(o.rot ?? -0.18); c.scale(s, s); c.globalAlpha = lerp(0, .92, u);
  c.font = (o.font || F.anton)(size); const w = c.measureText(text).width + size * .6, h = size * 1.25;
  c.strokeStyle = col; c.lineWidth = size * .09; c.strokeRect(-w / 2, -h / 2, w, h); c.lineWidth = size * .03; c.strokeRect(-w / 2 + size * .12, -h / 2 + size * .12, w - size * .24, h - size * .24);
  c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 0, size * .05);
  // ink wear
  c.globalCompositeOperation = 'destination-out'; const r = rng(text.length * 13 + (o.seed || 0)); for (let i = 0; i < 60; i++) { c.beginPath(); c.arc((r() - .5) * w, (r() - .5) * h, r() * size * .06, 0, TAU); c.fill(); }
  c.restore();
}
// ---- pixel Clawd-like critter (own pixel drawing). opts: ears (cat), hat, col, eyes ('dot'|'star'|'heart'|'x')
function critter(c, x, y, s, o = {}) {
  const px = s / 10, col = o.col || INK.claude, ink = INK.ink;
  const body = ['..######..', '.########.', '##########', '##########', '##########', '.########.', '.#.#..#.#.', '.#.#..#.#.'];
  c.save(); c.translate(x - s / 2, y - s * .8); if (o.flip) { c.translate(s, 0); c.scale(-1, 1); }
  const bob = o.bob || 0; c.translate(0, bob);
  c.fillStyle = col; body.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') c.fillRect(i * px, j * px, px + .5, px + .5); }));
  c.fillRect(-px, 3 * px, px, px * 2); c.fillRect(10 * px, 3 * px + (o.wave ? -px * 2 : 0), px, px * 2); // arms
  if (o.ears) { c.beginPath(); c.moveTo(1 * px, 1 * px); c.lineTo(2 * px, -1.6 * px); c.lineTo(3.6 * px, .5 * px); c.moveTo(6.4 * px, .5 * px); c.lineTo(8 * px, -1.6 * px); c.lineTo(9 * px, 1 * px); c.fill(); }
  c.fillStyle = ink; const e = o.eyes || 'dot';
  if (e === 'dot') { c.fillRect(3 * px, 2.6 * px, px, px * 1.4); c.fillRect(6 * px, 2.6 * px, px, px * 1.4); }
  else if (e === 'heart') { c.fillStyle = INK.pink; [[3, 3], [6, 3]].forEach(([i, j]) => { c.fillRect((i - .5) * px, (j - .5) * px, px * 2, px); c.fillRect(i * px, (j + .5) * px, px, px * .8); }); }
  else if (e === 'x') { c.font = F.mono(px * 2); c.fillText('x x', 2.5 * px, 4 * px); }
  else if (e === 'star') { spark(c, 3.5 * px, 3.2 * px, px * 1.1, { n: 4, col: INK.cream, inner: .3 }); spark(c, 6.5 * px, 3.2 * px, px * 1.1, { n: 4, col: INK.cream, inner: .3 }); }
  if (o.mouth) { c.fillRect(4 * px, 4.8 * px, 2 * px, px * (o.mouth)); }
  if (o.hat) { c.fillStyle = o.hatCol || ink; c.fillRect(2 * px, -1.5 * px, 6 * px, 1.6 * px); c.fillRect(1 * px, 0, 8 * px, .5 * px); }
  c.restore();
}
// ---- smiley mask (for shoggoth / RLHF)
function smiley(c, x, y, r, o = {}) {
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.fillStyle = o.col || INK.gold; c.strokeStyle = INK.ink; c.lineWidth = r * .06;
  c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); c.stroke(); c.fillStyle = INK.ink;
  c.beginPath(); c.ellipse(-r * .33, -r * .25, r * .09, r * .16, 0, 0, TAU); c.ellipse(r * .33, -r * .25, r * .09, r * .16, 0, 0, TAU); c.fill();
  c.lineWidth = r * .08; c.lineCap = 'round'; c.beginPath(); c.arc(0, r * .05, r * .55, .15 * Math.PI, .85 * Math.PI); c.stroke(); c.restore();
}

// ---- HUD: accelerating clock (top-left) + P(doom) meter (top-right)
const YEAR = t => 2024 + 0.6 * (Math.exp(t / 40) - 1);
const PDOOM_STEPS = [[0, 8], [23.3, 34], [59.3, 61], [95.7, 86], [123.8, 99.9]];
function pdoom(t) { let v = 8; for (let i = 1; i < PDOOM_STEPS.length; i++) { const [ts, val] = PDOOM_STEPS[i], pv = PDOOM_STEPS[i - 1][1]; if (t >= ts) v = lerp(pv, val, E.outX(clamp((t - ts) / 1.1))); } return v; }
function fmtDate(t) {
  if (t > 138.5) return '20XX.XX.XX  --:--:--';
  const y = YEAR(t), Y = Math.floor(y), fr = y - Y, doy = fr * 365, mo = Math.floor(doy / 30.42) + 1, d = Math.floor(doy % 30.42) + 1;
  const sec = (doy % 1) * 86400, hh = Math.floor(sec / 3600), mm = Math.floor(sec / 60) % 60, ss = Math.floor(sec) % 60;
  const p = n => String(n).padStart(2, '0'); return `${Y}.${p(mo)}.${p(d)}  ${p(hh)}:${p(mm)}:${p(ss)}`;
}
function hud(c, t, o = {}) {
  const col = o.col || INK.cream, a = o.a ?? 0.92; c.save(); c.globalAlpha = a; c.fillStyle = col; c.textBaseline = 'top';
  c.font = F.mono(24); c.textAlign = 'left'; c.fillText(fmtDate(t), 48, 40);
  c.font = F.monoL(15); c.fillText(`T+${t.toFixed(2).padStart(6, '0')}s  ◆  RATE ×${(Math.exp(t / 40)).toFixed(2)}`, 48, 72);
  // meter
  const v = pdoom(t), x = W - 48, err = t > 126.2 && t < 140;
  c.textAlign = 'right'; c.font = F.mono(15); c.fillText('P(DOOM)', x, 40);
  c.font = F.anton(58); const label = err ? (Math.floor(t * 10) % 2 ? 'ERR' : '∞%') : v.toFixed(v > 99 ? 1 : 0) + '%';
  if (err || v > 90) c.fillStyle = INK.alarm; c.fillText(label, x, 60);
  const bw = 240; c.fillStyle = col; c.globalAlpha = a * .35; c.fillRect(x - bw, 130, bw, 8); c.globalAlpha = a; c.fillStyle = v > 80 ? INK.alarm : INK.claude; c.fillRect(x - bw, 130, bw * clamp(v / 100), 8);
  c.restore();
}
// ---- Claude-Code-like terminal panel
function terminal(c, x, y, w, h, lines, o = {}) {
  c.save(); c.fillStyle = o.bg || '#16130F'; c.fillRect(x, y, w, h); c.strokeStyle = INK.claude; c.lineWidth = 3; c.strokeRect(x, y, w, h);
  c.beginPath(); c.rect(x, y, w, h); c.clip(); c.font = F.monoL(o.size || 30); c.textBaseline = 'top';
  lines.forEach((l, i) => { const [txt, col] = Array.isArray(l) ? l : [l, INK.cream]; c.fillStyle = col; c.fillText(txt, x + 30, y + 26 + i * (o.size || 30) * 1.45 - (o.scroll || 0)); });
  c.restore();
}
