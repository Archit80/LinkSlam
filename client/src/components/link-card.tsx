"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Globe, EyeOff, MoreHorizontal } from "lucide-react"
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
//   previewImage?: string  
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
//   const domain = link.url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0]
//   const domain = link.url.replace(/^(https?:\/\/)?(www\.)?/i, "")         
//                          .toLowerCase()                                   
//                          .replace(/(?<=\.com\/).{11,}/, (match) => match.slice(0, 12))
  const [showContent, setShowContent] = useState(false)

  const isBlurred = link.isNSFW && !showContent

  return (
    <Card className="group relative rounded-md overflow-hidden bg-card gap-2 border-zinc-800 hover:border-red-400 transition-colors duration-300">
      {link.previewImage && (
        <>
          <div
            className={`absolute inset-0 z-10 hidden group-hover:block ${isBlurred ? "blur-md" : ""}`}
            style={{
              backgroundImage: `url(${link.previewImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Single overlay for the entire card content on hover */}
          <div className="absolute inset-0 z-20 hidden group-hover:block bg-black/70" />
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
            className="hover:text-red-primary transition-colors duration-200"
          >
            {link.title}
          </Link>
        </CardTitle>
        <p className="text-md text-muted-foreground truncate">
          <Link href={link.url} target="_blank" rel="noopener noreferrer" className="text-red-primary hover:underline hover:text-red-500">
            {formatUrl(link.url)}
          </Link>
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 right-2 h-8 w-8 text-muted-foreground hover:bg-zinc-700 hover:text-foreground hover:cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4 hover:cursor-pointer" />
              <span className="sr-only">Link actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-card dark border-zinc-700">
            <DropdownMenuItem   disabled={!link?._id}
 onClick={() => onEdit(link)} className="cursor-pointer hover:bg-zinc-800 text-white">
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(link._id)}
              className="cursor-pointer text-red-400 dark hover:bg-zinc-800 hover:text-red-400"
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
            className="bg-zinc-700 text-zinc-300 hover:bg-red-500 hover:text-red-500-foreground transition-colors duration-200 text-xs px-2 py-1 rounded-full"
          >
            {tag}
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
      </CardContent>
    </Card>
  )
}
