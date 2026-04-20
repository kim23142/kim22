class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initTheme();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(savedTheme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateIcon(theme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  updateIcon(theme) {
    const icon = this.shadowRoot.querySelector('.icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          cursor: pointer;
          user-select: none;
        }
        .toggle-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--surface-color, #fff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 4px 10px var(--shadow-color, rgba(0,0,0,0.1));
          transition: transform 0.2s, background-color 0.3s;
        }
        .toggle-btn:hover {
          transform: scale(1.1);
        }
      </style>
      <div class="toggle-btn" role="button" aria-label="Toggle theme">
        <span class="icon">☀️</span>
      </div>
    `;
    this.shadowRoot.querySelector('.toggle-btn').addEventListener('click', () => this.toggleTheme());
  }
}

customElements.define('theme-toggle', ThemeToggle);
