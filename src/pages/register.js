// ==========================================
// ReUz — Register Page (API-backed)
// ==========================================

import { store } from '../store.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';
import { REGIONS } from '../logic/shipping.js';
import { getLanguage } from '../i18n.js';

export function renderRegisterPage() {
  const lang = getLanguage();

  const createLabel = lang === 'uz' ? 'Hisobingizni yarating va savdoni boshlang.' : 'Create your account and start trading.';
  const fullNameLabel = lang === 'uz' ? 'To\'liq ism' : 'Full Name';
  const namePlaceholder = lang === 'uz' ? 'Ismingiz' : 'Your name';
  const emailLabel = lang === 'uz' ? 'Elektron pochta' : 'Email';
  const passwordLabel = lang === 'uz' ? 'Parol' : 'Password';
  const passwordPlaceholder = lang === 'uz' ? 'Kamida 6 belgi' : 'Min 6 characters';
  const regionLabel = lang === 'uz' ? 'Viloyat' : 'Region';
  const selectRegionLabel = lang === 'uz' ? 'Viloyatni tanlang...' : 'Select region...';
  const createAccountLabel = lang === 'uz' ? 'Hisob yaratish' : 'Create Account';
  const hasAccountLabel = lang === 'uz' ? 'Hisobingiz bormi?' : 'Already have an account?';
  const loginLabel = lang === 'uz' ? 'Kirish' : 'Log in';

  return `
    <div class="page">
      <div class="container-narrow">
        <div style="max-width: 420px; margin: 0 auto;">
          <div class="text-center" style="margin-bottom: var(--space-2xl);">
            <div style="font-size: var(--font-size-4xl); font-weight: 900; margin-bottom: var(--space-sm);">
              <span style="color: #fff;">RE</span><span style="color: #00FF9D; text-shadow: 0 0 30px rgba(0,255,157,0.5);">UZ</span>
            </div>
            <p class="text-secondary text-md">${createLabel}</p>
          </div>

          <div class="card" style="padding: var(--space-xl);">
            <form id="register-form" class="flex flex-col gap-md">
              <div class="form-group">
                <label class="form-label">${fullNameLabel}</label>
                <input type="text" class="form-input" id="reg-name" placeholder="${namePlaceholder}" required />
              </div>
              <div class="form-group">
                <label class="form-label">${emailLabel}</label>
                <input type="email" class="form-input" id="reg-email" placeholder="you@example.com" required />
              </div>
              <div class="form-group">
                <label class="form-label">${passwordLabel}</label>
                <input type="password" class="form-input" id="reg-password" placeholder="${passwordPlaceholder}" required minlength="6" />
              </div>
              <div class="form-group">
                <label class="form-label">${regionLabel}</label>
                <select class="form-input" id="reg-region" required>
                  <option value="">${selectRegionLabel}</option>
                  ${REGIONS.map(r => `<option value="${r}">${r}</option>`).join('')}
                </select>
              </div>
              <button type="submit" class="btn btn-primary btn-lg btn-full" id="register-submit-btn"
                      data-default="${createAccountLabel}" data-loading="${lang === 'uz' ? 'Yaratilmoqda...' : 'Creating account...'}" style="margin-top: var(--space-sm);">
                ${createAccountLabel}
              </button>
            </form>
          </div>

          <p class="text-center text-sm text-muted" style="margin-top: var(--space-lg);">
            ${hasAccountLabel} <a href="#/login">${loginLabel}</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

export function attachRegisterEvents() {
  const form = document.getElementById('register-form');
  if (!form) return;
  const lang = getLanguage();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const region = document.getElementById('reg-region').value;

    const submitBtn = document.getElementById('register-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = submitBtn.dataset.loading || 'Creating account...';
    }

    try {
      const data = await store.register(name, email, password, region);
      showToast(lang === 'uz' ? `ReUzga xush kelibsiz, ${name}!` : `Welcome to ReUz, ${name}!`, 'success');
      navigateTo('/');
    } catch (err) {
      showToast(err.message || (lang === 'uz' ? 'Ro\'yxatdan o\'tish xatosi' : 'Registration failed'), 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.default || 'Create Account';
      }
    }
  });
}
