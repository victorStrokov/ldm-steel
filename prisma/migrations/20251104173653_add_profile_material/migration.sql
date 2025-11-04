-- CreateEnum
CREATE TYPE "public"."ProfileMaterial" AS ENUM ('STEEL', 'PVC', 'ALUMINIUM');

-- AlterTable
ALTER TABLE "public"."ProductItem" ADD COLUMN     "material" "public"."ProfileMaterial";
