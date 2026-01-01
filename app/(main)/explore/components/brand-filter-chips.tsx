"use client";

import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { dummyProducts } from "@/lib/dummy-data";
import { useRouter } from "next/navigation";

interface BrandFilterChipsProps {
  suggestedBrands: string[];
}

export function BrandFilterChips({
  suggestedBrands,
}: BrandFilterChipsProps) {
  const router = useRouter();

  if (suggestedBrands.length === 0) return null;

  // Get product count for each brand
  const getBrandInfo = (brand: string) => {
    const products = dummyProducts.filter((p) => p.brand === brand);
    const location = products[0]?.location || "";
    return {
      count: products.length,
      location,
    };
  };

  // Convert brand name to slug
  const brandToSlug = (brand: string) => {
    return brand.toLowerCase().replace(/\s+/g, "-");
  };

  const handleBrandClick = (brand: string) => {
    const slug = brandToSlug(brand);
    router.push(`/${slug}`);
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Brand / Penyewa Terkait</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestedBrands.map((brand) => {
          const info = getBrandInfo(brand);
          const firstLetter = brand.charAt(0).toUpperCase();
          
          return (
            <Card
              key={brand}
              className="p-4 cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 border-2 border-border group"
              onClick={() => handleBrandClick(brand)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl bg-accent text-foreground group-hover:bg-primary/10 transition-all">
                    {firstLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                      {brand}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                      <span>{info.location}</span>
                      <span>•</span>
                      <span>{info.count} Produk</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all shrink-0" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
