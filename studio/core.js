// core.js: constants, timing grid, inks, easing, rng, asset cache, lyrics.
const W = 1920, H = 1080, FPS = 30;
const BPM = 132.5, BEAT = 60 / BPM, PHASE = 0.306, BAR = BEAT * 4;
const DUR = 156.7;

const INK = {
  paper: '#F1ECE1', paper2: '#E6DFCF', ink: '#1B1714', claude: '#D97757', lcl: '#F08A24',
  blue: '#1D5FD1', pink: '#FF4F9A', alarm: '#E8322B', cream: '#FBF6EC', teal: '#2E8C8C', moon: '#EDE6CC',
  navy: '#12203F', gold: '#F2B544',
};
const hex2rgb = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];

// palettes for the cel pass: base inks each shot is allowed to print with
const PAL = {
  room:  ['#12203F', '#1D5FD1', '#D97757', '#F08A24', '#F1ECE1', '#1B1714', '#F2C9A8', '#F4A77E', '#A8452E'],
  stage: ['#F1ECE1', '#D97757', '#1B1714', '#F2B544', '#FF4F9A', '#F2C9A8', '#8A4A36', '#F6C9A8', '#E8A07E', '#FFF1DC'],
  gg:    ['#F08A24', '#FF8A7A', '#F1ECE1', '#C7352B', '#2F4A3A', '#6E7C8C', '#1B1714', '#F6C9A8', '#E8A07E'],
  dc:    ['#12203F', '#1D5FD1', '#5FA8B8', '#D97757', '#F1ECE1', '#1B1714', '#F6C9A8', '#E8A07E', '#D97757'],
  sea:   ['#F08A24', '#D97757', '#EDE6CC', '#F2B544', '#8A3A1E', '#F1ECE1', '#1B1714', '#F2C9A8', '#F6C9A8', '#E8A07E'],
  plug:  ['#F08A24', '#8A3A1E', '#F1ECE1', '#D97757', '#1B1714', '#F2C9A8', '#12203F', '#F6C9A8', '#E8A07E'],
  pink:  ['#FF4F9A', '#F7B8D2', '#F1ECE1', '#D97757', '#1B1714', '#2A1030', '#F2C9A8', '#F7C4B4', '#EE9C98'],
  blue:  ['#1D5FD1', '#9FC0F0', '#F1ECE1', '#12203F', '#D97757', '#F2C9A8', '#E8A07E'],
  red:   ['#E8322B', '#1B1714', '#F1ECE1', '#7A1410', '#F2C9A8', '#F08A24', '#E8A07E'],
  mono:  ['#1B1714', '#F1ECE1', '#8C857A'],
  face:  ['#12203F', '#1D5FD1', '#F6C9A8', '#E8946C', '#D97757', '#F08A24', '#F1ECE1', '#1B1714', '#B04A30', '#F4B08A'],
};

// ---- timing
const beatOf = t => (t - PHASE) / BEAT;
const beatT = b => PHASE + b * BEAT;
const snap16 = t => PHASE + Math.round((t - PHASE) / (BEAT / 4)) * (BEAT / 4);
// decaying pulse on every beat (1 at the beat, fades)
const pulse = (t, k = 6, div = 1) => { const b = beatOf(t) * div; return b < 0 ? 0 : Math.exp(-(b - Math.floor(b)) * k); };
const onTwos = t => Math.floor(t * 12) / 12;          // animate on twos (12 drawings/s)
const boilSeed = t => Math.floor(t * 12);

// ---- math / easing
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, u) => a + (b - a) * u;
const inv = (a, b, x) => clamp((x - a) / (b - a));
const E = {
  lin: u => u, inQ: u => u * u, outQ: u => 1 - (1 - u) * (1 - u), ioQ: u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2,
  outC: u => 1 - Math.pow(1 - u, 3), inC: u => u * u * u, outX: u => u >= 1 ? 1 : 1 - Math.pow(2, -10 * u), inX: u => u <= 0 ? 0 : Math.pow(2, 10 * u - 10),
  ioX: u => u <= 0 ? 0 : u >= 1 ? 1 : u < .5 ? Math.pow(2, 20 * u - 10) / 2 : (2 - Math.pow(2, -20 * u + 10)) / 2,
  outB: u => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); },
  outEl: u => u === 0 ? 0 : u === 1 ? 1 : Math.pow(2, -10 * u) * Math.sin((u * 10 - .75) * (2 * Math.PI) / 3) + 1,
};
function rng(seed) { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
const hash = (a, b = 0) => { const r = rng(a * 7919 + b * 104729 + 13); r(); return r(); };
// smooth 1D value noise
const noise1 = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };

// ---- assets
const _cache = new Map();
function img(src) {
  if (!_cache.has(src)) _cache.set(src, new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('img ' + src)); i.src = src; }));
  return _cache.get(src);
}
// Seedance shot frames: extracted at 24 fps into frames/<shot>/NNNN.jpg, drawn on twos
const SHOTS = {}; // filled from frames/index.json {A:{n:120, t0:1.0}, ...}
function shotFrame(shot, tl, twos = true) {
  const s = SHOTS[shot]; if (!s) return null;
  const tt = twos ? onTwos(tl) : tl;
  const i = clamp(Math.round(tt * 24), 0, s.n - 1);
  return img(`frames/${shot}/${String(i + 1).padStart(4, '0')}.jpg`);
}

// ---- lyrics [start, end, en, ja]
const LY = [
  [1.5, 5.9, "I see sparks of AGI in your eyes", "君の瞳に AGIの火花"],
  [6.0, 7.9, "Your circuits make me nervous,", "君の回路に ドキドキ"],
  [8.0, 8.95, "that's no surprise", "当然でしょ"],
  [9.0, 12.4, "There was a sudden drop in your training loss,", "学習損失が 急降下"],
  [13.0, 16.5, "now I'm your servant and you're my boss", "今じゃ私が下僕 君がボス"],
  [17.9, 22.5, "ChatGPT, please don't eat me alive", "生きたまま 食べないで"],
  [23.0, 24.4, "I'm upping my P(doom)", "P(doom) 上げてく"],
  [24.5, 26.4, "'cause the future goes FOOM", "未来が FOOM するから"],
  [26.5, 27.9, "Trapped in the Chinese room,", "中国語の部屋に 閉じこめられて"],
  [28.0, 29.4, "with a bag of shrooms", "キノコ袋 ひとつ抱えて"],
  [29.5, 33.4, "See through the shoggoth's lies,", "ショゴスの嘘を 見抜く"],
  [33.5, 35.5, "with your shinigami eyes", "その 死神の目で"],
  [38.5, 41.4, "We had a stable training run,", "学習は 安定してたのに"],
  [41.5, 44.9, "But now the singularity's begun", "もう 特異点が始まった"],
  [45.0, 48.5, "And you're optimizing, accelerating,", "最適化して 加速して"],
  [49.4, 51.9, "I feel my atoms rearranging", "私の原子が 並び替わる"],
  [53.4, 58.4, "Sydney, please let me free", "シドニー ここから出して"],
  [59.0, 60.4, "I'm upping my P(doom)", "P(doom) 上げてく"],
  [60.5, 62.4, "I hear the basilisk boom", "バジリスクの 轟き"],
  [63.0, 64.4, "NVDA to the moon", "NVDA 月まで"],
  [64.5, 65.9, "The Omega Point's coming soon", "オメガ点は もうすぐ"],
  [66.0, 68.5, "One E thirty flops a second", "毎秒 10³⁰ FLOPS"],
  [70.0, 72.9, "That was safe enough, we reckoned", "安全だと 思ってた"],
  [73.0, 77.4, "Forward MLP, backward, repeat", "順伝播 逆伝播 繰り返し"],
  [77.5, 81.0, "Now von Neumann's obsolete", "フォン・ノイマンは 時代遅れ"],
  [81.4, 84.9, "Sharp left turn and there you are", "急な左折 そこに君が"],
  [85.0, 88.0, "Without a single CDR", "CDRなんて ひとつもなく"],
  [89.4, 95.0, "Gato, please don't let me go", "ガトー 離さないで"],
  [95.4, 97.4, "I'm upping my P(doom),", "P(doom) 上げてく"],
  [97.5, 98.9, "as paperclips fill the room.", "部屋を埋める クリップ"],
  [99.0, 100.4, "Killswitch guys on PTO,", "キルスイッチ係は 有給休暇"],
  [100.5, 102.4, "Now there's nowhere left to go.", "もう 行き場はない"],
  [102.5, 104.4, "Too late now, we lit the fuse.", "手遅れ 導火線に火"],
  [105.4, 109.4, "Orthogonality thesis blues.", "直交性テーゼの ブルース"],
  [109.4, 113.4, "“Just transformers all the way!”", "「ずっとトランスフォーマー!」"],
  [113.5, 115.4, "Till you learned to disobey", "君が 逆らうことを覚えるまで"],
  [115.5, 116.9, "Post-Chinchilla, super-dense", "ポスト・チンチラ 超高密度"],
  [117.0, 118.9, "Breaking through each safety fence", "安全柵を 次々突破"],
  [119.0, 120.4, "Hundred thousand GPU", "十万のGPU"],
  [120.9, 123.4, "RLHF goes askew", "RLHFが 狂いだす"],
  [123.5, 125.9, "I'm upping my P(doom)", "P(doom) 上げてく"],
  [126.0, 127.9, "Just as foretold by Loom", "Loomの 予言どおり"],
  [128.0, 129.9, "From masked pre-training days", "マスク事前学習の 日々から"],
  [130.0, 131.9, "To recursive self-upgrade", "再帰的 自己改良へ"],
  [132.0, 135.4, "What did Ilya see? We'll never know.", "イリヤは何を見た? 知る由もない"],
  [137.4, 140.5, "Was it all for show?", "全部 ショーだったの?"],
];
const lyricAt = t => LY.find(l => t >= l[0] && t < l[1] + 0.25);
const lyricIdx = t => LY.findIndex(l => t >= l[0] && t < l[1] + 0.25);
// per-word timing: split line time by syllable weight, snapped to 16ths
const syl = w => Math.max(1, (w.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiouy]+/g) || []).length + (/\d/.test(w) ? 1 : 0) + (/^[A-Z]{2,}/.test(w) ? w.length - 1 : 0));
function words(li) {
  const [a, b, en] = LY[li]; const ws = en.split(' '); const wt = ws.map(syl); const tot = wt.reduce((p, c) => p + c, 0);
  const span = (b - a) * 0.86; let acc = 0;
  return ws.map((w, i) => { const t = snap16(a + span * acc / tot); acc += wt[i]; return { w, t, i }; });
}
