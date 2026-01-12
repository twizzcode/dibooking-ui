import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/brands/[id] - Get a single brand
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if id is a slug or cuid
    const brand = await prisma.brand.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        products: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            products: true,
            bookings: true,
          },
        },
      },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ brand });
  } catch (error) {
    console.error("Get brand error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand" },
      { status: 500 }
    );
  }
}

// PATCH /api/brands/[id] - Update a brand
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;

    // Check ownership
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    if (existingBrand.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      location,
      address,
      phone,
      email,
      website,
      coverImage,
      logoImage,
      type,
      operatingHours,
      socialMedia,
      isActive,
    } = body;

    // Check slug uniqueness if changed
    if (slug && slug !== existingBrand.slug) {
      const slugExists = await prisma.brand.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug is already taken" },
          { status: 409 }
        );
      }
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug: slug.toLowerCase().replace(/\s+/g, "-") }),
        ...(description !== undefined && { description }),
        ...(location && { location }),
        ...(address && { address }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(website !== undefined && { website }),
        ...(coverImage !== undefined && { coverImage }),
        ...(logoImage !== undefined && { logoImage }),
        ...(type && { type: type.toUpperCase() }),
        ...(operatingHours !== undefined && { operatingHours }),
        ...(socialMedia !== undefined && { socialMedia }),
        ...(isActive !== undefined && { isActive }),
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

    return NextResponse.json({ brand });
  } catch (error) {
    console.error("Update brand error:", error);
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    );
  }
}

// DELETE /api/brands/[id] - Delete a brand
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;

    // Check ownership
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    if (existingBrand.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Soft delete
    await prisma.brand.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Delete brand error:", error);
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    );
  }
}
