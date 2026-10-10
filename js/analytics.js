/* Analytics: Google Analytics 4 (visits, events, time) + Microsoft Clarity (heatmaps, session replays).
   Paste your IDs below. Leave an ID empty to switch that service off.
   Visit the site once with ?notrack to stop counting your own visits on that browser (?track to undo). */
(() => {
  const CONFIG = {
    ga4: "G-GYRSY44KGY",     // e.g. "G-ABC123XYZ"  (GA4 → Admin → Data streams → Measurement ID)
    clarity: "yvfvujgdpw",   // e.g. "q1w2e3r4t5"   (Clarity → Settings → Overview → Project ID)
  };

  const store = (k, v) => { try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (_) {} };
  const qs = new URLSearchParams(location.search);
  if (qs.has("notrack")) store("pf_notrack", "1");
  if (qs.has("track")) store("pf_notrack");
  let off = false; try { off = localStorage.getItem("pf_notrack") === "1"; } catch (_) {}
  if (off || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) { document.addEventListener("pf:track", () => {}); return; }

  const load = src => { const s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); };

  if (CONFIG.ga4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", CONFIG.ga4);
    load("https://www.googletagmanager.com/gtag/js?id=" + CONFIG.ga4);
  }
  if (CONFIG.clarity) {
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    load("https://www.clarity.ms/tag/" + CONFIG.clarity);
  }
  if (!CONFIG.ga4 && !CONFIG.clarity) return;

  const send = (name, params = {}) => {
    if (window.gtag && CONFIG.ga4) gtag("event", name, params);
    if (window.clarity && CONFIG.clarity) { clarity("event", name); if (params.project) clarity("set", "project", params.project); }
  };

  // events raised by the site (project / lab opens, chapter reached, Rows|Index switch)
  const once = new Set();
  document.addEventListener("pf:track", e => {
    const { name, params } = e.detail;
    if (name === "showcase_chapter") { const k = name + params.chapter; if (once.has(k)) return; once.add(k); }
    send(name, params);
  });

  // clicks: resume, email, social / outbound links
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]"); if (!a) return;
    const href = a.getAttribute("href"), label = (a.textContent || "").trim().slice(0, 40);
    if (a.matches("[data-resume]") || /resume\.pdf$/i.test(href)) send("resume_download", { link_text: label, from: a.closest("section, header, nav")?.id || "header" });
    else if (href.startsWith("mailto:")) send("contact_email", { from: a.closest("section")?.id || "" });
    else if (/^https?:/.test(href) && a.host !== location.host) send("outbound_click", { link_url: href, link_text: label });
  }, true);

  // reels watched inside a case file
  const played = new Set();
  document.addEventListener("play", e => {
    const v = e.target; if (!(v instanceof HTMLVideoElement) || !v.closest("dialog") || !v.controls) return;
    const src = v.currentSrc || v.src; if (played.has(src)) return; played.add(src);
    send("video_play", { video: src.split("/").slice(-2).join("/") });
  }, true);

  // scroll depth
  const marks = [25, 50, 75, 90]; let hit = 0;
  addEventListener("scroll", () => {
    const d = document.documentElement, pct = (scrollY + innerHeight) / d.scrollHeight * 100;
    while (hit < marks.length && pct >= marks[hit]) send("scroll_depth", { percent: marks[hit++] });
  }, { passive: true });

  // time spent reading each section (section crossing the middle of the screen counts as "being read")
  const secs = [...document.querySelectorAll("main section[id], section[id]")].filter((s, i, a) => a.indexOf(s) === i);
  const time = {}, seen = new Set(); let current = null, since = 0;
  const flushCurrent = () => { if (current && since) time[current] = (time[current] || 0) + (performance.now() - since); since = current ? performance.now() : 0; };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const id = en.target.id;
      if (en.isIntersecting) {
        flushCurrent(); current = id; since = document.hidden ? 0 : performance.now();
        if (!seen.has(id)) { seen.add(id); send("section_view", { section: id }); }
      } else if (current === id) { flushCurrent(); current = null; since = 0; }
    });
  }, { rootMargin: "-50% 0px -50% 0px" });
  secs.forEach(s => io.observe(s));

  let reported = false;
  const report = () => {
    flushCurrent();
    Object.entries(time).forEach(([section, ms]) => {
      const seconds = Math.round(ms / 1000);
      if (seconds >= 2) send("section_time", { section, seconds, value: seconds, transport_type: "beacon" });
    });
    for (const k in time) delete time[k];
    reported = true;
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { report(); since = 0; }
    else { if (!since && current) since = performance.now(); reported = false; }
  });
  addEventListener("pagehide", () => { if (!reported) report(); });
})();
