(function () {
  // ---- Set your email here (leave empty to hide the "Email me" button) ----
  var EMAIL = "";

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  // mobile menu
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  function closeMenu() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var o = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', o ? 'true' : 'false');
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // email + year
  var eb = document.getElementById('emailBtn');
  if (EMAIL) { eb.href = 'mailto:' + EMAIL; eb.hidden = false; }
  document.getElementById('yr').textContent = new Date().getFullYear();

  // dark mode toggle (remembered when storage is available)
  var tg = document.getElementById('theme');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    tg.setAttribute('aria-checked', t === 'dark' ? 'true' : 'false');
    try { localStorage.setItem('jp-theme', t); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('jp-theme'); } catch (e) {}
  if (saved === 'dark') setTheme('dark');
  tg.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });

  // reveal on scroll
  var rv = document.querySelectorAll('.head, .svc article, .about-in > div, .stat, .proj, .exp li, .tkgrid li, .fqlist details, .shead, .closing-in');
  rv.forEach(function (e) { e.classList.add('rv'); });
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
  }, { threshold: 0.1 }) : null;
  rv.forEach(function (e) { io ? io.observe(e) : e.classList.add('in'); });

  // count up
  if (io && !reduce) {
    var co = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        var el = x.target, end = parseFloat(el.dataset.to), t0 = null;
        (function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1200, 1);
          el.textContent = (el.dataset.pre || '') + Math.round(end * (1 - Math.pow(1 - p, 3))) + (el.dataset.suf || '');
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-to]').forEach(function (el) { co.observe(el); });
  }

  // active nav link
  var links = Array.prototype.slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting) links.forEach(function (l) {
          var h = l.getAttribute('href');
          l.classList.toggle('active', h === '#' + x.target.id || (h === '#top' && x.target.classList.contains('hero')));
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section.hero, section[id]').forEach(function (s) { so.observe(s); });
  }

  // stacking experience cards: the card underneath eases back as the next one slides over it
  var xc = Array.prototype.slice.call(document.querySelectorAll('.xcard,.scard'));
  var xTick = false;
  function xUpdate() {
    xTick = false;
    var off = reduce || window.innerWidth <= 860;
    xc.forEach(function (c, i) {
      var n = xc[i + 1]; if (n && n.parentNode !== c.parentNode) n = null;
      if (off || !n) { c.style.transform = ''; c.style.filter = ''; return; }
      var top = parseFloat(getComputedStyle(c).top) || 0;
      var d = n.getBoundingClientRect().top - (top + 18);
      var p = 1 - Math.min(Math.max(d / c.offsetHeight, 0), 1);
      c.style.transform = 'scale(' + (1 - p * 0.06).toFixed(4) + ') rotate(' + (-p * 1.2).toFixed(3) + 'deg)';
      c.style.filter = 'brightness(' + (1 - p * 0.12).toFixed(3) + ')';
    });
  }
  function xReq() { if (!xTick) { xTick = true; requestAnimationFrame(xUpdate); } }
  if (xc.length) { window.addEventListener('scroll', xReq, { passive: true }); window.addEventListener('resize', xReq); xUpdate(); }
  document.querySelectorAll('.flip').forEach(function (f) {
  var canHover = window.matchMedia('(hover: hover)').matches;
  if (canHover) {
    f.addEventListener('mouseenter', function () { f.classList.add('on'); });
    f.addEventListener('mouseleave', function () { f.classList.remove('on'); });
    f.addEventListener('focus', function () { f.classList.add('on'); });
    f.addEventListener('blur', function () { f.classList.remove('on'); });
  } else {
    f.addEventListener('click', function () { f.classList.toggle('on'); });
  }
});
});
})();
