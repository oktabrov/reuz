// ==========================================
// ReUz — Price Breakdown Component (Buyer view only)
// ==========================================

import { formatPrice } from '../logic/pricing.js';
import { getLanguage } from '../i18n.js';

export function renderPriceBreakdown(pricing, { title = null } = {}) {
  const lang = getLanguage();
  const displayTitle = title || (lang === 'uz' ? 'Narx taqsimoti' : 'Price Breakdown');
  const itemPriceLabel = lang === 'uz' ? 'Buyum narxi' : 'Item price';
  const buyerProtLabel = lang === 'uz' ? 'Xaridor himoyasi' : 'Buyer Protection';
  const shippingLabel = lang === 'uz' ? 'Yetkazib berish' : 'Delivery';
  const youPayLabel = lang === 'uz' ? 'Jami' : 'Total';

  return `
    <div class="price-breakdown">
      <div class="price-breakdown-header">${displayTitle}</div>
      
      <div class="price-breakdown-row">
        <span class="label">${itemPriceLabel}</span>
        <span class="value">${formatPrice(pricing.itemPrice)}</span>
      </div>
      
      <div class="price-breakdown-row">
        <span class="label">
          <a href="#/buyer-protection" class="buyer-prot-link" style="color: var(--color-primary); text-decoration: underline; cursor: pointer;">
            🛡️ ${buyerProtLabel}
          </a>
        </span>
        <span class="value">${formatPrice(pricing.buyerProtection)}</span>
      </div>
      
      <div class="price-breakdown-row">
        <span class="label">${shippingLabel}</span>
        <span class="value">${formatPrice(pricing.shippingCost)}</span>
      </div>
      
      <div class="price-breakdown-row total">
        <span>${youPayLabel}</span>
        <span>${formatPrice(pricing.buyerPays)}</span>
      </div>
    </div>
  `;
}
