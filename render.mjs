// render.mjs  --stills=1.2,3.4  -> qa/still_<t>.png
//             --range=a:b --workers=N --out=out/frames  (jpg frames, resumable)
import puppeteer from 'puppeteer-core'; import fs from 'fs'; import { spawn } from 'child_process';
const arg = k => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1];
const CHROME = process.env.CHROME_BIN || arg('chrome') || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL0 = 'http://localhost:8765/index.html';
const launch = () => puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'], defaultViewport: { width: 960, height: 540 } });
async function page(b) { const p = await b.newPage(); p.on('console', m => { if (m.type() === 'error') console.log('PAGE', m.text()); }); p.on('pageerror', e => console.log('PAGEERR', e.message)); await p.goto(URL0, { waitUntil: 'networkidle0' }); await p.evaluate(() => window.ready); return p; }
const save = (f, d) => fs.writeFileSync(f, Buffer.from(d.split(',')[1], 'base64'));
if (arg('stills')) {
  const b = await launch(); const p = await page(b); fs.mkdirSync('qa', { recursive: true });
  for (const t of arg('stills').split(',').map(Number)) { const t0 = Date.now(); save(`qa/still_${t.toFixed(2)}.png`, await p.evaluate(t => window.renderFrame(t, 'image/png'), t)); console.log('still', t, Date.now() - t0, 'ms'); }
  await b.close();
} else if (arg('range')) {
  const [a, z] = arg('range').split(':').map(Number); const FPS = 30, N = +(arg('workers') || 4), out = arg('out') || 'out/frames';
  fs.mkdirSync(out, { recursive: true });
  const todo = []; for (let f = Math.round(a * FPS); f < Math.round(z * FPS); f++) if (!fs.existsSync(`${out}/${String(f).padStart(5, '0')}.jpg`)) todo.push(f);
  console.log('frames to render', todo.length); const t0 = Date.now(); let done = 0;
  const b = await launch();
  await Promise.all(Array.from({ length: N }, async (_, w) => { const p = await page(b);
    for (let i = w; i < todo.length; i += N) { const f = todo[i]; save(`${out}/${String(f).padStart(5, '0')}.jpg`, await p.evaluate(t => window.renderFrame(t, 'image/jpeg'), f / FPS));
      if (++done % 100 === 0) console.log(done, '/', todo.length, ((Date.now() - t0) / done).toFixed(0), 'ms/frame'); } }));
  await b.close(); console.log('done in', ((Date.now() - t0) / 1000).toFixed(0), 's');
}
