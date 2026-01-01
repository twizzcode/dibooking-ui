"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VenueItem } from "@/types/brand";
import { useRouter, useParams } from "next/navigation";

interface VenueItemCardProps {
  item: VenueItem;
}

export function VenueItemCard({ item }: VenueItemCardProps) {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={() => router.push(`/${slug}/${item.id}`)}
    >
      <div className="relative">
        <div className="aspect-square bg-accent flex items-center justify-center">
          <span className="text-muted-foreground text-xs px-3 text-center">
            {item.name}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <Badge className="bg-background/90 backdrop-blur-sm">
            {item.type === "venue" ? "Venue" : item.type === "equipment" ? "Equipment" : "Package"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="text-lg font-bold text-primary">
              Rp {item.price.toLocaleString("id-ID")}
              <span className="text-sm font-normal text-muted-foreground">
                /{item.priceUnit}
              </span>
            </p>
          </div>
          <Button size="sm" className="h-8">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
