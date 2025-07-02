"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Globe, Settings, FlameIcon, LogOut } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { authService } from "@/services/authService"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/userContext"

export function SidebarNav() {
  const pathname = usePathname()
  const { user, loading } = useUser();

  const userData = {
    name: user?.name || "LinkSlam User",
    email: user?.email || "user@linkslam.com",
  }

  const isMobile = useIsMobile()
  const router = useRouter();

  const handleLogout = async () => {
    const response = await authService.logout();
    console.log("Logout response:", response);
    if (response.status === 200) {
      console.log("User logged out");
      router.replace("/");
    }
  }

  // Simple navigation items - no sub-items
  const navMain = [
    {
      title: "Public Feed",
      url: "/public-feed",
      icon: Globe,
      isActive: pathname === "/public-feed",
    },
    {
      title: "My Slam Zone",
      url: "/my-zone",
      icon: Home,
      isActive: pathname === "/my-zone" || pathname === "/",
    },
  ]

  if (loading) {
    return <div className="flex dark bg-card items-center justify-center h-screen">Loading...</div>
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-zinc-900 dark text-white">
        <div className="flex gap-2 py-2 items-center shadow-none justify-start">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-red-500 flex-row">
            <FlameIcon className="size-6" />
          </div>
          <span className="truncate font-bold text-lg">LinkSlam</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-zinc-900 text-zinc-100">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="text-zinc-100 bg-zinc-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="dark data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="rounded-lg">LS</AvatarFallback>
                  </Avatar>
                  <div className="grid dark flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userData.name}</span>
                    <span className="truncate text-xs">{userData.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="border-zinc-500 w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg dark bg-card"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal dark bg-card">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-zinc-100 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                      <AvatarFallback className="rounded-lg">SU</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userData.name}</span>
                      <span className="truncate text-xs">{userData.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="dark">
                  <DropdownMenuItem className="dark bg-card text-zinc-100">
                    <Link href={`/profile/${user?._id}`} className="flex items-center gap-2">
                      <Settings className="mr-2 h-4 w-4 dark text-zinc-200" />
                      <span className="text-zinc-100">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:text-red-primary dark bg-card dark hover:cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 text-zinc-100 hover:text-red-primary" />
                  <span className="text-zinc-100">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default SidebarNav
