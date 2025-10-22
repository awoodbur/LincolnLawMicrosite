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

**Required Environment Variables:**
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com (or your Amplify preview URL)
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
PLAID_PRODUCTS=transactions,identity
```

**Optional (Email & Database):**
```
MAILGUN_API_KEY=your_mailgun_key (optional - emails will be skipped if not set)
MAILGUN_DOMAIN=your_domain.com (optional)
MAILGUN_FROM="Your Company <no-reply@yourdomain.com>" (optional)
STAFF_LEADS_EMAIL=staff@yourdomain.com (optional)
DATABASE_URL=postgresql://user:password@host:5432/dbname (optional for initial deployment)
```

**Important Notes:**
- If you don't set `DATABASE_URL`, the build will use a temporary SQLite database just for compilation
- For production, you should set up a PostgreSQL database (Supabase, Neon, or AWS RDS) and add the DATABASE_URL
- Without MAILGUN variables, the app will skip sending emails but will still function
- The Plaid variables are required for the bank linking feature

Then click **Save → Redeploy**.

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

7️⃣ Database Setup (AWS RDS PostgreSQL)

**Required for submissions to work!** Choose one of these AWS database options:

### Option A: AWS RDS Free Tier (Recommended for Testing)
**Cost:** Free for 12 months, then ~$15-18/month

1. **AWS Console → RDS → Create Database**
2. **Settings:**
   - Engine: PostgreSQL 16.x
   - Templates: Free tier
   - DB identifier: `lincoln-law-microsite-db`
   - Master username: `postgres`
   - Master password: [Create strong password]
   - Instance: db.t3.micro
   - Storage: 20 GB SSD
   - **Public access: YES** (required for Amplify)
   - Initial database name: `lincolnlaw`

3. **Configure Security Group:**
   - After creation, go to the database's security group
   - Add inbound rule: PostgreSQL (5432) from 0.0.0.0/0

4. **Get Connection String:**
   ```
   postgresql://postgres:[PASSWORD]@[ENDPOINT]:5432/lincolnlaw
   ```
   Example: `postgresql://postgres:MyPass@lincolnlaw-db.abc.us-east-1.rds.amazonaws.com:5432/lincolnlaw`

5. **Add to Amplify Environment Variables:**
   - Key: `DATABASE_URL`
   - Value: [Your connection string from step 4]

6. **Create Migrations Locally:**
   ```bash
   export DATABASE_URL="your-connection-string"
   npx prisma migrate dev --name init
   git add prisma/migrations
   git commit -m "Add PostgreSQL migrations"
   git push origin main
   ```

### Option B: AWS Aurora Serverless v2 (Production Scaling)
**Cost:** ~$43+/month, auto-scales with demand
- Same setup as RDS, but choose Aurora PostgreSQL Serverless v2
- Better for production with variable traffic

### Viewing Your Data

**Prisma Studio (No SQL Required):**
```bash
export DATABASE_URL="your-rds-connection-string"
npx prisma studio
```
Opens http://localhost:5555 with a graphical interface to view/edit leads.

**AWS RDS Console:**
- Go to RDS → Databases → Query Editor
- Connect and run SQL queries directly

**Third-party Tools:**
- TablePlus, pgAdmin, DBeaver (connect using your DATABASE_URL)

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