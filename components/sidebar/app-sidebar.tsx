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
import { authClient } from "@/lib/auth-client"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

interface Brand {
  id: string
  name: string
  logoImage: string | null
  type: string
  slug?: string | null
  ownerId: string
  owner?: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

// This is sample data.
const data = {
  navMain: [
    {
      title: "Pengaturan",
      url: "/dashboard/settings",
      icon: Settings2,
      isActive: true,
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
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [brand, setBrand] = React.useState<Brand | null>(null)

  const refreshSession = React.useCallback(async () => {
    const { data } = await authClient.getSession()
    setSession(data)
  }, [])

  React.useEffect(() => {
    const getSession = async () => {
      await refreshSession()
      setLoading(false)
    }
    getSession()
  }, [refreshSession])

  React.useEffect(() => {
    if (!loading) {
      refreshSession()
    }
  }, [pathname, loading, refreshSession])

  // Fetch brand when user is provider
  React.useEffect(() => {
    const fetchBrand = async () => {
      if (!session?.user) return
      
      const userRole = session.user.role
      if (userRole === "PROVIDER" || userRole === "ADMIN") {
        try {
          const res = await fetch(`/api/brands?ownerId=${session.user.id}`)
          const data = await res.json()
          if (data.brands && data.brands.length > 0) {
            setBrand(data.brands[0])
          }
        } catch (error) {
          console.error("Error fetching brand:", error)
        }
      }
    }
    fetchBrand()
  }, [session])

  const userRole = React.useMemo(() => {
    return session?.user?.role || "USER"
  }, [session])

  const isProvider = React.useMemo(() => {
    return userRole === "PROVIDER" || userRole === "ADMIN"
  }, [userRole])

  const isAdmin = React.useMemo(() => {
    return userRole === "ADMIN"
  }, [userRole])

  if (loading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center gap-3 px-1">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={40}
              height={40}
              className="shrink-0"
            />
            <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-base">Dibooking.id</span>
              <Link 
                href="/changelog" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                v0.1.0
              </Link>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  if (!session) {
    router.push("/sign-in")
    return null
  }

  const user = session.user

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-1">
          <Image
            src="/favicon.ico"
            alt="Logo"
            width={40}
            height={40}
            className="shrink-0"
          />
          <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-base">Dibooking.id</span>
            <Link 
              href="/changelog" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              v0.1.0
            </Link>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        {!isProvider ? (
          <div className="px-2 py-6 w-full">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => router.push("/become-provider")}
            >
              <Store />
              Buat Brand
            </Button>
          </div>
        ) : (
          <>
            <div className="p-2 mt-4">
              <SidebarGroupLabel>Menu Admin</SidebarGroupLabel>
              <TeamSwitcher 
                brand={brand} 
                onAddAdmin={() => {
                  // TODO: Implement add admin dialog
                  console.log("Add admin clicked")
                }}
              />
            </div>
            <NavMain items={data.navMain} brandSlug={brand?.slug} />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user.name,
          email: user.email,
          avatar: user.image || "",
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
