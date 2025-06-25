import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkSlam - Discover, Save, Slam",
  description: `A focused space for saving and slamming the links that deserve more than just a browser tab graveyard.
Where the most chaotic, curated, and captivating links find their home.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className} geistSans font-geist-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
