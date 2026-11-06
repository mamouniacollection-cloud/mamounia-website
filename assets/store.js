/* Mamounia store script: product list, shop filters, product page, cart.
   EDIT YOUR PRODUCTS HERE (from the second shipment sheets).
   price: set a number (e.g. 89) to show it and let the cart total work.
   colors: add the colors you stock, e.g. ["White","Navy"]; leave [] to hide the color picker.
   season: "summer" | "winter" | "all"   fabric: one of the keys in FABRICS below. */
var PRODUCTS = {
  men: [
    {id:"m1",  name:"Premium Striped Djellaba",        cat:"djellaba", season:"all",    fabric:"striped",   note:"Hand-stitched banda trim", price:null, colors:[]},
    {id:"m2",  name:"Summer Gabardine Djellaba",       cat:"djellaba", season:"summer", fabric:"gabardine", price:null, colors:[]},
    {id:"m3",  name:"Thick Sousdi Djellaba",           cat:"djellaba", season:"all",    fabric:"sousdi",    price:null, colors:[]},
    {id:"m4",  name:"Light Sousdi Djellaba",           cat:"djellaba", season:"all",    fabric:"sousdi",    price:null, colors:[]},
    {id:"m5",  name:"Gabardine Jabador",               cat:"jabador",  season:"all",    fabric:"gabardine", price:null, colors:[]},
    {id:"m6",  name:"Gabardine Gandoura",              cat:"gandoura", season:"summer", fabric:"gabardine", price:null, colors:[]},
    {id:"m7",  name:"Designed Gabardine Gandoura",     cat:"gandoura", season:"summer", fabric:"gabardine", price:null, colors:[]},
    {id:"m8",  name:"Jim Gandoura",                    cat:"gandoura", season:"summer", fabric:"jim",       price:null, colors:[]},
    {id:"m9",  name:"Linen Gandoura",                  cat:"gandoura", season:"summer", fabric:"linen",     price:null, colors:[]},
    {id:"m10", name:"Light Melifa Djellaba",           cat:"djellaba", season:"winter", fabric:"melifa",    price:null, colors:[]},
    {id:"m11", name:"Thick Melifa Djellaba",           cat:"djellaba", season:"winter", fabric:"melifa",    price:null, colors:[]},
    {id:"m12", name:"Bouclette Djellaba",              cat:"djellaba", season:"winter", fabric:"bouclette", price:null, colors:[]},
    {id:"m13", name:"Bouclette Djellaba Jacket",       cat:"jacket",   season:"winter", fabric:"bouclette", price:null, colors:[]}
  ],
  women: [
    {id:"w1",  name:"Faux Suede Djellaba",             cat:"djellaba", season:"winter", fabric:"suede",     price:null, colors:[]},
    {id:"w2",  name:"Crepe Summer Djellaba",           cat:"djellaba", season:"summer", fabric:"crepe",     price:null, colors:[]},
    {id:"w3",  name:"Light Melifa Djellaba",           cat:"djellaba", season:"all",    fabric:"melifa",    price:null, colors:[]},
    {id:"w4",  name:"Thick Melifa Djellaba",           cat:"djellaba", season:"winter", fabric:"melifa",    price:null, colors:[]},
    {id:"w5",  name:"Crepe Kaftan",                    cat:"kaftan",   season:"all",    fabric:"crepe",     price:null, colors:[]},
    {id:"w6",  name:"Mobra Kaftan",                    cat:"kaftan",   season:"winter", fabric:"mobra",     price:null, colors:[]},
    {id:"w7",  name:"Crepe Two-Piece Kimono",          cat:"kimono",   season:"all",    fabric:"crepe",     price:null, colors:[]},
    {id:"w8",  name:"Mobra Two-Piece Kimono",          cat:"kimono",   season:"all",    fabric:"mobra",     price:null, colors:[]},
    {id:"w9",  name:"Simple Crepe Abaya",              cat:"abaya",    season:"all",    fabric:"crepe",     price:null, colors:[]},
    {id:"w10", name:"Premium Crepe Abaya",             cat:"abaya",    season:"all",    fabric:"crepe",     price:null, colors:[]},
    {id:"w11", name:"Women's Jabador",                 cat:"jabador",  season:"all",    fabric:"",          price:null, colors:[]}
  ]
};
var CATS = {
  men: {djellaba:"Djellaba", gandoura:"Gandoura", jabador:"Jabador", jacket:"Djellaba Jacket"},
  women: {djellaba:"Djellaba", kaftan:"Kaftan", kimono:"Two-Piece Kimono", abaya:"Abaya", jabador:"Jabador"}
};
// Fabric names and a one-line note shown on the product page (leave note empty if unsure)
var FABRICS = {
  gabardine: {name:"Gabardine", note:"A smooth, sturdy woven fabric that holds its shape and resists wrinkles."},
  sousdi:    {name:"Sousdi",    note:"A traditional Moroccan striped weave."},
  striped:   {name:"Striped",   note:"A striped Moroccan weave."},
  jim:       {name:"Jim",       note:""},
  linen:     {name:"Linen",     note:"Light and breathable, made for hot days."},
  melifa:    {name:"Melifa",    note:"A soft, durable classic djellaba fabric with a matte finish."},
  bouclette: {name:"Bouclette", note:"A textured, looped fabric that keeps you warm."},
  suede:     {name:"Faux suede", note:"Soft, brushed suede feel without real leather."},
  crepe:     {name:"Crepe",     note:"Light with a fluid drape that moves well."},
  mobra:     {name:"Mobra",     note:""}
};
var SEASONS = {summer:"Summer", winter:"Winter", all:"All seasons"};

(function(){
  var store = document.body.getAttribute("data-store");
  if (!store) return;
  var items = PRODUCTS[store], cats = CATS[store];
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
  function card(p){
    return '<a class="card" href="product.html?id=' + p.id + '">' +
      '<div class="img"><div class="ph">Photo · ' + esc(p.name) + '</div>' + (p.fabric ? '<span class="badge ready">' + FABRICS[p.fabric].name + '</span>' : '') + '</div>' +
      '<span class="kind">' + cats[p.cat] + ' · ' + SEASONS[p.season] + '</span>' +
      '<h3>' + esc(p.name) + '</h3><span class="price">' + money(p.price) + '</span></a>';
  }
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
    sw.innerHTML = '<span class="sw-color" style="background:' + COLORS[target] + '"></span><img src="../assets/img/' + target + '-logo-light.png" alt="">';
    document.body.appendChild(sw);
    return sw;
  }
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var m = a.getAttribute("href").match(/^\.\.\/(men|women)\//);
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
  if (feat) feat.innerHTML = items.slice(0, 4).map(card).join("");

  // Shop page with filters
  var grid = document.querySelector("[data-grid]");
  if (grid) {
    var form = document.querySelector("[data-filters]");
    ["cat","season","fabric"].forEach(function(k){
      var v = params.get(k);
      if (v) form.querySelectorAll('input[name="' + k + '"]').forEach(function(i){ i.checked = (i.value === v); });
    });
    var title = document.querySelector("[data-shop-title]");
    if (title && params.get("cat") && cats[params.get("cat")]) title.textContent = cats[params.get("cat")] + "s";
    if (title && params.get("season")) title.textContent = SEASONS[params.get("season")] + " Collection";
    if (title && params.get("fabric") && FABRICS[params.get("fabric")]) title.textContent = FABRICS[params.get("fabric")].name;
    function apply(){
      var pick = function(k){ return Array.prototype.map.call(form.querySelectorAll('input[name="' + k + '"]:checked'), function(i){ return i.value; }); };
      var c = pick("cat"), s = pick("season"), t = pick("fabric");
      var list = items.filter(function(p){
        return (!c.length || c.indexOf(p.cat) > -1) &&
               (!s.length || s.indexOf(p.season) > -1 || p.season === "all") &&
               (!t.length || t.indexOf(p.fabric) > -1);
      });
      grid.innerHTML = list.length ? list.map(card).join("") : '<div class="empty">No pieces match these filters yet. Try removing one.</div>';
      document.querySelector("[data-count]").textContent = list.length + (list.length === 1 ? " piece" : " pieces");
    }
    form.addEventListener("change", apply);
    var clr = document.querySelector("[data-clear]");
    if (clr) clr.addEventListener("click", function(){ form.querySelectorAll("input").forEach(function(i){ i.checked = false; }); if (title) title.textContent = "Shop All"; apply(); });
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
      if (k === "photo") el.textContent = "Photo · " + p.name;
      if (k === "cat") { el.textContent = cats[p.cat] + "s"; el.href = "shop.html?cat=" + p.cat; }
      if (k === "badge") { if (p.fabric) { el.textContent = FABRICS[p.fabric].name; el.className = "badge ready"; } else el.hidden = true; }
    });
    var f = FABRICS[p.fabric] || {name:"", note:""};
    var parts = ["Made in Morocco. In stock and ships within a few days."];
    if (p.note) parts.push(p.note + ".");
    if (f.note) parts.push(f.note);
    parts.push(p.season === "summer" ? "Light, breathable fabric for warm weather." : p.season === "winter" ? "Warm, heavier fabric for cold months." : "Comfortable all year.");
    pp.querySelector("[data-desc]").innerHTML = parts.map(function(x){ return "<span>" + esc(x) + "</span>"; }).join(" ");
    var fab = pp.querySelector("[data-fabric]"); if (fab) fab.textContent = f.name || "[FABRIC]";
    var sel = pp.querySelector("[data-colors]");
    sel.innerHTML = p.colors.map(function(c){ return "<option>" + esc(c) + "</option>"; }).join("");
    if (!p.colors.length) sel.closest("div").hidden = true;
    var size = null;
    pp.querySelectorAll(".sizes button").forEach(function(b){
      b.addEventListener("click", function(){
        pp.querySelectorAll(".sizes button").forEach(function(x){ x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true"); size = b.textContent;
        pp.querySelector("[data-size-msg]").textContent = "";
      });
    });
    pp.querySelector("[data-add]").addEventListener("click", function(){
      if (!size) { pp.querySelector("[data-size-msg]").textContent = "Please choose a size."; return; }
      var c = readCart(), color = p.colors.length ? sel.value : "", hit = null;
      c.forEach(function(it){ if (it.id === p.id && it.size === size && it.color === color) hit = it; });
      if (hit) hit.qty++; else c.push({id:p.id, size:size, color:color, qty:1});
      writeCart(c);
      var t = document.querySelector(".toast"); t.classList.add("show");
      clearTimeout(window.__tt); window.__tt = setTimeout(function(){ t.classList.remove("show"); }, 3500);
    });
    var rel = document.querySelector("[data-related]");
    if (rel) rel.innerHTML = items.filter(function(x){ return x.id !== p.id; }).slice(0, 4).map(card).join("");
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
        return '<div class="cart-item"><div class="ph">Photo</div><div class="grow"><h3>' + esc(p.name) + '</h3><span class="muted">Size ' + esc(it.size) + (it.color ? ' · ' + esc(it.color) : '') + '</span><br><button class="remove" data-rm="' + i + '">Remove</button></div>' +
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
  var OFFER = { percent: "10%", code: "[YOUR CODE]" };
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
          '<img class="nl-logo" src="../assets/img/' + store + '-logo-light.png" alt="">' +
          '<div class="nl-off"><b>' + OFFER.percent + '</b><span>off your first order</span></div></div>' +
        '<div class="nl-body"><span class="eyebrow">Mamounia newsletter</span><h2 id="nl-title">' + w.title + '</h2><p class="muted">' + w.text + '</p>' +
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
