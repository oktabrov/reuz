// ==========================================
// ReUz — Orders Page
// ==========================================

import { store } from '../store.js';
import { getOrdersByBuyer, getOrdersBySeller } from '../logic/orders.js';
import { formatPrice } from '../logic/pricing.js';
import { navigateTo } from '../router.js';
import { getLanguage } from '../i18n.js';

function renderOrderCard(order, context) {
  const product = store.getById('products', order.productId);
  const lang = getLanguage();
  const statusLabels = {
    paid: lang === 'uz' ? 'To\'langan' : 'Paid',
    shipped: lang === 'uz' ? 'Jo\'natilgan' : 'Shipped',
    delivered: lang === 'uz' ? 'Yetkazilgan' : 'Delivered',
    completed: lang === 'uz' ? 'Bajarilgan' : 'Completed',
    cancelled: lang === 'uz' ? 'Bekor qilingan' : 'Cancelled',
    disputed: lang === 'uz' ? 'Nizo ochilgan' : 'Disputed'
  };

  return `
    <div class="order-card" data-order-id="${order.id}" style="margin-bottom: var(--space-sm);">
      <div class="order-card-image">
        <img src="${product?.images?.[0] || ''}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div style="flex: 1;">
        <div class="font-semibold">${product?.title || (lang === 'uz' ? 'Buyum' : 'Item')}</div>
        <div class="text-sm text-muted">${formatPrice(order.pricing.buyerPays)}</div>
        <div style="margin-top: var(--space-xs);">
          <span class="badge badge-${order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'error' : 'info'}">${statusLabels[order.status] || order.status}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderOrdersPage() {
  const user = store.getCurrentUser();
  if (!user) { navigateTo('/login'); return ''; }

  const buying = getOrdersByBuyer(user.id).sort((a, b) => b.createdAt - a.createdAt);
  const selling = getOrdersBySeller(user.id).sort((a, b) => b.createdAt - a.createdAt);
  const lang = getLanguage();

  const title = lang === 'uz' ? 'Mening buyurtmalarim' : 'My Orders';
  const buyingLabel = lang === 'uz' ? 'Xaridlar' : 'Buying';
  const sellingLabel = lang === 'uz' ? 'Sotuvlar' : 'Selling';
  const noPurchases = lang === 'uz' ? 'Hali xarid yo\'q' : 'No purchases yet';
  const noPurchasesDesc = lang === 'uz' ? 'Ajoyib narxlarni topish uchun ko\'rib chiqishni boshlang!' : 'Start browsing to find great deals!';
  const browseLabel = lang === 'uz' ? 'Buyumlarni ko\'rish' : 'Browse items';
  const noSales = lang === 'uz' ? 'Hali sotuv yo\'q' : 'No sales yet';
  const noSalesDesc = lang === 'uz' ? 'Sotishni boshlash uchun buyum joylashtiring!' : 'List an item to start selling!';
  const sellNowLabel = lang === 'uz' ? 'Hozir sotish' : 'Sell now';

  return `
    <div class="page">
      <div class="container-narrow">
        <h1 style="margin-bottom: var(--space-lg);">${title}</h1>

        <div class="tabs" id="order-tabs">
          <button class="tab active" data-tab="buying">${buyingLabel} (${buying.length})</button>
          <button class="tab" data-tab="selling">${sellingLabel} (${selling.length})</button>
        </div>

        <div id="tab-buying">
          ${buying.length > 0 ? buying.map(o => renderOrderCard(o, 'buying')).join('') : `
            <div class="empty-state">
              <div class="empty-state-icon">--</div>
              <div class="empty-state-title">${noPurchases}</div>
              <div class="empty-state-text">${noPurchasesDesc}</div>
              <button class="btn btn-primary" onclick="location.hash='/'">${browseLabel}</button>
            </div>
          `}
        </div>
        <div id="tab-selling" style="display: none;">
          ${selling.length > 0 ? selling.map(o => renderOrderCard(o, 'selling')).join('') : `
            <div class="empty-state">
              <div class="empty-state-icon">--</div>
              <div class="empty-state-title">${noSales}</div>
              <div class="empty-state-text">${noSalesDesc}</div>
              <button class="btn btn-primary" onclick="location.hash='/sell'">${sellNowLabel}</button>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

export function attachOrdersEvents() {
  document.querySelectorAll('#order-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#order-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-buying').style.display = tab.dataset.tab === 'buying' ? 'block' : 'none';
      document.getElementById('tab-selling').style.display = tab.dataset.tab === 'selling' ? 'block' : 'none';
    });
  });

  document.querySelectorAll('.order-card').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo(`/order/${card.dataset.orderId}`);
    });
  });
}
