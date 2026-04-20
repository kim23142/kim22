class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() { this.render(); this.initTheme(); }
  initTheme() {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(savedTheme);
  }
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateIcon(theme);
  }
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }
  updateIcon(theme) {
    const icon = this.shadowRoot.querySelector('.icon');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; cursor: pointer; user-select: none; }
        .toggle-btn { width: 40px; height: 40px; border-radius: 12px; background: var(--surface-color, #fff); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.05)); transition: all 0.2s; border: 1px solid rgba(0,0,0,0.05); }
        .toggle-btn:hover { transform: translateY(-2px); background: var(--input-bg); }
      </style>
      <div class="toggle-btn" role="button"><span class="icon">☀️</span></div>
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
            <a href="#match">매칭 서비스</a>
            <a href="#service">행운번호</a>
            <a href="#insights">인사이트</a>
            <a href="#comments">사용자 후기</a>
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
        <h1>운명적인 인연과<br>행운을 한곳에서</h1>
        <p>LUCKY IT & MATCH는 당신의 라이프스타일에 딱 맞는 인연을 찾아주고, 매일의 행운까지 선사하는 프리미엄 서비스입니다.</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a href="#match" class="match-btn" style="text-decoration: none; width: auto; padding: 1.2rem 2.5rem;">인연 찾기 시작</a>
          <a href="#service" class="generate-btn" style="text-decoration: none; width: auto; padding: 1.2rem 2.5rem; background: var(--surface-color); color: var(--text-color); border: 1px solid var(--shadow-color); box-shadow: none;">오늘의 행운번호</a>
        </div>
      </section>
    `;
  }
}

class MatchApp extends HTMLElement {
  constructor() {
    super();
    this.users = [
      { name: '이지은', age: 26, location: '서울 강남구', mbti: 'ENFP', tags: ['테니스', '맛집탐방', '강아지'], bio: '함께 맛있는 거 먹으러 다니는 거 좋아해요! 밝고 긍정적인 에너지를 가진 분을 찾습니다. 😊', icon: '🎨' },
      { name: '김민준', age: 29, location: '경기 성남시', mbti: 'INTJ', tags: ['독서', '러닝', '재테크'], bio: '조용히 산책하거나 깊은 대화를 나누는 걸 선호합니다. 자기계발에 진심인 분과 성장하고 싶어요.', icon: '💻' },
      { name: '박서연', age: 27, location: '서울 마포구', mbti: 'ISFP', tags: ['전시회', '카페투어', '필라테스'], bio: '주말엔 예쁜 카페에서 여유 부리는 걸 좋아해요. 예술적인 감수성이 잘 맞는 분이었으면 좋겠네요. ✨', icon: '📸' }
    ];
  }
  connectedCallback() {
    this.innerHTML = `
      <div style="width: 100%; max-width: 1100px;">
        <h2 class="section-title">당신을 기다리는 행운의 인연</h2>
        <div class="match-container">
          ${this.users.map(user => `
            <div class="match-card">
              <div class="profile-img-placeholder">${user.icon}</div>
              <div class="profile-content">
                <div class="profile-name">${user.name} <span style="font-size: 1.1rem; opacity: 0.5; font-weight: 500;">${user.age}</span></div>
                <div class="profile-info">${user.location} • ${user.mbti}</div>
                <div class="tag-container">${user.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}</div>
                <p class="profile-bio">${user.bio}</p>
                <button class="match-btn" onclick="alert('${user.name}님에게 관심 표현을 보냈습니다!')">관심 있음</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

class LottoMachine extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card" style="max-width: 800px; margin: 0 auto;">
        <h2 style="font-size: 2rem; margin-bottom: 2rem; font-weight: 800;">오늘의 행운번호 추첨</h2>
        <div class="ball-container" id="ball-container"></div>
        <button class="generate-btn" id="generate-btn" style="width: auto; min-width: 200px;">번호 생성하기</button>
      </div>
    `;
    this.querySelector('#generate-btn').addEventListener('click', () => this.generateNumbers());
  }
  async generateNumbers() {
    const btn = this.querySelector('#generate-btn');
    const container = this.querySelector('#ball-container');
    btn.disabled = true; btn.textContent = '추첨 중...'; container.innerHTML = '';
    const nums = new Set();
    while (nums.size < 6) nums.add(Math.floor(Math.random() * 45) + 1);
    const sortedNums = Array.from(nums).sort((a, b) => a - b);
    for (let i = 0; i < sortedNums.length; i++) {
      const ball = document.createElement('div');
      ball.className = `ball ${this.getBallClass(sortedNums[i])}`;
      ball.textContent = sortedNums[i];
      ball.style.animationDelay = `${i * 0.1}s`;
      container.appendChild(ball);
      await new Promise(r => setTimeout(r, 150));
    }
    btn.disabled = false; btn.textContent = '다시 생성';
  }
  getBallClass(n) {
    if (n <= 10) return 'n1'; if (n <= 20) return 'n11'; if (n <= 30) return 'n21'; if (n <= 40) return 'n31'; return 'n41';
  }
}

class InsightSection extends HTMLElement {
  constructor() {
    super();
    this.posts = [
      { category: '매칭 팁', title: '첫인상을 결정짓는 프로필 작성 가이드', excerpt: '자신만의 매력을 가장 솔직하고 매력적으로 보여주는 방법을 알아봅니다.', date: '2026.04.18' },
      { category: '수익화', title: '애드센스 승인을 위한 고품질 콘텐츠 전략', excerpt: '독창적인 경험을 담은 글쓰기가 어떻게 수익으로 연결되는지 분석합니다.', date: '2026.04.15' },
      { category: '연애 인사이트', title: '건강한 관계를 위한 대화의 기술', excerpt: '서로의 다름을 존중하며 깊은 신뢰를 쌓아가는 대화법을 소개합니다.', date: '2026.04.12' }
    ];
  }
  connectedCallback() {
    this.innerHTML = `
      <div style="width: 100%; max-width: 1100px;">
        <h2 class="section-title">LUCKY IT 인사이트</h2>
        <div class="blog-grid">
          ${this.posts.map(p => `
            <div class="card" style="text-align: left; padding: 2rem;">
              <span class="blog-category" style="display: inline-block; padding: 0.3rem 0.8rem; background: rgba(var(--primary-color), 0.1); color: var(--primary-color); border-radius: 2rem; font-size: 0.8rem; font-weight: 700; margin-bottom: 1rem;">${p.category}</span>
              <h3 style="font-size: 1.3rem; margin-bottom: 1rem; line-height: 1.4;">${p.title}</h3>
              <p style="font-size: 0.95rem; opacity: 0.7; margin-bottom: 1.5rem;">${p.excerpt}</p>
              <span style="font-size: 0.85rem; opacity: 0.5;">${p.date}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

class CommentSection extends HTMLElement {
  constructor() {
    super();
    this.comments = JSON.parse(localStorage.getItem('luck_comments')) || [
      { name: '행운가득', text: '여기서 뽑은 번호로 4등 당첨됐어요! 대박 기운 받아갑니다.', date: '2026.04.19' },
      { name: '매칭기다림', text: '프로필 레이아웃이 너무 깔끔하고 좋네요. 좋은 인연 만났으면 좋겠습니다.', date: '2026.04.20' }
    ];
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
      <div class="comment-container">
        <h2 class="section-title">사용자 후기 및 댓글</h2>
        <div class="card" style="margin-bottom: 3rem; text-align: left;">
          <form id="comment-form">
            <div class="input-group"><label>닉네임</label><input type="text" id="c-name" placeholder="닉네임을 입력하세요" required></div>
            <div class="input-group"><label>댓글 내용</label><textarea id="c-text" placeholder="따뜻한 댓글을 남겨주세요" required style="min-height: 100px;"></textarea></div>
            <button type="submit" class="submit-btn" style="width: auto; min-width: 150px;">댓글 등록</button>
          </form>
        </div>
        <div class="comment-list" id="comment-list">
          ${this.comments.map(c => this.createCommentHTML(c)).join('')}
        </div>
      </div>
    `;
    this.querySelector('#comment-form').addEventListener('submit', (e) => this.addComment(e));
  }
  createCommentHTML(c) {
    return `
      <div class="comment-item">
        <div class="comment-avatar">${c.name.charAt(0)}</div>
        <div class="comment-content">
          <div class="comment-header"><span class="comment-author">${c.name}</span><span class="comment-date">${c.date}</span></div>
          <p class="comment-text">${c.text}</p>
        </div>
      </div>
    `;
  }
  addComment(e) {
    e.preventDefault();
    const name = this.querySelector('#c-name').value;
    const text = this.querySelector('#c-text').value;
    const date = new Date().toLocaleDateString('ko-KR').slice(0, -1);
    const newComment = { name, text, date };
    this.comments.unshift(newComment);
    localStorage.setItem('luck_comments', JSON.stringify(this.comments));
    this.render();
  }
}

class ContactForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="card" style="max-width: 800px; margin: 0 auto;">
        <h2 style="font-size: 2rem; margin-bottom: 2rem; font-weight: 800;">제휴 및 서비스 문의</h2>
        <form action="https://formspree.io/f/mwvaqjrr" method="POST">
          <div class="input-group"><label>성함</label><input type="text" name="name" placeholder="홍길동" required></div>
          <div class="input-group"><label>이메일</label><input type="email" name="_replyto" placeholder="email@example.com" required></div>
          <div class="input-group"><label>문의내용</label><textarea name="message" placeholder="문의 내용을 상세히 입력해주세요." required style="min-height: 150px;"></textarea></div>
          <button type="submit" class="generate-btn">제휴 문의 보내기</button>
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
          <span class="footer-logo">LUCKY IT & MATCH</span>
          <div class="footer-links">
            <a href="#match">매칭 서비스</a><a href="#service">행운번호</a><a href="#insights">인사이트</a><a href="#comments">사용자 후기</a><a href="#contact">제휴문의</a>
          </div>
          <p class="copyright">&copy; 2026 LUCKY IT & MATCH. All rights reserved.</p>
        </div>
      </footer>
    `;
  }
}

customElements.define('theme-toggle', ThemeToggle);
customElements.define('site-nav', SiteNav);
customElements.define('site-hero', SiteHero);
customElements.define('match-app', MatchApp);
customElements.define('lotto-machine', LottoMachine);
customElements.define('insight-section', InsightSection);
customElements.define('comment-section', CommentSection);
customElements.define('contact-form', ContactForm);
customElements.define('site-footer', SiteFooter);
