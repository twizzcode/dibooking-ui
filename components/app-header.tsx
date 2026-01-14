"use client";

import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, MessageCircleQuestionMark, Search, Bookmark, ShoppingCart, UserCircle, X, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function AppHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const lastQueryRef = useRef<string>("");
  const [user, setUser] = useState<{ name?: string; email?: string; image?: string } | null>(null);

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

  useEffect(() => {
    const query = searchParams.get("q") || "";
    lastQueryRef.current = query;
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await authClient.getSession();
      setUser(data?.user ?? null);
    };
    getSession();
  }, []);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (lastQueryRef.current === searchQuery) {
      return;
    }

    if (!trimmedQuery) {
      const timer = setTimeout(() => {
        router.push("/explore");
      }, 300);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(async () => {
      router.push(`/explore?q=${encodeURIComponent(trimmedQuery)}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [router, searchQuery]);

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
            {user ? (
              <Link href="/dashboard" className="flex items-center gap-2 text-xs font-semibold">
                <User className="h-4 w-4" />
                <span className="max-w-[140px] truncate">{user.name || user.email}</span>
              </Link>
            ) : (
              <div className="flex">
                <Link href="/sign-in" className="text-xs font-semibold">Daftar</Link>
                <Separator orientation="vertical" className="mx-2" />
                <Link href="/sign-in" className="text-xs font-semibold">Log In</Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 pt-4 pb-6">
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

          <div className="relative flex-1 w-auto px-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Cari produk, brand, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const trimmed = searchQuery.trim();
                    lastQueryRef.current = "";
                    router.push(trimmed ? `/explore?q=${encodeURIComponent(trimmed)}` : "/explore");
                  }
                }}
                className="pl-9 pr-20 h-11 rounded-full"
              />
              {searchQuery.trim() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    lastQueryRef.current = "";
                    setSearchQuery("");
                    router.push("/explore");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="mt-2">
              <div className="flex flex-wrap gap-2 text-xs">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      lastQueryRef.current = "";
                      setSearchQuery(search);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

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
