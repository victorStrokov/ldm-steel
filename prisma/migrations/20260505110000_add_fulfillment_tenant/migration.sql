-- Add fulfillmentTenantId to Product
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "fulfillmentTenantId" INTEGER;

-- Add foreign key constraint
ALTER TABLE "Product"
ADD CONSTRAINT "Product_fulfillmentTenantId_fkey" 
FOREIGN KEY ("fulfillmentTenantId") REFERENCES "Tenant"("id") 
ON DELETE SET NULL;

-- Create index
CREATE INDEX IF NOT EXISTS "Product_fulfillmentTenantId_idx" ON "Product"("fulfillmentTenantId");
