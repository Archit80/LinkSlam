"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { MySlamZoneHeader } from "@/components/my-slam-zone-header";
import { LinkCard, type LinkItem } from "@/components/link-card";
import { LinkFormModal } from "@/components/link-form-modal";
import { userLinksService } from "@/services/userLinksService";

export default function MySlamZonePage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [filter, setFilter] = useState<"all" | "public" | "private">("private");

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
      console.log("Deleted link:", response);

      if (response.status === 200) {
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
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
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
        console.log("Updated link:", response);

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
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";
        toast.error("Failed to update link", {
          description: errorMessage,
        });
      }
    } else {
      // Add new link
      try {
        const response = await userLinksService.createLink(newLink);
        console.log("Created link:", response);

        // The response.link should now have _id
        const createdLink = response.link;

        if (!createdLink?._id) {
          console.error("No _id found in created link:", createdLink);
          toast.error("Failed to create link", {
            description:
              "Please check your input and try again.",
          });
          return;
        }

        setLinks((prevLinks) => [...prevLinks, createdLink]);
        toast.success("Link created successfully", {
          description: "Your new link has been added to your Slam Zone.",
        });
      } catch (error: any) {
        console.error("Error creating link:", error);

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";

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

      console.log("Fetched links:", response);

      if (response.links) {
        setLinks(response.links);
        
        // Only show success toast if it's not the initial load
        // toast.success(...) // Remove this for cleaner UX
      } else {
        setLinks([]);
        // Keep the "no links found" toast as it's useful
        toast.info("No links found", {
          description: `No ${type === 'all' ? '' : type + ' '}links in your Slam Zone yet. Create your first link!`,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      toast.error("Failed to load links", {
        description: errorMessage,
      });

      // Set empty array as fallback
      setLinks([]);
    }
  };

  useEffect(() => {
    fetchLinks(filter);
  }, [filter]);

  return (
    <div className="flex flex-col h-full w-full font-inter bg-background text-foreground">
      <MySlamZoneHeader
        onNewLinkClick={handleNewLinkClick}
        currentFilter={filter}
        onFilterChange={(newFilter) => setFilter(newFilter)}
      />
      <main className="flex-1 overflow-auto p-4">
          {links.length === 0 ? (
         
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-semibold text-zinc-300 mb-2">
             Nothing here... yet.
            </h3>
            <p className="text-zinc-500 mb-4">Make this space yours - Ready to drop your first banger? </p>
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
