/*
  Warnings:

  - You are about to drop the column `refpref` on the `ReferredPageMain` table. All the data in the column will be lost.
  - Changed the type of `protocol` on the `Domain` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `refPref` to the `ReferredPageMain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "protocol",
ADD COLUMN     "protocol" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ReferredPageMain" DROP COLUMN "refpref",
ADD COLUMN     "refPref" TEXT NOT NULL;
