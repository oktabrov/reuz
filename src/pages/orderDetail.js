// ==========================================
// ReUz — Order Detail Page
// ==========================================

import { store } from '../store.js';
import { formatPrice } from '../logic/pricing.js';
import { cancelOrder, confirmReceipt, getOrderTimerInfo, startOrderProgression } from '../logic/orders.js';
import { renderOrderTimeline, renderStatusBadge } from '../components/orderTimeline.js';
import { renderPriceBreakdown } from '../components/priceBreakdown.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';
import { getLanguage, t } from '../i18n.js';

let refreshInterval = null;

export function renderOrderDetailPage(orderId) {
  const user = store.getCurrentUser();
  if (!user) { navigateTo('/login'); return ''; }

  const order = store.getById('orders', orderId);
  const lang = getLanguage();
  if (!order) {
    return `<div class="page"><div class="container"><div class="empty-state"><div class="empty-state-icon">?</div><div class="empty-state-title">${lang === 'uz' ? 'Buyurtma topilmadi' : 'Order not found'}</div></div></div></div>`;
  }

  const product = store.getById('products', order.productId);
  const isBuyer = order.buyerId === user.id;
  const isSeller = order.sellerId === user.id;
  const otherUser = store.getById('users', isBuyer ? order.sellerId : order.buyerId);
  const timerInfo = getOrderTimerInfo(orderId);

  // Calculate countdown for delivered orders (buyer confirmation window)
  let countdownHtml = '';
  if (order.status === 'delivered') {
    const deliveredAt = order.deliveredAt || (() => {
      const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
      const entry = [...history].reverse().find(s => s.status === 'delivered');
      return entry ? entry.timestamp : Date.now();
    })();
    const windowMs = 30 * 60 * 1000; // 30 minutes
    const elapsed = Date.now() - deliveredAt;
    const remaining = Math.max(0, windowMs - elapsed);
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);

    countdownHtml = `
      <div class="card" style="margin-bottom: var(--space-lg); background: linear-gradient(135deg, rgba(255,184,0,0.1), rgba(255,184,0,0.03)); border-color: rgba(255,184,0,0.3);">
        <div style="text-align: center;">
          <div class="text-xs text-muted" style="margin-bottom: var(--space-xs);">${lang === 'uz' ? 'Xaridor tasdiqlash oynasi' : 'Buyer Confirmation Window'}</div>
          <div id="countdown-timer" style="font-size: var(--font-size-3xl); font-weight: 800; color: var(--color-warning); font-variant-numeric: tabular-nums; letter-spacing: 2px;">
            ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}
          </div>
          <div class="text-xs text-muted" style="margin-top: var(--space-xs);">${lang === 'uz' ? 'Agar muammo xabar qilinmasa, mablag\'lar avtomatik chiqariladi' : 'Funds will auto-release if no issue is reported'}</div>
        </div>
      </div>
    `;
  }

  const backLabel = lang === 'uz' ? '← Buyurtmalarga qaytish' : '← Back to Orders';
  const orderStatusLabel = lang === 'uz' ? 'Buyurtma holati' : 'Order Status';
  const actionsLabel = lang === 'uz' ? 'Harakatlar' : 'Actions';
  const cancelLabel = lang === 'uz' ? 'Buyurtmani bekor qilish' : 'Cancel Order';
  const confirmLabel = lang === 'uz' ? 'Hammasi yaxshi' : 'Everything is OK';
  const issueLabel = lang === 'uz' ? 'Muammo bor' : 'I Have an Issue';
  const viewDisputeLabel = lang === 'uz' ? 'Nizoni ko\'rish' : 'View Dispute';
  const openChatLabel = lang === 'uz' ? 'Suhbatni ochish' : 'Open Chat';
  const noActionsLabel = lang === 'uz' ? 'Hech qanday harakat mavjud emas' : 'No actions available';
  const sellerLabel = lang === 'uz' ? 'Sotuvchi' : 'Seller';
  const buyerLabel = lang === 'uz' ? 'Xaridor' : 'Buyer';
  const shippingLabel = lang === 'uz' ? 'Yetkazib berish' : 'Shipping';
  const costLabel = lang === 'uz' ? 'Narxi' : 'Cost';
  const paymentLabel = lang === 'uz' ? 'To\'lov' : 'Payment';
  const cardEndingLabel = lang === 'uz' ? 'Karta' : 'Card ending in';
  const simulatingLabel = lang === 'uz' ? 'Simulyatsiya: avto-ilgarilanish' : 'Simulating: auto-progressing';
  const nextLabel = lang === 'uz' ? 'Keyingi' : 'Next';

  return `
    <div class="page">
      <div class="container-narrow">
        <div class="flex justify-between items-center" style="margin-bottom: var(--space-xl);">
          <div>
            <button class="btn btn-ghost btn-sm" onclick="location.hash='/orders'" style="margin-bottom: var(--space-xs);">${backLabel}</button>
            <h1>${lang === 'uz' ? 'Buyurtma' : 'Order'} #${orderId.slice(-6).toUpperCase()}</h1>
          </div>
          ${renderStatusBadge(order.status)}
        </div>

        <div class="grid-2" style="gap: var(--space-2xl); align-items: start;">
          <!-- Left: Timeline & Actions -->
          <div>
            ${countdownHtml}
            <!-- Auto-progress indicator -->
            ${timerInfo && timerInfo.nextStatus && timerInfo.nextDelay < 60 ? `
              <div class="card" style="margin-bottom: var(--space-lg); background: var(--color-primary-glow); border-color: rgba(0,255,157,0.2);">
                <div class="flex items-center gap-sm">
                  <div class="spinner spinner-sm"></div>
                  <div>
                    <div class="text-sm font-semibold" style="color: var(--color-primary);">${simulatingLabel}</div>
                    <div class="text-xs text-muted">${nextLabel}: "${timerInfo.nextStatus}" ~${timerInfo.nextDelay}s</div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Timeline -->
            <div class="card" style="margin-bottom: var(--space-lg);">
              <h3 style="margin-bottom: var(--space-md);">${orderStatusLabel}</h3>
              <div id="order-timeline">
                ${renderOrderTimeline(Array.isArray(order.statusHistory) ? order.statusHistory : [], order.status)}
              </div>
            </div>

            <!-- Actions -->
            <div class="card" id="order-actions">
              <h3 style="margin-bottom: var(--space-md);">${actionsLabel}</h3>
              <div class="flex flex-col gap-sm">
                <!-- Open Chat always available -->
                <button class="btn btn-secondary btn-full" id="open-chat-btn">${openChatLabel}</button>
                ${isBuyer && order.status === 'paid' ? `
                  <button class="btn btn-danger btn-full" id="cancel-order-btn">${cancelLabel}</button>
                ` : ''}
                ${isSeller && order.status === 'paid' ? `
                  <button class="btn btn-danger btn-full" id="cancel-order-btn">${cancelLabel}</button>
                ` : ''}
                ${isBuyer && order.status === 'delivered' ? `
                  <button class="btn btn-primary btn-full" id="confirm-receipt-btn">${confirmLabel}</button>
                  <button class="btn btn-danger btn-full" id="report-issue-btn">${issueLabel}</button>
                ` : ''}
                ${order.status === 'disputed' && order.disputeId ? `
                  <button class="btn btn-warning btn-full" id="view-dispute-btn">${viewDisputeLabel}</button>
                ` : ''}
                ${['completed', 'cancelled', 'refunded'].includes(order.status) ? `
                  <p class="text-sm text-muted text-center">${noActionsLabel}</p>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Right: Order Summary -->
          <div>
            <!-- Product -->
            <div class="card" style="margin-bottom: var(--space-lg); cursor: pointer;" id="product-link" data-product-id="${order.productId}">
              <div class="flex gap-md items-center">
                <div style="width: 80px; height: 80px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0;">
                  <img src="${product?.images?.[0] || ''}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div>
                  <div class="font-semibold">${product?.title || (lang === 'uz' ? 'Buyum' : 'Item')}</div>
                  <div class="text-sm text-muted">${product?.brand || ''} · ${product?.condition || ''}</div>
                </div>
              </div>
            </div>

            <!-- Other party -->
            <div class="card" style="margin-bottom: var(--space-lg);">
              <div class="text-xs text-muted" style="margin-bottom: var(--space-xs);">${isBuyer ? sellerLabel : buyerLabel}</div>
              <div class="flex items-center gap-sm">
                <div class="avatar avatar-sm">${otherUser?.name?.charAt(0) || '?'}</div>
                <div>
                  <div class="font-semibold text-sm">${otherUser?.name || (lang === 'uz' ? 'Noma\'lum' : 'Unknown')}</div>
                  <div class="text-xs text-muted">${otherUser?.region || ''}</div>
                </div>
              </div>
            </div>

            <!-- Shipping -->
            <div class="card" style="margin-bottom: var(--space-lg);">
              <div class="text-xs text-muted" style="margin-bottom: var(--space-xs);">${shippingLabel}</div>
              <div class="text-sm">
                <div>${order.shipping.label}</div>
                <div class="text-muted">${order.shipping.fromRegion} → ${order.shipping.toRegion}</div>
                <div class="text-muted">${costLabel}: ${formatPrice(order.shipping.cost)}</div>
              </div>
            </div>

            <!-- Price Breakdown -->
            ${renderPriceBreakdown(order.pricing, { showPlatformRevenue: true, title: lang === 'uz' ? 'To\'lov tafsilotlari' : 'Payment Details' })}

            <!-- Payment info -->
            <div class="card" style="margin-top: var(--space-lg);">
              <div class="text-xs text-muted" style="margin-bottom: var(--space-xs);">${paymentLabel}</div>
              <div class="flex items-center gap-sm text-sm">
                <span>${cardEndingLabel} ${order.paymentDetails.cardLast4}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachOrderDetailEvents(orderId) {
  const cancelBtn = document.getElementById('cancel-order-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      const user = store.getCurrentUser();
      if (cancelOrder(orderId, user.id)) {
        navigateTo('/orders');
      }
    });
  }

  const confirmBtn = document.getElementById('confirm-receipt-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      confirmReceipt(orderId);
      navigateTo(`/order/${orderId}`);
    });
  }

  const reportBtn = document.getElementById('report-issue-btn');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      navigateTo(`/chat/${orderId}`);
    });
  }

  const disputeBtn = document.getElementById('view-dispute-btn');
  if (disputeBtn) {
    disputeBtn.addEventListener('click', () => {
      navigateTo(`/chat/${orderId}`);
    });
  }

  const chatBtn = document.getElementById('open-chat-btn');
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      navigateTo(`/chat/${orderId}`);
    });
  }

  const productLink = document.getElementById('product-link');
  if (productLink) {
    productLink.addEventListener('click', () => {
      navigateTo(`/product/${productLink.dataset.productId}`);
    });
  }

  // Live countdown timer for delivered orders
  const countdownEl = document.getElementById('countdown-timer');
  if (countdownEl) {
    const order2 = store.getById('orders', orderId);
    if (order2 && order2.status === 'delivered') {
      const deliveredAt = order2.deliveredAt || (() => {
        const history2 = Array.isArray(order2.statusHistory) ? order2.statusHistory : [];
        const entry = [...history2].reverse().find(s => s.status === 'delivered');
        return entry ? entry.timestamp : Date.now();
      })();
      const windowMs = 30 * 60 * 1000;
      const countdownInterval = setInterval(() => {
        const elapsed = Date.now() - deliveredAt;
        const remaining = Math.max(0, windowMs - elapsed);
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        countdownEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (remaining <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      if (!window._reuzCountdownIntervals) window._reuzCountdownIntervals = [];
      window._reuzCountdownIntervals.push(countdownInterval);
    }
  }

  // Auto-refresh page to show status changes
  if (refreshInterval) clearInterval(refreshInterval);
  const order = store.getById('orders', orderId);
  if (order && ['paid', 'shipped', 'delivered'].includes(order.status)) {
    refreshInterval = setInterval(() => {
      const currentOrder = store.getById('orders', orderId);
      if (!currentOrder) {
        clearInterval(refreshInterval);
        return;
      }
      const timeline = document.getElementById('order-timeline');
      if (timeline && (Array.isArray(currentOrder.statusHistory) ? currentOrder.statusHistory : []).length > timeline.querySelectorAll('.timeline-step').length) {
        const app = document.getElementById('app');
        if (app && window.location.hash.includes(orderId)) {
          app.innerHTML = renderNavbar() + renderOrderDetailPage(orderId);
          attachOrderDetailEvents(orderId);
          attachNavbarEvents();
        }
      }
    }, 2000);
  }
}

// Need to import navbar for re-renders
import { renderNavbar, attachNavbarEvents } from '../components/navbar.js';

export function cleanupOrderDetail() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
  if (window._reuzCountdownIntervals) {
    window._reuzCountdownIntervals.forEach(id => clearInterval(id));
    window._reuzCountdownIntervals = [];
  }
}
