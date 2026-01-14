"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Building2, UserCircle, Crown, Shield } from "lucide-react"
import Image from "next/image"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "OWNER" | "ADMIN"
  avatar?: string
}

interface Brand {
  id: string
  name: string
  logoImage: string | null
  type: string
  plan?: "FREE" | "BASIC" | "PRO" | null
  owner?: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export const TeamSwitcher = React.memo(function TeamSwitcher({
  brand,
  onAddAdmin,
}: {
  brand: Brand | null
  onAddAdmin?: () => void
}) {
  const { isMobile } = useSidebar()

  if (!brand) {
    return null
  }

  const brandInitials = brand.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase()

  const planLabel = brand.plan === "BASIC"
    ? "Basic"
    : brand.plan === "PRO"
    ? "Pro"
    : "Free Tier"

  // Convert owner to team member format
  const members: TeamMember[] = brand.owner
    ? [
        {
          id: brand.owner.id,
          name: brand.owner.name,
          email: brand.owner.email,
          role: "OWNER" as const,
          avatar: brand.owner.image || undefined,
        },
      ]
    : []

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {brand.logoImage ? (
                <div className="relative aspect-square size-8 rounded-lg overflow-hidden">
                  <Image
                    src={brand.logoImage}
                    alt={brand.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-xs font-semibold">
                  {brandInitials || <Building2 className="size-4" />}
                </div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-medium capitalize">{brand.name}</span>
                <span className="truncate text-xs opacity-60">
                  {planLabel}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Tim Brand
            </DropdownMenuLabel>
            
            {members.length > 0 ? (
              <>
                {members.map((member) => (
                  <DropdownMenuItem
                    key={member.id}
                    className="gap-2 p-2"
                  >
                    {member.avatar ? (
                      <div className="relative size-6 rounded-full overflow-hidden border">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex size-6 items-center justify-center rounded-full border bg-muted">
                        <UserCircle className="size-4" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{member.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{member.email}</div>
                    </div>
                    {member.role === "OWNER" ? (
                      <Crown className="size-4 text-yellow-500" />
                    ) : (
                      <Shield className="size-4 text-blue-500" />
                    )}
                  </DropdownMenuItem>
                ))}
              </>
            ) : (
              <DropdownMenuItem disabled className="text-muted-foreground text-xs p-2">
                Belum ada anggota tim
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="gap-2 p-2 cursor-pointer"
              onClick={onAddAdmin}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium">Tambah Admin</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
})
