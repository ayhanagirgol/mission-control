// router.js - Simple hash-based SPA router
const Router = {
  routes: {},
  currentPage: null,

  register(name, renderFn) {
    this.routes[name] = renderFn;
  },

  navigate(page) {
    window.location.hash = page;
  },

  init() {
    window.addEventListener('hashchange', () => this._resolve());
    this._resolve();
  },

  _resolve() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const page = hash.split('/')[0];
    if (this.routes[page]) {
      this.currentPage = page;
      // Update active nav
      document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.page === page);
      });
      // Update page title
      const titles = { dashboard: 'Dashboard', agents: 'Agents', skills: 'Skills', projects: 'Projects', timeline: 'Timeline', settings: 'Settings' };
      document.getElementById('page-title').textContent = titles[page] || page;
      // Render
      const main = document.getElementById('main-content');
      main.style.opacity = '0';
      setTimeout(() => {
        this.routes[page]();
        main.style.opacity = '1';
      }, 150);
    }
  }
};
