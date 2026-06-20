/* ================================
   CryptoSphere — Homepage Scripts
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  initNavbar();
  initMobileMenu();
  initHeroCanvas();
  initCounters();
  initFAQ();
  initContactForm();
  initScrollReveal();
  initSubscribeModal();
});

/* ---- Navbar scroll effect ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/* ---- Mobile menu ---- */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

/* ---- Hero canvas animation ---- */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, nodes = [], connections = [];
  const nodeCount = 60;
  const maxDist = 180;

  function resize() {
    width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
  }

  function createNodes() {
    nodes = [];
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Central node
    nodes.push({
      x: cx, y: cy,
      vx: 0, vy: 0,
      r: 6,
      color: '#D4AF37',
      isCenter: true
    });

    // Orbital nodes
    for (let i = 0; i < nodeCount; i++) {
      const angle = (Math.PI * 2 * i) / nodeCount;
      const r = radius * (0.5 + Math.random() * 0.5);
      nodes.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1.5 + Math.random() * 2,
        color: Math.random() > 0.5 ? '#00AEEF' : '#D4AF37',
        angle: angle,
        orbitSpeed: 0.0005 + Math.random() * 0.001,
        orbitRadius: r,
        cx: cx,
        cy: cy
      });
    }
  }

  function updateConnections() {
    connections = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          connections.push({
            a: nodes[i],
            b: nodes[j],
            opacity: 1 - dist / maxDist
          });
        }
      }
    }
  }

  let rotation = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);
    rotation += 0.002;

    // Draw rotating globe ring
    const cx = width / 2;
    const cy = height / 2;
    const ringRadius = Math.min(width, height) * 0.3;

    // Globe rings
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, ringRadius, ringRadius * (0.3 + i * 0.1), rotation * (i + 1), 0, Math.PI * 2);
      ctx.strokeStyle = i === 0 ? 'rgba(0, 174, 239, 0.15)' : 'rgba(212, 175, 55, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Update node positions (orbital movement)
    nodes.forEach((node, i) => {
      if (node.isCenter) return;
      node.angle += node.orbitSpeed;
      node.x = node.cx + Math.cos(node.angle) * node.orbitRadius;
      node.y = node.cy + Math.sin(node.angle) * node.orbitRadius * (0.5 + Math.sin(rotation + i) * 0.1);
    });

    updateConnections();

    // Draw connections
    connections.forEach(conn => {
      ctx.beginPath();
      ctx.moveTo(conn.a.x, conn.a.y);
      ctx.lineTo(conn.b.x, conn.b.y);
      const alpha = conn.opacity * 0.25;
      ctx.strokeStyle = conn.a.color === '#D4AF37' || conn.b.color === '#D4AF37'
        ? `rgba(212, 175, 55, ${alpha})`
        : `rgba(0, 174, 239, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = node.isCenter ? node.color : node.color;
      ctx.fill();

      if (node.isCenter) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.fill();
      }

      // Glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r * 3, 0, Math.PI * 2);
      const glowColor = node.color === '#D4AF37' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 174, 239, 0.1)';
      ctx.fillStyle = glowColor;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  function init() {
    resize();
    createNodes();
    animate();
  }

  init();
  window.addEventListener('resize', () => {
    resize();
    createNodes();
  });
}

/* ---- Animated counters ---- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * easeOut);

      if (target >= 1000) {
        el.textContent = (value / 1000).toFixed(0) + 'K' + suffix;
      } else {
        el.textContent = value + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (target >= 1000) {
          el.textContent = (target / 1000).toFixed(0) + 'K+' + suffix;
        } else {
          el.textContent = target + suffix;
        }
      }
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ---- FAQ Accordion ---- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ---- Contact Form ---- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.classList.remove('hidden');
    success.classList.add('flex');
    form.reset();

    setTimeout(() => {
      success.classList.add('hidden');
      success.classList.remove('flex');
    }, 5000);
  });
}

/* ---- Scroll Reveal ---- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.step-card, .feature-card, .roadmap-item, .faq-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* ---- Subscribe Modal (Invitation-Based Registration) ---- */
const validInviteCodes = [
  'CS-GOLD-2024',
  'CRYPTO-INVITE',
  'SPHERE-001',
  'CS-VIP-2024',
  'CRYPTO-ALPHA',
  'CS-FOUNDER',
  'SPHERE-PRO',
  'CS-ELITE-01',
  'BLOCKCHAIN-01',
  'CS-EARLY-24'
];

function initSubscribeModal() {
  const backdrop = document.getElementById('subscribeBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeSubscribeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSubscribeModal();
  });

  const inviteInput = document.getElementById('inviteCode');
  if (inviteInput) {
    inviteInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
    });
  }
}

function openSubscribeModal() {
  const modal = document.getElementById('subscribeModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex', 'active');
  document.body.style.overflow = 'hidden';
  showSubscribeStep(1);
  const inviteInput = document.getElementById('inviteCode');
  if (inviteInput) inviteInput.value = '';
  lucide.createIcons();
}

function closeSubscribeModal() {
  const modal = document.getElementById('subscribeModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex', 'active');
  document.body.style.overflow = '';
}

function showSubscribeStep(step) {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`subscribeStep${i}`);
    if (el) el.classList.add('hidden');
  }
  const target = document.getElementById(`subscribeStep${step}`);
  if (target) target.classList.remove('hidden');
  lucide.createIcons();
}

function verifyInviteCode() {
  const code = document.getElementById('inviteCode').value.trim().toUpperCase();
  const error = document.getElementById('inviteError');
  const errorText = document.getElementById('inviteErrorText');

  if (!code) {
    error.classList.remove('hidden');
    error.classList.add('flex');
    errorText.textContent = 'Bitte gib deinen Einladungscode ein.';
    lucide.createIcons();
    return;
  }

  if (validInviteCodes.includes(code)) {
    error.classList.add('hidden');
    error.classList.remove('flex');
    showSubscribeStep(2);
  } else {
    error.classList.remove('hidden');
    error.classList.add('flex');
    errorText.textContent = 'Ungültiger Einladungscode. Bitte überprüfe und versuche es erneut.';
    lucide.createIcons();
  }
}

function backToStep1() {
  showSubscribeStep(1);
}

function submitRegistration() {
  const name = document.getElementById('subName').value.trim();
  const email = document.getElementById('subEmail').value.trim();
  const password = document.getElementById('subPassword').value;
  const confirmPassword = document.getElementById('subConfirmPassword').value;
  const error = document.getElementById('subError');
  const errorText = document.getElementById('subErrorText');

  if (!name || !email || !password || !confirmPassword) {
    error.classList.remove('hidden');
    error.classList.add('flex');
    errorText.textContent = 'Bitte fülle alle Felder aus.';
    lucide.createIcons();
    return;
  }

  if (password !== confirmPassword) {
    error.classList.remove('hidden');
    error.classList.add('flex');
    errorText.textContent = 'Passwörter stimmen nicht überein.';
    lucide.createIcons();
    return;
  }

  if (password.length < 6) {
    error.classList.remove('hidden');
    error.classList.add('flex');
    errorText.textContent = 'Passwort muss mindestens 6 Zeichen lang sein.';
    lucide.createIcons();
    return;
  }

  error.classList.add('hidden');
  error.classList.remove('flex');

  // Save registration data to localStorage
  const userId = 'CS-' + Math.floor(100000 + Math.random() * 900000);
  const userData = {
    name: name,
    email: email,
    password: password,
    userId: userId,
    registeredAt: new Date().toISOString()
  };
  localStorage.setItem('cs_registered_user', JSON.stringify(userData));

  // Display credentials in success step
  const displayUserId = document.getElementById('displayUserId');
  const displayEmail = document.getElementById('displayEmail');
  if (displayUserId) displayUserId.textContent = userId;
  if (displayEmail) displayEmail.textContent = email;

  showSubscribeStep(3);
}