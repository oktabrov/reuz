// ==========================================
// ReUz — Navbar Component with Chat & Notifications
// ==========================================

import { store } from '../store.js';
import { navigateTo } from '../router.js';
import { getLanguage, toggleLanguage } from '../i18n.js';
import { openCategoryBrowser } from './categoryBrowser.js';
import { icons } from '../icons.js';

let navbarUnsubscribers = [];

export function renderNavbar() {
  const user = store.getCurrentUser();
  const lang = getLanguage();

  const langLabel = lang === 'uz' ? 'UZ' : 'EN';

  // Badge counts (start empty, updated async after render)
  let msgBadge = '';
  let notifBadge = '';

  return `
    <nav class="navbar">
      <div class="navbar-inner">
        <div class="navbar-logo" id="nav-logo">
          <svg width="72" height="28" viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="22" font-family="Inter, sans-serif" font-size="24" font-weight="800" letter-spacing="-1">
              <tspan fill="#FFFFFF">Re</tspan><tspan fill="#00FF9D">Uz</tspan>
            </text>
          </svg>
        </div>

        <div class="navbar-search">
          ${icons.search}
          <input type="text" id="nav-search" placeholder="${lang === 'uz' ? 'Buyumlarni qidirish...' : 'Search for items, brands...'}" />
        </div>

        <button class="navbar-search-mobile-btn" id="nav-search-mobile-btn" title="${lang === 'uz' ? 'Qidirish' : 'Search'}">
          ${icons.search}
        </button>

        <div class="navbar-actions">
          <button class="btn btn-ghost btn-sm" id="nav-catalog-btn" title="${lang === 'uz' ? 'Katalog' : 'Catalog'}">
            ${icons.catalog} ${lang === 'uz' ? 'Katalog' : 'Catalog'}
          </button>

          <button class="btn btn-ghost btn-sm" id="nav-help-btn" title="${lang === 'uz' ? 'Yordam' : 'Help'}">
            ${icons.help}
          </button>

          <button class="btn btn-ghost btn-sm" id="nav-lang-btn" title="${lang === 'uz' ? 'Tilni almashtirish' : 'Switch language'}" style="font-weight: 700; min-width: 40px;">
            ${langLabel}
          </button>

          ${user ? `
            <button class="btn btn-primary btn-sm" id="nav-sell-btn">
              + ${lang === 'uz' ? 'Sotish' : 'Sell'}
            </button>

            <button class="navbar-action-btn" id="nav-orders-btn" title="${lang === 'uz' ? 'Buyurtmalarim' : 'My Orders'}">
              ${icons.package}
            </button>

            <button class="navbar-action-btn" id="nav-chat-btn" title="${lang === 'uz' ? 'Xabarlar' : 'Messages'}">
              ${icons.chat}
              ${msgBadge}
            </button>

            <div class="navbar-notif-wrapper" id="nav-notif-wrapper">
              <button class="navbar-action-btn" id="nav-notif-btn" title="${lang === 'uz' ? 'Bildirishnomalar' : 'Notifications'}">
                ${icons.bell}
                ${notifBadge}
              </button>
              <div class="navbar-notif-dropdown" id="nav-notif-dropdown" style="display:none">
                ${renderNotificationDropdown([], lang)}
              </div>
            </div>

            <button class="navbar-action-btn navbar-mobile-logout" id="nav-mobile-logout-btn" title="${lang === 'uz' ? 'Chiqish' : 'Log Out'}">
              ${icons.logout}
            </button>

            <div class="navbar-user" id="nav-user-container">
              <button class="avatar avatar-sm" id="nav-avatar-btn">
                ${user.name.charAt(0)}
              </button>
              <div class="navbar-user-menu" id="nav-user-menu" style="display:none">
                <div style="padding: var(--space-sm) var(--space-md);">
                  <div class="font-semibold text-sm">${user.name}</div>
                  <div class="text-xs text-muted">${user.email}</div>
                </div>
                <div class="navbar-user-menu-divider"></div>
                <button class="navbar-user-menu-item" data-nav="profile">${icons.user} ${lang === 'uz' ? 'Profilim' : 'My Profile'}</button>
                <button class="navbar-user-menu-item" data-nav="orders">${icons.package} ${lang === 'uz' ? 'Buyurtmalarim' : 'My Orders'}</button>
                <button class="navbar-user-menu-item" data-nav="messages">${icons.chat} ${lang === 'uz' ? 'Xabarlar' : 'Messages'}</button>
                <button class="navbar-user-menu-item" data-nav="admin">${icons.dashboard} ${lang === 'uz' ? 'Boshqaruv paneli' : 'Admin Dashboard'}</button>
                <div class="navbar-user-menu-divider"></div>
                <button class="navbar-user-menu-item" id="nav-logout-btn">${icons.logout} ${lang === 'uz' ? 'Chiqish' : 'Log Out'}</button>
              </div>
            </div>
          ` : `
            <button class="btn btn-ghost btn-sm" id="nav-login-btn">${lang === 'uz' ? 'Kirish' : 'Log In'}</button>
            <button class="btn btn-primary btn-sm" id="nav-register-btn">${lang === 'uz' ? 'Royxatdan otish' : 'Sign Up'}</button>
          `}
        </div>
      </div>
    </nav>

    ${user ? `
    <nav class="bottom-nav" id="bottom-nav">
      <button class="bottom-nav-item" data-bnav="home" id="bnav-home">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>${lang === 'uz' ? 'Bosh sahifa' : 'Home'}</span>
      </button>
      <button class="bottom-nav-item" data-bnav="search" id="bnav-search">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>${lang === 'uz' ? 'Qidirish' : 'Search'}</span>
      </button>
      <button class="bottom-nav-item bottom-nav-sell" data-bnav="sell" id="bnav-sell">
        <div class="bottom-nav-sell-icon">+</div>
        <span>${lang === 'uz' ? 'Sotish' : 'Sell'}</span>
      </button>
      <button class="bottom-nav-item" data-bnav="inbox" id="bnav-inbox">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span>${lang === 'uz' ? 'Xabarlar' : 'Inbox'}</span>
        <span class="bottom-nav-badge" id="bnav-msg-badge" style="display:none"></span>
      </button>
      <button class="bottom-nav-item" data-bnav="profile" id="bnav-profile">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>${lang === 'uz' ? 'Profil' : 'Profile'}</span>
      </button>
    </nav>
    ` : ''}
  `;
}

function renderNotificationDropdown(notifs, lang) {
  const safeNotifs = Array.isArray(notifs) ? notifs : [];
  const unreadCount = safeNotifs.filter(n => !n.read).length;

  const typeIcons = {
    purchase: '💰',
    message: '💬',
    dispute: '⚠️',
    order_update: '📦',
    system: 'ℹ️'
  };

  if (safeNotifs.length === 0) {
    return `
      <div class="notif-dropdown-header">
        <span class="font-semibold text-sm">${lang === 'uz' ? 'Bildirishnomalar' : 'Notifications'}</span>
      </div>
      <div class="notif-empty">
        <span class="text-sm text-muted">${lang === 'uz' ? 'Bildirishnomalar yo\'q' : 'No notifications yet'}</span>
      </div>
    `;
  }

  return `
    <div class="notif-dropdown-header">
      <span class="font-semibold text-sm">${lang === 'uz' ? 'Bildirishnomalar' : 'Notifications'}</span>
      ${unreadCount > 0 ? `<button class="btn btn-ghost btn-xs" id="notif-mark-all">${lang === 'uz' ? 'Barchasini o\'qilgan' : 'Mark all read'}</button>` : ''}
    </div>
    <div class="notif-dropdown-list">
      ${safeNotifs.map(n => `
        <div class="notif-item ${n.read ? '' : 'notif-unread'}" data-notif-id="${n.id}" data-notif-link="${n.link || ''}">
          <div class="notif-item-icon">${typeIcons[n.type] || 'ℹ️'}</div>
          <div class="notif-item-content">
            <div class="notif-item-title">${n.title}</div>
            <div class="notif-item-msg">${n.message}</div>
            <div class="notif-item-time">${getTimeAgo(n.createdAt, lang)}</div>
          </div>
          ${!n.read ? '<div class="notif-item-dot"></div>' : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function getTimeAgo(timestamp, lang) {
  const diff = Date.now() - timestamp;
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (lang === 'uz') {
    if (secs < 60) return 'hozirgina';
    if (mins < 60) return `${mins} daqiqa oldin`;
    if (hours < 24) return `${hours} soat oldin`;
    return `${days} kun oldin`;
  }
  if (secs < 60) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function attachNavbarEvents() {
  // Clean up previous listeners
  navbarUnsubscribers.forEach(unsub => unsub());
  navbarUnsubscribers = [];

  const logo = document.getElementById('nav-logo');
  if (logo) logo.addEventListener('click', () => navigateTo('/'));

  const search = document.getElementById('nav-search');
  if (search) {
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && search.value.trim()) {
        navigateTo(`/search/${encodeURIComponent(search.value.trim())}`);
      }
    });
  }

  const sellBtn = document.getElementById('nav-sell-btn');
  if (sellBtn) sellBtn.addEventListener('click', () => navigateTo('/sell'));

  const ordersBtn = document.getElementById('nav-orders-btn');
  if (ordersBtn) ordersBtn.addEventListener('click', () => navigateTo('/orders'));

  const loginBtn = document.getElementById('nav-login-btn');
  if (loginBtn) loginBtn.addEventListener('click', () => navigateTo('/login'));

  const registerBtn = document.getElementById('nav-register-btn');
  if (registerBtn) registerBtn.addEventListener('click', () => navigateTo('/register'));

  // Help Center
  const helpBtn = document.getElementById('nav-help-btn');
  if (helpBtn) helpBtn.addEventListener('click', () => navigateTo('/help'));

  // Mobile search toggle
  const searchMobileBtn = document.getElementById('nav-search-mobile-btn');
  if (searchMobileBtn) {
    searchMobileBtn.addEventListener('click', () => {
      const searchBar = document.querySelector('.navbar-search');
      if (searchBar) {
        const isShown = searchBar.classList.toggle('navbar-search-show');
        if (isShown) {
          const input = searchBar.querySelector('input');
          if (input) input.focus();
        }
      }
    });
  }

  // Language toggle
  const langBtn = document.getElementById('nav-lang-btn');
  if (langBtn) langBtn.addEventListener('click', () => toggleLanguage());

  // Catalog
  const catalogBtn = document.getElementById('nav-catalog-btn');
  if (catalogBtn) {
    catalogBtn.addEventListener('click', () => {
      openCategoryBrowser((catId) => {
        navigateTo(`/search/${encodeURIComponent(catId)}`);
      });
    });
  }

  // === Chat button ===
  const chatBtn = document.getElementById('nav-chat-btn');
  if (chatBtn) chatBtn.addEventListener('click', () => navigateTo('/messages'));

  // === Notifications button ===
  const notifBtn = document.getElementById('nav-notif-btn');
  const notifDropdown = document.getElementById('nav-notif-dropdown');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = notifDropdown.style.display !== 'none';
      notifDropdown.style.display = isOpen ? 'none' : 'block';

      // Refresh dropdown content when opening
      if (!isOpen) {
        const user = store.getCurrentUser();
        const lang = getLanguage();
        if (user) {
          store.getNotifications().then(notifs => {
            notifDropdown.innerHTML = renderNotificationDropdown(notifs.slice(0, 15), lang);
            attachNotifDropdownEvents();
          });
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#nav-notif-wrapper')) {
        notifDropdown.style.display = 'none';
      }
    });

    attachNotifDropdownEvents();
  }

  // User menu toggle
  const avatarBtn = document.getElementById('nav-avatar-btn');
  const userMenu = document.getElementById('nav-user-menu');
  if (avatarBtn && userMenu) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.style.display = userMenu.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', () => {
      userMenu.style.display = 'none';
    });

    userMenu.querySelectorAll('[data-nav]').forEach(item => {
      item.addEventListener('click', () => {
        navigateTo(`/${item.dataset.nav}`);
        userMenu.style.display = 'none';
      });
    });
  }

  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
      navigateTo('/login');
    });
  }

  // Mobile logout button
  const mobileLogoutBtn = document.getElementById('nav-mobile-logout-btn');
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', () => {
      store.logout();
      navigateTo('/login');
    });
  }

  // === Real-time badge updates ===
  const user = store.getCurrentUser();
  if (user) {
    const unsubNotif = store.on('notifications', () => updateBadges());
    const unsubConv = store.on('conversations', () => updateBadges());
    navbarUnsubscribers.push(unsubNotif, unsubConv);
  }

  // === Bottom Nav ===
  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) {
    bottomNav.querySelectorAll('.bottom-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const route = item.dataset.bnav;
        if (route === 'home') navigateTo('/');
        else if (route === 'search') {
          // Toggle mobile search bar
          const searchBar = document.querySelector('.navbar-search');
          if (searchBar) {
            searchBar.classList.toggle('navbar-search-show');
            const input = searchBar.querySelector('input');
            if (input && searchBar.classList.contains('navbar-search-show')) input.focus();
          }
        }
        else if (route === 'sell') navigateTo('/sell');
        else if (route === 'inbox') navigateTo('/messages');
        else if (route === 'profile') navigateTo('/profile');
      });
    });

    // Highlight active tab
    updateBottomNavActive();
  }
}

function attachNotifDropdownEvents() {
  // Mark all as read
  const markAllBtn = document.getElementById('notif-mark-all');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const user = store.getCurrentUser();
      if (user) {
        await store.markAllNotifsRead();
        updateBadges();
        const dropdown = document.getElementById('nav-notif-dropdown');
        const lang = getLanguage();
        if (dropdown) {
          const notifs = await store.getNotifications();
          dropdown.innerHTML = renderNotificationDropdown(notifs.slice(0, 15), lang);
          attachNotifDropdownEvents();
        }
      }
    });
  }

  // Click individual notification
  document.querySelectorAll('.notif-item').forEach(item => {
    item.addEventListener('click', async () => {
      const notifId = item.dataset.notifId;
      const link = item.dataset.notifLink;
      if (notifId) await store.markNotifRead(notifId);
      updateBadges();
      const dropdown = document.getElementById('nav-notif-dropdown');
      if (dropdown) dropdown.style.display = 'none';
      if (link) navigateTo(link);
    });
  });
}

async function updateBadges() {
  const user = store.getCurrentUser();
  if (!user) return;

  try {
    // Update notification badge from API
    const notifCount = await store.getUnreadNotifCount();
    const notifBtn = document.getElementById('nav-notif-btn');
    if (notifBtn) {
      const existingBadge = notifBtn.querySelector('.navbar-badge');
      if (notifCount > 0) {
        if (existingBadge) {
          existingBadge.textContent = notifCount > 9 ? '9+' : notifCount;
        } else {
          notifBtn.insertAdjacentHTML('beforeend', `<span class="navbar-badge navbar-badge-notif">${notifCount > 9 ? '9+' : notifCount}</span>`);
        }
      } else if (existingBadge) {
        existingBadge.remove();
      }
    }

    // Update bottom nav inbox badge
    const bnavBadge = document.getElementById('bnav-msg-badge');
    if (bnavBadge) {
      const convs = store.getAll('conversations') || [];
      const unread = convs.filter(c => c.unreadCount > 0).length;
      if (unread > 0) {
        bnavBadge.textContent = unread > 9 ? '9+' : unread;
        bnavBadge.style.display = '';
      } else {
        bnavBadge.style.display = 'none';
      }
    }
  } catch {}
}

function updateBottomNavActive() {
  const hash = window.location.hash || '#/';
  const path = hash.replace('#', '');
  const bottomNav = document.getElementById('bottom-nav');
  if (!bottomNav) return;

  bottomNav.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.classList.remove('active');
  });

  let activeId = 'bnav-home';
  if (path === '/' || path === '') activeId = 'bnav-home';
  else if (path.startsWith('/search')) activeId = 'bnav-search';
  else if (path === '/sell') activeId = 'bnav-sell';
  else if (path.startsWith('/messages') || path.startsWith('/chat')) activeId = 'bnav-inbox';
  else if (path.startsWith('/profile') || path.startsWith('/orders')) activeId = 'bnav-profile';

  const active = document.getElementById(activeId);
  if (active) active.classList.add('active');
}
