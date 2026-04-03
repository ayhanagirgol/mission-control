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
  
  // Auto refresh live stats every 30 seconds
  Store.fetchLiveStats().then(() => {
    if(Router.currentPage === 'dashboard') renderDashboard();
    if(Router.currentPage === 'agents') renderAgents();
  });
  setInterval(() => {
    Store.fetchLiveStats().then(() => {
      if(Router.currentPage === 'dashboard') renderDashboard();
      if(Router.currentPage === 'agents') renderAgents();
    });
  }, 30000);
});

// Dashboard page
function renderDashboard() {
  const tasks = Store.getTasks();
  const sessionStats = Store.sessionStats || { total: Store.getAgents().length, active: 0, idle: Store.getAgents().length, failed: 0, done: 0 };
  const cronStats = Store.cronStats || { total: 0, enabled: 0, failed: 0, ok: 0 };
  const recentActivities = Store.cronHistory && Store.cronHistory.length > 0 ? Store.cronHistory : [];

  const activeTasks = tasks.filter(t => t.status === 'in-progress').length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const pendingTasks = tasks.filter(t => t.status === 'backlog' || t.status === 'review').length;

  const maxAgents = Math.max(sessionStats.total, 1);

  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">🤖</div><div class="stat-info"><span class="stat-value">${sessionStats.total}</span><span class="stat-label">Total Agents</span></div></div>
      <div class="stat-card"><div class="stat-icon">🔄</div><div class="stat-info"><span class="stat-value">${sessionStats.active}</span><span class="stat-label">Active Agents</span></div></div>
      <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-info"><span class="stat-value">${cronStats.ok}</span><span class="stat-label">Crons OK</span></div></div>
      <div class="stat-card"><div class="stat-icon" style="color:${cronStats.failed > 0 ? '#ef4444' : 'inherit'}">❌</div><div class="stat-info"><span class="stat-value" style="color:${cronStats.failed > 0 ? '#ef4444' : 'inherit'}">${cronStats.failed}</span><span class="stat-label">Crons Failed</span></div></div>
    </div>
    <div class="stats-grid" style="margin-top:0.5rem">
      <div class="stat-card"><div class="stat-icon">⏱️</div><div class="stat-info"><span class="stat-value">${cronStats.enabled}/${cronStats.total}</span><span class="stat-label">Crons Enabled</span></div></div>
      <div class="stat-card"><div class="stat-icon">🪙</div><div class="stat-info"><span class="stat-value">${(Store.totalTokens || 0) > 1000000 ? ((Store.totalTokens/1000000).toFixed(1) + 'M') : ((Store.totalTokens || 0) > 1000 ? ((Store.totalTokens/1000).toFixed(0) + 'K') : (Store.totalTokens || 0))}</span><span class="stat-label">Total Tokens</span></div></div>
      <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-info"><span class="stat-value">$${(Store.totalCost || 0).toFixed(2)}</span><span class="stat-label">Est. Cost</span></div></div>
      <div class="stat-card"><div class="stat-icon">${sessionStats.done > 0 ? '🟢' : '⚪'}</div><div class="stat-info"><span class="stat-value">${sessionStats.done}</span><span class="stat-label">Done Sessions</span></div></div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Agent Status</h3>
        <div class="bar-chart">
          <div class="bar-row"><span class="bar-label">Idle</span><div class="bar-track"><div class="bar-fill" style="width:${(sessionStats.idle/maxAgents)*100}%;background:#6b7280"></div></div><span class="bar-value">${sessionStats.idle}</span></div>
          <div class="bar-row"><span class="bar-label">Active</span><div class="bar-track"><div class="bar-fill" style="width:${(sessionStats.active/maxAgents)*100}%;background:#22c55e"></div></div><span class="bar-value">${sessionStats.active}</span></div>
          <div class="bar-row"><span class="bar-label">Failed</span><div class="bar-track"><div class="bar-fill" style="width:${(sessionStats.failed/maxAgents)*100}%;background:#ef4444"></div></div><span class="bar-value">${sessionStats.failed}</span></div>
          <div class="bar-row"><span class="bar-label">Done</span><div class="bar-track"><div class="bar-fill" style="width:${(sessionStats.done/maxAgents)*100}%;background:#3b82f6"></div></div><span class="bar-value">${sessionStats.done}</span></div>
        </div>
      </div>

      <div class="card">
        <h3>Recent Cron Activity</h3>
        <div class="activity-list">
          ${recentActivities.length > 0 ? recentActivities.map(a => `
            <div class="activity-item" style="${a.status === 'failed' ? 'border-left: 3px solid #ef4444; padding-left: 8px;' : 'border-left: 3px solid #22c55e; padding-left: 8px;'}">
              <span class="activity-icon">${a.icon}</span>
              <div class="activity-content">
                <span>${a.text}</span>
                ${a.status === 'failed' ? '<span style="background:#ef4444; color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem; margin-left:6px; font-weight:bold;">FAILED</span>' : ''}
                ${a.consecutiveErrors > 1 ? '<span style="background:#f59e0b; color:white; padding:2px 6px; border-radius:4px; font-size:0.7rem; margin-left:4px;">' + a.consecutiveErrors + 'x</span>' : ''}
                <span class="text-muted text-sm" style="display:block; margin-top:2px;">${UI.timeAgo(a.time)}${a.durationMs ? ' · ' + (a.durationMs > 60000 ? Math.round(a.durationMs/60000) + 'm' : Math.round(a.durationMs/1000) + 's') : ''}</span>
              </div>
            </div>
          `).join('') : '<p class="text-muted">No recent cron activity — check gateway connection</p>'}
        </div>
      </div>
      <div class="card">
        <h3>Live Gateway Data</h3>
        <p class="text-sm text-muted" style="margin-top:1rem">Sessions: ${sessionStats.active} active / ${sessionStats.total} total</p>
        <p class="text-sm text-muted">Crons: ${cronStats.enabled} enabled / ${cronStats.total} total</p>
        <p class="text-sm text-muted">Tasks: ${activeTasks} active / ${doneTasks} done / ${pendingTasks} pending</p>
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
        <h3>🔌 Gateway API Config</h3>
        <div class="form-group">
          <label>Gateway URL</label>
          <input type="text" id="setting-gateway-url" class="input" value="${Store.getGatewayUrl()}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>Auth Token</label>
          <input type="password" id="setting-gateway-token" class="input" value="${Store.getGatewayToken()}" placeholder="Bearer token">
        </div>
        <button class="btn btn-primary" onclick="saveGatewaySettings()" style="margin-top:1rem">Save Config</button>
      </div>
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


function saveGatewaySettings() {
  const url = document.getElementById('setting-gateway-url').value.trim();
  const token = document.getElementById('setting-gateway-token').value.trim();
  Store.setGatewayConfig(url, token);
  UI.toast('Gateway settings saved!', 'success');
  Store.fetchLiveStats().then(() => {
    UI.toast('Live stats refreshed!', 'info');
  });
}
