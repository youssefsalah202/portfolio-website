(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---- Theme toggle ---- */
  document.getElementById('themeBtn').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    drawNet();
  });

  /* ---- Mobile menu ---- */
  var menu = document.getElementById('menu');
  var menuBtn = document.getElementById('menuBtn');
  menuBtn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });

  /* ---- Footer year ---- */
  document.getElementById('yr').textContent = new Date().getFullYear();

  /* ---- Copy email ---- */
  var copyBtn = document.getElementById('copyBtn');
  var copyMsg = document.getElementById('copyMsg');
  copyBtn.addEventListener('click', function () {
    var email = 'youssefsalah202@gmail.com';
    var done = function () { copyMsg.textContent = 'Email copied to clipboard.'; setTimeout(function () { copyMsg.textContent = ''; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(done, function () { copyMsg.textContent = email; });
    } else { copyMsg.textContent = email; }
  });

  /* ---- Scroll reveal ---- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (el.closest('.grid4, .bento, .hero-copy') ? (i % 6) * 70 : 0) + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Agent trace typing (illustrative example) ---- */
  var trace = document.getElementById('trace');
  var lines = [
    ['u', 'client › '], ['', 'Trip to Dubai, Dec, 2 people, 2000 USD\n'],
    ['a', 'agent  › '], ['', 'thinking…\n\n'],
    ['t', 'tool_use   '], ['', 'update_booking_field(destination="Dubai")\n'],
    ['g', 'tool_result '], ['', '{"ok": true}\n'],
    ['t', 'tool_use   '], ['', 'search_flights(CAI → DXB, 2 pax)\n'],
    ['g', 'tool_result '], ['', '12 offers found\n'],
    ['t', 'tool_use   '], ['', 'search_hotels(Dubai, 4 nights)\n'],
    ['g', 'tool_result '], ['', '5 rates in budget\n\n'],
    ['a', 'agent  › '], ['', 'Here is a plan within budget. Want me to lock it in?']
  ];
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function renderAll() {
    trace.innerHTML = lines.map(function (l) { return l[0] ? '<span class="' + l[0] + '">' + esc(l[1]) + '</span>' : esc(l[1]); }).join('');
  }
  if (reduce) { renderAll(); }
  else {
    var li = 0, ci = 0, html = '';
    (function tick() {
      if (li >= lines.length) { trace.innerHTML = html + '<span class="caret"></span>'; return; }
      var cls = lines[li][0], txt = lines[li][1];
      ci += cls ? txt.length : 2; // labels appear instantly, text types
      if (ci >= txt.length) {
        html += cls ? '<span class="' + cls + '">' + esc(txt) + '</span>' : esc(txt);
        li++; ci = 0;
        trace.innerHTML = html + '<span class="caret"></span>';
        setTimeout(tick, cls ? 40 : 160);
      } else {
        var part = esc(txt.slice(0, ci));
        trace.innerHTML = html + (cls ? '<span class="' + cls + '">' + part + '</span>' : part) + '<span class="caret"></span>';
        setTimeout(tick, 22);
      }
    })();
  }

  /* ---- Neural-network background ---- */
  var cv = document.getElementById('net');
  var ctx = cv.getContext('2d');
  var pts = [], W = 0, H = 0, mouse = { x: -999, y: -999 };
  function rgb() {
    return getComputedStyle(root).getPropertyValue('--net').trim() || '124, 92, 255';
  }
  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(70, (W * H) / 20000));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
  }
  function drawNet() {
    ctx.clearRect(0, 0, W, H);
    var c = rgb(), max = 140;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < max) {
          ctx.strokeStyle = 'rgba(' + c + ',' + (0.35 * (1 - d / max)) + ')';
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      var mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
      ctx.fillStyle = 'rgba(' + c + ',' + (md < 160 ? 1 : 0.7) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, md < 160 ? 2.6 : 1.8, 0, 6.283); ctx.fill();
    }
  }
  function step() {
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    drawNet();
    requestAnimationFrame(step);
  }
  size();
  window.addEventListener('resize', function () { size(); drawNet(); });
  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  if (reduce) { drawNet(); } else { requestAnimationFrame(step); }
})();
