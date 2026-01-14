"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { getProductDetail } from "@/lib/product-detail-data";
import { ProductGallery } from "./components/product-gallery";
import { ProductDescription } from "./components/product-description";
import { OwnerInfo } from "./components/owner-info";
import { ReviewSection } from "./components/review-section";
import { RelatedProducts } from "./components/related-products";
import { BookingDrawerContent } from "./components/booking-drawer-content";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar as CalendarIcon, LogIn, Loader2, MapPin, Star } from "lucide-react";
import { use } from "react";
import { authClient } from "@/lib/auth-client";
import { ProductDetail } from "@/types/product-detail";
import Link from "next/link";
import { Footer } from "@/components/home/footer";
import { Card, CardContent } from "@/components/ui/card";

interface ProductPageProps {
  params: Promise<{ slug: string; productId: string }>;
}

// Transform API product to ProductDetail format
function transformAPIProduct(apiProduct: any, brandSlug: string): ProductDetail {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    type: apiProduct.type === "VENUE" ? "tempat" : "barang",
    brand: apiProduct.brand?.name || "",
    brandSlug: brandSlug,
    brandLogo: apiProduct.brand?.logoImage || "🏪",
    category: apiProduct.type === "VENUE" ? "Tempat" : "Barang",
    location: apiProduct.brand?.location || "",
    rating: apiProduct.brand?.rating || 4.5,
    reviewCount: apiProduct._count?.bookings || 0,
    price: apiProduct.price,
    priceUnit: apiProduct.priceUnit || "hari",
    images: apiProduct.images?.length > 0 ? apiProduct.images : ["/placeholder.jpg"],
    description: apiProduct.description || "",
    facilities: apiProduct.features?.map((f: string) => ({
      icon: "check",
      label: f,
      value: "",
    })) || [],
    owner: {
      name: apiProduct.brand?.name || "",
      avatar: apiProduct.brand?.logoImage || "🏪",
      location: apiProduct.brand?.location || "",
      memberSince: apiProduct.brand?.createdAt ? `Sejak ${new Date(apiProduct.brand.createdAt).getFullYear()}` : "Member",
      verified: true,
    },
    brandContact: {
      phone: apiProduct.brand?.phone || undefined,
      email: apiProduct.brand?.email || undefined,
      address: apiProduct.brand?.address || undefined,
    },
    reviews: [], // Will be fetched separately when implemented
    relatedProducts: [], // Will be fetched separately
    specifications: apiProduct.capacity ? [
      { label: "Kapasitas", value: apiProduct.capacity },
      ...(apiProduct.size ? [{ label: "Ukuran", value: apiProduct.size }] : []),
    ] : [],
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { slug, productId } = use(params);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Fetch product from API or fallback to mock
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      
      // Check if productId looks like a CUID (starts with 'c' and has alphanumeric chars)
      // Redirect to 404 if someone tries to access by ID
      const isCuid = /^c[a-z0-9]{24,}$/i.test(productId);
      if (isCuid) {
        console.warn('Direct ID access detected, redirecting to 404');
        setProduct(null);
        setIsLoading(false);
        return;
      }
      
      try {
        // Normalize slug for comparison (handle multiple spaces/hyphens)
        const normalizeSlug = (str: string) => 
          str.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        
        // Convert slug back to search query
        const searchName = productId.replace(/-/g, ' ');
        
        // Find product by slug/name from brand's products
        const res = await fetch(`/api/products?brandSlug=${slug}&search=${encodeURIComponent(searchName)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            // Find exact match by normalized slug
            const normalizedProductId = normalizeSlug(productId);
            const exactMatch = data.products.find((p: any) => {
              const pSlug = normalizeSlug(p.name);
              return pSlug === normalizedProductId;
            });
            
            if (exactMatch) {
              setProduct(transformAPIProduct(exactMatch, slug));
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching from API:", error);
      }
      
      // Fallback to mock data
      const mockProduct = getProductDetail(productId);
      setProduct(mockProduct || null);
      setIsLoading(false);
    };
    
    fetchProduct();
  }, [productId, slug]);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();
      setIsAuthenticated(!!session?.data?.user);
    };
    checkAuth();
  }, []);

  const handleBookingClick = () => {
    if (isAuthenticated === false) {
      setShowLoginDialog(true);
    } else if (isAuthenticated === true) {
      setIsOpen(true);
    }
  };

  const handleLogin = () => {
    const currentUrl = window.location.pathname;
    router.push(`/sign-in?callbackUrl=${encodeURIComponent(currentUrl)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Skeleton className="w-full aspect-[4/3] rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }
  return (
    <div className="min-h-screen">
      {/* Login Required Dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Diperlukan</AlertDialogTitle>
            <AlertDialogDescription>
              Anda harus login terlebih dahulu untuk melakukan booking. Silakan login untuk melanjutkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogin} className="gap-2">
              <LogIn className="h-4 w-4" />
              Login Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content - 2 Column Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-4">
          <Button variant="ghost" size="lg" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Gallery (full width until center) + Brand Info + Reviews */}
          <div className="space-y-6">
            <div className="rounded-2xl border bg-background p-4">
              <ProductGallery
                images={product.images}
                name={product.name}
                thumbnailPosition="right"
              />
            </div>

            <OwnerInfo owner={product.owner} brandSlug={product.brandSlug} />

            <div className="rounded-2xl border bg-background p-6">
              <ReviewSection
                reviews={product.reviews}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </div>
          </div>

          {/* Right Column: Product Details + CTA */}
          <div className="space-y-6">
            <div className="rounded-2xl border bg-background p-6 space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-foreground">{product.rating}</span>
                  </span>
                  <span>·</span>
                  <span>{product.reviewCount} ulasan</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {product.location}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Harga sewa
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-primary">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  /{product.priceUnit}
                </span>
              </div>

              <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleBookingClick}
                  disabled={isAuthenticated === null}
                >
                  <CalendarIcon className="h-5 w-5" />
                  {product.type === "tempat"
                    ? "Cek Ketersediaan & Sewa"
                    : "Ajukan Sewa"}
                </Button>
                <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-full! max-w-full! sm:max-w-full! lg:w-1/2! lg:max-w-[50vw]! rounded-none">
                  <BookingDrawerContent product={product} />
                </DrawerContent>
              </Drawer>
            </div>

            <div className="rounded-2xl border bg-background p-6">
              <ProductDescription product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products - Full Width */}
      <div className="border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
          <RelatedProducts products={product.relatedProducts} />
        </div>
      </div>

      {/* Mobile Bottom Button */}
      <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
        <DrawerTrigger asChild>
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-40">
            <Button size="lg" className="w-full gap-2">
              <CalendarIcon className="h-5 w-5" />
              {product.type === "tempat" ? "Cek Ketersediaan & Booking" : "Ajukan Sewa"}
            </Button>
          </div>
        </DrawerTrigger>
      </Drawer>

      <Footer />
    </div>
  );
}
