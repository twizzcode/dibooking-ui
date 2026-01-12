import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/brands - List all brands or user's brands
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId");
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      isActive: true,
    };

    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (slug) {
      where.slug = slug;
    }

    if (type) {
      where.type = type.toUpperCase();
    }

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              products: true,
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
      prisma.brand.count({ where }),
    ]);

    return NextResponse.json({
      brands,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Get brands error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

// POST /api/brands - Create a new brand
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
      slug,
      description,
      location,
      address,
      city,
      province,
      postalCode,
      phone,
      email,
      website,
      coverImage,
      logoImage,
      type,
      operatingHours,
      socialMedia,
      isNonProfit,
      bankInfo,
    } = body;

    // Validate required fields (only name and slug are required now)
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug" },
        { status: 400 }
      );
    }

    // Check if slug is already taken
    const existingBrand = await prisma.brand.findUnique({
      where: { slug },
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: "Slug is already taken" },
        { status: 409 }
      );
    }

    // Build location string from city/province if not provided
    const computedLocation = location || [city, province].filter(Boolean).join(", ") || null;

    // Create brand
    const brand = await prisma.brand.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        description,
        location: computedLocation,
        address,
        city,
        province,
        postalCode,
        phone,
        email,
        website,
        coverImage,
        logoImage,
        type: type?.toUpperCase() || "RENTAL",
        operatingHours,
        socialMedia,
        isNonProfit: isNonProfit || false,
        bankInfo,
        ownerId: session.user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Update user role to PROVIDER if they were USER
    if (session.user.role === "USER") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "PROVIDER" },
      });
    }

    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    console.error("Create brand error:", error);
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}
