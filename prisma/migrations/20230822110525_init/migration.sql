/*
  Warnings:

  - You are about to drop the column `isMainPage` on the `LinkedPage` table. All the data in the column will be lost.
  - Added the required column `achorEnvironment` to the `Anchor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anchor" ADD COLUMN     "achorEnvironment" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LinkedPage" DROP COLUMN "isMainPage";
