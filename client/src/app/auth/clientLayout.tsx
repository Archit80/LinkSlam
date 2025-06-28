"use client"

import type React from "react"
// import { Inter } from "next/font/google"
import "../globals.css"

// const inter = Inter({ subsets: ["latin"] })

export default function AuthClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dark">
      {children}
    </div>
   
  )
}
