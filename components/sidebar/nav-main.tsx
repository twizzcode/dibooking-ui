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
}) {

  const pathname = usePathname();

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
          <SidebarMenuButton isActive={pathname === "/dashboard/bookings"} asChild tooltip="Bookings">
            <Link href="/dashboard/bookings">
              <ClipboardList />
              <span>Bookings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/dashboard/schedule"} asChild tooltip="Schedule">
            <Link href="/dashboard/schedule">
              <CalendarRange />
              <span>Schedule</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/dashboard/products"} asChild tooltip="Products">
            <Link href="/dashboard/products">
              <Package />
              <span>Products</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={pathname === "/dashboard/settings"} asChild tooltip="Settings">
            <Link href="/dashboard/settings">
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Preview">
            <Link href="/preview">
              <MonitorSmartphone />
              <span>Preview</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
})
