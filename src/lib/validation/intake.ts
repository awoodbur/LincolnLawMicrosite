import { z } from 'zod';

export const intakeSchema = z.object({
  state: z.literal('Utah'),
  county: z.string().optional(),
  householdSize: z.number().min(1).max(8),
  maritalStatus: z.enum(['Single', 'Married', 'Separated']),
  monthlyIncomeRange: z.enum(['<$3k', '$3–5k', '$5–8k', '$8k+']),
  unsecuredDebtRange: z.enum(['<$10k', '$10–25k', '$25–50k', '$50k+']),
  employmentStatus: z.enum(['Employed', 'Self-employed', 'Unemployed', 'Retired']),
  missedPayments: z.boolean(),
  wageGarnishment: z.boolean(),
  propertyConcerns: z.boolean(),
  notes: z.string().optional(),
  // New detailed financial fields for Step 5
  monthlyIncome: z.number().min(0).optional(),
  monthlyExpenses: z.number().min(0).optional(),
  homeEquity: z.union([z.number().min(0), z.literal('NA')]).optional(),
  vehicleEquity: z.number().min(0).optional(),
  hasValuableAssets: z.boolean().optional(),
});

export type IntakeFormData = z.infer<typeof intakeSchema>;

export const emailConsentSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  consentPrivacy: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
  consentTerms: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
  consentData: z.literal(true, { errorMap: () => ({ message: 'Required' }) }),
});

export type EmailConsentData = z.infer<typeof emailConsentSchema>;

export const leadSchema = z.object({
  // Intake step fields
  state: z.literal('Utah'),
  county: z.string().optional(),
  householdSize: z.number().min(1).max(8),
  maritalStatus: z.enum(['Single', 'Married', 'Separated']),
  monthlyIncomeRange: z.enum(['<$3k', '$3–5k', '$5–8k', '$8k+']),
  unsecuredDebtRange: z.enum(['<$10k', '$10–25k', '$25–50k', '$50k+']),
  employmentStatus: z.enum(['Employed', 'Self-employed', 'Unemployed', 'Retired']),
  missedPayments: z.boolean(),
  wageGarnishment: z.boolean(),
  propertyConcerns: z.boolean(),
  notes: z.string().optional(),

  // Email + consent fields
  email: z.string().email(),
  consentPrivacy: z.literal(true),
  consentTerms: z.literal(true),
  consentData: z.literal(true),

  // Metadata (auto-added server-side)
  source: z.string().default('lincolnlaw-utah-intake'),
  createdAt: z.date().optional(),
});

export type LeadData = z.infer<typeof leadSchema>;

export const eligibilityEvaluationSchema = z.object({
  householdSize: z.number().min(1).max(20),
  monthlyIncome: z.number().min(0),
  monthlyExpenses: z.number().min(0),
  homeEquity: z.union([z.number().min(0), z.literal('NA')]),
  vehicleEquity: z.number().min(0),
  hasValuableAssets: z.boolean(),
});

export type EligibilityEvaluationInput = z.infer<typeof eligibilityEvaluationSchema>;
