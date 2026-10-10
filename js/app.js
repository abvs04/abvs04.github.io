/* =====================================================================
   App — renders content from data.js + media.js and wires interactions.
   No framework, no build step.
   ===================================================================== */
(() => {
  const P = window.PROFILE, ALL = window.PROJECTS, CATS = window.CATEGORIES, MEDIA = window.MEDIA || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const m = (slug, file) => `media/${slug}/${file}`;
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = n => String(n).padStart(2, "0");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover)").matches;

  // Order: by category (as listed in CATEGORIES), featured projects first, then ones with footage.
  const catOrder = CATS.map(c => c.id);
  const PROJECTS = [...ALL].sort((a, b) =>
    (catOrder.indexOf(a.category) - catOrder.indexOf(b.category)) || (!!b.featured - !!a.featured) || (!!b.media.poster - !!a.media.poster));
  PROJECTS.forEach((p, i) => (p.no = "M" + pad(i + 1)));
  const bySlug = Object.fromEntries(PROJECTS.map(p => [p.slug, p]));
  const statusClass = s => "status--" + s.replace(/\s+/g, "-");
  const ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  const track = (name, params = {}) => document.dispatchEvent(new CustomEvent("pf:track", { detail: { name, params } }));

  /* ---------- profile ---------- */
  $$("[data-profile]").forEach(el => (el.textContent = P[el.dataset.profile] ?? ""));
  const mail = $("[data-profile-email]");
  mail.innerHTML = esc(P.email).replace("@", "<wbr>@"); mail.href = "mailto:" + P.email;
  $("[data-links]").innerHTML = P.links.map(l => `<li><a class="btn btn--glass btn--sm" href="${esc(l.href)}" target="_blank" rel="noopener"${/resume\.pdf$/.test(l.href) ? " data-resume" : ""}>${esc(l.label)}</a></li>`).join("");
  $("[data-year]").textContent = new Date().getFullYear();
  // headline: *word* becomes the highlighted word
  const hl = $("[data-headline]");
  if (hl) hl.innerHTML = esc(P.headlineMarked || P.headline).replace(/\*(.+?)\*/g, '<span class="hl">$1</span>');
  const q = $("[data-quote]");
  if (q && P.quote) q.innerHTML = `<span class="quote__mark" aria-hidden="true">“</span><div><p>${esc(P.quote.text)}</p><cite>${esc(P.quote.by)}</cite></div>`;
  $$("[data-resume]").forEach(a => (a.href = P.resume || "#"));
  // hide Resume links until resume.pdf is actually uploaded next to index.html
  fetch(P.resume || "resume.pdf", { method: "HEAD" }).then(r => { if (!r.ok) throw 0; })
    .catch(() => $$("[data-resume]").forEach(a => ((a.closest("li") || a).hidden = true)));
  const portrait = $("[data-portrait]"); if (portrait) portrait.alt = `Portrait of ${P.name}`;
  document.title = `${P.name} | ${P.role}`;

  /* ---------- stats: career totals from data.js ---------- */
  $("[data-stats]").innerHTML = (P.stats || []).map(st => `<div><dt>${esc(st.l)}</dt><dd>${esc(st.v)}</dd></div>`).join("");

  /* ---------- clients: two drifting rows of names ---------- */
  const cl = $("[data-clients]");
  if (cl && P.clients) {
    const row = (list, label, rev) => `
      <div class="clients__row${rev ? " is-rev" : ""}" aria-label="${label}">
        <span class="clients__label readout">${label}</span>
        <div class="clients__track"><ul>${list.map(n => `<li>${esc(n)}</li>`).join("")}</ul><ul aria-hidden="true">${list.map(n => `<li>${esc(n)}</li>`).join("")}</ul></div>
      </div>`;
    cl.innerHTML = row(P.clients.international, "International") + row(P.clients.india, "Government & industry, India", true);
  }

  /* ---------- intro: media list ---------- */
  const ml = $("[data-media-list]");
  if (ml && P.mediaList) ml.innerHTML = P.mediaList.map(t => `<span class="chip">${esc(t)}</span>`).join("");

  // The old hero feed is gone; these keep the case-file code simple.
  const pauseFeed = () => {}; const fv = { play: () => Promise.resolve(), pause() {} };

  /* ---------- work: themed rows + index ---------- */
  const work = $("[data-work]"), rowsEl = $("[data-rows]"), idxEl = $("[data-index]");
  if (!canHover) $("#missions .section__lede").textContent = "That was the highlight reel. Here’s more of the work, grouped by what it was built for. Swipe a row to browse, tap a card to open the full project.";
  const catLabel = Object.fromEntries(CATS.map(c => [c.id, c.label]));
  const standby = (label = "footage on request") => `
    <span class="standby">
      <svg class="standby__glyph" viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="6" y="14" width="44" height="28"/><path d="M6 22h44M14 14v28M42 14v28"/><circle cx="28" cy="32" r="5"/></svg>
      <span class="readout">${label}</span>
    </span>`;
  const tileHTML = p => `
    <article class="tile" data-slug="${p.slug}" data-cat="${p.category}">
      <a class="tile__btn glass lit" href="#case/${p.slug}" aria-label="${esc(p.title)}, ${esc(p.client)}. Open project" draggable="false">
        <span class="tile__media">
          ${p.media.poster ? `<img src="${m(p.slug, p.media.poster)}" alt="" loading="lazy" decoding="async" draggable="false">` : standby()}
          ${p.media.loop ? `<video muted loop playsinline preload="none" data-src="${m(p.slug, p.media.loop)}"></video>` : ""}
          <span class="tile__id readout">${p.no}</span>
          ${p.media.loop ? `<span class="tile__play readout" aria-hidden="true">▶ preview</span>` : ""}
        </span>
        <span class="tile__meta">
          <span class="readout">${esc(p.medium.toLowerCase())} / ${esc(p.platform.toLowerCase())}</span>
          <span class="status ${statusClass(p.status)} readout">${p.status}</span>
        </span>
        <h3 class="tile__title">${esc(p.title)}</h3>
        <span class="tile__client">${esc(p.client)} · ${esc(p.sector)}</span>
        <span class="tile__foot">
          <span class="tile__tags">${(p.tags || [p.medium]).slice(0, 3).map(t => `<span class="chip">${esc(t)}</span>`).join("")}</span>
          <span class="go" aria-hidden="true">${ARROW}</span>
        </span>
      </a>
    </article>`;

  rowsEl.innerHTML = CATS.filter(c => c.id !== "all").map((c, ci) => {
    const list = PROJECTS.filter(p => p.category === c.id);
    if (!list.length) return "";
    return `
    <section class="row" data-cat="${c.id}" aria-labelledby="row-${c.id}">
      <header class="row__head">
        <span class="row__no readout">${pad(ci + 1)}</span>
        <div class="row__copy">
          <h3 class="row__title" id="row-${c.id}">${esc(c.label)} <span class="row__count readout">${pad(list.length)} projects</span></h3>
          <p class="row__intro">${esc(c.intro || "")}</p>
        </div>
        <div class="row__nav">
          <button type="button" class="row__btn" data-dir="-1" aria-label="Scroll ${esc(c.label)} back"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4"/></svg></button>
          <button type="button" class="row__btn" data-dir="1" aria-label="Scroll ${esc(c.label)} forward"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></button>
        </div>
      </header>
      <div class="row__track" data-track tabindex="-1">${list.map(tileHTML).join("")}</div>
    </section>`;
  }).join("");

  idxEl.innerHTML = `
    <div class="idx__head readout" aria-hidden="true"><span>No.</span><span>Project</span><span>Client</span><span>Built for</span><span>Status</span><span></span></div>
    <ol class="idx__list">${PROJECTS.map(p => `
      <li><a class="idx__row" href="#case/${p.slug}" data-slug="${p.slug}">
        <span class="idx__no readout">${p.no}</span>
        <span class="idx__title">${p.media.poster ? `<img class="idx__thumb" src="${m(p.slug, p.media.poster)}" alt="" loading="lazy">` : ""}<b>${esc(p.title)}</b></span>
        <span class="idx__client">${esc(p.client)}</span>
        <span class="idx__type">${esc(catLabel[p.category] || "")}</span>
        <span class="idx__status"><span class="status ${statusClass(p.status)} readout">${p.status}</span></span>
        <span class="go" aria-hidden="true">${ARROW}</span>
      </a></li>`).join("")}
    </ol>
    <div class="idx-peek" data-peek aria-hidden="true"><img alt=""><video muted loop playsinline></video><span class="readout"></span></div>`;

  const tiles = $$(".tile", work);
  const live = tile => {
    tiles.forEach(t => t !== tile && unlive(t));
    if (!tile) return;
    tile.classList.add("is-live");
    const v = tile.querySelector("video");
    if (v) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); }
  };
  const unlive = t => { t.classList.remove("is-live"); const v = t.querySelector("video"); if (v && !v.paused) v.pause(); };
  if (canHover) {
    rowsEl.addEventListener("pointerover", e => { if (dragging) return; const t = e.target.closest(".tile"); if (t) live(t); });
    rowsEl.addEventListener("pointerleave", () => live(null));
  } else if (!reduceMotion) {
    // Touch: the card nearest the middle of the screen plays
    const io = new IntersectionObserver(es => es.forEach(en => en.isIntersecting ? live(en.target) : unlive(en.target)),
      { rootMargin: "-38% -25% -38% -25%" });
    tiles.forEach(t => io.observe(t));
  }
  rowsEl.addEventListener("focusin", e => { const t = e.target.closest(".tile"); if (t) { live(t); t.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" }); } });

  // rows: arrows, edge fades, drag to scroll with a mouse
  let dragging = false, moved = 0;
  $$(".row", rowsEl).forEach(row => {
    const track = $("[data-track]", row), [back, fwd] = $$(".row__btn", row);
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      back.disabled = track.scrollLeft <= 2; fwd.disabled = track.scrollLeft >= max;
      row.classList.toggle("at-start", track.scrollLeft <= 2); row.classList.toggle("at-end", track.scrollLeft >= max);
      row.classList.toggle("no-scroll", max <= 0);
    };
    track.addEventListener("scroll", sync, { passive: true }); addEventListener("resize", sync); sync();
    row.addEventListener("click", e => { const b = e.target.closest(".row__btn"); if (b) track.scrollBy({ left: +b.dataset.dir * track.clientWidth * .8, behavior: reduceMotion ? "auto" : "smooth" }); });
    let x0 = 0, s0 = 0, id = null;
    track.addEventListener("pointerdown", e => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      id = e.pointerId; x0 = e.clientX; s0 = track.scrollLeft; moved = 0;
    });
    track.addEventListener("pointermove", e => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - x0; moved = Math.max(moved, Math.abs(dx));
      if (moved > 6 && !dragging) { dragging = true; track.classList.add("is-dragging"); track.setPointerCapture(id); live(null); }
      if (dragging) track.scrollLeft = s0 - dx;
    });
    const end = e => {
      if (e.pointerId !== id) return; id = null;
      if (dragging) { track.classList.remove("is-dragging"); requestAnimationFrame(() => (dragging = false)); }
    };
    track.addEventListener("pointerup", end); track.addEventListener("pointercancel", end);
  });

  work.addEventListener("click", e => {
    const a = e.target.closest(".tile__btn, .idx__row"); if (!a || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    if (moved > 6) { moved = 0; return; }           // that was a drag, not a click
    openCase(a.closest("[data-slug]").dataset.slug, true);
  });

  // index: a floating preview follows the cursor
  const peek = $("[data-peek]"), pImg = $("img", peek), pVid = $("video", peek), pLab = $("span", peek);
  let px = 0, py = 0, tx = 0, ty = 0, peekOn = false, peekRaf = 0;
  const peekLoop = () => {
    px += (tx - px) * .18; py += (ty - py) * .18;
    peek.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) rotate(${((tx - px) * .03).toFixed(2)}deg)`;
    peekRaf = peekOn || Math.abs(tx - px) > .5 ? requestAnimationFrame(peekLoop) : 0;
  };
  if (canHover) {
    idxEl.addEventListener("pointermove", e => {
      tx = e.clientX + 28; ty = e.clientY - 110;
      if (tx + 300 > innerWidth) tx = e.clientX - 328;
      if (!peekRaf) { if (!peekOn) { px = tx; py = ty; } peekRaf = requestAnimationFrame(peekLoop); }
    }, { passive: true });
    idxEl.addEventListener("pointerover", e => {
      const r = e.target.closest(".idx__row"); if (!r) return;
      const p = bySlug[r.dataset.slug];
      if (peek.dataset.slug === p.slug && peekOn) return;
      peek.dataset.slug = p.slug;
      pImg.src = p.media.poster ? m(p.slug, p.media.poster) : "";
      pLab.textContent = `${p.no} · ${p.medium}`;
      pVid.pause(); pVid.removeAttribute("src"); peek.classList.remove("has-video");
      if (p.media.loop && !reduceMotion) { pVid.src = m(p.slug, p.media.loop); pVid.play().then(() => peek.classList.add("has-video")).catch(() => {}); }
      peek.classList.toggle("is-empty", !p.media.poster);
      peekOn = true; peek.classList.add("is-on");
    });
    idxEl.addEventListener("pointerleave", () => { peekOn = false; peek.classList.remove("is-on"); pVid.pause(); });
  }

  // Rows | Index switch
  const seg = $("[data-view]");
  seg.addEventListener("click", e => {
    const b = e.target.closest("[data-v]"); if (!b || b.getAttribute("aria-pressed") === "true") return;
    const apply = () => {
      $$("[data-v]", seg).forEach(x => x.setAttribute("aria-pressed", x === b));
      seg.dataset.on = b.dataset.v;
      rowsEl.hidden = b.dataset.v !== "rows"; idxEl.hidden = b.dataset.v !== "index";
      live(null);
    };
    apply(); track("work_view", { view: b.dataset.v });
    const shown = b.dataset.v === "rows" ? rowsEl : idxEl;
    shown.classList.remove("is-entering"); void shown.offsetWidth; shown.classList.add("is-entering");
  });
  seg.dataset.on = "rows";
  const visibleSlugs = () => PROJECTS.map(p => p.slug);

  /* ---------- case file ---------- */
  const dlg = $("[data-casefile]"), body = $("[data-casefile-body]");
  let returnFocus = null, currentSlug = null;

  function assetsFor(p) {
    const md = MEDIA[p.slug] || {};
    const items = [];
    (md.reels || []).forEach((r, i) => items.push({ type: "video", src: m(p.slug, r.src), poster: m(p.slug, r.poster), label: `Reel ${i + 1}`, dur: r.dur }));
    const imgs = [
      ...(p.media.photo ? [p.media.photo] : []),
      ...(p.deck || []),
      ...(p.media.stills || []),
      ...(md.stills || [])
    ];
    imgs.forEach(f => items.push({ type: "image", src: m(p.slug, f) }));
    return items;
  }

  function renderCase(p) {
    const list = visibleSlugs().includes(p.slug) ? visibleSlugs() : PROJECTS.map(x => x.slug);
    const i = list.indexOf(p.slug);
    const prev = bySlug[list[(i - 1 + list.length) % list.length]], next = bySlug[list[(i + 1) % list.length]];
    const items = assetsFor(p);
    const reels = items.filter(a => a.type === "video");
    const imgs = items.filter(a => a.type === "image");
    const fmt = s => `${Math.floor(s / 60)}:${pad(s % 60)}`;

    body.innerHTML = `
      <div class="cf-top">
        <span class="cf-top__path readout">work / <b>${p.no}</b> / ${esc(p.slug)}</span>
        <button class="cf-close" data-close>Close <kbd>esc</kbd></button>
      </div>
      <div class="cf-body">
        <div class="cf-stage">
          <div class="cf-player" data-player>
            ${items.length ? "" : standby(p.sample ? "footage to be added" : "footage on request")}
            <span class="brackets" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          </div>
          ${reels.length > 1 || (reels.length && imgs.length) ? `<div class="cf-reels">${reels.map((r, k) => `
            <button class="cf-reel" aria-pressed="false" data-asset="${items.indexOf(r)}">${r.label} <span class="readout">${fmt(r.dur)}</span></button>`).join("")}</div>` : ""}
          ${imgs.length ? `<div class="cf-thumbs">${imgs.map(a => `
            <button class="cf-thumb" aria-pressed="false" data-asset="${items.indexOf(a)}" aria-label="Show image"><img src="${a.src}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
        </div>
        <div class="cf-info">
          <span class="status ${statusClass(p.status)} readout">${p.status}</span>
          <h2 class="cf-title" id="cf-title">${esc(p.title)}</h2>
          <p class="cf-tagline">${esc(p.tagline)}</p>
          <dl class="cf-specs">
            <div><dt>client</dt><dd>${esc(p.client)}</dd></div>
            <div><dt>sector</dt><dd>${esc(p.sector)}</dd></div>
            <div><dt>medium</dt><dd>${esc(p.medium)}</dd></div>
            <div><dt>platform</dt><dd>${esc(p.platform)}</dd></div>
            <div><dt>my role</dt><dd>Project Manager</dd></div>
            <div><dt>team &amp; time</dt><dd>${esc(p.team)}</dd></div>
          </dl>
          <div class="cf-block"><h3>The brief</h3><p>${esc(p.brief)}</p></div>
          <div class="cf-block"><h3>What I owned</h3><ul class="cf-list">${p.role.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>
          <div class="cf-block"><h3>What shipped</h3><ul class="cf-list">${p.outcomes.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>
          <div class="cf-block"><h3>Stack</h3><div class="cf-chips">${p.stack.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>
        </div>
      </div>
      <nav class="cf-nav" aria-label="Other projects">
        <button data-go="case/${prev.slug}"><span class="readout"><kbd>←</kbd> previous</span><span class="cf-nav__title">${esc(prev.title)}</span></button>
        <button data-go="case/${next.slug}"><span class="readout">next <kbd>→</kbd></span><span class="cf-nav__title">${esc(next.title)}</span></button>
      </nav>`;

    const player = $("[data-player]", body);
    const show = k => {
      const a = items[k]; if (!a) return;
      $$("video, img", player).forEach(n => n.remove());
      const el = document.createElement(a.type === "video" ? "video" : "img");
      el.src = a.src;
      if (a.type === "video") { el.controls = true; el.muted = true; el.defaultMuted = true; el.setAttribute("controlslist", "nodownload"); el.playsInline = true; el.poster = a.poster; el.preload = "metadata"; }
      else el.alt = `${p.title}: image`;
      player.prepend(el);
      $$("[data-asset]", body).forEach(b => b.setAttribute("aria-pressed", +b.dataset.asset === k));
    };
    body.querySelectorAll("[data-asset]").forEach(b => b.addEventListener("click", () => show(+b.dataset.asset)));
    show(0);
    body.querySelector("[data-close]").addEventListener("click", closeCase);
    body.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => goCase(b.dataset.go)));
  }

  function openUI(key) {
    const [type, slug] = key.split("/");
    if (type === "lab") { const l = labBySlug[slug]; if (!l) return; renderLab(l); }
    else { const p = bySlug[slug]; if (!p) return; renderCase(p); }
    currentSlug = key;
    if (!dlg.open) {
      returnFocus = document.activeElement;
      dlg.showModal();
      document.body.classList.add("is-locked", "show-keys");
      pauseFeed(true); fv.pause();
    }
    dlg.scrollTop = 0;
    dlg.querySelector("[data-close]").focus({ preventScroll: true });
  }
  function closeUI() {
    if (!dlg.open) return;
    $$("video", dlg).forEach(v => v.pause());
    dlg.close();
    document.body.classList.remove("is-locked", "show-keys");
    currentSlug = null;
    fv.play().catch(() => {}); pauseFeed(false);
    returnFocus?.focus?.({ preventScroll: true });
  }
  function openCase(slug, push, type = "case") {
    const key = type + "/" + slug;
    track(type === "lab" ? "lab_open" : "project_open", { project: slug });
    if (push) history.pushState({ cf: key }, "", "#" + key);
    openUI(key);
  }
  function goCase(key) { history.replaceState({ cf: key }, "", "#" + key); openUI(key); }
  function closeCase() {
    if (history.state && history.state.cf) history.back();
    else { history.replaceState(null, "", location.pathname + location.search); closeUI(); }
  }
  dlg.addEventListener("cancel", e => { e.preventDefault(); closeCase(); });
  dlg.addEventListener("click", e => { if (e.target === dlg) closeCase(); });
  dlg.addEventListener("keydown", e => {
    if (e.target.closest("video")) return;
    if (e.key === "ArrowLeft") $('[data-go]', body)?.click();
    if (e.key === "ArrowRight") $$('[data-go]', body)[1]?.click();
  });
  const fromHash = () => { const mm = location.hash.match(/^#((?:case|lab)\/[\w-]+)/); mm ? openUI(mm[1]) : closeUI(); };
  addEventListener("popstate", fromHash);
  // deep links are handled once the lab data is ready (end of file)

  /* ---------- lab: a 3D carousel ---------- */
  const LAB = window.LAB || [], LAB_GROUPS = window.LAB_GROUPS || [];
  const labBySlug = Object.fromEntries(LAB.map(l => [l.slug, l]));
  const labImg = (l, n) => `media/lab/${l.slug}-${n}.jpg`;
  const cfImg = (l, n) => `media/lab/cf/${l.slug}-${n}.jpg`;   // 4:3 carousel frames, best image first
  const labStage = $("[data-lab]"), labFilters = $("[data-lab-filters]"), labInfo = $("[data-lab-info]");
  const labCount = $("[data-lab-count]"), labProg = $("[data-lab-prog]");
  let labCat = "all";
  if (labStage) {
    labStage.innerHTML = LAB.map((l, i) => `
      <button type="button" class="cf-card" data-lab-i="${i}" data-group="${l.group}" tabindex="-1" aria-label="${esc(l.title)}">
        ${Array.from({ length: Math.max(1, l.images || 1) }, (_, k) => `<img ${k ? `data-src="${cfImg(l, k + 1)}"` : `src="${cfImg(l, 1)}"`} alt="" decoding="async" draggable="false"${k ? "" : ' class="is-on"'}>`).join("")}
        <span class="cf-card__sheen" aria-hidden="true"></span>
      </button>`).join("");
    const cards = $$(".cf-card", labStage);
    let list = cards.map((_, i) => i);          // indices visible under the current filter
    let pos = 0, target = 0, cardW = 520, base = 340, step = 150, drag = null, imgTimer = 0;

    const sizeUp = () => {
      const w = labStage.clientWidth, small = w < 700;
      cardW = small ? Math.min(w * .84, 420) : Math.min(w * .42, 600);
      base = cardW * (small ? .8 : .66); step = cardW * (small ? .14 : .26);
      labStage.style.setProperty("--cw", cardW + "px");
    };
    const place = (animate = true) => {
      labStage.classList.toggle("is-instant", !animate);
      cards.forEach((c, i) => {
        const k = list.indexOf(i);
        if (k < 0) { c.hidden = true; return; }
        c.hidden = false;
        const d = k - pos, ad = Math.abs(d), sg = Math.sign(d);
        const x = sg * (Math.min(ad, 1) * base + Math.max(ad - 1, 0) * step);
        const rot = -Math.max(-1, Math.min(1, d)) * 38, z = -Math.min(ad, 4) * 140, sc = 1 - Math.min(ad, 1) * .12;
        c.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)}) rotateX(var(--ty)) rotateY(var(--tx))`;
        c.style.opacity = ad > 3.2 ? 0 : (1 - Math.min(ad, 3) * .2).toFixed(3);
        c.style.zIndex = String(100 - Math.round(ad * 10));
        c.style.pointerEvents = ad > 3.2 ? "none" : "";
        c.classList.toggle("is-active", ad < .5);
        if (ad >= .5) { c.style.setProperty("--tx", "0deg"); c.style.setProperty("--ty", "0deg"); }
        c.style.setProperty("--dim", Math.min(ad, 1).toFixed(3));
      });
    };
    const info = () => {
      const l = LAB[list[target]]; if (!l) return;
      const g = (LAB_GROUPS.find(x => x.id === l.group) || {}).label || "";
      labInfo.innerHTML = `
        <span class="readout">${esc(g)} · ${esc(l.kind)}</span>
        <h3 class="lab-cf__title">${esc(l.title)}</h3>
        ${l.note ? `<p class="lab-cf__note">${esc(l.note)}</p>` : ""}
        <div class="lab-cf__tools">${(l.tools || []).slice(0, 4).map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
        <a class="btn btn--primary btn--sm" href="#lab/${l.slug}" data-lab-open="${l.slug}">Open <span class="btn__arrow" aria-hidden="true">→</span></a>`;
      labInfo.classList.remove("is-in"); void labInfo.offsetWidth; labInfo.classList.add("is-in");
      labCount.textContent = `${pad(target + 1)} / ${pad(list.length)}`;
      labProg.style.transform = `scaleX(${(target + 1) / list.length})`;
      cycleImages();
    };
    // the card in front slowly flips through its own images
    const cycleImages = () => {
      clearInterval(imgTimer);
      const c = cards[list[target]]; if (!c || reduceMotion) return;
      const imgs = $$("img", c); if (imgs.length < 2) return;
      imgs.forEach(im => { if (!im.src && im.dataset.src) im.src = im.dataset.src; });
      let k = imgs.findIndex(im => im.classList.contains("is-on"));
      imgTimer = setInterval(() => { imgs[k].classList.remove("is-on"); k = (k + 1) % imgs.length; imgs[k].classList.add("is-on"); }, 2600);
    };
    const go = (t, animate = true) => {
      const nt = Math.max(0, Math.min(list.length - 1, t));
      if (nt !== target && !canHover && navigator.vibrate) try { navigator.vibrate(6); } catch (_) {}
      target = nt; pos = target; place(animate); info();
    };
    // phones: tilt the device to tilt the front card
    if (!canHover && !reduceMotion) addEventListener("deviceorientation", e => {
      if (e.gamma == null) return;
      const c = cards[list[target]]; if (!c || drag?.moved) return;
      c.style.setProperty("--tx", Math.max(-10, Math.min(10, e.gamma / 3)).toFixed(2) + "deg");
      c.style.setProperty("--ty", Math.max(-8, Math.min(8, -(e.beta - 50) / 5)).toFixed(2) + "deg");
    }, { passive: true });
    const open = () => openCase(LAB[list[target]].slug, true, "lab");

    labStage.addEventListener("click", e => {
      const c = e.target.closest(".cf-card"); if (!c || drag?.moved) return;
      const k = list.indexOf(+c.dataset.labI);
      k === target ? open() : go(k);
    });
    labInfo.addEventListener("click", e => { const a = e.target.closest("[data-lab-open]"); if (!a || e.metaKey || e.ctrlKey) return; e.preventDefault(); open(); });
    $$("[data-lab-step]").forEach(b => b.addEventListener("click", () => go(target + +b.dataset.labStep)));
    labStage.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(target + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(target - 1); }
      else if (e.key === "Enter") { e.preventDefault(); open(); }
    });
    // drag or swipe: the deck follows your finger, then settles on the nearest card
    labStage.addEventListener("pointerdown", e => { if (e.button) return; drag = { x: e.clientX, y: e.clientY, p: pos, moved: false, id: e.pointerId }; });
    labStage.addEventListener("pointermove", e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - drag.y)) { drag.moved = true; labStage.setPointerCapture(drag.id); labStage.classList.add("is-dragging"); }
      if (drag.moved) { pos = Math.max(-.4, Math.min(list.length - .6, drag.p - dx / base)); place(false); }
    });
    const endDrag = () => {
      if (!drag) return;
      const was = drag.moved; labStage.classList.remove("is-dragging");
      if (was) go(Math.round(pos));
      setTimeout(() => (drag = null), 0);
    };
    labStage.addEventListener("pointerup", endDrag); labStage.addEventListener("pointercancel", endDrag);
    // trackpad: a sideways swipe steps the carousel
    let wheelAcc = 0, wheelT = 0;
    labStage.addEventListener("wheel", e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); wheelAcc += e.deltaX;
      const now = performance.now(); if (now - wheelT < 260) return;
      if (Math.abs(wheelAcc) > 40) { go(target + Math.sign(wheelAcc)); wheelAcc = 0; wheelT = now; }
    }, { passive: false });
    // tilt the front card towards the cursor
    if (canHover && !reduceMotion) labStage.addEventListener("pointermove", e => {
      const c = cards[list[target]]; if (!c || drag?.moved) return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      const inside = Math.abs(x) < .6 && Math.abs(y) < .6;
      c.style.setProperty("--tx", inside ? (x * 10).toFixed(2) + "deg" : "0deg");
      c.style.setProperty("--ty", inside ? (-y * 8).toFixed(2) + "deg" : "0deg");
      c.style.setProperty("--sx", ((x + .5) * 100).toFixed(1) + "%"); c.style.setProperty("--sy", ((y + .5) * 100).toFixed(1) + "%");
    });
    // only animate the images while the carousel is on screen
    new IntersectionObserver(([en]) => en.isIntersecting ? cycleImages() : clearInterval(imgTimer)).observe(labStage);
    addEventListener("resize", () => { sizeUp(); place(false); });

    if (labFilters) {
      labFilters.innerHTML = LAB_GROUPS.map(g => {
        const n = g.id === "all" ? LAB.length : LAB.filter(l => l.group === g.id).length;
        return `<button class="filter" aria-pressed="${g.id === "all"}" data-lab-cat="${g.id}">${esc(g.label)} <span class="filter__count">${pad(n)}</span></button>`;
      }).join("");
      labFilters.addEventListener("click", e => {
        const b = e.target.closest("[data-lab-cat]"); if (!b) return;
        labCat = b.dataset.labCat;
        $$(".filter", labFilters).forEach(f => f.setAttribute("aria-pressed", f === b));
        list = LAB.map((l, i) => i).filter(i => labCat === "all" || LAB[i].group === labCat);
        go(0);
      });
    }
    sizeUp(); go(0, false);
  }
  function renderLab(l) {
    const list = LAB.filter(x => labCat === "all" || x.group === labCat).map(x => x.slug);
    const order = list.includes(l.slug) ? list : LAB.map(x => x.slug);
    const i = order.indexOf(l.slug);
    const prev = labBySlug[order[(i - 1 + order.length) % order.length]], next = labBySlug[order[(i + 1) % order.length]];
    const imgs = Array.from({ length: l.images }, (_, k) => labImg(l, k + 1));
    const group = (LAB_GROUPS.find(g => g.id === l.group) || {}).label || "";
    body.innerHTML = `
      <div class="cf-top">
        <span class="cf-top__path readout">lab / <b>${esc(group.toLowerCase())}</b> / ${esc(l.slug)}</span>
        <button class="cf-close" data-close>Close <kbd>esc</kbd></button>
      </div>
      <div class="cf-body">
        <div class="cf-stage">
          <div class="cf-player cf-player--still" data-player><span class="brackets" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div>
          ${imgs.length > 1 ? `<div class="cf-thumbs">${imgs.map((src, k) => `
            <button class="cf-thumb" aria-pressed="${k === 0}" data-shot="${k}" aria-label="Show image ${k + 1}"><img src="${src}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
        </div>
        <div class="cf-info">
          <span class="readout">personal work</span>
          <h2 class="cf-title" id="cf-title">${esc(l.title)}</h2>
          <p class="cf-tagline">${esc(l.note)}</p>
          <dl class="cf-specs">
            <div><dt>type</dt><dd>${esc(l.kind)}</dd></div>
            <div><dt>area</dt><dd>${esc(group)}</dd></div>
          </dl>
          <div class="cf-block"><h3>Tools</h3><div class="cf-chips">${l.tools.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div></div>
          <div class="cf-block"><a class="btn btn--ghost btn--sm" href="${esc(l.url)}" target="_blank" rel="noopener">Full project write-up</a></div>
        </div>
      </div>
      <nav class="cf-nav" aria-label="Other lab pieces">
        <button data-go="lab/${prev.slug}"><span class="readout"><kbd>←</kbd> previous</span><span class="cf-nav__title">${esc(prev.title)}</span></button>
        <button data-go="lab/${next.slug}"><span class="readout">next <kbd>→</kbd></span><span class="cf-nav__title">${esc(next.title)}</span></button>
      </nav>`;
    const player = $("[data-player]", body);
    const show = k => {
      $$("img", player).forEach(n => n.remove());
      const im = document.createElement("img"); im.src = imgs[k]; im.alt = `${l.title}, image ${k + 1}`;
      player.prepend(im);
      $$("[data-shot]", body).forEach(b => b.setAttribute("aria-pressed", +b.dataset.shot === k));
    };
    $$("[data-shot]", body).forEach(b => b.addEventListener("click", () => show(+b.dataset.shot)));
    show(0);
    body.querySelector("[data-close]").addEventListener("click", closeCase);
    body.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => goCase(b.dataset.go)));
  }

  /* ---------- about ---------- */
  const aboutEl = $("[data-about]");
  if (aboutEl && P.about) aboutEl.innerHTML = P.about.map(t => `<p>${esc(t)}</p>`).join("");
  const bgEl = $("[data-background]");
  if (bgEl && P.background) bgEl.innerHTML = P.background.map(b => `<div><dt>${esc(b.label)}</dt><dd>${esc(b.value)}</dd></div>`).join("");

  /* ---------- chrome: sticky bar, active nav, key hints ---------- */
  const bar = $("[data-bar]");
  addEventListener("scroll", () => bar.classList.toggle("is-stuck", scrollY > 8), { passive: true });
  const navLinks = $$(".bar__nav a");
  const sio = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => sio.observe(s));

  if (/^#(case|lab)\//.test(location.hash)) fromHash();

  // Shared with js/showcase.js
  window.PORTFOLIO = { openCase: slug => openCase(slug, true), bySlug, statusClass, esc, m, ARROW };

  /* ---------- feel: cursor light on glass, magnetic buttons, progress ---------- */
  if (canHover && !reduceMotion) {
    document.addEventListener("pointermove", e => {
      const lit = e.target.closest && e.target.closest(".lit");
      if (lit) {
        const r = lit.getBoundingClientRect();
        lit.style.setProperty("--mx", (e.clientX - r.left) + "px");
        lit.style.setProperty("--my", (e.clientY - r.top) + "px");
      }
      const mag = e.target.closest && e.target.closest(".btn--primary, .go, .bar__mark");
      if (mag) {
        const r = mag.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / r.width, dy = (e.clientY - r.top - r.height / 2) / r.height;
        mag.style.translate = `${(dx * 6).toFixed(1)}px ${(dy * 5).toFixed(1)}px`;
        mag.dataset.mag = "1";
      }
      $$("[data-mag]").forEach(el => { if (el !== mag) { el.style.translate = ""; delete el.dataset.mag; } });
    }, { passive: true });
  }
  /* ---------- depth: tilt cards toward the cursor, or with the phone ---------- */
  const TILT = ".tile__btn, .pipeline__step, .slot, .intro__card";
  const markTilt = () => $$(TILT).forEach(el => el.classList.add("tilt"));
  let mtQ = false; markTilt();
  new MutationObserver(() => { if (!mtQ) { mtQ = true; requestAnimationFrame(() => { mtQ = false; markTilt(); }); } }).observe(document.body, { childList: true, subtree: true });
  if (!reduceMotion && canHover) {
    let cur = null;
    const reset = el => { el.classList.remove("is-tilting"); el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
    document.addEventListener("pointermove", e => {
      const el = e.target.closest && e.target.closest(".tilt");
      if (cur && cur !== el) { reset(cur); cur = null; }
      if (!el) return;
      cur = el;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      const k = Math.min(1, 380 / Math.max(r.width, r.height)) * 9;   // big panels tilt less
      el.classList.add("is-tilting");
      el.style.setProperty("--ry", ((x - .5) * k).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((.5 - y) * k).toFixed(2) + "deg");
      el.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
      el.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
    }, { passive: true });
    document.addEventListener("pointerleave", () => cur && reset(cur));
  } else if (!reduceMotion) {
    // phones: cards on screen lean with the device and the reflection slides (Android shares motion without asking)
    let gx = 0, gy = 0, queued = false;
    const apply = () => {
      queued = false;
      $$(".tilt").forEach(el => {
        const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
        el.style.setProperty("--ry", (gx * 6).toFixed(2) + "deg"); el.style.setProperty("--rx", (-gy * 5).toFixed(2) + "deg");
        el.style.setProperty("--gx", (50 + gx * 60).toFixed(1) + "%"); el.style.setProperty("--gy", (50 + gy * 60).toFixed(1) + "%");
      });
    };
    addEventListener("deviceorientation", e => {
      if (e.gamma == null) return;
      gx = Math.max(-1, Math.min(1, e.gamma / 35)); gy = Math.max(-1, Math.min(1, (e.beta - 50) / 40));
      if (!queued) { queued = true; requestAnimationFrame(apply); }
    }, { passive: true });
  }

  /* ---------- phone menu ---------- */
  const menuBtn = $("[data-menu]"), sheet = $("[data-sheet]");
  if (menuBtn && sheet) {
    const setMenu = open => { sheet.hidden = !open; menuBtn.setAttribute("aria-expanded", open); };
    menuBtn.addEventListener("click", e => { e.stopPropagation(); setMenu(sheet.hidden); });
    sheet.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("click", e => { if (!sheet.hidden && !sheet.contains(e.target)) setMenu(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !sheet.hidden) { setMenu(false); menuBtn.focus(); } });
    matchMedia("(min-width: 761px)").addEventListener("change", e => e.matches && setMenu(false));
  }
  const prog = $("[data-progress]");
  const setProg = () => { if (prog) prog.style.transform = `scaleX(${Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))})`; };
  addEventListener("scroll", setProg, { passive: true }); setProg();

  /* ---------- nav: sliding glass pill under the active link ---------- */
  const nav = $("[data-nav]"), pill = $("[data-pill]");
  function movePill(a) {
    if (!a || !pill) { pill && (pill.style.opacity = 0); return; }
    pill.style.opacity = 1;
    pill.style.width = a.offsetWidth + "px";
    pill.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  const activeLink = () => nav && nav.querySelector("a.is-active");
  new MutationObserver(() => movePill(activeLink())).observe(nav, { subtree: true, attributes: true, attributeFilter: ["class"] });
  addEventListener("resize", () => movePill(activeLink()));
})();
