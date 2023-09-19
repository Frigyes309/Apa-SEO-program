/*
  Warnings:

  - You are about to drop the column `anchorText` on the `Domain` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "anchorText",
ADD COLUMN     "anchorId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "titleId" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Anchor" (
    "id" SERIAL NOT NULL,
    "anchorText" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Anchor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Title" (
    "id" SERIAL NOT NULL,
    "titleText" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);
