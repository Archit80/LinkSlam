"use client"

import type React from "react"
// import { Inter } from "next/font/google"
import "../globals.css"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"

// const inter = Inter({ subsets: ["latin"] })

export default function MyZoneClientLayout({
  children,
  defaultOpen,
}: Readonly<{
  children: React.ReactNode
  defaultOpen: boolean
}>) {
  return (
      <div className="dark" >
        <SidebarProvider defaultOpen={defaultOpen}>
          <SidebarNav />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </div>
    
  )
}
