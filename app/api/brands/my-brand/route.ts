import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/brands/my-brand - Get current user's brand
export async function GET(request: NextRequest) {
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

    // Find the first active brand owned by the user
    const brand = await prisma.brand.findFirst({
      where: {
        ownerId: session.user.id,
        isActive: true,
      },
      include: {
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
    });

    if (!brand) {
      return NextResponse.json(
        { brand: null, message: "No brand found" },
        { status: 200 }
      );
    }

    return NextResponse.json({ brand });
  } catch (error) {
    console.error("Get my brand error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand" },
      { status: 500 }
    );
  }
}
