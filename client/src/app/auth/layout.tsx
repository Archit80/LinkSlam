import type { Metadata } from "next"
import type React from "react"
import AuthClientLayout from "./clientLayout"

export const metadata: Metadata = {
  title: "LinkSlam - Login or Sign Up",
  description: "Log in or sign up to slam your favorite links.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthClientLayout>
      {children}
    </AuthClientLayout>
  )
}
