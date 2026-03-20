// ==========================================
// ReUz — Transaction Chat Page (supports both order & product conversations)
// ==========================================

import { store } from '../store.js';
import { formatPrice } from '../logic/pricing.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';
import { getLanguage } from '../i18n.js';

const DISPUTE_REASONS = [
  { id: 'not_received', label: 'Item not received', description: 'I never received the item' },
  { id: 'damaged', label: 'Item damaged', description: 'Item arrived damaged' },
  { id: 'not_as_described', label: 'Not as described', description: 'Item significantly differs from listing' }
];

let chatRefreshInterval = null;
let chatStoreUnsubscriber = null;
let chatOrderUnsubscriber = null;

export async function renderChatPage(orderId) {
  const user = store.getCurrentUser();
  if (!user) { navigateTo('/login'); return ''; }

  let order = store.getById('orders', orderId);
  if (!order) {
    try { order = await store.getOrder(orderId); } catch {}
  }
  if (!order) { navigateTo('/orders'); return ''; }

  const product = store.getById('products', order.productId);
  const isBuyer = order.buyerId === user.id;
  const isSeller = order.sellerId === user.id;
  let otherUser = store.getById('users', isBuyer ? order.sellerId : order.buyerId);
  if (!otherUser) {
    try { otherUser = await store.getUser(isBuyer ? order.sellerId : order.buyerId); } catch {}
  }
  const lang = getLanguage();

  let conv;
  try {
    conv = await store.getConversationByOrder(orderId);
  } catch {}
  if (!conv) { navigateTo('/orders'); return ''; }

  const dispute = order.disputeId ? store.getById('disputes', order.disputeId) : null;

  const L = getChatLabels(lang);

  const statusLabels = {
    paid: lang === 'uz' ? 'To\'langan' : 'Paid',
    shipped: lang === 'uz' ? 'Jo\'natilgan' : 'Shipped',
    delivered: lang === 'uz' ? 'Yetkazilgan' : 'Delivered',
    completed: lang === 'uz' ? 'Bajarilgan' : 'Completed',
    cancelled: lang === 'uz' ? 'Bekor qilingan' : 'Cancelled',
    disputed: lang === 'uz' ? 'Nizolashgan' : 'Disputed',
    refunded: lang === 'uz' ? 'Qaytarilgan' : 'Refunded'
  };
  const statusColors = {
    paid: 'badge-info', shipped: 'badge-warning', delivered: 'badge-success',
    completed: 'badge-success', cancelled: 'badge-error', disputed: 'badge-error', refunded: 'badge-warning'
  };

  const isEnded = ['completed', 'cancelled', 'refunded'].includes(order.status);
  const isResolved = dispute && dispute.status.startsWith('resolved_');

  return `
    <div class="chat-page">
      <div class="chat-container">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-image">
            ${product?.images?.[0] ? `<img src="${product.images[0]}" alt="${product?.title || ''}" />` : '<div style="width:100%;height:100%;background:var(--bg-elevated);"></div>'}
          </div>
          <div class="chat-header-info">
            <div class="chat-header-title">${product?.title || L.item}</div>
            <div class="chat-header-subtitle">
              <span>${order.pricing?.buyerPays ? formatPrice(order.pricing.buyerPays) : formatPrice(0)}</span>
              <span>&middot;</span>
              <span>${L.with} ${otherUser?.name || '?'}</span>
            </div>
          </div>
          <div class="chat-header-actions">
            <span class="badge ${statusColors[order.status] || 'badge-neutral'}">${statusLabels[order.status] || order.status}</span>
          </div>
        </div>

        <!-- Escalated Banner -->
        ${conv.escalated ? `
          <div class="chat-escalated-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>${L.escalated}</span>
          </div>
        ` : ''}

        <!-- Messages Area -->
        <div class="chat-messages" id="chat-messages">
          ${renderMessages(conv, user.id, lang, L)}
        </div>

        <!-- Sticky Order Status Tracker -->
        ${renderStatusTracker(order, dispute, isBuyer, isSeller, L)}

        <!-- Bottom: Input + Footer (ALWAYS visible) -->
        <div class="chat-bottom">
          <div class="chat-input-bar">
            <input type="text" id="chat-input" placeholder="${isEnded ? L.chatEnded : L.placeholder}" autocomplete="off" ${isEnded && isResolved ? 'disabled' : ''} />
            <button class="chat-send-btn" id="chat-send-btn" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
          ${isBuyer && !isEnded ? `
            <div class="chat-footer-link">
              <a id="chat-report-link">${L.report}</a>
            </div>
          ` : ''}
        </div>

        <!-- Report Overlay (hidden by default) -->
        <div id="chat-report-overlay" style="display: none;"></div>
      </div>
    </div>
  `;
}

/**
 * Render a product-based conversation (pre-purchase messaging).
 */
export async function renderProductChatPage(convId) {
  const user = store.getCurrentUser();
  if (!user) { navigateTo('/login'); return ''; }

  let conv;
  try {
    conv = await store.getConversation(convId);
  } catch {}
  if (!conv) { navigateTo('/messages'); return ''; }

  const product = conv.productId ? store.getById('products', conv.productId) : null;
  const otherUserId = conv.buyerId === user.id ? conv.sellerId : conv.buyerId;
  let otherUser = store.getById('users', otherUserId);
  if (!otherUser) {
    try { otherUser = await store.getUser(otherUserId); } catch {}
  }
  const lang = getLanguage();
  const L = getChatLabels(lang);

  return `
    <div class="chat-page">
      <div class="chat-container">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-image">
            ${product?.images?.[0] ? `<img src="${product.images[0]}" alt="${product?.title || ''}" />` : '<div style="width:100%;height:100%;background:var(--bg-elevated);"></div>'}
          </div>
          <div class="chat-header-info">
            <div class="chat-header-title">${product?.title || L.item}</div>
            <div class="chat-header-subtitle">
              ${product ? `<span>${formatPrice(product.price)}</span><span>&middot;</span>` : ''}
              <span>${L.with} ${otherUser?.name || '?'}</span>
            </div>
          </div>
          <div class="chat-header-actions">
            ${product && !product.sold ? `
              <button class="btn btn-primary btn-sm" id="pchat-buy-btn">${lang === 'uz' ? 'Sotib olish' : 'Buy now'}</button>
            ` : ''}
            <button class="btn btn-ghost btn-sm" id="pchat-back-btn" title="${lang === 'uz' ? 'Orqaga' : 'Back'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="chat-messages" id="chat-messages">
          ${renderMessages(conv, user.id, lang, L)}
        </div>

        <!-- Bottom: Input -->
        <div class="chat-bottom">
          <div class="chat-input-bar">
            <input type="text" id="chat-input" placeholder="${L.placeholder}" autocomplete="off" />
            <button class="chat-send-btn" id="chat-send-btn" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getChatLabels(lang) {
  return {
    with: lang === 'uz' ? 'bilan' : 'with',
    placeholder: lang === 'uz' ? 'Xabar yozing...' : 'Type a message...',
    report: lang === 'uz' ? 'Muammo xabar qilish' : 'Report a problem',
    escalated: lang === 'uz' ? 'ReUz qo\'llab-quvvatlash xizmati suhbatga qo\'shilgan' : 'ReUz support has joined this conversation',
    confirm: lang === 'uz' ? 'Buyurtmani tasdiqlash' : 'Confirm Order',
    confirmBtn: lang === 'uz' ? 'Hammasi yaxshi' : 'Everything is OK',
    cancel: lang === 'uz' ? 'Bekor qilish' : 'Cancel Order',
    acceptReturn: lang === 'uz' ? 'Qaytarishni qabul qilish' : 'Accept Return',
    reject: lang === 'uz' ? 'Rad etish' : 'Reject',
    shipReturn: lang === 'uz' ? 'Qaytarishni jo\'natish' : 'Ship Return',
    escalate: lang === 'uz' ? 'ReUz ga yuborish' : 'Escalate to ReUz',
    orderDetails: lang === 'uz' ? 'Buyurtma tafsilotlari' : 'Order details',
    item: lang === 'uz' ? 'Buyum' : 'Item',
    chatEnded: lang === 'uz' ? 'Bu suhbat yakunlangan' : 'This conversation has ended',
    selectIssue: lang === 'uz' ? 'Muammo turini tanlang' : 'Select the type of issue',
    cancelBtn: lang === 'uz' ? 'Bekor qilish' : 'Cancel',
    emptyChat: lang === 'uz' ? 'Hali xabar yo\'q. Suhbatni boshlang!' : 'No messages yet. Start the conversation!',
  };
}

function renderMessages(conv, currentUserId, lang, L) {
  if (!conv.messages || conv.messages.length === 0) {
    return `<div class="chat-system-message system-info"><span>${L.emptyChat}</span></div>`;
  }

  return conv.messages.map(msg => {
    if (msg.type === 'system') {
      // Filter out order tracking messages — these are shown in the status tracker instead
      const trackingPatterns = [
        /Offer accepted/i, /Creating order/i, /Payment confirmed/i,
        /Item shipped/i, /Tracking:/i, /Item delivered/i,
        /Review window expired/i, /auto-completed/i, /payout released/i,
        /Delivery starting/i, /Order complete/i, /Buyer confirmed/i
      ];
      const isTrackingMsg = trackingPatterns.some(p => p.test(msg.text));
      if (isTrackingMsg) return ''; // Don't render as chat bubble

      const subtypeClass = msg.subtype ? `system-${msg.subtype}` : '';
      const icon = getSystemIcon(msg.subtype);
      return `
        <div class="chat-system-message ${subtypeClass}">
          <span class="chat-system-message-icon">${icon}</span>
          <span>${msg.text}</span>
        </div>
      `;
    }

    // Offer messages — special card
    if (msg.type === 'offer') {
      const isSent = msg.senderId === currentUserId;
      const sender = store.getById('users', msg.senderId);
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const offer = msg.offerId ? store.getById('offers', msg.offerId) : null;
      const status = offer?.status || msg.offerStatus || 'pending';

      const statusLabel = {
        pending: lang === 'uz' ? 'Kutilmoqda' : 'Pending',
        accepted: lang === 'uz' ? 'Qabul qilindi' : 'Accepted',
        rejected: lang === 'uz' ? 'Rad etildi' : 'Declined',
        countered: lang === 'uz' ? 'Qarshi taklif' : 'Countered'
      };
      const statusColors = {
        pending: '#FFB800', accepted: '#00FF9D', rejected: '#FF4D6A', countered: '#4D9DFF'
      };

      // Only show action buttons if the offer is pending and the current user is the recipient (not the sender)
      const canAct = status === 'pending' && msg.senderId !== currentUserId;

      return `
        <div class="chat-message ${isSent ? 'sent' : 'received'}">
          <div class="chat-message-avatar">${sender?.name?.charAt(0) || '?'}</div>
          <div>
            <div class="chat-offer-card">
              <div class="chat-offer-header">
                <span>💰 ${msg.isCounter ? (lang === 'uz' ? 'Qarshi taklif' : 'Counter offer') : (lang === 'uz' ? 'Taklif' : 'Offer')}</span>
                <span class="chat-offer-status" style="color: ${statusColors[status] || '#A0A0B8'}">${statusLabel[status] || status}</span>
              </div>
              <div class="chat-offer-amount">${formatPrice(msg.offerAmount)}</div>
              ${canAct ? `
                <div class="chat-offer-actions">
                  <button class="btn btn-primary btn-sm offer-accept-btn" data-offer-id="${msg.offerId}">✓ ${lang === 'uz' ? 'Qabul' : 'Accept'}</button>
                  <button class="btn btn-secondary btn-sm offer-counter-btn" data-offer-id="${msg.offerId}" data-offer-amount="${msg.offerAmount}">↺ ${lang === 'uz' ? 'Qarshi' : 'Counter'}</button>
                  <button class="btn btn-ghost btn-sm offer-reject-btn" data-offer-id="${msg.offerId}">✗ ${lang === 'uz' ? 'Rad' : 'Decline'}</button>
                </div>
              ` : ''}
            </div>
            <span class="chat-message-time">${time}</span>
          </div>
        </div>
      `;
    }

    const isSent = msg.senderId === currentUserId;
    const sender = store.getById('users', msg.senderId);
    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="chat-message ${isSent ? 'sent' : 'received'}">
        <div class="chat-message-avatar">${sender?.name?.charAt(0) || '?'}</div>
        <div>
          <div class="chat-message-bubble">${escapeHtml(msg.text)}</div>
          <span class="chat-message-time">${time}</span>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getSystemIcon(subtype) {
  switch (subtype) {
    case 'success': return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    case 'warning': return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    case 'error': return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    default: return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  }
}

function renderStatusTracker(order, dispute, isBuyer, isSeller, L) {
  const status = order.status;

  // 5-step courier-style delivery timeline
  const steps = [
    { id: 'pickup', label: 'Pickup', statusMatch: ['paid'] },
    { id: 'processing', label: 'Processing', statusMatch: [] },
    { id: 'transit', label: 'In Transit', statusMatch: ['shipped'] },
    { id: 'out_delivery', label: 'Out for Delivery', statusMatch: [] },
    { id: 'delivered', label: 'Delivered', statusMatch: ['delivered', 'completed'] }
  ];

  // Map order status → timeline completion level
  const progressMap = { paid: 0, shipped: 2, delivered: 4, completed: 4, disputed: 4, cancelled: -1, refunded: 4 };
  const progress = progressMap[status] ?? -1;
  const isDisputed = status === 'disputed';
  const isCancelled = status === 'cancelled';
  const isRefunded = status === 'refunded';
  const isCompleted = status === 'completed';

  const stepsHtml = steps.map((step, i) => {
    let cls = '';
    if (isCancelled) {
      cls = i === 0 ? 'completed' : '';
    } else if (i < progress) {
      cls = 'completed';
    } else if (i === progress) {
      if (isCompleted) cls = 'completed';
      else if (isDisputed) cls = 'error';
      else cls = 'active';
    }

    const isLast = i === steps.length - 1;
    const dotContent = cls === 'completed' ? '✓' : (cls === 'error' ? '!' : (i + 1));
    let label = step.label;
    if (isDisputed && i === progress) label = 'Disputed';
    if (isCompleted && i === progress) label = 'Completed';

    return `
      <div class="status-step ${cls}">
        <div class="status-step-dot">${dotContent}</div>
        <span class="status-step-label">${label}</span>
        ${!isLast ? '<div class="status-step-line"></div>' : ''}
      </div>
    `;
  }).join('');

  // Info text — no tracking codes, no payout messages
  let infoHtml = '';
  if (status === 'paid') infoHtml = '<div class="status-info">Order placed. Seller is preparing your item.</div>';
  else if (status === 'shipped') infoHtml = '<div class="status-info">Your item is on its way to you.</div>';
  else if (status === 'delivered') infoHtml = '<div class="status-info">Your item has been delivered. Please review it.</div>';
  else if (isCompleted) infoHtml = '<div class="status-info">Order completed successfully.</div>';
  else if (isCancelled) infoHtml = '<div class="status-info">This order was cancelled.</div>';
  else if (isRefunded) infoHtml = '<div class="status-info">Refund processed. Order closed.</div>';
  else if (isDisputed) {
    const reason = dispute?.reason || 'issue reported';
    infoHtml = `<div class="status-info">⚠️ Dispute: <strong>${reason.replace(/_/g, ' ')}</strong>. Payment is held until resolved.</div>`;
  }

  // Role-based action buttons
  let actionsHtml = '';

  if (isBuyer && status === 'paid') {
    actionsHtml = `<div class="status-actions">
      <button class="btn btn-ghost btn-sm" id="chat-cancel-btn">Cancel Order</button>
    </div>`;
  }

  if (isBuyer && status === 'delivered' && !dispute) {
    actionsHtml = `<div class="status-actions">
      <button class="btn btn-primary btn-sm" id="chat-confirm-btn">✓ ${L.confirmBtn}</button>
      <button class="btn btn-danger btn-sm" id="chat-report-btn">⚠ Report an Issue</button>
    </div>`;
  }

  if (isSeller && status === 'delivered') {
    actionsHtml = `<div class="status-actions">
      <div class="status-info" style="margin:0">Waiting for buyer to confirm receipt</div>
    </div>`;
  }

  // Dispute actions
  if (isDisputed && dispute) {
    if (isSeller && ['open', 'under_review'].includes(dispute.status) && !dispute.sellerResponse) {
      actionsHtml = `<div class="status-actions">
        <button class="btn btn-primary btn-sm" id="chat-accept-return-btn">Accept Return</button>
        <button class="btn btn-secondary btn-sm" id="chat-partial-refund-btn">Offer Partial Refund</button>
      </div>`;
    }
    if (isBuyer && dispute.status === 'partial_offered') {
      const amt = dispute.partialAmount ? formatPrice(dispute.partialAmount) : '';
      actionsHtml = `<div class="status-actions">
        <div class="status-info" style="margin:0">Seller offered partial refund${amt ? ': <strong>' + amt + '</strong>' : ''}</div>
        <button class="btn btn-primary btn-sm" id="chat-accept-partial-btn">Accept</button>
        <button class="btn btn-ghost btn-sm" id="chat-decline-partial-btn">Decline</button>
      </div>`;
    }
    if (isBuyer && dispute.status === 'return_required') {
      actionsHtml = `<div class="status-actions">
        <button class="btn btn-primary btn-sm" id="chat-ship-return-btn">Ship Return</button>
      </div>`;
    }
    // Buyer can also report additional details during dispute
    if (isBuyer && ['open', 'under_review'].includes(dispute.status)) {
      actionsHtml += `<div class="status-info" style="margin-top:var(--space-2xs)">Waiting for seller to respond</div>`;
    }
  }

  return `
    <div class="chat-status-tracker" id="chat-status-tracker">
      <div class="status-steps">${stepsHtml}</div>
      ${infoHtml}
      ${actionsHtml}
    </div>
  `;
}

function renderReportOverlay(lang) {
  const L = {
    title: lang === 'uz' ? 'Muammo xabar qilish' : 'Report a Problem',
    cancel: lang === 'uz' ? 'Bekor qilish' : 'Cancel',
  };

  const reasons = DISPUTE_REASONS.map(r => ({
    ...r,
    label: lang === 'uz' ? getDisputeReasonUz(r.id).label : r.label,
    description: lang === 'uz' ? getDisputeReasonUz(r.id).description : r.description
  }));

  const disputeIcons = {
    not_received: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><line x1="1" y1="3" x2="23" y2="16"/></svg>',
    damaged: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    not_as_described: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
  };

  return `
    <div class="chat-report-overlay">
      <div class="chat-report-header">
        <span class="chat-report-header-title">${L.title}</span>
        <button class="chat-report-close" id="chat-report-close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="chat-report-body">
        <div class="chat-report-reasons">
          ${reasons.map(r => `
            <div class="chat-report-reason" data-reason="${r.id}">
              <span class="chat-report-reason-icon">${disputeIcons[r.id] || ''}</span>
              <div>
                <div class="font-semibold text-sm">${r.label}</div>
                <div class="text-xs text-muted">${r.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="chat-report-cancel-row">
        <button class="btn btn-ghost btn-full btn-sm" id="chat-report-cancel-btn">${L.cancel}</button>
      </div>
    </div>
  `;
}

function getDisputeReasonUz(id) {
  const map = {
    'not_received': { label: 'Olinmagan', description: 'Buyumni olmadim' },
    'damaged': { label: 'Shikastlangan', description: 'Buyum shikastlangan holda keldi' },
    'not_as_described': { label: 'Tavsifga mos kelmaydi', description: 'Buyum e\'londan sezilarli farq qiladi' }
  };
  return map[id] || { label: id, description: '' };
}

// ========== EVENT HANDLERS ==========

export async function attachChatEvents(orderId) {
  const user = store.getCurrentUser();
  if (!user) return;

  const order = store.getById('orders', orderId);
  if (!order) return;

  const conv = store.getById('conversations', orderId) ||
    store.filter('conversations', c => c.orderId === orderId)[0];
  let convId = conv?.id;
  if (!convId) {
    try {
      const c = await store.getConversationByOrder(orderId);
      convId = c?.id;
    } catch {}
  }
  if (!convId) return;

  // Mark as read
  try { await store.markConversationRead(convId); } catch {}

  const lang = getLanguage();
  const isBuyer = order.buyerId === user.id;
  const dispute = order.disputeId ? store.getById('disputes', order.disputeId) : null;

  scrollToBottom();
  setupChatInput(convId, user.id, orderId);
  attachOfferActionButtons(convId, user.id);

  // === Report a problem (from status tracker "I Have a Problem" button) ===
  const reportBtn = document.getElementById('chat-report-btn');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      openReportPanel(orderId, lang);
    });
  }

  // Also keep footer link
  const reportLink = document.getElementById('chat-report-link');
  if (reportLink) {
    reportLink.addEventListener('click', (e) => {
      e.preventDefault();
      openReportPanel(orderId, lang);
    });
  }

  // === Action buttons ===
  bindActionBtn('chat-confirm-btn', async () => {
    const btn = document.getElementById('chat-confirm-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner spinner-xs"></span> Confirming...';
    }
    try {
      await store.confirmOrder(orderId);
      showToast('✅ Order confirmed. Payment released to seller.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to confirm order', 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '✓ Everything is OK';
      }
      return;
    }
    // Refresh the status tracker in-place
    refreshStatusTracker(orderId);
  });

  bindActionBtn('chat-cancel-btn', async () => {
    try { await store.cancelOrder(orderId); } catch {}
    reloadChat(orderId);
  });

  if (dispute) {
    bindActionBtn('chat-accept-return-btn', async () => {
      try {
        await store.apiPut(`/disputes/${dispute.id}/accept-return`);
        showToast('Return accepted', 'success');
      } catch {}
      reloadChat(orderId);
    });

    bindActionBtn('chat-partial-refund-btn', () => {
      // Open inline partial refund input
      const tracker = document.getElementById('chat-status-tracker');
      const actionsDiv = tracker?.querySelector('.status-actions');
      if (actionsDiv) {
        actionsDiv.innerHTML = `
          <div class="partial-refund-row">
            <span class="text-xs">$</span>
            <input type="number" id="partial-amount" placeholder="Amount" min="1" step="0.50" />
            <button class="btn btn-primary btn-sm" id="send-partial-btn">Send</button>
            <button class="btn btn-ghost btn-sm" id="cancel-partial-btn">✗</button>
          </div>
        `;
        document.getElementById('send-partial-btn')?.addEventListener('click', async () => {
          const amt = parseFloat(document.getElementById('partial-amount')?.value);
          if (!amt || amt <= 0) { showToast('Enter a valid amount', 'error'); return; }
          try {
            await store.apiPut(`/disputes/${dispute.id}/partial-refund`, { amount: amt });
            showToast('Partial refund offer sent', 'success');
          } catch (e) { showToast(e.message, 'error'); }
          reloadChat(orderId);
        });
        document.getElementById('cancel-partial-btn')?.addEventListener('click', () => reloadChat(orderId));
      }
    });

    bindActionBtn('chat-accept-partial-btn', async () => {
      try {
        await store.apiPut(`/disputes/${dispute.id}/buyer-accept`);
        showToast('Partial refund accepted', 'success');
      } catch {}
      reloadChat(orderId);
    });

    bindActionBtn('chat-decline-partial-btn', async () => {
      try {
        await store.apiPut(`/disputes/${dispute.id}/buyer-decline`);
        showToast('Offer declined — dispute escalated', 'info');
      } catch {}
      reloadChat(orderId);
    });

    bindActionBtn('chat-ship-return-btn', async () => {
      try {
        await store.apiPut(`/disputes/${dispute.id}/ship-return`);
        showToast('Return shipped', 'success');
      } catch {}
      reloadChat(orderId);
    });
  }

  // === Event-driven refresh via store listener ===
  startChatListener(convId, orderId, user.id);

  // === Real-time order status updates (progress bar, badge, buttons) ===
  if (chatOrderUnsubscriber) { chatOrderUnsubscriber(); chatOrderUnsubscriber = null; }
  chatOrderUnsubscriber = store.on('order:update', (data) => {
    if (data.orderId === orderId) {
      refreshStatusTracker(orderId);
      // Also update the header badge
      const badgeEl = document.querySelector('.chat-header-actions .badge');
      if (badgeEl && data.status) {
        const statusLabels = {
          paid: 'Paid', shipped: 'Shipped', delivered: 'Delivered',
          completed: 'Completed', cancelled: 'Cancelled', disputed: 'Disputed', refunded: 'Refunded'
        };
        const statusColors = {
          paid: 'badge-info', shipped: 'badge-warning', delivered: 'badge-success',
          completed: 'badge-success', cancelled: 'badge-error', disputed: 'badge-error', refunded: 'badge-warning'
        };
        badgeEl.className = `badge ${statusColors[data.status] || 'badge-neutral'}`;
        badgeEl.textContent = statusLabels[data.status] || data.status;
      }
    }
  });
}

export async function attachProductChatEvents(convId) {
  const user = store.getCurrentUser();
  if (!user) return;

  let conv;
  try {
    conv = await store.getConversation(convId);
  } catch {}
  if (!conv) return;

  // Mark as read
  try { await store.markConversationRead(conv.id); } catch {}

  scrollToBottom();
  setupChatInput(conv.id, user.id, null, convId);
  attachOfferActionButtons(conv.id, user.id);

  // Buy button
  const buyBtn = document.getElementById('pchat-buy-btn');
  if (buyBtn && conv.productId) {
    buyBtn.addEventListener('click', () => navigateTo(`/checkout/${conv.productId}`));
  }

  // Back button
  const backBtn = document.getElementById('pchat-back-btn');
  if (backBtn) backBtn.addEventListener('click', () => navigateTo('/messages'));

  // Event-driven refresh
  startChatListener(conv.id, null, user.id);
}

function setupChatInput(conversationId, userId, orderId, convId) {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  if (chatInput && sendBtn) {
    chatInput.addEventListener('input', () => {
      sendBtn.disabled = !chatInput.value.trim();
    });

    const send = async () => {
      if (chatInput.value.trim()) {
        const text = chatInput.value.trim();
        chatInput.value = '';
        sendBtn.disabled = true;
        try {
          await store.sendMessage(conversationId, text);
          // Real-time update happens via Socket.IO
          refreshMessages(conversationId, userId);
        } catch (err) {
          showToast('Failed to send message', 'error');
        }
      }
    };

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') send();
    });

    sendBtn.addEventListener('click', send);

    // Focus the input
    chatInput.focus();
  }
}

function bindActionBtn(id, handler) {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', handler);
}

async function openReportPanel(orderId, lang) {
  const overlay = document.getElementById('chat-report-overlay');
  if (!overlay) return;

  // Re-fetch fresh order state before checking (cache may be stale)
  let freshOrder;
  try {
    freshOrder = await store.getOrder(orderId);
  } catch {
    freshOrder = store.getById('orders', orderId);
  }
  if (!freshOrder) return;

  if (freshOrder.status !== 'delivered') {
    showToast(lang === 'uz' ? 'Muammo faqat yetkazilgan buyurtmalar uchun xabar qilinishi mumkin' : 'Issues can only be reported for delivered orders', 'error');
    return;
  }

  // Check 48h time window
  if (freshOrder.deliveredAt && (Date.now() - freshOrder.deliveredAt) > 120000) {
    showToast(lang === 'uz' ? 'Muammo xabar qilish muddati tugagan (48 soat)' : 'Report window expired (48 hours from delivery)', 'error');
    return;
  }

  if (freshOrder.disputeId) {
    showToast(lang === 'uz' ? 'Bu buyurtma uchun nizo allaqachon ochilgan' : 'A dispute is already open for this order', 'info');
    return;
  }

  overlay.style.display = 'block';
  overlay.innerHTML = renderReportOverlay(lang);

  const closeBtn = document.getElementById('chat-report-close');
  if (closeBtn) closeBtn.addEventListener('click', () => closeReportPanel());

  const cancelBtn = document.getElementById('chat-report-cancel-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', () => closeReportPanel());

  overlay.querySelectorAll('.chat-report-reason').forEach(card => {
    card.addEventListener('click', async () => {
      const reason = card.dataset.reason;
      const reasonObj = DISPUTE_REASONS.find(r => r.id === reason);
      const desc = lang === 'uz' ? getDisputeReasonUz(reason).label : (reasonObj?.label || reason);

      closeReportPanel();
      try {
        await store.openDispute(orderId, reason, desc);
        reloadChat(orderId);
      } catch (err) {
        showToast(err.message || 'Failed to open dispute', 'error');
      }
    });
  });
}

function closeReportPanel() {
  const overlay = document.getElementById('chat-report-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.innerHTML = '';
  }
}

async function refreshMessages(conversationId, userId) {
  try {
    const messages = await store.getMessages(conversationId);
    const conv = store.getById('conversations', conversationId) || { messages };
    conv.messages = messages;
    const lang = getLanguage();
    const L = getChatLabels(lang);

    const messagesEl = document.getElementById('chat-messages');
    if (messagesEl) {
      messagesEl.innerHTML = renderMessages(conv, userId, lang, L);
      attachOfferActionButtons(conversationId, userId);
      scrollToBottom();
    }
  } catch (err) {
    console.error('Failed to refresh messages:', err);
  }
}

function attachOfferActionButtons(conversationId, userId) {
  const lang = getLanguage();

  // Accept buttons
  document.querySelectorAll('.offer-accept-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const offerId = btn.dataset.offerId;
      try {
        await store.acceptOffer(offerId);
        showToast(lang === 'uz' ? 'Taklif qabul qilindi!' : 'Offer accepted!', 'success');
      } catch (err) {
        showToast(err.message || 'Failed', 'error');
      }
      refreshMessages(conversationId, userId);
    });
  });

  // Reject buttons
  document.querySelectorAll('.offer-reject-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const offerId = btn.dataset.offerId;
      try {
        await store.rejectOffer(offerId);
        showToast(lang === 'uz' ? 'Taklif rad etildi' : 'Offer declined', 'info');
      } catch {}
      refreshMessages(conversationId, userId);
    });
  });

  // Counter buttons
  document.querySelectorAll('.offer-counter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const offerId = btn.dataset.offerId;
      const currentAmount = parseFloat(btn.dataset.offerAmount) || 0;
      openCounterModal(offerId, currentAmount, conversationId, userId, lang);
    });
  });
}

function openCounterModal(offerId, currentAmount, conversationId, userId, lang) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'counter-offer-modal';
  overlay.id = 'counter-offer-modal';
  overlay.innerHTML = `
    <div class="counter-offer-body">
      <div class="font-semibold" style="margin-bottom: var(--space-xs);">${lang === 'uz' ? 'Qarshi taklif' : 'Counter Offer'}</div>
      <div class="text-xs text-muted">${lang === 'uz' ? 'Joriy taklif' : 'Current offer'}: ${formatPrice(currentAmount)}</div>
      <input type="number" id="counter-amount" placeholder="0.00" step="0.50" min="1" value="${(currentAmount * 1.1).toFixed(2)}" />
      <div style="display: flex; gap: var(--space-sm);">
        <button class="btn btn-ghost" id="counter-cancel" style="flex:1">${lang === 'uz' ? 'Bekor' : 'Cancel'}</button>
        <button class="btn btn-primary" id="counter-send" style="flex:1">${lang === 'uz' ? 'Yuborish' : 'Send'}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.getElementById('counter-cancel')?.addEventListener('click', () => overlay.remove());

  document.getElementById('counter-send')?.addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('counter-amount')?.value);
    if (!amount || amount <= 0) {
      showToast(lang === 'uz' ? 'Narx kiriting' : 'Enter a price', 'error');
      return;
    }
    overlay.remove();
    try {
      await store.counterOffer(offerId, amount);
      showToast(lang === 'uz' ? `${formatPrice(amount)} qarshi taklif yuborildi` : `Counter offer of ${formatPrice(amount)} sent`, 'success');
    } catch {}
    refreshMessages(conversationId, userId);
  });
}

async function refreshStatusTracker(orderId) {
  const user = store.getCurrentUser();
  if (!user) return;

  // Re-fetch fresh order
  let order;
  try {
    order = await store.getOrder(orderId);
  } catch {
    order = store.getById('orders', orderId);
  }
  if (!order) return;

  const lang = getLanguage();
  const L = getChatLabels(lang);
  const isBuyer = order.buyerId === user.id;
  const isSeller = order.sellerId === user.id;

  let dispute = null;
  if (order.disputeId) {
    try {
      dispute = await store.getDispute(order.disputeId);
    } catch {
      dispute = store.getById('disputes', order.disputeId);
    }
  }

  const trackerEl = document.getElementById('chat-status-tracker');
  if (trackerEl) {
    // Add transition class
    trackerEl.classList.add('tracker-updating');
    setTimeout(() => {
      trackerEl.outerHTML = renderStatusTracker(order, dispute, isBuyer, isSeller, L);
      const newTracker = document.getElementById('chat-status-tracker');
      if (newTracker) {
        newTracker.classList.add('tracker-updated');
        setTimeout(() => newTracker.classList.remove('tracker-updated'), 600);
      }
      // Re-attach action button events
      reattachTrackerButtons(orderId, dispute, lang);
    }, 150);
  }
}

function reattachTrackerButtons(orderId, dispute, lang) {
  bindActionBtn('chat-confirm-btn', async () => {
    const btn = document.getElementById('chat-confirm-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner spinner-xs"></span> Confirming...';
    }
    try {
      await store.confirmOrder(orderId);
      showToast('✅ Order confirmed. Payment released to seller.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to confirm order', 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '✓ Everything is OK';
      }
      return;
    }
    refreshStatusTracker(orderId);
  });

  bindActionBtn('chat-cancel-btn', async () => {
    try { await store.cancelOrder(orderId); } catch {}
    reloadChat(orderId);
  });

  bindActionBtn('chat-report-btn', () => {
    openReportPanel(orderId, lang);
  });

  if (dispute) {
    bindActionBtn('chat-accept-return-btn', async () => {
      try {
        await store.apiPut(`/disputes/${dispute.id}/accept-return`);
        showToast('Return accepted', 'success');
      } catch {}
      refreshStatusTracker(orderId);
    });

    bindActionBtn('chat-accept-partial-btn', async () => {
      try {
        await store.apiPut(`/disputes/${dispute.id}/buyer-accept`);
        showToast('Partial refund accepted', 'success');
      } catch {}
      refreshStatusTracker(orderId);
    });

    bindActionBtn('chat-decline-partial-btn', async () => {
      try {
        await store.apiPut(`/disputes/${dispute.id}/buyer-decline`);
        showToast('Offer declined — dispute escalated', 'info');
      } catch {}
      refreshStatusTracker(orderId);
    });

    bindActionBtn('chat-ship-return-btn', async () => {
      try {
        await store.apiPut(`/disputes/${dispute.id}/ship-return`);
        showToast('Return shipped', 'success');
      } catch {}
      refreshStatusTracker(orderId);
    });
  }
}

function reloadChat(orderId) {
  setTimeout(() => navigateTo(`/chat/${orderId}`), 400);
}

function scrollToBottom() {
  const messagesEl = document.getElementById('chat-messages');
  if (messagesEl) {
    setTimeout(() => { messagesEl.scrollTop = messagesEl.scrollHeight; }, 50);
  }
}

function startChatListener(conversationId, orderId, userId) {
  // Clean up previous
  cleanupChat();

  let lastCount = 0;
  const conv = store.getById('conversations', conversationId);
  if (conv) lastCount = conv.messages.length;

  chatStoreUnsubscriber = store.on('chat:message', (msg) => {
    if (msg.conversationId === conversationId) {
      refreshMessages(conversationId, userId);
      store.markConversationRead(conversationId).catch(() => {});
    }
  });

  // Also join the socket room
  store.joinConversation(conversationId);
}

export function cleanupChat() {
  if (chatRefreshInterval) {
    clearInterval(chatRefreshInterval);
    chatRefreshInterval = null;
  }
  if (chatStoreUnsubscriber) {
    chatStoreUnsubscriber();
    chatStoreUnsubscriber = null;
  }
  if (chatOrderUnsubscriber) {
    chatOrderUnsubscriber();
    chatOrderUnsubscriber = null;
  }
}
