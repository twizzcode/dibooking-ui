"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail, Globe, Facebook, Instagram } from "lucide-react";
import { BrandProfile } from "@/types/brand";

interface BrandHeaderProps {
  brand: BrandProfile;
}

export function BrandHeader({ brand }: BrandHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="aspect-[3/1] md:aspect-[4/1] bg-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
      </div>

      {/* Profile Card */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-20 relative">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo/Avatar */}
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-lg bg-accent flex items-center justify-center text-4xl font-bold shadow-lg border-4 border-background">
                {brand.logoInitial}
              </div>
            </div>

            {/* Brand Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{brand.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{brand.location}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{brand.rating}</span>
                      <span className="text-sm text-muted-foreground">• {brand.reviewCount} Reviews</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Contact
                  </Button>
                  <Button size="sm">Follow</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
