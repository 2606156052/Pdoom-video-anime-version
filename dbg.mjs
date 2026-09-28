import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage(); await p.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle0' }); await p.evaluate(() => window.ready);
console.log(await p.evaluate(() => { const c = document.createElement('canvas').getContext('2d'); const L = layoutWords(c, 36, [80, 80, W - 160, 220], F.anton, 150, true); return JSON.stringify({ size: L.size, lines: L.lines.map(l => ({ w: l.w, words: l.map(x => [x.s, Math.round(x.x), Math.round(x.ww)]) })) }); }));
await b.close();
