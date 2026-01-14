import { z } from "zod";

const trimString = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

const slugRegex = /^[a-z0-9-]+$/;
const phoneRegex = /^[0-9+()\s-]+$/;
const nameRegex = /^[a-zA-Z0-9\s.'(),&/-]+$/;
const blockedMetaRegex = /(--|;|\/\*|\*\/)/;

const safeName = z
  .preprocess(
    trimString,
    z
      .string()
      .min(2, "Minimal 2 karakter.")
      .max(80, "Maksimal 80 karakter.")
      .regex(nameRegex, "Gunakan huruf, angka, spasi, dan tanda baca dasar.")
  )
  .refine((value) => !blockedMetaRegex.test(value), "Karakter tidak diizinkan.");

const safeSlug = z.preprocess(
  trimString,
  z
    .string()
    .min(3, "Slug minimal 3 karakter.")
    .max(50, "Slug maksimal 50 karakter.")
    .regex(slugRegex, "Slug hanya boleh huruf kecil, angka, dan tanda hubung.")
);

const safeEmail = z.preprocess(
  trimString,
  z.string().email("Format email tidak valid.")
);

const safePhone = z
  .preprocess(
    trimString,
    z
      .string()
      .min(8, "Nomor telepon terlalu pendek.")
      .max(20, "Nomor telepon terlalu panjang.")
      .regex(phoneRegex, "Nomor telepon tidak valid.")
  )
  .refine((value) => !blockedMetaRegex.test(value), "Karakter tidak diizinkan.");

const optionalText = z.preprocess((value) => {
  if (value === null) {
    return undefined;
  }
  return trimString(value);
}, z.string().max(2000)).optional();
const optionalByEmpty = (schema: z.ZodTypeAny) =>
  z.preprocess((value) => {
    if (value === null) {
      return undefined;
    }
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }
    return value;
  }, schema.optional());

export const onboardingSchema = z.object({
  fullName: safeName,
  email: safeEmail,
  phone: safePhone,
  businessName: safeName,
  businessSlug: safeSlug,
});

export const brandCreateSchema = z
  .object({
    name: safeName,
    slug: safeSlug,
    description: optionalText,
    location: optionalText,
    address: optionalText,
    district: optionalText,
    city: optionalText,
    province: optionalText,
    postalCode: optionalText,
    phone: optionalByEmpty(safePhone),
    email: optionalByEmpty(safeEmail),
    website: optionalText,
    coverImage: optionalText,
    logoImage: optionalText,
    type: z.string().optional(),
    operatingHours: z.unknown().optional(),
    socialMedia: z.unknown().optional(),
    isNonProfit: z.boolean().optional(),
    bankInfo: z.unknown().optional(),
    ownerName: optionalByEmpty(safeName),
    timeZone: z.string().optional(),
  })
  .passthrough();
