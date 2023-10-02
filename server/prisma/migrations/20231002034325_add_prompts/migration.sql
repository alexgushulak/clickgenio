/*
  Warnings:

  - You are about to drop the column `text` on the `Image` table. All the data in the column will be lost.
  - Added the required column `stableDiffusionPrompt` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPrompt` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "text",
ADD COLUMN     "stableDiffusionPrompt" VARCHAR(255) NOT NULL,
ADD COLUMN     "userPrompt" VARCHAR(255) NOT NULL;
