import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id] - Get a single product (DEPRECATED - use slug-based search instead)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Discourage direct ID access - return message to use slug-based search
    return NextResponse.json(
      { 
        error: "Direct ID access is not supported. Please use /api/products with brandSlug and search parameters.",
        hint: "Use: /api/products?brandSlug=<brand-slug>&search=<product-name>"
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id] - Update a product
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

    // Check product and ownership
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (existingProduct.brand.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
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
      isActive,
    } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(features !== undefined && { features }),
        ...(price !== undefined && { price }),
        ...(priceUnit && { priceUnit }),
        ...(images !== undefined && { images }),
        ...(type && { type: type.toUpperCase() }),
        ...(capacity !== undefined && { capacity }),
        ...(size !== undefined && { size }),
        ...(isActive !== undefined && { isActive }),
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

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
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

    // Check product and ownership
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (existingProduct.brand.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Soft delete
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
