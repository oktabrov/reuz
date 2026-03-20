// ==========================================
// ReUz — Login Page (API-backed)
// ==========================================

import { store } from '../store.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';
import { getLanguage } from '../i18n.js';

const DEMO_ACCOUNTS = [
  { email: 'alice@demo.com', password: 'demo123', name: 'Alice Karimova', region: 'Tashkent' },
  { email: 'bob@demo.com', password: 'demo123', name: 'Bobur Umarov', region: 'Samarkand' },
  { email: 'carol@demo.com', password: 'demo123', name: 'Kamola Nazarova', region: 'Fergana' },
  { email: 'dima@demo.com', password: 'demo123', name: 'Dima Aliyev', region: 'Bukhara' },
  { email: 'elena@demo.com', password: 'demo123', name: 'Elena Rashidova', region: 'Namangan' }
];

export function renderLoginPage() {
  const lang = getLanguage();

  const welcomeLabel = lang === 'uz' ? 'Xush kelibsiz! Davom etish uchun tizimga kiring.' : 'Welcome back! Log in to continue.';
  const emailLabel = lang === 'uz' ? 'Elektron pochta' : 'Email';
  const passwordLabel = lang === 'uz' ? 'Parol' : 'Password';
  const loginLabel = lang === 'uz' ? 'Kirish' : 'Log In';
  const loggingInLabel = lang === 'uz' ? 'Kirilmoqda...' : 'Logging in...';
  const demoLabel = lang === 'uz' ? 'Tezkor demo kirish:' : 'Quick demo login:';
  const noAccountLabel = lang === 'uz' ? 'Hisobingiz yo\'qmi?' : 'Don\'t have an account?';
  const signUpLabel = lang === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Sign up';

  return `
    <div class="page">
      <div class="container-narrow">
        <div style="max-width: 420px; margin: 0 auto;">
          <div class="text-center" style="margin-bottom: var(--space-2xl);">
            <div style="font-size: var(--font-size-4xl); font-weight: 900; margin-bottom: var(--space-sm);">
              <span style="color: #fff;">RE</span><span style="color: #00FF9D; text-shadow: 0 0 30px rgba(0,255,157,0.5);">UZ</span>
            </div>
            <p class="text-secondary text-md">${welcomeLabel}</p>
          </div>

          <div class="card" style="padding: var(--space-xl);">
            <form id="login-form" class="flex flex-col gap-md">
              <div class="form-group">
                <label class="form-label">${emailLabel}</label>
                <input type="email" class="form-input" id="login-email" placeholder="you@example.com" required />
              </div>
              <div class="form-group">
                <label class="form-label">${passwordLabel}</label>
                <input type="password" class="form-input" id="login-password" placeholder="••••••••" required />
              </div>
              <button type="submit" class="btn btn-primary btn-lg btn-full" id="login-submit-btn"
                      data-default="${loginLabel}" data-loading="${loggingInLabel}" style="margin-top: var(--space-sm);">
                ${loginLabel}
              </button>
            </form>

            <div class="divider"></div>

            <div>
              <p class="text-sm text-muted text-center" style="margin-bottom: var(--space-md);">${demoLabel}</p>
              <div class="flex flex-col gap-xs">
                ${DEMO_ACCOUNTS.map(d => `
                  <button class="btn btn-secondary btn-sm btn-full demo-login-btn" 
                          data-email="${d.email}" data-password="${d.password}">
                    ${d.name} <span class="text-muted">— ${d.region}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <p class="text-center text-sm text-muted" style="margin-top: var(--space-lg);">
            ${noAccountLabel} <a href="#/register">${signUpLabel}</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

export function attachLoginEvents() {
  const form = document.getElementById('login-form');
  const lang = getLanguage();
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      attemptLogin(email, password, lang);
    });
  }

  document.querySelectorAll('.demo-login-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      attemptLogin(btn.dataset.email, btn.dataset.password, lang);
    });
  });
}

async function attemptLogin(email, password, lang) {
  const submitBtn = document.getElementById('login-submit-btn');
  const allBtns = document.querySelectorAll('.demo-login-btn');
  
  // Disable all buttons and show loading
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = submitBtn.dataset.loading || 'Logging in...';
  }
  allBtns.forEach(b => b.disabled = true);

  try {
    const data = await store.login(email, password);
    showToast(lang === 'uz' ? `Xush kelibsiz, ${data.user.name}!` : `Welcome back, ${data.user.name}!`, 'success');
    navigateTo('/');
  } catch (err) {
    showToast(err.message || (lang === 'uz' ? 'Noto\'g\'ri email yoki parol' : 'Invalid email or password'), 'error');
    // Re-enable buttons
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.default || 'Log In';
    }
    allBtns.forEach(b => b.disabled = false);
  }
}
