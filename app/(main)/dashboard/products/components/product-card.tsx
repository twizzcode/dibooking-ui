"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, Star, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string | null;
  type: "VENUE" | "EQUIPMENT" | "PACKAGE";
  price: number;
  priceUnit: "hour" | "day" | "package";
  images: string[];
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  bookingCount: number;
  revenue: number;
}

interface ProductCardProps {
  product: Product;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  ACTIVE: {
    label: "Aktif",
    variant: "default" as const,
  },
  INACTIVE: {
    label: "Nonaktif",
    variant: "secondary" as const,
  },
  MAINTENANCE: {
    label: "Maintenance",
    variant: "outline" as const,
  },
};

const typeConfig = {
  VENUE: {
    label: "Venue",
    color: "bg-blue-500",
  },
  EQUIPMENT: {
    label: "Peralatan",
    color: "bg-green-500",
  },
  PACKAGE: {
    label: "Paket",
    color: "bg-purple-500",
  },
};

export function ProductCard({ product, onView, onEdit, onDelete }: ProductCardProps) {
  const priceUnitLabel = 
    product.priceUnit === "hour" ? "jam" : 
    product.priceUnit === "day" ? "hari" : 
    "paket";

  // Default to ACTIVE if status is undefined
  const productStatus = product.status || "ACTIVE";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="p-0">
        <div className="relative">
          <div className="aspect-square bg-accent flex items-center justify-center overflow-hidden relative">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
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
          <div className="absolute top-2 left-2 flex gap-1.5">
            <Badge className={`${typeConfig[product.type].color} text-xs`}>
              {typeConfig[product.type].label}
            </Badge>
            <Badge variant={statusConfig[productStatus].variant} className="text-xs">
              {statusConfig[productStatus].label}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="h-7 w-7 shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(product.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(product.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => onDelete?.(product.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex-col gap-2">
        <div className="w-full flex items-end justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground mb-0.5">Harga Sewa</p>
            <p className="text-base font-bold text-primary truncate">
              Rp {product.price.toLocaleString("id-ID")}
              <span className="text-xs font-normal text-muted-foreground">
                /{priceUnitLabel}
              </span>
            </p>
          </div>
        </div>
        <div className="w-full pt-2 border-t grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">Booking</p>
            <p className="font-semibold">{product.bookingCount}x</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Pendapatan</p>
            <p className="font-semibold">
              Rp {(product.revenue / 1000000).toFixed(1)}jt
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
