// ==========================================
// ReUz — Checkout Page
// ==========================================

import { store } from '../store.js';
import { calculatePricing, formatPrice } from '../logic/pricing.js';
import { calculateShipping } from '../logic/shipping.js';
import { renderPriceBreakdown } from '../components/priceBreakdown.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';
import { getLanguage } from '../i18n.js';

export async function renderCheckoutPage(productId) {
  const user = store.getCurrentUser();
  if (!user) { navigateTo('/login'); return ''; }

  let product = store.getById('products', productId);
  if (!product) {
    try { product = await store.getProduct(productId); } catch {}
  }
  if (!product) { navigateTo('/'); return ''; }

  const lang = getLanguage();

  if (product.sold) {
    showToast(lang === 'uz' ? 'Bu buyum allaqachon sotilgan' : 'This item has already been sold', 'error');
    navigateTo('/');
    return '';
  }

  let seller = store.getById('users', product.sellerId);
  if (!seller) {
    try { seller = await store.getUser(product.sellerId); } catch {}
  }
  if (!seller) { navigateTo('/'); return ''; }
  const shipping = calculateShipping(seller.region, user.region);
  const pricing = calculatePricing(product.price, shipping.cost);

  const checkoutTitle = lang === 'uz' ? 'Buyurtmani rasmiylashtirish' : 'Checkout';
  const itemLabel = lang === 'uz' ? 'Buyum' : 'Item';
  const paymentStepLabel = lang === 'uz' ? 'To\'lov' : 'Payment';
  const doneLabel = lang === 'uz' ? 'Tayyor' : 'Done';
  const shippingToLabel = lang === 'uz' ? 'Yetkazish manzili' : 'Shipping to';
  const fromLabel = lang === 'uz' ? '' : 'From';
  const paymentDetailsLabel = lang === 'uz' ? 'To\'lov tafsilotlari' : 'Payment Details';
  const simulatedLabel = lang === 'uz' ? 'Simulyatsiya — haqiqiy to\'lov amalga oshirilmaydi' : 'Simulated — no real payment will be made';
  const cardNumberLabel = lang === 'uz' ? 'Karta raqami' : 'Card Number';
  const expiryLabel = lang === 'uz' ? 'Amal qilish muddati' : 'Expiry';
  const cvvLabel = lang === 'uz' ? 'CVV' : 'CVV';
  const cardNameLabel = lang === 'uz' ? 'Kartadagi ism' : 'Name on Card';
  const payBtnLabel = lang === 'uz' ? 'To\'lash' : 'Pay';
  const buyerProtLabel = lang === 'uz' ? 'Xaridor himoyasi' : 'Buyer Protection';
  const buyerProtDesc = lang === 'uz' ? 'Buyum tavsifga mos kelmasa pul qaytariladi' : 'Money-back guarantee if item not as described';
  const processingLabel = lang === 'uz' ? 'To\'lov amalga oshirilmoqda...' : 'Processing payment...';
  const waitLabel = lang === 'uz' ? 'Iltimos kuting, sahifani yopmang' : 'Please wait, do not close this page';
  const successLabel = lang === 'uz' ? 'To\'lov muvaffaqiyatli!' : 'Payment Successful!';
  const successDesc = lang === 'uz' ? 'Buyurtmangiz yaratildi. Buyurtma kuzatuviga yo\'naltirilmoqda...' : 'Your order has been created. Redirecting to order tracking...';
  const orderSummaryLabel = lang === 'uz' ? 'Buyurtma xulosasi' : 'Order Summary';

  return `
    <div class="page">
      <div class="container-narrow">
        <!-- Checkout Steps -->
        <div class="checkout-steps">
          <div class="checkout-step completed">
            <div class="checkout-step-number">✓</div>
            <span class="checkout-step-label hide-mobile">${itemLabel}</span>
          </div>
          <div class="checkout-step-line completed"></div>
          <div class="checkout-step active">
            <div class="checkout-step-number">2</div>
            <span class="checkout-step-label hide-mobile">${paymentStepLabel}</span>
          </div>
          <div class="checkout-step-line"></div>
          <div class="checkout-step">
            <div class="checkout-step-number">3</div>
            <span class="checkout-step-label hide-mobile">${doneLabel}</span>
          </div>
        </div>

        <h1 style="margin-bottom: var(--space-xl);">${checkoutTitle}</h1>

        <div class="grid-2" style="gap: var(--space-2xl); align-items: start;" id="checkout-content">
          <!-- Left: Payment Form -->
          <div>
            <!-- Item Summary -->
            <div class="card" style="margin-bottom: var(--space-lg);">
              <div class="flex gap-md items-center">
                <div style="width: 70px; height: 70px; border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0;">
                  <img src="${product.images?.[0] || ''}" style="width: 100%; height: 100%; object-fit: cover;" alt="${product.title}" />
                </div>
                <div>
                  <div class="font-semibold">${product.title}</div>
                  <div class="text-sm text-muted">${product.brand || ''} · ${product.condition}</div>
                </div>
              </div>
            </div>

            <!-- Shipping Info -->
            <div class="card" style="margin-bottom: var(--space-lg);">
              <div class="flex items-center gap-sm" style="margin-bottom: var(--space-sm);">
                <span class="font-semibold">${shippingToLabel}: ${user.region}</span>
              </div>
              <div class="text-sm text-muted">
                ${fromLabel} ${seller.region} · ${shipping.label}
              </div>
            </div>

            <!-- Payment Form -->
            <div class="card">
              <h3 style="margin-bottom: var(--space-md);">${paymentDetailsLabel}</h3>
              <p class="text-xs text-muted" style="margin-bottom: var(--space-md); padding: var(--space-xs) var(--space-sm); background: var(--bg-warning); border-radius: var(--radius-sm); color: var(--color-warning);">
                ${simulatedLabel}
              </p>
              <form id="payment-form" class="payment-form">
                <div class="form-group">
                  <label class="form-label">${cardNumberLabel}</label>
                  <input type="text" class="form-input card-number-display" id="card-number"
                         placeholder="1234 5678 9012 3456" maxlength="19" required />
                </div>
                <div class="card-input-row">
                  <div class="form-group">
                    <label class="form-label">${expiryLabel}</label>
                    <input type="text" class="form-input" id="card-expiry" placeholder="MM/YY" maxlength="5" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">${cvvLabel}</label>
                    <input type="text" class="form-input" id="card-cvv" placeholder="123" maxlength="3" required />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">${cardNameLabel}</label>
                  <input type="text" class="form-input" id="card-name" placeholder="${lang === 'uz' ? 'To\'liq ism' : 'Full name'}" value="${user.name}" required />
                </div>
                <button type="submit" class="btn btn-primary btn-lg btn-full">
                  ${payBtnLabel} ${formatPrice(pricing.buyerPays)}
                </button>
              </form>
            </div>

            <!-- Buyer Protection -->
            <div class="buyer-protection-badge" style="margin-top: var(--space-lg);">
              <span class="buyer-protection-badge-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
              <div class="buyer-protection-badge-text">
                <strong>${buyerProtLabel}</strong> — ${buyerProtDesc}
              </div>
            </div>
          </div>

          <!-- Right: Order Summary -->
          <div>
            ${renderPriceBreakdown(pricing, { title: orderSummaryLabel })}
          </div>
        </div>

        <!-- Processing / Success states (hidden initially) -->
        <div id="payment-processing" class="payment-processing" style="display: none;">
          <div class="spinner"></div>
          <h2>${processingLabel}</h2>
          <p class="text-muted">${waitLabel}</p>
        </div>

        <div id="payment-success" class="payment-processing" style="display: none;">
          <div class="payment-success-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 style="color: var(--color-primary);">${successLabel}</h2>
          <p class="text-secondary">${successDesc}</p>
        </div>
      </div>
    </div>
  `;
}

export function attachCheckoutEvents(productId) {
  const form = document.getElementById('payment-form');
  if (!form) return;

  // Card number formatting
  const cardInput = document.getElementById('card-number');
  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 16);
      v = v.replace(/(\d{4})/g, '$1 ').trim();
      e.target.value = v;
    });
  }

  // Expiry formatting
  const expiryInput = document.getElementById('card-expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
      e.target.value = v;
    });
  }

  const lang = getLanguage();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv = document.getElementById('card-cvv').value;
    const cardName = document.getElementById('card-name').value;

    if (cardNumber.length < 12) {
      showToast(lang === 'uz' ? 'Iltimos, to\'g\'ri karta raqamini kiriting' : 'Please enter a valid card number', 'error');
      return;
    }

    // Show processing
    document.getElementById('checkout-content').style.display = 'none';
    document.getElementById('payment-processing').style.display = 'flex';

    // Simulate processing delay
    setTimeout(async () => {
      try {
        const user = store.getCurrentUser();
        const order = await store.createOrder(user.id, productId, {
          cardNumber: cardNumber.slice(-4),
          cardExpiry,
          cardName
        });

        // Show success
        document.getElementById('payment-processing').style.display = 'none';
        document.getElementById('payment-success').style.display = 'flex';

        // Redirect to transaction chat
        setTimeout(() => {
          navigateTo(`/chat/${order.id}`);
        }, 2000);

      } catch (err) {
        document.getElementById('payment-processing').style.display = 'none';
        document.getElementById('checkout-content').style.display = 'grid';
        showToast(err.message || (lang === 'uz' ? 'To\'lov amalga oshmadi' : 'Payment failed'), 'error');
      }
    }, 2500);
  });
}
