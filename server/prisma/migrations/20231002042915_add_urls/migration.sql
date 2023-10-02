/*
  Warnings:

  - Added the required column `previewUrl` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `watermarkUrl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "previewUrl" VARCHAR(255) NOT NULL,
ADD COLUMN     "watermarkUrl" VARCHAR(255) NOT NULL;
