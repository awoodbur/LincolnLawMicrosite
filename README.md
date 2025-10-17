# Lincoln Law Microsite

A Utah-focused bankruptcy lead-generation microsite with questionnaire-powered conversion and optional Plaid integration for financial assessment.

## Features

- **Questionnaire Funnel**: Multi-step intake form for Utah residents
- **Eligibility Assessment**: Preliminary bankruptcy eligibility evaluation
- **Plaid Integration**: Optional financial data connection (Sandbox mode)
- **Email Notifications**: Mailgun-powered notifications for staff and users
- **Privacy-First**: Minimum-necessary data collection with explicit consent
- **SEO Optimized**: Utah-specific content with JSON-LD structured data
- **Security**: Rate limiting, CSP headers, PII redaction in logs
- **Responsive UI**: Tailwind CSS + shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui + Lucide Icons
- **Forms**: React Hook Form + Zod validation
- **Database**: Prisma ORM + SQLite (dev) / Postgres (prod)
- **Email**: Mailgun REST API
- **Financial**: Plaid API (Sandbox)
- **Hosting**: AWS Amplify (SSR)
- **Testing**: Jest (unit) + Playwright (E2E)

## Project Structure

```
LincolnLawMicrosite/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data for development
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Home page
│   │   ├── intake/         # Questionnaire funnel
│   │   ├── legal/          # Privacy, terms, consent pages
│   │   ├── bankruptcy/utah # Utah-specific FAQ
│   │   └── api/            # API routes
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   └── [custom]        # Custom components
│   ├── lib/
│   │   ├── env.ts          # Environment validation
│   │   ├── logger.ts       # PII-redacting logger
│   │   ├── db.ts           # Prisma client
│   │   ├── rateLimit.ts    # Rate limiting
│   │   ├── analytics.ts    # Event tracking
│   │   ├── seo.tsx         # SEO utilities
│   │   ├── email/          # Email provider & templates
│   │   ├── plaid/          # Plaid integration
│   │   └── eligibility/    # Eligibility engine
│   ├── middleware.ts       # Security headers
│   └── styles/globals.css
├── tests/
│   ├── unit/
│   └── e2e/
├── amplify.yml             # AWS Amplify build config
├── .env.example            # Environment variables template
└── package.json
```

## Setup

### Prerequisites

- Node.js 20+
- npm or pnpm
- Mailgun account
- Plaid account (Sandbox credentials)

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repo-url>
   cd LincolnLawMicrosite
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```env
   # Site
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SHOW_ELIGIBILITY=false

   # Database (SQLite for dev)
   DATABASE_URL="file:./dev.db"

   # Mailgun
   MAILGUN_API_KEY=your_mailgun_key
   MAILGUN_DOMAIN=your_domain.com
   MAILGUN_FROM="Lincoln Law <no-reply@yourdomain.com>"
   STAFF_LEADS_EMAIL=aarondswoodbury@gmail.com

   # Plaid (Sandbox)
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret
   PLAID_ENV=sandbox
   PLAID_PRODUCTS=transactions,identity
   ```

3. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run unit tests
npm run test:e2e     # Run Playwright E2E tests
npm run prisma:studio # Open Prisma Studio (database GUI)
```

## Deployment to AWS Amplify

### Prerequisites

- AWS Account
- AWS Amplify CLI installed
- GitHub repository connected to Amplify

### Setup Steps

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Amplify App**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Select the branch (e.g., `main`)

3. **Configure Build Settings**:
   Amplify will auto-detect `amplify.yml`. Verify it's correct:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - corepack enable
           - npm ci
       build:
         commands:
           - npx prisma generate
           - npx prisma migrate deploy
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```

4. **Set Environment Variables**:
   In Amplify Console → App Settings → Environment variables, add:
   - `NEXT_PUBLIC_SITE_URL`
   - `DATABASE_URL` (use Postgres connection string for production)
   - `MAILGUN_API_KEY`
   - `MAILGUN_DOMAIN`
   - `MAILGUN_FROM`
   - `STAFF_LEADS_EMAIL`
   - `PLAID_CLIENT_ID`
   - `PLAID_SECRET`
   - `PLAID_ENV` (keep as `sandbox` or upgrade to `production`)
   - `PLAID_PRODUCTS`

5. **Deploy**:
   - Amplify will automatically deploy on push to `main`
   - Monitor build logs in the Amplify Console

### Post-Deployment

- Test the live site thoroughly
- Set up custom domain in Amplify Console
- Enable HTTPS (automatic with Amplify)
- Monitor logs in CloudWatch

## Testing

### Unit Tests

```bash
npm test
```

Tests are in `tests/unit/`. Key test: eligibility engine validation.

### E2E Tests

```bash
npm run test:e2e
```

Playwright tests cover the complete intake funnel:
1. Home → Start Questionnaire
2. Complete questionnaire
3. Email + consent gate
4. Optional Plaid link
5. Success page

## Eligibility Engine

Located in `src/lib/eligibility/`:

- **engine.ts**: Main evaluation logic
- **rules.ts**: Scoring rules and tier determination
- **utah_thresholds.ts**: Utah means-test thresholds (placeholder values)

### Important Notes

- Thresholds are **placeholder values** and must be replaced with official Utah median income data
- Add automated update cadence (quarterly)
- All output labeled as "preliminary, informational only"

## Privacy & Compliance

- **No Scraping**: Plaid access only with explicit prior consent
- **Minimum Necessary**: Only essential data collected
- **Server-Side Only**: Plaid tokens never exposed to client
- **Redacted Logs**: All PII/tokens redacted in logs
- **Clear Disclaimers**: All eligibility output includes legal disclaimers
- **Legal Pages**: `/legal/privacy`, `/legal/terms`, `/legal/consent`

## Productionization Checklist

### Critical

- [ ] Replace SQLite with Postgres
- [ ] Move secrets to AWS Secrets Manager
- [ ] Update Utah means-test thresholds with authoritative data
- [ ] Set up automated threshold update cadence
- [ ] Enable DKIM/SPF for Mailgun domain
- [ ] Add admin dashboard for lead management
- [ ] Implement webhook for real-time lead notifications
- [ ] Add comprehensive error monitoring (Sentry/DataDog)

### Recommended

- [ ] Add cookie consent banner + analytics opt-out
- [ ] Implement A/B testing for headlines/CTAs
- [ ] Add CMS for content management
- [ ] Set up automated backups
- [ ] Add more comprehensive E2E test coverage
- [ ] Implement feature flags
- [ ] Add performance monitoring (Core Web Vitals)
- [ ] Set up staging environment

### Nice-to-Have

- [ ] Add client portal for lead status tracking
- [ ] Implement multi-language support (Spanish)
- [ ] Add live chat integration
- [ ] Create mobile app version
- [ ] Add more states beyond Utah

## Troubleshooting

### Database Issues

```bash
# Reset database
rm prisma/dev.db
npx prisma migrate dev --name init
npm run prisma:seed
```

### Plaid Connection Errors

- Verify `PLAID_ENV=sandbox`
- Check credentials in Plaid Dashboard
- Ensure products match: `transactions,identity`
- Use test credentials from [Plaid Docs](https://plaid.com/docs/sandbox/)

### Email Not Sending

- Verify Mailgun API key and domain
- Check Mailgun logs in dashboard
- Ensure domain is verified in Mailgun
- Test with Mailgun's API testing tools

### Build Failures

```bash
# Clear caches
rm -rf .next node_modules
npm install
npm run build
```

## Support

For issues or questions:
- Check the [CLAUDE.md](./CLAUDE.md) file for architecture details
- Review logs in development console
- Check AWS Amplify build logs for deployment issues

## License

Private - Lincoln Law

---

**Disclaimer**: This is a lead generation tool. All eligibility assessments are preliminary and informational only. Final bankruptcy determination requires consultation with a licensed attorney.
