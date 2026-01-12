"use client";

import { QuickFilters } from "@/app/(main)/explore/components/quick-filters";
import { MatchingBrands } from "@/app/(main)/explore/components/matching-brands";

interface BrandInfo {
  name: string;
  slug: string;
  location: string;
  productCount: number;
}

interface ExploreHeaderProps {
  matchingBrands: BrandInfo[];
  onQuickFilter: (query: string) => void;
}

export function ExploreHeader({
  matchingBrands,
  onQuickFilter,
}: ExploreHeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4">
        <div className="max-w-6xl mx-auto">
          {/* Matching Brands */}
          {matchingBrands.length > 0 && (
            <div className="mb-3">
              <MatchingBrands brands={matchingBrands} />
            </div>
          )}

          {/* Quick Filters */}
          <QuickFilters onFilterClick={onQuickFilter} />
        </div>
      </div>
    </div>
  );
}
