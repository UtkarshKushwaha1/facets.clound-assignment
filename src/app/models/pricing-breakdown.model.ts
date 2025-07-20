import type { CartItem } from './cart-item.model';

export interface PricingBreakdown {
  subtotal: number;
  totalTax: number;
  totalItemDiscounts: number;
  bulkDiscount: number;
  loyaltyDiscount: number;
  finalTotal: number;
  items: readonly CartItem[];
}
