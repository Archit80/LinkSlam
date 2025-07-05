"use client";

import Masonry from "react-masonry-css";
import { PublicFeedHeader } from "@/components/public-feed-header";
import { LinkCard } from "@/components/public-link-card";
import type { LinkItem } from "@/components/public-link-card";
import type { LinkItem as ModalLinkItem } from "@/components/link-card";
import { Plus } from "lucide-react";
import { LinkFormModal } from "@/components/link-form-modal";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { publicLinksService } from "@/services/publicLinksService";
import { toast } from "sonner";
import { useUser } from "@/contexts/userContext";
import type { User } from "@/contexts/userContext";
import { searchUsers } from "@/services/userServices";
import { Skeleton } from "@/components/ui/skeleton";
// import type { User } from "@/types/user"; // Adjust the import path as needed

// Custom debounce function to avoid lodash.debounce type issues
function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const PAGE_LIMIT = 12;

export default function PublicFeedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [publicLinks, setPublicLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [searchType, setSearchType] = useState<"links" | "users">("links");

  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { user } = useUser();

  const PublicLinkCardSkeleton = () => (
    <div className="flex flex-col space-y-3 p-4 bg-card border border-zinc-800 rounded-lg mb-4 break-inside-avoid">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full bg-zinc-700" />
        <Skeleton className="h-4 w-28 bg-zinc-700" />
      </div>
      {/* Title */}
      <Skeleton className="h-5 w-3/4 bg-zinc-700" />
      {/* URL */}
      <Skeleton className="h-4 w-1/2 bg-zinc-700" />
      {/* Tags */}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full bg-zinc-700" />
        <Skeleton className="h-6 w-20 rounded-full bg-zinc-700" />
      </div>
    </div>
  );

  const handleNewLinkClick = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const showServerErrorToast = (title: string, error: unknown) => {
    const apiErrorMessage =
      error && typeof error === 'object' && 'response' in error && 
      error.response && typeof error.response === 'object' && 'data' in error.response &&
      error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? String(error.response.data.message)
        : error instanceof Error ? error.message : null;
    toast.error(title, {
      description: apiErrorMessage || "Unable to complete request. Please try again.",
    });
  };

  // Initial fetch
  useEffect(() => {
    const fetchInitialLinks = async () => {
      try {
        setIsLoading(true);
        const res = await publicLinksService.getPublicFeedLinks(1, PAGE_LIMIT);
        setPublicLinks(res.links || res.data || []);
        setHasMore(res.hasMore);
        setPage(2);
      } catch (error: unknown) {
        showServerErrorToast("Failed to load public feed", error);
        setPublicLinks([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialLinks();
  }, []);

  // Load more links for pagination
  const loadMoreLinks = async () => {
    if (!hasMore || isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const res = await publicLinksService.getPublicFeedLinks(page, PAGE_LIMIT);
      setPublicLinks((prev) => {
        const newLinks = res.links || res.data || [];
        const allLinks = [...prev, ...newLinks];
        // Remove duplicates by _id
        const uniqueLinks = allLinks.filter(
          (link, idx, arr) => arr.findIndex((l) => l._id === link._id) === idx
        );
        return uniqueLinks;
      });
      setHasMore(res.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      showServerErrorToast("Failed to load more links", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSaveLink = async (newLink: Omit<LinkItem, "_id" | "user">) => {
    const loadingToast = toast.loading("Creating your link...", {
      description: "Slamming your link to the public feed",
    });

    try {
      const response = await publicLinksService.createPublicLink(newLink);
      const createdLink = response.data?.link || response.link || response.data;

      if (!createdLink || !createdLink._id) {
        const apiError = response?.data?.message || "Please enter a valid url.";
        throw new Error(apiError);
      }

      setPublicLinks((prevLinks) => [createdLink, ...prevLinks]);
      toast.dismiss(loadingToast);
      toast.success("Link slammed successfully! 🔥", {
        description: `"${createdLink.title}" has been posted to the public feed`,
      });
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      let errorMessage = "Unable to create link. Please try again.";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
      ) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      toast.error("Failed to slam link", {
        description: errorMessage,
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  // Wrapper function to match LinkFormModal's expected onSubmit signature
  const handleModalSubmit = (link: ModalLinkItem) => {
    // Remove _id to match handleSaveLink signature, and ensure isPrivate is set to false for public feed
    const { ...linkData } = link;
    handleSaveLink({ ...linkData, isPrivate: false });
  };

  const handleSearch = useCallback(async () => {
    if (searchType === "users") {
      if (!query.trim()) {
        setUserSearchResults([]);
        setShowUserSuggestions(false);
        return;
      }
      try {
        const res = await searchUsers(query);
        // console.log("User search results:", res);
        setUserSearchResults(res);
        setShowUserSuggestions(true);
      } catch (err) {
        showServerErrorToast("User search failed", err);
      }
    } else {
      try {
        setIsLoading(true);
        const res = query.trim()
          ? await publicLinksService.searchLinks(query, "")
          : await publicLinksService.getPublicFeedLinks(1, PAGE_LIMIT); // fetch all with pagination

        setPublicLinks(res.data || res.links || []);
        setHasMore(res.hasMore); // Correctly set hasMore from the response
        setPage(2); // Reset page to 2 for subsequent loads
      } catch (err) {
        showServerErrorToast("Search failed", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [searchType, query, setUserSearchResults, setShowUserSuggestions, setIsLoading, setPublicLinks, setHasMore]);

  const latestQuery = useRef(query);
  const latestSearchType = useRef(searchType);

  useEffect(() => {
    latestQuery.current = query;
  }, [query]);

  useEffect(() => {
    latestSearchType.current = searchType;
  }, [searchType]);

  const debouncedUserSearch = useMemo(() => {
    return debounce(() => {
      if (latestSearchType.current === "users" && latestQuery.current.trim()) {
        handleSearch();
      }
    }, 500);
  }, [handleSearch]);

  const handleTagSearch = async (tag: string) => {
    try {
      setIsLoading(true);
      const res = await publicLinksService.searchLinks("", tag);
      // console.log("Search results for tag:", tag, res);

      if (res.data && res.data.length === 0) {
        toast.info(`No links found for tag: ${tag}`, {
          description: "Try searching with a different tag.",
        });
      } else {
        setPublicLinks(res.data || res.links);
      }
      setHasMore(false); // disable pagination during search
    } catch (err) {
      showServerErrorToast("Failed to search by tag", err);
    } finally {
      setIsLoading(false);
    }
  };

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="dark flex flex-col h-full w-full bg-background text-foreground">
      <main className="dark flex-1 overflow-auto p-4 relative">
        <PublicFeedHeader
          onTagClick={handleTagSearch}
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          searchType={searchType}
          setSearchType={setSearchType}
          userSearchResults={userSearchResults}
          setUserSearchResults={setUserSearchResults}
          showUserSuggestions={showUserSuggestions}
          setShowUserSuggestions={setShowUserSuggestions}
            onDebouncedInput={debouncedUserSearch}
        />

        {isLoading ? (
          <Masonry
            breakpointCols={breakpointCols}
            className="dark py-4 my-masonry-grid bg-background"
            columnClassName="dark my-masonry-grid_column"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <PublicLinkCardSkeleton key={index} />
            ))}
          </Masonry>
        ) : publicLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-semibold text-zinc-300 mb-2">
              No links in the feed yet
            </h3>
            <p className="text-zinc-500 mb-4">Be the first to slam a link!</p>
            <button
              onClick={handleNewLinkClick}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Slam Your First Link
            </button>
          </div>
        ) : (
          <>
            <Masonry
              breakpointCols={breakpointCols}
              className="dark py-4 my-masonry-grid bg-background"
              columnClassName="dark my-masonry-grid_column"
            >
              {publicLinks.map((link: LinkItem) => {
                if (!link || !link._id) {
                  console.warn("Invalid link found:", link);
                  return null;
                }
                const isLiked = user?.likedLinks?.includes(link._id);
                const isSaved = user?.savedLinks?.includes(link._id);
                const isMine = user && user._id
                  ? user._id === (typeof link.userId === "object" && link.userId !== null && "_id" in link.userId
                      ? (link.userId as { _id: string })._id
                      : link.userId)
                  : false;
                return (
                  <LinkCard
                    key={link._id}
                    link={{
                      ...link,
                      _id: link._id,
                      isPrivate: false,
                    }}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    isPublicFeed={true}
                    slammedBy={{
                      id: typeof link.userId === "object" && link.userId !== null && "_id" in link.userId
                        ? (link.userId as { _id: string })._id
                        : typeof link.userId === "string" 
                        ? link.userId 
                        : "unknown",
                      username: typeof link.userId === "object" && link.userId !== null && "username" in link.userId
                        ? (link.userId as { username?: string; name?: string }).username ||
                          (link.userId as { username?: string; name?: string }).name ||
                          "Unknown User"
                        : "Unknown User",
                    }}
                    isLiked={isLiked}
                    isSaved={isSaved}
                    isMine={isMine}
                  />
                );
              })}
            </Masonry>
            {hasMore && (
              <div className="flex justify-center py-8">
                <button
                  onClick={loadMoreLinks}
                  disabled={isLoadingMore}
                  className="bg-zinc-800 hover:cursor-wait hover:bg-zinc-700 disabled:bg-zinc-900 text-white px-6 py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading more...
                    </div>
                  ) : (
                    "Load More Links"
                  )}
                </button>
              </div>
            )}
            {!hasMore && publicLinks.length > 0 && (
              <div className="flex justify-center py-8">
                <p className="text-zinc-500 text-sm">
                  🎉 You&#39;ve reached the end of the feed!
                </p>
              </div>
            )}
          </>
        )}

        <button
          onClick={handleNewLinkClick}
          className="dark flex items-center justify-center hover:cursor-pointer fixed gap-2 border-2 border-white/60 
            bottom-16 md:bottom-10 right-6 md:right-10 
            bg-red-500 text-white p-3 sm:p-4 rounded-full z-50 
            hover:shadow-[0_0_8px_2px_rgba(239,68,68,0.8)] 
            transition-all duration-200"
        >
          <Plus className="dark h-5 w-5 sm:h-6 sm:w-6" />
          <span className="hidden sm:inline">Slam A Link</span>
        </button>
      </main>

      <LinkFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingLink ? { ...editingLink, isPublic: true } : null}
        fromPublicFeed={true}
      />
    </div>
  );
}
