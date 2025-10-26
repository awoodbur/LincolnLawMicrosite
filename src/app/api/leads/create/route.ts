import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { withRateLimit } from '@/lib/rateLimit';
import { mailgunProvider } from '@/lib/email/mailgun';
import { generateUserConfirmationEmail } from '@/lib/email/templates/user_confirmation';
import { env } from '@/lib/env';
import { leadSchema } from '@/lib/validation/intake';

// Extend lead schema to include eligibility
const leadWithEligibilitySchema = z.object({
  // Intake step fields
  state: z.literal('Utah'),
  county: z.string().optional(),
  householdSize: z.number().min(1).max(8),
  maritalStatus: z.enum(['Single', 'Married', 'Separated']),
  employmentStatus: z.enum(['Employed', 'Self-employed', 'Unemployed', 'Retired']),
  priorBankruptcy: z.boolean().optional(),

  // Old fields (for backwards compatibility)
  monthlyIncomeRange: z.enum(['<$3k', '$3–5k', '$5–8k', '$8k+']).optional(),
  unsecuredDebtRange: z.enum(['<$10k', '$10–25k', '$25–50k', '$50k+']).optional(),

  // New detailed financial fields
  incomeAboveThreshold: z.boolean().optional(),
  monthlyExpenses: z.number().min(0).optional(),
  unsecuredDebt: z.enum(['<$10k', '$10-25k', '$25-50k', '$50k+']).optional(),
  homeEquity: z.union([z.number().min(0), z.literal('NA')]).optional(),
  vehicleEquity: z.number().min(0).optional(),
  hasValuableAssets: z.boolean().optional(),

  // Urgency flags
  missedPayments: z.boolean(),
  wageGarnishment: z.boolean(),
  propertyConcerns: z.boolean(),
  notes: z.string().optional(),

  // Email + consent fields
  email: z.string().email(),
  phone: z.string().optional(),
  consentPrivacy: z.boolean(),
  consentTerms: z.boolean(),
  consentData: z.boolean(),

  // Metadata
  source: z.string().default('lincolnlaw-utah-intake'),

  // Eligibility result (optional)
  eligibilityResult: z.object({
    summary: z.string(),
    chapter7Eligibility: z.string(),
    recommendedChapter: z.string(),
    reasons: z.array(z.string()),
    flags: z.object({
      incomePass: z.boolean(),
      budgetPass: z.boolean(),
      assetRisk: z.boolean(),
    }),
    disclaimer: z.string(),
  }).optional().nullable(),
});

async function handleCreateLead(req: NextRequest) {
  try {
    console.log('[API] /api/leads/create - Request received');
    const body = await req.json();
    console.log('[API] Request body parsed successfully');

    // Validate incoming data
    const validatedData = leadWithEligibilitySchema.parse(body);
    console.log('[API] Data validated successfully');

    // Create lead in database
    console.log('[API] Creating lead in database...');
    const lead = await db.lead.create({
      data: {
        // Contact
        email: validatedData.email,
        phone: validatedData.phone,

        // Location
        state: validatedData.state,
        county: validatedData.county,

        // Household
        householdSize: validatedData.householdSize,
        maritalStatus: validatedData.maritalStatus,

        // Employment & History
        employmentStatus: validatedData.employmentStatus,
        priorBankruptcy: validatedData.priorBankruptcy ?? false,

        // Financial Details (map form fields to schema fields)
        isAboveMedian: validatedData.incomeAboveThreshold ?? false,
        monthlyExpenses: validatedData.monthlyExpenses ?? 0,
        totalDebt: validatedData.unsecuredDebt ?? validatedData.unsecuredDebtRange ?? '<$10k',

        // Assets (handle 'NA' for homeEquity)
        homeEquity: validatedData.homeEquity === 'NA' ? null : (validatedData.homeEquity ?? null),
        vehicleEquity: validatedData.vehicleEquity ?? 0,
        hasValuableItems: validatedData.hasValuableAssets ?? false,

        // Urgency Flags
        missedPayments: validatedData.missedPayments,
        wageGarnishment: validatedData.wageGarnishment,
        propertyConcerns: validatedData.propertyConcerns,

        // Additional
        notes: validatedData.notes,
      },
    });

    // Create consent log
    const forwarded = req.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await db.consentLog.create({
      data: {
        leadId: lead.id,
        consentType: 'all',
        consentVersion: 'v1.0',
        ipAddress,
        userAgent,
      },
    });

    // Create eligibility result if provided
    if (validatedData.eligibilityResult) {
      await db.eligibilityResult.create({
        data: {
          leadId: lead.id,
          summary: validatedData.eligibilityResult.summary,
          recommendedChapter: validatedData.eligibilityResult.recommendedChapter,
          chapter7Eligible: validatedData.eligibilityResult.chapter7Eligibility === 'Eligible' || validatedData.eligibilityResult.chapter7Eligibility === 'Likely',
          incomeTestPass: validatedData.eligibilityResult.flags.incomePass,
          budgetTestPass: validatedData.eligibilityResult.flags.budgetPass,
          assetRisk: validatedData.eligibilityResult.flags.assetRisk,
          reasons: validatedData.eligibilityResult.reasons,
          disclaimer: validatedData.eligibilityResult.disclaimer,
        },
      });
      console.log('[API] Eligibility result stored');
    }

    // Create audit log
    await db.auditLog.create({
      data: {
        leadId: lead.id,
        event: 'lead_created',
        details: {
          state: lead.state,
          householdSize: lead.householdSize,
          county: lead.county,
          hasEligibility: !!validatedData.eligibilityResult,
        },
        ipAddress,
        userAgent,
      },
    });

    logger.info('Lead created', {
      leadId: lead.id,
      email: lead.email,
      state: lead.state,
    });

    // Send emails only if Mailgun is configured
    const isMailgunConfigured = env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN && env.MAILGUN_FROM && env.STAFF_LEADS_EMAIL;

    if (isMailgunConfigured) {
      // Send user confirmation email to the actual user
      const userEmail = generateUserConfirmationEmail({ email: lead.email });
      await mailgunProvider.send({
        to: lead.email,
        subject: userEmail.subject,
        html: userEmail.html,
        text: userEmail.text,
      });

      logger.info('User confirmation email sent', { leadId: lead.id, to: lead.email });

      // Send staff notification email WITH eligibility
      const staffHtml = generateStaffEmailHTML(lead, validatedData.eligibilityResult);
      const staffText = generateStaffEmailText(lead, validatedData.eligibilityResult);

      await mailgunProvider.send({
        to: env.STAFF_LEADS_EMAIL!,
        subject: `New Bankruptcy Lead: ${lead.email} (${lead.state})`,
        html: staffHtml,
        text: staffText,
      });

      logger.info('Staff notification email sent', { leadId: lead.id, to: env.STAFF_LEADS_EMAIL });
    } else {
      logger.info('Mailgun not configured - skipping email notifications', { leadId: lead.id });
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Invalid lead data submitted', { errors: error.issues });
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }

    // Check for unique constraint violation (duplicate email)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      logger.warn('Duplicate email attempt', {
        error: error.message,
      });
      return NextResponse.json(
        { error: 'This email has already been submitted. If you need to update your information, please contact us directly.' },
        { status: 409 }
      );
    }

    console.error('[API] Error creating lead:', error);
    logger.error('Failed to create lead', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: 'Failed to create lead. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Email generation functions
function generateStaffEmailHTML(lead: any, eligibility: any) {
  const eligibilitySection = eligibility ? `
    <h2 style="color: #1F2937; margin-top: 24px;">Eligibility Assessment</h2>
    <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
      <div class="field">
        <span class="label">Summary:</span>
        <span class="value">${eligibility.summary}</span>
      </div>
      <div class="field">
        <span class="label">Recommended Chapter:</span>
        <span class="value" style="font-weight: bold; color: #059669;">Chapter ${eligibility.recommendedChapter}</span>
      </div>
      <div class="field">
        <span class="label">Chapter 7 Eligibility:</span>
        <span class="value">${eligibility.chapter7Eligibility}</span>
      </div>
      <div class="field">
        <span class="label">Income Test:</span>
        <span class="value">${eligibility.flags.incomePass ? '✓ Passes' : '✗ Does not pass'}</span>
      </div>
      <div class="field">
        <span class="label">Budget Test:</span>
        <span class="value">${eligibility.flags.budgetPass ? '✓ Passes' : '✗ Does not pass'}</span>
      </div>
      <div class="field">
        <span class="label">Asset Risk:</span>
        <span class="value">${eligibility.flags.assetRisk ? '⚠ Yes' : '✓ No'}</span>
      </div>
      <h3 style="color: #374151; margin-top: 16px; font-size: 14px;">Key Reasons:</h3>
      <ul style="margin: 8px 0; padding-left: 20px;">
        ${eligibility.reasons.map((r: string) => `<li style="color: #6B7280; margin: 4px 0;">${r}</li>`).join('')}
      </ul>
      <p style="color: #6B7280; font-size: 12px; margin-top: 12px;"><em>${eligibility.disclaimer}</em></p>
    </div>
  ` : '<p style="color: #6B7280;"><em>No eligibility assessment completed</em></p>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #3B82F6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .field { margin-bottom: 12px; }
    .label { font-weight: bold; color: #6B7280; }
    .value { color: #1F2937; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin: 2px; }
    .badge-yes { background-color: #FEF3C7; color: #92400E; }
    .badge-no { background-color: #E5E7EB; color: #6B7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">New Utah Bankruptcy Lead</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">${new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })}</p>
    </div>
    <div class="content">
      <h2>Contact Information</h2>
      <div class="field">
        <span class="label">Email:</span> <span class="value">${lead.email}</span>
      </div>
      ${lead.phone ? `<div class="field"><span class="label">Phone:</span> <span class="value">${lead.phone}</span></div>` : ''}
      <div class="field">
        <span class="label">State:</span> <span class="value">${lead.state}</span>
      </div>
      ${lead.county ? `<div class="field"><span class="label">County:</span> <span class="value">${lead.county}</span></div>` : ''}

      <h2>Household Information</h2>
      <div class="field">
        <span class="label">Household Size:</span> <span class="value">${lead.householdSize} people</span>
      </div>
      <div class="field">
        <span class="label">Marital Status:</span> <span class="value">${lead.maritalStatus}</span>
      </div>

      <h2>Financial Snapshot</h2>
      <div class="field">
        <span class="label">Income Above Median:</span> <span class="value">${lead.isAboveMedian ? 'Yes' : 'No'}</span>
      </div>
      <div class="field">
        <span class="label">Monthly Expenses:</span> <span class="value">$${lead.monthlyExpenses.toFixed(2)}</span>
      </div>
      <div class="field">
        <span class="label">Total Unsecured Debt:</span> <span class="value">${lead.totalDebt}</span>
      </div>
      <div class="field">
        <span class="label">Employment:</span> <span class="value">${lead.employmentStatus}</span>
      </div>
      <div class="field">
        <span class="label">Prior Bankruptcy:</span> <span class="value">${lead.priorBankruptcy ? 'Yes' : 'No'}</span>
      </div>

      <h2>Assets</h2>
      <div class="field">
        <span class="label">Home Equity:</span> <span class="value">${lead.homeEquity !== null ? '$' + lead.homeEquity.toFixed(2) : 'No home'}</span>
      </div>
      <div class="field">
        <span class="label">Vehicle Equity:</span> <span class="value">$${lead.vehicleEquity.toFixed(2)}</span>
      </div>
      <div class="field">
        <span class="label">Valuable Items:</span> <span class="value">${lead.hasValuableItems ? 'Yes' : 'No'}</span>
      </div>

      <h2>Situation Indicators</h2>
      <div>
        ${lead.missedPayments ? '<span class="badge badge-yes">Missed Payments</span>' : '<span class="badge badge-no">No Missed Payments</span>'}
        ${lead.wageGarnishment ? '<span class="badge badge-yes">Wage Garnishment</span>' : '<span class="badge badge-no">No Wage Garnishment</span>'}
        ${lead.propertyConcerns ? '<span class="badge badge-yes">Property Concerns</span>' : '<span class="badge badge-no">No Property Concerns</span>'}
      </div>

      ${eligibilitySection}

      ${lead.notes ? `
      <h2>Additional Notes</h2>
      <div style="background: white; padding: 12px; border-radius: 4px; border: 1px solid #e5e7eb;">
        ${lead.notes}
      </div>
      ` : ''}

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="text-align: center; color: #6B7280; font-size: 14px;">
        Lead ID: ${lead.id}<br>
        Source: ${lead.source}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateStaffEmailText(lead: any, eligibility: any) {
  const eligibilitySection = eligibility ? `
Eligibility Assessment:
- Summary: ${eligibility.summary}
- Recommended Chapter: Chapter ${eligibility.recommendedChapter}
- Chapter 7 Eligibility: ${eligibility.chapter7Eligibility}
- Income Test: ${eligibility.flags.incomePass ? 'Passes' : 'Does not pass'}
- Budget Test: ${eligibility.flags.budgetPass ? 'Passes' : 'Does not pass'}
- Asset Risk: ${eligibility.flags.assetRisk ? 'Yes' : 'No'}

Key Reasons:
${eligibility.reasons.map((r: string) => `- ${r}`).join('\n')}

Disclaimer: ${eligibility.disclaimer}
` : 'No eligibility assessment completed';

  return `
NEW UTAH BANKRUPTCY LEAD

Contact Information:
- Email: ${lead.email}
${lead.phone ? `- Phone: ${lead.phone}` : ''}
- State: ${lead.state}
${lead.county ? `- County: ${lead.county}` : ''}

Household Information:
- Household Size: ${lead.householdSize} people
- Marital Status: ${lead.maritalStatus}

Financial Snapshot:
- Income Above Median: ${lead.isAboveMedian ? 'Yes' : 'No'}
- Monthly Expenses: $${lead.monthlyExpenses.toFixed(2)}
- Total Unsecured Debt: ${lead.totalDebt}
- Employment: ${lead.employmentStatus}
- Prior Bankruptcy: ${lead.priorBankruptcy ? 'Yes' : 'No'}

Assets:
- Home Equity: ${lead.homeEquity !== null ? '$' + lead.homeEquity.toFixed(2) : 'No home'}
- Vehicle Equity: $${lead.vehicleEquity.toFixed(2)}
- Valuable Items: ${lead.hasValuableItems ? 'Yes' : 'No'}

Situation Indicators:
- Missed Payments: ${lead.missedPayments ? 'Yes' : 'No'}
- Wage Garnishment: ${lead.wageGarnishment ? 'Yes' : 'No'}
- Property Concerns: ${lead.propertyConcerns ? 'Yes' : 'No'}

${eligibilitySection}

${lead.notes ? `Additional Notes:\n${lead.notes}\n` : ''}
---
Lead ID: ${lead.id}
Source: ${lead.source}
Received: ${new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })}
  `.trim();
}

export async function POST(req: NextRequest) {
  return withRateLimit(req, handleCreateLead, {
    interval: 60000, // 1 minute
    uniqueTokenPerInterval: 5, // 5 requests per minute
  });
}
