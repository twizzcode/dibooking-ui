"use client";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { getProductDetail } from "@/lib/product-detail-data";
import { ProductGallery } from "./components/product-gallery";
import { BookingCard } from "./components/booking-card";
import { ProductDescription } from "./components/product-description";
import { OwnerInfo } from "./components/owner-info";
import { ReviewSection } from "./components/review-section";
import { RelatedProducts } from "./components/related-products";
import { AvailabilityCalendar } from "./components/availability-calendar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Calendar as CalendarIcon } from "lucide-react";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{ slug: string; productId: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { slug, productId } = use(params);
  const product = getProductDetail(productId);
  const [isOpen, setIsOpen] = useState(false);

  if (!product) {
    notFound();
  }
  return (
    <div className="min-h-screen">
      {/* Main Content - 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 lg:px-8 py-6">
        {/* Left Column: Small Gallery + Brand Info */}
        <div className="space-y-6">
          {/* Smaller Gallery */}
          <div className="max-w-md">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Brand Info Below Gallery */}
          <div className="max-w-md">
            <OwnerInfo owner={product.owner} brandSlug={product.brandSlug} />
          </div>
        </div>

        {/* Right Column: Product Details + CTA */}
        <div className="space-y-6">
          {/* Product Title, Price & CTA */}
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-primary">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
                <span className="text-muted-foreground">/{product.priceUnit}</span>
              </div>
            </div>

            {/* CTA Button */}
            <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
              <DrawerTrigger asChild>
                <Button size="lg" className="w-full gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {product.type === "tempat" ? "Cek Ketersediaan & Sewa" : "Ajukan Sewa"}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 !w-full !max-w-full sm:!max-w-full lg:!w-1/2 lg:!max-w-[50vw] rounded-none">
                <div className="h-full flex flex-col max-w-full">
                  <DrawerHeader>
                    <DrawerTitle>
                      {product.type === "tempat" ? "Ketersediaan & Booking" : "Ajukan Sewa"}
                    </DrawerTitle>
                    <DrawerDescription>
                      {product.type === "tempat" 
                        ? "Pilih tanggal dan ajukan booking untuk " + product.name
                        : "Isi form untuk mengajukan sewa " + product.name
                      }
                    </DrawerDescription>
                  </DrawerHeader>
                  
                  <div className="overflow-y-auto flex-1 px-4">
                    <div className="space-y-6 pb-8">
                      {/* Calendar - Only for venue type */}
                      {product.type === "tempat" && (
                        <div className="space-y-3">
                          <h3 className="font-semibold">Ketersediaan</h3>
                          <p className="text-sm text-muted-foreground">
                            Event berwarna merah menunjukkan tanggal yang sudah dibooking
                          </p>
                          <AvailabilityCalendar />
                        </div>
                      )}

                      {/* Booking Form */}
                      <div>
                        <h3 className="font-semibold mb-4">Form Pemesanan</h3>
                        <BookingCard product={product} />
                      </div>
                    </div>
                  </div>
                  
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Tutup</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Rating & Location */}
          <div className="flex items-center gap-4 text-muted-foreground border-y py-4">
            <div className="flex items-center gap-1">
              <span className="text-2xl">⭐</span>
              <span className="font-semibold text-foreground">{product.rating}</span>
            </div>
            <span>·</span>
            <span className="underline cursor-pointer hover:text-foreground">
              {product.reviewCount} ulasan
            </span>
            <span>·</span>
            <span>{product.location}</span>
          </div>

          {/* Description & Facilities */}
          <ProductDescription product={product} />

          {/* Reviews */}
          <ReviewSection
            reviews={product.reviews}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>
      </div>

      {/* Related Products - Full Width */}
      <div className="px-4 lg:px-8 py-12 border-t">
        <RelatedProducts products={product.relatedProducts} />
      </div>

      {/* Mobile Bottom Button */}
      <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
        <DrawerTrigger asChild>
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-40">
            <Button size="lg" className="w-full gap-2">
              <CalendarIcon className="h-5 w-5" />
              {product.type === "tempat" ? "Cek Ketersediaan & Booking" : "Ajukan Sewa"}
            </Button>
          </div>
        </DrawerTrigger>
      </Drawer>
    </div>
  );
} 
