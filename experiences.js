/* ============================================================
   experiences.js — CodensFlow Innovation Lab
   Particle System & Experience Selector
   ============================================================ */

(function () {
  'use strict';

  // ── Canvas Setup ──────────────────────────────────────────
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  // Detect if we're fullpage (Experiences.html standalone) or embedded in a section (index.html)
  const isFullPage = document.body.style.overflow === 'hidden' || 
                     document.documentElement.clientHeight === window.innerHeight;
  const parent = canvas.parentElement;

  function getW() { return isFullPage ? window.innerWidth : parent.offsetWidth; }
  function getH() { return isFullPage ? window.innerHeight : parent.offsetHeight; }

  let W = canvas.width = getW();
  let H = canvas.height = getH();

  window.addEventListener('resize', () => {
    W = canvas.width = getW();
    H = canvas.height = getH();
    if (!isForming) initParticles();
  });

  // ── Mouse Tracking ────────────────────────────────────────
  const mouse = { x: W / 2, y: H / 2, radius: 100 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  // ── Particle Class ────────────────────────────────────────
  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.baseX = this.x;
      this.baseY = this.y;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.5 + 0.15;
      this.targetX = null;
      this.targetY = null;
      this.color = '#ffffff';
      this.forming = false;
      this.arrived = false;
    }

    setTarget(tx, ty, color = '#ffffff') {
      this.targetX = tx;
      this.targetY = ty;
      this.color = color;
      this.forming = true;
      this.arrived = false;
    }

    clearTarget() {
      this.targetX = null;
      this.targetY = null;
      this.forming = false;
      this.arrived = false;
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2;
    }

    update() {
      if (this.forming && this.targetX !== null) {
        // Spring physics: pull toward target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = Math.max(0.04, Math.min(0.12, dist * 0.006));
        this.x += dx * speed;
        this.y += dy * speed;
        this.opacity = Math.min(1, this.opacity + 0.03);
        if (dist < 1.5) this.arrived = true;
      } else {
        // Free float
        this.x += this.speedX;
        this.y += this.speedY;

        // Gentle wrap around edges
        if (this.x < -10) this.x = W + 10;
        if (this.x > W + 10) this.x = -10;
        if (this.y < -10) this.y = H + 10;
        if (this.y > H + 10) this.y = -10;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 5;
          this.y += (dy / dist) * force * 5;
        }

        this.opacity = 0.15 + Math.sin(Date.now() * 0.001 + this.x) * 0.1;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.forming ? 6 : 0;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ── Init Particles ────────────────────────────────────────
  const PARTICLE_COUNT = Math.min(1800, Math.floor((W * H) / 1200));
  let particles = [];
  let isForming = false;

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  initParticles();

  // ── Text Sampling: What pixels does text occupy ───────────
  function getTextPixels(text, color) {
    const offCanvas = document.createElement('canvas');
    const fontSize = Math.min(W * 0.38, H * 0.55, 340);
    offCanvas.width = W;
    offCanvas.height = H;
    const offCtx = offCanvas.getContext('2d');

    offCtx.fillStyle = '#fff';
    offCtx.font = `900 ${fontSize}px 'Inter', sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(text, W / 2, H / 2);

    const imageData = offCtx.getImageData(0, 0, W, H).data;
    const points = [];
    const gap = Math.max(4, Math.floor(W / 120)); // sample density

    for (let y = 0; y < H; y += gap) {
      for (let x = 0; x < W; x += gap) {
        const idx = (y * W + x) * 4;
        if (imageData[idx + 3] > 128) {
          points.push({ x, y });
        }
      }
    }

    return points;
  }

  // ── Form Text Animation ────────────────────────────────────
  function formText(text, accentColor) {
    isForming = true;
    const points = getTextPixels(text, accentColor);

    // Shuffle points for organic entrance
    for (let i = points.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [points[i], points[j]] = [points[j], points[i]];
    }

    particles.forEach((p, i) => {
      if (i < points.length) {
        // Jitter target slightly for organic feel
        const jx = points[i % points.length].x + (Math.random() - 0.5) * 2;
        const jy = points[i % points.length].y + (Math.random() - 0.5) * 2;
        p.setTarget(jx, jy, accentColor);
      } else {
        // Extra particles drift to edges
        const edge = Math.floor(Math.random() * 4);
        const tx = edge === 0 ? -50 : edge === 1 ? W + 50 : Math.random() * W;
        const ty = edge === 2 ? -50 : edge === 3 ? H + 50 : Math.random() * H;
        p.setTarget(tx, ty, 'rgba(255,255,255,0.05)');
      }
    });
  }

  // ── Dissolve Back to Free Float ───────────────────────────
  function dissolveParticles() {
    isForming = false;
    particles.forEach(p => {
      p.clearTarget();
      p.forming = false;
    });
  }

  // ── Animation Loop ────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);

    // Deep space subtle gradient
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H));
    grad.addColorStop(0, 'rgba(5,8,18,0.25)');
    grad.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => {
      p.update();
      p.draw();
    });
  }

  animate();

  // ── UI Card Event Binding ─────────────────────────────────
  const labContainer = document.getElementById('labContainer');
  const particleTextOverlay = document.getElementById('particleTextOverlay');
  const overlaySubtitle = document.getElementById('overlaySubtitle');
  const overLayBackBtn = document.getElementById('overlayBackBtn');

  function selectExperience(type) {
    const isOS = type === 'os';
    const label = isOS ? 'SO' : 'IA';
    const color = isOS ? '#00AEEF' : '#00ff66';
    const subtitle = isOS ? 'Virtual Operating System' : 'Interactive Intelligence';

    // Hide selection UI
    labContainer.style.transition = 'opacity 0.5s ease';
    labContainer.style.opacity = '0';

    setTimeout(() => {
      labContainer.style.display = 'none';

      // Show overlay subtitle
      if (overlaySubtitle) overlaySubtitle.textContent = subtitle;
      if (particleTextOverlay) {
        particleTextOverlay.style.display = 'flex';
      }
      if (overLayBackBtn) {
        overLayBackBtn.style.display = 'block';
      }

      // Trigger particle formation
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

  // Bind buttons
  const cardOS = document.getElementById('cardOS');
  const cardAI = document.getElementById('cardAI');

  if (cardOS) cardOS.addEventListener('click', () => selectExperience('os'));
  if (cardAI) cardAI.addEventListener('click', () => selectExperience('ai'));
  if (overLayBackBtn) overLayBackBtn.addEventListener('click', goBack);

  // ── Typewriter Teaser ─────────────────────────────────────
  const teaserEl = document.getElementById('teaserText');
  if (teaserEl) {
    const msg = 'Seguimos trabajando en experiencias únicas para nuestros clientes...';
    let idx = 0;
    teaserEl.textContent = '';
    function type() {
      if (idx < msg.length) {
        teaserEl.textContent += msg[idx++];
        setTimeout(type, 38);
      }
    }
    setTimeout(type, 900);
  }

})();
