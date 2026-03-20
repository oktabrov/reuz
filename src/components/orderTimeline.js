// ==========================================
// ReUz — Order Timeline Component
// ==========================================

import { getLanguage } from '../i18n.js';

export function renderOrderTimeline(statusHistory, currentStatus) {
  const allStatuses = ['paid', 'shipped', 'delivered', 'completed'];
  const currentIdx = allStatuses.indexOf(currentStatus);

  return `
    <div class="order-timeline">
      ${(statusHistory || []).map((entry, i) => {
        const isCompleted = allStatuses.indexOf(entry.status) < currentIdx || 
                          entry.status === 'completed' || 
                          entry.status === 'refunded';
        const isActive = entry.status === currentStatus;
        const statusClass = isCompleted ? 'completed' : isActive ? 'active' : '';

        return `
          <div class="timeline-step ${statusClass}" style="animation-delay: ${i * 100}ms">
            <div class="timeline-dot"></div>
            <div class="timeline-step-title">${formatStatusLabel(entry.status)}</div>
            <div class="timeline-step-time">${formatTimestamp(entry.timestamp)}</div>
            ${entry.note ? `<div class="timeline-step-desc">${entry.note}</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function formatStatusLabel(status) {
  const lang = getLanguage();
  const labels = lang === 'uz' ? {
    'paid': 'To\'lov qabul qilindi',
    'shipped': 'Jo\'natilgan',
    'delivered': 'Yetkazilgan',
    'completed': 'Bajarilgan',
    'cancelled': 'Bekor qilingan',
    'disputed': 'Nizo ochilgan',
    'refunded': 'Qaytarilgan',
    'open': 'Ochilgan',
    'under_review': 'Ko\'rib chiqilmoqda',
    'return_required': 'Qaytarish talab qilinadi',
    'return_shipped': 'Qaytarish jo\'natilgan',
    'return_received': 'Qaytarish qabul qilingan',
    'resolved_refund': 'Qaytarish hal qilindi',
    'resolved_no_refund': 'Qaytarishsiz hal qilindi',
    'resolved_partial_refund': 'Qisman qaytarish',
    'closed': 'Yopilgan'
  } : {
    'paid': 'Payment Received',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'disputed': 'Dispute Opened',
    'refunded': 'Refunded',
    'open': 'Opened',
    'under_review': 'Under Review',
    'return_required': 'Return Required',
    'return_shipped': 'Return Shipped',
    'return_received': 'Return Received',
    'resolved_refund': 'Refund Resolved',
    'resolved_no_refund': 'Resolved — No Refund',
    'resolved_partial_refund': 'Partial Refund',
    'closed': 'Closed'
  };
  return labels[status] || status;
}

function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
         ' · ' + d.toLocaleDateString();
}

export function renderStatusBadge(status) {
  const lang = getLanguage();
  const styles = {
    'paid': 'badge-info',
    'shipped': 'badge-warning',
    'delivered': 'badge-success',
    'completed': 'badge-success',
    'cancelled': 'badge-error',
    'disputed': 'badge-error',
    'refunded': 'badge-warning'
  };
  const statusLabels = lang === 'uz' ? {
    'paid': 'To\'langan',
    'shipped': 'Jo\'natilgan',
    'delivered': 'Yetkazilgan',
    'completed': 'Bajarilgan',
    'cancelled': 'Bekor qilingan',
    'disputed': 'Nizolashgan',
    'refunded': 'Qaytarilgan'
  } : {
    'paid': 'Paid',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'disputed': 'Disputed',
    'refunded': 'Refunded'
  };
  return `<span class="badge ${styles[status] || 'badge-neutral'}">${statusLabels[status] || status}</span>`;
}
