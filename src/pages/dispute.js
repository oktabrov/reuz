// ==========================================
// ReUz — Dispute Page
// ==========================================

import { store } from '../store.js';
import {
  openDispute, sellerOfferFullRefund, sellerOfferPartialRefund,
  sellerRequestReturn, buyerAcceptPartialRefund, buyerDeclinePartialRefund,
  buyerShippedReturn, DISPUTE_REASONS
} from '../logic/disputes.js';
import { renderOrderTimeline } from '../components/orderTimeline.js';
import { formatPrice } from '../logic/pricing.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';
import { getLanguage } from '../i18n.js';

let disputeRefreshInterval = null;

export function renderDisputePage(orderId) {
  const user = store.getCurrentUser();
  if (!user) { navigateTo('/login'); return ''; }

  const order = store.getById('orders', orderId);
  if (!order) { navigateTo('/orders'); return ''; }

  const product = store.getById('products', order.productId);
  const isBuyer = order.buyerId === user.id;
  const isSeller = order.sellerId === user.id;
  const lang = getLanguage();

  const dispute = order.disputeId ? store.getById('disputes', order.disputeId) : null;

  if (dispute) {
    return renderExistingDispute(dispute, order, product, isBuyer, isSeller, lang);
  }

  // Only buyers can open disputes, and only on delivered orders
  if (!isBuyer || order.status !== 'delivered') {
    const cantOpenLabel = lang === 'uz' ? 'Nizo ochib bo\'lmaydi' : 'Cannot open a dispute';
    const reasonLabel = !isBuyer
      ? (lang === 'uz' ? 'Faqat xaridorlar muammo xabar qilishi mumkin' : 'Only buyers can report issues')
      : (lang === 'uz' ? 'Muammolar faqat yetkazilgan buyurtmalar uchun xabar qilinishi mumkin' : 'Issues can only be reported for delivered orders');
    return `
      <div class="page">
        <div class="container-narrow">
          <div class="empty-state">
            <div class="empty-state-icon">?</div>
            <div class="empty-state-title">${cantOpenLabel}</div>
            <div class="empty-state-text">${reasonLabel}</div>
            <button class="btn btn-secondary" onclick="location.hash='/orders'">${lang === 'uz' ? 'Buyurtmalarga qaytish' : 'Back to Orders'}</button>
          </div>
        </div>
      </div>
    `;
  }

  const localizedReasons = DISPUTE_REASONS.map(r => ({
    ...r,
    label: lang === 'uz' ? getDisputeReasonUz(r.id).label : r.label,
    description: lang === 'uz' ? getDisputeReasonUz(r.id).description : r.description
  }));

  return `
    <div class="page">
      <div class="container-narrow">
        <button class="btn btn-ghost btn-sm" onclick="location.hash='/chat/${orderId}'" style="margin-bottom: var(--space-md);">
          ${lang === 'uz' ? '← Buyurtmaga qaytish' : '← Back to Order'}
        </button>

        <h1 style="margin-bottom: var(--space-xs);">
          <span style="color: var(--color-error);">${lang === 'uz' ? 'Muammo xabar qilish' : 'Report an Issue'}</span>
        </h1>
        <p class="text-muted" style="margin-bottom: var(--space-xl);">
          ${lang === 'uz' ? 'Nizo sababini tanlang. To\'lovingiz himoyalangan.' : 'Select the reason for your dispute. Your payment is protected.'}
        </p>

        <!-- Item Summary -->
        <div class="card" style="margin-bottom: var(--space-xl);">
          <div class="flex gap-md items-center">
            <div style="width: 60px; height: 60px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0;">
              <img src="${product?.images?.[0] || ''}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <div class="font-semibold">${product?.title || (lang === 'uz' ? 'Buyum' : 'Item')}</div>
              <div class="text-sm text-muted">${lang === 'uz' ? 'To\'langan' : 'Paid'}: ${formatPrice(order.pricing.buyerPays)}</div>
            </div>
          </div>
        </div>

        <!-- Reason Selection -->
        <h3 style="margin-bottom: var(--space-md);">${lang === 'uz' ? 'Muammo nima?' : "What's the issue?"}</h3>
        <div class="dispute-reason-cards" id="reason-cards">
          ${localizedReasons.map(r => `
            <div class="dispute-reason-card" data-reason="${r.id}">
              <div class="dispute-reason-icon">${r.icon}</div>
              <div class="dispute-reason-title">${r.label}</div>
              <p class="text-xs text-muted" style="margin-top: var(--space-2xs);">${r.description}</p>
            </div>
          `).join('')}
        </div>

        <!-- Description form (hidden until reason selected) -->
        <div id="dispute-form-container" style="display: none; margin-top: var(--space-xl);">
          <div class="card" style="padding: var(--space-xl);">
            <form id="dispute-form" class="flex flex-col gap-md">
              <div class="form-group">
                <label class="form-label">${lang === 'uz' ? 'Muammoni tasvirlang *' : 'Describe the issue *'}</label>
                <textarea class="form-input" id="dispute-description"
                          placeholder="${lang === 'uz' ? 'Iltimos, buyum bilan nima noto\'g\'ri ekanligini tasvirlang...' : 'Please describe what\'s wrong with the item...'}" required maxlength="500"></textarea>
              </div>
              <div class="buyer-protection-badge">
                <span>🛡️</span>
                <div class="text-sm">
                  <strong>${lang === 'uz' ? 'Xaridor himoyasi' : 'Buyer Protection'}</strong> —
                  ${lang === 'uz'
                    ? 'Ishni ko\'rib chiqayotganimizda sotuvchining to\'lovi to\'xtatilgan.'
                    : "Seller payout will be frozen while we review your case."}
                </div>
              </div>
              <button type="submit" class="btn btn-danger btn-lg btn-full">
                ${lang === 'uz' ? 'Nizoni yuborish' : 'Submit Dispute'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getDisputeReasonUz(id) {
  const map = {
    'not_received': { label: 'Olinmagan', description: 'Buyumni olmadim' },
    'damaged': { label: 'Shikastlangan', description: 'Buyum shikastlangan holda keldi' },
    'not_as_described': { label: 'Tavsifga mos kelmaydi', description: 'Buyum e\'londan sezilarli farq qiladi' },
    'counterfeit': { label: 'Soxta', description: 'Buyum soxta ko\'rinadi' }
  };
  return map[id] || { label: id, description: '' };
}

function renderExistingDispute(dispute, order, product, isBuyer, isSeller, lang) {
  const statusColors = {
    'open': 'badge-warning', 'under_review': 'badge-info',
    'seller_offered_full_refund': 'badge-info', 'seller_offered_partial_refund': 'badge-warning',
    'seller_requested_return': 'badge-warning', 'partial_refund_declined': 'badge-warning',
    'return_required': 'badge-warning', 'return_shipped': 'badge-info', 'return_received': 'badge-info',
    'resolved_refund': 'badge-success', 'resolved_no_refund': 'badge-error',
    'resolved_partial_refund': 'badge-warning', 'closed': 'badge-neutral'
  };

  const reason = DISPUTE_REASONS.find(r => r.id === dispute.reason);
  const isResolved = dispute.status.startsWith('resolved_');
  const reasonLabel = lang === 'uz' ? getDisputeReasonUz(dispute.reason).label : (reason?.label || dispute.reason);

  // Can seller still respond? (open, under_review, or partial_refund_declined — and no offer pending)
  const sellerCanRespond = isSeller &&
    ['open', 'under_review', 'partial_refund_declined'].includes(dispute.status) &&
    !dispute.sellerOffer;

  // Buyer needs to respond to partial refund offer?
  const buyerCanRespondToPartial = isBuyer && dispute.status === 'seller_offered_partial_refund';

  // Buyer can ship return?
  const buyerCanShipReturn = isBuyer && dispute.status === 'return_required';

  return `
    <div class="page">
      <div class="container-narrow">
        <button class="btn btn-ghost btn-sm" onclick="location.hash='/chat/${order.id}'" style="margin-bottom: var(--space-md);">
          ${lang === 'uz' ? '← Buyurtmaga qaytish' : '← Back to Order'}
        </button>

        <div class="flex justify-between items-center" style="margin-bottom: var(--space-xl);">
          <div>
            <h1>${lang === 'uz' ? 'Nizo' : 'Dispute'} #${dispute.id.slice(-6).toUpperCase()}</h1>
            <p class="text-muted text-sm">${reasonLabel}</p>
          </div>
          <span class="badge ${statusColors[dispute.status] || 'badge-neutral'}">${dispute.status.replace(/_/g, ' ')}</span>
        </div>

        <!-- Item -->
        <div class="card" style="margin-bottom: var(--space-lg);">
          <div class="flex gap-md items-center">
            <div style="width: 60px; height: 60px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0;">
              <img src="${product?.images?.[0] || ''}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <div class="font-semibold">${product?.title || (lang === 'uz' ? 'Buyum' : 'Item')}</div>
              <div class="text-sm text-muted">${lang === 'uz' ? 'Miqdor' : 'Amount'}: ${formatPrice(order.pricing.buyerPays)}</div>
            </div>
          </div>
        </div>

        <!-- Dispute Description -->
        <div class="dispute-panel" style="margin-bottom: var(--space-lg);">
          <div class="dispute-panel-header">
            <div class="flex items-center gap-sm">
              <span>${reason?.icon || ''}</span>
              <span class="font-semibold">${reasonLabel}</span>
            </div>
          </div>
          <div style="padding: var(--space-lg);">
            <p class="text-sm text-secondary">${dispute.description}</p>
          </div>
        </div>

        <!-- Dispute Timeline -->
        <div class="card" style="margin-bottom: var(--space-lg);">
          <h3 style="margin-bottom: var(--space-md);">${lang === 'uz' ? 'Nizo jarayoni' : 'Dispute Progress'}</h3>
          <div id="dispute-timeline">
            ${renderOrderTimeline(dispute.statusHistory, dispute.status)}
          </div>
        </div>

        <!-- Actions -->
        <div class="card" id="dispute-actions">
          <h3 style="margin-bottom: var(--space-md);">${lang === 'uz' ? 'Harakatlar' : 'Actions'}</h3>

          ${sellerCanRespond ? `
            <div class="flex flex-col gap-sm">
              <p class="text-sm text-muted">${lang === 'uz' ? 'Bu nizoga javob bering:' : 'Respond to this dispute:'}</p>

              <button class="btn btn-primary btn-full" id="seller-full-refund-btn">
                💰 ${lang === 'uz' ? 'To\'liq qaytarish' : 'Full Refund'}
              </button>
              <p class="text-xs text-muted" style="margin-top: -4px; margin-bottom: var(--space-xs);">
                ${lang === 'uz' ? 'Xaridor buyumni saqlaydi + to\'liq pulini qaytarib oladi' : 'Buyer keeps item + gets full money back'}
              </p>

              <button class="btn btn-warning btn-full" id="seller-partial-refund-btn">
                🔄 ${lang === 'uz' ? 'Qisman qaytarish' : 'Partial Refund'}
              </button>
              <div id="partial-refund-input" style="display: none; margin-top: var(--space-xs);">
                <div class="flex gap-sm items-center">
                  <input type="number" class="form-input" id="partial-refund-amount"
                         placeholder="${lang === 'uz' ? 'Miqdor' : 'Amount'}" min="1000" step="1000"
                         style="flex: 1;" />
                  <button class="btn btn-primary btn-sm" id="send-partial-offer-btn">
                    ${lang === 'uz' ? 'Yuborish' : 'Send'}
                  </button>
                </div>
                <p class="text-xs text-muted" style="margin-top: var(--space-2xs);">
                  ${lang === 'uz' ? 'Xaridor qabul qilishi yoki rad etishi mumkin' : 'Buyer can accept or decline'}
                </p>
              </div>

              <button class="btn btn-secondary btn-full" id="seller-request-return-btn">
                📦 ${lang === 'uz' ? 'Qaytarishni talab qilish' : 'Request Return'}
              </button>
              <p class="text-xs text-muted" style="margin-top: -4px;">
                ${lang === 'uz' ? '5 kun ichida qaytarilmasa, buyurtma sizning foydaligingizga yakunlanadi' : 'If not returned within 5 days, order completes in your favor'}
              </p>
            </div>
          ` : ''}

          ${buyerCanRespondToPartial ? `
            <div class="flex flex-col gap-sm">
              <div class="card" style="background: var(--bg-elevated); border-color: var(--color-warning);">
                <p class="font-semibold" style="margin-bottom: var(--space-xs);">
                  ${lang === 'uz' ? 'Sotuvchi qisman qaytarish taklif qildi:' : 'Seller offered partial refund:'}
                </p>
                <p class="text-lg font-bold" style="color: var(--color-primary); margin-bottom: var(--space-sm);">
                  ${formatPrice(dispute.sellerOffer?.amount || 0)}
                </p>
                <p class="text-xs text-muted" style="margin-bottom: var(--space-sm);">
                  ${lang === 'uz' ? 'Qabul qilsangiz, buyumni saqlaysiz va qisman pulni qaytarib olasiz.' : 'If you accept, you keep the item and receive a partial refund.'}
                </p>
                <div class="flex gap-sm">
                  <button class="btn btn-primary" id="buyer-accept-partial-btn" style="flex: 1;">
                    ✓ ${lang === 'uz' ? 'Qabul qilish' : 'Accept'}
                  </button>
                  <button class="btn btn-danger" id="buyer-decline-partial-btn" style="flex: 1;">
                    ✕ ${lang === 'uz' ? 'Rad etish' : 'Decline'}
                  </button>
                </div>
              </div>
            </div>
          ` : ''}

          ${buyerCanShipReturn ? `
            <div class="flex flex-col gap-sm">
              <p class="text-sm text-muted">
                ${lang === 'uz' ? 'Buyumni sotuvchiga qaytaring va qaytarishni oling. 5 kun ichida jo\'nating!' : 'Ship the item back to the seller to receive your refund. Ship within 5 days!'}
              </p>
              <button class="btn btn-primary btn-full" id="ship-return-btn">
                📦 ${lang === 'uz' ? 'Jo\'natilgan deb belgilash' : 'Mark as Shipped'}
              </button>
            </div>
          ` : ''}

          ${isResolved ? `
            <div style="text-align: center; padding: var(--space-md);">
              ${dispute.resolution === 'full_refund' ? `
                <div class="text-success font-semibold text-lg">${lang === 'uz' ? 'To\'liq qaytarish amalga oshirildi' : 'Full refund issued'}</div>
                <p class="text-sm text-muted" style="margin-top: var(--space-xs);">${lang === 'uz' ? 'Miqdor' : 'Amount'}: ${formatPrice(order.pricing.buyerPays)}</p>
              ` : dispute.resolution === 'partial_refund' ? `
                <div class="text-warning font-semibold text-lg">${lang === 'uz' ? 'Qisman qaytarish amalga oshirildi' : 'Partial refund issued'}</div>
                <p class="text-sm text-muted" style="margin-top: var(--space-xs);">${lang === 'uz' ? 'Miqdor' : 'Amount'}: ${formatPrice(dispute.refundAmount || 0)}</p>
              ` : dispute.resolution === 'no_refund' ? `
                <div class="text-error font-semibold text-lg">${lang === 'uz' ? 'Nizo hal qilindi — qaytarish yo\'q' : 'Dispute resolved — no refund'}</div>
                <p class="text-sm text-muted" style="margin-top: var(--space-xs);">${lang === 'uz' ? 'Buyurtma sotuvchi foydasiga yakunlandi' : 'Order completed in seller\'s favor'}</p>
              ` : `
                <div class="text-error font-semibold text-lg">${lang === 'uz' ? 'Nizo hal qilindi' : 'Dispute resolved'}</div>
              `}
            </div>
          ` : ''}

          ${['return_shipped', 'return_received'].includes(dispute.status) ? `
            <div class="flex items-center gap-sm justify-center" style="padding: var(--space-md);">
              <div class="spinner spinner-sm"></div>
              <span class="text-sm text-muted">${lang === 'uz' ? 'Qaytarish jarayonida...' : 'Processing return...'}</span>
            </div>
          ` : ''}

          ${['open', 'under_review'].includes(dispute.status) && !sellerCanRespond ? `
            <div class="flex items-center gap-sm justify-center" style="padding: var(--space-md);">
              <div class="spinner spinner-sm"></div>
              <span class="text-sm text-muted">${lang === 'uz' ? 'Sotuvchi javobi kutilmoqda...' : 'Waiting for seller response...'}</span>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

export function attachDisputeEvents(orderId) {
  const order = store.getById('orders', orderId);
  const dispute = order?.disputeId ? store.getById('disputes', order.disputeId) : null;
  const lang = getLanguage();

  // Reason selection
  let selectedReason = null;
  document.querySelectorAll('.dispute-reason-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.dispute-reason-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedReason = card.dataset.reason;
      document.getElementById('dispute-form-container').style.display = 'block';
    });
  });

  // Submit dispute
  const form = document.getElementById('dispute-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!selectedReason) {
        showToast(lang === 'uz' ? 'Iltimos, sababni tanlang' : 'Please select a reason', 'error');
        return;
      }
      const description = document.getElementById('dispute-description').value.trim();
      const result = openDispute(orderId, selectedReason, description);
      if (result) {
        navigateTo(`/dispute/${orderId}`);
      }
    });
  }

  // === Seller actions ===
  // Full refund
  const fullRefundBtn = document.getElementById('seller-full-refund-btn');
  if (fullRefundBtn && dispute) {
    fullRefundBtn.addEventListener('click', () => {
      sellerOfferFullRefund(dispute.id);
      showToast(lang === 'uz' ? 'To\'liq qaytarish amalga oshirildi' : 'Full refund issued', 'success');
      setTimeout(() => navigateTo(`/dispute/${orderId}`), 500);
    });
  }

  // Partial refund toggle
  const partialBtn = document.getElementById('seller-partial-refund-btn');
  const partialInput = document.getElementById('partial-refund-input');
  if (partialBtn && partialInput) {
    partialBtn.addEventListener('click', () => {
      partialInput.style.display = partialInput.style.display === 'none' ? 'block' : 'none';
    });
  }

  // Send partial offer
  const sendPartialBtn = document.getElementById('send-partial-offer-btn');
  if (sendPartialBtn && dispute) {
    sendPartialBtn.addEventListener('click', () => {
      const amountInput = document.getElementById('partial-refund-amount');
      const amount = parseInt(amountInput?.value);
      if (!amount || amount < 1000) {
        showToast(lang === 'uz' ? 'Eng kam 1 000 so\'m' : "Minimum 1,000 so'm", 'error');
        return;
      }
      const order = store.getById('orders', dispute.orderId);
      if (amount >= order.pricing.buyerPays) {
        showToast(lang === 'uz' ? 'To\'liq narxdan kam bo\'lishi kerak' : 'Amount must be less than total price', 'error');
        return;
      }
      sellerOfferPartialRefund(dispute.id, amount);
      showToast(lang === 'uz' ? 'Taklif yuborildi' : 'Offer sent', 'info');
      setTimeout(() => navigateTo(`/dispute/${orderId}`), 500);
    });
  }

  // Request return
  const returnBtn = document.getElementById('seller-request-return-btn');
  if (returnBtn && dispute) {
    returnBtn.addEventListener('click', () => {
      sellerRequestReturn(dispute.id);
      showToast(lang === 'uz' ? 'Qaytarish talab qilindi' : 'Return requested', 'info');
      setTimeout(() => navigateTo(`/dispute/${orderId}`), 500);
    });
  }

  // === Buyer actions ===
  // Accept partial
  const acceptPartialBtn = document.getElementById('buyer-accept-partial-btn');
  if (acceptPartialBtn && dispute) {
    acceptPartialBtn.addEventListener('click', () => {
      buyerAcceptPartialRefund(dispute.id);
      showToast(lang === 'uz' ? 'Qisman qaytarish qabul qilindi' : 'Partial refund accepted', 'success');
      setTimeout(() => navigateTo(`/dispute/${orderId}`), 500);
    });
  }

  // Decline partial
  const declinePartialBtn = document.getElementById('buyer-decline-partial-btn');
  if (declinePartialBtn && dispute) {
    declinePartialBtn.addEventListener('click', () => {
      buyerDeclinePartialRefund(dispute.id);
      showToast(lang === 'uz' ? 'Taklif rad etildi' : 'Offer declined', 'warning');
      setTimeout(() => navigateTo(`/dispute/${orderId}`), 500);
    });
  }

  // Ship return
  const shipBtn = document.getElementById('ship-return-btn');
  if (shipBtn && dispute) {
    shipBtn.addEventListener('click', () => {
      buyerShippedReturn(dispute.id);
      showToast(lang === 'uz' ? 'Qaytarish jo\'natilgan deb belgilandi' : 'Return marked as shipped', 'info');
      setTimeout(() => navigateTo(`/dispute/${orderId}`), 500);
    });
  }

  // Auto-refresh for dispute updates
  if (disputeRefreshInterval) clearInterval(disputeRefreshInterval);
  if (dispute && !dispute.status.startsWith('resolved_') && dispute.resolution !== 'no_refund') {
    disputeRefreshInterval = setInterval(() => {
      const currentDispute = store.getById('disputes', dispute.id);
      if (!currentDispute) {
        clearInterval(disputeRefreshInterval);
        return;
      }
      const timelineEl = document.getElementById('dispute-timeline');
      if (timelineEl && currentDispute.statusHistory.length > timelineEl.querySelectorAll('.timeline-step').length) {
        navigateTo(`/dispute/${orderId}`);
        clearInterval(disputeRefreshInterval);
      }
    }, 2000);
  }
}

export function cleanupDispute() {
  if (disputeRefreshInterval) {
    clearInterval(disputeRefreshInterval);
    disputeRefreshInterval = null;
  }
}
