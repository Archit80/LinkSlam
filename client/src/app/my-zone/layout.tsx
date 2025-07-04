import { cookies } from "next/headers";
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MyZoneClientLayout from "./clientLayout";
// import "../globals.css"
import { UserProvider } from "@/contexts/userContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkSlam - My Zone",
  description: "Your ultimate bookmarking platform.",
};

export default async function MyZoneLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sidebarState = await cookieStore.get("sidebar:state");
  const defaultOpen = sidebarState?.value === "true";

  return (
    <div className={inter.className}>
      <MyZoneClientLayout defaultOpen={defaultOpen}>
        <UserProvider>{children}</UserProvider>
      </MyZoneClientLayout>
    </div>
  );
}
