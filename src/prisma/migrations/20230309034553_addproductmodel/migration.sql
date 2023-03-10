/*
  Warnings:

  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - Added the required column `author` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editorial` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isbn` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "description",
DROP COLUMN "image",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "editorial" TEXT NOT NULL,
ADD COLUMN     "isbn" TEXT NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL;
