/* ============================================================
   atlas.js — the hero.

   A reward surface, drawn as an atlas contour map, with a policy
   descending it by gradient + momentum. Move your cursor and a
   hill follows you: the landscape changes, and the agent has to
   find a new route down. Hand-written WebGL2, no libraries.
   ============================================================ */
(() => {
  'use strict';

  const cv = document.getElementById('landscape');
  if (!cv) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = cv.getContext('webgl2', {
    antialias: true, alpha: false, depth: true,
    powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false
  });

  const out = {
    ep: document.getElementById('t-ep'),
    step: document.getElementById('t-step'),
    rew: document.getElementById('t-rew')
  };

  if (!gl) { fallback(); return; }

  /* ── world ─────────────────────────────────────────── */
  const X0 = -9.0, X1 = 9.0, Z0 = -9.0, Z1 = 3.2;
  const NG = 6;                                   // gaussians in the field
  const g = new Float32Array(NG * 4);             // cx, cz, amp, sigma
  const seeds = [];
  for (let i = 0; i < NG; i++) {
    seeds.push({
      px: (Math.random() * 2 - 1) * 4.2,
      pz: -6.5 + Math.random() * 8.4,
      amp: (i === 0) ? 0.52 : (Math.random() * 2 - 1) * .38,
      sig: .62 + Math.random() * .8,
      dx: (Math.random() * 2 - 1) * .05,
      dz: (Math.random() * 2 - 1) * .04
    });
  }
  seeds[0].sig = .80;                             // the cursor hill

  function writeG(t) {
    for (let i = 0; i < NG; i++) {
      const s = seeds[i];
      if (i > 0) {
        s.px += s.dx * .016; s.pz += s.dz * .016;
        if (s.px < -4.6 || s.px > 4.6) s.dx *= -1;
        if (s.pz < -7.0 || s.pz > 2.4) s.dz *= -1;
      }
      g[i * 4] = s.px; g[i * 4 + 1] = s.pz; g[i * 4 + 2] = s.amp; g[i * 4 + 3] = s.sig;
    }
  }
  writeG(0);

  // must mirror field() in the vertex shader
  function field(x, z, t) {
    let h = 0;
    for (let i = 0; i < NG; i++) {
      const dx = x - g[i * 4], dz = z - g[i * 4 + 1], s = g[i * 4 + 3];
      h += g[i * 4 + 2] * Math.exp(-(dx * dx + dz * dz) / (2 * s * s));
    }
    return h + bowl(x, z) + .045 * Math.sin(x * 1.7 + t * .25) * Math.cos(z * 1.3 - t * .18);
  }
  function bowl(x, z) {
    const dz = z + 1.6;
    return .01 * (x * x + dz * dz);
  }

  /* ── shaders ───────────────────────────────────────── */
  const FIELD = `
  uniform vec4 uG[${NG}];
  float bowl(vec2 p){ float d = p.y + 1.6; return 0.01*(p.x*p.x + d*d); }
  float field(vec2 p, float t){
    float h = 0.0;
    for(int i=0;i<${NG};i++){
      vec2 d = p - uG[i].xy; float s = uG[i].w;
      h += uG[i].z * exp(-dot(d,d)/(2.0*s*s));
    }
    return h + bowl(p) + 0.045*sin(p.x*1.7+t*0.25)*cos(p.y*1.3-t*0.18);
  }`;

  const VS = `#version 300 es
  precision highp float;
  in vec2 aXZ;
  uniform mat4 uVP; uniform float uTime;
  out vec2 vXZ;
  ${FIELD}
  void main(){
    vXZ = aXZ;
    gl_Position = uVP * vec4(aXZ.x, field(aXZ, uTime), aXZ.y, 1.0);
  }`;

  const FS = `#version 300 es
  precision highp float;
  in vec2 vXZ;
  uniform vec2 uAgent; uniform float uTime;
  out vec4 frag;
  const vec3 BG    = vec3(0.039,0.055,0.161);
  const vec3 IVORY = vec3(0.949,0.929,0.890);
  const vec3 MARI  = vec3(1.000,0.714,0.239);
  const vec3 AQUA  = vec3(0.435,0.890,0.784);
  ${FIELD}
  void main(){
    // recomputed per pixel, so contours stay smooth however coarse the mesh
    float h = field(vXZ, uTime);
    float fog = clamp((vXZ.y - (${Z0.toFixed(1)})) / ${(Z1 - Z0).toFixed(1)}, 0.0, 1.0);

    float f = h * 22.0;
    float line = 1.0 - min(abs(fract(f-0.5)-0.5)/max(fwidth(f)*1.5,1e-5), 1.0);
    line = pow(line, 1.25);

    vec2 gc = vXZ * 1.5;
    vec2 gv = abs(fract(gc-0.5)-0.5)/max(fwidth(gc),vec2(1e-5));
    float grid = 1.0 - min(min(gv.x,gv.y),1.0);

    float elev = clamp((h - bowl(vXZ))*1.5 + 0.5, 0.0, 1.0);
    vec3 lc = mix(AQUA, MARI, smoothstep(0.34,0.86,elev));

    vec3 col = BG * (0.70 + 0.55*elev);
    col += lc * line * (0.42 + 0.72*fog);
    col += IVORY * grid * 0.055 * fog;

    float d = length(vXZ - uAgent);
    col += MARI * exp(-d*d*9.0) * 0.5;
    col += MARI * smoothstep(0.035,0.0,abs(d-(0.30+0.07*sin(uTime*2.1)))) * 0.45 * fog;

    col = mix(BG, col, smoothstep(0.16, 0.60, fog));
    frag = vec4(col, 1.0);
  }`;

  const PVS = `#version 300 es
  precision highp float;
  in vec3 aP; in float aAge;
  uniform mat4 uVP; uniform float uPx;
  out float vAge;
  void main(){
    vec4 c = uVP * vec4(aP,1.0);
    gl_Position = c;
    gl_PointSize = uPx * mix(1.6, 6.5, aAge) / max(c.w*0.28, 0.5);
    vAge = aAge;
  }`;

  const PFS = `#version 300 es
  precision highp float;
  in float vAge; out vec4 frag;
  void main(){
    vec2 p = gl_PointCoord*2.0-1.0;
    float a = 1.0 - smoothstep(0.25, 1.0, length(p));
    frag = vec4(vec3(1.0,0.714,0.239), a*vAge*0.85);
  }`;

  function sh(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function prog(v, f) {
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, v));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, f));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  let P, PP;
  try { P = prog(VS, FS); PP = prog(PVS, PFS); }
  catch (e) { console.warn('atlas:', e.message); fallback(); return; }

  /* ── mesh ──────────────────────────────────────────── */
  const small = innerWidth < 760;
  const CX = small ? 110 : 184, CZ = small ? 92 : 152;
  const verts = new Float32Array((CX + 1) * (CZ + 1) * 2);
  let k = 0;
  for (let j = 0; j <= CZ; j++)
    for (let i = 0; i <= CX; i++) {
      verts[k++] = X0 + (X1 - X0) * (i / CX);
      verts[k++] = Z0 + (Z1 - Z0) * (j / CZ);
    }
  const idx = new Uint32Array(CX * CZ * 6);
  let m = 0;
  for (let j = 0; j < CZ; j++)
    for (let i = 0; i < CX; i++) {
      const a = j * (CX + 1) + i, b = a + 1, c = a + CX + 1, d = c + 1;
      idx[m++] = a; idx[m++] = c; idx[m++] = b; idx[m++] = b; idx[m++] = c; idx[m++] = d;
    }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const aXZ = gl.getAttribLocation(P, 'aXZ');
  gl.enableVertexAttribArray(aXZ);
  gl.vertexAttribPointer(aXZ, 2, gl.FLOAT, false, 0, 0);
  const ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  /* ── trail ─────────────────────────────────────────── */
  const TRAIL = 44;
  const trail = new Float32Array(TRAIL * 4);   // x,y,z,age
  let trailN = 0;
  const tvao = gl.createVertexArray();
  gl.bindVertexArray(tvao);
  const tb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tb);
  gl.bufferData(gl.ARRAY_BUFFER, trail.byteLength, gl.DYNAMIC_DRAW);
  const aP = gl.getAttribLocation(PP, 'aP'), aAge = gl.getAttribLocation(PP, 'aAge');
  gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(aAge); gl.vertexAttribPointer(aAge, 1, gl.FLOAT, false, 16, 12);
  gl.bindVertexArray(null);

  /* ── matrices ──────────────────────────────────────── */
  const mul = (a, b, o) => {
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      let s = 0; for (let n = 0; n < 4; n++) s += a[n * 4 + j] * b[i * 4 + n];
      o[i * 4 + j] = s;
    } return o;
  };
  function persp(fov, ar, n, f, o) {
    const t = 1 / Math.tan(fov / 2);
    o.fill(0); o[0] = t / ar; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f);
    return o;
  }
  function look(e, c, o) {
    let zx = e[0] - c[0], zy = e[1] - c[1], zz = e[2] - c[2];
    let l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
    let xx = -zz, xy = 0, xz = zx; l = Math.hypot(xx, xy, xz) || 1; xx /= l; xy /= l; xz /= l;
    const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    o[0] = xx; o[1] = yx; o[2] = zx; o[3] = 0;
    o[4] = xy; o[5] = yy; o[6] = zy; o[7] = 0;
    o[8] = xz; o[9] = yz; o[10] = zz; o[11] = 0;
    o[12] = -(xx * e[0] + xy * e[1] + xz * e[2]);
    o[13] = -(yx * e[0] + yy * e[1] + yz * e[2]);
    o[14] = -(zx * e[0] + zy * e[1] + zz * e[2]);
    o[15] = 1; return o;
  }
  function inv(a, o) {
    const b00 = a[0]*a[5]-a[1]*a[4], b01 = a[0]*a[6]-a[2]*a[4], b02 = a[0]*a[7]-a[3]*a[4],
          b03 = a[1]*a[6]-a[2]*a[5], b04 = a[1]*a[7]-a[3]*a[5], b05 = a[2]*a[7]-a[3]*a[6],
          b06 = a[8]*a[13]-a[9]*a[12], b07 = a[8]*a[14]-a[10]*a[12], b08 = a[8]*a[15]-a[11]*a[12],
          b09 = a[9]*a[14]-a[10]*a[13], b10 = a[9]*a[15]-a[11]*a[13], b11 = a[10]*a[15]-a[11]*a[14];
    let d = b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;
    if (!d) return null; d = 1/d;
    o[0]=(a[5]*b11-a[6]*b10+a[7]*b09)*d;  o[1]=(a[2]*b10-a[1]*b11-a[3]*b09)*d;
    o[2]=(a[13]*b05-a[14]*b04+a[15]*b03)*d; o[3]=(a[10]*b04-a[9]*b05-a[11]*b03)*d;
    o[4]=(a[6]*b08-a[4]*b11-a[7]*b07)*d;  o[5]=(a[0]*b11-a[2]*b08+a[3]*b07)*d;
    o[6]=(a[14]*b02-a[12]*b05-a[15]*b01)*d; o[7]=(a[8]*b05-a[10]*b02+a[11]*b01)*d;
    o[8]=(a[4]*b10-a[5]*b08+a[7]*b06)*d;  o[9]=(a[1]*b08-a[0]*b10-a[3]*b06)*d;
    o[10]=(a[12]*b04-a[13]*b02+a[15]*b00)*d; o[11]=(a[9]*b02-a[8]*b04-a[11]*b00)*d;
    o[12]=(a[5]*b07-a[4]*b09-a[6]*b06)*d; o[13]=(a[0]*b09-a[1]*b07+a[2]*b06)*d;
    o[14]=(a[13]*b01-a[12]*b03-a[14]*b00)*d; o[15]=(a[8]*b03-a[9]*b01+a[10]*b00)*d;
    return o;
  }

  const mP = new Float32Array(16), mV = new Float32Array(16),
        mVP = new Float32Array(16), mInv = new Float32Array(16);

  /* ── uniforms ──────────────────────────────────────── */
  const u = {
    vp: gl.getUniformLocation(P, 'uVP'), g: gl.getUniformLocation(P, 'uG'),
    t: gl.getUniformLocation(P, 'uTime'), a: gl.getUniformLocation(P, 'uAgent'),
    pvp: gl.getUniformLocation(PP, 'uVP'), px: gl.getUniformLocation(PP, 'uPx')
  };

  /* ── sizing ────────────────────────────────────────── */
  let W = 0, H = 0, dpr = 1, needSize = true;
  function resize() {
    if (!needSize) return;
    needSize = false;
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    const r = cv.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (w === W && h === H) return;
    W = w; H = h; cv.width = W; cv.height = H;
    gl.viewport(0, 0, W, H);
  }
  if ('ResizeObserver' in window) new ResizeObserver(() => { needSize = true; if (reduced) draw(performance.now()); }).observe(cv);
  else addEventListener('resize', () => { needSize = true; }, { passive: true });

  /* ── cursor → world ────────────────────────────────── */
  let mx = 0, my = 0, has = false, tx = 0, tz = -1.4;
  addEventListener('pointermove', e => {
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = 1 - (e.clientY / innerHeight) * 2;
    has = true;
  }, { passive: true });

  function unproject() {
    if (!inv(mVP, mInv)) return;
    const p = (zc) => {
      const x = mInv[0]*mx + mInv[4]*my + mInv[8]*zc + mInv[12],
            y = mInv[1]*mx + mInv[5]*my + mInv[9]*zc + mInv[13],
            z = mInv[2]*mx + mInv[6]*my + mInv[10]*zc + mInv[14],
            w = mInv[3]*mx + mInv[7]*my + mInv[11]*zc + mInv[15];
      return [x/w, y/w, z/w];
    };
    const a = p(-1), b = p(1);
    const dy = b[1] - a[1];
    if (Math.abs(dy) < 1e-4) return;
    const t = -a[1] / dy;
    if (t < 0 || t > 1) return;
    tx = Math.max(-4.6, Math.min(4.6, a[0] + (b[0] - a[0]) * t));
    tz = Math.max(-7.0, Math.min(2.4, a[2] + (b[2] - a[2]) * t));
  }

  /* ── the policy ────────────────────────────────────── */
  const AX0 = -4.4, AX1 = 4.4, AZ0 = -6.4, AZ1 = 2.2;   // where the policy may roam
  let ax = 1.4, az = -1.2, vx = 0, vz = 0, ep = 1, step = 0, rew = 0;
  function reset() {
    ax = AX0 + Math.random() * (AX1 - AX0);
    az = AZ0 + Math.random() * (AZ1 - AZ0);
    vx = vz = 0; step = 0; trailN = 0; ep++;
  }
  function policy(t, dt) {
    const e = .06;
    const h = field(ax, az, t);
    const gx = (field(ax + e, az, t) - field(ax - e, az, t)) / (2 * e);
    const gz = (field(ax, az + e, t) - field(ax, az - e, t)) / (2 * e);
    const explore = .0016 * Math.max(0, 1 - step / 200);
    vx = vx * .9 - gx * .012 + (Math.random() * 2 - 1) * explore;
    vz = vz * .9 - gz * .012 + (Math.random() * 2 - 1) * explore;
    const sp = Math.hypot(vx, vz), cap = .07;
    if (sp > cap) { vx = vx / sp * cap; vz = vz / sp * cap; }
    ax += vx * dt * 60; az += vz * dt * 60;
    if (ax < AX0 || ax > AX1) { vx *= -.55; ax = Math.max(AX0, Math.min(AX1, ax)); }
    if (az < AZ0 || az > AZ1) { vz *= -.55; az = Math.max(AZ0, Math.min(AZ1, az)); }
    rew = -h;
    step++;
    if (step > 340 || (step > 90 && sp < .0016)) reset();

    // push the trail
    trail.copyWithin(4, 0, (TRAIL - 1) * 4);
    trail[0] = ax; trail[1] = field(ax, az, t) + .022; trail[2] = az; trail[3] = 1;
    trailN = Math.min(TRAIL, trailN + 1);
    for (let i = 0; i < trailN; i++) trail[i * 4 + 3] = 1 - i / TRAIL;
  }

  /* ── loop ──────────────────────────────────────────── */
  gl.clearColor(0.039, 0.055, 0.161, 1);
  gl.enable(gl.DEPTH_TEST);

  let t0 = performance.now(), last = t0, tele = 0, running = true, visible = true, started = false;

  const io = new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    if (visible) { last = performance.now(); if (reduced) draw(last); }
  }, { threshold: 0 });
  io.observe(cv);
  document.addEventListener('visibilitychange', () => { running = !document.hidden; last = performance.now(); });

  function draw(now) {
    if (!running || !visible) return;
    const dt = Math.min((now - last) / 1000, .05); last = now;
    const t = reduced ? 4.0 : (now - t0) / 1000;

    resize();
    if (!W) return;

    // the cursor hill chases the pointer
    unproject();
    if (!has) { tx = Math.sin(t * .21) * 3.0; tz = -1.8 + Math.cos(t * .17) * 1.8; }
    const chase = reduced ? 1 : Math.min(1, dt * 3.2);
    seeds[0].px += (tx - seeds[0].px) * chase;
    seeds[0].pz += (tz - seeds[0].pz) * chase;
    writeG(t);

    if (!reduced) policy(t, dt);
    else if (trailN === 0) { for (let i = 0; i < 6; i++) policy(t, 1 / 60); }

    const camX = has ? mx * .36 : Math.sin(t * .12) * .24;
    const camY = 2.05 + (has ? my * .18 : 0);
    look([camX, camY, 3.6], [camX * .3, 0.0, -1.7], mV);
    persp(0.76, W / H, .1, 24, mP);
    mul(mP, mV, mVP);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(P);
    gl.uniformMatrix4fv(u.vp, false, mVP);
    gl.uniform4fv(u.g, g);
    gl.uniform1f(u.t, t);
    gl.uniform2f(u.a, ax, az);
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);

    if (trailN > 1) {
      gl.useProgram(PP);
      gl.uniformMatrix4fv(u.pvp, false, mVP);
      gl.uniform1f(u.px, dpr * 4.2);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false);
      gl.bindVertexArray(tvao);
      gl.bindBuffer(gl.ARRAY_BUFFER, tb);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, trail);
      gl.drawArrays(gl.POINTS, 0, trailN);
      gl.depthMask(true); gl.disable(gl.BLEND);
    }
    gl.bindVertexArray(null);

    if (!started) { started = true; cv.classList.add('is-live'); }

    if (now - tele > 140 && out.ep) {
      tele = now;
      out.ep.textContent = String(ep).padStart(4, '0');
      out.step.textContent = String(step).padStart(3, '0');
      out.rew.textContent = (rew >= 0 ? '+' : '') + rew.toFixed(3);
    }
  }
  function frame(now) {
    if (reduced) { draw(now); return; }   // one still frame, then idle
    requestAnimationFrame(frame);
    draw(now);
  }
  requestAnimationFrame(frame);
  if (reduced) addEventListener('load', () => draw(performance.now()), { once: true });

  /* ── no WebGL2: a quiet CSS stand-in ───────────────── */
  function fallback() {
    cv.style.display = 'none';
    const v = document.querySelector('.hero__veil');
    if (v) v.style.background =
      'radial-gradient(120% 80% at 50% 100%, rgba(255,182,61,.10), transparent 60%),' +
      'repeating-radial-gradient(ellipse at 50% 120%, rgba(154,163,214,.16) 0 1px, transparent 1px 46px),' +
      'linear-gradient(180deg, var(--abyss) 0%, rgba(10,14,41,0) 40%)';
    const t = document.querySelector('.telemetry');
    if (t) t.style.display = 'none';
  }
})();
