"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Only redirect if we're not already on the landing page
      if (window.location.pathname !== '/') {
        router.push("/");
      }
    }
  }, [router]);
}

export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Don't redirect while loading user data
    if (loading || !token) return;
    
    if (user) {
      // Redirect immediately based on user status
      if (user.isNewUser) {
        router.replace('/auth/onboarding');
      } else {
        router.replace("/my-zone");
      }
    }
  }, [router, user, loading]);
}
