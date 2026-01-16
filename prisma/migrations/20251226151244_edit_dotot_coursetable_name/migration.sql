/*
  Warnings:

  - You are about to drop the `doctorCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctorCourse" DROP CONSTRAINT "doctorCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "doctorCourse" DROP CONSTRAINT "doctorCourse_userId_fkey";

-- DropTable
DROP TABLE "doctorCourse";

-- CreateTable
CREATE TABLE "DoctorCourse" (
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DoctorCourse_pkey" PRIMARY KEY ("userId","courseId")
);

-- AddForeignKey
ALTER TABLE "DoctorCourse" ADD CONSTRAINT "DoctorCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorCourse" ADD CONSTRAINT "DoctorCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
