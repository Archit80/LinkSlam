"use client"

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
    alert("Are you sure you want to delete this link?");
    try {
      const response = await userLinksService.deleteLink(id)
      console.log("Deleted link:", response.data);
      if(response.status === 200){
        setLinks(links.filter((link) => link._id !== id))
      }
    } catch (error) {
      console.log("Error deleting link:", error);
    }
  }

  const handleSaveLink = async (newLink: LinkItem) => {
    if (editingLink) {
      // Update existing link
      const response = await userLinksService.updateLink(newLink._id, newLink)
      console.log("Updated link:", response);
      setLinks(links.map((link) => (link._id === newLink._id ? newLink : link)))
    } else {
      // Add new link
      const response = await userLinksService.createLink(newLink)
      console.log("Created link:", response);
      // newLink._id = response._id // Assuming the response contains the new link ID
      setLinks([...links, newLink])
    }
  }

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  }

  const fetchAllLinks = async ()=>{
    try {
        const response = await userLinksService.getAllLinks();
        console.log("Fetched links:", response);
        setLinks(response.links || []);
    } catch (error) {
        console.error("Error fetching links:", error);
    }
  }

  useEffect(()=>{
    fetchAllLinks();
  }, [])

  
  return (
    <div className="flex flex-col h-full w-full font-inter bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4">
        <h1 className="text-2xl font-bold text-foreground">My Slam Zone</h1>
      </header>
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
