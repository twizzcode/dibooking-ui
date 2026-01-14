"use client"

import * as React from "react"
import { CalendarRange, ChartLine, ChevronRight, MonitorSmartphone, Settings, Package, ClipboardList, type LucideIcon } from "lucide-react"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export const NavMain = React.memo(function NavMain({
  items,
  brandSlug,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  brandSlug?: string | null
}) {

  const pathname = usePathname();
  const previewHref = brandSlug ? `/${brandSlug}` : "/preview";
  const isPreviewActive = brandSlug
    ? pathname === `/${brandSlug}` || pathname.startsWith(`/${brandSlug}/`)
    : pathname === "/preview";

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-1">
        {/* {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))} */}
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/dashboard"} asChild tooltip="Dashboard">
            <Link href="/dashboard">
              <ChartLine />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/dashboard/bookings"} asChild tooltip="Booking">
            <Link href="/dashboard/bookings">
              <ClipboardList />
              <span>Booking</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/dashboard/schedule"} asChild tooltip="Kalender">
            <Link href="/dashboard/schedule">
              <CalendarRange />
              <span>Kalender</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/dashboard/products"} asChild tooltip="Produk">
            <Link href="/dashboard/products">
              <Package />
              <span>Produk</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/dashboard/settings"} asChild tooltip="Pengaturan">
            <Link href="/dashboard/settings">
              <Settings />
              <span>Pengaturan</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={isPreviewActive} asChild tooltip="Pratinjau">
            <Link href={previewHref}>
              <MonitorSmartphone />
              <span>Pratinjau</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
})
