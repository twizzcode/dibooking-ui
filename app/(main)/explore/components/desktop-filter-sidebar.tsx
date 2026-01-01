"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { ProductType } from "@/types/explore";

interface DesktopFilterSidebarProps {
  selectedType: ProductType | "all";
  selectedBrands: string[];
  selectedCategories: string[];
  selectedLocations: string[];
  brands: string[];
  categories: string[];
  locations: string[];
  activeFiltersCount: number;
  onTypeChange: (type: ProductType | "all") => void;
  onBrandToggle: (brand: string) => void;
  onCategoryToggle: (category: string) => void;
  onLocationToggle: (location: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export function DesktopFilterSidebar({
  selectedType,
  selectedBrands,
  selectedCategories,
  selectedLocations,
  brands,
  categories,
  locations,
  activeFiltersCount,
  onTypeChange,
  onBrandToggle,
  onCategoryToggle,
  onLocationToggle,
  onClearFilters,
  onApplyFilters,
}: DesktopFilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <Card className="sticky top-20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filter Lanjutan</h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Type Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Tipe Produk</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  onTypeChange("all");
                  onApplyFilters();
                }}
                className="text-xs"
              >
                Semua
              </Button>
              <Button
                variant={selectedType === "barang" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  onTypeChange("barang");
                  onApplyFilters();
                }}
                className="text-xs"
              >
                Barang
              </Button>
              <Button
                variant={selectedType === "tempat" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  onTypeChange("tempat");
                  onApplyFilters();
                }}
                className="text-xs"
              >
                Tempat
              </Button>
            </div>
          </div>

          <Separator />

          {/* Brand Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Brand / Penyewa</h3>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => {
                      onBrandToggle(brand);
                      setTimeout(() => onApplyFilters(), 0);
                    }}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm cursor-pointer font-normal leading-none"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Category Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Kategori Produk</h3>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => {
                      onCategoryToggle(category);
                      setTimeout(() => onApplyFilters(), 0);
                    }}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer font-normal leading-none"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Location Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Lokasi</h3>
            <div className="space-y-3">
              {locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={selectedLocations.includes(location)}
                    onCheckedChange={() => {
                      onLocationToggle(location);
                      setTimeout(() => onApplyFilters(), 0);
                    }}
                  />
                  <Label
                    htmlFor={`location-${location}`}
                    className="text-sm cursor-pointer font-normal leading-none"
                  >
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <>
              <Separator />
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-full"
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Reset Semua Filter
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
