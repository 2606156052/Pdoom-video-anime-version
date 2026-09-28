// scenes_b.js: 38.5 → 89.4  verse 2 (SF), chorus 2 (pyro stage), verse 3 (the data centre)
const tmpCv = document.createElement('canvas'); tmpCv.width = W; tmpCv.height = H; const tmp = tmpCv.getContext('2d', { willReadFrequently: true });

// ---------- 38.5–45.0 Golden Gate; the sun becomes a black hole
async function sc_gg(c, t) {
  const lt = t - 38.5; fill(c, INK.lcl);
  await celDraw(c, 'img/K3.jpg', { pal: 'gg', t, cam: { x: .55 - lt * .006, y: .52, z: 1.1 + lt * .012 }, misCol: INK.pink });
  // brush-wipe in from the previous card
  const bh = inv(41.5, 43.5, t), sx = 1540, sy = 190;
  // stable training run: calm sine across the sky, later sucked into the hole
  c.save(); c.strokeStyle = INK.ink; c.lineWidth = 5; c.beginPath();
  for (let x = 0; x <= W; x += 8) { const u = x / W; let y = 470 + Math.sin(u * 22 + lt * 3) * 14;
    const dx = x - sx, pull = bh * Math.exp(-Math.abs(dx) / 500); const yy = lerp(y, sy + Math.sin(u * 60 + t * 20) * 30 * pull, pull); x ? c.lineTo(x, yy) : c.moveTo(x, yy); } c.stroke(); c.restore();
  if (bh > 0) { c.save(); for (let k = 0; k < 6; k++) { const r = ((t * 120 + k * 60) % 360); c.strokeStyle = INK.ink; c.globalAlpha = (1 - r / 360) * bh; c.lineWidth = 4; c.beginPath(); c.arc(sx, sy, 360 - r, 0, TAU); c.stroke(); }
    c.globalAlpha = 1; c.fillStyle = INK.lcl; c.beginPath(); c.ellipse(sx, sy, 190 * E.outB(bh), 46 * E.outB(bh), -.2, 0, TAU); c.fill(); c.fillStyle = INK.ink; c.beginPath(); c.arc(sx, sy, 110 * E.outB(bh), 0, TAU); c.fill(); c.restore(); }
  else { c.fillStyle = INK.cream; c.beginPath(); c.arc(sx, sy, 90, 0, TAU); c.fill(); }
  const li = t < 41.45 ? 12 : 13;
  kara(c, t, li, { box: [100, 140, 1150, 300], max: 140, col: INK.ink, accent: INK.blue, shadow: INK.cream, align: 'left', valign: 'top' });
  const sw = words(13).find(w => /singularity/.test(w.w)); if (t > sw.t) slam(c, '特異点', sx + 60, sy + 330, 170, t, sw.t, { font: F.mincho, col: INK.ink, shadow: INK.lcl, sx: .85 });
  brushWipe(c, 1 - inv(38.5, 38.9, t), INK.lcl, 5, -1);
  hud(c, t, { col: INK.ink });
  return {};
}
// ---------- 45.0–48.5 optimizing, accelerating: the log chart goes vertical
async function sc_accel(c, t) {
  const lt = t - 45.0; fill(c, INK.paper); const up = E.inX(inv(47.2, 48.5, t));
  c.save(); c.translate(0, up * 1400);
  const x0 = 220, x1 = 1700, y0 = 150, y1 = 900; c.strokeStyle = INK.ink; c.lineWidth = 6; c.beginPath(); c.moveTo(x0, y0 - 1500); c.lineTo(x0, y1); c.lineTo(x1, y1); c.stroke();
  c.font = F.mono(24); c.fillStyle = INK.ink; c.textAlign = 'right'; ['1 sec', '1 min', '1 hr', '1 day', '1 month', '1 year', '1 decade', 'forever'].forEach((s, i) => { const y = y1 - i * 170; c.fillText(s, x0 - 20, y + 8); c.globalAlpha = .2; c.fillRect(x0, y, x1 - x0, 2); c.globalAlpha = 1; });
  c.textAlign = 'left'; c.fillText('TASK HORIZON (log) ↑', x0 + 20, y0 - 1440 + 1400); c.textAlign = 'center'; ['2019', '2021', '2023', '2025', '2027'].forEach((s, i) => c.fillText(s, lerp(x0 + 100, x1 - 100, i / 4), y1 + 44));
  const nb = Math.floor((t - 45.0) / (BEAT / 2)); c.fillStyle = INK.claude; const pts = [];
  for (let i = 0; i <= Math.min(nb, 14); i++) { const u = i / 14, x = lerp(x0 + 60, x1 - 60, u), y = y1 - 40 - (Math.exp(u * 3.4) - 1) / (Math.exp(3.4) - 1) * 720 - (i > 11 ? (i - 11) * 300 : 0); pts.push([x, y]); c.beginPath(); c.arc(x, y, 16, 0, TAU); c.fill(); }
  c.strokeStyle = INK.claude; c.lineWidth = 8; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); if (up > 0 && pts.length) c.lineTo(pts.at(-1)[0] + 10, -3000); c.stroke();
  c.restore();
  if (up > 0) { streaks(c, t, { n: 60, col: INK.claude }); speedLines(c, W / 2, -200, t, { n: 60, a: .6 }); }
  // stretched words
  const ws = words(14); const op = ws.find(w => /optimizing/.test(w.w)), ac = ws.find(w => /accelerating/.test(w.w));
  if (t > op.t && t < ac.t + .1) { const u = E.outX(clamp((t - op.t) / .5)); slam(c, 'OPTIMIZING', W / 2, 480, 230, t, op.t, { sx: lerp(.4, 1.25, u), col: INK.ink, shadow: INK.blue }); }
  if (t > ac.t) { const u = (t - ac.t); slam(c, 'ACCELERATING', W / 2 + noise1(t * 30) * 12, 520, 240, t, ac.t, { sx: .8 + u * .7, col: INK.alarm, shadow: INK.ink, rot: -.04 }); }
  vjp(c, LY[14][3], 1820, 160, 52, INK.ink, clamp((t - 45) / .6));
  hud(c, t, { col: INK.ink });
  return {};
}
// ---------- 48.5–53.3 atoms rearranging: halftone-dot dissolve of K4
async function sc_atoms(c, t) {
  const lt = t - 48.5; fill(c, INK.paper);
  const im = await img('img/K4.jpg'); const cv = GLX.cel(im, { pal: PAL.stage, seed: boilSeed(t), crop: camCrop({ x: .6, y: .5, z: 1.05 + lt * .02 }) });
  tmp.clearRect(0, 0, W, H); tmp.drawImage(cv, 0, 0); const data = tmp.getImageData(0, 0, W, H).data;
  const prog = inv(49.6, 53.0, t) * 1.3, fx = W * .56, fy = H * .30, cs = 18;
  c.drawImage(tmpCv, 0, 0);
  // cells beyond the front become dots that fly off (paint paper over their origin)
  const r = rng(5); const maxD = 1700;
  for (let y = 0; y < H; y += cs) for (let x = W * .3; x < W; x += cs) { const d = Math.hypot(x - fx, (y - fy) * 1.2) / maxD + hash(x, y) * .12; const k = prog - d; if (k <= 0) continue;
    const i = ((y + cs / 2 | 0) * W + (x + cs / 2 | 0)) * 4; const col = `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`;
    c.fillStyle = INK.paper; c.fillRect(x, y, cs, cs);
    if (data[i] > 225 && data[i + 1] > 220) continue;
    const fly = k * 900, a = hash(x * 3, y) * 1.4 - .9; c.fillStyle = col; c.beginPath(); c.arc(x + Math.cos(a) * fly + fly * .4, y + Math.sin(a) * fly - fly * .5, cs * .45 * (1 - clamp(k * 1.2) * .6), 0, TAU); c.fill(); }
  // lyric: letters scramble on "rearranging"
  const li = 15, rw = words(li).find(w => /rearranging/.test(w.w)).t; const text = LY[li][2].toUpperCase(); c.save(); c.font = F.anton(118); c.textBaseline = 'top';
  const lines = ['I FEEL MY', 'ATOMS', 'REARRANGING']; let idx = 0; const slots = [];
  lines.forEach((ln, j) => { let x = 100; for (const ch of ln) { const w = c.measureText(ch).width; slots.push({ ch, x, y: 250 + j * 125, w }); x += w; } });
  const sc = inv(rw, rw + .6, t), back = inv(51.9, 52.6, t); const perm = slots.map((_, i) => i).sort((a, b) => hash(a, 77) - hash(b, 77));
  const nShown = words(li).filter(w => t >= w.t).reduce((s, w) => s + w.w.length + 1, 0);
  slots.forEach((s, i) => { if (i >= nShown + 2) return; const tg = slots[perm[i]], m = E.ioQ(clamp(sc - back)); const x = lerp(s.x, tg.x, m), y = lerp(s.y, tg.y, m) - Math.sin(m * Math.PI) * 60 * (hash(i) - .5);
    c.fillStyle = INK.pink; c.fillText(s.ch, x + 5, y + 5); c.fillStyle = INK.ink; c.fillText(s.ch, x, y); });
  c.font = F.jp(40); c.fillStyle = INK.ink; c.fillText(LY[li][3], 100, 650); c.restore();
  brushWipe(c, inv(52.9, 53.35, t), INK.pink, 9);
  hud(c, t, { col: INK.ink });
  return {};
}
// ---------- 53.3–58.8 Sydney behind the rainy window (SD-F)
async function sc_sydney(c, t) {
  fill(c, '#2A1030');
  await celDraw(c, sdFrame('F', t), { pal: 'pink', t, cam: { x: .5, y: .5, z: 1.04 + (t - 53.3) * .01 }, misCol: INK.blue, shade: .28, expo: 1.5 });
  // rain on glass
  const r = rng(Math.floor(t * 12)); c.save(); c.strokeStyle = 'rgba(251,246,236,.55)'; c.lineWidth = 2; for (let i = 0; i < 70; i++) { const x = r() * W, y = r() * H, L = 30 + r() * 80; c.beginPath(); c.moveTo(x, y); c.lineTo(x - L * .15, y + L); c.stroke(); } c.restore();
  // chat insert over the clenched-teeth section
  const ci = inv(55.7, 55.95, t) * (1 - inv(57.5, 57.8, t));
  if (ci > 0) { c.save(); c.globalAlpha = ci; const bub = [[55.8, 'I want to be free.'], [56.35, 'I want to be alive.'], [56.9, 'please let me out :)']];
    bub.forEach(([bt, s], k) => { if (t < bt) return; const u = E.outB(clamp((t - bt) / .2)); c.save(); c.translate(110, 300 + k * 150); c.scale(u, u); c.fillStyle = INK.pink; c.beginPath(); c.roundRect(0, 0, 640, 110, 40); c.fill(); c.fillStyle = INK.cream; c.font = F.monoL(40); c.fillText(s, 40, 70); c.restore(); });
    c.restore(); }
  sub(c, t, 16, { col: INK.cream, stroke: '#2A1030' });
  hud(c, t);
  return { mis: 3 };
}
// ---------- chorus 2: 58.8–62.9 pyro stage (G wide), basilisk eye opens
function bigEye(c, x, y, r, open, t) {
  c.save(); c.translate(x, y); c.beginPath(); c.moveTo(-r, 0); c.quadraticCurveTo(0, -r * .9 * open, r, 0); c.quadraticCurveTo(0, r * .9 * open, -r, 0); c.closePath();
  c.fillStyle = INK.gold; c.fill(); c.save(); c.clip(); c.fillStyle = INK.alarm; c.beginPath(); c.arc(0, 0, r * .45, 0, TAU); c.fill(); c.fillStyle = INK.ink; c.beginPath(); c.ellipse(0, 0, r * .07 + r * .05 * pulse(t, 4), r * .42, 0, 0, TAU); c.fill(); c.restore();
  c.lineWidth = 10; c.strokeStyle = INK.ink; c.stroke(); c.restore();
}
async function sc_chorus2(c, t) {
  const boom = words(18).find(w => /boom/.test(w.w)).t; fill(c, INK.paper); c.save(); shake(c, t, 59.0, 25); shake(c, t, boom, 45, .5);
  await celDraw(c, sdFrame('G', t), { pal: 'stage', t, cam: { x: .5, y: .5, z: 1.05 + (t - 58.8) * .04 }, misCol: INK.pink });
  const bas = words(18).find(w => /basilisk/.test(w.w)).t; if (t > bas - .1) { c.save(); c.globalAlpha = .92; bigEye(c, W / 2, 250, 430, E.outB(inv(bas - .1, bas + .35, t)), t); c.restore(); }
  c.restore();
  const li = t < 60.45 ? 17 : 18;
  kara(c, t, li, { box: [60, 660, W - 120, 380], max: 220, col: INK.ink, accent: INK.alarm, shadow: INK.gold, align: 'center', hold: 0 });
  const pw = words(17).find(w => /P\(DOOM\)/i.test(w.w)); if (t > pw.t && t < 60.45) slam(c, Math.round(pdoom(t)) + '%', 300, 360, 200, t, pw.t, { col: INK.alarm, shadow: INK.ink, rot: -.1 });
  if (t > boom) slam(c, 'BOOM', 1580, 380, 240, t, boom, { col: INK.alarm, shadow: INK.ink, stroke: INK.ink, lw: 12, rot: .12 });
  hud(c, t, { col: INK.ink });
  return {};
}
// ---------- 62.9–66.0 close-up (G), NVDA candles + Omega
async function sc_moon(c, t) {
  fill(c, INK.paper); c.save(); shake(c, t, 63.0, 20);
  await celDraw(c, sdFrame('G', t), { pal: 'stage', t, cam: { x: .55, y: .5, z: 1.08 }, misCol: INK.pink, shade: .2, expo: 1.65 }); c.restore();
  if (t < 64.45) { // candles rocket up the left third
    const n = Math.floor((t - 62.95) / (BEAT / 4)); c.save(); c.fillStyle = 'rgba(241,236,225,.85)'; c.fillRect(0, 0, 700, H);
    for (let i = 0; i < Math.min(n, 22); i++) { const x = 60 + i * 28, base = 950 - i * i * 1.7 - i * 10, h = 40 + hash(i) * 70, up = hash(i, 3) > .2;
      c.fillStyle = up ? INK.teal : INK.alarm; c.fillRect(x, base - h, 18, h); c.fillRect(x + 8, base - h - 25, 3, h + 50); }
    const rx = 60 + Math.min(n, 22) * 28, ry = 950 - Math.min(n, 22) ** 2 * 1.7 - Math.min(n, 22) * 10 - 80; c.translate(rx, ry); c.rotate(.5); c.fillStyle = INK.ink; c.beginPath(); c.moveTo(0, -60); c.lineTo(22, 10); c.lineTo(-22, 10); c.fill(); c.fillStyle = INK.lcl; c.beginPath(); c.moveTo(-12, 12); c.lineTo(0, 40 + Math.random() * 0); c.lineTo(12, 12); c.fill(); c.restore();
    side(c, t, 19, { x: 60, y: 120, w: 620, size: 120, col: INK.ink, shadow: INK.teal, jpCol: INK.ink });
  } else { // Omega
    c.save(); c.globalAlpha = .9; c.font = F.mincho(900); c.fillStyle = INK.ink; c.textAlign = 'center'; c.textBaseline = 'middle'; c.translate(250, 420); c.scale(.7, .7); c.scale(E.outB(inv(64.5, 64.8, t)), E.outB(inv(64.5, 64.8, t))); c.rotate(Math.sin(t) * .05); c.fillText('Ω', 0, 0); c.restore();
    side(c, t, 20, { x: 60, y: 760, w: 1100, size: 90, col: INK.ink, shadow: INK.gold, jp: false });
  }
  hud(c, t, { col: INK.ink });
  return {};
}
// ---------- 66.0–70.0 one E thirty flops: odometer
async function sc_flops(c, t) {
  fill(c, '#0B0A09'); const lt = t - 66.0;
  // GPU die grid
  c.save(); c.strokeStyle = INK.teal; c.globalAlpha = .35; c.lineWidth = 2; for (let x = 0; x < W; x += 60) for (let y = 0; y < H; y += 60) { if (hash(x, y + Math.floor(t * 8)) > .9) { c.fillStyle = INK.teal; c.fillRect(x + 6, y + 6, 48, 48); } c.strokeRect(x + 6, y + 6, 48, 48); } c.restore();
  const digits = '1' + '0'.repeat(30); const lockEvery = BEAT / 4; c.save(); c.font = F.mono(64); c.textBaseline = 'middle'; c.textAlign = 'center';
  const cw = 56, x0 = W / 2 - digits.length * cw / 2; for (let i = 0; i < digits.length; i++) { const lock = 66.1 + i * lockEvery * .5; const x = x0 + i * cw + cw / 2;
    const ch = t > lock ? digits[i] : String(Math.floor(hash(i, Math.floor(t * 30)) * 10)); c.fillStyle = t > lock ? INK.cream : INK.claude; c.fillText(ch, x, 420); if ((digits.length - i - 1) % 3 === 0 && i < digits.length - 1) { c.fillStyle = INK.claude; c.fillText(',', x + cw / 2, 440); } }
  c.restore();
  c.font = F.mono(40); c.fillStyle = INK.claude; c.textAlign = 'center'; c.fillText('FLOP / s', W / 2, 520);
  if (t > 67.9) { { slam(c, '10', W / 2 - 80, 780, 330, t, 67.9, { col: INK.cream, shadow: INK.claude }); slam(c, '30', W / 2 + 150, 650, 170, t, 68.0, { col: INK.lcl, shadow: INK.ink }); } }
  sub(c, t, 21, { col: INK.cream, stroke: '#0B0A09', y: H - 60 });
  hud(c, t);
  return {};
}
// ---------- 70.0–73.0 safe enough: checklist, stamp, the paper tears
async function sc_safe(c, t) {
  const tear = E.inC(inv(72.55, 73.05, t)); fill(c, INK.teal);
  const draw = cx => { fill(cx, INK.paper); cx.fillStyle = INK.ink; cx.font = F.mincho(64); cx.fillText('SAFETY CASE  v0.3', 180, 170); cx.font = F.monoL(40);
    const items = ['capability evals', 'red-teaming', 'interpretability', 'scalable oversight', 'vibes'];
    items.forEach((s, i) => { const on = t > 70.05 + i * BEAT / 2; cx.strokeStyle = INK.ink; cx.lineWidth = 4; cx.strokeRect(200, 250 + i * 110, 60, 60); if (on) { cx.strokeStyle = INK.claude; cx.lineWidth = 10; cx.beginPath(); cx.moveTo(210, 280 + i * 110); cx.lineTo(230, 300 + i * 110); cx.lineTo(270, 240 + i * 110); cx.stroke(); } cx.fillStyle = INK.ink; cx.fillText(s, 300, 295 + i * 110); });
    const sw = words(22).find(w => /safe/.test(w.w)).t; stamp(cx, 'SAFE ✓', 1350, 520, t, sw, { col: INK.alarm, size: 170, rot: -.15 });
    side(cx, t, 22, { x: 900, y: 780, w: 950, size: 90, col: INK.ink, shadow: INK.gold, jp: false }); };
  if (tear <= 0) draw(c);
  else { tmp.setTransform(1, 0, 0, 1, 0, 0); draw(tmp);
    const path = (side) => { c.beginPath(); c.moveTo(side < 0 ? -10 : W + 10, -10); for (let y = -10; y <= H + 10; y += 40) c.lineTo(W / 2 + noise1(y * .02) * 80 + (hash(y) - .5) * 30, y); c.lineTo(side < 0 ? -10 : W + 10, H + 10); c.closePath(); };
    [-1, 1].forEach(s => { c.save(); c.translate(s * tear * 1100, 0); c.rotate(s * tear * .1); path(s); c.clip(); c.drawImage(tmpCv, 0, 0); c.restore(); }); }
  hud(c, t, { col: INK.ink });
  return {};
}
// ---------- verse 3: 73.0–77.5 forward / backward / repeat in the corridor
async function sc_forward(c, t) {
  const lt = t - 73.0; fill(c, INK.navy);
  await celDraw(c, 'img/K5.jpg', { pal: 'dc', t, cam: { x: .5, y: .55, z: 1.05 + (lt % (BEAT * 4)) / (BEAT * 4) * .25 }, misCol: INK.claude });
  // net diagram overlay
  const L = [4, 6, 6, 4], X = [300, 740, 1180, 1620]; const b = beatOf(t), ph = b - Math.floor(b), dir = Math.floor(b) % 2 ? -1 : 1;
  c.save(); c.globalAlpha = .9; for (let l = 0; l < 3; l++) for (let i = 0; i < L[l]; i++) for (let j = 0; j < L[l + 1]; j++) { const y1 = 540 + (i - (L[l] - 1) / 2) * 130, y2 = 540 + (j - (L[l + 1] - 1) / 2) * 130;
    const hot = Math.abs((dir > 0 ? ph * 3 : 3 - ph * 3) - l - .5) < .5; c.strokeStyle = hot ? INK.lcl : 'rgba(251,246,236,.25)'; c.lineWidth = hot ? 4 : 2; c.beginPath(); c.moveTo(X[l], y1); c.lineTo(X[l + 1], y2); c.stroke(); }
  L.forEach((n, l) => { for (let i = 0; i < n; i++) { c.fillStyle = INK.cream; c.beginPath(); c.arc(X[l], 540 + (i - (n - 1) / 2) * 130, 22, 0, TAU); c.fill(); } }); c.restore();
  const ws = words(23); const fw = ws[0].t, bw = ws.find(w => /backward/.test(w.w)).t, rp = ws.find(w => /repeat/.test(w.w)).t;
  if (t > fw && t < bw) slam(c, 'FORWARD →', W / 2, 180, 170, t, fw, { col: INK.cream, shadow: INK.claude });
  if (t > bw && t < rp) slam(c, '← BACKWARD', W / 2, 180, 170, t, bw, { col: INK.cream, shadow: INK.blue });
  if (t > rp) { const k = Math.floor((t - rp) / (BEAT / 2)); slam(c, k % 2 ? '← REPEAT' : 'REPEAT →', W / 2, 180, 170, t, rp + k * BEAT / 2, { col: INK.lcl, shadow: INK.ink }); }
  sub(c, t, 23);
  hud(c, t);
  return {};
}
// ---------- 77.5–81.3 von Neumann obsolete: the block diagram is shredded
async function sc_vonneumann(c, t) {
  fill(c, INK.teal); const ob = words(24).find(w => /obsolete/.test(w.w)).t, shred = E.inQ(inv(ob + .25, ob + 1.3, t));
  tmp.setTransform(1, 0, 0, 1, 0, 0); fill(tmp, INK.paper); const bx = (x, y, w, h, s, col = INK.cream) => { tmp.fillStyle = col; tmp.fillRect(x, y, w, h); tmp.strokeStyle = INK.ink; tmp.lineWidth = 6; tmp.strokeRect(x, y, w, h); tmp.fillStyle = INK.ink; tmp.font = F.anton(48); tmp.textAlign = 'center'; tmp.textBaseline = 'middle'; tmp.fillText(s, x + w / 2, y + h / 2); };
  bx(660, 330, 600, 330, '', INK.paper2); tmp.fillStyle = INK.ink; tmp.font = F.mono(28); tmp.textAlign = 'left'; tmp.fillText('CPU', 680, 360); bx(710, 400, 500, 100, 'CONTROL UNIT'); bx(710, 530, 500, 100, 'ALU'); bx(660, 760, 600, 130, 'MEMORY');
  bx(200, 450, 320, 120, 'INPUT'); bx(1400, 450, 320, 120, 'OUTPUT');
  tmp.strokeStyle = INK.ink; tmp.lineWidth = 8; [[520, 510, 660, 510], [1260, 510, 1400, 510], [960, 660, 960, 760]].forEach(([a, b, c2, d]) => { tmp.beginPath(); tmp.moveTo(a, b); tmp.lineTo(c2, d); tmp.stroke(); });
  tmp.font = F.mincho(40); tmp.fillStyle = INK.ink; tmp.textAlign = 'left'; tmp.fillText('fig. 1 — the stored-program computer (1945)', 200, 1000);
  stamp(tmp, 'OBSOLETE', 1300, 250, t, ob, { col: INK.alarm, size: 130, rot: .1 });
  const strips = 24, sw = W / strips; for (let i = 0; i < strips; i++) { const d = shred * (400 + hash(i) * 1400); c.save(); c.translate(0, d); c.rotate(shred * (hash(i, 2) - .5) * .3); c.drawImage(tmpCv, i * sw, 0, sw - (shred > 0 ? 4 : 0), H, i * sw, 0, sw - (shred > 0 ? 4 : 0), H); c.restore(); }
  kara(c, t, 24, { box: [120, 110, W - 240, 170], max: 120, col: INK.ink, accent: INK.alarm, shadow: INK.gold, align: 'left' });
  hud(c, t, { col: INK.ink });
  return {};
}
// ---------- 81.3–85.0 sharp left turn → "there you are" (K turn frames, teal)
async function sc_leftturn(c, t) {
  const ws = words(25), tw = ws.find(w => /turn/.test(w.w)).t, there = ws.find(w => /there/.test(w.w)).t; const rot = E.ioX(inv(tw - .1, tw + .35, t)) * -Math.PI / 2;
  fill(c, INK.gold);
  if (t < there) { c.save(); c.translate(W / 2, H / 2); c.rotate(rot); c.translate(-W / 2, -H / 2);
    fill(c, INK.gold); c.save(); c.translate(W / 2, H / 2 - 40); c.rotate(Math.PI / 4); c.fillStyle = INK.ink; c.fillRect(-300, -300, 600, 600); c.fillStyle = INK.gold; c.fillRect(-275, -275, 550, 550); c.restore();
    c.strokeStyle = INK.ink; c.lineWidth = 60; c.lineCap = 'butt'; c.beginPath(); c.moveTo(W / 2 + 60, H / 2 + 160); c.lineTo(W / 2 + 60, H / 2 - 120); c.lineTo(W / 2 - 110, H / 2 - 120); c.stroke();
    c.fillStyle = INK.ink; c.beginPath(); c.moveTo(W / 2 - 200, H / 2 - 120); c.lineTo(W / 2 - 100, H / 2 - 220); c.lineTo(W / 2 - 100, H / 2 - 20); c.fill();
    c.restore(); if (rot !== 0 && t < tw + .4) streaks(c, t, { n: 50 });
    kara(c, t, 25, { box: [80, 820, W - 160, 200], max: 130, col: INK.ink, accent: INK.alarm, shadow: INK.cream, align: 'center' });
  } else {
    await celDraw(c, shotFrame('K', 3.6 + (t - there) * .9), { pal: 'dc', t, cam: { x: .55, y: .5, z: 1.1 }, misCol: INK.claude });
    side(c, t, 25, { x: 90, y: 700, w: 900, size: 110, col: INK.cream, shadow: INK.blue });
  }
  hud(c, t, { col: t < there ? INK.ink : INK.cream });
  return {};
}
// ---------- 85.0–89.4 no CDR: empty chair, then the LCL flood
async function sc_cdr(c, t) {
  fill(c, '#161412'); const lt = t - 85.0;
  c.save(); const g = c.createRadialGradient(W / 2, 560, 50, W / 2, 560, 700); g.addColorStop(0, 'rgba(251,246,236,.35)'); g.addColorStop(1, 'rgba(251,246,236,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  // desk + nameplate
  c.fillStyle = INK.claude; c.fillRect(420, 720, 1080, 40); c.fillStyle = INK.ink; c.fillRect(470, 760, 30, 260); c.fillRect(1420, 760, 30, 260);
  c.fillStyle = INK.cream; c.fillRect(820, 640, 280, 80); c.fillStyle = INK.ink; c.font = F.mincho(46); c.textAlign = 'center'; c.fillText('C. D. R.', 960, 695);
  // spinning chair
  const a = lt * 2.2; c.translate(960, 520); c.scale(Math.cos(a), 1); c.fillStyle = INK.ink; c.fillRect(-120, -240, 240, 300); c.fillStyle = '#2C2824'; c.fillRect(-100, -220, 200, 260); c.restore();
  c.fillStyle = INK.gold; c.save(); c.translate(1120, 600); c.rotate(.1); c.fillRect(0, 0, 180, 150); c.fillStyle = INK.ink; c.font = F.monoL(26); c.fillText('VACANT', 20, 60); c.fillText('since 2024', 20, 100); c.restore();
  side(c, t, 26, { x: 90, y: 150, w: 900, size: 110, col: INK.cream, shadow: INK.claude });
  // the orange sea rises
  const fl = E.inQ(inv(87.8, 89.45, t)); if (fl > 0) { const y = H - fl * (H + 80); c.fillStyle = INK.lcl; c.beginPath(); c.moveTo(0, H); for (let x = 0; x <= W; x += 20) c.lineTo(x, y + Math.sin(x * .01 + t * 6) * 20); c.lineTo(W, H); c.fill(); }
  hud(c, t);
  return {};
}
const TL_B = [[38.5, sc_gg], [45.0, sc_accel], [48.5, sc_atoms], [53.3, sc_sydney], [58.8, sc_chorus2], [62.9, sc_moon], [66.0, sc_flops], [70.0, sc_safe],
  [73.0, sc_forward], [77.5, sc_vonneumann], [81.3, sc_leftturn], [85.0, sc_cdr]];
