/*
  Warnings:

  - You are about to drop the `ReferedPageMain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ReferedPageMain";

-- CreateTable
CREATE TABLE "ReferredPageMain" (
    "id" SERIAL NOT NULL,
    "refpref" TEXT NOT NULL,

    CONSTRAINT "ReferredPageMain_pkey" PRIMARY KEY ("id")
);
