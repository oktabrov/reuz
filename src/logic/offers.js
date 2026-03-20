// ==========================================
// ReUz — Offer System (Chat-Based)
// ==========================================

import { store } from '../store.js';
import { getOrCreateProductConversation, getConversationByOrder } from './conversations.js';
import { createNotification } from './notifications.js';
import { createOrder } from './orders.js';
import { getLanguage } from '../i18n.js';
import { formatPrice } from './pricing.js';

/**
 * Offer statuses: pending, accepted, rejected, countered, expired
 * Offers are stored as special messages inside conversations.
 */

/**
 * Send an offer from buyer to seller via chat.
 */
export function sendOffer(productId, buyerId, amount) {
  const product = store.getById('products', productId);
  if (!product) return null;
  const seller = store.getById('users', product.sellerId);
  const buyer = store.getById('users', buyerId);
  const lang = getLanguage();

  // Get or create conversation
  let conv;
  const existingOrder = store.filter('orders', o => o.productId === productId && o.buyerId === buyerId)[0];
  if (existingOrder) {
    conv = getConversationByOrder(existingOrder.id);
  }
  if (!conv) {
    conv = getOrCreateProductConversation(productId, buyerId, product.sellerId);
  }
  if (!conv) return null;

  const offer = {
    id: store.generateId(),
    productId,
    buyerId,
    sellerId: product.sellerId,
    amount,
    originalPrice: product.price,
    status: 'pending',
    createdAt: Date.now()
  };

  // Store offer in store
  if (!store.state.offers) store.state.offers = [];
  store.add('offers', offer);

  // Add offer message to conversation
  const offerMessage = {
    id: store.generateId(),
    senderId: buyerId,
    text: lang === 'uz'
      ? `💰 Taklif: ${formatPrice(amount)} (Asl narx: ${formatPrice(product.price)})`
      : `💰 Offer: ${formatPrice(amount)} (Listed at ${formatPrice(product.price)})`,
    type: 'offer',
    offerId: offer.id,
    offerAmount: amount,
    offerStatus: 'pending',
    timestamp: Date.now()
  };

  const messages = [...conv.messages, offerMessage];
  store.update('conversations', conv.id, { messages, updatedAt: Date.now() });

  // Notify seller
  createNotification(
    product.sellerId,
    'purchase',
    lang === 'uz' ? 'Yangi taklif!' : 'New offer!',
    lang === 'uz'
      ? `${buyer?.name || 'Xaridor'} "${product.title}" uchun ${formatPrice(amount)} taklif qildi`
      : `${buyer?.name || 'Buyer'} offered ${formatPrice(amount)} for "${product.title}"`,
    conv.orderId ? `/chat/${conv.orderId}` : `/messages/${conv.id}`
  );

  return { offer, conv };
}

/**
 * Seller accepts an offer.
 */
export function acceptOffer(offerId) {
  const offer = store.getById('offers', offerId);
  if (!offer || offer.status !== 'pending') return null;
  const lang = getLanguage();

  store.update('offers', offerId, { status: 'accepted', respondedAt: Date.now() });

  // Update the offer message in conversation
  updateOfferMessageStatus(offer, 'accepted');

  // Post system message
  const conv = findConversationForOffer(offer);
  if (conv) {
    const acceptMsg = {
      id: store.generateId(),
      senderId: offer.sellerId,
      text: lang === 'uz'
        ? `✅ Taklif qabul qilindi! ${formatPrice(offer.amount)} — to'lov jarayonida...`
        : `✅ Offer accepted! ${formatPrice(offer.amount)} — processing payment...`,
      type: 'system',
      subtype: 'success',
      timestamp: Date.now()
    };
    const messages = [...conv.messages, acceptMsg];
    store.update('conversations', conv.id, { messages, updatedAt: Date.now() });
  }

  // Notify buyer
  const product = store.getById('products', offer.productId);
  createNotification(
    offer.buyerId,
    'purchase',
    lang === 'uz' ? 'Taklif qabul qilindi!' : 'Offer accepted!',
    lang === 'uz'
      ? `Sizning ${formatPrice(offer.amount)} taklifingiz "${product?.title || ''}" uchun qabul qilindi`
      : `Your offer of ${formatPrice(offer.amount)} for "${product?.title || ''}" was accepted`,
    conv ? (conv.orderId ? `/chat/${conv.orderId}` : `/messages/${conv.id}`) : null
  );

  // Trigger automatic payment — create order at offer price
  try {
    const order = createOrder(offer.buyerId, offer.productId, {
      cardNumber: '0000000000000000',
      cardExpiry: '12/30',
      cardCvv: '000',
      cardName: 'Offer Payment'
    }, offer.amount);

    return order;
  } catch (e) {
    console.warn('Auto-payment after offer accept failed:', e);
    return null;
  }
}

/**
 * Seller rejects an offer.
 */
export function rejectOffer(offerId) {
  const offer = store.getById('offers', offerId);
  if (!offer || offer.status !== 'pending') return;
  const lang = getLanguage();

  store.update('offers', offerId, { status: 'rejected', respondedAt: Date.now() });

  updateOfferMessageStatus(offer, 'rejected');

  const conv = findConversationForOffer(offer);
  if (conv) {
    const rejectMsg = {
      id: store.generateId(),
      senderId: offer.sellerId,
      text: lang === 'uz'
        ? `❌ Taklif rad etildi`
        : `❌ Offer declined`,
      type: 'system',
      subtype: 'error',
      timestamp: Date.now()
    };
    const messages = [...conv.messages, rejectMsg];
    store.update('conversations', conv.id, { messages, updatedAt: Date.now() });
  }

  // Notify buyer
  const product = store.getById('products', offer.productId);
  createNotification(
    offer.buyerId,
    'purchase',
    lang === 'uz' ? 'Taklif rad etildi' : 'Offer declined',
    lang === 'uz'
      ? `"${product?.title || ''}" uchun ${formatPrice(offer.amount)} taklifingiz rad etildi`
      : `Your offer of ${formatPrice(offer.amount)} for "${product?.title || ''}" was declined`,
    conv ? (conv.orderId ? `/chat/${conv.orderId}` : `/messages/${conv.id}`) : null
  );
}

/**
 * Seller sends a counter-offer.
 */
export function counterOffer(offerId, counterAmount) {
  const offer = store.getById('offers', offerId);
  if (!offer || offer.status !== 'pending') return null;
  const lang = getLanguage();

  store.update('offers', offerId, { status: 'countered', respondedAt: Date.now() });
  updateOfferMessageStatus(offer, 'countered');

  // Create new counter offer
  const product = store.getById('products', offer.productId);
  const seller = store.getById('users', offer.sellerId);

  const counterOfferObj = {
    id: store.generateId(),
    productId: offer.productId,
    buyerId: offer.buyerId,
    sellerId: offer.sellerId,
    amount: counterAmount,
    originalPrice: product?.price || offer.originalPrice,
    status: 'pending',
    isCounter: true,
    originalOfferId: offerId,
    createdAt: Date.now()
  };

  store.add('offers', counterOfferObj);

  const conv = findConversationForOffer(offer);
  if (conv) {
    const counterMsg = {
      id: store.generateId(),
      senderId: offer.sellerId,
      text: lang === 'uz'
        ? `💰 Qarshi taklif: ${formatPrice(counterAmount)}`
        : `💰 Counter offer: ${formatPrice(counterAmount)}`,
      type: 'offer',
      offerId: counterOfferObj.id,
      offerAmount: counterAmount,
      offerStatus: 'pending',
      isCounter: true,
      timestamp: Date.now()
    };
    const messages = [...conv.messages, counterMsg];
    store.update('conversations', conv.id, { messages, updatedAt: Date.now() });
  }

  // Notify buyer
  createNotification(
    offer.buyerId,
    'purchase',
    lang === 'uz' ? 'Qarshi taklif!' : 'Counter offer!',
    lang === 'uz'
      ? `Sotuvchi ${formatPrice(counterAmount)} qarshi taklif qildi`
      : `Seller counter-offered ${formatPrice(counterAmount)}`,
    conv ? (conv.orderId ? `/chat/${conv.orderId}` : `/messages/${conv.id}`) : null
  );

  return counterOfferObj;
}

/**
 * Buyer accepts a counter-offer.
 */
export function acceptCounterOffer(offerId) {
  return acceptOffer(offerId);
}

// === Helpers ===

function findConversationForOffer(offer) {
  // Try order-based conversation first
  const orderConv = store.filter('conversations', c =>
    c.productId === offer.productId &&
    (c.buyerId === offer.buyerId || c.sellerId === offer.sellerId)
  );
  return orderConv.length > 0 ? orderConv[0] : null;
}

function updateOfferMessageStatus(offer, newStatus) {
  const convs = store.filter('conversations', c =>
    c.productId === offer.productId &&
    (c.buyerId === offer.buyerId || c.sellerId === offer.sellerId)
  );

  convs.forEach(conv => {
    const updatedMessages = conv.messages.map(msg => {
      if (msg.type === 'offer' && msg.offerId === offer.id) {
        return { ...msg, offerStatus: newStatus };
      }
      return msg;
    });
    store.update('conversations', conv.id, { messages: updatedMessages });
  });
}

/**
 * Get pending offers for a seller (for showing action buttons).
 */
export function getPendingOffersForSeller(sellerId) {
  return store.filter('offers', o => o.sellerId === sellerId && o.status === 'pending');
}
