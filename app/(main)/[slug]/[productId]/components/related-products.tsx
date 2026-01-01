"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { RelatedProduct } from "@/types/product-detail";

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Mungkin Anda Suka</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div className="relative aspect-square bg-accent">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">
                  {product.rating}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                <span>{product.location}</span>
              </div>
              <p className="text-sm font-bold">
                Rp {product.price.toLocaleString("id-ID")}
                <span className="text-xs font-normal text-muted-foreground">
                  /{product.priceUnit}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
