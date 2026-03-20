// ==========================================
// ReUz — Product Card Component
// ==========================================

import { store } from '../store.js';
import { formatPrice } from '../logic/pricing.js';
import { navigateTo } from '../router.js';

export function renderProductCard(product) {
  const seller = store.getById('users', product.sellerId);
  const condition = product.condition || 'Good';

  const conditionColors = {
    'New': 'badge-success',
    'Like New': 'badge-success',
    'Excellent': 'badge-info',
    'Very Good': 'badge-info',
    'Good': 'badge-warning',
    'Fair': 'badge-neutral'
  };

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-card-image">
        <img src="${product.images?.[0] || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect fill='%231A1A25' width='400' height='500'/%3E%3Ctext fill='%23A0A0B8' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`}" 
             alt="${product.title}" loading="lazy" />
        <span class="product-card-badge badge ${conditionColors[condition] || 'badge-neutral'}">${condition}</span>
        <button class="product-card-favorite" data-fav="${product.id}" title="Add to favorites">♡</button>
      </div>
      <div class="product-card-body">
        <div class="product-card-price">${formatPrice(product.price)}</div>
        <div class="product-card-title">${product.title}</div>
        <div class="product-card-meta">
          <span>${product.brand || ''}</span>
          ${product.size ? `<span>· ${product.size}</span>` : ''}
        </div>
        ${seller ? `
          <div class="product-card-seller">
            <div class="avatar avatar-sm">${seller.name.charAt(0)}</div>
            <span class="text-xs text-muted">${seller.name}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function attachProductCardEvents(container) {
  if (!container) return;

  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking favorite
      if (e.target.closest('.product-card-favorite')) return;
      const id = card.dataset.productId;
      navigateTo(`/product/${id}`);
    });
  });

  container.querySelectorAll('.product-card-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    });
  });
}
