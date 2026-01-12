import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/bookings/[id] - Get a single booking
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { id } = await params;

    // Try to find by id or bookingCode
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id }, { bookingCode: id }],
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            images: true,
            price: true,
            priceUnit: true,
            type: true,
            capacity: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            location: true,
            address: true,
            phone: true,
            email: true,
            ownerId: true,
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
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check access: user can see their own bookings or bookings on their brands
    if (session?.user) {
      const isOwner = booking.userId === session.user.id;
      const isBrandOwner = booking.brand.ownerId === session.user.id;
      const isAdmin = session.user.role === "ADMIN";

      if (!isOwner && !isBrandOwner && !isAdmin) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    } else {
      // Non-authenticated users can only see by bookingCode (for tracking)
      if (id !== booking.bookingCode) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/[id] - Update booking status
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

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        brand: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Only brand owner or admin can update booking status
    if (existingBooking.brand.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      // User can only cancel their own pending bookings
      if (existingBooking.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { status, paymentStatus, paymentMethod, notes } = body;

    // Validate status transitions
    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    const validPaymentStatuses = ["UNPAID", "PAID", "REFUNDED"];

    const updateData: any = {};

    if (status) {
      if (!validStatuses.includes(status.toUpperCase())) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updateData.status = status.toUpperCase();
    }

    if (paymentStatus) {
      if (!validPaymentStatuses.includes(paymentStatus.toUpperCase())) {
        return NextResponse.json(
          { error: "Invalid payment status" },
          { status: 400 }
        );
      }
      updateData.paymentStatus = paymentStatus.toUpperCase();
    }

    if (paymentMethod !== undefined) {
      updateData.paymentMethod = paymentMethod;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
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

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Cancel a booking
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

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        brand: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check permission
    const isOwner = existingBooking.userId === session.user.id;
    const isBrandOwner = existingBooking.brand.ownerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isBrandOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Cancel instead of delete
    await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
