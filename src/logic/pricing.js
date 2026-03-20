// ==========================================
// ReUz — Pricing Engine (UZS / so'm)
// ==========================================

/**
 * Calculate full price breakdown:
 * buyer_protection = price * 0.02 + 2000 so'm
 * seller_commission = price * 0.03 (3%)
 * seller_gets = price * 0.97
 * buyer_pays = price + buyer_protection + shipping_cost
 */
export function calculatePricing(itemPrice, shippingCost) {
  const n = Math.round(parseFloat(itemPrice));
  const ship = Math.round(parseFloat(shippingCost));

  const buyerProtection = Math.round(n * 0.02 + 2000);
  const sellerCommission = Math.round(n * 0.03);
  const sellerGets = n - sellerCommission;
  const buyerPays = n + buyerProtection + ship;

  return {
    itemPrice: n,
    buyerProtection,
    sellerCommission,
    shippingCost: ship,
    sellerGets,
    buyerPays
  };
}

/**
 * Format a number as UZS currency: "200 000 so'm"
 */
export function formatPrice(amount) {
  const n = Math.round(parseFloat(amount));
  if (isNaN(n)) return "0 so'm";
  return n.toLocaleString('ru-RU').replace(/,/g, ' ') + " so'm";
}
