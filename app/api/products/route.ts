import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/products - List products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");
    const brandSlug = searchParams.get("brandSlug");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      isActive: true,
    };

    if (brandId) {
      where.brandId = brandId;
    }

    if (brandSlug) {
      where.brand = { slug: brandSlug };
    }

    if (type) {
      where.type = type.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              location: true,
            },
          },
          _count: {
            select: {
              bookings: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate revenue for each product
    const productsWithRevenue = await Promise.all(
      products.map(async (product) => {
        const bookings = await prisma.booking.findMany({
          where: {
            productId: product.id,
            status: "CONFIRMED",
          },
          select: {
            totalPrice: true,
          },
        });

        const revenue = bookings.reduce(
          (sum, booking) => sum + booking.totalPrice,
          0
        );

        return {
          ...product,
          bookingCount: product._count.bookings,
          revenue,
          status: "ACTIVE" as const, // Default status
        };
      })
    );

    return NextResponse.json({
      products: productsWithRevenue,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      features,
      price,
      priceUnit,
      images,
      type,
      capacity,
      size,
      brandId,
    } = body;

    // Validate required fields
    if (!name || !price || !brandId || !type) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, brandId, type" },
        { status: 400 }
      );
    }

    // Check brand ownership
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    if (brand.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        features: features || [],
        price,
        priceUnit: priceUnit || "hari",
        images: images || [],
        type: type.toUpperCase(),
        capacity,
        size,
        brandId,
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
