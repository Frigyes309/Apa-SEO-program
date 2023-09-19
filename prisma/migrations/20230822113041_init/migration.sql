/*
  Warnings:

  - You are about to drop the column `achorEnvironment` on the `Anchor` table. All the data in the column will be lost.
  - Added the required column `anchorEnvironment` to the `Anchor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anchor" DROP COLUMN "achorEnvironment",
ADD COLUMN     "anchorEnvironment" TEXT NOT NULL;
