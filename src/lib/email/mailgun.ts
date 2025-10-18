import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { env } from '../env';
import { logger } from '../logger';
import type { EmailParams, EmailProvider, EmailResult } from './index';

class MailgunProvider implements EmailProvider {
  private client: ReturnType<Mailgun['client']> | null = null;
  private domain: string | null = null;
  private defaultFrom: string | null = null;
  private isConfigured: boolean = false;

  constructor() {
    // Only initialize if all required Mailgun env vars are present
    if (env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN && env.MAILGUN_FROM) {
      const mailgun = new Mailgun(formData);
      this.client = mailgun.client({
        username: 'api',
        key: env.MAILGUN_API_KEY,
      });
      this.domain = env.MAILGUN_DOMAIN;
      this.defaultFrom = env.MAILGUN_FROM;
      this.isConfigured = true;
    } else {
      logger.warn('Mailgun not configured - email functionality will be disabled');
    }
  }

  async send(params: EmailParams): Promise<EmailResult> {
    // Check if Mailgun is configured
    if (!this.isConfigured || !this.client || !this.domain || !this.defaultFrom) {
      logger.warn('Mailgun not configured - skipping email send', {
        to: params.to,
        subject: params.subject,
      });
      return {
        success: false,
        error: 'Mailgun not configured',
      };
    }

    try {
      const messageData = {
        from: params.from || this.defaultFrom,
        to: Array.isArray(params.to) ? params.to.join(', ') : params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
        ...(params.replyTo && { 'h:Reply-To': params.replyTo }),
      };

      logger.info('Sending email via Mailgun', {
        to: messageData.to,
        subject: params.subject,
        from: messageData.from,
      });

      const response = await this.client.messages.create(this.domain, messageData);

      logger.info('Email sent successfully via Mailgun', {
        messageId: response.id,
        to: messageData.to,
      });

      return {
        success: true,
        messageId: response.id,
      };
    } catch (error) {
      logger.error('Failed to send email via Mailgun', {
        error: error instanceof Error ? error.message : 'Unknown error',
        to: params.to,
        subject: params.subject,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const mailgunProvider = new MailgunProvider();
