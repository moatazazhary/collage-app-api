/*
  Warnings:

  - Added the required column `fullnameEnglish` to the `DegreeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DegreeRequest" ADD COLUMN     "fullnameEnglish" TEXT NOT NULL;
