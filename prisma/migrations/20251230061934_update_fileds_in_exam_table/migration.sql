-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_fileId_fkey";

-- AlterTable
ALTER TABLE "Exam" ALTER COLUMN "fileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
