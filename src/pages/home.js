// ==========================================
// ReUz — Home Page (API-backed)
// ==========================================

import { store } from '../store.js';
import { renderProductCard, attachProductCardEvents } from '../components/productCard.js';
import { navigateTo } from '../router.js';
import { getLanguage, t } from '../i18n.js';
import { icons } from '../icons.js';

let cachedProducts = [];

export async function renderHomePage() {
  const user = store.getCurrentUser();
  const lang = getLanguage();

  try {
    cachedProducts = await store.getProducts();
    cachedProducts = cachedProducts.filter(p => !p.sold);
  } catch {
    cachedProducts = [];
  }

  const products = cachedProducts;

  const categories = [
    { key: 'All', en: 'All', uz: 'Hammasi' },
    { key: 'women', en: 'Women', uz: 'Ayollar' },
    { key: 'men', en: 'Men', uz: 'Erkaklar' },
    { key: 'kids', en: 'Kids', uz: 'Bolalar' }
  ];

  const sortOptions = [
    { key: 'Newest', en: 'Newest', uz: 'Eng yangi' },
    { key: 'Price: Low to High', en: 'Price: Low to High', uz: 'Narx: pastdan yuqoriga' },
    { key: 'Price: High to Low', en: 'Price: High to Low', uz: 'Narx: yuqoridan pastga' },
    { key: 'Most Viewed', en: 'Most Viewed', uz: 'Eng ko\'p ko\'rilgan' }
  ];

  const heroTitle = lang === 'uz'
    ? `Sotib oling va soting<br/><span style="color: var(--color-primary);">ikkinchi qo'l</span> boyliklar`
    : `Buy & sell<br/><span style="color: var(--color-primary);">second-hand</span> treasures`;
  const heroSub = lang === 'uz'
    ? 'ReUz — oldindan sevib ishlatilgan buyumlar uchun hamjamiyat bozori. Barqaror xarid oson.'
    : 'Join ReUz — the community marketplace for preloved items. Sustainable shopping made easy.';
  const sellItem = lang === 'uz' ? '+ Buyum sotish' : '+ Sell an item';
  const itemsAvailable = lang === 'uz' ? 'ta buyum mavjud' : 'items available';
  const noItemsTitle = lang === 'uz' ? 'Hali buyumlar yo\'q' : 'No items yet';
  const noItemsText = lang === 'uz' ? 'Birinchi bo\'lib biror narsa joylang!' : 'Be the first to list something!';
  const sellNow = lang === 'uz' ? 'Hozir sotish' : 'Sell now';

  return `
    <div class="page">
      <div class="container">
        <!-- Hero -->
        <div class="hero animate-fadeIn">
          <div class="hero-title">
            ${heroTitle}
          </div>
          <div class="hero-subtitle">
            ${heroSub}
          </div>
          ${!user ? `
            <div class="flex gap-md justify-center">
              <button class="btn btn-primary btn-lg" onclick="location.hash='/register'">Get Started</button>
              <button class="btn btn-secondary btn-lg" onclick="location.hash='/login'">Log In</button>
            </div>
          ` : `
            <button class="btn btn-primary btn-lg" onclick="location.hash='/sell'">${sellItem}</button>
          `}
        </div>

        <!-- Filters -->
        <div class="flex justify-between items-center flex-wrap gap-md" style="margin-bottom: var(--space-lg);">
          <div class="category-pills" id="category-pills">
            ${categories.map((cat, i) => `
              <button class="category-pill ${i === 0 ? 'active' : ''}" data-category="${cat.key}">${lang === 'uz' ? cat.uz : cat.en}</button>
            `).join('')}
          </div>
          <div class="flex items-center gap-sm">
            <select class="form-input" id="sort-select" style="padding: var(--space-xs) var(--space-md); font-size: var(--font-size-sm); min-width: 170px;">
              ${sortOptions.map(s => `<option value="${s.key}">${lang === 'uz' ? s.uz : s.en}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Product count -->
        <p class="text-sm text-muted" style="margin-bottom: var(--space-md);">
          <span id="product-count">${products.length}</span> ${itemsAvailable}
        </p>

        <!-- Product Grid -->
        <div class="product-grid" id="product-grid">
          ${products.map(p => renderProductCard(p)).join('')}
        </div>

        ${products.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">${icons.shopping}</div>
            <div class="empty-state-title">${noItemsTitle}</div>
            <div class="empty-state-text">${noItemsText}</div>
            <button class="btn btn-primary" onclick="location.hash='/sell'">${sellNow}</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function attachHomeEvents() {
  const grid = document.getElementById('product-grid');
  attachProductCardEvents(grid);

  // Category filter
  const pills = document.querySelectorAll('#category-pills .category-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterProducts();
    });
  });

  // Sort
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => filterProducts());
  }
}

async function filterProducts() {
  const activeCategory = document.querySelector('#category-pills .category-pill.active')?.dataset.category || 'All';
  const sortValue = document.getElementById('sort-select')?.value || 'Newest';

  const sortMap = {
    'Newest': undefined,
    'Price: Low to High': 'price_asc',
    'Price: High to Low': 'price_desc',
    'Most Viewed': 'popular'
  };

  try {
    let products = await store.getProducts({
      category: activeCategory !== 'All' ? activeCategory : undefined,
      sort: sortMap[sortValue]
    });
    products = products.filter(p => !p.sold);

    const grid = document.getElementById('product-grid');
    const count = document.getElementById('product-count');
    if (grid) {
      grid.innerHTML = products.map(p => renderProductCard(p)).join('');
      attachProductCardEvents(grid);
    }
    if (count) count.textContent = products.length;
  } catch (err) {
    console.error('Filter error:', err);
  }
}

export async function renderSearchPage(query) {
  const decoded = decodeURIComponent(query);
  const lang = getLanguage();

  let products = [];
  try {
    products = await store.getProducts({ search: decoded });
    products = products.filter(p => !p.sold);
  } catch { }

  const searchResultsFor = lang === 'uz' ? 'Qidiruv natijalari' : 'Search results for';
  const itemsFound = lang === 'uz' ? 'ta buyum topildi' : 'items found';
  const noResults = lang === 'uz' ? 'Natija topilmadi' : 'No results';
  const tryDifferent = lang === 'uz' ? 'Boshqa kalit so\'zlarni sinab ko\'ring' : 'Try different keywords or browse all items';
  const browseAll = lang === 'uz' ? 'Hammasini ko\'rish' : 'Browse all';

  return `
    <div class="page">
      <div class="container">
        <h1 style="margin-bottom: var(--space-xs);">${searchResultsFor} "${decoded}"</h1>
        <p class="text-muted" style="margin-bottom: var(--space-xl);">${products.length} ${itemsFound}</p>

        <div class="product-grid" id="product-grid">
          ${products.map(p => renderProductCard(p)).join('')}
        </div>

        ${products.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">${icons.search}</div>
            <div class="empty-state-title">${noResults}</div>
            <div class="empty-state-text">${tryDifferent}</div>
            <button class="btn btn-primary" onclick="location.hash='/'">${browseAll}</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function attachSearchEvents() {
  attachProductCardEvents(document.getElementById('product-grid'));
}
