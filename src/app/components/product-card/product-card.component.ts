// src/app/components/product-card/product-card.component.ts
import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductCategory } from '../../models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `product-card.component.html`,
  styles: []
})
export class ProductCardComponent {
  // Input signals (Angular 18 signal inputs)
  product = input.required<Product>();

  // Output signals
  addToCartEvent = output<Product>();

  // Local state
  private readonly quantitySignal = signal(1);

  // Computed properties
  readonly quantity = this.quantitySignal.asReadonly();
  readonly canDecrease = computed(() => this.quantitySignal() > 1);

  readonly categoryColorClass = computed(() => {
    switch (this.product().category) {
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

  increaseQuantity(): void {
    this.quantitySignal.update(qty => qty + 1);
  }

  decreaseQuantity(): void {
    if (this.canDecrease()) {
      this.quantitySignal.update(qty => qty - 1);
    }
  }

  addToCart(): void {
    const productToAdd: Product = {
      ...this.product(),
      quantity: this.quantitySignal()
    };

    this.addToCartEvent.emit(productToAdd);
    this.quantitySignal.set(1); // Reset quantity after adding
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
