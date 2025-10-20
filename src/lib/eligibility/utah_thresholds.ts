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
 * Utah median income by household size (2025 values for Chapter 7/13 means test).
 * Based on official U.S. Courts data.
 */
export const UTAH_MEDIAN_INCOME_2024: UtahMeansTestThresholds[] = [
  { householdSize: 1, annualMedianIncome: 85644 },
  { householdSize: 2, annualMedianIncome: 93302 },
  { householdSize: 3, annualMedianIncome: 109860 },
  { householdSize: 4, annualMedianIncome: 128363 },
  { householdSize: 5, annualMedianIncome: 139463 },
  { householdSize: 6, annualMedianIncome: 150563 },
  { householdSize: 7, annualMedianIncome: 161663 },
  { householdSize: 8, annualMedianIncome: 172763 },
];

/**
 * For households larger than 8, add this amount per additional person.
 */
export const ADDITIONAL_PERSON_INCOME = 11100;

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
 * Utah bankruptcy exemptions (2025).
 * These determine what assets you can protect in bankruptcy.
 */
export const UTAH_EXEMPTIONS_2025 = {
  // Homestead exemption (primary residence equity)
  homesteadSingle: 52350,
  homesteadJoint: 104700,

  // Motor vehicle exemption (per vehicle, combined total)
  vehicleSingle: 3000,
  vehicleJoint: 6000,

  // General personal property threshold
  valuableAssetThreshold: 500,
} as const;

/**
 * Disposable income threshold (5% of monthly income).
 * If excess is less than this percentage, budget passes.
 */
export const DISPOSABLE_INCOME_THRESHOLD = 0.05;

/**
 * Last updated date for thresholds.
 * TODO: Implement automated check against this date.
 */
export const THRESHOLDS_LAST_UPDATED = '2025-01-01';

/**
 * Check if thresholds are stale (older than 6 months).
 */
export function areThresholdsStale(): boolean {
  const lastUpdated = new Date(THRESHOLDS_LAST_UPDATED);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return lastUpdated < sixMonthsAgo;
}
