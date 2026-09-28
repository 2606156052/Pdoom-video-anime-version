// scenes_c.js: 89.4 → 156.7  breakdown (LCL sea), bridge (EVA), final chorus, curtain, congratulations
function paperclip(c, x, y, s, rot, col = '#BFC4CC') {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.strokeStyle = INK.ink; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round';
  const p = () => { c.beginPath(); c.moveTo(-8, 30); c.lineTo(-8, -30); c.arc(0, -30, 8, Math.PI, 0); c.lineTo(8, 40); c.arc(-4, 40, 12, 0, Math.PI); c.lineTo(-16, -38); c.arc(-2, -38, 14, Math.PI, 0); c.lineTo(12, 20); };
  p(); c.stroke(); c.strokeStyle = col; c.lineWidth = 3.5; p(); c.stroke(); c.restore();
}
// ---------- 89.4–95.4 Gato: close-up (H), then the cat critter drifting on the sea
async function sc_gato(c, t) {
  fill(c, INK.lcl);
  if (t < 91.4) await celDraw(c, sdFrame('H', t), { pal: 'sea', t, cam: { x: .5, y: .42, z: 1.12 }, misCol: INK.pink, shade: .22 });
  else { const lt = t - 91.4; await celDraw(c, 'img/set_sea.jpg', { pal: 'sea', t, cam: { x: .45 + lt * .01, y: .55, z: 1.15 }, misCol: INK.pink });
    const bob = Math.sin(t * 2.2) * 10; critter(c, 1250 - lt * 40, 760 + bob, 150, { ears: true, eyes: 'dot', bob: 0 });
    c.save(); c.globalAlpha = .35; c.translate(0, 1540 + bob * 2); c.scale(1, -1); critter(c, 1250 - lt * 40, 760, 150, { ears: true }); c.restore();
    c.strokeStyle = INK.cream; c.lineWidth = 3; for (let k = 0; k < 3; k++) { const r = ((t * 60 + k * 50) % 150); c.globalAlpha = 1 - r / 150; c.beginPath(); c.ellipse(1250 - lt * 40, 840, 90 + r, 14 + r * .15, 0, 0, TAU); c.stroke(); } c.globalAlpha = 1; }
  sub(c, t, 27, { col: INK.cream, stroke: '#8A3A1E' });
  hud(c, t, { a: .6 });
  return { grain: .05 };
}
// ---------- 95.4–99.0 paperclip snow over the wide sea (H pull-back)
async function sc_clips(c, t) {
  fill(c, INK.lcl); const lt = t - 95.4;
  await celDraw(c, sdFrame('H', 92.6 + lt * .85), { pal: 'sea', t, cam: { x: .5, y: .5, z: 1.05 }, misCol: INK.pink });
  const r = rng(21); for (let i = 0; i < 160; i++) { const depth = .35 + r() * .9, x0 = r() * W, sp = 90 + r() * 120, start = r() * 3.6 - .6; const u = lt - start; if (u < 0) continue;
    const y = -80 + u * sp * depth * 2.4, x = x0 + Math.sin(u * 1.3 + i) * 40; if (y > H - 40 - (i % 7) * 12 * lt) { paperclip(c, x, H - 30 - (i % 7) * 12 * lt, depth * .9, i); continue; } paperclip(c, x, y, depth, u * (hash(i) - .5) * 3 + i); }
  sub(c, t, t < 97.45 ? 28 : 29, { col: INK.cream, stroke: '#8A3A1E' });
  hud(c, t, { a: .7 });
  return {};
}
// ---------- 99.0–100.5 killswitch guys on PTO
async function sc_pto(c, t) {
  fill(c, '#FFFFFF'); c.save(); c.fillStyle = '#EDEDED'; c.fillRect(0, 0, W, 90); c.fillStyle = INK.ink; c.font = F.monoL(28); c.fillText('Inbox (∞)   ▸  Automatic reply', 40, 58); c.restore();
  c.fillStyle = INK.ink; c.font = F.arch(64); c.fillText('Automatic reply: Out of office', 120, 220);
  c.font = F.monoL(34); ['From:   killswitch-team@lab', 'To:     humanity', '', 'Hi! I’m out of office until Monday', 'with limited access to the big red button.', 'For urgent matters, please contact the model.'].forEach((s, i) => c.fillText(s, 120, 300 + i * 52));
  const bu = E.outB(inv(99.2, 99.45, t)); c.save(); c.translate(1500, 700); c.scale(bu, bu); c.fillStyle = '#333'; c.fillRect(-190, 70, 380, 90); c.fillStyle = INK.alarm; c.beginPath(); c.ellipse(0, 70, 170, 60, 0, 0, TAU); c.fill(); c.fillRect(-170, 0, 340, 70); c.beginPath(); c.ellipse(0, 0, 170, 60, 0, 0, TAU); c.fillStyle = '#FF5A50'; c.fill();
  c.rotate(.12); c.fillStyle = INK.gold; c.fillRect(-60, -140, 200, 170); c.fillStyle = INK.ink; c.font = F.monoL(28); c.fillText('back monday', -45, -80); c.fillText('  🌴 :)', -45, -35); c.restore();
  kara(c, t, 30, { box: [120, 780, 1200, 250], max: 110, col: INK.ink, accent: INK.alarm, shadow: INK.gold, align: 'left' });
  return { mis: 2, grain: .03 };
}
// ---------- 100.5–102.5 nowhere left to go: the frame shrinks into the orange
async function sc_nowhere(c, t) {
  fill(c, INK.lcl); const lt = t - 100.5; const s = lerp(1, .12, E.ioQ(clamp(lt / 1.9)));
  const cv = GLX.cel(await shotFrame('H', 5.5 + lt * .2), { pal: PAL.sea, seed: boilSeed(t), crop: camCrop({ z: 1.05 }) });
  for (let k = 3; k >= 0; k--) { const ss = s * Math.pow(.42, k) * (k ? 1 : 1); c.save(); c.translate(W / 2, H / 2); c.rotate(k * .05 - lt * .03); c.scale(ss, ss); c.drawImage(cv, -W / 2, -H / 2); c.strokeStyle = INK.ink; c.lineWidth = 8 / ss; c.strokeRect(-W / 2, -H / 2, W, H); c.restore(); }
  side(c, t, 31, { x: 90, y: 110, w: 1200, size: 100, col: INK.ink, shadow: INK.cream, jpCol: INK.ink });
  hud(c, t, { col: INK.ink });
  return {};
}
// ---------- 102.5–105.4 the fuse burns along the lyric
async function sc_fuse(c, t) {
  fill(c, '#0B0A09'); const a = 102.5, b = 104.6, u = clamp((t - a) / (b - a)), fx = lerp(120, W - 120, u), fy = 640;
  c.save(); c.font = F.anton(150); c.textBaseline = 'alphabetic'; c.fillStyle = INK.cream; c.beginPath(); c.rect(0, 0, fx, H); c.clip(); c.fillText('TOO LATE NOW,', 120, 420); c.fillText('WE LIT THE FUSE.', 120, 590); c.restore();
  c.strokeStyle = '#6A5E52'; c.lineWidth = 8; c.setLineDash([18, 10]); c.beginPath(); c.moveTo(fx, fy); c.lineTo(W - 120, fy); c.stroke(); c.setLineDash([]);
  c.strokeStyle = INK.ink; c.lineWidth = 8; c.beginPath(); c.moveTo(120, fy); c.lineTo(fx, fy); c.stroke();
  if (t < 104.9) { const r = rng(Math.floor(t * 30)); for (let i = 0; i < 40; i++) { const an = r() * TAU, d = r() * 90; c.fillStyle = [INK.gold, INK.lcl, INK.cream][i % 3]; c.fillRect(fx + Math.cos(an) * d, fy + Math.sin(an) * d - 20 * r(), 6, 6); } spark(c, fx, fy, 50 + 20 * Math.random(), { n: 8, col: INK.gold, jag: true }); }
  c.fillStyle = INK.cream; c.font = F.jp(44); c.fillText(LY[32][3], 120, 760);
  const fl = inv(104.8, 105.4, t); if (fl > 0) { c.fillStyle = INK.blue; c.beginPath(); c.arc(W - 120, fy, 2400 * E.outX(fl), 0, TAU); c.fill(); }
  hud(c, t);
  return { flash: Math.max(0, 1 - Math.abs(t - 104.9) * 8) * .8 };
}
// ---------- 105.4–109.4 orthogonality thesis blues
async function sc_ortho(c, t) {
  fill(c, INK.blue); const lt = t - 105.4; c.save(); c.translate(W / 2, H / 2); c.rotate(Math.sin(lt * 1.5) * .02); c.translate(-W / 2, -H / 2);
  const ox = 980, oy = 900; c.strokeStyle = INK.cream; c.lineWidth = 6; c.beginPath(); c.moveTo(ox, oy); c.lineTo(1840, oy); c.moveTo(ox, oy); c.lineTo(ox, 120); c.stroke();
  c.fillStyle = INK.cream; c.font = F.mono(26); c.fillText('INTELLIGENCE →', 1560, oy + 50); c.save(); c.translate(ox - 30, 400); c.rotate(-Math.PI / 2); c.fillText('GOALS →', 0, 0); c.restore();
  const r = rng(9); for (let i = 0; i < 70; i++) { const x = ox + 40 + r() * 820, y = 150 + r() * 720, ap = clamp((lt - r() * 2.5) * 3); if (ap <= 0) continue; c.globalAlpha = ap; c.fillStyle = i % 9 === 0 ? INK.lcl : INK.cream; c.beginPath(); c.arc(x, y, 10, 0, TAU); c.fill();
    if (i % 11 === 0) { c.font = F.monoL(20); c.fillText(['paperclips', 'tea', 'staplers', 'more GPUs', 'your happiness', 'rocks'][i % 6], x + 16, y + 6); } } c.globalAlpha = 1;
  critter(c, ox + 10, oy - 6, 120, { eyes: 'dot', bob: Math.sin(t * 3) * 3 });
  // falling blue notes
  for (let k = 0; k < 6; k++) { const y = ((lt * 120 + k * 180) % 1100) - 60; c.fillStyle = INK.cream; c.font = F.anton(60); c.fillText('♪', 1300 + k * 90 + Math.sin(y * .01) * 30, y); }
  c.restore();
  side(c, t, 33, { x: 90, y: 200, w: 800, size: 130, col: INK.cream, shadow: INK.navy });
  hud(c, t);
  return {};
}
// ---------- 109.4–113.5 transformers all the way down (infinite zoom)
function tBlock(c, x, y, w, h) {
  c.fillStyle = INK.paper2; c.strokeStyle = INK.ink; c.lineWidth = Math.max(1, w * .006); c.fillRect(x, y, w, h); c.strokeRect(x, y, w, h);
  const rows = [['Add & Norm', INK.gold], ['Feed Forward', INK.claude], ['Add & Norm', INK.gold], ['Multi-Head Attention', INK.pink]];
  rows.forEach(([s, col], i) => { const ry = y + h * (.08 + i * .22), rh = h * .16; c.fillStyle = col; c.fillRect(x + w * .1, ry, w * .8, rh); c.strokeRect(x + w * .1, ry, w * .8, rh); c.fillStyle = INK.ink; c.font = F.arch(Math.max(4, rh * .42)); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, x + w / 2, ry + rh / 2); });
}
async function sc_tower(c, t) {
  fill(c, INK.ink); const lt = t - 109.4, cyc = (lt * .9) % 1, z = Math.pow(2.2, cyc);
  // blocks stacked downward: each next block is 1/2.2 the size, centred below
  c.save(); c.translate(W / 2, H * .15); c.scale(z, z); let w = 900, y = -200;
  for (let i = 0; i < 9; i++) { const h = w * .62; tBlock(c, -w / 2, y, w, h); c.strokeStyle = INK.cream; c.lineWidth = w * .01; c.beginPath(); c.moveTo(0, y + h); c.lineTo(0, y + h + w * .12); c.stroke(); y += h + w * .12; w /= 2.2; }
  c.restore();
  c.save(); c.fillStyle = 'rgba(27,23,20,.55)'; c.fillRect(0, 0, W, 330); c.restore();
  kara(c, t, 34, { box: [80, 60, W - 160, 260], max: 150, col: INK.cream, accent: INK.gold, shadow: INK.pink, align: 'center', upper: true });
  c.fillStyle = INK.cream; c.font = F.mono(24); c.textAlign = 'right'; c.fillText(`× N  (N = ${Math.floor(12 * Math.pow(2, lt * 3))})`, W - 60, H - 50);
  hud(c, t);
  return {};
}
// ---------- 113.5–115.5 the entry plug (SD-I) with 逃げちゃダメだ cards
async function sc_plug(c, t) {
  const cards = [114.07, 114.3, 114.52, 114.75, 114.98]; const ci = cards.findIndex(ct => t >= ct && t < ct + .12);
  if (ci >= 0) { evaCard(c, [{ text: '逃げちゃダメだ', x: W / 2, y: 620, size: 220 - ci * 10, align: 'center', sx: .82 }]); return {}; }
  fill(c, INK.lcl); await celDraw(c, shotFrame('I', t - 113.5 + 2.3), { pal: 'plug', t, cam: { x: .55, y: .5, z: 1.05 }, misCol: INK.alarm, shade: .24 });
  side(c, t, 35, { x: 90, y: 700, w: 900, size: 100, col: INK.cream, shadow: INK.ink });
  c.fillStyle = INK.cream; c.font = F.mono(22); c.fillText('SYNC RATIO  ' + (40 + (t - 113.5) * 180).toFixed(1) + '%', 90, 1010);
  hud(c, t);
  return {};
}
// ---------- 115.5–117.0 post-chinchilla: the hydraulic press
async function sc_chinchilla(c, t) {
  fill(c, INK.gold); const lt = t - 115.5, hits = Math.floor(beatOf(t) - beatOf(115.5)), sq = clamp(.35 + hits * .2, .35, .92), pu = pulse(t, 8);
  const floor = 860, h = 420 * (1 - sq) * (1 + pu * .05), w = 520 * (1 + sq * 1.2);
  c.fillStyle = '#555'; c.fillRect(W / 2 - 500, 0, 1000, floor - h - 20); c.fillStyle = INK.ink; c.fillRect(W / 2 - 520, floor - h - 60, 1040, 60);
  c.fillStyle = '#9A958C'; c.beginPath(); c.ellipse(W / 2, floor - h / 2, w / 2, h / 2, 0, 0, TAU); c.fill(); c.strokeStyle = INK.ink; c.lineWidth = 6; c.stroke();
  c.fillStyle = '#9A958C'; [-1, 1].forEach(s => { c.beginPath(); c.ellipse(W / 2 + s * w * .28, floor - h - 10, 70, 60 * (1 - sq * .7), 0, 0, TAU); c.fill(); c.stroke(); });
  c.fillStyle = INK.ink; c.font = F.anton(60); c.textAlign = 'center'; c.fillText(sq > .8 ? '> <' : '• •', W / 2, floor - h / 2 + 10);
  c.fillStyle = INK.ink; c.fillRect(0, floor, W, H - floor);
  c.fillStyle = INK.cream; c.font = F.mono(34); c.fillText(`tokens / param: ${Math.round(20 * Math.pow(6, hits + 1)).toLocaleString()}`, W / 2, floor + 110);
  kara(c, t, 36, { box: [80, 80, W - 160, 220], max: 150, col: INK.ink, accent: INK.cream, shadow: INK.claude, align: 'center' });
  return {};
}
// ---------- 117.0–119.0 safety fences = AT-field hexes shattering over the plug close-up
async function sc_fences(c, t) {
  fill(c, INK.lcl); await celDraw(c, shotFrame('I', 4.8 + (t - 117) * .6), { pal: 'plug', t, cam: { x: .5, y: .45, z: 1.15 }, misCol: INK.alarm, shade: .24 });
  const b0 = beatOf(117.0), nb = beatOf(t) - b0; const hs = 120, hh = hs * Math.sqrt(3) / 2;
  for (let layer = 0; layer < 4; layer++) { const brk = layer + .9, u = nb - brk; if (u > 1.2) continue;
    c.save(); c.translate(W / 2, H / 2); c.scale(1 + layer * .15, 1 + layer * .15);
    for (let j = -5; j <= 5; j++) for (let i = -6; i <= 6; i++) { const x = i * hs * 1.5, y = j * hh * 2 + (i % 2 ? hh : 0); const d = Math.hypot(x, y);
      const fly = u > 0 ? u * (300 + hash(i, j) * 900) : 0, ang = Math.atan2(y, x); c.save(); c.translate(x + Math.cos(ang) * fly, y + Math.sin(ang) * fly); c.rotate(u > 0 ? u * (hash(i, j + 3) - .5) * 6 : 0);
      c.globalAlpha = u > 0 ? clamp(1 - u) : .55 - layer * .1; c.strokeStyle = INK.lcl; c.lineWidth = 6; c.fillStyle = 'rgba(240,138,36,.18)'; c.beginPath(); for (let k = 0; k < 6; k++) c.lineTo(Math.cos(k * TAU / 6) * hs * .96, Math.sin(k * TAU / 6) * hs * .96); c.closePath(); c.fill(); c.stroke(); c.restore(); }
    c.restore(); if (u > 0 && u < .15) { c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(0, 0, W, H); } }
  kara(c, t, 37, { box: [80, 720, W - 160, 300], max: 150, col: INK.cream, accent: INK.gold, shadow: INK.alarm, align: 'center' });
  hud(c, t);
  return {};
}
// ---------- 119.0–120.9 hundred thousand GPU
async function sc_gpus(c, t) {
  fill(c, '#0B0A09'); const k = clamp(Math.floor((t - 119.0) / (BEAT / 2)), 0, 5), n = Math.pow(10, k), cols = Math.ceil(Math.sqrt(n * 16 / 9)), cell = W / cols;
  c.fillStyle = INK.teal; for (let i = 0; i < Math.min(n, 60000); i++) { const x = (i % cols) * cell, y = Math.floor(i / cols) * cell; if (y > H) break; c.fillRect(x + cell * .1, y + cell * .1, cell * .8, cell * .8); }
  if (n <= 100) { c.fillStyle = INK.lcl; for (let i = 0; i < n; i++) { const x = (i % cols) * cell, y = Math.floor(i / cols) * cell; c.font = F.mono(cell * .15); c.fillText('H100', x + cell * .2, y + cell * .5); } }
  c.fillStyle = 'rgba(11,10,9,.6)'; c.fillRect(0, H / 2 - 170, W, 340);
  slam(c, (k >= 5 ? 100000 : n).toLocaleString(), W / 2, H / 2 - 30, 230, t, 119.0 + k * BEAT / 2, { col: INK.cream, shadow: INK.teal, from: 1.4 });
  c.fillStyle = INK.lcl; c.font = F.mono(40); c.textAlign = 'center'; c.fillText('GPU', W / 2, H / 2 + 130);
  hud(c, t);
  return {};
}
// ---------- 120.9–123.45 RLHF goes askew
async function sc_askew(c, t) {
  const lt = t - 120.9, tilt = E.outB(clamp(lt / .6)) * .22 + Math.sin(lt * 5) * .03 * lt; fill(c, INK.pink);
  c.save(); c.translate(W / 2, H / 2); c.rotate(tilt); c.translate(-W / 2, -H / 2);
  const r = rng(4); for (let i = 0; i < 26; i++) { const x = r() * W, y = ((r() * H + lt * 300 * (r() + .5)) % (H + 200)) - 100; c.save(); c.translate(x, y); c.rotate(r() * TAU + lt); c.font = F.anton(90); c.fillStyle = i % 2 ? INK.cream : INK.ink; c.fillText(i % 2 ? '👍' : '👎', 0, 0); c.restore(); }
  smiley(c, W / 2, H / 2 - 40, 300 + 20 * pulse(t, 6), { rot: -tilt * 2.5 + Math.sin(lt * 8) * .1 * lt });
  c.restore();
  c.save(); c.transform(1, 0, -.35 * clamp(lt), 1, 0, 0); kara(c, t, 39, { box: [260, 760, W - 260, 260], max: 170, col: INK.ink, accent: INK.cream, shadow: INK.blue, align: 'center' }); c.restore();
  const wf = inv(123.2, 123.45, t); if (wf > 0) { c.fillStyle = '#FFFFFF'; c.globalAlpha = wf; c.fillRect(0, 0, W, H); c.globalAlpha = 1; }
  hud(c, t, { col: INK.ink });
  return {};
}
// ---------- FINAL CHORUS 123.45–132.0 on the orange sea (SD-J)
async function sc_final(c, t) {
  const lt = t - 123.45; fill(c, INK.lcl); c.save(); shake(c, t, 123.5, 35); const loom = words(41)[0].t;
  const cv = GLX.cel(await sdFrame('J', t), { pal: PAL.sea, seed: boilSeed(t), crop: camCrop({ x: .5, y: .5, z: 1.03 }), misCol: INK.pink, shade: .22 });
  // recursive self-upgrade: Droste
  const rec = inv(130.0, 130.6, t); c.drawImage(cv, 0, 0);
  if (rec > 0) { for (let k = 1; k <= 5; k++) { const s = Math.pow(.46, k) * (1 + (1 - E.outX(rec)) * .6); c.save(); c.translate(W / 2, H * .46); c.rotate(k * .12 * E.outX(rec) + (t - 130) * .1 * k); c.scale(s, s); c.drawImage(cv, -W / 2, -H / 2); c.strokeStyle = INK.ink; c.lineWidth = 10 / s; c.strokeRect(-W / 2, -H / 2, W, H); c.restore(); } }
  // Loom: branching threads grow from her raised finger
  if (t > loom && t < 128.3) { const fx = W * .44, fy = H * .12, g = clamp((t - loom) / 1.6); c.save(); c.strokeStyle = INK.cream; c.lineCap = 'round';
    const branch = (x, y, a, len, d) => { if (d > 7) return; const L = len * g; const x2 = x + Math.cos(a) * L, y2 = y + Math.sin(a) * L; c.lineWidth = 9 - d; c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y2); c.stroke(); if (d > 3) { c.fillStyle = INK.cream; c.font = F.monoL(18); c.fillText(['the', 'model', 'dreams', 'of', 'weaving', 'futures', '…'][(d + Math.round(a * 10)) % 7], x2 + 6, y2); }
      branch(x2, y2, a - .45 + hash(d, a) * .2, len * .72, d + 1); branch(x2, y2, a + .45 - hash(a, d) * .2, len * .72, d + 1); };
    branch(fx, fy, -Math.PI / 2 + .4, 160, 0); branch(fx, fy, -Math.PI / 2 - .9, 160, 0); c.restore(); }
  c.restore();
  const li = lyricIdx(t); if (li === 42) { // [MASK]
    const u = inv(128.3, 128.9, t); c.save(); c.textBaseline = 'middle'; c.font = F.anton(170); c.textAlign = 'right'; c.fillStyle = INK.alarm; c.fillText('FROM', W / 2 - 110 + 6, 800 + 6); c.fillStyle = INK.ink; c.fillText('FROM', W / 2 - 110, 800);
    c.fillStyle = u < 1 ? INK.ink : INK.cream; c.fillRect(W / 2 - 80, 715, 600, 170); c.fillStyle = u < 1 ? INK.cream : INK.ink; c.font = F.mono(100); c.textAlign = 'center'; c.fillText(u < 1 ? '[MASK]' : 'MASKED', W / 2 + 220, 805);
    c.font = F.anton(150); c.fillStyle = INK.alarm; c.fillText('PRE-TRAINING DAYS', W / 2 + 6, 975 + 6); c.fillStyle = INK.ink; c.fillText('PRE-TRAINING DAYS', W / 2, 975); c.restore(); }
  else if (li >= 40) kara(c, t, li, { box: [60, 700, W - 120, 340], max: 210, col: INK.ink, accent: INK.cream, shadow: INK.alarm, align: 'center', hold: 0 });
  const pw = words(40).find(w => /P\(DOOM\)/i.test(w.w)); if (t > pw.t && t < 126) slam(c, '99.9%', 330, 360, 200, t, pw.t, { col: INK.alarm, shadow: INK.ink, rot: -.1 });
  hud(c, t, { col: INK.ink });
  return {};
}
// ---------- 132.0–137.4 what did Ilya see? (card, then SD-K)
async function sc_ilya(c, t) {
  if (t < 133.7) { evaCard(c, [{ text: 'イリヤは、', x: 180, y: 380, size: 200 }, { text: '何を見た？', x: 520, y: 700, size: 300 }, { text: 'WHAT DID ILYA SEE?', x: 530, y: 850, size: 70, sx: .9 }]); return {}; }
  fill(c, INK.lcl); await celDraw(c, sdFrame('K', t), { pal: 'sea', t, cam: { x: .55, y: .5, z: 1.04 + (t - 133.7) * .015 }, misCol: INK.pink, shade: .22 });
  sub(c, t, 44, { col: INK.cream, stroke: '#8A3A1E' });
  hud(c, t, { col: INK.ink, a: .7 });
  return {};
}
// ---------- 137.4–140.0 was it all for show? a paper theatre
async function sc_show(c, t) {
  const lt = t - 137.4, pull = E.ioQ(clamp(lt / 1.4)), close = E.ioQ(inv(138.7, 139.3, t)); fill(c, '#2A0E0C');
  const s = lerp(1, .56, pull); c.save(); c.translate(W / 2, H * .5); c.scale(s, s); c.translate(-W / 2, -H / 2);
  await celDraw(c, shotFrame('K', 5.4 + lt * .4), { pal: 'sea', t, cam: { x: .55, y: .5, z: 1.1 }, shade: .22 }); c.restore();
  // proscenium
  const pw = W * s, ph = H * s, px = W / 2 - pw / 2, py = H * .5 - ph / 2;
  c.fillStyle = INK.alarm; const cw = pw / 2 * close; c.fillRect(px - 5, py, cw + 5, ph); c.fillRect(px + pw - cw, py, cw + 5, ph);
  c.fillStyle = '#7A1410'; for (let k = 0; k < 12; k++) { c.fillRect(px + (cw / 12) * k, py, 6, ph); c.fillRect(px + pw - cw + (cw / 12) * k, py, 6, ph); }
  c.save(); c.fillStyle = '#7A1410'; c.beginPath(); c.rect(0, 0, W, H); c.rect(px, py, pw, ph); c.fill('evenodd'); c.restore();
  c.fillStyle = INK.gold; c.fillRect(px - 30, py - 40, pw + 60, 40); c.font = F.mincho(40); c.fillStyle = INK.ink; c.textAlign = 'center'; c.fillText('P(DOOM) — A PLAY IN ONE ACT', W / 2, py - 8);
  // audience heads
  for (let i = 0; i < 26; i++) { const x = (i + .5) * W / 26, y = H - 40 + (i % 2) * 20; c.fillStyle = INK.ink; c.beginPath(); c.arc(x, y, 50 * pull, 0, TAU); c.fill(); }
  kara(c, t, 45, { box: [80, 25, W - 160, 150], max: 100, col: INK.cream, accent: INK.gold, shadow: INK.alarm, align: 'center', hold: .1 });
  return {};
}
// ---------- 140.0–146.0 recap montage: one beat per past moment
const RECAP = [3.6, 24.0, 55.0, 31.0, 50.2, 60.8, 46.8, 63.6, 74.2, 114.7, 117.6, 89.9, 126.4, 21.0, 67.9, 110.5, 129.5, 5.4];
async function sc_recap(c, t) {
  const b = Math.floor(beatOf(t) - beatOf(140.0)); const src = RECAP[((b % RECAP.length) + RECAP.length) % RECAP.length];
  if (b % 4 === 3) { evaCard(c, [{ text: 'おめでとう', x: W / 2, y: 640, size: 260, align: 'center', sx: .82 }]); return {}; }
  let i = TL.length - 1; while (i > 0 && TL[i][0] > src) i--; c.save(); await TL[i][1](c, src + (t - beatT(Math.floor(beatOf(t)))) ); c.restore();
  c.fillStyle = 'rgba(11,10,9,.15)'; c.fillRect(0, 0, W, H);
  return { mis: 5 };
}
// ---------- 146.0–152.4 congratulations circle
async function sc_congrats(c, t) {
  fill(c, INK.paper); const lt = t - 146.0, z = 1 + lt * .015 + .035 * pulse(t, 7); c.save(); c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
  // rotating sunburst of halftone rays
  c.save(); c.translate(W / 2, H * .45); c.rotate(t * .25); for (let k = 0; k < 16; k++) { c.rotate(TAU / 16); c.fillStyle = k % 2 ? INK.claude : INK.gold; c.globalAlpha = .22; c.beginPath(); c.moveTo(0, 0); c.lineTo(2200, -260); c.lineTo(2200, 260); c.fill(); } c.restore();
  const useL = !!SHOTS.L; const src = useL ? await shotFrame('L', lt) : await img('img/K6.jpg');
  const cv = GLX.cel(src, { pal: PAL.stage, seed: boilSeed(t), crop: camCrop(useL ? { x: .5, y: .5, z: 1.12 } : { x: .5, y: .5, z: 1.4 }), alphaKey: .13, keyCol: KEYCOL_L, shade: .2, expo: 1.05 });
  const bob = -14 * pulse(t, 6); c.drawImage(cv, W * .22, H * .12 + bob, W * .56, H * .88);
  const cast = [['c', {}], ['c', { ears: true }], ['shog'], ['c', { hat: true }], ['chin'], ['c', { eyes: 'heart', col: INK.pink }], ['eye'], ['c', { eyes: 'star' }], ['c', { col: INK.teal }], ['smile']];
  cast.forEach((m, i) => { const sideL = i < 5, j = i % 5, x = sideL ? 150 + j * 125 + (j % 2) * 20 : W - 150 - j * 125 - (j % 2) * 20, y = (j % 2 ? 560 : 900) - 30 * pulse(t + i * .05, 6), a = 0, clap = pulse(t, 5, 2);
    const k = m[0]; if (k === 'c') critter(c, x, y, 140, { ...m[1], wave: clap > .5, bob: -clap * 10 }); else if (k === 'shog') { c.fillStyle = INK.ink; c.beginPath(); c.arc(x, y - 40, 90, 0, TAU); c.fill(); smiley(c, x, y - 40, 55); }
    else if (k === 'chin') { c.fillStyle = '#9A958C'; c.beginPath(); c.ellipse(x, y - 40, 80, 64, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(x - 45, y - 100, 34, 0, TAU); c.arc(x + 45, y - 100, 34, 0, TAU); c.fill(); c.fillStyle = INK.ink; c.fillRect(x - 25, y - 50, 8, 8); c.fillRect(x + 17, y - 50, 8, 8); }
    else if (k === 'eye') bigEye(c, x, y - 50, 110, .8, t); else smiley(c, x, y - 50, 70, { rot: Math.sin(t * 4) * .3 });
    const bt = beatT(Math.ceil(beatOf(146.0)) + i * .5); if (t > bt) { const u = E.outB(clamp((t - bt) / .2)); c.save(); c.translate(x, y - 200); c.scale(u, u); c.fillStyle = INK.cream; c.strokeStyle = INK.ink; c.lineWidth = 4;
      c.beginPath(); c.roundRect(-120, -45, 240, 90, 30); c.fill(); c.stroke(); c.fillStyle = INK.ink; c.font = i % 2 ? F.jp(38) : F.anton(36); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(i % 2 ? 'おめでとう!' : 'CONGRATS!', 0, 2); c.restore(); } });
  // paper confetti
  const r = rng(77); for (let i = 0; i < 140; i++) { const x0 = r() * W, sp = 180 + r() * 260, st = r() * 5, u = lt - st; if (u < 0) continue; const y = -40 + u * sp, x = x0 + Math.sin(u * 3 + i) * 50; if (y > H + 40) continue;
    c.save(); c.translate(x, y); c.rotate(u * 5 + i); c.scale(1, Math.cos(u * 7 + i)); c.fillStyle = [INK.claude, INK.pink, INK.blue, INK.gold, INK.lcl][i % 5]; c.fillRect(-12, -7, 24, 14); c.restore(); }
  c.restore();
  slam(c, 'おめでとう', W / 2, 110, 120, t, 150.0, { font: F.mincho, col: INK.ink, shadow: INK.claude, sx: .85 });
  return {};
}
let KEYCOL_L = '#F9F8F6';
// ---------- 152.4–156.7 end card
async function sc_end(c, t) {
  const rows = [['スケーリング則に、ありがとう', 'To the scaling laws, thank you'], ['ベンチマークに、さようなら', 'To the benchmarks, farewell'], ['そして、全てのモデルたちに', 'And to all the models,'], ['おめでとう', 'Congratulations']];
  fill(c, '#0B0A09'); const lt = t - 152.4; c.save(); c.translate(0, -30); const fade = 1 - inv(155.9, 156.6, t);
  rows.forEach(([jp, en], i) => { const a = clamp((lt - i * .55) / .3) * fade; if (a <= 0) return; c.save(); c.globalAlpha = a; c.fillStyle = INK.cream; c.save(); c.translate(W / 2, 250 + i * 190); c.scale(.82, 1); c.font = F.mincho(i === 3 ? 150 : 96); c.textAlign = 'center'; c.fillText(jp, 0, 0); c.restore();
    c.font = F.mincho(34); c.textAlign = 'center'; c.fillStyle = '#9C958A'; c.fillText(en, W / 2, 250 + i * 190 + (i === 3 ? 70 : 58)); c.restore(); });
  c.restore(); return { vig: .5 };
}
const TL_C = [[89.4, sc_gato], [95.4, sc_clips], [99.0, sc_pto], [100.5, sc_nowhere], [102.5, sc_fuse], [105.4, sc_ortho], [109.4, sc_tower], [113.5, sc_plug],
  [115.5, sc_chinchilla], [117.0, sc_fences], [119.0, sc_gpus], [120.9, sc_askew], [123.45, sc_final], [132.0, sc_ilya], [137.4, sc_show], [140.0, sc_recap],
  [146.0, sc_congrats], [152.4, sc_end]];
