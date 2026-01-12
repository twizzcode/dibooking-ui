import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Generate unique booking code
function generateBookingCode(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BK${year}${month}${random}`;
}

// GET /api/bookings - List bookings
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");
    const productId = searchParams.get("productId");
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};

    // Allow public access for availability checking (productId only)
    // This lets anyone see booked dates for a product
    const isPublicAvailabilityCheck = productId && !brandId && !userId;

    // If user is logged in and not admin, filter by their bookings or their brands
    if (session?.user && !isPublicAvailabilityCheck) {
      if (session.user.role !== "ADMIN") {
        if (brandId) {
          // Check if user owns this brand
          const brand = await prisma.brand.findUnique({
            where: { id: brandId },
          });
          if (brand?.ownerId !== session.user.id) {
            where.userId = session.user.id;
          } else {
            where.brandId = brandId;
          }
        } else if (!userId) {
          // Show user's own bookings or bookings on their brands
          where.OR = [
            { userId: session.user.id },
            { brand: { ownerId: session.user.id } },
          ];
        }
      }
    }

    if (userId && session?.user?.id === userId) {
      where.userId = userId;
    }

    if (brandId && !where.brandId) {
      where.brandId = brandId;
    }

    if (productId) {
      where.productId = productId;
    }

    if (status) {
      // Support multiple statuses separated by comma
      const statuses = status.split(',').map(s => s.trim().toUpperCase());
      if (statuses.length > 1) {
        where.status = { in: statuses };
      } else {
        where.status = statuses[0];
      }
    }

    if (startDate) {
      where.startDate = {
        ...(where.startDate || {}),
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      where.endDate = {
        ...(where.endDate || {}),
        lte: new Date(endDate),
      };
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: isPublicAvailabilityCheck ? {
          // Minimal data for public availability check
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        } : {
          // Full data for authenticated users
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
              priceUnit: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              location: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.booking.count({ where }),
    ]);

    // For public availability check, only return necessary fields
    const sanitizedBookings = isPublicAvailabilityCheck 
      ? bookings.map(booking => ({
          id: booking.id,
          startDate: booking.startDate,
          endDate: booking.endDate,
          status: booking.status,
          productId: booking.productId,
        }))
      : bookings;

    return NextResponse.json({
      bookings: sanitizedBookings,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const body = await request.json();
    const {
      productId,
      startDate,
      endDate,
      customerName,
      customerPhone,
      customerEmail,
      customerOrg,
      notes,
    } = body;

    // Validate required fields
    if (!productId || !startDate || !endDate || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Missing required fields: productId, startDate, endDate, customerName, customerPhone" },
        { status: 400 }
      );
    }

    // Get product and brand info
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        brand: true,
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found or not available" },
        { status: 404 }
      );
    }

    // Check availability (no overlapping bookings)
    const overlapping = await prisma.booking.findFirst({
      where: {
        productId,
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(startDate) } },
            ],
          },
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(endDate) } },
            ],
          },
          {
            AND: [
              { startDate: { gte: new Date(startDate) } },
              { endDate: { lte: new Date(endDate) } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "Selected dates are not available" },
        { status: 409 }
      );
    }

    // Calculate total price (simple: days * price)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = product.price * days;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingCode: generateBookingCode(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        customerName,
        customerPhone,
        customerEmail,
        customerOrg,
        notes,
        productId,
        brandId: product.brandId,
        userId: session?.user?.id || null,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
