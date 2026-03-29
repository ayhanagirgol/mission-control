// store.js - LocalStorage CRUD + Demo Data
const Store = {
  _key: 'missionControl',

  _read() {
    try { return JSON.parse(localStorage.getItem(this._key)) || null; } catch { return null; }
  },

  _write(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  },

  init() {
    if (!this._read()) this._write(this._defaultData());
  },

  get data() { return this._read(); },

  // Agents
  getAgents() { return this.data.agents; },
  addAgent(agent) { const d = this.data; agent.id = crypto.randomUUID(); agent.createdAt = new Date().toISOString(); d.agents.push(agent); this._write(d); return agent; },
  updateAgent(id, updates) { const d = this.data; const i = d.agents.findIndex(a => a.id === id); if (i > -1) { Object.assign(d.agents[i], updates); this._write(d); } },
  deleteAgent(id) { const d = this.data; d.agents = d.agents.filter(a => a.id !== id); this._write(d); },
  getAgent(id) { return this.data.agents.find(a => a.id === id); },

  // Projects
  getProjects() { return this.data.projects; },
  addProject(p) { const d = this.data; p.id = crypto.randomUUID(); p.createdAt = new Date().toISOString(); d.projects.push(p); this._write(d); return p; },
  updateProject(id, updates) { const d = this.data; const i = d.projects.findIndex(p => p.id === id); if (i > -1) { Object.assign(d.projects[i], updates); this._write(d); } },
  deleteProject(id) { const d = this.data; d.projects = d.projects.filter(p => p.id !== id); this._write(d); },

  // Tasks
  getTasks(projectId) { return this.data.tasks.filter(t => !projectId || t.projectId === projectId); },
  addTask(t) { const d = this.data; t.id = crypto.randomUUID(); t.createdAt = new Date().toISOString(); d.tasks.push(t); this._write(d); return t; },
  updateTask(id, updates) { const d = this.data; const i = d.tasks.findIndex(t => t.id === id); if (i > -1) { Object.assign(d.tasks[i], updates); this._write(d); } },
  deleteTask(id) { const d = this.data; d.tasks = d.tasks.filter(t => t.id !== id); this._write(d); },
  getTask(id) { return this.data.tasks.find(t => t.id === id); },

  // Activities
  getActivities() { return this.data.activities.slice().sort((a, b) => new Date(b.time) - new Date(a.time)); },
  addActivity(text, icon = '📋') { const d = this.data; d.activities.unshift({ id: crypto.randomUUID(), text, icon, time: new Date().toISOString() }); if (d.activities.length > 50) d.activities = d.activities.slice(0, 50); this._write(d); },

  // Milestones
  getMilestones() { return this.data.milestones || []; },
  addMilestone(m) { const d = this.data; if (!d.milestones) d.milestones = []; m.id = crypto.randomUUID(); d.milestones.push(m); this._write(d); return m; },
  deleteMilestone(id) { const d = this.data; d.milestones = (d.milestones || []).filter(m => m.id !== id); this._write(d); },

  // Export / Import / Clear
  exportData() { return JSON.stringify(this.data, null, 2); },
  importData(json) { try { const d = JSON.parse(json); this._write(d); return true; } catch { return false; } },
  clearData() { localStorage.removeItem(this._key); this.init(); },

  _defaultData() {
    const agentIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];
    const projIds = [crypto.randomUUID(), crypto.randomUUID()];
    const now = new Date().toISOString();
    return {
      agents: [
        { id: agentIds[0], name: 'Atlas', role: 'Frontend Developer', status: 'active', createdAt: now },
        { id: agentIds[1], name: 'Nova', role: 'Backend Developer', status: 'active', createdAt: now },
        { id: agentIds[2], name: 'Cipher', role: 'Security Analyst', status: 'idle', createdAt: now },
        { id: agentIds[3], name: 'Pixel', role: 'Design Agent', status: 'busy', createdAt: now },
      ],
      projects: [
        { id: projIds[0], name: 'Payment Gateway v2', description: 'Next-gen payment processing system', deadline: '2026-05-01', priority: 'high', createdAt: now },
        { id: projIds[1], name: 'Mobile App Redesign', description: 'Complete UX overhaul for mobile app', deadline: '2026-06-15', priority: 'medium', createdAt: now },
      ],
      tasks: [
        { id: crypto.randomUUID(), projectId: projIds[0], title: 'API endpoint design', description: 'Design RESTful API endpoints', status: 'in-progress', priority: 'high', agentId: agentIds[1], deadline: '2026-04-10', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[0], title: 'Payment UI components', description: 'Build checkout flow components', status: 'in-progress', priority: 'high', agentId: agentIds[0], deadline: '2026-04-15', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[0], title: 'Security audit', description: 'PCI DSS compliance review', status: 'backlog', priority: 'critical', agentId: agentIds[2], deadline: '2026-04-20', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[1], title: 'Wireframes', description: 'Create wireframes for all screens', status: 'done', priority: 'medium', agentId: agentIds[3], deadline: '2026-03-20', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[1], title: 'Design system update', description: 'Update colors, typography, spacing', status: 'review', priority: 'medium', agentId: agentIds[3], deadline: '2026-04-01', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[1], title: 'User testing plan', description: 'Plan usability testing sessions', status: 'backlog', priority: 'low', agentId: null, deadline: '2026-04-30', createdAt: now },
      ],
      activities: [
        { id: crypto.randomUUID(), text: 'Atlas started working on Payment UI components', icon: '🚀', time: now },
        { id: crypto.randomUUID(), text: 'Pixel completed Wireframes task', icon: '✅', time: new Date(Date.now() - 3600000).toISOString() },
        { id: crypto.randomUUID(), text: 'New project created: Payment Gateway v2', icon: '📁', time: new Date(Date.now() - 7200000).toISOString() },
        { id: crypto.randomUUID(), text: 'Cipher assigned to Security audit', icon: '🔒', time: new Date(Date.now() - 10800000).toISOString() },
      ],
      milestones: [
        { id: crypto.randomUUID(), title: 'Payment Gateway Alpha', date: '2026-04-15', projectId: projIds[0] },
        { id: crypto.randomUUID(), title: 'Mobile App Beta', date: '2026-05-30', projectId: projIds[1] },
      ]
    };
  }
};
