"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, LinkIcon, Flame, Bookmark, Edit3, Camera, Star, Mail } from "lucide-react"
import Masonry from "react-masonry-css"
import { LinkCard, type LinkItem } from "@/components/public-link-card"
import {useUser} from '../../../contexts/userContext'


export default function ProfilePage({ params }: { params: { userId: string } }) {
    const {user} = useUser();
    
    // const userData = {
    //   _id: user?._id,
    //   name: user?.name,
    //   email: user?.email,
    // }

  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)

  const handleSave = () => {
    setIsEditing(false)
  }

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  }

  return (
    <div className="dark flex dark flex-col min-h-screen h-full w-full bg-background text-foreground">
      <header className="dark flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4">
        <h1 className="dark text-2xl font-bold text-foreground">{user?.name}</h1>
      </header>

      <main className="dark flex-1 overflow-auto">
        {/* Profile Header - Seamless with the rest */}
        <div className="dark bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 border-b border-zinc-800/50">
          <div className="dark max-w-7xl mx-auto">
            <div className="dark flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Left: Avatar & Basic Info */}
              <div className="dark flex items-center gap-6">
                <div className="dark relative group">
                  <Avatar className="dark h-24 w-24 border-3 border-red-400 shadow-lg shadow-red-500/20">
                    {/* <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} /> */}
                    <AvatarFallback className="dark bg-gradient-to-br from-red-500 to-red-600 text-white text-xl font-bold">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="dark absolute -bottom-1 -right-1 h-7 w-7 bg-red-500 hover:bg-red-400 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Camera className="dark h-3 w-3" />
                  </Button>
                </div>
                <div>
                  <div className="dark flex items-center gap-3 mb-1">
                    <h1 className="dark text-3xl font-black text-white">{user?.name}</h1>
                    <Badge className="dark bg-red-500 text-white">
                      <Star className="dark h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                  {/* <p className="text-red-300 text-lg">@{userData.username}</p> */}
                  <div className="dark flex items-center gap-2 text-zinc-400 text-sm mt-1">
                    <Calendar className="dark h-3 w-3" />
                    {/* <span>Joined {user?.joinDate}</span> */}
                  </div>
                </div>
              </div>

              {/* Center: Stats */}
              <div className="dark flex gap-8 lg:flex-1 lg:justify-center">
                {/* {{
                  { label: "Links", value: user?.stats.totalLinks, icon: LinkIcon },
                  { label: "Slams", value: user?.stats.totalSlams, icon: Flame },
                  { label: "Saved", value: user?.stats.savedLinks, icon: Bookmark },
                }.map((stat) => (
                  <div key={stat.label} className="text-center group cursor-default">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <stat.icon className="h-4 w-4 text-red-400 group-hover:text-red-300 transition-colors" />
                      <span className="text-2xl font-black text-red-400 group-hover:text-red-300 transition-colors">
                        {stat.value.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">{stat.label}</span>
                  </div>
                ))} */}
              </div>

              {/* Right: Actions */}
              <div className="dark flex gap-3">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="dark bg-red-500 hover:bg-red-400 text-white shadow-lg hover:shadow-red-500/30 transition-all duration-300"
                >
                  <Edit3 className="dark h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </div>

            {/* Bio & Contact - Integrated naturally */}
            <div className="dark mt-6 max-w-4xl">
              {isEditing ? (
                <div className="dark flex gap-3 items-center">
                  {/* <Input
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-red-500 focus:ring-red-500 flex-1"
                    placeholder="Tell us about yourself..."
                  /> */}
                  <Button onClick={handleSave} className="dark bg-white text-black hover:bg-gray-100">
                    Save
                  </Button>
                </div>
              ) : (
                <div className="dark space-y-3">
                  {/* < className="text-zinc-300 text-lg leading-relaxed">{user?.bio}</p> */}
                  <div className="dark flex items-center gap-3 text-zinc-400">
                    <Mail className="dark h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Links Grid - Flows naturally from profile */}
        <div className="dark p-6">
          <div className="dark max-w-7xl mx-auto">
            <div className="dark mb-6">
              <h2 className="text-xl font-bold text-red-400 mb-2">Public Links ({user?.length})</h2>
              <div className="dark w-16 h-0.5 bg-red-500 rounded-full"></div>
            </div>

            <Masonry
              breakpointCols={breakpointCols}
              className="dark my-masonry-grid"
              columnClassName="dark my-masonry-grid_column"
            >
              {/* {userPublicLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  isPublicFeed={true}
                  slammedBy={{ id: user?.id, username: user?.username }}
                />
              ))} */}
            </Masonry>
          </div>
        </div>
      </main>
    </div>
  )
}
