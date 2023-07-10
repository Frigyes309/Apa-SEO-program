/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "LinkedPage" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "LinkedPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferedPageMain" (
    "id" SERIAL NOT NULL,
    "refpref" TEXT NOT NULL,

    CONSTRAINT "ReferedPageMain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "dr" INTEGER NOT NULL,
    "raw" TEXT NOT NULL,
    "protocol" INTEGER NOT NULL,
    "refPrefId" INTEGER NOT NULL,
    "lpId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_raw_key" ON "Domain"("raw");
