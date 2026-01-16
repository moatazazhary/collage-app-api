/*
  Warnings:

  - Changed the type of `semesterId` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_semesterId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "semesterId",
ADD COLUMN     "semesterId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_semesterId_key" ON "Student"("semesterId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("semesterNum") ON DELETE CASCADE ON UPDATE CASCADE;
