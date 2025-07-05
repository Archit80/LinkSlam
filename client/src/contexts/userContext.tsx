"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { useRouter, usePathname } from "next/navigation";

export type User = {
  _id: string;
  email: string;
  name: string;
  username: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
  likedLinks: string[];
  savedLinks: string[];
  profileImage: {
    url: string;
  };
  isNewUser: boolean;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  redirectToOnboarding: () => void;
};

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
  const redirectToOnboarding = () => {
    if (!pathname.includes('/auth/onboarding')) {
      router.push('/auth/onboarding');
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, redirectToOnboarding }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
