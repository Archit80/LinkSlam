"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Globe, FlameIcon, LogOut, User2 } from "lucide-react";
import { useState, useEffect } from "react"; // Import useState and useEffect

import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/sidebar";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import { toast } from "sonner";

export function SidebarNav() {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const isMobile = useIsMobile();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const userData = {
    name: user?.name || "LinkSlam User",
    email: user?.email || "user@linkslam.com",
    image: user?.profileImage?.url || "/placeholder.svg",
  };

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      // --- THIS IS THE FIX ---
      // Check for the success property in the returned data, not the status.
      if (response && response.data) {
        router.replace("/");
      } else {
        toast.error("Logout failed", { description: "Please try again." });
      }
    } catch (error) {
      toast.error("Logout failed", { description: "An unexpected error occurred." });
    }
  };

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
  ];

  if (!hasMounted || loading) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        {/* Bottom nav for mobile */}
        <nav className="fixed dark bottom-0 left-0 right-0 z-50 flex items-center bg-card border-t border-zinc-700 py-2 px-4">
          {navMain.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={`w-1/3 flex flex-col items-center justify-center text-xs ${
                item.isActive
                  ? "text-red-500"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.title}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-1/3 flex dark flex-col items-center justify-center text-zinc-400 hover:text-zinc-200">
                <Avatar className="h-6 w-6 mb-1">
                  <AvatarImage src={userData.image} alt={userData.name} />
                  <AvatarFallback>LS</AvatarFallback>
                </Avatar>
                <span className="text-xs">You</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="center"
              className="dark bg-card border border-zinc-700 min-w-[10rem]"
            >
              <DropdownMenuLabel>
                <div className="flex dark items-center gap-2 px-1 py-1.5 text-zinc-100 text-left text-sm">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={userData.image} alt={userData.name} />
                    <AvatarFallback>LS</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium truncate">
                      {userData.name}
                    </span>
                    <span className="text-xs truncate">{userData.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/profile/${user?._id}`}
                    className="flex items-center gap-2 text-zinc-100"
                  >
                    <User2 className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400">
                <LogOut className="h-4 w-4 text-red-400" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </>
    );
  }

  // Desktop sidebar
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-card dark text-white">
        <div className="flex gap-2 py-2 items-center justify-start">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-red-500">
            <FlameIcon className="size-6" />
          </div>
          <span className="truncate font-bold text-lg">LinkSlam</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-card text-zinc-100">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={item.isActive}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="text-zinc-100 bg-card ">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userData.image} alt={userData.name} />
                    <AvatarFallback>LS</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm hover:cursor-pointer">
                    <span className="truncate font-semibold">
                      {userData.name}
                    </span>
                    <span className="truncate text-xs">{userData.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={4}
                className="dark bg-card min-w-56 border-zinc-500"
              >
                <DropdownMenuLabel>
                  <div className="flex  items-center gap-2 px-1 py-1.5 text-zinc-100 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={userData.image} alt={userData.name} />
                      <AvatarFallback>LS</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left text-sm">
                      <span className="truncate font-semibold">
                        {userData.name}
                      </span>
                      <span className="truncate text-xs">{userData.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/profile/${user?._id}`}
                      className="flex items-center gap-2 hover:cursor-pointer text-zinc-100"
                    >
                      <User2 className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-zinc-100 hover:text-red-400 hover:cursor-pointer "
                >
                  <LogOut className="h-4 w-4 text-red-400" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default SidebarNav;
