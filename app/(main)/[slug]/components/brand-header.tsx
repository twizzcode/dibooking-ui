"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { BrandProfile } from "@/types/brand";
import Image from "next/image";

interface BrandHeaderProps {
  brand: BrandProfile;
}

export function BrandHeader({ brand }: BrandHeaderProps) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value);

  const transactionCount = brand.transactionCount ?? 0;
  const followerCount = brand.followerCount ?? 0;

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="aspect-[3/1] md:aspect-[4/1] bg-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
      </div>

      {/* Profile Card */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo/Avatar */}
            <div className="flex-shrink-0">
              {brand.logoImage ? (
                <Image
                  src={brand.logoImage}
                  alt={brand.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-lg object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-lg bg-accent shadow-lg border-4 border-background flex items-center justify-center">
                  <span className="text-4xl font-bold">{brand.logoInitial}</span>
                </div>
              )}
            </div>

            {/* Brand Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{brand.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-foreground">{brand.rating}</span>
                      <span>• {brand.reviewCount} Reviews</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm sm:inline-grid sm:grid-cols-2">
                    <div className="rounded-lg border bg-background/60 px-4 py-3 min-w-[140px]">
                      <p className="text-xs text-muted-foreground">Total transaksi</p>
                      <p className="text-base font-semibold">{formatNumber(transactionCount)}</p>
                    </div>
                    <div className="rounded-lg border bg-background/60 px-4 py-3 min-w-[140px]">
                      <p className="text-xs text-muted-foreground">Followers</p>
                      <p className="text-base font-semibold">{formatNumber(followerCount)}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Contact
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-shadow"
                  >
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
