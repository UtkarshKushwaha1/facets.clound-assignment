import { ProductCategory } from './product.model';

export interface TaxRule {
  readonly category: ProductCategory;
  readonly rate: number;
  readonly description: string;
}

export const TAX_RULES: readonly TaxRule[] = [
  { category: ProductCategory.ELECTRONICS, rate: 0.10, description: '10% Electronics Tax' },
  { category: ProductCategory.BOOKS, rate: 0.00, description: 'Tax-Free Books' },
  { category: ProductCategory.CLOTHING, rate: 0.05, description: '5% Clothing Tax' }
] as const;
