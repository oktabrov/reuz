// ==========================================
// ReUz — Admin Dashboard Page
// ==========================================

import { store } from '../store.js';
import { formatPrice } from '../logic/pricing.js';
import { navigateTo } from '../router.js';
import { getLanguage } from '../i18n.js';

export function renderAdminPage() {
  const user = store.getCurrentUser();
  if (!user) { navigateTo('/login'); return ''; }

  const orders = store.getAll('orders');
  const disputes = store.getAll('disputes');
  const products = store.getAll('products');
  const lang = getLanguage();

  // Calculate platform metrics
  const completedOrders = orders.filter(o => o.status === 'completed');
  const activeOrders = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status));
  const disputedOrders = orders.filter(o => o.status === 'disputed');

  const totalPlatformRevenue = completedOrders.reduce((sum, o) => sum + o.pricing.platformRevenue, 0);
  const totalSellerFees = completedOrders.reduce((sum, o) => sum + o.pricing.sellerFee, 0);
  const totalEscrowFees = completedOrders.reduce((sum, o) => sum + o.pricing.escrow, 0);
  const totalGMV = orders.reduce((sum, o) => sum + o.pricing.buyerPays, 0);

  const openDisputes = disputes.filter(d => !d.status.startsWith('resolved_') && d.status !== 'closed');
  const resolvedDisputes = disputes.filter(d => d.status.startsWith('resolved_'));

  const dashboardTitle = lang === 'uz' ? 'Platforma boshqaruv paneli' : 'Platform Dashboard';
  const dashboardSubtitle = lang === 'uz' ? 'ReUz bozori tahlili va ko\'rsatkichlari' : 'ReUz marketplace analytics and metrics';
  const platformRevLabel = lang === 'uz' ? 'Platforma daromadi' : 'Platform Revenue';
  const totalGmvLabel = lang === 'uz' ? 'Umumiy GMV' : 'Total GMV';
  const totalOrdersLabel = lang === 'uz' ? 'Jami buyurtmalar' : 'Total Orders';
  const totalListingsLabel = lang === 'uz' ? 'Jami e\'lonlar' : 'Total Listings';
  const revBreakdownLabel = lang === 'uz' ? 'Daromad taqsimoti' : 'Revenue Breakdown';
  const sellerFeesLabel = lang === 'uz' ? 'Sotuvchi to\'lovlari (5%)' : 'Seller Fees (5%)';
  const buyerFeesLabel = lang === 'uz' ? 'Xaridor himoyasi to\'lovlari' : 'Buyer Protection Fees';
  const totalRevLabel = lang === 'uz' ? 'Jami daromad' : 'Total Revenue';
  const orderOverviewLabel = lang === 'uz' ? 'Buyurtmalar ko\'rinishi' : 'Order Overview';
  const activeLabel = lang === 'uz' ? 'Faol' : 'Active';
  const completedLabel = lang === 'uz' ? 'Bajarilgan' : 'Completed';
  const disputedLabel = lang === 'uz' ? 'Nizolashgan' : 'Disputed';
  const cancelledLabel = lang === 'uz' ? 'Bekor qilingan' : 'Cancelled';
  const refundedLabel = lang === 'uz' ? 'Qaytarilgan' : 'Refunded';
  const disputesLabel = lang === 'uz' ? 'Nizolar' : 'Disputes';
  const openLabel = lang === 'uz' ? 'Ochiq' : 'Open';
  const resolvedLabel = lang === 'uz' ? 'Hal qilingan' : 'Resolved';
  const recentOrdersLabel = lang === 'uz' ? 'So\'nggi buyurtmalar' : 'Recent Orders';
  const orderIdLabel = lang === 'uz' ? 'Buyurtma ID' : 'Order ID';
  const itemLabel = lang === 'uz' ? 'Buyum' : 'Item';
  const buyerPaidLabel = lang === 'uz' ? 'Xaridor to\'ladi' : 'Buyer Paid';
  const platformRevColLabel = lang === 'uz' ? 'Platforma' : 'Platform Rev';
  const sellerGetsLabel = lang === 'uz' ? 'Sotuvchi oladi' : 'Seller Gets';
  const statusLabel = lang === 'uz' ? 'Holati' : 'Status';
  const noOrdersLabel = lang === 'uz' ? 'Hali buyurtma yo\'q' : 'No orders yet';
  const noOrdersDescLabel = lang === 'uz' ? 'Tranzaksiyalar boshlanganida buyurtma ma\'lumotlari bu yerda paydo bo\'ladi' : 'Order data will appear here once transactions start';

  const statusLabels = {
    paid: lang === 'uz' ? 'To\'langan' : 'Paid',
    shipped: lang === 'uz' ? 'Jo\'natilgan' : 'Shipped',
    delivered: lang === 'uz' ? 'Yetkazilgan' : 'Delivered',
    completed: lang === 'uz' ? 'Bajarilgan' : 'Completed',
    cancelled: lang === 'uz' ? 'Bekor qilingan' : 'Cancelled',
    disputed: lang === 'uz' ? 'Nizolashgan' : 'Disputed',
    refunded: lang === 'uz' ? 'Qaytarilgan' : 'Refunded'
  };

  return `
    <div class="page">
      <div class="container">
        <h1 style="margin-bottom: var(--space-xs);">${dashboardTitle}</h1>
        <p class="text-muted" style="margin-bottom: var(--space-xl);">${dashboardSubtitle}</p>

        <!-- Stats Grid -->
        <div class="stats-grid" style="margin-bottom: var(--space-2xl);">
          <div class="stat-card">
            <div class="stat-card-icon">$</div>
            <div class="stat-card-value" style="color: var(--color-primary);">${formatPrice(totalPlatformRevenue)}</div>
            <div class="stat-card-label">${platformRevLabel}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">+</div>
            <div class="stat-card-value">${formatPrice(totalGMV)}</div>
            <div class="stat-card-label">${totalGmvLabel}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">#</div>
            <div class="stat-card-value">${orders.length}</div>
            <div class="stat-card-label">${totalOrdersLabel}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">L</div>
            <div class="stat-card-value">${products.length}</div>
            <div class="stat-card-label">${totalListingsLabel}</div>
          </div>
        </div>

        <div class="grid-2" style="gap: var(--space-2xl);">
          <!-- Revenue Breakdown -->
          <div class="card">
            <h3 style="margin-bottom: var(--space-lg);">${revBreakdownLabel}</h3>
            <div class="flex flex-col gap-md">
              <div>
                <div class="flex justify-between text-sm" style="margin-bottom: var(--space-2xs);">
                  <span class="text-muted">${sellerFeesLabel}</span>
                  <span class="font-semibold">${formatPrice(totalSellerFees)}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="width: ${totalPlatformRevenue > 0 ? (totalSellerFees / totalPlatformRevenue * 100) : 0}%;"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm" style="margin-bottom: var(--space-2xs);">
                  <span class="text-muted">${buyerFeesLabel}</span>
                  <span class="font-semibold">${formatPrice(totalEscrowFees)}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="width: ${totalPlatformRevenue > 0 ? (totalEscrowFees / totalPlatformRevenue * 100) : 0}%;"></div>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="flex justify-between font-bold text-lg">
              <span>${totalRevLabel}</span>
              <span style="color: var(--color-primary);">${formatPrice(totalPlatformRevenue)}</span>
            </div>
          </div>

          <!-- Order Status Distribution -->
          <div class="card">
            <h3 style="margin-bottom: var(--space-lg);">${orderOverviewLabel}</h3>
            <div class="flex flex-col gap-sm">
              ${[
                { label: activeLabel, count: activeOrders.length, color: 'var(--color-info)' },
                { label: completedLabel, count: completedOrders.length, color: 'var(--color-success)' },
                { label: disputedLabel, count: disputedOrders.length, color: 'var(--color-error)' },
                { label: cancelledLabel, count: orders.filter(o => o.status === 'cancelled').length, color: 'var(--text-muted)' },
                { label: refundedLabel, count: orders.filter(o => o.status === 'refunded').length, color: 'var(--color-warning)' }
              ].map(item => `
                <div class="flex justify-between items-center text-sm">
                  <div class="flex items-center gap-sm">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${item.color};"></div>
                    <span>${item.label}</span>
                  </div>
                  <span class="font-semibold">${item.count}</span>
                </div>
              `).join('')}
            </div>

            <div class="divider"></div>

            <div>
              <h4 class="text-sm font-semibold" style="margin-bottom: var(--space-sm);">${disputesLabel}</h4>
              <div class="flex justify-between text-sm">
                <span class="text-muted">${openLabel}</span>
                <span class="font-semibold" style="color: var(--color-warning);">${openDisputes.length}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted">${resolvedLabel}</span>
                <span class="font-semibold" style="color: var(--color-success);">${resolvedDisputes.length}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Orders Table -->
        <div class="card" style="margin-top: var(--space-2xl);">
          <h3 style="margin-bottom: var(--space-lg);">${recentOrdersLabel}</h3>
          ${orders.length > 0 ? `
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${orderIdLabel}</th>
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${itemLabel}</th>
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${buyerPaidLabel}</th>
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${platformRevColLabel}</th>
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${sellerGetsLabel}</th>
                    <th style="text-align: left; padding: var(--space-sm); font-size: var(--font-size-xs); color: var(--text-muted); font-weight: 600;">${statusLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10).map(o => {
                    const product = store.getById('products', o.productId);
                    const statusColors = {
                      paid: 'badge-info', shipped: 'badge-warning', delivered: 'badge-success',
                      completed: 'badge-success', cancelled: 'badge-error', disputed: 'badge-error', refunded: 'badge-warning'
                    };
                    return `
                      <tr style="border-bottom: 1px solid var(--border-subtle); cursor: pointer;" class="order-row" data-order-id="${o.id}">
                        <td style="padding: var(--space-sm); font-size: var(--font-size-sm);">#${o.id.slice(-6).toUpperCase()}</td>
                        <td style="padding: var(--space-sm); font-size: var(--font-size-sm);">${product?.title || (lang === 'uz' ? 'Noma\'lum' : 'Unknown')}</td>
                        <td style="padding: var(--space-sm); font-size: var(--font-size-sm); font-weight: 600;">${formatPrice(o.pricing.buyerPays)}</td>
                        <td style="padding: var(--space-sm); font-size: var(--font-size-sm); color: var(--color-primary); font-weight: 600;">${formatPrice(o.pricing.platformRevenue)}</td>
                        <td style="padding: var(--space-sm); font-size: var(--font-size-sm);">${formatPrice(o.pricing.sellerGets)}</td>
                        <td style="padding: var(--space-sm);"><span class="badge ${statusColors[o.status] || 'badge-neutral'}">${statusLabels[o.status] || o.status}</span></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <div class="empty-state" style="padding: var(--space-xl);">
              <div class="empty-state-icon">--</div>
              <div class="empty-state-title">${noOrdersLabel}</div>
              <div class="empty-state-text">${noOrdersDescLabel}</div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

export function attachAdminEvents() {
  document.querySelectorAll('.order-row').forEach(row => {
    row.addEventListener('click', () => {
      navigateTo(`/order/${row.dataset.orderId}`);
    });
  });
}
