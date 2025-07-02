"use client"

import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MySlamZoneHeaderProps {
  onNewLinkClick: () => void
  currentFilter: "all" | "public" | "private"
  onFilterChange: (filter: "all" | "public" | "private") => void
}

export function MySlamZoneHeader({
  onNewLinkClick,
  currentFilter,
  onFilterChange,
}: MySlamZoneHeaderProps) {
  const popularTags = ["webdev", "ai", "design", "productivity", "tools", "news"]

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border-b border-zinc-800 bg-card">
      
      {/* LEFT: FILTER TABS - Private, Public, All */}
      <div className="flex gap-3">
        {["private", "public", "all"].map((type) => (
          <button
            key={type}
            onClick={() => onFilterChange(type as "all" | "public" | "private")}
            className={`relative pb-2 text-base font-medium transition-colors duration-200 hover:cursor-pointer ${
              currentFilter === type
                ? "text-red-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}

            {/* Underline for active tab */}
            {currentFilter === type && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400" />
            )}
          </button>
        ))}
      </div>

      {/* CENTER: SEARCH BAR + TAGS */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search links..."
            className="pl-9 bg-zinc-800 border-zinc-700 focus-visible:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm text-muted-foreground hidden sm:block">Tags:</span>
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200 text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* RIGHT: NEW LINK BUTTON */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onNewLinkClick}
          className="bg-red-primary text-red-500-foreground hover:text-white hover:bg-red-700 transition-colors duration-200 hover:cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Link
        </Button>
      </div>
    </div>
  )
}
