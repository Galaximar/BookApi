/*
  Warnings:

  - You are about to drop the column `userId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the `_ProductToPurchase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToPurchase" DROP CONSTRAINT "_ProductToPurchase_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToPurchase" DROP CONSTRAINT "_ProductToPurchase_B_fkey";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "userId";

-- DropTable
DROP TABLE "_ProductToPurchase";
