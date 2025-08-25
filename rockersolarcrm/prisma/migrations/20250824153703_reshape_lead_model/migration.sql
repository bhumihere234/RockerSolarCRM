/*
  Warnings:

  - You are about to drop the column `contactMethod` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `contactTime` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `kwRequirement` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `nextFollowUpOn` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Lead` table. All the data in the column will be lost.
  - Added the required column `name` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pincode` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Lead` required. This step will fail if there are existing NULL values in that column.

*/
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
INSERT INTO "new_Lead" ("address", "city", "createdAt", "email", "id", "notes", "phone", "pincode", "state", "updatedAt", "userId") SELECT "address", "city", "createdAt", "email", "id", "notes", "phone", "pincode", "state", "updatedAt", "userId" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
