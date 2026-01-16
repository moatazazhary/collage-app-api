/*
  Warnings:

  - You are about to drop the column `accountNum` on the `Bank` table. All the data in the column will be lost.
  - You are about to drop the column `ankName` on the `Bank` table. All the data in the column will be lost.
  - Added the required column `accountNumber` to the `Bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `Bank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bank" DROP COLUMN "accountNum",
DROP COLUMN "ankName",
ADD COLUMN     "accountNumber" INTEGER NOT NULL,
ADD COLUMN     "bankName" TEXT NOT NULL;
