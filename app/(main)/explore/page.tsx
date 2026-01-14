"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Product } from "@/types/explore";
import { ProductsGrid } from "./components/products-grid";
import { useSearchParams } from "next/navigation";
import { MatchingBrands } from "./components/matching-brands";
import { Footer } from "@/components/home/footer";
import Image from "next/image";

interface APIProduct {
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
  brand: {
    id: string;
    name: string;
    slug: string;
    location: string;
    logoImage?: string | null;
  };
  _count?: {
    bookings: number;
  };
}

// Transform API product to UI product format
function transformProduct(apiProduct: APIProduct): Product {
  // Create slug from product name
  const productSlug = apiProduct.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: productSlug,
    brand: apiProduct.brand.name,
    brandSlug: apiProduct.brand.slug,
    brandLogo: apiProduct.brand.logoImage || "",
    category: apiProduct.type === "VENUE" ? "Tempat" : apiProduct.type === "EQUIPMENT" ? "Barang" : "Paket",
    type: apiProduct.type === "VENUE" ? "tempat" : "barang",
    location: apiProduct.brand.location || "",
    price: apiProduct.price,
    priceUnit: apiProduct.priceUnit,
    image: apiProduct.images[0] || "",
    rating: 4.5,
    reviewCount: apiProduct._count?.bookings || 0,
    rentCount: apiProduct._count?.bookings || 0,
    availability: "available",
    tags: (apiProduct._count?.bookings || 0) > 10 ? ["Populer"] : [],
  };
}

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const [isSearching, setIsSearching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const placeholders = [
    "Sewa Kamera DSLR Semarang",
    "Masjid Kampus UNNES",
    "Booking Studio Foto",
    "Sewa Alat Camping",
    "Rental Mobil dan Motor",
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.products) {
          // Transform API products to UI format
          const transformedProducts = data.products.map(transformProduct);
          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    if (query !== searchQuery) {
      setSearchQuery(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setTimeout(() => {
      applyFilters(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, products]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query);
  };

  const handleSearchReset = () => {
    setSearchQuery("");
    applyFilters("");
  };

  const applyFilters = (query: string = searchQuery) => {
    let filtered = [...products];

    // Search query filter
    if (query.trim()) {
      filtered = filtered.filter(
        (product: Product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );

    }

    setFilteredProducts(filtered);
  };

  const relatedBrands = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return [];

    const brandMap = new Map<
      string,
      { name: string; slug: string; location: string; productCount: number; logoImage?: string }
    >();

    filteredProducts.forEach((product) => {
      const slug = product.brandSlug || "";
      const key = slug || product.brand;
      const existing = brandMap.get(key);
      if (existing) {
        existing.productCount += 1;
        if (!existing.logoImage && product.brandLogo) {
          existing.logoImage = product.brandLogo;
        }
      } else {
        brandMap.set(key, {
          name: product.brand,
          slug,
          location: product.location,
          productCount: 1,
          logoImage: product.brandLogo || undefined,
        });
      }
    });

    return Array.from(brandMap.values())
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 3);
  }, [filteredProducts, searchQuery]);

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
    <div className="min-h-screen flex flex-col">
      <main className="w-full flex-1">
        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
          <div className="mx-auto">
            {relatedBrands.length > 0 && (
              <div className="mb-6">
                <MatchingBrands brands={relatedBrands} />
              </div>
            )}

            {!searchQuery.trim() && (
              <div className="mb-8 rounded-3xl border border-sidebar-border bg-sidebar p-8 sm:p-10 text-sidebar-foreground">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-wide text-sidebar-foreground/70">
                      Dibooking.id
                    </p>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
                      Butuh sewa tempat atau barang?
                      <br />
                      Booking di Dibooking.id saja.
                    </h2>
                    <p className="text-base text-sidebar-foreground/70">
                      Semua kebutuhan peminjamanmu dari satu tempat. Praktis,
                      aman, dan cepat.
                    </p>
                    <Button
                      size="lg"
                      onClick={() => {
                        const quick = "Kamera DSLR";
                        handleSearch(quick);
                      }}
                    >
                      Mulai Cari Sekarang
                    </Button>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar/80">
                    <Image
                      src="/placeholder.jpg"
                      alt="Ilustrasi sewa di Dibooking.id"
                      width={560}
                      height={360}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                  <p className="text-sm text-muted-foreground">
                    Menampilkan <span className="font-semibold text-foreground">{filteredProducts.length}</span> dari{" "}
                    <span className="font-semibold text-foreground">{products.length}</span> hasil
                  </p>
              </div>
            </div>

            {/* Products Grid */}
            <ProductsGrid
              products={filteredProducts}
              onClearFilters={handleSearchReset}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
