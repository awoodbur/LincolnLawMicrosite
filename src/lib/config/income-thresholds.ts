/**
 * Utah Bankruptcy Median Income Thresholds
 * Source: U.S. Trustee Program
 * Effective: November 1, 2024 - March 31, 2025
 * Next Update: Check https://www.justice.gov/ust/eo/bapcpa/
 *
 * These thresholds determine Chapter 7 eligibility.
 * Update this file every 6 months when new figures are published.
 */

export const UTAH_INCOME_THRESHOLDS = {
  effectiveDate: "2024-11-01",
  expirationDate: "2025-03-31",
  state: "Utah",
  thresholds: {
    1: 80215,   // 1 person household
    2: 90038,   // 2 person household
    3: 106460,  // 3 person household
    4: 120630,  // 4 person household
    5: 130530,  // 4 + 9,900
    6: 140430,  // 4 + 9,900 * 2
    7: 150330,  // 4 + 9,900 * 3
    8: 160230,  // 4 + 9,900 * 4 (covers "8+" option)
  },
  additionalPersonAmount: 9900, // Add this for each person over 4
} as const;

/**
 * Get the annual income threshold for a given household size
 * @param householdSize - Number from 1-8 (8 represents "8+")
 * @returns Annual income threshold in dollars
 */
export function getIncomeThreshold(householdSize: number): number {
  if (householdSize < 1) return UTAH_INCOME_THRESHOLDS.thresholds[1];
  if (householdSize > 8) {
    // For households larger than 8, calculate dynamically
    const baseAmount = UTAH_INCOME_THRESHOLDS.thresholds[4];
    const additionalPeople = householdSize - 4;
    return baseAmount + (additionalPeople * UTAH_INCOME_THRESHOLDS.additionalPersonAmount);
  }
  return UTAH_INCOME_THRESHOLDS.thresholds[householdSize as keyof typeof UTAH_INCOME_THRESHOLDS.thresholds];
}

/**
 * Format threshold for display (e.g., "$80,215")
 */
export function formatThreshold(threshold: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(threshold);
}

/**
 * Check if thresholds need updating (past expiration date)
 */
export function thresholdsNeedUpdate(): boolean {
  const expiration = new Date(UTAH_INCOME_THRESHOLDS.expirationDate);
  const today = new Date();
  return today > expiration;
}
