/*
  Warnings:

  - You are about to drop the column `category` on the `Domain` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Domain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "categoryText" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);
