-- CreateTable
CREATE TABLE "DegreeType" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DegreeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DegreeRequestType" (
    "degreeRequestId" TEXT NOT NULL,
    "degreeTypeId" TEXT NOT NULL,

    CONSTRAINT "DegreeRequestType_pkey" PRIMARY KEY ("degreeRequestId","degreeTypeId")
);

-- AddForeignKey
ALTER TABLE "DegreeRequestType" ADD CONSTRAINT "DegreeRequestType_degreeRequestId_fkey" FOREIGN KEY ("degreeRequestId") REFERENCES "DegreeRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DegreeRequestType" ADD CONSTRAINT "DegreeRequestType_degreeTypeId_fkey" FOREIGN KEY ("degreeTypeId") REFERENCES "DegreeType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
