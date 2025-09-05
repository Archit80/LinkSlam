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
      // If user is new, redirect to onboarding
      if (user.isNewUser) {
        router.push('/auth/onboarding');
        return;
      }
      // Otherwise redirect to my-zone
      router.push("/my-zone");
    }
  }, [router, user, loading]);
}
