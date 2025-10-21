/*
  Warnings:

  - You are about to drop the `FinancialSnapshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `monthlyIncome` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `plaidAccessToken` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `unsecuredDebt` on the `Lead` table. All the data in the column will be lost.
  - Added the required column `consentData` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consentPrivacy` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consentTerms` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employmentStatus` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatus` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyIncomeRange` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unsecuredDebtRange` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Made the column `missedPayments` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `propertyConcerns` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `wageGarnishment` on table `Lead` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "FinancialSnapshot_createdAt_idx";

-- DropIndex
DROP INDEX "FinancialSnapshot_leadId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FinancialSnapshot";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PlaidSummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "transactions" TEXT,
    "identity" TEXT,
    "summaryJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlaidSummary_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EligibilityResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "metrics" TEXT NOT NULL,
    "disclaimers" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EligibilityResult_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ConsentLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "acceptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "ConsentLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ConsentLog" ("acceptedAt", "id", "ip", "leadId", "userAgent", "version") SELECT "acceptedAt", "id", "ip", "leadId", "userAgent", "version" FROM "ConsentLog";
DROP TABLE "ConsentLog";
ALTER TABLE "new_ConsentLog" RENAME TO "ConsentLog";
CREATE INDEX "ConsentLog_leadId_idx" ON "ConsentLog"("leadId");
CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Lead" ("county", "createdAt", "email", "householdSize", "id", "missedPayments", "propertyConcerns", "state", "updatedAt", "wageGarnishment") SELECT "county", "createdAt", "email", "householdSize", "id", "missedPayments", "propertyConcerns", "state", "updatedAt", "wageGarnishment" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
CREATE INDEX "Lead_email_idx" ON "Lead"("email");
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PlaidSummary_leadId_key" ON "PlaidSummary"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "EligibilityResult_leadId_key" ON "EligibilityResult"("leadId");
