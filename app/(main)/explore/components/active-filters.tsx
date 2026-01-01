"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ProductType } from "@/types/explore";

interface ActiveFiltersProps {
  selectedBrands: string[];
  selectedCategories: string[];
  selectedLocations: string[];
  selectedType: ProductType | "all";
  onBrandRemove: (brand: string) => void;
  onCategoryRemove: (category: string) => void;
  onLocationRemove: (location: string) => void;
  onTypeRemove: () => void;
}

export function ActiveFilters({
  selectedBrands,
  selectedCategories,
  selectedLocations,
  selectedType,
  onBrandRemove,
  onCategoryRemove,
  onLocationRemove,
  onTypeRemove,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedCategories.length > 0 ||
    selectedLocations.length > 0 ||
    selectedType !== "all";

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {selectedBrands.map((brand) => (
        <Badge key={brand} variant="secondary" className="gap-1.5 px-3 py-1">
          {brand}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => onBrandRemove(brand)}
          />
        </Badge>
      ))}
      {selectedCategories.map((category) => (
        <Badge key={category} variant="secondary" className="gap-1.5 px-3 py-1">
          {category}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => onCategoryRemove(category)}
          />
        </Badge>
      ))}
      {selectedLocations.map((location) => (
        <Badge key={location} variant="secondary" className="gap-1.5 px-3 py-1">
          {location}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => onLocationRemove(location)}
          />
        </Badge>
      ))}
      {selectedType !== "all" && (
        <Badge variant="secondary" className="gap-1.5 px-3 py-1">
          {selectedType === "barang" ? "Barang" : "Tempat"}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={onTypeRemove}
          />
        </Badge>
      )}
    </div>
  );
}
