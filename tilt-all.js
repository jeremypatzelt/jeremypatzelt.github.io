/* Tilt every card: lean toward the cursor, moving glare, light parallax on inner pieces. Desktop hover only. */
(function () {
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STRENGTH = 1, ON = true;
  var CFG = [
    /* Professional experience + Services stack cards (tilt the two halves so the scroll-stacking still works) */
    { sel: '.xmedia',        max: 5,  lift: 0,  scale: 1.01 },
    { sel: '.xpanel',        max: 5,  lift: 0,  scale: 1.01 },
    { sel: '.smedia',        max: 5,  lift: 0,  scale: 1.01 },
    { sel: '.spanel',        max: 5,  lift: 0,  scale: 1.01 },
    /* Emory experiences (Student life) */
    { sel: '.st-hero',       max: 3,  lift: 0,  scale: 1.005 },
    { sel: '.st-card',       max: 8,  lift: 6,  scale: 1.02, depth: { '.st-metric strong': 12, '.st-pill': 6 } },
    /* By the numbers */
    { sel: '.gstage .flip',  max: 9,  lift: 6,  scale: 1.02 },
    /* Beyond the resume */
    { sel: '.fn-stat',       max: 8,  lift: 6,  scale: 1.02 },
    { sel: '.fn-mc',         max: 8,  lift: 6,  scale: 1.02 },
    { sel: '.fn-card',       max: 2,  lift: 0,  scale: 1.003 },
    /* Tools, FAQ, contact + ending banner */
    { sel: '.tkgrid li',     max: 9,  lift: 6,  scale: 1.02, depth: { '.ti': 14, 'b': 7 } },
    { sel: '.fqlist details',max: 2.5,lift: 2,  scale: 1.005 },
    { sel: '.closing',       max: 1.6,lift: 0,  scale: 1.002 }
  ];
  var items = [], raf = 0;
  function make(el, c) {
    var g = document.createElement('div'); g.className = 'tilt-glare'; el.appendChild(g);
    var it = { el: el, c: c, g: g, rx: 0, ry: 0, tx: 0, ty: 0, hov: 0, th: 0, kids: [] };
    if (c.depth) for (var s in c.depth) el.querySelectorAll(s).forEach(function (k) { it.kids.push({ k: k, d: c.depth[s] }); });
    el.addEventListener('pointerenter', function () { if (!it.tr) { it.tr = 1; el.style.transition = 'box-shadow .3s ease, opacity .7s ease'; } });
    el.addEventListener('pointermove', function (e) {
      if (!ON) return;
      var r = el.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
      it.ty = (nx - 0.5) * 2 * c.max * STRENGTH; it.tx = -(ny - 0.5) * 2 * c.max * STRENGTH; it.th = 1;
      g.style.setProperty('--gx', nx * 100 + '%'); g.style.setProperty('--gy', ny * 100 + '%');
      it.nx = nx - 0.5; it.ny = ny - 0.5; start();
    });
    el.addEventListener('pointerleave', function () { it.tx = it.ty = 0; it.th = 0; it.nx = it.ny = 0; start(); });
    items.push(it);
  }
  function tick() {
    var busy = false;
    items.forEach(function (it) {
      it.rx += (it.tx - it.rx) * 0.14; it.ry += (it.ty - it.ry) * 0.14; it.hov += (it.th - it.hov) * 0.14;
      var still = Math.abs(it.rx) < 0.02 && Math.abs(it.ry) < 0.02 && it.hov < 0.01 && !it.th;
      if (still) { if (it.on) { it.el.style.transform = ''; it.g.style.opacity = 0; it.kids.forEach(function (o) { o.k.style.transform = ''; }); it.on = false; } return; }
      busy = true; it.on = true;
      var sc = 1 + (it.c.scale - 1) * it.hov;
      it.el.style.transform = 'perspective(900px) rotateX(' + it.rx.toFixed(2) + 'deg) rotateY(' + it.ry.toFixed(2) + 'deg) translateY(' + (-it.c.lift * it.hov).toFixed(2) + 'px) scale(' + sc.toFixed(4) + ')';
      it.g.style.opacity = (0.9 * it.hov).toFixed(3);
      var nx = it.nx || 0, ny = it.ny || 0;
      it.kids.forEach(function (o) { o.k.style.transform = 'translate(' + (nx * o.d * STRENGTH).toFixed(2) + 'px,' + (ny * o.d * STRENGTH).toFixed(2) + 'px)'; });
    });
    raf = busy ? requestAnimationFrame(tick) : 0;
  }
  function start() { if (!raf) raf = requestAnimationFrame(tick); }
  function init() {
    if (!fine || reduce) return;
    CFG.forEach(function (c) { document.querySelectorAll(c.sel).forEach(function (el) { if (!el.__tilt) { el.__tilt = 1; make(el, c); } }); });
  }
  window.TiltAll = { init: init, set: function (o) { if ('strength' in o) STRENGTH = o.strength; if ('on' in o) ON = o.on; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
