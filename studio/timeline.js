// timeline.js: [start, sceneFn]. Each scene runs until the next one starts.
const TL = [
  [0.0, sc_open], [1.5, sc_hookA], [6.0, sc_nervous], [9.0, sc_loss], [12.9, sc_servant], [16.5, sc_warn1], [17.9, sc_math],
  [23.0, sc_chorus1], [26.4, sc_chroom], [27.9, sc_shroom], [29.45, sc_shoggoth], [33.45, sc_shinigami], [35.5, sc_card2],
  ...(typeof TL_B !== 'undefined' ? TL_B : []), ...(typeof TL_C !== 'undefined' ? TL_C : []),
].sort((a, b) => a[0] - b[0]);
async function drawTimeline(c, t) {
  let i = TL.length - 1; while (i > 0 && TL[i][0] > t) i--;
  c.save(); const o = await TL[i][1](c, t); c.restore();
  return o;
}
