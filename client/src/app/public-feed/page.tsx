"use client";

import Masonry from "react-masonry-css";
import { PublicFeedHeader } from "@/components/public-feed-header";
import { LinkCard } from "@/components/public-link-card";
import type { LinkItem } from "@/components/link-card";
import { Plus } from "lucide-react";
import { LinkFormModal } from "@/components/link-form-modal";
import { useEffect, useState } from "react";
import { publicLinksService } from "@/services/publicLinksService";

export default function PublicFeedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [publicLinks, setPublicLinks] = useState<LinkItem[]>([]);

  const handleNewLinkClick = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const fetchPublicFeedLinks = async () => {
    try {
      const response = await publicLinksService.getPublicFeedLinks();
      setPublicLinks(response.links || []);
      console.log("Fetched links:", response);
    } catch (error) {
      console.error("Error fetching public links:", error);
    }
  };

  useEffect(() => {
    fetchPublicFeedLinks(); // Fetch public links when the component mounts
  }, []);

  const handleSaveLink = async (linkData: LinkItem) => {
    if (editingLink) {
      // Update existing link
      const updatedLinks = publicLinks.map((link) =>
        link._id === editingLink._id ? { ...link, ...linkData } : link
      );
      setPublicLinks(updatedLinks);
    } else {
      // Create new link
      const response = await publicLinksService.createLink(linkData);
      if (response && response.link) {
        setPublicLinks([...publicLinks, response.link]);
      }
    }
    setIsModalOpen(false);
  };

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="dark flex flex-col h-full w-full bg-background text-foreground">
      <PublicFeedHeader onNewLinkClick={handleNewLinkClick} />
      <main className="dark flex-1 overflow-auto p-4 relative">
        <Masonry
          breakpointCols={breakpointCols}
          className="dark my-masonry-grid bg-background"
          columnClassName="dark my-masonry-grid_column"
        >
          {publicLinks.map((link) => (
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
                id: link.userId?._id || link.userId, // Handle both populated and non-populated userId
                username: link.userId?.name || "Unknown User", // Get name from populated userId object
              }}
            />
          ))}
        </Masonry>

        {/* Floating New Link Button */}
        <button
          onClick={handleNewLinkClick}
          className="dark fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full z-50 
hover:shadow-[0_0_10px_4px_rgba(239,68,68,0.8)] 
transition-all duration-200"
        >
          <Plus className="dark h-6 w-6" />
        </button>
      </main>

      <LinkFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveLink}
        initialData={editingLink}
      />
    </div>
  );
}
