// "use client"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkSlam - Profile",
  description: "Discover and share links with the community.",
};

export default function ProfilePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="dark flex h-screen w-full bg-background">
        <SidebarNav />
        <SidebarInset className="dark flex flex-col h-full w-full bg-background text-foreground">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}