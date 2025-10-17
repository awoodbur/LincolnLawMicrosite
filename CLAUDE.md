# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lincoln Law Microsite** is a Utah-focused bankruptcy lead-generation application. It's a questionnaire-powered conversion page (not a brochure site) that:

- Guides Utah residents through a financial assessment questionnaire
- Optionally connects to Plaid Sandbox for enhanced financial data
- Evaluates preliminary bankruptcy eligibility (informational only)
- Sends email notifications to staff and users via Mailgun
- Prioritizes privacy, compliance, and explicit user consent

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript, Node 20+
- **UI**: Tailwind CSS + shadcn/ui components + Lucide icons
- **Forms**: React Hook Form + Zod validation
- **Database**: Prisma ORM + SQLite (dev) / Postgres (production)
- **Email**: Mailgun via REST API (mailgun.js)
- **Financial**: Plaid API (Sandbox mode for PoC)
- **Hosting**: AWS Amplify with SSR
- **Testing**: Jest (unit) + Playwright (E2E)

## Architecture

### Core Principles

1. **Conversion-First**: Every element pushes toward the questionnaire CTA
2. **Privacy-First**: Minimum-necessary data, explicit consent, server-side token storage only
3. **Utah-Only**: PoC scope limited to Utah residents
4. **Informational Only**: All eligibility output explicitly labeled as preliminary

### Key Flows

**Lead Generation Flow**:
1. Home page → "Check Your Options" CTA
2. Questionnaire (Utah validation, household size, income/debt ranges, financial situation)
3. Email + consent gate (links to /legal/* pages)
4. Optional Plaid Link (Sandbox) for refined assessment
5. Success page (thank you + next steps)

**Data Flow**:
- User submits questionnaire → API creates Lead + ConsentLog
- If Plaid connected → exchange token, store access_token server-side only
- Eligibility computed → FinancialSnapshot created
- Emails sent: User confirmation (generic), Staff notification (with data), Staff eligibility summary (if flag enabled)

### Critical Files & Their Purpose

**Database (`prisma/schema.prisma`)**:
- `Lead`: Core lead data (email, state, household, etc.)
- `ConsentLog`: GDPR-style consent tracking
- `FinancialSnapshot`: Summary metrics from evaluation (never raw transactions)
- `AuditLog`: Event tracking for compliance

**Libraries (`src/lib/`)**:
- `env.ts`: Zod-validated environment variables
- `logger.ts`: PII-redacting logger (never logs tokens/sensitive data)
- `db.ts`: Prisma client singleton
- `rateLimit.ts`: In-memory rate limiter (upgrade to Redis for production)
- `email/`: Mailgun provider + 3 email templates (user confirmation, staff lead, staff eligibility)
- `plaid/`: Plaid client + summary-only data extraction
- `eligibility/`: Evaluation engine + Utah means-test thresholds (placeholder values, must be updated)

**API Routes (`src/app/api/`)**:
- `leads/create`: Create lead + send emails
- `plaid/create_link_token`: Generate Plaid Link token
- `plaid/exchange_public_token`: Exchange public token → access token (stored server-side)
- `eligibility/compute`: Evaluate eligibility from questionnaire or Plaid data

**Pages (`src/app/`)**:
- `page.tsx`: Home page with hero, trust signals, CTA
- `intake/`: Questionnaire wizard pages (questionnaire, email gate, Plaid link, success)
- `legal/`: Privacy policy, terms of service, consent disclosures
- `bankruptcy/utah/`: Utah-specific FAQ page with JSON-LD

**Security**:
- `middleware.ts`: CSP, HSTS, frame-ancestors, referrer policy
- `next.config.mjs`: Additional security headers
- Rate limiting on all API routes
- Never log or expose Plaid tokens/PII

## Development Commands

```bash
# Install dependencies
npm install

# Database setup
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed

# Development
npm run dev                  # Start dev server (localhost:3000)
npm run build                # Build for production
npm start                    # Start production server

# Database management
npm run prisma:studio        # Open Prisma Studio GUI
npx prisma migrate dev       # Create new migration

# Testing
npm test                     # Jest unit tests
npm run test:e2e             # Playwright E2E tests

# Linting
npm run lint
```

## Common Development Tasks

### Adding a New Email Template

1. Create template in `src/lib/email/templates/your_template.tsx`
2. Export interface for template data and generator function
3. Use in API route via `mailgunProvider.send()`

### Modifying Eligibility Rules

1. Update thresholds in `src/lib/eligibility/utah_thresholds.ts`
2. Adjust scoring logic in `src/lib/eligibility/rules.ts`
3. Add unit tests in `tests/unit/eligibility.engine.test.ts`

### Adding a New State

1. Add state-specific thresholds file (e.g., `nevada_thresholds.ts`)
2. Update `evaluateEligibility` to handle new state
3. Update Zod schemas to accept new state code
4. Add state-specific FAQ page

### Modifying Database Schema

```bash
# Make changes to prisma/schema.prisma
npx prisma migrate dev --name descriptive_name
npx prisma generate
```

## Important Constraints & TODOs

### Placeholder Data (MUST FIX)

- **Utah Means Test Thresholds** (`src/lib/eligibility/utah_thresholds.ts`): Currently placeholder values. MUST be replaced with official data from uscourts.gov. Add automated update cadence (quarterly).

### Environment Variables

Required for operation:
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_FROM`, `STAFF_LEADS_EMAIL`
- `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV=sandbox`
- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`

Feature flags:
- `NEXT_PUBLIC_SHOW_ELIGIBILITY=false`: Controls whether eligibility results are shown to users (currently staff-only for compliance)

### Security & Compliance

1. **Never log or expose**:
   - Plaid access tokens
   - Full SSN, credit card numbers
   - Raw transaction data

2. **Always label eligibility output**:
   - "Preliminary, informational only"
   - "Not legal advice"
   - "Requires attorney consultation"

3. **Consent requirements**:
   - Link to /legal/privacy, /legal/terms, /legal/consent
   - Log consent with version, timestamp, IP
   - Minimum-necessary data collection

### Production Deployment (AWS Amplify)

1. Push to GitHub
2. Connect repo in Amplify Console
3. Set environment variables in Amplify (see .env.example)
4. Amplify will use `amplify.yml` for build config
5. **Critical**: Swap DATABASE_URL to Postgres before production

### Testing Strategy

**Unit Tests** (`tests/unit/`):
- Eligibility engine with various scenarios
- Threshold calculations
- DTI/cashflow logic

**E2E Tests** (`tests/e2e/`):
- Complete intake funnel (home → questionnaire → email → success)
- Optional Plaid link flow
- Form validation

## Brand Guidelines

**Theme**: Professional, modern, legal industry trust signals
**Colors**:
- Primary: Blue (#3B82F6)
- Accent: Amber (#F59E0B) for CTAs
- Neutrals: Gray scale

**Typography**:
- Headings: Merriweather (serif)
- Body: Inter (sans-serif)

**Tone**: Justice • Fairness • Honesty (Lincoln-inspired)

## Known Limitations

1. **SQLite**: Dev only. Swap to Postgres for production.
2. **In-Memory Rate Limiter**: Use Redis for multi-instance deployments.
3. **Utah Only**: Expand to other states requires state-specific threshold data.
4. **Plaid Sandbox**: Uses synthetic data. Upgrade to production for real accounts.
5. **Email**: Mailgun only. Could abstract to support SendGrid, SES, etc.

## Resources

- Utah Means Test: https://www.uscourts.gov/services-forms/bankruptcy/bankruptcy-basics/means-test
- Plaid Docs: https://plaid.com/docs/
- Mailgun API: https://documentation.mailgun.com/
- Prisma Docs: https://www.prisma.io/docs/
- Next.js App Router: https://nextjs.org/docs/app

## Contact & Support

For questions about architecture or implementation details, refer to:
- README.md for setup instructions
- This file (CLAUDE.md) for architecture guidance
- Code comments for specific implementation notes
