// gl.js: the "rotoscope" cel pass and the riso "press" pass.
// cel(src, opts) redraws any image as ink: Kuwahara flats -> nearest-ink palette with 2-tone shading
//   + screentone in shadow tones + XDoG ink lines with boil. The raw base never reaches the screen.
// press(canvas2d, t) prints the finished composition on paper: fibers, grain, misregistration, vignette.
const GLX = (() => {
  const LW = 1920, LH = 1080;
  const celCanvas = document.createElement('canvas'); celCanvas.width = W; celCanvas.height = H;
  const gl = celCanvas.getContext('webgl2', { premultipliedAlpha: false, preserveDrawingBuffer: true });
  const pressCanvas = document.getElementById('out'); pressCanvas.width = W; pressCanvas.height = H;
  const pg = pressCanvas.getContext('webgl2', { preserveDrawingBuffer: true });

  const VS = `#version 300 es
  in vec2 p; out vec2 uv; void main(){ uv = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }`;
  function prog(g, fs) {
    const mk = (t, s) => { const sh = g.createShader(t); g.shaderSource(sh, s); g.compileShader(sh); if (!g.getShaderParameter(sh, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(sh) + s); return sh; };
    const p = g.createProgram(); g.attachShader(p, mk(g.VERTEX_SHADER, VS)); g.attachShader(p, mk(g.FRAGMENT_SHADER, fs)); g.linkProgram(p);
    const b = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, b); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(p, 'p'); const u = {};
    return { p, use() { g.useProgram(p); g.bindBuffer(g.ARRAY_BUFFER, b); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0); },
      u(n) { return u[n] ?? (u[n] = g.getUniformLocation(p, n)); } };
  }
  function tex(g, w, h) { const t = g.createTexture(); g.bindTexture(g.TEXTURE_2D, t); g.texImage2D(g.TEXTURE_2D, 0, g.RGBA8, w, h, 0, g.RGBA, g.UNSIGNED_BYTE, null);
    [g.TEXTURE_MIN_FILTER, g.TEXTURE_MAG_FILTER].forEach(k => g.texParameteri(g.TEXTURE_2D, k, g.LINEAR));
    [g.TEXTURE_WRAP_S, g.TEXTURE_WRAP_T].forEach(k => g.texParameteri(g.TEXTURE_2D, k, g.CLAMP_TO_EDGE)); return t; }
  function fbo(g, t) { const f = g.createFramebuffer(); g.bindFramebuffer(g.FRAMEBUFFER, f); g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, t, 0); return f; }

  const NOISE = `
  float h21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
  float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y); }
  float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*vn(p); p*=2.03; a*=.5; } return s; }`;

  // P0: sample source through crop + flip, P1: Kuwahara
  const P0 = prog(gl, `#version 300 es
  precision highp float; in vec2 uv; out vec4 o; uniform sampler2D s; uniform vec4 crop;
  void main(){ vec2 q = vec2(uv.x, 1.-uv.y); o = texture(s, crop.xy + q*crop.zw); }`);
  const P1 = prog(gl, `#version 300 es
  precision highp float; in vec2 uv; out vec4 o; uniform sampler2D s; uniform vec2 px; uniform int R; uniform float sc;
  void main(){ vec3 c0 = texture(s, uv).rgb; vec3 acc = vec3(0); float ws = 0.;
    for(int j=-5;j<=5;j++) for(int i=-5;i<=5;i++){ vec2 d = vec2(i,j); vec3 c = texture(s, uv + d*px*1.6).rgb; vec3 e = c - c0;
      float w = exp(-dot(d,d)/14.) * exp(-dot(e,e)/(2.*sc*sc)); acc += c*w; ws += w; }
    o = vec4(acc/ws, 1.); }`);
  // P2/P3: separable gaussian of luminance at two sigmas -> (g1,g2)
  const PB = prog(gl, `#version 300 es
  precision highp float; in vec2 uv; out vec4 o; uniform sampler2D s; uniform vec2 dir; uniform float s1, s2; uniform int first;
  float L(vec3 c){ return dot(c, vec3(.299,.587,.114)); }
  void main(){ float a=0., b=0., wa=0., wb=0.;
    for(int i=-9;i<=9;i++){ float x=float(i); vec4 t = texture(s, uv + dir*x);
      float va = first==1 ? L(t.rgb) : t.r; float vb = first==1 ? L(t.rgb) : t.g;
      float ka = exp(-x*x/(2.*s1*s1)), kb = exp(-x*x/(2.*s2*s2)); a+=va*ka; wa+=ka; b+=vb*kb; wb+=kb; }
    o = vec4(a/wa, b/wb, 0., 1.); }`);
  // final cel composite at full res
  const PF = prog(gl, `#version 300 es
  precision highp float; in vec2 uv; out vec4 o;
  uniform sampler2D K, D; uniform vec3 pal[10]; uniform int np; uniform float seed, lineAmt, lineTh, tone, shadeMix, sat;
  uniform vec3 lineCol, misCol; uniform vec2 res; uniform float alphaKey; uniform vec3 keyCol; uniform vec3 remapFrom, remapTo; uniform float remapAmt; uniform float expo;
  ${NOISE}
  vec3 opp(vec3 c){ float L = dot(c, vec3(.299,.587,.114)); return vec3(L*1.6, (c.r-c.g)*.9, ((c.r+c.g)*.5-c.b)*.7); }
  vec3 prep(vec3 c){ c = min(vec3(1.), c*expo + (expo-1.)*.06); c = mix(vec3(dot(c,vec3(.333))), c, sat);
    float rd = distance(c, remapFrom); return mix(c, remapTo, remapAmt*smoothstep(.28,.08,rd)); }
  // nearest ink (plain or shaded); returns colour, w = 1 if shaded
  vec4 ink(vec3 c, out vec3 base){ vec3 best = pal[0]; float bd = 1e9; float sh = 0.; base = pal[0];
    for(int i=0;i<10;i++){ if(i>=np) break; vec3 p0 = pal[i]; vec3 p1 = mix(pal[i], vec3(.106,.09,.078), shadeMix);
      float d0 = distance(opp(c), opp(p0)), d1 = distance(opp(c), opp(p1));
      if(d0<bd){ bd=d0; best=p0; sh=0.; base=p0; } if(d1<bd){ bd=d1; best=p1; sh=1.; base=p0; } }
    return vec4(best, sh); }
  void main(){
    vec2 q = uv; vec2 fr = q*res; vec2 px = 1./res;
    vec2 wob = (vec2(vn(fr*.006+seed*7.1), vn(fr*.006+seed*3.7+9.))-.5)*.9/res;
    // 4x supersampled ink mapping -> anti-aliased region borders
    vec3 col = vec3(0); vec3 base; float shaded = 0.;
    vec2 ofs[4] = vec2[4](vec2(-.35,-.15), vec2(.15,-.35), vec2(.35,.15), vec2(-.15,.35));
    for(int k=0;k<4;k++){ vec3 b; vec4 r = ink(prep(texture(K, q + ofs[k]*px*1.6).rgb), b); col += r.rgb; shaded += r.a; if(k==0) base = b; }
    col *= .25; shaded *= .25;
    if(tone>0. && shaded>.5){ vec2 r = mat2(.7071,-.7071,.7071,.7071)*fr/4.2; vec2 f = fract(r)-.5; float dd = length(f);
      col = mix(col, base, tone*.6*(1.-smoothstep(.2,.3,dd))*smoothstep(.5,1.,shaded)); }
    // crisp XDoG lines
    vec2 g = texture(D, q+wob).rg; float dog = g.r - .985*g.g;
    float line = clamp((1.-smoothstep(-lineTh*1.1, -lineTh*.5, dog))*lineAmt, 0., 1.);
    vec2 g2 = texture(D, q+wob+vec2(1.6,-1.)/res).rg; float mis = clamp((1.-smoothstep(-lineTh*1.1, -lineTh*.5, g2.r-.985*g2.g))*lineAmt, 0., 1.);
    col = mix(col, misCol, mis*.22);
    col = mix(col, lineCol, line);
    float a = 1.;
    if(alphaKey>0.){ a = smoothstep(alphaKey, alphaKey+.06, distance(texture(K,q).rgb, keyCol)); a = max(a, line); }
    o = vec4(col, a);
  }`);

  const tSrc = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tSrc); [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.LINEAR));
  [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
  const T0 = tex(gl, LW, LH), T1 = tex(gl, LW, LH), T2 = tex(gl, LW, LH), T3 = tex(gl, LW, LH);
  const F0 = fbo(gl, T0), F1 = fbo(gl, T1), F2 = fbo(gl, T2), F3 = fbo(gl, T3);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

  const _palCache = new Map();
  const palArr = p => { if (!_palCache.has(p)) { const a = new Float32Array(30); p.slice(0, 10).forEach((h, i) => a.set(hex2rgb(h), i * 3)); _palCache.set(p, a); } return _palCache.get(p); };

  // src: Image/Canvas. crop: [x,y,w,h] in 0..1 of the source (camera). returns celCanvas (valid until next call)
  function cel(src, o = {}) {
    const crop = o.crop || [0, 0, 1, 1], pal = o.pal || PAL.mono;
    gl.bindTexture(gl.TEXTURE_2D, tSrc); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.viewport(0, 0, LW, LH);
    P0.use(); gl.bindFramebuffer(gl.FRAMEBUFFER, F0); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tSrc);
    gl.uniform1i(P0.u('s'), 0); gl.uniform4f(P0.u('crop'), ...crop); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    P1.use(); gl.uniform1i(P1.u('s'), 0); gl.uniform2f(P1.u('px'), 1 / LW, 1 / LH); gl.uniform1f(P1.u('sc'), o.bsc ?? .13);
    gl.bindFramebuffer(gl.FRAMEBUFFER, F1); gl.bindTexture(gl.TEXTURE_2D, T0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, F0); gl.bindTexture(gl.TEXTURE_2D, T1); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, F1); gl.bindTexture(gl.TEXTURE_2D, T0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    PB.use(); gl.uniform1f(PB.u('s1'), 1.25); gl.uniform1f(PB.u('s2'), 2.0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, F2); gl.bindTexture(gl.TEXTURE_2D, T1); gl.uniform1i(PB.u('first'), 1); gl.uniform2f(PB.u('dir'), 1 / LW, 0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, F3); gl.bindTexture(gl.TEXTURE_2D, T2); gl.uniform1i(PB.u('first'), 0); gl.uniform2f(PB.u('dir'), 0, 1 / LH); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H);
    PF.use(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, T1); gl.uniform1i(PF.u('K'), 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, T3); gl.uniform1i(PF.u('D'), 1);
    gl.uniform3fv(PF.u('pal'), palArr(pal)); gl.uniform1i(PF.u('np'), Math.min(10, pal.length));
    gl.uniform1f(PF.u('seed'), o.seed ?? 0); gl.uniform1f(PF.u('lineAmt'), o.line ?? 1); gl.uniform1f(PF.u('lineTh'), o.lineTh ?? 0.009);
    gl.uniform1f(PF.u('tone'), o.tone ?? 0.55); gl.uniform1f(PF.u('shadeMix'), o.shade ?? 0.32); gl.uniform1f(PF.u('sat'), o.sat ?? 1.15);
    gl.uniform3fv(PF.u('lineCol'), hex2rgb(o.lineCol || INK.ink)); gl.uniform3fv(PF.u('misCol'), hex2rgb(o.misCol || INK.blue));
    gl.uniform2f(PF.u('res'), W, H); gl.uniform1f(PF.u('alphaKey'), o.alphaKey ?? 0); gl.uniform3fv(PF.u('keyCol'), hex2rgb(o.keyCol || '#FFFFFF'));
    gl.uniform3fv(PF.u('remapFrom'), hex2rgb(o.remapFrom || '#000000')); gl.uniform3fv(PF.u('remapTo'), hex2rgb(o.remapTo || '#000000')); gl.uniform1f(PF.u('remapAmt'), o.remapAmt ?? 0); gl.uniform1f(PF.u('expo'), o.expo ?? 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return celCanvas;
  }

  // ---------- press
  const PP = prog(pg, `#version 300 es
  precision highp float; in vec2 uv; out vec4 o; uniform sampler2D s; uniform float seed, mis, grainAmt, vig, flash; uniform vec2 res; uniform vec3 paper;
  ${NOISE}
  void main(){
    vec2 q = vec2(uv.x, 1.-uv.y); vec2 fr = q*res;
    vec3 c = texture(s, q).rgb;
    // misregistration: the dark plate is printed slightly off
    vec3 c2 = texture(s, q + vec2(mis, -mis*.6)/res).rgb;
    float dk = 1.-dot(c2, vec3(.333)); float dk0 = 1.-dot(c, vec3(.333));
    c = mix(c, c*vec3(.86,.9,1.), clamp(dk-dk0,0.,1.)*.9);
    // paper fibers + tooth
    float fib = fbm(fr*vec2(.004,.02)) * .6 + fbm(fr*.05)*.4;
    float tooth = vn(fr*.9);
    c *= mix(1., .93 + .09*fib, .85);
    c *= 1. - .035*smoothstep(.55,.95,tooth);
    // ink starvation: flat dark ink areas get tiny paper speckles
    float starve = step(.992, h21(floor(fr*.5)+seed)) * smoothstep(.5,.9,dk0);
    c = mix(c, paper, starve*.5);
    // grain on twos
    float g = h21(fr + seed*13.1) - .5; c += g*grainAmt;
    // vignette
    vec2 d = q-.5; c *= 1. - vig*dot(d,d)*1.4;
    c = mix(c, vec3(1.), flash);
    o = vec4(c, 1.);
  }`);
  const pTex = pg.createTexture(); pg.bindTexture(pg.TEXTURE_2D, pTex);
  [pg.TEXTURE_MIN_FILTER, pg.TEXTURE_MAG_FILTER].forEach(k => pg.texParameteri(pg.TEXTURE_2D, k, pg.LINEAR));
  [pg.TEXTURE_WRAP_S, pg.TEXTURE_WRAP_T].forEach(k => pg.texParameteri(pg.TEXTURE_2D, k, pg.CLAMP_TO_EDGE));
  function press(src, t, o = {}) {
    pg.viewport(0, 0, W, H); PP.use(); pg.activeTexture(pg.TEXTURE0); pg.bindTexture(pg.TEXTURE_2D, pTex);
    pg.texImage2D(pg.TEXTURE_2D, 0, pg.RGBA, pg.RGBA, pg.UNSIGNED_BYTE, src);
    pg.uniform1i(PP.u('s'), 0); pg.uniform1f(PP.u('seed'), boilSeed(t) % 97); pg.uniform1f(PP.u('mis'), Math.min(o.mis ?? 1.5, 2.5));
    pg.uniform1f(PP.u("grainAmt"), o.grain ?? 0.03); pg.uniform1f(PP.u('vig'), o.vig ?? 0.35); pg.uniform1f(PP.u('flash'), o.flash ?? 0);
    pg.uniform2f(PP.u('res'), W, H); pg.uniform3fv(PP.u('paper'), hex2rgb(INK.paper));
    pg.drawArrays(pg.TRIANGLE_STRIP, 0, 4);
  }
  return { cel, press, celCanvas };
})();
