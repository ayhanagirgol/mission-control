// skills.js - Skill catalog
const SkillCatalog = [
  { id: 'coding-agent', name: 'Coding Agent', emoji: '💻', description: 'Delegate coding tasks to AI coding agents' },
  { id: 'github', name: 'GitHub', emoji: '🐙', description: 'GitHub operations: issues, PRs, CI, code review' },
  { id: 'xurl', name: 'X (Twitter)', emoji: '🐦', description: 'Post tweets, reply, search, manage X API' },
  { id: 'weather', name: 'Weather', emoji: '🌤️', description: 'Current weather and forecasts via wttr.in' },
  { id: 'gog', name: 'Google Workspace', emoji: '📧', description: 'Gmail, Calendar, Drive, Contacts, Sheets, Docs' },
  { id: 'himalaya', name: 'Himalaya Mail', emoji: '📬', description: 'CLI email management via IMAP/SMTP' },
  { id: 'summarize', name: 'Summarize', emoji: '📄', description: 'Summarize URLs, PDFs, images, audio, YouTube' },
  { id: 'notion', name: 'Notion', emoji: '📓', description: 'Notion API for pages, databases, and blocks' },
  { id: 'excel', name: 'Excel / XLSX', emoji: '📊', description: 'Create, inspect, and edit Excel workbooks' },
  { id: 'word', name: 'Word / DOCX', emoji: '📝', description: 'Create, inspect, and edit Word documents' },
  { id: 'powerpoint', name: 'PowerPoint', emoji: '📽️', description: 'Create and edit PowerPoint presentations' },
  { id: 'data-analysis', name: 'Data Analysis', emoji: '📈', description: 'Query databases, generate reports, visualize data' },
  { id: 'linkedin', name: 'LinkedIn', emoji: '💼', description: 'LinkedIn automation via browser relay' },
  { id: 'meeting-to-action', name: 'Meeting to Action', emoji: '🎯', description: 'Convert meeting notes into action items' },
  { id: 'video-frames', name: 'Video Frames', emoji: '🎬', description: 'Extract frames or clips from videos' },
  { id: 'whisper', name: 'Whisper STT', emoji: '🎙️', description: 'Speech-to-text with OpenAI Whisper' },
  { id: 'tts', name: 'Text to Speech', emoji: '🔊', description: 'Convert text to speech audio' },
];

function renderSkills() {
  const main = document.getElementById('main-content');
  const agents = Store.getAgents();
  main.innerHTML = `
    <div class="page-actions">
      <input type="text" id="skill-search" class="input" placeholder="Search skills..." oninput="filterSkills()" style="max-width:300px">
    </div>
    <div class="card-grid" id="skills-grid">
      ${SkillCatalog.map(s => {
        const usedBy = agents.filter(a => a.skills && a.skills.includes(s.id));
        return `
        <div class="card skill-card" data-name="${s.name.toLowerCase()}">
          <div class="skill-emoji">${s.emoji}</div>
          <h3>${s.name}</h3>
          <p class="text-muted">${s.description}</p>
          <div class="skill-meta">
            <span class="badge" style="background:#22c55e">Active</span>
            <span class="text-muted">${usedBy.length} agent${usedBy.length !== 1 ? 's' : ''}</span>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function filterSkills() {
  const q = document.getElementById('skill-search').value.toLowerCase();
  document.querySelectorAll('.skill-card').forEach(card => {
    card.style.display = card.dataset.name.includes(q) ? '' : 'none';
  });
}
