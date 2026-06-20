/* ================================
   CryptoSphere — Admin Panel
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initNotifications();
});

/* ---- Login ---- */
function handleAdminLogin() {
  const userInput = document.getElementById('loginUser').value.trim();
  const passInput = document.getElementById('loginPass').value.trim();
  const loginError = document.getElementById('loginError');

  const isAdmin = (userInput === 'ADMIN-001' && passInput === 'admin1234');

  if (!isAdmin) {
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

  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboardLayout').classList.remove('hidden');
  document.body.style.overflow = '';
  lucide.createIcons();

  setTimeout(() => {
    initTopupChart();
    initUserGrowthChart();
    initRegionChart();
    initDistributionChart();
    populateRecentTopups();
    populateTopupTable();
    populateUserTable();
  }, 100);
}

function handleLogout() {
  window.location.href = 'index.html';
}

/* ---- Navigation ---- */
const pageTitles = {
  dashboard: { title: 'Dashboard', subtitle: 'Admin-Übersicht' },
  topup: { title: 'Topup-Verwaltung', subtitle: 'Topups verwalten und hinzufügen' },
  users: { title: 'Nutzer', subtitle: 'Nutzerkonten verwalten' },
  analytics: { title: 'Statistiken', subtitle: 'Detaillierte Analysen' },
  settings: { title: 'Einstellungen', subtitle: 'Plattform-Konfiguration' }
};

function navigateTo(page) {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`[data-page="${page}"]`).classList.add('active');

  document.querySelectorAll('.page-content').forEach(p => {
    p.classList.remove('active');
  });
  document.getElementById(`page-${page}`).classList.add('active');

  document.getElementById('pageTitle').textContent = pageTitles[page].title;
  document.getElementById('pageSubtitle').textContent = pageTitles[page].subtitle;

  if (window.innerWidth < 1024) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
  }

  if (page === 'analytics') {
    setTimeout(() => {
      initRegionChart();
      initDistributionChart();
    }, 100);
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
  { icon: 'credit-card', color: 'gold', title: 'Neuer Topup', text: '$500 von CS-001234 erhalten', time: 'vor 5 Min.' },
  { icon: 'alert-circle', color: 'blue', title: 'Ausstehende Genehmigung', text: '3 Topups warten auf Freigabe', time: 'vor 1 Std.' },
  { icon: 'user-plus', color: 'blue', title: 'Neuer Nutzer', text: 'CS-001250 hat sich registriert', time: 'vor 2 Std.' },
  { icon: 'trending-up', color: 'gold', title: 'Umsatzrekord', text: 'Tagesumsatz um 23% gestiegen', time: 'vor 5 Std.' },
  { icon: 'shield-check', color: 'blue', title: 'Sicherheits-Scan', text: 'Routine-Scan abgeschlossen', time: 'vor 1 Tag' }
];

function initNotifications() {
  const list = document.getElementById('notifList');

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
  lucide.createIcons();
}

function toggleNotifPanel() {
  document.getElementById('notifPanel').classList.toggle('hidden');
}

/* ---- Topup Chart ---- */
function initTopupChart() {
  const canvas = document.getElementById('topupChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(212, 175, 55, 0.25)');
  gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Topup-Volumen',
        data: [85000, 92000, 78000, 105000, 132000, 158000, 184000],
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
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
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
          cornerRadius: 8
        }
      },
      layout: { padding: { top: 4, bottom: 0, left: 0, right: 4 } },
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
            callback: v => '$' + (v / 1000) + 'K',
            padding: 6
          }
        }
      }
    }
  });
}

/* ---- User Growth Chart ---- */
function initUserGrowthChart() {
  const canvas = document.getElementById('userGrowthChart');
  if (!canvas) return;

  new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Neue Nutzer',
        data: [120, 180, 250, 340, 480, 620, 850],
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, '#00AEEF');
          gradient.addColorStop(1, 'rgba(0, 174, 239, 0.15)');
          return gradient;
        },
        borderRadius: 5,
        maxBarThickness: 24
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
      layout: { padding: { top: 4, bottom: 0, left: 0, right: 4 } },
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

/* ---- Region Chart ---- */
function initRegionChart() {
  const canvas = document.getElementById('regionChart');
  if (!canvas) return;

  new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Europa', 'Nordamerika', 'Asien', 'Südamerika', 'Andere'],
      datasets: [{
        data: [42, 28, 18, 8, 4],
        backgroundColor: ['#D4AF37', '#00AEEF', '#22c55e', '#eab308', '#6b7280'],
        borderColor: '#0F1424',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#9CA3AF',
            font: { size: 11, family: 'Inter, sans-serif' },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 12
          }
        },
        tooltip: {
          backgroundColor: '#11172B',
          borderColor: '#1E2740',
          borderWidth: 1,
          titleColor: '#fff',
          bodyColor: '#9CA3AF',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => ctx.label + ': ' + ctx.parsed + '%'
          }
        }
      }
    }
  });
}

/* ---- Distribution Chart ---- */
function initDistributionChart() {
  const canvas = document.getElementById('distributionChart');
  if (!canvas) return;

  new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['$10-50', '$50-100', '$100-500', '$500-1K', '$1K-5K', '$5K+'],
      datasets: [{
        label: 'Anzahl Topups',
        data: [450, 320, 280, 120, 65, 12],
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, '#D4AF37');
          gradient.addColorStop(1, 'rgba(212, 175, 55, 0.15)');
          return gradient;
        },
        borderRadius: 5,
        maxBarThickness: 40
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#11172B',
          borderColor: '#1E2740',
          borderWidth: 1,
          titleColor: '#fff',
          bodyColor: '#9CA3AF',
          padding: 10,
          cornerRadius: 8,
          displayColors: false
        }
      },
      layout: { padding: { top: 4, bottom: 0, left: 0, right: 8 } },
      scales: {
        x: {
          grid: { color: 'rgba(30, 39, 64, 0.4)' },
          border: { display: false },
          ticks: { color: '#6b7280', font: { size: 9, family: 'Inter, sans-serif' } }
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#9CA3AF', font: { size: 10, family: 'Inter, sans-serif' } }
        }
      }
    }
  });
}

/* ---- Topup Data ---- */
const topupData = [
  { txId: 'TX-20240720-001', name: 'John Doe', id: 'CS-001234', amount: 450.00, method: 'Kreditkarte', status: 'completed', date: '20. Jul. 2024' },
  { txId: 'TX-20240720-002', name: 'Sarah Chen', id: 'CS-001235', amount: 120.00, method: 'Krypto-Wallet', status: 'completed', date: '20. Jul. 2024' },
  { txId: 'TX-20240720-003', name: 'Mike Ross', id: 'CS-001236', amount: 850.00, method: 'Banküberweisung', status: 'pending', date: '20. Jul. 2024' },
  { txId: 'TX-20240719-004', name: 'Alex Kim', id: 'CS-001237', amount: 300.00, method: 'Kreditkarte', status: 'completed', date: '19. Jul. 2024' },
  { txId: 'TX-20240719-005', name: 'Emma Lee', id: 'CS-001238', amount: 75.00, method: 'Kreditkarte', status: 'failed', date: '19. Jul. 2024' },
  { txId: 'TX-20240719-006', name: 'David Wang', id: 'CS-001239', amount: 1200.00, method: 'Banküberweisung', status: 'completed', date: '19. Jul. 2024' },
  { txId: 'TX-20240718-007', name: 'Lisa Martinez', id: 'CS-001240', amount: 250.00, method: 'Krypto-Wallet', status: 'pending', date: '18. Jul. 2024' },
  { txId: 'TX-20240718-008', name: 'Tom Wilson', id: 'CS-001241', amount: 500.00, method: 'Kreditkarte', status: 'completed', date: '18. Jul. 2024' },
  { txId: 'TX-20240718-009', name: 'Anna Brown', id: 'CS-001242', amount: 180.00, method: 'Intern', status: 'completed', date: '18. Jul. 2024' },
  { txId: 'TX-20240717-010', name: 'Kevin Davis', id: 'CS-001243', amount: 95.00, method: 'Kreditkarte', status: 'completed', date: '17. Jul. 2024' },
  { txId: 'TX-20240717-011', name: 'Julia Garcia', id: 'CS-001244', amount: 2000.00, method: 'Banküberweisung', status: 'pending', date: '17. Jul. 2024' },
  { txId: 'TX-20240717-012', name: 'Robert Lee', id: 'CS-001245', amount: 350.00, method: 'Krypto-Wallet', status: 'completed', date: '17. Jul. 2024' },
];

const statusClass = {
  completed: 'status-active',
  pending: 'status-pending',
  failed: 'status-inactive'
};

const statusLabel = {
  completed: 'Abgeschlossen',
  pending: 'Ausstehend',
  failed: 'Fehlgeschlagen'
};

const methodIcon = {
  'Kreditkarte': 'credit-card',
  'Banküberweisung': 'building-2',
  'Krypto-Wallet': 'wallet',
  'Intern': 'refresh-cw'
};

/* ---- Populate Recent Topups ---- */
function populateRecentTopups() {
  const tbody = document.getElementById('recentTopupsBody');
  if (!tbody) return;

  const recent = topupData.slice(0, 5);

  tbody.innerHTML = recent.map(t => `
    <tr>
      <td>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cs-gold to-cs-blue p-0.5">
            <div class="w-full h-full rounded-full bg-cs-dark flex items-center justify-center text-xs font-bold text-cs-gold">
              ${t.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <span class="font-semibold">${t.name}</span>
        </div>
      </td>
      <td><span class="font-mono text-sm">${t.id}</span></td>
      <td class="font-semibold text-cs-gold">$${t.amount.toFixed(2)}</td>
      <td>
        <div class="flex items-center gap-2">
          <i data-lucide="${methodIcon[t.method] || 'credit-card'}" class="w-4 h-4 text-gray-400"></i>
          <span class="text-sm">${t.method}</span>
        </div>
      </td>
      <td><span class="px-2.5 py-0.5 rounded-full ${statusClass[t.status]} text-xs font-medium">${statusLabel[t.status]}</span></td>
      <td class="text-gray-400 text-sm">${t.date}</td>
    </tr>
  `).join('');

  lucide.createIcons();
}

/* ---- Populate Full Topup Table ---- */
function populateTopupTable() {
  const tbody = document.getElementById('topupTableBody');
  if (!tbody) return;

  tbody.innerHTML = topupData.map((t, idx) => `
    <tr data-search="${t.id.toLowerCase()} ${t.name.toLowerCase()}" data-status="${t.status}">
      <td><span class="font-mono text-xs text-gray-400">${t.txId}</span></td>
      <td>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cs-gold to-cs-blue p-0.5">
            <div class="w-full h-full rounded-full bg-cs-dark flex items-center justify-center text-xs font-bold text-cs-gold">
              ${t.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <span class="font-semibold">${t.name}</span>
        </div>
      </td>
      <td><span class="font-mono text-sm">${t.id}</span></td>
      <td class="font-semibold text-cs-gold">$${t.amount.toFixed(2)}</td>
      <td>
        <div class="flex items-center gap-2">
          <i data-lucide="${methodIcon[t.method] || 'credit-card'}" class="w-4 h-4 text-gray-400"></i>
          <span class="text-sm">${t.method}</span>
        </div>
      </td>
      <td><span class="px-2.5 py-0.5 rounded-full ${statusClass[t.status]} text-xs font-medium">${statusLabel[t.status]}</span></td>
      <td class="text-gray-400 text-sm">${t.date}</td>
      <td>
        <button onclick="viewTopupDetail('${t.txId}')" class="p-2 text-gray-400 hover:text-cs-blue transition-all">
          <i data-lucide="eye" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  `).join('');

  lucide.createIcons();
}

/* ---- Filter Topups ---- */
function filterTopups() {
  const search = (document.getElementById('topupSearch')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('topupFilterStatus')?.value || '';
  const rows = document.querySelectorAll('#topupTableBody tr');

  rows.forEach(row => {
    const matchesSearch = row.dataset.search.includes(search);
    const matchesStatus = !statusFilter || row.dataset.status === statusFilter;
    if (matchesSearch && matchesStatus) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

/* ---- View Topup Detail ---- */
function viewTopupDetail(txId) {
  const topup = topupData.find(t => t.txId === txId);
  if (!topup) return;
  alert(`Topup-Details\n\nTransaktions-ID: ${topup.txId}\nNutzer: ${topup.name} (${topup.id})\nBetrag: $${topup.amount.toFixed(2)}\nMethode: ${topup.method}\nStatus: ${statusLabel[topup.status]}\nDatum: ${topup.date}`);
}

/* ---- Add Manual Topup ---- */
function addManualTopup() {
  const userId = document.getElementById('topupUserId').value.trim();
  const amount = document.getElementById('topupAmount').value.trim();
  const methodSelect = document.getElementById('topupMethod');
  const statusSelect = document.getElementById('topupStatus');
  const success = document.getElementById('topupSuccess');
  const error = document.getElementById('topupError');
  const errorText = document.getElementById('topupErrorText');

  if (!userId || !amount) {
    error.classList.remove('hidden');
    error.classList.add('flex');
    errorText.textContent = 'Bitte fülle alle Felder aus.';
    success.classList.add('hidden');
    lucide.createIcons();
    return;
  }

  if (parseFloat(amount) <= 0) {
    error.classList.remove('hidden');
    error.classList.add('flex');
    errorText.textContent = 'Betrag muss größer als 0 sein.';
    success.classList.add('hidden');
    lucide.createIcons();
    return;
  }

  error.classList.add('hidden');
  error.classList.remove('flex');
  success.classList.remove('hidden');
  success.classList.add('flex');

  // Add to table
  const tbody = document.getElementById('topupTableBody');
  if (tbody) {
    const methodText = methodSelect.options[methodSelect.selectedIndex].text;
    const statusVal = statusSelect.value;
    const txId = 'TX-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(topupData.length + 1).padStart(3, '0');
    const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });

    const newRow = document.createElement('tr');
    newRow.dataset.search = userId.toLowerCase();
    newRow.dataset.status = statusVal;
    newRow.innerHTML = `
      <td><span class="font-mono text-xs text-gray-400">${txId}</span></td>
      <td>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cs-gold to-cs-blue p-0.5">
            <div class="w-full h-full rounded-full bg-cs-dark flex items-center justify-center text-xs font-bold text-cs-gold">
              ${userId.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <span class="font-semibold">${userId}</span>
        </div>
      </td>
      <td><span class="font-mono text-sm">${userId}</span></td>
      <td class="font-semibold text-cs-gold">$${parseFloat(amount).toFixed(2)}</td>
      <td>
        <div class="flex items-center gap-2">
          <i data-lucide="${methodIcon[methodText] || 'credit-card'}" class="w-4 h-4 text-gray-400"></i>
          <span class="text-sm">${methodText}</span>
        </div>
      </td>
      <td><span class="px-2.5 py-0.5 rounded-full ${statusClass[statusVal]} text-xs font-medium">${statusLabel[statusVal]}</span></td>
      <td class="text-gray-400 text-sm">${today}</td>
      <td>
        <button onclick="viewTopupDetail('${txId}')" class="p-2 text-gray-400 hover:text-cs-blue transition-all">
          <i data-lucide="eye" class="w-4 h-4"></i>
        </button>
      </td>
    `;
    tbody.insertBefore(newRow, tbody.firstChild);
  }

  // Clear inputs
  document.getElementById('topupUserId').value = '';
  document.getElementById('topupAmount').value = '';

  lucide.createIcons();

  setTimeout(() => {
    success.classList.add('hidden');
    success.classList.remove('flex');
  }, 4000);
}

/* ---- User Data ---- */
const userData = [
  { name: 'John Doe', id: 'CS-001234', email: 'john.doe@email.com', tier: 'Gold', balance: 1280.00, status: 'active', joined: '15. Jan. 2024' },
  { name: 'Sarah Chen', id: 'CS-001235', email: 'sarah.chen@email.com', tier: 'Gold', balance: 845.50, status: 'active', joined: '20. Jan. 2024' },
  { name: 'Mike Ross', id: 'CS-001236', email: 'mike.ross@email.com', tier: 'Silber', balance: 320.00, status: 'active', joined: '22. Jan. 2024' },
  { name: 'Alex Kim', id: 'CS-001237', email: 'alex.kim@email.com', tier: 'Gold', balance: 950.00, status: 'active', joined: '25. Jan. 2024' },
  { name: 'Emma Lee', id: 'CS-001238', email: 'emma.lee@email.com', tier: 'Bronze', balance: 75.00, status: 'pending', joined: '01. Feb. 2024' },
  { name: 'David Wang', id: 'CS-001239', email: 'david.wang@email.com', tier: 'Silber', balance: 480.00, status: 'active', joined: '05. Feb. 2024' },
  { name: 'Lisa Martinez', id: 'CS-001240', email: 'lisa.m@email.com', tier: 'Gold', balance: 620.00, status: 'active', joined: '10. Feb. 2024' },
  { name: 'Tom Wilson', id: 'CS-001241', email: 'tom.wilson@email.com', tier: 'Bronze', balance: 50.00, status: 'inactive', joined: '15. Feb. 2024' },
  { name: 'Anna Brown', id: 'CS-001242', email: 'anna.brown@email.com', tier: 'Silber', balance: 285.00, status: 'active', joined: '20. Feb. 2024' },
  { name: 'Kevin Davis', id: 'CS-001243', email: 'kevin.davis@email.com', tier: 'Gold', balance: 1100.00, status: 'active', joined: '01. Mar. 2024' },
];

const userStatusClass = {
  active: 'status-active',
  pending: 'status-pending',
  inactive: 'status-inactive'
};

const tierColor = {
  Gold: 'text-cs-gold',
  Silber: 'text-cs-blue',
  Bronze: 'text-gray-400'
};

/* ---- Populate User Table ---- */
function populateUserTable() {
  const tbody = document.getElementById('userTableBody');
  if (!tbody) return;

  tbody.innerHTML = userData.map(u => `
    <tr data-search="${u.name.toLowerCase()} ${u.id.toLowerCase()} ${u.email.toLowerCase()}">
      <td>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cs-gold to-cs-blue p-0.5">
            <div class="w-full h-full rounded-full bg-cs-dark flex items-center justify-center text-xs font-bold text-cs-gold">
              ${u.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <span class="font-semibold">${u.name}</span>
        </div>
      </td>
      <td><span class="font-mono text-sm">${u.id}</span></td>
      <td class="text-gray-400 text-sm">${u.email}</td>
      <td><span class="${tierColor[u.tier] || 'text-gray-400'} text-sm font-semibold">${u.tier}</span></td>
      <td class="font-semibold">$${u.balance.toFixed(2)}</td>
      <td><span class="px-2.5 py-0.5 rounded-full ${userStatusClass[u.status]} text-xs font-medium capitalize">${u.status}</span></td>
      <td class="text-gray-400 text-sm">${u.joined}</td>
    </tr>
  `).join('');
}

/* ---- Filter Users ---- */
function filterUsers() {
  const search = (document.getElementById('userSearch')?.value || '').toLowerCase();
  const rows = document.querySelectorAll('#userTableBody tr');

  rows.forEach(row => {
    if (row.dataset.search.includes(search)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}