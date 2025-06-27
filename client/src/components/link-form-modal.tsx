"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Loader2 } from "lucide-react" 
import type { LinkItem } from "./link-card"
import '../app/globals.css'  

interface LinkFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (link: LinkItem) => void
  initialData?: LinkItem | null
}

export function LinkFormModal({ isOpen, onClose, onSubmit, initialData }: LinkFormModalProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [url, setUrl] = useState(initialData?.url || "")
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState("") // For the current tag being typed
  const [isPrivate, setIsPrivate] = useState(initialData?.isPublic ?? true)
  const [isNSFW, setIsNSFW] = useState(initialData?.isNSFW ?? false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)

  const tagInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setUrl(initialData.url)
      setTags(initialData.tags)
      setIsPrivate(!initialData.isPublic)
      setIsNSFW(initialData.isNSFW)
    } else {
      // Reset form for new link
      setTitle("")
      setUrl("")
      setTags([])
      setTagInput("")
      setIsPrivate(true)
      setIsNSFW(false)
    }
    setIsSubmitting(false) // Reset submission state on modal open/data change
    setUrlError(null) // Clear URL error
  }, [initialData, isOpen])

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault() // Prevent form submission
      handleAddTag()
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      // Allow removing last tag with backspace if input is empty
      setTags(tags.slice(0, tags.length - 1))
    }
  }

  const handleSubmit = async () => {
    // Basic URL validation
    // if (!url.startsWith("http://") && !url.startsWith("https://")) {
    //   setUrlError("URL must start with http:// or https://")
    //   return
    // } else {
    //   setUrlError(null)
    // }

    setIsSubmitting(true)
    const newLink: LinkItem = {
    ...(initialData?._id && { _id: initialData._id }), // only include if exists
      title,
      url,
      tags,
      isPublic : !isPrivate, // isPublic is the opposite of isPrivate
      isNSFW,
      // previewImage: initialData?.previewImage, // Preserve existing preview image if editing
    }
    await onSubmit(newLink) // Assuming onSubmit might be async (e.g., saving to DB)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark bg-card border-zinc-700 text-foreground shadow-md rounded-lg">
       
        <DialogHeader className="pb-4 border-b border-zinc-800">
          <DialogTitle className="text-red-primary text-2xl font-bold">
            {initialData ? "Edit Link" : "New Link"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-zinc-300">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right text-zinc-300">
              URL
            </Label>
            <div className="col-span-3">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`w-full bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors ${
                  urlError ? "border-red-500" : ""
                }`}
                required
                type="url"
              />
              {urlError && <p className="text-red-500 text-xs mt-1">{urlError}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="tags" className="text-right pt-2 text-zinc-300">
              Tags
            </Label>
            <div className="col-span-3 flex flex-col gap-2">
              <Input
                id="tags"
                ref={tagInputRef}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                onBlur={handleAddTag}
                placeholder="Add tags (e.g., webdev, ai)"
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-zinc-700 text-zinc-300 pr-1 cursor-pointer hover:bg-zinc-600 transition-colors rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="rounded-full p-0.5 hover:bg-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500 "
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3 w-3 hover:cursor-pointer" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="private" className="text-right text-zinc-300">
              Private
            </Label>
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              className="col-span-3 data-[state=checked]:bg-red-primary data-[state=unchecked]:bg-zinc-700"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nsfw" className="text-right text-zinc-300">
              NSFW
            </Label>
            <Switch
              id="nsfw"
              checked={isNSFW}
              onCheckedChange={setIsNSFW}
              className="col-span-3 data-[state=checked]:bg-red-primary data-[state=unchecked]:bg-zinc-700"
            />
          </div>
        </div>
        <DialogFooter className="pt-4 border-t border-zinc-800">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !title || !url || urlError !== null}
            className="bg-red-500 text-red-500-foreground hover:bg-red-400 transition-colors flex items-center gap-2 hover:cursor-pointer"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? (initialData ? "Saving..." : "Creating...") : initialData ? "Save Changes" : "Create Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
