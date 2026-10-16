(function () {
  // ---- Set your email here (leave empty to hide the "Email me" button) ----
  var EMAIL = "";

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // menu
  var btn = document.querySelector('.burger'), menu = document.querySelector('.menu');
  btn.addEventListener('click', function () {
    var o = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', o ? 'true' : 'false');
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });

  // email + year
  var eb = document.getElementById('emailBtn');
  if (EMAIL) { eb.href = 'mailto:' + EMAIL; eb.hidden = false; }
  document.getElementById('yr').textContent = new Date().getFullYear();

  // rotating word
  var words = ['insight', 'strategy', 'brand', 'data', 'curiosity'], wi = 0, w = document.getElementById('word');
  if (!reduce) setInterval(function () {
    w.classList.add('swap');
    setTimeout(function () { wi = (wi + 1) % words.length; w.textContent = words[wi]; w.classList.remove('swap'); }, 300);
  }, 2200);

  // cursor glow + photo tilt
  var glow = document.querySelector('.glow'), photo = document.getElementById('photo');
  if (!reduce) window.addEventListener('pointermove', function (e) {
    glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
    if (photo && window.innerWidth > 900) {
      var x = (e.clientX / window.innerWidth - .5) * 8, y = (e.clientY / window.innerHeight - .5) * -8;
      photo.style.transform = 'rotate(' + (3 + x * .4) + 'deg) rotateX(' + y + 'deg) rotateY(' + x + 'deg)';
    }
  });

  // reveal
  var rv = document.querySelectorAll('.head, .bignums li, .chips li, .statement, .contact h2');
  rv.forEach(function (e) { e.classList.add('rv'); });
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
  }, { threshold: 0.15 }) : null;
  rv.forEach(function (e) { io ? io.observe(e) : e.classList.add('in'); });

  // count up
  function fmt(el, n) { el.textContent = (el.dataset.pre || '') + n + (el.dataset.suf || ''); }
  var cu = document.querySelectorAll('[data-to]');
  if (io && !reduce) {
    var co = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        var el = x.target, end = parseFloat(el.dataset.to), t0 = null;
        (function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1100, 1);
          fmt(el, Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    cu.forEach(function (el) { co.observe(el); });
  }

  // active nav
  var links = Array.prototype.slice.call(document.querySelectorAll('.menu a[href^="#"]:not(.cta)'));
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + x.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = document.querySelector(l.getAttribute('href')); if (s) so.observe(s); });
  }
})();
