/* ============================================================
   experiences-embedded.js — CodensFlow Studio Innovation Lab
   Versión embebida para index.html (lazy init, IDs con prefijo idx-)
   ============================================================ */

window.initEmbeddedLab = (function () {
  'use strict';

  let initialized = false;
  let animFrameId = null;

  return function init() {
    if (initialized) return;
    initialized = true;

    // ── Element References ───────────────────────────────────
    const canvas              = document.getElementById('idx-particleCanvas');
    const labContainer        = document.getElementById('idx-labContainer');
    const particleTextOverlay = document.getElementById('idx-particleTextOverlay');
    const overlaySubtitle     = document.getElementById('idx-overlaySubtitle');
    const overLayBackBtn      = document.getElementById('idx-overlayBackBtn');
    const cardOS              = document.getElementById('idx-cardOS');
    const cardAI              = document.getElementById('idx-cardAI');
    const teaserEl            = document.getElementById('idx-teaserText');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const section = document.getElementById('project-experiences');

    // ── Canvas sizing: match the section container ───────────
    function getW() { return section ? section.offsetWidth  : window.innerWidth;  }
    function getH() { return section ? section.offsetHeight : window.innerHeight; }

    let W = canvas.width  = getW();
    let H = canvas.height = getH();

    // Resize observer so canvas redraws if section changes size
    const ro = new ResizeObserver(() => {
      W = canvas.width  = getW();
      H = canvas.height = getH();
      if (!isForming) initParticles();
    });
    if (section) ro.observe(section);

    // ── Mouse Tracking ───────────────────────────────────────
    const mouse = { x: W / 2, y: H / 2, radius: 80 };
    section && section.addEventListener('mousemove', (e) => {
      const r = section.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });

    // ── Particle Class ───────────────────────────────────────
    class Particle {
      constructor() { this.reset(); }

      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 1.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
        this.opacity = Math.random() * 0.45 + 0.1;
        this.targetX = null;
        this.targetY = null;
        this.color = '#ffffff';
        this.forming = false;
        this.arrived = false;
      }

      setTarget(tx, ty, color = '#ffffff') {
        this.targetX = tx; this.targetY = ty;
        this.color = color; this.forming = true; this.arrived = false;
      }

      clearTarget() {
        this.targetX = null; this.targetY = null;
        this.forming = false; this.arrived = false;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
      }

      update() {
        if (this.forming && this.targetX !== null) {
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const speed = Math.max(0.04, Math.min(0.12, dist * 0.006));
          this.x += dx * speed;
          this.y += dy * speed;
          this.opacity = Math.min(1, this.opacity + 0.03);
          if (dist < 1.5) this.arrived = true;
        } else {
          this.x += this.speedX;
          this.y += this.speedY;
          if (this.x < -10) this.x = W + 10;
          if (this.x > W + 10) this.x = -10;
          if (this.y < -10) this.y = H + 10;
          if (this.y > H + 10) this.y = -10;

          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 4;
            this.y += (dy / dist) * force * 4;
          }
          this.opacity = 0.12 + Math.sin(Date.now() * 0.001 + this.x) * 0.08;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.forming ? 5 : 0;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ── Init Particles ───────────────────────────────────────
    // Fixed the bug: small screens had too little area, generating <200 particles
    // which deformed text. We now enforce a healthy minimum of 1200 particles.
    const PARTICLE_COUNT = Math.max(1200, Math.floor((W * H) / 1200));
    let particles = [];
    let isForming = false;

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    }
    initParticles();

    // ── Text Pixel Sampling ──────────────────────────────────
    function getTextPixels(text) {
      const off = document.createElement('canvas');
      const fontSize = Math.min(W * 0.34, H * 0.5, 280);
      off.width = W; off.height = H;
      const offCtx = off.getContext('2d');
      offCtx.fillStyle = '#fff';
      offCtx.font = `900 ${fontSize}px 'Inter', sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(text, W / 2, H / 2);
      const data = offCtx.getImageData(0, 0, W, H).data;
      const pts = [];
      const gap = Math.max(4, Math.floor(W / 100));
      for (let y = 0; y < H; y += gap)
        for (let x = 0; x < W; x += gap)
          if (data[(y * W + x) * 4 + 3] > 128) pts.push({ x, y });
      return pts;
    }

    // ── Form Text ────────────────────────────────────────────
    function formText(text, accentColor) {
      isForming = true;
      const pts = getTextPixels(text);
      for (let i = pts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pts[i], pts[j]] = [pts[j], pts[i]];
      }
      particles.forEach((p, i) => {
        if (i < pts.length) {
          p.setTarget(pts[i % pts.length].x + (Math.random()-0.5)*2,
                      pts[i % pts.length].y + (Math.random()-0.5)*2,
                      accentColor);
        } else {
          const edge = Math.floor(Math.random() * 4);
          p.setTarget(
            edge === 0 ? -50 : edge === 1 ? W+50 : Math.random()*W,
            edge === 2 ? -50 : edge === 3 ? H+50 : Math.random()*H,
            'rgba(255,255,255,0.04)'
          );
        }
      });
    }

    function dissolveParticles() {
      isForming = false;
      particles.forEach(p => { p.clearTarget(); p.forming = false; });
    }

    // ── Animation Loop ───────────────────────────────────────
    function animate() {
      animFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, W, H);
      const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H));
      grad.addColorStop(0, 'rgba(5,8,18,0.22)');
      grad.addColorStop(1, 'rgba(0,0,0,0.22)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
    }
    animate();

    // ── Select Experience ────────────────────────────────────
    function selectExperience(type) {
      const isOS = type === 'os';
      const label    = isOS ? 'SO' : 'IA';
      const color    = isOS ? '#00AEEF' : '#00ff66';
      const subtitle = isOS ? 'Virtual Operating System' : 'Interactive Intelligence';

      labContainer.style.transition = 'opacity 0.5s ease';
      labContainer.style.opacity = '0';
      setTimeout(() => {
        labContainer.style.display = 'none';
        if (overlaySubtitle) overlaySubtitle.textContent = subtitle;
        if (particleTextOverlay) particleTextOverlay.style.display = 'flex';
        if (overLayBackBtn) overLayBackBtn.style.display = 'block';
        formText(label, color);
      }, 400);
    }

    function goBack() {
      dissolveParticles();
      if (particleTextOverlay) particleTextOverlay.style.display = 'none';
      if (overLayBackBtn) overLayBackBtn.style.display = 'none';
      labContainer.style.display = 'flex';
      labContainer.style.opacity = '0';
      requestAnimationFrame(() => {
        labContainer.style.transition = 'opacity 0.6s ease';
        labContainer.style.opacity = '1';
      });
    }

    if (cardOS) cardOS.addEventListener('click', () => selectExperience('os'));
    if (cardAI) cardAI.addEventListener('click', () => selectExperience('ai'));
    if (overLayBackBtn) overLayBackBtn.addEventListener('click', goBack);

    // ── Typewriter Teaser ────────────────────────────────────
    if (teaserEl) {
      const msg = 'Seguimos trabajando en experiencias únicas para nuestros clientes...';
      let idx = 0;
      teaserEl.textContent = '';
      function type() {
        if (idx < msg.length) { teaserEl.textContent += msg[idx++]; setTimeout(type, 40); }
      }
      setTimeout(type, 600);
    }
  };

})();
