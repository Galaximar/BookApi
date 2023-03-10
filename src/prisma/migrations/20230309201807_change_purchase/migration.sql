/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `distribuitor` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "totalPrice",
DROP COLUMN "unitPrice",
ADD COLUMN     "distribuitor" TEXT NOT NULL;
