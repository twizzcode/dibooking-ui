"use client";

import { Product } from "@/types/explore";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface ProductsGridProps {
  products: Product[];
  onClearFilters: () => void;
}

export function ProductsGrid({ products, onClearFilters }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
          <Search className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Tidak ada produk ditemukan
        </h3>
        <p className="text-muted-foreground mb-6">
          Coba ubah kata kunci pencarian atau filter Anda
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-2" />
          Reset Filter
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
