// projects.js - Kanban board with drag & drop
const COLUMNS = [
  { id: 'backlog', label: 'Backlog', icon: '📋' },
  { id: 'in-progress', label: 'In Progress', icon: '🔄' },
  { id: 'review', label: 'Review', icon: '👀' },
  { id: 'done', label: 'Done', icon: '✅' },
];

let currentProjectId = null;
let draggedTaskId = null;

function renderProjects() {
  const projects = Store.getProjects();
  const main = document.getElementById('main-content');

  if (!currentProjectId && projects.length) currentProjectId = projects[0].id;

  main.innerHTML = `
    <div class="page-actions">
      <div class="project-tabs">
        ${projects.map(p => `<button class="tab ${p.id === currentProjectId ? 'active' : ''}" onclick="switchProject('${p.id}')">${p.name}</button>`).join('')}
        <button class="btn btn-primary btn-sm" onclick="showAddProjectModal()">+ Project</button>
      </div>
      <button class="btn btn-primary" onclick="showAddTaskModal()">+ Task</button>
    </div>
    ${currentProjectId ? renderKanban() : '<p class="text-muted" style="text-align:center;margin-top:3rem">Create a project to get started</p>'}
  `;
  initDragDrop();
}

function renderKanban() {
  const tasks = Store.getTasks(currentProjectId);
  const agents = Store.getAgents();
  return `<div class="kanban">${COLUMNS.map(col => {
    const colTasks = tasks.filter(t => t.status === col.id);
    return `
      <div class="kanban-col" data-status="${col.id}">
        <div class="kanban-col-header">
          <span>${col.icon} ${col.label}</span>
          <span class="count">${colTasks.length}</span>
        </div>
        <div class="kanban-col-body" data-status="${col.id}">
          ${colTasks.map(t => {
            const agent = agents.find(a => a.id === t.agentId);
            return `
            <div class="kanban-card" draggable="true" data-task-id="${t.id}">
              <div class="kanban-card-priority" style="background:${UI.priorityColor(t.priority)}"></div>
              <h4>${t.title}</h4>
              <p class="text-muted text-sm">${t.description || ''}</p>
              <div class="kanban-card-meta">
                ${agent ? `<span>${getRoleEmoji(agent.role)} ${agent.name}</span>` : '<span class="text-muted">Unassigned</span>'}
                ${t.recurring ? '<span style="color:#8b5cf6">🔁 Recurring</span>' : ''}
                ${t.deadline ? `<span class="text-muted">📅 ${UI.formatDate(t.deadline)}</span>` : ''}
              </div>
              <div class="kanban-card-actions">
                <button class="btn-icon" onclick="event.stopPropagation();showEditTaskModal('${t.id}')">✏️</button>
                <button class="btn-icon" onclick="event.stopPropagation();deleteTask('${t.id}')">🗑️</button>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  }).join('')}</div>`;
}

function initDragDrop() {
  document.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('dragstart', e => {
      draggedTaskId = card.dataset.taskId;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => { card.classList.remove('dragging'); draggedTaskId = null; });
  });
  document.querySelectorAll('.kanban-col-body').forEach(col => {
    col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('drag-over'); });
    col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
    col.addEventListener('drop', e => {
      e.preventDefault();
      col.classList.remove('drag-over');
      if (draggedTaskId) {
        const newStatus = col.dataset.status;
        const task = Store.getTask(draggedTaskId);
        if (task && task.status !== newStatus) {
          Store.updateTask(draggedTaskId, { status: newStatus });
          const agent = task.agentId ? Store.getAgent(task.agentId) : null;
          Store.addActivity(`Task "${task.title}" moved to ${newStatus}${agent ? ` by ${agent.name}` : ''}`, '📋');
          renderProjects();
        }
      }
    });
  });
}

function switchProject(id) { currentProjectId = id; renderProjects(); }

function showAddProjectModal() {
  UI.modal('New Project', `
    <div class="form-group"><label>Name</label><input type="text" id="proj-name" class="input" placeholder="Project name"></div>
    <div class="form-group"><label>Description</label><textarea id="proj-desc" class="input" rows="2" placeholder="Description"></textarea></div>
    <div class="form-group"><label>Deadline</label><input type="date" id="proj-deadline" class="input"></div>
    <div class="form-group"><label>Priority</label><select id="proj-priority" class="input"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
  `, [{ id: 'save', label: 'Create', class: 'btn-primary', handler: () => {
    const name = document.getElementById('proj-name').value.trim();
    if (!name) { UI.toast('Name is required', 'error'); return; }
    const p = Store.addProject({ name, description: document.getElementById('proj-desc').value, deadline: document.getElementById('proj-deadline').value, priority: document.getElementById('proj-priority').value });
    Store.addActivity(`New project created: ${name}`, '📁');
    currentProjectId = p.id;
    UI.closeModal(); UI.toast('Project created!', 'success'); renderProjects();
  }}]);
}

function showAddTaskModal() {
  if (!currentProjectId) { UI.toast('Select a project first', 'error'); return; }
  const agents = Store.getAgents();
  const agentOpts = `<option value="">Unassigned</option>` + agents.map(a => `<option value="${a.id}">${getRoleEmoji(a.role)} ${a.name}</option>`).join('');
  UI.modal('New Task', `
    <div class="form-group"><label>Title</label><input type="text" id="task-title" class="input" placeholder="Task title"></div>
    <div class="form-group"><label>Description</label><textarea id="task-desc" class="input" rows="2" placeholder="Description"></textarea></div>
    <div class="form-group"><label>Assign Agent</label><select id="task-agent" class="input">${agentOpts}</select></div>
    <div class="form-group"><label>Priority</label><select id="task-priority" class="input"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
    <div class="form-group"><label>Deadline <span style="color:var(--text-muted);font-weight:normal">(optional)</span></label><input type="date" id="task-deadline" class="input"></div>
    <div class="form-group"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" id="task-recurring" style="width:auto"> Recurring / Sürekli görev</label></div>
    <div class="form-group"><label>Status</label><select id="task-status" class="input">${COLUMNS.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}</select></div>
  `, [{ id: 'save', label: 'Create', class: 'btn-primary', handler: () => {
    const title = document.getElementById('task-title').value.trim();
    if (!title) { UI.toast('Title required', 'error'); return; }
    Store.addTask({ title, description: document.getElementById('task-desc').value, agentId: document.getElementById('task-agent').value || null, priority: document.getElementById('task-priority').value, deadline: document.getElementById('task-deadline').value || null, recurring: document.getElementById('task-recurring').checked, status: document.getElementById('task-status').value, projectId: currentProjectId });
    Store.addActivity(`New task: ${title}`, '📋');
    UI.closeModal(); UI.toast('Task created!', 'success'); renderProjects();
  }}]);
}

function showEditTaskModal(id) {
  const t = Store.getTask(id);
  if (!t) return;
  const agents = Store.getAgents();
  const agentOpts = `<option value="">Unassigned</option>` + agents.map(a => `<option value="${a.id}" ${a.id === t.agentId ? 'selected' : ''}>${getRoleEmoji(a.role)} ${a.name}</option>`).join('');
  UI.modal('Edit Task', `
    <div class="form-group"><label>Title</label><input type="text" id="task-title" class="input" value="${t.title}"></div>
    <div class="form-group"><label>Description</label><textarea id="task-desc" class="input" rows="2">${t.description || ''}</textarea></div>
    <div class="form-group"><label>Assign Agent</label><select id="task-agent" class="input">${agentOpts}</select></div>
    <div class="form-group"><label>Priority</label><select id="task-priority" class="input">${['low','medium','high','critical'].map(p => `<option value="${p}" ${p===t.priority?'selected':''}>${p.charAt(0).toUpperCase()+p.slice(1)}</option>`).join('')}</select></div>
    <div class="form-group"><label>Deadline <span style="color:var(--text-muted);font-weight:normal">(optional)</span></label><input type="date" id="task-deadline" class="input" value="${t.deadline || ''}"></div>
    <div class="form-group"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" id="task-recurring" style="width:auto" ${t.recurring ? 'checked' : ''}> Recurring / Sürekli görev</label></div>
  `, [{ id: 'save', label: 'Save', class: 'btn-primary', handler: () => {
    Store.updateTask(id, { title: document.getElementById('task-title').value, description: document.getElementById('task-desc').value, agentId: document.getElementById('task-agent').value || null, priority: document.getElementById('task-priority').value, deadline: document.getElementById('task-deadline').value || null, recurring: document.getElementById('task-recurring').checked });
    UI.closeModal(); UI.toast('Task updated', 'success'); renderProjects();
  }}]);
}

async function deleteTask(id) {
  const t = Store.getTask(id);
  if (t && await UI.confirm('Delete Task', `Delete "${t.title}"?`)) {
    Store.deleteTask(id); Store.addActivity(`Task deleted: ${t.title}`, '🗑️'); UI.toast('Task deleted', 'success'); renderProjects();
  }
}
