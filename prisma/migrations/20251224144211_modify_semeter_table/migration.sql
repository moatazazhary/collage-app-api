/*
  Warnings:

  - A unique constraint covering the columns `[semesterNum]` on the table `Semester` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `semesterNum` to the `Semester` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Semester" ADD COLUMN     "semesterNum" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Semester_semesterNum_key" ON "Semester"("semesterNum");
