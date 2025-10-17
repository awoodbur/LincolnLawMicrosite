import { env } from '../../env';

export interface UserConfirmationData {
  email: string;
}

export function generateUserConfirmationEmail(data: UserConfirmationData): {
  subject: string;
  html: string;
  text: string;
} {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  const subject = 'Thank You for Your Interest in Lincoln Law';

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
    <div style="text-align: center; margin-bottom: 32px; border-bottom: 2px solid #3B82F6; padding-bottom: 16px;">
      <h1 style="color: #1F2937; font-family: 'Merriweather', Georgia, serif; margin: 0; font-size: 24px;">Lincoln Law</h1>
      <p style="color: #6B7280; margin: 8px 0 0 0; font-size: 14px;">Justice • Fairness • Honesty</p>
    </div>

    <!-- Main Content -->
    <div style="margin-bottom: 32px;">
      <h2 style="color: #1F2937; font-size: 20px; margin-bottom: 16px;">Thank You for Reaching Out</h2>

      <p style="margin-bottom: 16px;">
        We have received your information and greatly appreciate your interest in learning more about your bankruptcy options in Utah.
      </p>

      <p style="margin-bottom: 16px;">
        Our team will review your information and reach out to you shortly to discuss your specific situation and how we can help you achieve a fresh financial start.
      </p>

      <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px; margin: 24px 0;">
        <h3 style="color: #1E40AF; margin: 0 0 8px 0; font-size: 16px;">What Happens Next?</h3>
        <ol style="margin: 0; padding-left: 20px; color: #374151;">
          <li style="margin-bottom: 8px;">Our team reviews your information</li>
          <li style="margin-bottom: 8px;">We'll contact you to schedule a consultation</li>
          <li>We discuss your options and create a personalized plan</li>
        </ol>
      </div>

      <p style="margin-bottom: 16px;">
        If you have any immediate questions, feel free to contact us directly.
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #E5E7EB; padding-top: 24px; text-align: center; color: #6B7280; font-size: 14px;">
      <p style="margin: 0 0 8px 0;">
        <strong>Lincoln Law</strong><br>
        Serving Utah
      </p>
      <p style="margin: 0 0 16px 0;">
        <a href="${siteUrl}" style="color: #3B82F6; text-decoration: none;">Visit Our Website</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
        This email was sent to ${data.email} because you requested information from Lincoln Law.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Lincoln Law - Thank You for Your Interest

Dear Friend,

Thank you for reaching out to Lincoln Law. We have received your information and greatly appreciate your interest in learning more about your bankruptcy options in Utah.

Our team will review your information and reach out to you shortly to discuss your specific situation and how we can help you achieve a fresh financial start.

What Happens Next?
1. Our team reviews your information
2. We'll contact you to schedule a consultation
3. We discuss your options and create a personalized plan

If you have any immediate questions, feel free to contact us directly.

Best regards,
Lincoln Law Team
Serving Utah

This email was sent to ${data.email} because you requested information from Lincoln Law.
  `.trim();

  return { subject, html, text };
}
