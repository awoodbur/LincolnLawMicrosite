import { z } from 'zod';

export const intakeSchema = z.object({
  state: z.literal('Utah'),
  county: z.string().optional(),
  householdSize: z.number().min(1).max(8),
  maritalStatus: z.enum(['Single', 'Married', 'Separated']),
  monthlyIncomeRange: z.enum(['<$3k', '$3–5k', '$5–8k', '$8k+']),
  unsecuredDebtRange: z.enum(['<$10k', '$10–25k', '$25–50k', '$50k+']),
  employmentStatus: z.enum(['Employed', 'Self-employed', 'Unemployed', 'Retired']),
  priorBankruptcy: z.boolean().optional().refine(val => val !== undefined, {
    message: 'This question is required'
  }),
  missedPayments: z.boolean(),
  wageGarnishment: z.boolean(),
  propertyConcerns: z.boolean(),
  notes: z.string().optional(),
  // New detailed financial fields for Step 3
  incomeAboveThreshold: z.boolean().optional().refine(val => val !== undefined, {
    message: 'This question is required'
  }),
  monthlyExpenses: z.number().optional().refine(val => val !== undefined, {
    message: 'This question is required'
  }).refine(val => val !== undefined && val >= 0, {
    message: 'Monthly expenses must be positive'
  }),
  unsecuredDebt: z.enum(['<$10k', '$10-25k', '$25-50k', '$50k+']).optional().refine(val => val !== undefined, {
    message: 'This question is required'
  }),
  homeEquity: z.union([z.number().min(0), z.literal('NA')]).optional().refine(val => val !== undefined, {
    message: 'This question is required'
  }),
  vehicleEquity: z.number().optional().refine(val => val !== undefined, {
    message: 'This question is required'
  }).refine(val => val === undefined || val >= 0, {
    message: 'Vehicle equity cannot be negative'
  }),
  hasValuableAssets: z.boolean().optional().refine(val => val !== undefined, {
    message: 'This question is required'
  }),
});

export type IntakeFormData = z.infer<typeof intakeSchema>;

export const emailConsentSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true; // Allow empty
        // US phone number validation: allow (555) 123-4567, 555-123-4567, 5551234567, etc.
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(val.replace(/\s/g, ''));
      },
      { message: 'Please enter a valid US phone number' }
    ),
  consentAll: z.literal(true, { message: 'You must agree to the Privacy Policy, Terms of Service, and Consent Disclosure to continue' }),
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
  phone: z.string().optional(),
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
  incomeAboveThreshold: z.boolean(),
  monthlyExpenses: z.number().min(0),
  unsecuredDebt: z.enum(['<$10k', '$10-25k', '$25-50k', '$50k+']).optional(),
  homeEquity: z.union([z.number().min(0), z.literal('NA')]),
  vehicleEquity: z.number().min(0),
  hasValuableAssets: z.boolean(),
});

export type EligibilityEvaluationInput = z.infer<typeof eligibilityEvaluationSchema>;
