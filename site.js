
/* One-folder version: page links get the store's name in front (men-shop.html, women-cart.html). */
(function(){
  var st = document.body.getAttribute("data-store"); if (!st) return;
  var re = /^(index|shop|product|custom|story|cart|terms|privacy|family|events|gift|piece)\.html/;
  function one(a){ var h = a.getAttribute("href"); if (h && re.test(h)) a.setAttribute("href", st + "-" + h); }
  function all(r){ if (r.nodeType !== 1) return; if (r.tagName === "A") one(r); r.querySelectorAll && r.querySelectorAll("a[href]").forEach(one); }
  all(document.body);
  new MutationObserver(function(ms){ ms.forEach(function(m){
    if (m.type === "attributes") one(m.target); else m.addedNodes.forEach(all);
  }); }).observe(document.body, {childList: true, subtree: true, attributes: true, attributeFilter: ["href"]});
})();

/* Mamounia site loader. It gets the content you set in the admin's Website design tab
   (photos, products, prices, text and settings), puts it on the page, then starts the store.
   If the admin can't be reached, the site uses the last content it saw, or the built-in defaults. */
var MM_API = "https://mamounia-admin.onrender.com";   // your admin address, e.g. "https://mamounia-admin.onrender.com" (no slash at the end)

(function(){
  var store = document.body.getAttribute("data-store");
  var API = (window.MM_API || "").replace(/\/$/, "");
  window.MM_IMG = function(id){ return /^(https?:|\.|\/|data:)/.test(id) ? id : API + "/api/public/img/" + id; };
  var CK = "mamounia-site-cache-v1", started = false;

  function boot(){
    ["store.js", "extra.js", "i18n.js"].forEach(function(f){
      var s = document.createElement("script"); s.src = "" + f + (window.MM_VER ? "?v=" + window.MM_VER : ""); s.async = false; document.body.appendChild(s);
    });
  }
  function eachText(root, fn){
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) { var p = n.parentNode; if (p && (p.tagName === "SCRIPT" || p.tagName === "STYLE")) continue; fn(n); }
  }
  function apply(c){
    if (!c || typeof c !== "object") return;
    // products, prices, photos, badges, stock
    ["men", "women"].forEach(function(k){
      var list = c.products && c.products[k];
      if (Array.isArray(list) && list.length) PRODUCTS[k] = list.map(function(p){
        return {id: p.id, name: p.name || "", cat: p.cat, season: p.season || "all", fabric: p.fabric || "", note: p.note || "",
                price: p.price === "" || p.price == null ? null : +p.price, colors: p.colors || [], photos: p.photos || [],
                hidden: !!p.hidden, badge: p.badge || "", soldOut: !!p.soldOut, sizesLeft: p.sizesLeft || null, origin: p.origin || "",
                variants: (p.variants || []).filter(function(v){ return v && v.name; }).map(function(v){ return {name: v.name, hex: v.hex || "", hex2: v.hex2 || "", photos: v.photos || []}; })};
      });
    });
    window.MM_SETTINGS = c.settings || {};
    var tokens = {};
    Object.keys(c.tokens || {}).forEach(function(t){ if (c.tokens[t]) tokens[t] = c.tokens[t]; });
    if (window.MM_SETTINGS.offer_code) tokens["[YOUR CODE]"] = window.MM_SETTINGS.offer_code;
    window.MM_TOKENS = tokens;
    // fill in the [PLACEHOLDERS] everywhere (text, links and form hints)
    var keys = Object.keys(tokens);
    if (keys.length) {
      var swap = function(v){ keys.forEach(function(t){ if (v.indexOf(t) > -1) v = v.split(t).join(tokens[t]); }); return v; };
      eachText(document.body, function(n){ if (n.nodeValue.indexOf("[") > -1) { var v = swap(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; } });
      document.querySelectorAll("[href*='['],[placeholder*='['],[title*='['],[alt*='[']").forEach(function(el){
        ["href", "placeholder", "title", "alt"].forEach(function(a){ var v = el.getAttribute(a); if (v && v.indexOf("[") > -1) el.setAttribute(a, swap(v)); });
      });
      document.title = swap(document.title);
    }
    if (!store) return;
    // photos on the page (hero, category tiles, seasons, story...)
    var imgs = (c.images || {})[store] || {};
    document.querySelectorAll("[data-slot]").forEach(function(el){
      var id = imgs[el.getAttribute("data-slot")];
      if (!id) return;
      el.style.backgroundImage = "url('" + MM_IMG(id) + "')";
      el.classList.add("mm-has-img");
    });
    var vid = (c.video || {})[store], v = document.querySelector("[data-hero-video]");
    if (v && vid) { var src = v.querySelector("source"); src.src = /^https?:/.test(vid) ? vid : MM_IMG(vid); v.load(); v.classList.add("mm-has-video"); }
    // your own wording, with Arabic and Urdu if you added them
    var txt = (c.text || {})[store] || {}, extra = [];
    document.querySelectorAll("[data-text]").forEach(function(el){
      var t = txt[el.getAttribute("data-text")];
      if (t && t.en) { el.textContent = t.en; if (t.ar || t.ur) extra.push([t.en, t.ar || "", t.ur || ""]); }
    });
    // customer reviews
    var revs = ((c.reviews || {})[store] || []).filter(function(r){ return r && r.quote; });
    if (revs.length) document.querySelectorAll("[data-review]").forEach(function(f){
      var r = revs[+f.getAttribute("data-review")];
      if (!r) { f.hidden = true; return; }
      f.querySelector("blockquote").textContent = r.quote;
      f.querySelector("figcaption").textContent = [r.name, r.city].filter(Boolean).join(", ");
    });
    window.MM_EXTRA_ROWS = extra;
  }
  function go(c){ if (started) return; started = true; try { apply(c); } catch(e){ try { console.error(e); } catch(x){} } boot(); }

  // ?mmcheck at the end of any page address shows whether the site can reach the admin
  var check = /[?&]mmcheck/.test(location.search), t0 = Date.now();
  function report(msg, ok){
    if (!check) return;
    var d = document.createElement("div");
    d.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;padding:14px 16px;border-radius:10px;font:14px/1.45 system-ui,sans-serif;color:#fff;background:" + (ok ? "#2f6b3a" : "#9b2c2c");
    d.innerHTML = "<b>Admin connection</b><br>Address in site.js: <code>" + (API || "(empty)") + "</code><br>" + msg;
    document.body.appendChild(d);
  }
  function countPhotos(c){
    var n = 0; ["men", "women"].forEach(function(k){
      ((c.products || {})[k] || []).forEach(function(p){ n += (p.photos || []).length; (p.variants || []).forEach(function(v){ n += (v.photos || []).length; }); });
      n += Object.keys((c.images || {})[k] || {}).length;
    }); return n;
  }

  if (!API) { report("No admin address is set, so the site uses its built-in content.", false); go(null); return; }
  var cache = null; try { cache = JSON.parse(localStorage.getItem(CK)); } catch(e){}
  var fresh = cache && Date.now() - cache.at < 10 * 60e3, used = null;
  if (fresh) { used = cache.data; go(cache.data); }        // fast path: recent content, refresh quietly
  // The admin on Render's free plan falls asleep and can take up to a minute to wake up.
  // Don't keep visitors staring at a blank page: show what we have, then switch to the real content when it arrives.
  var timer = setTimeout(function(){ if (!started) { used = cache && cache.data; go(used); } }, cache ? 2500 : 6000);
  fetch(API + "/api/public/site", {cache: "no-store"}).then(function(r){ if (!r.ok) throw new Error("status " + r.status); return r.json(); }).then(function(c){
    clearTimeout(timer);
    var json = JSON.stringify(c);
    try { localStorage.setItem(CK, JSON.stringify({at: Date.now(), data: c})); } catch(e){}
    report("Reached the admin in " + ((Date.now() - t0) / 1000).toFixed(1) + " s. Photos found: " + countPhotos(c) + ".", true);
    if (!started) { used = c; go(c); return; }
    // the page started with older (or no) content: swap in the new content once
    if (JSON.stringify(used || null) !== json) {
      var k = "mm-swapped-" + location.pathname;
      try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); } catch(e){ return; }
      if (window.scrollY < 200 && Date.now() - t0 < 90e3) location.reload();
    }
  }).catch(function(e){
    clearTimeout(timer);
    report("Could not reach the admin (" + (e && e.message || "network error") + "). Check that this address opens your admin, and that the admin is deployed.", false);
    go(cache && cache.data);
  });
})();
