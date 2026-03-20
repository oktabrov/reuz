// ==========================================
// ReUz — Product Detail Page (Vinted-style)
// ==========================================

import { store } from '../store.js';
import { formatPrice, calculatePricing } from '../logic/pricing.js';
import { calculateShipping } from '../logic/shipping.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';
import { getLanguage } from '../i18n.js';

export async function renderProductDetailPage(productId) {
  let product = store.getById('products', productId);
  if (!product) {
    try { product = await store.getProduct(productId); } catch {}
  }
  const lang = getLanguage();

  if (!product) {
    const notFoundLabel = lang === 'uz' ? 'Buyum topilmadi' : 'Product not found';
    const browseLabel = lang === 'uz' ? 'Buyumlarni ko\'rish' : 'Browse items';
    return `<div class="page"><div class="container"><div class="empty-state"><div class="empty-state-icon">?</div><div class="empty-state-title">${notFoundLabel}</div><button class="btn btn-primary" onclick="location.hash=''">${browseLabel}</button></div></div></div>`;
  }

  let seller = store.getById('users', product.sellerId);
  if (!seller) {
    try { seller = await store.getUser(product.sellerId); } catch {}
  }
  const currentUser = store.getCurrentUser();
  const isOwner = currentUser && currentUser.id === product.sellerId;

  let shippingPreview = null;
  let pricingPreview = null;
  if (currentUser && seller) {
    shippingPreview = calculateShipping(seller.region, currentUser.region);
    pricingPreview = calculatePricing(product.price, shippingPreview.cost);
  }

  // i18n labels
  const L = {
    brand: lang === 'uz' ? 'Brend' : 'Brand',
    size: lang === 'uz' ? 'O\'lcham' : 'Size',
    condition: lang === 'uz' ? 'Holat' : 'Condition',
    category: lang === 'uz' ? 'Kategoriya' : 'Category',
    material: lang === 'uz' ? 'Material' : 'Material',
    color: lang === 'uz' ? 'Rang' : 'Color',
    uploaded: lang === 'uz' ? 'Yuklangan' : 'Uploaded',
    views: lang === 'uz' ? 'Ko\'rishlar' : 'Views',
    description: lang === 'uz' ? 'Tavsif' : 'Description',
    unknown: lang === 'uz' ? 'Noma\'lum' : 'Unknown',
    oneSize: lang === 'uz' ? 'Bir o\'lcham' : 'One Size',
    other: lang === 'uz' ? 'Boshqa' : 'Other',
    buyNow: lang === 'uz' ? 'Hozir sotib olish' : 'Buy now',
    makeOffer: lang === 'uz' ? 'Taklif berish' : 'Make an offer',
    msgSeller: lang === 'uz' ? 'Sotuvchiga xabar' : 'Message seller',
    loginToBuy: lang === 'uz' ? 'Sotib olish uchun tizimga kiring' : 'Log in to buy',
    needLogin: lang === 'uz' ? 'Avval tizimga kirishingiz kerak' : 'You need to log in first',
    yourListing: lang === 'uz' ? 'Bu sizning e\'loningiz' : 'This is your listing',
    sold: lang === 'uz' ? 'SOTILGAN' : 'SOLD',
    soldMsg: lang === 'uz' ? 'Bu buyum sotilgan' : 'This item has been sold',
    items: lang === 'uz' ? 'buyum' : 'items',
    buyerProt: lang === 'uz' ? 'Xaridor himoyasi' : 'Buyer Protection',
    buyerProtFee: lang === 'uz' ? 'Xaridor himoyasi to\'lovi' : 'Buyer Protection fee',
    buyerProtDesc: lang === 'uz'
      ? 'har bir xarid uchun to\'lov sifatida qo\'shiladi. Xaridor himoyasi bizning Qaytarish siyosatini o\'z ichiga oladi.'
      : 'is added for a fee to every purchase made with the "Buy now" button. Buyer Protection includes our Refund Policy.',
    refundPolicy: lang === 'uz' ? 'Qaytarish siyosati' : 'Refund Policy',
    includesProt: lang === 'uz' ? 'Xaridor himoyasi bilan' : 'Includes Buyer Protection',
    shipping: lang === 'uz' ? 'Yetkazib berish' : 'Shipping',
    freeShipping: lang === 'uz' ? 'Bepul yetkazib berish' : 'Free shipping',
    offerTitle: lang === 'uz' ? 'Taklif narxingiz' : 'Your offer price',
    offerSend: lang === 'uz' ? 'Taklifni yuborish' : 'Send offer',
    offerCancel: lang === 'uz' ? 'Bekor qilish' : 'Cancel',
  };

  // Time ago for upload date
  const uploadedAgo = getTimeAgo(product.createdAt, lang);

  // Shipping label
  const shippingLine = shippingPreview
    ? (shippingPreview.cost === 0 ? L.freeShipping : `${L.shipping}: ${formatPrice(shippingPreview.cost)}`)
    : '';

  // Product price with protection
  const totalPrice = pricingPreview ? formatPrice(pricingPreview.buyerPays) : formatPrice(product.price);

  // Images grid
  const images = product.images || [];
  let imageHtml = '';
  if (images.length >= 3) {
    imageHtml = `
      <div class="product-images-grid">
        ${images.slice(0, 3).map((img, i) => `
          <div class="product-image-cell" data-img="${img}" data-index="${i}">
            <img src="${img}" alt="${product.title} ${i + 1}" loading="lazy" />
          </div>
        `).join('')}
      </div>
    `;
  } else if (images.length === 2) {
    imageHtml = `
      <div class="product-images-grid" style="grid-template-columns: 1fr 1fr;">
        ${images.map((img, i) => `
          <div class="product-image-cell" data-img="${img}" data-index="${i}" style="grid-row: auto;">
            <img src="${img}" alt="${product.title} ${i + 1}" loading="lazy" />
          </div>
        `).join('')}
      </div>
    `;
  } else {
    imageHtml = `
      <div class="product-images-single" data-img="${images[0] || ''}" data-index="0">
        <img src="${images[0] || ''}" alt="${product.title}" />
      </div>
    `;
  }

  // Details table rows
  const detailRows = [
    [L.condition, product.condition || L.unknown],
    [L.brand, product.brand || L.unknown],
    [L.size, product.size || L.oneSize],
    [L.category, product.category || L.other],
    [L.material, product.material || '-'],
    [L.color, product.color || '-'],
    [L.uploaded, uploadedAgo],
  ];

  return `
    <div class="page">
      <div class="container">
        <div class="product-detail-grid">
          <!-- Left: Images -->
          <div>
            ${imageHtml}
          </div>

          <!-- Right: Info Panel -->
          <div class="product-info-panel animate-fadeInUp">
            <!-- Title & condition -->
            <h1 style="font-size: var(--font-size-xl); margin-bottom: var(--space-2xs); line-height: 1.3;">${product.title}</h1>
            <div class="text-xs text-muted" style="margin-bottom: var(--space-md);">
              ${product.size || ''} ${product.size ? '·' : ''} ${product.condition || ''} ${product.brand ? '· ' + product.brand : ''} · ${uploadedAgo}
            </div>

            <!-- Price Section -->
            <div class="product-price-section">
              ${pricingPreview ? `
                <div class="product-price-original">${formatPrice(product.price)}</div>
                <div class="product-price-current">${totalPrice}</div>
              ` : `
                <div class="product-price-current">${formatPrice(product.price)}</div>
              `}
              <div class="product-protection-line">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <a href="#/help/buyer-protection-fee">${L.includesProt}</a>
              </div>
            </div>

            <!-- Details Table -->
            <table class="product-details-table">
              ${detailRows.map(([label, value]) => `
                <tr><td>${label}</td><td>${value}</td></tr>
              `).join('')}
            </table>

            <!-- Description -->
            <div style="margin-bottom: var(--space-lg);">
              <p class="text-sm text-secondary" style="line-height: var(--line-height-relaxed);">${product.description}</p>
            </div>

            <!-- Shipping -->
            ${shippingLine ? `
              <div class="text-sm" style="margin-bottom: var(--space-lg);">
                <strong>${shippingLine}</strong>
              </div>
            ` : ''}

            <!-- Three Buttons -->
            ${!product.sold && !isOwner ? `
              <div class="product-buttons-stack">
                <button class="btn btn-primary btn-lg btn-full" id="buy-btn" ${!currentUser ? 'disabled' : ''}>
                  ${currentUser ? L.buyNow : L.loginToBuy}
                </button>
                ${currentUser ? `
                  <button class="btn btn-secondary btn-lg btn-full" id="offer-btn" style="background: transparent; border: 2px solid var(--border-default); color: var(--text-primary);">
                    ${L.makeOffer}
                  </button>
                  <button class="btn btn-secondary btn-lg btn-full" id="msg-seller-btn" style="background: transparent; border: 2px solid var(--border-default); color: var(--text-primary);">
                    ${L.msgSeller}
                  </button>
                ` : `<p class="text-center text-xs text-muted">${L.needLogin}</p>`}
              </div>
            ` : isOwner ? `
              <div class="text-center text-muted text-sm" style="padding: var(--space-md); background: var(--bg-surface); border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
                ${L.yourListing}
              </div>
            ` : `
              <div class="text-center" style="padding: var(--space-md); background: var(--bg-error); border-radius: var(--radius-md); margin-bottom: var(--space-lg);">
                <span class="text-error font-semibold">${L.soldMsg}</span>
              </div>
            `}

            <!-- Buyer Protection Card (Vinted-style) -->
            <div class="buyer-prot-card">
              <div class="buyer-prot-card-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="buyer-prot-card-text">
                <strong>${L.buyerProtFee}</strong>
                ${lang === 'uz' ? 'Bizning' : 'Our'} <a href="#/help/buyer-protection-fee" style="color: var(--color-primary); text-decoration: underline;">${L.buyerProt}</a> ${L.buyerProtDesc}
                <br/>${L.buyerProt} ${lang === 'uz' ? 'bizning' : 'includes our'} <a href="#/help/refund-policy" style="color: var(--color-primary); text-decoration: underline;">${L.refundPolicy}</a>.
              </div>
            </div>

            <!-- Seller Info -->
            ${seller ? `
              <div class="card" style="margin-top: var(--space-lg); cursor: pointer;" id="seller-link" data-seller-id="${seller.id}">
                <div class="flex items-center gap-sm">
                  <div class="avatar avatar-md">${seller.name.charAt(0)}</div>
                  <div>
                    <div class="font-semibold text-sm">${seller.name}</div>
                    <div class="text-xs text-muted">${seller.rating.toFixed(1)} · ${seller.listingsCount} ${L.items} · ${seller.region}</div>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>

    <!-- Offer Modal (hidden) -->
    <div id="offer-modal-overlay" style="display: none;"></div>

    <!-- Image Lightbox (hidden) -->
    <div id="image-lightbox" style="display: none;"></div>
  `;
}

function getTimeAgo(timestamp, lang) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (lang === 'uz') {
    if (mins < 60) return `${mins} daqiqa oldin`;
    if (hours < 24) return `${hours} soat oldin`;
    return `${days} kun oldin`;
  }
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export function attachProductDetailEvents(productId) {
  const product = store.getById('products', productId);
  const lang = getLanguage();

  // === Image click to zoom ===
  document.querySelectorAll('.product-image-cell, .product-images-single').forEach(cell => {
    cell.addEventListener('click', () => {
      const img = cell.dataset.img || cell.querySelector('img')?.src;
      if (img) openLightbox(img);
    });
  });

  // === Buy button ===
  const buyBtn = document.getElementById('buy-btn');
  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      const user = store.getCurrentUser();
      if (!user) { navigateTo('/login'); return; }
      navigateTo(`/checkout/${productId}`);
    });
  }

  // === Make an offer ===
  const offerBtn = document.getElementById('offer-btn');
  if (offerBtn && product) {
    offerBtn.addEventListener('click', () => {
      const user = store.getCurrentUser();
      if (!user) { navigateTo('/login'); return; }
      openOfferModal(product, lang);
    });
  }

  // === Message seller ===
  const msgSellerBtn = document.getElementById('msg-seller-btn');
  if (msgSellerBtn && product) {
    msgSellerBtn.addEventListener('click', async () => {
      const user = store.getCurrentUser();
      if (!user) { navigateTo('/login'); return; }
      try {
        const conv = await store.getOrCreateConversation(productId, product.sellerId);
        if (conv) {
          // Auto-send product preview if first message
          if (!conv.messages || conv.messages.length === 0) {
            const previewText = `📦 ${product.title} — ${formatPrice(product.price)}\n${product.condition || ''} · ${product.brand || ''}`;
            await store.sendMessage(conv.id, previewText);
          }
          navigateTo(`/messages/${conv.id}`);
        }
      } catch (err) {
        showToast('Failed to start conversation', 'error');
      }
    });
  }

  // === Seller link ===
  const sellerLink = document.getElementById('seller-link');
  if (sellerLink) {
    sellerLink.addEventListener('click', () => {
      navigateTo(`/profile/${sellerLink.dataset.sellerId}`);
    });
  }

  // Views are incremented server-side when product is fetched
}

// === Offer Modal ===
function openOfferModal(product, lang) {
  const overlay = document.getElementById('offer-modal-overlay');
  if (!overlay) return;

  const L = {
    title: lang === 'uz' ? 'Taklif berish' : 'Make an Offer',
    currentPrice: lang === 'uz' ? 'Joriy narx' : 'Current price',
    yourOffer: lang === 'uz' ? 'Taklifingiz' : 'Your offer',
    send: lang === 'uz' ? 'Taklifni yuborish' : 'Send Offer',
    cancel: lang === 'uz' ? 'Bekor qilish' : 'Cancel',
  };

  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <div class="offer-modal-overlay" id="offer-modal-bg">
      <div class="offer-modal">
        <div class="offer-modal-title">${L.title}</div>
        <div class="text-xs text-muted" style="margin-bottom: var(--space-md);">${L.currentPrice}: <strong>${formatPrice(product.price)}</strong></div>
        <div class="offer-modal-price">
          <span class="text-lg font-bold">$</span>
          <input type="number" id="offer-amount" placeholder="0.00" step="0.50" min="1" max="${(product.price * 0.95).toFixed(2)}" value="${(product.price * 0.8).toFixed(2)}" />
        </div>
        <div class="offer-modal-buttons">
          <button class="btn btn-ghost" id="offer-cancel">${L.cancel}</button>
          <button class="btn btn-primary" id="offer-send">${L.send}</button>
        </div>
      </div>
    </div>
  `;

  // Close on background click
  document.getElementById('offer-modal-bg')?.addEventListener('click', (e) => {
    if (e.target.id === 'offer-modal-bg') closeOfferModal();
  });

  document.getElementById('offer-cancel')?.addEventListener('click', () => closeOfferModal());

  document.getElementById('offer-send')?.addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('offer-amount')?.value);
    if (!amount || amount <= 0) {
      showToast(lang === 'uz' ? 'Iltimos, narx kiriting' : 'Please enter a price', 'error');
      return;
    }
    const user = store.getCurrentUser();
    if (!user) { navigateTo('/login'); return; }
    closeOfferModal();

    try {
      const result = await store.sendOffer(product.id, amount);
      showToast(
        lang === 'uz'
          ? `${formatPrice(amount)} taklif yuborildi!`
          : `Offer of ${formatPrice(amount)} sent!`,
        'success'
      );
      if (result && result.conv) {
        navigateTo(`/messages/${result.conv.id}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to send offer', 'error');
    }
  });
}

function closeOfferModal() {
  const overlay = document.getElementById('offer-modal-overlay');
  if (overlay) { overlay.style.display = 'none'; overlay.innerHTML = ''; }
}

// === Image Lightbox ===
function openLightbox(imgSrc) {
  const lightbox = document.getElementById('image-lightbox');
  if (!lightbox) return;

  lightbox.style.display = 'block';
  lightbox.innerHTML = `
    <div class="image-lightbox-overlay" id="lightbox-bg">
      <button class="image-lightbox-close" id="lightbox-close">&times;</button>
      <img src="${imgSrc}" alt="Full size" />
    </div>
  `;

  document.getElementById('lightbox-bg')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox-bg' || e.target.id === 'lightbox-close') closeLightbox();
  });
  document.getElementById('lightbox-close')?.addEventListener('click', () => closeLightbox());

  // ESC key
  const escHandler = (e) => {
    if (e.key === 'Escape') { closeLightbox(); document.removeEventListener('keydown', escHandler); }
  };
  document.addEventListener('keydown', escHandler);
}

function closeLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  if (lightbox) { lightbox.style.display = 'none'; lightbox.innerHTML = ''; }
}
