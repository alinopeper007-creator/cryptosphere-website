/* ================================
   CryptoSphere — Member Dashboard
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initNotifications();
  initSignaturePad();

  // Pre-fill login form with registered user data
  const registeredUser = localStorage.getItem('cs_registered_user');
  if (registeredUser) {
    try {
      const userData = JSON.parse(registeredUser);
      if (userData && userData.userId && userData.password) {
        const loginUser = document.getElementById('loginUser');
        const loginPass = document.getElementById('loginPass');
        if (loginUser) loginUser.value = userData.userId;
        if (loginPass) loginPass.value = userData.password;
      }
    } catch (e) {
      localStorage.removeItem('cs_registered_user');
    }
  }
});

/* ---- Login ---- */
function handleLogin() {
  const userInput = document.getElementById('loginUser').value.trim();
  const passInput = document.getElementById('loginPass').value.trim();
  const loginError = document.getElementById('loginError');

  // Check demo credentials
  const isDemo = (userInput === 'CS-001234' && passInput === 'demo1234');

  // Check registered user credentials
  let isRegistered = false;
  let registeredUserData = null;
  const registeredUser = localStorage.getItem('cs_registered_user');
  if (registeredUser) {
    registeredUserData = JSON.parse(registeredUser);
    isRegistered = (userInput === registeredUserData.userId && passInput === registeredUserData.password);
  }

  if (!isDemo && !isRegistered) {
    if (loginError) {
      loginError.classList.remove('hidden');
      loginError.classList.add('flex');
      lucide.createIcons();
    }
    return;
  }

  if (loginError) {
    loginError.classList.add('hidden');
    loginError.classList.remove('flex');
  }

  // Determine user info
  let userName = 'John Doe';
  let userId = 'CS-001234';
  let userEmail = 'john.doe@email.com';
  if (isRegistered && registeredUserData) {
    userName = registeredUserData.name || 'John Doe';
    userId = registeredUserData.userId || 'CS-001234';
    userEmail = registeredUserData.email || 'john.doe@email.com';
  }

  // Generate initials from name
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Update top bar user info
  const topBarAvatar = document.getElementById('topBarAvatar');
  if (topBarAvatar) topBarAvatar.textContent = initials;
  const topBarName = document.getElementById('topBarName');
  if (topBarName) topBarName.textContent = userName;
  const topBarId = document.getElementById('topBarUserId');
  if (topBarId) topBarId.textContent = userId;

  // Update dashboard user card
  const dashAvatar = document.getElementById('dashAvatar');
  if (dashAvatar) dashAvatar.textContent = initials;
  const dashName = document.getElementById('dashName');
  if (dashName) dashName.textContent = userName;
  const dashUserId = document.getElementById('dashUserId');
  if (dashUserId) dashUserId.textContent = userId;

  // Update profile page
  const profileAvatar = document.getElementById('profileAvatar');
  if (profileAvatar) profileAvatar.textContent = initials;
  const profileName = document.getElementById('profileName');
  if (profileName) profileName.textContent = userName;
  const profileSubtitle = document.getElementById('profileSubtitle');
  if (profileSubtitle) profileSubtitle.textContent = 'Gold Member · ' + userId;
  const profileNameInput = document.getElementById('profileNameInput');
  if (profileNameInput) profileNameInput.value = userName;
  const profileEmailInput = document.getElementById('profileEmailInput');
  if (profileEmailInput) profileEmailInput.value = userEmail;

  // Update settings page
  const settingsNameInput = document.getElementById('settingsNameInput');
  if (settingsNameInput) settingsNameInput.value = userName;
  const settingsEmailInput = document.getElementById('settingsEmailInput');
  if (settingsEmailInput) settingsEmailInput.value = userEmail;

  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboardLayout').classList.remove('hidden');
  document.body.style.overflow = '';
  lucide.createIcons();

  // Init dashboard
  setTimeout(() => {
    initPerformanceChart();
    initGrowthChart();
    initNetworkTree();
    populateReferralTable();
    populateRewardsTable();
    populateContracts();
  }, 100);
}

function handleLogout() {
  window.location.href = 'index.html';
}

/* ---- Navigation ---- */
const pageTitles = {
  dashboard: { title: 'Dashboard', subtitle: 'Willkommen zurück in deinem Ökosystem' },
  profile: { title: 'Mein Profil', subtitle: 'Verwalte deine persönlichen Informationen' },
  network: { title: 'Mein Netzwerk', subtitle: 'Dein Empfehlungsbaum und Wachstum' },
  activity: { title: 'Aktivität', subtitle: 'Deine letzten Aktionen und Verlauf' },
  rewards: { title: 'Belohnungen', subtitle: 'Verfolge und löse deine Einnahmen ein' },
  contracts: { title: 'Verträge', subtitle: 'Anzeigen und unterzeichnen deiner Vereinbarungen' },
  settings: { title: 'Einstellungen', subtitle: 'Verwalte deine Kontoeinstellungen' }
};

function navigateTo(page) {
  // Update sidebar
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`[data-page="${page}"]`).classList.add('active');

  // Update pages
  document.querySelectorAll('.page-content').forEach(p => {
    p.classList.remove('active');
  });
  document.getElementById(`page-${page}`).classList.add('active');

  // Update title
  document.getElementById('pageTitle').textContent = pageTitles[page].title;
  document.getElementById('pageSubtitle').textContent = pageTitles[page].subtitle;

  // Close sidebar on mobile
  if (window.innerWidth < 1024) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
  }

  // Re-init network canvas if needed
  if (page === 'network') {
    setTimeout(() => initNetworkTree(), 100);
  }

  lucide.createIcons();
}

/* ---- Sidebar toggle ---- */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const mainContent = document.getElementById('mainContent');

  if (window.innerWidth >= 1024) {
    // Desktop: collapse/expand sidebar
    sidebar.classList.toggle('desktop-collapsed');
    if (mainContent) mainContent.classList.toggle('expanded');
  } else {
    // Mobile: toggle overlay
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  }
}

/* ---- Notifications ---- */
const notifications = [
  { icon: 'gift', color: 'gold', title: 'Belohnung erhalten', text: 'Du hast $450 aus Netzwerk-Bonus verdient', time: 'vor 2 Std.' },
  { icon: 'user-plus', color: 'blue', title: 'Neue Empfehlung', text: 'Sarah Chen ist deinem Netzwerk beigetreten', time: 'vor 5 Std.' },
  { icon: 'shield-check', color: 'blue', title: 'Sicherheitswarnung', text: 'Neue Anmeldung vom Chrome-Browser', time: 'vor 1 Tag' },
  { icon: 'trending-up', color: 'gold', title: 'Stufen-Aufstieg', text: 'Du hast dich für Gold-Stufen-Vorteile qualifiziert', time: 'vor 3 Tagen' },
  { icon: 'bell', color: 'blue', title: 'System-Update', text: 'Neue Dashboard-Funktionen verfügbar', time: 'vor 1 Woche' }
];

function initNotifications() {
  const list = document.getElementById('notifList');
  const dashList = document.getElementById('dashboardNotifs');

  const html = notifications.map(n => `
    <div class="flex gap-3 p-3 hover:bg-cs-dark/50 rounded-xl transition-colors cursor-pointer">
      <div class="w-9 h-9 rounded-lg bg-${n.color === 'gold' ? 'cs-gold' : 'cs-blue'}/10 border border-${n.color === 'gold' ? 'cs-gold' : 'cs-blue'}/30 flex items-center justify-center flex-shrink-0">
        <i data-lucide="${n.icon}" class="w-4 h-4 text-${n.color === 'gold' ? 'cs-gold' : 'cs-blue'}"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold truncate">${n.title}</div>
        <div class="text-xs text-gray-500 truncate">${n.text}</div>
        <div class="text-xs text-gray-600 mt-0.5">${n.time}</div>
      </div>
    </div>
  `).join('');

  if (list) list.innerHTML = html;
  if (dashList) dashList.innerHTML = html;

  lucide.createIcons();
}

function toggleNotifPanel() {
  document.getElementById('notifPanel').classList.toggle('hidden');
}

/* ---- Performance Chart ---- */
function initPerformanceChart() {
  const canvas = document.getElementById('performanceChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(212, 175, 55, 0.25)');
  gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

  const gradient2 = ctx.createLinearGradient(0, 0, 0, 200);
  gradient2.addColorStop(0, 'rgba(0, 174, 239, 0.25)');
  gradient2.addColorStop(1, 'rgba(0, 174, 239, 0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Einnahmen',
          data: [3200, 4100, 3800, 5100, 6200, 7800, 9400],
          borderColor: '#D4AF37',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#D4AF37',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        },
        {
          label: 'Netzwerk-Wert',
          data: [1800, 2400, 2900, 3600, 4200, 5500, 6800],
          borderColor: '#00AEEF',
          backgroundColor: gradient2,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#00AEEF',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            color: '#9CA3AF',
            font: { size: 10, family: 'Inter, sans-serif' },
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 6,
            boxHeight: 6,
            padding: 12
          }
        },
        tooltip: {
          backgroundColor: '#11172B',
          borderColor: '#1E2740',
          borderWidth: 1,
          titleColor: '#fff',
          titleFont: { size: 11, family: 'Inter, sans-serif' },
          bodyColor: '#9CA3AF',
          bodyFont: { size: 10, family: 'Inter, sans-serif' },
          padding: 10,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4
        }
      },
      layout: {
        padding: { top: 4, bottom: 0, left: 0, right: 4 }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#6b7280', font: { size: 9, family: 'Inter, sans-serif' }, maxRotation: 0 }
        },
        y: {
          grid: { color: 'rgba(30, 39, 64, 0.4)', drawBorder: false },
          border: { display: false },
          ticks: {
            color: '#6b7280',
            font: { size: 9, family: 'Inter, sans-serif' },
            callback: v => '$' + v / 1000 + 'K',
            padding: 6
          }
        }
      }
    }
  });
}

/* ---- Growth Chart ---- */
function initGrowthChart() {
  const canvas = document.getElementById('growthChart');
  if (!canvas) return;

  new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Neue Mitglieder',
        data: [8, 12, 15, 18, 24, 32, 45],
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, '#00AEEF');
          gradient.addColorStop(1, 'rgba(0, 174, 239, 0.15)');
          return gradient;
        },
        borderRadius: 5,
        barThickness: 'flex',
        maxBarThickness: 24,
        hoverBackgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, '#00AEEF');
          gradient.addColorStop(1, 'rgba(0, 174, 239, 0.3)');
          return gradient;
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#11172B',
          borderColor: '#1E2740',
          borderWidth: 1,
          titleColor: '#fff',
          titleFont: { size: 11, family: 'Inter, sans-serif' },
          bodyColor: '#9CA3AF',
          bodyFont: { size: 10, family: 'Inter, sans-serif' },
          padding: 10,
          cornerRadius: 8,
          displayColors: false
        }
      },
      layout: {
        padding: { top: 4, bottom: 0, left: 0, right: 4 }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#6b7280', font: { size: 9, family: 'Inter, sans-serif' }, maxRotation: 0 }
        },
        y: {
          grid: { color: 'rgba(30, 39, 64, 0.4)' },
          border: { display: false },
          ticks: { color: '#6b7280', font: { size: 9, family: 'Inter, sans-serif' }, padding: 6, maxTicksLimit: 5 }
        }
      }
    }
  });
}

/* ---- Network Tree Visualization ---- */
function initNetworkTree() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio;
  const w = canvas.offsetWidth;
  const h = 450;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const centerX = w / 2;
  const centerY = h / 2;

  const nodes = [
    { id: 'root', x: centerX, y: centerY, r: 22, color: '#D4AF37', label: 'You', isRoot: true },
    { id: 'l1-1', x: centerX - 200, y: centerY - 120, r: 14, color: '#00AEEF', label: 'Sarah C.' },
    { id: 'l1-2', x: centerX, y: centerY - 140, r: 14, color: '#00AEEF', label: 'Mike R.' },
    { id: 'l1-3', x: centerX + 200, y: centerY - 120, r: 14, color: '#00AEEF', label: 'Alex K.' },
    { id: 'l1-4', x: centerX - 240, y: centerY + 100, r: 14, color: '#00AEEF', label: 'Emma L.' },
    { id: 'l1-5', x: centerX + 240, y: centerY + 100, r: 14, color: '#00AEEF', label: 'David W.' },
    { id: 'l1-6', x: centerX, y: centerY + 150, r: 14, color: '#00AEEF', label: 'Lisa M.' },
    { id: 'l2-1', x: centerX - 300, y: centerY - 180, r: 8, color: '#D4AF37', label: '' },
    { id: 'l2-2', x: centerX - 140, y: centerY - 200, r: 8, color: '#D4AF37', label: '' },
    { id: 'l2-3', x: centerX - 60, y: centerY - 220, r: 8, color: '#D4AF37', label: '' },
    { id: 'l2-4', x: centerX + 60, y: centerY - 220, r: 8, color: '#D4AF37', label: '' },
    { id: 'l2-5', x: centerX + 140, y: centerY - 200, r: 8, color: '#D4AF37', label: '' },
    { id: 'l2-6', x: centerX + 300, y: centerY - 180, r: 8, color: '#D4AF37', label: '' },
    { id: 'l2-7', x: centerX - 300, y: centerY + 170, r: 8, color: '#D4AF37', label: '' },
    { id: 'l2-8', x: centerX + 300, y: centerY + 170, r: 8, color: '#D4AF37', label: '' },
    { id: 'l2-9', x: centerX - 100, y: centerY + 210, r: 8, color: '#D4AF37', label: '' },
    { id: 'l2-10', x: centerX + 100, y: centerY + 210, r: 8, color: '#D4AF37', label: '' },
  ];

  const edges = [
    ['root', 'l1-1'], ['root', 'l1-2'], ['root', 'l1-3'], ['root', 'l1-4'], ['root', 'l1-5'], ['root', 'l1-6'],
    ['l1-1', 'l2-1'], ['l1-1', 'l2-2'],
    ['l1-2', 'l2-3'], ['l1-2', 'l2-4'],
    ['l1-3', 'l2-5'], ['l1-3', 'l2-6'],
    ['l1-4', 'l2-7'],
    ['l1-5', 'l2-8'],
    ['l1-6', 'l2-9'], ['l1-6', 'l2-10'],
  ];

  let animProgress = 0;

  function draw() {
    ctx.clearRect(0, 0, w, h);

    edges.forEach(([from, to]) => {
      const a = nodes.find(n => n.id === from);
      const b = nodes.find(n => n.id === to);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const drawDist = dist * Math.min(animProgress, 1);

      const endX = a.x + (dx / dist) * drawDist;
      const endY = a.y + (dy / dist) * drawDist;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = a.isRoot ? 'rgba(212, 175, 55, 0.3)' : 'rgba(0, 174, 239, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    if (animProgress < 1) animProgress += 0.03;

    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r * 2.5, 0, Math.PI * 2);
      const glowColor = node.color === '#D4AF37' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 174, 239, 0.1)';
      ctx.fillStyle = glowColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = '#0B0F1A';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      if (node.label) {
        ctx.fillStyle = '#fff';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        const labelY = node.isRoot ? node.y + node.r + 20 : (node.y < centerY ? node.y - node.r - 10 : node.y + node.r + 20);
        ctx.fillText(node.label, node.x, labelY);
      }
    });

    if (animProgress < 1) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}

/* ---- Populate Referral Table ---- */
function populateReferralTable() {
  const tbody = document.getElementById('referralTableBody');
  if (!tbody) return;

  const referrals = [
    { name: 'Sarah Chen', id: 'CS-001235', joined: '20. Jan. 2024', status: 'active', size: 28 },
    { name: 'Mike Ross', id: 'CS-001236', joined: '22. Jan. 2024', status: 'active', size: 15 },
    { name: 'Alex Kim', id: 'CS-001237', joined: '25. Jan. 2024', status: 'active', size: 22 },
    { name: 'Emma Lee', id: 'CS-001238', joined: '01. Feb. 2024', status: 'pending', size: 5 },
    { name: 'David Wang', id: 'CS-001239', joined: '05. Feb. 2024', status: 'active', size: 18 },
    { name: 'Lisa Martinez', id: 'CS-001240', joined: '10. Feb. 2024', status: 'active', size: 12 },
  ];

  const statusClass = {
    active: 'status-active',
    pending: 'status-pending',
    inactive: 'status-inactive'
  };

  tbody.innerHTML = referrals.map(r => `
    <tr>
      <td>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cs-gold to-cs-blue p-0.5">
            <div class="w-full h-full rounded-full bg-cs-dark flex items-center justify-center text-xs font-bold text-cs-gold">
              ${r.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <span class="font-semibold">${r.name}</span>
        </div>
      </td>
      <td><span class="font-mono text-sm">${r.id}</span></td>
      <td class="text-gray-400">${r.joined}</td>
      <td><span class="px-2.5 py-0.5 rounded-full ${statusClass[r.status]} text-xs font-medium capitalize">${r.status}</span></td>
      <td class="text-gray-400">${r.size} Mitglieder</td>
    </tr>
  `).join('');
}

/* ---- Populate Rewards Table ---- */
function populateRewardsTable() {
  const tbody = document.getElementById('rewardsTableBody');
  if (!tbody) return;

  const rewards = [
    { date: '15. Jul. 2024', desc: 'Netzwerk-Teilnahme-Bonus', type: 'Bonus', amount: '+$450,00', status: 'active' },
    { date: '10. Jul. 2024', desc: 'Empfehlungsprovision — Sarah Chen', type: 'Empfehlung', amount: '+$120,00', status: 'active' },
    { date: '05. Jul. 2024', desc: 'Stufen-Aufstieg-Belohnung', type: 'Bonus', amount: '+$300,00', status: 'active' },
    { date: '28. Jun. 2024', desc: 'Monatlicher Aktivitäts-Bonus', type: 'Aktivität', amount: '+$85,00', status: 'active' },
    { date: '20. Jun. 2024', desc: 'Empfehlungsprovision — Mike Ross', type: 'Empfehlung', amount: '+$95,00', status: 'active' },
    { date: '15. Jun. 2024', desc: 'Auszahlung auf Bank', type: 'Einlösung', amount: '-$500,00', status: 'pending' },
  ];

  const statusClass = {
    active: 'status-active',
    pending: 'status-pending',
    inactive: 'status-inactive'
  };

  const typeColor = {
    Bonus: 'text-cs-gold',
    Empfehlung: 'text-cs-blue',
    Aktivität: 'text-green-400',
    Einlösung: 'text-red-400'
  };

  tbody.innerHTML = rewards.map(r => `
    <tr>
      <td class="text-gray-400">${r.date}</td>
      <td class="text-sm">${r.desc}</td>
      <td><span class="${typeColor[r.type]} text-xs font-semibold">${r.type}</span></td>
      <td class="font-semibold ${r.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}">${r.amount}</td>
      <td><span class="px-2.5 py-0.5 rounded-full ${statusClass[r.status]} text-xs font-medium capitalize">${r.status}</span></td>
    </tr>
  `).join('');
}

/* ---- Populate Contracts ---- */
function populateContracts() {
  const container = document.getElementById('contractList');
  if (!container) return;

  const contracts = [
    { title: 'Premium Membership Agreement', date: 'Jan 15, 2024', status: 'signed', desc: 'Gold tier premium membership with enhanced rewards.' },
    { title: 'Network Participation Terms', date: 'Jan 15, 2024', status: 'signed', desc: 'Terms for participating in the referral network.' },
    { title: 'Reward Distribution Contract', date: 'Mar 01, 2024', status: 'pending', desc: 'Agreement for reward payout structure and schedule.' },
    { title: 'Data Privacy Agreement', date: 'Mar 01, 2024', status: 'pending', desc: 'Privacy policy and data handling consent form.' },
  ];

  const statusBadge = {
    signed: '<span class="px-2.5 py-0.5 rounded-full status-active text-xs font-medium">Signed</span>',
    pending: '<span class="px-2.5 py-0.5 rounded-full status-pending text-xs font-medium">Pending Signature</span>'
  };

  container.innerHTML = contracts.map(c => `
    <div class="flex items-center justify-between p-4 bg-cs-dark rounded-xl border border-cs-border hover:border-cs-blue/30 transition-all">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-lg bg-cs-gold/10 border border-cs-gold/30 flex items-center justify-center flex-shrink-0">
          <i data-lucide="file-text" class="w-5 h-5 text-cs-gold"></i>
        </div>
        <div>
          <div class="text-sm font-semibold">${c.title}</div>
          <div class="text-xs text-gray-500">${c.desc}</div>
          <div class="text-xs text-gray-600 mt-1">${c.date}</div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        ${statusBadge[c.status]}
        <button class="p-2 text-gray-400 hover:text-cs-blue"><i data-lucide="eye" class="w-4 h-4"></i></button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

/* ---- Signature Pad ---- */
let signaturePad = null;
let signatureCtx = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function initSignaturePad() {
  const canvas = document.getElementById('signaturePad');
  if (!canvas) return;

  const dpr = window.devicePixelRatio;
  const w = canvas.offsetWidth;
  const h = 200;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  signatureCtx = canvas.getContext('2d');
  signatureCtx.scale(dpr, dpr);
  signatureCtx.lineCap = 'round';
  signatureCtx.strokeStyle = '#fff';
  signatureCtx.lineWidth = 2;

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);

  canvas.addEventListener('touchstart', handleTouch);
  canvas.addEventListener('touchmove', handleTouch);
  canvas.addEventListener('touchend', stopDraw);
}

function getCoords(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches && e.touches[0]) {
    return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function startDraw(e) {
  isDrawing = true;
  const canvas = document.getElementById('signaturePad');
  const coords = getCoords(e, canvas);
  lastX = coords.x;
  lastY = coords.y;
}

function draw(e) {
  if (!isDrawing) return;
  const canvas = document.getElementById('signaturePad');
  const coords = getCoords(e, canvas);
  signatureCtx.beginPath();
  signatureCtx.moveTo(lastX, lastY);
  signatureCtx.lineTo(coords.x, coords.y);
  signatureCtx.stroke();
  lastX = coords.x;
  lastY = coords.y;
}

function handleTouch(e) {
  e.preventDefault();
  if (e.type === 'touchstart') startDraw(e);
  if (e.type === 'touchmove') draw(e);
}

function stopDraw() {
  isDrawing = false;
}

function clearSignature() {
  const canvas = document.getElementById('signaturePad');
  if (!canvas || !signatureCtx) return;
  signatureCtx.clearRect(0, 0, canvas.offsetWidth, 200);
}

function saveSignature() {
  const canvas = document.getElementById('signaturePad');
  if (!canvas) return;

  // Check if canvas is empty
  const pixels = signatureCtx.getImageData(0, 0, canvas.offsetWidth, 200).data;
  let isEmpty = true;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] !== 0) { isEmpty = false; break; }
  }

  if (isEmpty) {
    alert('Please draw your signature first.');
    return;
  }

  alert('Signature submitted successfully! Your contract has been signed.');
  clearSignature();
}