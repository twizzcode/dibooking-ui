"use client";

import { MessageCircleQuestionMark } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Array<{ match: (pathname: string) => boolean; title: string }> = [
  { match: (pathname) => pathname === "/dashboard", title: "Dashboard" },
  { match: (pathname) => pathname.startsWith("/dashboard/bookings"), title: "Booking" },
  { match: (pathname) => pathname.startsWith("/dashboard/schedule"), title: "Kalender" },
  { match: (pathname) => pathname.startsWith("/dashboard/products"), title: "Produk" },
  { match: (pathname) => pathname.startsWith("/dashboard/settings"), title: "Pengaturan" },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const pageTitle =
    PAGE_TITLES.find((item) => item.match(pathname))?.title ?? "Dashboard";

  return (
    <header className="sticky top-0 z-40 bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="mailto:twizzcode@gmail.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircleQuestionMark className="h-4 w-4" />
              <span>Hubungi kami</span>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
