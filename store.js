(function(){
  var store = document.body.getAttribute("data-store");
  if (!store) return;
  var items = PRODUCTS[store].filter(function(p){ return !p.hidden; }), cats = CATS[store];
  // Colors: each product can have colors, each color its own photos (set in the admin)
  function vlist(p){ return p.variants && p.variants.length ? p.variants : null; }
  function vfind(p, name){ var vs = vlist(p); if (!vs) return null; name = String(name || "").toLowerCase(); for (var i = 0; i < vs.length; i++) if (vs[i].name.toLowerCase() === name) return vs[i]; return vs[0]; }
  function vph(p, v){ return v && v.photos && v.photos.length ? v.photos : (p.photos || []); }
  function photo(p, i, v){ var list = vph(p, v === undefined ? (vlist(p) || [])[0] : v), id = list[i || 0]; return id ? MM_IMG(id) : null; }
  function swatches(p, cur){
    var vs = vlist(p); if (!vs) return "";
    return '<span class="sw-row" aria-label="Colors">' + vs.map(function(v, i){ return '<span class="sw' + ((cur ? v === cur : i === 0) ? " on" : "") + '" data-sw="' + i + '" title="' + esc(v.name) + '" style="--c:' + esc(v.hex || "#ccc") + '"></span>'; }).join("") + (vs.length > 1 ? '<span class="sw-n">' + vs.length + ' colors</span>' : '<span class="sw-n">' + esc(vs[0].name) + '</span>') + '</span>';
  }
  window.mmVariant = {list: vlist, find: vfind, photos: vph};
  function badge(p){ return p.soldOut ? '<span class="badge sold">Sold out</span>' : p.badge ? '<span class="badge hot">' + esc(p.badge) + '</span>' : (p.fabric && FABRICS[p.fabric] ? '<span class="badge ready">' + FABRICS[p.fabric].name + '</span>' : ''); }
  var KEY = "mamounia-cart-" + store;

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function money(n){ return n == null ? "[PRICE]" : "$" + Number(n).toFixed(2).replace(/\.00$/, ""); }
  function find(id){ for (var i=0;i<items.length;i++) if (items[i].id===id) return items[i]; return null; }
  function readCart(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return window.__cart || []; } }
  function writeCart(c){ window.__cart = c; try { localStorage.setItem(KEY, JSON.stringify(c)); } catch(e){} updateCount(); }
  function updateCount(){
    var n = readCart().reduce(function(a,b){ return a + b.qty; }, 0);
    document.querySelectorAll(".cart-count").forEach(function(el){ el.textContent = n; el.setAttribute("data-n", n); });
  }
  // A product card. v = one color (the shop shows each color as its own card); withSw = color circles under it
  function card(p, v, withSw){
    if (v === undefined || typeof v === "number") v = null;
    var cur = v || (vlist(p) || [])[0] || null;
    var href = "product.html?id=" + p.id + (cur ? "&color=" + encodeURIComponent(cur.name) : "");
    var a = photo(p, 0, cur), b = photo(p, 1, cur);
    return '<a class="card" href="' + href + '" data-pid="' + p.id + '">' +
      '<div class="img">' + (a ? '<img class="pimg" src="' + a + '" alt="' + esc(p.name) + '" loading="lazy">' + (b ? '<img class="pimg alt" src="' + b + '" alt="" loading="lazy">' : '') : '<div class="ph">Photo · ' + esc(p.name) + '</div>') + badge(p) + '</div>' +
      '<span class="kind">' + (v ? esc(v.name) + ' · ' : '') + cats[p.cat] + ' · ' + SEASONS[p.season] + '</span>' +
      '<h3>' + esc(p.name) + '</h3><span class="price">' + money(p.price) + '</span>' + (withSw ? swatches(p, cur) : '') + '</a>';
  }
  window.mmCard = card;
  // Hovering (or tapping) a color circle shows that color's photos and points the card at that color
  function swShow(sw){
    var c = sw.closest(".card"); if (!c) return;
    var all = PRODUCTS.men.concat(PRODUCTS.women), p = null;
    for (var i = 0; i < all.length; i++) if (all[i].id === c.getAttribute("data-pid")) p = all[i];
    var v = p && vlist(p) && vlist(p)[+sw.getAttribute("data-sw")]; if (!v) return;
    var imgs = c.querySelectorAll(".img .pimg"), a = photo(p, 0, v), b = photo(p, 1, v);
    if (imgs[0] && a) imgs[0].src = a;
    if (imgs[1]) { if (b) imgs[1].src = b; imgs[1].style.display = b ? "" : "none"; }
    c.href = c.getAttribute("href").replace(/([?&]id=[^&]+).*$/, "$1") + "&color=" + encodeURIComponent(v.name);
    c.querySelectorAll(".sw").forEach(function(x){ x.classList.toggle("on", x === sw); });
  }
  document.addEventListener("pointerover", function(e){ var sw = e.target.closest && e.target.closest(".sw[data-sw]"); if (sw) swShow(sw); });
  document.addEventListener("pointerdown", function(e){ var sw = e.target.closest && e.target.closest(".sw[data-sw]"); if (sw) swShow(sw); });
  // Shop dropdown in the header: opens on hover (mouse) or click/tap, closes on Escape or outside click.
  var navBtn = document.querySelector(".nav-btn"), megaEl = document.getElementById("mega");
  if (navBtn && megaEl) {
    var hideT;
    function openMega(){ clearTimeout(hideT); megaEl.hidden = false; navBtn.setAttribute("aria-expanded", "true"); }
    function closeMega(){ megaEl.hidden = true; navBtn.setAttribute("aria-expanded", "false"); }
    function later(){ clearTimeout(hideT); hideT = setTimeout(closeMega, 180); }
    navBtn.addEventListener("click", function(){ megaEl.hidden ? openMega() : closeMega(); });
    if (window.matchMedia("(hover: hover) and (min-width: 861px)").matches) {
      navBtn.addEventListener("mouseenter", openMega);
      navBtn.addEventListener("mouseleave", later);
      megaEl.addEventListener("mouseenter", openMega);
      megaEl.addEventListener("mouseleave", later);
    }
    document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !megaEl.hidden) { closeMega(); navBtn.focus(); } });
    document.addEventListener("click", function(e){ if (!megaEl.hidden && !megaEl.contains(e.target) && !navBtn.contains(e.target)) closeMega(); });
  }

  // Header: full logo at the top of the page, wordmark once you scroll
  var hdr = document.querySelector(".site-header");
  if (hdr) {
    var compact = false;
    var onScroll = function(){
      var y = window.scrollY;
      // Shrink after 140px, grow back only near the very top, so the height change can't bounce it back and forth
      if (!compact && y > 140) { compact = true; hdr.classList.add("compact"); }
      else if (compact && y < 8) { compact = false; hdr.classList.remove("compact"); }
    };
    window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
  }

  // Moving blur when switching between the Men's and Women's stores
  var COLORS = {men:"#0E4A36", women:"#8C3B5A"};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function makeSwitcher(target){
    var sw = document.createElement("div");
    sw.className = "switcher";
    sw.innerHTML = '<span class="sw-color" style="background:' + COLORS[target] + '"></span><img src="' + target + '-logo-light.png" alt="">';
    document.body.appendChild(sw);
    return sw;
  }
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var m = a.getAttribute("href").match(/^(men|women)-/);
    if (!m || m[1] === store) return;
    e.preventDefault();
    var href = a.href;
    try { sessionStorage.setItem("mm-switch", m[1]); } catch(err){}
    if (reduce) { location.href = href; return; }
    var sw = makeSwitcher(m[1]);
    document.documentElement.classList.add("leaving");
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ sw.classList.add("in"); }); });
    setTimeout(function(){ location.href = href; }, 700);
  });
  // Arriving from the other store: start covered, then sweep away and un-blur
  if (document.documentElement.classList.contains("arriving")) {
    window.__arrived = true;
    try { sessionStorage.removeItem("mm-switch"); } catch(err){}
    var sw2 = makeSwitcher(store);
    sw2.style.transition = "none"; sw2.classList.add("in");
    void sw2.offsetWidth; sw2.style.transition = "";
    document.documentElement.classList.remove("arriving");
    document.documentElement.classList.add("leaving");
    setTimeout(function(){
      document.documentElement.classList.remove("leaving");
      sw2.classList.add("out");
      setTimeout(function(){ sw2.remove(); }, 750);
    }, reduce ? 0 : 380);
  }

  var params = new URLSearchParams(location.search);

  // Featured grid on the home page
  var feat = document.querySelector("[data-featured]");
  if (feat) feat.innerHTML = items.slice(0, 4).map(function(p){ return card(p, null, true); }).join("");

  // Shop page: arched garment doors, season switch, fabric and color menus
  var grid = document.querySelector("[data-grid]");
  if (grid) {
    var form = document.querySelector("[data-filters]");
    var title = document.querySelector("[data-shop-title]"), eyebrow = document.querySelector("[data-shop-eyebrow]"), intro = document.querySelector("[data-shop-intro]");
    var baseEyebrow = eyebrow ? eyebrow.textContent : "", baseIntro = intro ? intro.textContent : "";
    var INTRO = {
      djellaba: store === "men" ? "The hooded Moroccan robe, for Jumu'ah, Eid and every day." : "The hooded Moroccan robe, for every day and every occasion.",
      gandoura: "Light, loose robes made for hot days.", jabador: "A matching tunic and trousers, the classic Eid set.",
      jacket: "The djellaba's hood and trim, cut as a jacket.", kaftan: "Flowing kaftans for Eid, weddings and henna nights.",
      kimono: "Two-piece sets with an easy, open cut.", abaya: "Full-length abayas for every day.",
      summer: "Light, breathable fabrics made for hot summers.", winter: "Warmer, heavier fabrics for cold months."
    };
    // garment and season work like tabs: one at a time
    function single(name, el){
      var all = form.querySelector('input[name="' + name + '"][data-all]'), list = form.querySelectorAll('input[name="' + name + '"]');
      if (el === all || !el.checked) { list.forEach(function(i){ i.checked = i === all; }); return; }
      list.forEach(function(i){ if (i !== el) i.checked = false; });
    }
    function setOne(name, v){ var el = form.querySelector('input[name="' + name + '"][value="' + (v || "").replace(/"/g, "") + '"]'); if (el) { el.checked = true; single(name, el); } }
    if (params.get("cat")) setOne("cat", params.get("cat"));
    if (params.get("season")) setOne("season", params.get("season"));
    if (params.get("fabric")) form.querySelectorAll('input[name="fabric"]').forEach(function(i){ i.checked = i.value === params.get("fabric"); });
    var q = (params.get("q") || "").trim().toLowerCase();
    window.mmMatch = function(p, qq){ var hay = [p.name, cats[p.cat], (FABRICS[p.fabric] || {}).name, SEASONS[p.season], (p.colors || []).concat((p.variants || []).map(function(v){ return v.name; })).join(" "), p.note, p.badge].join(" ").toLowerCase();
      return qq.split(/\s+/).filter(Boolean).every(function(w){ return hay.indexOf(w.replace(/s$/, "")) > -1; }); };
    // hide garments with no pieces
    form.querySelectorAll('input[name="cat"]:not([data-all])').forEach(function(i){ if (!items.some(function(p){ return p.cat === i.value; })) i.closest(".door").hidden = true; });
    form.querySelectorAll('input[name="fabric"]').forEach(function(i){ if (!items.some(function(p){ return p.fabric === i.value; })) i.closest(".pill").hidden = true; });
    // Color menu, built from the colors you added in the admin
    var allColors = {};
    items.forEach(function(p){ (vlist(p) || []).forEach(function(v){ var k = v.name.toLowerCase(); if (!allColors[k]) allColors[k] = v; }); });
    var ck = Object.keys(allColors), cslot = form.querySelector("[data-color-slot]");
    if (ck.length && cslot) {
      cslot.outerHTML = '<details class="dd" data-dd><summary>Color <i data-dd-n></i></summary><div class="dd-pop dd-sw">' + ck.map(function(k){ var v = allColors[k];
        return '<label class="swf" title="' + esc(v.name) + '"><input type="checkbox" name="color" value="' + esc(k) + '"><span style="--c:' + esc(v.hex || "#ccc") + '"></span><em>' + esc(v.name) + '</em></label>'; }).join("") + '</div></details>';
      var pc = (params.get("color") || "").toLowerCase(); if (pc) form.querySelectorAll('input[name="color"]').forEach(function(i){ i.checked = i.value === pc; });
    }
    // one menu open at a time; click outside closes
    var dds = form.querySelectorAll("[data-dd]");
    dds.forEach(function(d){ d.addEventListener("toggle", function(){ if (d.open) dds.forEach(function(o){ if (o !== d) o.open = false; }); }); });
    document.addEventListener("click", function(e){ dds.forEach(function(d){ if (d.open && !d.contains(e.target)) d.open = false; }); });
    var STORY = '<aside class="coll-story"><img src="' + store + '-rosette-light.png" alt=""><span class="eyebrow">Mamounia</span><p>Cut and sewn in Morocco. Not sure of your size? Tell us your height and we check it before we ship.</p><a href="custom.html">Or have one made to your measurements →</a></aside>';
    var first = true;
    function apply(){
      var pick = function(k){ return Array.prototype.map.call(form.querySelectorAll('input[name="' + k + '"]:checked'), function(i){ return i.value; }).filter(Boolean); };
      var c = pick("cat"), s = pick("season"), t = pick("fabric"), cl = pick("color");
      var base = function(p){ return (!s.length || s.indexOf(p.season) > -1 || p.season === "all") && (!t.length || t.indexOf(p.fabric) > -1) && (!q || mmMatch(p, q)); };
      var list = items.filter(function(p){ return (!c.length || c.indexOf(p.cat) > -1) && base(p); });
      var cards = [];
      list.forEach(function(p){
        var vs = vlist(p);
        if (!vs) { if (!cl.length) cards.push(card(p)); return; }
        vs.forEach(function(v){ if (!cl.length || cl.indexOf(v.name.toLowerCase()) > -1) cards.push(card(p, v)); });
      });
      var n = cards.length;
      if (n >= 7) cards.splice(5, 0, STORY);
      grid.innerHTML = n ? cards.join("") : '<div class="empty coll-empty"><h3>Nothing here yet</h3><p>No pieces match these choices. Try another fabric or season.</p></div>';
      grid.querySelectorAll(".card, .coll-story").forEach(function(el, i){ el.classList.add("rv", "in"); el.style.setProperty("--i", Math.min(i, 10)); });
      grid.classList.remove("enter"); void grid.offsetWidth; grid.classList.add("enter");
      document.querySelector("[data-count]").textContent = n + (n === 1 ? " piece" : " pieces");
      // counts on the garment doors
      form.querySelectorAll("[data-ccount]").forEach(function(el){ var k = el.getAttribute("data-ccount"); el.textContent = items.filter(function(p){ return (!k || p.cat === k) && base(p); }).length; });
      dds.forEach(function(d){ var k = d.querySelectorAll("input:checked").length; d.querySelector("[data-dd-n]").textContent = k ? k : ""; d.classList.toggle("has", k > 0); });
      // the heading follows what you picked
      var head = "Shop All", eb = baseEyebrow, it = baseIntro, layer = "all";
      if (c.length === 1) { head = cats[c[0]] + "s"; it = INTRO[c[0]] || baseIntro; layer = "cat-" + c[0]; }
      if (s.length === 1) { if (c.length === 1) eb = SEASONS[s[0]] + " · " + baseEyebrow; else { head = SEASONS[s[0]] + " Collection"; it = INTRO[s[0]]; layer = "season-" + s[0]; } }
      if (!c.length && !s.length && t.length === 1 && FABRICS[t[0]]) { head = FABRICS[t[0]].name; it = FABRICS[t[0]].note || baseIntro; }
      if (q) { head = "Results for “" + params.get("q").trim() + "”"; }
      if (title && title.textContent !== head) { title.textContent = head; if (!first) { title.classList.remove("swap"); void title.offsetWidth; title.classList.add("swap"); } }
      if (eyebrow) eyebrow.textContent = eb; if (intro) intro.textContent = it;
      document.querySelectorAll(".cw-layer").forEach(function(l){ l.classList.toggle("on", l.getAttribute("data-layer") === layer); });
      var any = c.length || s.length || t.length || cl.length || q; document.querySelector("[data-clear]").hidden = !any;
      if (!first) { var u = new URLSearchParams(); if (c.length === 1) u.set("cat", c[0]); if (s.length === 1) u.set("season", s[0]); if (t.length === 1) u.set("fabric", t[0]); if (cl.length === 1) u.set("color", cl[0]); if (q) u.set("q", params.get("q"));
        try { history.replaceState(null, "", location.pathname + (u.toString() ? "?" + u : "")); } catch(e){} }
      first = false;
    }
    form.addEventListener("change", function(e){ var el = e.target; if (el.name === "cat" || el.name === "season") single(el.name, el); apply(); });
    document.querySelector("[data-clear]").addEventListener("click", function(){
      form.querySelectorAll("input").forEach(function(i){ i.checked = i.hasAttribute("data-all"); }); q = ""; apply();
    });
    apply();
  }

  // Product page
  var pp = document.querySelector("[data-product]");
  if (pp) {
    var p = find(params.get("id")) || items[0];
    document.title = p.name + " | Mamounia";
    pp.querySelectorAll("[data-p]").forEach(function(el){
      var k = el.getAttribute("data-p");
      if (k === "name") el.textContent = p.name;
      if (k === "kind") el.textContent = cats[p.cat] + " · " + SEASONS[p.season];
      if (k === "price") el.textContent = money(p.price);
      if (k === "photo") el.setAttribute("data-photo-slot", "");
      if (k === "cat") { el.textContent = cats[p.cat] + "s"; el.href = "shop.html?cat=" + p.cat; }
      if (k === "badge") { if (p.soldOut) { el.textContent = "Sold out"; el.className = "badge sold"; } else if (p.badge) { el.textContent = p.badge; el.className = "badge hot"; } else if (p.fabric) { el.textContent = FABRICS[p.fabric].name; el.className = "badge ready"; } else el.hidden = true; }
    });
    // Gallery: shows the photos of the chosen color
    var thumbs = pp.querySelector(".thumbs"), slot = pp.querySelector("[data-photo-slot]"), curV = vfind(p, params.get("color")), shown = [];
    function gallery(v){
      shown = vph(p, v);
      if (shown.length) {
        var m = pp.querySelector("[data-main]");
        if (!m) { slot.outerHTML = '<img class="pimg main-img" data-main alt="' + esc(p.name) + '">'; m = pp.querySelector("[data-main]"); }
        m.classList.remove("swap"); void m.offsetWidth; m.classList.add("swap"); m.src = MM_IMG(shown[0]);
        if (thumbs) { thumbs.hidden = shown.length < 2; thumbs.innerHTML = shown.map(function(id, i){ return '<button type="button" class="thumb' + (i === 0 ? " on" : "") + '" data-i="' + i + '" aria-label="Photo ' + (i + 1) + '"><img src="' + MM_IMG(id) + '" alt="" loading="lazy"></button>'; }).join(""); }
      } else if (slot && !pp.querySelector("[data-main]")) slot.textContent = "Photo · " + p.name + (v ? " · " + v.name : "");
    }
    if (thumbs) thumbs.addEventListener("click", function(e){ var t = e.target.closest(".thumb"); if (!t) return; var m = pp.querySelector("[data-main]"); if (m) m.src = MM_IMG(shown[+t.getAttribute("data-i")]); thumbs.querySelectorAll(".thumb").forEach(function(x){ x.classList.toggle("on", x === t); }); });
    gallery(curV);
    var f = FABRICS[p.fabric] || {name:"", note:""};
    var parts = ["Made in Morocco. In stock and ships within a few days."];
    if (p.note) parts.push(p.note + ".");
    if (f.note) parts.push(f.note);
    parts.push(p.season === "summer" ? "Light, breathable fabric for warm weather." : p.season === "winter" ? "Warm, heavier fabric for cold months." : "Comfortable all year.");
    pp.querySelector("[data-desc]").innerHTML = parts.map(function(x){ return "<span>" + esc(x) + "</span>"; }).join(" ");
    var fab = pp.querySelector("[data-fabric]"); if (fab) fab.textContent = f.name || "[FABRIC]";
    var sel = pp.querySelector("[data-colors]"), colBox = sel.closest("div");
    var vsP = vlist(p);
    if (vsP) {
      colBox.innerHTML = '<span class="opt-label">Color: <b data-cname>' + esc(curV.name) + '</b></span><div class="sw-pick" role="radiogroup" aria-label="Color">' +
        vsP.map(function(v, i){ return '<button type="button" role="radio" class="swp' + (v === curV ? " on" : "") + '" aria-checked="' + (v === curV) + '" data-i="' + i + '" title="' + esc(v.name) + '" style="--c:' + esc(v.hex || "#ccc") + '"><span class="sr">' + esc(v.name) + '</span></button>'; }).join("") + '</div>';
      colBox.addEventListener("click", function(e){
        var b = e.target.closest(".swp"); if (!b) return;
        curV = vsP[+b.getAttribute("data-i")];
        colBox.querySelectorAll(".swp").forEach(function(x){ x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); });
        colBox.querySelector("[data-cname]").textContent = curV.name; gallery(curV);
        try { var u = new URL(location.href); u.searchParams.set("color", curV.name); history.replaceState(null, "", u); } catch(x){}
      });
      colBox.addEventListener("mouseover", function(e){ var b = e.target.closest(".swp"); if (b) colBox.querySelector("[data-cname]").textContent = vsP[+b.getAttribute("data-i")].name; });
      colBox.addEventListener("mouseleave", function(){ colBox.querySelector("[data-cname]").textContent = curV.name; });
    } else {
      sel.innerHTML = (p.colors || []).map(function(c){ return "<option>" + esc(c) + "</option>"; }).join("");
      if (!(p.colors || []).length) colBox.hidden = true;
    }
    var size = null;
    // Sizes that are sold out (from the admin's stock) can't be picked
    if (p.sizesLeft) pp.querySelectorAll(".sizes button").forEach(function(b){ var n = p.sizesLeft[b.textContent]; if (n != null && n <= 0) { b.disabled = true; b.title = "Sold out"; } });
    if (p.soldOut) { var ab = pp.querySelector("[data-add]"); ab.disabled = true; ab.textContent = "Sold out"; }
    pp.querySelectorAll(".sizes button").forEach(function(b){
      b.addEventListener("click", function(){
        pp.querySelectorAll(".sizes button").forEach(function(x){ x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true"); size = b.textContent;
        pp.querySelector("[data-size-msg]").textContent = "";
      });
    });
    pp.querySelector("[data-add]").addEventListener("click", function(){
      if (!size) { pp.querySelector("[data-size-msg]").textContent = "Please choose a size."; return; }
      var c = readCart(), color = vsP ? curV.name : ((p.colors || []).length ? sel.value : ""), hit = null;
      c.forEach(function(it){ if (it.id === p.id && it.size === size && it.color === color) hit = it; });
      if (hit) hit.qty++; else c.push({id:p.id, size:size, color:color, qty:1});
      writeCart(c);
      document.querySelectorAll(".cart-count").forEach(function(el){ el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); });
      if (window.mmOpenBag) window.mmOpenBag(p.id + "|" + size + "|" + color);
      else { var t = document.querySelector(".toast"); t.classList.add("show"); clearTimeout(window.__tt); window.__tt = setTimeout(function(){ t.classList.remove("show"); }, 3500); }
    });
    var rel = document.querySelector("[data-related]");
    if (rel) rel.innerHTML = items.filter(function(x){ return x.id !== p.id; }).slice(0, 4).map(function(x){ return card(x, null, true); }).join("");
  }

  // Cart page
  var cartBox = document.querySelector("[data-cart]");
  function renderCart(){
    var c = readCart();
    if (!c.length) {
      cartBox.innerHTML = '<div class="empty">Your bag is empty. <a href="shop.html">Start shopping</a></div>';
    } else {
      cartBox.innerHTML = c.map(function(it, i){
        var p = find(it.id) || {name:"Item", price:null};
        var cv = vlist(p) ? vfind(p, it.color) : undefined, cimg = photo(p, 0, cv);
        return '<div class="cart-item">' + (cimg ? '<img class="pimg cart-img" src="' + cimg + '" alt="">' : '<div class="ph">Photo</div>') + '<div class="grow"><h3>' + esc(p.name) + '</h3><span class="muted">Size ' + esc(it.size) + (it.color ? ' · ' + esc(it.color) : '') + '</span><br><button class="remove" data-rm="' + i + '">Remove</button></div>' +
          '<div class="qty"><button aria-label="Less" data-dec="' + i + '">−</button><span>' + it.qty + '</span><button aria-label="More" data-inc="' + i + '">+</button></div>' +
          '<strong style="min-width:90px;text-align:right">' + money(p.price == null ? null : p.price * it.qty) + '</strong></div>';
      }).join("");
    }
    var total = 0, known = true;
    c.forEach(function(it){ var p = find(it.id); if (!p || p.price == null) known = false; else total += p.price * it.qty; });
    document.querySelector("[data-subtotal]").textContent = c.length ? (known ? money(total) : "[PRICE]") : "$0";
    document.querySelector("[data-checkout]").disabled = !c.length;
  }
  if (cartBox) {
    cartBox.addEventListener("click", function(e){
      var c = readCart(), b = e.target;
      if (b.dataset.inc) c[b.dataset.inc].qty++;
      else if (b.dataset.dec) { var i = b.dataset.dec; c[i].qty--; if (c[i].qty < 1) c.splice(i, 1); }
      else if (b.dataset.rm) c.splice(b.dataset.rm, 1);
      else return;
      writeCart(c); renderCart();
    });
    document.querySelector("[data-checkout]").addEventListener("click", function(){
      // Connect checkout here: send the cart to your backend / Stripe Checkout, or open a Stripe Payment Link.
      var msg = document.querySelector("[data-checkout-msg]");
      if (msg) msg.textContent = "Checkout is not connected yet. Add your Stripe link or backend in assets/store.js.";
    });
    renderCart();
  }


  /* ---------- Side bag: slides in from the right when you tap the bag or add a piece ---------- */
  var onCartPage = !!cartBox, bag = null, bagVeil = null, lastFocus = null, flashKey = "";
  var BAG_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 8h14l-1.5 12h-11z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
  function buildBag(){
    if (bag) return;
    bagVeil = document.createElement("div"); bagVeil.className = "bag-veil";
    bag = document.createElement("aside"); bag.className = "bag"; bag.setAttribute("role", "dialog"); bag.setAttribute("aria-modal", "true"); bag.setAttribute("aria-labelledby", "bag-title"); bag.tabIndex = -1;
    bag.innerHTML = '<div class="bag-head"><div><span class="bag-eyebrow">Mamounia · ' + (store === "men" ? "Men" : "Women") + '</span><h2 id="bag-title">Your bag <em data-bag-n></em></h2></div>' +
      '<button type="button" class="bag-x" data-bag-close aria-label="Close the bag"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<img class="bag-rule" src="' + store + '-rule.png" alt="">' +
      '<div class="bag-body" data-bag-body></div><div class="bag-foot" data-bag-foot></div>';
    document.body.appendChild(bagVeil); document.body.appendChild(bag);
    bagVeil.addEventListener("click", closeBag);
    bag.addEventListener("click", function(e){
      var t = e.target.closest("button, a"); if (!t) return;
      if (t.hasAttribute("data-bag-close")) { e.preventDefault(); closeBag(); return; }
      var c = readCart(), i;
      if ((i = t.getAttribute("data-binc")) !== null) c[+i].qty++;
      else if ((i = t.getAttribute("data-bdec")) !== null) { c[+i].qty--; if (c[+i].qty < 1) { removeRow(+i); return; } }
      else if ((i = t.getAttribute("data-brm")) !== null) { removeRow(+i); return; }
      else return;
      writeCart(c); renderBag();
    });
    document.addEventListener("keydown", function(e){
      if (!document.body.classList.contains("bag-open")) return;
      if (e.key === "Escape") closeBag();
      if (e.key === "Tab") {  // keep the keyboard inside the bag
        var f = bag.querySelectorAll("button:not([disabled]), a[href]"); if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
  function removeRow(i){
    var row = bag.querySelector('[data-row="' + i + '"]');
    var go = function(){ var c = readCart(); c.splice(i, 1); writeCart(c); renderBag(); };
    if (row) { row.classList.add("out"); setTimeout(go, 280); } else go();
  }
  function renderBag(){
    var c = readCart(), n = c.reduce(function(a, b){ return a + b.qty; }, 0), body = bag.querySelector("[data-bag-body]"), foot = bag.querySelector("[data-bag-foot]");
    bag.querySelector("[data-bag-n]").textContent = n ? "(" + n + ")" : "";
    if (!c.length) {
      var picks = items.filter(function(p){ return !p.soldOut; }).slice(0, 2);
      body.innerHTML = '<div class="bag-empty"><span class="bag-arch">' + BAG_ICON + '</span><h3>Your bag is empty</h3><p>Every piece is made in Morocco and ships from the USA.</p><a class="btn" href="shop.html">Start shopping</a></div>' +
        (picks.length ? '<div class="bag-recs"><span class="bag-eyebrow">You might like</span><div class="bag-rec-row">' + picks.map(recCard).join("") + '</div></div>' : "");
      foot.innerHTML = ""; foot.hidden = true; return;
    }
    foot.hidden = false;
    var total = 0, known = true;
    body.innerHTML = '<ul class="bag-list">' + c.map(function(it, i){
      var p = find(it.id) || {name: "Item", price: null};
      var cv = vlist(p) ? vfind(p, it.color) : undefined, img = photo(p, 0, cv);
      if (p.price == null) known = false; else total += p.price * it.qty;
      var key = it.id + "|" + it.size + "|" + it.color;
      return '<li class="bag-item' + (key === flashKey ? " new" : "") + '" data-row="' + i + '" style="--d:' + (i * 60) + 'ms">' +
        '<a class="bag-img" href="product.html?id=' + encodeURIComponent(p.id || it.id) + (it.color ? "&color=" + encodeURIComponent(it.color) : "") + '">' + (img ? '<img src="' + img + '" alt="">' : '<span class="ph"></span>') + '</a>' +
        '<div class="bag-info"><h3>' + esc(p.name) + '</h3><span class="bag-meta">Size ' + esc(it.size) + (it.color ? ' · ' + esc(it.color) : '') + '</span>' +
        '<div class="bag-row"><div class="bag-qty"><button type="button" data-bdec="' + i + '" aria-label="One less">−</button><span aria-live="polite">' + it.qty + '</span><button type="button" data-binc="' + i + '" aria-label="One more">+</button></div>' +
        '<strong>' + money(p.price == null ? null : p.price * it.qty) + '</strong></div>' +
        '<button type="button" class="bag-rm" data-brm="' + i + '">Remove</button></div></li>';
    }).join("") + '</ul>';
    // complete the look: pieces not already in the bag
    var inBag = c.map(function(it){ return it.id; }), recs = items.filter(function(p){ return inBag.indexOf(p.id) < 0 && !p.soldOut; }).slice(0, 2);
    if (recs.length) body.innerHTML += '<div class="bag-recs"><span class="bag-eyebrow">Complete the look</span><div class="bag-rec-row">' + recs.map(recCard).join("") + '</div></div>';
    foot.innerHTML = '<div class="bag-sub"><span>Subtotal</span><strong>' + (known ? money(total) : "[PRICE]") + '</strong></div>' +
      '<p class="bag-note">We confirm your sizes and send a secure payment link, usually the same day.</p>' +
      '<a class="btn bag-go" href="cart.html?checkout=1">Checkout <span aria-hidden="true">→</span></a>' +
      '<a class="bag-view" href="cart.html">View full bag</a>';
    flashKey = "";
  }
  function recCard(p){
    var img = photo(p, 0);
    return '<a class="bag-rec" href="product.html?id=' + encodeURIComponent(p.id) + '">' + (img ? '<img src="' + img + '" alt="">' : '<span class="ph"></span>') +
      '<span class="bag-rec-n">' + esc(p.name) + '</span><span class="bag-rec-p">' + money(p.price) + '</span></a>';
  }
  function openBag(){
    buildBag(); renderBag();
    lastFocus = document.activeElement;
    var sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty("--sbw", sw + "px");
    void bag.offsetWidth;
    document.body.classList.add("bag-open");
    setTimeout(function(){ var x = bag.querySelector(".bag-x"); if (x) x.focus({preventScroll: true}); }, 60);
  }
  function closeBag(){
    if (!bag) return;
    document.body.classList.remove("bag-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus({preventScroll: true});
  }
  window.mmOpenBag = function(key){ flashKey = key || ""; openBag(); };
  if (!onCartPage) {
    document.addEventListener("click", function(e){
      var a = e.target.closest && e.target.closest('a.icon-btn[href$="cart.html"]');
      if (!a || e.metaKey || e.ctrlKey) return;
      e.preventDefault(); openBag();
      var cnt = a.querySelector(".cart-count"); if (cnt) { cnt.classList.remove("pop"); void cnt.offsetWidth; cnt.classList.add("pop"); }
    });
  }

  // Made-to-order and waitlist forms (demo: show a thank-you; connect to your backend)
  document.querySelectorAll("form[data-demo]").forEach(function(f){
    f.addEventListener("submit", function(e){
      e.preventDefault();
      var done = document.getElementById(f.getAttribute("data-demo"));
      if (done) { f.style.display = "none"; done.style.display = "block"; done.scrollIntoView({block:"center"}); }
    });
  });

  // Newsletter discount. The card opens by itself once (first visit to the store home),
  // and can always be reopened from the "Get 10% off" tab and the signup band above the footer.
  // Change the discount and code here.
  var OFFER = { percent: (window.MM_SETTINGS || {}).offer_percent || "10%", code: (window.MM_SETTINGS || {}).offer_code || "[YOUR CODE]" };
  var WELCOME = {
    men: { title: "Welcome to the Men's store", text: "Join the list for your first-order discount, plus early access to new djellabas and Eid collections." },
    women: { title: "Welcome to the Women's store", text: "Join the list for your first-order discount, plus first look at new kaftans and Eid collections." }
  };
  var seenKey = "mamounia-welcome-" + store, joinedKey = "mamounia-joined-" + store;
  function getFlag(k){ try { return localStorage.getItem(k) === "1"; } catch(e){ return !!(window.__flags || {})[k]; } }
  function setFlag(k){ window.__flags = window.__flags || {}; window.__flags[k] = true; try { localStorage.setItem(k, "1"); } catch(e){} }
  var lastFocus = null;

  function showCode(container){
    container.querySelectorAll("[data-nl-form]").forEach(function(f){ f.hidden = true; });
    container.querySelectorAll("[data-nl-done]").forEach(function(d){ d.hidden = false; });
  }
  function onJoin(){
    setFlag(joinedKey); setFlag(seenKey);
    // Connect to your email list here (Mailchimp, Klaviyo or your backend).
    var tab = document.querySelector(".nl-tab"); if (tab) tab.hidden = true;
    showCode(document);
  }

  function openNl(){
    if (document.querySelector(".nl-veil")) return;
    lastFocus = document.activeElement;
    var art = document.querySelector(".nl-band svg.pattern");
    var w = WELCOME[store], joined = getFlag(joinedKey);
    var veil = document.createElement("div");
    veil.className = "nl-veil";
    veil.innerHTML =
      '<div class="nl-card" role="dialog" aria-modal="true" aria-labelledby="nl-title">' +
        '<button class="nl-x" type="button" aria-label="Close">×</button>' +
        '<div class="nl-art">' + (art ? art.outerHTML.replace("nl-src", "").replace(/id="([\w-]+)"/, 'id="nlP"').replace(/url\(#[\w-]+\)/, "url(#nlP)") : "") +
          '<div class="nl-door"><img class="nl-ros" src="' + store + '-rosette.png" alt=""><b>' + OFFER.percent + '</b><span>off your<br>first order</span></div></div>' +
        '<div class="nl-body"><img class="nl-brand" src="' + store + '-logo.png" alt="Mamounia"><span class="eyebrow">Mamounia newsletter</span><h2 id="nl-title">' + w.title + '</h2><p class="muted">' + w.text + '</p>' +
          '<form data-nl-form' + (joined ? ' hidden' : '') + '><label for="nl-email" class="sr">Email address</label><input id="nl-email" class="field" type="email" required placeholder="Your email address"><button class="btn" type="submit">Get my ' + OFFER.percent + ' off</button>' +
            '<button class="nl-skip" type="button" data-nl-close>No thanks, take me to the store</button></form>' +
          '<div class="nl-code" data-nl-done' + (joined ? '' : ' hidden') + '><p>You are on the list. Use this code at checkout:</p><div class="code">' + OFFER.code + '</div><button class="btn" type="button" data-nl-close>Start shopping</button></div>' +
          '<p class="nl-fine">One email a week at most. Unsubscribe anytime.</p></div>' +
      '</div>';
    function closeNl(){ setFlag(seenKey); veil.classList.remove("show"); setTimeout(function(){ veil.remove(); }, 400); document.removeEventListener("keydown", onKey); if (lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true}); }
    function onKey(e){ if (e.key === "Escape") closeNl(); }
    veil.addEventListener("click", function(e){ if (e.target === veil || e.target.closest(".nl-x") || e.target.closest("[data-nl-close]")) closeNl(); });
    veil.querySelector("[data-nl-form]").addEventListener("submit", function(e){ e.preventDefault(); onJoin(); });
    document.body.appendChild(veil);
    requestAnimationFrame(function(){ veil.classList.add("show"); });
    document.addEventListener("keydown", onKey);
    var f = veil.querySelector("#nl-email"); if (f && !joined) f.focus({preventScroll:true});
  }

  // Floating "Get 10% off" tab on every page until the visitor joins
  var tab = document.createElement("button");
  tab.type = "button"; tab.className = "nl-tab";
  tab.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18M12 8v13M12 8c-1.5-3-5-4-5-1.5S10 8 12 8zM12 8c1.5-3 5-4 5-1.5S14 8 12 8z"/></svg><span>Get ' + OFFER.percent + ' off</span>';
  tab.hidden = getFlag(joinedKey);
  tab.addEventListener("click", openNl);
  document.body.appendChild(tab);

  // Signup band above the footer
  document.querySelectorAll("[data-nl-inline]").forEach(function(f){
    if (getFlag(joinedKey)) showCode(f.parentNode);
    f.addEventListener("submit", function(e){ e.preventDefault(); onJoin(); });
  });
  document.querySelectorAll("[data-offer]").forEach(function(el){ el.textContent = OFFER.percent; });
  document.querySelectorAll("[data-offer-code]").forEach(function(el){ el.textContent = OFFER.code; });

  // Open by itself once, on the store home
  var sessionKey = "mamounia-nl-session-" + store, shownThisVisit = false;
  try { shownThisVisit = sessionStorage.getItem(sessionKey) === "1"; } catch(e){ shownThisVisit = !document.body.hasAttribute("data-home"); }
  if (!shownThisVisit && !getFlag(joinedKey)) {
    try { sessionStorage.setItem(sessionKey, "1"); } catch(e){}
    setTimeout(openNl, window.__arrived ? 1500 : 900);
  }

  updateCount();
})();
