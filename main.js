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
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--surface-color, #fff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          box-shadow: 0 2px 8px var(--shadow-color, rgba(0,0,0,0.05));
          transition: all 0.2s;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .toggle-btn:hover {
          transform: translateY(-2px);
          background: var(--input-bg);
        }
      </style>
      <div class="toggle-btn" role="button" aria-label="Toggle theme">
        <span class="icon">☀️</span>
      </div>
    `;
    this.shadowRoot.querySelector('.toggle-btn').addEventListener('click', () => this.toggleTheme());
  }
}

class SiteNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav>
        <div class="nav-container">
          <a href="#" class="logo">LUCKY IT</a>
          <div class="nav-links">
            <a href="#service">서비스</a>
            <a href="#insights">인사이트</a>
            <a href="#contact">제휴문의</a>
            <theme-toggle></theme-toggle>
          </div>
        </div>
      </nav>
    `;
  }
}

class SiteHero extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="hero">
        <h1>당신의 행운과 비즈니스를<br>연결하는 스마트 솔루션</h1>
        <p>LUCKY IT는 고도화된 번호 생성 서비스와 전문가의 IT 인사이트를 통해 사용자에게 즐거움과 가치를 동시에 제공합니다.</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <a href="#service" class="generate-btn" style="text-decoration: none; width: auto;">서비스 시작하기</a>
          <a href="#insights" class="submit-btn" style="text-decoration: none; width: auto; background: var(--surface-color); color: var(--text-color); border: 1px solid var(--shadow-color);">인사이트 읽기</a>
        </div>
      </section>
    `;
  }
}

class LottoMachine extends HTMLElement {
  constructor() {
    super();
    this.numbers = [];
    this.isGenerating = false;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="card">
        <h2 class="section-title" style="font-size: 1.8rem; margin-bottom: 1.5rem;">행운의 번호 추첨</h2>
        <div class="ball-container" id="ball-container"></div>
        <button class="generate-btn" id="generate-btn">지금 번호 생성</button>
      </div>
    `;
    this.querySelector('#generate-btn').addEventListener('click', () => this.generateNumbers());
  }

  getBallClass(num) {
    if (num <= 10) return 'n1';
    if (num <= 20) return 'n11';
    if (num <= 30) return 'n21';
    if (num <= 40) return 'n31';
    return 'n41';
  }

  async generateNumbers() {
    if (this.isGenerating) return;
    this.isGenerating = true;
    const btn = this.querySelector('#generate-btn');
    const container = this.querySelector('#ball-container');
    btn.disabled = true;
    btn.textContent = '추첨 중...';
    container.innerHTML = '';
    const newNumbers = new Set();
    while (newNumbers.size < 6) newNumbers.add(Math.floor(Math.random() * 45) + 1);
    this.numbers = Array.from(newNumbers).sort((a, b) => a - b);
    for (let i = 0; i < this.numbers.length; i++) {
      const num = this.numbers[i];
      const ball = document.createElement('div');
      ball.className = `ball ${this.getBallClass(num)}`;
      ball.textContent = num;
      ball.style.animationDelay = `${i * 0.1}s`;
      container.appendChild(ball);
      await new Promise(r => setTimeout(r, 150));
    }
    btn.disabled = false;
    btn.textContent = '번호 다시 생성';
    this.isGenerating = false;
  }
}

class InsightSection extends HTMLElement {
  constructor() {
    super();
    this.posts = [
      { category: '수익화', title: '애드센스 승인을 위한 3가지 필수 전략', excerpt: '단순한 복사 붙여넣기가 아닌, 자신만의 경험과 지식을 담은 독창적인 콘텐츠가 승인의 지름길입니다.', date: '2026.04.15' },
      { category: '비즈니스', title: '사용자 중심의 서비스 설계가 가져오는 변화', excerpt: '사용자의 흐름을 방해하지 않으면서도 가시성이 높은 위치는 어디일까요? 데이터로 증명된 전략을 공개합니다.', date: '2026.04.12' },
      { category: 'IT 트렌드', title: '2026년 주목해야 할 웹 기술 스택', excerpt: '느린 로딩 속도와 복잡한 내비게이션은 사용자를 떠나게 만듭니다. 최신 기술로 사용자 경험을 극대화하세요.', date: '2026.04.10' }
    ];
  }

  connectedCallback() {
    this.innerHTML = `
      <div style="width: 100%; max-width: 1100px;">
        <h2 class="section-title">전문가 인사이트</h2>
        <div class="blog-grid">
          ${this.posts.map(post => `
            <div class="card blog-card">
              <span class="blog-category">${post.category}</span>
              <h3 class="blog-title">${post.title}</h3>
              <p class="blog-excerpt">${post.excerpt}</p>
              <span class="blog-date">${post.date}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

class ContactForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card">
        <h2 style="font-size: 1.8rem; margin-bottom: 1.5rem;">제휴 및 서비스 문의</h2>
        <form action="https://formspree.io/f/mwvaqjrr" method="POST">
          <div class="form-group"><label>성함</label><input type="text" name="name" placeholder="홍길동" required></div>
          <div class="form-group"><label>이메일</label><input type="email" name="_replyto" placeholder="email@example.com" required></div>
          <div class="form-group"><label>문의내용</label><textarea name="message" placeholder="문의 내용을 입력해주세요." required></textarea></div>
          <button type="submit" class="submit-btn">제휴 문의 전송</button>
        </form>
      </div>
    `;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <div class="footer-container">
          <span class="footer-logo">LUCKY IT</span>
          <div class="footer-links">
            <a href="#service">서비스</a>
            <a href="#insights">인사이트</a>
            <a href="#contact">제휴문의</a>
            <a href="#">개인정보처리방침</a>
          </div>
          <p class="copyright">&copy; 2026 LUCKY IT. All rights reserved. Designed for Excellence.</p>
        </div>
      </footer>
    `;
  }
}

customElements.define('theme-toggle', ThemeToggle);
customElements.define('site-nav', SiteNav);
customElements.define('site-hero', SiteHero);
customElements.define('lotto-machine', LottoMachine);
customElements.define('insight-section', InsightSection);
customElements.define('contact-form', ContactForm);
customElements.define('site-footer', SiteFooter);
