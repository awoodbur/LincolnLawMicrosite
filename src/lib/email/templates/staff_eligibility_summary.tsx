import type { EligibilityResult } from '../../eligibility/engine';

export interface StaffEligibilitySummaryData {
  email: string;
  state: string;
  eligibility: EligibilityResult;
  createdAt: Date;
}

export function generateStaffEligibilitySummaryEmail(data: StaffEligibilitySummaryData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Eligibility Assessment: ${data.email} - ${data.eligibility.tier}`;

  const tierColors = {
    Likely: { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
    Possibly: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
    Unlikely: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
  };

  const colors = tierColors[data.eligibility.tier];

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background-color: #3B82F6; color: white; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
      <h1 style="margin: 0; font-size: 20px;">Eligibility Assessment</h1>
      <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">
        ${new Date(data.createdAt).toLocaleString('en-US', {
          timeZone: 'America/Denver',
          dateStyle: 'full',
          timeStyle: 'short',
        })}
      </p>
    </div>

    <!-- Lead Info -->
    <div style="margin-bottom: 24px;">
      <p style="margin: 0 0 4px 0; color: #6B7280; font-size: 14px;">Lead Email:</p>
      <p style="margin: 0; font-size: 18px; color: #1F2937;">
        <a href="mailto:${data.email}" style="color: #3B82F6; text-decoration: none;">${data.email}</a>
      </p>
    </div>

    <!-- Eligibility Tier -->
    <div style="background-color: ${colors.bg}; border-left: 4px solid ${colors.border}; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <h2 style="color: ${colors.text}; margin: 0 0 8px 0; font-size: 18px;">
        Assessment: ${data.eligibility.tier}
      </h2>
    </div>

    <!-- Metrics -->
    <div style="margin-bottom: 24px;">
      <h3 style="color: #1F2937; font-size: 16px; margin-bottom: 12px; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px;">
        Financial Metrics
      </h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6B7280; width: 50%;">DTI (Debt-to-Income):</td>
          <td style="padding: 8px 0; color: #1F2937;">${(data.eligibility.metrics.dti * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6B7280;">Monthly Cashflow:</td>
          <td style="padding: 8px 0; color: #1F2937;">$${data.eligibility.metrics.cashflowMonthly.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6B7280;">Annualized Income:</td>
          <td style="padding: 8px 0; color: #1F2937;">$${data.eligibility.metrics.annualizedIncome.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <!-- Rationale -->
    <div style="margin-bottom: 24px;">
      <h3 style="color: #1F2937; font-size: 16px; margin-bottom: 12px; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px;">
        Assessment Rationale
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: #374151;">
        ${data.eligibility.rationale.map((reason) => `<li style="margin-bottom: 8px;">${reason}</li>`).join('')}
      </ul>
    </div>

    <!-- Important Disclaimer -->
    <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <h3 style="color: #92400E; margin: 0 0 8px 0; font-size: 14px; font-weight: 700;">IMPORTANT DISCLAIMER</h3>
      <p style="margin: 0; color: #92400E; font-size: 13px;">
        ${data.eligibility.disclaimers.join(' ')}
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #E5E7EB; padding-top: 16px; text-align: center; color: #6B7280; font-size: 12px;">
      <p style="margin: 0;">
        This is a staff-only automated assessment. Do not forward to the lead.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
ELIGIBILITY ASSESSMENT

Lead: ${data.email}
State: ${data.state}
Assessment: ${data.eligibility.tier}

Financial Metrics:
- DTI: ${(data.eligibility.metrics.dti * 100).toFixed(1)}%
- Monthly Cashflow: $${data.eligibility.metrics.cashflowMonthly.toFixed(2)}
- Annualized Income: $${data.eligibility.metrics.annualizedIncome.toLocaleString()}

Rationale:
${data.eligibility.rationale.map((r, i) => `${i + 1}. ${r}`).join('\n')}

IMPORTANT DISCLAIMER:
${data.eligibility.disclaimers.join(' ')}

---
Received: ${new Date(data.createdAt).toLocaleString('en-US', { timeZone: 'America/Denver' })}

This is a staff-only automated assessment. Do not forward to the lead.
  `.trim();

  return { subject, html, text };
}
