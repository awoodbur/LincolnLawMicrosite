-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'Utah',
    "county" TEXT,
    "householdSize" INTEGER NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "monthlyIncomeRange" TEXT NOT NULL,
    "unsecuredDebtRange" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "missedPayments" BOOLEAN NOT NULL,
    "wageGarnishment" BOOLEAN NOT NULL,
    "propertyConcerns" BOOLEAN NOT NULL,
    "notes" TEXT,
    "email" TEXT NOT NULL,
    "consentPrivacy" BOOLEAN NOT NULL,
    "consentTerms" BOOLEAN NOT NULL,
    "consentData" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'lincolnlaw-utah-intake',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaidSummary" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "transactions" TEXT,
    "identity" TEXT,
    "summaryJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaidSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EligibilityResult" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "metrics" TEXT NOT NULL,
    "disclaimers" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EligibilityResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentLog" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "actor" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payloadJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlaidSummary_leadId_key" ON "PlaidSummary"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "EligibilityResult_leadId_key" ON "EligibilityResult"("leadId");

-- CreateIndex
CREATE INDEX "ConsentLog_leadId_idx" ON "ConsentLog"("leadId");

-- CreateIndex
CREATE INDEX "AuditLog_leadId_idx" ON "AuditLog"("leadId");

-- CreateIndex
CREATE INDEX "AuditLog_event_idx" ON "AuditLog"("event");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "PlaidSummary" ADD CONSTRAINT "PlaidSummary_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EligibilityResult" ADD CONSTRAINT "EligibilityResult_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentLog" ADD CONSTRAINT "ConsentLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

