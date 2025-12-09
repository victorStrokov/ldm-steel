/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verified" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_token_key" ON "Cart"("token");
