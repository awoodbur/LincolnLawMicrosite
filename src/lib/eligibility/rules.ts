import {
  getUtahMedianIncome,
  DTI_THRESHOLDS,
  CASHFLOW_THRESHOLDS,
  areThresholdsStale,
} from './utah_thresholds';
import { logger } from '../logger';

export interface EligibilityInput {
  state: string;
  householdSize: number;
  monthlyIncomeEstimate: number;
  monthlyDebtPaymentsEstimate: number;
  cashflowMonthly: number;
}

export type EligibilityTier = 'Likely' | 'Possibly' | 'Unlikely';

export interface EligibilityMetrics {
  dti: number;
  cashflowMonthly: number;
  annualizedIncome: number;
  medianIncome: number;
  incomeVsMedian: number; // percentage (e.g., 0.85 = 85% of median)
}

export interface EligibilityResult {
  tier: EligibilityTier;
  rationale: string[];
  metrics: EligibilityMetrics;
  disclaimers: string[];
}

/**
 * Evaluate bankruptcy eligibility based on financial inputs.
 * This is a preliminary, informational assessment only.
 */
export function evaluateEligibility(input: EligibilityInput): EligibilityResult {
  // Warn if thresholds are stale
  if (areThresholdsStale()) {
    logger.warn('Utah means test thresholds are stale and should be updated', {
      state: input.state,
    });
  }

  // Only support Utah for PoC
  if (input.state !== 'UT') {
    throw new Error(`State ${input.state} is not supported. This PoC only supports Utah.`);
  }

  // Calculate metrics
  const annualizedIncome = input.monthlyIncomeEstimate * 12;
  const medianIncome = getUtahMedianIncome(input.householdSize);
  const incomeVsMedian = annualizedIncome / medianIncome;
  const dti = input.monthlyDebtPaymentsEstimate / input.monthlyIncomeEstimate;

  const metrics: EligibilityMetrics = {
    dti,
    cashflowMonthly: input.cashflowMonthly,
    annualizedIncome,
    medianIncome,
    incomeVsMedian,
  };

  // Assess eligibility
  const rationale: string[] = [];
  let score = 0;

  // DTI assessment
  if (dti < DTI_THRESHOLDS.FAVORABLE) {
    rationale.push(`Debt-to-income ratio (${(dti * 100).toFixed(1)}%) is favorable`);
    score += 2;
  } else if (dti < DTI_THRESHOLDS.BORDERLINE) {
    rationale.push(`Debt-to-income ratio (${(dti * 100).toFixed(1)}%) is within acceptable range`);
    score += 1;
  } else {
    rationale.push(`Debt-to-income ratio (${(dti * 100).toFixed(1)}%) indicates significant debt burden`);
    score -= 1;
  }

  // Cashflow assessment
  if (input.cashflowMonthly < CASHFLOW_THRESHOLDS.NEUTRAL) {
    rationale.push(`Negative monthly cashflow ($${input.cashflowMonthly.toFixed(2)}) indicates financial distress`);
    score += 2; // Negative cashflow = stronger need signal
  } else if (input.cashflowMonthly < CASHFLOW_THRESHOLDS.HEALTHY) {
    rationale.push(`Minimal monthly cashflow ($${input.cashflowMonthly.toFixed(2)})`);
    score += 1;
  } else {
    rationale.push(`Positive monthly cashflow ($${input.cashflowMonthly.toFixed(2)})`);
    score -= 1;
  }

  // Income vs median assessment
  if (incomeVsMedian < 1.0) {
    rationale.push(
      `Annual income ($${annualizedIncome.toLocaleString()}) is ${(incomeVsMedian * 100).toFixed(0)}% of Utah median for household size ${input.householdSize}`
    );
    score += 1;
  } else {
    rationale.push(
      `Annual income ($${annualizedIncome.toLocaleString()}) exceeds Utah median by ${((incomeVsMedian - 1) * 100).toFixed(0)}%`
    );
    score -= 1;
  }

  // Determine tier based on score
  let tier: EligibilityTier;
  if (score >= 3) {
    tier = 'Likely';
    rationale.push('Overall profile suggests strong candidacy for bankruptcy relief');
  } else if (score >= 0) {
    tier = 'Possibly';
    rationale.push('Overall profile suggests potential candidacy, pending detailed review');
  } else {
    tier = 'Unlikely';
    rationale.push('Overall profile may not meet typical criteria, but individual circumstances vary');
  }

  // Standard disclaimers
  const disclaimers = [
    'This is a preliminary, informational assessment only and does not constitute legal advice.',
    'Final determination of bankruptcy eligibility requires consultation with a licensed attorney.',
    'Individual circumstances, assets, and debts must be reviewed in detail.',
    'Bankruptcy laws and means test criteria are subject to change.',
  ];

  logger.info('Eligibility evaluation completed', {
    state: input.state,
    householdSize: input.householdSize,
    tier,
    score,
    dti: metrics.dti,
  });

  return {
    tier,
    rationale,
    metrics,
    disclaimers,
  };
}
