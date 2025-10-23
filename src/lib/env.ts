import { z } from 'zod';

const envSchema = z.object({
  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SHOW_ELIGIBILITY: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Database
  DATABASE_URL: z.string(),

  // Mailgun (optional - emails will be skipped if not configured)
  MAILGUN_API_KEY: z.string().optional(),
  MAILGUN_DOMAIN: z.string().optional(),
  MAILGUN_FROM: z.string().optional(), // Can be "Name <email@domain.com>" format
  STAFF_LEADS_EMAIL: z.string().email().optional(),

  // Plaid (optional - only required for bank linking feature)
  PLAID_CLIENT_ID: z.string().optional(),
  PLAID_SECRET: z.string().optional(),
  PLAID_ENV: z.enum(['sandbox', 'development', 'production']).default('sandbox'),
  PLAID_PRODUCTS: z.string().default('transactions,identity'),

  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_SHOW_ELIGIBILITY: process.env.NEXT_PUBLIC_SHOW_ELIGIBILITY,
      NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
      DATABASE_URL: process.env.DATABASE_URL,
      MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
      MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
      MAILGUN_FROM: process.env.MAILGUN_FROM,
      STAFF_LEADS_EMAIL: process.env.STAFF_LEADS_EMAIL,
      PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
      PLAID_SECRET: process.env.PLAID_SECRET,
      PLAID_ENV: process.env.PLAID_ENV,
      PLAID_PRODUCTS: process.env.PLAID_PRODUCTS,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}

export const env = getEnv();
