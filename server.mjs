import http from 'http'; import fs from 'fs'; import path from 'path';
const root = decodeURIComponent(new URL('./studio', import.meta.url).pathname);
const T = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.jpg':'image/jpeg', '.png':'image/png', '.mp3':'audio/mpeg' };
http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p.endsWith('/') ? p + 'index.html' : p, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); r.end(d); }); }).listen(8765, () => console.log('studio on http://localhost:8765'));
