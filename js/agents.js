// agents.js - Agent role templates & rendering
const AgentRoles = [
  { role: 'Product Manager', emoji: '📋' },
  { role: 'Design Agent', emoji: '🎨' },
  { role: 'Frontend Developer', emoji: '🖥️' },
  { role: 'Backend Developer', emoji: '⚙️' },
  { role: 'QA Engineer', emoji: '🧪' },
  { role: 'DevOps Engineer', emoji: '🔧' },
  { role: 'Data Analyst', emoji: '📊' },
  { role: 'Security Analyst', emoji: '🔒' },
  { role: 'Technical Writer', emoji: '📝' },
  { role: 'UX Researcher', emoji: '🔍' },
  { role: 'Scrum Master', emoji: '🏃' },
  { role: 'Project Manager', emoji: '📅' },
  { role: 'Business Analyst', emoji: '💼' },
  { role: 'Marketing Agent', emoji: '📣' },
  { role: 'Sales Agent', emoji: '🤝' },
  { role: 'Customer Support Agent', emoji: '🎧' },
  { role: 'HR Agent', emoji: '👥' },
  { role: 'Legal Agent', emoji: '⚖️' },
  { role: 'Finance Agent', emoji: '💰' },
  { role: 'AI/ML Engineer', emoji: '🤖' },
  { role: 'Mobile Developer', emoji: '📱' },
  { role: 'Database Admin', emoji: '🗄️' },
  { role: 'Cloud Architect', emoji: '☁️' },
  { role: 'System Admin', emoji: '🖧' },
  { role: 'Network Engineer', emoji: '🌐' },
  { role: 'Content Creator', emoji: '✍️' },
  { role: 'SEO Specialist', emoji: '🔎' },
  { role: 'Social Media Manager', emoji: '📲' },
  { role: 'Growth Hacker', emoji: '🚀' },
  { role: 'Release Manager', emoji: '📦' },
  { role: 'Site Reliability Engineer', emoji: '🛡️' },
  { role: 'Performance Engineer', emoji: '⚡' },
];

function getRoleEmoji(role) {
  const r = AgentRoles.find(a => a.role === role);
  return r ? r.emoji : '🤖';
}

function getAgentTaskCount(agentId) {
  return Store.getTasks().filter(t => t.agentId === agentId && t.status !== 'done').length;
}

function renderAgents() {
  const agents = Store.getAgents();
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="page-actions">
      <button class="btn btn-primary" onclick="showAddAgentModal()">+ New Agent</button>
    </div>
    <div class="card-grid">
      ${agents.map(a => `
        <div class="card agent-card" onclick="showAgentDetail('${a.id}')">
          <div class="agent-emoji">${getRoleEmoji(a.role)}</div>
          <h3>${a.name}</h3>
          <p class="text-muted">${a.role}</p>
          <div class="agent-meta">
            ${UI.statusBadge(a.status)}
            <span class="task-count">${getAgentTaskCount(a.id)} tasks</span>
          </div>
        </div>
      `).join('')}
    </div>`;
}

function showAddAgentModal() {
  const options = AgentRoles.map(r => `<option value="${r.role}">${r.emoji} ${r.role}</option>`).join('');
  UI.modal('Add New Agent', `
    <div class="form-group"><label>Name</label><input type="text" id="agent-name" class="input" placeholder="Agent name"></div>
    <div class="form-group"><label>Role</label><select id="agent-role" class="input">${options}</select></div>
    <div class="form-group"><label>Status</label><select id="agent-status" class="input"><option value="idle">Idle</option><option value="active">Active</option><option value="busy">Busy</option></select></div>
  `, [{ id: 'save', label: 'Create Agent', class: 'btn-primary', handler: () => {
    const name = document.getElementById('agent-name').value.trim();
    const role = document.getElementById('agent-role').value;
    const status = document.getElementById('agent-status').value;
    if (!name) { UI.toast('Name is required', 'error'); return; }
    Store.addAgent({ name, role, status });
    Store.addActivity(`New agent created: ${name} (${role})`, getRoleEmoji(role));
    UI.closeModal();
    UI.toast('Agent created!', 'success');
    renderAgents();
  }}]);
}

function showAgentDetail(id) {
  const a = Store.getAgent(id);
  if (!a) return;
  const tasks = Store.getTasks().filter(t => t.agentId === id);
  UI.modal(`${getRoleEmoji(a.role)} ${a.name}`, `
    <p><strong>Role:</strong> ${a.role}</p>
    <p><strong>Status:</strong> ${UI.statusBadge(a.status)}</p>
    <p><strong>Created:</strong> ${UI.formatDate(a.createdAt)}</p>
    <h4 style="margin-top:1rem">Assigned Tasks (${tasks.length})</h4>
    ${tasks.length ? `<ul class="task-list-mini">${tasks.map(t => `<li><span class="priority-dot" style="background:${UI.priorityColor(t.priority)}"></span> ${t.title} <span class="text-muted">[${t.status}]</span></li>`).join('')}</ul>` : '<p class="text-muted">No tasks assigned</p>'}
    <div class="form-group" style="margin-top:1rem">
      <label>Change Status</label>
      <select id="agent-status-edit" class="input">
        <option value="idle" ${a.status==='idle'?'selected':''}>Idle</option>
        <option value="active" ${a.status==='active'?'selected':''}>Active</option>
        <option value="busy" ${a.status==='busy'?'selected':''}>Busy</option>
      </select>
    </div>
  `, [
    { id: 'delete', label: 'Delete', class: 'btn-danger', handler: async () => {
      if (await UI.confirm('Delete Agent', `Delete ${a.name}?`)) { Store.deleteAgent(id); Store.addActivity(`Agent deleted: ${a.name}`, '🗑️'); UI.toast('Agent deleted', 'success'); renderAgents(); }
    }},
    { id: 'save', label: 'Save', class: 'btn-primary', handler: () => {
      Store.updateAgent(id, { status: document.getElementById('agent-status-edit').value });
      UI.closeModal(); UI.toast('Agent updated', 'success'); renderAgents();
    }}
  ]);
}
