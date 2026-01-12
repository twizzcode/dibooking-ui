"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, MessageCircleQuestionMark, Search, Bookmark, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const popularSearches = [
    "Kamera DSLR",
    "Studio Foto",
    "Masjid",
    "Aula",
    "Lapangan",
    "Gedung Pertemuan",
    "Tenda",
    "Sound System",
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/explore');
    }
  };

  const handleQuickFilter = (query: string) => {
    router.push(`/explore?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-background shadow-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="w-full flex justify-between items-center py-2">
          <div className="flex">
            <Link href="" className="text-sm flex">
              <span className="text-xs">Mulai Buat Brand</span>
            </Link>
            <Separator orientation="vertical" className="mx-4" />
            <span className="text-xs">Ikuti kami di : </span>
            <Instagram className="ml-2 h-4 w-4" />
          </div>
          <div className="flex gap-8">
            <Link href="" className="text-sm flex">
              <MessageCircleQuestionMark className="h-4 w-4" />
              <span className="ml-2 text-xs">Bantuan</span>
            </Link>
            <div className="flex">
              <Link href="/sign-in" className="text-xs font-semibold">Daftar</Link>
              <Separator orientation="vertical" className="mx-2" />
              <Link href="/sign-in" className="text-xs font-semibold">Log In</Link>
            </div>
          </div>
        </div>
        {/* Top Row: Logo, Search, Mode Toggle */}
        <div className="flex items-center gap-4 pt-4 pb-6">
          {/* Logo & Sidebar Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/favicon.ico"
                alt="Dibooking Logo"
                width={32}
                height={32}
                className="shrink-0"
              />
              <span className="font-bold text-lg">Dibooking.id</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-4xl ml-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Cari produk, brand, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="pl-10 pr-20 h-12 rounded-full"
              />
              <Button
                size="sm"
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-10 px-4 rounded-full"
              >
                <Search className="h-4 w-4" />
                <span className="ml-2 text-sm">Cari</span>
              </Button>
            </div>

            <div className="mt-2">
              <div className="flex flex-wrap gap-2 text-xs">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleQuickFilter(search)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex">
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/bookmarks" className="text-muted-foreground hover:text-foreground transition-colors">
              <Bookmark className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <ModeToggle />
          </div>
        </div>
        </div>
    </header>
  );
}
