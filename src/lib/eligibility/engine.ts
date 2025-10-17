/**
 * Eligibility engine entry point.
 * Exports the main evaluation function and types.
 */

export { evaluateEligibility } from './rules';
export type { EligibilityInput, EligibilityResult, EligibilityTier, EligibilityMetrics } from './rules';
export { getUtahMedianIncome, areThresholdsStale } from './utah_thresholds';
