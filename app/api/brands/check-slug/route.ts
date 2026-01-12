import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // Check if slug is at least 3 characters
    if (slug.length < 3) {
      return NextResponse.json(
        { available: false, error: "Slug must be at least 3 characters" },
        { status: 200 }
      );
    }

    // Check if slug already exists
    const existingBrand = await prisma.brand.findUnique({
      where: { slug },
      select: { id: true },
    });

    return NextResponse.json({
      available: !existingBrand,
    });
  } catch (error) {
    console.error("Error checking slug:", error);
    return NextResponse.json(
      { error: "Failed to check slug availability" },
      { status: 500 }
    );
  }
}
