"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CalendarCheck,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  Newspaper,
  PieChart,
  Search,
  Settings2,
  SquareTerminal,
  Store,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import Image from "next/image"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Free Tier",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Setup",
          url: "#",
        },
        {
          title: "Items",
          url: "#",
        },
        {
          title: "Admin",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Cari",
      url: "/explore",
      icon: Search,
    },
    {
      name: "Booking Saya",
      url: "/my-bookings",
      icon: CalendarCheck,
    },
    {
      name: "Blog",
      url: "/blog",
      icon: Newspaper,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const admin = true;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="mb-2">
        <div className="flex items-center gap-2 py-1">
          <Image
            src="/favicon.ico"
            alt="Logo"
            width={39}
            height={39}
          />
          <span className="font-bold text-base group-data-[collapsible=icon]:hidden">Dibooking.id</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        {!admin ? (
          <div className="px-2 py-6 w-full">
            <Button className="w-full" size="lg" >
              <Store />
              Buat Brand
            </Button>
          </div>
        ) : (
          <>
            <div className="p-2 mt-4">
              <SidebarGroupLabel>Admin Menu</SidebarGroupLabel>
              <TeamSwitcher teams={data.teams} />
            </div>
            <NavMain items={data.navMain} />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
