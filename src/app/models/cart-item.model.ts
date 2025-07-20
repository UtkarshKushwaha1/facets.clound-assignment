import type { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  basePrice: number;
  taxAmount: number;
  itemDiscount: number;
  totalPrice: number;
}
