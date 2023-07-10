/*
  Warnings:

  - You are about to drop the column `dr` on the `Domain` table. All the data in the column will be lost.
  - Added the required column `dr` to the `ReferredPageMain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "dr";

-- AlterTable
ALTER TABLE "ReferredPageMain" ADD COLUMN     "dr" INTEGER NOT NULL;
