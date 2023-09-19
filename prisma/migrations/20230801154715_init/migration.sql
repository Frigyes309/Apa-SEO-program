/*
  Warnings:

  - You are about to drop the column `isMainPage` on the `Domain` table. All the data in the column will be lost.
  - Added the required column `isMainPage` to the `LinkedPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "isMainPage";

-- AlterTable
ALTER TABLE "LinkedPage" ADD COLUMN     "isMainPage" BOOLEAN NOT NULL;
