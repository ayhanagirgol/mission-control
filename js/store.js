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
  getAgents() { const d = this.data; return (d && d.agents) || []; },
  addAgent(agent) { const d = this.data; agent.id = crypto.randomUUID(); agent.createdAt = new Date().toISOString(); d.agents.push(agent); this._write(d); return agent; },
  updateAgent(id, updates) { const d = this.data; const i = d.agents.findIndex(a => a.id === id); if (i > -1) { Object.assign(d.agents[i], updates); this._write(d); } },
  deleteAgent(id) { const d = this.data; d.agents = d.agents.filter(a => a.id !== id); this._write(d); },
  getAgent(id) { return this.data.agents.find(a => a.id === id); },

  // Projects
  getProjects() { const d = this.data; return (d && d.projects) || []; },
  addProject(p) { const d = this.data; p.id = crypto.randomUUID(); p.createdAt = new Date().toISOString(); d.projects.push(p); this._write(d); return p; },
  updateProject(id, updates) { const d = this.data; const i = d.projects.findIndex(p => p.id === id); if (i > -1) { Object.assign(d.projects[i], updates); this._write(d); } },
  deleteProject(id) { const d = this.data; d.projects = d.projects.filter(p => p.id !== id); this._write(d); },

  // Tasks
  getTasks(projectId) { const d = this.data; const tasks = (d && d.tasks) || []; return tasks.filter(t => !projectId || t.projectId === projectId); },
  addTask(t) { const d = this.data; t.id = crypto.randomUUID(); t.createdAt = new Date().toISOString(); d.tasks.push(t); this._write(d); return t; },
  updateTask(id, updates) { const d = this.data; const i = d.tasks.findIndex(t => t.id === id); if (i > -1) { Object.assign(d.tasks[i], updates); this._write(d); } },
  deleteTask(id) { const d = this.data; d.tasks = d.tasks.filter(t => t.id !== id); this._write(d); },
  getTask(id) { return this.data.tasks.find(t => t.id === id); },

  // Activities
  getActivities() { const d = this.data; const acts = (d && d.activities) || []; return acts.slice().sort((a, b) => new Date(b.time) - new Date(a.time)); },
  addActivity(text, icon = '📋') { const d = this.data; d.activities.unshift({ id: crypto.randomUUID(), text, icon, time: new Date().toISOString() }); if (d.activities.length > 50) d.activities = d.activities.slice(0, 50); this._write(d); },

  // Milestones
  getMilestones() { const d = this.data; return (d && d.milestones) || []; },
  addMilestone(m) { const d = this.data; if (!d.milestones) d.milestones = []; m.id = crypto.randomUUID(); d.milestones.push(m); this._write(d); return m; },
  deleteMilestone(id) { const d = this.data; d.milestones = (d.milestones || []).filter(m => m.id !== id); this._write(d); },

  // Export / Import / Clear
  exportData() { return JSON.stringify(this.data, null, 2); },
  importData(json) { try { const d = JSON.parse(json); this._write(d); return true; } catch { return false; } },
  clearData() { localStorage.removeItem(this._key); this.init(); },

  _defaultData() {
    const agentIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];
    const projIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];
    const now = new Date().toISOString();
    return {
      agents: [
        { id: agentIds[0], name: 'Main', role: 'Project Manager', status: 'active', createdAt: now },
        { id: agentIds[1], name: 'Bulut', role: 'Cloud Architect', status: 'active', createdAt: now },
        { id: agentIds[2], name: 'Demir', role: 'Backend Developer', status: 'idle', createdAt: now },
        { id: agentIds[3], name: 'Türkkep', role: 'Business Analyst', status: 'active', createdAt: now },
        { id: agentIds[4], name: 'GPT Agent', role: 'AI/ML Engineer', status: 'idle', createdAt: now },
        { id: agentIds[5], name: 'Coder', role: 'Frontend Developer', status: 'busy', createdAt: now },
      ],
      projects: [
        { id: projIds[0], name: 'Mission Control Dashboard', description: 'OpenClaw agent & proje yönetim dashboard — ClawHub ürünü', deadline: '2026-04-15', priority: 'high', createdAt: now },
        { id: projIds[1], name: 'FirmaCom Mobil Uygulama', description: 'KOBİ belge yönetimi + hizmet talebi platformu', deadline: '2026-06-01', priority: 'high', createdAt: now },
        { id: projIds[2], name: 'Finhouse.ai Yeniden Konumlandırma', description: 'Finans AI çözüm merkezi olarak yeniden yapılandırma + blog + sosyal medya', deadline: '2026-05-01', priority: 'medium', createdAt: now },
        { id: projIds[3], name: 'Beyttürk E-Para Danışmanlık', description: 'TCMB e-para lisans çalışması — ikinci aşama', deadline: '2026-07-01', priority: 'high', createdAt: now },
        { id: projIds[4], name: 'Türkkep Otomasyon', description: 'Mail sınıflandırma, sabah brifing, qradar otomasyon', deadline: '2026-04-30', priority: 'medium', createdAt: now },
      ],
      tasks: [
        // Mission Control
        { id: crypto.randomUUID(), projectId: projIds[0], title: 'Dashboard deploy & CI/CD', description: 'GitHub → Netlify auto deploy', status: 'done', priority: 'high', agentId: agentIds[0], deadline: '2026-03-29', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[0], title: 'Parola koruması', description: 'Login ekranı + client-side auth', status: 'done', priority: 'high', agentId: agentIds[0], deadline: '2026-03-29', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[0], title: 'ClawHub skill olarak paketle', description: 'Skill formatında yayınla', status: 'backlog', priority: 'medium', agentId: null, deadline: '2026-04-15', createdAt: now },
        // FirmaCom
        { id: crypto.randomUUID(), projectId: projIds[1], title: 'UI/UX tasarım', description: 'Mobil uygulama wireframe ve tasarım', status: 'backlog', priority: 'high', agentId: agentIds[5], deadline: '2026-04-20', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[1], title: 'Lead gen komisyon modeli', description: 'Banka/POS/operatör entegrasyon planı', status: 'backlog', priority: 'medium', agentId: agentIds[3], deadline: '2026-05-01', createdAt: now },
        // Finhouse.ai
        { id: crypto.randomUUID(), projectId: projIds[2], title: 'Partner isimlerini kaldır', description: 'Yetkinlik bazlı yapıya geçiş', status: 'done', priority: 'medium', agentId: agentIds[0], deadline: '2026-03-23', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[2], title: 'Günlük AI+Fintech raporu', description: 'Otomatik sosyal medya paylaşım sistemi', status: 'in-progress', priority: 'high', agentId: agentIds[0], deadline: '2026-04-10', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[2], title: 'Blog içerik planı', description: 'Haftalık AI + finans yazıları', status: 'in-progress', priority: 'medium', agentId: agentIds[4], deadline: '2026-04-15', createdAt: now },
        // Beyttürk
        { id: crypto.randomUUID(), projectId: projIds[3], title: 'TCMB yönetmelik analizi', description: 'E-para lisans ikinci aşama dokümanları', status: 'in-progress', priority: 'critical', agentId: agentIds[3], deadline: '2026-04-30', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[3], title: 'Haftalık sektör raporu', description: 'Fintech + ödeme sistemleri takibi', status: 'in-progress', priority: 'high', agentId: agentIds[0], deadline: '2026-04-01', createdAt: now },
        // Türkkep
        { id: crypto.randomUUID(), projectId: projIds[4], title: 'QRadar mail sınıflandırma', description: 'Saatlik cron ile otomatik sınıflandırma', status: 'done', priority: 'high', agentId: agentIds[3], deadline: '2026-03-19', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[4], title: 'Sabah brifing maili', description: 'Her sabah 08:00 mail + WhatsApp özet', status: 'done', priority: 'high', agentId: agentIds[0], deadline: '2026-03-19', createdAt: now },
        { id: crypto.randomUUID(), projectId: projIds[4], title: 'Platin kategorisi otomasyonu', description: 'platinbilisi.com.tr mailleri otomatik etiketleme', status: 'review', priority: 'medium', agentId: agentIds[3], deadline: '2026-04-01', createdAt: now },
      ],
      activities: [
        { id: crypto.randomUUID(), text: 'Mission Control Dashboard deploy edildi 🚀', icon: '🚀', time: now },
        { id: crypto.randomUUID(), text: 'Rapid Prototype pipeline danışmanlık paketine eklendi', icon: '💡', time: new Date(Date.now() - 1800000).toISOString() },
        { id: crypto.randomUUID(), text: 'NotebookLM skill incelendi — kurulum bekliyor', icon: '📚', time: new Date(Date.now() - 3600000).toISOString() },
        { id: crypto.randomUUID(), text: 'Finhouse.ai partner isimleri kaldırıldı', icon: '✅', time: new Date(Date.now() - 86400000*6).toISOString() },
        { id: crypto.randomUUID(), text: 'Türkkep mail otomasyonu aktif', icon: '📧', time: new Date(Date.now() - 86400000*10).toISOString() },
        { id: crypto.randomUUID(), text: 'Beyttürk haftalık rapor sistemi kuruldu', icon: '📊', time: new Date(Date.now() - 86400000*7).toISOString() },
      ],
      milestones: [
        { id: crypto.randomUUID(), title: 'Mission Control v1.0 Launch', date: '2026-03-29', projectId: projIds[0] },
        { id: crypto.randomUUID(), title: 'FirmaCom MVP', date: '2026-05-15', projectId: projIds[1] },
        { id: crypto.randomUUID(), title: 'Finhouse.ai Blog Launch', date: '2026-04-10', projectId: projIds[2] },
        { id: crypto.randomUUID(), title: 'TCMB Lisans Başvurusu', date: '2026-06-15', projectId: projIds[3] },
        { id: crypto.randomUUID(), title: 'Türkkep Tam Otomasyon', date: '2026-04-30', projectId: projIds[4] },
      ]
    };
  }
};
