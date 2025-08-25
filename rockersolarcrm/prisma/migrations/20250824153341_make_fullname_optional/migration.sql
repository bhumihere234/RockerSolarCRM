-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "kwRequirement" REAL,
    "notes" TEXT,
    "contactMethod" TEXT,
    "contactTime" TEXT,
    "nextFollowUpOn" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Lead" ("address", "city", "contactMethod", "contactTime", "createdAt", "email", "fullName", "id", "kwRequirement", "nextFollowUpOn", "notes", "phone", "pincode", "state", "status", "updatedAt", "userId") SELECT "address", "city", "contactMethod", "contactTime", "createdAt", "email", "fullName", "id", "kwRequirement", "nextFollowUpOn", "notes", "phone", "pincode", "state", "status", "updatedAt", "userId" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
