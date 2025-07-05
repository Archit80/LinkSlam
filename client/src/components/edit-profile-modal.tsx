"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// import Image from "next/image"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { authService } from "@/services/authService";
import { toast } from "sonner"

export function EditProfileModal({ open, setOpen, user, onProfileUpdate }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const profileData = {
        name: data.name.trim(),
        username: data.username.trim().toLowerCase(),
        bio: data.bio.trim(),
      };

      const response = await authService.updateProfile(profileData);
      if(response.success){
          console.log("Profile updated response:", response);
          toast.success("Profile updated!");
      }
      else {
            console.error("Profile update failed:", response);
            toast.error("Failed to update profile", {
                description: response.message || "An error occurred while updating your profile.",
            });
      }
       if (onProfileUpdate) {
        onProfileUpdate(response.user); 
      }
      setOpen(false);
    } catch (err) {
      toast.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  }



  return (
    <Dialog open={open} onOpenChange={setOpen} > 
      <DialogContent className="max-w-md dark">
        <DialogHeader className="dark">
          <DialogTitle className="dark text-red-primary font-bold">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 dark text-white">
          {/* Avatar Preview */}

          <Input placeholder="Name" {...register("name")} />
          <Input placeholder="Username" {...register("username")} />
          <Textarea placeholder="Bio" {...register("bio")} />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" className="hover:cursor-pointer" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-red-primary hover:bg-red-500 text-white font-medium hover:cursor-pointer">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
