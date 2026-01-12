"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  onReset,
}: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
      <Input
        placeholder="Cari nama produk, brand, atau kategori..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
        className="pl-12 pr-24 h-12 text-base rounded-full"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button size="sm" onClick={onSearch} className="h-8 rounded-full px-4">
          <Search className="h-4 w-4 mr-1" />
          Cari
        </Button>
      </div>
    </div>
  );
}
