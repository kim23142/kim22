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
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--surface-color, #fff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.1));
          transition: transform 0.2s, background-color 0.3s;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .toggle-btn:hover {
          transform: translateY(-2px);
        }
      </style>
      <div class="toggle-btn" role="button" aria-label="Toggle theme">
        <span class="icon">☀️</span>
      </div>
    `;
    this.shadowRoot.querySelector('.toggle-btn').addEventListener('click', () => this.toggleTheme());
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
        <h1>행운의 로또 번호</h1>
        <div class="ball-container" id="ball-container">
          <!-- Balls will be injected here -->
        </div>
        <button class="generate-btn" id="generate-btn">번호 생성하기</button>
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
    while (newNumbers.size < 6) {
      newNumbers.add(Math.floor(Math.random() * 45) + 1);
    }
    
    this.numbers = Array.from(newNumbers).sort((a, b) => a - b);
    
    for (let i = 0; i < this.numbers.length; i++) {
      const num = this.numbers[i];
      const ball = document.createElement('div');
      ball.className = `ball ${this.getBallClass(num)}`;
      ball.textContent = num;
      ball.style.animationDelay = `${i * 0.1}s`;
      container.appendChild(ball);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    btn.disabled = false;
    btn.textContent = '다시 뽑기';
    this.isGenerating = false;
  }
}

class ContactForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card">
        <h2>제휴 및 서비스 문의</h2>
        <form action="https://formspree.io/f/mwvaqjrr" method="POST">
          <div class="form-group">
            <label for="name">성함</label>
            <input type="text" id="name" name="name" placeholder="홍길동" required>
          </div>
          <div class="form-group">
            <label for="email">이메일 주소</label>
            <input type="email" id="email" name="_replyto" placeholder="example@domain.com" required>
          </div>
          <div class="form-group">
            <label for="message">문의 내용</label>
            <textarea id="message" name="message" placeholder="제휴 관련 문의 내용을 입력해주세요." required></textarea>
          </div>
          <input type="hidden" name="_subject" value="새로운 제휴 문의가 접수되었습니다.">
          <button type="submit" class="submit-btn">문의 전송하기</button>
        </form>
      </div>
    `;
  }
}

class BlogSection extends HTMLElement {
  constructor() {
    super();
    this.posts = [
      {
        category: '애드센스',
        title: '구글 애드센스 승인 노하우: 콘텐츠의 독창성이 핵심입니다',
        excerpt: '단순한 복사 붙여넣기가 아닌, 자신만의 경험과 지식을 담은 독창적인 콘텐츠가 승인의 지름길입니다. 애드센스 공식 블로그의 권장 사항을 알아보세요.',
        date: '2026.04.15'
      },
      {
        category: '수익화',
        title: '수익을 높이는 최적의 광고 배치 전략',
        excerpt: '사용자의 흐름을 방해하지 않으면서도 가시성이 높은 위치는 어디일까요? 데이터로 증명된 최적의 광고 위치를 공개합니다.',
        date: '2026.04.12'
      },
      {
        category: 'IT/UX',
        title: '사용자 경험(UX)이 블로그 수익에 미치는 영향',
        excerpt: '느린 로딩 속도와 복잡한 내비게이션은 사용자를 떠나게 만듭니다. 수익을 위해 사용자가 머물고 싶은 환경을 구축하는 방법을 배워보세요.',
        date: '2026.04.10'
      }
    ];
  }

  connectedCallback() {
    this.innerHTML = `
      <div style="width: 100%; max-width: 1000px; margin: 4rem 0 2rem;">
        <h2 style="text-align: left; margin-bottom: 2rem; font-size: 2rem;">IT & 수익화 인사이트</h2>
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

customElements.define('theme-toggle', ThemeToggle);
customElements.define('lotto-machine', LottoMachine);
customElements.define('contact-form', ContactForm);
customElements.define('blog-section', BlogSection);
