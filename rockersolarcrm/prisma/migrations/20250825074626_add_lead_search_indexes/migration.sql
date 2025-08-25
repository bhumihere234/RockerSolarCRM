-- CreateIndex
CREATE INDEX "Lead_userId_name_idx" ON "Lead"("userId", "name");

-- CreateIndex
CREATE INDEX "Lead_userId_email_idx" ON "Lead"("userId", "email");

-- CreateIndex
CREATE INDEX "Lead_userId_phone_idx" ON "Lead"("userId", "phone");

-- CreateIndex
CREATE INDEX "Lead_userId_city_idx" ON "Lead"("userId", "city");

-- CreateIndex
CREATE INDEX "Lead_userId_company_idx" ON "Lead"("userId", "company");
