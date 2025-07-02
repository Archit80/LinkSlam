"use client";

import Masonry from "react-masonry-css";
import { PublicFeedHeader } from "@/components/public-feed-header";
import { LinkCard } from "@/components/public-link-card";
import type { LinkItem } from "@/components/link-card";
import { Plus } from "lucide-react";
import { LinkFormModal } from "@/components/link-form-modal";
import { useEffect, useState } from "react";
import { publicLinksService } from "@/services/publicLinksService";
import { toast } from "sonner";
import { useUser } from "@/contexts/userContext";

export default function PublicFeedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [publicLinks, setPublicLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { user } = useUser();

  const handleNewLinkClick = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const showServerErrorToast = (title: string, error: any) => {
    const apiErrorMessage = error?.response?.data?.message || error?.message;
    toast.error(title, {
      description:
        apiErrorMessage || "Unable to complete request. Please try again.",
    });
  };

  // Initial fetch
  useEffect(() => {
    const fetchInitialLinks = async () => {
      try {
        setIsLoading(true);
        const res = await publicLinksService.getPublicFeedLinks(1);
        setPublicLinks(res.links || res.data || []);
        setHasMore(res.hasMore);
        setPage(2);
      } catch (error: any) {
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
      const res = await publicLinksService.getPublicFeedLinks(page);
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

  const handleSaveLink = async (newLink: LinkItem) => {
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
    } catch (error: any) {
      toast.dismiss(loadingToast);
      let errorMessage = "Unable to create link. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error.message &&
        error.message !== "Request failed with status code 400"
      ) {
        errorMessage = error.message;
      }
      toast.error("Failed to slam link", {
        description: errorMessage,
      });
    } finally {
      setIsModalOpen(false);
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
        <PublicFeedHeader onNewLinkClick={handleNewLinkClick} />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-zinc-400">Loading public feed...</div>
          </div>
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
              {publicLinks.map((link) => {
                if (!link || !link._id) {
                  console.warn("Invalid link found:", link);
                  return null;
                }
                const isLiked = user?.likedLinks?.includes(link._id);
                const isSaved = user?.savedLinks?.includes(link._id);
                const isMine = user?._id === (link.userId?._id || link.userId);
                return (
                  <LinkCard
                    key={link._id}
                    link={{
                      ...link,
                      id: link._id,
                      isPrivate: false,
                    }}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    isPublicFeed={true}
                    slammedBy={{
                      id: link.userId?._id || link.userId || "unknown",
                      username: link.userId?.name || "Unknown User",
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
          className="dark flex hover:cursor-pointer fixed gap-2 border-2 border-white/60 bottom-6 right-10 bg-red-500 text-white p-4 rounded-full z-50 
            hover:shadow-[0_0_8px_2px_rgba(239,68,68,0.8)] 
            transition-all duration-200"
        >
          <Plus className="dark h-6 w-6" />
          Slam A Link
        </button>
      </main>

      <LinkFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveLink}
        initialData={editingLink}
        fromPublicFeed={true}
      />
      
    </div>
  );
}
