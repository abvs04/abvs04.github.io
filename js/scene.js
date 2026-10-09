/* =====================================================================
   Scene — floating rock cubes in a fire-lit cavern, drawn with Three.js.
   Sits fixed behind the page. Moves slowly on its own, leans toward the
   cursor and drifts as you scroll. Stops rendering when the tab is
   hidden, and renders a single still frame for reduced-motion users.
   ===================================================================== */
(() => {
  const host = document.querySelector("[data-scene]");
  if (!host || !window.THREE) return;
  const THREE = window.THREE;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = matchMedia("(max-width: 760px)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: "low-power" });
  } catch (e) { return; } // no WebGL: the CSS glow stays as the background
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1 : 1.25));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x2a130a, 0.05);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 80);
  camera.position.set(0, 0, 14);

  // ---- light: one hot ember core, a warm fill, a cool-ish rim -------
  scene.add(new THREE.HemisphereLight(0xffb27a, 0x1a0904, .6));
  const core = new THREE.PointLight(0xff7a1a, 4, 40, 1.6);
  core.position.set(3.5, -1, -2);
  scene.add(core);
  const fill = new THREE.PointLight(0xff9a40, 1.4, 30, 2);
  fill.position.set(-6, 4, 6);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffc89a, .7);
  rim.position.set(-4, 6, -8);
  scene.add(rim);

  // ---- rocks: jittered boxes, flat shaded so the facets read --------
  const rand = (a, b) => a + Math.random() * (b - a);
  function rockGeometry(size) {
    const g = new THREE.BoxGeometry(size, size * rand(0.75, 1.15), size * rand(0.8, 1.2), 2, 2, 2);
    const p = g.attributes.position, v = new THREE.Vector3(), map = new Map();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const k = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`; // keep shared corners welded
      if (!map.has(k)) map.set(k, [rand(-.14, .14) * size, rand(-.14, .14) * size, rand(-.14, .14) * size]);
      const d = map.get(k);
      p.setXYZ(i, v.x + d[0], v.y + d[1], v.z + d[2]);
    }
    g.computeVertexNormals();
    return g;
  }
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x8c4f2b, roughness: 0.88, metalness: 0.02, flatShading: true });
  const hotMat = new THREE.MeshStandardMaterial({ color: 0x9c5a32, roughness: 0.75, metalness: 0.05, flatShading: true, emissive: 0xff5a10, emissiveIntensity: 0.28 });

  const rocks = [];
  const COUNT = small ? 22 : 42;
  for (let i = 0; i < COUNT; i++) {
    const size = Math.random() < 0.15 ? rand(1.3, 2.2) : rand(0.25, 0.95);
    const mesh = new THREE.Mesh(rockGeometry(size), Math.random() < 0.25 ? hotMat : rockMat);
    // bias the field to the right half so the copy on the left stays calm
    const x = rand(-6, 12) * (small ? 0.6 : 1);
    mesh.position.set(x, rand(-14, 7), rand(-14, 4));
    mesh.rotation.set(rand(0, 6.28), rand(0, 6.28), rand(0, 6.28));
    mesh.userData = { spin: [rand(-.2, .2), rand(-.25, .25), rand(-.15, .15)], bob: rand(0, 6.28), base: mesh.position.y, amp: rand(.1, .35) };
    scene.add(mesh);
    rocks.push(mesh);
  }

  // ---- embers: tiny additive points drifting upward -----------------
  const EMBERS = small ? 140 : 320;
  const eg = new THREE.BufferGeometry();
  const ep = new Float32Array(EMBERS * 3), ev = new Float32Array(EMBERS);
  for (let i = 0; i < EMBERS; i++) {
    ep[i * 3] = rand(-10, 14); ep[i * 3 + 1] = rand(-16, 10); ep[i * 3 + 2] = rand(-12, 6);
    ev[i] = rand(.15, .6);
  }
  eg.setAttribute("position", new THREE.BufferAttribute(ep, 3));
  const dot = document.createElement("canvas"); dot.width = dot.height = 32;
  const dctx = dot.getContext("2d"), grd = dctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grd.addColorStop(0, "rgba(255,220,170,1)"); grd.addColorStop(.35, "rgba(255,140,40,.8)"); grd.addColorStop(1, "rgba(255,90,0,0)");
  dctx.fillStyle = grd; dctx.fillRect(0, 0, 32, 32);
  const embers = new THREE.Points(eg, new THREE.PointsMaterial({
    size: 0.12, map: new THREE.CanvasTexture(dot), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffa050
  }));
  scene.add(embers);

  // ---- glow sprite behind the ember core (cheap fake bloom) ---------
  const glowC = document.createElement("canvas"); glowC.width = glowC.height = 256;
  const gctx = glowC.getContext("2d"), gg = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gg.addColorStop(0, "rgba(255,150,60,.85)"); gg.addColorStop(.3, "rgba(255,100,20,.35)"); gg.addColorStop(1, "rgba(255,80,0,0)");
  gctx.fillStyle = gg; gctx.fillRect(0, 0, 256, 256);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowC), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.set(16, 16, 1); glow.position.set(4, -1.5, -6);
  scene.add(glow);

  // ---- sizing, input, loop ------------------------------------------
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize); resize();

  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener("pointermove", e => { tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2; }, { passive: true });
  const scrollFrac = () => Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));

  const clock = new THREE.Clock();
  let running = true, skip = false;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    const sf = scrollFrac();
    camera.position.x = mx * 0.8;
    camera.position.y = -my * 0.5 - sf * 9;        // descend into the cavern as you scroll
    camera.lookAt(1.5, camera.position.y * 0.85, 0);
    for (const r of rocks) {
      const u = r.userData;
      r.rotation.x += u.spin[0] * dt; r.rotation.y += u.spin[1] * dt; r.rotation.z += u.spin[2] * dt;
      r.position.y = u.base + Math.sin(t * 0.4 + u.bob) * u.amp;
    }
    const pa = eg.attributes.position.array;
    for (let i = 0; i < EMBERS; i++) {
      pa[i * 3 + 1] += ev[i] * dt;
      pa[i * 3] += Math.sin(t + i) * 0.002;
      if (pa[i * 3 + 1] > 10) pa[i * 3 + 1] = -16;
    }
    eg.attributes.position.needsUpdate = true;
    core.intensity = 4 + Math.sin(t * 2.3) * 0.3 + Math.sin(t * 5.1) * 0.12; // flicker
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
