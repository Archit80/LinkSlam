"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EyeOff, MoreHorizontal, Flame, Bookmark, Copy } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface LinkItem {
  id: string
  title: string
  url: string
  tags: string[]
  isPrivate: boolean
  isNSFW: boolean
  previewImage?: string // Optional property for preview image URL
}

interface LinkCardProps {
  link: LinkItem
  onEdit: (link: LinkItem) => void
  onDelete: (id: string) => void
  isPublicFeed?: boolean
  slammedBy?: { id: string; username: string } 
};

export function LinkCard({ link, onEdit, onDelete, isPublicFeed = false, slammedBy }: LinkCardProps) {
  const domain = link.url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0]
  const [showContent, setShowContent] = useState(false)

  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100) + 1) // Random like count for demo

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const isBlurred = link.isNSFW && !showContent

  return (
    <Card className="group gap-2 py-4 pt-6 relative rounded-lg overflow-hidden bg-card border-zinc-800 hover:border-red-400 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-1 hover:bg-transparent">
      {link.previewImage && (
        <>
          {/* Image appears only on hover, no opacity transition */}
          <div
            className={`absolute inset-0 z-10 hidden group-hover:block ${isBlurred ? "blur-md" : ""}`}
            style={{
              backgroundImage: `url(${link.previewImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Single overlay for the entire card content on hover */}
          <div className="absolute inset-0 z-20 hidden group-hover:block bg-black/75 transition-all duration-500" />
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

      <CardHeader className="pb-2 relative z-30 bg-transparent ">
        <CardTitle className="text-lg font-bold text-foreground leading-tight pr-8">
          <Link
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-primary transition-colors"
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
            {domain}
          </Link>
        </p>
        {isPublicFeed ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigator.clipboard.writeText(link.url)}
            className="absolute top-0 right-4 h-8 w-8 text-muted-foreground hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy link</span>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:bg-zinc-700 hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Link actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-card border-zinc-700">
              <DropdownMenuItem onClick={() => onEdit(link)} className="cursor-pointer hover:bg-zinc-800">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(link.id)}
                className="cursor-pointer text-red-400 hover:bg-zinc-800 hover:text-red-400"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2 pb-10 relative z-30  ">
        {link.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-zinc-700 text-zinc-300 hover:bg-red-500 hover:text-red-500-foreground transition-colors duration-200 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </Badge>
        ))}

        {/* Add the "Slammed by" section */}
        {isPublicFeed && slammedBy && (
          <div className="w-full mt-2 mb-1">
            <span className="text-xs text-zinc-400">
              Slammed by:{" "}
              <Link
                href={`/profile/${slammedBy.id}`}
                className="text-red-400 hover:text-red-300 hover:underline transition-colors font-medium"
              >
                @{slammedBy.username}
              </Link>
            </span>
          </div>
        )}

        {isPublicFeed && (
          <div className="absolute bottom-0 right-4 flex items-center gap-1 z-30 bg-transparent">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-1 h-8 px-2 hover:bg-zinc-700 transition-colors ${
                isLiked ? "text-red-400" : "text-muted-foreground hover:text-red-400"
              }`}
            >
              <Flame className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm">{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={`h-8 w-8 p-0 hover:bg-zinc-700 transition-colors ${
                isSaved ? "text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
