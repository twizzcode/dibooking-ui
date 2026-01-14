"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Calendar,
  DollarSign,
  MapPin,
  Package,
  Loader2,
} from "lucide-react";
import { ProductCard } from "./components/product-card";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface Product {
  id: string;
  name: string;
  description: string | null;
  type: "VENUE" | "EQUIPMENT" | "PACKAGE";
  price: number;
  priceUnit: "hour" | "day" | "package";
  images: string[];
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  bookingCount: number;
  revenue: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "VENUE" | "EQUIPMENT">("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data: session } = await authClient.getSession();
      if (!session?.user) return;

      // Get user's brand
      const brandRes = await fetch(`/api/brands?ownerId=${session.user.id}`);
      const brandData = await brandRes.json();

      if (!brandData.brands || brandData.brands.length === 0) return;

      const brand = brandData.brands[0];

      // Fetch products
      const res = await fetch(`/api/products?brandId=${brand.id}`);
      const data = await res.json();

      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesType = filterType === "all" || product.type === filterType;

    return matchesSearch && matchesType;
  });

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "ACTIVE").length,
    totalRevenue: products.reduce((sum, p) => sum + p.revenue, 0),
    totalBookings: products.reduce((sum, p) => sum + p.bookingCount, 0),
  };

  return (
    <div className="flex flex-col h-full">
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 space-y-6">
          <div className="flex items-center justify-end">
            <Button onClick={() => router.push("/dashboard/products/add")}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Produk</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Produk Aktif</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Booking</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                  <p className="text-2xl font-bold">
                    Rp {(stats.totalRevenue / 1000000).toFixed(0)}jt
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
                <TabsList>
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="VENUE">Tempat</TabsTrigger>
                  <TabsTrigger value="EQUIPMENT">Barang</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Card>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={(id) => router.push(`/dashboard/products/${id}`)}
                    onEdit={(id) => router.push(`/dashboard/products/${id}/edit`)}
                    onDelete={async (id) => {
                      if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
                        try {
                          const res = await fetch(`/api/products/${id}`, {
                            method: "DELETE",
                          });
                          if (res.ok) {
                            fetchProducts();
                          }
                        } catch (error) {
                          console.error("Failed to delete product:", error);
                        }
                      }
                    }}
                  />
                ))}
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && !isLoading && (
                <Card className="p-12 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Tidak ada produk ditemukan</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {products.length === 0
                      ? "Mulai tambahkan produk pertama Anda"
                      : "Coba ubah filter atau kata kunci pencarian Anda"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (products.length === 0) {
                        router.push("/dashboard/products/add");
                      } else {
                        setSearchQuery("");
                        setFilterType("all");
                      }
                    }}
                  >
                    {products.length === 0 ? "Tambah Produk" : "Reset Filter"}
                  </Button>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
