import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  const brand = await prisma.brand.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!brand) {
    return {
      title: "Brand Not Found",
    };
  }

  return {
    title: `${brand.name} - Rental & Booking`,
    description: brand.description || `Lihat produk dan layanan dari ${brand.name}`,
  };
}

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
