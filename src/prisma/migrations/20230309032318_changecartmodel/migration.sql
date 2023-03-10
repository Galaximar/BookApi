/*
  Warnings:

  - The primary key for the `Cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cartToken` on the `Cart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Cart` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_id_fkey";

-- DropIndex
DROP INDEX "Cart_cartToken_key";

-- AlterTable
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_pkey",
DROP COLUMN "cartToken",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Cart_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_cartToken_key" ON "User"("cartToken");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cartToken_fkey" FOREIGN KEY ("cartToken") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
