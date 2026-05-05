-- CreateEnum (if not exists)
DO $$ BEGIN
  CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable: add isMain and status to Tenant (if not exists)
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "isMain" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "status" "TenantStatus" NOT NULL DEFAULT 'ACTIVE';

-- Mark the first (lowest id) tenant as main
UPDATE "Tenant" SET "isMain" = true WHERE id = (SELECT MIN(id) FROM "Tenant");
