"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { MySlamZoneHeader } from "@/components/my-slam-zone-header";
import { LinkCard, type LinkItem } from "@/components/link-card";
import { LinkFormModal } from "@/components/link-form-modal";
import { userLinksService } from "@/services/userLinksService";
import { Skeleton } from "@/components/ui/skeleton";
// import { useUser } from "@/contexts/userContext";

export default function MySlamZonePage() {
  // const { user } = useUser();
  const [links, setLinks] = useState<LinkItem[]>([]); // <-- FIX: Initialize with an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [topTags, setTopTags] = useState<string[]>([]);

  // A skeleton component that mimics the layout of your LinkCard
  const LinkCardSkeleton = () => (
    <div className="flex flex-col space-y-4 p-4 bg-card border border-zinc-800 rounded-lg mb-4">
      <Skeleton className="h-5 w-3/4 bg-zinc-700" />
      <Skeleton className="h-4 w-1/2 bg-zinc-700" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full bg-zinc-700" />
        <Skeleton className="h-6 w-20 rounded-full bg-zinc-700" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-8 w-8 rounded-md bg-zinc-700" />
        <Skeleton className="h-8 w-8 rounded-md bg-zinc-700" />
      </div>
    </div>
  );

  const handleNewLinkClick = () => {
    setEditingLink(null); // Clear any previous editing data
    setIsModalOpen(true);
  };

  const handleEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleDeleteLink = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this link? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await userLinksService.deleteLink(id);
      // console.log("Deleted link:", response);

      if (typeof response === "object" && response !== null && "status" in response && (response as { status: number }).status === 200) {
        setLinks(links.filter((link) => link._id !== id));
        toast.success("Link deleted successfully", {
          description:
            "The link has been permanently removed from your Slam Zone.",
        });
      } else {
        toast.error("Failed to delete link", {
          description:
            "The server returned an unexpected response. Please try again.",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Failed to delete link", {
        description: errorMessage,
      });
    }
  };

  const handleSaveLink = async (newLink: LinkItem) => {
    if (editingLink) {
      // Update existing link
      try {
        const response = await userLinksService.updateLink(
          newLink._id,
          newLink
        );
        // console.log("Updated link:", response);

        if (response.link) {
          setLinks(
            links.map((link) =>
              link._id === newLink._id ? response.link : link
            )
          );
          toast.success("Link updated successfully", {
            description: "Your changes have been saved to your Slam Zone.",
          });
        } else {
          toast.error("Failed to update link", {
            description:
              "The server response was incomplete. Please try again.",
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response &&
          error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
            ? String(error.response.data.message)
            : error instanceof Error ? error.message : "An unexpected error occurred";
        toast.error("Failed to update link", {
          description: errorMessage,
        });
      }
    } else {
      // Add new link
      try {
        const response = await userLinksService.createLink(newLink);
        // console.log("Created link:", response);

        // The response.link should now have _id
        const createdLink = response.link;

        if (!createdLink?._id) {
          console.error("No _id found in created link:", createdLink);
          toast.error("Failed to create link", {
            description: "Please check your input and try again.",
          });
          return;
        }

        setLinks((prevLinks) => [createdLink, ...prevLinks]);
        toast.success("Link created successfully", {
          description: "Your new link has been added to your Slam Zone.",
        });
      } catch (error: unknown) {
        console.error("Error creating link:", error);

        const errorMessage =
          error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response &&
          error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
            ? String(error.response.data.message)
            : error instanceof Error ? error.message : "An unexpected error occurred";

        // More specific error messages based on common issues
        let description = `Error: ${errorMessage}`;
        if (errorMessage.includes("validation")) {
          description =
            "Please check that all required fields are filled correctly.";
        } else if (
          errorMessage.includes("network") ||
          errorMessage.includes("connection")
        ) {
          description =
            "Network error. Please check your internet connection and try again.";
        } else if (
          errorMessage.includes("unauthorized") ||
          errorMessage.includes("authentication")
        ) {
          description =
            "You need to be logged in to create links. Please refresh and try again.";
        }

        toast.error("Failed to create link", {
          description: description,
        });
      }
    }
  };

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const fetchLinks = async (type: "all" | "public" | "private") => {
    setIsLoading(true);
    try {
      let response;

      switch (type) {
        case "public":
          response = await userLinksService.getPublicLinks();
          break;
        case "private":
          response = await userLinksService.getPrivateLinks();
          break;
        default:
          response = await userLinksService.getAllLinks();
      }

      // console.log("Fetched links:", response);/

      if (response.links) {
        setLinks(response.links);

        // Only show success toast if it's not the initial load
        // toast.success(...) // Remove this for cleaner UX
      } else {
        setLinks([]);
        // Keep the "no links found" toast as it's useful
        toast.info("No links found", {
          description: `No ${
            type === "all" ? "" : type + " "
          }links in your Slam Zone yet. Create your first link!`,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error("Failed to load links", {
        description: errorMessage,
      });

      // Set empty array as fallback
      setLinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const res = await userLinksService.searchLinks(query, "");
      // console.log("Search response:", res);
      
      if (res && typeof res === 'object' && 'data' in res && Array.isArray(res.data)) {
        if (res.data.length === 0) {
          toast.info(`No results for "${query}"`);
          setLinks([]);
        } else {
          setLinks(res.data);
        }
      } else {
        setLinks([]);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Search failed";
      toast.error("Search failed", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagSearch = async (tag: string) => {
    setIsLoading(true);
    try {
      const response = await userLinksService.searchLinks(undefined, tag);
      // console.log("Tag search response:", response);
      if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data) && response.data.length > 0) {
        setLinks(response.data);
      } else {
        toast.info(`No results found for ${tag}`);
        // setLinks([]);
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error ? error.message : "Tag search failed";
      toast.error("Tag search failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLinks(filter);

      try {
        const tags = await userLinksService.getUserTopTags();
        // console.log("Fetched top tags:", tags);

        setTopTags(tags);
      } catch (err) {
        console.error("Failed to fetch top tags:", err);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <div className="flex flex-col h-full w-full font-inter bg-background text-foreground">
      <MySlamZoneHeader
        onNewLinkClick={handleNewLinkClick}
        currentFilter={filter}
        onFilterChange={(newFilter) => setFilter(newFilter)}
        onTagClick={handleTagSearch}
        topTags={topTags}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={() => {
          if (!searchQuery.trim()) {
            fetchLinks(filter);
          } else {
            handleSearch(searchQuery);
          }
        }}
      />
      <main className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <Masonry
            breakpointCols={breakpointCols}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {/* Render 8 skeleton cards for a good loading effect */}
            {Array.from({ length: 8 }).map((_, index) => (
              <LinkCardSkeleton key={index} />
            ))}
          </Masonry>
        ) : links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-semibold text-zinc-300 mb-2">
              Nothing here... yet.
            </h3>
            <p className="text-zinc-500 mb-4">
              Make this space yours - Ready to drop your first banger?{" "}
            </p>
            <button
              onClick={handleNewLinkClick}
              className="bg-red-primary hover:bg-red-500 hover:cursor-pointer text-white px-6 py-2 rounded-lg transition-colors"
            >
              Slam Your First Link
            </button>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointCols}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {links.map((link) => (
              <LinkCard
                key={link._id}
                link={link}
                onEdit={handleEditLink}
                onDelete={handleDeleteLink}
                // isSaved={link.sourceId ? true : false} // Assuming sourceId indicates if it's saved
              />
            ))}
          </Masonry>
        )}
      </main>

      <LinkFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveLink}
        initialData={editingLink}
        fromPublicFeed={false} // This is for My Slam Zone, not public feed
      />
    </div>
  );
}
