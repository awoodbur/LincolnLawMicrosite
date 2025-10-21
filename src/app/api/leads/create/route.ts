import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { withRateLimit } from '@/lib/rateLimit';
import { mailgunProvider } from '@/lib/email/mailgun';
import { generateUserConfirmationEmail } from '@/lib/email/templates/user_confirmation';
import { env } from '@/lib/env';
import { leadSchema } from '@/lib/validation/intake';

async function handleCreateLead(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate incoming data
    const validatedData = leadSchema.parse(body);

    // Create lead in database
    const lead = await db.lead.create({
      data: {
        state: validatedData.state,
        county: validatedData.county,
        householdSize: validatedData.householdSize,
        maritalStatus: validatedData.maritalStatus,
        monthlyIncomeRange: validatedData.monthlyIncomeRange,
        unsecuredDebtRange: validatedData.unsecuredDebtRange,
        employmentStatus: validatedData.employmentStatus,
        missedPayments: validatedData.missedPayments,
        wageGarnishment: validatedData.wageGarnishment,
        propertyConcerns: validatedData.propertyConcerns,
        notes: validatedData.notes,
        email: validatedData.email,
        consentPrivacy: validatedData.consentPrivacy,
        consentTerms: validatedData.consentTerms,
        consentData: validatedData.consentData,
        source: validatedData.source || 'lincolnlaw-utah-intake',
      },
    });

    // Create consent log
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await db.consentLog.create({
      data: {
        leadId: lead.id,
        version: 'v1.0',
        ip,
        userAgent,
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        leadId: lead.id,
        actor: 'user',
        event: 'lead_created',
        payloadJson: JSON.stringify({
          state: lead.state,
          householdSize: lead.householdSize,
          county: lead.county,
        }),
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
      // Send user confirmation email (DEV MODE: sending to dev instead of actual user)
      const userEmail = generateUserConfirmationEmail({ email: lead.email });
      await mailgunProvider.send({
        to: env.STAFF_LEADS_EMAIL!, // DEV: Send to dev instead of lead.email
        subject: `[DEV - User Confirmation] ${userEmail.subject}`,
        html: userEmail.html,
        text: userEmail.text,
      });

      // Send staff notification email
    const staffHtml = `
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
        <span class="label">Monthly Income:</span> <span class="value">${lead.monthlyIncomeRange}</span>
      </div>
      <div class="field">
        <span class="label">Unsecured Debt:</span> <span class="value">${lead.unsecuredDebtRange}</span>
      </div>
      <div class="field">
        <span class="label">Employment:</span> <span class="value">${lead.employmentStatus}</span>
      </div>

      <h2>Situation Indicators</h2>
      <div>
        ${lead.missedPayments ? '<span class="badge badge-yes">Missed Payments</span>' : '<span class="badge badge-no">No Missed Payments</span>'}
        ${lead.wageGarnishment ? '<span class="badge badge-yes">Wage Garnishment</span>' : '<span class="badge badge-no">No Wage Garnishment</span>'}
        ${lead.propertyConcerns ? '<span class="badge badge-yes">Property Concerns</span>' : '<span class="badge badge-no">No Property Concerns</span>'}
      </div>

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

    const staffText = `
NEW UTAH BANKRUPTCY LEAD

Contact Information:
- Email: ${lead.email}
- State: ${lead.state}
${lead.county ? `- County: ${lead.county}` : ''}

Household Information:
- Household Size: ${lead.householdSize} people
- Marital Status: ${lead.maritalStatus}

Financial Snapshot:
- Monthly Income: ${lead.monthlyIncomeRange}
- Unsecured Debt: ${lead.unsecuredDebtRange}
- Employment: ${lead.employmentStatus}

Situation Indicators:
- Missed Payments: ${lead.missedPayments ? 'Yes' : 'No'}
- Wage Garnishment: ${lead.wageGarnishment ? 'Yes' : 'No'}
- Property Concerns: ${lead.propertyConcerns ? 'Yes' : 'No'}

${lead.notes ? `Additional Notes:\n${lead.notes}\n` : ''}
---
Lead ID: ${lead.id}
Source: ${lead.source}
Received: ${new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })}
    `.trim();

      await mailgunProvider.send({
        to: env.STAFF_LEADS_EMAIL!,
        subject: `[DEV - Staff Lead] New Bankruptcy Lead: ${lead.email} (${lead.state})`,
        html: staffHtml,
        text: staffText,
      });

      logger.info('Emails sent successfully', { leadId: lead.id });
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

    logger.error('Failed to create lead', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: 'Failed to create lead. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return withRateLimit(req, handleCreateLead, {
    interval: 60000, // 1 minute
    uniqueTokenPerInterval: 5, // 5 requests per minute
  });
}
