// ==========================================
// ReUz — Main Entry Point (API-backed)
// ==========================================

import './styles/global.css';
import './styles/components.css';
import './styles/helpCenter.css';
import './styles/chat.css';

import { router } from './router.js';
import { store } from './store.js';
import { renderNavbar, attachNavbarEvents } from './components/navbar.js';
import { renderLoginPage, attachLoginEvents } from './pages/login.js';
import { renderRegisterPage, attachRegisterEvents } from './pages/register.js';
import { renderHomePage, attachHomeEvents, renderSearchPage, attachSearchEvents } from './pages/home.js';
import { renderProductDetailPage, attachProductDetailEvents } from './pages/productDetail.js';
import { renderSellPage, attachSellEvents } from './pages/sell.js';
import { renderCheckoutPage, attachCheckoutEvents } from './pages/checkout.js';
import { renderOrdersPage, attachOrdersEvents } from './pages/orders.js';
import { renderOrderDetailPage, attachOrderDetailEvents, cleanupOrderDetail } from './pages/orderDetail.js';
import { renderDisputePage, attachDisputeEvents, cleanupDispute } from './pages/dispute.js';
import { renderChatPage, attachChatEvents, renderProductChatPage, attachProductChatEvents, cleanupChat } from './pages/chat.js';
import { renderProfilePage, attachProfileEvents } from './pages/profile.js';
import { renderAdminPage, attachAdminEvents } from './pages/admin.js';
import { renderHelpCenterPage, attachHelpCenterEvents, renderHelpArticlePage, attachHelpArticleEvents } from './pages/helpCenter.js';
import { renderMessagesPage, attachMessagesEvents } from './pages/messages.js';

const app = document.getElementById('app');

async function renderPage(contentOrPromise, attachFn, ...args) {
  // Cleanup previous page
  cleanupOrderDetail();
  cleanupDispute();
  cleanupChat();

  const content = await contentOrPromise;
  app.innerHTML = renderNavbar() + content;
  attachNavbarEvents();
  if (attachFn) await attachFn(...args);

  window.scrollTo(0, 0);
}

// Auth guard
async function requireAuth(renderFn, attachFn, ...args) {
  if (!store.isLoggedIn()) {
    router.navigate('/login');
    return;
  }
  await renderPage(renderFn(...args), attachFn, ...args);
}

// Setup routes
router
  .add('/', () => {
    renderPage(renderHomePage(), attachHomeEvents);
  })
  .add('/login', () => {
    if (store.isLoggedIn()) { router.navigate('/'); return; }
    renderPage(renderLoginPage(), attachLoginEvents);
  })
  .add('/register', () => {
    if (store.isLoggedIn()) { router.navigate('/'); return; }
    renderPage(renderRegisterPage(), attachRegisterEvents);
  })
  .add('/product/:id', (id) => {
    renderPage(renderProductDetailPage(id), attachProductDetailEvents, id);
  })
  .add('/sell', () => {
    requireAuth(renderSellPage, attachSellEvents);
  })
  .add('/checkout/:id', (id) => {
    requireAuth(renderCheckoutPage, attachCheckoutEvents, id);
  })
  .add('/orders', () => {
    requireAuth(renderOrdersPage, attachOrdersEvents);
  })
  .add('/order/:id', (id) => {
    // Redirect to chat — order details live inside chat
    router.navigate(`/chat/${id}`);
  })
  .add('/chat/:orderId', (orderId) => {
    requireAuth(renderChatPage, attachChatEvents, orderId);
  })
  .add('/messages', () => {
    requireAuth(renderMessagesPage, attachMessagesEvents);
  })
  .add('/messages/:convId', (convId) => {
    requireAuth(renderProductChatPage, attachProductChatEvents, convId);
  })
  .add('/dispute/:orderId', (orderId) => {
    requireAuth(renderDisputePage, attachDisputeEvents, orderId);
  })
  .add('/profile', () => {
    requireAuth(renderProfilePage, attachProfileEvents);
  })
  .add('/profile/:userId', (userId) => {
    renderPage(renderProfilePage(userId), attachProfileEvents);
  })
  .add('/admin', () => {
    requireAuth(renderAdminPage, attachAdminEvents);
  })
  .add('/search/:query', (query) => {
    renderPage(renderSearchPage(query), attachSearchEvents);
  })
  .add('/help', () => {
    renderPage(renderHelpCenterPage(), attachHelpCenterEvents);
  })
  .add('/help/:slug', (slug) => {
    renderPage(renderHelpArticlePage(slug), attachHelpArticleEvents);
  });

// Initialize — restore session from JWT token
async function init() {
  await store.restoreSession();
  router.start();
}

init();
