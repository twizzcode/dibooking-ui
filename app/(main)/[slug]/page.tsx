"use client";

import { notFound } from "next/navigation";
import { BrandHeader } from "./components/brand-header";
import { BrandSidebar } from "./components/brand-sidebar";
import { VenueItemCard } from "./components/venue-item-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  features: string[];
  price: number;
  priceUnit: string;
  images: string[];
  type: "VENUE" | "EQUIPMENT" | "PACKAGE";
  capacity: string | null;
  size: string | null;
}

interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  location: string;
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  coverImage: string | null;
  logoImage: string | null;
  rating: number;
  reviewCount: number;
  establishedYear: number | null;
  type: string;
  operatingHours: any;
  socialMedia: any;
  products: Product[];
  owner: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export default function BrandPage({ params }: BrandPageProps) {
  const { slug } = use(params);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await fetch(`/api/brands/${slug}`);
        if (res.status === 404) {
          setError("not-found");
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch brand");
        }
        const data = await res.json();
        setBrand(data.brand);
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error === "not-found" || !brand) {
    notFound();
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Terjadi kesalahan saat memuat data</p>
      </div>
    );
  }

  // Transform products to items format for existing components
  const items = brand.products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description || "",
    features: product.features,
    price: product.price,
    priceUnit: product.priceUnit,
    image: product.images[0] || "/placeholder.jpg",
    type: product.type.toLowerCase() as "venue" | "equipment" | "package",
    capacity: product.capacity || undefined,
    size: product.size || undefined,
  }));

  // Transform brand to match component props
  const brandData = {
    slug: brand.slug,
    name: brand.name,
    description: brand.description || "",
    location: brand.location,
    address: brand.address,
    phone: brand.phone || "",
    email: brand.email || "",
    website: brand.website || "",
    coverImage: brand.coverImage || "/placeholder-cover.jpg",
    logoImage: brand.logoImage || undefined,
    logoInitial: brand.name.charAt(0).toUpperCase(),
    rating: brand.rating,
    reviewCount: brand.reviewCount,
    establishedYear: brand.establishedYear || undefined,
    type: brand.type.toLowerCase() as "venue" | "rental" | "service",
    operatingHours: brand.operatingHours || {},
    socialMedia: brand.socialMedia || {},
    items,
  };

  const venueItems = items.filter((item) => item.type === "venue");
  const equipmentItems = items.filter((item) => item.type === "equipment");
  const packageItems = items.filter((item) => item.type === "package");

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <BrandHeader brand={brandData} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-6">\n          {/* Main Content Area */}
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Navigation Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  All Items
                </TabsTrigger>
                {venueItems.length > 0 && (
                  <TabsTrigger value="venues">
                    Venues
                  </TabsTrigger>
                )}
                {equipmentItems.length > 0 && (
                  <TabsTrigger value="equipment">
                    Equipment
                  </TabsTrigger>
                )}
                {packageItems.length > 0 && (
                  <TabsTrigger value="packages">
                    Packages
                  </TabsTrigger>
                )}
              </TabsList>

              {/* All Items */}
              <TabsContent value="all" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Available for Rent</h2>
                    <p className="text-sm text-muted-foreground">
                      Showing {items.length} items
                    </p>
                  </div>
                </div>
                {items.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <VenueItemCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Belum ada produk yang tersedia
                  </div>
                )}
              </TabsContent>

              {/* Venues */}
              {venueItems.length > 0 && (
                <TabsContent value="venues" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Venues</h2>
                      <p className="text-sm text-muted-foreground">
                        Showing {venueItems.length} venues
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {venueItems.map((item) => (
                      <VenueItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Equipment */}
              {equipmentItems.length > 0 && (
                <TabsContent value="equipment" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Equipment</h2>
                      <p className="text-sm text-muted-foreground">
                        Showing {equipmentItems.length} items
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {equipmentItems.map((item) => (
                      <VenueItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Packages */}
              {packageItems.length > 0 && (
                <TabsContent value="packages" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Packages</h2>
                      <p className="text-sm text-muted-foreground">
                        Showing {packageItems.length} packages
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {packageItems.map((item) => (
                      <VenueItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm" disabled>
                &lt;
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                &gt;
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-20">
              <BrandSidebar brand={brandData} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
