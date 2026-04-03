// ui.js - Toast, Modal, UI utilities
const UI = {
  // Toast notifications
  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'} ${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
  },

  // Modal
  modal(title, contentHTML, actions = []) {
    const overlay = document.getElementById('modal-overlay');
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="UI.closeModal()">✕</button>
        </div>
        <div class="modal-body">${contentHTML}</div>
        ${actions.length ? `<div class="modal-actions">${actions.map(a => `<button class="btn ${a.class || 'btn-secondary'}" id="modal-action-${a.id}">${a.label}</button>`).join('')}</div>` : ''}
      </div>`;
    overlay.classList.add('active');
    actions.forEach(a => {
      const btn = document.getElementById(`modal-action-${a.id}`);
      if (btn && a.handler) btn.addEventListener('click', a.handler);
    });
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
  },

  // Confirm dialog
  confirm(title, message) {
    return new Promise(resolve => {
      this.modal(title, `<p>${message}</p>`, [
        { id: 'cancel', label: 'Cancel', class: 'btn-secondary', handler: () => { this.closeModal(); resolve(false); } },
        { id: 'confirm', label: 'Confirm', class: 'btn-primary', handler: () => { this.closeModal(); resolve(true); } }
      ]);
    });
  },

  // Format date
  formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  },

  priorityColor(p) {
    return { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' }[p] || '#6b7280';
  },

  statusBadge(status) {
    const colors = { idle: '#6b7280', active: '#22c55e', busy: '#f97316' };
    return `<span class="badge" style="background:${colors[status] || '#6b7280'}">${status}</span>`;
  }
};
