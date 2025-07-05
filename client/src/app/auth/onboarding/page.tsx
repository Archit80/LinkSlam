"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, User, AtSign, FileText } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

const usernameRegex = /^[a-zA-Z0-9._]+$/;
const nameRegex = /^[a-zA-Z\s]+$/;

export default function ProfileSettingsPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Uploading image...", {
        id: "image-upload",
      });
      const response = await authService.uploadAvatar(file);
      console.log("Image upload response:", response);
      toast.success("Profile picture updated!", {
        id: "image-upload",
      });

      // Show preview immediately after upload
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      // Optionally update any profile state if needed
      // setProfile((prev: any) => ({
      //   ...prev,
      //   avatar: response.avatar, // or whatever the response contains
      // }));
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!usernameRegex.test(username)) {
      toast.error(
        "Username can only contain letters, numbers, dots (.) and underscores (_)"
      );
      setLoading(false);
      return;
    }
    if (!nameRegex.test(name)) {
      toast.error("Name can only contain letters and spaces");
      setLoading(false);
      return;
    }

    const nameSanitized = name.trim();
    const usernameSanitized = username.trim().toLowerCase();
    const bioSanitized = bio.trim();

    try {
      console.log("sending",   nameSanitized,
        usernameSanitized,
        bioSanitized,);
      
      const response = await authService.updateProfile({
        name: nameSanitized,
        username: usernameSanitized,
        bio: bioSanitized,
      });
      console.log("Profile update response:", response);

      if (response.success) {
        toast.success("Profile updated successfully! 🎉");
        router.replace(`/public-feed`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(`${error instanceof Error ? error.response.data.message : "Failed to update profile. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Red gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-900/40 via-transparent to-transparent opacity-25" />
      <div className="absolute inset-0 z-0 bg-gradient-to-tl from-red-900/30 via-transparent to-transparent opacity-15" />

      <Card className="w-full max-w-md bg-card/40 border-zinc-800 text-foreground shadow-lg relative z-10">
        <CardHeader className="pb-4 border-b border-zinc-800 text-center">
          <CardTitle className="text-red-primary text-3xl font-bold">
            Customize Your Profile
          </CardTitle>
          <CardDescription className="text-zinc-400">
            We’re almost there — let’s make it official.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div
              className="relative w-24 h-24 rounded-full border-4 border-zinc-700 overflow-hidden cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image
                src={imagePreview || "/default-avatar.png"}
                alt="Profile"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                Change
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              id="avatarUpload"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">What should we call you?</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="username">Your digital tag</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="bio">Bio</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Your vibe in one paragraph..."
                  className="pl-9 pt-3 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full hover:cursor-pointer bg-red-primary text-red-500-foreground hover:bg-red-400 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Lock it in!"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
