/**
 * Utah Bankruptcy Means Test Thresholds (2024 estimates)
 *
 * TODO: Replace with authoritative data from:
 * - U.S. Courts: https://www.uscourts.gov/services-forms/bankruptcy/bankruptcy-basics/means-test
 * - Utah District Court updates
 *
 * TODO: Implement automated update cadence (quarterly or as published)
 * TODO: Add validation to ensure thresholds are not stale
 */

export interface UtahMeansTestThresholds {
  householdSize: number;
  annualMedianIncome: number;
}

/**
 * Utah median income by household size (placeholder values for PoC).
 * These are approximate 2024 estimates and must be replaced with official figures.
 */
export const UTAH_MEDIAN_INCOME_2024: UtahMeansTestThresholds[] = [
  { householdSize: 1, annualMedianIncome: 58000 },
  { householdSize: 2, annualMedianIncome: 73000 },
  { householdSize: 3, annualMedianIncome: 84000 },
  { householdSize: 4, annualMedianIncome: 96000 },
  { householdSize: 5, annualMedianIncome: 104000 },
  { householdSize: 6, annualMedianIncome: 112000 },
  { householdSize: 7, annualMedianIncome: 120000 },
  { householdSize: 8, annualMedianIncome: 128000 },
];

/**
 * For households larger than 8, add this amount per additional person.
 */
export const ADDITIONAL_PERSON_INCOME = 8000;

/**
 * Get the median income threshold for a given household size in Utah.
 */
export function getUtahMedianIncome(householdSize: number): number {
  if (householdSize <= 0) {
    throw new Error('Household size must be greater than 0');
  }

  // Find exact match
  const match = UTAH_MEDIAN_INCOME_2024.find((t) => t.householdSize === householdSize);
  if (match) {
    return match.annualMedianIncome;
  }

  // For larger households, use the 8-person threshold plus additional per person
  const baseThreshold = UTAH_MEDIAN_INCOME_2024[UTAH_MEDIAN_INCOME_2024.length - 1].annualMedianIncome;
  const additionalPeople = householdSize - 8;
  return baseThreshold + additionalPeople * ADDITIONAL_PERSON_INCOME;
}

/**
 * DTI (Debt-to-Income) thresholds for assessment.
 * These are heuristics, not legal requirements.
 */
export const DTI_THRESHOLDS = {
  FAVORABLE: 0.35, // < 35% is favorable
  BORDERLINE: 0.50, // 35-50% is borderline
  // > 50% is unfavorable
} as const;

/**
 * Minimum monthly cashflow thresholds for assessment.
 * Negative cashflow indicates financial distress.
 */
export const CASHFLOW_THRESHOLDS = {
  HEALTHY: 500, // > $500/month is healthy
  NEUTRAL: 0, // $0 to $500 is neutral
  // < $0 is negative (distress signal)
} as const;

/**
 * Last updated date for thresholds.
 * TODO: Implement automated check against this date.
 */
export const THRESHOLDS_LAST_UPDATED = '2024-01-01';

/**
 * Check if thresholds are stale (older than 6 months).
 */
export function areThresholdsStale(): boolean {
  const lastUpdated = new Date(THRESHOLDS_LAST_UPDATED);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return lastUpdated < sixMonthsAgo;
}
