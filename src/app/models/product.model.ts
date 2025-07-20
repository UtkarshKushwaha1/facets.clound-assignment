export interface Product {
  readonly id: number;
  name: string;
  category: ProductCategory;
  price: number;
  quantity: number;
}

export const enum ProductCategory {
  ELECTRONICS = 'Electronics',
  BOOKS = 'Books',
  CLOTHING = 'Clothing'
}

export const PRODUCT_CATEGORIES = [
  ProductCategory.ELECTRONICS,
  ProductCategory.BOOKS,
  ProductCategory.CLOTHING
] as const;
