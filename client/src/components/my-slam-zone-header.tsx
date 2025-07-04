"use client";

import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface MySlamZoneHeaderProps {
  onNewLinkClick: () => void;
  currentFilter: "all" | "public" | "private";
  onFilterChange: (filter: "all" | "public" | "private") => void;
  topTags: string[];
  onTagClick: (tag: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearch: () => void;
}

export function MySlamZoneHeader({
  onNewLinkClick,
  currentFilter,
  onFilterChange,
  onTagClick,
  topTags,
  onSearch,
  setSearchQuery,
  searchQuery
}: MySlamZoneHeaderProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="flex flex-col border-b border-zinc-800 bg-card">
      {/* Mobile Filter Toggle + Search */}
      <div className="flex items-center justify-between gap-2 p-3 md:hidden">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="bg-zinc-800 border-zinc-700 text-zinc-300"
        >
          <Filter className="h-4 w-4 mr-2" />
          <span>{currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}</span>
        </Button>
        
        <div className="relative flex-1 max-w-[calc(100%-110px)]">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
            className="pl-2 h-9 bg-zinc-800 border-zinc-700 focus-visible:ring-red-500 text-sm"
          />
          <button className="hover:bg-red-primary h-7 w-7 flex items-center justify-center absolute text-white right-1 top-1/2 rounded-full transition-colors duration-200 hover:cursor-pointer -translate-y-1/2"
          onClick={()=>onSearch?.()}
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>
        
        <Button
          onClick={onNewLinkClick}
          size="icon"
          className="bg-red-primary hover:bg-red-600 h-9 w-9 rounded-full text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Mobile Filter Options - Collapsible */}
      {showMobileFilters && (
        <div className="flex flex-col p-3 pt-0 pb-4 md:hidden space-y-3">
          <div className="flex justify-between gap-2 border-b border-zinc-700/50 pb-3">
            {["private", "public", "all"].map((type) => (
              <Button
                key={type}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onFilterChange(type as "all" | "public" | "private");
                  setShowMobileFilters(false);
                }}
                className={`flex-1 ${
                  currentFilter === type
                    ? "bg-zinc-800 text-red-400 border border-zinc-700"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
          
          {topTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-zinc-500 w-full mb-1">
                Most Used Tags:
              </span>
              {topTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  onClick={() => {
                    onTagClick(tag);
                    setShowMobileFilters(false);
                  }}
                  className="cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200 text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-row items-center justify-between gap-4 p-4">
        {/* LEFT: FILTER TABS - Private, Public, All */}
        <div className="flex gap-4">
          {["private", "public", "all"].map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange(type as "all" | "public" | "private")}
              className={`relative text-base font-medium transition-colors duration-200 hover:cursor-pointer ${
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
            <Input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
              className="pl-2 bg-zinc-800 border-zinc-700 focus-visible:ring-red-500"
            />
            <button 
              className="hover:bg-red-primary h-8 w-8 flex items-center justify-center absolute text-white right-1 top-1/2 rounded-full transition-colors duration-200 hover:cursor-pointer -translate-y-1/2"
              onClick={()=>onSearch?.()}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {topTags.length > 0 && (
              <>
                <span className="text-sm text-muted-foreground">
                  Most Used Tags:
                </span>
                {topTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    onClick={() => onTagClick(tag)}
                    className="cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200 text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </>
            )}
          </div>
        </div>

        {/* RIGHT: NEW LINK BUTTON */}
        <div className="flex items-center gap-4">
          <Button
            onClick={onNewLinkClick}
            className="bg-red-primary text-white hover:bg-red-600 transition-colors duration-200 hover:cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Link
          </Button>
        </div>
      </div>
    </div>
  );
}
