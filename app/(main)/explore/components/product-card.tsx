"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import { Product } from "@/types/explore";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  // Convert brand name to slug
  const brandSlug = product.brand.toLowerCase().replace(/\s+/g, "-");

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={() => router.push(`/${brandSlug}/${product.id}`)}
    >
      <CardHeader className="p-0">
        <div className="relative">
          <div className="aspect-square bg-accent flex items-center justify-center overflow-hidden">
            <span className="text-muted-foreground text-xs px-3 text-center">
              {product.name}
            </span>
          </div>
          <div className="absolute top-2 left-2">
            <Badge
              variant={
                product.availability === "available"
                  ? "default"
                  : product.availability === "rented"
                  ? "secondary"
                  : "destructive"
              }
              className="shadow-md text-xs"
            >
              {product.tags[0]}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge
              variant="outline"
              className="bg-background/90 backdrop-blur-sm shadow-md text-xs"
            >
              {product.brand}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          <Badge variant="secondary" className="text-[10px] font-medium">
            {product.category}
          </Badge>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-xs">
            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground truncate">
              {product.location}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-xs">{product.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex items-end justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground mb-0.5">Harga Sewa</p>
          <p className="text-base font-bold text-primary truncate">
            Rp {product.price.toLocaleString("id-ID")}
            <span className="text-xs font-normal text-muted-foreground">
              /{product.priceUnit}
            </span>
          </p>
        </div>
        <Button size="sm" className="shrink-0 h-7 text-xs px-3">
          Detail
        </Button>
      </CardFooter>
    </Card>
  );
}
