-- CreateEnum
CREATE TYPE "BrandType" AS ENUM ('VENUE', 'RENTAL', 'BOTH', 'SERVICE');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('VENUE', 'EQUIPMENT', 'PACKAGE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');

-- CreateTable
CREATE TABLE "brand" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "coverImage" TEXT,
    "logoImage" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "establishedYear" INTEGER,
    "type" "BrandType" NOT NULL DEFAULT 'RENTAL',
    "operatingHours" JSONB,
    "socialMedia" JSONB,
    "isNonProfit" BOOLEAN NOT NULL DEFAULT false,
    "bankInfo" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "features" TEXT[],
    "price" INTEGER NOT NULL,
    "priceUnit" TEXT NOT NULL DEFAULT 'hari',
    "images" TEXT[],
    "type" "ProductType" NOT NULL,
    "capacity" TEXT,
    "size" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerOrg" TEXT,
    "notes" TEXT,
    "paymentMethod" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "productId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "slots" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brand_slug_key" ON "brand"("slug");

-- CreateIndex
CREATE INDEX "brand_ownerId_idx" ON "brand"("ownerId");

-- CreateIndex
CREATE INDEX "brand_slug_idx" ON "brand"("slug");

-- CreateIndex
CREATE INDEX "product_brandId_idx" ON "product"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "booking_bookingCode_key" ON "booking"("bookingCode");

-- CreateIndex
CREATE INDEX "booking_userId_idx" ON "booking"("userId");

-- CreateIndex
CREATE INDEX "booking_productId_idx" ON "booking"("productId");

-- CreateIndex
CREATE INDEX "booking_brandId_idx" ON "booking"("brandId");

-- CreateIndex
CREATE INDEX "booking_bookingCode_idx" ON "booking"("bookingCode");

-- CreateIndex
CREATE INDEX "availability_productId_idx" ON "availability"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "availability_productId_date_key" ON "availability"("productId", "date");

-- AddForeignKey
ALTER TABLE "brand" ADD CONSTRAINT "brand_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability" ADD CONSTRAINT "availability_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
