// ==========================================
// ReUz — Conversation / Chat Logic
// ==========================================

import { store } from '../store.js';
import { createNotification } from './notifications.js';

/**
 * Get or create a conversation for a given order.
 */
export function getOrCreateConversation(orderId) {
  let conv = store.filter('conversations', c => c.orderId === orderId)[0];
  if (conv) return conv;

  const order = store.getById('orders', orderId);
  if (!order) return null;

  conv = {
    id: store.generateId(),
    orderId,
    productId: order.productId,
    buyerId: order.buyerId,
    sellerId: order.sellerId,
    messages: [],
    escalated: false,
    createdAt: Date.now()
  };
  store.add('conversations', conv);
  return conv;
}

/**
 * Get or create a product-based conversation (pre-purchase messaging).
 */
export function getOrCreateProductConversation(productId, buyerId, sellerId) {
  // Check for existing conversation between this buyer and seller for this product
  let conv = store.filter('conversations', c =>
    c.productId === productId &&
    c.buyerId === buyerId &&
    c.sellerId === sellerId &&
    !c.orderId
  )[0];

  if (conv) return conv;

  conv = {
    id: store.generateId(),
    orderId: null,
    productId,
    buyerId,
    sellerId,
    messages: [],
    escalated: false,
    createdAt: Date.now()
  };
  store.add('conversations', conv);
  return conv;
}

/**
 * Get a conversation by order ID.
 */
export function getConversationByOrder(orderId) {
  return store.filter('conversations', c => c.orderId === orderId)[0] || null;
}

/**
 * Get a conversation by its ID.
 */
export function getConversationById(convId) {
  return store.getById('conversations', convId);
}

/**
 * Get all conversations for a user (both as buyer and seller).
 */
export function getConversationsByUser(userId) {
  return store
    .filter('conversations', c => c.buyerId === userId || c.sellerId === userId)
    .sort((a, b) => {
      const aTime = a.updatedAt || a.createdAt;
      const bTime = b.updatedAt || b.createdAt;
      return bTime - aTime;
    });
}

/**
 * Get unread message count for a user across all conversations.
 */
export function getUnreadMessageCount(userId) {
  const conversations = getConversationsByUser(userId);
  let count = 0;
  conversations.forEach(conv => {
    const lastRead = conv[`lastRead_${userId}`] || 0;
    const unread = (conv.messages || []).filter(
      m => m.senderId !== userId && m.senderId !== '__system__' && m.timestamp > lastRead
    );
    count += unread.length;
  });
  return count;
}

/**
 * Mark all messages in a conversation as read for a user.
 */
export function markConversationRead(conversationId, userId) {
  store.update('conversations', conversationId, {
    [`lastRead_${userId}`]: Date.now()
  });
}

/**
 * Add a user message.
 */
export function addMessage(conversationId, senderId, text) {
  const conv = store.getById('conversations', conversationId);
  if (!conv) return null;

  const message = {
    id: store.generateId(),
    senderId,
    text,
    type: 'user',
    timestamp: Date.now()
  };

  const messages = [...conv.messages, message];
  store.update('conversations', conversationId, { messages, updatedAt: Date.now() });

  // Send notification to the other user
  const recipientId = conv.buyerId === senderId ? conv.sellerId : conv.buyerId;
  const sender = store.getById('users', senderId);
  const product = conv.productId ? store.getById('products', conv.productId) : null;
  const productTitle = product?.title || '';

  createNotification(
    recipientId,
    'message',
    sender?.name || 'Someone',
    text.length > 60 ? text.substring(0, 60) + '…' : text,
    conv.orderId ? `/chat/${conv.orderId}` : `/messages/${conv.id}`
  );

  return message;
}

/**
 * Add a system message (e.g., "Payment confirmed", "Item shipped").
 */
export function addSystemMessage(conversationId, text, subtype = 'info') {
  const conv = store.getById('conversations', conversationId);
  if (!conv) return null;

  const message = {
    id: store.generateId(),
    senderId: '__system__',
    text,
    type: 'system',
    subtype, // 'info', 'success', 'warning', 'error'
    timestamp: Date.now()
  };

  const messages = [...conv.messages, message];
  store.update('conversations', conversationId, { messages, updatedAt: Date.now() });
  return message;
}

/**
 * Add a system message by orderId (convenience).
 */
export function postSystemMessageToOrder(orderId, text, subtype = 'info') {
  const conv = getConversationByOrder(orderId);
  if (conv) {
    addSystemMessage(conv.id, text, subtype);
  }
}

/**
 * Mark conversation as escalated (ReUz joined).
 */
export function escalateConversation(conversationId) {
  store.update('conversations', conversationId, { escalated: true });
}
