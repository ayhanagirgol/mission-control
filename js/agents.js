// agents.js - Agent role templates & rendering (multi-role + skill support)
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
  // Support comma-separated roles — return first match emoji
  if (!role) return '🤖';
  const first = role.split(',')[0].trim();
  const r = AgentRoles.find(a => a.role === first);
  return r ? r.emoji : '🤖';
}

function getAllRoleEmojis(role) {
  if (!role) return '🤖';
  return role.split(',').map(r => {
    const match = AgentRoles.find(a => a.role === r.trim());
    return match ? match.emoji : '';
  }).filter(Boolean).join(' ') || '🤖';
}

function formatRoles(role) {
  if (!role) return 'Unassigned';
  return role.split(',').map(r => r.trim()).join(' · ');
}

function getAgentTaskCount(agentId) {
  return Store.getTasks().filter(t => t.agentId === agentId && t.status !== 'done').length;
}

function getAgentSkillNames(agent) {
  if (!agent.skills || !agent.skills.length) return [];
  return agent.skills.map(sid => {
    const s = SkillCatalog.find(sk => sk.id === sid);
    return s ? s : null;
  }).filter(Boolean);
}

function renderAgents() {
  const agents = Store.getAgents();
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="page-actions">
      <button class="btn btn-primary" onclick="showAddAgentModal()">+ New Agent</button>
    </div>
    <div class="card-grid">
      ${agents.map(a => {
        const skills = getAgentSkillNames(a);
        return `
        <div class="card agent-card" onclick="showAgentDetail('${a.id}')">
          <div class="agent-emoji">${getAllRoleEmojis(a.role)}</div>
          <h3>${a.name}</h3>
          <p class="text-muted" style="font-size:.8rem">${formatRoles(a.role)}</p>
          ${skills.length ? `<div class="agent-skills">${skills.slice(0,4).map(s => `<span class="skill-tag" title="${s.name}">${s.emoji}</span>`).join('')}${skills.length > 4 ? `<span class="skill-tag-more">+${skills.length-4}</span>` : ''}</div>` : ''}
          <div class="agent-meta">
            ${UI.statusBadge(a.status)}
            <span class="task-count">${getAgentTaskCount(a.id)} tasks</span>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function renderRoleCheckboxes(selectedRoles) {
  const selected = selectedRoles ? selectedRoles.split(',').map(r => r.trim()) : [];
  return `<div class="role-checkbox-grid">${AgentRoles.map(r => `
    <label class="role-checkbox ${selected.includes(r.role) ? 'checked' : ''}">
      <input type="checkbox" value="${r.role}" ${selected.includes(r.role) ? 'checked' : ''} onchange="this.parentElement.classList.toggle('checked', this.checked)">
      <span>${r.emoji} ${r.role}</span>
    </label>
  `).join('')}</div>`;
}

function renderSkillCheckboxes(selectedSkills) {
  const selected = selectedSkills || [];
  return `<div class="skill-checkbox-grid">${SkillCatalog.map(s => `
    <label class="skill-checkbox ${selected.includes(s.id) ? 'checked' : ''}">
      <input type="checkbox" value="${s.id}" ${selected.includes(s.id) ? 'checked' : ''} onchange="this.parentElement.classList.toggle('checked', this.checked)">
      <span>${s.emoji} ${s.name}</span>
    </label>
  `).join('')}</div>`;
}

function getCheckedValues(containerId) {
  return [...document.querySelectorAll(`#${containerId} input[type=checkbox]:checked`)].map(cb => cb.value);
}

function showAddAgentModal() {
  UI.modal('Add New Agent', `
    <div class="form-group"><label>Name</label><input type="text" id="agent-name" class="input" placeholder="Agent name"></div>
    <div class="form-group"><label>Roles <span style="color:var(--text-muted);font-weight:normal">(select multiple)</span></label><div id="role-checkboxes">${renderRoleCheckboxes('')}</div></div>
    <div class="form-group"><label>Skills <span style="color:var(--text-muted);font-weight:normal">(select multiple)</span></label><div id="skill-checkboxes">${renderSkillCheckboxes([])}</div></div>
    <div class="form-group"><label>Status</label><select id="agent-status" class="input"><option value="idle">Idle</option><option value="active">Active</option><option value="busy">Busy</option></select></div>
  `, [{ id: 'save', label: 'Create Agent', class: 'btn-primary', handler: () => {
    const name = document.getElementById('agent-name').value.trim();
    const roles = getCheckedValues('role-checkboxes');
    const skills = getCheckedValues('skill-checkboxes');
    const status = document.getElementById('agent-status').value;
    if (!name) { UI.toast('Name is required', 'error'); return; }
    if (!roles.length) { UI.toast('Select at least one role', 'error'); return; }
    const role = roles.join(', ');
    Store.addAgent({ name, role, skills, status });
    Store.addActivity(`New agent created: ${name} (${roles.length} roles, ${skills.length} skills)`, getRoleEmoji(role));
    UI.closeModal();
    UI.toast('Agent created!', 'success');
    renderAgents();
  }}]);
}

function showAgentDetail(id) {
  const a = Store.getAgent(id);
  if (!a) return;
  const tasks = Store.getTasks().filter(t => t.agentId === id);
  const skills = getAgentSkillNames(a);
  UI.modal(`${getAllRoleEmojis(a.role)} ${a.name}`, `
    <p><strong>Roles:</strong> ${formatRoles(a.role)}</p>
    <p><strong>Skills:</strong> ${skills.length ? skills.map(s => `<span class="skill-tag-detail">${s.emoji} ${s.name}</span>`).join(' ') : '<span class="text-muted">None assigned</span>'}</p>
    <p><strong>Status:</strong> ${UI.statusBadge(a.status)}</p>
    <p><strong>Created:</strong> ${UI.formatDate(a.createdAt)}</p>
    <h4 style="margin-top:1rem">Assigned Tasks (${tasks.length})</h4>
    ${tasks.length ? `<ul class="task-list-mini">${tasks.map(t => `<li><span class="priority-dot" style="background:${UI.priorityColor(t.priority)}"></span> ${t.title} <span class="text-muted">[${t.status}]</span></li>`).join('')}</ul>` : '<p class="text-muted">No tasks assigned</p>'}
    <hr style="border-color:var(--border);margin:1rem 0">
    <h4>Edit Roles</h4>
    <div id="role-checkboxes">${renderRoleCheckboxes(a.role)}</div>
    <h4 style="margin-top:1rem">Edit Skills</h4>
    <div id="skill-checkboxes">${renderSkillCheckboxes(a.skills || [])}</div>
    <div class="form-group" style="margin-top:1rem">
      <label>Status</label>
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
      const roles = getCheckedValues('role-checkboxes');
      const skills = getCheckedValues('skill-checkboxes');
      if (!roles.length) { UI.toast('Select at least one role', 'error'); return; }
      Store.updateAgent(id, { role: roles.join(', '), skills, status: document.getElementById('agent-status-edit').value });
      UI.closeModal(); UI.toast('Agent updated', 'success'); renderAgents();
    }}
  ]);
}
