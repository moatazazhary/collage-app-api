/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersRole" (
    "userId" TEXT NOT NULL,
    "roleid" TEXT NOT NULL,

    CONSTRAINT "UsersRole_pkey" PRIMARY KEY ("userId","roleid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_id_key" ON "Role"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- AddForeignKey
ALTER TABLE "UsersRole" ADD CONSTRAINT "UsersRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersRole" ADD CONSTRAINT "UsersRole_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
