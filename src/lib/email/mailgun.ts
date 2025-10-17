import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { env } from '../env';
import { logger } from '../logger';
import type { EmailParams, EmailProvider, EmailResult } from './index';

class MailgunProvider implements EmailProvider {
  private client: ReturnType<Mailgun['client']>;
  private domain: string;
  private defaultFrom: string;

  constructor() {
    const mailgun = new Mailgun(formData);
    this.client = mailgun.client({
      username: 'api',
      key: env.MAILGUN_API_KEY,
    });
    this.domain = env.MAILGUN_DOMAIN;
    this.defaultFrom = env.MAILGUN_FROM;
  }

  async send(params: EmailParams): Promise<EmailResult> {
    try {
      const messageData = {
        from: params.from || this.defaultFrom,
        to: Array.isArray(params.to) ? params.to.join(', ') : params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
        ...(params.replyTo && { 'h:Reply-To': params.replyTo }),
      };

      logger.info('Sending email', {
        to: messageData.to,
        subject: params.subject,
        from: messageData.from,
      });

      const response = await this.client.messages.create(this.domain, messageData);

      logger.info('Email sent successfully', {
        messageId: response.id,
        to: messageData.to,
      });

      return {
        success: true,
        messageId: response.id,
      };
    } catch (error) {
      logger.error('Failed to send email', {
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
