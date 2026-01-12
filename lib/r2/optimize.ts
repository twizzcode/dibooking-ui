import sharp from "sharp";

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

const DEFAULT_OPTIONS: OptimizeOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 80,
  maxSizeKB: 1024, // 1MB
};

/**
 * Optimize image to WebP format with size constraints
 * @param buffer - Original image buffer
 * @param options - Optimization options
 * @returns Optimized image buffer in WebP format
 */
export async function optimizeImage(
  buffer: Buffer,
  options: OptimizeOptions = {}
): Promise<Buffer> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  let quality = opts.quality!;
  let optimizedBuffer: Buffer;

  // Initial optimization
  optimizedBuffer = await sharp(buffer)
    .resize(opts.maxWidth, opts.maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer();

  // If still too large, progressively reduce quality
  const maxBytes = opts.maxSizeKB! * 1024;
  while (optimizedBuffer.length > maxBytes && quality > 20) {
    quality -= 10;
    optimizedBuffer = await sharp(buffer)
      .resize(opts.maxWidth, opts.maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();
  }

  // If still too large, resize further
  if (optimizedBuffer.length > maxBytes) {
    const metadata = await sharp(buffer).metadata();
    const scaleFactor = Math.sqrt(maxBytes / optimizedBuffer.length);
    const newWidth = Math.floor((metadata.width || opts.maxWidth!) * scaleFactor);
    const newHeight = Math.floor((metadata.height || opts.maxHeight!) * scaleFactor);

    optimizedBuffer = await sharp(buffer)
      .resize(newWidth, newHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 60 })
      .toBuffer();
  }

  return optimizedBuffer;
}

/**
 * Get image metadata
 */
export async function getImageMetadata(buffer: Buffer) {
  return sharp(buffer).metadata();
}

/**
 * Validate if buffer is a valid image
 */
export async function isValidImage(buffer: Buffer): Promise<boolean> {
  try {
    const metadata = await sharp(buffer).metadata();
    return !!metadata.format;
  } catch {
    return false;
  }
}
