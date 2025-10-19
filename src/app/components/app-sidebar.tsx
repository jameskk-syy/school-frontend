"use client"

import * as React from "react"
import {
  Command,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { type LucideIcon } from "lucide-react"

type NavMainItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: { title: string; url: string }[]
}

type NavSecondaryItem = {
  title: string
  url: string
  icon: LucideIcon
}

type ProjectItem = {
  name: string
  url: string
  icon: LucideIcon
}

export function AppSidebar({
  userName,
  email,
  companyName,
  navMain,
  menuName,
  navSecondary,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  menuName:String,
  userName: string
  email: string
  companyName: string
  navMain: NavMainItem[]
  navSecondary: NavSecondaryItem[]
}) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{companyName}</span>
                  <span className="truncate text-xs">{userName}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navMain?.length > 0 && <NavMain menuName={menuName} items={navMain} />}
        {navSecondary?.length > 0 && (
          <NavSecondary items={navSecondary} className="mt-auto" />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{ name: userName, email, avatar: "/avatars/shadcn.jpg" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
