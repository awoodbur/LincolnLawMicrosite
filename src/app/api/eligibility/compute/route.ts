import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { withRateLimit } from '@/lib/rateLimit';
import { evaluateEligibility } from '@/lib/eligibility/engine';
import { getFinancialSummary } from '@/lib/plaid/client';
import { mailgunProvider } from '@/lib/email/mailgun';
import { generateStaffEligibilitySummaryEmail } from '@/lib/email/templates/staff_eligibility_summary';
import { env } from '@/lib/env';

const schema = z.object({
  leadId: z.string(),
  usePlaidData: z.boolean().default(false),
});

async function handleComputeEligibility(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, usePlaidData } = schema.parse(body);

    // Get lead
    const lead = await db.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    let monthlyIncomeEstimate = 0;
    let monthlyDebtPaymentsEstimate = 0;
    let cashflowMonthly = 0;

    // TODO: Plaid integration requires plaidAccessToken field in Lead schema
    // Use Plaid data if available and requested
    // if (usePlaidData && lead.plaidAccessToken) {
    //   try {
    //     const financialData = await getFinancialSummary(lead.plaidAccessToken);
    //     monthlyIncomeEstimate = financialData.transactions.monthlyAverageIncome;
    //     monthlyDebtPaymentsEstimate = financialData.transactions.monthlyAverageExpenses * 0.3; // Estimate 30% of expenses are debt
    //     cashflowMonthly = financialData.transactions.cashflowMonthly;

    //     logger.info('Using Plaid data for eligibility', { leadId });
    //   } catch (error) {
    //     logger.warn('Failed to get Plaid data, falling back to questionnaire data', {
    //       leadId,
    //       error: error instanceof Error ? error.message : 'Unknown error',
    //     });
    //   }
    // }

    // Fall back to questionnaire data
    // Parse income range (e.g., "<$3k" -> estimate midpoint)
    const incomeRangeMap: Record<string, number> = {
      '<$3k': 2000,
      '$3–5k': 4000,
      '$5–8k': 6500,
      '$8k+': 10000,
    };
    monthlyIncomeEstimate = incomeRangeMap[lead.monthlyIncomeRange] || 4000;

    // Parse debt range and estimate monthly payments
    const debtRangeMap: Record<string, number> = {
      '<$10k': 5000,
      '$10–25k': 17500,
      '$25–50k': 37500,
      '$50k+': 75000,
    };
    const totalDebt = debtRangeMap[lead.unsecuredDebtRange] || 17500;
    // Rough estimate: 3% of total debt as monthly payment
    monthlyDebtPaymentsEstimate = totalDebt * 0.03;

    // Estimate cashflow
    cashflowMonthly = monthlyIncomeEstimate - monthlyDebtPaymentsEstimate - monthlyIncomeEstimate * 0.5; // Assume 50% for other expenses

    // Evaluate eligibility
    const eligibilityResult = evaluateEligibility({
      state: lead.state,
      householdSize: lead.householdSize,
      monthlyIncomeEstimate,
      monthlyDebtPaymentsEstimate,
      cashflowMonthly,
    });

    // Store eligibility result (using EligibilityResult model from schema)
    await db.eligibilityResult.create({
      data: {
        leadId: lead.id,
        tier: eligibilityResult.tier,
        rationale: JSON.stringify(eligibilityResult.rationale),
        metrics: JSON.stringify(eligibilityResult.metrics),
        disclaimers: JSON.stringify(eligibilityResult.disclaimers),
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        leadId: lead.id,
        actor: 'system',
        event: 'eligibility_computed',
        payloadJson: JSON.stringify({
          tier: eligibilityResult.tier,
          usedPlaidData: false, // Plaid not currently integrated
        }),
      },
    });

    // Send staff eligibility email if feature flag enabled and email configured
    if (env.NEXT_PUBLIC_SHOW_ELIGIBILITY && env.STAFF_LEADS_EMAIL) {
      const staffEmail = generateStaffEligibilitySummaryEmail({
        email: lead.email,
        state: lead.state,
        eligibility: eligibilityResult,
        createdAt: new Date(),
      });

      await mailgunProvider.send({
        to: env.STAFF_LEADS_EMAIL,
        subject: staffEmail.subject,
        html: staffEmail.html,
        text: staffEmail.text,
      });
    }

    logger.info('Eligibility computed', {
      leadId: lead.id,
      tier: eligibilityResult.tier,
    });

    return NextResponse.json({
      success: true,
      // Don't return full eligibility to client unless feature flag enabled
      ...(env.NEXT_PUBLIC_SHOW_ELIGIBILITY && { eligibility: eligibilityResult }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    logger.error('Failed to compute eligibility', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: 'Failed to compute eligibility' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return withRateLimit(req, handleComputeEligibility, {
    interval: 60000,
    uniqueTokenPerInterval: 10,
  });
}
