"use client"
import Link from "next/link"
import { Home, Globe, Settings, ChevronRight, FlameIcon, LogOut } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { authService } from "@/services/authService"
import { useRouter } from "next/navigation"

// Dummy data for the sidebar
const userData = {
  name: "Slammer User",
  email: "user@linkslam.com",
  avatar: "/placeholder.svg?height=32&width=32",
}

const navMain = [
  {
    title: "My Slam Zone",
    url: "/", // Link to the root for My Slam Zone
    icon: Home,
    isActive: true,
    items: [
      { title: "All Links", url: "/" },
      { title: "Starred", url: "#" },
      { title: "Archived", url: "#" },
      { title: "My Slams (Public)", url: "#" },
    ],
  },
  {
    title: "Public Feed",
    url: "/public-feed", // Link to the new public feed page
    icon: Globe,
    items: [
      { title: "Trending", url: "/public-feed" },
      { title: "Recent", url: "#" },
      { title: "Discover", url: "#" },
    ],
  },
]


export function SidebarNav() {
  const isMobile = useIsMobile()
  const router = useRouter();

  const handleLogout = async () => {
    const response = await authService.logout();
    console.log("Logout response:", response);
    if (response.status === 200) {
    console.log("User logged out");
    router.replace("/"); // Redirect to the auth page after logout
    }
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
              <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
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
                  className=" dark data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
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
                className=" border-zinc-500 w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg dark bg-card "
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal dark bg-card ">
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
                    <Settings className="mr-2 h-4 w-4 dark text-zinc-200 " />
                    <span className="text-zinc-100 " >Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:text-red-primary dark bg-card dark" onClick={handleLogout} >
                  <LogOut className="mr-2 h-4 w-4 text-zinc-100 hover:text-red-primary" />
                  <span className="text-zinc-100 ">Log out</span>
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
