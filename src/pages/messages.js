// ==========================================
// ReUz — Messages / Conversations List Page (API-backed)
// ==========================================

import { store } from '../store.js';
import { navigateTo } from '../router.js';
import { getLanguage } from '../i18n.js';

export async function renderMessagesPage() {
  const user = store.getCurrentUser();
  if (!user) { navigateTo('/login'); return ''; }
  const lang = getLanguage();

  let conversations = [];
  try {
    conversations = await store.getConversations();
  } catch {}

  const L = {
    title: lang === 'uz' ? 'Xabarlar' : 'Messages',
    noMessages: lang === 'uz' ? 'Hali xabar yo\'q' : 'No messages yet',
    noMessagesDesc: lang === 'uz' ? 'Sotuvchiga xabar yuboring yoki buyum sotib oling' : 'Message a seller or purchase an item to start chatting',
    you: lang === 'uz' ? 'Siz' : 'You',
    order: lang === 'uz' ? 'Buyurtma' : 'Order',
  };

  if (conversations.length === 0) {
    return `
      <div class="page">
        <div class="container-narrow">
          <h1 style="margin-bottom: var(--space-xl);">${L.title}</h1>
          <div class="empty-state">
            <div class="empty-state-icon">💬</div>
            <div class="empty-state-title">${L.noMessages}</div>
            <div class="empty-state-desc">${L.noMessagesDesc}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Fetch user data for all conversations
  const userCache = {};
  for (const conv of conversations) {
    const otherUserId = conv.buyerId === user.id ? conv.sellerId : conv.buyerId;
    if (!userCache[otherUserId]) {
      userCache[otherUserId] = store.getById('users', otherUserId);
      if (!userCache[otherUserId]) {
        try { userCache[otherUserId] = await store.getUser(otherUserId); } catch {}
      }
    }
  }

  const convItems = conversations.map(conv => {
    const otherUserId = conv.buyerId === user.id ? conv.sellerId : conv.buyerId;
    const otherUser = userCache[otherUserId];
    const product = conv.productId ? store.getById('products', conv.productId) : null;

    // Last message
    const lastMsg = conv.lastMessage || (conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null);

    let lastMsgPreview = '';
    let lastMsgTime = '';
    if (lastMsg) {
      if (lastMsg.type === 'system') {
        lastMsgPreview = lastMsg.text;
      } else {
        const prefix = lastMsg.senderId === user.id ? `${L.you}: ` : '';
        lastMsgPreview = prefix + (lastMsg.text.length > 50 ? lastMsg.text.substring(0, 50) + '…' : lastMsg.text);
      }
      lastMsgTime = getTimeAgo(lastMsg.timestamp, lang);
    }

    const unreadCount = conv.unreadCount || 0;
    const link = conv.orderId ? `/chat/${conv.orderId}` : `/messages/${conv.id}`;

    // Order badge
    const order = conv.orderId ? store.getById('orders', conv.orderId) : null;
    const statusBadge = order ? getStatusBadge(order.status, lang) : '';

    return `
      <div class="conv-item ${unreadCount > 0 ? 'conv-unread' : ''}" data-conv-link="${link}" data-conv-id="${conv.id}">
        <div class="conv-item-avatar">${otherUser?.name?.charAt(0) || '?'}</div>
        <div class="conv-item-thumb">
          ${product?.images?.[0] ? `<img src="${product.images[0]}" alt="" />` : '<div class="conv-item-thumb-empty"></div>'}
        </div>
        <div class="conv-item-content">
          <div class="conv-item-top">
            <span class="conv-item-name">${otherUser?.name || '?'}</span>
            <span class="conv-item-time">${lastMsgTime}</span>
          </div>
          <div class="conv-item-product">${product?.title || ''} ${statusBadge}</div>
          <div class="conv-item-preview">${lastMsgPreview || ''}</div>
        </div>
        ${unreadCount > 0 ? `<div class="conv-item-badge">${unreadCount}</div>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="page">
      <div class="container-narrow">
        <h1 style="margin-bottom: var(--space-xl);">${L.title}</h1>
        <div class="conv-list">
          ${convItems}
        </div>
      </div>
    </div>
  `;
}

function getStatusBadge(status, lang) {
  const labels = {
    paid: lang === 'uz' ? 'To\'langan' : 'Paid',
    shipped: lang === 'uz' ? 'Jo\'natilgan' : 'Shipped',
    delivered: lang === 'uz' ? 'Yetkazilgan' : 'Delivered',
    completed: lang === 'uz' ? 'Bajarilgan' : 'Completed',
    cancelled: lang === 'uz' ? 'Bekor qilingan' : 'Cancelled',
    disputed: lang === 'uz' ? 'Nizolashgan' : 'Disputed',
    refunded: lang === 'uz' ? 'Qaytarilgan' : 'Refunded'
  };
  const colors = {
    paid: 'badge-info', shipped: 'badge-warning', delivered: 'badge-success',
    completed: 'badge-success', cancelled: 'badge-error', disputed: 'badge-error', refunded: 'badge-warning'
  };
  if (!labels[status]) return '';
  return `<span class="badge badge-xs ${colors[status] || 'badge-neutral'}">${labels[status]}</span>`;
}

function getTimeAgo(timestamp, lang) {
  const diff = Date.now() - timestamp;
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (lang === 'uz') {
    if (secs < 60) return 'hozirgina';
    if (mins < 60) return `${mins} daq`;
    if (hours < 24) return `${hours} soat`;
    return `${days} kun`;
  }
  if (secs < 60) return 'now';
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

export function attachMessagesEvents() {
  document.querySelectorAll('.conv-item').forEach(item => {
    item.addEventListener('click', async () => {
      const link = item.dataset.convLink;
      const convId = item.dataset.convId;
      if (convId) {
        try { await store.markConversationRead(convId); } catch {}
      }
      if (link) navigateTo(link);
    });
  });
}
