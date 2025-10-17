# Next Steps: Completing the Lincoln Law Microsite

This document outlines the remaining files that need to be created to have a fully functional application. The foundation has been built - you now need to add the remaining pages and components.

## What's Already Complete ✅

- ✅ Project configuration (package.json, tsconfig, Next.js config, Tailwind)
- ✅ Database schema (Prisma with Lead, ConsentLog, FinancialSnapshot, AuditLog)
- ✅ Core libraries (env, logger, db, rate limiting, analytics, theme)
- ✅ Email system (Mailgun adapter + 3 email templates)
- ✅ Eligibility engine (with Utah thresholds)
- ✅ Plaid integration (client library)
- ✅ shadcn/ui components (Button, Input, Label, Checkbox, Radio, Select)
- ✅ API routes (leads/create, plaid/create_link_token, plaid/exchange_public_token, eligibility/compute)
- ✅ Home page (with hero, trust signals, CTA)
- ✅ Security middleware (CSP, HSTS, rate limiting)
- ✅ SEO utilities
- ✅ README with setup instructions
- ✅ CLAUDE.md with architecture details
- ✅ AWS Amplify configuration

## What Remains To Build 🚧

### 1. Intake Funnel Pages (Priority: HIGH)

Create these pages in `src/app/intake/`:

#### `src/app/intake/page.tsx`
Multi-step questionnaire wizard:
- Step 1: Utah validation (state selector, county optional)
- Step 2: Household info (household size)
- Step 3: Financial snapshot (monthly income range, unsecured debt range)
- Step 4: Situation (missed payments?, wage garnishment?, property concerns?)
- Use React Hook Form + Zod validation
- Progress indicator
- "Continue" → `/intake/email`

#### `src/app/intake/email/page.tsx`
Email + consent gate:
- Email input (validated)
- Consent checkboxes (privacy policy, terms, data collection)
- Links to /legal/privacy, /legal/terms, /legal/consent
- "Submit" → calls `/api/leads/create` → `/intake/link` or `/intake/success`

#### `src/app/intake/link/page.tsx` (Optional Plaid flow)
Plaid Link integration:
- Import `usePlaidLink` from `react-plaid-link`
- Call `/api/plaid/create_link_token`
- Show Plaid Link button with clear messaging: "Optional: Connect your bank to refine your assessment (Sandbox/test data only)"
- On success → call `/api/plaid/exchange_public_token`
- Then → `/intake/success`

#### `src/app/intake/success/page.tsx`
Thank you page:
- Success message
- "What happens next" steps
- NO eligibility results shown to user (compliance)
- Staff receive emails with data

### 2. Legal Pages (Priority: HIGH)

#### `src/app/legal/privacy/page.tsx`
Privacy Policy:
- Data collection practices
- How data is used
- Plaid integration disclosure
- Email communications
- Data retention
- User rights

#### `src/app/legal/terms/page.tsx`
Terms of Service:
- Not legal advice disclaimer
- Service description
- Limitations of liability
- Utah jurisdiction

#### `src/app/legal/consent/page.tsx`
Consent Disclosure:
- Explicit consent language
- Minimum-necessary data collection
- Plaid Sandbox disclosure (test data only)
- Right to withdraw consent
- Contact information

### 3. Utah Bankruptcy FAQ (Priority: MEDIUM)

#### `src/app/bankruptcy/utah/page.tsx`
FAQ page with:
- Chapter 7 vs Chapter 13 explanation
- Utah means test overview
- Automatic stay benefits
- Exemptions in Utah
- Timeline expectations
- JSON-LD for FAQ structured data (use `generateFaqJsonLd` from `src/lib/seo.tsx`)

### 4. SEO & Metadata (Priority: MEDIUM)

#### `src/app/sitemap.ts`
Dynamic sitemap generation:
```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/intake`, lastModified: new Date() },
    { url: `${baseUrl}/bankruptcy/utah`, lastModified: new Date() },
    { url: `${baseUrl}/legal/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/legal/terms`, lastModified: new Date() },
    { url: `${baseUrl}/legal/consent`, lastModified: new Date() },
  ];
}
```

#### `src/app/robots.ts`
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/intake/success'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### 5. Custom UI Components (Priority: MEDIUM)

Create these in `src/components/`:

#### `QuestionnaireWizard.tsx`
- Multi-step form component
- Progress indicator
- Validation
- State management

#### `ConsentCard.tsx`
- Checkbox group for consents
- Links to legal pages
- Version tracking

#### `PlaidLinkButton.tsx`
- Wrapper around `usePlaidLink` from `react-plaid-link`
- Loading states
- Error handling

#### `TrustBar.tsx` (Optional)
- Trust badges/indicators
- Social proof elements

#### `Faq.tsx` (Optional)
- Accordion component for FAQ items
- Reusable across pages

### 6. Tests (Priority: LOW but RECOMMENDED)

#### `tests/unit/eligibility.engine.test.ts`
```typescript
import { evaluateEligibility } from '@/lib/eligibility/engine';

describe('Eligibility Engine', () => {
  it('should return Likely for favorable DTI and negative cashflow', () => {
    const result = evaluateEligibility({
      state: 'UT',
      householdSize: 2,
      monthlyIncomeEstimate: 4000,
      monthlyDebtPaymentsEstimate: 1200,
      cashflowMonthly: -500,
    });

    expect(result.tier).toBe('Likely');
  });

  // Add more test cases...
});
```

#### `tests/e2e/intake.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test('complete intake funnel', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Check Your Options');

  // Fill questionnaire
  await page.selectOption('select[name="state"]', 'UT');
  await page.fill('input[name="householdSize"]', '2');
  // ... more steps

  await page.click('text=Submit');
  await expect(page).toHaveURL('/intake/success');
});
```

### 7. Public Assets (Priority: LOW)

Add to `public/`:
- `favicon.ico`
- `og-image.png` (1200x630 for social sharing)
- Optional: Lincoln silhouette SVG for branding

## Quick Start Guide

### Step 1: Set Up Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### Step 2: Install & Setup Database
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

### Step 3: Build Missing Pages

Start with the intake funnel (highest priority):

1. Create `src/app/intake/page.tsx` (questionnaire)
2. Create `src/app/intake/email/page.tsx` (email + consent gate)
3. Create `src/app/intake/success/page.tsx` (thank you page)
4. Optionally create `src/app/intake/link/page.tsx` (Plaid Link)

### Step 4: Add Legal Pages

Create the three legal pages in `src/app/legal/`.

### Step 5: Test Locally
```bash
npm run dev
# Visit http://localhost:3000
# Test the complete funnel
```

### Step 6: Build & Deploy
```bash
npm run build
# Push to GitHub
# Deploy via AWS Amplify
```

## Development Tips

### Forms with React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  householdSize: z.number().min(1),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### API Calls from Client
```typescript
const response = await fetch('/api/leads/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

if (!response.ok) {
  // Handle error
}

const result = await response.json();
```

### Plaid Link Usage
```typescript
import { usePlaidLink } from 'react-plaid-link';

const { open, ready } = usePlaidLink({
  token: linkToken,
  onSuccess: (public_token) => {
    // Exchange token via /api/plaid/exchange_public_token
  },
});
```

## Key Files Reference

- **Schemas & Validation**: Define Zod schemas inline or in separate files
- **API Routes**: All in `src/app/api/` - already created
- **Components**: Use shadcn/ui components from `src/components/ui/`
- **Styling**: Tailwind classes, custom CSS in `src/styles/globals.css`
- **Types**: TypeScript interfaces defined near usage or in `/types` directory

## Troubleshooting

### "Module not found" errors
```bash
npm install
npx prisma generate
```

### Database errors
```bash
rm prisma/dev.db
npx prisma migrate dev --name init
```

### Plaid errors
- Ensure `PLAID_ENV=sandbox`
- Use test credentials from Plaid Dashboard

### Email not sending
- Check Mailgun dashboard logs
- Verify API key and domain

## Final Checklist Before Production

- [ ] Replace Utah threshold placeholder values with official data
- [ ] Swap SQLite → Postgres
- [ ] Move secrets to AWS Secrets Manager
- [ ] Set up automated backups
- [ ] Enable error monitoring (Sentry/DataDog)
- [ ] Add comprehensive E2E tests
- [ ] Configure custom domain in Amplify
- [ ] Enable DKIM/SPF for email domain
- [ ] Test complete funnel end-to-end
- [ ] Review all disclaimers and legal pages with attorney
- [ ] Set up monitoring/alerting

## Questions or Issues?

- Check CLAUDE.md for architecture details
- Check README.md for setup instructions
- Review existing code for patterns
- Test with `npm run dev` frequently

---

**Good luck! The foundation is solid - now build out the user-facing pages and you'll have a complete, production-ready lead-gen application.**
