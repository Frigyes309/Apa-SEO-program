-- DropIndex
DROP INDEX "Domain_raw_key";

-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Domain_pkey" PRIMARY KEY ("id");
