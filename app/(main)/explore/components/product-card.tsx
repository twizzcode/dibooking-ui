"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import { Product } from "@/types/explore";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  // Use brandSlug if available, otherwise convert brand name to slug
  const brandSlug = product.brandSlug || (typeof product.brand === 'string' ? product.brand.toLowerCase().replace(/\s+/g, "-") : "");
  // Use product slug if available, otherwise use ID
  const productSlug = product.slug || product.id;

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer p-0 gap-2"
      onClick={() => router.push(`/${brandSlug}/${productSlug}`)}
    >
      <CardHeader className="p-2 pb-0">
        <div className="relative">
          <div className="aspect-square bg-accent flex items-center justify-center overflow-hidden relative rounded-lg">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <span className="text-muted-foreground text-xs px-3 text-center">
                {product.name}
              </span>
            )}
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
          <span className="text-[10px] text-muted-foreground uppercase">
            {product.category}
          </span>
          <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug capitalize">
            {product.name}
          </h3>
          
          {/* Rent Count */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{product.rentCount} disewa</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex flex-col gap-2">
        <div className="w-full flex items-baseline justify-between">
          <div className="flex-1">
            <p className="text-lg font-bold text-primary">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">/{product.priceUnit}</p>
        </div>
        <Button size="sm" className="w-full h-8 text-xs font-medium">
          Lihat Detail & Booking
        </Button>
      </CardFooter>
    </Card>
  );
}
