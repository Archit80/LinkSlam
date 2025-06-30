"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { authService } from "@/services/authService"

type User = {
  _id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

type UserContextType = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getCurrentUser()
        console.log("Fetched user:", response.data);
        setUser(response.data) // response from /auth/me
      } catch (err) {
        console.error("Error fetching user:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within a UserProvider")
  return context
}
