/* =====================================================================
   Scene — obsidian crystals and thin orbit rings in a warm studio light,
   drawn with Three.js. Sits fixed behind the page. Objects keep to the
   edges so text stays calm, lean toward the cursor (or phone tilt),
   spin a little faster while you scroll, and the camera descends as the
   page scrolls. Stops rendering when the tab is hidden; reduced-motion
   users get still frames.
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
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  host.appendChild(renderer.domElement);

  const scene = new T.Scene();
  scene.fog = new T.FogExp2(0x1e0f07, 0.045);
  const camera = new T.PerspectiveCamera(45, 1, 0.1, 80);
  camera.position.set(0, 0, 15);

  // ---- studio reflections: a dark room with warm soft boxes ----------
  const env = new T.Scene(); env.background = new T.Color(0x070403);
  const softbox = (w, h, hex, k, pos, rot) => {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(hex).multiplyScalar(k), side: T.DoubleSide }));
    m.position.set(...pos); m.rotation.set(...rot); env.add(m);
  };
  softbox(12, 3, 0xfff1e4, 2.4, [0, 7, 1], [Math.PI / 2, 0, 0]);          // top key
  softbox(2.5, 10, 0xff7a1a, 3.2, [8, 0, 1], [0, -Math.PI / 2.2, 0]);     // orange strip, right
  softbox(2, 8, 0xffc08a, 1.4, [-8, 1, 2], [0, Math.PI / 2.4, 0]);        // warm fill, left
  softbox(14, 2, 0xff5a00, .8, [0, -6, 3], [-Math.PI / 2.3, 0, 0]);       // ember bounce from below
  const pmrem = new T.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(env, 0.03).texture;
  pmrem.dispose();

  // a hot core light so nearby facets pick up orange
  const core = new T.PointLight(0xff7a1a, 2.4, 30, 1.8);
  core.position.set(4, -1, -2);
  scene.add(core);
  const key = new T.DirectionalLight(0xffd8b4, .9); key.position.set(-5, 8, 6); scene.add(key);

  // ---- materials -----------------------------------------------------
  const srgb = hex => new T.Color(hex).convertSRGBToLinear();
  const obsidian = new T.MeshPhysicalMaterial({ color: srgb(0x2e1d14), metalness: .35, roughness: .12, clearcoat: 1, clearcoatRoughness: .06, flatShading: true, envMapIntensity: 2.2 });
  const ember = new T.MeshPhysicalMaterial({ color: srgb(0xff6a14), metalness: .3, roughness: .28, clearcoat: 1, clearcoatRoughness: .1, flatShading: true, emissive: srgb(0xff3c00), emissiveIntensity: .12, envMapIntensity: .9 });
  const smoke = new T.MeshPhysicalMaterial({ color: srgb(0x7a5038), metalness: .15, roughness: .35, clearcoat: .8, flatShading: true, transparent: true, opacity: .6, envMapIntensity: 1.6 });

  // ---- crystals: stretched octahedra and icosahedra -------------------
  const rand = (a, b) => a + Math.random() * (b - a);
  const shard = s => { const g = new T.OctahedronGeometry(s, 0); g.scale(.62, 1.35, .62); return g; };
  const gem = s => new T.IcosahedronGeometry(s, 0);
  // keep objects to the sides: x from the left edge band or the right band
  const sideX = () => (Math.random() < .3 ? rand(-11, -5.5) : rand(4, 12)) * (small ? .55 : 1);

  const objs = [];
  const COUNT = small ? 9 : 18;
  for (let i = 0; i < COUNT; i++) {
    const big = Math.random() < .2;
    const s = big ? rand(1.1, 1.8) : rand(.35, .85);
    const geo = Math.random() < .6 ? shard(s) : gem(s * .85);
    const r = Math.random(), mat = r < .2 ? ember : r < .35 ? smoke : obsidian;
    const m = new T.Mesh(geo, mat);
    m.position.set(sideX(), rand(-15, 7), rand(-12, 3));
    m.rotation.set(rand(0, 6.28), rand(0, 6.28), rand(0, 6.28));
    m.userData = { spin: [rand(-.12, .12), rand(-.18, .18), rand(-.08, .08)], bob: rand(0, 6.28), base: m.position.y, amp: rand(.12, .3) };
    scene.add(m); objs.push(m);
  }

  // ---- orbit rings: thin glowing hoops, an XR-ish accent --------------
  const rings = [];
  const ringMat = new T.MeshBasicMaterial({ color: 0xff8a2a, transparent: true, opacity: .55, blending: T.AdditiveBlending, depthWrite: false });
  [[3.2, [8, 2.5, -6]], [1.6, [-8, -6, -3]], [2.4, [9, -11, -5]]].slice(0, small ? 2 : 3).forEach(([R, p]) => {
    const ring = new T.Mesh(new T.TorusGeometry(R, .018, 8, 160), ringMat);
    ring.position.set(p[0] * (small ? .55 : 1), p[1], p[2]);
    ring.rotation.set(rand(.6, 1.3), rand(-.5, .5), 0);
    ring.userData = { spin: rand(.05, .12) * (Math.random() < .5 ? -1 : 1) };
    scene.add(ring); rings.push(ring);
  });

  // ---- embers: tiny additive points drifting upward -------------------
  const EMBERS = small ? 110 : 240;
  const eg = new T.BufferGeometry();
  const ep = new Float32Array(EMBERS * 3), ev = new Float32Array(EMBERS);
  for (let i = 0; i < EMBERS; i++) {
    ep[i * 3] = rand(-12, 14); ep[i * 3 + 1] = rand(-16, 10); ep[i * 3 + 2] = rand(-12, 6);
    ev[i] = rand(.12, .5);
  }
  eg.setAttribute("position", new T.BufferAttribute(ep, 3));
  const dot = document.createElement("canvas"); dot.width = dot.height = 32;
  const dctx = dot.getContext("2d"), grd = dctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grd.addColorStop(0, "rgba(255,220,170,1)"); grd.addColorStop(.35, "rgba(255,140,40,.8)"); grd.addColorStop(1, "rgba(255,90,0,0)");
  dctx.fillStyle = grd; dctx.fillRect(0, 0, 32, 32);
  const embers = new T.Points(eg, new T.PointsMaterial({ size: .1, map: new T.CanvasTexture(dot), transparent: true, depthWrite: false, blending: T.AdditiveBlending, color: 0xffa050 }));
  scene.add(embers);

  // ---- soft glow behind the right-hand cluster (cheap fake bloom) ------
  const glowC = document.createElement("canvas"); glowC.width = glowC.height = 256;
  const gctx = glowC.getContext("2d"), gg = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gg.addColorStop(0, "rgba(255,140,50,.7)"); gg.addColorStop(.3, "rgba(255,100,20,.28)"); gg.addColorStop(1, "rgba(255,80,0,0)");
  gctx.fillStyle = gg; gctx.fillRect(0, 0, 256, 256);
  const glow = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(glowC), transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
  glow.scale.set(16, 16, 1); glow.position.set(5, -1.5, -7);
  scene.add(glow);

  // ---- sizing, input, loop --------------------------------------------
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize); resize();

  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener("pointermove", e => { tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2; }, { passive: true });
  addEventListener("deviceorientation", e => {
    if (e.gamma == null) return;
    tx = Math.max(-1, Math.min(1, e.gamma / 30)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 40));
  }, { passive: true });
  const scrollFrac = () => Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
  let lastY = scrollY, boost = 0;

  const clock = new T.Clock();
  let running = true, skip = false;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    // scroll speed spins things up a little, then eases back
    boost += (Math.min(6, Math.abs(scrollY - lastY) * .04) - boost) * .08; lastY = scrollY;
    const sf = scrollFrac();
    camera.position.x = mx * .9;
    camera.position.y = -my * .6 - sf * 9;   // descend as you scroll
    camera.lookAt(0, camera.position.y * .9, 0);
    const k = 1 + boost;
    for (const o of objs) {
      const u = o.userData;
      o.rotation.x += u.spin[0] * dt * k; o.rotation.y += u.spin[1] * dt * k; o.rotation.z += u.spin[2] * dt * k;
      o.position.y = u.base + Math.sin(t * .35 + u.bob) * u.amp;
    }
    for (const r of rings) { r.rotation.z += r.userData.spin * dt * k; r.rotation.x += Math.sin(t * .2) * .0006; }
    const pa = eg.attributes.position.array;
    for (let i = 0; i < EMBERS; i++) {
      pa[i * 3 + 1] += ev[i] * dt;
      pa[i * 3] += Math.sin(t + i) * 0.002;
      if (pa[i * 3 + 1] > 10) pa[i * 3 + 1] = -16;
    }
    eg.attributes.position.needsUpdate = true;
    core.intensity = 2.4 + Math.sin(t * 2.3) * .2 + Math.sin(t * 5.1) * .08; // flicker
    ringMat.opacity = .45 + Math.sin(t * 1.3) * .1;
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
