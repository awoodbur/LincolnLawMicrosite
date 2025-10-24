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
<body style="font-family: 'Lora', Georgia, serif; line-height: 1.6; color: #4A3C2B; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F1E8;">
  <div style="background-color: #FDFBF7; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(101, 67, 33, 0.1); border: 2px solid #C8A882;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px; border-bottom: 3px solid #8B6F47; padding-bottom: 16px;">
      <h1 style="color: #4A3C2B; font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 28px;">Lincoln Law</h1>
      <p style="color: #C9A865; margin: 8px 0 0 0; font-size: 14px; font-weight: 600;">Justice • Fairness • Honesty</p>
    </div>

    <!-- Main Content -->
    <div style="margin-bottom: 32px;">
      <h2 style="color: #4A3C2B; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin-bottom: 16px;">Thank You for Reaching Out</h2>

      <p style="margin-bottom: 16px; color: #5C4A37;">
        We have received your information and greatly appreciate your interest in learning more about your bankruptcy options in Utah.
      </p>

      <p style="margin-bottom: 16px; color: #5C4A37;">
        Our team will review your information and reach out to you shortly to discuss your specific situation and how we can help you achieve a fresh financial start.
      </p>

      <div style="background-color: #F5EFE1; border-left: 4px solid #6B8E4E; padding: 16px; margin: 24px 0; border-radius: 4px;">
        <h3 style="color: #3F5D37; margin: 0 0 12px 0; font-size: 16px; font-family: 'Playfair Display', Georgia, serif;">What Happens Next?</h3>
        <ol style="margin: 0; padding-left: 20px; color: #5C4A37;">
          <li style="margin-bottom: 8px;">Our team reviews your information</li>
          <li style="margin-bottom: 8px;">We'll contact you to schedule a consultation</li>
          <li>We discuss your options and create a personalized plan</li>
        </ol>
      </div>

      <p style="margin-bottom: 16px; color: #5C4A37;">
        If you have any immediate questions, feel free to contact us directly.
      </p>

      <!-- Call to Action -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="tel:+13854388161" style="display: inline-block; background-color: #C9A865; color: #4A3C2B; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(101, 67, 33, 0.2);">
          📞 Call Us: (385) 438-8161
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top: 2px solid #C8A882; padding-top: 24px; text-align: center; color: #6B5A47; font-size: 14px;">
      <p style="margin: 0 0 12px 0;">
        <strong style="color: #4A3C2B;">Lincoln Law</strong><br>
        Phone: (385) 438-8161<br>
        Email: help@lincolnlaw.com<br>
        921 West Center St., Orem, UT 84057
      </p>
      <p style="margin: 0 0 16px 0;">
        <a href="https://lincolnlaw.com" style="color: #8B6F47; text-decoration: none; font-weight: 600;">Visit Our Website</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #9B8A75;">
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

If you have any immediate questions, feel free to contact us directly at (385) 438-8161.

Best regards,
Lincoln Law Team
Phone: (385) 438-8161
Serving Utah

This email was sent to ${data.email} because you requested information from Lincoln Law.
  `.trim();

  return { subject, html, text };
}
