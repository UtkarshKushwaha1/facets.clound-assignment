export interface DiscountRule {
  readonly type: DiscountType;
  readonly description: string;
  readonly condition: string;
  readonly rate: number;
}

export const enum DiscountType {
  ITEM_SPECIFIC = 'item-specific',
  BULK = 'bulk',
  LOYALTY = 'loyalty'
}
