import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET, R2_PUBLIC_URL } from "./r2-client";
import { optimizeImage, isValidImage } from "./optimize";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
  originalSize?: number;
  optimizedSize?: number;
}

/**
 * Upload and optimize an image to R2
 * @param file - File to upload
 * @param folder - Folder path in R2 (e.g., "brands", "products")
 * @returns Upload result with public URL
 */
export async function uploadImage(
  file: File,
  folder: string = "uploads"
): Promise<UploadResult> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
      };
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
      };
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const originalSize = buffer.length;

    const isPdf = file.type === "application/pdf";
    if (!isPdf) {
      // Validate image
      if (!(await isValidImage(buffer))) {
        return {
          success: false,
          error: "Invalid or corrupted image file",
        };
      }
    }

    // Optimize image (skip for PDF)
    const optimizedBuffer = isPdf ? buffer : await optimizeImage(buffer);
    const optimizedSize = optimizedBuffer.length;

    // Generate unique key
    const extension = isPdf ? "pdf" : "webp";
    const key = `${folder}/${uuidv4()}.${extension}`;

    // Upload to R2
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: optimizedBuffer,
        ContentType: isPdf ? "application/pdf" : "image/webp",
        CacheControl: "public, max-age=31536000", // 1 year
      })
    );

    const url = `${R2_PUBLIC_URL}/${key}`;

    return {
      success: true,
      url,
      key,
      originalSize,
      optimizedSize,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Delete an image from R2
 * @param key - R2 object key
 */
export async function deleteImage(key: string): Promise<boolean> {
  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}

/**
 * Extract key from R2 public URL
 */
export function getKeyFromUrl(url: string): string | null {
  if (!url.startsWith(R2_PUBLIC_URL)) {
    return null;
  }
  return url.replace(`${R2_PUBLIC_URL}/`, "");
}
