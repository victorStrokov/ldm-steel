-- Add manager multi-tenant access table
CREATE TABLE "ManagerTenantAccess" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagerTenantAccess_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ManagerTenantAccess_userId_tenantId_key"
ON "ManagerTenantAccess"("userId", "tenantId");

CREATE INDEX "ManagerTenantAccess_tenantId_idx"
ON "ManagerTenantAccess"("tenantId");

CREATE INDEX "ManagerTenantAccess_userId_idx"
ON "ManagerTenantAccess"("userId");

ALTER TABLE "ManagerTenantAccess"
ADD CONSTRAINT "ManagerTenantAccess_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ManagerTenantAccess"
ADD CONSTRAINT "ManagerTenantAccess_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: current MANAGERs get access to their primary tenant
INSERT INTO "ManagerTenantAccess" ("userId", "tenantId", "isPrimary", "createdAt", "updatedAt")
SELECT u."id", u."tenantId", true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "User" u
WHERE u."role" = 'MANAGER'
ON CONFLICT ("userId", "tenantId") DO NOTHING;
