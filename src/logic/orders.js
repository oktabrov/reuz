// ==========================================
// ReUz — Order Lifecycle Engine
// ==========================================

import { store } from '../store.js';
import { calculatePricing } from './pricing.js';
import { calculateShipping } from './shipping.js';
import { showToast } from '../components/toast.js';
import { getLanguage } from '../i18n.js';
import { getOrCreateConversation, postSystemMessageToOrder } from './conversations.js';
import { createNotification } from './notifications.js';

const ORDER_STATUSES = ['paid', 'shipped', 'delivered', 'completed', 'cancelled', 'disputed'];

// Simulation timings (seconds)
const SHIP_DELAY = 5;
const DELIVER_DELAY = 8;
const AUTO_COMPLETE_DELAY = 1800; // 30 minutes buyer review window

// Active timers
const orderTimers = {};

export function createOrder(buyerId, productId, paymentDetails, overridePrice = null) {
  const product = store.getById('products', productId);
  const buyer = store.getById('users', buyerId);
  const seller = store.getById('users', product.sellerId);

  if (!product || !buyer || !seller) {
    throw new Error('Invalid order data');
  }

  if (product.sold) {
    throw new Error('Product already sold');
  }

  if (buyerId === product.sellerId) {
    throw new Error('Cannot buy your own item');
  }

  const itemPrice = overridePrice !== null ? overridePrice : product.price;
  const shipping = calculateShipping(seller.region, buyer.region);
  const pricing = calculatePricing(itemPrice, shipping.cost);
  const lang = getLanguage();

  const order = {
    id: store.generateId(),
    productId,
    buyerId,
    sellerId: product.sellerId,
    status: 'paid',
    pricing,
    shipping,
    paymentDetails: {
      cardLast4: paymentDetails.cardNumber.slice(-4),
      method: 'card'
    },
    statusHistory: [
      { status: 'paid', timestamp: Date.now(), note: lang === 'uz' ? 'To\'lov qabul qilindi' : 'Payment received' }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    deliveredAt: null,
    disputeId: null,
    sellerPaidOut: false
  };

  // Mark product as sold immediately
  store.update('products', productId, { sold: true, soldAt: Date.now() });

  store.add('orders', order);

  // Create conversation for this order
  const conv = getOrCreateConversation(order.id);
  if (conv) {
    postSystemMessageToOrder(order.id,
      lang === 'uz'
        ? `To'lov tasdiqlandi. ${product.title} uchun $${pricing.buyerPays.toFixed(2)} to'landi.`
        : `Payment confirmed. $${pricing.buyerPays.toFixed(2)} paid for ${product.title}.`,
      'success'
    );
  }

  // Notify seller about the purchase
  createNotification(
    product.sellerId,
    'purchase',
    lang === 'uz' ? 'Yangi buyurtma!' : 'New order!',
    lang === 'uz'
      ? `${buyer.name} sizning "${product.title}" buyumingizni sotib oldi — $${pricing.sellerGets.toFixed(2)}`
      : `${buyer.name} purchased your "${product.title}" — $${pricing.sellerGets.toFixed(2)}`,
    `/chat/${order.id}`
  );

  // Start auto-progression
  startOrderProgression(order.id);

  return order;
}

export function startOrderProgression(orderId) {
  // Clear existing timers
  clearOrderTimers(orderId);

  const order = store.getById('orders', orderId);
  if (!order || order.status === 'cancelled' || order.status === 'completed' || order.status === 'disputed') {
    return;
  }

  if (order.status === 'paid') {
    orderTimers[`${orderId}_ship`] = setTimeout(() => {
      progressToShipped(orderId);
    }, SHIP_DELAY * 1000);
  } else if (order.status === 'shipped') {
    orderTimers[`${orderId}_deliver`] = setTimeout(() => {
      progressToDelivered(orderId);
    }, DELIVER_DELAY * 1000);
  } else if (order.status === 'delivered') {
    // Calculate remaining time from deliveredAt
    const deliveredAt = order.deliveredAt || Date.now();
    const elapsed = Date.now() - deliveredAt;
    const remaining = Math.max(0, (AUTO_COMPLETE_DELAY * 1000) - elapsed);

    if (remaining <= 0) {
      autoCompleteOrder(orderId);
    } else {
      orderTimers[`${orderId}_complete`] = setTimeout(() => {
        autoCompleteOrder(orderId);
      }, remaining);
    }
  }
}

function progressToShipped(orderId) {
  const order = store.getById('orders', orderId);
  if (!order || order.status !== 'paid') return;
  const lang = getLanguage();

  const note = lang === 'uz' ? 'Sotuvchi buyumni jo\'natdi' : 'Seller has shipped the item';
  updateOrderStatus(orderId, 'shipped', note);
  postSystemMessageToOrder(orderId, note, 'info');

  // Notify buyer
  const product = store.getById('products', order.productId);
  createNotification(
    order.buyerId,
    'order_update',
    lang === 'uz' ? 'Buyurtma jo\'natildi' : 'Order shipped',
    lang === 'uz'
      ? `"${product?.title || ''}" jo'natildi`
      : `"${product?.title || ''}" has been shipped`,
    `/chat/${orderId}`
  );

  // Schedule delivery
  orderTimers[`${orderId}_deliver`] = setTimeout(() => {
    progressToDelivered(orderId);
  }, DELIVER_DELAY * 1000);
}

function progressToDelivered(orderId) {
  const order = store.getById('orders', orderId);
  if (!order || order.status !== 'shipped') return;
  const lang = getLanguage();

  const now = Date.now();
  const note = lang === 'uz'
    ? 'Buyum yetkazildi. Tasdiqlash yoki muammo xabar qilish uchun 30 daqiqangiz bor.'
    : 'Item delivered. You have 30 minutes to confirm or report an issue.';
  updateOrderStatus(orderId, 'delivered', note);
  store.update('orders', orderId, { deliveredAt: now });
  postSystemMessageToOrder(orderId, note, 'success');

  // Notify buyer
  const product = store.getById('products', order.productId);
  createNotification(
    order.buyerId,
    'order_update',
    lang === 'uz' ? 'Buyum yetkazildi!' : 'Item delivered!',
    lang === 'uz'
      ? `"${product?.title || ''}" yetkazildi. Tekshiring!`
      : `"${product?.title || ''}" has been delivered. Review it!`,
    `/chat/${orderId}`
  );

  // Start 30-minute auto-complete timer
  orderTimers[`${orderId}_complete`] = setTimeout(() => {
    autoCompleteOrder(orderId);
  }, AUTO_COMPLETE_DELAY * 1000);
}

function autoCompleteOrder(orderId) {
  const order = store.getById('orders', orderId);
  if (!order || order.status !== 'delivered') return;

  completeOrder(orderId);
}

export function completeOrder(orderId) {
  const order = store.getById('orders', orderId);
  if (!order) return;
  const lang = getLanguage();

  const note = lang === 'uz'
    ? 'Buyurtma bajarildi. Sotuvchiga to\'lov chiqarildi.'
    : 'Order completed. Seller payout released.';
  updateOrderStatus(orderId, 'completed', note);
  store.update('orders', orderId, { sellerPaidOut: true });
  postSystemMessageToOrder(orderId, note, 'success');

  // Notify seller about payout
  const product = store.getById('products', order.productId);
  createNotification(
    order.sellerId,
    'order_update',
    lang === 'uz' ? 'To\'lov chiqarildi!' : 'Payout released!',
    lang === 'uz'
      ? `"${product?.title || ''}" uchun to'lov chiqarildi`
      : `Payout for "${product?.title || ''}" has been released`,
    `/order/${orderId}`
  );

  clearOrderTimers(orderId);
}

export function cancelOrder(orderId, cancelledBy) {
  const order = store.getById('orders', orderId);
  if (!order) return;
  const lang = getLanguage();

  // Can only cancel before shipped
  if (order.status !== 'paid') {
    showToast(lang === 'uz' ? 'Bekor qilib bo\'lmaydi — buyum allaqachon jo\'natilgan' : 'Cannot cancel — item already shipped', 'error');
    return false;
  }

  const cancelledByLabel = cancelledBy === order.buyerId
    ? (lang === 'uz' ? 'xaridor' : 'buyer')
    : (lang === 'uz' ? 'sotuvchi' : 'seller');

  const note = `${lang === 'uz' ? 'Buyurtma bekor qilindi' : 'Order cancelled by'} ${cancelledByLabel}`;
  updateOrderStatus(orderId, 'cancelled', note);
  postSystemMessageToOrder(orderId, note, 'error');

  // Unmark product as sold (make it available again)
  store.update('products', order.productId, { sold: false, soldAt: null });

  // Notify the other party
  const product = store.getById('products', order.productId);
  const notifyId = cancelledBy === order.buyerId ? order.sellerId : order.buyerId;
  createNotification(
    notifyId,
    'order_update',
    lang === 'uz' ? 'Buyurtma bekor qilindi' : 'Order cancelled',
    lang === 'uz'
      ? `"${product?.title || ''}" buyurtmasi bekor qilindi`
      : `Order for "${product?.title || ''}" has been cancelled`,
    `/order/${orderId}`
  );

  clearOrderTimers(orderId);
  showToast(lang === 'uz' ? 'Buyurtma bekor qilindi. Xaridorga qaytarildi.' : 'Order cancelled. Buyer refunded.', 'info');
  return true;
}

export function confirmReceipt(orderId) {
  const order = store.getById('orders', orderId);
  if (!order || order.status !== 'delivered') return;

  completeOrder(orderId);
}

function updateOrderStatus(orderId, status, note) {
  const order = store.getById('orders', orderId);
  if (!order) return;

  const statusEntry = { status, timestamp: Date.now(), note };
  const history = [...(order.statusHistory || []), statusEntry];

  store.update('orders', orderId, {
    status,
    statusHistory: history,
    updatedAt: Date.now()
  });
}

function clearOrderTimers(orderId) {
  Object.keys(orderTimers).forEach(key => {
    if (key.startsWith(orderId)) {
      clearTimeout(orderTimers[key]);
      delete orderTimers[key];
    }
  });
}

export function getOrdersByBuyer(buyerId) {
  return store.filter('orders', o => o.buyerId === buyerId);
}

export function getOrdersBySeller(sellerId) {
  return store.filter('orders', o => o.sellerId === sellerId);
}

export function getOrderTimerInfo(orderId) {
  const order = store.getById('orders', orderId);
  if (!order) return null;

  let nextStatus = null;
  let nextDelay = 0;

  switch (order.status) {
    case 'paid':
      nextStatus = 'shipped';
      nextDelay = SHIP_DELAY;
      break;
    case 'shipped':
      nextStatus = 'delivered';
      nextDelay = DELIVER_DELAY;
      break;
    case 'delivered':
      nextStatus = 'completed';
      nextDelay = AUTO_COMPLETE_DELAY;
      break;
  }

  return { nextStatus, nextDelay };
}

// Resume timers for in-progress orders on page load
export function resumeOrderTimers() {
  const orders = store.getAll('orders');
  orders.forEach(order => {
    if (['paid', 'shipped', 'delivered'].includes(order.status)) {
      startOrderProgression(order.id);
    }
  });
}

export { ORDER_STATUSES };
