/**
 * Eligibility engine entry point.
 * Exports the main evaluation function and types.
 */

export { evaluateEligibility } from './rules';
export type { EligibilityInput, EligibilityResult, EligibilityTier, EligibilityMetrics } from './rules';
export { getUtahMedianIncome, areThresholdsStale } from './utah_thresholds';

// Chapter 7/13 evaluation (new)
export { evaluateChapterEligibility } from './chapter_evaluation';
export type {
  ChapterEvaluationInput,
  ChapterEvaluationResult,
  Chapter7Eligibility,
  RecommendedChapter,
  ChapterEvaluationFlags,
} from './chapter_evaluation';
