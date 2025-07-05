"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import type { LinkItem } from "./link-card";
import "../app/globals.css";

interface LinkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (link: LinkItem) => void;
  initialData?: LinkItem | null;
  fromPublicFeed?: boolean;
}

// export const LinkItem;

export function LinkFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  fromPublicFeed,
}: LinkFormModalProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isPrivate, setIsPrivate] = useState(initialData?.isPublic === false);
  const [isNSFW, setIsNSFW] = useState(initialData?.isNSFW ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setUrl(initialData.url);
      setTags(initialData.tags);
      setIsPrivate(!initialData.isPublic);
      setIsNSFW(initialData.isNSFW);
    } else {
      setTitle("");
      setUrl("");
      setTags([]);
      setTagInput("");
      setIsPrivate(true);
      setIsNSFW(false);
    }
    setIsSubmitting(false);
    setUrlError(null);
  }, [initialData, isOpen]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, tags.length - 1));
    }
  };

  const handleSubmit = async () => {
    let validatedUrl = url;
    if (!/^https?:\/\//.test(url)) {
      validatedUrl = "https://" + url;
    }

    setIsSubmitting(true);

    const newLink: LinkItem =
      initialData && initialData._id
        ? {
            // Editing existing link - include _id and preserve userId
            _id: initialData._id,
            title,
            url: validatedUrl,
            tags,
            isPublic: !isPrivate,
            isNSFW,
            userId: initialData.userId, // Preserve existing userId
          }
        : ({
            // Creating new link - don't include _id, let server generate it
            title,
            url: validatedUrl,
            tags,
            isPublic: !isPrivate,
            isNSFW,
            userId: "", // Will be set by server based on authenticated user
          } as LinkItem); // Type assertion since _id is required in LinkItem but server will add it

    await onSubmit(newLink);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark bg-card border-zinc-700 text-foreground shadow-md rounded-lg">
        <DialogHeader className="pb-4 border-b border-zinc-800">
          <DialogTitle className="text-red-primary text-2xl font-bold">
            {initialData ? "Edit Link" : "New Link"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-zinc-300">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              required
            />
          </div>

          {/* URL */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right text-zinc-300">
              URL
            </Label>
            <div className="col-span-3">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`w-full bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500 ${
                  urlError ? "border-red-500" : ""
                }`}
                required
                type="url"
              />
              {urlError && (
                <p className="text-red-500 text-xs mt-1">{urlError}</p>
              )}
            </div>
          </div>

          {/* Tags */}
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
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-zinc-700 text-zinc-300 pr-1 cursor-pointer hover:bg-zinc-600 rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="rounded-full p-0.5 hover:bg-zinc-500 hover:cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Visibility & NSFW */}
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-4 bg-zinc-900 p-4 rounded-md border border-zinc-700">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-zinc-200 font-medium">Private</span>
                  <span className="text-zinc-500 text-xs">
                    Only you can view this link
                  </span>
                </div>
                <Switch
                  id="private"
                  checked={fromPublicFeed ? false : isPrivate}
                  onCheckedChange={setIsPrivate}
                  disabled={fromPublicFeed}
                  className="data-[state=checked]:bg-red-primary data-[state=unchecked]:bg-zinc-700 hover:cursor-pointer "
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-zinc-200 font-medium">NSFW</span>
                  <span className="text-zinc-500 text-xs">
                    Mark as sensitive content
                  </span>
                </div>
                <Switch
                  id="nsfw"
                  checked={isNSFW}
                  onCheckedChange={setIsNSFW}
                  className="data-[state=checked]:bg-red-primary data-[state=unchecked]:bg-zinc-700 hover:cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-zinc-800">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !title || !url || urlError !== null}
            className="bg-red-500 text-white hover:bg-red-400 transition-colors flex items-center gap-2 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-500/70  "
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting
              ? initialData
                ? "Saving..."
                : "Creating..."
              : initialData
              ? "Save Changes"
              : "Create Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
