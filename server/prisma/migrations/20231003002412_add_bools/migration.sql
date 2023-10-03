-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "isDownloaded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPurchased" BOOLEAN NOT NULL DEFAULT false;
