/* =====================================================================
   Showcase — five featured projects told as scroll-driven chapters.

   Layout (desktop):   story panel  |  stage  |  rail + collected pile
   Layout (narrow):    rail on top, stage in the middle, story sheet below

   Each chapter has four layers:
     back   a huge outlined title drifting slower than everything else
     tint   the stage glow shifts to the project's colour
     mid    the footage card (shape of the real clip) + up to 3 stills
            that peel off it and float at different depths
     front  the story: The problem → What I did → The result, then the
            numbers count up
   Each card enters differently (from depth, rising, zooming, swinging),
   then flies into the collected pile. Layer order is set by phase, so a
   card never passes through another. Scroll is eased, so wheel steps
   glide. Reduced motion → a plain list with the same story text.
   ===================================================================== */
(() => {
  const section = document.querySelector("[data-showcase]");
  if (!section) return;
  const P = window.PROFILE, API = window.PORTFOLIO, CH = window.CHAPTERS || {}, MEDIA = window.MEDIA || {};
  const items = (P.showcase || []).map(s => API.bySlug[s]).filter(Boolean);
  const N = items.length;
  const { esc, m, statusClass } = API;
  const $ = s => section.querySelector(s);
  const deck = $("[data-sc-deck]"), story = $("[data-sc-story]"), rail = $("[data-sc-rail]");
  const stage = $("[data-stage]"), guide = $("[data-sc-guide]"), titles = $("[data-sc-titles]"), tint = $("[data-sc-tint]");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = n => String(n).padStart(2, "0");
  const ch = p => CH[p.slug] || { kicker: p.title, tint: "255, 138, 42", problem: p.brief, did: (p.role || [])[0] || "", result: (p.outcomes || [])[0] || "", stats: [], sats: [] };
  const feat = p => (MEDIA[p.slug] && MEDIA[p.slug].feature) || { src: p.media.loop, poster: p.media.poster, w: 1600, h: 1000 };
  const BEATS = ["The problem", "What I did", "The result"];

  const storyHTML = (p, i) => {
    const c = ch(p);
    return `
    <div class="sc-story__head"><span class="readout">Chapter <b>${pad(i + 1)}</b> / ${pad(N)}</span>
      <span class="status ${statusClass(p.status)} readout">${p.status}</span></div>
    <h2 class="sc-title">${esc(p.title)}</h2>
    <p class="sc-client">${esc(p.client)} · ${esc(p.sector)}</p>
    <ol class="sc-beats">${[c.problem, c.did, c.result].map((t, k) => `
      <li class="sc-beat" data-beat="${k}"><span class="sc-beat__k readout">${BEATS[k]}</span><p>${esc(t)}</p></li>`).join("")}
    </ol>
    <div class="sc-stats">${(c.stats || []).map(s => `
      <div><b ${typeof s.v === "number" ? `data-count="${s.v}"` : ""}>${typeof s.v === "number" ? s.v : esc(s.v)}</b><span>${esc(s.l)}</span></div>`).join("")}
    </div>
    <div class="sc-foot">
      <div class="sc-tags">${(p.tags || []).slice(0, 2).map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      <button class="btn btn--primary btn--sm" data-sc-open="${p.slug}">Full project <span class="btn__arrow" aria-hidden="true">→</span></button>
    </div>`;
  };

  section.addEventListener("click", e => { const b = e.target.closest("[data-sc-open]"); if (b) API.openCase(b.dataset.scOpen); });
  if (!N) { section.remove(); return; }

  if (reduce) {
    section.classList.add("is-static");
    $("[data-sc-fallback]").innerHTML = items.map((p, i) => `
      <article class="glass sc-static"><img src="${m(p.slug, feat(p).poster)}" alt=""><div class="sc-story is-static">${storyHTML(p, i)}</div></article>`).join("");
    section.querySelectorAll(".sc-beat").forEach(b => b.classList.add("is-on"));
    section.querySelectorAll(".sc-stats").forEach(b => b.classList.add("is-on"));
    return;
  }

  /* ---------- build layers ---------- */
  titles.innerHTML = items.map(p => `<span class="sc-bigtitle" aria-hidden="true">${esc(ch(p).kicker)}</span>`).join("");
  const bigs = [...titles.children];

  deck.innerHTML = items.map((p, i) => `
    <div class="sc-card" data-i="${i}" aria-label="${esc(p.title)}">
      <video muted loop playsinline preload="none" poster="${m(p.slug, feat(p).poster)}"></video>
      <span class="sc-card__sheen" aria-hidden="true"></span>
      <span class="sc-card__label readout">${pad(i + 1)} · ${esc(p.client)}</span>
    </div>` + (ch(p).sats || []).slice(0, 3).map((f, k) => `
    <div class="sc-sat" data-for="${i}" data-k="${k}" aria-hidden="true"><img src="${m(p.slug, f)}" alt="" decoding="async"></div>`).join("")).join("");

  const cards = [...deck.querySelectorAll(".sc-card")].map((el, i) => ({
    el, i, video: el.querySelector("video"), f: feat(items[i]),
    src: feat(items[i]).src ? m(items[i].slug, feat(items[i]).src) : null, pile: .3, w: 600, h: 400, sw: 200, sh: 140,
    sats: [...deck.querySelectorAll(`.sc-sat[data-for="${i}"]`)]
  }));

  /* ---------- rail ---------- */
  rail.innerHTML = `
    <div class="sc-rail__head"><span class="readout">Featured work</span><span class="readout" data-sc-now>01 / ${pad(N)}</span></div>
    <ol class="sc-rail__segs">${items.map((p, i) => `
      <li><button data-sc-go="${i}" aria-label="Go to ${esc(p.title)}"><span class="sc-seg"><i></i></span><span class="sc-seg__name">${esc(p.title)}</span></button></li>`).join("")}
    </ol>
    <a class="sc-skip" href="#missions">Skip to all work <span aria-hidden="true">↓</span></a>`;
  const segs = [...rail.querySelectorAll("[data-sc-go]")], segFill = segs.map(b => b.querySelector("i"));
  const nowEl = rail.querySelector("[data-sc-now]");
  const span = () => section.offsetHeight - innerHeight;
  const U0 = .08;                                     // a short lead-in before chapter 1 arrives
  const scrollToCard = (i, at = .02) => scrollTo({ top: section.offsetTop + span() * ((i + at + U0) / (N + U0)), behavior: "smooth" });
  rail.addEventListener("click", e => { const b = e.target.closest("[data-sc-go]"); if (b) scrollToCard(+b.dataset.scGo); });

  /* ---------- helpers ---------- */
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const clamp01 = t => Math.max(0, Math.min(1, t));
  const mix = (a, b, t) => Object.fromEntries(Object.keys(a).map(k => [k, lerp(a[k], b[k], t)]));

  /* ---------- layout: everything measured in px, y pointing up ---------- */
  let small = false, cx = 0, cy = 0, px = 0, py = 0, U = 100, SAT = [], BL = -400, BR = 400, BT = 400, BB = -400;
  function layout() {
    small = innerWidth < 1100;
    section.classList.toggle("is-narrow", small);
    const H = innerHeight, W = innerWidth;
    // measure against the stage, which may not be pinned yet
    const st0 = stage.getBoundingClientRect(), rel = el => { const r = el.getBoundingClientRect(); return { top: r.top - st0.top, bottom: r.bottom - st0.top, left: r.left, right: r.right, width: r.width }; };
    const sr = rel(story), rr = rel(rail);
    let L, R, T, B;
    if (small) { L = 16; R = W - 16; T = rr.bottom + 14; B = sr.top - 14; }
    else { L = sr.right + 28; R = rr.left - 28; T = sr.top; B = H - 32; }
    if (!(B - T > 120)) { T = H * .18; B = H * .55; }  // story not measured yet
    const bw = (R - L) * (small ? 1 : .8), bh = (B - T) * (small ? .8 : .9);
    cx = (L + R) / 2 - W / 2; cy = -((T + B) / 2 - H / 2);
    BL = L - W / 2 - 24; BR = R - W / 2 + 24;   // stills stay inside the stage area
    BT = T - H / 2 - (small ? 0 : 24); BB = B - H / 2 + 24;     // screen y, down positive
    U = Math.min(W, 1400) / 10;                       // one "unit" of travel for entrances
    // the collected pile: under the rail on desktop, off-screen on narrow
    px = small ? -W * .7 : (rr.left + rr.width / 2) - W / 2;
    py = small ? H * .1 : -((rr.bottom + H) / 2 - H / 2);   // centre of the space below the rail
    for (const c of cards) {
      const k = Math.min(bw / c.f.w, bh / c.f.h, 1.15);
      c.w = Math.round(c.f.w * k); c.h = Math.round(c.f.h * k);
      Object.assign(c.el.style, { width: c.w + "px", height: c.h + "px", marginLeft: -c.w / 2 + "px", marginTop: -c.h / 2 + "px" });
      c.pile = Math.min((small ? 120 : Math.min(200, rr.width * .8)) / c.w, 150 / c.h);
      c.sw = Math.round(Math.max(110, Math.min(c.w * .4, small ? 150 : 230))); c.sh = Math.round(c.sw * .66);
      c.sats.forEach(s => Object.assign(s.style, { width: c.sw + "px", height: c.sh + "px", marginLeft: -c.sw / 2 + "px", marginTop: -c.sh / 2 + "px" }));
    }
    // where each still floats: on the card's edge, pushed out into the free space
    SAT = small
      ? [{ x: .44, y: .5, z: 80, r: 5 }, { x: -.44, y: -.5, z: 140, r: -5 }, null]
      : [{ x: .5, y: .44, z: 110, r: 5 }, { x: .52, y: -.46, z: 180, r: -4 }, { x: -.5, y: -.42, z: -120, r: -6 }];
  }
  addEventListener("resize", layout);

  /* ---------- choreography (t = scroll position within a chapter) ---------- */
  const ARRIVE = .28, HOLD = .74;
  const C = () => ({ x: cx, y: cy, z: 0, ry: 0, rx: 0, rz: 0, s: 1, o: 1 });
  const ENTER = [
    () => ({ x: cx + 5 * U, y: cy - .6 * U, z: -14 * U, ry: -32, rx: 4, rz: 3, s: 1, o: 0 }),  // from depth, right
    () => ({ x: cx, y: cy - 5.5 * U, z: -2 * U, ry: 0, rx: -38, rz: 0, s: 1, o: 0 }),           // rising from below
    () => ({ x: cx, y: cy, z: -36 * U, ry: 0, rx: 0, rz: -6, s: 1, o: 0 }),                     // out of the distance
    () => ({ x: cx + 6 * U, y: cy, z: -5 * U, ry: -70, rx: 0, rz: 0, s: 1, o: 0 })             // swinging in like a door
  ];
  const S = i => small
    ? ({ x: px, y: py, z: -4 * U, ry: 20, rx: 0, rz: 6, s: cards[i].pile, o: 0 })
    : ({ x: px + (i - 1.5) * 22, y: py + i * 10, z: i * 2, ry: 0, rx: 0, rz: [-9, 6, -4, 8, -2][i % 5], s: cards[i].pile, o: 1 });

  function stateFor(t, i) {
    if (i === N - 1) t = Math.min(t, HOLD);
    const E = ENTER[i % 4];
    if (t < -ARRIVE) return E();
    if (t < 0) return mix(E(), C(), ease((t + ARRIVE) / ARRIVE));
    if (t < HOLD) { const c = C(); c.z = t * 60; return c; }
    const b = t < 1 ? ease((t - HOLD) / (1 - HOLD)) : 1, from = C(); from.z = HOLD * 60;
    const st = mix(from, S(i), b);
    st.y += Math.sin(b * Math.PI) * .9 * U; st.rz -= Math.sin(b * Math.PI) * 10; st.z += Math.sin(b * Math.PI) * 2 * U;
    return st;
  }

  /* ---------- input ---------- */
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener("pointermove", e => { tmx = e.clientX / innerWidth - .5; tmy = e.clientY / innerHeight - .5; }, { passive: true });
  // phones: tilting the device moves the cards the way a cursor would (Android shares motion without asking)
  const touch = matchMedia("(hover: none)").matches;
  if (touch) addEventListener("deviceorientation", e => {
    if (e.gamma == null) return;
    tmx = Math.max(-.5, Math.min(.5, e.gamma / 40));
    tmy = Math.max(-.5, Math.min(.5, (e.beta - 50) / 50));
  }, { passive: true });
  const buzz = ms => { if (touch && navigator.vibrate) try { navigator.vibrate(ms); } catch (_) {} };
  deck.addEventListener("click", e => {
    const c = e.target.closest(".sc-card, .sc-sat"); if (!c) return;
    const i = +(c.dataset.i ?? c.dataset.for);
    i === active ? API.openCase(items[i].slug) : scrollToCard(i);
  });

  /* ---------- chapter + beat state ---------- */
  let active = -1, beat = -1, wantBeat = 0;
  const countUp = () => story.querySelectorAll("[data-count]").forEach(b => {
    const to = +b.dataset.count, t0 = performance.now();
    const step = tt => { const k = Math.min(1, (tt - t0) / 900); b.textContent = Math.round(to * easeOut(k)).toLocaleString(); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
  function setActive(i) {
    if (i === active) return;
    const first = active < 0;
    if (!first) buzz(10);
    active = i;
    document.dispatchEvent(new CustomEvent("pf:track", { detail: { name: "showcase_chapter", params: { chapter: i + 1, project: items[i].slug } } }));
    story.classList.add("is-out");
    setTimeout(() => {
      if (active !== i) return;
      story.innerHTML = storyHTML(items[i], i);
      story.classList.remove("is-out");
      beat = -1; setBeat(wantBeat);
      if (first) layout();
    }, first ? 0 : 200);
    nowEl.textContent = `${pad(i + 1)} / ${pad(N)}`;
    segs.forEach((b, k) => b.setAttribute("aria-current", k === i));
    cards.forEach(c => c.el.classList.toggle("is-active", c.i === i));
    tint.style.setProperty("--tint", ch(items[i]).tint);
  }
  function setBeat(b) {
    wantBeat = b;
    if (b === beat || story.classList.contains("is-out")) return;
    beat = b;
    story.querySelectorAll(".sc-beat").forEach((li, k) => { li.classList.toggle("is-on", k === b); li.classList.toggle("is-done", k < b); });
    const stats = story.querySelector(".sc-stats");
    if (!stats) return;
    if (b >= 2 && !stats.classList.contains("is-on")) { stats.classList.add("is-on"); countUp(); }
    if (b < 2) stats.classList.remove("is-on");
  }

  /* ---------- loop ---------- */
  const raw = () => clamp01(-section.getBoundingClientRect().top / Math.max(1, span()));
  let cur = raw(), last = performance.now(), running = false;

  function frame(tNow) {
    const dt = Math.min(.05, (tNow - last) / 1000); last = tNow;
    const k = 1 - Math.pow(.0006, dt);
    cur += (raw() - cur) * k;
    mx += (tmx - mx) * k * .8; my += (tmy - my) * k * .8;

    const u = cur * (N + U0) - U0;                     // position in chapters
    const ai = Math.max(0, Math.min(N - 1, Math.floor(u + ARRIVE)));
    setActive(ai);
    const ta = Math.min(u - ai, ai === N - 1 ? HOLD : 1);
    setBeat(ta < .18 ? 0 : ta < .42 ? 1 : 2);
    guide.classList.toggle("is-hidden", cur > .015);
    segFill.forEach((f, i) => (f.style.transform = `scaleX(${clamp01((u - i + ARRIVE) / (HOLD + ARRIVE)).toFixed(3)})`));

    // giant titles drift right→left through their chapter and cross-fade
    bigs.forEach((el, i) => {
      const t = i === N - 1 ? Math.min(u - i, .55) : u - i;
      const o = clamp01(1 - Math.abs(t - .28) / .6);
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(${(12 - t * 26 - mx * 3).toFixed(2)}vw, calc(-50% + ${(-my * 2).toFixed(2)}vh), 0)`;
    });

    for (const c of cards) {
      const t = u - c.i, tc = c.i === N - 1 ? Math.min(t, HOLD) : t, st = stateFor(t, c.i);
      const centred = tc > -ARRIVE && tc < 1 ? 1 - Math.min(1, Math.abs(tc - HOLD / 2) / (HOLD / 2 + ARRIVE)) : 0;
      const tx = st.x + mx * 24 * centred, ty = -(st.y - my * 16 * centred);
      const rx = st.rx + my * -6 * centred, ry = st.ry + mx * 9 * centred;
      c.el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${st.z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${st.rz.toFixed(2)}deg) scale(${st.s.toFixed(3)})`;
      c.el.style.opacity = st.o.toFixed(3);
      c.el.style.visibility = st.o < .01 ? "hidden" : "visible";
      c.el.style.zIndex = String(tc >= 1 ? 2000 + c.i : tc >= HOLD ? 3100 : tc >= -ARRIVE ? 3000 : 1000);
      c.el.style.setProperty("--sx", (50 + mx * 80 * centred).toFixed(1) + "%");
      c.el.style.setProperty("--sy", (30 + my * 60 * centred).toFixed(1) + "%");

      // stills peel off the card one by one, float at their own depth, fold back in on exit
      c.sats.forEach((s, k) => {
        const p = SAT[k];
        if (!p) { s.style.visibility = "hidden"; return; }
        const inT = clamp01((tc - .02 - k * .08) / .16), outT = clamp01((tc - HOLD + .04) / .12);
        const e = easeOut(inT) * (1 - ease(outT));
        const depth = 1 + p.z / 300;
        let ox = p.x * c.w + Math.sign(p.x) * c.sw * .15, oy = p.y * c.h + Math.sign(p.y) * c.sh * .1;
        ox = Math.max(BL + c.sw / 2 - cx, Math.min(BR - c.sw / 2 - cx, ox));
        oy = Math.max(-cy - (BB - c.sh / 2), Math.min(-cy - (BT + c.sh / 2), oy));   // oy points up
        const sx = cx + lerp(0, ox, e) + mx * 34 * depth * e, sy = -cy + lerp(0, -oy, e) + my * 24 * depth * e;
        s.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, ${(p.z * e + tc * 60).toFixed(1)}px) rotateZ(${(p.r * e).toFixed(2)}deg) rotateY(${(mx * 10 * e).toFixed(2)}deg) scale(${(.5 + .5 * e).toFixed(3)})`;
        s.style.opacity = e.toFixed(3);
        s.style.visibility = e < .01 ? "hidden" : "visible";
        s.style.zIndex = String(p.z > 0 ? 3050 : 2950);
      });

      const near = t > -1 && (t < 1.05 || c.i === N - 1);
      if (near && c.src && !c.video.src) { c.video.src = c.src; c.video.preload = "auto"; }
      if (near && c.video.paused && c.video.src) c.video.play().catch(() => {});
      if (!near && !c.video.paused) c.video.pause();
    }
    if (running) requestAnimationFrame(frame);
  }

  setActive(0);
  layout();
  new IntersectionObserver(([en]) => {
    const was = running; running = en.isIntersecting;
    document.documentElement.classList.toggle("sc-on", running);
    if (running && !was) { layout(); last = performance.now(); cur = raw(); requestAnimationFrame(frame); }
    if (!running) cards.forEach(c => c.video.pause());
  }, { rootMargin: "120px" }).observe(section);
})();
