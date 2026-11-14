/* Mamounia features: Islamic-calendar seasons, DFW weather and comfort, prayer notes, size finder,
   family sets, reserve & try at events, Eid gifts, masjid give-back, piece tags, and sending
   website requests to the Mamounia Admin.
   EDIT THE SETTINGS IN MM BELOW. */
var MM = {
  // The admin address is set once, in assets/site.js (MM_API).
  API: window.MM_API || "",
  CITY: {name: "Allen", lat: 33.1032, lon: -96.6706},
  GIVE_BACK: "[X]%",          // share of each order given to the customer's masjid
  FAMILY_DEAL: "[X]%",        // discount on family sets of 3 or more pieces
  INSTAGRAM: "[INSTAGRAM LINK]",
  MASJIDS: ["Islamic Association of Allen", "East Plano Islamic Center (EPIC)", "Plano Masjid", "IANT, Richardson",
            "Islamic Center of Frisco", "Valley Ranch Islamic Center", "Islamic Center of Irving"],
  // Shown on the "Find us" page when the admin isn't connected. With the admin connected,
  // events ticked "Show on website" in the Events tab appear instead.
  EVENTS: [],
  // The store follows the Islamic calendar. Dates are expected dates and can move by a day.
  SEASONS: [
    {from: "2026-11-01", to: "2027-01-08", key: "winter", text: "Djellaba season in DFW. Ramadan begins in about {days:2027-02-08} days.", cta: ["Shop winter", "shop.html?season=winter"]},
    {from: "2027-01-09", to: "2027-02-07", key: "preramadan", text: "Ramadan begins in {days:2027-02-08} days. Taraweeh pieces are in.", cta: ["Shop for Ramadan", "shop.html"]},
    {from: "2027-02-08", to: "2027-03-03", key: "ramadan", text: "Ramadan Mubarak. Order by March 3 to have it before Eid: {left:2027-03-03T23:59:00-06:00}", cta: ["Shop Eid outfits", "shop.html"]},
    {from: "2027-03-04", to: "2027-03-07", key: "pickup", text: "Too late for shipping? Reserve online and pick up in Allen before Eid.", cta: ["Reserve and pick up", "events.html"]},
    {from: "2027-03-08", to: "2027-03-08", key: "chandraat", text: "Chand Raat tonight: last-minute Eid outfits, pick up in Allen.", cta: ["Reserve now", "events.html"]},
    {from: "2027-03-09", to: "2027-03-11", key: "eid", text: "Eid Mubarak from Mamounia. Share your Eid photos with #MamouniaEid", cta: ["Shop the collection", "shop.html"]},
    {from: "2027-03-12", to: "2027-05-06", key: "spring", text: "Wedding and henna season. Dress the whole family in one color.", cta: ["Build a family set", "family.html"]},
    {from: "2027-05-07", to: "2027-05-11", key: "dhulhijjah", text: "The best ten days. Order by May 11 for Eid al-Adha: {left:2027-05-11T23:59:00-05:00}", cta: ["Shop for Eid", "shop.html"]},
    {from: "2027-05-12", to: "2027-05-15", key: "pickup", text: "Eid al-Adha is close. Reserve online and pick up in Allen.", cta: ["Reserve and pick up", "events.html"]},
    {from: "2027-05-16", to: "2027-05-18", key: "eid", text: "Eid al-Adha Mubarak from Mamounia.", cta: ["Send an Eid gift", "gift.html"]},
    {from: "2027-05-19", to: "2027-09-30", key: "summer", text: "Summer in DFW: light gandouras, linen and crepe.", cta: ["Shop summer", "shop.html?season=summer"]},
    {from: "2027-10-01", to: "2027-12-31", key: "winter", text: "Djellaba season is back. Ramadan begins around January 28.", cta: ["Shop winter", "shop.html?season=winter"]}
  ],
  // Notes for the person who prays in it. Edit per category.
  PRAY: {
    men: {djellaba: ["Hood for Fajr", "Room for sujood"], gandoura: ["Wudu-friendly sleeves", "Cool for Jumu'ah"],
          jabador: ["Tunic and serwal", "Room for sujood"], jacket: ["Layers over a thobe"]},
    women: {djellaba: ["Hooded, full length", "Modest in sujood"], kaftan: ["Full length", "For Eid and weddings"],
            kimono: ["Top and pants", "Easy to pray in"], abaya: ["Full length, loose", "Fits any hijab"], jabador: ["Tunic and pants"]}
  },
  // When each fabric is comfortable in DFW (months 1-12) and its comfortable temperature range (°F).
  COMFORT: {
    gabardine: {m: [3,4,5,6,7,8,9,10], lo: 65, hi: 95}, striped: {m: [3,4,5,9,10,11], lo: 58, hi: 88},
    sousdi: {m: [10,11,12,1,2,3,4], lo: 45, hi: 75}, jim: {m: [4,5,6,7,8,9,10], lo: 65, hi: 95},
    linen: {m: [5,6,7,8,9], lo: 75, hi: 100}, melifa: {m: [11,12,1,2,3], lo: 35, hi: 68},
    bouclette: {m: [12,1,2], lo: 25, hi: 55}, suede: {m: [11,12,1,2], lo: 35, hi: 65},
    crepe: {m: [3,4,5,6,7,8,9,10,11], lo: 55, hi: 95}, mobra: {m: [11,12,1,2,3], lo: 40, hi: 70}
  },
  // Starting size guide by height (inches). It gets better as customers send "how it fit" reports.
  FIT: {men: [["S", 0, 65], ["M", 65, 69], ["L", 69, 72], ["XL", 72, 75], ["XXL", 75, 99]],
        women: [["S", 0, 61], ["M", 61, 64], ["L", 64, 67], ["XL", 67, 70], ["XXL", 70, 99]]},
  HEAVY: {men: 210, women: 180}   // above this weight (lb), suggest one size up
};

// Settings from the admin's Website design tab win over the defaults above
(function(s){ if (!s) return;
  if (s.give_back) MM.GIVE_BACK = s.give_back; if (s.family_deal) MM.FAMILY_DEAL = s.family_deal;
  if (s.instagram) MM.INSTAGRAM = s.instagram; if (s.city) MM.CITY.name = s.city;
})(window.MM_SETTINGS);

(function(){
  var store = document.body.getAttribute("data-store"); if (!store) return;
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); };
  var items = PRODUCTS[store].filter(function(p){ return !p.hidden; }), cats = CATS[store];
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var params = new URLSearchParams(location.search);
  function today(){ var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function findAny(id){ var all = PRODUCTS.men.concat(PRODUCTS.women); for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i]; return null; }
  function storeOf(id){ return /^m/.test(id) ? "men" : "women"; }
  function firstPhoto(p){ var v = p.variants && p.variants[0]; return (v && v.photos && v.photos[0]) || (p.photos && p.photos[0]) || null; }

  /* ---------- sending to the admin ---------- */
  function send(type, data){
    var body = JSON.stringify({type: type, store: store, page: location.pathname.split("/").pop(), data: data});
    if (!MM.API) { try { console.warn("Mamounia: set MM.API in assets/extra.js so website requests reach the admin.", body); } catch(e){} return Promise.resolve({ok: true, offline: true}); }
    return fetch(MM.API.replace(/\/$/, "") + "/api/public/request", {method: "POST", headers: {"Content-Type": "application/json"}, body: body})
      .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ return {ok: r.ok, error: j.error}; }); })
      .catch(function(){ return {ok: false, error: "We couldn't send that. Check your connection and try again."}; });
  }
  window.mmSend = send;
  function formData(f){ var o = {}; new FormData(f).forEach(function(v, k){ if (typeof v === "string" && v.trim()) o[k] = o[k] ? o[k] + ", " + v : v.trim(); }); return o; }
  // Newsletter sign-ups and the made-to-order form go to the admin too
  document.addEventListener("submit", function(e){
    var f = e.target;
    if (f.hasAttribute("data-nl-form")) { var em = f.querySelector("input[type=email]"); if (em && em.value) send("newsletter", {email: em.value}); }
    if (f.getAttribute("data-demo") === "mto-done") send("custom", formData(f));
  }, true);

  /* ---------- 1. the Islamic-calendar season ---------- */
  var t = today(), season = null;
  MM.SEASONS.forEach(function(s){ if (t >= s.from && t <= s.to) season = s; });
  function fill(text){
    return text.replace(/\{days:([\d-]+)\}/g, function(_, d){ return Math.max(0, Math.ceil((new Date(d + "T00:00:00") - new Date()) / 864e5)); })
               .replace(/\{left:([^}]+)\}/g, function(_, d){ return '<b class="mm-left" data-until="' + d + '"></b>'; });
  }
  function tick(){
    document.querySelectorAll(".mm-left").forEach(function(el){
      var ms = new Date(el.getAttribute("data-until")) - new Date();
      if (ms <= 0) { el.textContent = "closed"; return; }
      var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
      el.textContent = (d ? d + "d " : "") + h + "h " + ("0" + m).slice(-2) + "m left";
    });
  }
  if (season) {
    document.body.classList.add("season-" + season.key);
    var ann = $(".announce .ann-row > span");
    if (ann) ann.innerHTML = '<span class="mm-season">' + fill(season.text) + '</span> <a class="mm-season-cta" href="' + season.cta[1] + '">' + esc(season.cta[0]) + ' →</a>';
    tick(); setInterval(tick, 30000);
  }
  // A "this season" edit on the home page
  var slot = $("[data-season-slot]");
  if (slot && season) {
    var want = {ramadan: ["abaya","jabador","kaftan","gandoura","kimono"], preramadan: ["abaya","jabador","kaftan","gandoura"], pickup: null, chandraat: null, eid: null,
                dhulhijjah: null, spring: ["kaftan","kimono","gandoura","jabador"], summer: "summer", winter: "winter"}[season.key];
    var list = items.filter(function(p){ return want === "summer" ? p.season !== "winter" : want === "winter" ? p.season !== "summer" : want ? want.indexOf(p.cat) > -1 : true; }).slice(0, 4);
    var title = {winter: "Djellaba weather", preramadan: "Ready for Ramadan", ramadan: "For taraweeh and Eid", pickup: "Still time for Eid", chandraat: "Chand Raat picks", eid: "Eid Mubarak", spring: "For weddings and henna nights", dhulhijjah: "For Eid al-Adha", summer: "Made for DFW summers"}[season.key];
    slot.innerHTML = '<div class="wrap"><div class="row-head"><div><span class="eyebrow">This season</span><h2>' + esc(title) + '</h2><p class="muted mm-season-sub">' + fill(season.text) + '</p></div><a class="btn ghost" href="' + season.cta[1] + '">' + esc(season.cta[0]) + '</a></div><div class="grid" data-season-grid></div></div>';
    var g = $("[data-season-grid]");
    g.innerHTML = list.map(function(p){ return window.mmCard(p, null, true); }).join("");
    slot.hidden = false; tick();
  }

  /* ---------- 3. DFW weather ---------- */
  function weather(){
    if (weather.p) return weather.p;
    weather.p = fetch("https://api.open-meteo.com/v1/forecast?latitude=" + MM.CITY.lat + "&longitude=" + MM.CITY.lon + "&current=temperature_2m&temperature_unit=fahrenheit&timezone=America%2FChicago")
      .then(function(r){ return r.json(); }).then(function(j){ return Math.round(j.current.temperature_2m); }).catch(function(){ return null; });
    return weather.p;
  }
  var wx = $("[data-weather]");
  if (wx) weather().then(function(tf){
    if (tf == null) return;
    var mine = {}; items.forEach(function(p){ if (MM.COMFORT[p.fabric]) mine[p.fabric] = true; });
    var fits = Object.keys(mine).filter(function(k){ var c = MM.COMFORT[k]; return tf >= c.lo && tf <= c.hi; });
    var pick = fits.sort(function(a, b){ return (MM.COMFORT[a].hi - MM.COMFORT[a].lo) - (MM.COMFORT[b].hi - MM.COMFORT[b].lo); })[0];
    var name = pick ? FABRICS[pick].name : null;
    wx.innerHTML = '<div class="wrap mm-wx-row"><span class="mm-temp">' + tf + '°F</span><span>Right now in ' + esc(MM.CITY.name) + '. ' +
      (name ? '<b>' + esc(name) + ' weather.</b>' : '<b>Layer up or keep it light.</b>') + '</span>' +
      (pick ? '<a href="shop.html?fabric=' + pick + '">Shop ' + esc(name) + ' →</a>' : '') + '</div>';
    wx.hidden = false;
  });

  /* ---------- product page: prayer notes, DFW comfort, size finder, reserve / gift links ---------- */
  var pp = $("[data-product]");
  if (pp) {
    var p = (function(){ var id = params.get("id"); for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i]; return items[0]; })();
    var notes = (MM.PRAY[store] || {})[p.cat] || [];
    var c = MM.COMFORT[p.fabric];
    function span(ms){ // turn a list of months into "Mar–Oct" style ranges
      var on = function(m){ return ms.indexOf(((m - 1 + 12) % 12) + 1) > -1; }, start = null, out = [];
      for (var k = 1; k <= 12; k++) if (on(k) && !on(k - 1)) start = k;
      if (ms.length === 12) return "All year";
      for (var m = 1; m <= 12; m++) if (on(m) && !on(m - 1)) { var e = m; while (on(e + 1) && e - m < 11) e++; out.push(MONTHS[m - 1] + (e !== m ? "–" + MONTHS[(e - 1) % 12] : "")); }
      return out.join(", ");
    }
    // Tags at the top, next to the fabric: each kind has its own color
    var kindOf = function(n){ return /fajr|sujood|wudu|jumu|pray|hijab/i.test(n) ? "pray" : /eid|wedding|henna/i.test(n) ? "occ" : "cut"; };
    var tags = [];
    if (p.fabric && FABRICS[p.fabric]) tags.push(["fab", FABRICS[p.fabric].name]);
    tags.push([p.season === "summer" ? "sum" : p.season === "winter" ? "win" : "alls", p.season === "summer" ? "Summer · light" : p.season === "winter" ? "Winter · warm" : "All season"]);
    notes.forEach(function(n){ tags.push([kindOf(n), n]); });
    var top = document.createElement("div"); top.className = "mm-top";
    top.innerHTML = '<div class="mm-tags" aria-label="About this piece">' + tags.map(function(t, i){ return '<span class="mm-tag t-' + t[0] + '" style="--i:' + i + '">' + esc(t[1]) + '</span>'; }).join("") + '</div>' +
      (c ? '<div class="mm-season-line"><span class="mm-bar" aria-hidden="true">' + MONTHS.map(function(m, i){ return '<i class="' + (c.m.indexOf(i + 1) > -1 ? "on" : "") + (i === new Date().getMonth() ? " now" : "") + '"></i>'; }).join("") + '</span>' +
      '<span class="mm-sl-txt">Best in DFW: <b>' + span(c.m) + '</b><span data-wx-line hidden></span></span></div>' : '');
    var bdg = pp.querySelector('[data-p="badge"]');
    if (bdg) { if (bdg.classList.contains("ready")) bdg.hidden = true; bdg.parentNode.insertBefore(top, bdg.nextSibling); }
    else pp.querySelector(".info").insertBefore(top, pp.querySelector(".info").firstChild);
    var box = document.createElement("div"); box.className = "mm-extras";
    box.innerHTML = '<div class="mm-good"><div class="mm-acts"><a href="events.html?item=' + p.id + '">Try it on</a><a href="gift.html?item=' + p.id + '">Gift it</a><a href="family.html?item=' + p.id + '">Family set</a></div></div>';
    var add = pp.querySelector("[data-add]"); add.parentNode.insertBefore(box, add.nextSibling);
    if (c) weather().then(function(tf){
      if (tf == null) return; var el = pp.querySelector("[data-wx-line]");
      el.textContent = " · " + tf + "°F in " + MM.CITY.name + " now" + (tf < c.lo ? ", layer up" : tf > c.hi ? ", a warm day for it" : ", a good day for it");
      el.hidden = false;
    });
    // Size finder: type your height, see where you stand on the size scale, and pick the size in one tap
    var fitBtn = pp.querySelector("[data-fit-open]");
    if (fitBtn) {
      var chart = MM.FIT[store], LO = 56, HI = 82, fp = null, pickSize = null;
      var yOf = function(inches){ return 300 - (Math.max(LO, Math.min(HI, inches)) - LO) / (HI - LO) * 270; };   // px inside the drawing
      var ftin = function(n){ return Math.floor(n / 12) + "′" + (n % 12 ? (n % 12) + "″" : ""); };
      var draw = function(inches, idx){
        var bands = chart.map(function(r, i){
          var lo = Math.max(LO, r[1]), hi = Math.min(HI, r[2]), y1 = yOf(hi), y2 = yOf(lo), on = i === idx;
          return '<rect x="150" y="' + y1 + '" width="74" height="' + (y2 - y1) + '" class="fb' + (on ? " on" : "") + '"/><text x="187" y="' + ((y1 + y2) / 2 + 5) + '" text-anchor="middle" class="ft' + (on ? " on" : "") + '">' + r[0] + '</text>' +
            (i ? '<text x="232" y="' + (y2 + 4) + '" class="fl">' + ftin(lo) + '</text>' : '');
        }).join("");
        var fig = "";
        if (inches) {
          var top = yOf(inches), H = 300 - top, hr = H * 0.065, sh = top + hr * 2 + H * 0.03, hem = 300 - H * 0.05;
          fig = '<g class="fig"><circle cx="78" cy="' + (top + hr) + '" r="' + hr + '"/>' +
            '<path d="M' + (78 - H * 0.11) + ',' + sh + ' Q78,' + (sh - H * 0.03) + ' ' + (78 + H * 0.11) + ',' + sh + ' L' + (78 + H * 0.14) + ',' + hem + ' L' + (78 - H * 0.14) + ',' + hem + ' Z"/>' +
            '<path class="fz" d="M78,' + (sh + 2) + ' V' + (sh + H * 0.3) + '"/>' +
            '<rect x="' + (78 - H * 0.055) + '" y="' + hem + '" width="' + (H * 0.045) + '" height="' + (300 - hem) + '"/><rect x="' + (78 + H * 0.01) + '" y="' + hem + '" width="' + (H * 0.045) + '" height="' + (300 - hem) + '"/></g>' +
            '<line class="fm" x1="30" x2="224" y1="' + top + '" y2="' + top + '"/><text class="fh" x="30" y="' + (top - 7) + '">' + ftin(inches) + '</text>';
        }
        return '<svg viewBox="0 0 270 316" role="img" aria-label="Size scale by height"><line class="fg" x1="20" x2="250" y1="300.5" y2="300.5"/>' + bands + fig + '</svg>';
      };
      var openFit = function(){
        if (!fp) {
          fp = document.createElement("div"); fp.className = "fitp"; fp.setAttribute("role", "dialog"); fp.setAttribute("aria-modal", "true"); fp.setAttribute("aria-label", "Find my size");
          fp.innerHTML = '<div class="fitp-card"><button type="button" class="bag-x fitp-x" aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
            '<div class="fitp-draw" data-fdraw></div><form class="fitp-form"><span class="eyebrow">Mamounia</span><h2>Find my size</h2>' +
            '<label class="lbl">Height<span class="mm-hw"><input class="field" name="ft" type="number" inputmode="numeric" min="4" max="7" placeholder="ft" aria-label="Feet"><input class="field" name="in" type="number" inputmode="numeric" min="0" max="11" placeholder="in" aria-label="Inches"></span></label>' +
            '<label class="lbl">Weight in lb (optional)<input class="field" name="lb" type="number" inputmode="numeric" min="60" max="400" placeholder="lb"></label>' +
            '<div class="fitp-out" data-fout role="status"><span class="muted">Enter your height to see your size.</span></div>' +
            '<button class="btn" type="submit" data-fuse disabled>Choose my size</button><p class="muted small">A starting guide based on height. Between two sizes or want an exact fit? <a href="custom.html">Have it made to measure</a>.</p></form></div>';
          document.body.appendChild(fp);
          var f = fp.querySelector("form"), out = fp.querySelector("[data-fout]"), use = fp.querySelector("[data-fuse]"), dr = fp.querySelector("[data-fdraw]");
          var calc = function(){
            var inches = (+f.ft.value || 0) * 12 + (+f.in.value || 0), lb = +f.lb.value || 0;
            if (!f.ft.value || inches < 48 || inches > 90) { pickSize = null; use.disabled = true; use.textContent = "Choose my size"; out.innerHTML = '<span class="muted">Enter your height to see your size.</span>'; dr.innerHTML = draw(0, -1); return; }
            var idx = 0; chart.forEach(function(r, i){ if (inches >= r[1] && inches < r[2]) idx = i; });
            var up = lb && lb > MM.HEAVY[store] && idx < chart.length - 1; if (up) idx++;
            pickSize = chart[idx][0]; use.disabled = false; use.textContent = "Choose size " + pickSize;
            out.innerHTML = '<span class="fitp-lbl">Your size</span><b>' + pickSize + '</b>' + (up ? '<span class="muted small">One size up for comfort across the shoulders.</span>' : '');
            dr.innerHTML = draw(inches, idx);
          };
          f.addEventListener("input", calc);
          f.addEventListener("submit", function(e){ e.preventDefault(); if (!pickSize) return;
            var hit = null; pp.querySelectorAll(".sizes button").forEach(function(b){ if (b.textContent === pickSize) hit = b; });
            if (hit && !hit.disabled) hit.click(); else if (hit) pp.querySelector("[data-size-msg]").textContent = "Size " + pickSize + " is sold out right now.";
            closeFit(); });
          fp.addEventListener("click", function(e){ if (e.target === fp || e.target.closest(".fitp-x")) closeFit(); });
          document.addEventListener("keydown", function(e){ if (e.key === "Escape" && fp.classList.contains("open")) closeFit(); });
          calc();
        }
        void fp.offsetWidth; fp.classList.add("open"); document.body.classList.add("fit-open");
        setTimeout(function(){ fp.querySelector("input").focus({preventScroll: true}); }, 80);
      };
      var closeFit = function(){ fp.classList.remove("open"); document.body.classList.remove("fit-open"); fitBtn.focus({preventScroll: true}); };
      fitBtn.addEventListener("click", openFit);
    }
  }

  /* ---------- made to order: the fabric list follows the garment and the feel you pick ---------- */
  var mto = $("[data-mto]");
  if (mto) {
    var fabs = mto.querySelectorAll(".ch-fab"), hint = mto.querySelector("[data-fab-hint]");
    var syncFab = function(){
      var g = mto.querySelector("[name=garment]:checked"), f = mto.querySelector("[name=feel]:checked");
      var gk = g ? g.getAttribute("data-gar") : "", fk = f ? f.getAttribute("data-feel") : "", n = 0, firstOk = null, curOk = false;
      fabs.forEach(function(l){
        var ok = (" " + l.getAttribute("data-feels") + " ").indexOf(" " + fk + " ") > -1 && (" " + l.getAttribute("data-gars") + " ").indexOf(" " + gk + " ") > -1;
        var inp = l.querySelector("input"); l.hidden = !ok; inp.disabled = !ok;
        if (ok) { l.style.setProperty("--i", n); n++; if (!firstOk) firstOk = inp; if (inp.checked) curOk = true; } else inp.checked = false;
      });
      if (!curOk && firstOk) firstOk.checked = true;
      if (hint) hint.textContent = n ? "Fabrics our artisans use for a " + (g ? g.value.toLowerCase() : "piece") + " with a " + (f ? f.value.split(" · ")[0].toLowerCase() : "") + " feel." : "Tell us in the notes what you have in mind and we will suggest a fabric.";
      var box = mto.querySelector("[data-fabs]"); box.classList.remove("in"); void box.offsetWidth; box.classList.add("in");
    };
    mto.addEventListener("change", function(e){ if (e.target.name === "garment" || e.target.name === "feel") syncFab(); });
    syncFab();
  }

  /* ---------- cart: order requests ---------- */
  var sum = $(".cart .summary");
  if (sum) {
    var btn = sum.querySelector("[data-checkout]");
    var of = document.createElement("form"); of.className = "mm-order"; of.hidden = true;
    of.innerHTML = '<p class="small">Leave your details. We confirm stock and send you a secure payment link, usually the same day.</p>' +
      '<input class="field" name="name" required placeholder="Full name" aria-label="Full name"><input class="field" name="phone" type="tel" required placeholder="Phone or WhatsApp" aria-label="Phone"><input class="field" name="email" type="email" placeholder="Email (optional)" aria-label="Email">' +
      '<input class="field" name="address" placeholder="Shipping address, or write: pickup in Allen" aria-label="Address"><input class="field" name="height" placeholder="Your height and weight (optional, helps us check the size)" aria-label="Height and weight">' +
      '<button class="btn" type="submit">Send my order</button><p class="mm-err" role="alert"></p>';
    sum.insertBefore(of, btn.nextSibling);
    btn.addEventListener("click", function(e){ e.stopImmediatePropagation(); of.hidden = false; btn.hidden = true; var m = $("[data-checkout-msg]"); if (m) m.textContent = ""; of.querySelector("input").focus(); }, true);
    // coming from the side bag's Checkout button: open the order form straight away
    if (/[?&]checkout/.test(location.search)) setTimeout(function(){ if (!btn.disabled) { btn.click(); of.scrollIntoView({block: "center", behavior: "smooth"}); } }, 300);
    of.addEventListener("submit", function(e){
      e.preventDefault();
      var cart = []; try { cart = JSON.parse(localStorage.getItem("mamounia-cart-" + store)) || []; } catch(x){ cart = window.__cart || []; }
      if (!cart.length) return;
      var d = formData(of);
      d.items = cart.map(function(it){ var q = findAny(it.id) || {name: it.id}; return it.qty + "× " + q.name + " (size " + it.size + (it.color ? ", " + it.color : "") + ")"; }).join("; ");
      of.querySelector("button").disabled = true;
      send("order", d).then(function(r){
        if (!r.ok) { of.querySelector(".mm-err").textContent = r.error || "Couldn't send. Try again."; of.querySelector("button").disabled = false; return; }
        try { localStorage.removeItem("mamounia-cart-" + store); } catch(x){}
        window.__cart = [];
        $("[data-cart]").innerHTML = '<div class="done" style="display:block"><h2>Order received</h2><p class="muted">Thank you, ' + esc(d.name) + '. We will message you at ' + esc(d.phone) + ' to confirm and send your payment link.</p></div>';
        of.hidden = true; document.querySelectorAll(".cart-count").forEach(function(el){ el.textContent = "0"; el.setAttribute("data-n", "0"); });
      });
    });
  }

  /* ---------- shared bits for the new pages ---------- */
  function productOptions(st, sel){
    var cs = CATS[st];
    return PRODUCTS[st].map(function(p){ return '<option value="' + p.id + '"' + (p.id === sel ? " selected" : "") + '>' + esc(p.name) + ' · ' + esc(cs[p.cat]) + '</option>'; }).join("");
  }
  var SIZES = '<option value="">Size</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option><option value="Not sure">Not sure</option>';
  function wire(form, type, collect, done){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var d = formData(form); if (collect) collect(d);
      var b = form.querySelector("button[type=submit]"); b.disabled = true;
      send(type, d).then(function(r){
        b.disabled = false;
        if (!r.ok) { form.querySelector(".mm-err").textContent = r.error || "Couldn't send. Try again."; return; }
        form.hidden = true; var el = document.getElementById(done); el.hidden = false; el.style.display = "block"; el.scrollIntoView({block: "center", behavior: "smooth"});
      });
    });
  }

  /* ---------- 4. Family sets ---------- */
  var fam = $("[data-family]");
  if (fam) {
    var roles = [["Father", "men"], ["Mother", "women"], ["Son", "men"], ["Daughter", "women"], ["Grandfather", "men"], ["Grandmother", "women"], ["Brother", "men"], ["Sister", "women"], ["Uncle", "men"], ["Aunt", "women"]];
    var roleSt = {}; roles.forEach(function(r){ roleSt[r[0].toLowerCase()] = r[1]; });
    var fallback = [["White", "#F7F5EF"], ["Cream", "#EFE3C8"], ["Sand", "#D8C3A0"], ["Sea green", "#8FC3B5"], ["Emerald", "#0E4A36"], ["Navy", "#1F2F5A"], ["Burgundy", "#7A2234"], ["Black", "#1A1A1A"]];
    // the colors we really have: every color added to a product in the admin, men and women together
    var stock = [], seenC = {};
    ["men", "women"].forEach(function(st){ PRODUCTS[st].forEach(function(p){ if (p.hidden) return; (p.variants || []).forEach(function(v){ var k = v.name.toLowerCase(); if (!seenC[k]) { seenC[k] = 1; stock.push([v.name, v.hex || "#ccc"]); } }); }); });
    var hasStock = stock.length > 0, colors = hasStock ? stock : fallback;
    var has = function(p, name){ return (p.variants || []).some(function(v){ return v.name.toLowerCase() === String(name).toLowerCase(); }); };
    var first = params.get("item"), rows = $("[data-members]", fam), form = $("form", fam);
    $("#mm-roles", fam).innerHTML = roles.map(function(r){ return '<option value="' + r[0] + '">'; }).join("");
    var matching = function(){ return form.querySelector('[name=match]:checked').getAttribute("data-m") === "1"; };
    var famColor = function(){ var c = form.querySelector('[name=color]:checked'); return c ? c.value : ""; };
    function fillPieces(r, keep){
      var st = r.querySelector("[name=grp]").value, piece = r.querySelector("[name=piece]"), m = matching() && hasStock, fc = famColor(), cur = keep || piece.value, any = false;
      piece.innerHTML = PRODUCTS[st].filter(function(p){ return !p.hidden; }).map(function(p){
        var ok = !m || has(p, fc); if (ok) any = true;
        return '<option value="' + p.id + '"' + (ok ? "" : " disabled") + '>' + esc(p.name) + ' · ' + esc(CATS[st][p.cat]) + (ok ? "" : " (not in " + esc(fc) + ")") + '</option>';
      }).join("");
      var opt = piece.querySelector('option[value="' + cur + '"]');
      if (opt && !opt.disabled) piece.value = cur; else { var f1 = piece.querySelector("option:not([disabled])"); if (f1) piece.value = f1.value; else piece.selectedIndex = -1; }
      r.classList.toggle("none", !any);
      r.querySelector(".mm-none").textContent = any ? "" : "No " + (st === "men" ? "men's" : "women's") + " piece in " + fc + " yet. Pick another color, or choose \"No, each chooses\".";
      fillColors(r);
    }
    function fillColors(r){
      var col = r.querySelector("[name=pcolor]"), pc = findAny(r.querySelector("[name=piece]").value), m = matching();
      col.hidden = m; if (m) return;
      var vs = (pc && pc.variants) || [], cur = col.value;
      col.innerHTML = vs.length ? vs.map(function(v){ return '<option' + (v.name === cur ? " selected" : "") + '>' + esc(v.name) + '</option>'; }).join("") : '<option value="">Color: we will confirm</option>';
    }
    function addRow(role, st, item){
      var r = document.createElement("div"); r.className = "mm-member v2";
      r.innerHTML = '<input class="field" name="who" list="mm-roles" value="' + esc(role || "") + '" placeholder="Who? Choose or type a name" aria-label="Who is it for" autocomplete="off">' +
        '<select class="field" name="grp" aria-label="Collection"><option value="men">Men\'s</option><option value="women">Women\'s</option></select>' +
        '<select class="field" name="piece" aria-label="Piece"></select><select class="field" name="pcolor" aria-label="Color" hidden></select>' +
        '<select class="field" name="size" aria-label="Size">' + SIZES + '</select><button type="button" class="mm-x" aria-label="Remove">×</button><p class="mm-none" role="status"></p>';
      var who = r.querySelector("[name=who]"), grp = r.querySelector("[name=grp]");
      grp.value = st || roleSt[String(role || "").toLowerCase()] || store;
      who.addEventListener("input", function(){ var g = roleSt[who.value.trim().toLowerCase()]; if (g && g !== grp.value) { grp.value = g; fillPieces(r); } });
      grp.addEventListener("change", function(){ fillPieces(r); });
      r.querySelector("[name=piece]").addEventListener("change", function(){ fillColors(r); });
      r.querySelector(".mm-x").addEventListener("click", function(){ r.remove(); count(); });
      rows.appendChild(r); fillPieces(r, item); count();
      return r;
    }
    function count(){ var n = rows.children.length; $("[data-fam-count]", fam).textContent = n + (n === 1 ? " piece" : " pieces") + (n >= 3 ? " · family set price applies (" + MM.FAMILY_DEAL + " off)" : " · add " + (3 - n) + " more for the family set price"); }
    function refresh(){
      var m = matching(); $("[data-famcolor]", fam).hidden = !m; fam.classList.toggle("is-match", m);
      $("[data-fc-name]", fam).textContent = m ? famColor() : "";
      Array.prototype.forEach.call(rows.children, function(r){ fillPieces(r); });
    }
    $("[data-colors]", fam).innerHTML = colors.map(function(c, i){ return '<label class="mm-swatch"><input type="radio" name="color" value="' + esc(c[0]) + '"' + (i === 0 ? " checked" : "") + '><span style="background:' + esc(c[1]) + '"></span><em>' + esc(c[0]) + '</em></label>'; }).join("");
    $("[data-fc-note]", fam).textContent = hasStock ? "These are the colors we have in stock right now, across the men's and women's stores." : "Pick the color you have in mind and we will tell you which pieces we have in it.";
    // coming from a product page: start on that piece and one of its colors
    var fp = first && findAny(first);
    if (fp && fp.variants && fp.variants.length) { var pre = form.querySelector('[name=color][value="' + fp.variants[0].name.replace(/"/g, "") + '"]'); if (pre) pre.checked = true; }
    form.addEventListener("change", function(e){ if (e.target.name === "match" || e.target.name === "color") refresh(); });
    $("[data-add-member]", fam).addEventListener("click", function(){ var r = addRow("", store); r.querySelector("[name=who]").focus(); });
    var fs = first ? storeOf(first) : store;
    addRow(fs === "men" ? "Father" : "Mother", fs, first); addRow(fs === "men" ? "Mother" : "Father", fs === "men" ? "women" : "men"); addRow(fs === "men" ? "Son" : "Daughter", fs);
    refresh();
    wire(form, "family", function(d){
      var m = matching();
      d.pieces = Array.prototype.map.call(rows.children, function(r){ var pc = findAny(r.querySelector("[name=piece]").value), col = m ? famColor() : r.querySelector("[name=pcolor]").value;
        return (r.querySelector("[name=who]").value.trim() || "Family member") + ": " + (pc ? pc.name : "no piece chosen") + " (" + (col || "color to confirm") + ", " + (r.querySelector("[name=size]").value || "size?") + ")"; }).join("; ");
      if (!m) delete d.color;
      delete d.who; delete d.piece; delete d.size; delete d.grp; delete d.pcolor;
    }, "fam-done");
  }

  /* ---------- 5. Find us + reserve and try ---------- */
  var ev = $("[data-events]");
  if (ev) {
    function show(list){
      var up = (list || []).filter(function(x){ return x.date >= today(); }).sort(function(a, b){ return a.date < b.date ? -1 : 1; });
      var sel = $("[name=event]", ev.parentNode);
      if (!up.length) { ev.innerHTML = '<div class="empty">Our next pop-up dates are coming soon. Join the newsletter to hear first, or reserve below for pickup in ' + esc(MM.CITY.name) + '.</div>'; }
      else ev.innerHTML = up.map(function(x){ var d = new Date(x.date + "T12:00:00");
        return '<div class="mm-ev"><div class="mm-ev-date"><b>' + d.getDate() + '</b><span>' + MONTHS[d.getMonth()] + '</span></div><div><h3>' + esc(x.name) + '</h3><p class="muted">' + esc(x.place || "") + '</p></div></div>'; }).join("");
      if (sel) sel.innerHTML = up.map(function(x){ return '<option>' + esc(x.name + " · " + new Date(x.date + "T12:00:00").toLocaleDateString("en-US", {month: "short", day: "numeric"})) + '</option>'; }).join("") + '<option>Pickup in ' + esc(MM.CITY.name) + ' (we will text you a time)</option>';
    }
    if (MM.API) fetch(MM.API.replace(/\/$/, "") + "/api/public/events").then(function(r){ return r.json(); }).then(show).catch(function(){ show(MM.EVENTS); }); else show(MM.EVENTS);
    var rf = $("[data-reserve]");
    var rrows = $("[data-res-items]", rf);
    function resRow(item){
      if (rrows.children.length >= 4) return;
      var r = document.createElement("div"); r.className = "mm-member";
      r.innerHTML = '<select class="field" name="r_store" aria-label="Store"><option value="men">Men</option><option value="women">Women</option></select><select class="field" name="r_piece" aria-label="Piece"></select><select class="field" name="r_size" aria-label="Size">' + SIZES + '</select><button type="button" class="mm-x" aria-label="Remove">×</button>';
      var st = r.querySelector("[name=r_store]"), pc = r.querySelector("[name=r_piece]");
      st.value = item ? storeOf(item) : store; pc.innerHTML = productOptions(st.value, item);
      st.addEventListener("change", function(){ pc.innerHTML = productOptions(st.value); });
      r.querySelector(".mm-x").addEventListener("click", function(){ r.remove(); });
      rrows.appendChild(r);
    }
    resRow(params.get("item"));
    $("[data-res-add]", rf).addEventListener("click", function(){ resRow(); });
    wire(rf, "reserve", function(d){
      d.pieces = Array.prototype.map.call(rrows.children, function(r){ var x = findAny(r.querySelector("[name=r_piece]").value); return (x ? x.name : "") + " (" + (r.querySelector("[name=r_size]").value || "size?") + ")"; }).join("; ");
      delete d.r_store; delete d.r_piece; delete d.r_size;
    }, "res-done");
  }

  /* ---------- 7. Eid gifts ---------- */
  var gf = $("[data-gift]");
  if (gf) {
    var gp = $("[name=item]", gf), gst = $("[name=gstore]", gf);
    var gi = params.get("item"); gst.value = gi ? storeOf(gi) : store; gp.innerHTML = productOptions(gst.value, gi);
    gst.addEventListener("change", function(){ gp.innerHTML = productOptions(gst.value); });
    var lt = $("[name=lang]", gf), msg = $("[name=message]", gf);
    var ph = {English: "Eid Mubarak! Wishing you a blessed Eid.", Arabic: "عيد مبارك، وكل عام وأنتم بخير", Urdu: "عید مبارک! اللہ آپ کو خوش رکھے"};
    lt.addEventListener("change", function(){ msg.placeholder = ph[lt.value]; msg.dir = lt.value === "English" ? "ltr" : "rtl"; });
    wire(gf, "gift", function(d){ var x = findAny(d.item); d.item = x ? x.name : d.item; delete d.gstore; }, "gift-done");
  }

  /* ---------- search: a panel under the header with live results from both stores ---------- */
  var sBtn = document.querySelector('.icon-btn[aria-label="Search"]');
  if (sBtn) {
    var panel = document.createElement("div"); panel.className = "mm-search"; panel.hidden = true;
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Search");
    panel.innerHTML = '<div class="wrap"><form class="mm-s-form" role="search"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>' +
      '<input type="search" name="q" autocomplete="off" placeholder="Search djellabas, kaftans, colors, fabrics…" aria-label="Search"><button type="button" class="mm-s-x" aria-label="Close search">×</button></form>' +
      '<div class="mm-s-hints"><span>Try:</span>' + (store === "men" ? ["Djellaba", "Gandoura", "Melifa", "Summer", "White"] : ["Kaftan", "Abaya", "Kimono", "Crepe", "Winter"]).map(function(h){ return '<button type="button">' + h + '</button>'; }).join("") + '</div>' +
      '<div class="mm-s-res" aria-live="polite"></div></div>';
    document.querySelector(".site-header").appendChild(panel);
    var inp = panel.querySelector("input"), res = panel.querySelector(".mm-s-res");
    var CN = {men: "Men's", women: "Women's"};
    function match(p, qq){ var cs = CATS[storeOf(p.id)]; var hay = [p.name, cs[p.cat], (FABRICS[p.fabric] || {}).name, SEASONS[p.season], (p.colors || []).concat((p.variants || []).map(function(v){ return v.name; })).join(" "), p.note, p.badge].join(" ").toLowerCase();
      return qq.split(/\s+/).filter(Boolean).every(function(w){ return hay.indexOf(w.replace(/s$/, "")) > -1; }); }
    function runSearch(){
      var qq = inp.value.trim().toLowerCase(); if (!qq) { res.innerHTML = ""; return; }
      var mine = PRODUCTS[store].filter(function(p){ return !p.hidden && match(p, qq); });
      var other = store === "men" ? "women" : "men", theirs = PRODUCTS[other].filter(function(p){ return !p.hidden && match(p, qq); });
      var row = function(p){ var fp = firstPhoto(p), ph = fp ? '<img src="' + MM_IMG(fp) + '" alt="">' : '<span class="mm-s-ph"></span>';
        return '<a class="mm-s-item" href="product.html?id=' + p.id + '">' + ph + '<span><b>' + esc(p.name) + '</b><em>' + esc(CATS[storeOf(p.id)][p.cat]) + (p.price != null ? ' · $' + p.price : '') + '</em></span></a>'; };
      res.innerHTML = (mine.length ? '<div class="mm-s-grid">' + mine.slice(0, 6).map(row).join("") + '</div><a class="mm-s-all" href="shop.html?q=' + encodeURIComponent(inp.value.trim()) + '">' + (mine.length === 1 ? 'See it in the shop' : 'See all ' + mine.length + ' results') + ' →</a>'
        : '<p class="muted">Nothing in the ' + CN[store] + ' store for “' + esc(inp.value.trim()) + '”.</p>') +
        (theirs.length ? '<a class="mm-s-other" href="' + (/(men|women)-[a-z]+\.html/.test(location.pathname) ? other + '-shop.html?q=' : '../' + other + '/shop.html?q=') + encodeURIComponent(inp.value.trim()) + '">' + theirs.length + ' result' + (theirs.length > 1 ? "s" : "") + ' in the ' + CN[other] + ' store →</a>' : "");
    }
    function openS(){ panel.hidden = false; requestAnimationFrame(function(){ panel.classList.add("open"); }); inp.focus(); }
    function closeS(){ panel.classList.remove("open"); setTimeout(function(){ panel.hidden = true; }, 250); }
    sBtn.addEventListener("click", function(e){ e.preventDefault(); panel.hidden ? openS() : closeS(); });
    panel.querySelector(".mm-s-x").addEventListener("click", closeS);
    inp.addEventListener("input", runSearch);
    panel.querySelector("form").addEventListener("submit", function(e){ e.preventDefault(); if (inp.value.trim()) location.href = (document.querySelector(".mm-s-all") || {}).href || "shop.html?q=" + encodeURIComponent(inp.value.trim()); });
    panel.querySelectorAll(".mm-s-hints button").forEach(function(b){ b.addEventListener("click", function(){ inp.value = b.textContent; runSearch(); inp.focus(); }); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !panel.hidden) closeS(); if (e.key === "/" && panel.hidden && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || "")) { e.preventDefault(); openS(); } });
    document.addEventListener("click", function(e){ if (!panel.hidden && !panel.contains(e.target) && !sBtn.contains(e.target)) closeS(); });
    var q0 = params.get("q"); if (q0 && document.querySelector("[data-grid]")) inp.value = q0;
  }

  /* ---------- home page: clear header over the hero until you scroll ---------- */
  var hdr = document.querySelector(".site-header"), hero = document.querySelector(".hero-video");
  if (hdr && hero && document.body.hasAttribute("data-home")) {
    document.body.classList.add("mm-overlay");
    hdr.querySelectorAll(".logo img").forEach(function(im){
      var lt = im.cloneNode(); lt.classList.add("lt"); lt.alt = ""; lt.src = im.getAttribute("src").replace(/\.png$/, "-light.png"); im.parentNode.appendChild(lt);
    });
    var ann = document.querySelector(".announce");
    var place = function(){
      var h = ann ? ann.offsetHeight : 0;
      hdr.style.setProperty("--hdr-top", Math.max(0, h - window.scrollY) + "px");
      hdr.classList.toggle("over", !hdr.classList.contains("compact"));
    };
    window.addEventListener("scroll", place, {passive: true}); window.addEventListener("resize", place); place();
    // Hovering the header keeps it clear. It turns white only while the Shop menu or search is open,
    // or while the pointer is on the bag (and while the side bag is open).
    var bagHover = false, nb = hdr.querySelector(".nav-btn"), bagA = hdr.querySelector('a.icon-btn[href$="cart.html"]');
    var sync = function(){
      var on = (nb && nb.getAttribute("aria-expanded") === "true") || !!hdr.querySelector(".mm-search.open") || bagHover || document.body.classList.contains("bag-open");
      hdr.classList.toggle("solid", on);
    };
    if (bagA) {
      bagA.addEventListener("mouseenter", function(){ bagHover = true; sync(); });
      bagA.addEventListener("mouseleave", function(){ bagHover = false; sync(); });
      bagA.addEventListener("focus", function(){ bagHover = true; sync(); });
      bagA.addEventListener("blur", function(){ bagHover = false; sync(); });
    }
    var mo = new MutationObserver(sync);
    if (nb) mo.observe(nb, {attributes: true, attributeFilter: ["aria-expanded"]});
    mo.observe(document.body, {attributes: true, attributeFilter: ["class"]});
    mo.observe(hdr, {subtree: true, attributes: true, attributeFilter: ["class"]});
    sync();
  }

  var swl = document.querySelector(".switch-store");
  if (swl) swl.style.setProperty("--other-ros", "url('" + "" + (store === "men" ? "women" : "men") + "-rosette-light.png')");

  /* ---------- look and feel: section ornaments, scroll reveal, cart count pop ---------- */
  document.querySelectorAll(".section-head h2, .row-head h2").forEach(function(h){
    if (h.parentNode.querySelector(".mm-rule")) return;
    var img = document.createElement("img"); img.className = "mm-rule"; img.alt = ""; img.setAttribute("aria-hidden", "true");
    var dark = h.closest(".dark, .nl-band, .line-card.dark");
    img.src = "" + store + "-rule" + (dark ? "-light" : "") + ".png";
    h.parentNode.insertBefore(img, h.nextSibling);
  });
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var targets = document.querySelectorAll(".section-head, .row-head, .gallery-grid > *, .cats-row > *, .occ-grid > *, .grid > .card, .mm-way, .lines > *, .seasons > *, .trust-item, .mm-ev, .line-card");
    if (targets.length) {
      document.documentElement.classList.add("mm-rv");
      var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, {rootMargin: "0px 0px -8% 0px", threshold: 0.08});
      targets.forEach(function(t, i){
        var r = t.getBoundingClientRect();
        if (r.top < innerHeight) { t.classList.add("rv", "in"); return; }   // already on screen: no hiding
        t.classList.add("rv"); var sib = t.parentNode ? Array.prototype.indexOf.call(t.parentNode.children, t) : 0;
        t.style.transitionDelay = Math.min(sib, 5) * 0.08 + "s"; io.observe(t);
      });
    }
  }
  var cc = document.querySelector(".cart-count"), last = cc ? cc.textContent : "";
  if (cc) new MutationObserver(function(){ if (cc.textContent !== last) { last = cc.textContent; cc.classList.remove("pop"); void cc.offsetWidth; cc.classList.add("pop"); } }).observe(cc, {childList: true, characterData: true, subtree: true});

  /* ---------- 9. Piece tag page ---------- */
  var pc = $("[data-piece]");
  if (pc) {
    var id = params.get("id"), x = findAny(id) || items[0], xs = storeOf(x.id), f = FABRICS[x.fabric] || {name: ""};
    $("[data-piece-name]").textContent = x.name;
    $("[data-piece-meta]").textContent = CATS[xs][x.cat] + (f.name ? " · " + f.name : "") + " · Made in " + (x.origin || "Morocco");
    if (firstPhoto(x)) $("[data-piece-photo]").outerHTML = '<img class="pimg" src="' + MM_IMG(firstPhoto(x)) + '" alt="' + esc(x.name) + '">'; else $("[data-piece-photo]").textContent = "Photo · " + x.name;
    var care = {
      en: ["Hand wash cold with mild soap.", "Dry flat, out of direct sun.", "Iron on low, inside out.", "Store folded; heavy pieces stretch on a hanger."],
      ar: ["اغسل يدويًا بماء بارد وصابون لطيف.", "جففه مفرودًا بعيدًا عن الشمس المباشرة.", "اكوِه على حرارة منخفضة من الداخل.", "احفظه مطويًا، فالقطع الثقيلة تتمدد على العلاقة."],
      ur: ["ہلکے صابن اور ٹھنڈے پانی میں ہاتھ سے دھوئیں۔", "سیدھا پھیلا کر، دھوپ سے دور سکھائیں۔", "اندر کی طرف سے ہلکی آنچ پر استری کریں۔", "تہہ کر کے رکھیں، بھاری کپڑے ہینگر پر کھنچ جاتے ہیں۔"]
    };
    var tabs = $("[data-care-tabs]"), list = $("[data-care]");
    function careIn(l){ list.innerHTML = care[l].map(function(s){ return "<li>" + esc(s) + "</li>"; }).join(""); list.dir = l === "en" ? "ltr" : "rtl"; list.setAttribute("data-no-i18n", "");
      tabs.querySelectorAll("button").forEach(function(b){ b.setAttribute("aria-pressed", b.getAttribute("data-l") === l ? "true" : "false"); }); }
    tabs.addEventListener("click", function(e){ var b = e.target.closest("button"); if (b) careIn(b.getAttribute("data-l")); });
    careIn("en");
    var ff = $("[data-fit]");
    wire(ff, "fit", function(d){ d.piece = x.name; }, "fit-done");
    var ig = $("[data-ig]"); if (ig) ig.href = MM.INSTAGRAM;
  }
})();
