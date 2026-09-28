// type.js: lyric typography. Three registers: FULL (slam karaoke), SIDE (block), SUB (subtitle) + vertical JP.
const _lay = new Map();
function layoutWords(c, li, box, font, maxSize, upper = true) {
  const key = li + '|' + box.join(',') + '|' + maxSize + font(1);
  if (_lay.has(key)) return _lay.get(key);
  const ws = words(li).map(w => ({ ...w, s: upper ? w.w.toUpperCase() : w.w }));
  const [bx, by, bw, bh] = box; let res = null;
  for (let size = maxSize; size > 30; size -= 6) {
    c.font = font(size); const sp = size * .22, lh = size * .98; const lines = [[]]; let lw = 0;
    for (const w of ws) { const ww = c.measureText(w.s).width; if (lw > 0 && lw + sp + ww > bw) { lines.push([]); lw = 0; } lines.at(-1).push({ ...w, ww, x: lw }); lw += (lw > 0 ? sp : 0) + ww; if (lines.at(-1).length > 1) lines.at(-1).at(-1).x += sp; }
    // fix x accumulation
    for (const L of lines) { let x = 0; for (const w of L) { w.x = x; x += w.ww + sp; } L.w = x - sp; }
    if (lines.length * lh <= bh) { res = { size, lh, lines }; break; }
  }
  if (!res) { res = { size: 30, lh: 30, lines: [ws.map((w, i) => ({ ...w, ww: 0, x: i * 40 }))] }; }
  _lay.set(key, res); return res;
}
// FULL: words slam in on their beat. o: box, font, max, align, col, accent, shadow, jp:{x,y,size,col}, upper
function kara(c, t, li, o = {}) {
  if (li < 0) return; const box = o.box || [120, 200, W - 240, H - 400], font = o.font || F.anton;
  const L = layoutWords(c, li, box, font, o.max || 260, o.upper ?? true); const [bx, by, bw, bh] = box;
  const tot = L.lines.length * L.lh; let y0 = by + (o.valign === 'top' ? 0 : o.valign === 'bottom' ? bh - tot : (bh - tot) / 2);
  const end = LY[li][1] + (o.hold ?? 0.2), outU = clamp((t - end) / 0.18);
  c.save(); c.font = font(L.size); c.textBaseline = 'top'; c.textAlign = 'left';
  L.lines.forEach((line, j) => {
    const lx = o.align === 'center' ? bx + (bw - line.w) / 2 : o.align === 'right' ? bx + bw - line.w : bx;
    for (const w of line) {
      if (t < w.t - 0.02) continue; const u = clamp((t - w.t) / 0.14), s = lerp(o.pop ?? 1.45, 1, E.outB(u));
      const next = words(li)[w.i + 1], active = t < (next ? next.t : LY[li][1]);
      const x = lx + w.x, y = y0 + j * L.lh; c.save(); c.translate(x + w.ww / 2, y + L.size / 2);
      c.scale(s, s); c.rotate((1 - u) * (hash(w.i, li) - .5) * .25); c.translate(0, -outU * 40 * (j + 1)); c.globalAlpha = (1 - outU) * clamp(u * 3);
      if (o.shadow !== false) { c.fillStyle = o.shadow || INK.pink; c.fillText(w.s, -w.ww / 2 + L.size * .045, -L.size / 2 + L.size * .045); }
      c.fillStyle = active ? (o.accent || INK.claude) : (o.col || INK.ink); c.fillText(w.s, -w.ww / 2, -L.size / 2); c.restore();
    }
  });
  c.restore();
  if (o.jp) vjp(c, LY[li][3], o.jp.x, o.jp.y, o.jp.size || 54, o.jp.col || o.col || INK.ink, clamp((t - LY[li][0]) / 0.5) * (1 - outU));
}
// vertical Japanese text, revealed top-down
function vjp(c, text, x, y, size, col, reveal = 1) {
  c.save(); c.font = F.jp(size); c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle';
  const ch = [...text]; const n = Math.ceil(ch.length * clamp(reveal)); let yy = y;
  for (let i = 0; i < n; i++) { const k = ch[i]; if (k === ' ') { yy += size * .5; continue; }
    const rot = /[A-Za-z0-9()%.\-]/.test(k) || 'ー'.includes(k); c.save(); c.translate(x, yy + size / 2); if (rot) c.rotate(Math.PI / 2); c.fillText(k, 0, 0); c.restore(); yy += size * (rot ? .72 : 1.02); }
  c.restore();
}
// SIDE: block of text left/right, words wipe in. o: x,y,w,size,col,accent,align
function side(c, t, li, o = {}) {
  if (li < 0) return; const size = o.size || 96, box = [o.x ?? 110, o.y ?? 300, o.w ?? 820, H];
  const L = layoutWords(c, li, box, o.font || F.anton, size, o.upper ?? true); const end = LY[li][1] + (o.hold ?? .15), outU = clamp((t - end) / .2);
  c.save(); c.font = (o.font || F.anton)(L.size); c.textBaseline = 'top'; c.textAlign = 'left';
  L.lines.forEach((line, j) => line.forEach(w => {
    if (t < w.t) return; const u = E.outC(clamp((t - w.t) / .16)); const x = box[0] + w.x + (o.align === 'right' ? box[2] - line.w : 0), y = box[1] + j * L.lh;
    c.save(); c.beginPath(); c.rect(x - 10, y - 10, (w.ww + 20) * u, L.size * 1.2); c.clip(); c.globalAlpha = 1 - outU;
    c.fillStyle = o.shadow || INK.blue; c.fillText(w.s, x + 5, y + 5 + outU * 30); c.fillStyle = o.col || INK.cream; c.fillText(w.s, x, y + outU * 30); c.restore();
  }));
  c.restore();
  if (o.jp !== false) { const jy = box[1] + L.lines.length * L.lh + 20; c.save(); c.globalAlpha = clamp((t - LY[li][0]) / .4) * (1 - outU); c.font = F.jp(o.jpSize || 40); c.fillStyle = o.jpCol || o.col || INK.cream; c.textBaseline = 'top';
    c.textAlign = o.align === 'right' ? 'right' : 'left'; c.fillText(LY[li][3], o.align === 'right' ? box[0] + box[2] : box[0], jy); c.restore(); }
}
// SUB: anime subtitle (JP above EN), bottom centre
function sub(c, t, li, o = {}) {
  if (li < 0) return; const a = clamp((t - LY[li][0]) / .15) * (1 - clamp((t - LY[li][1] - .2) / .2)); if (a <= 0) return;
  const y = o.y || H - 110; c.save(); c.globalAlpha = a; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
  c.font = F.jp(o.jpSize || 44); c.lineWidth = 10; c.strokeStyle = o.stroke || INK.ink; c.strokeText(LY[li][3], W / 2, y - 64); c.fillStyle = o.col || INK.cream; c.fillText(LY[li][3], W / 2, y - 64);
  c.font = F.mincho(o.size || 46); c.strokeText(LY[li][2], W / 2, y); c.fillText(LY[li][2], W / 2, y); c.restore();
}
// single slam word
function slam(c, text, x, y, size, t, t0, o = {}) {
  if (t < t0 || (o.t1 && t > o.t1)) return; const u = clamp((t - t0) / (o.dur || .12)), s = lerp(o.from ?? 2.2, 1, E.outB(u)) * (o.breath ? 1 + .03 * Math.sin((t - t0) * 9) : 1);
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(s * (o.sx || 1), s); c.font = (o.font || F.anton)(size); c.textAlign = o.align || 'center'; c.textBaseline = 'middle'; c.globalAlpha = clamp(u * 2) * (o.a ?? 1);
  if (o.shadow !== false) { c.fillStyle = o.shadow || INK.pink; c.fillText(text, size * .05, size * .05); }
  if (o.stroke) { c.lineWidth = o.lw || size * .08; c.strokeStyle = o.stroke; c.lineJoin = 'round'; c.strokeText(text, 0, 0); }
  c.fillStyle = o.col || INK.ink; c.fillText(text, 0, 0); c.restore();
}
