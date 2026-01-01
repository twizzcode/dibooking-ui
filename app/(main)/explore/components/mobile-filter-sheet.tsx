"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal } from "lucide-react";
import { ProductType } from "@/types/explore";

interface MobileFilterSheetProps {
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

export function MobileFilterSheet({
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
}: MobileFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 lg:hidden h-12">
          <SlidersHorizontal className="h-5 w-5" />
          Filter
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-full px-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-80">
        <SheetHeader>
          <SheetTitle>Filter Lanjutan</SheetTitle>
          <SheetDescription>
            Sesuaikan pencarian dengan filter di bawah ini
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Type Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Tipe Produk</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange("all")}
              >
                Semua
              </Button>
              <Button
                variant={selectedType === "barang" ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange("barang")}
              >
                Barang
              </Button>
              <Button
                variant={selectedType === "tempat" ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange("tempat")}
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
                    id={`brand-mobile-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => onBrandToggle(brand)}
                  />
                  <Label
                    htmlFor={`brand-mobile-${brand}`}
                    className="text-sm cursor-pointer font-normal"
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
                    id={`category-mobile-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onCategoryToggle(category)}
                  />
                  <Label
                    htmlFor={`category-mobile-${category}`}
                    className="text-sm cursor-pointer font-normal"
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
                    id={`location-mobile-${location}`}
                    checked={selectedLocations.includes(location)}
                    onCheckedChange={() => onLocationToggle(location)}
                  />
                  <Label
                    htmlFor={`location-mobile-${location}`}
                    className="text-sm cursor-pointer font-normal"
                  >
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex gap-2 sticky bottom-0 bg-background pt-4">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex-1"
            >
              Reset
            </Button>
            <Button onClick={() => onApplyFilters()} className="flex-1">
              Terapkan Filter
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
