import { execFileSync } from 'child_process';
const FF = decodeURIComponent(new URL('../tools/ffmpeg', import.meta.url).pathname);
// vocal-band (300-3400Hz) energy per 100ms
const env = f => { const b = execFileSync(FF, ['-v','error','-i',f,'-af','highpass=f=300,lowpass=f=3400','-ac','1','-ar','8000','-f','f32le','-'], { maxBuffer: 1<<28 }); const x = new Float32Array(b.buffer,b.byteOffset,b.length/4); const o=[]; for(let i=0;i+800<=x.length;i+=800){let s=0;for(let j=0;j<800;j++)s+=x[i+j]**2;o.push(Math.sqrt(s/800));} const m=Math.max(...o); return o.map(v=>v/m); };
const [a,b] = process.argv.slice(2,4).map(env);
for (let i=0;i<Math.max(a.length,b.length);i++) console.log((i/10).toFixed(1).padStart(4), ('#'.repeat(Math.round((a[i]||0)*30))).padEnd(31), '#'.repeat(Math.round((b[i]||0)*30)));
