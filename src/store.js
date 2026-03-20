// ==========================================
// ReUz — API Store with Sync Cache
// ==========================================
// Provides both async API methods AND a sync cache layer
// so existing pages work without full rewrites.
// The cache is populated via API and updated by Socket.IO.
// ==========================================

import { io as socketIO } from 'socket.io-client';

const API_BASE = '/api';
let authToken = localStorage.getItem('reuz_token');
let currentUser = null;
let socket = null;

// Sync cache (mirrors the old localStorage store)
const cache = {
  users: [],
  products: [],
  orders: [],
  disputes: [],
  conversations: [],
  favorites: [],
  notifications: [],
  offers: []
};

// Event emitter
const listeners = {};
function emit(event, data) { (listeners[event] || []).forEach(cb => cb(data)); }
function on(event, callback) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(callback);
  return () => { listeners[event] = listeners[event].filter(cb => cb !== callback); };
}

// === API Helpers ===
async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}
function apiGet(path) { return apiFetch(path); }
function apiPost(path, body) { return apiFetch(path, { method: 'POST', body: JSON.stringify(body) }); }
function apiPut(path, body) { return apiFetch(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }); }

// === Socket.IO ===
function connectSocket() {
  if (!authToken) return; // Don't connect without auth
  if (socket) socket.disconnect();
  const wsUrl = window.location.origin;
  socket = socketIO(wsUrl, {
    auth: { token: authToken },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000
  });

  socket.on('connect', () => console.log('🔌 Socket connected'));

  socket.on('chat:message', (msg) => {
    const conv = cache.conversations.find(c => c.id === msg.conversationId);
    if (conv) {
      if (!conv.messages) conv.messages = [];
      if (!conv.messages.find(m => m.id === msg.id)) {
        conv.messages.push(msg);
      }
      conv.updatedAt = msg.timestamp;
    }
    emit('chat:message', msg);
    emit('conversations', cache.conversations);
  });

  socket.on('notification:new', (notif) => {
    cache.notifications.unshift(notif);
    emit('notification:new', notif);
    emit('notifications', cache.notifications);
  });

  socket.on('order:update', (data) => {
    const order = cache.orders.find(o => o.id === data.orderId);
    if (order) {
      // Merge full order data from backend (single source of truth)
      if (data.order) {
        Object.assign(order, data.order);
      } else {
        order.status = data.status;
      }
    }
    emit('order:update', data);
    emit('orders', cache.orders);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('🔌 Socket error:', err.message);
  });
}

function disconnectSocket() {
  if (socket) { socket.disconnect(); socket = null; }
}

// === Cache Sync ===
async function refreshCache() {
  try {
    const products = await apiGet('/products');
    cache.products = Array.isArray(products) ? products : [];
  } catch {}

  if (authToken) {
    try { const o = await apiGet('/orders'); cache.orders = Array.isArray(o) ? o : []; } catch {}
    try { const c = await apiGet('/conversations'); cache.conversations = Array.isArray(c) ? c : []; } catch {}
    try { const n = await apiGet('/notifications'); cache.notifications = Array.isArray(n) ? n : []; } catch {}
  }
}

// === Auth ===
async function login(email, password) {
  const data = await apiPost('/auth/login', { email, password });
  authToken = data.token;
  currentUser = data.user;
  localStorage.setItem('reuz_token', data.token);
  // Add user to cache
  updateCacheItem('users', data.user);
  connectSocket();
  await refreshCache();
  emit('currentUser', currentUser);
  return data;
}

async function register(name, email, password, region) {
  const data = await apiPost('/auth/register', { name, email, password, region });
  authToken = data.token;
  currentUser = data.user;
  localStorage.setItem('reuz_token', data.token);
  updateCacheItem('users', data.user);
  connectSocket();
  await refreshCache();
  emit('currentUser', currentUser);
  return data;
}

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('reuz_token');
  disconnectSocket();
  // Clear cache
  Object.keys(cache).forEach(k => { if (Array.isArray(cache[k])) cache[k] = []; });
  emit('currentUser', null);
}

async function restoreSession() {
  if (!authToken) return null;
  try {
    currentUser = await apiGet('/auth/me');
    updateCacheItem('users', currentUser);
    connectSocket();
    await refreshCache();
    emit('currentUser', currentUser);
    return currentUser;
  } catch {
    authToken = null;
    localStorage.removeItem('reuz_token');
    // Still load products for browsing
    try { cache.products = await apiGet('/products'); } catch {}
    return null;
  }
}

// === Sync Cache Helpers (backward compat) ===
function updateCacheItem(collection, item) {
  if (!item || !item.id) return;
  const idx = cache[collection]?.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    cache[collection][idx] = { ...cache[collection][idx], ...item };
  } else if (cache[collection]) {
    cache[collection].push(item);
  }
}

// Old store compat: getAll, getById, filter, add, update, remove
function getAll(collection) { return cache[collection] || []; }

function getById(collection, id) { return (cache[collection] || []).find(item => item.id === id); }

function filter(collection, predicate) { return (cache[collection] || []).filter(predicate); }

function set(key, value) { cache[key] = value; emit(key, value); }

function get(key) { return cache[key]; }

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 9); }

// Sync add — also calls API
function add(collection, item) {
  if (!cache[collection]) cache[collection] = [];
  cache[collection].push(item);
  emit(collection, cache[collection]);
  return item;
}

// Sync update — also updates cache
function update(collection, id, updates) {
  const items = cache[collection] || [];
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    emit(collection, items);
    return items[index];
  }
  return null;
}

function remove(collection, id) {
  if (!cache[collection]) return;
  cache[collection] = cache[collection].filter(item => item.id !== id);
  emit(collection, cache[collection]);
}

// === Async API Methods ===
async function getProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.search) params.set('search', filters.search);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.sellerId) params.set('sellerId', filters.sellerId);
  const products = await apiGet(`/products?${params}`);
  cache.products = products;
  return products;
}

async function getProduct(id) {
  const product = await apiGet(`/products/${id}`);
  updateCacheItem('products', product);
  return product;
}

async function createProduct(formData) {
  // formData is a FormData object with files and fields
  const headers = {};
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  // Do NOT set Content-Type — browser will set it with proper multipart boundary
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers,
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Upload failed');
  }
  const product = await res.json();
  cache.products.push(product);
  emit('products', cache.products);
  return product;
}

async function getUser(id) {
  const user = await apiGet(`/users/${id}`);
  updateCacheItem('users', user);
  return user;
}

async function getOrders() {
  cache.orders = await apiGet('/orders');
  return cache.orders;
}

async function getOrder(id) {
  const order = await apiGet(`/orders/${id}`);
  updateCacheItem('orders', order);
  return order;
}

async function createOrder(buyerId, productId, payment, overridePrice) {
  // Calculate pricing client-side for display, but server does the real work
  const product = getById('products', productId) || await getProduct(productId);
  const price = overridePrice || product.price;
  const { calculatePricing } = await import('./logic/pricing.js');
  const { calculateShipping } = await import('./logic/shipping.js');
  const seller = getById('users', product.sellerId) || await getUser(product.sellerId);
  const user = currentUser;
  const shipping = calculateShipping(seller?.region, user?.region);
  const pricing = calculatePricing(price, shipping.cost);

  const order = await apiPost('/orders', { productId, payment, pricing, shipping, overridePrice });
  cache.orders.push(order);
  // Mark product as sold in cache
  update('products', productId, { sold: true, soldAt: Date.now() });
  emit('orders', cache.orders);
  return order;
}

async function confirmOrder(orderId) {
  const result = await apiPut(`/orders/${orderId}/confirm`, {});
  if (result.order) {
    updateCacheItem('orders', result.order);
  } else {
    update('orders', orderId, { status: 'completed', sellerPaidOut: true });
  }
  return result;
}

async function cancelOrderApi(orderId) {
  await apiPut(`/orders/${orderId}/cancel`);
  const order = getById('orders', orderId);
  update('orders', orderId, { status: 'cancelled' });
  if (order) update('products', order.productId, { sold: false });
}

async function getConversations() {
  cache.conversations = await apiGet('/conversations');
  return cache.conversations;
}

async function getConversation(id) {
  const conv = await apiGet(`/conversations/${id}`);
  updateCacheItem('conversations', conv);
  return conv;
}

async function getOrCreateConversation(productId, sellerId) {
  const conv = await apiPost('/conversations', { productId, sellerId });
  updateCacheItem('conversations', conv);
  return conv;
}

async function getConversationByOrder(orderId) {
  try {
    const conv = await apiPost('/conversations', { orderId });
    updateCacheItem('conversations', conv);
    return conv;
  } catch { return null; }
}

async function getMessages(conversationId) {
  return apiGet(`/conversations/${conversationId}/messages`);
}

async function sendMessage(conversationId, text, extra = {}) {
  return apiPost(`/conversations/${conversationId}/messages`, { text, ...extra });
}

async function markConversationRead(conversationId) {
  return apiPut(`/conversations/${conversationId}/read`);
}

function joinConversation(conversationId) { if (socket) socket.emit('conversation:join', conversationId); }
function leaveConversation(conversationId) { if (socket) socket.emit('conversation:leave', conversationId); }

async function getNotifications() {
  cache.notifications = await apiGet('/notifications');
  return cache.notifications;
}

async function getUnreadNotifCount() {
  const data = await apiGet('/notifications/unread-count');
  return data.count;
}

async function markNotifRead(id) { return apiPut(`/notifications/${id}/read`); }
async function markAllNotifsRead() { return apiPut('/notifications/read-all'); }

async function sendOfferApi(productId, amount) {
  return apiPost('/offers', { productId, amount });
}

async function acceptOfferApi(offerId) {
  return apiPut(`/offers/${offerId}/accept`);
}

async function rejectOfferApi(offerId) {
  return apiPut(`/offers/${offerId}/reject`);
}

async function counterOfferApi(offerId, amount) {
  return apiPut(`/offers/${offerId}/counter`, { amount });
}

async function toggleFavorite(productId) { return apiPost('/favorites', { productId }); }
async function getFavorites() { return apiGet('/favorites'); }

async function openDisputeApi(orderId, reason, description) {
  return apiPost('/disputes', { orderId, reason, description });
}

async function getDispute(id) { return apiGet(`/disputes/${id}`); }

// === Export ===
export const store = {
  // Event system
  on, emit,

  // Sync cache compat (old API)
  getAll, getById, filter, add, update, remove, set, get, generateId,
  getCurrentUser: () => currentUser,
  isLoggedIn: () => currentUser !== null,

  // Auth
  login, register, logout, restoreSession,

  // Async API
  getProducts, getProduct, createProduct,
  getUser,
  getOrders, getOrder, createOrder, confirmOrder, cancelOrder: cancelOrderApi,
  getConversations, getConversation, getOrCreateConversation, getConversationByOrder,
  getMessages, sendMessage, markConversationRead,
  joinConversation, leaveConversation,
  getNotifications, getUnreadNotifCount, markNotifRead, markAllNotifsRead,
  sendOffer: sendOfferApi,
  acceptOffer: acceptOfferApi,
  rejectOffer: rejectOfferApi,
  counterOffer: counterOfferApi,
  toggleFavorite, getFavorites,
  openDispute: openDisputeApi, getDispute,

  get socket() { return socket; },
  refreshCache,
  apiPut
};
