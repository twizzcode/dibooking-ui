import { NextRequest, NextResponse } from "next/server";
import { uploadImage, type UploadResult } from "@/lib/r2";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate folder path (prevent path traversal)
    const normalizedFolder = folder
      .toLowerCase()
      .replace(/[^a-z0-9/-]/g, "")
      .replace(/\/+/g, "/")
      .replace(/^\/|\/$/g, "");

    const isAllowed =
      normalizedFolder === "uploads" ||
      normalizedFolder === "avatars" ||
      normalizedFolder === "products" ||
      /^brand\/[a-z0-9-]+\/(logo|banner)$/.test(normalizedFolder) ||
      /^brand\/[a-z0-9-]+\/products\/[a-z0-9-]+\/(images|documents)$/.test(
        normalizedFolder
      );

    const safeFolder = isAllowed ? normalizedFolder : "uploads";

    // Upload and optimize
    const result: UploadResult = await uploadImage(file, safeFolder);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      originalSize: result.originalSize,
      optimizedSize: result.optimizedSize,
      savedBytes: (result.originalSize || 0) - (result.optimizedSize || 0),
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
