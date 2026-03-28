/* =====================================================
   ECS ANTIGRAVITY — app.js
   Three.js Hero, RF Canvas, Spectrum, Dashboard Sim
   ===================================================== */

'use strict';

// ── Cursor ──────────────────────────────────────────
const cursorDot  = document.createElement('div'); cursorDot.id = 'cursor';
const cursorRing = document.createElement('div'); cursorRing.id = 'cursor-ring';
document.body.append(cursorDot, cursorRing);
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  rx += (mx - rx) * 0.15; ry += (my - ry) *.15;
  cursorDot.style.left  = mx + 'px'; cursorDot.style.top  = my + 'px';
  cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a,button,input').forEach(el => {
  el.addEventListener('mouseenter', () => { cursorDot.style.transform = 'translate(-50%,-50%) scale(2.5)'; cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)'; });
  el.addEventListener('mouseleave', () => { cursorDot.style.transform  = 'translate(-50%,-50%) scale(1)'; cursorRing.style.transform = 'translate(-50%,-50%) scale(1)'; });
});

// ── Navbar scroll ───────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

// ── Typed.js hero subtitle ───────────────────────────
if (window.Typed) {
  new Typed('#typed-target', {
    strings: [
      'Real-time RF Signal Processing.',
      'Edge Machine Learning Inference.',
      'Hardware-in-the-Loop Control.',
      'Seamless Cloud Data Streaming.'
    ],
    typeSpeed: 40, backSpeed: 20, backDelay: 2000, loop: true
  });
}

// ── Stat counter animation ───────────────────────────
function countUp(el, target, duration = 1800) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-val').forEach(el => countUp(el, +el.dataset.target));
      statsObs.disconnect();
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObs.observe(statsEl);

// ── AOS (custom lightweight) ─────────────────────────
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('aos-animate'); });
}, { threshold: 0.15 });
aosEls.forEach(el => aosObs.observe(el));

// ── GSAP (if loaded) ─────────────────────────────────
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('#hero-title', { y: 60, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 });
  gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.05 });
  gsap.from('.hero-actions', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.6 });
  gsap.from('.hero-stats', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.9 });
  gsap.utils.toArray('.comp-card').forEach((card, i) => {
    gsap.from(card, { y: 50, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%' }, delay: i * 0.08 });
  });
}

// ═══════════════════════════════════════════════════════
// THREE.JS HERO CANVAS
// ═══════════════════════════════════════════════════════
(function initHeroThree() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 28);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  // ── Particles ────────────────────────────────────────
  const particleCount = 2200;
  const positions = new Float32Array(particleCount * 3);
  const colors    = new Float32Array(particleCount * 3);
  const sizes     = new Float32Array(particleCount);

  const c1 = new THREE.Color('#00f5ff');
  const c2 = new THREE.Color('#7c3aed');
  const c3 = new THREE.Color('#f43f5e');

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 8 + Math.random() * 14;
    positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
    const t = Math.random();
    const col = t < 0.5 ? c1.clone().lerp(c2, t*2) : c2.clone().lerp(c3, (t-0.5)*2);
    colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;
    sizes[i] = 0.5 + Math.random() * 1.5;
  }
  const pgeo = new THREE.BufferGeometry();
  pgeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pgeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  pgeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const pmat = new THREE.PointsMaterial({
    size: 0.08, vertexColors: true, transparent: true, opacity: 0.7,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const points = new THREE.Points(pgeo, pmat);
  scene.add(points);

  // ── RF Wave Torus Knot ────────────────────────────────
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(4, 0.55, 160, 20, 2, 3),
    new THREE.MeshBasicMaterial({
      color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.18
    })
  );
  scene.add(knot);

  // ── Orbiting rings ────────────────────────────────────
  const rings = [];
  [[5.5, 0, 0x00f5ff, 0.12], [7.5, Math.PI/4, 0x7c3aed, 0.09], [9, Math.PI/2, 0xf43f5e, 0.06]].forEach(([r, rot, col, op]) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.025, 8, 180),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending })
    );
    ring.rotation.x = rot;
    scene.add(ring);
    rings.push(ring);
  });

  // ── Grid plane ────────────────────────────────────────
  const grid = new THREE.GridHelper(60, 30, 0x00f5ff, 0x00f5ff);
  grid.material.opacity = 0.03; grid.material.transparent = true;
  grid.position.y = -12;
  scene.add(grid);

  // ── Mouse parallax ────────────────────────────────────
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 0.8;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  // Mouse repulsion on particles
  const mouseVec = new THREE.Vector3();
  const tempVec  = new THREE.Vector3();
  const basePos  = positions.slice();

  document.addEventListener('mousemove', e => {
    mouseVec.set(
      (e.clientX / window.innerWidth  - 0.5) * 36,
      -(e.clientY / window.innerHeight - 0.5) * 22,
      0
    );
    const posArr = pgeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      tempVec.set(basePos[i*3], basePos[i*3+1], basePos[i*3+2]);
      const dt = tempVec.distanceTo(mouseVec);
      if (dt < 5) {
        const force = (5 - dt) / 5;
        const dir = tempVec.clone().sub(mouseVec).normalize().multiplyScalar(force * 2.5);
        posArr[i*3]   = basePos[i*3]   + dir.x;
        posArr[i*3+1] = basePos[i*3+1] + dir.y;
        posArr[i*3+2] = basePos[i*3+2] + dir.z;
      } else {
        posArr[i*3]   += (basePos[i*3]   - posArr[i*3])   * 0.04;
        posArr[i*3+1] += (basePos[i*3+1] - posArr[i*3+1]) * 0.04;
        posArr[i*3+2] += (basePos[i*3+2] - posArr[i*3+2]) * 0.04;
      }
    }
    pgeo.attributes.position.needsUpdate = true;
  });

  // ── Resize ────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  let t = 0;
  function animateHero() {
    requestAnimationFrame(animateHero);
    t += 0.004;
    points.rotation.y += 0.0008;
    points.rotation.x += 0.0003;
    knot.rotation.x += 0.004;
    knot.rotation.y += 0.006;
    rings.forEach((r, i) => { r.rotation.z += 0.003 + i * 0.001; r.rotation.x += 0.001; });
    grid.rotation.y += 0.0005;
    camera.position.x += (targetX * 3 - camera.position.x) * 0.05;
    camera.position.y += (-targetY * 2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animateHero();
})();

// ═══════════════════════════════════════════════════════
// PRODUCT RF WAVE CANVAS  (2D canvas – flowing field lines)
// ═══════════════════════════════════════════════════════
(function initRFCanvas() {
  const canvas = document.getElementById('product-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 600, H = 360;
  canvas.width = W; canvas.height = H;

  // Antenna geometry
  const cx = W * 0.52, cy = H * 0.48;
  const sqW = 110, sqH = 110;

  // Field lines
  const lines = [];
  const NLVLS = 30;
  for (let i = 0; i < NLVLS; i++) {
    lines.push({
      phase: (i / NLVLS) * Math.PI * 2,
      amp:   60 + i * 4,
      freq:  0.018 - i * 0.0002,
      hue:   200 + i * 5,
      alpha: 0.55 - i * 0.012
    });
  }

  let t = 0;
  function drawRF() {
    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const bg = ctx.createRadialGradient(cx*0.4, cy, 10, cx*0.4, cy, 260);
    bg.addColorStop(0, 'rgba(20,0,60,0.95)');
    bg.addColorStop(1, 'rgba(5,5,16,0.95)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Draw flowing field lines
    lines.forEach(ln => {
      ctx.beginPath();
      for (let x = 0; x < cx - 10; x += 2) {
        const progress = x / (cx - 10);
        const squeeze = Math.pow(progress, 2.2);
        const y = cy + Math.sin(x * ln.freq + t + ln.phase) * ln.amp * (1 - squeeze * 0.9);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const grad = ctx.createLinearGradient(0, cy, cx, cy);
      const h = ln.hue;
      grad.addColorStop(0, `hsla(${h},100%,70%,0)`);
      grad.addColorStop(0.5, `hsla(${h},100%,70%,${ln.alpha})`);
      grad.addColorStop(1, `hsla(${h},100%,80%,0.2)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Convergence flash
    const flashR = 4 + Math.sin(t * 3) * 2;
    const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashR * 4);
    flash.addColorStop(0, 'rgba(0,245,255,0.9)');
    flash.addColorStop(0.5, 'rgba(124,58,237,0.4)');
    flash.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = flash;
    ctx.beginPath();
    ctx.arc(cx, cy, flashR * 4, 0, Math.PI * 2);
    ctx.fill();

    // Antenna squares
    ctx.strokeStyle = 'rgba(180,160,130,0.8)';
    ctx.lineWidth = 2;
    // top square
    ctx.strokeRect(cx - sqW/2, cy - sqH - 4, sqW, sqH);
    // bottom square
    ctx.strokeRect(cx - sqW/2, cy + 4, sqW, sqH);

    // Right side output lines
    const rX = cx + sqW/2;
    ctx.strokeStyle = 'rgba(0,245,255,0.5)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    [[cy - sqH*0.4, '#00f5ff'], [cy, '#7c3aed'], [cy + sqH*0.4, '#10b981']].forEach(([y, col]) => {
      ctx.strokeStyle = col + '88';
      ctx.beginPath(); ctx.moveTo(rX, y); ctx.lineTo(W - 20, y); ctx.stroke();
    });
    ctx.setLineDash([]);

    t += 0.022;
    requestAnimationFrame(drawRF);
  }
  drawRF();
})();

// ═══════════════════════════════════════════════════════
// PRODUCT CARD 3D TILT
// ═══════════════════════════════════════════════════════
const card3d = document.getElementById('product-card');
if (card3d) {
  card3d.addEventListener('mousemove', e => {
    const rect = card3d.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card3d.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
  });
  card3d.addEventListener('mouseleave', () => { card3d.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)'; });
}

// ── Comp-card tilt ────────────────────────────────────
document.querySelectorAll('.comp-card[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ═══════════════════════════════════════════════════════
// DASHBOARD — FEED FRAMES (simulated camera captures)
// ═══════════════════════════════════════════════════════
(function initFrameCanvases() {
  const palettes = [
    { bg: '#0d0020', lines: ['#00f5ff','#7c3aed','#f43f5e'] },
    { bg: '#001a10', lines: ['#10b981','#06b6d4','#7c3aed'] },
    { bg: '#1a1200', lines: ['#f59e0b','#f43f5e','#00f5ff'] }
  ];
  [0,1,2].forEach(i => {
    const c = document.getElementById('frame' + i);
    if (!c) return;
    c.width  = c.parentElement.clientWidth  || 600;
    c.height = c.parentElement.clientHeight || 360;
    const ctx = c.getContext('2d');
    const pal = palettes[i];
    let ft = Math.random() * 100;

    function drawFrame() {
      const W = c.width, H = c.height;
      ctx.fillStyle = pal.bg;
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke(); }
      for (let gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke(); }

      // Signal waveform
      pal.lines.forEach((col, li) => {
        ctx.beginPath();
        const baseY = H * (0.3 + li * 0.2);
        for (let x = 0; x < W; x++) {
          const y = baseY + Math.sin(x * 0.04 + ft + li) * 25
                          + Math.sin(x * 0.012 + ft * 0.7) * 12;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // Bounding-box mockup
      const bx = W * 0.3 + Math.sin(ft*0.2)*W*0.08;
      const by = H * 0.2 + Math.cos(ft*0.15)*H*0.05;
      const bw = W * 0.4, bh = H * 0.5;
      ctx.strokeStyle = pal.lines[0];
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6,4]);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.setLineDash([]);

      // Label chip
      ctx.fillStyle = pal.lines[0] + 'cc';
      ctx.fillRect(bx, by - 18, 90, 18);
      ctx.fillStyle = '#000';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText('RF_ANOMALY 94%', bx + 4, by - 5);

      // Corner markers
      const clen = 14;
      [[bx,by],[bx+bw,by],[bx,by+bh],[bx+bw,by+bh]].forEach(([px,py], ci) => {
        ctx.strokeStyle = pal.lines[0]; ctx.lineWidth = 2; ctx.setLineDash([]);
        ctx.beginPath();
        if (ci===0||ci===2) { ctx.moveTo(px,py); ctx.lineTo(px+clen,py); ctx.moveTo(px,py); ctx.lineTo(px,py+(ci===0?clen:-clen)); }
        else { ctx.moveTo(px,py); ctx.lineTo(px-clen,py); ctx.moveTo(px,py); ctx.lineTo(px,py+(ci===1?clen:-clen)); }
        ctx.stroke();
      });

      ft += 0.04;
      requestAnimationFrame(drawFrame);
    }
    drawFrame();
  });
})();

// ── Feed carousel ────────────────────────────────────
let currentFrame = 0;
const frames = document.querySelectorAll('.feed-frame');
setInterval(() => {
  frames[currentFrame].classList.remove('active');
  currentFrame = (currentFrame + 1) % frames.length;
  frames[currentFrame].classList.add('active');
}, 3200);

// ── Model output animation ────────────────────────────
const modelData = [
  { id: 0, vals: [94.2, 91.8, 96.1, 89.3, 97.4] },
  { id: 1, vals: [87.6, 82.1, 91.2, 78.5, 85.9] },
  { id: 2, vals: [12.1, 18.4, 8.7, 22.1, 9.3]  },
  { id: 3, vals: [78.9, 81.2, 74.6, 83.1, 76.5] },
  { id: 4, vals: [45.3, 52.1, 38.7, 61.2, 42.8] },
];
let mdIdx = 0;
setInterval(() => {
  mdIdx = (mdIdx + 1) % 5;
  modelData.forEach(m => {
    const bar   = document.getElementById('bar' + m.id);
    const score = document.getElementById('score' + m.id);
    if (!bar || !score) return;
    const v = m.vals[mdIdx];
    bar.style.width    = v + '%';
    score.textContent  = v.toFixed(1) + '%';
  });
  // Telemetry jitter
  const rssi = document.getElementById('t-rssi');
  const snr  = document.getElementById('t-snr');
  const freq = document.getElementById('t-freq');
  const pkt  = document.getElementById('t-pkt');
  if (rssi) rssi.textContent = (-70 - Math.floor(Math.random()*8)) + ' dBm';
  if (snr)  snr.textContent  = (17 + Math.random()*3).toFixed(1) + ' dB';
  if (freq) freq.textContent = (2.430 + Math.random()*0.020).toFixed(3) + ' GHz';
  if (pkt)  pkt.textContent  = (Math.random()*1.2).toFixed(1) + '%';
}, 2500);

// ═══════════════════════════════════════════════════════
// SPECTRUM ANALYSER CANVAS
// ═══════════════════════════════════════════════════════
(function initSpectrum() {
  const canvas = document.getElementById('spectrum-canvas');
  if (!canvas) return;
  canvas.width  = canvas.parentElement.clientWidth  || 380;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const BARS = 80;
  const peaks = new Float32Array(BARS).fill(H * 0.8);

  function drawSpectrum() {
    ctx.clearRect(0, 0, W, H);
    const barW = W / BARS;
    for (let i = 0; i < BARS; i++) {
      const center = BARS * 0.55;
      const dist   = Math.abs(i - center) / (BARS * 0.5);
      const noise  = Math.random() * 0.3;
      let h = H * (0.65 - dist * 0.5 + Math.sin(Date.now()*0.003 + i*0.3) * 0.12 + noise * 0.15);
      h = Math.max(4, h);

      // Peak hold
      if (H - h < peaks[i]) peaks[i] = H - h;
      else peaks[i] += 0.8;

      const hue = 180 + (i / BARS) * 120;
      const grad = ctx.createLinearGradient(0, H, 0, H - h);
      grad.addColorStop(0, `hsla(${hue},100%,70%,0.15)`);
      grad.addColorStop(0.6, `hsla(${hue},100%,65%,0.6)`);
      grad.addColorStop(1,   `hsla(${hue},100%,80%,0.9)`);
      ctx.fillStyle = grad;
      ctx.fillRect(i * barW + 0.5, H - h, barW - 1.5, h);

      // Peak dot
      ctx.fillStyle = `hsla(${hue},100%,90%,0.8)`;
      ctx.fillRect(i * barW + 0.5, peaks[i], barW - 1.5, 1.5);
    }
    requestAnimationFrame(drawSpectrum);
  }
  drawSpectrum();
})();

// ═══════════════════════════════════════════════════════
// LOGIN MODAL
// ═══════════════════════════════════════════════════════
const modal    = document.getElementById('login-modal');
const openModal = () => modal.classList.add('open');
const closeModal = () => modal.classList.remove('open');

document.getElementById('login-btn').addEventListener('click', openModal);
document.getElementById('hero-dashboard-btn').addEventListener('click', () => { openModal(); });
document.getElementById('modal-close').addEventListener('click', closeModal);
const dashMdBtn = document.getElementById('dash-login-btn');
if (dashMdBtn) dashMdBtn.addEventListener('click', openModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const loginText = document.getElementById('login-text');
  const loginLoader = document.getElementById('login-loader');
  const loginMsg = document.getElementById('login-msg');
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value;

  loginText.classList.add('hidden');
  loginLoader.classList.remove('hidden');
  loginMsg.className = 'login-msg hidden';

  setTimeout(() => {
    loginText.classList.remove('hidden');
    loginLoader.classList.add('hidden');
    if (user && pass === 'ecs2026') {
      loginMsg.textContent = '✓ Access granted — Dashboard unlocked';
      loginMsg.className = 'login-msg success';
      setTimeout(() => { closeModal(); document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' }); }, 1200);
    } else {
      loginMsg.textContent = '✕ Invalid credentials. Try: admin / ecs2026';
      loginMsg.className = 'login-msg error';
    }
  }, 1400);
});

// ── ESC to close ─────────────────────────────────────
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
