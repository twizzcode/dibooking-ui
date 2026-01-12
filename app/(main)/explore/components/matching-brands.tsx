import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import Link from "next/link";

interface BrandInfo {
  name: string;
  slug: string;
  location: string;
  productCount: number;
}

interface MatchingBrandsProps {
  brands: BrandInfo[];
}

export function MatchingBrands({ brands }: MatchingBrandsProps) {
  if (brands.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="text-sm font-medium mb-3">Brand yang ditemukan:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/${brand.slug}`}
            className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                {brand.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {brand.productCount} produk
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
