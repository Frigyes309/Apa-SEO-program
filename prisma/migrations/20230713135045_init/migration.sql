-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "redirect" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "state" INTEGER NOT NULL DEFAULT 0;