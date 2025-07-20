// src/app/components/shopping-cart/shopping-cart.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { Product, LoyaltyLevel, LOYALTY_LEVELS, CartItem } from '../../models';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, CartItemComponent],
  templateUrl: './shopping-cart.component.html',
  styles: []
})
export class ShoppingCartComponent {
  // Inject service
  private readonly cartService = inject(ShoppingCartService);

  // Local signals
  readonly selectedLoyaltyLevel = signal<LoyaltyLevel>(LoyaltyLevel.SILVER);
  readonly selectedCategory = signal<string>('all');

  // Service computed properties
  readonly cartItems = this.cartService.cartItems;
  readonly pricingBreakdown = this.cartService.pricingBreakdown;
  readonly allProducts = this.cartService.sampleProducts;
  readonly itemCount = this.cartService.itemCount;
  readonly isEmpty = this.cartService.isEmpty;

  // Data for dropdowns and filters
  readonly loyaltyLevels = LOYALTY_LEVELS;
  readonly categories = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Books', label: 'Books' },
    { value: 'Clothing', label: 'Clothing' }
  ];

  // Computed properties for pricing breakdown
  readonly subtotal = computed(() => this.pricingBreakdown().subtotal);
  readonly totalTax = computed(() => this.pricingBreakdown().totalTax);
  readonly totalItemDiscounts = computed(() => this.pricingBreakdown().totalItemDiscounts);
  readonly bulkDiscount = computed(() => this.pricingBreakdown().bulkDiscount);
  readonly loyaltyDiscount = computed(() => this.pricingBreakdown().loyaltyDiscount);
  readonly finalTotal = computed(() => this.pricingBreakdown().finalTotal);

  // Utility computed properties
  readonly hasAnyDiscounts = computed(() =>
    this.totalItemDiscounts() > 0 || this.bulkDiscount() > 0 || this.loyaltyDiscount() > 0
  );

  readonly totalSavings = computed(() =>
    this.totalItemDiscounts() + this.bulkDiscount() + this.loyaltyDiscount()
  );

  readonly uniqueCategories = computed(() => {
    const categories = new Set(this.cartItems().map(item => item.product.category));
    return Array.from(categories);
  });

  readonly averagePrice = computed(() => {
    const items = this.cartItems();
    if (items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + item.product.price, 0);
    return total / items.length;
  });

  // Filtered products based on category
  readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();
    if (category === 'all') {
      return this.allProducts();
    }
    return this.allProducts().filter(product => product.category === category);
  });

  constructor() {
    // Initialize customer in service
    this.cartService.updateCustomer({ loyaltyLevel: this.selectedLoyaltyLevel() });
  }

  // Event handlers
  onAddToCart(product: Product): void {
    this.cartService.addItem(product);
  }

  onRemoveItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  onClearCart(): void {
    this.cartService.clear();
  }

  onLoyaltyLevelChange(): void {
    this.cartService.updateCustomer({ loyaltyLevel: this.selectedLoyaltyLevel() });
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  // Utility methods
  getProductsByCategory(category: string): Product[] {
    return this.allProducts().filter(product => product.category === category);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // TrackBy functions for performance optimization
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  trackByCartItemId(index: number, item: CartItem): number {
    return item.product.id;
  }

  trackByLoyaltyLevel(index: number, level: any): string {
    return level.value;
  }

  trackByCategory(index: number, category: any): string {
    return category.value;
  }
}
