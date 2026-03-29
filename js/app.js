// app.js - Main application entry
document.addEventListener('DOMContentLoaded', () => {
  Store.init();

  // Register routes
  Router.register('dashboard', renderDashboard);
  Router.register('agents', renderAgents);
  Router.register('skills', renderSkills);
  Router.register('projects', renderProjects);
  Router.register('timeline', renderTimeline);
  Router.register('settings', renderSettings);

  // Sidebar nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => Router.navigate(item.dataset.page));
  });

  // Mobile sidebar toggle
  document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
  });

  // Close sidebar on mobile nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => document.querySelector('.sidebar').classList.remove('open'));
  });

  // Search
  document.getElementById('global-search')?.addEventListener('input', e => {
    // Simple global search - could be expanded
    const q = e.target.value.trim().toLowerCase();
    if (!q) return;
  });

  Router.init();
});

// Dashboard page
function renderDashboard() {
  const agents = Store.getAgents();
  const tasks = Store.getTasks();
  const activities = Store.getActivities();

  const active = tasks.filter(t => t.status === 'in-progress').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const pending = tasks.filter(t => t.status === 'backlog' || t.status === 'review').length;

  const statusCounts = { idle: 0, active: 0, busy: 0 };
  agents.forEach(a => statusCounts[a.status] = (statusCounts[a.status] || 0) + 1);
  const maxAgents = Math.max(...Object.values(statusCounts), 1);

  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">🤖</div><div class="stat-info"><span class="stat-value">${agents.length}</span><span class="stat-label">Total Agents</span></div></div>
      <div class="stat-card"><div class="stat-icon">🔄</div><div class="stat-info"><span class="stat-value">${active}</span><span class="stat-label">Active Tasks</span></div></div>
      <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-info"><span class="stat-value">${done}</span><span class="stat-label">Completed</span></div></div>
      <div class="stat-card"><div class="stat-icon">⏳</div><div class="stat-info"><span class="stat-value">${pending}</span><span class="stat-label">Pending</span></div></div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Agent Status</h3>
        <div class="bar-chart">
          <div class="bar-row"><span class="bar-label">Idle</span><div class="bar-track"><div class="bar-fill" style="width:${(statusCounts.idle/maxAgents)*100}%;background:#6b7280"></div></div><span class="bar-value">${statusCounts.idle}</span></div>
          <div class="bar-row"><span class="bar-label">Active</span><div class="bar-track"><div class="bar-fill" style="width:${(statusCounts.active/maxAgents)*100}%;background:#22c55e"></div></div><span class="bar-value">${statusCounts.active}</span></div>
          <div class="bar-row"><span class="bar-label">Busy</span><div class="bar-track"><div class="bar-fill" style="width:${(statusCounts.busy/maxAgents)*100}%;background:#f97316"></div></div><span class="bar-value">${statusCounts.busy}</span></div>
        </div>
      </div>

      <div class="card">
        <h3>Recent Activity</h3>
        <div class="activity-list">
          ${activities.slice(0, 8).map(a => `
            <div class="activity-item">
              <span class="activity-icon">${a.icon}</span>
              <div class="activity-content">
                <span>${a.text}</span>
                <span class="text-muted text-sm">${UI.timeAgo(a.time)}</span>
              </div>
            </div>
          `).join('') || '<p class="text-muted">No activity yet</p>'}
        </div>
      </div>
    </div>

    <div style="text-align:center;margin-top:1.5rem">
      <button class="btn btn-primary" onclick="Router.navigate('projects')">+ Quick Add Task</button>
    </div>
  `;
}

// Settings page
function renderSettings() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="settings-grid">
      <div class="card">
        <h3>📤 Export Data</h3>
        <p class="text-muted">Download all your data as JSON</p>
        <button class="btn btn-primary" onclick="exportData()">Export JSON</button>
      </div>
      <div class="card">
        <h3>📥 Import Data</h3>
        <p class="text-muted">Import data from a JSON file</p>
        <input type="file" id="import-file" accept=".json" style="display:none" onchange="importData(event)">
        <button class="btn btn-secondary" onclick="document.getElementById('import-file').click()">Import JSON</button>
      </div>
      <div class="card">
        <h3>🗑️ Clear Data</h3>
        <p class="text-muted">Reset all data to defaults</p>
        <button class="btn btn-danger" onclick="clearAllData()">Clear All Data</button>
      </div>
      <div class="card">
        <h3>ℹ️ About</h3>
        <p class="text-muted">OpenClaw Mission Control Dashboard v1.0</p>
        <p class="text-muted text-sm">Built with vanilla JS, Tailwind CSS, and ❤️</p>
      </div>
    </div>
  `;
}

function exportData() {
  const blob = new Blob([Store.exportData()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mission-control-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  UI.toast('Data exported!', 'success');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    if (Store.importData(e.target.result)) {
      UI.toast('Data imported!', 'success');
      Router.navigate(Router.currentPage);
    } else {
      UI.toast('Invalid JSON file', 'error');
    }
  };
  reader.readAsText(file);
}

async function clearAllData() {
  if (await UI.confirm('Clear All Data', 'This will reset everything to demo data. Are you sure?')) {
    Store.clearData();
    UI.toast('Data cleared!', 'success');
    Router.navigate('dashboard');
  }
}
