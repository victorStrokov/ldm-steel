/*
  Warnings:

  - You are about to drop the column `color` on the `ProductItem` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `ProductItem` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `ProductItem` table. All the data in the column will be lost.
  - You are about to drop the column `shape` on the `ProductItem` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `ProductItem` table. All the data in the column will be lost.
  - You are about to drop the column `thickness` on the `ProductItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductItem" DROP COLUMN "color",
DROP COLUMN "length",
DROP COLUMN "material",
DROP COLUMN "shape",
DROP COLUMN "size",
DROP COLUMN "thickness",
ADD COLUMN     "productColor" INTEGER,
ADD COLUMN     "productLength" INTEGER,
ADD COLUMN     "productMaterials" "ProductMaterial",
ADD COLUMN     "productShape" INTEGER,
ADD COLUMN     "productSizes" INTEGER,
ADD COLUMN     "productThickness" INTEGER,
ADD COLUMN     "pvcSize" INTEGER,
ADD COLUMN     "steelSize" INTEGER;
