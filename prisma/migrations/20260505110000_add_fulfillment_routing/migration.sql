-- Sync ldm-steel schema with admin-panel schema
-- Fields already applied via admin-panel migrations; this migration just marks them as tracked

-- fulfillmentTenantId already added via admin-panel/20260505110000_add_fulfillment_routing
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "fulfillmentTenantId" INTEGER;

ALTER TABLE "Product"
DROP CONSTRAINT IF EXISTS "Product_fulfillmentTenantId_fkey";

ALTER TABLE "Product"
ADD CONSTRAINT "Product_fulfillmentTenantId_fkey" 
FOREIGN KEY ("fulfillmentTenantId") REFERENCES "Tenant"("id") 
ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "Product_fulfillmentTenantId_idx" ON "Product"("fulfillmentTenantId");

-- notificationEmails already added via admin-panel/20260505110000_add_fulfillment_routing
ALTER TABLE "TenantSettings"
ADD COLUMN IF NOT EXISTS "notificationEmails" TEXT[] DEFAULT '{}';

-- routesSnapshot already added via admin-panel/20260505120000_add_routes_snapshot
ALTER TABLE "Inquiry"
ADD COLUMN IF NOT EXISTS "routesSnapshot" JSONB DEFAULT NULL;
