/* ============================================================
  Brad's Portfolio — JavaScript
  Hero motion + interactions
  ============================================================ */
'use strict';

// ─── Canvas Constellation Hero ───────────────────────────────

function initHeroParticles() {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var w, h, nodes, mouseX, mouseY, mouseActive;
  var NODE_COUNT = 90;
  var CONNECT_DIST = 140;
  var MOUSE_RADIUS = 180;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createNodes() {
    nodes = [];
    for (var i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1.2,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  resize();
  createNodes();
  mouseX = w / 2;
  mouseY = h / 2;
  mouseActive = false;

  canvas.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    mouseActive = true;
  });

  canvas.addEventListener('mouseleave', function () {
    mouseActive = false;
  });

  window.addEventListener('resize', function () {
    resize();
    createNodes();
  });

  // Scroll tracking
  var scrollY = 0;
  window.addEventListener('scroll', function () { scrollY = window.scrollY; });

  function draw() {
    requestAnimationFrame(draw);

    // Fade out as user scrolls
    var heroHeight = window.innerHeight;
    var progress = Math.min(scrollY / heroHeight, 1);
    canvas.style.opacity = String(1 - progress);
    if (progress >= 1) return;

    ctx.clearRect(0, 0, w, h);

    var t = Date.now() * 0.001;

    // Update node positions
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      // Wrap around edges
      if (n.x < -10) n.x = w + 10;
      if (n.x > w + 10) n.x = -10;
      if (n.y < -10) n.y = h + 10;
      if (n.y > h + 10) n.y = -10;

      // Gentle mouse repulsion
      if (mouseActive) {
        var mdx = n.x - mouseX;
        var mdy = n.y - mouseY;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < MOUSE_RADIUS && md > 0) {
          var force = (1 - md / MOUSE_RADIUS) * 0.8;
          n.vx += (mdx / md) * force;
          n.vy += (mdy / md) * force;
        }
      }

      // Dampen velocity
      n.vx *= 0.99;
      n.vy *= 0.99;
    }

    // Draw connections
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          var alpha = (1 - dist / CONNECT_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = 'rgba(124, 106, 239, ' + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw mouse connections
    if (mouseActive) {
      for (var i = 0; i < nodes.length; i++) {
        var dx = nodes[i].x - mouseX;
        var dy = nodes[i].y - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          var alpha = (1 - dist / MOUSE_RADIUS) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = 'rgba(0, 206, 201, ' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + n.pulse);
      var alpha = 0.35 + pulse * 0.45;
      var size = n.r + pulse * 0.6;

      // Glow
      ctx.beginPath();
      ctx.arc(n.x, n.y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124, 106, 239, ' + (alpha * 0.08) + ')';
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 190, 255, ' + alpha + ')';
      ctx.fill();
    }
  }

  draw();
}

// ─── Scroll Reveal Animations ────────────────────────────────

function initScrollReveal() {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
}

// ─── Navbar ──────────────────────────────────────────────────

function initNavbar() {
  var navbar = document.getElementById('navbar');
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  // Scroll-based background
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile menu toggle
  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Close mobile menu on link click
  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
}

// ─── Active Nav Link Tracking ────────────────────────────────

function initActiveNavTracking() {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)');

  window.addEventListener('scroll', function () {
    var current = '';
    sections.forEach(function (section) {
      var top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });
}

// ─── Smooth Scroll for Anchor Links ──────────────────────────

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}

// ─── Canal Gate Demo ────────────────────────────────────────

function initGateSimulator() {
  var flow = document.getElementById('sim-flow');
  var head = document.getElementById('sim-head');
  var open = document.getElementById('sim-open');
  if (!flow || !head || !open) return;

  var flowValue = document.getElementById('sim-flow-value');
  var headValue = document.getElementById('sim-head-value');
  var openValue = document.getElementById('sim-open-value');
  var loadOut = document.getElementById('sim-load');
  var riskOut = document.getElementById('sim-risk');
  var actionOut = document.getElementById('sim-action');

  function update() {
    var q = Number(flow.value);
    var h = Number(head.value);
    var g = Number(open.value) / 100;

    flowValue.textContent = String(q);
    headValue.textContent = h.toFixed(1);
    openValue.textContent = String(Math.round(g * 100));

    // Simplified relative stress model: higher flow/head and low opening raises stress.
    var stress = (q * h) / (40 + 120 * g);
    var load = 'Low';
    if (stress > 6) load = 'High';
    else if (stress > 3.2) load = 'Medium';

    var risk = 'Low';
    if (h > 5.5 && g < 0.38) risk = 'High';
    else if (h > 4 || g < 0.3) risk = 'Medium';

    var action = 'Stable operation';
    if (risk === 'High') action = 'Increase opening gradually';
    else if (load === 'High') action = 'Reduce upstream load';
    else if (risk === 'Medium') action = 'Monitor vibration + flow';

    loadOut.textContent = load;
    riskOut.textContent = risk;
    actionOut.textContent = action;
  }

  [flow, head, open].forEach(function (el) {
    el.addEventListener('input', update);
  });

  update();
}

// ─── Contact Utilities ─────────────────────────────────────

function initContactUtilities() {
  var copyBtn = document.getElementById('copy-email-btn');
  var feedback = document.getElementById('copy-email-feedback');
  if (!copyBtn || !feedback) return;

  copyBtn.addEventListener('click', function () {
    var email = 'braddh03@gmail.com';
    if (!navigator.clipboard) {
      feedback.textContent = 'Clipboard not available on this browser.';
      return;
    }

    navigator.clipboard.writeText(email)
      .then(function () {
        feedback.textContent = 'Email copied: ' + email;
      })
      .catch(function () {
        feedback.textContent = 'Could not copy automatically. Email: ' + email;
      });
  });
}

// ─── Initialize Everything ───────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  initHeroParticles();
  initScrollReveal();
  initNavbar();
  initActiveNavTracking();
  initSmoothScroll();
  initGateSimulator();
  initContactUtilities();
});
