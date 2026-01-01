"use client";

import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/lib/brand-data";
import { BrandHeader } from "./components/brand-header";
import { BrandSidebar } from "./components/brand-sidebar";
import { VenueItemCard } from "./components/venue-item-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use } from "react";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export default function BrandPage({ params }: BrandPageProps) {
  const { slug } = use(params);
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const venueItems = brand.items.filter((item) => item.type === "venue");
  const equipmentItems = brand.items.filter((item) => item.type === "equipment");
  const packageItems = brand.items.filter((item) => item.type === "package");

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <BrandHeader brand={brand} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto lg:px-6 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-6">
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
                      Showing {brand.items.length} items
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {brand.items.map((item) => (
                    <VenueItemCard key={item.id} item={item} />
                  ))}
                </div>
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
              <BrandSidebar brand={brand} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
