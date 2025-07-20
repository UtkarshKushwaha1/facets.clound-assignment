# Smart Shopping Cart 🛒

A modern shopping cart built with **Angular 18** and **Tailwind CSS** featuring dynamic pricing and smart discounts.

## Features

- 🛍️ Add/remove items from cart
- 💰 Dynamic pricing with tax calculations
- 🎯 Smart discounts (bulk, loyalty, item-specific)
- 📱 Responsive design
- ⚡ Real-time updates

## Tech Stack

- Angular 18 (Standalone Components)
- Tailwind CSS
- TypeScript
- Angular Signals

## Quick Start

### Prerequisites
- Node.js (v18+)
- Angular CLI (v18+)

### Installation

```bash
# Create project
ng new smart-shopping-cart --routing --style=css --standalone --ssr=false
cd smart-shopping-cart

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Generate components
ng generate component components/shopping-cart --standalone --skip-tests
ng generate component components/product-card --standalone --skip-tests
ng generate component components/cart-item --standalone --skip-tests
ng generate service services/shopping-cart --skip-tests
mkdir src/app/models

# Copy the provided code files to their respective locations

# Run the app
ng serve
```

Open `http://localhost:4200` in your browser.

## How It Works

### Tax Rates
- **Electronics**: 10% tax
- **Books**: Tax-free
- **Clothing**: 5% tax

### Discounts (applied in order)
1. **Electronics Bulk**: 15% off when buying 2+ electronics
2. **Cart Bulk**: 10% off when total > $200
3. **Loyalty**: 5% (Bronze), 10% (Silver), 15% (Gold)

## Project Structure

```
src/app/
├── components/
│   ├── shopping-cart/
│   ├── product-card/
│   └── cart-item/
├── models/
├── services/
└── main.ts
```

---

**Built with Angular 18 + Tailwind CSS**
