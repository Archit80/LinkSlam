"use client"

import { Flame, Search, Shuffle, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PublicFeedHeaderProps {
  onNewLinkClick: () => void
}

export function PublicFeedHeader({ onNewLinkClick }: PublicFeedHeaderProps) {
  const popularTags = ["webdev", "ai", "design", "productivity", "tools", "news", "react", "nextjs"]

  return (
    <div className="relative bg-background border-b border-zinc-800">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-10 right-20 w-32 h-32 bg-red-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-red-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 p-8 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex text-red-500 items-center justify-center gap-3">
            <div className="flex size-10 text-red-500 items-center justify-center rounded-xl shadow-lg">
              <Flame className="size-10 text-red-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-red-primary">LinkSlam</h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Discover and share the web's most amazing links with the community
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-3xl space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for links, topics, or domains..."
              className="pl-12 pr-4 py-3 text-lg bg-zinc-800 border-zinc-700 focus-visible:ring-red-500 focus-visible:border-red-500 rounded-xl"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Glowing Random Link Button */}
            <Button
              className="bg-red-500 hover:bg-red-400 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-red-500/50 transition-all duration-300"
              style={{
                boxShadow:
                  "0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2), 0 0 60px rgba(239, 68, 68, 0.1)",
              }}
            >
              <Shuffle className="h-5 w-5 mr-2" />
              Random Link
            </Button>

            <Button
              variant="outline"
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-red-400 text-zinc-300 hover:text-red-400 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Trending
            </Button>
          </div>

          {/* Popular Tags */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-300 text-center">Popular Tags</h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-500 hover:text-red-500-foreground transition-colors duration-200 text-sm px-3 py-1 rounded-full bg-zinc-700 text-zinc-300"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-8 text-center text-sm text-zinc-500">
          <div>
            <span className="text-red-400 font-bold">10K+</span> Links
          </div>
          <div>
            <span className="text-red-400 font-bold">2.5K+</span> Users
          </div>
          <div>
            <span className="text-red-400 font-bold">50K+</span> Clicks
          </div>
        </div>
      </div>
    </div>
  )
}

