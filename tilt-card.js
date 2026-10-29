/* 3D tilt card: card leans toward the cursor (or away, in repel mode) with depth layers and a moving glare */
(function () {
  function mountTilt(opts) {
    opts = opts || {};
    var stage = document.getElementById('tiltStage'), card = document.getElementById('tiltCard'),
        glare = document.getElementById('tiltGlare'), shadow = document.getElementById('tiltShadow'),
        hero = document.getElementById('tiltHero');
    if (!stage || !card) return;
    var cfg = { max: opts.max || 16, mode: opts.mode || 'follow' };
    var tx = 0, ty = 0, cx = 0, cy = 0, over = false, last = performance.now(), t0 = last;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function norm(e) {
      var r = stage.getBoundingClientRect();
      var nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      return [Math.max(-1.6, Math.min(1.6, nx)), Math.max(-1.6, Math.min(1.6, ny))];
    }
    function move(e) {
      var n = norm(e), k = cfg.mode === 'repel' ? -1 : 1;
      var near = e.target && e.target.closest && e.target.closest('#tiltStage');
      over = !!near;
      var f = near ? 1 : 0.45;                    /* gentler lean when the cursor is elsewhere in the hero */
      tx = n[0] * k * f; ty = n[1] * k * f;
      card.style.setProperty('--gx', ((n[0] + 1) / 2 * 100) + '%'); card.style.setProperty('--gy', ((n[1] + 1) / 2 * 100) + '%');
      glare.style.setProperty('--go', near ? 1 : 0.35);
      card.style.setProperty('--go', near ? 1 : .35);
    }
    (hero || document).addEventListener('pointermove', move);
    (hero || document).addEventListener('pointerleave', function () { over = false; tx = ty = 0; card.style.setProperty('--go', 0); });
    stage.addEventListener('pointerleave', function () { card.style.setProperty('--go', 0); });
    function frame(now) {
      requestAnimationFrame(frame);
      if (reduce) return;
      var dt = Math.min((now - last) / 1000, 0.05); last = now;
      var idle = (!over && tx === 0 && ty === 0), t = (now - t0) / 1000;
      var gx = idle ? Math.sin(t * 0.9) * 0.28 : tx, gy = idle ? Math.cos(t * 0.7) * 0.2 : ty;   /* gentle idle sway */
      var s = 1 - Math.pow(0.0008, dt);           /* smooth follow */
      cx += (gx - cx) * s; cy += (gy - cy) * s;
      var ry = cx * cfg.max, rx = -cy * cfg.max;
      card.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale(' + (1 + (over ? 0.03 : 0)).toFixed(3) + ')';
      shadow.style.setProperty('--sx', (-cx * 26).toFixed(1) + 'px'); shadow.style.setProperty('--ss', (1 - Math.abs(cy) * 0.12).toFixed(3));
    }
    requestAnimationFrame(frame);
    return { set: function (o) { for (var k in o) cfg[k] = o[k]; } };
  }
  window.mountTilt = mountTilt;
})();
