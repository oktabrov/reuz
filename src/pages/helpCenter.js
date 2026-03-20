// ==========================================
// ReUz — Help Center Pages
// ==========================================

import { HELP_ARTICLES, getArticleBySlug } from '../helpArticles.js';
import { getLanguage } from '../i18n.js';
import { navigateTo } from '../router.js';
import { icons } from '../icons.js';

// ── Help Center Main Page ──────────────────────────
export function renderHelpCenterPage() {
  const lang = getLanguage();
  const articles = HELP_ARTICLES;
  
  const buyingArticles = articles.filter(a => a.category === 'buying');
  const sellingArticles = articles.filter(a => a.category === 'selling');

  const title = lang === 'uz' ? 'Yordam Markazi' : 'Help Center';
  const subtitle = lang === 'uz' 
    ? 'ReUz haqida bilishingiz kerak bo\'lgan hamma narsa' 
    : 'Everything you need to know about ReUz';
  const searchPlaceholder = lang === 'uz' ? 'Maqolalarni qidirish...' : 'Search articles...';
  const buyingLabel = lang === 'uz' ? 'Sotib olish' : 'Buying';
  const sellingLabel = lang === 'uz' ? 'Sotish' : 'Selling';

  return `
    <div class="page">
      <div class="container">
        <!-- Hero -->
        <div class="help-hero animate-fadeIn">
          <div class="help-hero-icon">${icons.help}</div>
          <h1 class="help-hero-title">${title}</h1>
          <p class="help-hero-subtitle">${subtitle}</p>
          <div class="help-search-wrapper">
            ${icons.search}
            <input 
              type="text" 
              id="help-search" 
              class="help-search-input" 
              placeholder="${searchPlaceholder}" 
            />
          </div>
        </div>

        <!-- Buying Section -->
        <div class="help-section" id="help-buying-section">
          <h2 class="help-section-title">
            <span class="help-section-icon">${icons.cart}</span>
            ${buyingLabel}
          </h2>
          <div class="help-articles-grid" id="help-buying-grid">
            ${buyingArticles.map(a => renderArticleCard(a, lang)).join('')}
          </div>
        </div>

        <!-- Selling Section -->
        <div class="help-section" id="help-selling-section">
          <h2 class="help-section-title">
            <span class="help-section-icon">${icons.tag}</span>
            ${sellingLabel}
          </h2>
          <div class="help-articles-grid" id="help-selling-grid">
            ${sellingArticles.map(a => renderArticleCard(a, lang)).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderArticleCard(article, lang) {
  const data = article[lang] || article.en;
  // Find the first section with a non-null body for preview
  const previewSection = data.sections.find(s => s.body);
  const previewText = previewSection 
    ? previewSection.body.replace(/<[^>]*>/g, '').substring(0, 100) 
    : '';
  return `
    <div class="help-article-card" data-slug="${article.slug}">
      <div class="help-article-card-icon">${article.icon}</div>
      <div class="help-article-card-body">
        <h3 class="help-article-card-title">${data.title}</h3>
        <p class="help-article-card-preview">${previewText}...</p>
      </div>
      <div class="help-article-card-arrow">→</div>
    </div>
  `;
}

export function attachHelpCenterEvents() {
  // Article card clicks
  document.querySelectorAll('.help-article-card').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo(`/help/${card.dataset.slug}`);
    });
  });

  // Search
  const search = document.getElementById('help-search');
  if (search) {
    search.addEventListener('input', () => {
      const query = search.value.toLowerCase().trim();
      const lang = getLanguage();
      
      document.querySelectorAll('.help-article-card').forEach(card => {
        const slug = card.dataset.slug;
        const article = getArticleBySlug(slug);
        if (!article) return;
        
        const data = article[lang] || article.en;
        const searchText = (
          data.title + ' ' + 
          data.sections.map(s => (s.heading || '') + ' ' + (s.body || '').replace(/<[^>]*>/g, '') + ' ' + (s.bullets || []).join(' ')).join(' ')
        ).toLowerCase();
        
        card.style.display = !query || searchText.includes(query) ? '' : 'none';
      });
    });
  }
}

// ── Help Article Detail Page ────────────────────────
export function renderHelpArticlePage(slug) {
  const article = getArticleBySlug(slug);
  const lang = getLanguage();
  
  if (!article) {
    return `
      <div class="page">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state-icon">${icons.search}</div>
            <div class="empty-state-title">${lang === 'uz' ? 'Maqola topilmadi' : 'Article not found'}</div>
            <button class="btn btn-primary" onclick="location.hash='/help'">
              ${lang === 'uz' ? 'Yordam markaziga qaytish' : 'Back to Help Center'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  const data = article[lang] || article.en;
  const backLabel = lang === 'uz' ? 'Yordam Markazi' : 'Help Center';
  
  // Related articles (same category, excluding current)
  const related = HELP_ARTICLES
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);
  const relatedLabel = lang === 'uz' ? 'Bog\'liq maqolalar' : 'Related Articles';

  return `
    <div class="page">
      <div class="container-narrow">
        <!-- Breadcrumb -->
        <div class="help-breadcrumb animate-fadeIn">
          <a class="help-breadcrumb-link" id="help-back-link">
            ← ${backLabel}
          </a>
        </div>

        <!-- Article Content -->
        <article class="help-article animate-fadeIn">
          <div class="help-article-header">
            <span class="help-article-icon">${article.icon}</span>
            <h1 class="help-article-title">${data.title}</h1>
          </div>

          <div class="help-article-content">
            ${data.sections.map(section => `
              <div class="help-article-section">
                ${section.heading ? `<h2 class="help-article-heading">${section.heading}</h2>` : ''}
                ${section.body ? `<p class="help-article-body">${section.body}</p>` : ''}
                ${section.bullets ? `
                  <ul class="help-article-bullets">
                    ${section.bullets.map(b => `<li>${b}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </article>

        <!-- Related Articles -->
        ${related.length > 0 ? `
          <div class="help-related">
            <h3 class="help-related-title">${relatedLabel}</h3>
            <div class="help-related-grid">
              ${related.map(a => {
                const rd = a[lang] || a.en;
                return `
                  <div class="help-related-card" data-slug="${a.slug}">
                    <span class="help-related-icon">${a.icon}</span>
                    <span class="help-related-text">${rd.title}</span>
                    <span class="help-related-arrow">→</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function attachHelpArticleEvents() {
  const backLink = document.getElementById('help-back-link');
  if (backLink) {
    backLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/help');
    });
  }

  // Related article clicks
  document.querySelectorAll('.help-related-card').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo(`/help/${card.dataset.slug}`);
    });
  });
}
