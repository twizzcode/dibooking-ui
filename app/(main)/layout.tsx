"use client";

import { Footer } from "@/components/home/footer";
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppHeader } from "@/components/app-header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col">
            {children}
        </div>
        {/* <Footer /> */}
      </SidebarInset>
    </SidebarProvider>
  );
}