# Intake Flow Setup Guide

The complete intake funnel has been created! Here's how to get it running.

## What Was Built

✅ **Multi-step questionnaire wizard** (`/intake`)
  - Step 1: Utah validation (state + county)
  - Step 2: Household info (size + marital status)
  - Step 3: Financial snapshot (income, debt, employment)
  - Step 4: Situation (missed payments, garnishment, property concerns, notes)
  - Progress bar with step indicator
  - Auto-save to localStorage
  - Full validation with Zod

✅ **Email & consent page** (`/intake/email`)
  - Email capture
  - 3 required consent checkboxes (privacy, terms, data)
  - Links to legal pages
  - Combines intake data + email/consents
  - POSTs to `/api/leads/create`

✅ **Plaid Link page** (`/intake/link`) - Optional
  - Plaid Sandbox integration
  - Clear "test data only" messaging
  - Skip button to go directly to success

✅ **Success page** (`/intake/success`)
  - Confirmation message
  - "What happens next" steps
  - No eligibility shown (compliance)

✅ **Updated Prisma schema**
  - New Lead model with all questionnaire fields
  - PlaidSummary, EligibilityResult (for future use)
  - ConsentLog, AuditLog

✅ **Updated API route** (`/api/leads/create`)
  - Validates with leadSchema
  - Creates Lead, ConsentLog, AuditLog
  - Sends user confirmation email
  - Sends staff notification email to aarondswoodbury@gmail.com
  - Professional HTML email templates

## Setup Steps

### 1. Reset Database

Since the schema changed significantly, you need to reset your database:

```bash
# Remove old database
rm prisma/dev.db

# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name intake_flow

# Seed test data
npm run prisma:seed
```

### 2. Configure Environment

Make sure your `.env` file has all required variables:

```env
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# Mailgun (required for emails)
MAILGUN_API_KEY=your_key
MAILGUN_DOMAIN=your_domain.com
MAILGUN_FROM="Lincoln Law <no-reply@yourdomain.com>"
STAFF_LEADS_EMAIL=aarondswoodbury@gmail.com

# Plaid (for optional bank link step)
PLAID_CLIENT_ID=your_sandbox_id
PLAID_SECRET=your_sandbox_secret
PLAID_ENV=sandbox
PLAID_PRODUCTS=transactions,identity
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and click "Check Your Options" to test the funnel.

## Testing the Flow

### Complete Flow Test

1. Go to http://localhost:3000
2. Click "Check Your Options"
3. Complete all 4 steps of the questionnaire
4. Click "Continue to Email"
5. Enter your email and check all 3 consent boxes
6. Click "Submit & Continue"
7. You should see the success page

### What Happens

When you submit:

1. **Database**: Lead is created with all your data
2. **ConsentLog**: Records your consent with IP/user agent
3. **AuditLog**: Records "lead_created" event
4. **User Email**: Confirmation email sent to your email
5. **Staff Email**: Detailed lead notification sent to `aarondswoodbury@gmail.com`

### Email Preview

**User receives**:
- Welcome message
- "What happens next" steps
- Contact info

**Staff receives**:
- All questionnaire data
- Contact information
- Financial snapshot
- Situation indicators
- Lead ID and source

## Features Implemented

### Form Validation

All fields are validated with Zod:
- State must be "Utah"
- Email must be valid
- Household size: 1-8
- All enum fields have specific allowed values
- Consent checkboxes must be true

### Auto-Save

Questionnaire data is automatically saved to localStorage as you type. If you refresh the page, your progress is preserved.

### Progress Indicator

Shows "Step X of 4" and a progress bar that fills as you advance.

### Responsive Design

Mobile-friendly with Tailwind CSS and shadcn/ui components.

### Security

- Rate limiting on API endpoint (5 requests per minute)
- PII redaction in logs
- Consent tracking with IP and user agent
- Secure email transmission

## Optional: Plaid Integration

The Plaid link page is created but currently the flow goes directly from email → success.

To enable the Plaid step:

1. Update `src/app/intake/email/page.tsx` line 53:
   ```typescript
   // Change this line:
   router.push('/intake/success');

   // To this:
   router.push('/intake/link');
   ```

2. Make sure you have Plaid credentials in `.env`

3. The Plaid page will show with a "Skip" button if users don't want to connect

## Troubleshooting

### "Intake data not found" error

Clear localStorage and start from the beginning:
```javascript
// In browser console:
localStorage.clear();
```

### Email not sending

Check:
- Mailgun API key is correct
- Domain is verified in Mailgun
- Check Mailgun logs in dashboard

### Database errors

Reset the database:
```bash
rm prisma/dev.db
npx prisma migrate dev --name reset
```

### Form validation errors

Check browser console for detailed Zod error messages.

## Next Steps

- Add legal pages (`/legal/privacy`, `/legal/terms`, `/legal/consent`)
- Customize email templates
- Add analytics tracking
- Test on mobile devices
- Deploy to production

## File Locations

- **Questionnaire**: `src/app/intake/page.tsx`
- **Email page**: `src/app/intake/email/page.tsx`
- **Plaid page**: `src/app/intake/link/page.tsx`
- **Success page**: `src/app/intake/success/page.tsx`
- **API route**: `src/app/api/leads/create/route.ts`
- **Validation**: `src/lib/validation/intake.ts`
- **Schema**: `prisma/schema.prisma`

---

**The intake funnel is complete and ready to collect leads!** 🎉
