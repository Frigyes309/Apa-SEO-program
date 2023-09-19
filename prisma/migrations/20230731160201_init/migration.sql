-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "anchorText" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "raw" SET DEFAULT '';
