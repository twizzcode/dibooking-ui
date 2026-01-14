"use client";

import { Footer } from "@/components/home/footer";
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppHeader } from "@/components/app-header";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideHeader =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/become-provider";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {!hideHeader && <AppHeader />}
        <div className="flex flex-1 flex-col">
            {children}
        </div>
        {/* <Footer /> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
