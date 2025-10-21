Lincoln Law Microsite – Deployment Guide (AWS Amplify)
🚀 Overview

This guide explains how to deploy, host, and manage the Lincoln Law Microsite on AWS Amplify with automatic builds from GitHub, secure environment variables, and domain integration through Route 53.

It also covers how to manage the Prisma (PostgreSQL) database and integrate the collected lead data into your CMS.

1️⃣ Before You Begin
Requirements

GitHub repository connected (e.g., LincolnLawMicrosite)

AWS account with Amplify + Route 53 permissions

Domain registered in GoDaddy

Environment variables ready (Plaid, Mailgun, etc.)

Files to Verify

amplify.yml present in root

.env.example complete

.gitignore includes .env

App builds locally without errors:

npm install
npm run build

2️⃣ Create Amplify App

Log in to AWS Amplify Console

Click “Host Web App” → GitHub

Authorize GitHub and choose your repo + branch (main)

Confirm auto-detected Next.js build settings (or paste below):

version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*


Click Save and Deploy

3️⃣ Set Environment Variables

In Amplify → App Settings → Environment Variables, add:
(For the production version, these would need to be replaced by the real values, not Aaron's test values)
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox
PLAID_PRODUCTS=transactions,identity,liabilities
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=...
MAILGUN_FROM="Lincoln Law <no-reply@lincolnlaw.com>"
STAFF_LEADS_EMAIL=aarondswoodbury@gmail.com
NEXT_PUBLIC_SITE_URL=https://lincolnlaw.com
DATABASE_URL=postgresql://user:password@host:5432/lincolnlaw


Then click Save → Redeploy.

4️⃣ Verify Build

Once deployed:

Open the Amplify preview URL
Example: https://main.d123abc456.amplifyapp.com

Test pages:

/intake

/intake/email

/intake/link

/intake/success

Confirm form submissions send Mailgun emails.

5️⃣ Connect Domain (GoDaddy → Route 53)
Option A – Migrate DNS to Route 53 (Recommended)

In AWS → Route 53 → Hosted Zones → Create Hosted Zone

Domain name: utahbankruptcycenter.com

Type: Public hosted zone

Copy the 4 Name Servers (NS records)

Go to GoDaddy → DNS Settings and replace the existing nameservers with the AWS ones.

Back in Amplify → Domain Management → Add Domain → lincolnlaw.com

Amplify auto-creates CNAME records and provisions an SSL certificate.

Option B – Keep DNS in GoDaddy

In Amplify → Domain Management → Add Domain

Copy the shown CNAME records and add them manually in GoDaddy DNS.

Wait ≈30–60 minutes for propagation.

6️⃣ Confirm Everything Works

Visit: utahbankruptcycenter.com

Check that SSL (lock icon) is active

Verify form submissions and Plaid sandbox connections

Confirm staff notification emails arrive

7️⃣ Database & CMS Integration
Using PostgreSQL + Prisma

Your data is stored in a structured Lead table (and related tables).
Non-technical users can easily view or export it using:

Supabase or Neon (Postgres dashboards)

Free managed hosting; has a web UI for browsing tables, CSV exports, or API access.

Prisma Studio

Run locally with:

npx prisma studio


Opens a graphical interface (http://localhost:5555
) where you can view and edit lead data—no SQL knowledge needed.

CMS Integration

Most modern CMS platforms (WordPress, Webflow, Contentful) can fetch data via a small API proxy from your /api/leads/* routes or directly from Supabase API.

You can also configure an automation (Zapier, Make, or AWS Lambda) that pushes each new lead into their CMS automatically.

✅ So yes — Prisma/Postgres is absolutely simple to manage.
If they don’t want to touch SQL, you can host the DB in Supabase and give them dashboard access — 100% no-code.

8️⃣ Optional Enhancements

Add CloudWatch Logs for request monitoring

Enable AWS Shield Standard (free DDoS protection)

Add AWS WAF rules for rate-limiting form submissions

Set up daily Amplify backups

✅ Summary
Task	Service	Status
Hosting	AWS Amplify	✅
DNS	Route 53 → GoDaddy	✅
SSL	Managed by Amplify	✅
Emails	Mailgun	✅
Data	Prisma + Postgres (via Supabase UI)	✅
Plaid Sandbox	Enabled (test credentials)	✅
🏁 Deployment Commands (Reference)
# Build locally
npm install
npm run build

# Push to main to trigger Amplify build
git add .
git commit -m "Deploy update"
git push origin main


Amplify automatically builds, deploys, and verifies the site.
Each new push to main = automatic new version online.