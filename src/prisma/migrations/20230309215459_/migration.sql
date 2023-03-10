/*
  Warnings:

  - You are about to drop the column `cartToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_cartToken_fkey";

-- DropIndex
DROP INDEX "User_cartToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cartToken",
ADD COLUMN     "cartId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_cartId_key" ON "User"("cartId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
