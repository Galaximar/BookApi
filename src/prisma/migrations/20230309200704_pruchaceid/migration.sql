/*
  Warnings:

  - The primary key for the `PurchaseProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PurchaseProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PurchaseProduct" DROP CONSTRAINT "PurchaseProduct_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PurchaseProduct_pkey" PRIMARY KEY ("purchaseId", "productId");
