"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { dummyProducts, brands, categories, locations } from "@/lib/dummy-data";
import { Product, ProductType } from "@/types/explore";
import { SearchBar } from "./components/search-bar";
import { BrandFilterChips } from "./components/brand-filter-chips";
import { DesktopFilterSidebar } from "./components/desktop-filter-sidebar";
import { MobileFilterSheet } from "./components/mobile-filter-sheet";
import { ActiveFilters } from "./components/active-filters";
import { ProductsGrid } from "./components/products-grid";

export default function ExplorePage() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(dummyProducts);
  const [suggestedBrands, setSuggestedBrands] = useState<string[]>([]);
  
  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<ProductType | "all">("all");
  const [sortBy, setSortBy] = useState<string>("relevance");

  const placeholders = [
    "Sewa Kamera DSLR Semarang",
    "Masjid Kampus UNNES",
    "Booking Studio Foto",
    "Sewa Alat Camping",
    "Rental Mobil dan Motor",
  ];

  // Get suggested brands based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const matchingBrands = brands.filter((brand) => {
        const matchesSearch = brand.toLowerCase().includes(searchQuery.toLowerCase());
        const hasProducts = dummyProducts.some(
          (product) =>
            product.brand === brand &&
            (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        return matchesSearch || hasProducts;
      });
      setSuggestedBrands(matchingBrands.slice(0, 3));
    } else {
      setSuggestedBrands([]);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    applyFilters(query);
  };

  const handleSearchSubmit = () => {
    setIsSearching(true);
    applyFilters(searchQuery);
  };

  const handleSearchReset = () => {
    setSearchQuery("");
    setSuggestedBrands([]);
    // Tetap di searching state tapi tampilkan semua produk
    applyFilters("");
  };

  const applyFilters = (query: string = searchQuery) => {
    let filtered = dummyProducts;

    // Search query filter
    if (query.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((product) =>
        selectedLocations.includes(product.location)
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((product) => product.type === selectedType);
    }

    // Sort
    if (sortBy === "price-low") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(filtered);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedType("all");
    setSortBy("relevance");
    setFilteredProducts(dummyProducts);
  };

  const activeFiltersCount =
    selectedBrands.length +
    selectedCategories.length +
    selectedLocations.length +
    (selectedType !== "all" ? 1 : 0);

  if (!isSearching) {
    return (
      <main className="flex flex-col items-center">
        <div className="mt-32 flex items-center gap-2 border border-indigo-200 rounded-full p-1 pr-3 text-sm font-medium text-indigo-500 bg-indigo-200/20">
          <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
            START
          </span>
          <p className="flex items-center gap-1">
            <span>Find what do you need</span>
            <ChevronRight />
          </p>
        </div>

        <h1 className="mt-7 text-center text-3xl md:text-6xl font-bold max-w-5xl text-foreground">
          Cari dan Booking Tempat atau Barang Favoritmu Sekarang Juga!
        </h1>

        <p className="text-center text-base text-foreground/70 max-w-xl mt-2">
          Carilah dengan mengetikkan nama brand atau kategori yang kamu inginkan
          dan temukan berbagai pilihan menarik yang tersedia untukmu.
        </p>

        <div className="flex items-center gap-4 mt-8 w-full">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full mx-auto lg:px-6 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Cari Produk</h1>
        <p className="text-muted-foreground">
          Temukan peralatan atau tempat yang tersedia untuk dipinjam atau disewa
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex gap-3 items-center">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            onSearch={handleSearchSubmit}
            onReset={handleSearchReset}
          />
          <MobileFilterSheet
            selectedType={selectedType}
            selectedBrands={selectedBrands}
            selectedCategories={selectedCategories}
            selectedLocations={selectedLocations}
            brands={brands}
            categories={categories}
            locations={locations}
            activeFiltersCount={activeFiltersCount}
            onTypeChange={setSelectedType}
            onBrandToggle={handleBrandToggle}
            onCategoryToggle={handleCategoryToggle}
            onLocationToggle={handleLocationToggle}
            onClearFilters={clearFilters}
            onApplyFilters={() => applyFilters()}
          />
        </div>

        <ActiveFilters
          selectedBrands={selectedBrands}
          selectedCategories={selectedCategories}
          selectedLocations={selectedLocations}
          selectedType={selectedType}
          onBrandRemove={handleBrandToggle}
          onCategoryRemove={handleCategoryToggle}
          onLocationRemove={handleLocationToggle}
          onTypeRemove={() => setSelectedType("all")}
        />
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex gap-6">
        <DesktopFilterSidebar
          selectedType={selectedType}
          selectedBrands={selectedBrands}
          selectedCategories={selectedCategories}
          selectedLocations={selectedLocations}
          brands={brands}
          categories={categories}
          locations={locations}
          activeFiltersCount={activeFiltersCount}
          onTypeChange={setSelectedType}
          onBrandToggle={handleBrandToggle}
          onCategoryToggle={handleCategoryToggle}
          onLocationToggle={handleLocationToggle}
          onClearFilters={clearFilters}
          onApplyFilters={() => applyFilters()}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Brand Filter Chips - Inside Content Area */}
          <BrandFilterChips suggestedBrands={suggestedBrands} />

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Menampilkan <span className="font-semibold text-foreground">{filteredProducts.length}</span> dari{" "}
                <span className="font-semibold text-foreground">{dummyProducts.length}</span> hasil
              </p>
            </div>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                applyFilters();
              }}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevansi</SelectItem>
                <SelectItem value="price-low">Harga Terendah</SelectItem>
                <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <ProductsGrid
            products={filteredProducts}
            onClearFilters={clearFilters}
          />

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button variant="outline" size="sm">
                &lt;
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                ...
              </Button>
              <Button variant="outline" size="sm">
                12
              </Button>
              <Button variant="outline" size="sm">
                &gt;
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
