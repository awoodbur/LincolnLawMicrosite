/**
 * Email provider interface
 */
export interface EmailProvider {
  send(params: EmailParams): Promise<EmailResult>;
}

export interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export * from './mailgun';
export * from './templates/user_confirmation';
export * from './templates/staff_new_lead';
export * from './templates/staff_eligibility_summary';
