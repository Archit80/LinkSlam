"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  LinkIcon,
  Flame,
  Bookmark,
  Edit3,
  Camera,
  Star,
  AtSign,
} from "lucide-react";
import Masonry from "react-masonry-css";
import { LinkCard, type LinkItem } from "@/components/public-link-card";
import { getUserProfile } from "@/services/userServices";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { useUser, User } from "@/contexts/userContext";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { EditProfileModal } from "@/components/edit-profile-modal";
import { Skeleton } from "@/components/ui/skeleton";

import { motion } from "framer-motion";

interface UserProfile {
  user: User;
  publicLinks: LinkItem[];
}

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = params;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useUser();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getUserProfile(userId);
        console.log("user profile", data);

        setProfile(data);
      } catch (err) {
        const error = err as Error;
        toast.error("Failed to load profile", { description: error.message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const ProfilePageSkeleton = () => (
    <div className="dark flex flex-col min-h-screen h-full w-full bg-zinc-900 text-foreground animate-pulse">
      <main className="dark flex-1 overflow-auto bg-zinc-950">
        {/* Header Skeleton */}
        <div className="dark bg-gradient-to-br from-zinc-900/90 via-black to-zinc-900/90 p-4 md:p-8 border-b border-zinc-800/30">
          <div className="dark h-full w-full mx-auto flex flex-col lg:flex-row items-center lg:items-start lg:justify-evenly gap-8 lg:gap-16 xl:gap-32 px-4 sm:px-8 lg:px-12 xl:px-20">
            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-4 mt-4 sm:mt-0 lg:gap-12 xl:gap-24 h-full w-full">
              {/* Avatar Skeleton */}
              <Skeleton className="h-32 w-32 lg:h-64 lg:w-64 rounded-full bg-zinc-800 flex-shrink-0" />

              {/* Info Block Skeleton */}
              <div className="flex flex-col items-center lg:items-start h-full gap-6 w-full max-w-md mt-4 lg:mt-0">
                <div className="flex flex-col items-center lg:items-start w-full space-y-4">
                  <Skeleton className="h-10 w-3/4 rounded-md bg-zinc-800" />
                  <Skeleton className="h-6 w-1/2 rounded-md bg-zinc-800" />
                </div>
                <div className="w-full space-y-3 pt-4">
                  <Skeleton className="h-5 w-full rounded-md bg-zinc-800" />
                  <Skeleton className="h-5 w-5/6 rounded-md bg-zinc-800" />
                </div>
                <Skeleton className="h-24 w-full rounded-xl bg-zinc-800 mt-4" />
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="w-full lg:w-fit grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-4 min-w-40 max-w-2xl">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-zinc-900/60 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full bg-zinc-800" />
                    <Skeleton className="h-8 w-16 rounded-md bg-zinc-800" />
                  </div>
                  <Skeleton className="h-4 w-full rounded-md bg-zinc-800" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Links Grid Skeleton */}
        <div className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 pb-4 border-b border-zinc-800/30">
              <Skeleton className="h-8 w-48 rounded-md bg-zinc-800" />
              <Skeleton className="h-4 w-64 mt-2 rounded-md bg-zinc-800" />
            </div>
            <div className="text-center py-16 text-zinc-500">
              Loading Slams...
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        User not found.
      </div>
    );
  }

  const handleProfileUpdate = (updatedUser: Partial<User>) => {
    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        user: {
          ...prev.user,
          ...updatedUser,
        },
      };
    });
  };

  const { user, publicLinks } = profile;
  // console.log(user?.profileImage?.url, "Profile Image URL");
  console.log("user :", user);

  // Use safeLinks everywhere
  const safeLinks = publicLinks ?? [];
  const stats = {
    totalLinks: safeLinks.length,
    likes: safeLinks.reduce(
      (acc: number, link: LinkItem) => acc + (link.likes?.length || 0),
      0
    ),
    saved: safeLinks.reduce(
      (acc: number, link: LinkItem) => acc + (link.saves?.length || 0),
      0
    ),
  };

  // Add this function to calculate account age
  const getAccountAge = (createdAt: string): string => {
    const creationDate = new Date(createdAt);
    const today = new Date();

    // Calculate difference in milliseconds
    const diffTime = Math.abs(today.getTime() - creationDate.getTime());

    // Convert to days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return diffDays === 1 ? "1 day" : `${diffDays} days`;
    }

    // Calculate months
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return diffMonths === 1 ? "1 month" : `${diffMonths} months`;
    }

    // Calculate years
    const diffYears = Math.floor(diffMonths / 12);
    return diffYears === 1 ? "1 year" : `${diffYears} years`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          user: {
            ...prev.user,
            profileImage: response.profileImage,
          },
        };
      });
    } catch (err) {
      const error = err as Error;
      toast.error("Image upload failed", {
        description: error.message,
      });
    }
  };

  return (
    <div className="dark flex flex-col min-h-screen h-full w-full bg-zinc-900 text-foreground">
      <main className="dark flex-1 overflow-auto bg-zinc-950">
        {/* Profile Header - Enhanced with better gradients and spacing */}
        <div className="dark bg-gradient-to-br from-zinc-900/90 via-black to-zinc-900/90 p-4 md:p-8 border-b border-zinc-800/30 shadow-lg">
          <div className="dark h-full w-full mx-auto flex flex-col lg:flex-row items-center lg:items-start lg:justify-evenly gap-8 lg:gap-16 xl:gap-32 px-4 sm:px-8 lg:px-12 xl:px-20">
            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-4 mt-4 sm:mt-0 lg:gap-12 xl:gap-24 h-full ">
              {/* Avatar */}
              <motion.div
                whileHover={{ rotateX: -5, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >

              <div className="dark relative group lg:mb-8 transform hover:scale-105 transition-all duration-300">
                {/* <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-50 blur-sm group-hover:opacity-100 group-hover:blur transition duration-300"></div> */}
                <Avatar className="dark relative h-32 w-32 lg:h-64 lg:w-64 border-4 border-red-primary">
                  {user?.profileImage?.url ? (
                    <AvatarImage src={user.profileImage.url} alt="Profile" />
                  ) : (
                    <AvatarFallback className="dark bg-gradient-to-br from-red-600 to-red-800 text-white text-3xl font-extrabold">
                      {user?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>

                {currentUser?._id === user._id && (
                  <label
                  htmlFor="avatarUpload"
                  className="dark absolute bottom-1 right-1 h-9 w-9 bg-red-500 hover:bg-red-400 text-white rounded-full shadow-lg group-hover:opacity-100 transition-all duration-300 scale-100 hover:scale-110 flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="dark h-4 w-4" />
                    <input
                      type="file"
                      id="avatarUpload"
                      accept="image/*"
                      name="avatar"
                      onChange={handleImageUpload}
                      className="hidden"
                      />
                  </label>
                )}
              </div>
                </motion.div>

              <div className="dark flex flex-col items-center lg:items-start h-full gap-6">
                {/* Name and Badge */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="gap-4 h-fit flex flex-col sm:flex-row items-center">
                    <h1 className="dark text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                      {user?.name}
                    </h1>
                    {publicLinks?.length > 9 ? (
                      <Badge className="dark bg-gradient-to-r h-fit from-red-500 to-red-600 text-white px-4 py-1 text-sm shadow-lg transform hover:-translate-y-0.5 transition-all">
                        <Star className="dark h-3.5 w-3.5 mr-1.5" />
                        Slam Master
                      </Badge>
                    ) : (
                      <Badge className="dark h-fit bg-zinc-800 text-zinc-300 px-3 py-1 shadow-sm border border-zinc-700/50">
                        <Star className="dark h-3 w-3 mr-1" />
                        Slammer
                      </Badge>
                    )}

                    {currentUser?._id === user._id && (
                      <div className="dark flex w-full sm:w-auto gap-3 mt-2 mb-2 lg:mb-6">
                        <Button
                          onClick={() => setOpen(true)}
                          className="dark w-full sm:w-auto bg-red-primary hover:bg-red-500 hover:cursor-pointer text-white font-medium px-6 py-2.5 rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <Edit3 className="dark h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    )}
                  </div>
                  {/* User metadata with improved icons and spacing */}
                  <div className="dark flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-zinc-400 text-sm mt-2">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800/50">
                      <AtSign className="dark h-3.5 w-3.5 text-red-400" />
                      <span>{user?.username}</span>
                    </div>

                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800/50">
                      <Calendar className="dark h-3.5 w-3.5 text-red-400" />
                      <span>
                        Slammer age:{" "}
                        {user?.createdAt
                          ? getAccountAge(user.createdAt)
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Bio Section */}
                <div className="dark w-full flex flex-col items-start justify-center">
                  <div className="inline-block px-3 py-2 rounded-lg  bg-zinc-900 border border-zinc-800/60 shadow-md">
                    <p className="dark text-zinc-200 text-base  leading-relaxed font-medium">
                      {user?.bio && user.bio.trim().length > 0 ? (
                        user.bio
                      ) : (
                        <span className="text-zinc-500">
                          This user has no bio yet.
                        </span>
                      )}
                    </p>
                  </div>
                  {/* Progress Bar */}
                  {publicLinks.length < 10 && (
                    <div className="mt-4 w-full max-w-sm p-4 bg-zinc-900/60 rounded-xl border border-zinc-800/50 shadow-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-zinc-500 font-medium">
                          Slammer Progress
                        </span>
                        <span className="text-xs font-bold text-red-400">
                          {publicLinks.length}/10
                        </span>
                      </div>
                      <Progress
                        value={(publicLinks.length / 10) * 100}
                        className="h-2.5 bg-zinc-800"
                      />
                      <div className="text-sm text-zinc-400 mt-3 text-center">
                        <span className="font-bold text-red-400">
                          {10 - publicLinks.length}
                        </span>{" "}
                        slams away from becoming a{" "}
                        <span className="text-white font-semibold bg-red-500/20 px-1.5 py-0.5 rounded">
                          Slam Master
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards - Transformed into visually distinct cards */}
            <div className="dark w-full lg:w-fit grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-4 min-w-40 max-w-2xl ">
              {[
                {
                  label: "Slams",
                  value: stats?.totalLinks || 0,
                  icon: LinkIcon,
                },
                {
                  label: "Likes Received",
                  value: stats?.likes || 0,
                  icon: Flame,
                },
                {
                  label: "Saves Received",
                  value: stats?.saved || 0,
                  icon: Bookmark,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center group cursor-default bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/50 rounded-xl p-4 shadow-md transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="p-2 rounded-full bg-red-500/10">
                      <stat.icon className="h-5 w-5 text-red-400 group-hover:text-red-300 transition-colors" />
                    </div>
                    <span className="text-3xl font-extrabold text-white group-hover:text-red-300 transition-colors">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-xs uppercase tracking-wider font-medium text-zinc-500 group-hover:text-zinc-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons - Enhanced with better hover effects */}

            <EditProfileModal
              open={open}
              setOpen={setOpen}
              user={user}
              onProfileUpdate={handleProfileUpdate}
            />
          </div>
        </div>

        {/* Links Grid - Enhanced with better header and container */}
        <div className="dark p-6 md:p-8 bg-zinc-950">
          <div className="dark max-w-7xl mx-auto">
            <div className="dark flex items-center mb-8 pb-4 border-b border-zinc-800/30">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center">
                  <span className="mr-2">Public Slams</span>
                  <span className="text-base bg-red-500/20 text-red-400 rounded-full px-2.5 py-0.5 font-mono">
                    {safeLinks.length}
                  </span>
                </h2>
                <p className="text-zinc-500 text-sm">
                  Links shared with the world
                </p>
              </div>
            </div>

            <Masonry
              breakpointCols={breakpointCols}
              className="dark my-masonry-grid"
              columnClassName="dark my-masonry-grid_column gap-5"
            >
              {safeLinks.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                  <div className="text-zinc-500 text-lg font-medium">
                    No slams yet
                  </div>
                  <div className="text-zinc-600 text-sm mt-2">
                    Links shared will appear here
                  </div>
                </div>
              ) : (
                safeLinks.map((link: LinkItem) => {
                  const isLiked = currentUser?.likedLinks?.includes(link._id);
                  const isSaved = currentUser?.savedLinks?.includes(link._id);
                  const isMine = currentUser?._id === link.userId;

                  return (
                    <LinkCard
                      key={link._id}
                      link={{
                        ...link,
                        _id: link._id,
                        isPrivate: false,
                      }}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      isPublicFeed={true}
                      slammedBy={{
                        id: user?._id || "unknown",
                        username: user?.name || "Unknown User",
                      }}
                      isLiked={isLiked}
                      isSaved={isSaved}
                      isMine={isMine}
                    />
                  );
                })
              )}
            </Masonry>
          </div>
        </div>
      </main>
    </div>
  );
}
