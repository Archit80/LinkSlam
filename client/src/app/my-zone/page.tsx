"use client"
import { toast } from 'sonner'
import { useEffect, useState } from "react"
import Masonry from "react-masonry-css"
import { MySlamZoneHeader } from "@/components/my-slam-zone-header"
import { LinkCard, type LinkItem } from "@/components/link-card"
import { LinkFormModal } from "@/components/link-form-modal"
import {userLinksService} from "@/services/userLinksService"

export default function MySlamZonePage() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)

  const handleNewLinkClick = () => {
    setEditingLink(null) // Clear any previous editing data
    setIsModalOpen(true)
  }

  const handleEditLink = (link: LinkItem) => {
    setEditingLink(link)
    setIsModalOpen(true)
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await userLinksService.deleteLink(id)
      console.log("Deleted link:", response);
      
      if(response.status === 200){
        setLinks(links.filter((link) => link._id !== id));
        toast.success("Link deleted successfully", {
          description: "The link has been permanently removed from your Slam Zone.",
        })
      } else {
        toast.error("Failed to delete link", {
          description: "The server returned an unexpected response. Please try again.",
        })
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
      toast.error("Failed to delete link", {
        description: errorMessage,
      })
    }
  }

  const handleSaveLink = async (newLink: LinkItem) => {
    if (editingLink) {
      // Update existing link
      try {
        const response = await userLinksService.updateLink(newLink._id, newLink)
        console.log("Updated link:", response);
        
        if (response.link) {
          setLinks(links.map((link) => (link._id === newLink._id ? response.link : link)))
          toast.success("Link updated successfully", {
            description: "Your changes have been saved to your Slam Zone.",
          })
        } else {
          toast.error("Failed to update link", {
            description: "The server response was incomplete. Please try again.",
          })
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
        toast.error("Failed to update link", {
          description: errorMessage,
        })
      }
    } else {
      // Add new link
      try {
        const response = await userLinksService.createLink(newLink)
        console.log("Created link:", response);
        
        // The response.link should now have _id
        const createdLink = response.link;
        
        if (!createdLink?._id) {
          console.error("No _id found in created link:", createdLink);
          toast.error("Failed to create link", {
            description: "The server didn't return a valid link ID. Please try again.",
          })
          return;
        }
        
        setLinks(prevLinks => [...prevLinks, createdLink])
        toast.success("Link created successfully", {
          description: "Your new link has been added to your Slam Zone.",
        });
      } catch (error: any) {
        console.error("Error creating link:", error);
        
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
        
        // More specific error messages based on common issues
        let description = `Error: ${errorMessage}`;
        if (errorMessage.includes("validation")) {
          description = "Please check that all required fields are filled correctly.";
        } else if (errorMessage.includes("network") || errorMessage.includes("connection")) {
          description = "Network error. Please check your internet connection and try again.";
        } else if (errorMessage.includes("unauthorized") || errorMessage.includes("authentication")) {
          description = "You need to be logged in to create links. Please refresh and try again.";
        }
        
        toast.error("Failed to create link", {
          description: description,
        })
      }
    }
  }

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  }

  const fetchAllLinks = async () => {
    try {
      const response = await userLinksService.getAllLinks();
      console.log("Fetched links:", response);
      
      if (response.links) {
        setLinks(response.links);
        toast.success("Welcome to your space!", {
          description: `Which link will you slam today?`,
        })
      } else {
        setLinks([]);
        toast.info("No links found", {
          description: "Your Slam Zone is empty. Create your first link!",
        })
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
      toast.error("Failed to load links", {
        description: errorMessage,
      })
      
      // Set empty array as fallback
      setLinks([]);
    }
  }

  useEffect(() => {
    fetchAllLinks();
  }, [])

  return (
    <div className="flex flex-col h-full w-full font-inter bg-background text-foreground">
      {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4">
        <h1 className="text-2xl font-bold text-foreground">My Slam Zone</h1>
      </header> */}
      <MySlamZoneHeader onNewLinkClick={handleNewLinkClick} />
      <main className="flex-1 overflow-auto p-4">
        <Masonry breakpointCols={breakpointCols} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
          {links.map((link) => (
            <LinkCard key={link._id} link={link} onEdit={handleEditLink} onDelete={handleDeleteLink} />
          ))}
        </Masonry>
      </main>

      <LinkFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveLink}
        initialData={editingLink}
      />
    </div>
  )
}
