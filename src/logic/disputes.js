// ==========================================
// ReUz — Dispute / Buyer Protection System
// ==========================================

import { store } from '../store.js';
import { showToast } from '../components/toast.js';
import { getLanguage } from '../i18n.js';
import { formatPrice } from '../logic/pricing.js';
import { postSystemMessageToOrder, getConversationByOrder, escalateConversation, addSystemMessage } from './conversations.js';
import { createNotification } from './notifications.js';

const DISPUTE_REASONS = [
  { id: 'not_received', label: 'Not Received', icon: '', description: 'I never received the item' },
  { id: 'damaged', label: 'Damaged', icon: '', description: 'Item arrived damaged' },
  { id: 'not_as_described', label: 'Not as Described', icon: '', description: 'Item is significantly different from listing (SNAD)' },
  { id: 'counterfeit', label: 'Counterfeit', icon: '', description: 'Item appears to be fake or counterfeit' }
];

const DISPUTE_STATUSES = [
  'open', 'under_review',
  'seller_offered_full_refund', 'seller_offered_partial_refund', 'seller_requested_return',
  'partial_refund_declined',
  'return_required', 'return_shipped', 'return_received',
  'resolved_refund', 'resolved_no_refund', 'resolved_partial_refund',
  'closed'
];

// Simulated time constants
const SELLER_RESPONSE_TIMEOUT = 60; // seconds — auto-resolve if seller doesn't respond
const RETURN_DEADLINE = 30; // seconds — simulates 5 days for return
const disputeTimers = {};

export function openDispute(orderId, reason, description, photos = []) {
  const order = store.getById('orders', orderId);
  if (!order) throw new Error('Order not found');
  const lang = getLanguage();

  if (order.status !== 'delivered') {
    showToast(lang === 'uz' ? 'Faqat yetkazilgan buyurtmalar uchun muammo xabar qilish mumkin' : 'Can only report issues for delivered orders', 'error');
    return null;
  }

  const reasonObj = DISPUTE_REASONS.find(r => r.id === reason);
  const reasonLabel = reasonObj ? reasonObj.label : reason;

  const dispute = {
    id: store.generateId(),
    orderId,
    buyerId: order.buyerId,
    sellerId: order.sellerId,
    reason,
    description,
    photos,
    status: 'open',
    sellerResponse: null,
    sellerOffer: null, // { type: 'full_refund' | 'partial_refund' | 'return', amount?: number }
    resolution: null,
    escalated: false,
    statusHistory: [
      { status: 'open', timestamp: Date.now(), note: lang === 'uz' ? 'Xaridor tomonidan nizo ochildi' : 'Dispute opened by buyer' }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  store.add('disputes', dispute);

  // Update order to disputed
  const statusEntry = { status: 'disputed', timestamp: Date.now(), note: `Issue reported: ${reason}` };
  const history = [...(order.statusHistory || []), statusEntry];
  store.update('orders', orderId, {
    status: 'disputed',
    disputeId: dispute.id,
    statusHistory: history,
    updatedAt: Date.now()
  });

  postSystemMessageToOrder(orderId,
    lang === 'uz'
      ? `Nizo ochildi: ${reasonLabel}. Sotuvchi to'lovini to'xtatildi.`
      : `Dispute opened: ${reasonLabel}. Seller payout frozen.`,
    'warning'
  );

  // Move to under_review after short delay
  setTimeout(() => {
    updateDisputeStatus(dispute.id, 'under_review',
      lang === 'uz' ? 'Nizo ko\'rib chiqilmoqda' : 'Dispute is being reviewed');
  }, 5000);

  // Start seller response timer
  disputeTimers[dispute.id] = setTimeout(() => {
    autoResolveDispute(dispute.id);
  }, SELLER_RESPONSE_TIMEOUT * 1000);

  // Notify seller
  createNotification(
    order.sellerId,
    'dispute',
    lang === 'uz' ? 'Nizo ochildi' : 'Dispute opened',
    lang === 'uz'
      ? `Xaridor muammo xabar qildi: ${reasonLabel}`
      : `Buyer reported an issue: ${reasonLabel}`,
    `/chat/${orderId}`
  );

  showToast(lang === 'uz' ? 'Nizo ochildi. Sotuvchi to\'lovini to\'xtatildi.' : 'Dispute opened. Seller payout frozen.', 'warning');
  return dispute;
}

// ========== SELLER ACTIONS ==========

/**
 * Seller offers full refund — buyer keeps item, gets money back immediately
 */
export function sellerOfferFullRefund(disputeId) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute) return;
  const lang = getLanguage();
  clearDisputeTimer(disputeId);

  const order = store.getById('orders', dispute.orderId);
  if (!order) return;

  store.update('disputes', disputeId, {
    sellerResponse: 'full_refund',
    sellerOffer: { type: 'full_refund' },
    updatedAt: Date.now()
  });

  // Immediately resolve — buyer keeps item + gets refund
  resolveWithFullRefund(disputeId);
}

/**
 * Seller offers partial refund — buyer can accept or decline
 */
export function sellerOfferPartialRefund(disputeId, amount) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute) return;
  const lang = getLanguage();
  clearDisputeTimer(disputeId);

  store.update('disputes', disputeId, {
    sellerResponse: 'partial_refund',
    sellerOffer: { type: 'partial_refund', amount },
    updatedAt: Date.now()
  });

  updateDisputeStatus(disputeId, 'seller_offered_partial_refund',
    lang === 'uz'
      ? `Sotuvchi ${formatPrice(amount)} qisman qaytarishni taklif qildi`
      : `Seller offered partial refund of ${formatPrice(amount)}`);

  postSystemMessageToOrder(dispute.orderId,
    lang === 'uz'
      ? `Sotuvchi ${formatPrice(amount)} qisman qaytarishni taklif qildi. Xaridor qabul qilishi yoki rad etishi mumkin.`
      : `Seller offered a partial refund of ${formatPrice(amount)}. Buyer can accept or decline.`,
    'info'
  );

  createNotification(
    dispute.buyerId,
    'dispute',
    lang === 'uz' ? 'Qisman qaytarish taklifi' : 'Partial refund offer',
    lang === 'uz'
      ? `Sotuvchi ${formatPrice(amount)} qaytarishni taklif qildi`
      : `Seller offered ${formatPrice(amount)} as partial refund`,
    `/chat/${dispute.orderId}`
  );
}

/**
 * Seller requests return — buyer must ship back within deadline
 */
export function sellerRequestReturn(disputeId) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute) return;
  const lang = getLanguage();
  clearDisputeTimer(disputeId);

  store.update('disputes', disputeId, {
    sellerResponse: 'return',
    sellerOffer: { type: 'return' },
    returnDeadline: Date.now() + RETURN_DEADLINE * 1000,
    updatedAt: Date.now()
  });

  updateDisputeStatus(disputeId, 'return_required',
    lang === 'uz'
      ? 'Sotuvchi qaytarishni talab qildi. Buyumni qaytarish uchun 5 kun berilgan.'
      : 'Seller requested return. You have 5 days to ship the item back.');

  postSystemMessageToOrder(dispute.orderId,
    lang === 'uz'
      ? `Sotuvchi buyumni qaytarishni talab qildi. 5 kun ichida jo'natilmasa, buyurtma sotuvchi foydasiga yakunlanadi.`
      : `Seller requested item return. If not shipped back within 5 days, the order will be completed in seller's favor.`,
    'warning'
  );

  createNotification(
    dispute.buyerId,
    'dispute',
    lang === 'uz' ? 'Qaytarish talab qilindi' : 'Return requested',
    lang === 'uz'
      ? 'Buyumni 5 kun ichida qaytaring'
      : 'Return the item within 5 days',
    `/chat/${dispute.orderId}`
  );

  // Start return deadline timer — auto-complete in seller favor if buyer doesn't ship
  disputeTimers[`return_${disputeId}`] = setTimeout(() => {
    autoCompleteInSellerFavor(disputeId);
  }, RETURN_DEADLINE * 1000);
}

// ========== BUYER ACTIONS ==========

/**
 * Buyer accepts partial refund — keeps item + gets partial money back
 */
export function buyerAcceptPartialRefund(disputeId) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute || dispute.status !== 'seller_offered_partial_refund') return;
  const lang = getLanguage();

  const amount = dispute.sellerOffer?.amount || 0;
  resolveWithPartialRefund(disputeId, amount);
}

/**
 * Buyer declines partial refund — seller must choose another option
 */
export function buyerDeclinePartialRefund(disputeId) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute || dispute.status !== 'seller_offered_partial_refund') return;
  const lang = getLanguage();

  store.update('disputes', disputeId, {
    sellerResponse: null,
    sellerOffer: null,
    status: 'partial_refund_declined',
    updatedAt: Date.now()
  });

  updateDisputeStatus(disputeId, 'partial_refund_declined',
    lang === 'uz'
      ? 'Xaridor qisman qaytarishni rad etdi. Sotuvchi boshqa variant tanlashi kerak.'
      : 'Buyer declined partial refund. Seller must choose another option.');

  postSystemMessageToOrder(dispute.orderId,
    lang === 'uz'
      ? 'Xaridor qisman qaytarishni rad etdi. Sotuvchi boshqa variant tanlashi kerak.'
      : 'Buyer declined the partial refund offer. Seller must choose another option.',
    'warning'
  );

  createNotification(
    dispute.sellerId,
    'dispute',
    lang === 'uz' ? 'Taklif rad etildi' : 'Offer declined',
    lang === 'uz'
      ? 'Xaridor qisman qaytarishni rad etdi'
      : 'Buyer declined your partial refund offer',
    `/chat/${dispute.orderId}`
  );

  // Restart seller response timer
  disputeTimers[disputeId] = setTimeout(() => {
    autoResolveDispute(disputeId);
  }, SELLER_RESPONSE_TIMEOUT * 1000);
}

/**
 * Buyer shipped return item
 */
export function buyerShippedReturn(disputeId) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute || dispute.status !== 'return_required') return;
  const lang = getLanguage();

  // Clear return deadline timer
  clearTimeout(disputeTimers[`return_${disputeId}`]);
  delete disputeTimers[`return_${disputeId}`];

  updateDisputeStatus(disputeId, 'return_shipped',
    lang === 'uz' ? 'Xaridor qaytarishni jo\'natdi' : 'Buyer has shipped the return');
  postSystemMessageToOrder(dispute.orderId,
    lang === 'uz' ? 'Qaytarish jo\'natildi. Sotuvchi qabul qilguncha kutilmoqda.' : 'Return shipped. Waiting for seller to receive.',
    'info'
  );

  // Simulate seller receiving return (15s delay)
  setTimeout(() => {
    sellerReceivedReturn(disputeId);
  }, 15000);
}

// ========== INTERNAL FUNCTIONS ==========

function sellerReceivedReturn(disputeId) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute) return;
  const lang = getLanguage();

  updateDisputeStatus(disputeId, 'return_received',
    lang === 'uz' ? 'Sotuvchi qaytarilgan buyumni qabul qildi' : 'Seller received returned item');
  postSystemMessageToOrder(dispute.orderId,
    lang === 'uz' ? 'Sotuvchi qaytarilgan buyumni qabul qildi. Qaytarish jarayonida...' : 'Seller received returned item. Processing refund...',
    'info'
  );

  setTimeout(() => {
    resolveWithFullRefund(disputeId);
  }, 8000);
}

/**
 * Auto-complete in seller's favor when buyer doesn't return within deadline
 */
function autoCompleteInSellerFavor(disputeId) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute || dispute.status !== 'return_required') return;
  const lang = getLanguage();

  const order = store.getById('orders', dispute.orderId);
  if (!order) return;

  store.update('disputes', disputeId, {
    resolution: 'no_refund',
    updatedAt: Date.now()
  });

  updateDisputeStatus(disputeId, 'resolved_no_refund',
    lang === 'uz'
      ? 'Xaridor buyumni qaytarmadi. Buyurtma sotuvchi foydasiga yakunlandi.'
      : 'Buyer did not return the item. Order completed in seller\'s favor.');

  postSystemMessageToOrder(dispute.orderId,
    lang === 'uz'
      ? 'Qaytarish muddati tugadi. Buyurtma sotuvchi foydasiga yakunlandi.'
      : 'Return deadline expired. Order completed in seller\'s favor.',
    'warning'
  );

  // Complete the order
  const statusEntry = { status: 'completed', timestamp: Date.now(), note: 'Return deadline expired' };
  const history = [...(order.statusHistory || []), statusEntry];
  store.update('orders', order.id, {
    status: 'completed',
    sellerPaidOut: true,
    statusHistory: history,
    updatedAt: Date.now()
  });

  createNotification(dispute.buyerId, 'dispute',
    lang === 'uz' ? 'Buyurtma yakunlandi' : 'Order completed',
    lang === 'uz' ? 'Qaytarish muddati tugadi' : 'Return deadline expired',
    `/chat/${dispute.orderId}`
  );
  createNotification(dispute.sellerId, 'dispute',
    lang === 'uz' ? 'Buyurtma yakunlandi' : 'Order completed',
    lang === 'uz' ? 'Buyurtma sizning foydaligingizga yakunlandi' : 'Order completed in your favor',
    `/chat/${dispute.orderId}`
  );
}

function autoResolveDispute(disputeId) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute || dispute.status === 'closed' || dispute.status.startsWith('resolved_')) return;
  const lang = getLanguage();

  updateDisputeStatus(disputeId, 'under_review',
    lang === 'uz' ? 'Sotuvchi javob bermadi. Platforma avtomatik hal qilmoqda.' : 'Seller did not respond. Platform is auto-resolving.');
  postSystemMessageToOrder(dispute.orderId,
    lang === 'uz' ? 'Sotuvchi javob bermadi. Avtomatik qaytarish jarayonida...' : 'Seller did not respond. Auto-refund in progress...',
    'warning'
  );

  setTimeout(() => {
    resolveWithFullRefund(disputeId);
  }, 8000);
}

function resolveWithFullRefund(disputeId) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute) return;
  const lang = getLanguage();

  const order = store.getById('orders', dispute.orderId);
  if (!order) return;

  store.update('disputes', disputeId, {
    resolution: 'full_refund',
    updatedAt: Date.now()
  });

  updateDisputeStatus(disputeId, 'resolved_refund',
    lang === 'uz' ? 'Xaridorga to\'liq qaytarish amalga oshirildi' : 'Full refund issued to buyer');

  createNotification(dispute.buyerId, 'dispute',
    lang === 'uz' ? 'Qaytarish amalga oshirildi' : 'Refund issued',
    lang === 'uz' ? `${formatPrice(order.pricing.buyerPays)} qaytarildi` : `${formatPrice(order.pricing.buyerPays)} refunded to you`,
    `/order/${dispute.orderId}`
  );
  createNotification(dispute.sellerId, 'dispute',
    lang === 'uz' ? 'Nizo hal qilindi' : 'Dispute resolved',
    lang === 'uz' ? 'Xaridorga qaytarish amalga oshirildi' : 'Refund issued to buyer',
    `/order/${dispute.orderId}`
  );

  const statusEntry = { status: 'refunded', timestamp: Date.now(), note: lang === 'uz' ? 'To\'liq qaytarish amalga oshirildi' : 'Full refund issued' };
  const history = [...(order.statusHistory || []), statusEntry];
  store.update('orders', order.id, {
    status: 'refunded',
    statusHistory: history,
    updatedAt: Date.now()
  });

  store.update('products', order.productId, { sold: false, soldAt: null });

  postSystemMessageToOrder(dispute.orderId,
    lang === 'uz' ? `To'liq qaytarish amalga oshirildi: ${formatPrice(order.pricing.buyerPays)}. Nizo hal qilindi.` : `Full refund issued: ${formatPrice(order.pricing.buyerPays)}. Dispute resolved.`,
    'success'
  );

  showToast(lang === 'uz' ? 'Nizo hal qilindi — to\'liq qaytarish!' : 'Dispute resolved — full refund issued!', 'success');
}

export function resolveWithPartialRefund(disputeId, refundAmount) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute) return;
  const lang = getLanguage();

  const order = store.getById('orders', dispute.orderId);
  if (!order) return;

  store.update('disputes', disputeId, {
    resolution: 'partial_refund',
    refundAmount,
    updatedAt: Date.now()
  });

  updateDisputeStatus(disputeId, 'resolved_partial_refund',
    lang === 'uz' ? `${formatPrice(refundAmount)} qisman qaytarish amalga oshirildi` : `Partial refund of ${formatPrice(refundAmount)} issued`);

  postSystemMessageToOrder(dispute.orderId,
    lang === 'uz' ? `Qisman qaytarish: ${formatPrice(refundAmount)}. Nizo hal qilindi.` : `Partial refund: ${formatPrice(refundAmount)}. Dispute resolved.`,
    'success'
  );

  showToast(lang === 'uz' ? `${formatPrice(refundAmount)} qisman qaytarish` : `Partial refund of ${formatPrice(refundAmount)} issued`, 'info');
}

/**
 * Escalate dispute — ReUz joins as 3rd participant
 */
export function escalateDispute(disputeId) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute) return;
  const lang = getLanguage();

  store.update('disputes', disputeId, { escalated: true, updatedAt: Date.now() });

  updateDisputeStatus(disputeId, 'under_review',
    lang === 'uz' ? 'Nizo ReUz qo\'llab-quvvatlash xizmatiga yuborildi' : 'Dispute escalated to ReUz support');

  const conv = getConversationByOrder(dispute.orderId);
  if (conv) {
    escalateConversation(conv.id);
    addSystemMessage(conv.id,
      lang === 'uz' ? 'ReUz qo\'llab-quvvatlash xizmati suhbatga qo\'shildi. Biz ishni ko\'rib chiqamiz.' : 'ReUz support has joined the chat. We will review this case.',
      'warning'
    );
  }

  createNotification(dispute.buyerId, 'dispute',
    lang === 'uz' ? 'Nizo yuborildi' : 'Dispute escalated',
    lang === 'uz' ? 'Nizo ReUz xizmatiga yuborildi' : 'Dispute escalated to ReUz support',
    `/chat/${dispute.orderId}`
  );
  createNotification(dispute.sellerId, 'dispute',
    lang === 'uz' ? 'Nizo yuborildi' : 'Dispute escalated',
    lang === 'uz' ? 'Nizo ReUz xizmatiga yuborildi' : 'Dispute escalated to ReUz support',
    `/chat/${dispute.orderId}`
  );

  showToast(lang === 'uz' ? 'Nizo ReUz xizmatiga yuborildi' : 'Dispute escalated to ReUz support', 'info');

  setTimeout(() => {
    const currentDispute = store.getById('disputes', disputeId);
    if (currentDispute && !currentDispute.status.startsWith('resolved_')) {
      resolveWithFullRefund(disputeId);
    }
  }, 20000);
}

function clearDisputeTimer(disputeId) {
  if (disputeTimers[disputeId]) {
    clearTimeout(disputeTimers[disputeId]);
    delete disputeTimers[disputeId];
  }
}

function updateDisputeStatus(disputeId, status, note) {
  const dispute = store.getById('disputes', disputeId);
  if (!dispute) return;

  const statusEntry = { status, timestamp: Date.now(), note };
  const history = [...(dispute.statusHistory || []), statusEntry];

  store.update('disputes', disputeId, {
    status,
    statusHistory: history,
    updatedAt: Date.now()
  });
}

export function getDisputesByUser(userId) {
  return store.filter('disputes', d => d.buyerId === userId || d.sellerId === userId);
}

export { DISPUTE_REASONS, DISPUTE_STATUSES };
