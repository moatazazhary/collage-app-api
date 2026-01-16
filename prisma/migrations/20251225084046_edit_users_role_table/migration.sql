/*
  Warnings:

  - The primary key for the `UsersRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roleid` on the `UsersRole` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `UsersRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersRole" DROP CONSTRAINT "UsersRole_roleid_fkey";

-- AlterTable
ALTER TABLE "UsersRole" DROP CONSTRAINT "UsersRole_pkey",
DROP COLUMN "roleid",
ADD COLUMN     "roleId" TEXT NOT NULL,
ADD CONSTRAINT "UsersRole_pkey" PRIMARY KEY ("userId", "roleId");

-- AddForeignKey
ALTER TABLE "UsersRole" ADD CONSTRAINT "UsersRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
