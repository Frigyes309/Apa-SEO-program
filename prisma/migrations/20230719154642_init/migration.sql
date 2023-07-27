-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isMainPage" BOOLEAN NOT NULL DEFAULT false;
