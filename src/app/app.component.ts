// src/app/app.component.ts
import { Component } from '@angular/core';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShoppingCartComponent],
  template: `
    <main class="block w-full min-h-screen" role="main">
      <app-shopping-cart />
    </main>
  `,
  styles: []
})
export class AppComponent {
  title = 'Smart Shopping Cart - Angular 18 with Tailwind CSS';
}
