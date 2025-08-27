-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "alternatePhone" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "company" TEXT,
    "designation" TEXT,
    "roofArea" TEXT,
    "monthlyBill" TEXT,
    "energyRequirement" TEXT,
    "roofType" TEXT,
    "propertyType" TEXT,
    "leadStatus" TEXT NOT NULL DEFAULT 'newlead',
    "leadSource" TEXT,
    "budget" TEXT,
    "timeline" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "notes" TEXT,
    "preferredContactTime" TEXT,
    "preferredContactMethod" TEXT,
    "nextFollowUpDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Lead" ("address", "alternatePhone", "budget", "city", "company", "createdAt", "designation", "email", "energyRequirement", "id", "leadSource", "monthlyBill", "name", "nextFollowUpDate", "notes", "phone", "pincode", "preferredContactMethod", "preferredContactTime", "priority", "propertyType", "roofArea", "roofType", "state", "timeline", "updatedAt", "userId") SELECT "address", "alternatePhone", "budget", "city", "company", "createdAt", "designation", "email", "energyRequirement", "id", "leadSource", "monthlyBill", "name", "nextFollowUpDate", "notes", "phone", "pincode", "preferredContactMethod", "preferredContactTime", "priority", "propertyType", "roofArea", "roofType", "state", "timeline", "updatedAt", "userId" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
CREATE INDEX "Lead_userId_name_idx" ON "Lead"("userId", "name");
CREATE INDEX "Lead_userId_email_idx" ON "Lead"("userId", "email");
CREATE INDEX "Lead_userId_phone_idx" ON "Lead"("userId", "phone");
CREATE INDEX "Lead_userId_city_idx" ON "Lead"("userId", "city");
CREATE INDEX "Lead_userId_company_idx" ON "Lead"("userId", "company");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
