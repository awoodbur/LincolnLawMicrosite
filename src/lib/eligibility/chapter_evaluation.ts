/**
 * Chapter 7/13 Eligibility Evaluation for Utah
 *
 * This module implements the three-part test for bankruptcy eligibility:
 * 1. Income Test (Means Test) - Compare to Utah median
 * 2. Budget Test (Disposable Income) - Less than 5% excess
 * 3. Asset Test - Check exemption limits
 */

import {
  UTAH_MEDIAN_INCOME_2024,
  ADDITIONAL_PERSON_INCOME,
  UTAH_EXEMPTIONS_2025,
  DISPOSABLE_INCOME_THRESHOLD,
} from './utah_thresholds';
import { logger } from '../logger';

export interface ChapterEvaluationInput {
  householdSize: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  homeEquity: number | 'NA';
  vehicleEquity: number;
  hasValuableAssets: boolean;
}

export type Chapter7Eligibility = 'Low' | 'Medium' | 'High';
export type RecommendedChapter = '7' | '13';

export interface ChapterEvaluationFlags {
  incomePass: boolean;
  budgetPass: boolean;
  assetRisk: boolean;
}

export interface ChapterEvaluationResult {
  summary: string;
  chapter7Eligibility: Chapter7Eligibility;
  recommendedChapter: RecommendedChapter;
  reasons: string[];
  flags: ChapterEvaluationFlags;
  disclaimer: string;
}

/**
 * Get the median income cap for a household size
 */
function getMedianIncomeCap(householdSize: number): number {
  const clampedSize = Math.min(householdSize, 4);
  const baseIncome = UTAH_MEDIAN_INCOME_2024.find(t => t.householdSize === clampedSize);

  if (!baseIncome) {
    throw new Error(`No median income data for household size ${clampedSize}`);
  }

  const cap = baseIncome.annualMedianIncome;
  const additionalPeople = Math.max(0, householdSize - 4);

  return cap + (additionalPeople * ADDITIONAL_PERSON_INCOME);
}

/**
 * Evaluate Chapter 7/13 bankruptcy eligibility based on Utah rules
 */
export function evaluateChapterEligibility(input: ChapterEvaluationInput): ChapterEvaluationResult {
  logger.info('Starting Chapter 7/13 evaluation', {
    householdSize: input.householdSize,
    monthlyIncome: input.monthlyIncome,
  });

  // ========== Income Test (Means Test) ==========
  const cap = getMedianIncomeCap(input.householdSize);
  const annualIncome = input.monthlyIncome * 12;
  const incomePass = annualIncome < cap;

  logger.debug('Income test', {
    annualIncome,
    cap,
    incomePass,
  });

  // ========== Budget Test (Disposable Income) ==========
  const excess = input.monthlyIncome - input.monthlyExpenses;
  const budgetPass = excess < input.monthlyIncome * DISPOSABLE_INCOME_THRESHOLD;

  logger.debug('Budget test', {
    excess,
    threshold: input.monthlyIncome * DISPOSABLE_INCOME_THRESHOLD,
    budgetPass,
  });

  // ========== Asset Tests ==========
  const isJoint = input.householdSize > 1;
  const homesteadLimit = isJoint
    ? UTAH_EXEMPTIONS_2025.homesteadJoint
    : UTAH_EXEMPTIONS_2025.homesteadSingle;
  const vehicleLimit = isJoint
    ? UTAH_EXEMPTIONS_2025.vehicleJoint
    : UTAH_EXEMPTIONS_2025.vehicleSingle;

  const homeProtected = input.homeEquity === 'NA' || Number(input.homeEquity) <= homesteadLimit;
  const vehicleProtected = input.vehicleEquity <= vehicleLimit;
  const assetRisk = !homeProtected || !vehicleProtected || input.hasValuableAssets;

  logger.debug('Asset test', {
    homeProtected,
    vehicleProtected,
    hasValuableAssets: input.hasValuableAssets,
    assetRisk,
  });

  // ========== Overall Determination ==========
  const passCount = [incomePass, budgetPass, !assetRisk].filter(Boolean).length;

  let chapter7Eligibility: Chapter7Eligibility;
  let recommendedChapter: RecommendedChapter;

  if (passCount === 3) {
    chapter7Eligibility = 'High';
    recommendedChapter = '7';
  } else if (passCount === 2) {
    chapter7Eligibility = 'Medium';
    recommendedChapter = incomePass ? '7' : '13';
  } else {
    chapter7Eligibility = 'Low';
    recommendedChapter = '13';
  }

  // ========== Build Reasons ==========
  const reasons: string[] = [];

  // Income Assessment
  if (incomePass) {
    reasons.push('Income below Utah median');
  } else {
    reasons.push('Income exceeds Utah median');
  }

  // Budget Assessment
  if (budgetPass) {
    reasons.push('Limited disposable income');
  } else {
    reasons.push('Disposable income above threshold');
  }

  // Asset Assessment
  if (assetRisk) {
    reasons.push('Potential non-exempt asset risk');
  } else {
    reasons.push('All key assets appear protected');
  }

  const summary = `Based on the information provided, your preliminary eligibility for Chapter 7 is ${chapter7Eligibility}.`;

  const disclaimer =
    'This determination is preliminary and not legal advice. A full legal consultation is required to finalize your bankruptcy eligibility and strategy.';

  const flags: ChapterEvaluationFlags = {
    incomePass,
    budgetPass,
    assetRisk,
  };

  logger.info('Chapter evaluation completed', {
    chapter7Eligibility,
    recommendedChapter,
    passCount,
  });

  return {
    summary,
    chapter7Eligibility,
    recommendedChapter,
    reasons,
    flags,
    disclaimer,
  };
}
