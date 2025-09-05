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
      await authService.uploadAvatar(file);
      // console.log("Image upload response:", response);
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

    // Redirect immediately without waiting for API response
    toast.loading("Setting up your profile...", { id: "profile-setup" });
    router.replace("/my-zone");

    // Update profile in background
    try {
      await authService.updateProfile({
        name: nameSanitized,
        username: usernameSanitized,
        bio: bioSanitized,
      });
      
      toast.success("Profile updated successfully! 🎉", { id: "profile-setup" });
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Handle API errors that may have a response property
      const errorMessage = 
        error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
          ? String(error.response.data.message)
          : "Profile update failed, but you can update it later in settings.";
      
      toast.error(errorMessage, { id: "profile-setup" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark flex min-h-screen items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Red gradient background */}
      <div className="dark absolute inset-0 z-0 bg-gradient-to-br from-red-900/40 via-transparent to-transparent opacity-25" />
      <div className="dark absolute inset-0 z-0 bg-gradient-to-tl from-red-900/30 via-transparent to-transparent opacity-15" />

      <Card className="dark w-full max-w-md bg-card/40 border-zinc-800 text-foreground shadow-lg relative z-10">
        <CardHeader className="dark pb-4 border-b border-zinc-800 text-center">
          <CardTitle className="dark text-red-primary text-3xl font-bold">
            Customize Your Profile
          </CardTitle>
          <CardDescription className="dark text-zinc-400">
            We’re almost there — let’s make it official.
          </CardDescription>
        </CardHeader>
        <CardContent className="dark pt-6 space-y-6">
          {/* Avatar Preview */}
          <div className="dark flex justify-center">
            <div
              className="dark relative w-24 h-24 rounded-full border-4 border-zinc-700 overflow-hidden cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image
                src={imagePreview || "/default-avatar.png"}
                alt="Profile"
                fill
                className="dark object-cover"
              />
              <div className="dark absolute inset-0 bg-black/50 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                Change
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              id="avatarUpload"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="dark hidden"
            />
          </div>

          <form onSubmit={handleSubmit} className="dark space-y-4">
            <div className="dark space-y-1">
              <Label htmlFor="name">What should we call you?</Label>
              <div className="dark relative">
                <User className="dark absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="dark pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="dark space-y-1">
              <Label htmlFor="username">Your digital tag</Label>
              <div className="dark relative">
                <AtSign className="dark absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="dark pl-9 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="dark space-y-1">
              <Label htmlFor="bio">Bio</Label>
              <div className="dark relative">
                <FileText className="dark absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Your vibe in one paragraph..."
                  className="dark pl-9 pt-3 bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="dark w-full hover:cursor-pointer bg-red-primary text-red-500-foreground hover:bg-red-400 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="dark flex items-center justify-center">
                  <Loader2 className="dark mr-2 h-4 w-4 animate-spin" />
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