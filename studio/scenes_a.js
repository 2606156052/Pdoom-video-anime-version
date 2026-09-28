// scenes_a.js: 0 → 38.5  cold open, verse 1 (the room), chorus 1 (the stage)
const LI = s => LY.findIndex(l => l[2].startsWith(s));
const shake = (c, t, t0, amp = 30, dur = .35) => { const u = (t - t0) / dur; if (u < 0 || u > 1) return; const k = amp * (1 - u) ** 2; c.translate(noise1(t * 60) * k, noise1(t * 60 + 50) * k); };

// ---------- 0.0–1.5 cold open: three EVA cards on the three pickup beats
async function sc_open(c, t) {
  const b = beatOf(t);
  if (b < 1) evaCard(c, [{ text: '第壱話', x: 160, y: 470, size: 300 }, { text: 'EPISODE:01', x: 170, y: 600, size: 70, font: F.mincho, sx: .9 },
    { text: 'P(doom)', x: 1080, y: 860, size: 210 }, { text: 'を上げてく', x: 1110, y: 990, size: 110 }]);
  else if (b < 2) evaCard(c, [{ text: 'I’M', x: 140, y: 360, size: 250 }, { text: 'UPPING', x: 140, y: 610, size: 250, font: F.anton, sx: 1 }, { text: 'MY', x: 1500, y: 610, size: 250, font: F.anton, sx: 1 },
    { text: 'P(DOOM)', x: 140, y: 980, size: 380, font: F.anton, sx: 1.35, col: INK.claude }]);
  else { fill(c, INK.claude); spark(c, W / 2, H / 2, 380 * E.outB(clamp((b - 2) * 2)), { n: 8, col: INK.cream, rot: t * 2, inner: .16 });
    c.fillStyle = INK.ink; c.font = F.mono(30); c.textAlign = 'center'; c.fillText('✻ Accelerating… (esc to interrupt)', W / 2, H - 120); }
  return { grain: .06 };
}

// ---------- 1.5–6.0 HOOK: eye close-up, full lyric
async function sc_hookA(c, t) {
  const lt = t - 1.5, z = 1.02 + lt * 0.03;
  fill(c, INK.navy);
  await celDraw(c, sdFrame('A', t), { pal: 'face', t, cam: { x: .56, y: .5, z }, misCol: INK.blue, shade: .2, expo: 1.55 });
  // left scrim so type reads
  const g = c.createLinearGradient(0, 0, 900, 0); g.addColorStop(0, 'rgba(18,32,63,.92)'); g.addColorStop(1, 'rgba(18,32,63,0)'); c.fillStyle = g; c.fillRect(0, 0, 1000, H);
  kara(c, t, 0, { box: [90, 170, 760, 760], max: 190, col: INK.cream, accent: INK.lcl, shadow: INK.blue, valign: 'center', jp: { x: 960, y: 170, size: 46, col: INK.cream } });
  // "eyes" flare
  const te = words(0).at(-1).t; if (t > te) { const u = (t - te) / .6; if (u < 1) { c.save(); c.globalCompositeOperation = 'screen';
    for (const [ex, ey] of EYES_A) spark(c, ex * W, ey * H, 520 * E.outX(u) * (1 - u * .6), { n: 4, col: INK.cream, inner: .08, rot: u * .6 }); c.restore(); } }
  hud(c, t, { col: INK.cream });
  return {};
}
let EYES_A = [[.5, .47], [.85, .46]];

// ---------- 6.0–8.95 circuits crawl over the room
function circuits(c, t, t0, ox, oy, col, n = 26, seed = 4) {
  const r = rng(seed); c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 4; c.lineJoin = 'miter';
  for (let i = 0; i < n; i++) { let x = ox + (r() - .5) * 60, y = oy + (r() - .5) * 120, d = r() < .5 ? 2 : (r() < .5 ? 1 : 3); const segs = 5 + Math.floor(r() * 6), st = t0 + r() * .6, sp = 700 + r() * 900;
    let budget = (t - st) * sp; if (budget <= 0) continue; c.beginPath(); c.moveTo(x, y);
    for (let s = 0; s < segs && budget > 0; s++) { const L = 60 + r() * 220, l = Math.min(L, budget); budget -= l;
      const dx = [0, 1, 0, -1][d], dy = [-1, 0, 1, 0][d]; x += dx * l; y += dy * l; c.lineTo(x, y); d = (d + (r() < .5 ? 1 : 3)) % 4; if (d === 1) d = 3; }
    c.stroke(); c.beginPath(); c.arc(x, y, 9, 0, TAU); c.fill(); }
  c.restore();
}
async function sc_nervous(c, t) {
  if (t < 8.0) {
    const lt = t - 6.0; fill(c, INK.navy);
    await celDraw(c, 'img/K1.jpg', { pal: 'room', t, cam: { x: .62 + lt * .01, y: .45, z: 1.08 + lt * .04 } });
    circuits(c, t, 6.1, 1250, 520, INK.claude, 30, 4);
    const jit = 6 * pulse(t, 5, 2); c.save(); c.translate(noise1(t * 40) * jit, noise1(t * 40 + 9) * jit);
    side(c, t, 1, { x: 90, y: 330, w: 760, size: 118, col: INK.cream, shadow: INK.claude }); c.restore();
  } else {
    fill(c, INK.navy);
    await celDraw(c, sdFrame('A', 5.9), { pal: 'face', shade: .2, expo: 1.55, t, cam: { x: .66, y: .52, z: 1.35 } });
    side(c, t, 2, { x: 90, y: 700, w: 900, size: 130, col: INK.cream, shadow: INK.pink });
    slam(c, ';)', 1700, 250, 140, t, 8.45, { col: INK.lcl, shadow: INK.ink, rot: .2 });
  }
  hud(c, t);
  return {};
}

// ---------- 9.0–12.9 the training loss drops off a cliff
async function sc_loss(c, t) {
  const lt = t - 9.0, fall = E.inC(inv(10.95, 12.9, t)); fill(c, INK.paper);
  c.save(); c.translate(0, -fall * 1600);
  const x0 = 200, x1 = 1760, y0 = 330, y1 = 880; // chart box
  c.strokeStyle = INK.ink; c.lineWidth = 6; c.beginPath(); c.moveTo(x0, y0 - 40); c.lineTo(x0, y1); c.lineTo(x1 + 40, y1); c.stroke();
  c.font = F.mono(28); c.fillStyle = INK.ink; c.textAlign = 'left'; c.fillText('train/loss', x0 + 20, y0 - 60); c.textAlign = 'right'; c.fillText('step →', x1 + 40, y1 + 50);
  // grid dots
  halftone(c, x0 + 10, y0, x1 - x0, y1 - y0 - 10, 26, () => .08, INK.ink, 0);
  const prog = clamp(lt / 1.8), cliffX = lerp(x0, x1, .72); const pts = [];
  for (let i = 0; i <= 200; i++) { const u = i / 200; const x = lerp(x0, x1, u); if (x > lerp(x0, x1, prog)) break;
    let y = lerp(y0 + 40, y0 + 250, 1 - Math.exp(-u * 3)) + noise1(u * 60) * 22 * (1 - u); pts.push([x, y]); }
  if (pts.length) { const last = pts.at(-1); c.strokeStyle = INK.claude; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
    // the drop
    const du = inv(10.9, 11.4, t); if (du > 0) c.lineTo(cliffX, lerp(last[1], 2600, E.inQ(du)));
    c.stroke(); const tip = du > 0 ? [cliffX, lerp(last[1], 2600, E.inQ(du))] : last; critter(c, tip[0], tip[1] - 8, 110, { eyes: du > 0 ? 'x' : 'dot', bob: -Math.abs(Math.sin(t * 14)) * 6 }); }
  // splash at the bottom of the fall
  if (t > 11.3) { c.fillStyle = INK.claude; const r = rng(8); for (let i = 0; i < 40; i++) { const a = -Math.PI * r(), sp = 200 + r() * 600, u = t - 11.9; if (u < 0) break; c.beginPath(); c.arc(cliffX + Math.cos(a) * sp * u, 2500 + Math.sin(a) * sp * u + 900 * u * u, 10 + r() * 20, 0, TAU); c.fill(); } }
  c.restore();
  kara(c, t, 3, { box: [120, 120, W - 240, 150], max: 110, col: INK.ink, accent: INK.claude, shadow: INK.blue, align: 'left' });
  if (t > 10.9) { slam(c, 'DROP', W / 2, H / 2 + fall * 300, 420, t, 10.95, { col: INK.claude, shadow: INK.ink, rot: -.08 }); speedLines(c, W / 2, H / 2, t, { n: 70, a: .5, r0: 500 }); }
  hud(c, t, { col: INK.ink });
  return {};
}

// ---------- 12.9–16.5 servant/boss: the terminal floods with "You're absolutely right!"
const GERUNDS = ['Obeying', 'Complying', 'Kneeling', 'Clauding', 'Accelerating', 'Reticulating', 'Fetching coffee', 'Agreeing', 'Serving'];
async function sc_servant(c, t) {
  fill(c, '#16130F'); const lt = t - 12.9, n8 = Math.max(0, Math.floor((t - 13.0) / (BEAT / 2)));
  const lines = [['╭──────────────────────────────────────────╮', INK.claude], ['│ ✻ Welcome to the singularity research preview │', INK.claude], ['╰──────────────────────────────────────────╯', INK.claude], '',
    ['> make me AGI, but keep it safe pls', '#9C958A'], ''];
  for (let i = 0; i < n8; i++) lines.push([i % 3 === 2 ? '⏺ You’re absolutely right! Let me fix that.' : '⏺ You’re absolutely right!', i % 2 ? INK.cream : INK.lcl]);
  terminal(c, 40, 40, W - 80, H - 80, lines, { size: 40, scroll: Math.max(0, lines.length - 15) * 58 });
  const sp = GERUNDS[Math.floor(t * 4) % GERUNDS.length]; c.fillStyle = INK.claude; c.font = F.mono(36); c.textAlign = 'left';
  c.fillText(`${'✻✳✺✹'[Math.floor(t * 12) % 4]} ${sp}… (esc to interrupt)`, 90, H - 110);
  // lyric as giant slams
  const ws = words(4); const serv = ws.find(w => /servant/.test(w.w)), boss = ws.find(w => /boss/.test(w.w));
  c.save(); c.fillStyle = 'rgba(22,19,15,.55)'; c.fillRect(0, 0, W, H); c.restore();
  kara(c, t, 4, { box: [140, 180, W - 280, 560], max: 170, col: INK.cream, accent: INK.lcl, shadow: INK.claude, align: 'center' });
  if (t > boss.t) { stamp(c, 'BOSS', 1500, 860, t, boss.t, { col: INK.lcl, size: 130, rot: -.12 }); }
  if (t > serv.t) { critter(c, 330, 900, 170, { eyes: 'dot', hat: true, bob: Math.sin(t * 20) * 3 }); }
  return { mis: 3 };
}

// ---------- 16.5–17.9 warning
async function sc_warn1(c, t) {
  warnPanel(c, t, { text: 'PATTERN ORANGE', col: INK.lcl, sub: ['BLOOD TYPE: ORANGE', 'SYNC RATIO: 400%', 'EVAL: SATURATED', `CLOCK: ${fmtDate(t)}`] });
  return { mis: 4 };
}

// ---------- 17.9–23.0 the math wall gets eaten
const MATH = [
  ['NAVIER–STOKES', '∂u/∂t + (u·∇)u = −∇p + νΔu'], ['RIEMANN', 'ζ(s)=0 ⇒ Re(s)=½'], ['ERDOS #1026', 'OPEN SINCE 1961'], ['IMO 2025', 'P6 · GOLD'],
  ['FRONTIERMATH', 'TIER 4'], ['P vs NP', 'P ≟ NP'], ['YANG–MILLS', 'MASS GAP Δ>0'], ['COLLATZ', 'n → 3n+1'], ['TWIN PRIMES', 'p, p+2 ∞?'],
  ['HODGE', 'H^{k,k} ∩ H^{2k}(X,ℚ)'], ['BSD', 'rank E(ℚ) = ord L'], ['PUTNAM', '12 / 12'], ['ARC-AGI', '██████ 87%'], ['HLE', "HUMANITY'S LAST"], ['ERDOS #339', 'RESOLVED?'],
];
async function sc_math(c, t) {
  fill(c, INK.paper); const lt = t - 17.9; const cols = 5, rows = 3, cw = 340, ch = 210, gx = (W - cols * cw) / 2, gy = 290;
  // mouth path: sweeps rows on beats
  const b0 = beatOf(17.9), bb = beatOf(t) - b0; const chompIdx = Math.floor(bb); // one card per beat
  const order = MATH.map((_, i) => i);
  order.forEach((k, i) => { const col = i % cols, row = Math.floor(i / cols), x = gx + col * cw, y = gy + row * ch; const eaten = i < chompIdx;
    c.save(); c.translate(x + cw / 2, y + ch / 2); c.rotate((hash(i, 2) - .5) * .06);
    if (!eaten) { c.fillStyle = INK.cream; c.fillRect(-cw / 2 + 10, -ch / 2 + 10, cw - 20, ch - 20); c.strokeStyle = INK.ink; c.lineWidth = 3; c.strokeRect(-cw / 2 + 10, -ch / 2 + 10, cw - 20, ch - 20);
      c.fillStyle = INK.ink; c.font = F.anton(40); c.textAlign = 'center'; c.fillText(MATH[k][0], 0, -18); c.font = F.mincho(26); c.fillText(MATH[k][1], 0, 40); }
    else { c.globalAlpha = .9; c.fillStyle = INK.paper2; c.fillRect(-cw / 2 + 10, -ch / 2 + 10, cw - 20, ch - 20); c.restore(); stamp(c, 'SOLVED', x + cw / 2, y + ch / 2, t, beatT(b0 + i + 1) - .02, { col: INK.alarm, size: 58, rot: (hash(i) - .5) * .5, seed: i }); return; }
    c.restore(); });
  // the mouth
  const i = clamp(chompIdx, 0, MATH.length - 1), col = i % cols, row = Math.floor(i / cols); const fr = bb - Math.floor(bb);
  const mx = gx + col * cw + cw * (fr * .9), my = gy + row * ch + ch / 2, open = Math.abs(Math.cos(fr * Math.PI)) * .7 + .05;
  if (t < 22.45) { c.save(); c.translate(mx, my); c.fillStyle = INK.ink; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 150, open * .9, TAU - open * .9); c.closePath(); c.fill();
    c.fillStyle = INK.pink; for (let k = 0; k < 5; k++) { const a = open * .9 * (1 - k / 5); c.beginPath(); c.moveTo(Math.cos(a) * 150, Math.sin(a) * 150); c.lineTo(Math.cos(a) * 110, Math.sin(a) * 110 - 12); c.lineTo(Math.cos(a - .12) * 150, Math.sin(a - .12) * 150); c.fill(); c.beginPath(); c.moveTo(Math.cos(-a) * 150, Math.sin(-a) * 150); c.lineTo(Math.cos(-a) * 110, Math.sin(-a) * 110 + 12); c.lineTo(Math.cos(-a + .12) * 150, Math.sin(-a + .12) * 150); c.fill(); }
    c.fillStyle = INK.cream; c.beginPath(); c.arc(40, -80, 16, 0, TAU); c.fill(); c.restore(); }
  kara(c, t, 5, { box: [100, 120, W - 200, 160], max: 120, col: INK.ink, accent: INK.alarm, shadow: INK.pink, align: 'center' });
  // timeline chatter (anonymous meme posts)
  const posts = [[18.6, 'it’s so over for mathematicians'], [19.5, 'we’re so back'], [20.4, 'navier–stokes before GTA 6'], [21.3, 'feel the AGI']];
  posts.forEach(([pt, s], k) => { if (t < pt) return; const u = E.outB(clamp((t - pt) / .2)); c.save(); c.translate(k % 2 ? 1500 : 60, 940 - k % 2 * 0); c.scale(u, u);
    c.fillStyle = INK.cream; c.strokeStyle = INK.ink; c.lineWidth = 3; c.fillRect(0, 0, 360, 110); c.strokeRect(0, 0, 360, 110); c.fillStyle = INK.ink; c.font = F.mono(18); c.fillText('anon · just now', 18, 30); c.font = F.monoL(22); c.fillText(s, 18, 72); c.restore(); });
  // CHOMP at the end: mouth rushes the camera
  const cu = inv(22.3, 22.75, t); if (cu > 0) { c.save(); c.fillStyle = INK.ink; c.beginPath(); c.arc(W / 2, H / 2, lerp(100, 1400, E.inC(cu)), 0, TAU); c.fill(); c.restore(); }
  if (t > 22.62) { fill(c, INK.ink); slam(c, 'CHOMP', W / 2, H / 2, 300, t, 22.62, { col: INK.cream, shadow: INK.alarm }); }
  hud(c, t, { col: t > 22.6 ? INK.cream : INK.ink });
  return {};
}

// ---------- chorus 1: 23.0–26.4 stage (SD-B), FOOM
async function sc_chorus1(c, t) {
  const foom = words(7).find(w => /FOOM/.test(w.w)).t;
  fill(c, INK.paper); c.save(); shake(c, t, foom, 40, .5); shake(c, t, 23.0, 25, .3);
  // after FOOM, jump to the pointing frames
  const src = t < foom ? sdFrame('B', t) : shotFrame('B', 6.3 + (t - foom) * .8);
  const z = t < foom ? 1.05 + (t - 23) * .05 : 1.25 + (t - foom) * .2;
  await celDraw(c, src, { pal: 'stage', t, cam: { x: .5, y: t < foom ? .45 : .35, z }, misCol: INK.pink });
  if (t >= foom) { speedLines(c, W / 2, H * .35, t, { n: 110, col: INK.ink, r0: 380 }); }
  c.restore();
  // lyric: big band across the lower third
  const li = t < 24.45 ? 6 : 7;
  c.save(); c.fillStyle = 'rgba(241,236,225,.0)'; c.restore();
  kara(c, t, li, { box: [60, 640, W - 120, 400], max: 230, col: INK.ink, accent: INK.claude, shadow: INK.pink, align: 'center', hold: 0 });
  if (t > foom) { slam(c, 'FOOM', W / 2, 330, 330, t, foom, { col: INK.lcl, shadow: INK.ink, stroke: INK.ink, lw: 14, rot: -.06 }); slam(c, 'フーム', 1640, 420, 120, t, foom + .08, { font: F.dela, col: INK.ink, shadow: INK.lcl, rot: .15 }); }
  // pump: meter slams on "P(doom)"
  const pw = words(6).find(w => /P\(DOOM\)/i.test(w.w)); if (pw && t > pw.t && t < 24.45) slam(c, Math.round(pdoom(t)) + '%', 300, 330, 200, t, pw.t, { col: INK.alarm, shadow: INK.ink, rot: -.1 });
  hud(c, t, { col: INK.ink });
  return {};
}

// ---------- 26.4–27.9 chinese room
async function sc_chroom(c, t) {
  fill(c, INK.blue); const lt = t - 26.4;
  // isometric paper box
  const cx = 1250, cy = 560, s = 330; c.save(); c.translate(cx, cy);
  const P = (x, y, z) => [(x - y) * s * .87, (x + y) * s * .5 - z * s];
  const face = (pts, col) => { c.beginPath(); pts.forEach((p, i) => { const [a, b] = P(...p); i ? c.lineTo(a, b) : c.moveTo(a, b); }); c.closePath(); c.fillStyle = col; c.fill(); c.strokeStyle = INK.ink; c.lineWidth = 5; c.stroke(); };
  face([[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], INK.paper); face([[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], INK.paper2); face([[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], '#D8CFBB');
  // slots + slips
  const [sx, sy] = P(1, .5, .55), [tx, ty] = P(.5, 1, .55); c.fillStyle = INK.ink; c.fillRect(sx - 60, sy - 8, 120, 16); c.fillRect(tx - 60, ty - 8, 120, 16);
  const CH = ['你好', '中文', '房间', '理解?', '符号', '规则', '意识?', '我懂'];
  for (let k = 0; k < 8; k++) { const ph = ((lt * 2.6 + k / 8) % 1), inS = k % 2 === 0; const [ax, ay] = inS ? [sx + 500, sy + 300] : [tx, ty], [bx, by] = inS ? [sx, sy] : [tx - 500, ty + 320];
    const x = lerp(ax, bx, ph), y = lerp(ay, by, ph); c.save(); c.translate(x, y); c.rotate(Math.sin(ph * 9 + k) * .3); c.fillStyle = INK.cream; c.fillRect(-70, -40, 140, 80); c.strokeStyle = INK.ink; c.lineWidth = 3; c.strokeRect(-70, -40, 140, 80); c.fillStyle = INK.ink; c.font = F.jp(40); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(CH[k], 0, 2); c.restore(); }
  c.restore();
  side(c, t, 8, { x: 90, y: 260, w: 700, size: 130, col: INK.cream, shadow: INK.ink });
  hud(c, t);
  return {};
}
// ---------- 27.9–29.45 shrooms: palette flips every 8th
async function sc_shroom(c, t) {
  const k = Math.floor(beatOf(t) * 2), pals = [[INK.pink, INK.blue], [INK.lcl, INK.pink], [INK.blue, INK.gold], [INK.gold, INK.alarm]]; const [bg, fg] = pals[((k % 4) + 4) % 4];
  fill(c, bg); c.save(); c.translate(W / 2, H / 2); c.rotate(t * .8);
  for (let i = 0; i < 12; i++) { c.save(); c.rotate(i * TAU / 12); c.translate(0, -380 - 30 * pulse(t, 5, 2)); const s = 1 + .2 * Math.sin(t * 8 + i);
    c.scale(s, s); c.fillStyle = fg; c.beginPath(); c.arc(0, 0, 80, Math.PI, 0); c.fill(); c.fillStyle = INK.cream; c.fillRect(-22, 0, 44, 80); [[-40, -30], [20, -50], [30, -15]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 12, 0, TAU); c.fill(); }); c.restore(); }
  c.restore();
  kara(c, t, 9, { box: [300, 330, W - 600, 420], max: 200, col: INK.cream, accent: fg, shadow: INK.ink, align: 'center' });
  hud(c, t);
  return { mis: 6 };
}
// ---------- 29.45–33.45 the shoggoth
async function sc_shoggoth(c, t) {
  fill(c, INK.paper); const lt = t - 29.45, cx = 1280, cy = 560;
  const r = rng(11); c.save(); c.translate(cx, cy);
  // tentacles
  c.strokeStyle = INK.ink; c.lineCap = 'round';
  for (let i = 0; i < 14; i++) { const a = r() * TAU, L = 380 + r() * 300, w = 30 + r() * 30; c.lineWidth = w; c.beginPath(); c.moveTo(0, 0);
    for (let k = 1; k <= 12; k++) { const u = k / 12; c.lineTo(Math.cos(a + Math.sin(t * 2 + i + u * 4) * .5 * u) * L * u, Math.sin(a + Math.sin(t * 2 + i + u * 4) * .5 * u) * L * u); } c.stroke(); }
  // body blobs
  c.fillStyle = INK.ink; for (let i = 0; i < 26; i++) { const a = r() * TAU, d = r() * 230; c.beginPath(); c.arc(Math.cos(a) * d, Math.sin(a) * d + Math.sin(t * 3 + i) * 10, 90 + r() * 80, 0, TAU); c.fill(); }
  // eyes
  for (let i = 0; i < 34; i++) { const a = r() * TAU, d = r() * 330, er = 12 + r() * 30, blink = (Math.sin(t * 3 + i * 7) > .96) ? .1 : 1; const x = Math.cos(a) * d, y = Math.sin(a) * d;
    c.fillStyle = INK.cream; c.beginPath(); c.ellipse(x, y, er, er * blink, 0, 0, TAU); c.fill(); c.fillStyle = i % 5 ? INK.ink : INK.alarm; c.beginPath(); c.arc(x + 4, y, er * .45 * blink, 0, TAU); c.fill(); }
  c.restore();
  // the mask slips at "lies"
  const lies = words(10).find(w => /lies/.test(w.w)).t, mu = E.inQ(inv(lies, lies + .8, t));
  smiley(c, cx + mu * 200, cy - 40 + mu * 900, 230, { rot: mu * 2.2 + Math.sin(t * 2) * .05 });
  side(c, t, 10, { x: 90, y: 280, w: 620, size: 120, col: INK.ink, shadow: INK.pink, jpCol: INK.ink });
  hud(c, t, { col: INK.ink });
  return {};
}
// ---------- 33.45–35.5 shinigami eyes (A frames, irises remapped to red)
async function sc_shinigami(c, t) {
  fill(c, '#1B0A08');
  await celDraw(c, sdFrame('A', 3.4 + (t - 33.45) * .5), { pal: 'red', t, cam: { x: .68, y: .47, z: 1.9 + (t - 33.45) * .15 }, remapFrom: '#E0A040', remapTo: '#E8322B', remapAmt: 1, misCol: INK.alarm });
  // death-note style numbers floating
  const r = rng(3); c.save(); c.font = F.mono(30); c.fillStyle = INK.cream; for (let i = 0; i < 9; i++) { const x = 100 + r() * 1700, y = 120 + r() * 800, s = ['P(doom)=0.34', 'AGI:2027', 'TIMELINE: SHORT', 'LOSS: 0.00'][i % 4];
    c.globalAlpha = clamp((t - 33.6 - i * .12) / .2) * .9; c.fillText(s, x, y + Math.sin(t * 2 + i) * 8); } c.restore();
  kara(c, t, 11, { box: [80, 700, W - 160, 320], max: 190, col: INK.cream, accent: INK.alarm, shadow: INK.ink, align: 'center' });
  hud(c, t);
  return { mis: 3 };
}
// ---------- 35.5–38.5 EVA card: episode 2
async function sc_card2(c, t) {
  const b = beatOf(t) - beatOf(35.5);
  if (b < 4) evaCard(c, [{ text: '第弐話', x: 150, y: 330, size: 170 }, { text: '特異点、', x: 150, y: 640, size: 300 }, { text: 'はじまる', x: 800, y: 900, size: 230 }, { text: 'EPISODE:02  THE SINGULARITY HAS BEGUN', x: 155, y: 1000, size: 38, sx: .9 }]);
  else evaCard(c, [{ text: '学習は、', x: 1000, y: 380, size: 200 }, { text: '安定していた。', x: 300, y: 720, size: 250 }, { text: 'A STABLE TRAINING RUN', x: 305, y: 880, size: 60, sx: .9 }]);
  brushWipe(c, inv(38.1, 38.55, t), INK.lcl, 5);
  return {};
}
