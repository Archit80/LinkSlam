"use client";
import { useRouter } from "next/navigation";
import {
  Flame,
  Search,
  Shuffle,
  TrendingUp,
  Link as LinkIcon,
  User,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface PublicFeedHeaderProps {
  onNewLinkClick: () => void;
  onTagClick: (tag: string) => void;

  query: string;
  setQuery: (value: string) => void;
  onSearch: () => void;

  searchType: "links" | "users";
  setSearchType: (type: "links" | "users") => void;

  userSearchResults: any[];
  setUserSearchResults: (results: any[]) => void;
  showUserSuggestions: boolean;
  setShowUserSuggestions: (val: boolean) => void;

  onDebouncedInput?: () => void;
}

const chaosLinks = [
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rickroll, obviously
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rickroll, obviously
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rickroll, obviously
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rickroll, obviously
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rickroll, obviously
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rickroll, obviously
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rickroll, obviously
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rickroll, obviously
  "https://pointerpointer.com/", // points to your cursor with a photo
  "https://heeeeeeeey.com/", // just says "heeyyyyy"
  // "https://zoomquilt.org/", // infinite trippy zoom
  "https://longdogechallenge.com/", // endless doge
  "https://thispersondoesnotexist.com/", // AI-generated faces
  "https://theuselessweb.com/", // random useless site
  // "https://staggeringbeauty.com/", // don't shake it
  "https://cat-bounce.com/", // bouncy cats
  "https://www.trypap.com/", // Passive Aggressive Password Machine
  "https://mondrianandme.com/", // draw Mondrian-style art
  "https://www.rrrather.com/", // would-you-rather questions
  "https://corndog.io/", // literally just corndog
  "https://www.boredbutton.com/", // random fun activities
  "https://ncase.me/trust/", // interactive explainer on trust
  "https://www.windows93.net/", // cursed OS simulator
  "https://paint.toys/", // paint that responds to music
  "https://tane.us/ac/", // infinite ASCII art animation
  "https://www.donothingfor2minutes.com/", // challenge: do *nothing*
  "https://www.patience-is-a-virtue.org/", // literally just wait
];

const handleRandomLink = () => {
  const randomIndex = Math.floor(Math.random() * chaosLinks.length);
  const randomUrl = chaosLinks[randomIndex];
  window.open(randomUrl, "_blank");
};

export function PublicFeedHeader({
  onNewLinkClick,
  onTagClick,
  query,
  setQuery,
  onSearch,
  searchType,
  setSearchType,
  userSearchResults,
  setUserSearchResults,
  showUserSuggestions = false,
  setShowUserSuggestions,
  onDebouncedInput,
}: PublicFeedHeaderProps) {
  const popularTags = [
    "webdev",
    "haha",
    "hm",
    "new",
    "tools",
    "news",
    "react",
    "nextjs",
  ]; //TODO: add actual tags

  const router = useRouter();

  // Local state fallback if no prop is provided
  const [localSearchType, setLocalSearchType] = useState<"links" | "users">(
    "links"
  );

  // Use prop state if available, otherwise use local state
  const currentSearchType = setSearchType ? searchType : localSearchType;
  const handleSearchTypeChange = (type: "links" | "users") => {
    if (setSearchType) {
      setSearchType(type);
    } else {
      setLocalSearchType(type);
    }
  };

  return (
    <div className="relative bg-background border-b border-zinc-800">
      <div className="absolute inset-0 overflow-hidden opacity-50">
        <div className="absolute top-10 right-20 w-32 h-32 bg-red-500/30 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-red-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 p-8 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex text-red-500 items-center justify-center gap-3">
            <div className="flex size-10 text-red-500 items-center justify-center rounded-xl shadow-lg">
              <Flame className="size-10 text-red-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              LinkSlam
            </h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Discover and share the web&apos;s most amazing links with the community
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-3xl space-y-6">
          {/* Search Bar with Dropdown */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute hover:cursor-pointer left-1 top-1/2 hover:text-white -translate-y-1/2 h-8 mr-2 text-muted-foreground hover:bg-zinc-700 flex items-center gap-1"
                >
                  {currentSearchType === "links" ? (
                    <LinkIcon className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="text-xs font-medium">
                    {currentSearchType === "links" ? "Links" : "Users"}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-zinc-800 border-zinc-700"
              >
                <DropdownMenuItem
                  className="text-zinc-200 group hover:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer"
                  onClick={() => handleSearchTypeChange("links")}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  <span className="group-hover:text-white">
                  Search Links
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-zinc-200 group hover:text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer"
                  onClick={() => handleSearchTypeChange("users")}
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className=" group-hover:text-white hover:text-white">
                  Search Users
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              type="text"
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery?.(val);

                if (searchType === "users") {
                  onDebouncedInput?.(); // call debounced search
                } else {
                  setUserSearchResults?.([]);
                  setShowUserSuggestions?.(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch?.();
              }}
              placeholder={
                currentSearchType === "links"
                  ? "Search for links, topics, or domains..."
                  : "Search for users by name or username..."
              }
              className="pl-28 pr-14 py-3 text-lg bg-zinc-800 border-zinc-700 focus-visible:ring-red-500 focus-visible:border-red-500 rounded-xl"
            />
            <Button
              onClick={() => onSearch?.()}
              className="group absolute hover:cursor-pointer right-0 top-1/2 -translate-y-1/2 h-9 w-9 bg-red-primary hover:bg-red-400 text-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
            >
              <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <Search className="h-5 w-5 transform transition-all duration-300 group-hover:rotate-[-12deg] group-hover:scale-110 group-active:rotate-[-20deg]" />
            </Button>
            {searchType === "users" &&
              userSearchResults &&
              userSearchResults.length > 0 &&
              showUserSuggestions && (
                <div className="absolute left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {userSearchResults.map((user: any) => (
                    <button
                      key={user._id}
                      onClick={() => {
                        router.push(`/profile/${user._id}`);
                        setShowUserSuggestions?.(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-700 text-white flex items-center gap-3"
                    >
                      <Image
                        src={user.profileImage?.url || "/default-avatar.png"}
                        alt="avatar"
                        width={6}
                        height={6}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-medium">
                        {user.username || user.name || "Unnamed"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Glowing Random Link Button */}
            <Button
              onClick={handleRandomLink}
              className="bg-red-500 hover:cursor-crosshair hover:bg-red-400 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-red-500/50 transition-all duration-300"
              style={{
                boxShadow:
                  "0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2), 0 0 60px rgba(239, 68, 68, 0.1)",
              }}
            >
              <Shuffle className="h-5 w-5 mr-2" />
              Surprise Me
            </Button>

            {/* <Button
              variant="outline"
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-red-400 text-zinc-300 hover:text-red-400 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Trending
            </Button> */}
          </div>

          {/* Popular Tags */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-300 text-center">
              Popular Tags
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => window.location.reload()} // or re-fetch the feed
                className="cursor-pointer group-hover:text-white hover:text-white group hover:bg-red-500 hover:text-red-500-foreground transition-colors duration-200 text-sm px-3 py-1 rounded-full bg-zinc-700 text-zinc-300"
              >
                All Links
              </button>
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  onClick={() => onTagClick?.(tag)}
                  className="cursor-pointer group-hover:text-white hover:text-white group hover:bg-red-500 hover:text-red-500-foreground transition-colors duration-200 text-sm px-3 py-1 rounded-full bg-zinc-700 text-zinc-300"
                >
                  <span className="hover:text-white group-hover:text-white transition-colors duration-200">
                    #{tag}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {/* <div className="flex items-center justify-center gap-8 text-center text-sm text-zinc-500">
          <div>
            <span className="text-red-400 font-bold">10K+</span> Links
          </div>
          <div>
            <span className="text-red-400 font-bold">2.5K+</span> Users
          </div>
          <div>
            <span className="text-red-400 font-bold">50K+</span> Clicks
          </div>
        </div> */}
      </div>
    </div>
  );
}
