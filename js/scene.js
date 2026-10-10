/* =====================================================================
   Scene — the hardware this work ships on, drawn with Three.js.
   A headset, smart glasses, a gamepad, a laptop, a phone and a touch
   kiosk, all in one glossy dark finish with orange screens, so they read
   as a family. Each device belongs to a section and drifts closer as
   that section scrolls into view. Thin orbit rings and embers fill the
   gaps. Sits fixed behind the page; leans with the cursor (or phone);
   stops when the tab is hidden; still frames for reduced motion.
   ===================================================================== */
(() => {
  const host = document.querySelector("[data-scene]");
  if (!host || !window.THREE) return;
  const T = window.THREE;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = matchMedia("(max-width: 760px)").matches;

  let renderer;
  try {
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (e) { return; } // no WebGL: the CSS glow stays as the background
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  host.appendChild(renderer.domElement);

  const scene = new T.Scene();
  scene.fog = new T.FogExp2(0x1e0f07, 0.022);
  const camera = new T.PerspectiveCamera(45, 1, 0.1, 90);
  camera.position.set(0, 0, 15);

  // ---- studio reflections: a dark room with warm soft boxes ----------
  const env = new T.Scene(); env.background = new T.Color(0x070403);
  const softbox = (w, h, hex, k, pos, rot) => {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(hex).multiplyScalar(k), side: T.DoubleSide }));
    m.position.set(...pos); m.rotation.set(...rot); env.add(m);
  };
  softbox(12, 3, 0xfff1e4, 2.4, [0, 7, 1], [Math.PI / 2, 0, 0]);
  softbox(2.5, 10, 0xff7a1a, 3.2, [8, 0, 1], [0, -Math.PI / 2.2, 0]);
  softbox(2, 8, 0xffc08a, 1.6, [-8, 1, 2], [0, Math.PI / 2.4, 0]);
  softbox(14, 2, 0xff5a00, .8, [0, -6, 3], [-Math.PI / 2.3, 0, 0]);
  softbox(6, 4, 0xffe6d0, 1.2, [0, 1, 9], [0, Math.PI, 0]);        // soft front fill so faces read
  const pmrem = new T.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(env, 0.03).texture;
  pmrem.dispose();
  const key = new T.DirectionalLight(0xffd8b4, .8); key.position.set(-5, 8, 6); scene.add(key);
  const rim = new T.DirectionalLight(0xff8a3a, 2.2); rim.position.set(6, 3, -8); scene.add(rim);
  const rim2 = new T.DirectionalLight(0xffb070, 1.2); rim2.position.set(-7, -2, -6); scene.add(rim2);

  // ---- materials: one family -----------------------------------------
  const srgb = hex => new T.Color(hex).convertSRGBToLinear();
  const body = new T.MeshPhysicalMaterial({ color: srgb(0x35231a), metalness: .3, roughness: .22, clearcoat: 1, clearcoatRoughness: .08, envMapIntensity: 2.4 });
  const satin = new T.MeshPhysicalMaterial({ color: srgb(0x4a352a), metalness: .1, roughness: .5, clearcoat: .3, envMapIntensity: 1.5 });
  const glass = new T.MeshPhysicalMaterial({ color: srgb(0x050302), metalness: .4, roughness: .08, clearcoat: 1, clearcoatRoughness: .03, envMapIntensity: 1.1 });
  const ember = new T.MeshStandardMaterial({ color: srgb(0xff7a1a), emissive: srgb(0xff5a00), emissiveIntensity: 1.4, roughness: .4 });
  const lensMat = new T.MeshPhysicalMaterial({ color: srgb(0x3a1606), metalness: .3, roughness: .04, clearcoat: 1, transparent: true, opacity: .82, emissive: srgb(0xff4a00), emissiveIntensity: .12, envMapIntensity: 2.2 });

  // ---- geometry helpers ------------------------------------------------
  const rrPath = (w, h, r, P = T.Shape) => {
    const s = new P(), x = -w / 2, y = -h / 2; r = Math.min(r, w / 2, h / 2);
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  };
  // a rounded slab w×h×d (centered), with soft beveled edges
  const slab = (w, h, d, r) => {
    const b = Math.min(d * .35, .12), bs = b * .9;
    const g = new T.ExtrudeGeometry(rrPath(w - 2 * bs, h - 2 * bs, Math.max(.01, r - bs)), { depth: Math.max(.002, d - 2 * b), bevelEnabled: true, bevelThickness: b, bevelSize: bs, bevelSegments: 4, curveSegments: 10 });
    g.translate(0, 0, -(d - 2 * b) / 2);
    return g;
  };
  const mesh = (g, m, p = [0, 0, 0], r = [0, 0, 0]) => { const o = new T.Mesh(g, m); o.position.set(...p); o.rotation.set(...r); return o; };

  // screens: small abstract UIs drawn on canvas (no text), dark with orange
  const screen = (w, h, draw) => {
    const c = document.createElement("canvas"); c.width = 512; c.height = Math.round(512 * h / w);
    const x = c.getContext("2d"), W = c.width, H = c.height;
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#2a1209"); g.addColorStop(1, "#120804");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const glow = x.createRadialGradient(W * .7, H * .25, 0, W * .7, H * .25, W * .8);
    glow.addColorStop(0, "rgba(255,120,30,.45)"); glow.addColorStop(1, "rgba(255,90,0,0)");
    x.fillStyle = glow; x.fillRect(0, 0, W, H);
    const rr = (a, b, w2, h2, r, fill) => { x.beginPath(); x.roundRect ? x.roundRect(a, b, w2, h2, r) : x.rect(a, b, w2, h2); x.fillStyle = fill; x.fill(); };
    draw(x, W, H, rr);
    const tex = new T.CanvasTexture(c); tex.encoding = T.sRGBEncoding; tex.anisotropy = 4;
    return new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tex, toneMapped: false, color: 0xd8d8d8 }));
  };
  const O = "#ff7a1a", O2 = "rgba(255,122,26,.35)", D = "rgba(255,235,220,.10)", D2 = "rgba(255,235,220,.22)";

  // ---- devices -----------------------------------------------------------
  function headset() {
    const g = new T.Group();
    g.add(mesh(slab(2.6, 1.45, 1, .5), body));
    g.add(mesh(slab(2.32, 1.18, .08, .42), glass, [0, 0, .5]));
    [-.78, 0, .78].forEach(a => g.add(mesh(new T.CapsuleGeometry(.075, .32, 6, 16), satin, [a, .05, .55])));
    g.add(mesh(slab(.7, .05, .03, .02), ember, [0, -.48, .55]));
    g.add(mesh(slab(2.3, 1.15, .32, .42), satin, [0, 0, -.62]));
    const strap = mesh(new T.TorusGeometry(1.15, .09, 12, 48, Math.PI), satin, [0, 0, -.55], [-Math.PI / 2, 0, 0]);
    strap.scale.set(1.12, 1.25, 1); g.add(strap);
    return g;
  }
  function glasses() {
    const g = new T.Group();
    [-.62, .62].forEach(cx => {
      const frame = rrPath(1.08, .8, .3); frame.holes.push(rrPath(.86, .6, .22, T.Path));
      const fg = new T.ExtrudeGeometry(frame, { depth: .06, bevelEnabled: true, bevelThickness: .025, bevelSize: .02, bevelSegments: 3, curveSegments: 12 });
      g.add(mesh(fg, body, [cx, 0, -.03]));
      g.add(mesh(slab(.86, .6, .02, .22), lensMat, [cx, 0, 0]));
      g.add(mesh(new T.BoxGeometry(.07, .08, 1.7), body, [cx * 1.84, .22, -.85]));
    });
    g.add(mesh(slab(.24, .09, .07, .04), body, [0, .2, 0]));
    g.add(mesh(new T.SphereGeometry(.045, 16, 12), ember, [1.08, .3, .06]));
    return g;
  }
  function gamepad() {
    const g = new T.Group(), s = new T.Shape();
    s.moveTo(-.9, .75); s.lineTo(.9, .75);
    s.bezierCurveTo(1.35, .78, 1.55, .55, 1.62, .2); s.bezierCurveTo(1.75, -.35, 1.8, -.85, 1.55, -1);
    s.bezierCurveTo(1.3, -1.12, 1.05, -.9, .85, -.55); s.bezierCurveTo(.7, -.32, .4, -.28, 0, -.28);
    s.bezierCurveTo(-.4, -.28, -.7, -.32, -.85, -.55); s.bezierCurveTo(-1.05, -.9, -1.3, -1.12, -1.55, -1);
    s.bezierCurveTo(-1.8, -.85, -1.75, -.35, -1.62, .2); s.bezierCurveTo(-1.55, .55, -1.35, .78, -.9, .75);
    const bg = new T.ExtrudeGeometry(s, { depth: .32, bevelEnabled: true, bevelThickness: .14, bevelSize: .12, bevelSegments: 5, curveSegments: 16 });
    bg.translate(0, 0, -.16); g.add(mesh(bg, body));
    const stick = (x, y) => { g.add(mesh(new T.CylinderGeometry(.13, .15, .16, 24), satin, [x, y, .36], [Math.PI / 2, 0, 0])); g.add(mesh(new T.CylinderGeometry(.21, .21, .05, 28), satin, [x, y, .46], [Math.PI / 2, 0, 0])); };
    stick(-.95, .22); stick(.42, -.22);
    g.add(mesh(new T.BoxGeometry(.36, .11, .07), satin, [-.42, -.22, .32])); g.add(mesh(new T.BoxGeometry(.11, .36, .07), satin, [-.42, -.22, .32]));
    [[.95, .44, 1], [.95, .02, 0], [.74, .23, 0], [1.16, .23, 0]].forEach(([x, y, hot]) => g.add(mesh(new T.SphereGeometry(.085, 18, 12), hot ? ember : glass, [x, y, .32])));
    g.add(mesh(new T.CylinderGeometry(.07, .07, .03, 20), ember, [0, .38, .33], [Math.PI / 2, 0, 0]));
    return g;
  }
  function laptop() {
    const g = new T.Group();
    g.add(mesh(slab(3, 2, .12, .12), body, [0, 0, 0], [-Math.PI / 2, 0, 0]));
    const keys = screen(2.6, 1.05, (x, W, H, rr) => {
      x.fillStyle = "#140a06"; x.fillRect(0, 0, W, H);
      const cols = 14, rows = 5, kw = W / cols, kh = H / rows;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) rr(c * kw + 3, r * kh + 3, kw - 6, kh - 6, 5, (r === 2 && c === 9) ? O : "#2a1a12");
    });
    keys.rotation.x = -Math.PI / 2; keys.position.set(0, .061, -.3); g.add(keys);
    g.add(mesh(slab(1.1, .6, .01, .06), satin, [0, .062, .62], [-Math.PI / 2, 0, 0]));
    const hinge = new T.Group(); hinge.position.set(0, .06, -1); hinge.rotation.x = -.28; g.add(hinge);
    hinge.add(mesh(slab(3, 2, .08, .12), body, [0, 1, 0]));
    const scr = screen(2.78, 1.74, (x, W, H, rr) => {
      rr(16, 16, W - 32, 26, 8, D);
      rr(16, 56, 130, H - 72, 12, D);
      rr(160, 56, W - 176, 150, 14, O2);
      x.strokeStyle = O; x.lineWidth = 5; x.beginPath();
      for (let i = 0; i <= 12; i++) { const px = 180 + i * (W - 216) / 12, py = 180 - Math.sin(i * .8) * 30 - i * 6; i ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.stroke();
      for (let i = 0; i < 3; i++) rr(160 + i * ((W - 176) / 3), 222, (W - 176) / 3 - 12, H - 238, 12, i === 1 ? O2 : D);
      for (let i = 0; i < 6; i++) rr(30, 76 + i * 34, 100, 18, 6, i === 1 ? O : D2);
    });
    scr.position.set(0, 1, .045); hinge.add(scr);
    return g;
  }
  function phone() {
    const g = new T.Group();
    g.add(mesh(slab(1, 2.05, .1, .17), body));
    const scr = screen(.92, 1.96, (x, W, H, rr) => {
      rr(W / 2 - 60, 18, 120, 26, 13, "#000");
      const s = (W - 60) / 4;
      for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) rr(24 + c * s, 90 + r * (s + 22), s - 22, s - 22, 22, (r * 4 + c) % 7 === 2 ? O : D2);
      rr(24, H - 130, W - 48, 100, 30, D);
    });
    scr.position.z = .052; g.add(scr);
    g.add(mesh(slab(.4, .4, .05, .1), body, [-.22, .7, -.07]));
    [[-.31, .79], [-.13, .61]].forEach(([a, b]) => g.add(mesh(new T.CylinderGeometry(.06, .06, .04, 20), glass, [a, b, -.11], [Math.PI / 2, 0, 0])));
    return g;
  }
  function kiosk() {
    const g = new T.Group();
    g.add(mesh(slab(1.4, 3.2, .24, .14), body));
    const scr = screen(1.22, 2.1, (x, W, H, rr) => {
      x.strokeStyle = O; x.lineWidth = 10; x.beginPath(); x.arc(W / 2, H * .38, W * .26, -Math.PI / 2, Math.PI * .9); x.stroke();
      x.strokeStyle = D2; x.lineWidth = 10; x.beginPath(); x.arc(W / 2, H * .38, W * .26, Math.PI * .9, Math.PI * 1.5); x.stroke();
      x.fillStyle = O; x.beginPath(); x.arc(W / 2, H * .38, 18, 0, 7); x.fill();
      for (let i = 0; i < 3; i++) rr(40, H * .66 + i * 62, W - 80, 46, 23, i === 0 ? O2 : D);
    });
    scr.position.set(0, .4, .121); g.add(scr);
    g.add(mesh(slab(.5, .12, .03, .06), satin, [0, -1.3, .125]));
    g.add(mesh(new T.CylinderGeometry(.8, .85, .1, 40), satin, [0, -1.66, 0]));
    return g;
  }
  const MAKE = { headset, glasses, gamepad, laptop, phone, kiosk };

  // all devices live in the opening view, scattered in depth (x, y, z, scale, starting yaw).
  // As you scroll the camera sinks, so they rise and drift away like you are leaving a room.
  const PLAN = small ? [
    { kind: "glasses", p: [3.2, 7.8, -12], s: .75, yaw: -.5 },
    { kind: "headset", p: [-3.8, 4.2, -14], s: .8, yaw: .7 },
    { kind: "gamepad", p: [3.6, -2.2, -13], s: .75, yaw: -.6 },
    { kind: "phone", p: [-4, -6.5, -12], s: .8, yaw: .5 },
    { kind: "laptop", p: [2.6, -9.5, -16], s: .7, yaw: -.5 },
    { kind: "kiosk", p: [-1.2, 10.5, -20], s: .7, yaw: .4 },
  ] : [
    { kind: "glasses", p: [3.4, 7.2, -10], s: 1, yaw: -.5 },
    { kind: "headset", p: [18, 5.5, -16], s: 1.05, yaw: -.8 },
    { kind: "gamepad", p: [2.4, -9.2, -13], s: 1, yaw: -.4 },
    { kind: "laptop", p: [-15, -10, -18], s: 1, yaw: .6 },
    { kind: "phone", p: [-7, 10.5, -17], s: 1, yaw: .5 },
    { kind: "kiosk", p: [19, -7.5, -20], s: .95, yaw: -.5 },
    { kind: "headset", p: [-21, 6, -24], s: .9, yaw: .9 },
  ];
  const K = small ? .0042 : .0046;   // world units per scrolled pixel: slower than the page, so it feels deep
  const devices = PLAN.map((p, i) => {
    const g = MAKE[p.kind]();
    const holder = new T.Group(); holder.add(g); holder.position.set(...p.p); holder.scale.setScalar(p.s); scene.add(holder);
    return { ...p, g, holder, phase: i * 1.7 };
  });

  // rings between the devices
  const ringMat = new T.MeshBasicMaterial({ color: 0xff8a2a, transparent: true, opacity: .5, blending: T.AdditiveBlending, depthWrite: false });
  const rings = [3.2, 1.8, 2.6, 2.2].map((R, i) => {
    const ring = new T.Mesh(new T.TorusGeometry(R, .018, 8, 160), ringMat);
    ring.rotation.set(.6 + i * .3, (i % 2 ? -.4 : .4), 0);
    ring.userData = { spin: (.05 + i * .02) * (i % 2 ? -1 : 1), idx: [1, 2, 4, 6][i], side: i % 2 ? 1 : -1 };
    scene.add(ring); return ring;
  });

  function place() {
    rings.forEach((r, i) => r.position.set(r.userData.side * (small ? 2.4 : 9), -4 - i * 14, -7));
  }

  // ---- embers: tiny additive points drifting upward, kept around the camera
  const rand = (a, b) => a + Math.random() * (b - a);
  const EMBERS = small ? 110 : 220;
  const eg = new T.BufferGeometry();
  const ep = new Float32Array(EMBERS * 3), ev = new Float32Array(EMBERS);
  for (let i = 0; i < EMBERS; i++) { ep[i * 3] = rand(-13, 14); ep[i * 3 + 1] = rand(-12, 10); ep[i * 3 + 2] = rand(-12, 5); ev[i] = rand(.12, .5); }
  eg.setAttribute("position", new T.BufferAttribute(ep, 3));
  const dot = document.createElement("canvas"); dot.width = dot.height = 32;
  const dctx = dot.getContext("2d"), grd = dctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grd.addColorStop(0, "rgba(255,220,170,1)"); grd.addColorStop(.35, "rgba(255,140,40,.8)"); grd.addColorStop(1, "rgba(255,90,0,0)");
  dctx.fillStyle = grd; dctx.fillRect(0, 0, 32, 32);
  scene.add(new T.Points(eg, new T.PointsMaterial({ size: .1, map: new T.CanvasTexture(dot), transparent: true, depthWrite: false, blending: T.AdditiveBlending, color: 0xffa050 })));

  // soft glow that follows the camera (cheap fake bloom)
  const glowC = document.createElement("canvas"); glowC.width = glowC.height = 256;
  const gctx = glowC.getContext("2d"), gg = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gg.addColorStop(0, "rgba(255,140,50,.6)"); gg.addColorStop(.3, "rgba(255,100,20,.24)"); gg.addColorStop(1, "rgba(255,80,0,0)");
  gctx.fillStyle = gg; gctx.fillRect(0, 0, 256, 256);
  const glow = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(glowC), transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
  glow.scale.set(18, 18, 1); scene.add(glow);

  // ---- sizing, input, loop ---------------------------------------------
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    place();
  }
  addEventListener("resize", resize); resize();
  addEventListener("load", place); setTimeout(place, 1500); setTimeout(place, 4000);

  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener("pointermove", e => { tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2; }, { passive: true });
  addEventListener("deviceorientation", e => {
    if (e.gamma == null) return;
    tx = Math.max(-1, Math.min(1, e.gamma / 30)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 40));
  }, { passive: true });
  let lastY = scrollY, boost = 0;

  const clock = new T.Clock();
  let running = true, skip = false;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    mx += (tx - mx) * .04; my += (ty - my) * .04;
    boost += (Math.min(5, Math.abs(scrollY - lastY) * .03) - boost) * .08; lastY = scrollY;
    const camY = -scrollY * K;
    camera.position.set(mx * .9, camY - my * .6, 15);
    camera.lookAt(0, camY, 0);
    glow.position.set(small ? 0 : 5, camY - 1.5, -8);

    for (const d of devices) {
      const [x, y, z] = d.p;
      d.holder.position.set(x, y + Math.sin(t * .45 + d.phase) * .3, z);
      d.g.rotation.y = d.yaw + Math.sin(t * .3 + d.phase) * .35 + (reduce ? 0 : boost * .04 * Math.sin(d.phase));
      d.g.rotation.x = .12 + Math.sin(t * .27 + d.phase) * .1;
      d.g.rotation.z = Math.sin(t * .22 + d.phase) * .06;
    }
    for (const r of rings) r.rotation.z += r.userData.spin * dt * (1 + boost);
    ringMat.opacity = .42 + Math.sin(t * 1.3) * .1;

    const pa = eg.attributes.position.array;
    for (let i = 0; i < EMBERS; i++) {
      pa[i * 3 + 1] += ev[i] * dt; pa[i * 3] += Math.sin(t + i) * .002;
      if (pa[i * 3 + 1] > camY + 10) pa[i * 3 + 1] = camY - 11;
      else if (pa[i * 3 + 1] < camY - 12) pa[i * 3 + 1] = camY + 9;
    }
    eg.attributes.position.needsUpdate = true;

    skip = !skip;
    if (!(skip && document.documentElement.classList.contains("sc-on"))) renderer.render(scene, camera);
    if (running && !reduce) requestAnimationFrame(frame);
  }
  document.addEventListener("visibilitychange", () => {
    const was = running; running = !document.hidden;
    if (running && !was && !reduce) { clock.getDelta(); requestAnimationFrame(frame); }
  });
  if (reduce) addEventListener("scroll", () => requestAnimationFrame(frame), { passive: true });
  frame();
  host.classList.add("is-ready");
})();
