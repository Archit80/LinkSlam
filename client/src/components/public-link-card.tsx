"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EyeOff, MoreHorizontal, Flame, Bookmark, Copy } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { publicLinksService } from "@/services/publicLinksService";
import { log } from "console";


export interface LinkItem {
  id: string;
  title: string;
  url: string;
  tags: string[];
  isPrivate: boolean;
  isNSFW: boolean;
  previewImage?: string; // Optional property for preview image URL
  likes?: string[];  
}

interface LinkCardProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  isPublicFeed?: boolean;
  slammedBy?: { id: string; username: string };
  isLiked?: boolean;
  isSaved?: boolean;
  isMine?: boolean;
}

function formatUrl(url: string): string {
  const cleaned = url.replace(/^(https?:\/\/)?(www\.)?/i, "").toLowerCase();
  const [domain, ...pathParts] = cleaned.split("/");
  const path = pathParts.join("/");

  if (!path) return domain;

  const trimmedPath = path.length > 10 ? path.slice(0, 10) + "…" : path;

  return `${domain}/${trimmedPath}`;
}

export function LinkCard({
  link,
  onEdit,
  onDelete,
  isPublicFeed = false,
  slammedBy,
  isLiked: isLikedProp,
  isSaved: isSavedProp,
  isMine,
}: LinkCardProps) {
  const [showContent, setShowContent] = useState(false);
  const [copied, setCopied] = useState(false);

  const [isLiked, setIsLiked] = useState<boolean>(!!isLikedProp);
  const [isSaved, setIsSaved] = useState<boolean>(!!isSavedProp);

const [likeCount, setLikeCount] = useState(link.likes?.length || 0);


  // useEffect(() => {
  //   setIsLiked(user?.likedLinks?.includes(link.id));
  //   setIsSaved(user?.savedLinks?.includes(link.id));
  // }, [user, link.id]);

  const handleLike = async () => {
    try {
      const response = await publicLinksService.toggleLikeLink(link.id);
      console.log("Toggle like response:", response);
      
      if (response.success) {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      } else {
        console.error("Failed to toggle like:", response.message);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await publicLinksService.toggleSaveLink(link.id);
      console.log("Toggle save response:", response);
      if(response.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // NSFW Simple Card
  if (link.isNSFW && !showContent) {
    return (
      <TooltipProvider>
        <Card
          className="group gap-2 relative py-3 pt-4 rounded-lg overflow-hidden bg-card/40 border-zinc-800 hover:border-red-400 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:bg-transparent cursor-pointer"
          onClick={() => setShowContent(true)}
        >
          <CardContent className="flex flex-col items-center justify-center p-4 text-center min-h-[120px]">
            <EyeOff className="h-8 w-8 text-red-500 mb-2" />
            <span className="text-red-500 font-bold text-lg">NSFW Content</span>
            <span className="text-zinc-400 text-sm mt-1">Click to reveal</span>
          </CardContent>
        </Card>
      </TooltipProvider>
    );
  }

  // Regular Card
  return (
    <TooltipProvider>
      <Card className="group gap-2 relative py-4 pt-6 rounded-lg overflow-hidden bg-card border-zinc-800 hover:border-red-400 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:bg-transparent">
        {link.previewImage && (
          <>
            <div
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
              style={{
                backgroundImage: `url(${link.previewImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 bg-black/75 transition-opacity duration-500 ease-in-out" />
          </>
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
              {formatUrl(link.url)}
            </Link>
          </p>
          {isPublicFeed ? (
            <Tooltip open={copied ? true : undefined}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={handleCopy}
                  className="absolute hover:cursor-pointer top-0 bg-transparent right-4 h-8 w-8 text-muted-foreground hover:text-white hover:bg-card transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy link</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                {copied ? "Copied!" : "Copy Link"}
              </TooltipContent>
            </Tooltip>
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
              <DropdownMenuContent
                align="end"
                className="w-40 bg-card border-zinc-700"
              >
                <DropdownMenuItem
                  onClick={() => onEdit(link)}
                  className="cursor-pointer hover:bg-zinc-800"
                >
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
              <span className="text-sm text-zinc-400">
                Slammed by:{" "}
                <Link
                  href={`/profile/${slammedBy.id}`}
                  className="text-red-primary hover:text-red-300 hover:underline transition-colors font-medium"
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
                className={`flex items-center gap-1 h-8 px-2 hover:bg-card transition-colors ${
                  isLiked
                    ? "text-red-400"
                    : "text-muted-foreground hover:text-red-400"
                }`}
              >
                <Flame className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm">{likeCount}</span>
              </Button>
             
             {!isMine && (<Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className={`h-8 w-8 p-0 hover:bg-zinc-700 transition-colors ${
                  isSaved
                    ? "text-white"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                />
              </Button>)}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
