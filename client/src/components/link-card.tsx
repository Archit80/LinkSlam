"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Globe, EyeOff, MoreHorizontal, Bookmark } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface LinkItem {
  _id: string
  title: string
  url: string
  tags: string[]
  isPublic: boolean
  isNSFW: boolean
  previewImage?: string  
  userId: string
  likes?: string[];
  sourceId?: string; // Optional, used to indicate if the link is saved
}

interface LinkCardProps {
  link: LinkItem
  onEdit: (link: LinkItem) => void
  onDelete: (id: string) => void
}

function formatUrl(url: string): string {
  const cleaned = url.replace(/^(https?:\/\/)?(www\.)?/i, "").toLowerCase();
  const [domain, ...pathParts] = cleaned.split("/");
  const path = pathParts.join("/");

  if (!path) return domain;

  const trimmedPath = path.length > 10 ? path.slice(0, 10) + "…" : path;

  return `${domain}/${trimmedPath}`;
}

export function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  const [showContent, setShowContent] = useState(false)

  const isBlurred = link.isNSFW && !showContent
  const isSaved = !!link.sourceId;
  
  return (
    <Card className="group relative hover:bg-transparent rounded-md overflow-hidden bg-card gap-2 border-zinc-800 hover:border-red-400 transition-all duration-300 ease-in-out">
      {link.previewImage && (
        <>
          <div
            className={`absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out ${isBlurred ? "blur-md" : ""}`}
            style={{
              backgroundImage: `url(${link.previewImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Single overlay for the entire card content on hover */}
          <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 bg-black/75 transition-opacity duration-500 ease-in-out" />
        </>
      )}

      {isBlurred && (
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-40 cursor-pointer"
          onClick={() => setShowContent(true)}
        >
          <EyeOff className="h-8 w-8 text-red-500 mr-2" />
          <span className="text-red-500 font-bold text-lg mt-2">NSFW Content </span>
        </div>
      )}

      <CardHeader className="pb-2 bg-transparent relative z-30">
        <CardTitle className="text-lg font-bold text-foreground leading-tight pr-4">
          <Link
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-primary transition-colors duration-300 ease-in-out"
          >
            {link.title}
          </Link>
        </CardTitle>
        <p className="text-md text-muted-foreground truncate">
          <Link 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-red-primary hover:underline hover:bg-background hover:px-2 transition-all duration-200 hover:py-2 rouneded-full hover:text-red-500"
          >
            {formatUrl(link.url)}
          </Link>
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 right-2 h-8 w-8 text-muted-foreground hover:bg-zinc-700 hover:text-foreground hover:cursor-pointer transition-all duration-300 ease-in-out"
            >
              <MoreHorizontal className="h-4 w-4 hover:cursor-pointer" />
              <span className="sr-only">Link actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-card dark border-zinc-700">
            <DropdownMenuItem   
              disabled={!link?._id || isSaved }
              onClick={() => onEdit(link)} 
              className="cursor-pointer hover:bg-zinc-800 text-white transition-colors duration-300 ease-in-out"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(link._id)}
              className="cursor-pointer text-red-400 dark hover:bg-zinc-800 hover:text-red-400 transition-colors duration-300 ease-in-out"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2 bg-transparent relative z-30 ">
        {link.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-zinc-700 text-zinc-300 hover:text-white hover:bg-red-500 hover:text-red-500-foreground transition-colors duration-250 ease-in-out text-xs px-2 py-1 rounded-full"
          >
            <span className="hover:text-white">
            {tag}
            </span>
          </Badge>
        ))}
        {link.isPublic ? (
          <Badge className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-full">
            <Globe className="h-3 w-3 mr-1" /> Public
          </Badge>
        ) : (
          <Badge className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-full">
            <Lock className="h-3 w-3 mr-1" /> Private
          </Badge>
        )}
        {link.sourceId && (
          <div className="absolute -top-10 right-3 z-40">
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full p-1.5">
              <Bookmark className="h-3 w-3 text-green-400 fill-green-400" />
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
