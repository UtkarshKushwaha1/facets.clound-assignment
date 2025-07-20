export interface Customer {
  readonly id?: string;
  loyaltyLevel: LoyaltyLevel;
}

export const enum LoyaltyLevel {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold'
}

export const LOYALTY_LEVELS = [
  { value: LoyaltyLevel.BRONZE, label: 'Bronze (5% loyalty discount)', rate: 0.05 },
  { value: LoyaltyLevel.SILVER, label: 'Silver (10% loyalty discount)', rate: 0.10 },
  { value: LoyaltyLevel.GOLD, label: 'Gold (15% loyalty discount)', rate: 0.15 }
] as const;
