/*
  Warnings:

  - You are about to drop the column `s3url` on the `Image` table. All the data in the column will be lost.
  - Added the required column `downloadUrl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "s3url",
ADD COLUMN     "downloadUrl" VARCHAR(255) NOT NULL;
