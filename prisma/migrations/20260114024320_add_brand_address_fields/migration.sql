-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'BASIC', 'PRO');

-- AlterTable
ALTER TABLE "brand" ADD COLUMN     "district" TEXT,
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "settings" JSONB;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "stock" INTEGER;

-- CreateTable
CREATE TABLE "booking_line" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "booking_line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_document" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "booking_line_bookingId_idx" ON "booking_line"("bookingId");

-- CreateIndex
CREATE INDEX "booking_line_productId_idx" ON "booking_line"("productId");

-- CreateIndex
CREATE INDEX "booking_document_bookingId_idx" ON "booking_document"("bookingId");

-- CreateIndex
CREATE INDEX "booking_document_uploadedBy_idx" ON "booking_document"("uploadedBy");

-- CreateIndex
CREATE INDEX "booking_brandId_startDate_endDate_status_idx" ON "booking"("brandId", "startDate", "endDate", "status");

-- AddForeignKey
ALTER TABLE "booking_line" ADD CONSTRAINT "booking_line_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_line" ADD CONSTRAINT "booking_line_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_document" ADD CONSTRAINT "booking_document_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_document" ADD CONSTRAINT "booking_document_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
