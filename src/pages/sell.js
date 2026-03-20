// ==========================================
// ReUz — Sell Item Page (Real Image Upload)
// ==========================================

import { store } from '../store.js';
import { navigateTo } from '../router.js';
import { showToast } from '../components/toast.js';
import { REGIONS } from '../logic/shipping.js';
import { openCategoryBrowser } from '../components/categoryBrowser.js';
import { getCategoryLabel } from '../categories.js';
import { getLanguage } from '../i18n.js';

const CONDITIONS_EN = ['New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair'];
const CONDITIONS_UZ = ['Yangi', 'Yangidek', 'A\'lo', 'Juda yaxshi', 'Yaxshi', 'Qoniqarli'];

const MIN_IMAGES = 2;
const MAX_IMAGES = 10;

// State for uploaded images: { file: File, preview: base64 }
let uploadedImages = [];

export function renderSellPage() {
  const user = store.getCurrentUser();
  if (!user) {
    navigateTo('/login');
    return '';
  }

  const lang = getLanguage();
  const conditions = lang === 'uz' ? CONDITIONS_UZ : CONDITIONS_EN;

  const sellWord = lang === 'uz' ? 'Sotish' : 'Sell';
  const itemWord = lang === 'uz' ? 'buyum' : 'an item';
  const photosLabel = lang === 'uz' ? 'Rasmlar *' : 'Photos *';
  const photosHint = lang === 'uz'
    ? `Kamida ${MIN_IMAGES} ta rasm yuklang (maksimal ${MAX_IMAGES} ta)`
    : `Upload at least ${MIN_IMAGES} photos (max ${MAX_IMAGES})`;
  const titleFieldLabel = lang === 'uz' ? 'Sarlavha *' : 'Title *';
  const titlePlaceholder = lang === 'uz' ? 'masalan, Nike Air Max 90' : 'e.g., Nike Air Max 90';
  const descLabel = lang === 'uz' ? 'Tavsif *' : 'Description *';
  const descPlaceholder = lang === 'uz' ? 'Buyumni, uning holatini va kamchiliklarni tasvirlang...' : 'Describe the item, its condition, and any defects...';
  const categoryLabel = lang === 'uz' ? 'Kategoriya *' : 'Category *';
  const categoryPlaceholder = lang === 'uz' ? 'Kategoriyani tanlang...' : 'Select category...';
  const conditionLabel = lang === 'uz' ? 'Holat *' : 'Condition *';
  const selectLabel = lang === 'uz' ? 'Tanlang...' : 'Select...';
  const brandLabel = lang === 'uz' ? 'Brend' : 'Brand';
  const brandPlaceholder = lang === 'uz' ? 'masalan, Nike, Zara' : 'e.g., Nike, Zara';
  const sizeLabel = lang === 'uz' ? 'O\'lcham' : 'Size';
  const sizePlaceholder = lang === 'uz' ? 'masalan, M, US 10, EU 42' : 'e.g., M, US 10, EU 42';
  const priceLabel = lang === 'uz' ? "Narx (so'm) *" : "Price (so'm) *";
  const feeNote = lang === 'uz' ? '3% komissiyadan keyin 97% olasiz' : "You'll receive 97% after the 3% commission";
  const submitLabel = lang === 'uz' ? 'Sotuvga qo\'yish' : 'List Item for Sale';

  // Reset uploaded images when rendering the page
  uploadedImages = [];

  return `
    <div class="page">
      <div class="container-narrow">
        <h1 style="margin-bottom: var(--space-2xl);">
          <span style="color: var(--color-primary);">${sellWord}</span> ${itemWord}
        </h1>

        <div class="card" style="padding: var(--space-xl);">
          <form id="sell-form" class="flex flex-col gap-lg">
            <!-- Photos -->
            <div class="form-group">
              <label class="form-label">${photosLabel}</label>
              <p class="text-xs text-muted" style="margin-bottom: var(--space-xs);">${photosHint}</p>
              <div class="flex gap-sm flex-wrap" id="photo-preview">
                <label class="sell-photo-add" id="photo-add-btn">
                  <input type="file" id="photo-input" accept="image/*" multiple style="display:none" />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span class="text-xs">${lang === 'uz' ? 'Rasm yuklash' : 'Add photos'}</span>
                </label>
              </div>
              <div id="photo-count" class="text-xs text-muted" style="margin-top: var(--space-2xs);">0 / ${MAX_IMAGES}</div>
              <div id="photo-error" class="form-error" style="display:none;"></div>
            </div>

            <div class="form-group">
              <label class="form-label">${titleFieldLabel}</label>
              <input type="text" class="form-input" id="sell-title" placeholder="${titlePlaceholder}" required maxlength="80" />
            </div>

            <div class="form-group">
              <label class="form-label">${descLabel}</label>
              <textarea class="form-input" id="sell-description" placeholder="${descPlaceholder}" required maxlength="1000"></textarea>
            </div>

            <div class="grid-2" style="gap: var(--space-md);">
              <div class="form-group">
                <label class="form-label">${categoryLabel}</label>
                <input type="text" class="form-input" id="sell-category" placeholder="${categoryPlaceholder}" readonly required style="cursor: pointer;" />
                <input type="hidden" id="sell-category-id" />
              </div>
              <div class="form-group">
                <label class="form-label">${conditionLabel}</label>
                <select class="form-input" id="sell-condition" required>
                  <option value="">${selectLabel}</option>
                  ${conditions.map((c, i) => `<option value="${CONDITIONS_EN[i]}">${c}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="grid-2" style="gap: var(--space-md);">
              <div class="form-group">
                <label class="form-label">${brandLabel}</label>
                <input type="text" class="form-input" id="sell-brand" placeholder="${brandPlaceholder}" />
              </div>
              <div class="form-group">
                <label class="form-label">${sizeLabel}</label>
                <input type="text" class="form-input" id="sell-size" placeholder="${sizePlaceholder}" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">${priceLabel}</label>
              <input type="number" class="form-input" id="sell-price" placeholder="100000" min="1000" step="1000" required style="font-size: var(--font-size-xl); font-weight: 700;" />
              <div class="text-xs text-muted" style="margin-top: var(--space-2xs);">
                ${feeNote}
              </div>
              <div id="sell-fee-preview" class="text-sm" style="margin-top: var(--space-xs); color: var(--color-primary);"></div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-full" id="sell-submit-btn">
              ${submitLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function attachSellEvents() {
  const lang = getLanguage();

  // Category browser
  const categoryInput = document.getElementById('sell-category');
  const categoryIdInput = document.getElementById('sell-category-id');
  if (categoryInput) {
    categoryInput.addEventListener('click', () => {
      openCategoryBrowser((catId) => {
        categoryIdInput.value = catId;
        categoryInput.value = getCategoryLabel(catId);
      });
    });
  }

  const priceInput = document.getElementById('sell-price');
  const feePreview = document.getElementById('sell-fee-preview');

  if (priceInput && feePreview) {
    priceInput.addEventListener('input', () => {
      const price = parseInt(priceInput.value);
      if (price > 0) {
        const commission = Math.round(price * 0.03);
        const gets = price - commission;
        const earnLabel = lang === 'uz' ? 'Siz olasiz' : "You'll earn";
        const feeLabel = lang === 'uz' ? 'komissiya' : 'commission';
        feePreview.textContent = `${earnLabel}: ${gets.toLocaleString('ru-RU').replace(/,/g, ' ')} so'm (${feeLabel}: ${commission.toLocaleString('ru-RU').replace(/,/g, ' ')} so'm)`;
      } else {
        feePreview.textContent = '';
      }
    });
  }

  // Photo upload
  const photoInput = document.getElementById('photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      handleFileSelection(Array.from(e.target.files), lang);
      e.target.value = ''; // Reset so same file can be re-selected
    });
  }

  const form = document.getElementById('sell-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = store.getCurrentUser();
    if (!user) return;

    // Validate photos — minimum 2
    if (uploadedImages.length < MIN_IMAGES) {
      const photoError = document.getElementById('photo-error');
      if (photoError) {
        photoError.style.display = 'block';
        photoError.textContent = lang === 'uz'
          ? `Kamida ${MIN_IMAGES} ta rasm yuklang`
          : `Please upload at least ${MIN_IMAGES} photos`;
      }
      showToast(
        lang === 'uz' ? `Kamida ${MIN_IMAGES} ta rasm yuklang` : `Please upload at least ${MIN_IMAGES} photos`,
        'error'
      );
      return;
    }

    // Build FormData for multipart upload
    const formData = new FormData();
    formData.append('title', document.getElementById('sell-title').value.trim());
    formData.append('description', document.getElementById('sell-description').value.trim());
    formData.append('category', document.getElementById('sell-category-id').value || document.getElementById('sell-category').value);
    formData.append('condition', document.getElementById('sell-condition').value);
    formData.append('brand', document.getElementById('sell-brand').value.trim() || '');
    formData.append('size', document.getElementById('sell-size').value.trim() || '');
    formData.append('price', document.getElementById('sell-price').value);

    // Append image files
    uploadedImages.forEach(img => {
      formData.append('images', img.file);
    });

    // Disable submit button
    const submitBtn = document.getElementById('sell-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = lang === 'uz' ? 'Yuklanmoqda...' : 'Uploading...';
    }

    try {
      const product = await store.createProduct(formData);
      uploadedImages = [];
      showToast(lang === 'uz' ? 'Buyum muvaffaqiyatli joylashtirildi!' : 'Item listed successfully!', 'success');
      navigateTo(`/product/${product.id}`);
    } catch (err) {
      showToast(err.message || (lang === 'uz' ? 'Xatolik yuz berdi' : 'Failed to list item'), 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = lang === 'uz' ? 'Sotuvga qo\'yish' : 'List Item for Sale';
      }
    }
  });
}

function handleFileSelection(files, lang) {
  const remaining = MAX_IMAGES - uploadedImages.length;
  if (remaining <= 0) {
    showToast(lang === 'uz' ? `Maksimal ${MAX_IMAGES} ta rasm` : `Maximum ${MAX_IMAGES} photos`, 'error');
    return;
  }

  const filesToAdd = files.slice(0, remaining);
  if (files.length > remaining) {
    showToast(
      lang === 'uz' ? `Faqat ${remaining} ta rasm qo'shish mumkin` : `Can only add ${remaining} more photo(s)`,
      'warning'
    );
  }

  filesToAdd.forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      uploadedImages.push({ file, preview: ev.target.result });
      renderPhotoPreview(lang);
    };
    reader.readAsDataURL(file);
  });
}

function renderPhotoPreview(lang) {
  const container = document.getElementById('photo-preview');
  if (!container) return;

  const previews = uploadedImages.map((img, i) => `
    <div class="sell-photo-thumb" data-index="${i}">
      <img src="${img.preview}" alt="Photo ${i + 1}" />
      <button class="sell-photo-remove" data-remove="${i}" type="button">&times;</button>
      ${i === 0 ? '<span class="sell-photo-main-badge">Main</span>' : ''}
    </div>
  `).join('');

  const addBtn = uploadedImages.length < MAX_IMAGES ? `
    <label class="sell-photo-add" id="photo-add-btn">
      <input type="file" id="photo-input-dynamic" accept="image/*" multiple style="display:none" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      <span class="text-xs">+</span>
    </label>
  ` : '';

  container.innerHTML = previews + addBtn;

  // Update count
  const countEl = document.getElementById('photo-count');
  if (countEl) countEl.textContent = `${uploadedImages.length} / ${MAX_IMAGES}`;

  // Re-attach events for dynamically added input
  const dynInput = document.getElementById('photo-input-dynamic');
  if (dynInput) {
    dynInput.addEventListener('change', (e) => {
      handleFileSelection(Array.from(e.target.files), lang);
      e.target.value = '';
    });
  }

  // Remove buttons
  container.querySelectorAll('.sell-photo-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(btn.dataset.remove);
      uploadedImages.splice(idx, 1);
      renderPhotoPreview(lang);
    });
  });

  // Hide error if enough photos
  if (uploadedImages.length >= MIN_IMAGES) {
    const photoError = document.getElementById('photo-error');
    if (photoError) photoError.style.display = 'none';
  }
}
