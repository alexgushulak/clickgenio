/*
  Warnings:

  - The primary key for the `UserData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sessionId` on the `UserData` table. All the data in the column will be lost.
  - Added the required column `emailAddress` to the `UserData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `UserData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserData" DROP CONSTRAINT "UserData_pkey",
DROP COLUMN "sessionId",
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "emailAddress" VARCHAR(255) NOT NULL,
ADD COLUMN     "fullName" VARCHAR(255) NOT NULL,
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "UserData_pkey" PRIMARY KEY ("userId");
