import { env } from '../../env';

export interface StaffNewLeadData {
  email: string;
  state: string;
  county?: string;
  householdSize: number;
  monthlyIncome?: string;
  unsecuredDebt?: string;
  missedPayments?: boolean;
  wageGarnishment?: boolean;
  propertyConcerns?: boolean;
  createdAt: Date;
}

export function generateStaffNewLeadEmail(data: StaffNewLeadData): {
  subject: string;
  html: string;
  text: string;
} {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  const subject = `New Bankruptcy Lead: ${data.email} (${data.state})`;

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
      <h1 style="margin: 0; font-size: 20px;">New Lead Received</h1>
      <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">
        ${new Date(data.createdAt).toLocaleString('en-US', {
          timeZone: 'America/Denver',
          dateStyle: 'full',
          timeStyle: 'short',
        })}
      </p>
    </div>

    <!-- Lead Information -->
    <div style="margin-bottom: 24px;">
      <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 16px; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px;">
        Contact Information
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6B7280; width: 40%;">Email:</td>
          <td style="padding: 8px 0; color: #1F2937;">
            <a href="mailto:${data.email}" style="color: #3B82F6; text-decoration: none;">${data.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6B7280;">State:</td>
          <td style="padding: 8px 0; color: #1F2937;">${data.state}</td>
        </tr>
        ${
          data.county
            ? `
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6B7280;">County:</td>
          <td style="padding: 8px 0; color: #1F2937;">${data.county}</td>
        </tr>
        `
            : ''
        }
      </table>
    </div>

    <!-- Financial Information -->
    <div style="margin-bottom: 24px;">
      <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 16px; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px;">
        Financial Snapshot
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6B7280; width: 40%;">Household Size:</td>
          <td style="padding: 8px 0; color: #1F2937;">${data.householdSize}</td>
        </tr>
        ${
          data.monthlyIncome
            ? `
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6B7280;">Monthly Income:</td>
          <td style="padding: 8px 0; color: #1F2937;">$${data.monthlyIncome}</td>
        </tr>
        `
            : ''
        }
        ${
          data.unsecuredDebt
            ? `
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6B7280;">Unsecured Debt:</td>
          <td style="padding: 8px 0; color: #1F2937;">$${data.unsecuredDebt}</td>
        </tr>
        `
            : ''
        }
      </table>
    </div>

    <!-- Situation Indicators -->
    <div style="margin-bottom: 24px;">
      <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 16px; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px;">
        Situation Indicators
      </h2>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${
          data.missedPayments
            ? '<span style="background-color: #FEF3C7; color: #92400E; padding: 6px 12px; border-radius: 4px; font-size: 14px; display: inline-block;">Missed Payments</span>'
            : ''
        }
        ${
          data.wageGarnishment
            ? '<span style="background-color: #FEE2E2; color: #991B1B; padding: 6px 12px; border-radius: 4px; font-size: 14px; display: inline-block;">Wage Garnishment</span>'
            : ''
        }
        ${
          data.propertyConcerns
            ? '<span style="background-color: #DBEAFE; color: #1E40AF; padding: 6px 12px; border-radius: 4px; font-size: 14px; display: inline-block;">Property Concerns</span>'
            : ''
        }
      </div>
    </div>

    <!-- Action Required -->
    <div style="background-color: #F0FDF4; border-left: 4px solid: #10B981; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <h3 style="color: #065F46; margin: 0 0 8px 0; font-size: 16px;">Action Required</h3>
      <p style="margin: 0; color: #065F46;">
        Please review this lead and reach out to schedule a consultation.
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #E5E7EB; padding-top: 16px; text-align: center; color: #6B7280; font-size: 12px;">
      <p style="margin: 0;">
        This is an automated notification from the Lincoln Law lead generation system.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
NEW BANKRUPTCY LEAD

Contact Information:
- Email: ${data.email}
- State: ${data.state}
${data.county ? `- County: ${data.county}` : ''}

Financial Snapshot:
- Household Size: ${data.householdSize}
${data.monthlyIncome ? `- Monthly Income: $${data.monthlyIncome}` : ''}
${data.unsecuredDebt ? `- Unsecured Debt: $${data.unsecuredDebt}` : ''}

Situation Indicators:
${data.missedPayments ? '- Missed Payments: Yes' : ''}
${data.wageGarnishment ? '- Wage Garnishment: Yes' : ''}
${data.propertyConcerns ? '- Property Concerns: Yes' : ''}

Received: ${new Date(data.createdAt).toLocaleString('en-US', { timeZone: 'America/Denver' })}

Action Required: Please review this lead and reach out to schedule a consultation.

---
This is an automated notification from the Lincoln Law lead generation system.
  `.trim();

  return { subject, html, text };
}
