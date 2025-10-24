/*
  Warnings:

  - You are about to drop the column `actor` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `payloadJson` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `acceptedAt` on the `ConsentLog` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `ConsentLog` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `ConsentLog` table. All the data in the column will be lost.
  - You are about to drop the column `disclaimers` on the `EligibilityResult` table. All the data in the column will be lost.
  - You are about to drop the column `metrics` on the `EligibilityResult` table. All the data in the column will be lost.
  - You are about to drop the column `rationale` on the `EligibilityResult` table. All the data in the column will be lost.
  - You are about to drop the column `tier` on the `EligibilityResult` table. All the data in the column will be lost.
  - You are about to drop the column `consentData` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `consentPrivacy` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `consentTerms` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyIncomeRange` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `unsecuredDebtRange` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the `PlaidSummary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `consentType` to the `ConsentLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consentVersion` to the `ConsentLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetRisk` to the `EligibilityResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetTestPass` to the `EligibilityResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapter7Eligible` to the `EligibilityResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disclaimer` to the `EligibilityResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incomeTestPass` to the `EligibilityResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendedChapter` to the `EligibilityResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `EligibilityResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasValuableItems` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAboveMedian` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyExpenses` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priorBankruptcy` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDebt` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleEquity` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."PlaidSummary" DROP CONSTRAINT "PlaidSummary_leadId_fkey";

-- DropIndex
DROP INDEX "public"."AuditLog_createdAt_idx";

-- DropIndex
DROP INDEX "public"."AuditLog_event_idx";

-- DropIndex
DROP INDEX "public"."Lead_email_key";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "actor",
DROP COLUMN "createdAt",
DROP COLUMN "payloadJson",
ADD COLUMN     "details" JSONB,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "ConsentLog" DROP COLUMN "acceptedAt",
DROP COLUMN "ip",
DROP COLUMN "version",
ADD COLUMN     "consentType" TEXT NOT NULL,
ADD COLUMN     "consentVersion" TEXT NOT NULL,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "EligibilityResult" DROP COLUMN "disclaimers",
DROP COLUMN "metrics",
DROP COLUMN "rationale",
DROP COLUMN "tier",
ADD COLUMN     "assetRisk" BOOLEAN NOT NULL,
ADD COLUMN     "budgetTestPass" BOOLEAN NOT NULL,
ADD COLUMN     "chapter7Eligible" BOOLEAN NOT NULL,
ADD COLUMN     "disclaimer" TEXT NOT NULL,
ADD COLUMN     "incomeTestPass" BOOLEAN NOT NULL,
ADD COLUMN     "reasons" TEXT[],
ADD COLUMN     "recommendedChapter" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "consentData",
DROP COLUMN "consentPrivacy",
DROP COLUMN "consentTerms",
DROP COLUMN "monthlyIncomeRange",
DROP COLUMN "source",
DROP COLUMN "unsecuredDebtRange",
ADD COLUMN     "hasValuableItems" BOOLEAN NOT NULL,
ADD COLUMN     "homeEquity" DOUBLE PRECISION,
ADD COLUMN     "isAboveMedian" BOOLEAN NOT NULL,
ADD COLUMN     "monthlyExpenses" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "priorBankruptcy" BOOLEAN NOT NULL,
ADD COLUMN     "totalDebt" TEXT NOT NULL,
ADD COLUMN     "vehicleEquity" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "state" DROP DEFAULT,
ALTER COLUMN "missedPayments" SET DEFAULT false,
ALTER COLUMN "wageGarnishment" SET DEFAULT false,
ALTER COLUMN "propertyConcerns" SET DEFAULT false;

-- DropTable
DROP TABLE "public"."PlaidSummary";

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "EligibilityResult_leadId_idx" ON "EligibilityResult"("leadId");
