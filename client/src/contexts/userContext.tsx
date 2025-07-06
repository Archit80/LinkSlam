"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { useRouter, usePathname } from "next/navigation";

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  profileImage?: { url: string; public_id: string };
  likedLinks?: string[];
  savedLinks?: string[];
  createdAt?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getCurrentUser();
        // console.log("Fetched user:", response.data);
        setUser(response.data); // response from /auth/me

        if (response.data?.isNewUser && !pathname.includes('/auth/onboarding')) {
          // console.log("New user detected, redirecting to onboarding...");
          router.push('/auth/onboarding');
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, pathname]);

  // Function to manually redirect to onboarding
  // (removed unused redirectToOnboarding function)

  const value = { user, setUser, loading }; // <-- ADD setUser TO THE CONTEXT VALUE

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
