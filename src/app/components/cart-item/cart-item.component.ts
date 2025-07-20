// src/app/components/cart-item/cart-item.component.ts (If you prefer separate HTML file)
import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, ProductCategory } from '../../models';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styles: []
})
export class CartItemComponent {
  // Input signals
  item = input.required<CartItem>();

  // Output signals
  removeEvent = output<number>();

  // Computed properties for styling
  readonly categoryAccentClass = computed(() => {
    switch (this.item().product.category) {
      case ProductCategory.ELECTRONICS:
        return 'bg-blue-500';
      case ProductCategory.BOOKS:
        return 'bg-green-500';
      case ProductCategory.CLOTHING:
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  });

  readonly categoryBadgeClass = computed(() => {
    switch (this.item().product.category) {
      case ProductCategory.ELECTRONICS:
        return 'bg-blue-500';
      case ProductCategory.BOOKS:
        return 'bg-green-500';
      case ProductCategory.CLOTHING:
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  });

  // Methods
  removeItem(): void {
    console.log('Removing item from cart:', this.item().product.name);
    this.removeEvent.emit(this.item().product.id);
  }

  formatCurrency(amount: number): string {
    const value = amount || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  // Helper method to get tax rate info for display
  getTaxInfo(): string {
    switch (this.item().product.category) {
      case ProductCategory.ELECTRONICS:
        return '10% Electronics Tax';
      case ProductCategory.BOOKS:
        return 'Tax-Free';
      case ProductCategory.CLOTHING:
        return '5% Clothing Tax';
      default:
        return 'No Tax Info';
    }
  }

  // Helper method to check if item has any discounts
  hasDiscounts(): boolean {
    return this.item().itemDiscount > 0;
  }
}
