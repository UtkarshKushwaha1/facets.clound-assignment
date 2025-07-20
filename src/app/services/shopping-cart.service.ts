// src/app/services/shopping-cart.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';
import {
  Product,
  ProductCategory,
  Customer,
  LoyaltyLevel,
  CartItem,
  PricingBreakdown,
  TAX_RULES,
  LOYALTY_LEVELS
} from '../models';

// Tax Strategy Pattern
interface TaxStrategy {
  calculate(price: number): number;
  getTaxRate(): number;
  getDescription(): string;
}

class TaxCalculator {
  private static readonly strategies = new Map<ProductCategory, TaxStrategy>();

  static {
    // Initialize strategies using TAX_RULES
    TAX_RULES.forEach(rule => {
      this.strategies.set(rule.category, {
        calculate: (price: number) => price * rule.rate,
        getTaxRate: () => rule.rate,
        getDescription: () => rule.description
      });
    });
  }

  static getStrategy(category: ProductCategory): TaxStrategy {
    const strategy = this.strategies.get(category);
    if (!strategy) {
      console.error(`No tax strategy found for category: ${category}`);
      // Return a default strategy to prevent errors
      return {
        calculate: () => 0,
        getTaxRate: () => 0,
        getDescription: () => 'No tax'
      };
    }
    return strategy;
  }
}

// Discount Calculator using Strategy Pattern
class DiscountCalculator {
  static calculateItemDiscount(basePrice: number, category: ProductCategory, quantity: number): number {
    // Electronics get 15% off if quantity > 2
    if (category === ProductCategory.ELECTRONICS && quantity > 2) {
      return basePrice * 0.15;
    }
    return 0;
  }

  static calculateBulkDiscount(subtotalWithTax: number): number {
    return subtotalWithTax > 200 ? subtotalWithTax * 0.10 : 0;
  }

  static calculateLoyaltyDiscount(amount: number, loyaltyLevel: LoyaltyLevel): number {
    const loyaltyRule = LOYALTY_LEVELS.find(level => level.value === loyaltyLevel);
    return loyaltyRule ? amount * loyaltyRule.rate : 0;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  // Core signals - store raw product data
  private readonly rawCartItemsSignal = signal<Array<{product: Product, quantity: number}>>([]);
  private readonly customerSignal = signal<Customer>({ loyaltyLevel: LoyaltyLevel.SILVER });

  // Computed cart items with all calculations applied
  readonly cartItems = computed((): CartItem[] => {
    const rawItems = this.rawCartItemsSignal();
    const customer = this.customerSignal();

    if (rawItems.length === 0) {
      return [];
    }

    // Calculate each item individually first
    return rawItems.map(rawItem => {
      const taxStrategy = TaxCalculator.getStrategy(rawItem.product.category);
      const basePrice = rawItem.product.price * rawItem.quantity;
      const taxAmount = taxStrategy.calculate(basePrice);
      const itemDiscount = DiscountCalculator.calculateItemDiscount(
        basePrice,
        rawItem.product.category,
        rawItem.quantity
      );
      const totalPrice = basePrice + taxAmount - itemDiscount;

      const cartItem: CartItem = {
        product: { ...rawItem.product },
        quantity: rawItem.quantity,
        basePrice,
        taxAmount,
        itemDiscount,
        totalPrice
      };

      console.log(`Calculated item: ${rawItem.product.name}`, {
        basePrice,
        taxAmount,
        itemDiscount,
        totalPrice
      });

      return cartItem;
    });
  });

  readonly customer = this.customerSignal.asReadonly();

  // Computed signals for derived state
  readonly itemCount = computed(() =>
    this.rawCartItemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly isEmpty = computed(() => this.rawCartItemsSignal().length === 0);

  readonly uniqueItemCount = computed(() => this.rawCartItemsSignal().length);

  readonly hasElectronics = computed(() =>
    this.rawCartItemsSignal().some(item => item.product.category === ProductCategory.ELECTRONICS)
  );

  readonly averageItemPrice = computed(() => {
    const items = this.rawCartItemsSignal();
    if (items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + item.product.price, 0);
    return total / items.length;
  });

  // Main pricing breakdown computation
  readonly pricingBreakdown = computed((): PricingBreakdown => {
    const items = this.cartItems(); // Use computed cart items with calculations
    const customer = this.customerSignal();

    if (items.length === 0) {
      return this.createEmptyBreakdown();
    }

    // Sum up all the already calculated values
    let subtotal = 0;
    let totalTax = 0;
    let totalItemDiscounts = 0;

    items.forEach(item => {
      subtotal += item.basePrice;
      totalTax += item.taxAmount;
      totalItemDiscounts += item.itemDiscount;
    });

    // Calculate cart-level discounts
    const subtotalWithTax = subtotal + totalTax - totalItemDiscounts;
    const bulkDiscount = DiscountCalculator.calculateBulkDiscount(subtotalWithTax);
    const afterBulkDiscount = subtotalWithTax - bulkDiscount;
    const loyaltyDiscount = DiscountCalculator.calculateLoyaltyDiscount(afterBulkDiscount, customer.loyaltyLevel);
    const finalTotal = Math.max(0, afterBulkDiscount - loyaltyDiscount);

    const breakdown = {
      subtotal,
      totalTax,
      totalItemDiscounts,
      bulkDiscount,
      loyaltyDiscount,
      finalTotal,
      items
    };

    console.log('Pricing breakdown calculated:', breakdown);

    return breakdown;
  });

  // Sample products with better categorization
  readonly sampleProducts = signal<Product[]>([
    // Electronics
    { id: 1, name: "Gaming Laptop", category: ProductCategory.ELECTRONICS, price: 1200, quantity: 1 },
    { id: 2, name: "Wireless Headphones", category: ProductCategory.ELECTRONICS, price: 150, quantity: 1 },
    { id: 3, name: "Smartphone", category: ProductCategory.ELECTRONICS, price: 800, quantity: 1 },
    { id: 4, name: "Smart Watch", category: ProductCategory.ELECTRONICS, price: 300, quantity: 1 },

    // Books
    { id: 5, name: "JavaScript: The Good Parts", category: ProductCategory.BOOKS, price: 45, quantity: 1 },
    { id: 6, name: "Clean Code", category: ProductCategory.BOOKS, price: 40, quantity: 1 },
    { id: 7, name: "Design Patterns", category: ProductCategory.BOOKS, price: 55, quantity: 1 },
    { id: 8, name: "The Pragmatic Programmer", category: ProductCategory.BOOKS, price: 50, quantity: 1 },

    // Clothing
    { id: 9, name: "Premium T-Shirt", category: ProductCategory.CLOTHING, price: 35, quantity: 1 },
    { id: 10, name: "Designer Jeans", category: ProductCategory.CLOTHING, price: 120, quantity: 1 },
    { id: 11, name: "Winter Jacket", category: ProductCategory.CLOTHING, price: 200, quantity: 1 },
    { id: 12, name: "Running Shoes", category: ProductCategory.CLOTHING, price: 150, quantity: 1 }
  ]);

  constructor() {
    // Effect for debugging and verification
    effect(() => {
      const breakdown = this.pricingBreakdown();
      const items = this.cartItems();

      console.log('=== CART STATE UPDATE ===');
      console.log('Raw items count:', this.rawCartItemsSignal().length);
      console.log('Calculated items count:', items.length);
      console.log('Item count:', this.itemCount());

      items.forEach((item, index) => {
        console.log(`Item ${index + 1}: ${item.product.name}`, {
          basePrice: item.basePrice,
          taxAmount: item.taxAmount,
          itemDiscount: item.itemDiscount,
          totalPrice: item.totalPrice
        });
      });

      console.log('Pricing breakdown:', {
        subtotal: breakdown.subtotal,
        totalTax: breakdown.totalTax,
        totalItemDiscounts: breakdown.totalItemDiscounts,
        bulkDiscount: breakdown.bulkDiscount,
        loyaltyDiscount: breakdown.loyaltyDiscount,
        finalTotal: breakdown.finalTotal
      });
      console.log('========================');
    });
  }

  // Public API methods
  addItem(product: Product): void {
    console.log('Adding item to cart:', product);

    this.rawCartItemsSignal.update(items => {
      const existingItemIndex = items.findIndex(item => item.product.id === product.id);

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const newItems = [...items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + product.quantity
        };
        console.log('Updated existing item quantity');
        return newItems;
      } else {
        // Add new item
        const newItem = {
          product: { ...product },
          quantity: product.quantity
        };
        console.log('Added new item:', newItem);
        return [...items, newItem];
      }
    });
  }

  removeItem(productId: number): void {
    console.log('Removing item with ID:', productId);
    this.rawCartItemsSignal.update(items =>
      items.filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    console.log('Updating quantity for product ID:', productId, 'to:', quantity);
    this.rawCartItemsSignal.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  updateCustomer(customer: Customer): void {
    console.log('Updating customer:', customer);
    this.customerSignal.set({ ...customer });
  }

  clear(): void {
    console.log('Clearing cart');
    this.rawCartItemsSignal.set([]);
  }

  // Advanced query methods
  getItemsByCategory(category: ProductCategory): CartItem[] {
    return this.cartItems().filter(item => item.product.category === category);
  }

  getTotalByCategory(category: ProductCategory): number {
    return this.getItemsByCategory(category)
      .reduce((sum, item) => sum + item.totalPrice, 0);
  }

  // Helper method to recalculate all items (if needed for debugging)
  recalculateAll(): void {
    console.log('Forcing recalculation of all items');
    // Trigger recalculation by updating the signal
    this.rawCartItemsSignal.update(items => [...items]);
  }

  private createEmptyBreakdown(): PricingBreakdown {
    return {
      subtotal: 0,
      totalTax: 0,
      totalItemDiscounts: 0,
      bulkDiscount: 0,
      loyaltyDiscount: 0,
      finalTotal: 0,
      items: []
    };
  }
}
