// timeline.js - Calendar & timeline view
let timelineView = 'month';
let timelineDate = new Date();

function renderTimeline() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="page-actions">
      <div class="view-toggle">
        <button class="tab ${timelineView==='week'?'active':''}" onclick="timelineView='week';renderTimeline()">Week</button>
        <button class="tab ${timelineView==='month'?'active':''}" onclick="timelineView='month';renderTimeline()">Month</button>
      </div>
      <div class="timeline-nav">
        <button class="btn btn-secondary btn-sm" onclick="navTimeline(-1)">◀</button>
        <span id="timeline-label" style="min-width:160px;text-align:center;font-weight:600">${getTimelineLabel()}</span>
        <button class="btn btn-secondary btn-sm" onclick="navTimeline(1)">▶</button>
        <button class="btn btn-secondary btn-sm" style="margin-left:8px" onclick="timelineDate=new Date();renderTimeline()">Today</button>
      </div>
      <button class="btn btn-primary btn-sm" onclick="showAddMilestoneModal()">+ Milestone</button>
    </div>
    <div id="timeline-body">${timelineView === 'month' ? renderMonthView() : renderWeekView()}</div>
    ${renderMilestones()}
  `;
}

function getTimelineLabel() {
  if (timelineView === 'month') return timelineDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const start = getWeekStart(timelineDate);
  const end = new Date(start); end.setDate(end.getDate() + 6);
  return `${start.toLocaleDateString('en-GB',{day:'numeric',month:'short'})} – ${end.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}`;
}

function navTimeline(dir) {
  if (timelineView === 'month') timelineDate.setMonth(timelineDate.getMonth() + dir);
  else timelineDate.setDate(timelineDate.getDate() + dir * 7);
  renderTimeline();
}

function getWeekStart(d) { const s = new Date(d); s.setDate(s.getDate() - s.getDay() + 1); s.setHours(0,0,0,0); return s; }

function renderMonthView() {
  const y = timelineDate.getFullYear(), m = timelineDate.getMonth();
  const first = new Date(y, m, 1);
  const startDay = (first.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const tasks = Store.getTasks();
  const milestones = Store.getMilestones();
  const today = new Date(); today.setHours(0,0,0,0);

  let html = '<div class="calendar"><div class="cal-header">';
  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(d => html += `<div class="cal-cell head">${d}</div>`);
  html += '</div><div class="cal-body">';

  for (let i = 0; i < startDay; i++) html += '<div class="cal-cell empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    const dateStr = date.toISOString().split('T')[0];
    const isToday = date.getTime() === today.getTime();
    const dayTasks = tasks.filter(t => t.deadline === dateStr);
    const dayMs = milestones.filter(ms => ms.date === dateStr);
    html += `<div class="cal-cell ${isToday ? 'today' : ''}">
      <span class="cal-day">${d}</span>
      ${dayMs.map(ms => `<div class="cal-event milestone">🏁 ${ms.title}</div>`).join('')}
      ${dayTasks.slice(0, 2).map(t => `<div class="cal-event" style="border-left:3px solid ${UI.priorityColor(t.priority)}">${t.title}</div>`).join('')}
      ${dayTasks.length > 2 ? `<div class="cal-event more">+${dayTasks.length - 2} more</div>` : ''}
    </div>`;
  }
  html += '</div></div>';
  return html;
}

function renderWeekView() {
  const start = getWeekStart(timelineDate);
  const tasks = Store.getTasks();
  const agents = Store.getAgents();
  const today = new Date(); today.setHours(0,0,0,0);
  let html = '<div class="week-view">';
  for (let i = 0; i < 7; i++) {
    const d = new Date(start); d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = d.getTime() === today.getTime();
    const dayTasks = tasks.filter(t => t.deadline === dateStr);
    html += `<div class="week-day ${isToday ? 'today' : ''}">
      <div class="week-day-header">${d.toLocaleDateString('en-US',{weekday:'short',day:'numeric',month:'short'})}</div>
      ${dayTasks.map(t => {
        const agent = agents.find(a => a.id === t.agentId);
        return `<div class="week-task" style="border-left:3px solid ${UI.priorityColor(t.priority)}">
          <strong>${t.title}</strong>
          ${agent ? `<span class="text-muted text-sm">${getRoleEmoji(agent.role)} ${agent.name}</span>` : ''}
        </div>`;
      }).join('') || '<p class="text-muted text-sm" style="padding:0.5rem">No tasks</p>'}
    </div>`;
  }
  html += '</div>';
  return html;
}

function renderMilestones() {
  const milestones = Store.getMilestones();
  if (!milestones.length) return '';
  const projects = Store.getProjects();
  return `<div class="milestones-section"><h3>🏁 Milestones</h3><div class="milestone-list">
    ${milestones.sort((a,b) => a.date.localeCompare(b.date)).map(m => {
      const proj = projects.find(p => p.id === m.projectId);
      return `<div class="milestone-item"><span>🏁 ${m.title}</span><span class="text-muted">${UI.formatDate(m.date)} ${proj ? `• ${proj.name}` : ''}</span><button class="btn-icon" onclick="deleteMilestone('${m.id}')">🗑️</button></div>`;
    }).join('')}
  </div></div>`;
}

function showAddMilestoneModal() {
  const projects = Store.getProjects();
  UI.modal('Add Milestone', `
    <div class="form-group"><label>Title</label><input type="text" id="ms-title" class="input" placeholder="Milestone title"></div>
    <div class="form-group"><label>Date</label><input type="date" id="ms-date" class="input"></div>
    <div class="form-group"><label>Project</label><select id="ms-project" class="input"><option value="">None</option>${projects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></div>
  `, [{ id: 'save', label: 'Create', class: 'btn-primary', handler: () => {
    const title = document.getElementById('ms-title').value.trim();
    const date = document.getElementById('ms-date').value;
    if (!title || !date) { UI.toast('Title and date required', 'error'); return; }
    Store.addMilestone({ title, date, projectId: document.getElementById('ms-project').value || null });
    Store.addActivity(`Milestone added: ${title}`, '🏁');
    UI.closeModal(); UI.toast('Milestone added!', 'success'); renderTimeline();
  }}]);
}

async function deleteMilestone(id) {
  if (await UI.confirm('Delete Milestone', 'Delete this milestone?')) {
    Store.deleteMilestone(id); UI.toast('Milestone deleted', 'success'); renderTimeline();
  }
}
