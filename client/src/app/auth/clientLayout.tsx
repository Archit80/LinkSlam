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
    <html lang="en" className="dark">
      <body >
        {children}
      </body>
    </html>
  )
}
