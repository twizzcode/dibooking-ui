"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductDetail } from "@/types/product-detail";
import { Users, Wind, Music, Car } from "lucide-react";

interface ProductDescriptionProps {
  product: ProductDetail;
}

const iconMap: Record<string, any> = {
  users: Users,
  wind: Wind,
  music: Music,
  car: Car,
};

export function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Deskripsi & Fasilitas</h2>
        <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
          {product.description}
        </div>
      </div>

      <Separator />

      {/* Facilities */}
      <div>
        <h3 className="font-semibold mb-4">Fasilitas yang tersedia</h3>
        <div className="grid grid-cols-2 gap-4">
          {product.facilities.map((facility, index) => {
            const Icon = iconMap[facility.icon] || Users;
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{facility.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {facility.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specifications if exists */}
      {product.specifications && product.specifications.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="font-semibold mb-4">Spesifikasi</h3>
            <div className="space-y-3">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
