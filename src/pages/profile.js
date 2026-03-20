// ==========================================
// ReUz — Profile Page
// ==========================================

import { store } from '../store.js';
import { renderProductCard, attachProductCardEvents } from '../components/productCard.js';
import { navigateTo } from '../router.js';
import { getLanguage } from '../i18n.js';

export function renderProfilePage(userId) {
  const currentUser = store.getCurrentUser();
  const profileUserId = userId || (currentUser ? currentUser.id : null);
  const lang = getLanguage();

  if (!profileUserId) { navigateTo('/login'); return ''; }

  const user = store.getById('users', profileUserId);
  if (!user) {
    return `<div class="page"><div class="container"><div class="empty-state"><div class="empty-state-icon">?</div><div class="empty-state-title">${lang === 'uz' ? 'Foydalanuvchi topilmadi' : 'User not found'}</div></div></div></div>`;
  }

  const isOwn = currentUser && currentUser.id === user.id;
  const listings = store.filter('products', p => p.sellerId === user.id);
  const activeListings = listings.filter(p => !p.sold);
  const soldListings = listings.filter(p => p.sold);
  const memberDays = Math.floor((Date.now() - user.joinedAt) / 86400000);

  const memberForLabel = lang === 'uz' ? `A'zo bo'lganiga ${memberDays} kun` : `Member for ${memberDays} days`;
  const reviewsLabel = lang === 'uz' ? 'sharh' : 'reviews';
  const listingsLabel = lang === 'uz' ? 'e\'lonlar' : 'listings';
  const soldLabel = lang === 'uz' ? 'sotilgan' : 'sold';
  const activeTabLabel = lang === 'uz' ? 'Faol' : 'Active';
  const soldTabLabel = lang === 'uz' ? 'Sotilgan' : 'Sold';
  const noActiveLabel = lang === 'uz' ? 'Faol e\'lonlar yo\'q' : 'No active listings';
  const listItemLabel = lang === 'uz' ? 'Buyum joylashtirish' : 'List an item';
  const noSoldLabel = lang === 'uz' ? 'Hali sotilgan buyum yo\'q' : 'No sold items yet';

  return `
    <div class="page">
      <div class="container-narrow">
        <div class="profile-header">
          <div class="avatar avatar-xl">${user.name.charAt(0)}</div>
          <div style="flex: 1;">
            <h1 style="margin-bottom: var(--space-2xs);">${user.name}</h1>
            <div class="text-sm text-muted" style="margin-bottom: var(--space-sm);">
              ${user.region} · ${memberForLabel}
            </div>
            ${user.bio ? `<p class="text-sm text-secondary">${user.bio}</p>` : ''}
            <div class="profile-stats" style="margin-top: var(--space-md);">
              <div class="profile-stat">
                <div class="profile-stat-value" style="color: var(--color-primary);">${user.rating.toFixed(1)}</div>
                <div class="profile-stat-label">${user.reviewCount} ${reviewsLabel}</div>
              </div>
              <div class="profile-stat">
                <div class="profile-stat-value">${listings.length}</div>
                <div class="profile-stat-label">${listingsLabel}</div>
              </div>
              <div class="profile-stat">
                <div class="profile-stat-value">${soldListings.length}</div>
                <div class="profile-stat-label">${soldLabel}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="tabs" id="profile-tabs">
          <button class="tab active" data-tab="active">${activeTabLabel} (${activeListings.length})</button>
          <button class="tab" data-tab="sold">${soldTabLabel} (${soldListings.length})</button>
        </div>

        <div id="profile-tab-active">
          ${activeListings.length > 0 ? `
            <div class="product-grid" id="profile-products">
              ${activeListings.map(p => renderProductCard(p)).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <div class="empty-state-icon">--</div>
              <div class="empty-state-title">${noActiveLabel}</div>
              ${isOwn ? `<button class="btn btn-primary" onclick="location.hash='/sell'">${listItemLabel}</button>` : ''}
            </div>
          `}
        </div>

        <div id="profile-tab-sold" style="display: none;">
          ${soldListings.length > 0 ? `
            <div class="product-grid">
              ${soldListings.map(p => renderProductCard(p)).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <div class="empty-state-icon">--</div>
              <div class="empty-state-title">${noSoldLabel}</div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

export function attachProfileEvents() {
  attachProductCardEvents(document.getElementById('profile-products'));

  document.querySelectorAll('#profile-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#profile-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      document.getElementById('profile-tab-active').style.display = tabName === 'active' ? 'block' : 'none';
      document.getElementById('profile-tab-sold').style.display = tabName === 'sold' ? 'block' : 'none';
    });
  });
}
